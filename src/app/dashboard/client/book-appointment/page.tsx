
"use client";

import { useState, Suspense, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle, 
  Loader2, 
  FileText, 
  CalendarCheck, 
  Gavel, 
  Info, 
  AlertCircle,
  User,
  Mail,
  Phone,
  MapPin,
  Edit3,
  ChevronLeft,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase, useDoc } from "@/firebase";
import { doc, collection, query, where, onSnapshot } from "firebase/firestore";
import { format, isWeekend, startOfToday, setHours, setMinutes, isBefore, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

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

  // Fetch client profile for pre-filling
  const profileDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "profile");
  }, [db, user]);
  const { data: profile } = useDoc(profileDocRef);

  // Fetch client case to find the lawyer
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
  const [purpose] = useState("follow-up");
  const [clientInfo, setClientInfo] = useState({ 
    name: "", 
    mobile: "", 
    email: "", 
    address: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedRef, setBookedRef] = useState<string | null>(null);

  useEffect(() => {
    if (profile && user) {
      setClientInfo({
        name: profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : "",
        mobile: profile.phoneNumber || user.email?.split('@')[0] || "",
        email: user.email || "",
        address: profile.address || ""
      });
    }
  }, [profile, user]);

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

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !user || !db) return;
    setIsSubmitting(true);
    const refCode = `PAO-${Math.floor(100000 + Math.random() * 900000)}`;
    const appointmentId = crypto.randomUUID();
    const apptRef = doc(db, "appointments", appointmentId);

    const appointmentData = {
      id: appointmentId,
      clientId: user.uid,
      lawyerId: activeCase?.lawyerId || null,
      referenceCode: refCode,
      caseCategory: categoryParam,
      caseType: caseTypeParam,
      purpose: purpose,
      serviceType: "Follow-up Consultation",
      clientName: clientInfo.name,
      clientMobile: clientInfo.mobile,
      clientEmail: clientInfo.email,
      clientAddress: clientInfo.address,
      date: selectedDate.toISOString(),
      dateString: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    setDocumentNonBlocking(apptRef, appointmentData, { merge: true });

    // --- NOTIFICATION ---
    const notifId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", notifId), {
      id: notifId,
      type: "appointment",
      userRole: "client",
      description: `Client ${clientInfo.name} booked a follow-up consultation for ${format(selectedDate, "MMM dd")} @ ${selectedTime}.`,
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
          <Card className="border-none shadow-2xl bg-white text-center p-8 space-y-6 rounded-[2.5rem]">
            <div className="flex justify-center"><div className="p-4 bg-primary text-white rounded-full animate-pulse shadow-xl"><CheckCircle className="h-12 w-12" /></div></div>
            <div className="space-y-2"><h2 className="text-3xl font-black text-primary font-headline">Visit Confirmed</h2><p className="text-muted-foreground font-medium">Your follow-up session has been added.</p></div>
            <div className="bg-primary/5 p-6 rounded-3xl space-y-2 border-2 border-dashed border-primary/20"><p className="text-[10px] font-black text-primary uppercase tracking-widest">Confirmation Code</p><p className="text-4xl font-black text-primary tracking-tighter">{bookedRef}</p></div>
            <Button className="w-full h-12 rounded-2xl font-bold bg-primary hover:bg-[#1A3B6B] text-white" onClick={() => router.push("/dashboard/client")}>Return to Dashboard</Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-8 px-4">
        <div className="space-y-2"><h1 className="text-3xl font-black text-primary font-headline tracking-tight">Schedule Follow-up</h1></div>
        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-10">
            {step === 1 && (
              <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">1. Preferred Date</Label>
                    <div className="p-4 bg-white rounded-3xl border border-primary/10 shadow-sm"><Calendar mode="single" selected={selectedDate} onSelect={(date) => { if (date && !isWeekend(date) && !isHoliday(date) && !isBefore(date, startOfToday())) { setSelectedDate(date); setSelectedTime(""); } }} disabled={[{ before: startOfToday() }, { dayOfWeek: [0, 6] }, (date) => isHoliday(date)]} className="w-full rounded-md border-none" /></div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">2. Available Slots</Label>
                    {selectedDate ? (
                      <div className="grid grid-cols-2 gap-2 max-h-[350px] overflow-y-auto pr-2">{timeSlots.map(slot => (<Button key={slot.time} disabled={slot.isBooked || slot.isPast} variant={selectedTime === slot.time ? "default" : "outline"} className={cn("h-12 rounded-xl font-bold", selectedTime === slot.time ? "bg-yellow-400 text-black" : "bg-green-500 text-white")} onClick={() => setSelectedTime(slot.time)}>{slot.time}</Button>))}</div>
                    ) : <div className="h-[300px] flex items-center justify-center text-muted-foreground bg-primary/5 rounded-3xl border-dashed">Pick a date first</div>}
                  </div>
                  <Button className="w-full h-16 bg-primary text-white text-lg font-black rounded-2xl" disabled={!selectedDate || !selectedTime} onClick={() => setStep(2)}>Confirm Contact Info <ArrowRight className="ml-2 h-5 w-5" /></Button>
                </div>
              </div>
            )}
            {step === 2 && (
              <div className="max-w-3xl mx-auto space-y-8">
                <div className="space-y-1"><h3 className="text-xl font-bold text-primary">Confirm Contact Details</h3></div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2"><Label className="text-xs font-black uppercase text-primary/60">Full Name</Label><Input className="h-14 rounded-2xl" value={clientInfo.name} onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})} /></div>
                  <div className="space-y-2"><Label className="text-xs font-black uppercase text-primary/60">Mobile</Label><Input className="h-14 rounded-2xl" value={clientInfo.mobile} onChange={(e) => setClientInfo({...clientInfo, mobile: e.target.value})} /></div>
                  <div className="md:col-span-2 space-y-2"><Label className="text-xs font-black uppercase text-primary/60">Address</Label><Textarea className="min-h-[100px] rounded-2xl" value={clientInfo.address} onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})} /></div>
                </div>
                <div className="flex gap-4"><Button variant="outline" className="h-14 px-8 rounded-2xl" onClick={() => setStep(1)}>Back</Button><Button className="flex-1 h-14 rounded-2xl bg-primary text-white font-black" onClick={() => setStep(3)}>Review & Finalize <ArrowRight className="ml-2 h-5 w-5" /></Button></div>
              </div>
            )}
            {step === 3 && (
              <div className="max-w-3xl mx-auto space-y-8 text-center">
                <ShieldCheck className="h-12 w-12 text-primary mx-auto" /><h3 className="text-2xl font-black text-primary">Review Final Booking</h3>
                <div className="grid gap-6 text-left">
                  <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10"><p className="font-bold text-primary">{clientInfo.name}</p><p className="text-sm text-primary/60">{clientInfo.mobile}</p></div>
                  <div className="p-6 bg-secondary/5 rounded-[2rem] border border-secondary/10"><p className="font-bold text-secondary">{selectedDate ? format(selectedDate, "PPPP") : ""} @ {selectedTime}</p></div>
                </div>
                <Button className="w-full h-14 bg-primary text-white font-black rounded-2xl" disabled={isSubmitting} onClick={handleBooking}>Confirm Follow-up</Button>
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Scheduler...</div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}
