
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Info, CheckCircle2, Loader2, CheckCircle, Calendar as CalendarIcon } from "lucide-react";
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

  const [date, setDate] = useState<string>("");
  const [purpose, setPurpose] = useState("consultation");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookedRef, setBookedRef] = useState<string | null>(null);

  const handleBooking = async () => {
    if (!date || !user || !db) return;

    setIsLoading(true);
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
      date: new Date(date).toISOString(),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    setDocumentNonBlocking(apptRef, appointmentData, { merge: true });
    
    setTimeout(() => {
      setBookedRef(refCode);
      setIsSubmitting(false);
    }, 800);
  };

  const setIsLoading = (val: boolean) => setIsSubmitting(val);

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
            <Button className="w-full" onClick={() => router.push("/case-navigator")}>
              Return to Navigator
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Get today's date in YYYY-MM-DD format for the 'min' attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary font-headline">Book Appointment</h1>
          <p className="text-sm text-muted-foreground">
            You are booking a new client consultation for: <span className="font-bold text-primary">{caseTypeParam}</span>.
          </p>
          <p className="text-sm text-muted-foreground">Please select your preferred date and details below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm bg-[#EBF2FA]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-primary">Appointment Details</CardTitle>
                <p className="text-xs text-muted-foreground">
                  Select the purpose and date for your visit to the district office.
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
                      <SelectItem value="document-preparation">Document Preparation</SelectItem>
                      <SelectItem value="legal-advice">Legal Advice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-primary uppercase">Select a Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary pointer-events-none" />
                    <Input 
                      type="date"
                      min={today}
                      className="w-full bg-white border-primary/20 h-11 pl-10 pr-3 focus-visible:ring-primary/20"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Please note: Office hours are Monday to Friday, 8:00 AM - 5:00 PM.</p>
                </div>

                <Button 
                  className="w-full h-12 bg-primary hover:bg-[#1A3B6B] text-white font-bold transition-all shadow-md active:scale-95"
                  disabled={!date || isSubmitting}
                  onClick={handleBooking}
                >
                  {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Confirm Appointment"}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-[#EBF2FA]">
              <CardHeader className="pb-2 flex-row items-start gap-2 space-y-0">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <CardTitle className="text-lg font-bold text-primary">PAO Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-primary">1. Eligibility Check</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Services are reserved for indigent citizens. A merit and indigency test will be conducted.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-primary">2. Required Documents</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Bring a valid government ID and a Certificate of Indigency from your Barangay.
                    </p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/60 p-3 rounded-lg flex gap-3 border border-primary/5">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-primary">Free Service</p>
                      <p className="text-[10px] text-muted-foreground">All PAO legal services are provided free of charge.</p>
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
    <Suspense fallback={<div>Loading Scheduler...</div>}>
      <BookAppointmentContent />
    </Suspense>
  );
}
