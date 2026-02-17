
"use client";

import { useState, useMemo } from "react";
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
import { 
  Loader2, 
  Plus, 
  Trash2, 
  Lock, 
  UserCheck, 
  TrendingUp, 
  Search, 
  ArrowUpDown, 
  Briefcase, 
  CheckCircle2, 
  AlertCircle,
  Filter
} from "lucide-react";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function AdminLawyersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user, role } = useAuth();
  const [newLawyerEmail, setNewLawyerEmail] = useState("");
  const [newLawyerPassword, setNewLawyerPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "activeCases" | "appointments">("name");

  // Fetch registered lawyers
  const registeredLawyersQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "roleLawyer"), orderBy("email", "asc"));
  }, [db, user, role]);

  // Fetch all cases and appointments for metrics
  const casesQuery = useMemoFirebase(() => db ? query(collection(db, "cases")) : null, [db]);
  const apptsQuery = useMemoFirebase(() => db ? query(collection(db, "appointments")) : null, [db]);

  const { data: registeredLawyers, isLoading: isLawyersLoading } = useCollection(registeredLawyersQuery);
  const { data: allCases } = useCollection(casesQuery);
  const { data: allAppts } = useCollection(apptsQuery);

  const lawyerMetrics = useMemo(() => {
    if (!registeredLawyers) return [];

    return registeredLawyers.map(lawyer => {
      const lawyerCases = allCases?.filter(c => c.lawyerId === lawyer.id) || [];
      const lawyerAppts = allAppts?.filter(a => a.lawyerId === lawyer.id) || [];
      
      const services = new Set(lawyerAppts.filter(a => a.status === 'completed').map(a => a.serviceType || a.purpose));

      return {
        ...lawyer,
        appointmentsHandled: lawyerAppts.filter(a => a.status === 'completed').length,
        casesOpened: lawyerCases.length,
        casesClosed: lawyerCases.filter(c => c.status === 'Closed').length,
        activeCases: lawyerCases.filter(c => c.status === 'Active').length,
        servicesRendered: services.size
      };
    });
  }, [registeredLawyers, allCases, allAppts]);

  const filteredAndSortedLawyers = useMemo(() => {
    let result = lawyerMetrics.filter(l => 
      l.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "activeCases") {
      result.sort((a, b) => b.activeCases - a.activeCases);
    } else if (sortBy === "appointments") {
      result.sort((a, b) => b.appointmentsHandled - a.appointmentsHandled);
    }

    return result;
  }, [lawyerMetrics, searchQuery, sortBy]);

  const handleAuthorizeLawyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !newLawyerEmail || !newLawyerPassword) return;

    setIsSubmitting(true);
    const email = newLawyerEmail.toLowerCase().trim();
    const password = newLawyerPassword;

    try {
      const secondaryApp = initializeApp(firebaseConfig, "secondary-registration-" + Date.now());
      const secondaryAuth = getAuth(secondaryApp);
      
      let newUserId: string | null = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, password);
        newUserId = userCredential.user.uid;
      } catch (authError: any) {
        if (authError.code !== 'auth/email-already-in-use') throw authError;
      } finally {
        await deleteApp(secondaryApp);
      }

      const authRef = doc(db, "lawyersEmail", email);
      setDocumentNonBlocking(authRef, {
        email,
        password,
        authorizedAt: new Date().toISOString()
      }, { merge: true });

      if (newUserId) {
        const lawyerRef = doc(db, "roleLawyer", newUserId);
        setDocumentNonBlocking(lawyerRef, {
          id: newUserId,
          email,
          role: "lawyer",
          profileId: "profile",
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      toast({ title: "Lawyer Authorized", description: `Lawyer ${email} authorized.` });
      setNewLawyerEmail("");
      setNewLawyerPassword("");
    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLawyer = (lawyerId: string, email: string) => {
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, "roleLawyer", lawyerId));
    deleteDocumentNonBlocking(doc(db, "lawyersEmail", email.toLowerCase()));
    toast({ variant: "destructive", title: "Lawyer Removed", description: `${email} removed.` });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Lawyer Management</h1>
            <p className="text-muted-foreground font-medium">Authorize lawyers and monitor operational workload.</p>
          </div>
        </div>

        <Tabs defaultValue="workload" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-2xl bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14">
            <TabsTrigger value="workload" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" /> Workload &amp; Analytics
            </TabsTrigger>
            <TabsTrigger value="management" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <Plus className="h-4 w-4 mr-2" /> Lawyer Authorization
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="workload" className="mt-8 space-y-6">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                      <Briefcase className="h-6 w-6" /> Lawyer Activity Table
                    </CardTitle>
                    <CardDescription>Performance metrics across all active legal staff.</CardDescription>
                  </div>
                  <div className="flex items-center gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                      <Input 
                        placeholder="Search lawyers..." 
                        className="pl-9 h-11 rounded-xl border-primary/10 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                      <SelectTrigger className="h-11 w-[180px] rounded-xl border-primary/10 bg-white font-bold text-primary">
                        <ArrowUpDown className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Sort By" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Sort by Name</SelectItem>
                        <SelectItem value="activeCases">Highest Workload</SelectItem>
                        <SelectItem value="appointments">Most Visits Handled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLawyersLoading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div> : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40 px-8">Lawyer Profile</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40 text-center">Appts Handled</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40 text-center">Cases Opened</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40 text-center">Cases Closed</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40 text-center">Active Cases</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40 text-right px-8">Services</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAndSortedLawyers.map((lawyer) => (
                        <TableRow key={lawyer.id} className="hover:bg-primary/5 transition-colors group">
                          <TableCell className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white shadow-sm">
                                <UserCheck className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <p className="font-black text-primary leading-none mb-1">{lawyer.email.split('@')[0]}</p>
                                <p className="text-[10px] text-muted-foreground font-medium">{lawyer.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-bold text-primary">
                            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-100 font-black">{lawyer.appointmentsHandled}</Badge>
                          </TableCell>
                          <TableCell className="text-center font-bold text-primary">{lawyer.casesOpened}</TableCell>
                          <TableCell className="text-center font-bold text-green-600">
                            <div className="flex items-center justify-center gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              {lawyer.casesClosed}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              "font-black px-3",
                              lawyer.activeCases > 5 ? "bg-red-500" : "bg-primary"
                            )}>
                              {lawyer.activeCases}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <div className="flex items-center justify-end gap-2">
                              <span className="text-xs font-bold text-muted-foreground">Unique Types:</span>
                              <Badge variant="outline" className="font-black border-primary/20 text-primary">{lawyer.servicesRendered}</Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredAndSortedLawyers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-20 text-muted-foreground italic font-medium">
                            No lawyers matching your search criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
               <Card className="border-none shadow-xl rounded-3xl bg-amber-50/50 border border-amber-100 p-6 flex items-start gap-4">
                  <div className="p-3 bg-white rounded-2xl shadow-sm border border-amber-100 text-amber-600">
                    <AlertCircle className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-amber-900 text-sm">High Caseload Warning</h4>
                    <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                      Lawyers with more than 5 active cases are highlighted in red. Consider triaging new matters to lawyers with lower active caseloads.
                    </p>
                  </div>
               </Card>
               <Card className="border-none shadow-xl rounded-3xl bg-primary text-white p-6 flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-2xl text-white">
                    <Filter className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-black text-sm">Performance Period</h4>
                    <p className="text-xs text-white/70 font-medium leading-relaxed">
                      Workload metrics are currently calculated based on lifetime system records. Interactive date range filters will be available in the next release.
                    </p>
                  </div>
               </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="management" className="mt-8 space-y-6">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-primary p-8 text-white">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Plus className="h-6 w-6" /> Authorize New Lawyer
                </CardTitle>
                <CardDescription className="text-white/60 font-medium">
                  Manually provision credentials for legal professionals.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={handleAuthorizeLawyer} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Work Email</Label>
                    <Input 
                      type="email" 
                      value={newLawyerEmail} 
                      onChange={(e) => setNewLawyerEmail(e.target.value)} 
                      required 
                      placeholder="name@lawyers.com" 
                      className="h-12 rounded-xl border-primary/20 bg-white"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Initial Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                      <Input 
                        type="password" 
                        value={newLawyerPassword} 
                        onChange={(e) => setNewLawyerPassword(e.target.value)} 
                        required 
                        placeholder="Min 6 characters" 
                        className="h-12 pl-10 rounded-xl border-primary/20 bg-white"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="h-12 rounded-xl bg-primary text-white font-black shadow-lg">
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />} 
                    Authorize Lawyer
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-muted/30 pb-6">
                <CardTitle className="text-lg font-bold text-primary">Authorized Lawyers List</CardTitle>
                <CardDescription>Legal professionals with active accounts in the registry.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="px-8">Lawyer Email</TableHead>
                      <TableHead>Registration Date</TableHead>
                      <TableHead className="text-right px-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {registeredLawyers?.map((lawyer) => (
                      <TableRow key={lawyer.id}>
                        <TableCell className="px-8 font-bold text-primary">{lawyer.email}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {lawyer.createdAt ? new Date(lawyer.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="text-destructive hover:bg-destructive/10 rounded-lg"
                            onClick={() => handleDeleteLawyer(lawyer.id, lawyer.email)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {(!registeredLawyers || registeredLawyers.length === 0) && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center text-muted-foreground py-12 font-medium">No registered lawyers yet.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
