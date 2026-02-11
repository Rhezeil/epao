
"use client";

import { useAuth, useFirestore, useUser, useDoc, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { doc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { User, Shield, Lock } from "lucide-react";

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
    if (!profileDocRef) return;

    // Use non-blocking write pattern
    setDocumentNonBlocking(profileDocRef, {
      ...formState,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    toast({ 
      title: "Update initiated", 
      description: "Your information is being saved." 
    });
  };

  if (!role) return null;

  return (
    <DashboardLayout role={role}>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline">Account Settings</h1>
          <p className="text-muted-foreground">Manage your personal information and preferences.</p>
        </div>

        <Card>
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
                    value={formState.firstName} 
                    onChange={(e) => setFormState({...formState, firstName: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={formState.lastName} 
                    onChange={(e) => setFormState({...formState, lastName: e.target.value})} 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" value={user?.email || ""} disabled />
                  <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={formState.phoneNumber} 
                    onChange={(e) => setFormState({...formState, phoneNumber: e.target.value})} 
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={formState.address} 
                  onChange={(e) => setFormState({...formState, address: e.target.value})} 
                />
              </div>

              <Button type="submit" className="w-fit bg-secondary hover:bg-secondary/90">
                Save Profile Changes
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-destructive/20">
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
              <Button variant="outline" size="sm">Update Password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
