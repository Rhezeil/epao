
"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
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
  ArrowRight, 
  Loader2, 
  User, 
  AlertCircle, 
  Mail, 
  Phone, 
  MapPin,
  Edit3,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { format, isWeekend, startOfToday, setHours, setMinutes, isBefore, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Statutory Holidays Logic
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const db = useFirestore();
  const { toast } = useToast();
  
  const caseTypeParam = searchParams.get("caseType") || "Initial Consultation";
  const fromNavigator = searchParams.get("fromNavigator") === "true";

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [purpose, setPurpose] = useState(fromNavigator ? "consultation" : "consultation");
  const [guestInfo, setGuestInfo] = useState({ 
    name: "", 
    mobile: "", 
    email: "", 
    address: "" 
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);

  const getServiceLabel = (p: string) => {
    switch (p) {
      case 'consultation': return 'Legal Consultation';
      case 'notarization': return 'Document Notarization';
      case 'document-preparation': return 'Document Preparation';
      case 'legal-advice': return 'Legal Advice';
      default: return 'General Service';
    }
  };

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
        const isBooked = existingAppts?.some(a => a.time === timeString && a.status !== 'cancelled');
        
        slots.push({
          time: timeString,
          isBooked,
          isPast
        });
      }
    }
    return slots;
  }, [selectedDate, existingAppts]);

  const validateStep2 = () => {
    const { name, mobile, email, address } = guestInfo;
    if (!name || !mobile || !email || !address) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please fill out all required fields." });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ variant: "destructive", title: "Invalid Email", description: "Please enter a valid email address." });
      return false;
    }
    if (!/^\d{10,11}$/.test(mobile)) {
      toast({ variant: "destructive", title: "Invalid Mobile", description: "Please enter a valid 10-11 digit mobile number." });
      return false;
    }
    return true;
  };

  const handleBooking = async () => {
    if (!db || !selectedDate || !selectedTime) return;
    setIsSubmitting(true);

    const code = `PAO-${Math.floor(100000 + Math.random() * 900000)}`;
    const id = crypto.randomUUID();
    const apptRef = doc(db, "appointments", id);

    const data = {
      id,
      referenceCode: code,
      caseType: caseTypeParam,
      guestName: guestInfo.name,
      guestMobile: guestInfo.mobile,
      guestEmail: guestInfo.email,
      guestAddress: guestInfo.address,
      purpose: purpose,
      serviceType: getServiceLabel(purpose),
      date: selectedDate.toISOString(),
      dateString: format(selectedDate, "yyyy-MM-dd"),
      time: selectedTime,
      status: "pending",
      type: "initial",
      createdAt: new Date().toISOString()
    };

    setDocumentNonBlocking(apptRef, data, { merge: true });

    setTimeout(() => {
      setRefCode(code);
      setStep(4);
      setIsSubmitting(false);
      toast({
        title: "Booking Successful",
        description: "Your legal consultation has been officially scheduled."
      });
    }, 1500);
  };

  if (step === 4 && refCode) {
    return (
      <DashboardLayout role={null}>
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-none shadow-2xl bg-white text-center p-8 space-y-6 rounded-[3rem]">
            <div className="flex justify-center">
              <div className="p-4 bg-primary text-white rounded-full animate-bounce shadow-xl">
                <CheckCircle className="h-12 w-12" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-primary font-headline">Booking Confirmed</h2>
              <p className="text-muted-foreground font-medium">Your request has been successfully processed by the system.</p>
            </div>
            <div className="bg-primary/5 p-8 rounded-[2rem] space-y-2 border-2 border-dashed border-primary/20">
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Appointment Reference Code</p>
              <p className="text-5xl font-black text-primary tracking-tighter">{refCode}</p>
            </div>
            <div className="text-sm text-muted-foreground italic bg-amber-50 p-4 rounded-xl border border-amber-100">
              Please present this code and your valid ID upon arrival at the office.
            </div>
            <Button className="w-full h-14 rounded-2xl font-bold text-lg bg-primary hover:bg-[#1A3B6B] text-white shadow-lg" onClick={() => router.push("/case-navigator")}>
              Return to Navigator
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={null}>
      <div className="max-w-6xl mx-auto space-y-8 py-4 px-4">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Schedule Legal Appointment</h1>
          <p className="text-muted-foreground font-medium">
            Matter: <span className="font-bold text-primary">{caseTypeParam}</span>
          </p>
        </div>

        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-md rounded-[3rem] overflow-hidden">
          <CardContent className="p-10">
            {step === 1 && (
              <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">1. Select Visit Date</Label>
                    <div className="p-4 bg-white rounded-3xl border border-primary/10 shadow-sm flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date && (isWeekend(date) || isHoliday(date) || isBefore(date, startOfToday()))) return;
                          setSelectedDate(date);
                          setSelectedTime("");
                        }}
                        disabled={[
                          { before: startOfToday() },
                          { dayOfWeek: [0, 6] },
                          (date) => isHoliday(date)
                        ]}
                        className="rounded-md border-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">2. Service Classification</Label>
                    <Select value={purpose} onValueChange={setPurpose}>
                      <SelectTrigger className="h-14 rounded-2xl border-primary/20 bg-white font-bold">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Legal Consultation</SelectItem>
                        {!fromNavigator && <SelectItem value="notarization">Document Notarization</SelectItem>}
                        {!fromNavigator && <SelectItem value="document-preparation">Document Preparation</SelectItem>}
                        <SelectItem value="legal-advice">Legal Advice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">3. Select Time Slot</Label>
                      <div className="flex gap-2 text-[8px] font-bold uppercase">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full" /> Available</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full" /> Booked</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-400 rounded-full" /> Selected</span>
                      </div>
                    </div>
                    
                    {!selectedDate ? (
                      <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-primary/5 rounded-3xl border border-dashed">
                        <Clock className="h-10 w-10 mb-2 opacity-20" />
                        <p className="text-sm font-bold text-center">Please pick a date from the calendar<br/>to view daily availability.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-[350px] overflow-y-auto p-2 scrollbar-hide">
                        {timeSlots.map(slot => (
                          <Button
                            key={slot.time}
                            disabled={slot.isBooked || slot.isPast}
                            variant={selectedTime === slot.time ? "default" : "outline"}
                            className={cn(
                              "h-12 rounded-xl font-bold transition-all border-2",
                              selectedTime === slot.time 
                                ? "bg-yellow-400 text-black border-yellow-500 scale-105 shadow-md" 
                                : slot.isBooked || slot.isPast
                                ? "bg-red-500 text-white border-red-600 opacity-80 cursor-not-allowed" 
                                : "bg-green-500 text-white border-green-600 hover:bg-green-600 shadow-sm"
                            )}
                            onClick={() => setSelectedTime(slot.time)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>

                  <Button 
                    disabled={!selectedDate || !selectedTime} 
                    onClick={() => setStep(2)} 
                    className="w-full h-16 rounded-2xl text-lg font-black bg-primary hover:bg-[#1A3B6B] shadow-lg text-white"
                  >
                    Continue to Personal Info <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-primary">Personal Information</h3>
                  <p className="text-sm text-muted-foreground">Please provide your official contact details for coordination.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest ml-1">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary opacity-40" />
                      <Input 
                        placeholder="Juan Dela Cruz"
                        className="h-14 pl-12 rounded-2xl border-primary/20 bg-white font-bold"
                        value={guestInfo.name}
                        onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest ml-1">Mobile Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary opacity-40" />
                      <Input 
                        placeholder="09123456789"
                        className="h-14 pl-12 rounded-2xl border-primary/20 bg-white font-bold"
                        value={guestInfo.mobile}
                        onChange={(e) => setGuestInfo({...guestInfo, mobile: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest ml-1">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary opacity-40" />
                      <Input 
                        type="email"
                        placeholder="juan.delacruz@example.com"
                        className="h-14 pl-12 rounded-2xl border-primary/20 bg-white font-bold"
                        value={guestInfo.email}
                        onChange={(e) => setGuestInfo({...guestInfo, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest ml-1">Complete Home Address</Label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-4 h-5 w-5 text-primary opacity-40" />
                      <Textarea 
                        placeholder="House No, Street, Barangay, City/Municipality, Province"
                        className="min-h-[100px] pl-12 rounded-2xl border-primary/20 bg-white font-bold pt-4"
                        value={guestInfo.address}
                        onChange={(e) => setGuestInfo({...guestInfo, address: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold border-2" onClick={() => setStep(1)}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button 
                    className="flex-1 h-14 rounded-2xl text-lg font-black bg-primary text-white shadow-xl"
                    onClick={() => {
                      if (validateStep2()) setStep(3);
                    }}
                  >
                    Review Details <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 bg-amber-100 text-amber-900 rounded-full mb-2">
                    <ShieldCheck className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-black text-primary font-headline">Review Your Booking</h3>
                  <p className="text-muted-foreground font-medium">Please verify all information below before finalizing your appointment.</p>
                </div>

                <div className="grid gap-6">
                  <Card className="border-none bg-primary/5 rounded-[2rem]">
                    <CardHeader className="pb-2 border-b border-primary/10">
                      <CardTitle className="text-xs font-black uppercase text-primary tracking-widest">Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Full Name</p>
                        <p className="font-bold text-primary">{guestInfo.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Mobile Number</p>
                        <p className="font-bold text-primary">{guestInfo.mobile}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Email Address</p>
                        <p className="font-bold text-primary">{guestInfo.email}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Home Address</p>
                        <p className="font-bold text-primary leading-relaxed">{guestInfo.address}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-none bg-secondary/5 rounded-[2rem]">
                    <CardHeader className="pb-2 border-b border-secondary/10">
                      <CardTitle className="text-xs font-black uppercase text-secondary tracking-widest">Appointment Details</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-12">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Visit Date</p>
                        <p className="font-bold text-secondary">{selectedDate ? format(selectedDate, "PPPP") : ""}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Time Slot</p>
                        <p className="font-bold text-secondary">{selectedTime}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Matter Category</p>
                        <p className="font-bold text-secondary">{caseTypeParam}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Service Type</p>
                        <p className="font-bold text-secondary">{getServiceLabel(purpose)}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold border-2 border-primary text-primary hover:bg-primary/5" onClick={() => setStep(2)}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Details
                  </Button>
                  <Button 
                    className="flex-1 h-14 rounded-2xl text-lg font-black bg-primary text-white shadow-xl hover:bg-[#1A3B6B]"
                    disabled={isSubmitting}
                    onClick={handleBooking}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "Confirm Booking"}
                  </Button>
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Scheduler...</div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}
