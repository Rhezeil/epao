
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Info, CheckCircle2, Loader2, CheckCircle, Calendar as CalendarIcon, Gavel, FileText, CalendarCheck } from "lucide-react";
import { useState, Suspense } from "react";
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

  // Purpose to Service mapping for alignment
  const getServiceLabel = (p: string) => {
    switch (p) {
      case 'consultation': return 'Case Consultation';
      case 'notarization': return 'Document Notarization';
      case 'document-preparation': return 'Document Preparation';
      case 'legal-advice': return 'Legal Advice';
      default: return 'General Service';
    }
  };

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
      serviceType: getServiceLabel(purpose),
      date: new Date(date).toISOString(),
      status: "pending",
      createdAt: new Date().toISOString()
    };

    setDocumentNonBlocking(apptRef, appointmentData, { merge: true });
    
    // Simulate slight delay for UI feedback
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
              <p className="text-muted-foreground font-medium">Your appointment has been successfully scheduled.</p>
            </div>
            <div className="bg-[#F0F4F8] p-6 rounded-3xl space-y-2 border-2 border-dashed border-primary/10">
              <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Your Reference Code</p>
              <p className="text-4xl font-black text-primary tracking-tighter">{bookedRef}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Please save this code to manage your appointment later.</p>
            </div>
            <Button className="w-full h-12 rounded-2xl font-bold" onClick={() => router.push("/case-navigator")}>
              Return to Navigator
            </Button>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-2">
            <CalendarIcon className="h-6 w-6" />
          </div>
          <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Schedule Your Visit</h1>
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
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">Purpose of Visit</Label>
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

                  <div className="space-y-2">
                    <Label className="text-xs font-black text-primary/60 uppercase tracking-widest">Preferred Date</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary pointer-events-none opacity-50" />
                      <Input 
                        type="date"
                        min={today}
                        className="w-full bg-white border-primary/20 h-12 pl-12 rounded-xl font-bold focus-visible:ring-primary/20"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em]">Service Alignment</p>
                    <p className="text-sm font-bold text-primary">Office Service: <span className="text-secondary">{getServiceLabel(purpose)}</span></p>
                  </div>
                  <CheckCircle2 className="h-6 w-6 text-secondary" />
                </div>

                <div className="pt-4">
                  <Button 
                    className="w-full h-14 bg-primary hover:bg-[#1A3B6B] text-white text-lg font-black rounded-2xl shadow-lg transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3"
                    disabled={!date || isSubmitting}
                    onClick={handleBooking}
                  >
                    {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : (
                      <>
                        <CalendarCheck className="h-6 w-6" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                  <p className="text-[10px] text-center text-muted-foreground mt-4 font-bold uppercase tracking-widest">
                    Standard PAO Office Hours: Mon-Fri, 8:00 AM - 5:00 PM
                  </p>
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
                <CardTitle className="text-lg font-bold text-amber-900">Pre-Visit Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-amber-200 flex items-center justify-center shrink-0 text-amber-900 text-[10px] font-black">1</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-amber-900">Eligibility Test</h4>
                      <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                        Be prepared for the Merit and Indigency Test. Bring ITR or Certificate of Indigency.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-6 w-6 rounded-full bg-amber-200 flex items-center justify-center shrink-0 text-amber-900 text-[10px] font-black">2</div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-black text-amber-900">Valid Identification</h4>
                      <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                        At least one government-issued ID is required for entry and official record filing.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 p-4 rounded-2xl border border-amber-200 shadow-sm flex items-center gap-3">
                  <Gavel className="h-6 w-6 text-amber-600" />
                  <p className="text-xs font-black text-amber-900 leading-tight">All PAO services are 100% FREE.</p>
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
