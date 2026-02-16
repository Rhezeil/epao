
"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, CheckCircle, ArrowRight, Loader2, User } from "lucide-react";
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { format, addDays, isWeekend, startOfToday, setHours, setMinutes, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

function BookAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const db = useFirestore();
  
  const caseTypeParam = searchParams.get("caseType") || "Initial Consultation";
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [purpose, setPurpose] = useState("consultation");
  const [guestInfo, setGuestInfo] = useState({ name: "", mobile: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);

  // Purpose to Service mapping
  const getServiceLabel = (p: string) => {
    switch (p) {
      case 'consultation': return 'Case Consultation';
      case 'notarization': return 'Document Notarization';
      case 'document-preparation': return 'Document Preparation';
      case 'legal-advice': return 'Legal Advice';
      default: return 'General Service';
    }
  };

  // Fetch existing appointments for the selected date to prevent double booking
  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const existingApptsQuery = useMemoFirebase(() => {
    if (!db || !dateStr) return null;
    return query(collection(db, "appointments"), where("dateString", "==", dateStr));
  }, [db, dateStr]);

  const { data: existingAppts } = useCollection(existingApptsQuery);

  // Generate 30-minute slots
  const timeSlots = useMemo(() => {
    const slots = [];
    const startHour = 8;
    const endHour = 17;
    const now = new Date();

    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        // Exclude Lunch Break: 12:00 PM - 1:00 PM
        if (h === 12) continue;

        const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        const slotDate = selectedDate ? setMinutes(setHours(new Date(selectedDate), h), m) : null;
        
        // Prevent past times if today
        if (slotDate && isBefore(slotDate, now)) continue;

        // Check if already booked
        const isBooked = existingAppts?.some(a => a.time === timeString && a.status !== 'cancelled');
        
        if (!isBooked) {
          slots.push(timeString);
        }
      }
    }
    return slots;
  }, [selectedDate, existingAppts]);

  const handleBooking = async () => {
    if (!db || !selectedDate || !selectedTime || !guestInfo.name || !guestInfo.mobile) return;
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
      setStep(3);
      setIsSubmitting(false);
    }, 1500);
  };

  if (step === 3 && refCode) {
    return (
      <DashboardLayout role={null}>
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-none shadow-2xl bg-white text-center p-8 space-y-6 rounded-[3rem]">
            <div className="flex justify-center">
              <div className="p-4 bg-green-100 rounded-full animate-bounce">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-primary">Success!</h2>
              <p className="text-muted-foreground font-medium">Your initial consultation is scheduled.</p>
            </div>
            <div className="bg-[#F0F4F8] p-8 rounded-[2rem] space-y-2 border-2 border-dashed border-primary/20">
              <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">Your Unique Reference Code</p>
              <p className="text-5xl font-black text-primary tracking-tighter">{refCode}</p>
              <p className="text-[10px] text-muted-foreground font-bold">SAVE THIS CODE TO MANAGE YOUR VISIT.</p>
            </div>
            <div className="text-sm text-[#1A3B6B] bg-primary/5 p-4 rounded-2xl font-medium">
              Important: Please bring a valid ID and proof of indigency (e.g., Barangay Certificate).
            </div>
            <Button className="w-full h-14 rounded-2xl font-bold text-lg" onClick={() => router.push("/case-navigator")}>
              Back to Navigator
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={null}>
      <div className="max-w-6xl mx-auto space-y-8 py-4">
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-2">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Schedule Initial Visit</h1>
          <p className="text-muted-foreground font-medium">
            Booking for: <span className="font-bold text-primary underline underline-offset-4">{caseTypeParam}</span>
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {[1, 2].map(s => (
            <div key={s} className={cn(
              "h-2 w-12 rounded-full transition-all duration-500",
              step >= s ? "bg-primary" : "bg-primary/10"
            )} />
          ))}
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-md rounded-[3rem] overflow-hidden">
          <CardContent className="p-10">
            {step === 1 ? (
              <div className="grid lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest ml-1">1. Select Weekday</Label>
                    <div className="p-4 bg-white rounded-3xl border border-primary/10 shadow-inner flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setSelectedTime("");
                        }}
                        disabled={(date) => date < startOfToday() || isWeekend(date)}
                        className="rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest ml-1">2. Purpose of Visit</Label>
                    <Select value={purpose} onValueChange={setPurpose}>
                      <SelectTrigger className="h-16 rounded-2xl border-primary/20 bg-white font-bold">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation" className="font-medium">Case Consultation</SelectItem>
                        <SelectItem value="notarization" className="font-medium">Document Notarization</SelectItem>
                        <SelectItem value="document-preparation" className="font-medium">Document Preparation</SelectItem>
                        <SelectItem value="legal-advice" className="font-medium">Legal Advice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest ml-1">3. Select Available Time</Label>
                    {!selectedDate ? (
                      <div className="h-[300px] flex flex-col items-center justify-center text-muted-foreground bg-primary/5 rounded-3xl border border-dashed">
                        <Clock className="h-10 w-10 mb-2 opacity-20" />
                        <p className="text-sm font-bold">Select a date first</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-2 max-h-[400px] overflow-y-auto p-2">
                        {timeSlots.map(slot => (
                          <Button
                            key={slot}
                            variant={selectedTime === slot ? "default" : "outline"}
                            className={cn(
                              "h-12 rounded-xl font-bold",
                              selectedTime === slot ? "bg-primary text-white" : "hover:border-primary/40"
                            )}
                            onClick={() => setSelectedTime(slot)}
                          >
                            {slot}
                          </Button>
                        ))}
                        {timeSlots.length === 0 && (
                          <div className="col-span-3 text-center py-12 text-muted-foreground italic">
                            No available slots for this date.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <p className="text-[10px] text-amber-900 font-bold uppercase tracking-tight">8:00 AM - 5:00 PM | Mon-Fri only</p>
                  </div>

                  <Button 
                    disabled={!selectedDate || !selectedTime} 
                    onClick={() => setStep(2)} 
                    className="w-full h-16 rounded-2xl text-lg font-black bg-primary hover:bg-[#1A3B6B] shadow-lg"
                  >
                    Continue to Contact Info <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest ml-1">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary opacity-40" />
                      <Input 
                        placeholder="Juan Dela Cruz"
                        className="h-14 pl-12 rounded-2xl border-primary/20 bg-white"
                        value={guestInfo.name}
                        onChange={(e) => setGuestInfo({...guestInfo, name: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest ml-1">Mobile Number</Label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary opacity-40" />
                      <Input 
                        placeholder="09123456789"
                        className="h-14 pl-12 rounded-2xl border-primary/20 bg-white"
                        value={guestInfo.mobile}
                        onChange={(e) => setGuestInfo({...guestInfo, mobile: e.target.value})}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="bg-primary/5 p-6 rounded-3xl space-y-3 border border-primary/10">
                  <h4 className="text-xs font-black text-primary/60 uppercase tracking-widest">Verify Your Schedule</h4>
                  <div className="flex justify-between items-center text-sm font-bold text-[#1A3B6B]">
                    <span>Visit Date:</span>
                    <span>{selectedDate ? format(selectedDate, "PPP") : ""}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-[#1A3B6B]">
                    <span>Visit Time:</span>
                    <span>{selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-[#1A3B6B]">
                    <span>Service:</span>
                    <span>{getServiceLabel(purpose)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-[#1A3B6B]">
                    <span>Matter:</span>
                    <span>{caseTypeParam}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="h-14 rounded-2xl px-8 font-bold border-primary/20" onClick={() => setStep(1)}>Back</Button>
                  <Button 
                    className="flex-1 h-14 rounded-2xl text-lg font-black bg-primary shadow-xl"
                    disabled={!guestInfo.name || !guestInfo.mobile || isSubmitting}
                    onClick={handleBooking}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : "Confirm & Get Reference Code"}
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Booking...</div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}
