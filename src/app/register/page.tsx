
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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

      // Determine the role - grant admin to the specific requested email
      const isSystemAdmin = email.toLowerCase() === "admin@epao.com";
      const userRole = isSystemAdmin ? "admin" : "client";

      // Initialize the user document in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const profileDocRef = doc(db, "users", user.uid, "profile", "profile");
      
      setDocumentNonBlocking(userDocRef, {
        id: user.uid,
        email: user.email,
        role: userRole,
        profileId: "profile",
        createdAt: new Date().toISOString(),
      }, { merge: true });

      setDocumentNonBlocking(profileDocRef, {
        id: "profile",
        firstName: firstName,
        lastName: lastName,
        createdAt: new Date().toISOString(),
      }, { merge: true });

      // If they are an admin, we also need to add them to the roles_admin collection
      if (isSystemAdmin) {
        const adminDocRef = doc(db, "roles_admin", user.uid);
        setDocumentNonBlocking(adminDocRef, {
          id: user.uid,
          role: "admin",
          resource: "all",
          permission: "read/write",
        }, { merge: true });
      }

      toast({ 
        title: userRole === "admin" ? "Admin account created" : "Account created", 
        description: `Welcome to LexConnect! Redirecting to your ${userRole} dashboard...` 
      });

      // Redirect after a short delay
      setTimeout(() => {
        router.push(`/dashboard/${userRole}`);
      }, 1000);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "Could not create your account.",
      });
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
              Portal Registration
            </CardTitle>
            <CardDescription className="text-center">
              Create your secure account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="focus-visible:ring-secondary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="focus-visible:ring-secondary"
                  />
                </div>
              </div>
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
