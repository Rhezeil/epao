
"use client";

import { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { collection, query, where, doc } from "firebase/firestore";
import { Briefcase, Loader2, Plus, Trash2, Mail } from "lucide-react";

export default function AdminLawyersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [newLawyerEmail, setNewLawyerEmail] = useState("");

  // Memoize the query to fetch registered lawyers
  const registeredLawyersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "users"), where("role", "==", "lawyer"));
  }, [db]);

  // Memoize the query to fetch authorized emails
  const authorizedEmailsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "lawyersEmail");
  }, [db]);

  const { data: registeredLawyers, isLoading: isLawyersLoading } = useCollection(registeredLawyersQuery);
  const { data: authorizedEmails, isLoading: isEmailsLoading } = useCollection(authorizedEmailsQuery);

  const handleAuthorizeLawyer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !newLawyerEmail) return;

    const emailId = newLawyerEmail.toLowerCase().replace(/[@.]/g, "_");
    const authRef = doc(db, "lawyersEmail", emailId);

    setDocumentNonBlocking(authRef, {
      email: newLawyerEmail.toLowerCase(),
      authorizedAt: new Date().toISOString()
    }, { merge: true });

    toast({
      title: "Lawyer Authorized",
      description: `${newLawyerEmail} can now register as a Lawyer.`
    });
    setNewLawyerEmail("");
  };

  const handleRemoveAuthorization = (id: string) => {
    if (!db) return;
    const authRef = doc(db, "lawyersEmail", id);
    deleteDocumentNonBlocking(authRef);
    toast({
      variant: "destructive",
      title: "Authorization Revoked",
      description: "Lawyer email has been removed from the whitelist."
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Lawyer Management</h1>
          <p className="text-muted-foreground">Authorize lawyer emails and manage active practitioners.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Mail className="h-5 w-5" />
              Authorize New Lawyer
            </CardTitle>
            <CardDescription>
              Add an email to the authorization list. Users with these emails will be assigned the Lawyer role upon registration.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAuthorizeLawyer} className="flex gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@lawyers.com"
                  value={newLawyerEmail}
                  onChange={(e) => setNewLawyerEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                <Plus className="mr-2 h-4 w-4" />
                Authorize Email
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Authorized Emails</CardTitle>
              <CardDescription>Emails waiting for user registration.</CardDescription>
            </CardHeader>
            <CardContent>
              {isEmailsLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {authorizedEmails && authorizedEmails.length > 0 ? (
                      authorizedEmails.map((auth) => (
                        <TableRow key={auth.id}>
                          <TableCell className="text-sm">{auth.email}</TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleRemoveAuthorization(auth.id)}>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-4 text-muted-foreground text-xs">No pending authorizations.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Registered Lawyers</CardTitle>
              <CardDescription>Lawyers active in the system.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLawyersLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Lawyer Email</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredLawyers && registeredLawyers.length > 0 ? (
                      registeredLawyers.map((lawyer) => (
                        <TableRow key={lawyer.id}>
                          <TableCell className="text-sm font-medium">{lawyer.email}</TableCell>
                          <TableCell className="text-right">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-[10px] font-medium text-green-800">
                              Registered
                            </span>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={2} className="text-center py-4 text-muted-foreground text-xs">No registered lawyers found.</TableCell>
                      </TableRow>
                    )}
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
