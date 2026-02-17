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
import { doc, collection, query, where } from "firebase/firestore";
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

  // Fetch client profile for pre-filling
  const profileDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "profile");
  }, [db, user]);
  const { data: profile } = useDoc(profileDocRef);
  
  const caseTypeParam = searchParams.get("caseType") || "Follow-up Consultation";
  const categoryParam = searchParams.get("category") || "General";
  const fromNavigator = searchParams.get("fromNavigator") === "true";

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [purpose, setPurpose] = useState("consultation");
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
    const { name, mobile, email, address } = clientInfo;
    if (!name || !mobile || !email || !address) {
      toast({ variant: "destructive", title: "Missing Information", description: "All contact details are required for the official record." });
      return false;
    }
    return true;
  };

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !user || !db) return;

    setIsSubmitting(true);
    const refCode = `PAO-${Math.floor(100000 + Math.random() * 900000)}`;
    const appointmentId = crypto.randomUUID();
    const apptRef = doc(db, "appointments", appointmentId);

    const appointmentData = {
      id: appointmentId,
      clientId: user.uid,
      referenceCode: refCode,
      caseCategory: categoryParam,
      caseType: caseTypeParam,
      purpose: purpose,
      serviceType: getServiceLabel(purpose),
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
            <div className="flex justify-center">
              <div className="p-4 bg-primary text-white rounded-full animate-pulse shadow-xl">
                <CheckCircle className="h-12 w-12" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-primary font-headline">Visit Confirmed</h2>
              <p className="text-muted-foreground font-medium">Your follow-up session has been successfully added to your lawyer's schedule.</p>
            </div>
            <div className="bg-primary/5 p-6 rounded-3xl space-y-2 border-2 border-dashed border-primary/20">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Confirmation Code</p>
              <p className="text-4xl font-black text-primary tracking-tighter">{bookedRef}</p>
            </div>
            <Button className="w-full h-12 rounded-2xl font-bold bg-primary hover:bg-[#1A3B6B] text-white shadow-lg" onClick={() => router.push("/dashboard/client")}>
              Return to Dashboard
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-8 px-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Schedule Follow-up</h1>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
          <CardContent className="p-10">
            {step === 1 && (
              <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in duration-500">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">1. Preferred Date</Label>
                    <div className="p-4 bg-white rounded-3xl border border-primary/10 shadow-sm">
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
                        className="w-full rounded-md border-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">2. Service Type</Label>
                    <Select value={purpose} onValueChange={setPurpose}>
                      <SelectTrigger className="w-full bg-white border-primary/20 h-14 rounded-2xl font-bold">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Legal Consultation</SelectItem>
                        <SelectItem value="notarization">Document Notarization</SelectItem>
                        <SelectItem value="document-preparation">Document Preparation</SelectItem>
                        <SelectItem value="legal-advice">Legal Advice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">3. Available Time Slots</Label>
                      <div className="flex gap-2 text-[8px] font-bold uppercase">
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-green-500 rounded-full" /> Open</span>
                        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-full" /> Full</span>
                      </div>
                    </div>
                    
                    {!selectedDate ? (
                      <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-primary/5 rounded-3xl border border-dashed">
                        <Clock className="h-10 w-10 mb-2 opacity-20" />
                        <p className="text-sm font-bold text-center">Select a date to view your lawyer's availability.</p>
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
                                ? "bg-yellow-400 text-black border-yellow-500" 
                                : slot.isBooked || slot.isPast
                                ? "bg-red-500 text-white border-red-600 opacity-80" 
                                : "bg-green-500 text-white border-green-600 hover:bg-green-600"
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
                    className="w-full h-16 bg-primary hover:bg-[#1A3B6B] text-white text-lg font-black rounded-2xl shadow-lg"
                    disabled={!selectedDate || !selectedTime}
                    onClick={() => setStep(2)}
                  >
                    Confirm Contact Details <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-right-8 duration-500">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-primary">Confirm Contact Information</h3>
                  <p className="text-sm text-muted-foreground">Verify your records for this specific visit.</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">Full Name</Label>
                    <Input 
                      className="h-14 rounded-2xl border-primary/20 bg-white font-bold"
                      value={clientInfo.name}
                      onChange={(e) => setClientInfo({...clientInfo, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">Mobile Number</Label>
                    <Input 
                      className="h-14 rounded-2xl border-primary/20 bg-white font-bold"
                      value={clientInfo.mobile}
                      onChange={(e) => setClientInfo({...clientInfo, mobile: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">Email Address</Label>
                    <Input 
                      disabled
                      className="h-14 rounded-2xl border-primary/20 bg-muted/50 font-bold"
                      value={clientInfo.email}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">Home Address</Label>
                    <Textarea 
                      className="min-h-[100px] rounded-2xl border-primary/20 bg-white font-bold"
                      value={clientInfo.address}
                      onChange={(e) => setClientInfo({...clientInfo, address: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold border-2" onClick={() => setStep(1)}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Schedule
                  </Button>
                  <Button 
                    className="flex-1 h-14 rounded-2xl text-lg font-black bg-primary text-white shadow-xl"
                    onClick={() => {
                      if (validateStep2()) setStep(3);
                    }}
                  >
                    Review & Finalize <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="max-w-3xl mx-auto space-y-8 animate-in zoom-in-95 duration-500">
                <div className="text-center space-y-2">
                  <ShieldCheck className="h-12 w-12 text-primary mx-auto" />
                  <h3 className="text-2xl font-black text-primary font-headline">Review Final Booking</h3>
                  <p className="text-muted-foreground font-medium">Please ensure all details are correct for your official follow-up record.</p>
                </div>

                <div className="grid gap-6">
                  <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                    <h4 className="text-[10px] font-black uppercase text-primary tracking-widest mb-4">Client Registry Data</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</p>
                        <p className="font-bold text-primary">{clientInfo.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Mobile</p>
                        <p className="font-bold text-primary">{clientInfo.mobile}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Email</p>
                        <p className="font-bold text-primary">{clientInfo.email}</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Home Address</p>
                        <p className="font-bold text-primary">{clientInfo.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-secondary/5 rounded-[2rem] border border-secondary/10">
                    <h4 className="text-[10px] font-black uppercase text-secondary tracking-widest mb-4">Appointment Schedule</h4>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Date</p>
                        <p className="font-bold text-secondary">{selectedDate ? format(selectedDate, "PPPP") : ""}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Time</p>
                        <p className="font-bold text-secondary">{selectedTime}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Service</p>
                        <p className="font-bold text-secondary">{getServiceLabel(purpose)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button variant="outline" className="h-14 px-8 rounded-2xl font-bold border-2 border-primary text-primary" onClick={() => setStep(2)}>
                    <Edit3 className="mr-2 h-4 w-4" /> Edit Details
                  </Button>
                  <Button 
                    className="flex-1 h-14 rounded-2xl text-lg font-black bg-primary text-white shadow-xl"
                    disabled={isSubmitting}
                    onClick={handleBooking}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "Confirm Follow-up"}
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Initializing Scheduler...</div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}
