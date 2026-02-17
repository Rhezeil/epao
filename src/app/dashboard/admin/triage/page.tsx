
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc, or } from "firebase/firestore";
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
  ClipboardList
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
  const { user, role } = useAuth();
  const { toast } = useToast();
  
  // States
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [reviewMode, setReviewMode] = useState<"assign" | "intake">("assign");
  const [assignedLawyer, setAssignedLawyer] = useState("");
  const [caseStatus, setCaseStatus] = useState("Active Case");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Screening Checklist States
  const [screening, setScreening] = useState({
    indigency: false,
    merit: false,
    idVerified: false
  });

  // Queries
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

  const { data: pendingAppointments, isLoading: isPendingLoading } = useCollection(pendingQuery);
  const { data: completedIntakes, isLoading: isIntakeLoading } = useCollection(completedIntakeQuery);
  const { data: lawyers } = useCollection(lawyersQuery);

  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "cases"));
  }, [db, user, role]);
  const { data: allCases } = useCollection(casesQuery);

  const triagableIntakes = useMemo(() => {
    if (!completedIntakes || !allCases) return completedIntakes || [];
    return completedIntakes.filter(intake => !allCases.some(c => c.initialAppointmentId === intake.id));
  }, [completedIntakes, allCases]);

  const handleAssignLawyer = async () => {
    if (!db || !selectedAppt || !assignedLawyer) return;
    if (!screening.indigency || !screening.merit || !screening.idVerified) {
      toast({ variant: "destructive", title: "Incomplete Screening", description: "All eligibility tests must be passed before confirmation." });
      return;
    }

    setIsProcessing(true);

    try {
      const apptRef = doc(db, "appointments", selectedAppt.id);
      updateDocumentNonBlocking(apptRef, {
        lawyerId: assignedLawyer,
        status: "scheduled",
        screenedAt: new Date().toISOString(),
        screeningDetails: screening
      });

      toast({ 
        title: "Client Qualified", 
        description: `Reference ${selectedAppt.referenceCode} confirmed and lawyer assigned.` 
      });
      setSelectedAppt(null);
      setScreening({ indigency: false, merit: false, idVerified: false });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: e.message });
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

      if (!clientId) {
        try {
          const secondaryApp = initializeApp(firebaseConfig, "client-reg-" + Date.now());
          const secondaryAuth = getAuth(secondaryApp);
          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, email, "password123");
          clientId = userCredential.user.uid;
          await deleteApp(secondaryApp);
        } catch (authError: any) {
          if (authError.code !== 'auth/email-already-in-use') throw authError;
        }
      }

      const caseRef = doc(db, "cases", caseId);
      setDocumentNonBlocking(caseRef, {
        id: caseId,
        clientId: clientId || crypto.randomUUID(),
        lawyerId: assignedLawyer,
        caseType: selectedAppt.caseType,
        status: "Active",
        initialAppointmentId: selectedAppt.id,
        description: `Official Case initialized from triage review. Source: ${selectedAppt.referenceCode}`,
        createdAt: new Date().toISOString()
      }, { merge: true });

      const userRef = doc(db, "users", clientId || "");
      setDocumentNonBlocking(userRef, {
        id: clientId,
        mobileNumber: selectedAppt.guestMobile || selectedAppt.clientMobile || "",
        email: email,
        role: "client",
        status: caseStatus,
        profileId: "profile",
        createdAt: new Date().toISOString()
      }, { merge: true });

      const profileRef = doc(db, "users", clientId || "", "profile", "profile");
      setDocumentNonBlocking(profileRef, {
        id: "profile",
        firstName: selectedAppt.guestName?.split(' ')[0] || selectedAppt.clientName?.split(' ')[0] || "",
        lastName: selectedAppt.guestName?.split(' ').slice(1).join(' ') || selectedAppt.clientName?.split(' ').slice(1).join(' ') || "",
        phoneNumber: selectedAppt.guestMobile || selectedAppt.clientMobile || "",
        address: selectedAppt.guestAddress || selectedAppt.clientAddress || "",
        createdAt: new Date().toISOString()
      }, { merge: true });

      toast({ 
        title: "Case Created", 
        description: `Official record ${caseId} initialized and citizen account activated.` 
      });
      setSelectedAppt(null);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Conversion Failed", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectRequest = () => {
    if (!db || !selectedAppt || !rejectionReason) return;
    setIsProcessing(true);

    const apptRef = doc(db, "appointments", selectedAppt.id);
    updateDocumentNonBlocking(apptRef, { 
      status: "cancelled", 
      rejectionReason, 
      rejectedAt: new Date().toISOString() 
    });

    toast({ 
      variant: "destructive",
      title: "Qualification Failed", 
      description: `Appointment ${selectedAppt.referenceCode} has been marked as Not Qualified.` 
    });
    
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedAppt(null);
      setRejectionReason("");
    }, 800);
  };

  const handleDeleteRequest = (id: string, refCode: string) => {
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, "appointments", id));
    toast({
      variant: "destructive",
      title: "Request Deleted",
      description: `Reference ${refCode} permanently removed.`
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Client Triage</h1>
            <p className="text-muted-foreground font-medium">Screen new intakes and evaluate eligibility for free legal assistance.</p>
          </div>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xl bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14">
            <TabsTrigger value="pending" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <ClipboardList className="h-4 w-4 mr-2" /> Triage Queue
            </TabsTrigger>
            <TabsTrigger value="intake" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <ClipboardCheck className="h-4 w-4 mr-2" /> Intake Review
            </TabsTrigger>
          </TabsList>

          {/* --- TRIAGE QUEUE (PENDING APPOINTMENTS) --- */}
          <TabsContent value="pending" className="mt-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-amber-50/50 pb-6">
                <CardTitle className="text-xl font-bold text-amber-900 flex items-center gap-2">
                  <Search className="h-6 w-6" /> Pending Eligibility Screening
                </CardTitle>
                <CardDescription>Evaluate indigent status and case merit for new requests.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isPendingLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div> : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Reference</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Citizen Name</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Category</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Citizen Type</TableHead>
                        <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingAppointments?.map((appt) => (
                        <TableRow key={appt.id} className="hover:bg-primary/5 transition-colors group">
                          <TableCell className="px-8 font-black text-primary">{appt.referenceCode}</TableCell>
                          <TableCell className="font-bold">{appt.guestName || appt.clientName || "Registered Citizen"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/5 font-bold text-[10px]">{appt.caseType}</Badge>
                          </TableCell>
                          <TableCell>
                            {!appt.clientId ? (
                              <Badge className="bg-secondary text-white border-none font-black text-[9px] uppercase">First-Time Guest</Badge>
                            ) : (
                              <Badge variant="outline" className="text-primary font-black text-[9px] uppercase border-primary/20">Registered Client</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right px-8 flex justify-end gap-2">
                            <Button size="sm" onClick={() => { setSelectedAppt(appt); setReviewMode("assign"); }} className="rounded-xl font-black bg-primary hover:bg-primary/90 shadow-md">
                              <ShieldCheck className="mr-2 h-4 w-4" /> Start Screening
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleDeleteRequest(appt.id, appt.referenceCode)} 
                              className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!pendingAppointments || pendingAppointments.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic font-medium">
                            No pending requests requiring screening.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- INTAKE REVIEW (COMPLETED CONSULTATIONS) --- */}
          <TabsContent value="intake" className="mt-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6">
                <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" /> Consultation Completed
                </CardTitle>
                <CardDescription>Final review of visits to initialize official Case files.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isIntakeLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div> : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Reference</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Citizen Name</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Category</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Visit Date</TableHead>
                        <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {triagableIntakes.map((intake) => (
                        <TableRow key={intake.id} className="hover:bg-primary/5 transition-colors group">
                          <TableCell className="px-8 font-black text-primary">{intake.referenceCode}</TableCell>
                          <TableCell className="font-bold">{intake.guestName || intake.clientName || "Registered Citizen"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-100 font-bold text-[10px]">{intake.caseType}</Badge>
                          </TableCell>
                          <TableCell className="text-xs font-medium text-muted-foreground">{format(new Date(intake.date), "PPP")}</TableCell>
                          <TableCell className="text-right px-8 flex justify-end gap-2">
                            <Button size="sm" onClick={() => { setSelectedAppt(intake); setReviewMode("intake"); }} className="rounded-xl font-black bg-secondary hover:bg-secondary/90 shadow-md">
                              <Eye className="mr-2 h-4 w-4" /> Review & Convert
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              onClick={() => handleDeleteRequest(intake.id, intake.referenceCode)} 
                              className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {triagableIntakes.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic font-medium">
                            No completed intakes awaiting Case conversion.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* --- TRIAGE & SCREENING DIALOG --- */}
        <Dialog open={!!selectedAppt} onOpenChange={() => { setSelectedAppt(null); setRejectionReason(""); setScreening({ indigency: false, merit: false, idVerified: false }); }}>
          <DialogContent className="rounded-[3rem] max-w-lg p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className={cn(
              "p-6 md:p-8 text-white shrink-0",
              reviewMode === 'intake' ? "bg-secondary" : "bg-primary"
            )}>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl md:text-3xl font-black tracking-tight">
                    {reviewMode === 'intake' ? "Intake Review" : "Screening Process"}
                  </DialogTitle>
                  <DialogDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest">
                    Reference: {selectedAppt?.referenceCode}
                  </DialogDescription>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl hidden sm:block">
                  {reviewMode === 'intake' ? <ClipboardCheck className="h-8 w-8" /> : <ShieldCheck className="h-8 w-8" />}
                </div>
              </div>
            </DialogHeader>

            <div className="p-6 md:p-10 space-y-8 flex-1 overflow-y-auto">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Citizen</Label>
                  <p className="font-black text-primary leading-tight">{selectedAppt?.guestName || selectedAppt?.clientName || "Registered Account"}</p>
                  <p className="text-xs font-bold text-muted-foreground">{selectedAppt?.guestMobile || selectedAppt?.clientMobile}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Service</Label>
                  <p className="text-sm font-bold text-primary">{selectedAppt?.caseType}</p>
                </div>
              </div>

              {reviewMode === 'assign' && (
                <div className="p-6 bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/10 space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardCheck className="h-4 w-4 text-primary" />
                    <span className="text-[10px] font-black uppercase text-primary tracking-widest">Screening Checklist</span>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 bg-white/50 p-3 rounded-xl border">
                      <Checkbox 
                        id="indigency" 
                        checked={screening.indigency}
                        onCheckedChange={(checked) => setScreening({ ...screening, indigency: !!checked })}
                      />
                      <label htmlFor="indigency" className="text-xs font-bold text-primary leading-none cursor-pointer">
                        Indigency Test (Income within PAO limits)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/50 p-3 rounded-xl border">
                      <Checkbox 
                        id="merit" 
                        checked={screening.merit}
                        onCheckedChange={(checked) => setScreening({ ...screening, merit: !!checked })}
                      />
                      <label htmlFor="merit" className="text-xs font-bold text-primary leading-none cursor-pointer">
                        Merit Test (Legal basis for assistance)
                      </label>
                    </div>
                    <div className="flex items-center space-x-3 bg-white/50 p-3 rounded-xl border">
                      <Checkbox 
                        id="idVerified" 
                        checked={screening.idVerified}
                        onCheckedChange={(checked) => setScreening({ ...screening, idVerified: !!checked })}
                      />
                      <label htmlFor="idVerified" className="text-xs font-bold text-primary leading-none cursor-pointer">
                        Identity Verification (Valid ID presented)
                      </label>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">
                    {reviewMode === 'intake' ? "Assign Permanent Lawyer" : "Assign Lawyer for Consultation"}
                  </Label>
                  <Select value={assignedLawyer} onValueChange={setAssignedLawyer}>
                    <SelectTrigger className="h-14 rounded-2xl border-primary/20 bg-white font-bold shadow-sm">
                      <SelectValue placeholder="Select an authorized public attorney" />
                    </SelectTrigger>
                    <SelectContent>
                      {lawyers?.map((lawyer) => (
                        <SelectItem key={lawyer.id} value={lawyer.id} className="font-bold">
                          {lawyer.firstName ? `Atty. ${lawyer.firstName} ${lawyer.lastName}` : lawyer.email.split('@')[0]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {reviewMode === 'intake' && (
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Initial Case Status</Label>
                    <Select value={caseStatus} onValueChange={setCaseStatus}>
                      <SelectTrigger className="h-14 rounded-2xl border-primary/20 bg-white font-bold shadow-sm">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active Case" className="font-bold">Active Case</SelectItem>
                        <SelectItem value="Under Screening" className="font-bold">Under Screening</SelectItem>
                        <SelectItem value="New Intake" className="font-bold">New Intake</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              <div className="pt-6 border-t border-primary/5 space-y-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Not Qualified / Reject?</span>
                </div>
                <div className="space-y-2">
                  <Textarea 
                    placeholder="Reason for disqualification (e.g., Exceeds income limit)..."
                    className="rounded-2xl border-primary/10 bg-white text-sm font-medium min-h-[100px]"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="p-6 md:p-8 bg-muted/30 flex gap-4 shrink-0">
              <Button variant="outline" onClick={() => setSelectedAppt(null)} className="flex-1 h-14 rounded-2xl font-bold">Close</Button>
              {rejectionReason ? (
                <Button 
                  variant="outline" 
                  disabled={isProcessing}
                  onClick={handleRejectRequest}
                  className="flex-1 h-14 rounded-2xl font-black border-red-200 text-red-600 hover:bg-red-50"
                >
                  Mark Not Qualified
                </Button>
              ) : (
                <Button 
                  onClick={reviewMode === 'intake' ? handleCreateCase : handleAssignLawyer} 
                  disabled={
                    !assignedLawyer || 
                    isProcessing || 
                    (reviewMode === 'assign' && (!screening.indigency || !screening.merit || !screening.idVerified))
                  } 
                  className={cn(
                    "flex-1 h-14 rounded-2xl font-black text-lg shadow-xl",
                    reviewMode === 'intake' ? "bg-secondary" : "bg-primary"
                  )}
                >
                  {isProcessing ? <Loader2 className="animate-spin h-6 w-6" /> : <ShieldCheck className="mr-2 h-6 w-6" />}
                  {reviewMode === 'intake' ? "Confirm & Create Case" : "Qualify & Confirm"}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
