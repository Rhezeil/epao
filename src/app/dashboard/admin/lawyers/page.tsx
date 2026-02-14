
"use client";

import { useState } from "react";
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { collection, query, doc, orderBy } from "firebase/firestore";
import { Loader2, Plus, Trash2, Mail, Lock, UserCheck, Clock } from "lucide-react";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminLawyersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user, role } = useAuth();
  const [newLawyerEmail, setNewLawyerEmail] = useState("");
  const [newLawyerPassword, setNewLawyerPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch registered lawyers (those who have logged in at least once)
  const registeredLawyersQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "roleLawyer"), orderBy("email", "asc"));
  }, [db, user, role]);

  const { data: registeredLawyers, isLoading: isLawyersLoading } = useCollection(registeredLawyersQuery);

  // Fetch authorized but not yet registered (whitelist)
  const authorizedEmailsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "lawyersEmail"), orderBy("email", "asc"));
  }, [db, user, role]);

  const { data: authorizedEmails, isLoading: isEmailsLoading } = useCollection(authorizedEmailsQuery);

  const handleAuthorizeLawyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !newLawyerEmail || !newLawyerPassword) return;

    setIsSubmitting(true);
    const email = newLawyerEmail.toLowerCase().trim();
    const password = newLawyerPassword;

    try {
      // 1. Create the Auth account using a secondary app instance
      const secondaryApp = initializeApp(firebaseConfig, "secondary-registration-" + Date.now());
      const secondaryAuth = getAuth(secondaryApp);
      
      try {
        await createUserWithEmailAndPassword(secondaryAuth, email, password);
      } catch (authError: any) {
        if (authError.code !== 'auth/email-already-in-use') {
          throw authError;
        }
      } finally {
        await deleteApp(secondaryApp);
      }

      // 2. Save the record in the Firestore whitelist
      const authRef = doc(db, "lawyersEmail", email);
      setDocumentNonBlocking(authRef, {
        email: email,
        password: password,
        authorizedAt: new Date().toISOString()
      }, { merge: true });

      toast({ 
        title: "Lawyer Authorized", 
        description: `Practitioner ${email} is now authorized to log in.` 
      });
      
      setNewLawyerEmail("");
      setNewLawyerPassword("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authorization Failed",
        description: error.message || "Could not authorize practitioner."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLawyer = (lawyerId: string, email: string) => {
    if (!db) return;

    // 1. Delete from roleLawyer collection
    const lawyerRef = doc(db, "roleLawyer", lawyerId);
    deleteDocumentNonBlocking(lawyerRef);

    // 2. Delete from lawyersEmail whitelist
    const emailRef = doc(db, "lawyersEmail", email.toLowerCase());
    deleteDocumentNonBlocking(emailRef);

    toast({
      variant: "destructive",
      title: "Practitioner Removed",
      description: `Removed ${email} from authorized practitioners.`
    });
  };

  const handleRevokeAuth = (email: string) => {
    if (!db) return;
    const emailRef = doc(db, "lawyersEmail", email.toLowerCase());
    deleteDocumentNonBlocking(emailRef);
    toast({
      variant: "destructive",
      title: "Authorization Revoked",
      description: `Invitation for ${email} has been cancelled.`
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Practitioner Management</h1>
          <p className="text-muted-foreground">Authorize legal professionals and manage active practitioners.</p>
        </div>

        <Card className="border-primary/10 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Plus className="h-5 w-5" />
              Authorize New Practitioner
            </CardTitle>
            <CardDescription>
              Adding an email here allows the practitioner to log in and access the Lawyer Portal.
            </CardDescription>
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
                    placeholder="Min 6 characters" 
                    className="pl-9"
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto bg-primary">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} 
                Authorize Email
              </Button>
            </form>
          </CardContent>
        </Card>

        <Tabs defaultValue="registered" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="registered" className="flex items-center gap-2">
              <UserCheck className="h-4 w-4" /> Active Practitioners
            </TabsTrigger>
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" /> Pending Invitations
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="registered">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Registered Practitioners</CardTitle>
                <CardDescription>Legal professionals who have logged in and completed registration.</CardDescription>
              </CardHeader>
              <CardContent>
                {isLawyersLoading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Practitioner Email</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {registeredLawyers?.map((lawyer) => (
                        <TableRow key={lawyer.id}>
                          <TableCell className="font-medium">{lawyer.email}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {lawyer.createdAt ? new Date(lawyer.createdAt).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleDeleteLawyer(lawyer.id, lawyer.email)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!registeredLawyers || registeredLawyers.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-12">No registered practitioners yet.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pending">
            <Card className="border-none shadow-sm">
              <CardHeader>
                <CardTitle>Authorized Whitelist</CardTitle>
                <CardDescription>Emails authorized to access the system but have not logged in yet.</CardDescription>
              </CardHeader>
              <CardContent>
                {isEmailsLoading ? <div className="flex justify-center py-8"><Loader2 className="animate-spin text-primary" /></div> : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Authorized Email</TableHead>
                        <TableHead>Auth Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {authorizedEmails?.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.email}</TableCell>
                          <TableCell className="text-xs text-muted-foreground">
                            {item.authorizedAt ? new Date(item.authorizedAt).toLocaleDateString() : 'N/A'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleRevokeAuth(item.email)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!authorizedEmails || authorizedEmails.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={3} className="text-center text-muted-foreground py-12">No pending invitations.</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
