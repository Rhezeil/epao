
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ShieldCheck, 
  Loader2, 
  ClipboardCheck, 
  XCircle, 
  Search, 
  Scale,
  Info,
  Gavel,
  User,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { format, startOfToday } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";
import { caseCategories } from "@/app/lib/case-data";

const OUTCOME_OPTIONS = [
  "Completed Consultation – Accept Legal Assistance",
  "Completed Consultation – Denial of Legal Assistance"
];

const REJECTION_REASONS = [
  "Non-Indigent (Failed Means Test)",
  "Case Not Covered / Not Qualified",
  "Incomplete Requirements",
  "Conflict of Interest",
  "Misrepresentation / False Information",
  "Procedural Disqualification"
];

export default function AdminIntakeAssessmentPage() {
  const db = useFirestore();
  const { user, role, loading } = useAuth();
  const { toast } = useToast();
  
  // States
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [isEvaluationOpen, setIsEvaluationOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [assignedLawyer, setAssignedLawyer] = useState("");

  // Evaluation Checklist States
  const [screening, setScreening] = useState({
    indigency: false,
    merit: false,
    idVerified: false,
    notes: ""
  });

  // Queries
  const assessmentQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "appointments"), where("status", "==", "For Screening"));
  }, [db, user, role]);

  const approvedQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "appointments"), where("status", "==", "Eligible"));
  }, [db, user, role]);

  const reviewQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "appointments"), where("status", "==", OUTCOME_OPTIONS[0]));
  }, [db, user, role]);

  const lawyersQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "roleLawyer"));
  }, [db, user, role]);

  const dutiesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "lawyerDuties"), where("date", ">=", startOfToday().toISOString()));
  }, [db, user, role]);

  const { data: screeningAppointments, isLoading: isScreeningLoading } = useCollection(assessmentQuery);
  const { data: eligibleAppointments, isLoading: isEligibleLoading } = useCollection(approvedQuery);
  const { data: acceptedAppointments, isLoading: isAcceptedLoading } = useCollection(reviewQuery);
  const { data: lawyers } = useCollection(lawyersQuery);
  const { data: currentDuties } = useCollection(dutiesQuery);

  const lawyersOnDuty = useMemo(() => {
    if (!lawyers || !currentDuties) return [];
    const today = format(new Date(), "yyyy-MM-dd");
    return lawyers.map(l => {
      const isOnOfficeDuty = currentDuties.some(d => d.lawyerId === l.id && d.category === "Office Work" && d.date.startsWith(today));
      return { ...l, isOnOfficeDuty };
    });
  }, [lawyers, currentDuties]);

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || role !== 'admin') return null;

  const handleScreeningResult = (result: 'Eligible' | 'Not Eligible' | 'For Completion') => {
    if (!db || !selectedAppt || !user) return;
    
    setIsProcessing(true);
    const apptRef = doc(db, "appointments", selectedAppt.id);
    updateDocumentNonBlocking(apptRef, {
      status: result,
      screeningDetails: {
        ...screening,
        adminId: user.uid,
        screenedAt: new Date().toISOString(),
        rejectionReason: result === 'Not Eligible' ? rejectionReason : null
      },
      updatedAt: new Date().toISOString()
    });

    const clientName = selectedAppt.guestName || selectedAppt.clientName || "Citizen";
    const notifId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", notifId), {
      id: notifId,
      type: "system",
      userRole: "admin",
      description: `Assessment complete for Visit ${selectedAppt.referenceCode} for ${clientName}: Marked as ${result}.`,
      referenceId: selectedAppt.id,
      referenceCode: selectedAppt.referenceCode,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });

    setTimeout(() => {
      toast({ title: "Evaluation Recorded", description: `Record synchronized as ${result}.` });
      setIsEvaluationOpen(false);
      setSelectedAppt(null);
      setScreening({ indigency: false, merit: false, idVerified: false, notes: "" });
      setRejectionReason("");
      setIsProcessing(false);
    }, 500);
  };

  const handleAssignConsultation = async () => {
    if (!db || !selectedAppt || !assignedLawyer || !user) return;
    setIsProcessing(true);

    try {
      const apptRef = doc(db, "appointments", selectedAppt.id);
      const clientName = selectedAppt.guestName || selectedAppt.clientName || "Citizen";
      updateDocumentNonBlocking(apptRef, {
        status: "Consultation in Progress",
        lawyerId: assignedLawyer,
        lawyerNotified: false, 
        updatedAt: new Date().toISOString()
      });

      const notifId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", notifId), {
        id: notifId,
        type: "appointment",
        userRole: "admin",
        description: `Admin assigned Visit ${selectedAppt.referenceCode} for ${clientName} to workstation for Consultation.`,
        referenceId: selectedAppt.id,
        referenceCode: selectedAppt.referenceCode,
        targetUserId: assignedLawyer,
        status: "unread",
        createdAt: new Date().toISOString()
      }, { merge: true });

      toast({ title: "Consultation Set", description: "The handling attorney has been notified." });
      setSelectedAppt(null);
      setAssignedLawyer("");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleActivateOfficialCase = async (appt: any) => {
    if (!db || !user || !appt) return;
    setIsProcessing(true);

    try {
      const year = new Date().getFullYear();
      const caseId = `CASE-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
      const clientName = appt.guestName || appt.clientName || "Citizen";
      
      let clientId = appt.clientId;
      const citizenEmail = appt.guestEmail || appt.clientEmail || `${appt.guestMobile || appt.clientMobile || appt.mobileNumber}@epao.mobile`;

      if (!clientId) {
        try {
          const secondaryApp = initializeApp(firebaseConfig, "admin-activation-" + Date.now());
          const secondaryAuth = getAuth(secondaryApp);
          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, citizenEmail, "password123");
          clientId = userCredential.user.uid;
          await deleteApp(secondaryApp);
        } catch (authError: any) {
          if (authError.code !== 'auth/email-already-in-use') {
             clientId = clientId || crypto.randomUUID();
          }
        }
      }

      updateDocumentNonBlocking(doc(db, "appointments", appt.id), {
        status: "completed",
        caseId: caseId,
        clientId: clientId,
        updatedAt: new Date().toISOString()
      });

      setDocumentNonBlocking(doc(db, "cases", caseId), {
        id: caseId,
        clientId: clientId,
        lawyerId: appt.lawyerId,
        caseType: appt.caseType,
        status: "Active",
        description: appt.assessment || "Official case activated by Admin workstation.",
        consultationRef: appt.referenceCode,
        lawyerNotified: false, 
        createdAt: new Date().toISOString()
      }, { merge: true });

      const finalAddress = appt.guestAddress || appt.clientAddress || appt.address || "";
      const finalMobile = appt.guestMobile || appt.clientMobile || appt.mobileNumber || "";

      setDocumentNonBlocking(doc(db, "users", clientId), {
        id: clientId,
        mobileNumber: finalMobile,
        email: citizenEmail,
        fullName: clientName,
        address: finalAddress,
        role: "client",
        status: "Active Case",
        createdAt: new Date().toISOString()
      }, { merge: true });

      // Admin Audit
      const notifId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", notifId), {
        id: notifId,
        type: "case",
        userRole: "admin",
        description: `Admin activated Official Case ${caseId} for ${clientName} for registry indexing.`,
        referenceId: caseId,
        status: "unread",
        createdAt: new Date().toISOString()
      }, { merge: true });

      // Lawyer Alert
      const lawyerNotifId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", lawyerNotifId), {
        id: lawyerNotifId,
        type: "case",
        userRole: "admin",
        description: `Admin activated and assigned Official Case ${caseId} for ${clientName} to registry.`,
        referenceId: caseId,
        targetUserId: appt.lawyerId,
        status: "unread",
        createdAt: new Date().toISOString()
      }, { merge: true });

      toast({ title: "Case Indexing Complete", description: `Official Record ${caseId} is now live.` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Activation Error", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout role={role}>
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Citizen Intake Assessment</h1>
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">Intake Assessment and Counsel Assignment Workstation</p>
          </div>
        </div>

        <Tabs defaultValue="assessment" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-2xl bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14">
            <TabsTrigger value="assessment" className="rounded-xl font-bold">Assessment Queue</TabsTrigger>
            <TabsTrigger value="approved" className="rounded-xl font-bold">Approved Intakes</TabsTrigger>
            <TabsTrigger value="activation" className="rounded-xl font-bold">Case Review</TabsTrigger>
          </TabsList>

          <TabsContent value="assessment" className="mt-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-amber-50/50 border-b border-amber-100/50 p-8">
                <CardTitle className="text-xl font-bold text-amber-900 flex items-center gap-2">
                  <Search className="h-6 w-6" /> Pending Eligibility Evaluation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-primary/40">Filing Ref</TableHead>
                      <TableHead className="text-[10px) font-black uppercase tracking-widest text-primary/40">Citizen Name</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Intake Category</TableHead>
                      <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {screeningAppointments?.map((appt) => (
                      <TableRow key={appt.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="px-8 font-black text-primary py-6">{appt.referenceCode}</TableCell>
                        <TableCell className="font-bold">{appt.guestName || appt.clientName}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-[9px] uppercase px-3 bg-primary/5 text-primary border-primary/10">
                            {appt.serviceType || appt.purpose || appt.caseType}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <Button size="sm" onClick={() => { setSelectedAppt(appt); setIsEvaluationOpen(true); }} className="rounded-xl font-black bg-primary text-white">Start Evaluation</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {screeningAppointments?.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center py-24 text-muted-foreground italic">No applicants currently awaiting assessment.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="approved" className="mt-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden bg-white">
              <CardHeader className="bg-green-50/50 border-b border-green-100/50 p-8">
                <CardTitle className="text-xl font-bold text-green-900 flex items-center gap-2">
                  <ShieldCheck className="h-6 w-6" /> Eligible for Counsel Assignment
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-primary/40">Reference</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Citizen</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Evaluated On</TableHead>
                      <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eligibleAppointments?.map((appt) => (
                      <TableRow key={appt.id} className="hover:bg-primary/5 transition-colors">
                        <TableCell className="px-8 font-black text-primary py-6">{appt.referenceCode}</TableCell>
                        <TableCell className="font-bold">{appt.guestName || appt.clientName}</TableCell>
                        <TableCell className="text-xs font-medium">{appt.screeningDetails?.screenedAt ? format(new Date(appt.screeningDetails.screenedAt), "PPP") : '---'}</TableCell>
                        <TableCell className="text-right px-8">
                          <Button size="sm" onClick={() => setSelectedAppt(appt)} className="rounded-xl font-black bg-secondary text-white">Assign Counsel</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {eligibleAppointments?.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center py-24 text-muted-foreground italic">No approved intakes awaiting assignment.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activation" className="mt-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-primary/10 p-8">
                <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                  <Scale className="h-6 w-6" /> Consultation Review - Pending Activation
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader className="bg-muted/30">
                    <TableRow>
                      <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-primary/40">Reference</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Citizen</TableHead>
                      <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Assigned Lawyer</TableHead>
                      <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {acceptedAppointments?.map((appt) => {
                      const lawyer = lawyers?.find(l => l.id === appt.lawyerId);
                      return (
                        <TableRow key={appt.id} className="hover:bg-primary/5 transition-colors">
                          <TableCell className="px-8 font-black text-primary py-6">{appt.referenceCode}</TableCell>
                          <TableCell className="font-bold">{appt.guestName || appt.clientName}</TableCell>
                          <TableCell className="text-xs font-bold text-secondary">Atty. {lawyer?.lastName || '---'}</TableCell>
                          <TableCell className="text-right px-8">
                            <Button 
                              size="sm" 
                              onClick={() => handleActivateOfficialCase(appt)}
                              disabled={isProcessing}
                              className="rounded-xl font-black bg-primary text-white"
                            >
                              {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : <Gavel className="mr-2 h-4 w-4" />}
                              Activate Case
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    {acceptedAppointments?.length === 0 && (
                      <TableRow><TableCell colSpan={4} className="text-center py-24 text-muted-foreground italic">No completed consultations awaiting activation.</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* --- ASSESSMENT WORKSTATION DIALOG --- */}
        <Dialog open={isEvaluationOpen} onOpenChange={setIsEvaluationOpen}>
          <DialogContent className="rounded-[3rem] max-w-lg p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
            <DialogHeader className="p-8 bg-primary text-white">
              <DialogTitle className="text-2xl font-black">Eligibility Evaluation</DialogTitle>
              <DialogDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Ref: {selectedAppt?.referenceCode}</DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-8 flex-1 overflow-y-auto">
              <div className="p-6 bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/10 space-y-4">
                <div className="flex items-center gap-2 mb-2"><ClipboardCheck className="h-4 w-4 text-primary" /><span className="text-[10px] font-black uppercase tracking-widest">Assessment Criteria Checklist</span></div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border">
                    <Checkbox id="ind" checked={screening.indigency} onCheckedChange={c => setScreening({...screening, indigency: !!c})} />
                    <label htmlFor="ind" className="text-xs font-bold text-primary">Indigency Criteria Satisfied (Income limit)</label>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border">
                    <Checkbox id="mer" checked={screening.merit} onCheckedChange={c => setScreening({...screening, merit: !!c})} />
                    <label htmlFor="mer" className="text-xs font-bold text-primary">Legal Merit Validated (PAO Scope)</label>
                  </div>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-xl border">
                    <Checkbox id="idv" checked={screening.idVerified} onCheckedChange={c => setScreening({...screening, idVerified: !!c})} />
                    <label htmlFor="idv" className="text-xs font-bold text-primary">Identity Credentials Verified</label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Evaluation Remarks</Label>
                  <Textarea 
                    placeholder="Notes regarding indigency proof or merit details..." 
                    className="rounded-2xl h-24"
                    value={screening.notes}
                    onChange={(e) => setScreening({...screening, notes: e.target.value})}
                  />
                </div>

                {!screening.indigency || !screening.merit || !screening.idVerified ? (
                  <div className="space-y-2 animate-in fade-in">
                    <Label className="text-[10px] font-black uppercase text-red-600/60 ml-1">Reason for Denial (If failing)</Label>
                    <Select value={rejectionReason} onValueChange={setRejectionReason}>
                      <SelectTrigger className="rounded-xl border-red-100 bg-red-50/30 font-bold"><SelectValue placeholder="Select Reason" /></SelectTrigger>
                      <SelectContent>
                        {REJECTION_REASONS.map((reason) => (
                          <SelectItem key={reason} value={reason} className="font-bold">{reason}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 flex flex-col sm:flex-row justify-center items-center gap-3">
              <Button 
                variant="outline" 
                onClick={() => handleScreeningResult('Not Eligible')} 
                disabled={isProcessing || !rejectionReason}
                className="w-full sm:w-auto min-w-[120px] h-12 rounded-xl font-bold border-red-200 text-red-600 hover:bg-red-50"
              >
                Mark Ineligible
              </Button>
              <Button 
                variant="outline"
                onClick={() => handleScreeningResult('For Completion')} 
                disabled={isProcessing}
                className="w-full sm:w-auto min-w-[120px] h-12 rounded-xl font-bold border-amber-200 text-amber-600 hover:bg-amber-50"
              >
                For Completion
              </Button>
              <Button 
                onClick={() => handleScreeningResult('Eligible')} 
                disabled={isProcessing || !screening.indigency || !screening.merit || !screening.idVerified} 
                className="w-full sm:w-auto min-w-[140px] h-12 rounded-xl font-black text-white shadow-lg bg-primary"
              >
                {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : "Approve Eligibility"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- ASSIGNMENT WORKSTATION DIALOG --- */}
        <Dialog open={!!selectedAppt && selectedAppt.status === 'Eligible'} onOpenChange={() => setSelectedAppt(null)}>
          <DialogContent className="rounded-[3rem] max-w-lg p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
            <DialogHeader className="p-8 bg-secondary text-white">
              <DialogTitle className="text-2xl font-black">Lawyer Assignment</DialogTitle>
              <DialogDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest">Assigning Counsel for {selectedAppt?.referenceCode}</DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-8 flex-1 overflow-y-auto">
              <div className="p-6 bg-secondary/5 rounded-[2rem] border-2 border-dashed border-secondary/10">
                <p className="text-[10px] font-black uppercase text-secondary tracking-widest mb-2">Service Category</p>
                <div className="flex items-center gap-2 text-secondary font-bold">
                  <Badge variant="outline" className="border-secondary/20">{selectedAppt?.serviceType || selectedAppt?.purpose || selectedAppt?.caseType}</Badge>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Handling Public Attorney</Label>
                  <Select value={assignedLawyer} onValueChange={setAssignedLawyer}>
                    <SelectTrigger className="h-12 rounded-xl border-primary/10 font-bold shadow-sm"><SelectValue placeholder="Select Attorney" /></SelectTrigger>
                    <SelectContent>
                      {lawyersOnDuty?.map(l => (
                        <SelectItem key={l.id} value={l.id} className="font-bold">
                          <div className="flex items-center gap-2">
                            <span>{l.firstName ? `Atty. ${l.firstName} ${l.lastName}` : l.email}</span>
                            {l.isOnOfficeDuty && <Badge className="bg-green-500 text-[8px] h-4">OFFICE DUTY</Badge>}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-800 font-bold leading-relaxed">
                    Priority allocation is given to lawyers currently on "Office Work" duty for walkthrough consultations.
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" onClick={() => setSelectedAppt(null)} className="flex-1 h-12 rounded-xl font-bold">Cancel</Button>
              <Button 
                onClick={handleAssignConsultation} 
                disabled={!assignedLawyer || isProcessing} 
                className="flex-1 h-12 rounded-xl font-black text-white shadow-lg bg-secondary"
              >
                {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : "Commence Consultation"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
