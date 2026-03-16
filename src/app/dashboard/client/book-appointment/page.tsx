
"use client";

import { useState, Suspense, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Clock, 
  CheckCircle, 
  Loader2, 
  Calendar, 
  ArrowRight, 
  ChevronLeft, 
  Lock, 
  ShieldCheck, 
  User, 
  Phone, 
  MapPin,
  AlertCircle
} from "lucide-react";
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { doc, collection, query, where, onSnapshot } from "firebase/firestore";
import { format, isWeekend, startOfToday, setHours, setMinutes, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { sendOtpSms } from "@/ai/flows/sms-service";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

const HOLIDAYS = [
  "2024-01-01", "2024-04-09", "2024-05-01", "2024-06-12", "2024-08-26",
  "2024-11-01", "2024-11-30", "2024-12-25", "2024-12-30", 
  "2025-01-01", "2025-02-25", "2025-04-17", "2025-04-18", "2025-05-01"
];

const isHoliday = (date: Date) => {
  const ds = format(date, "yyyy-MM-dd");
  return HOLIDAYS.includes(ds);
};

function BookAppointmentContent() {
  const { role, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const db = useFirestore();
  const { toast } = useToast();

  const [assignedLawyer, setAssignedLawyer] = useState<any>(null);

  // Fetch client profile for registered data
  const profileDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "profile");
  }, [db, user]);
  const { data: profile } = useDoc(profileDocRef);

  // Fetch client case to find the assigned lawyer
  const casesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(collection(db, "cases"), where("clientId", "==", user.uid));
  }, [db, user]);
  const { data: cases } = useCollection(casesQuery);
  const activeCase = cases?.[0];

  useEffect(() => {
    let unsub = () => {};
    if (activeCase?.lawyerId && db) {
      unsub = onSnapshot(doc(db, "roleLawyer", activeCase.lawyerId), (snap) => {
        if (snap.exists()) setAssignedLawyer(snap.data());
      });
    }
    return () => unsub();
  }, [activeCase, db]);
  
  const caseTypeParam = searchParams.get("caseType") || "Follow-up Consultation";
  const categoryParam = searchParams.get("category") || "General";

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedRef, setBookedRef] = useState<string | null>(null);

  // OTP State
  const [otpValue, setOtpValue] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isSmsSending, setIsSmsSending] = useState(false);

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const existingApptsQuery = useMemoFirebase(() => {
    if (!db || !dateStr) return null;
    return query(collection(db, "appointments"), where("dateString", "==", dateStr));
  }, [db, dateStr]);

  const { data: existingAppts } = useCollection(existingApptsQuery);

  const timeSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    for (let h = 8; h <= 16; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 12) continue;
        if (h === 16 && m > 30) continue;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        const timeString = `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
        const slotDate = selectedDate ? setMinutes(setHours(new Date(selectedDate), h), m) : null;
        const isPast = slotDate ? isBefore(slotDate, now) : false;
        const isLawyerAssignedToThisSlot = existingAppts?.some(a => a.time === timeString && a.status !== 'cancelled' && a.lawyerId === activeCase?.lawyerId);
        slots.push({ time: timeString, isBooked: isLawyerAssignedToThisSlot, isPast });
      }
    }
    return slots;
  }, [selectedDate, existingAppts, activeCase?.lawyerId]);

  const handleTriggerOtp = async () => {
    const mobile = profile?.phoneNumber || user?.email?.split('@')[0];
    if (!mobile || !/^\d{10,11}$/.test(mobile)) {
      toast({ variant: "destructive", title: "Registration Incomplete", description: "Your registered mobile number is invalid. Please update your profile." });
      return;
    }

    setIsSmsSending(true);
    try {
      const result = await sendOtpSms(mobile);
      if (result.success) {
        setGeneratedOtp(result.code);
        setStep(3);
        toast({ title: "Verification Code Sent", description: result.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "SMS Service Error", description: "Could not send verification code." });
    } finally {
      setIsSmsSending(false);
    }
  };

  const handleBooking = async () => {
    if (otpValue !== generatedOtp) {
      toast({ variant: "destructive", title: "Invalid Code", description: "The verification code you entered is incorrect." });
      return;
    }

    if (!selectedDate || !selectedTime || !user || !db) return;
    setIsSubmitting(true);
    const refCode = `PAO-${Math.floor(100000 + Math.random() * 900000)}`;
    const appointmentId = crypto.randomUUID();
    const apptRef = doc(db, "appointments", appointmentId);

    const clientName = profile ? `${profile.firstName} ${profile.lastName}` : (user.displayName || "Client");

    const appointmentData = {
      id: appointmentId,
      clientId: user.uid,
      lawyerId: activeCase?.lawyerId || null,
      referenceCode: refCode,
      caseCategory: categoryParam,
      caseType: caseTypeParam,
      purpose: "follow-up",
      serviceType: "Follow-up Consultation",
      clientName: clientName,
      clientMobile: profile?.phoneNumber || "",
      clientEmail: user.email || "",
      clientAddress: profile?.address || "",
      date: selectedDate.toISOString(),
      dateString: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      status: "scheduled",
      createdAt: new Date().toISOString()
    };

    setDocumentNonBlocking(apptRef, appointmentData, { merge: true });

    // --- NOTIFICATION ---
    const notifId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", notifId), {
      id: notifId,
      type: "appointment",
      userRole: "client",
      description: `Client ${clientName} booked a follow-up consultation for ${format(selectedDate, "MMM dd")} @ ${selectedTime}.`,
      referenceId: appointmentId,
      referenceCode: refCode,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });
    
    setTimeout(() => {
      setBookedRef(refCode);
      setIsSubmitting(false);
      toast({ title: "Appointment Finalized", description: "Your follow-up has been successfully logged." });
    }, 1200);
  };

  if (bookedRef) {
    return (
      <DashboardLayout role={role}>
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-none shadow-2xl bg-white text-center p-8 space-y-6 rounded-[3rem]">
            <div className="flex justify-center"><div className="p-4 bg-primary text-white rounded-full animate-bounce shadow-xl"><ShieldCheck className="h-12 w-12" /></div></div>
            <div className="space-y-2"><h2 className="text-3xl font-black text-primary font-headline">Visit Confirmed</h2><p className="text-muted-foreground font-medium">Your follow-up session has been added to the registry.</p></div>
            <div className="bg-primary/5 p-8 rounded-[2rem] space-y-2 border-2 border-dashed border-primary/20"><p className="text-[10px] font-black text-primary uppercase tracking-widest">Confirmation Code</p><p className="text-5xl font-black text-primary tracking-tighter">{bookedRef}</p></div>
            <Button className="w-full h-14 rounded-2xl font-bold text-lg bg-primary hover:bg-[#1A3B6B] text-white shadow-lg" onClick={() => router.push("/dashboard/client")}>Return to Dashboard</Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-8 px-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Schedule Follow-up</h1>
          <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Atty. {assignedLawyer?.lastName || 'Counsel'} Case Management</p>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-[3rem] overflow-hidden">
          <CardContent className="p-10">
            {step === 1 && (
              <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">1. Preferred Date</Label>
                    <div className="p-4 bg-white rounded-3xl border border-primary/10 shadow-sm">
                      <CalendarComponent 
                        mode="single" 
                        selected={selectedDate} 
                        onSelect={(date) => { 
                          if (date && !isWeekend(date) && !isHoliday(date) && !isBefore(date, startOfToday())) { 
                            setSelectedDate(date); 
                            setSelectedTime(""); 
                          } 
                        }} 
                        disabled={[{ before: startOfToday() }, { dayOfWeek: [0, 6] }, (date) => isHoliday(date)]} 
                        className="w-full rounded-md border-none" 
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">2. Available Slots</Label>
                    {selectedDate ? (
                      <div className="grid grid-cols-2 gap-2 max-h-[350px] overflow-y-auto pr-2">
                        {timeSlots.map(slot => (
                          <Button 
                            key={slot.time} 
                            disabled={slot.isBooked || slot.isPast} 
                            variant={selectedTime === slot.time ? "default" : "outline"} 
                            className={cn(
                              "h-12 rounded-xl font-bold transition-all border-2",
                              selectedTime === slot.time ? "bg-yellow-400 text-black border-yellow-500 shadow-md scale-105" : "bg-green-500 text-white border-green-600"
                            )} 
                            onClick={() => setSelectedTime(slot.time)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/10">
                        <Clock className="h-10 w-10 mb-2 opacity-20" />
                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/30 text-center px-8">Select a date to view<br/>your lawyer's availability</p>
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full h-16 bg-primary text-white text-lg font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-transform" 
                    disabled={!selectedDate || !selectedTime} 
                    onClick={() => setStep(2)}
                  >
                    Proceed to Verification <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-3xl mx-auto space-y-10 animate-in slide-in-from-right-8 duration-500">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-primary/10 rounded-2xl mb-2"><ShieldCheck className="h-10 w-10 text-primary" /></div>
                  <h3 className="text-2xl font-black text-primary font-headline">Identity Verification</h3>
                  <p className="text-sm text-muted-foreground font-bold">Booking will be confirmed using your registered details.</p>
                </div>

                <div className="grid gap-6">
                  <Card className="border-none bg-primary/5 rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-primary/10 py-4 px-8">
                      <CardTitle className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Registered Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl shadow-sm text-primary"><User className="h-4 w-4" /></div>
                          <div><p className="text-[9px] font-bold text-muted-foreground uppercase">Full Name</p><p className="font-black text-primary">{profile?.firstName} {profile?.lastName}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl shadow-sm text-primary"><Phone className="h-4 w-4" /></div>
                          <div><p className="text-[9px] font-bold text-muted-foreground uppercase">Mobile Number</p><p className="font-black text-primary">{profile?.phoneNumber || 'Not Set'}</p></div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl shadow-sm text-primary"><MapPin className="h-4 w-4" /></div>
                          <div><p className="text-[9px] font-bold text-muted-foreground uppercase">Home Address</p><p className="text-[11px] font-bold text-primary leading-tight">{profile?.address || 'Not Set'}</p></div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded-xl shadow-sm text-primary"><Clock className="h-4 w-4" /></div>
                          <div><p className="text-[9px] font-bold text-muted-foreground uppercase">Target Session</p><p className="text-[11px] font-black text-primary uppercase">{selectedDate ? format(selectedDate, "MMM dd, yyyy") : ""} @ {selectedTime}</p></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
                    <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-800 font-bold leading-relaxed">
                      A 6-digit verification code will be sent to your registered mobile number to authorize this follow-up booking.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold border-2" onClick={() => setStep(1)}>Cancel & Reset</Button>
                  <Button 
                    className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl" 
                    onClick={handleTriggerOtp}
                    disabled={isSmsSending}
                  >
                    {isSmsSending ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <ArrowRight className="mr-2 h-5 w-5" />}
                    Confirm & Send Code
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="max-w-lg mx-auto space-y-8 animate-in zoom-in-95 duration-500">
                <div className="text-center space-y-4">
                  <div className="inline-flex p-4 bg-secondary/10 text-secondary rounded-full shadow-inner"><Lock className="h-8 w-8" /></div>
                  <h3 className="text-2xl font-black text-primary font-headline">Verify OTP</h3>
                  <p className="text-sm text-muted-foreground font-medium">Please enter the code sent to your registered number.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Access Code</Label>
                    <Input 
                      className="h-20 text-center text-5xl font-black tracking-[0.5em] rounded-[2rem] border-secondary/30 text-secondary bg-secondary/5 focus-visible:ring-secondary/20 shadow-inner"
                      maxLength={6}
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value)}
                      placeholder="000000"
                    />
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button 
                      className="w-full h-16 rounded-2xl text-lg font-black bg-secondary hover:bg-[#006666] text-white shadow-xl hover:scale-[1.02] transition-transform"
                      disabled={isSubmitting || otpValue.length < 6}
                      onClick={handleBooking}
                    >
                      {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "Verify & Finalize Visit"}
                    </Button>
                    <div className="flex justify-between items-center px-2">
                       <Button variant="link" className="text-[10px] font-black text-muted-foreground uppercase tracking-widest" onClick={() => setStep(2)}>Back to Review</Button>
                       <Button 
                         variant="link" 
                         className="text-[10px] font-black text-secondary uppercase tracking-widest" 
                         disabled={isSmsSending}
                         onClick={handleTriggerOtp}
                       >
                         {isSmsSending ? "Sending..." : "Resend Code"}
                       </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}
