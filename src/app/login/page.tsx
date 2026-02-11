
"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      let role = null;

      // 1. Check roleAdmin first
      const adminDocRef = doc(db, "roleAdmin", user.uid);
      const adminDoc = await getDoc(adminDocRef);
      if (adminDoc.exists()) {
        role = "admin";
      }

      // 2. Check roleLawyer
      if (!role) {
        const lawyerDocRef = doc(db, "roleLawyer", user.uid);
        const lawyerDoc = await getDoc(lawyerDocRef);
        if (lawyerDoc.exists()) {
          role = "lawyer";
        }
      }

      // 3. Check standard users (Clients)
      if (!role) {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          role = "client";
        }
      }

      // --- AUTO-INITIALIZATION LOGIC ---
      
      // Bootstrap Admin check (by UID or specific email)
      const isBootstrapAdmin = 
        user.uid === "fs4k8QifPHSmUdshxh1NLweHSj73" || 
        email.toLowerCase() === "admin@epao.com";

      if (!role && isBootstrapAdmin) {
        role = "admin";
        const adminDocRef = doc(db, "roleAdmin", user.uid);
        setDocumentNonBlocking(adminDocRef, {
          id: user.uid,
          email: user.email,
          role: "admin",
          firstName: "System",
          lastName: "Administrator",
          permission: "read/write",
          createdAt: new Date().toISOString(),
        }, { merge: true });
        toast({ title: "Admin Records Initialized" });
      } 
      
      // Lawyer check (by UID or Email Whitelist)
      if (!role) {
        const normalizedEmail = user.email?.toLowerCase() || "";
        const lawyerAuthRef = doc(db, "lawyersEmail", normalizedEmail);
        const lawyerAuthDoc = await getDoc(lawyerAuthRef);
        
        const isAuthorizedLawyer = 
          lawyerAuthDoc.exists() || 
          user.uid === "ygkXuNUWJrbffovhXBtr6r1o5vr2" ||
          normalizedEmail.endsWith("@lawyers.com");
        
        if (isAuthorizedLawyer) {
          role = "lawyer";
          const lawyerDocRef = doc(db, "roleLawyer", user.uid);
          const profileDocRef = doc(db, "users", user.uid, "profile", "profile");
          
          setDocumentNonBlocking(lawyerDocRef, {
            id: user.uid,
            email: user.email,
            role: "lawyer",
            profileId: "profile",
            createdAt: new Date().toISOString(),
          }, { merge: true });

          setDocumentNonBlocking(profileDocRef, {
            id: "profile",
            firstName: "Authorized",
            lastName: "Practitioner",
            createdAt: new Date().toISOString(),
          }, { merge: true });

          toast({ title: "Lawyer Records Initialized" });
        }
      }

      // If still no role, default to client and create standard record
      if (!role) {
        role = "client";
        const userDocRef = doc(db, "users", user.uid);
        const profileDocRef = doc(db, "users", user.uid, "profile", "profile");

        setDocumentNonBlocking(userDocRef, {
          id: user.uid,
          email: user.email,
          role: "client",
          profileId: "profile",
          createdAt: new Date().toISOString(),
        }, { merge: true });

        setDocumentNonBlocking(profileDocRef, {
          id: "profile",
          firstName: "New",
          lastName: "Client",
          createdAt: new Date().toISOString(),
        }, { merge: true });
        
        toast({ title: "Client Account Initialized" });
      }

      // Redirect based on resolved role
      router.push(`/dashboard/${role}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickAccess = (role: 'admin' | 'lawyer' | 'client') => {
    const demoAccounts = {
      admin: { email: "Admin@ePAO.com", password: "654321" },
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
          <h2 className="text-4xl font-bold text-primary">LexConnect</h2>
          <p className="text-muted-foreground mt-2">Legal Services Management Portal</p>
        </div>

        <Card>
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
                <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 w-full">
              <Button variant="outline" size="sm" onClick={() => handleQuickAccess('admin')}>Admin</Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickAccess('lawyer')}>Lawyer</Button>
              <Button variant="outline" size="sm" onClick={() => handleQuickAccess('client')}>Client</Button>
            </div>
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Button variant="link" className="p-0 h-auto" onClick={() => router.push("/register")}>Register Now</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
