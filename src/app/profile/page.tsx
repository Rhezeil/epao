
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
import { User, Shield, Lock, Phone, Mail, Camera, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { role, loading: authLoading } = useAuth();

  // Memoize the document reference for the profile based on role
  const profileDocRef = useMemoFirebase(() => {
    if (!db || !user || !role) return null;
    if (role === 'lawyer') return doc(db, "roleLawyer", user.uid);
    if (role === 'admin') return doc(db, "admins", user.uid);
    return doc(db, "users", user.uid, "profile", "profile");
  }, [db, user, role]);

  const { data: profileData, isLoading: isProfileLoading } = useDoc(profileDocRef);

  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    address: "",
    photoUrl: ""
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profileData) {
      setFormState({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        phoneNumber: profileData.phoneNumber || profileData.contactNumber || profileData.mobileNumber || "",
        address: profileData.address || "",
        photoUrl: profileData.photoUrl || ""
      });
    }
  }, [profileData]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileDocRef || !user || !db || !role) return;

    setIsSaving(true);

    try {
      if (role === 'client') {
        // Sync client sub-profile and top-level doc
        setDocumentNonBlocking(profileDocRef, {
          ...formState,
          updatedAt: new Date().toISOString(),
        }, { merge: true });

        updateDocumentNonBlocking(doc(db, "users", user.uid), {
          fullName: `${formState.firstName} ${formState.lastName}`.trim(),
          mobileNumber: formState.phoneNumber,
          updatedAt: new Date().toISOString()
        });
      } else {
        // Direct role doc update for lawyers/admins
        updateDocumentNonBlocking(profileDocRef, {
          ...formState,
          updatedAt: new Date().toISOString(),
        });
      }

      toast({ 
        title: "Settings Updated", 
        description: "Your profile information has been saved successfully." 
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not save your changes. Please try again."
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || (isProfileLoading && !profileData)) {
    return (
      <DashboardLayout role={role}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading Profile Data...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!role) return null;

  return (
    <DashboardLayout role={role}>
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">
              {role === 'client' ? "Citizen Account Profile" : "Professional Profile"}
            </h1>
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">
              {role === 'client' ? "Manage your contact details for legal coordination" : "Manage your identity within LexConnect"}
            </p>
          </div>
          <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
            <AvatarImage src={formState.photoUrl} className="object-cover" />
            <AvatarFallback className="bg-primary/10 text-2xl font-black text-primary">
              {formState.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 p-8">
            <div className="flex items-center space-x-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-primary">Personal Details</CardTitle>
                <CardDescription className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Update your contact and identification data</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleUpdate} className="grid gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">First Name</Label>
                  <Input 
                    className="h-12 rounded-xl border-primary/10 bg-primary/5 focus-visible:ring-primary/20 font-bold"
                    value={formState.firstName} 
                    onChange={(e) => setFormState({...formState, firstName: e.target.value})} 
                    placeholder="Enter first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Last Name</Label>
                  <Input 
                    className="h-12 rounded-xl border-primary/10 bg-primary/5 focus-visible:ring-primary/20 font-bold"
                    value={formState.lastName} 
                    onChange={(e) => setFormState({...formState, lastName: e.target.value})} 
                    placeholder="Enter last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Account Email</Label>
                  <Input 
                    className="h-12 rounded-xl bg-muted/50 border-none font-bold text-muted-foreground"
                    value={user?.email || ""} 
                    disabled 
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Mobile / Contact Number</Label>
                  <Input 
                    className="h-12 rounded-xl border-primary/10 bg-primary/5 focus-visible:ring-primary/20 font-bold"
                    value={formState.phoneNumber} 
                    onChange={(e) => setFormState({...formState, phoneNumber: e.target.value})} 
                    placeholder="09XXXXXXXXX"
                  />
                </div>
                <div className="col-span-1 md:col-span-2 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Complete Home Address</Label>
                  <Input 
                    className="h-12 rounded-xl border-primary/10 bg-primary/5 focus-visible:ring-primary/20 font-bold"
                    value={formState.address} 
                    onChange={(e) => setFormState({...formState, address: e.target.value})} 
                    placeholder="House No., Street, Barangay, City"
                  />
                </div>
                {(role === 'lawyer' || role === 'admin') && (
                  <div className="col-span-1 md:col-span-2 space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 ml-1 flex items-center gap-2">
                      <Camera className="h-3 w-3" /> Professional Photo URL
                    </Label>
                    <Input 
                      className="h-12 rounded-xl border-primary/10 bg-primary/5 focus-visible:ring-primary/20 font-bold"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={formState.photoUrl} 
                      onChange={(e) => setFormState({...formState, photoUrl: e.target.value})} 
                    />
                    <p className="text-[9px] text-muted-foreground italic ml-1">Provide a public URL for your professional portrait to be displayed to clients.</p>
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-primary/5">
                <Button type="submit" disabled={isSaving} className="h-12 px-10 rounded-2xl bg-primary text-white font-black shadow-lg hover:scale-105 transition-all">
                  {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Commit Profile Updates
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-destructive/5 p-8">
            <CardTitle className="flex items-center text-destructive text-lg font-bold">
              <Shield className="h-5 w-5 mr-2" />
              Access Security
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 bg-muted/20 rounded-2xl border-2 border-dashed border-muted-foreground/10 gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-black text-primary">Login Password</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Managed via secure portal</p>
                </div>
              </div>
              <Button variant="outline" className="rounded-xl font-black text-[10px] uppercase tracking-widest border-2">Change Password</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
