
"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, User as UserIcon, Briefcase, Loader2 } from "lucide-react";

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

      // Logic to determine role based on collection membership
      let role = null;

      // Check roles_admin first
      const adminDocRef = doc(db, "roles_admin", user.uid);
      const adminDoc = await getDoc(adminDocRef);
      
      if (adminDoc.exists()) {
        role = "admin";
      } else {
        // Check standard users collection
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          role = userDoc.data().role;
        }
      }

      // Auto-repair for bootstrap admin
      const isBootstrapAdmin = 
        email.toLowerCase() === "admin@epao.com" || 
        user.uid === "fs4k8QifPHSmUdshxh1NLweHSj73";

      if (!role && isBootstrapAdmin) {
        role = "admin";
        const adminDocRef = doc(db, "roles_admin", user.uid);
        setDocumentNonBlocking(adminDocRef, {
          id: user.uid,
          email: user.email,
          role: "admin",
          firstName: "System",
          lastName: "Administrator",
          permission: "read/write",
          createdAt: new Date().toISOString(),
        }, { merge: true });

        toast({ title: "Admin Records Initialized", description: "Your administrative record has been created." });
      } 
      
      // Auto-repair for authorized lawyers
      if (!role) {
        const emailId = user.email?.toLowerCase().replace(/[@.]/g, "_") || "";
        const lawyerAuthRef = doc(db, "lawyersEmail", emailId);
        const lawyerAuthDoc = await getDoc(lawyerAuthRef);
        
        if (lawyerAuthDoc.exists()) {
          role = "lawyer";
          const userDocRef = doc(db, "users", user.uid);
          const profileDocRef = doc(db, "users", user.uid, "profile", "profile");
          
          setDocumentNonBlocking(userDocRef, {
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

          toast({ title: "Lawyer Records Initialized", description: "Welcome back, your practitioner profile has been restored." });
        }
      }

      if (!role) {
        throw new Error("Your account record was not found. Please register if you haven't already.");
      }

      toast({ title: "Login successful", description: `Welcome back to the ${role} portal.` });
      router.push(`/dashboard/${role}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.message || "Please check your credentials.",
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
    toast({
      title: "Demo Credentials Loaded",
      description: `Credentials for ${role} loaded. Click Sign In to proceed.`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 font-body">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-4xl font-bold font-headline text-primary">LexConnect</h2>
          <p className="text-muted-foreground text-sm uppercase tracking-widest">Legal Portal Access</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to manage your legal workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@epao.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs text-secondary">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              <Button type="submit" className="w-full h-11 text-base font-semibold transition-all" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Login to Portal"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-6 bg-muted/10">
            <p className="text-[10px] text-center uppercase tracking-widest text-muted-foreground font-bold">
              Rapid Access Selectors
            </p>
            <div className="grid grid-cols-3 gap-2 w-full">
              <button 
                type="button"
                onClick={() => handleQuickAccess('admin')}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-primary/5 rounded-xl transition-all group"
              >
                <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-white transition-all">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">Admin</span>
              </button>
              <button 
                type="button"
                onClick={() => handleQuickAccess('lawyer')}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-secondary/5 rounded-xl transition-all group"
              >
                <div className="p-2 rounded-full bg-secondary/10 group-hover:bg-secondary group-hover:text-white transition-all">
                  <Briefcase className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">Lawyer</span>
              </button>
              <button 
                type="button"
                onClick={() => handleQuickAccess('client')}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-accent/5 rounded-xl transition-all group"
              >
                <div className="p-2 rounded-full bg-accent/10 group-hover:bg-accent group-hover:text-white transition-all">
                  <UserIcon className="h-5 w-5" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground">Client</span>
              </button>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          New to LexConnect?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-secondary font-bold hover:no-underline"
            onClick={() => router.push("/register")}
          >
            Create Client Account
          </Button>
        </p>
      </div>
    </div>
  );
}
