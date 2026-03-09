
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Loader2, 
  UserPlus, 
  ClipboardCheck, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Info,
  Trash2,
  Scale,
  Search,
  User,
  Clock,
  ClipboardList,
  Lock,
  ArrowRight
} from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";

export default function AdminTriagePage() {
  const db = useFirestore();
  const { user, role, loading } = useAuth();
  const { toast } = useToast();
  
  // States
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [reviewMode, setReviewMode] = useState<"assign" | "intake">("assign");
  const [assignedLawyer, setAssignedLawyer] = useState("");
  const [caseStatus, setCaseStatus] = useState("Active");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Screening Checklist States
  const [screening, setScreening] = useState({
    indigency: false,
    merit: false,
    idVerified: false
  });

  // Queries - Shared Registry
  const pendingQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "appointments"), where("status", "==", "pending"));
  }, [db, user, role]);

  const completedIntakeQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "appointments"), where("status", "==", "completed"), where("type", "==", "initial"));
  }, [db, user, role]);

  const lawyersQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "roleLawyer"));
  }, [db, user, role]);

  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "cases"));
  }, [db, user, role]);

  const { data: pendingAppointments, isLoading: isPendingLoading } = useCollection(pendingQuery);
  const { data: completedIntakes, isLoading: isIntakeLoading } = useCollection(completedIntakeQuery);
  const { data: lawyers } = useCollection(lawyersQuery);
  const { data: allCases } = useCollection(casesQuery);

  const triagableIntakes = useMemo(() => {
    if (!completedIntakes || !allCases) return completedIntakes || [];
    return completedIntakes.filter(intake => !allCases.some(c => c.initialAppointmentId === intake.id));
  }, [completedIntakes, allCases]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || role !== 'admin') return null;

  const handleAssignLawyer = async () => {
    if (!db || !selectedAppt || !assignedLawyer) return;
    if (!screening.indigency || !screening.merit || !screening.idVerified) {
      toast({ variant: "destructive", title: "Incomplete Screening", description: "All eligibility tests must be passed." });
      return;
    }

    setIsProcessing(true);
    try {
      const apptRef = doc(db, "appointments", selectedAppt.id);
      updateDocumentNonBlocking(apptRef, {
        lawyerId: assignedLawyer,
        status: "scheduled",
        screenedAt: new Date().toISOString(),
        screeningDetails: screening,
        notified: false 
      });

      toast({ title: "Client Qualified", description: "Reference confirmed and lawyer assigned." });
      setSelectedAppt(null);
      setScreening({ indigency: false, merit: false, idVerified: false });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateCase = async () => {
    if (!db || !selectedAppt || !assignedLawyer) return;
    setIsProcessing(true);

    try {
      const year = new Date().getFullYear();
      const caseId = `CASE-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      let clientId = selectedAppt.clientId;
      const email = selectedAppt.guestEmail || selectedAppt.clientEmail || `${selectedAppt.guestMobile || selectedAppt.clientMobile}@epao.mobile`;

      // 1. Account Activation (Unified Client Registration)
      if (!clientId) {
        try {
          const secondaryApp = initializeApp(firebaseConfig, "client-reg-" + Date.now());
          const secondaryAuth = getAuth(secondaryApp);
          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, "password123");
          clientId = userCredential.user.uid;
          await deleteApp(secondaryApp);
        } catch (authError: any) {
          if (authError.code !== 'auth/email-already-in-use') {
             // If error is something else, we might need a fallback UID
             clientId = clientId || crypto.randomUUID();
          }
        }
      }

      // 2. Link initial appointment to newly created Client UID for history synchronization
      const apptRef = doc(db, "appointments", selectedAppt.id);
      updateDocumentNonBlocking(apptRef, {
        clientId: clientId,
        updatedAt: new Date().toISOString()
      });

      // 3. Initialize Case Record (Synchronized with Admin/Lawyer/Client)
      const caseRef = doc(db, "cases", caseId);
      setDocumentNonBlocking(caseRef, {
        id: caseId,
        clientId: clientId || crypto.randomUUID(),
        lawyerId: assignedLawyer,
        caseType: selectedAppt.caseType,
        status: caseStatus,
        initialAppointmentId: selectedAppt.id,
        description: `Official Case converted from triage ${selectedAppt.referenceCode}.`,
        createdAt: new Date().toISOString()
      }, { merge: true });

      // 4. Update Citizen Record (Shared User Database)
      const userRef = doc(db, "users", clientId || "");
      setDocumentNonBlocking(userRef, {
        id: clientId,
        mobileNumber: selectedAppt.guestMobile || selectedAppt.clientMobile || "",
        email: email,
        fullName: selectedAppt.guestName || selectedAppt.clientName || "",
        role: "client",
        status: "Active Case",
        createdAt: new Date().toISOString()
      }, { merge: true });

      toast({ title: "Case Created", description: `Record ${caseId} initialized and citizen account activated.` });
      setSelectedAppt(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Intake Triage Workstation</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">Shared Decision Support for Unified Case Management</p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xl bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14">
            <TabsTrigger value="pending" className="rounded-xl font-bold">Triage Queue</TabsTrigger>
            <TabsTrigger value="intake" className="rounded-xl font-bold">Intake Review</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-amber-50/50 border-b border-amber-100/50">
                <CardTitle className="text-xl font-bold text-amber-900 flex items-center gap-2">
                  <Search className="h-6 w-6" /> Pending Eligibility Screening
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Reference</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Citizen</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Matter</TableHead>
                      <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingAppointments?.map((appt) => (
                      <TableRow key={appt.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="px-8 font-black text-primary py-6">{appt.referenceCode}</TableCell>
                        <TableCell className="font-bold">{appt.guestName || appt.clientName}</TableCell>
                        <TableCell className="text-center"><Badge variant="outline" className="text-[9px] uppercase px-3">{appt.caseType}</Badge></TableCell>
                        <TableCell className="text-right px-8 flex justify-end gap-2">
                          <Button size="sm" onClick={() => { setSelectedAppt(appt); setReviewMode("assign"); }} className="rounded-xl font-black bg-primary text-white">Start Screening</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="intake" className="mt-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10">
                <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" /> Conversion Queue
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Reference</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Citizen</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Visit Date</TableHead>
                      <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {triagableIntakes.map((intake) => (
                      <TableRow key={intake.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="px-8 font-black text-primary py-6">{intake.referenceCode}</TableCell>
                        <TableCell className="font-bold">{intake.guestName || intake.clientName}</TableCell>
                        <TableCell className="text-xs font-medium">{format(new Date(intake.date), "PPP")}</TableCell>
                        <TableCell className="text-right px-8">
                          <Button size="sm" onClick={() => { setSelectedAppt(intake); setReviewMode("intake"); }} className="rounded-xl font-black bg-secondary text-white">Convert to Case</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={!!selectedAppt} onOpenChange={() => setSelectedAppt(null)}>
          <DialogContent className="rounded-[3rem] max-w-lg p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
            <DialogHeader className={cn("p-8 text-white", reviewMode === 'intake' ? "bg-secondary" : "bg-primary")}>
              <DialogTitle className="text-2xl font-black">{reviewMode === 'intake' ? "Case Conversion" : "Screening Profile"}</DialogTitle>
              <DialogDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Ref: {selectedAppt?.referenceCode}</DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-8 flex-1 overflow-y-auto">
              {reviewMode === 'assign' && (
                <div className="p-6 bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/10 space-y-4">
                  <div className="flex items-center gap-2 mb-2"><ClipboardCheck className="h-4 w-4 text-primary" /><span className="text-[10px] font-black uppercase tracking-widest">Checklist</span></div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border">
                      <Checkbox id="ind" checked={screening.indigency} onCheckedChange={c => setScreening({...screening, indigency: !!c})} />
                      <label htmlFor="ind" className="text-xs font-bold text-primary">Indigency Test Passed</label>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border">
                      <Checkbox id="mer" checked={screening.merit} onCheckedChange={c => setScreening({...screening, merit: !!c})} />
                      <label htmlFor="mer" className="text-xs font-bold text-primary">Legal Merit Validated</label>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border">
                      <Checkbox id="idv" checked={screening.idVerified} onCheckedChange={c => setScreening({...screening, idVerified: !!c})} />
                      <label htmlFor="idv" className="text-xs font-bold text-primary">Identity Verified</label>
                    </div>
                  </div>
                </div>
              )}
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Assigned Lawyer</Label>
                  <Select value={assignedLawyer} onValueChange={setAssignedLawyer}>
                    <SelectTrigger className="h-12 rounded-xl border-primary/10 font-bold"><SelectValue placeholder="Select Attorney" /></SelectTrigger>
                    <SelectContent>{lawyers?.map(l => <SelectItem key={l.id} value={l.id} className="font-bold">{l.firstName ? `Atty. ${l.firstName} ${l.lastName}` : l.email}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {reviewMode === 'intake' && (
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Record Status</Label>
                    <Select value={caseStatus} onValueChange={setCaseStatus}>
                      <SelectTrigger className="h-12 rounded-xl border-primary/10 font-bold"><SelectValue /></SelectTrigger>
                      <SelectContent><SelectItem value="Active" className="font-bold">Active Case</SelectItem><SelectItem value="Pending Mediation" className="font-bold">Pending Mediation</SelectItem></SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 flex gap-4">
              <Button variant="outline" onClick={() => setSelectedAppt(null)} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
              <Button onClick={reviewMode === 'intake' ? handleCreateCase : handleAssignLawyer} disabled={!assignedLawyer || isProcessing || (reviewMode === 'assign' && (!screening.indigency || !screening.merit || !screening.idVerified))} className={cn("flex-1 h-12 rounded-xl font-black text-white shadow-lg", reviewMode === 'intake' ? "bg-secondary" : "bg-primary")}>
                {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : (reviewMode === 'intake' ? "Activate Case" : "Qualify & Schedule")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
