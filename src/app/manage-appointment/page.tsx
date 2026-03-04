"use client";

import { useState, useMemo, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useDoc } from "@/firebase";
import { collection, query, where, doc, getDoc, DocumentData } from "firebase/firestore";
import { Search, Calendar as CalendarIcon, XCircle, Loader2, CheckCircle2, AlertCircle, Lock, ShieldCheck, User, Clock, Edit3, ChevronRight, ArrowRight, ShieldAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format, isWeekend, startOfToday, setHours, setMinutes, isBefore, addHours, differenceInHours } from "date-fns";
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

  // Cancellation OTP States
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isSmsSending, setIsSmsSending] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  // Reschedule States
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  // Lawyer State
  const [assignedLawyer, setAssignedLawyer] = useState<DocumentData | null>(null);

  const appointmentQuery = useMemoFirebase(() => {
    if (!db || !refCode || !searchTriggered) return null;
    return query(collection(db, "appointments"), where("referenceCode", "==", refCode.trim().toUpperCase()));
  }, [db, refCode, searchTriggered]);

  const { data: results, isLoading } = useCollection(appointmentQuery);
  const appointment = results?.[0];

  // Fetch lawyer info if assigned
  useEffect(() => {
    async function fetchLawyer() {
      if (appointment?.lawyerId && db) {
        const lawyerRef = doc(db, "roleLawyer", appointment.lawyerId);
        const snap = await getDoc(lawyerRef);
        if (snap.exists()) setAssignedLawyer(snap.data());
      } else {
        setAssignedLawyer(null);
      }
    }
    fetchLawyer();
  }, [appointment, db]);

  // Reschedule Availability Queries
  const rescheduleDateStr = rescheduleDate ? format(rescheduleDate, "yyyy-MM-dd") : null;
  const existingApptsQuery = useMemoFirebase(() => {
    if (!db || !rescheduleDateStr) return null;
    return query(collection(db, "appointments"), where("dateString", "==", rescheduleDateStr));
  }, [db, rescheduleDateStr]);
  const { data: existingAppts } = useCollection(existingApptsQuery);

  const timeSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    for (let h = 8; h <= 16; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 12) continue; // Lunch
        if (h === 16 && m > 30) continue;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        const timeString = `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
        const slotDate = rescheduleDate ? setMinutes(setHours(new Date(rescheduleDate), h), m) : null;
        const isPast = slotDate ? isBefore(slotDate, now) : false;
        const isBooked = existingAppts?.some(a => a.time === timeString && a.status !== 'cancelled');
        slots.push({ time: timeString, isBooked, isPast });
      }
    }
    return slots;
  }, [rescheduleDate, existingAppts]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (refCode.trim()) setSearchTriggered(true);
  };

  const checkCutoff = () => {
    if (!appointment) return false;
    const apptDate = new Date(appointment.date);
    const diff = differenceInHours(apptDate, new Date());
    return diff > 24;
  };

  const initiateCancellation = async () => {
    if (!appointment) return;
    if (!checkCutoff()) {
      toast({ 
        variant: "destructive", 
        title: "Policy Restriction", 
        description: "Appointments can only be cancelled at least 24 hours in advance." 
      });
      return;
    }
    setIsSmsSending(true);
    try {
      const mobileToUse = appointment.guestMobile || appointment.clientMobile;
      if (!mobileToUse) {
        toast({ variant: "destructive", title: "Missing Mobile", description: "No mobile number found for verification." });
        return;
      }
      const result = await sendOtpSms(mobileToUse);
      if (result.success) {
        setGeneratedOtp(result.code);
        setIsOtpOpen(true);
        toast({ title: "Mock SMS Received", description: result.message });
      }
    } catch (e) {
      toast({ variant: "destructive", title: "SMS Service Unavailable", description: "Please try again later." });
    } finally {
      setIsSmsSending(false);
    }
  };

  const handleVerifyAndCancel = () => {
    if (otpValue !== generatedOtp) {
      toast({ variant: "destructive", title: "Incorrect Code", description: "Verification failed." });
      return;
    }
    if (!db || !appointment) return;
    setIsCancelling(true);
    const apptRef = doc(db, "appointments", appointment.id);
    updateDocumentNonBlocking(apptRef, { status: "cancelled" });
    setTimeout(() => {
      setIsCancelling(false);
      setIsOtpOpen(false);
      toast({ title: "Success", description: "Your visit has been cancelled. The time slot is now available." });
    }, 1000);
  };

  const handleReschedule = () => {
    if (!db || !appointment || !rescheduleDate || !rescheduleTime) return;
    setIsRescheduling(true);
    const apptRef = doc(db, "appointments", appointment.id);
    updateDocumentNonBlocking(apptRef, {
      date: rescheduleDate.toISOString(),
      dateString: format(rescheduleDate, "yyyy-MM-dd"),
      time: rescheduleTime,
      status: "rescheduled"
    });
    setTimeout(() => {
      setIsRescheduling(false);
      setIsRescheduleOpen(false);
      toast({ title: "Reschedule Confirmed", description: "Your appointment has been successfully updated." });
    }, 1000);
  };

  return (
    <DashboardLayout role={null}>
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-2">
            <CalendarIcon className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Client Appointment Manager</h1>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">Verify your status, reschedule, or cancel your visit using your unique reference code.</p>
        </div>

        <Card className="border-none shadow-xl bg-white/90 backdrop-blur-md rounded-[2.5rem]">
          <CardContent className="p-10">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary/30" />
                <Input 
                  placeholder="Enter Code (e.g., PAO-123456)" 
                  value={refCode}
                  onChange={(e) => {
                    setRefCode(e.target.value);
                    setSearchTriggered(false);
                  }}
                  className="h-14 pl-12 rounded-2xl border-primary/20 text-lg font-black tracking-widest placeholder:tracking-normal placeholder:font-medium text-center uppercase"
                />
              </div>
              <Button type="submit" size="lg" className="h-14 rounded-2xl bg-primary px-10 font-black shadow-lg hover:scale-105 transition-all">
                {isLoading ? <Loader2 className="animate-spin" /> : "Verify Booking"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {searchTriggered && !isLoading && !appointment && (
          <div className="text-center p-16 bg-white/40 rounded-[3rem] border-2 border-dashed border-primary/10 animate-in fade-in zoom-in-95">
            <ShieldAlert className="h-16 w-16 text-primary/10 mx-auto mb-4" />
            <h3 className="text-2xl font-black text-primary">Reference Not Found</h3>
            <p className="text-muted-foreground font-medium">Please verify the code provided during your initial booking.</p>
          </div>
        )}

        {appointment && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-6 duration-700">
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-none shadow-2xl bg-white rounded-[3rem] overflow-hidden">
                <div className="bg-primary p-10 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Filing Reference</p>
                    <h3 className="text-4xl font-black tracking-tighter">{appointment.referenceCode}</h3>
                  </div>
                  <Badge className={cn(
                    "px-6 py-3 rounded-full font-black uppercase text-[10px] shadow-lg",
                    appointment.status === 'pending' ? 'bg-amber-400 text-amber-900' : 
                    appointment.status === 'scheduled' || appointment.status === 'rescheduled' ? 'bg-green-400 text-green-900' : 
                    appointment.status === 'completed' ? 'bg-blue-400 text-blue-900' : 'bg-red-400 text-red-900'
                  )}>
                    {appointment.status}
                  </Badge>
                </div>
                <CardContent className="p-10 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-1">
                        <CalendarIcon className="h-4 w-4" /> Visit Schedule
                      </div>
                      <p className="text-xl font-black text-[#1A3B6B]">
                        {format(new Date(appointment.date), "PPPP")}
                      </p>
                      <div className="flex items-center gap-2 text-primary/60 font-bold">
                        <Clock className="h-4 w-4" /> {appointment.time}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest mb-1">
                        <CheckCircle2 className="h-4 w-4" /> Legal Case
                      </div>
                      <p className="text-xl font-black text-[#1A3B6B]">{appointment.caseType}</p>
                      <Badge variant="outline" className="border-primary/20 text-[10px] font-bold text-primary px-3">
                        {appointment.serviceType || appointment.purpose}
                      </Badge>
                    </div>
                  </div>

                  {appointment.status === 'completed' && (
                    <div className="p-8 bg-blue-50 rounded-[2.5rem] border border-blue-100 flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-2xl text-blue-700">
                        <CheckCircle2 className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-black text-blue-900 uppercase tracking-widest">Visit Concluded</h4>
                        <p className="text-sm text-blue-800 font-medium leading-relaxed">
                          This legal consultation has been marked as completed by the office and is now archived for your record. It can no longer be rescheduled or cancelled.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex items-start gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <ShieldCheck className="h-6 w-6 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xs font-black text-primary uppercase tracking-widest">Arrival Instructions</h4>
                      <p className="text-sm text-[#2E5A99] font-medium leading-relaxed">
                        Please arrive 15 minutes before your time slot. Present this reference code and your valid ID. Failure to attend within 20 minutes of your time will result in automatic cancellation.
                      </p>
                    </div>
                  </div>

                  {appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                    <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-primary/5">
                      <Button 
                        onClick={() => {
                          setRescheduleDate(new Date(appointment.date));
                          setIsRescheduleOpen(true);
                        }}
                        className="flex-1 h-16 bg-[#F0F4F8] hover:bg-primary/5 text-primary font-black text-lg rounded-2xl border-2 border-primary/10 shadow-sm"
                      >
                        <Edit3 className="mr-2 h-5 w-5" /> Reschedule Visit
                      </Button>
                      <Button 
                        variant="outline" 
                        disabled={isSmsSending}
                        className="flex-1 h-16 border-red-100 text-red-600 hover:bg-red-50 rounded-2xl font-black text-lg"
                        onClick={initiateCancellation}
                      >
                        {isSmsSending ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : <XCircle className="mr-2 h-6 w-6" />}
                        Cancel Appointment
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="border-none shadow-xl bg-primary text-white rounded-[3rem] overflow-hidden">
                <CardHeader className="p-8 bg-white/10 border-b border-white/5">
                  <CardTitle className="text-sm font-black uppercase tracking-widest">Lawyer Registry</CardTitle>
                </CardHeader>
                <CardContent className="p-10 space-y-6">
                  {assignedLawyer ? (
                    <div className="space-y-6 text-center">
                      <div className="flex justify-center">
                        <div className="h-24 w-24 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center shadow-inner relative">
                          <User className="h-12 w-12 text-white" />
                          <div className="absolute -bottom-1 -right-1 p-1.5 bg-green-500 rounded-full border-4 border-primary">
                            <CheckCircle2 className="h-3 w-3 text-white" />
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="text-2xl font-black tracking-tight leading-tight">
                          {assignedLawyer.firstName ? `Atty. ${assignedLawyer.firstName} ${assignedLawyer.lastName}` : assignedLawyer.email.split('@')[0]}
                        </p>
                        <p className="text-[10px] font-black uppercase text-white/60 tracking-widest mt-2">Authorized Public Attorney</p>
                      </div>
                      <div className="pt-4 border-t border-white/10 text-xs font-bold text-white/80 space-y-3">
                        <p className="flex items-center justify-center gap-2"><Clock className="h-3 w-3" /> Office Hours: 8 AM - 5 PM</p>
                        <Badge className="bg-green-500/20 text-green-300 border-none text-[9px] uppercase font-black px-3 py-1">Identity Verified</Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 space-y-4">
                      <div className="h-16 w-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                        <Loader2 className="h-8 w-8 text-white/20 animate-spin" />
                      </div>
                      <p className="text-xs font-bold text-white/60 leading-relaxed italic px-4">
                        Your Case is currently in the Triage Queue. A lawyer will be assigned upon system approval.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl bg-amber-50 rounded-[3rem] p-8 space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest leading-none">Office Policy</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <p className="text-xs text-amber-800/80 font-bold leading-relaxed">Cancellations must occur 24h prior.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <p className="text-xs text-amber-800/80 font-bold leading-relaxed">One active booking per citizen.</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <p className="text-xs text-amber-800/80 font-bold leading-relaxed">Identity verification required for all changes.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        <Dialog open={isOtpOpen} onOpenChange={setIsOtpOpen}>
          <DialogContent className="rounded-[3rem] max-w-md p-10">
            <DialogHeader className="space-y-6">
              <div className="flex justify-center">
                <div className="p-4 bg-red-50 text-red-600 rounded-full shadow-inner">
                  <Lock className="h-10 w-10" />
                </div>
              </div>
              <DialogTitle className="text-3xl font-black text-center text-primary">Authorize Action</DialogTitle>
              <DialogDescription className="text-center font-bold text-muted-foreground leading-relaxed">
                Enter the 6-digit verification code sent to your mobile to finalize your cancellation.
              </DialogDescription>
            </DialogHeader>
            <div className="py-8 space-y-6">
              <Input 
                className="h-20 text-center text-5xl font-black tracking-[0.5em] rounded-3xl border-primary/20 bg-primary/5"
                maxLength={6}
                placeholder="000000"
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value)}
              />
              <div className="text-center">
                <Button variant="link" size="sm" className="text-xs font-black text-muted-foreground uppercase tracking-widest" onClick={initiateCancellation} disabled={isSmsSending}>
                  {isSmsSending ? "Processing..." : "Resend Code"}
                </Button>
              </div>
            </div>
            <DialogFooter className="flex gap-4">
              <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => setIsOtpOpen(false)}>Back</Button>
              <Button 
                className="flex-1 h-14 rounded-2xl font-black bg-red-600 hover:bg-red-700 text-white shadow-xl"
                disabled={isCancelling || otpValue.length < 6}
                onClick={handleVerifyAndCancel}
              >
                {isCancelling ? <Loader2 className="animate-spin h-6 w-6" /> : "Authorize Cancel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-10 overflow-hidden">
            <DialogHeader className="pb-4">
              <DialogTitle className="text-3xl font-black text-primary font-headline">Reschedule Visit</DialogTitle>
              <DialogDescription className="font-bold">Select a new date and time from the available office schedule.</DialogDescription>
            </DialogHeader>
            <div className="grid lg:grid-cols-2 gap-10 py-4">
              <div className="space-y-4">
                <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10">
                  <Calendar
                    mode="single"
                    selected={rescheduleDate}
                    onSelect={(date) => {
                      if (date && (isWeekend(date) || isHoliday(date) || isBefore(date, startOfToday()))) return;
                      setRescheduleDate(date);
                      setRescheduleTime("");
                    }}
                    disabled={[
                      { before: startOfToday() },
                      { dayOfWeek: [0, 6] },
                      (date) => isHoliday(date)
                    ]}
                    className="w-full rounded-md border-none"
                  />
                </div>
              </div>
              <div className="space-y-6 flex flex-col">
                <div className="flex-1">
                  <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest mb-4">Availability for {rescheduleDate ? format(rescheduleDate, "MMM dd, yyyy") : "..."}</p>
                  {!rescheduleDate ? (
                    <div className="h-full min-h-[250px] flex flex-col items-center justify-center bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/10 text-muted-foreground/40">
                      <Clock className="h-12 w-12 mb-2" />
                      <p className="text-xs font-black uppercase">Pick a Date</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto p-1 scrollbar-hide">
                      {timeSlots.map(slot => (
                        <Button
                          key={slot.time}
                          disabled={slot.isBooked || slot.isPast}
                          variant={rescheduleTime === slot.time ? "default" : "outline"}
                          className={cn(
                            "h-12 rounded-xl font-bold transition-all border-2",
                            rescheduleTime === slot.time 
                              ? "bg-yellow-400 text-black border-yellow-500 shadow-md scale-105" 
                              : slot.isBooked || slot.isPast
                              ? "bg-red-500 text-white border-red-600 opacity-80 cursor-not-allowed" 
                              : "bg-green-500 text-white border-green-600 shadow-sm"
                          )}
                          onClick={() => setRescheduleTime(slot.time)}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="pt-6 border-t border-primary/10 flex gap-3">
                  <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold" onClick={() => setIsRescheduleOpen(false)}>Cancel</Button>
                  <Button 
                    className="flex-1 h-14 rounded-2xl font-black bg-primary text-white shadow-xl"
                    disabled={!rescheduleDate || !rescheduleTime || isRescheduling}
                    onClick={handleReschedule}
                  >
                    {isRescheduling ? <Loader2 className="animate-spin h-6 w-6" /> : "Update Schedule"}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
