
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
  Clock
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

  // Assignment State for New Case
  const [newCaseData, setNewCaseData] = useState({
    caseType: "Initial Legal Assistance",
    lawyerId: ""
  });

  // New Client State
  const [newClient, setNewClient] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    income: "Indigent",
    category: "General"
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

  // Guard profile listener with current user check to avoid Permission Denied on initial load
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
      
      const userRef = doc(db, "users", uid);
      setDocumentNonBlocking(userRef, {
        id: uid,
        mobileNumber: newClient.mobile,
        email: email,
        role: "client",
        status: "New Intake",
        fullName: newClient.name,
        incomeClassification: newClient.income,
        createdAt: new Date().toISOString()
      }, { merge: true });

      const profileRef = doc(db, "users", uid, "profile", "profile");
      setDocumentNonBlocking(profileRef, {
        id: "profile",
        firstName: newClient.name.split(' ')[0],
        lastName: newClient.name.split(' ').slice(1).join(' '),
        phoneNumber: newClient.mobile,
        address: newClient.address,
        createdAt: new Date().toISOString()
      }, { merge: true });

      await deleteApp(secondaryApp);

      toast({ title: "Client Registered", description: `${newClient.name} added to directory.` });
      setIsAddDialogOpen(false);
      setNewClient({ name: "", mobile: "", email: "", address: "", income: "Indigent", category: "General" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveProfile = () => {
    if (!db || !selectedClientId) return;
    const profileDocRef = doc(db, "users", selectedClientId, "profile", "profile");
    updateDocumentNonBlocking(profileDocRef, editProfile);
    
    // Sync with top-level user document
    const userRef = doc(db, "users", selectedClientId);
    const fullName = `${editProfile.firstName} ${editProfile.lastName}`.trim();
    updateDocumentNonBlocking(userRef, { 
      fullName: fullName,
      mobileNumber: editProfile.phoneNumber
    });

    setIsEditingPersonal(false);
    toast({ title: "Profile Saved", description: "Personal details updated and synced across system." });
  };

  const handleSaveCase = () => {
    if (!db || !activeCase) return;
    const ref = doc(db, "cases", activeCase.id);
    updateDocumentNonBlocking(ref, editCase);
    setIsEditingCase(false);
    toast({ title: "Case Saved", description: "Legal Case record updated." });
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
      description: "Direct case assignment from Admin Directory.",
      createdAt: new Date().toISOString()
    }, { merge: true });

    updateDocumentNonBlocking(doc(db, "users", selectedClientId), { status: "Active Case" });
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({ title: "Case Created", description: `Record ${caseId} assigned successfully.` });
    }, 800);
  };

  const handleUpdateStatus = (userId: string, newStatus: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "users", userId), { status: newStatus });
    
    // Also update case if it exists and we're closing it
    const clientCase = cases?.find(c => c.clientId === userId);
    if (clientCase && newStatus === 'Closed Case') {
      updateDocumentNonBlocking(doc(db, "cases", clientCase.id), { 
        status: "Closed",
        closedAt: new Date().toISOString()
      });
    } else if (clientCase && newStatus === 'Active Case') {
      updateDocumentNonBlocking(doc(db, "cases", clientCase.id), { 
        status: "Active",
        closedAt: null
      });
    }

    toast({ title: "Status Updated", description: `Client is now ${newStatus}.` });
  };

  const handleReassignLawyer = (caseId: string, newLawyerId: string) => {
    if (!db || !caseId) return;
    updateDocumentNonBlocking(doc(db, "cases", caseId), { lawyerId: newLawyerId });
    toast({ title: "Attorney Reassigned", description: "The Case has been updated with the new lawyer." });
  };

  const handleDeleteUser = (userId: string) => {
    if (!db) return;
    const userRef = doc(db, "users", userId);
    updateDocumentNonBlocking(userRef, { status: "Inactive" });
    toast({
      variant: "destructive",
      title: "Client Deactivated",
      description: "Record moved to archives."
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Client Directory</h1>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="rounded-2xl h-12 bg-primary font-black shadow-lg">
            <UserPlus className="mr-2 h-5 w-5" /> Add New Client
          </Button>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 pb-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                <Input 
                  placeholder="Search by name, email or mobile..." 
                  className="pl-9 h-11 rounded-xl border-primary/10 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 space-y-4">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="text-sm font-bold text-muted-foreground">Synchronizing Registry...</p>
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
                              <p className="text-[9px] text-muted-foreground/60">{client.email}</p>
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
                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-primary/40 tracking-widest px-2 pb-2">Record Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(client.id, "Active Case")} className="rounded-xl font-bold">
                                  <ShieldAlert className="mr-2 h-4 w-4 text-green-600" /> Mark as Active Case
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(client.id, "Closed Case")} className="rounded-xl font-bold">
                                  <Gavel className="mr-2 h-4 w-4 text-primary" /> Mark as Closed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(client.id, "Under Screening")} className="rounded-xl font-bold">
                                  <Search className="mr-2 h-4 w-4 text-amber-600" /> Mark as Under Screening
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  onClick={() => handleDeleteUser(client.id)}
                                  className="text-destructive focus:text-destructive rounded-xl font-bold"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Deactivate Account
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredUsers.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic font-medium">
                        No clients found matching your criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* --- DETAILS & PROFILE OVERLAY --- */}
        <Dialog open={isDetailsOpen} onOpenChange={(open) => { setIsDetailsOpen(open); if(!open) { setIsEditingPersonal(false); setIsEditingCase(false); } }}>
          <DialogContent className="rounded-[3rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="p-6 md:p-8 bg-secondary text-white shrink-0">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-black">
                    {selectedProfile ? `${selectedProfile.firstName} ${selectedProfile.lastName}` : (selectedUser?.fullName || selectedUser?.email?.split('@')[0] || "Client Profile")}
                  </DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                    Citizen ID: {selectedUser?.id?.slice(0, 8)}...
                  </DialogDescription>
                </div>
                <Badge className="bg-white text-secondary font-black px-4 py-2 rounded-xl">{selectedUser?.status || "Active"}</Badge>
              </div>
            </DialogHeader>
            <div className="p-6 md:p-10 overflow-y-auto flex-1">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-2xl h-14">
                  <TabsTrigger value="profile" className="rounded-xl font-bold">Personal</TabsTrigger>
                  <TabsTrigger value="case" className="rounded-xl font-bold">Case</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-xl font-bold">History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-8 pt-6 animate-in fade-in duration-500">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Contact Information</h4>
                    {!isEditingPersonal ? (
                      <Button variant="ghost" size="sm" onClick={() => setIsEditingPersonal(true)} className="h-8 rounded-lg text-primary">
                        <Edit3 className="h-3 w-3 mr-1" /> Edit
                      </Button>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setIsEditingPersonal(false)} className="h-8 rounded-lg text-muted-foreground">
                          <X className="h-3 w-3 mr-1" /> Cancel
                        </Button>
                        <Button size="sm" onClick={handleSaveProfile} className="h-8 rounded-lg bg-primary text-white">
                          <Save className="h-3 w-3 mr-1" /> Save
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {isEditingPersonal ? (
                      <>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase">First Name</Label>
                          <Input value={editProfile.firstName} onChange={e => setEditProfile({...editProfile, firstName: e.target.value})} className="h-10 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase">Last Name</Label>
                          <Input value={editProfile.lastName} onChange={e => setEditProfile({...editProfile, lastName: e.target.value})} className="h-10 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase">Mobile Number</Label>
                          <Input value={editProfile.phoneNumber} onChange={e => setEditProfile({...editProfile, phoneNumber: e.target.value})} className="h-10 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase">Home Address</Label>
                          <Input value={editProfile.address} onChange={e => setEditProfile({...editProfile, address: e.target.value})} className="h-10 rounded-xl" />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <p className="font-bold text-primary flex items-center gap-2">
                              <Phone className="h-4 w-4 text-secondary" /> {selectedUser?.mobileNumber || selectedProfile?.phoneNumber || "N/A"}
                            </p>
                            <p className="font-bold text-primary flex items-center gap-2">
                              <Mail className="h-4 w-4 text-secondary" /> {selectedUser?.email || "N/A"}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Home Address</Label>
                            <p className="text-sm font-bold text-primary flex items-start gap-2">
                              <MapPin className="h-4 w-4 text-secondary shrink-0 mt-0.5" /> 
                              {selectedProfile?.address || "Address not provided"}
                            </p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Eligibility Status</Label>
                            <p className="font-black text-secondary">{selectedUser?.incomeClassification || "Indigent"}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Verified Priority Rank</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="case" className="space-y-8 pt-6 animate-in slide-in-from-right-4">
                  {activeCase ? (
                    <div className="space-y-6">
                      <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                        <div className="flex justify-between items-center mb-4">
                          <div className="flex items-center gap-3">
                            <Scale className="h-6 w-6 text-primary" />
                            <h4 className="font-black text-primary uppercase tracking-widest text-sm">Active Legal Case</h4>
                          </div>
                          {!isEditingCase ? (
                            <Button variant="ghost" size="sm" onClick={() => setIsEditingCase(true)} className="h-8 rounded-lg text-primary">
                              <Edit3 className="h-3 w-3 mr-1" /> Edit Case
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              <Button variant="ghost" size="sm" onClick={() => setIsEditingCase(false)} className="h-8 rounded-lg text-muted-foreground">
                                <X className="h-3 w-3 mr-1" /> Cancel
                              </Button>
                              <Button size="sm" onClick={handleSaveCase} className="h-8 rounded-lg bg-primary text-white">
                                <Save className="h-3 w-3 mr-1" /> Save
                              </Button>
                            </div>
                          )}
                        </div>

                        {isEditingCase ? (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase">Case Type</Label>
                              <Input value={editCase.caseType} onChange={e => setEditCase({...editCase, caseType: e.target.value})} className="h-10 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase">Date Opened</Label>
                              <Input type="date" value={editCase.createdAt?.split('T')[0]} onChange={e => setEditCase({...editCase, createdAt: new Date(e.target.value).toISOString()})} className="h-10 rounded-xl" />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase">Date Closed</Label>
                              <Input type="date" value={editCase.closedAt?.split('T')[0]} onChange={e => setEditCase({...editCase, closedAt: e.target.value ? new Date(e.target.value).toISOString() : null})} className="h-10 rounded-xl" />
                            </div>
                            <div className="col-span-2 space-y-2">
                              <Label className="text-[10px] font-black uppercase">Full Case Description</Label>
                              <Textarea value={editCase.description} onChange={e => setEditCase({...editCase, description: e.target.value})} className="rounded-xl min-h-[100px]" />
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-muted-foreground uppercase">Case ID</p>
                              <p className="font-black text-primary tracking-tight">{activeCase.id}</p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-[10px] font-black text-muted-foreground uppercase">Classification</p>
                              <p className="font-black text-primary tracking-tight">{activeCase.caseType}</p>
                            </div>
                            <div className="space-y-1 pt-2">
                              <p className="text-[10px] font-black text-muted-foreground uppercase">Date Opened</p>
                              <p className="text-xs font-bold text-primary">{format(new Date(activeCase.createdAt), "PPP")}</p>
                            </div>
                            <div className="space-y-1 pt-2">
                              <p className="text-[10px] font-black text-muted-foreground uppercase">Date Closed</p>
                              <p className="text-xs font-bold text-primary">{activeCase.closedAt ? format(new Date(activeCase.closedAt), "PPP") : "---"}</p>
                            </div>
                            <div className="col-span-2 space-y-1 pt-2">
                              <p className="text-[10px] font-black text-muted-foreground uppercase">Description</p>
                              <p className="text-xs font-medium text-primary/80 italic leading-relaxed">{activeCase.description}</p>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">Attorney Assignment (Assign/Reassign)</Label>
                        <Select 
                          value={activeCase.lawyerId} 
                          onValueChange={(v) => handleReassignLawyer(activeCase.id, v)}
                        >
                          <SelectTrigger className="h-14 rounded-2xl border-primary/20 bg-white font-bold shadow-sm">
                            <div className="flex items-center gap-2">
                              <Briefcase className="h-4 w-4 text-secondary" />
                              <SelectValue placeholder="Select handling attorney" />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {lawyers?.map((l) => (
                              <SelectItem key={l.id} value={l.id} className="font-bold">
                                {l.firstName ? `Atty. ${l.firstName} ${l.lastName}` : l.email.split('@')[0]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <p className="text-[10px] text-muted-foreground font-medium text-center italic">Assigning a new lawyer will instantly update their workstation.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-8 bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/10 text-center">
                        <Scale className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                        <h4 className="text-lg font-black text-primary mb-2">Initialize Legal Record</h4>
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                          Assign an attorney to start the official legal process for this citizen.
                        </p>
                        
                        <div className="grid gap-4 text-left max-w-sm mx-auto">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Case Category</Label>
                            <Input 
                              value={newCaseData.caseType} 
                              onChange={e => setNewCaseData({...newCaseData, caseType: e.target.value})}
                              placeholder="e.g. Qualified Theft"
                              className="h-12 rounded-xl border-primary/10 bg-white"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Assign Attorney</Label>
                            <Select 
                              value={newCaseData.lawyerId} 
                              onValueChange={v => setNewCaseData({...newCaseData, lawyerId: v})}
                            >
                              <SelectTrigger className="h-12 rounded-xl border-primary/10 bg-white">
                                <SelectValue placeholder="Select Handling Lawyer" />
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
                          <Button 
                            className="w-full h-12 bg-primary text-white font-black rounded-xl mt-4 shadow-lg"
                            disabled={!newCaseData.lawyerId || isSubmitting}
                            onClick={handleCreateInitialCase}
                          >
                            {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Create & Assign Case"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="pt-6 animate-in slide-in-from-right-4 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Chronological Visit History</h4>
                    <Badge variant="outline" className="font-bold text-[9px] uppercase">{clientHistory?.length || 0} Records</Badge>
                  </div>
                  
                  {isHistoryLoading ? (
                    <div className="py-12 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary/20" /></div>
                  ) : clientHistory && clientHistory.length > 0 ? (
                    <div className="space-y-3">
                      {clientHistory.map((appt) => (
                        <div key={appt.id} className="p-4 bg-muted/20 rounded-2xl border border-primary/5 flex items-center justify-between group hover:bg-white transition-colors">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "h-10 w-10 rounded-xl flex items-center justify-center",
                              appt.status === 'completed' ? "bg-green-50 text-green-600" :
                              appt.status === 'cancelled' ? "bg-red-50 text-red-600" :
                              "bg-primary/5 text-primary"
                            )}>
                              {appt.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> :
                               appt.status === 'cancelled' ? <XCircle className="h-5 w-5" /> :
                               <Clock className="h-5 w-5" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-primary">{appt.caseType}</p>
                              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">
                                {format(new Date(appt.date), "PPP")} • {appt.time} • REF: {appt.referenceCode}
                              </p>
                            </div>
                          </div>
                          <Badge className={cn(
                            "font-black text-[8px] uppercase",
                            appt.status === 'completed' ? "bg-green-500" :
                            appt.status === 'cancelled' ? "bg-red-500" :
                            "bg-primary"
                          )}>
                            {appt.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed">
                      <History className="h-10 w-10 mx-auto text-primary/10 mb-2" />
                      <p className="text-sm font-bold text-muted-foreground italic">No past visit history found for this resident.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter className="p-6 md:p-8 bg-muted/30 shrink-0">
              <Button onClick={() => setIsDetailsOpen(false)} className="w-full h-14 rounded-2xl font-black bg-primary text-white shadow-xl">Close Resident Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- ADD CLIENT DIALOG --- */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="rounded-[3rem] max-w-lg p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-primary text-white">
              <DialogTitle className="text-2xl font-black">Register New Citizen</DialogTitle>
              <DialogDescription className="text-white/60 font-medium">Add a new client to the PAO registry system.</DialogDescription>
            </DialogHeader>
            <div className="p-8 space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Full Name</Label>
                  <Input value={newClient.name} onChange={e => setNewClient({...newClient, name: e.target.value})} className="h-12 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Mobile</Label>
                    <Input value={newClient.mobile} onChange={e => setNewClient({...newClient, mobile: e.target.value})} className="h-12 rounded-xl" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Classification</Label>
                    <Select value={newClient.income} onValueChange={v => setNewClient({...newClient, income: v})}>
                      <SelectTrigger className="h-12 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Indigent">Indigent</SelectItem>
                        <SelectItem value="Low Income">Low Income</SelectItem>
                        <SelectItem value="Government Employee">Govt Employee</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Email (Optional)</Label>
                  <Input value={newClient.email} onChange={e => setNewClient({...newClient, email: e.target.value})} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Address</Label>
                  <Input value={newClient.address} onChange={e => setNewClient({...newClient, address: e.target.value})} className="h-12 rounded-xl" />
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl h-12">Cancel</Button>
              <Button onClick={handleAddClient} disabled={isSubmitting} className="rounded-xl h-12 bg-primary font-black px-10">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Register Citizen"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
