
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  UserCheck, 
  ShieldCheck, 
  Briefcase, 
  Plus, 
  Loader2, 
  UserPlus, 
  Search, 
  FileText, 
  ClipboardCheck, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Eye,
  Info
} from "lucide-react";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

export default function AdminTriagePage() {
  const db = useFirestore();
  const { user, role } = useAuth();
  const { toast } = useToast();
  
  // States
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [reviewMode, setReviewMode] = useState<"assign" | "intake">("assign");
  const [assignedLawyer, setAssignedLawyer] = useState("");
  const [caseStatus, setCaseStatus] = useState("Active");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

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

  const { data: pendingAppts, isLoading: isPendingLoading } = useCollection(pendingQuery);
  const { data: completedIntakes, isLoading: isIntakeLoading } = useCollection(completedIntakeQuery);
  const { data: lawyers } = useCollection(lawyersQuery);

  // Filter out completed intakes that already have cases
  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "cases"));
  }, [db, user, role]);
  const { data: allCases } = useCollection(casesQuery);

  const triagableIntakes = useMemo(() => {
    if (!completedIntakes || !allCases) return completedIntakes || [];
    return completedIntakes.filter(intake => !allCases.some(c => c.initialAppointmentId === intake.id));
  }, [completedIntakes, allCases]);

  const handleCreateCase = async () => {
    if (!db || !selectedAppt || !assignedLawyer) return;
    setIsProcessing(true);

    try {
      const year = new Date().getFullYear();
      const caseId = `CASE-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
      const clientId = selectedAppt.clientId || crypto.randomUUID();

      // 1. Create Official Case Record
      const caseRef = doc(db, "cases", caseId);
      setDocumentNonBlocking(caseRef, {
        id: caseId,
        clientId,
        lawyerId: assignedLawyer,
        caseType: selectedAppt.caseType,
        status: caseStatus,
        initialAppointmentId: selectedAppt.id,
        description: `Official case initialized from triage review. Source: ${selectedAppt.referenceCode}`,
        createdAt: new Date().toISOString()
      }, { merge: true });

      // 2. Convert Guest to Registered Client if needed
      const userRef = doc(db, "users", clientId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        setDocumentNonBlocking(userRef, {
          id: clientId,
          mobileNumber: selectedAppt.guestMobile || "",
          email: selectedAppt.guestEmail || `${selectedAppt.guestMobile}@epao.mobile`,
          role: "client",
          profileId: "profile",
          createdAt: new Date().toISOString()
        }, { merge: true });

        // Initialize empty profile
        const profileRef = doc(db, "users", clientId, "profile", "profile");
        setDocumentNonBlocking(profileRef, {
          id: "profile",
          firstName: selectedAppt.guestName?.split(' ')[0] || "",
          lastName: selectedAppt.guestName?.split(' ').slice(1).join(' ') || "",
          phoneNumber: selectedAppt.guestMobile || "",
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      toast({ 
        title: "Case Formally Initialized", 
        description: `Case ${caseId} has been created and assigned to lawyer.` 
      });
      setSelectedAppt(null);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Operation Failed", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectIntake = () => {
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
      title: "Intake Rejected", 
      description: "The client has been marked as Not Eligible." 
    });
    
    setTimeout(() => {
      setIsProcessing(false);
      setSelectedAppt(null);
    }, 800);
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Triage Command Center</h1>
            <p className="text-muted-foreground font-medium">Evaluate intakes, verify eligibility, and initialize official legal records.</p>
          </div>
        </div>

        <Tabs defaultValue="intake" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-xl bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14">
            <TabsTrigger value="intake" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <ClipboardCheck className="h-4 w-4 mr-2" /> Intake Review Queue
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <Search className="h-4 w-4 mr-2" /> Assignment Queue
            </TabsTrigger>
          </TabsList>

          {/* --- INTAKE REVIEW QUEUE (Completed Initial Visits) --- */}
          <TabsContent value="intake" className="mt-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6">
                <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                  <CheckCircle2 className="h-6 w-6" /> Completed Consultations
                </CardTitle>
                <CardDescription>First-time clients awaiting official case conversion.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isIntakeLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div> : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Reference</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Citizen Name</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Matter Category</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Visit Date</TableHead>
                        <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {triagableIntakes.map((intake) => (
                        <TableRow key={intake.id} className="hover:bg-primary/5 transition-colors group">
                          <TableCell className="px-8 font-black text-primary">{intake.referenceCode}</TableCell>
                          <TableCell className="font-bold">{intake.guestName || "Registered Citizen"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-teal-50 text-teal-700 border-teal-100 font-bold">{intake.caseType}</Badge>
                          </TableCell>
                          <TableCell className="text-xs font-medium text-muted-foreground">{format(new Date(intake.date), "PPP")}</TableCell>
                          <TableCell className="text-right px-8">
                            <Button size="sm" onClick={() => { setSelectedAppt(intake); setReviewMode("intake"); }} className="rounded-xl font-black bg-secondary hover:bg-secondary/90 shadow-md">
                              <Eye className="mr-2 h-4 w-4" /> Review Intake
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {triagableIntakes.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic font-medium">
                            <Info className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            No completed intakes awaiting review.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* --- ASSIGNMENT QUEUE (Pending Initial Visits) --- */}
          <TabsContent value="pending" className="mt-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-amber-50/50 pb-6">
                <CardTitle className="text-xl font-bold text-amber-900 flex items-center gap-2">
                  <AlertCircle className="h-6 w-6" /> Pending First Visits
                </CardTitle>
                <CardDescription>New requests needing lawyer assignment for initial evaluation.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {isPendingLoading ? <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div> : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Reference</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Citizen Name</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Service Type</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Submission</TableHead>
                        <TableHead className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingAppts?.map((appt) => (
                        <TableRow key={appt.id} className="hover:bg-primary/5 transition-colors group">
                          <TableCell className="px-8 font-black text-primary">{appt.referenceCode}</TableCell>
                          <TableCell className="font-bold">{appt.guestName || "Registered Citizen"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/5 font-bold">{appt.caseType}</Badge>
                          </TableCell>
                          <TableCell className="text-xs font-medium text-muted-foreground">{format(new Date(appt.createdAt), "MMM dd, p")}</TableCell>
                          <TableCell className="text-right px-8">
                            <Button size="sm" onClick={() => { setSelectedAppt(appt); setReviewMode("assign"); }} className="rounded-xl font-black bg-primary hover:bg-primary/90 shadow-md">
                              <UserPlus className="mr-2 h-4 w-4" /> Assign Lawyer
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {(!pendingAppts || pendingAppts.length === 0) && (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic font-medium">
                            No pending visits requiring assignment.
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

        {/* --- DYNAMIC TRIAGE DIALOG --- */}
        <Dialog open={!!selectedAppt} onOpenChange={() => { setSelectedAppt(null); setRejectionReason(""); }}>
          <DialogContent className="rounded-[3rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className={cn(
              "p-8 text-white",
              reviewMode === 'intake' ? "bg-secondary" : "bg-primary"
            )}>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <DialogTitle className="text-3xl font-black tracking-tight">
                    {reviewMode === 'intake' ? "Intake Evaluation" : "Lawyer Assignment"}
                  </DialogTitle>
                  <DialogDescription className="text-white/70 font-bold uppercase text-[10px] tracking-widest">
                    Citizen Reference: {selectedAppt?.referenceCode}
                  </DialogDescription>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl">
                  {reviewMode === 'intake' ? <ClipboardCheck className="h-8 w-8" /> : <UserPlus className="h-8 w-8" />}
                </div>
              </div>
            </DialogHeader>

            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Citizen Profile</Label>
                    <p className="font-black text-xl text-primary leading-none">{selectedAppt?.guestName || "Registered Account"}</p>
                    <p className="text-sm font-bold text-muted-foreground">{selectedAppt?.guestMobile || selectedAppt?.clientMobile}</p>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Matter Category</Label>
                    <p className="text-base font-bold text-primary">{selectedAppt?.caseType}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Initial Visit Conducted</Label>
                    <p className="text-base font-bold text-primary">{selectedAppt?.date ? format(new Date(selectedAppt.date), "PPP") : "---"}</p>
                    <p className="text-xs font-medium text-muted-foreground">{selectedAppt?.time}</p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-primary/5 rounded-[2rem] border border-primary/10 space-y-4">
                <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                  <FileText className="h-4 w-4" /> Eligibility Checklist
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex items-center gap-3 text-sm font-bold text-[#1A3B6B]">
                    <CheckCircle2 className="h-4 w-4 text-green-600" /> Proof of Indigency Verified
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-[#1A3B6B]">
                    <CheckCircle2 className="h-4 w-4 text-green-600" /> Merit Test Passed (Legal Basis Confirmed)
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Assign Permanent Lawyer</Label>
                  <Select value={assignedLawyer} onValueChange={setAssignedLawyer}>
                    <SelectTrigger className="h-14 rounded-2xl border-primary/20 bg-white font-bold shadow-sm">
                      <SelectValue placeholder="Select an authorized public attorney" />
                    </SelectTrigger>
                    <SelectContent>
                      {lawyers?.map((lawyer) => (
                        <SelectItem key={lawyer.id} value={lawyer.id} className="font-bold">
                          {lawyer.email.split('@')[0]} (Public Attorney)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {reviewMode === 'intake' && (
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-primary/40 ml-1">Set Case Status</Label>
                    <Select value={caseStatus} onValueChange={setCaseStatus}>
                      <SelectTrigger className="h-14 rounded-2xl border-primary/20 bg-white font-bold shadow-sm">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active Case</SelectItem>
                        <SelectItem value="Pending Documents">Pending Documents</SelectItem>
                        <SelectItem value="Under Evaluation">Under Evaluation</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {reviewMode === 'intake' && (
                <div className="pt-6 border-t border-primary/5 space-y-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-xs font-black uppercase tracking-widest text-red-500">Not Eligible for PAO Services?</span>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase">Reason for Rejection (Required for closing intake)</Label>
                    <Textarea 
                      placeholder="e.g., Household income exceeds PAO threshold, matter not covered by PAO mandate."
                      className="rounded-2xl border-primary/10 bg-white text-sm font-medium min-h-[100px]"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="p-8 bg-muted/30 flex gap-4">
              <Button variant="outline" onClick={() => setSelectedAppt(null)} className="flex-1 h-14 rounded-2xl font-bold">Cancel Review</Button>
              {reviewMode === 'intake' && (
                <Button 
                  variant="outline" 
                  disabled={!rejectionReason || isProcessing}
                  onClick={handleRejectIntake}
                  className="flex-1 h-14 rounded-2xl font-black border-red-200 text-red-600 hover:bg-red-50"
                >
                  Reject intake
                </Button>
              )}
              <Button 
                onClick={handleCreateCase} 
                disabled={!assignedLawyer || isProcessing} 
                className={cn(
                  "flex-1 h-14 rounded-2xl font-black text-lg shadow-xl",
                  reviewMode === 'intake' ? "bg-secondary" : "bg-primary"
                )}
              >
                {isProcessing ? <Loader2 className="animate-spin h-6 w-6" /> : <ShieldCheck className="mr-2 h-6 w-6" />}
                {reviewMode === 'intake' ? "Create Official Case" : "Confirm Assignment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
