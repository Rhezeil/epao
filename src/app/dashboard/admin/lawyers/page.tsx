"use client";

import { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { collection, query, doc, orderBy } from "firebase/firestore";
import { Loader2, Plus, Trash2, Mail, Lock } from "lucide-react";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";

export default function AdminLawyersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user, role } = useAuth();
  const [newLawyerEmail, setNewLawyerEmail] = useState("");
  const [newLawyerPassword, setNewLawyerPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch registered lawyers
  const registeredLawyersQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "roleLawyer"), orderBy("email", "asc"));
  }, [db, user, role]);

  const { data: registeredLawyers, isLoading: isLawyersLoading } = useCollection(registeredLawyersQuery);

  const handleAuthorizeLawyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !newLawyerEmail || !newLawyerPassword) return;

    setIsSubmitting(true);
    const email = newLawyerEmail.toLowerCase();
    const password = newLawyerPassword;

    try {
      // 1. Create the Auth account using a secondary app instance
      // This prevents the admin from being signed out on account creation
      const secondaryApp = initializeApp(firebaseConfig, "secondary-registration");
      const secondaryAuth = getAuth(secondaryApp);
      
      try {
        await createUserWithEmailAndPassword(secondaryAuth, email, password);
      } finally {
        await deleteApp(secondaryApp);
      }

      // 2. Save the record in the Firestore whitelist
      // Use email directly as ID for consistency with Security Rules
      const authRef = doc(db, "lawyersEmail", email);
      setDocumentNonBlocking(authRef, {
        email: email,
        password: password, // Storing for admin visibility, though usually handled via Auth
        authorizedAt: new Date().toISOString()
      }, { merge: true });

      toast({ 
        title: "Lawyer Registered", 
        description: `Auth account and whitelist record created for ${email}.` 
      });
      
      setNewLawyerEmail("");
      setNewLawyerPassword("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "Could not create user account."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Lawyer Management</h1>
          <p className="text-muted-foreground">Manage professional practitioners and authorizations.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Register New Lawyer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuthorizeLawyer} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input 
                  type="email" 
                  value={newLawyerEmail} 
                  onChange={(e) => setNewLawyerEmail(e.target.value)} 
                  required 
                  placeholder="name@lawyers.com" 
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label>Initial Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="password" 
                    value={newLawyerPassword} 
                    onChange={(e) => setNewLawyerPassword(e.target.value)} 
                    required 
                    placeholder="Minimum 6 characters" 
                    className="pl-9"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} 
                Register & Authorize
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Active Practitioners (Registered)</CardTitle></CardHeader>
          <CardContent>
            {isLawyersLoading ? <Loader2 className="animate-spin" /> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lawyer Email</TableHead>
                    <TableHead className="text-right">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {registeredLawyers?.map((lawyer) => (
                    <TableRow key={lawyer.id}>
                      <TableCell>{lawyer.email}</TableCell>
                      <TableCell className="text-right">
                        <span className="text-green-600 font-bold px-2 py-1 bg-green-50 rounded text-xs">Registered</span>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!registeredLawyers || registeredLawyers.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-muted-foreground py-4">No active practitioners yet.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
