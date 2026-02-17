"use client";

import { useAuth, useFirestore, useUser, useDoc, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Lock, Phone, Mail } from "lucide-react";

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  
  // Use user's role from AuthContext
  const { role } = useAuth();

  // Memoize the document reference for the profile
  const profileDocRef = useMemoFirebase(() => {
    if (!db || !user) return null;
    return doc(db, "users", user.uid, "profile", "profile");
  }, [db, user]);

  // Subscribe to real-time updates for the profile
  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileDocRef);

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
  });

  // Sync form state when data is loaded from Firestore
  useEffect(() => {
    if (profileData) {
      setFormState({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        phoneNumber: profileData.phoneNumber || "",
        address: profileData.address || "",
      });
    }
  }, [profileData]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileDocRef || !user || !db) return;

    // Use non-blocking write pattern for sub-profile
    setDocumentNonBlocking(profileDocRef, {
      ...formState,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Sync with top-level user document for directory visibility
    const userRef = doc(db, "users", user.uid);
    updateDocumentNonBlocking(userRef, {
      fullName: `${formState.firstName} ${formState.lastName}`.trim(),
      mobileNumber: formState.phoneNumber
    });

    toast({ 
      title: "Update initiated", 
      description: "Your information is being saved." 
    });
  };

  if (!role) return null;

  const isClient = role === 'client';

  return (
    <DashboardLayout role={role}>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Account Settings</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences.</p>
        </div>

        <Card className="bg-white/50 backdrop-blur-sm border-primary/10 shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile details and contact information.</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="grid gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    className="bg-white/60"
                    value={formState.firstName} 
                    onChange={(e) => setFormState({...formState, firstName: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    className="bg-white/60"
                    value={formState.lastName} 
                    onChange={(e) => setFormState({...formState, lastName: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label className="flex items-center gap-1">
                    {isClient ? <Phone className="h-3 w-3" /> : <Mail className="h-3 w-3" />}
                    {isClient ? "Mobile Identifier" : "Email Address"}
                  </Label>
                  <Input 
                    className="bg-muted/50"
                    value={isClient ? (formState.phoneNumber || user?.email?.split('@')[0]) : (user?.email || "")} 
                    disabled 
                  />
                  <p className="text-[10px] text-muted-foreground">Identity identifier cannot be changed.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Contact Number</Label>
                  <Input 
                    id="phone" 
                    className="bg-white/60"
                    value={formState.phoneNumber} 
                    onChange={(e) => setFormState({...formState, phoneNumber: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  className="bg-white/60"
                  value={formState.address} 
                  onChange={(e) => setFormState({...formState, address: e.target.value})} 
                />
              </div>

              <Button type="submit" className="w-fit bg-secondary hover:bg-secondary/90 shadow-md">
                Save Profile Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-destructive/20 bg-white/50 backdrop-blur-sm shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-destructive">
              <Shield className="h-5 w-5 mr-2" />
              Security
            </CardTitle>
            <CardDescription>Manage your password and authentication methods.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border">
              <div className="flex items-center space-x-3">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-bold">Password</p>
                  <p className="text-xs text-muted-foreground">Update your account password</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-primary/20 hover:bg-primary/5">Update Password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
