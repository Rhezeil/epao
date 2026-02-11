
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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  useEffect(() => {
    if (auth.currentUser && !isLoading) {
      checkAndInitializeUser(auth.currentUser);
    }
  }, [auth.currentUser]);

  const checkAndInitializeUser = async (user: any) => {
    setIsLoading(true);
    try {
      const normalizedEmail = user.email?.toLowerCase() || "";
      let resolvedRole: "admin" | "lawyer" | "client" | null = null;

      // 1. Check for Admin status (highest priority)
      const isBootstrapAdmin = 
        user.uid === "fs4k8QifPHSmUdshxh1NLweHSj73" || 
        normalizedEmail === "admin@epao.com";

      const adminDoc = await getDoc(doc(db, "roleAdmin", user.uid));
      
      if (isBootstrapAdmin || adminDoc.exists()) {
        resolvedRole = "admin";
        setDocumentNonBlocking(doc(db, "roleAdmin", user.uid), {
          id: user.uid,
          email: user.email,
          role: "admin",
          firstName: adminDoc.exists() ? adminDoc.data()?.firstName : "System",
          lastName: adminDoc.exists() ? adminDoc.data()?.lastName : "Administrator",
          permission: "read/write",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        router.push(`/dashboard/admin`);
        return;
      }

      // 2. Check for Lawyer status (authorized email or domain)
      const lawyerAuthDoc = await getDoc(doc(db, "lawyersEmail", normalizedEmail));
      const isAuthorizedLawyer = 
        lawyerAuthDoc.exists() || 
        user.uid === "ygkXuNUWJrbffovhXBtr6r1o5vr2" ||
        normalizedEmail.endsWith("@lawyers.com");

      if (isAuthorizedLawyer) {
        resolvedRole = "lawyer";
        setDocumentNonBlocking(doc(db, "roleLawyer", user.uid), {
          id: user.uid,
          email: user.email,
          role: "lawyer",
          profileId: "profile",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
        
        // Ensure profile exists in users subcollection
        setDocumentNonBlocking(doc(db, "users", user.uid, "profile", "profile"), {
          id: "profile",
          firstName: "Authorized",
          lastName: "Practitioner",
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        router.push(`/dashboard/lawyer`);
        return;
      }

      // 3. Default to Client
      resolvedRole = "client";
      setDocumentNonBlocking(doc(db, "users", user.uid), {
        id: user.uid,
        email: user.email,
        role: "client",
        profileId: "profile",
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      setDocumentNonBlocking(doc(db, "users", user.uid, "profile", "profile"), {
        id: "profile",
        firstName: "New",
        lastName: "Client",
        updatedAt: new Date().toISOString(),
      }, { merge: true });

      router.push(`/dashboard/client`);
      toast({ title: "Account Synced", description: `Logged in as ${resolvedRole}.` });

    } catch (error: any) {
      console.error("Initialization error", error);
      toast({ 
        variant: "destructive", 
        title: "Sync Error", 
        description: "Failed to synchronize your role records. Please try again." 
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
      client: { email: "client@lexconnect.com", password: "password123" }
    };
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary font-headline">LexConnect</h2>
          <p className="text-muted-foreground mt-2">Legal Services Management Portal</p>
        </div>

        <Card className="shadow-lg border-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="name@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
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
                <span className="bg-background px-2 text-muted-foreground">Quick Access</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => handleQuickAccess('admin')}>
                <ShieldCheck className="mr-1 h-3 w-3" /> Admin
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickAccess('lawyer')}>
                <Briefcase className="mr-1 h-3 w-3" /> Lawyer
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickAccess('client')}>
                <UserIcon className="mr-1 h-3 w-3" /> Client
              </Button>
            </div>
            <div className="text-center text-sm pt-4">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button variant="link" className="p-0 h-auto text-secondary" onClick={() => router.push("/register")}>Register Now</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
