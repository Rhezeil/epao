
"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar as CalendarIcon, Clock, CheckCircle, Loader2, FileText, CalendarCheck, Gavel, Info } from "lucide-react";
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { format, isWeekend, startOfToday, setHours, setMinutes, isBefore } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

function BookAppointmentContent() {
  const { role, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const db = useFirestore();
  
  const caseTypeParam = searchParams.get("caseType") || "Follow-up Consultation";
  const categoryParam = searchParams.get("category") || "General";

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [purpose, setPurpose] = useState("consultation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedRef, setBookedRef] = useState<string | null>(null);

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
        if (h === 12) continue; // Exclude Lunch

        const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        const slotDate = selectedDate ? setMinutes(setHours(new Date(selectedDate), h), m) : null;
        
        if (slotDate && isBefore(slotDate, now)) continue;

        const isBooked = existingAppts?.some(a => a.time === timeString && a.status !== 'cancelled');
        if (!isBooked) slots.push(timeString);
      }
    }
    return slots;
  }, [selectedDate, existingAppts]);

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
    }, 1200);
  };

  if (bookedRef) {
    return (
      <DashboardLayout role={role}>
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-none shadow-xl bg-white text-center p-8 space-y-6 rounded-[2.5rem]">
            <div className="flex justify-center">
              <div className="p-4 bg-green-100 rounded-full animate-bounce">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-primary">Booking Confirmed!</h2>
              <p className="text-muted-foreground font-medium">Your follow-up visit has been successfully scheduled.</p>
            </div>
            <div className="bg-[#F0F4F8] p-6 rounded-3xl space-y-2 border-2 border-dashed border-primary/10">
              <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Your Reference Code</p>
              <p className="text-4xl font-black text-primary tracking-tighter">{bookedRef}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Please save this code for your visit.</p>
            </div>
            <Button className="w-full h-12 rounded-2xl font-bold" onClick={() => router.push("/dashboard/client")}>
              Return to Dashboard
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-2">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Schedule Follow-up</h1>
          <p className="text-muted-foreground font-medium">
            Booking for: <span className="font-bold text-primary underline decoration-primary/20">{caseTypeParam}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Appointment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-8 p-8">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">1. Select Weekday</Label>
                      <div className="p-4 bg-white rounded-3xl border border-primary/10 shadow-inner flex justify-center">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => {
                            setSelectedDate(date);
                            setSelectedTime("");
                          }}
                          disabled={(date) => date < startOfToday() || isWeekend(date)}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">2. Purpose of Visit</Label>
                      <Select value={purpose} onValueChange={setPurpose}>
                        <SelectTrigger className="w-full bg-white border-primary/20 h-12 rounded-xl font-bold">
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
                      <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">3. Select Time Slot</Label>
                      {!selectedDate ? (
                        <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground bg-primary/5 rounded-3xl border border-dashed">
                          <Clock className="h-10 w-10 mb-2 opacity-20" />
                          <p className="text-sm font-bold">Select a date first</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 max-h-[350px] overflow-y-auto p-2">
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
                        </div>
                      )}
                    </div>

                    <div className="pt-4">
                      <Button 
                        className="w-full h-14 bg-primary hover:bg-[#1A3B6B] text-white text-lg font-black rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3"
                        disabled={!selectedDate || !selectedTime || isSubmitting}
                        onClick={handleBooking}
                      >
                        {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : (
                          <>
                            <CalendarCheck className="h-6 w-6" />
                            Confirm Follow-up
                          </>
                        )}
                      </Button>
                      <p className="text-[10px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-widest">
                        Standard Office Hours: Mon-Fri, 8:00 AM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-xl bg-amber-50/50 backdrop-blur-md rounded-[2.5rem]">
              <CardHeader className="pb-2 flex-row items-center gap-3 space-y-0">
                <div className="p-2 bg-amber-500 text-white rounded-xl shadow-md">
                  <Info className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-amber-900">Follow-up Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                  As a registered client, you are booking directly into your assigned lawyer's clinical schedule. 
                  Please ensure you have all updated evidence requested during your last visit.
                </p>
                <div className="bg-white/60 p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-3">
                  <Gavel className="h-6 w-6 text-amber-600" />
                  <p className="text-xs font-black text-amber-900 leading-tight">Case continuity is our priority.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function BookAppointmentPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Initializng Scheduler...</div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}
