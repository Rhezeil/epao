
"use client";

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Mail, Phone, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { sendOtpSms } from "@/ai/flows/sms-service";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [regMode, setRegMode] = useState<"client" | "lawyer">("client");
  
  // OTP States
  const [step, setStep] = useState<1 | 2>(1);
  const [otpValue, setOtpValue] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isSmsSending, setIsLoadingSms] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const logo = PlaceHolderImages.find(img => img.id === 'pao-logo');

  const handleSendOtp = async () => {
    if (!/^\d{10,11}$/.test(mobileNumber)) {
      toast({ variant: "destructive", title: "Invalid Number", description: "Enter a valid 10-11 digit mobile number." });
      return;
    }

    setIsLoadingSms(true);
    try {
      const result = await sendOtpSms(mobileNumber);
      if (result.success) {
        setGeneratedOtp(result.code);
        setStep(2);
        toast({ title: "Mock SMS Received", description: result.message });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "SMS Failed", description: "Could not send verification code." });
    } finally {
      setIsLoadingSms(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (regMode === "client" && otpValue !== generatedOtp) {
      toast({ variant: "destructive", title: "Invalid Code", description: "The verification code you entered is incorrect." });
      return;
    }

    setIsLoading(true);

    try {
      let authEmail = regMode === "client" ? `${mobileNumber}@epao.mobile` : email.toLowerCase();
      const normalizedEmail = authEmail;
      
      const lawyerAuthDoc = await getDoc(doc(db, "lawyersEmail", normalizedEmail));
      const isAuthorizedLawyerByEmail = lawyerAuthDoc.exists();

      const userCredential = await createUserWithEmailAndPassword(auth, normalizedEmail, password);
      const user = userCredential.user;

      const isSystemAdmin = normalizedEmail === "admin@epao.com";
      const isLawyer = isAuthorizedLawyerByEmail || normalizedEmail.endsWith("@lawyers.com");

      let userRole: "admin" | "lawyer" | "client" = "client";
      if (isSystemAdmin) userRole = "admin";
      else if (isLawyer) userRole = "lawyer";

      // Initialize Profile Document
      const profileDocRef = doc(db, "users", user.uid, "profile", "profile");
      setDocumentNonBlocking(profileDocRef, {
        id: "profile",
        firstName,
        lastName,
        phoneNumber: regMode === "client" ? mobileNumber : "",
        createdAt: new Date().toISOString(),
      }, { merge: true });

      if (userRole === "admin") {
        // Corrected: Using 'admins' collection to match rules and login
        setDocumentNonBlocking(doc(db, "admins", user.uid), {
          id: user.uid,
          email: user.email,
          role: "admin",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } else if (userRole === "lawyer") {
        setDocumentNonBlocking(doc(db, "roleLawyer", user.uid), {
          id: user.uid,
          email: user.email,
          role: "lawyer",
          profileId: "profile",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } else {
        // Initialize Top-level Client User Document with sync-ready fields
        setDocumentNonBlocking(doc(db, "users", user.uid), {
          id: user.uid,
          mobileNumber: mobileNumber,
          email: user.email,
          role: "client",
          fullName: `${firstName} ${lastName}`.trim(),
          profileId: "profile",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      toast({ title: "Account created", description: `Registered as ${userRole}.` });
      setTimeout(() => router.push(`/dashboard/${userRole}`), 1000);

    } catch (error: any) {
      toast({ variant: "destructive", title: "Registration failed", description: error.message });
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout role={null}>
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-md space-y-6">
          <Card className="w-full shadow-2xl border-primary/10 bg-white/80 backdrop-blur-md">
            <CardHeader className="flex flex-col items-center space-y-4">
              {logo && (
                <div className="p-2 bg-white rounded-full shadow-lg border border-border/50">
                  <Image 
                    src={logo.imageUrl} 
                    alt={logo.description} 
                    width={80} 
                    height={80} 
                    className="rounded-full object-contain"
                    data-ai-hint={logo.imageHint}
                  />
                </div>
              )}
              <CardTitle className="text-center font-headline text-primary">Create Account</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="client" className="w-full mb-6" onValueChange={(v) => {
                setRegMode(v as any);
                setStep(1);
              }}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="client" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Client
                  </TabsTrigger>
                  <TabsTrigger value="lawyer" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" /> Lawyer
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              <form onSubmit={handleRegister} className="space-y-4">
                {step === 1 ? (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                      </div>
                    </div>

                    {regMode === "client" ? (
                      <div className="space-y-2">
                        <Label htmlFor="mobileNumber">Mobile Number</Label>
                        <Input 
                          id="mobileNumber" 
                          type="tel" 
                          placeholder="09123456789"
                          value={mobileNumber} 
                          onChange={(e) => setMobileNumber(e.target.value)} 
                          required 
                        />
                        <Button 
                          type="button" 
                          className="w-full mt-2 bg-secondary" 
                          onClick={handleSendOtp}
                          disabled={isSmsSending}
                        >
                          {isSmsSending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                          Send Verification Code
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Label htmlFor="email">Work Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <div className="space-y-2 pt-2">
                          <Label htmlFor="password">Password</Label>
                          <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <Button type="submit" className="w-full mt-4" disabled={isLoading}>
                          {isLoading ? "Creating Account..." : "Register"}
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                    <div className="p-3 bg-secondary/10 rounded-lg flex items-center gap-3 border border-secondary/20">
                      <CheckCircle2 className="h-5 w-5 text-secondary" />
                      <p className="text-xs text-secondary font-medium">Verify your mobile: {mobileNumber}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Verification Code</Label>
                      <Input 
                        id="otp" 
                        placeholder="Enter 6-digit code"
                        value={otpValue} 
                        onChange={(e) => setOtpValue(e.target.value)} 
                        maxLength={6}
                        className="text-center text-lg tracking-[0.5em] font-bold"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Set Password</Label>
                      <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
                      {isLoading ? "Finalizing..." : "Verify & Complete Registration"}
                    </Button>
                    <Button variant="ghost" type="button" className="w-full text-xs" onClick={() => setStep(1)}>
                      Back to edit number
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full text-primary" onClick={() => router.push("/login")}>Back to Login</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
