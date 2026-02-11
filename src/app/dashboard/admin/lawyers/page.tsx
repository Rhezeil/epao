
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
import { Loader2, Plus, Trash2, Mail } from "lucide-react";

export default function AdminLawyersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user, role } = useAuth();
  const [newLawyerEmail, setNewLawyerEmail] = useState("");

  // Fetch registered lawyers
  const registeredLawyersQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "roleLawyer"), orderBy("email", "asc"));
  }, [db, user, role]);

  // Fetch authorized emails whitelist
  const authorizedEmailsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return collection(db, "lawyersEmail");
  }, [db, user, role]);

  const { data: registeredLawyers, isLoading: isLawyersLoading } = useCollection(registeredLawyersQuery);
  const { data: authorizedEmails, isLoading: isEmailsLoading } = useCollection(authorizedEmailsQuery);

  const handleAuthorizeLawyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !newLawyerEmail) return;

    // Use email directly as ID for consistency with Security Rules
    const email = newLawyerEmail.toLowerCase();
    const authRef = doc(db, "lawyersEmail", email);

    setDocumentNonBlocking(authRef, {
      email: email,
      authorizedAt: new Date().toISOString()
    }, { merge: true });

    toast({ title: "Lawyer Authorized", description: `${email} added to whitelist.` });
    setNewLawyerEmail("");
  };

  const handleRemoveAuthorization = (id: string) => {
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, "lawyersEmail", id));
    toast({ variant: "destructive", title: "Authorization Revoked" });
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
              Authorize Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuthorizeLawyer} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label>Email Address</Label>
                <Input type="email" value={newLawyerEmail} onChange={(e) => setNewLawyerEmail(e.target.value)} required placeholder="name@lawyers.com" />
              </div>
              <Button type="submit"><Plus className="mr-2 h-4 w-4" /> Authorize</Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Authorized Emails (Whitelist)</CardTitle></CardHeader>
            <CardContent>
              {isEmailsLoading ? <Loader2 className="animate-spin" /> : (
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Email</TableHead><TableHead className="text-right">Action</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {authorizedEmails?.map((auth) => (
                      <TableRow key={auth.id}>
                        <TableCell>{auth.email}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveAuthorization(auth.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Active Practitioners (Registered)</CardTitle></CardHeader>
            <CardContent>
              {isLawyersLoading ? <Loader2 className="animate-spin" /> : (
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Lawyer Email</TableHead><TableHead className="text-right">Status</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredLawyers?.map((lawyer) => (
                      <TableRow key={lawyer.id}>
                        <TableCell>{lawyer.email}</TableCell>
                        <TableCell className="text-right"><span className="text-green-600 font-bold">Registered</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
