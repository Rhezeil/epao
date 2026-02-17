
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
  UserCheck, 
  Search, 
  Settings2,
  Edit3,
  Camera,
  Scale
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

export default function AdminLawyersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user, role, loading } = useAuth();
  
  // Controls
  const [newLawyer, setNewLawyer] = useState({ email: "", password: "", firstName: "", lastName: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Reassignment State
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
    return query(collection(db, "cases"));
  }, [db, user, role]);

  const { data: registeredLawyers, isLoading: isLawyersLoading } = useCollection(registeredLawyersQuery);
  const { data: allCases } = useCollection(casesQuery);

  // SAFE GUARD
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || role !== 'admin') return null;

  const lawyerMetrics = useMemo(() => {
    if (!registeredLawyers) return [];

    return registeredLawyers.map(lawyer => {
      return {
        ...lawyer,
        status: lawyer.status || "Available"
      };
    });
  }, [registeredLawyers]);

  const filteredLawyers = useMemo(() => {
    return lawyerMetrics.filter(l => 
      l.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${l.firstName} ${l.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [lawyerMetrics, searchQuery]);

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
        throw authError;
      } finally {
        await deleteApp(secondaryApp);
      }

      if (newUserId) {
        const lawyerRef = doc(db, "roleLawyer", newUserId);
        setDocumentNonBlocking(lawyerRef, {
          id: newUserId,
          email,
          firstName: newLawyer.firstName,
          lastName: newLawyer.lastName,
          role: "lawyer",
          status: "Available",
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      toast({ title: "Lawyer Provisioned", description: `${email} is now an authorized public attorney.` });
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
    const lawyerRef = doc(db, "roleLawyer", selectedLawyer.id);
    updateDocumentNonBlocking(lawyerRef, editLawyerData);
    toast({ title: "Profile Updated", description: "Lawyer details have been saved." });
    setIsEditOpen(false);
    setIsSubmitting(false);
  };

  const handleSingleCaseReassign = (caseId: string, newLawyerId: string) => {
    if (!db || !caseId || !newLawyerId) return;
    updateDocumentNonBlocking(doc(db, "cases", caseId), { lawyerId: newLawyerId });
    toast({ title: "Case Reassigned", description: "Legal Case successfully moved." });
  };

  const currentLawyerCases = useMemo(() => {
    if (!selectedLawyer || !allCases) return [];
    return allCases.filter(c => c.lawyerId === selectedLawyer.id && c.status === 'Active');
  }, [selectedLawyer, allCases]);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 pb-12">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Lawyer Directory</h1>
            <p className="text-muted-foreground font-medium">Manage staff profiles and assign photos.</p>
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
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                    <Input 
                      placeholder="Search attorneys..." 
                      className="pl-9 h-11 rounded-xl border-primary/10 bg-white"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {isLawyersLoading ? <div className="p-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div> : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Attorney</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Status</TableHead>
                        <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLawyers.map((lawyer) => (
                        <TableRow key={lawyer.id} className="hover:bg-primary/5 transition-colors group">
                          <TableCell className="px-8 py-6">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                                <AvatarImage src={lawyer.photoUrl} className="object-cover" />
                                <AvatarFallback className="bg-primary/10 text-primary font-black">
                                  {lawyer.firstName?.[0] || lawyer.email[0].toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-black text-primary leading-none mb-1">
                                  {lawyer.firstName ? `${lawyer.firstName} ${lawyer.lastName}` : lawyer.email.split('@')[0]}
                                </p>
                                <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">{lawyer.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className={cn(
                              "font-black text-[9px] uppercase",
                              lawyer.status === 'Available' ? 'border-green-200 text-green-700 bg-green-50' : 
                              lawyer.status === 'Onsite' ? 'border-blue-200 text-blue-700 bg-blue-50' :
                              'border-amber-200 text-amber-700 bg-amber-50'
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
                                  <DropdownMenuItem onClick={() => updateDocumentNonBlocking(doc(db, "roleLawyer", lawyer.id), { status: "Onsite" })} className="rounded-xl font-bold">
                                    Mark as Onsite
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
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">First Name</Label>
                      <Input value={newLawyer.firstName} onChange={e => setNewLawyer({...newLawyer, firstName: e.target.value})} placeholder="Juan" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Last Name</Label>
                      <Input value={newLawyer.lastName} onChange={e => setNewLawyer({...newLawyer, lastName: e.target.value})} placeholder="Dela Cruz" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Work Email</Label>
                      <Input type="email" value={newLawyer.email} onChange={(e) => setNewLawyer({...newLawyer, email: e.target.value})} required placeholder="name@lawyers.com" className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Temp Password</Label>
                      <Input type="password" value={newLawyer.password} onChange={(e) => setNewLawyer({...newLawyer, password: e.target.value})} required placeholder="Min 6 chars" className="h-12 rounded-xl" />
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
          <DialogContent className="rounded-[3rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="p-8 bg-primary text-white shrink-0">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20 border-4 border-white/20 shadow-xl">
                  <AvatarImage src={editLawyerData.photoUrl} className="object-cover" />
                  <AvatarFallback className="bg-white/10 text-2xl font-black text-white">
                    {editLawyerData.firstName?.[0] || "?"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <DialogTitle className="text-3xl font-black">Edit Attorney Profile</DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                    Staff Account: {selectedLawyer?.email}
                  </DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto">
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-none h-14">
                  <TabsTrigger value="profile" className="rounded-none font-bold">Personal Details</TabsTrigger>
                  <TabsTrigger value="cases" className="rounded-none font-bold">Assigned Cases ({currentLawyerCases.length})</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="p-10 space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">First Name</Label>
                      <Input value={editLawyerData.firstName} onChange={e => setEditLawyerData({...editLawyerData, firstName: e.target.value})} className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Last Name</Label>
                      <Input value={editLawyerData.lastName} onChange={e => setEditLawyerData({...editLawyerData, lastName: e.target.value})} className="h-12 rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Contact Number</Label>
                      <Input value={editLawyerData.phoneNumber} onChange={e => setEditLawyerData({...editLawyerData, phoneNumber: e.target.value})} className="h-12 rounded-xl" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1 flex items-center gap-2">
                        <Camera className="h-3 w-3" /> Profile Photo URL
                      </Label>
                      <Input 
                        placeholder="https://images.unsplash.com/photo-..." 
                        value={editLawyerData.photoUrl} 
                        onChange={e => setEditLawyerData({...editLawyerData, photoUrl: e.target.value})} 
                        className="h-12 rounded-xl"
                      />
                      <p className="text-[9px] text-muted-foreground italic ml-1">Paste a public image URL to update the lawyer's professional portrait.</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="cases" className="p-0">
                  {currentLawyerCases.length > 0 ? (
                    <Table>
                      <TableHeader className="bg-muted/30">
                        <TableRow>
                          <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Case ID</TableHead>
                          <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Type</TableHead>
                          <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Reassign To</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentLawyerCases.map(c => (
                          <TableRow key={c.id}>
                            <TableCell className="px-8 font-black text-primary">{c.id}</TableCell>
                            <TableCell className="text-xs font-bold">{c.caseType}</TableCell>
                            <TableCell className="text-right px-8">
                              <Select onValueChange={(newLawyerId) => handleSingleCaseReassign(c.id, newLawyerId)}>
                                <SelectTrigger className="h-9 w-40 rounded-lg text-[10px] font-bold">
                                  <SelectValue placeholder="Select Lawyer" />
                                </SelectTrigger>
                                <SelectContent>
                                  {lawyerMetrics.filter(l => l.id !== selectedLawyer?.id).map(l => (
                                    <SelectItem key={l.id} value={l.id} className="text-xs font-bold">
                                      {l.firstName || l.email.split('@')[0]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="p-20 text-center space-y-4">
                      <Scale className="h-12 w-12 text-primary/10 mx-auto" />
                      <p className="text-sm font-bold text-muted-foreground">This lawyer has no active legal Cases assigned.</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter className="p-8 bg-muted/30 gap-3 shrink-0">
              <Button variant="outline" onClick={() => setIsEditOpen(false)} className="flex-1 h-14 rounded-2xl font-bold">Cancel</Button>
              <Button 
                onClick={handleUpdateLawyerProfile} 
                disabled={isSubmitting} 
                className="flex-1 h-14 rounded-2xl font-black bg-primary text-white shadow-xl"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Save Profile Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
