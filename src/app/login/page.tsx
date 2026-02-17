"use client";

import React, { useState, useEffect, Suspense } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck, Briefcase, Phone, Mail, Lock, ArrowRight } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { sendOtpSms } from "@/ai/flows/sms-service";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

function LoginContent() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [useOtp, setUseOtp] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [otpValue, setOtpValue] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [isSmsSending, setIsLoadingSms] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const logo = PlaceHolderImages.find(img => img.id === 'pao-logo');
  const redirectPath = searchParams.get('redirect');

  useEffect(() => {
    if (auth.currentUser && !isLoading) {
      checkAndInitializeUser(auth.currentUser);
    }
  }, [auth.currentUser]);

  const checkAndInitializeUser = async (user: any) => {
    setIsLoading(true);
    try {
      const normalizedEmail = (user.email || "").toLowerCase().trim();
      const isBootstrapAdmin = normalizedEmail === "admin@epao.com";

      // 1. Check Admin Status (using 'admins' collection)
      const adminDocRef = doc(db, "admins", user.uid);
      const adminDoc = await getDoc(adminDocRef);
      
      if (isBootstrapAdmin || adminDoc.exists()) {
        if (!adminDoc.exists()) {
          setDocumentNonBlocking(adminDocRef, {
            id: user.uid,
            role: "admin",
            email: normalizedEmail,
            permission: "full",
            createdAt: new Date().toISOString()
          }, { merge: true });
        }
        router.push(redirectPath || `/dashboard/admin`);
        return;
      }

      // 2. Check Existing Lawyer Record
      const lawyerDocRef = doc(db, "roleLawyer", user.uid);
      const lawyerDoc = await getDoc(lawyerDocRef);
      const lawyerAuthDoc = await getDoc(doc(db, "lawyersEmail", normalizedEmail));
      const isAuthorizedLawyer = lawyerDoc.exists() || lawyerAuthDoc.exists() || normalizedEmail.endsWith("@lawyers.com");

      if (isAuthorizedLawyer) {
        if (!lawyerDoc.exists()) {
          setDocumentNonBlocking(lawyerDocRef, {
            id: user.uid,
            email: normalizedEmail,
            role: "lawyer",
            profileId: "profile",
            createdAt: new Date().toISOString()
          }, { merge: true });
        }
        router.push(redirectPath || `/dashboard/lawyer`);
        return;
      }

      // 3. Default to Client Status
      const clientDocRef = doc(db, "users", user.uid);
      const clientDoc = await getDoc(clientDocRef);
      
      if (!clientDoc.exists()) {
        setDocumentNonBlocking(clientDocRef, {
          id: user.uid,
          mobileNumber: normalizedEmail.split('@')[0],
          email: normalizedEmail,
          role: "client",
          profileId: "profile",
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      if (redirectPath) {
        router.push(decodeURIComponent(redirectPath));
      } else {
        router.push(`/dashboard/client`);
      }
    } catch (error: any) {
      toast({ 
        variant: "destructive", 
        title: "Access Error", 
        description: "Your account is active, but we couldn't verify your dashboard permissions." 
      });
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
        toast({ title: "Mock SMS Received", description: result.message });
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
      let errorMsg = error.message;
      if (error.code === 'auth/user-not-found') errorMsg = "Account not found. Please register first.";
      if (error.code === 'auth/wrong-password') errorMsg = "Incorrect password. Please try again.";
      
      toast({ variant: "destructive", title: "Login failed", description: errorMsg });
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
    toast({ title: `${role.toUpperCase()} selected`, description: "Click 'Sign In' to access the dashboard." });
  };

  return (
    <DashboardLayout role={null}>
      <div className="flex items-center justify-center py-8">
        <div className="w-full max-w-lg">
          <Card className="shadow-2xl border-primary/10 bg-white/80 backdrop-blur-md overflow-hidden rounded-[2.5rem]">
            <CardHeader className="flex flex-col items-center space-y-4 pb-2">
              {logo && (
                <div className="p-3 bg-white rounded-full shadow-lg border border-border/50">
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
              <CardTitle className="text-3xl text-center font-black text-primary tracking-tight">Portal Access</CardTitle>
              {redirectPath && (
                <div className="bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 flex items-center gap-2">
                  <Loader2 className="h-3 w-3 animate-spin text-primary" />
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Login required to proceed</p>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {step === 1 ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="identifier" className="text-xs font-black uppercase text-primary/60 ml-1">Email or Mobile Number</Label>
                      <div className="relative">
                        <Input 
                          id="identifier" 
                          type="text" 
                          value={identifier} 
                          onChange={(e) => setIdentifier(e.target.value)} 
                          required 
                          className="h-12 rounded-2xl border-primary/20 bg-white/50 focus-visible:ring-primary/20"
                          placeholder="09123456789 or name@example.com" 
                        />
                      </div>
                    </div>

                    {!useOtp ? (
                      <div className="space-y-2">
                        <Label htmlFor="password" title="Password" className="text-xs font-black uppercase text-primary/60 ml-1">Secure Password</Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                          <Input 
                            id="password" 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                            className="h-12 pl-12 rounded-2xl border-primary/20 bg-white/50 focus-visible:ring-primary/20"
                          />
                        </div>
                      </div>
                    ) : null}

                    <Button type="submit" className="w-full h-14 bg-primary text-white font-black text-lg rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-95" disabled={isLoading || useOtp}>
                      {isLoading ? <Loader2 className="animate-spin mr-2 h-6 w-6" /> : "Sign In"}
                    </Button>

                    {/^\d{10,11}$/.test(identifier.trim()) && !useOtp && (
                      <div className="pt-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="w-full h-12 border-2 border-secondary/30 text-secondary font-black rounded-2xl hover:bg-secondary/5"
                          onClick={() => { setUseOtp(true); handleSendOtp(); }}
                          disabled={isSmsSending}
                        >
                          {isSmsSending ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <Phone className="mr-2 h-4 w-4" />}
                          Access via SMS Code
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4 animate-in fade-in zoom-in-95">
                    <div className="text-center space-y-2 bg-primary/5 p-4 rounded-2xl">
                      <p className="text-xs font-black text-primary uppercase tracking-widest">Verify identity for</p>
                      <p className="text-sm font-bold text-primary">{identifier}</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="otp" className="text-xs font-black uppercase text-primary/60 ml-1">6-Digit Access Code</Label>
                      <Input 
                        id="otp" 
                        value={otpValue} 
                        onChange={(e) => setOtpValue(e.target.value)} 
                        maxLength={6}
                        className="h-16 text-center text-3xl font-black tracking-[0.5em] rounded-2xl border-secondary/30 text-secondary bg-white/50"
                        required 
                        autoFocus
                      />
                    </div>
                    <Button type="submit" className="w-full h-14 bg-secondary text-white font-black text-lg rounded-2xl shadow-xl" disabled={isLoading}>
                      {isLoading ? <Loader2 className="animate-spin mr-2 h-6 w-6" /> : "Verify & Sign In"}
                    </Button>
                    <Button variant="ghost" type="button" className="w-full text-xs font-bold text-muted-foreground hover:text-primary" onClick={() => { setStep(1); setUseOtp(false); }}>
                      Back to password login
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-6 pb-8">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-primary/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white/80 px-4 text-primary/40 font-black tracking-widest">Quick Demo Access</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 w-full">
                <Button variant="outline" size="sm" onClick={() => handleQuickAccess('admin')} className="text-[10px] font-black h-12 rounded-xl border-primary/5 hover:bg-primary/5 transition-all">
                  <ShieldCheck className="mr-1 h-3 w-3" /> Admin
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAccess('lawyer')} className="text-[10px] font-black h-12 rounded-xl border-primary/5 hover:bg-primary/5 transition-all">
                  <Briefcase className="mr-1 h-3 w-3" /> Lawyer
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleQuickAccess('client')} className="text-[10px] font-black h-12 rounded-xl border-primary/5 hover:bg-primary/5 transition-all">
                  <Phone className="mr-1 h-3 w-3" /> Client
                </Button>
              </div>
              <div className="text-center">
                <Button variant="link" onClick={() => router.push('/register')} className="text-xs font-bold text-primary flex items-center gap-1 mx-auto">
                  New citizen user? Create an account <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Auth Portal...</div>}>
      <LoginContent />
    </Suspense>
  );
}