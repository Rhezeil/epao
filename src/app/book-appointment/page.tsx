
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarIcon, Clock, CheckCircle, ArrowRight, Loader2, ShieldCheck, User } from "lucide-react";
import { useFirestore, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { format } from "date-fns";

function BookAppointmentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const db = useFirestore();
  
  const caseTypeParam = searchParams.get("caseType") || "Initial Consultation";
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [date, setDate] = useState("");
  const [guestInfo, setGuestInfo] = useState({ name: "", mobile: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refCode, setRefCode] = useState<string | null>(null);

  const handleBooking = async () => {
    if (!db || !date || !guestInfo.name || !guestInfo.mobile) return;
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
      date: new Date(date).toISOString(),
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

  const today = new Date().toISOString().split('T')[0];

  return (
    <DashboardLayout role={null}>
      <div className="max-w-4xl mx-auto space-y-8 py-4">
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
          <CardContent className="p-10 space-y-8">
            {step === 1 ? (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="space-y-4">
                  <Label className="text-xs font-black text-primary/60 uppercase tracking-widest ml-1">Select Available Date</Label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary opacity-40 pointer-events-none" />
                    <Input 
                      type="date"
                      min={today}
                      className="h-16 pl-12 rounded-2xl border-primary/20 bg-white text-lg font-bold"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-3">
                    <Clock className="h-5 w-5 text-amber-500" />
                    <p className="text-xs text-amber-900 font-bold">Note: PAO offices are closed on weekends and public holidays.</p>
                  </div>
                </div>
                <Button 
                  disabled={!date} 
                  onClick={() => setStep(2)} 
                  className="w-full h-16 rounded-2xl text-lg font-black bg-primary hover:bg-[#1A3B6B] shadow-lg"
                >
                  Continue to Contact Info <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
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
                      <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-primary opacity-40" />
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
                    <span>{format(new Date(date), "PPP")}</span>
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
