
"use client";

import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, Briefcase, Phone, Mail, ArrowRight, Lock } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { sendOtpSms } from "@/ai/flows/sms-service";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // OTP States for Client Login
  const [useOtp, setUseOtp] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [otpValue, setOtpValue] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isSmsSending, setIsLoadingSms] = useState(false);

  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const logo = PlaceHolderImages.find(img => img.id === 'pao-logo');

  useEffect(() => {
    if (auth.currentUser && !isLoading) {
      checkAndInitializeUser(auth.currentUser);
    }
  }, [auth.currentUser]);

  const checkAndInitializeUser = async (user: any) => {
    setIsLoading(true);
    try {
      const normalizedEmail = user.email?.toLowerCase() || "";
      const isBootstrapAdmin = normalizedEmail === "admin@epao.com";

      const adminDocRef = doc(db, "roleAdmin", user.uid);
      const adminDoc = await getDoc(adminDocRef);
      
      if (isBootstrapAdmin || adminDoc.exists()) {
        router.push(`/dashboard/admin`);
        return;
      }

      const lawyerAuthDoc = await getDoc(doc(db, "lawyersEmail", normalizedEmail));
      const isAuthorizedLawyer = lawyerAuthDoc.exists() || normalizedEmail.endsWith("@lawyers.com");

      if (isAuthorizedLawyer) {
        router.push(`/dashboard/lawyer`);
        return;
      }

      router.push(`/dashboard/client`);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Sync Error", description: "Failed to synchronize your role records." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    const mobile = identifier.trim();
    if (!/^\d{10,11}$/.test(mobile)) {
      toast({ variant: "destructive", title: "Invalid Number", description: "Enter your 10-11 digit mobile number." });
      return;
    }

    setIsLoadingSms(true);
    try {
      const result = await sendOtpSms(mobile);
      if (result.success) {
        setGeneratedOtp(result.code);
        setStep(2);
        toast({ title: "Verification Code Sent", description: `Check your SMS for the code. (Debug: ${result.code})` });
      }
    } catch (error) {
      toast({ variant: "destructive", title: "SMS Error", description: "Could not send verification code." });
    } finally {
      setIsLoadingSms(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      let finalIdentifier = identifier.trim();
      let finalPassword = password;

      if (/^\d{10,11}$/.test(finalIdentifier)) {
        finalIdentifier = `${finalIdentifier}@epao.mobile`;
        
        // If using OTP login for client
        if (useOtp) {
          if (otpValue !== generatedOtp) {
            throw new Error("Invalid verification code.");
          }
          finalPassword = "password123"; 
        }
      }

      const userCredential = await signInWithEmailAndPassword(auth, finalIdentifier, finalPassword);
      await checkAndInitializeUser(userCredential.user);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Login failed", description: error.message });
      setIsLoading(false);
    }
  };

  const handleQuickAccess = (role: 'admin' | 'lawyer' | 'client') => {
    const demoAccounts = {
      admin: { email: "admin@epao.com", password: "password123" },
      lawyer: { email: "lawyer@lawyers.com", password: "password123" },
      client: { email: "09123456789", password: "password123" }
    };
    setIdentifier(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
    setUseOtp(false);
    setStep(1);
  };

  return (
    <DashboardLayout role={null}>
      <div className="flex items-center justify-center py-12">
        <div className="w-full max-w-lg">
          <Card className="shadow-2xl border-primary/10 bg-white/80 backdrop-blur-md overflow-hidden">
            <CardHeader className="flex flex-col items-center space-y-4 pb-2">
              {logo && (
                <div className="p-3 bg-white rounded-full shadow-sm border border-border/50">
                  <Image 
                    src={logo.imageUrl} 
                    alt={logo.description} 
                    width={100} 
                    height={100} 
                    className="rounded-full object-contain"
                    data-ai-hint={logo.imageHint}
                  />
                </div>
              )}
              <CardTitle className="text-2xl text-center font-headline text-primary">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {step === 1 ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="identifier">Email or Mobile Number</Label>
                      <div className="relative">
                        <Input 
                          id="identifier" 
                          type="text" 
                          value={identifier} 
                          onChange={(e) => setIdentifier(e.target.value)} 
                          required 
                          placeholder="09123456789 or name@example.com" 
                        />
                      </div>
                    </div>

                    {!useOtp ? (
                      <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                      </div>
                    ) : null}

                    <Button type="submit" className="w-full bg-primary" disabled={isLoading || useOtp}>
                      {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Login"}
                    </Button>

                    {/^\d{10,11}$/.test(identifier.trim()) && (
                      <div className="pt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full border-secondary text-secondary hover:bg-secondary/5"
                          onClick={() => { setUseOtp(true); handleSendOtp(); }}
                          disabled={isSmsSending}
                        >
                          {isSmsSending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Phone className="mr-2 h-4 w-4" />}
                          Login with SMS Verification
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4 animate-in fade-in zoom-in-95">
                    <div className="text-center space-y-2">
                      <p className="text-sm font-medium">Verify your number</p>
                      <p className="text-xs text-muted-foreground">{identifier}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otp">6-Digit Code</Label>
                      <Input 
                        id="otp" 
                        value={otpValue} 
                        onChange={(e) => setOtpValue(e.target.value)} 
                        maxLength={6}
                        className="text-center text-xl font-bold tracking-widest"
                        required 
                      />
                    </div>
                    <Button type="submit" className="w-full bg-secondary text-white" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Verify & Sign In"}
                    </Button>
                    <Button variant="ghost" type="button" className="w-full text-xs" onClick={() => { setStep(1); setUseOtp(false); }}>
                      Back to password login
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/80 px-2 text-muted-foreground font-bold">Quick Access</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 w-full">
                <Button variant="outline" size="sm" onClick={() => handleQuickAccess('admin')} className="text-xs">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Admin
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAccess('lawyer')} className="text-xs">
                  <Briefcase className="mr-1 h-3 w-3" /> Lawyer
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAccess('client')} className="text-xs">
                  <Phone className="mr-1 h-3 w-3" /> Client
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
