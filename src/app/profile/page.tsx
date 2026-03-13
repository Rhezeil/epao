
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
import { Avatar, AvatarFallback, AvatarImage } from "@/avatar";

export default function ProfilePage() {
  const { user } = useUser();
  const db = useFirestore();
  const { toast } = useToast();
  const { role, loading: authLoading } = useAuth();

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
        setDocumentNonBlocking(profileDocRef, { ...formState, updatedAt: new Date().toISOString() }, { merge: true });
        updateDocumentNonBlocking(doc(db, "users", user.uid), {
          fullName: `${formState.firstName} ${formState.lastName}`.trim(),
          mobileNumber: formState.phoneNumber,
          updatedAt: new Date().toISOString()
        });
      } else {
        updateDocumentNonBlocking(profileDocRef, { ...formState, updatedAt: new Date().toISOString() });
      }

      // --- NOTIFICATION ---
      const notifId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", notifId), {
        id: notifId,
        type: role === 'client' ? 'client' : 'lawyer',
        userRole: role,
        description: `${role.toUpperCase()} profile information updated by ${formState.firstName}.`,
        referenceId: user.uid,
        status: "unread",
        createdAt: new Date().toISOString()
      }, { merge: true });

      toast({ title: "Settings Updated", description: "Your profile information has been saved successfully." });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not save your changes." });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || (isProfileLoading && !profileData)) {
    return (
      <DashboardLayout role={role}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Loading Profile...</p>
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
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">{role === 'client' ? "Citizen Account" : "Professional Profile"}</h1>
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">Manage your identity within LexConnect</p>
          </div>
          <Avatar className="h-20 w-20 border-4 border-white shadow-xl"><AvatarImage src={formState.photoUrl} className="object-cover" /><AvatarFallback className="bg-primary/10 text-2xl font-black text-primary">{formState.firstName?.[0] || "?"}</AvatarFallback></Avatar>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 p-8"><div className="flex items-center space-x-4"><div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center"><User className="h-6 w-6 text-primary" /></div><div><CardTitle className="text-xl font-bold text-primary">Personal Details</CardTitle></div></div></CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleUpdate} className="grid gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-primary/40 ml-1">First Name</Label><Input className="h-12 rounded-xl" value={formState.firstName} onChange={(e) => setFormState({...formState, firstName: e.target.value})} /></div>
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Last Name</Label><Input className="h-12 rounded-xl" value={formState.lastName} onChange={(e) => setFormState({...formState, lastName: e.target.value})} /></div>
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Mobile</Label><Input className="h-12 rounded-xl" value={formState.phoneNumber} onChange={(e) => setFormState({...formState, phoneNumber: e.target.value})} /></div>
                <div className="col-span-2 space-y-2"><Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Address</Label><Input className="h-12 rounded-xl" value={formState.address} onChange={(e) => setFormState({...formState, address: e.target.value})} /></div>
              </div>
              <Button type="submit" disabled={isSaving} className="h-12 px-10 rounded-2xl bg-primary text-white font-black shadow-lg">Commit Updates</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
