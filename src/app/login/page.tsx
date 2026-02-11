
"use client";

import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useAuth, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, User as UserIcon, Briefcase } from "lucide-react";

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

      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const role = userDoc.data().role;
        toast({ title: "Login successful", description: `Welcome back, ${userDoc.data().email || 'User'}` });
        router.push(`/dashboard/${role}`);
      } else {
        throw new Error("User record not found in database.");
      }
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
      admin: { email: "admin@lexconnect.com", password: "password123" },
      lawyer: { email: "lawyer@lexconnect.com", password: "password123" },
      client: { email: "client@lexconnect.com", password: "password123" }
    };
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
    toast({
      title: "Demo Credentials Loaded",
      description: `Loaded credentials for ${role} role. Click sign in to continue.`,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground">Professional Legal Access Simplified</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold">Sign In</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to access your secure portal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="focus-visible:ring-secondary"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="p-0 h-auto text-xs text-secondary hover:text-secondary/80">
                    Forgot password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="focus-visible:ring-secondary"
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 transition-all h-11" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Login to Portal"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 border-t pt-6 bg-muted/20">
            <p className="text-[10px] text-center uppercase tracking-widest text-muted-foreground font-semibold">
              Select a role for quick access
            </p>
            <div className="grid grid-cols-3 gap-2 w-full text-[10px] text-center uppercase tracking-widest text-muted-foreground font-semibold">
              <button 
                type="button"
                onClick={() => handleQuickAccess('admin')}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-primary/5 rounded-lg transition-colors group"
              >
                <ShieldCheck className="h-4 w-4 group-hover:text-primary transition-colors" />
                <span className="group-hover:text-primary transition-colors">Admin</span>
              </button>
              <button 
                type="button"
                onClick={() => handleQuickAccess('lawyer')}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-secondary/5 rounded-lg transition-colors group"
              >
                <Briefcase className="h-4 w-4 group-hover:text-secondary transition-colors" />
                <span className="group-hover:text-secondary transition-colors">Lawyer</span>
              </button>
              <button 
                type="button"
                onClick={() => handleQuickAccess('client')}
                className="flex flex-col items-center space-y-1 p-2 hover:bg-secondary/5 rounded-lg transition-colors group"
              >
                <UserIcon className="h-4 w-4 group-hover:text-secondary transition-colors" />
                <span className="group-hover:text-secondary transition-colors">Client</span>
              </button>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Button 
            variant="link" 
            className="p-0 h-auto text-secondary font-semibold"
            onClick={() => router.push("/register")}
          >
            Register as Client
          </Button>
        </p>
      </div>
    </div>
  );
}
