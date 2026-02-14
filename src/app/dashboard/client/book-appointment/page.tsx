
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Info, CheckCircle2, Loader2, CheckCircle } from "lucide-react";
import { useState, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";
import { useFirestore, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";

function BookAppointmentContent() {
  const { role, user } = useAuth();
  const searchParams = useSearchParams();
  const db = useFirestore();
  const router = useRouter();
  
  const caseTypeParam = searchParams.get("caseType") || "General Consultation";
  const categoryParam = searchParams.get("category") || "General";

  const [date, setDate] = useState<Date>();
  const [purpose, setPurpose] = useState("consultation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedRef, setBookedRef] = useState<string | null>(null);

  const handleBooking = async () => {
    if (!date || !user || !db) return;

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
      date: date.toISOString(),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    setDocumentNonBlocking(apptRef, appointmentData, { merge: true });
    
    setTimeout(() => {
      setBookedRef(refCode);
      setIsSubmitting(false);
    }, 800);
  };

  if (bookedRef) {
    return (
      <DashboardLayout role={role}>
        <div className="max-w-xl mx-auto py-12">
          <Card className="border-none shadow-xl bg-white text-center p-8 space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-green-100 rounded-full">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-primary">Booking Confirmed!</h2>
              <p className="text-muted-foreground">Your appointment has been successfully scheduled.</p>
            </div>
            <div className="bg-[#F0F4F8] p-6 rounded-xl space-y-2">
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Your Reference Code</p>
              <p className="text-4xl font-black text-primary tracking-tighter">{bookedRef}</p>
              <p className="text-[10px] text-muted-foreground">Please save this code to manage your appointment later.</p>
            </div>
            <Button className="w-full" onClick={() => router.push("/case-navigator?mode=manage")}>
              Go to Appointment Manager
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary font-headline">Book Appointment</h1>
          <p className="text-sm text-muted-foreground">
            You are booking a new client consultation for: <span className="font-bold text-primary">{caseTypeParam}</span>.
          </p>
          <p className="text-sm text-muted-foreground">Please select a date, and time slot below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm bg-[#EBF2FA]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-primary">Appointment Scheduler</CardTitle>
                <p className="text-xs text-muted-foreground">
                  This system is for first-time users.
                </p>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-primary uppercase">Purpose of Visit</Label>
                  <Select value={purpose} onValueChange={setPurpose}>
                    <SelectTrigger className="w-full bg-white border-primary/20 h-11">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="notarization">Notarization</SelectItem>
                      <SelectItem value="document-review">Document Review</SelectItem>
                      <SelectItem value="legal-advice">Legal Advice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-primary uppercase">Select a Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white border-primary/20 h-11 px-3",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button 
                  className="w-full h-12 bg-primary hover:bg-[#1A3B6B] text-white font-bold"
                  disabled={!date || isSubmitting}
                  onClick={handleBooking}
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Confirm & Get Reference Code"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-[#EBF2FA]">
              <CardHeader className="pb-2 flex-row items-start gap-2 space-y-0">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <CardTitle className="text-lg font-bold text-primary">How to Get PAO Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-primary">1. Check Eligibility</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      You must be an indigent person. PAO assesses your financial situation.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-primary">2. Gather Documents</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Bring government ID, proof of income, and case-related documents.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/60 p-3 rounded-lg flex gap-3 border border-primary/5">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-primary">Indigency</p>
                      <p className="text-[10px] text-muted-foreground">Proof is crucial for full representation.</p>
                    </div>
                  </div>
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
    <Suspense fallback={<div>Loading...</div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}
