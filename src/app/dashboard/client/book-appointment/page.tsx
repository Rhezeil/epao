
"use client";

import { useState, Suspense, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Clock, CheckCircle, Loader2, FileText, CalendarCheck, Gavel, Info, AlertCircle } from "lucide-react";
import { useFirestore, setDocumentNonBlocking, useCollection, useMemoFirebase } from "@/firebase";
import { doc, collection, query, where } from "firebase/firestore";
import { format, isWeekend, startOfToday, setHours, setMinutes, isBefore, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const HOLIDAYS = [
  "2024-01-01", "2024-04-09", "2024-05-01", "2024-06-12", "2024-08-26",
  "2024-11-01", "2024-11-30", "2024-12-25", "2024-12-30", "2025-01-01"
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
  
  const caseTypeParam = searchParams.get("caseType") || "Follow-up Consultation";
  const categoryParam = searchParams.get("category") || "General";

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [purpose, setPurpose] = useState("consultation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedRef, setBookedRef] = useState<string | null>(null);

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

        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        const timeString = `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
        
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
          <Card className="border-none shadow-2xl bg-white text-center p-8 space-y-6 rounded-[2.5rem]">
            <div className="flex justify-center">
              <div className="p-4 bg-blue-600 text-white rounded-full animate-bounce shadow-xl">
                <CheckCircle className="h-12 w-12" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-primary">Booking Confirmed!</h2>
              <p className="text-muted-foreground font-medium">Your follow-up visit has been successfully scheduled.</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-3xl space-y-2 border-2 border-dashed border-blue-400">
              <p className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Reference Code</p>
              <p className="text-4xl font-black text-blue-900 tracking-tighter">{bookedRef}</p>
            </div>
            <Button className="w-full h-12 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg" onClick={() => router.push("/dashboard/client")}>
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
          <p className="text-muted-foreground font-medium">
            Subject: <span className="font-bold text-primary">{caseTypeParam}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
              <CardContent className="space-y-8 pt-8 p-8">
                <div className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">1. Select Date (Mon-Fri)</Label>
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
                      <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">2. Visit Purpose</Label>
                      <Select value={purpose} onValueChange={setPurpose}>
                        <SelectTrigger className="w-full bg-white border-primary/20 h-12 rounded-xl font-bold">
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
                        <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">3. Available Time Slots</Label>
                        <div className="flex gap-2 text-[8px] font-bold uppercase">
                          <span className="flex items-center gap-1 text-green-600"><div className="w-2 h-2 bg-green-500 rounded-full" /> Open</span>
                          <span className="flex items-center gap-1 text-red-600"><div className="w-2 h-2 bg-red-500 rounded-full" /> Full</span>
                          <span className="flex items-center gap-1 text-yellow-600"><div className="w-2 h-2 bg-yellow-400 rounded-full" /> Selected</span>
                        </div>
                      </div>
                      
                      {!selectedDate ? (
                        <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground bg-primary/5 rounded-3xl border border-dashed">
                          <Clock className="h-10 w-10 mb-2 opacity-20" />
                          <p className="text-sm font-bold">Select a date first</p>
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
                              <p className="font-bold">No available schedules.</p>
                            </div>
                          )}
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
                            Book Follow-up
                          </>
                        )}
                      </Button>
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
                  As a registered client, you are booking directly into your assigned lawyer's schedule. 
                  Gray dates are weekends or past dates and cannot be selected.
                </p>
                <div className="bg-white/60 p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-3">
                  <Gavel className="h-6 w-6 text-amber-600" />
                  <p className="text-xs font-black text-amber-900 leading-tight">Professional Continuity.</p>
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Initializing Scheduler...</div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}
