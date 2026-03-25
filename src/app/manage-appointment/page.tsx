
"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { Search, Calendar as CalendarIcon, Loader2, User, Clock, ShieldCheck, AlertCircle, Lock, ShieldAlert, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, startOfToday, setHours, setMinutes, isBefore, addHours, getDay } from "date-fns";
import { cn } from "@/lib/utils";
import { sendOtpSms } from "@/ai/flows/sms-service";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

const HOLIDAYS = [
  "2024-01-01", "2024-04-09", "2024-05-01", "2024-06-12", "2024-08-26",
  "2024-11-01", "2024-11-30", "2024-12-25", "2024-12-30", 
  "2025-01-01", "2025-02-25", "2025-04-17", "2025-04-18", "2025-05-01"
];

const isHoliday = (date: Date) => {
  const ds = format(date, "yyyy-MM-dd");
  return HOLIDAYS.includes(ds);
};

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
      if (!mobileToUse) {
        toast({ variant: "destructive", title: "Missing Mobile", description: "No contact number found for this record." });
        return;
      }
      const result = await sendOtpSms(mobileToUse);
      if (result.success) {
        setGeneratedOtp(result.code);
        setIsOtpOpen(true);
        toast({ title: "Mock SMS Received", description: result.message });
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
    updateDocumentNonBlocking(doc(db, "appointments", appointment.id), { 
      status: "cancelled", 
      cancellationReason: "Cancelled via public portal",
      updatedAt: new Date().toISOString() 
    });

    const clientName = appointment.guestName || appointment.clientName || "Citizen";
    const auditId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", auditId), {
      id: auditId,
      type: "appointment",
      userRole: "guest",
      description: `Office Update: Visit ${appointment.referenceCode} for ${clientName} was cancelled via public portal.`,
      referenceId: appointment.id,
      referenceCode: appointment.referenceCode,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });

    setTimeout(() => { 
      setIsCancelling(false); 
      setIsOtpOpen(false); 
      toast({ title: "Success", description: "Visit cancelled." }); 
    }, 1000);
  };

  const dateStr = rescheduleDate ? format(rescheduleDate, "yyyy-MM-dd") : null;
  const existingApptsQuery = useMemoFirebase(() => {
    if (!db || !dateStr) return null;
    return query(collection(db, "appointments"), where("dateString", "==", dateStr));
  }, [db, dateStr]);
  const { data: dayAppts } = useCollection(existingApptsQuery);

  const timeSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    // Office Hours: 7 AM - 6 PM (Mon-Thu)
    for (let h = 7; h <= 17; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 12) continue; 
        if (h === 17 && m > 30) continue; 
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        const timeString = `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
        const slotDate = rescheduleDate ? setMinutes(setHours(new Date(rescheduleDate), h), m) : null;
        
        // One-hour leeway rule
        const isPast = slotDate ? isBefore(slotDate, addHours(now, 1)) : false;
        const isBooked = dayAppts?.some(a => a.time === timeString && a.status !== 'cancelled');
        slots.push({ time: timeString, isBooked, isPast });
      }
    }
    return slots;
  }, [rescheduleDate, dayAppts]);

  const handleReschedule = () => {
    if (!db || !appointment || !rescheduleDate || !rescheduleTime) return;
    setIsRescheduling(true);
    updateDocumentNonBlocking(doc(db, "appointments", appointment.id), { 
      date: rescheduleDate.toISOString(), 
      dateString: format(rescheduleDate, "yyyy-MM-dd"), 
      time: rescheduleTime, 
      status: "rescheduled",
      updatedAt: new Date().toISOString() 
    });

    const clientName = appointment.guestName || appointment.clientName || "Citizen";
    const auditId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", auditId), {
      id: auditId,
      type: "appointment",
      userRole: "guest",
      description: `Office Update: Visit ${appointment.referenceCode} for ${clientName} rescheduled to ${format(rescheduleDate, "MMM dd")} @ ${rescheduleTime} via public portal.`,
      referenceId: appointment.id,
      referenceCode: appointment.referenceCode,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });

    setTimeout(() => { 
      setIsRescheduling(false); 
      setIsRescheduleOpen(false); 
      toast({ title: "Success", description: "Schedule updated." }); 
    }, 1000);
  };

  return (
    <DashboardLayout role={null}>
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-2"><CalendarIcon className="h-10 w-10 text-primary" /></div>
          <h1 className="text-3xl font-black text-primary">Visit Management</h1>
        </div>
        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-md rounded-[2.5rem]">
          <CardContent className="p-10">
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input 
                placeholder="Enter Code (e.g., PAO-123456)" 
                value={refCode} 
                onChange={e => setRefCode(e.target.value)} 
                className="h-14 text-center text-lg font-black uppercase" 
              />
              <Button type="submit" size="lg" className="h-14 bg-primary px-10 font-black shadow-lg">Verify Intake</Button>
            </form>
          </CardContent>
        </Card>

        {isLoading && <div className="flex justify-center py-12"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>}

        {appointment && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-6">
            <Card className="md:col-span-2 border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden">
              <div className="bg-primary p-10 text-white flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black uppercase opacity-60">Filing Ref</p>
                  <h3 className="text-4xl font-black">{appointment.referenceCode}</h3>
                </div>
                <Badge className="bg-amber-400 text-amber-900 px-6 py-3 rounded-full font-black uppercase text-[10px]">{appointment.status}</Badge>
              </div>
              <CardContent className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-10">
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary/40 mb-1">Schedule</p>
                    <p className="text-xl font-black text-[#1A3B6B]">{format(new Date(appointment.date), "PPPP")} @ {appointment.time}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-primary/40 mb-1">Matter</p>
                    <p className="text-xl font-black text-[#1A3B6B]">{appointment.caseType}</p>
                  </div>
                </div>
                <div className="flex gap-4 pt-4 border-t border-primary/5">
                  <Button onClick={() => setIsRescheduleOpen(true)} className="flex-1 h-16 bg-[#F0F4F8] text-primary font-black text-lg rounded-2xl">Reschedule</Button>
                  <Button variant="outline" className="flex-1 h-16 text-red-600 border-red-100 rounded-2xl font-black text-lg" onClick={initiateCancellation}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl bg-primary/5 rounded-[3rem] p-8 flex flex-col justify-center text-center space-y-4">
              <User className="h-12 w-12 text-primary/20 mx-auto" />
              <div>
                <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Registrant</p>
                <p className="font-black text-primary text-xl">{appointment.guestName || appointment.clientName}</p>
              </div>
            </Card>
          </div>
        )}

        <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
          <DialogContent className="rounded-[3rem] max-w-md p-10">
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-black">Authorize Cancellation</DialogTitle>
              <DialogDescription className="font-bold">Enter code sent to registered mobile.</DialogDescription>
            </DialogHeader>
            <div className="py-8">
              <Input 
                className="h-20 text-center text-5xl font-black tracking-[0.5em] bg-primary/5" 
                maxLength={6} 
                value={otpValue} 
                onChange={e => setOtpValue(e.target.value)} 
              />
            </div>
            <DialogFooter className="flex gap-4">
              <Button variant="outline" className="flex-1 h-14 rounded-2xl" onClick={() => setIsOtpOpen(false)}>Back</Button>
              <Button className="flex-1 h-14 bg-red-600 text-white font-black rounded-2xl shadow-xl" disabled={isCancelling || otpValue.length < 6} onClick={handleVerifyAndCancel}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-primary text-white">
              <DialogTitle className="text-3xl font-black">Reschedule Visit</DialogTitle>
            </DialogHeader>
            <div className="p-10 grid md:grid-cols-2 gap-12">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-primary/40">1. New Date</Label>
                <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10 overflow-hidden">
                  <Calendar
                    mode="single"
                    selected={rescheduleDate}
                    onSelect={(d) => { 
                      if (d && (getDay(d) === 0 || getDay(d) === 5 || getDay(d) === 6 || isHoliday(d) || isBefore(d, startOfToday()))) return; 
                      setRescheduleDate(d); 
                      setRescheduleTime(""); 
                    }}
                    disabled={[{ before: startOfToday() }, { dayOfWeek: [0, 5, 6] }, (date) => isHoliday(date)]}
                    className="mx-auto"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <Label className="text-[10px] font-black uppercase text-primary/40">2. Available Slots</Label>
                {!rescheduleDate ? (
                  <div className="h-[300px] flex items-center justify-center bg-muted/20 rounded-[2rem] border-2 border-dashed font-bold text-muted-foreground/40">Pick a date first</div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1 border border-primary/5 rounded-3xl bg-primary/[0.02] p-4">
                    {timeSlots.map(slot => (
                      <Button
                        key={slot.time}
                        disabled={slot.isBooked || slot.isPast}
                        variant={rescheduleTime === slot.time ? "default" : "outline"}
                        className={cn("h-11 rounded-xl font-bold transition-all border-2", rescheduleTime === slot.time ? "bg-primary text-white border-primary" : "bg-white text-primary border-primary/10")}
                        onClick={() => setRescheduleTime(slot.time)}
                      >
                        {slot.time}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 gap-3">
              <Button variant="outline" onClick={() => setIsRescheduleOpen(false)} className="flex-1 h-14 rounded-xl font-bold">Cancel</Button>
              <Button onClick={handleReschedule} disabled={!rescheduleDate || !rescheduleTime || isRescheduling} className="flex-1 h-14 bg-primary text-white font-black rounded-xl shadow-xl">
                {isRescheduling ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : "Update Visit"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
