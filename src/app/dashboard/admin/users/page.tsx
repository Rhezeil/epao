"use client";

import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking, setDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
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
  History
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
import { useState, useMemo } from "react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";
import { cn } from "@/lib/utils";

export default function AdminUsersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user: currentUser, role: currentRole } = useAuth();

  // Search and Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Client State
  const [newClient, setNewClient] = useState({
    name: "",
    mobile: "",
    email: "",
    address: "",
    income: "Indigent",
    category: "General"
  });

  // Queries
  const usersQuery = useMemoFirebase(() => {
    if (!db || !currentUser || currentRole !== 'admin') return null;
    return query(collection(db, "users"), orderBy("createdAt", "desc"));
  }, [db, currentUser, currentRole]);

  const { data: users, isLoading } = useCollection(usersQuery);

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    return users.filter(u => 
      u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.mobileNumber?.includes(searchQuery)
    );
  }, [users, searchQuery]);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    setIsSubmitting(true);

    try {
      const email = newClient.email || `${newClient.mobile}@epao.mobile`;
      
      // 1. Create Auth Account Simulation/Action
      try {
        const secondaryApp = initializeApp(firebaseConfig, "client-creation-" + Date.now());
        const secondaryAuth = getAuth(secondaryApp);
        const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, "password123");
        const uid = userCredential.user.uid;
        
        // 2. Create User Record
        const userRef = doc(db, "users", uid);
        setDocumentNonBlocking(userRef, {
          id: uid,
          mobileNumber: newClient.mobile,
          email: email,
          role: "client",
          status: "New Intake",
          incomeClassification: newClient.income,
          createdAt: new Date().toISOString()
        }, { merge: true });

        // 3. Create Profile
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
      } catch (authError: any) {
        if (authError.code !== 'auth/email-already-in-use') throw authError;
      }

      toast({ title: "Client Registered", description: `${newClient.name} added to directory.` });
      setIsAddDialogOpen(false);
      setNewClient({ name: "", mobile: "", email: "", address: "", income: "Indigent", category: "General" });
    } catch (error: any) {
      toast({ variant: "destructive", title: "Failed", description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStatus = (userId: string, newStatus: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "users", userId), { status: newStatus });
    toast({ title: "Status Updated", description: `Client is now ${newStatus}.` });
  };

  const handleLockAccount = (userId: string, locked: boolean) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "users", userId), { accountLocked: locked });
    toast({ 
      variant: locked ? "destructive" : "default",
      title: locked ? "Account Locked" : "Account Unlocked", 
      description: `Access permissions updated.` 
    });
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
                  placeholder="Search by email or mobile..." 
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
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Income Rank</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Case Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Registration</TableHead>
                    <TableHead className="text-right px-8 font-black text-[10px] uppercase tracking-widest text-primary/40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((client) => (
                    <TableRow key={client.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white shadow-sm">
                            <UserCircle className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <p className="font-black text-primary leading-none mb-1">{client.email?.split('@')[0]}</p>
                            <p className="text-[10px] text-muted-foreground font-bold">{client.mobileNumber || client.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-100 font-bold uppercase text-[9px]">
                          {client.incomeClassification || "Indigent"}
                        </Badge>
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
                      <TableCell className="text-[10px] font-bold text-muted-foreground">
                        {client.createdAt ? format(new Date(client.createdAt), "MMM dd, yyyy") : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl text-primary hover:bg-primary/5"
                            onClick={() => { setSelectedClient(client); setIsDetailsOpen(true); }}
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
                              <DropdownMenuItem onClick={() => handleLockAccount(client.id, !client.accountLocked)} className="rounded-xl font-bold">
                                <Lock className="mr-2 h-4 w-4" /> {client.accountLocked ? "Unlock Access" : "Restrict Access"}
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
                  ))}
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

        {/* --- ADD CLIENT DIALOG --- */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="rounded-[3rem] max-w-lg p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-primary text-white">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <DialogTitle className="text-3xl font-black tracking-tight">Register Citizen</DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Manual Intake Entry</DialogDescription>
                </div>
                <UserPlus className="h-10 w-10 text-white/20" />
              </div>
            </DialogHeader>
            <form onSubmit={handleAddClient} className="p-10 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Full Legal Name</Label>
                  <Input 
                    placeholder="Juan Dela Cruz" 
                    value={newClient.name} 
                    onChange={e => setNewClient({...newClient, name: e.target.value})} 
                    required 
                    className="h-12 rounded-xl border-primary/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Mobile Number</Label>
                  <Input 
                    placeholder="09123456789" 
                    value={newClient.mobile} 
                    onChange={e => setNewClient({...newClient, mobile: e.target.value})} 
                    required 
                    className="h-12 rounded-xl border-primary/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Email (Optional)</Label>
                  <Input 
                    type="email" 
                    placeholder="name@example.com" 
                    value={newClient.email} 
                    onChange={e => setNewClient({...newClient, email: e.target.value})} 
                    className="h-12 rounded-xl border-primary/10"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Income Classification</Label>
                  <Select value={newClient.income} onValueChange={v => setNewClient({...newClient, income: v})}>
                    <SelectTrigger className="h-12 rounded-xl border-primary/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Indigent">Indigent (Qualified)</SelectItem>
                      <SelectItem value="Lower Class">Lower Class</SelectItem>
                      <SelectItem value="Middle Class">Middle Class (Evaluation Required)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Residential Address</Label>
                <Input 
                  placeholder="Street, Barangay, City" 
                  value={newClient.address} 
                  onChange={e => setNewClient({...newClient, address: e.target.value})} 
                  required 
                  className="h-12 rounded-xl border-primary/10"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button variant="outline" type="button" onClick={() => setIsAddDialogOpen(false)} className="h-14 rounded-2xl font-bold flex-1">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="h-14 rounded-2xl font-black bg-primary text-white flex-1 shadow-xl">
                  {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirm Registration"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* --- DETAILS & PROFILE OVERLAY --- */}
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="rounded-[3rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-secondary text-white">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-black">{selectedClient?.email?.split('@')[0]}</DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                    ID: {selectedClient?.id?.slice(0, 8)}...
                  </DialogDescription>
                </div>
                <Badge className="bg-white text-secondary font-black px-4 py-2 rounded-xl">{selectedClient?.status || "Active"}</Badge>
              </div>
            </DialogHeader>
            <div className="p-10">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1 rounded-2xl h-14">
                  <TabsTrigger value="overview" className="rounded-xl font-bold">Overview</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-xl font-bold">Visit Logs</TabsTrigger>
                  <TabsTrigger value="cases" className="rounded-xl font-bold">Legal Matters</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-6 pt-6 animate-in fade-in duration-500">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Contact Identity</Label>
                        <p className="font-bold text-primary flex items-center gap-2"><History className="h-4 w-4 opacity-40" /> {selectedClient?.mobileNumber}</p>
                        <p className="text-xs font-medium text-muted-foreground">{selectedClient?.email}</p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Income Status</Label>
                        <p className="font-bold text-primary">{selectedClient?.incomeClassification || "Indigent"}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Account Security</Label>
                        <div className="flex gap-2">
                          <Badge variant={selectedClient?.accountLocked ? "destructive" : "outline"} className="font-black text-[9px]">
                            {selectedClient?.accountLocked ? "LOCKED" : "UNLOCKED"}
                          </Badge>
                          <Badge variant="outline" className="font-black text-[9px] border-primary/20 text-primary">CLIENT ROLE</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="pt-6 animate-in slide-in-from-right-4">
                  <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed">
                    <Calendar className="h-10 w-10 mx-auto text-primary/10 mb-2" />
                    <p className="text-sm font-bold text-muted-foreground">Historical logs are being migrated...</p>
                  </div>
                </TabsContent>

                <TabsContent value="cases" className="pt-6 animate-in slide-in-from-right-4">
                  <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed">
                    <FileText className="h-10 w-10 mx-auto text-primary/10 mb-2" />
                    <p className="text-sm font-bold text-muted-foreground">No active litigation records found.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter className="p-8 bg-muted/30">
              <Button onClick={() => setIsDetailsOpen(false)} className="w-full h-14 rounded-2xl font-black bg-primary text-white">Close Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
