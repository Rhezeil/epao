
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
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const db = useFirestore();

  const logo = PlaceHolderImages.find(img => img.id === 'pao-logo');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const normalizedEmail = email.toLowerCase();
      
      const lawyerAuthDoc = await getDoc(doc(db, "lawyersEmail", normalizedEmail));
      const isAuthorizedLawyerByEmail = lawyerAuthDoc.exists();

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const isSystemAdmin = 
        normalizedEmail === "admin@epao.com" || 
        user.uid === "fs4k8QifPHSmUdshxh1NLweHSj73";
      
      const isLawyer = 
        isAuthorizedLawyerByEmail || 
        user.uid === "ygkXuNUWJrbffovhXBtr6r1o5vr2" ||
        normalizedEmail.endsWith("@lawyers.com");

      let userRole: "admin" | "lawyer" | "client" = "client";
      if (isSystemAdmin) userRole = "admin";
      else if (isLawyer) userRole = "lawyer";

      const profileDocRef = doc(db, "users", user.uid, "profile", "profile");
      setDocumentNonBlocking(profileDocRef, {
        id: "profile",
        firstName,
        lastName,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      if (userRole === "admin") {
        const adminDocRef = doc(db, "roleAdmin", user.uid);
        setDocumentNonBlocking(adminDocRef, {
          id: user.uid,
          email: user.email,
          role: "admin",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } else if (userRole === "lawyer") {
        const lawyerDocRef = doc(db, "roleLawyer", user.uid);
        setDocumentNonBlocking(lawyerDocRef, {
          id: user.uid,
          email: user.email,
          role: "lawyer",
          profileId: "profile",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } else {
        const userDocRef = doc(db, "users", user.uid);
        setDocumentNonBlocking(userDocRef, {
          id: user.uid,
          email: user.email,
          role: "client",
          profileId: "profile",
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      }

      toast({ title: "Account created", description: `Registered as ${userRole}.` });
      setTimeout(() => router.push(`/dashboard/${userRole}`), 1000);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-transparent">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-center">
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
        </div>
        <Card className="w-full shadow-2xl border-primary/10 bg-white/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="text-center font-headline text-primary">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
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
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 shadow-md" disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Register"}
              </Button>
            </form>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-primary" onClick={() => router.push("/login")}>Back to Login</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
