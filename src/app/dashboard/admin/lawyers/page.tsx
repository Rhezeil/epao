
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
import { collection, query, doc, orderBy, where } from "firebase/firestore";
import { 
  Loader2, 
  Plus, 
  Trash2, 
  UserCheck, 
  Search, 
  Settings2,
  Edit3,
  Camera,
  Scale,
  ArrowRightLeft,
  CalendarDays,
  Briefcase,
  ChevronRight,
  Clock
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { format, startOfToday } from "date-fns";

export default function AdminLawyersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  // Controls
  const [newLawyer, setNewLawyer] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  
  // Edit State
  const [selectedLawyer, setSelectedLawyer] = useState<any>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editLawyerData, setEditLawyerData] = useState({ 
    firstName: "", 
    lastName: "", 
    phoneNumber: "", 
    photoUrl: "", 
    status: "" 
  });

  // Queries
  const registeredLawyersQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "roleLawyer"), orderBy("email", "asc"));
  }, [db, user, role]);

  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "cases"), where("status", "==", "Active"));
  }, [db, user, role]);

  const dutiesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "lawyerDuties"), where("date", ">=", startOfToday().toISOString()));
  }, [db, user, role]);

  const { data: registeredLawyers, isLoading: isLawyersLoading } = useCollection(registeredLawyersQuery);
  const { data: activeCases } = useCollection(casesQuery);
  const { data: allDuties } = useCollection(dutiesQuery);

  const processedLawyers = useMemo(() => {
    if (!registeredLawyers) return [];
    
    let result = registeredLawyers.map(lawyer => {
      const lawyerCases = activeCases?.filter(c => c.lawyerId === lawyer.id) || [];
      const lawyerDutiesToday = allDuties?.filter(d => d.lawyerId === lawyer.id && d.date.startsWith(format(new Date(), "yyyy-MM-dd"))) || [];
      
      return {
        ...lawyer,
        activeCaseCount: lawyerCases.length,
        todayDuty: lawyerDutiesToday[0] || null,
        status: lawyer.status || "Available"
      };
    });

    // Filtering
    if (searchQuery) {
      result = result.filter(l => 
        l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (assignmentFilter !== "all") {
      result = result.filter(l => l.status === assignmentFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "workload") return b.activeCaseCount - a.activeCaseCount;
      if (sortBy === "name") return (a.firstName || "").localeCompare(b.firstName || "");
      return 0;
    });

    return result;
  }, [registeredLawyers, activeCases, allDuties, searchQuery, assignmentFilter, sortBy]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || role !== 'admin') return null;

  const handleAuthorizeLawyer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !newLawyer.email || !newLawyer.password) return;

    setIsSubmitting(true);
    try {
      const secondaryApp = initializeApp(firebaseConfig, "lawyer-auth-" + Date.now());
      const secondaryAuth = getAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, newLawyer.email.toLowerCase().trim(), newLawyer.password);
      const newUserId = userCredential.user.uid;
      await deleteApp(secondaryApp);

      const lawyerRef = doc(db, "roleLawyer", newUserId);
      setDocumentNonBlocking(lawyerRef, {
        id: newUserId,
        email: newLawyer.email.toLowerCase().trim(),
        firstName: newLawyer.firstName,
        lastName: newLawyer.lastName,
        role: "lawyer",
        status: "Available",
        createdAt: new Date().toISOString()
      }, { merge: true });

      toast({ title: "Lawyer Provisioned", description: "Account successfully created." });
      setNewLawyer({ email: "", password: "", firstName: "", lastName: "" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateLawyerProfile = () => {
    if (!db || !selectedLawyer) return;
    setIsSubmitting(true);
    updateDocumentNonBlocking(doc(db, "roleLawyer", selectedLawyer.id), editLawyerData);
    toast({ title: "Profile Updated", description: "Changes saved successfully." });
    setIsEditOpen(false);
    setIsSubmitting(false);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Staff Management</h1>
            <p className="text-muted-foreground font-medium">Coordinate the Public Attorney directory and monitor operational workloads.</p>
          </div>
        </div>

        <Tabs defaultValue="directory" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xl bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14">
            <TabsTrigger value="directory" className="rounded-xl font-bold">Registry & Workload</TabsTrigger>
            <TabsTrigger value="provision" className="rounded-xl font-bold">Authorize New Staff</TabsTrigger>
          </TabsList>
          
          <TabsContent value="directory" className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                <Input 
                  placeholder="Search by name or email..." 
                  className="pl-9 h-12 rounded-xl border-primary/10 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
                <SelectTrigger className="h-12 rounded-xl border-primary/10 bg-white font-bold">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-bold">All Assignments</SelectItem>
                  <SelectItem value="Available" className="font-bold">Available</SelectItem>
                  <SelectItem value="Onsite" className="font-bold">Onsite Duty</SelectItem>
                  <SelectItem value="On Leave" className="font-bold">On Leave</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-12 rounded-xl border-primary/10 bg-white font-bold">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name" className="font-bold">Sort by Name</SelectItem>
                  <SelectItem value="workload" className="font-bold">Highest Workload</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardContent className="p-0">
                {isLawyersLoading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div> : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Attorney Profile</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Caseload</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Today's Schedule</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Status</TableHead>
                        <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {processedLawyers.map((lawyer) => (
                        <TableRow key={lawyer.id} className="hover:bg-primary/5 transition-colors group">
                          <TableCell className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage src={lawyer.photoUrl} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary font-black">{lawyer.firstName?.[0] || "?"}</AvatarFallback>
                              </Avatar>
                              <div>
                                <button 
                                  onClick={() => router.push(`/dashboard/admin/lawyers/${lawyer.id}`)}
                                  className="font-black text-primary hover:underline block text-left"
                                >
                                  {lawyer.firstName ? `${lawyer.firstName} ${lawyer.lastName}` : lawyer.email.split('@')[0]}
                                </button>
                                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">ID: {lawyer.id.slice(0, 8)}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-bold border-primary/10 text-primary">
                              {lawyer.activeCaseCount} Active Cases
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {lawyer.todayDuty ? (
                              <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-secondary animate-pulse" />
                                <span className="text-[10px] font-bold text-secondary uppercase">{lawyer.todayDuty.category}</span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">Office Consultation</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={cn(
                              "font-black text-[9px] uppercase",
                              lawyer.status === 'Available' ? 'border-green-200 text-green-700 bg-green-50' : 'border-amber-200 text-amber-700 bg-amber-50'
                            )}>{lawyer.status}</Badge>
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-primary hover:bg-primary/5"
                                onClick={() => router.push(`/dashboard/admin/lawyers/${lawyer.id}`)}
                              >
                                <CalendarDays className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-primary hover:bg-primary/5"
                                onClick={() => { 
                                  setSelectedLawyer(lawyer); 
                                  setEditLawyerData({ 
                                    firstName: lawyer.firstName || "",
                                    lastName: lawyer.lastName || "",
                                    phoneNumber: lawyer.phoneNumber || "",
                                    photoUrl: lawyer.photoUrl || "",
                                    status: lawyer.status 
                                  }); 
                                  setIsEditOpen(true); 
                                }}
                              >
                                <Edit3 className="h-4 w-4" />
                              </Button>
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
                <CardTitle className="text-xl font-black">Authorize Staff Access</CardTitle>
                <CardDescription className="text-white/60">Create credentials for public attorneys.</CardDescription>
              </CardHeader>
              <CardContent className="p-10">
                <form onSubmit={handleAuthorizeLawyer} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-primary/40 ml-1">First Name</Label><Input value={newLawyer.firstName} onChange={e => setNewLawyer({...newLawyer, firstName: e.target.value})} placeholder="Juan" className="h-12 rounded-xl" /></div>
                    <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Last Name</Label><Input value={newLawyer.lastName} onChange={e => setNewLawyer({...newLawyer, lastName: e.target.value})} placeholder="Dela Cruz" className="h-12 rounded-xl" /></div>
                    <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Work Email</Label><Input type="email" value={newLawyer.email} onChange={(e) => setNewLawyer({...newLawyer, email: e.target.value})} required placeholder="name@lawyers.com" className="h-12 rounded-xl" /></div>
                    <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Temp Password</Label><Input type="password" value={newLawyer.password} onChange={(e) => setNewLawyer({...newLawyer, password: e.target.value})} required placeholder="Min 6 chars" className="h-12 rounded-xl" /></div>
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
          <DialogContent className="rounded-[3rem] max-w-lg p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-primary text-white">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-4 border-white/20">
                  <AvatarImage src={editLawyerData.photoUrl} className="object-cover" />
                  <AvatarFallback className="bg-white/10 text-white font-black">{editLawyerData.firstName?.[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <DialogTitle className="text-2xl font-black">Edit Staff Profile</DialogTitle>
                  <DialogDescription className="text-white/60">{selectedLawyer?.email}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="p-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-primary/40 ml-1">First Name</Label><Input value={editLawyerData.firstName} onChange={e => setEditLawyerData({...editLawyerData, firstName: e.target.value})} className="h-12 rounded-xl" /></div>
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Last Name</Label><Input value={editLawyerData.lastName} onChange={e => setEditLawyerData({...editLawyerData, lastName: e.target.value})} className="h-12 rounded-xl" /></div>
                <div className="col-span-2 space-y-2"><Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Photo URL</Label><Input value={editLawyerData.photoUrl} onChange={e => setEditLawyerData({...editLawyerData, photoUrl: e.target.value})} className="h-12 rounded-xl" placeholder="https://..." /></div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30">
              <Button variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-xl h-12 px-8 font-bold">Cancel</Button>
              <Button onClick={handleUpdateLawyerProfile} disabled={isSubmitting} className="rounded-xl h-12 bg-primary text-white font-black px-10 shadow-xl">
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
