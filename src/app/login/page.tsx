
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
import { Loader2, ShieldCheck, Briefcase, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(true);
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
      
      const isBootstrapAdmin = 
        user.uid === "fs4k8QifPHSmUdshxh1NLweHSj73" || 
        normalizedEmail === "admin@epao.com";

      const adminDocRef = doc(db, "roleAdmin", user.uid);
      const adminDoc = await getDoc(adminDocRef);
      
      if (isBootstrapAdmin || adminDoc.exists()) {
        setDocumentNonBlocking(adminDocRef, {
          id: user.uid,
          email: user.email,
          role: "admin",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        router.push(`/dashboard/admin`);
        return;
      }

      const lawyerAuthDoc = await getDoc(doc(db, "lawyersEmail", normalizedEmail));
      const isAuthorizedLawyer = 
        lawyerAuthDoc.exists() || 
        user.uid === "ygkXuNUWJrbffovhXBtr6r1o5vr2" ||
        normalizedEmail.endsWith("@lawyers.com");

      if (isAuthorizedLawyer) {
        const lawyerDocRef = doc(db, "roleLawyer", user.uid);
        setDocumentNonBlocking(lawyerDocRef, {
          id: user.uid,
          email: user.email,
          role: "lawyer",
          profileId: "profile",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        
        setDocumentNonBlocking(doc(db, "users", user.uid, "profile", "profile"), {
          id: "profile",
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        router.push(`/dashboard/lawyer`);
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      setDocumentNonBlocking(userDocRef, {
        id: user.uid,
        email: user.email,
        role: "client",
        profileId: "profile",
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setDocumentNonBlocking(doc(db, "users", user.uid, "profile", "profile"), {
        id: "profile",
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      router.push(`/dashboard/client`);

    } catch (error: any) {
      console.error("Initialization error", error);
      toast({ 
        variant: "destructive", 
        title: "Sync Error", 
        description: "Failed to synchronize your role records." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await checkAndInitializeUser(userCredential.user);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  const handleQuickAccess = (role: 'admin' | 'lawyer' | 'client') => {
    const demoAccounts = {
      admin: { email: "admin@epao.com", password: "password123" },
      lawyer: { email: "lawyer@lawyers.com", password: "password123" },
      client: { email: "client@gmail.com", password: "password123" }
    };
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
    setShowRegister(role === 'client');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <div className="w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-4">
          {logo && (
            <div className="p-2 bg-white rounded-full shadow-lg border border-border/50">
              <Image 
                src={logo.imageUrl} 
                alt={logo.description} 
                width={160} 
                height={160} 
                className="rounded-full object-contain"
                data-ai-hint={logo.imageHint}
              />
            </div>
          )}
          <p className="text-primary font-bold text-lg tracking-widest uppercase">Legal Portal</p>
        </div>

        <Card className="shadow-2xl border-primary/10 bg-white/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl text-center font-headline text-primary">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" className="bg-white/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="bg-white/50" />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-md" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "Login"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Quick Access</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => handleQuickAccess('admin')} className="bg-white/50 hover:bg-primary/5">
                <ShieldCheck className="mr-1 h-3 w-3" /> Admin
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickAccess('lawyer')} className="bg-white/50 hover:bg-primary/5">
                <Briefcase className="mr-1 h-3 w-3" /> Lawyer
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickAccess('client')} className="bg-white/50 hover:bg-primary/5">
                <UserIcon className="mr-1 h-3 w-3" /> Client
              </Button>
            </div>
            {showRegister && (
              <div className="text-center text-sm pt-4">
                <span className="text-muted-foreground">Don't have an account? </span>
                <Button variant="link" className="p-0 h-auto text-secondary" onClick={() => router.push("/register")}>Register Now</Button>
              </div>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
