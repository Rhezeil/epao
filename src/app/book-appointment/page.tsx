
"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, CheckCircle, ArrowRight, Loader2, User, AlertCircle } from "lucide-react";
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { format, isWeekend, startOfToday, setHours, setMinutes, isBefore, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

function BookAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const db = useFirestore();
  const { toast } = useToast();
  
  const caseTypeParam = searchParams.get("caseType") || "Initial Consultation";
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [purpose, setPurpose] = useState("consultation");
  const [guestInfo, setGuestInfo] = useState({ name: "", mobile: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);

  const getServiceLabel = (p: string) => {
    switch (p) {
      case 'consultation': return 'Case Consultation';
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
    const startHour = 8;
    const endHour = 17;
    const now = new Date();

    for (let h = startHour; h < endHour; h++) {
      for (let m = 0; m < 60; m += 30) {
        // Exclude 12:00 PM - 1:00 PM Break
        if (h === 12) continue;

        const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        const slotDate = selectedDate ? setMinutes(setHours(new Date(selectedDate), h), m) : null;
        
        // Disable past times for today
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
              <div className="p-4 bg-blue-600 text-white rounded-full animate-pulse shadow-xl">
                <CheckCircle className="h-12 w-12" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-primary">Booking Confirmed!</h2>
              <p className="text-muted-foreground font-medium">Your reference code is generated below.</p>
            </div>
            <div className="bg-blue-50 p-8 rounded-[2rem] space-y-2 border-2 border-dashed border-blue-400">
              <p className="text-[10px] font-black text-blue-700 uppercase tracking-[0.2em]">Appointment Reference</p>
              <p className="text-5xl font-black text-blue-900 tracking-tighter">{refCode}</p>
            </div>
            <Button className="w-full h-14 rounded-2xl font-bold text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg" onClick={() => router.push("/case-navigator")}>
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
          <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Schedule Your Visit</h1>
          <p className="text-muted-foreground font-medium">
            Matter: <span className="font-bold text-primary">{caseTypeParam}</span>
          </p>
        </div>

        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-md rounded-[3rem] overflow-hidden">
          <CardContent className="p-10">
            {step === 1 ? (
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">1. Select Date (Mon-Fri)</Label>
                    <div className="p-4 bg-white rounded-3xl border border-primary/10 shadow-sm flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (date && (isWeekend(date) || isBefore(date, startOfToday()))) return;
                          setSelectedDate(date);
                          setSelectedTime("");
                        }}
                        disabled={[
                          { before: startOfToday() },
                          { dayOfWeek: [0, 6] }
                        ]}
                        className="rounded-md border-none"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">2. Service Type</Label>
                    <Select value={purpose} onValueChange={setPurpose}>
                      <SelectTrigger className="h-14 rounded-2xl border-primary/20 bg-white font-bold">
                        <SelectValue placeholder="Select purpose" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation">Case Consultation</SelectItem>
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
                        <p className="text-sm font-bold">Pick a date to see availability</p>
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
                        {timeSlots.every(s => s.isBooked || s.isPast) && (
                          <div className="col-span-2 text-center py-12 text-red-600 bg-red-50 rounded-2xl border border-red-200">
                            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
                            <p className="font-bold">No available schedules for this date.</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <Button 
                    disabled={!selectedDate || !selectedTime} 
                    onClick={() => setStep(2)} 
                    className="w-full h-16 rounded-2xl text-lg font-black bg-primary hover:bg-[#1A3B6B] shadow-lg text-white"
                  >
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest ml-1">Your Full Name</Label>
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
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest ml-1">Active Mobile Number</Label>
                    <Input 
                      placeholder="09123456789"
                      className="h-14 rounded-2xl border-primary/20 bg-white font-bold"
                      value={guestInfo.mobile}
                      onChange={(e) => setGuestInfo({...guestInfo, mobile: e.target.value})}
                    />
                  </div>
                </div>
                
                <div className="bg-primary/5 p-6 rounded-3xl space-y-3 border border-primary/10">
                  <h4 className="text-xs font-black text-primary/60 uppercase tracking-widest">Verify Schedule</h4>
                  <div className="flex justify-between items-center text-sm font-bold text-[#1A3B6B]">
                    <span>Date:</span>
                    <span>{selectedDate ? format(selectedDate, "PPP") : ""}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-[#1A3B6B]">
                    <span>Time Slot:</span>
                    <span className="px-3 py-1 bg-yellow-400 rounded-lg">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm font-bold text-[#1A3B6B]">
                    <span>Service:</span>
                    <span>{getServiceLabel(purpose)}</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" className="h-14 rounded-2xl px-8 font-bold border-2" onClick={() => setStep(1)}>Modify</Button>
                  <Button 
                    className="flex-1 h-14 rounded-2xl text-lg font-black bg-primary text-white shadow-xl"
                    disabled={!guestInfo.name || !guestInfo.mobile || isSubmitting}
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
