
"use client";

import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking, setDocumentNonBlocking, updateDocumentNonBlocking, useDoc } from "@/firebase";
import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { collection, query, orderBy, doc, where } from "firebase/firestore";
import { 
  UserCircle, 
  Loader2, 
  MoreVertical, 
  Trash2, 
  Plus, 
  Search, 
  Eye, 
  Edit3, 
  Lock, 
  Key, 
  UserPlus, 
  ShieldAlert,
  Calendar,
  FileText,
  Gavel,
  History,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Scale,
  Save,
  X,
  UserCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  ShieldCheck
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState, useMemo, useEffect } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

export default function AdminUsersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user: currentUser, role: currentRole, loading } = useAuth();

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit States
  const [isEditingPersonal, setIsEditingPersonal] = useState(false);
  const [isEditingCase, setIsEditingCase] = useState(false);
  const [editProfile, setEditProfile] = useState<any>({});
  const [editCase, setEditCase] = useState<any>({});

  // Assignment State for New Case (Existing Client)
  const [newCaseData, setNewCaseData] = useState({
    caseType: "Initial Legal Assistance",
    lawyerId: ""
  });

  // New Client State (Complete registration)
  const [newClient, setNewClient] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    income: "Indigent",
    caseType: "Initial Consultation",
    lawyerId: ""
  });

  // Main Queries
  const usersQuery = useMemoFirebase(() => {
    if (!db || !currentUser || currentRole !== 'admin') return null;
    return query(collection(db, "users"), orderBy("createdAt", "desc"));
  }, [db, currentUser, currentRole]);

  const casesQuery = useMemoFirebase(() => {
    if (!db || !currentUser || currentRole !== 'admin') return null;
    return query(collection(db, "cases"));
  }, [db, currentUser, currentRole]);

  const lawyersQuery = useMemoFirebase(() => {
    if (!db || !currentUser || currentRole !== 'admin') return null;
    return query(collection(db, "roleLawyer"));
  }, [db, currentUser, currentRole]);

  const { data: users, isLoading } = useCollection(usersQuery);
  const { data: cases } = useCollection(casesQuery);
  const { data: lawyers } = useCollection(lawyersQuery);

  // Guard profile listener
  const profileRef = useMemoFirebase(() => {
    if (!db || !selectedClientId || !currentUser) return null;
    return doc(db, "users", selectedClientId, "profile", "profile");
  }, [db, selectedClientId, currentUser]);
  
  const { data: selectedProfile } = useDoc(profileRef);

  // Client History Query
  const historyQuery = useMemoFirebase(() => {
    if (!db || !selectedClientId || !currentUser) return null;
    return query(
      collection(db, "appointments"), 
      where("clientId", "==", selectedClientId),
      orderBy("createdAt", "desc")
    );
  }, [db, selectedClientId, currentUser]);

  const { data: clientHistory, isLoading: isHistoryLoading } = useCollection(historyQuery);

  const selectedUser = useMemo(() => 
    users?.find(u => u.id === selectedClientId), 
    [users, selectedClientId]
  );

  const activeCase = useMemo(() => 
    cases?.find(c => c.clientId === selectedClientId), 
    [cases, selectedClientId]
  );

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(u => 
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.mobileNumber?.includes(searchQuery) ||
      u.fullName?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [users, searchQuery]);

  useEffect(() => {
    if (selectedProfile) {
      setEditProfile({
        firstName: selectedProfile.firstName || "",
        lastName: selectedProfile.lastName || "",
        phoneNumber: selectedProfile.phoneNumber || selectedUser?.mobileNumber || "",
        address: selectedProfile.address || ""
      });
    }
    if (activeCase) {
      setEditCase({
        caseType: activeCase.caseType || "",
        description: activeCase.description || "",
        createdAt: activeCase.createdAt || "",
        closedAt: activeCase.closedAt || "",
        lawyerId: activeCase.lawyerId || ""
      });
    }
  }, [selectedProfile, selectedUser, activeCase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!currentUser || currentRole !== 'admin') return null;

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setIsSubmitting(true);

    try {
      const email = newClient.email || `${newClient.mobile}@epao.mobile`;
      
      const secondaryApp = initializeApp(firebaseConfig, "client-creation-" + Date.now());
      const secondaryAuth = getAuth(secondaryApp);
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, "password123");
      const uid = userCredential.user.uid;
      
      // 1. Create User Document
      const userRef = doc(db, "users", uid);
      setDocumentNonBlocking(userRef, {
        id: uid,
        mobileNumber: newClient.mobile,
        email: email,
        role: "client",
        status: newClient.lawyerId ? "Active Case" : "New Intake",
        fullName: newClient.name,
        incomeClassification: newClient.income,
        createdAt: new Date().toISOString()
      }, { merge: true });

      // 2. Create Profile Document
      const profileRef = doc(db, "users", uid, "profile", "profile");
      setDocumentNonBlocking(profileRef, {
        id: "profile",
        firstName: newClient.name.split(' ')[0],
        lastName: newClient.name.split(' ').slice(1).join(' '),
        phoneNumber: newClient.mobile,
        address: newClient.address,
        createdAt: new Date().toISOString()
      }, { merge: true });

      // 3. Optional Case Creation
      if (newClient.lawyerId) {
        const year = new Date().getFullYear();
        const caseId = `CASE-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
        const caseRef = doc(db, "cases", caseId);
        setDocumentNonBlocking(caseRef, {
          id: caseId,
          clientId: uid,
          lawyerId: newClient.lawyerId,
          caseType: newClient.caseType,
          status: "Active",
          description: "Record initialized during manual citizen registration.",
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      await deleteApp(secondaryApp);

      toast({ 
        title: "Registration Complete", 
        description: `${newClient.name} added. Default password is password123.` 
      });
      setIsAddDialogOpen(false);
      setNewClient({ name: "", mobile: "", email: "", address: "", income: "Indigent", caseType: "Initial Consultation", lawyerId: "" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Registration Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = () => {
    if (!db || !selectedClientId) return;
    const profileDocRef = doc(db, "users", selectedClientId, "profile", "profile");
    updateDocumentNonBlocking(profileDocRef, editProfile);
    
    const userRef = doc(db, "users", selectedClientId);
    const fullName = `${editProfile.firstName} ${editProfile.lastName}`.trim();
    updateDocumentNonBlocking(userRef, { 
      fullName: fullName,
      mobileNumber: editProfile.phoneNumber
    });

    setIsEditingPersonal(false);
    toast({ title: "Profile Saved", description: "Details updated." });
  };

  const handleSaveCase = () => {
    if (!db || !activeCase) return;
    const ref = doc(db, "cases", activeCase.id);
    updateDocumentNonBlocking(ref, editCase);
    setIsEditingCase(false);
    toast({ title: "Case Saved", description: "Case record updated." });
  };

  const handleCreateInitialCase = () => {
    if (!db || !selectedClientId || !newCaseData.lawyerId) return;
    
    setIsSubmitting(true);
    const year = new Date().getFullYear();
    const caseId = `CASE-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
    const caseRef = doc(db, "cases", caseId);
    
    setDocumentNonBlocking(caseRef, {
      id: caseId,
      clientId: selectedClientId,
      lawyerId: newCaseData.lawyerId,
      caseType: newCaseData.caseType,
      status: "Active",
      description: "Direct assignment from directory workstation.",
      createdAt: new Date().toISOString()
    }, { merge: true });

    updateDocumentNonBlocking(doc(db, "users", selectedClientId), { status: "Active Case" });
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: "Case Initialized", description: `Reference ${caseId} assigned.` });
    }, 800);
  };

  const handleUpdateStatus = (userId: string, newStatus: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "users", userId), { status: newStatus });
    toast({ title: "Status Synchronized", description: `Client moved to ${newStatus}.` });
  };

  const handleReassignLawyer = (caseId: string, newLawyerId: string) => {
    if (!db || !caseId) return;
    updateDocumentNonBlocking(doc(db, "cases", caseId), { lawyerId: newLawyerId });
    toast({ title: "Attorney Assigned", description: "Caseload redirected." });
  };

  const handleDeleteUser = (userId: string) => {
    if (!db) return;
    const userRef = doc(db, "users", userId);
    updateDocumentNonBlocking(userRef, { status: "Inactive" });
    toast({ variant: "destructive", title: "Account Deactivated", description: "Record archived." });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Client Directory</h1>
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">Unified citizen and case management</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="rounded-2xl h-12 bg-primary font-black shadow-lg hover:scale-105 transition-transform">
            <UserPlus className="mr-2 h-5 w-5" /> Register New Citizen
          </Button>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
              <Input 
                placeholder="Search citizens..." 
                className="pl-9 h-11 rounded-xl border-primary/10 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary/20" />
                <p className="text-xs font-black uppercase text-muted-foreground tracking-widest">Synchronizing Registry...</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-primary/40">Citizen Profile</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Case Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Assigned Attorney</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Registration</TableHead>
                    <TableHead className="text-right px-8 font-black text-[10px] uppercase tracking-widest text-primary/40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((client) => {
                    const clientCase = cases?.find(c => c.clientId === client.id);
                    const lawyer = lawyers?.find(l => l.id === clientCase?.lawyerId);
                    
                    return (
                      <TableRow key={client.id} className="hover:bg-primary/5 transition-colors group">
                        <TableCell className="px-8 py-6">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white shadow-sm">
                              <UserCircle className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-black text-primary leading-none mb-1">
                                {client.fullName || client.email?.split('@')[0]}
                              </p>
                              <p className="text-[10px] text-muted-foreground font-bold">{client.mobileNumber}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "font-black text-[9px] uppercase px-3",
                            client.status === 'Active Case' ? 'bg-green-500' : 
                            client.status === 'Inactive' ? 'bg-red-500' : 
                            client.status === 'Closed Case' ? 'bg-gray-500' : 'bg-primary'
                          )}>
                            {client.status || "New Intake"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {lawyer ? (
                              <>
                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                <span className="text-xs font-bold text-primary">{lawyer.firstName ? `Atty. ${lawyer.firstName}` : lawyer.email.split('@')[0]}</span>
                              </>
                            ) : (
                              <span className="text-xs font-bold text-muted-foreground italic">Unassigned</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-[10px] font-bold text-muted-foreground">
                          {client.createdAt ? format(new Date(client.createdAt), "MMM dd, yyyy") : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 rounded-xl text-primary hover:bg-primary/5"
                              onClick={() => { setSelectedClientId(client.id); setIsDetailsOpen(true); }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/5">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-primary/40 tracking-widest px-2 pb-2 text-center border-b mb-2">Record Triage</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(client.id, "Active Case")} className="rounded-xl font-bold">
                                  <ShieldCheck className="mr-2 h-4 w-4 text-green-600" /> Mark Active Case
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(client.id, "Closed Case")} className="rounded-xl font-bold">
                                  <Gavel className="mr-2 h-4 w-4 text-primary" /> Mark Closed
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => handleDeleteUser(client.id)} className="text-destructive font-bold rounded-xl">
                                  <Trash2 className="mr-2 h-4 w-4" /> Deactivate Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* --- ADD CLIENT DIALOG --- */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="rounded-[3rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-primary text-white">
              <DialogTitle className="text-3xl font-black tracking-tight">Citizen Registration</DialogTitle>
              <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Enroll a new client and initialize legal records</DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-center gap-4">
                <div className="p-2 bg-amber-100 rounded-xl text-amber-700">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-amber-900 tracking-widest">Portal Access Credentials</p>
                  <p className="text-xs font-bold text-amber-800">Initial login password: <span className="font-black bg-white px-2 py-0.5 rounded border border-amber-200">password123</span></p>
                </div>
              </div>

              <div className="grid gap-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Full Citizen Name</Label>
                    <Input value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="h-12 rounded-xl" placeholder="Juan Dela Cruz" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Mobile Number</Label>
                    <Input value={newClient.mobile} onChange={e => setNewClient({...newClient, mobile: e.target.value})} className="h-12 rounded-xl" placeholder="09XXXXXXXXX" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Income Classification</Label>
                    <Select value={newClient.income} onValueChange={v => setNewClient({...newClient, income: v})}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Indigent" className="font-bold">Indigent (Priority)</SelectItem>
                        <SelectItem value="Low Income" className="font-bold">Low Income</SelectItem>
                        <SelectItem value="Government Employee" className="font-bold">Govt Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Email (Optional)</Label>
                    <Input value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="h-12 rounded-xl" placeholder="name@email.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Home Address</Label>
                  <Input value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} className="h-12 rounded-xl" placeholder="Street, Barangay, City" />
                </div>

                <div className="pt-6 border-t border-primary/5 space-y-6">
                  <div className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase text-primary tracking-[0.2em]">Initialize Legal Record (Optional)</span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Case Classification</Label>
                      <Input value={newClient.caseType} onChange={e => setNewClient({...newClient, caseType: e.target.value})} className="h-12 rounded-xl" placeholder="e.g. Theft, Labor Dispute" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Assign Handling Attorney</Label>
                      <Select value={newClient.lawyerId} onValueChange={v => setNewClient({...newClient, lawyerId: v})}>
                        <SelectTrigger className="h-12 rounded-xl">
                          <SelectValue placeholder="Select Lawyer" />
                        </SelectTrigger>
                        <SelectContent>
                          {lawyers?.map(l => (
                            <SelectItem key={l.id} value={l.id} className="font-bold">
                              {l.firstName ? `Atty. ${l.firstName} ${l.lastName}` : l.email.split('@')[0]}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl h-14 px-8 font-bold">Cancel</Button>
              <Button onClick={handleAddClient} disabled={isSubmitting || !newClient.name || !newClient.mobile} className="rounded-xl h-14 bg-primary font-black px-12 shadow-xl">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <ShieldCheck className="mr-2 h-5 w-5" />}
                Complete Registration
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- DETAILS OVERLAY --- */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="rounded-[3rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="p-8 bg-secondary text-white shrink-0">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-black">
                    {selectedProfile ? `${selectedProfile.firstName} ${selectedProfile.lastName}` : (selectedUser?.fullName || "Citizen Profile")}
                  </DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                    ID: {selectedUser?.id?.slice(0, 8)}...
                  </DialogDescription>
                </div>
                <Badge className="bg-white text-secondary font-black px-4 py-2 rounded-xl">{selectedUser?.status || "Active"}</Badge>
              </div>
            </DialogHeader>
            <div className="p-10 overflow-y-auto flex-1">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-2xl h-14">
                  <TabsTrigger value="profile" className="rounded-xl font-bold">Personal</TabsTrigger>
                  <TabsTrigger value="case" className="rounded-xl font-bold">Case</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-xl font-bold">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-8 pt-6">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Identification & Contact</h4>
                    {!isEditingPersonal ? (
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingPersonal(true)} className="h-8 text-primary font-bold"><Edit3 className="h-3 w-3 mr-1" /> Edit</Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingPersonal(false)} className="h-8 text-muted-foreground">Cancel</Button>
                        <Button size="sm" onClick={handleSaveProfile} className="h-8 bg-primary text-white">Save</Button>
                      </div>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-8">
                    {isEditingPersonal ? (
                      <>
                        <div className="space-y-2"><Label className="text-[10px] font-black uppercase">First Name</Label><Input value={editProfile.firstName} onChange={e => setEditProfile({...editProfile, firstName: e.target.value})} /></div>
                        <div className="space-y-2"><Label className="text-[10px] font-black uppercase">Last Name</Label><Input value={editProfile.lastName} onChange={e => setEditProfile({...editProfile, lastName: e.target.value})} /></div>
                        <div className="space-y-2"><Label className="text-[10px] font-black uppercase">Mobile</Label><Input value={editProfile.phoneNumber} onChange={e => setEditProfile({...editProfile, phoneNumber: e.target.value})} /></div>
                        <div className="space-y-2"><Label className="text-[10px] font-black uppercase">Address</Label><Input value={editProfile.address} onChange={e => setEditProfile({...editProfile, address: e.target.value})} /></div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <p className="font-bold text-primary flex items-center gap-2"><Phone className="h-4 w-4 text-secondary" /> {selectedUser?.mobileNumber || "N/A"}</p>
                          <p className="font-bold text-primary flex items-center gap-2"><Mail className="h-4 w-4 text-secondary" /> {selectedUser?.email || "N/A"}</p>
                          <p className="text-xs font-bold text-primary flex items-start gap-2 leading-relaxed"><MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" /> {selectedProfile?.address || "No address"}</p>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-[10px] font-black uppercase text-primary/40">Verified Classification</Label>
                          <p className="font-black text-secondary">{selectedUser?.incomeClassification || "Indigent"}</p>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="case" className="space-y-8 pt-6">
                  {activeCase ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-black text-primary uppercase text-sm flex items-center gap-2"><Scale className="h-5 w-5" /> Official Case File</h4>
                          <Button variant="ghost" size="sm" onClick={() => setIsEditingCase(!isEditingCase)} className="h-8 text-primary font-bold">{isEditingCase ? "Cancel" : "Edit Case"}</Button>
                        </div>
                        {isEditingCase ? (
                          <div className="grid gap-4">
                            <Input value={editCase.caseType} onChange={e => setEditCase({...editCase, caseType: e.target.value})} placeholder="Case Type" />
                            <Textarea value={editCase.description} onChange={e => setEditCase({...editCase, description: e.target.value})} placeholder="Description" />
                            <Button size="sm" onClick={handleSaveCase} className="bg-primary text-white">Save Changes</Button>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            <div><p className="text-[10px] font-black text-muted-foreground uppercase">Ref ID</p><p className="font-black text-primary">{activeCase.id}</p></div>
                            <div><p className="text-[10px] font-black text-muted-foreground uppercase">Category</p><p className="font-black text-primary">{activeCase.caseType}</p></div>
                            <div className="col-span-2 pt-2"><p className="text-[10px] font-black text-muted-foreground uppercase">Summary</p><p className="text-xs italic text-primary/80">{activeCase.description || "---"}</p></div>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Handling Public Attorney</Label>
                        <Select value={activeCase.lawyerId} onValueChange={v => handleReassignLawyer(activeCase.id, v)}>
                          <SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Assign Lawyer" /></SelectTrigger>
                          <SelectContent>{lawyers?.map(l => <SelectItem key={l.id} value={l.id} className="font-bold">{l.firstName ? `Atty. ${l.firstName} ${l.lastName}` : l.email}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                  ) : (
                    <div className="p-10 bg-primary/5 rounded-[2.5rem] border-2 border-dashed text-center space-y-6">
                      <Scale className="h-12 w-12 text-primary/20 mx-auto" />
                      <div>
                        <h4 className="text-lg font-black text-primary">Initialize Legal Record</h4>
                        <p className="text-xs text-muted-foreground">Citizen is currently registered but has no active case file.</p>
                      </div>
                      <div className="max-w-xs mx-auto space-y-4 text-left">
                        <div className="space-y-1"><Label className="text-[10px] font-black uppercase text-primary/40">Classification</Label><Input value={newCaseData.caseType} onChange={e => setNewCaseData({...newCaseData, caseType: e.target.value})} className="h-10 rounded-lg" /></div>
                        <div className="space-y-1"><Label className="text-[10px] font-black uppercase text-primary/40">Assign Attorney</Label>
                          <Select value={newCaseData.lawyerId} onValueChange={v => setNewCaseData({...newCaseData, lawyerId: v})}>
                            <SelectTrigger className="h-10 rounded-lg"><SelectValue placeholder="Select Attorney" /></SelectTrigger>
                            <SelectContent>{lawyers?.map(l => <SelectItem key={l.id} value={l.id} className="font-bold">{l.firstName ? `Atty. ${l.firstName} ${l.lastName}` : l.email}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <Button className="w-full bg-primary text-white font-black rounded-xl" disabled={!newCaseData.lawyerId || isSubmitting} onClick={handleCreateInitialCase}>Initialize & Assign Case</Button>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="pt-6 space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Chronological History</h4>
                  {isHistoryLoading ? <Loader2 className="animate-spin h-6 w-6 mx-auto opacity-20" /> : clientHistory?.length ? (
                    <div className="space-y-3">
                      {clientHistory.map(h => (
                        <div key={h.id} className="p-4 bg-muted/20 rounded-2xl flex items-center justify-between border border-transparent hover:border-primary/10">
                          <div><p className="text-sm font-bold text-primary">{h.caseType}</p><p className="text-[9px] text-muted-foreground uppercase font-black">{format(new Date(h.date), "PPP")} • {h.status}</p></div>
                          <Badge variant="outline" className="text-[8px] font-black uppercase">{h.referenceCode}</Badge>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-center py-10 text-xs italic text-muted-foreground">No visit history found.</p>}
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter className="p-8 bg-muted/30"><Button onClick={() => setIsDetailsOpen(false)} className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl">Close Workstation</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
