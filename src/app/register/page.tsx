
"use client";

import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc } from "firebase/firestore";
import { useAuth, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, ArrowLeft } from "lucide-react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Initialize the user document in Firestore with the "client" role
      const userDocRef = doc(db, "users", user.uid);
      
      // Using non-blocking pattern as per guidelines
      setDocumentNonBlocking(userDocRef, {
        id: user.uid,
        email: user.email,
        role: "client",
        profileId: "profile",
        createdAt: new Date().toISOString(),
      }, { merge: true });

      toast({ 
        title: "Account created", 
        description: "Welcome to LexConnect! Redirecting to your dashboard..." 
      });

      // Navigation will be handled by the AuthProvider once the session is established
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Could not create your account.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <p className="text-muted-foreground font-medium uppercase tracking-widest text-[10px]">Step into LexConnect</p>
        </div>

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center font-bold flex items-center justify-center gap-2">
              <UserPlus className="h-6 w-6 text-primary" />
              Client Registration
            </CardTitle>
            <CardDescription className="text-center">
              Create your secure legal portal account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
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
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
                {isLoading ? "Creating Account..." : "Register Now"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full text-muted-foreground text-xs"
              onClick={() => router.push("/login")}
            >
              <ArrowLeft className="mr-2 h-3 w-3" />
              Back to Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
