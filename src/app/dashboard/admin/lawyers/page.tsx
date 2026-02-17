
"use client";

import { useState, useMemo } from "react";
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, deleteDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
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
  Filter,
  ShieldAlert,
  ArrowRightLeft,
  Settings2,
  Calendar,
  Eye,
  Edit3
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function AdminLawyersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user, role } = useAuth();
  
  // Controls
  const [newLawyer, setNewLawyer] = useState({ email: "", password: "", specialization: "General" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "activeCases" | "appointments">("name");
  
  // Reassignment State
  const [selectedLawyer, setSelectedLawyer] = useState<any>(null);
  const [isReassignOpen, setIsReassignOpen] = useState(false);
  const [targetLawyerId, setTargetLawyerId] = useState("");

  // Edit Profile State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editLawyerData, setEditLawyerData] = useState({ specialization: "", status: "" });

  // Queries
  const registeredLawyersQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "roleLawyer"), orderBy("email", "asc"));
  }, [db, user, role]);

  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "cases"));
  }, [db, user, role]);

  const apptsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "appointments"));
  }, [db, user, role]);

  const { data: registeredLawyers, isLoading: isLawyersLoading } = useCollection(registeredLawyersQuery);
  const { data: allCases } = useCollection(casesQuery);
  const { data: allAppts } = useCollection(apptsQuery);

  const lawyerMetrics = useMemo(() => {
    if (!registeredLawyers) return [];

    return registeredLawyers.map(lawyer => {
      const lawyerCases = allCases?.filter(c => c.lawyerId === lawyer.id) || [];
      const lawyerAppts = allAppts?.filter(a => a.lawyerId === lawyer.id) || [];
      const activeCount = lawyerCases.filter(c => c.status === 'Active').length;

      return {
        ...lawyer,
        appointmentsHandled: lawyerAppts.filter(a => a.status === 'completed').length,
        casesOpened: lawyerCases.length,
        casesClosed: lawyerCases.filter(c => c.status === 'Closed').length,
        activeCases: activeCount,
        specialization: lawyer.specialization || "General Litigation",
        status: lawyer.status || "Available",
        isOverloaded: activeCount >= 5
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
    if (!db || !newLawyer.email || !newLawyer.password) return;

    setIsSubmitting(true);
    const email = newLawyer.email.toLowerCase().trim();

    try {
      const secondaryApp = initializeApp(firebaseConfig, "lawyer-auth-" + Date.now());
      const secondaryAuth = getAuth(secondaryApp);
      
      let newUserId: string | null = null;
      try {
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, newLawyer.password);
        newUserId = userCredential.user.uid;
      } catch (authError: any) {
        if (authError.code === 'auth/email-already-in-use') {
          throw authError;
        } else {
          throw authError;
        }
      } finally {
        await deleteApp(secondaryApp);
      }

      if (newUserId) {
        const lawyerRef = doc(db, "roleLawyer", newUserId);
        setDocumentNonBlocking(lawyerRef, {
          id: newUserId,
          email,
          role: "lawyer",
          specialization: newLawyer.specialization,
          status: "Available",
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      toast({ title: "Lawyer Provisioned", description: `${email} is now an authorized public attorney.` });
      setNewLawyer({ email: "", password: "", specialization: "General" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReassignCases = () => {
    if (!db || !selectedLawyer || !targetLawyerId) return;
    setIsSubmitting(true);

    const casesToMove = allCases?.filter(c => c.lawyerId === selectedLawyer.id) || [];
    casesToMove.forEach(c => {
      updateDocumentNonBlocking(doc(db, "cases", c.id), { lawyerId: targetLawyerId });
    });

    toast({ title: "Cases Reassigned", description: `Successfully migrated ${casesToMove.length} Cases.` });
    setIsReassignOpen(false);
    setSelectedLawyer(null);
    setTargetLawyerId("");
    setIsSubmitting(false);
  };

  const handleUpdateLawyerProfile = () => {
    if (!db || !selectedLawyer) return;
    setIsSubmitting(true);
    const lawyerRef = doc(db, "roleLawyer", selectedLawyer.id);
    updateDocumentNonBlocking(lawyerRef, editLawyerData);
    toast({ title: "Profile Updated", description: "Lawyer details have been saved." });
    setIsEditOpen(false);
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Lawyer Directory</h1>
            <p className="text-muted-foreground font-medium">Manage legal staff, monitor workloads, and reassign Cases.</p>
          </div>
        </div>

        <Tabs defaultValue="directory" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xl bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14">
            <TabsTrigger value="directory" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <UserCheck className="h-4 w-4 mr-2" /> Staff Registry
            </TabsTrigger>
            <TabsTrigger value="provision" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <Plus className="h-4 w-4 mr-2" /> Add Attorney
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="directory" className="mt-8 space-y-6">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="relative w-full md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                    <Input 
                      placeholder="Search attorneys..." 
                      className="pl-9 h-11 rounded-xl border-primary/10 bg-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                    <SelectTrigger className="h-11 w-[180px] rounded-xl border-primary/10 font-bold text-primary">
                      <ArrowUpDown className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Sort By" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Sort by Name</SelectItem>
                      <SelectItem value="activeCases">Workload Weight</SelectItem>
                      <SelectItem value="appointments">Consultation Count</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLawyersLoading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div> : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Attorney</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Workload</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Efficiency</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Status</TableHead>
                        <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Actions</TableHead>
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
                                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{lawyer.specialization}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge className={cn(
                              "font-black px-3 py-1",
                              lawyer.isOverloaded ? "bg-red-500" : "bg-primary"
                            )}>
                              {lawyer.activeCases} / 5
                            </Badge>
                            {lawyer.isOverloaded && <p className="text-[8px] font-black text-red-600 mt-1 uppercase">Overloaded</p>}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex flex-col items-center">
                              <span className="text-xs font-black text-primary">{lawyer.casesClosed}</span>
                              <span className="text-[8px] font-bold text-muted-foreground uppercase">Closed Cases</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={cn(
                              "font-black text-[9px] uppercase",
                              lawyer.status === 'Available' ? 'border-green-200 text-green-700 bg-green-50' : 'border-amber-200 text-amber-700 bg-amber-50'
                            )}>
                              {lawyer.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl text-primary hover:bg-primary/5"
                                onClick={() => { setSelectedLawyer(lawyer); setEditLawyerData({ specialization: lawyer.specialization, status: lawyer.status }); setIsEditOpen(true); }}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl text-primary hover:bg-primary/5"
                                onClick={() => { setSelectedLawyer(lawyer); setIsReassignOpen(true); }}
                              >
                                <ArrowRightLeft className="h-4 w-4" />
                              </Button>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/5">
                                    <Settings2 className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-2xl p-2 w-56">
                                  <DropdownMenuLabel className="text-[10px] font-black uppercase text-primary/40 px-2 pb-2">Quick Status</DropdownMenuLabel>
                                  <DropdownMenuItem onClick={() => updateDocumentNonBlocking(doc(db, "roleLawyer", lawyer.id), { status: "Available" })} className="rounded-xl font-bold">
                                    Mark as Available
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateDocumentNonBlocking(doc(db, "roleLawyer", lawyer.id), { status: "On Leave" })} className="rounded-xl font-bold">
                                    Mark as On Leave
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => deleteDocumentNonBlocking(doc(db, "roleLawyer", lawyer.id))}
                                    className="text-destructive font-bold rounded-xl"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Deactivate
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="provision" className="mt-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden max-w-2xl">
              <CardHeader className="bg-primary p-8 text-white">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <Plus className="h-6 w-6" /> Authorize New Staff
                </CardTitle>
                <CardDescription className="text-white/60 font-medium">Create credentials for public attorneys.</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={handleAuthorizeLawyer} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Work Email</Label>
                      <Input 
                        type="email" 
                        value={newLawyer.email} 
                        onChange={(e) => setNewLawyer({...newLawyer, email: e.target.value})} 
                        required 
                        placeholder="name@lawyers.com" 
                        className="h-12 rounded-xl border-primary/20"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Temporary Password</Label>
                      <Input 
                        type="password" 
                        value={newLawyer.password} 
                        onChange={(e) => setNewLawyer({...newLawyer, password: e.target.value})} 
                        required 
                        placeholder="Min 6 characters" 
                        className="h-12 rounded-xl border-primary/20"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Specialization Focus</Label>
                      <Select value={newLawyer.specialization} onValueChange={v => setNewLawyer({...newLawyer, specialization: v})}>
                        <SelectTrigger className="h-12 rounded-xl border-primary/10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Criminal Defense">Criminal Defense</SelectItem>
                          <SelectItem value="Civil & Property">Civil & Property</SelectItem>
                          <SelectItem value="Labor & Employment">Labor & Employment</SelectItem>
                          <SelectItem value="Administrative & Ethics">Administrative</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button type="submit" disabled={isSubmitting} className="w-full h-14 rounded-2xl bg-primary text-white font-black text-lg shadow-xl">
                    {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Authorize Attorney Access"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* --- EDIT LAWYER DIALOG --- */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="rounded-[3rem] max-w-md p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-primary text-white">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-black">Edit Attorney Profile</DialogTitle>
                <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                  Staff Account: {selectedLawyer?.email}
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className="p-10 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Specialization</Label>
                <Select value={editLawyerData.specialization} onValueChange={v => setEditLawyerData({...editLawyerData, specialization: v})}>
                  <SelectTrigger className="h-14 rounded-2xl border-primary/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Criminal Defense">Criminal Defense</SelectItem>
                    <SelectItem value="Civil & Property">Civil & Property</SelectItem>
                    <SelectItem value="Labor & Employment">Labor & Employment</SelectItem>
                    <SelectItem value="Administrative & Ethics">Administrative</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Availability Status</Label>
                <Select value={editLawyerData.status} onValueChange={v => setEditLawyerData({...editLawyerData, status: v})}>
                  <SelectTrigger className="h-14 rounded-2xl border-primary/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="On Leave">On Leave</SelectItem>
                    <SelectItem value="Fully Booked">Fully Booked</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 gap-3">
              <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1 h-14 rounded-2xl font-bold">Cancel</Button>
              <Button 
                onClick={handleUpdateLawyerProfile} 
                disabled={isSubmitting} 
                className="flex-1 h-14 rounded-2xl font-black bg-primary text-white shadow-xl"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- REASSIGNMENT DIALOG --- */}
        <Dialog open={isReassignOpen} onOpenChange={setIsReassignOpen}>
          <DialogContent className="rounded-[3rem] max-w-md p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-secondary text-white">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-black">Reassign Caseload</DialogTitle>
                <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                  Balancing Active Cases for {selectedLawyer?.email?.split('@')[0]}
                </DialogDescription>
              </div>
            </DialogHeader>
            <div className="p-10 space-y-6">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-100 flex gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-900 font-bold leading-relaxed">
                  You are about to migrate all {selectedLawyer?.activeCases} active Cases to a new attorney. This action cannot be undone.
                </p>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Target Attorney</Label>
                <Select value={targetLawyerId} onValueChange={setTargetLawyerId}>
                  <SelectTrigger className="h-14 rounded-2xl border-primary/10">
                    <SelectValue placeholder="Select receiving attorney" />
                  </SelectTrigger>
                  <SelectContent>
                    {lawyerMetrics.filter(l => l.id !== selectedLawyer?.id).map(l => (
                      <SelectItem key={l.id} value={l.id} className="font-bold">
                        {l.email.split('@')[0]} ({l.activeCases}/5 Cases)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 gap-3">
              <Button variant="outline" onClick={() => setIsReassignOpen(false)} className="flex-1 h-14 rounded-2xl font-bold">Cancel</Button>
              <Button 
                onClick={handleReassignCases} 
                disabled={!targetLawyerId || isSubmitting} 
                className="flex-1 h-14 rounded-2xl font-black bg-secondary text-white shadow-xl"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirm Migration"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
