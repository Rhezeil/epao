
"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useDoc, setDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc, getDoc, DocumentData } from "firebase/firestore";
import { Search, Calendar as CalendarIcon, XCircle, Loader2, CheckCircle2, AlertCircle, Lock, ShieldCheck, User, Clock, Edit3, ChevronRight, ArrowRight, ShieldAlert, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, isWeekend, startOfToday, setHours, setMinutes, isBefore, differenceInHours } from "date-fns";
import { cn } from "@/lib/utils";
import { sendOtpSms } from "@/ai/flows/sms-service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

export default function ManageAppointmentPage() {
  const [refCode, setRefCode] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isSmsSending, setIsSmsSending] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  const appointmentQuery = useMemoFirebase(() => {
    if (!db || !refCode || !searchTriggered) return null;
    return query(collection(db, "appointments"), where("referenceCode", "==", refCode.trim().toUpperCase()));
  }, [db, refCode, searchTriggered]);

  const { data: results, isLoading } = useCollection(appointmentQuery);
  const appointment = results?.[0];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (refCode.trim()) setSearchTriggered(true);
  };

  const initiateCancellation = async () => {
    if (!appointment) return;
    setIsSmsSending(true);
    try {
      const mobileToUse = appointment.guestMobile || appointment.clientMobile;
      const result = await sendOtpSms(mobileToUse);
      if (result.success) {
        setGeneratedOtp(result.code);
        setIsOtpOpen(true);
        toast({ title: "Verification Code Sent", description: result.message });
      }
    } finally {
      setIsSmsSending(false);
    }
  };

  const handleVerifyAndCancel = () => {
    if (otpValue !== generatedOtp) {
      toast({ variant: "destructive", title: "Incorrect Code" });
      return;
    }
    if (!db || !appointment) return;
    setIsCancelling(true);
    updateDocumentNonBlocking(doc(db, "appointments", appointment.id), { status: "cancelled", updatedAt: new Date().toISOString() });

    const clientName = appointment.guestName || appointment.clientName || "Citizen";
    const auditId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", auditId), {
      id: auditId,
      type: "appointment",
      userRole: "guest",
      description: `Visit ${appointment.referenceCode} for ${clientName} was cancelled via public portal.`,
      referenceId: appointment.id,
      referenceCode: appointment.referenceCode,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });

    setTimeout(() => { setIsCancelling(false); setIsOtpOpen(false); toast({ title: "Success", description: "Visit cancelled." }); }, 1000);
  };

  const handleReschedule = () => {
    if (!db || !appointment || !rescheduleDate || !rescheduleTime) return;
    setIsRescheduling(true);
    updateDocumentNonBlocking(doc(db, "appointments", appointment.id), { date: rescheduleDate.toISOString(), dateString: format(rescheduleDate, "yyyy-MM-dd"), time: rescheduleTime, updatedAt: new Date().toISOString() });

    const clientName = appointment.guestName || appointment.clientName || "Citizen";
    const auditId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", auditId), {
      id: auditId,
      type: "appointment",
      userRole: "guest",
      description: `Visit ${appointment.referenceCode} for ${clientName} rescheduled to ${format(rescheduleDate, "MMM dd")} @ ${rescheduleTime} via public portal.`,
      referenceId: appointment.id,
      referenceCode: appointment.referenceCode,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });

    setTimeout(() => { setIsRescheduling(false); setIsRescheduleOpen(false); toast({ title: "Success", description: "Schedule updated." }); }, 1000);
  };

  return (
    <DashboardLayout role={null}>
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <div className="text-center space-y-2"><div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-2"><CalendarIcon className="h-10 w-10 text-primary" /></div><h1 className="text-3xl font-black text-primary">Visit Management</h1></div>
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-md rounded-[2.5rem]"><CardContent className="p-10"><form onSubmit={handleSearch} className="flex gap-4"><Input placeholder="Enter Code (e.g., PAO-123456)" value={refCode} onChange={e => setRefCode(e.target.value)} className="h-14 text-center text-lg font-black uppercase" /><Button type="submit" size="lg" className="h-14 bg-primary px-10 font-black shadow-lg">Verify Intake</Button></form></CardContent></Card>

        {appointment && (
          <div className="grid grid-cols-3 gap-6 animate-in slide-in-from-bottom-6">
            <Card className="col-span-2 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden">
              <div className="bg-primary p-10 text-white flex justify-between items-center"><div><p className="text-[10px] font-black uppercase opacity-60">Filing Ref</p><h3 className="text-4xl font-black">{appointment.referenceCode}</h3></div><Badge className="bg-amber-400 text-amber-900 px-6 py-3 rounded-full font-black uppercase text-[10px]">{appointment.status}</Badge></div>
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-10"><div><p className="text-[10px] font-black uppercase text-primary/40 mb-1">Schedule</p><p className="text-xl font-black text-[#1A3B6B]">{format(new Date(appointment.date), "PPPP")} @ {appointment.time}</p></div><div><p className="text-[10px] font-black uppercase text-primary/40 mb-1">Matter</p><p className="text-xl font-black text-[#1A3B6B]">{appointment.caseType}</p></div></div>
                <div className="flex gap-4 pt-4 border-t border-primary/5"><Button onClick={() => setIsRescheduleOpen(true)} className="flex-1 h-16 bg-[#F0F4F8] text-primary font-black text-lg rounded-2xl">Reschedule</Button><Button variant="outline" className="flex-1 h-16 text-red-600 border-red-100 rounded-2xl font-black text-lg" onClick={initiateCancellation}>Cancel</Button></div>
              </CardContent>
            </Card>
          </div>
        )}

        <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
          <DialogContent className="rounded-[3rem] max-w-md p-10">
            <DialogHeader className="text-center"><DialogTitle className="text-2xl font-black">Authorize Cancellation</DialogTitle><DialogDescription className="font-bold">Enter code sent to registered mobile.</DialogDescription></DialogHeader>
            <div className="py-8"><Input className="h-20 text-center text-5xl font-black tracking-[0.5em] bg-primary/5" maxLength={6} value={otpValue} onChange={e => setOtpValue(e.target.value)} /></div>
            <DialogFooter className="flex gap-4"><Button variant="outline" className="flex-1 h-14 rounded-2xl" onClick={() => setIsOtpOpen(false)}>Back</Button><Button className="flex-1 h-14 bg-red-600 text-white font-black rounded-2xl shadow-xl" disabled={isCancelling || otpValue.length < 6} onClick={handleVerifyAndCancel}>Confirm</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
