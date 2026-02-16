
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc, getDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck, ShieldCheck, Briefcase, Plus, Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AdminTriagePage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [assignedLawyer, setAssignedLawyer] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch only pending initial appointments
  const pendingQuery = useMemoFirebase(() => db ? query(collection(db, "appointments"), where("status", "==", "pending")) : null, [db]);
  const { data: appointments, isLoading } = useCollection(pendingQuery);

  // Fetch lawyers for assignment
  const lawyersQuery = useMemoFirebase(() => db ? query(collection(db, "roleLawyer")) : null, [db]);
  const { data: lawyers } = useCollection(lawyersQuery);

  const handleTriage = async () => {
    if (!db || !selectedAppt || !assignedLawyer) return;
    setIsProcessing(true);

    try {
      const caseId = `CASE-${Math.floor(1000 + Math.random() * 9000)}-${Date.now().toString().slice(-4)}`;
      const clientId = selectedAppt.clientId || crypto.randomUUID();

      // 1. Create Case Record
      const caseRef = doc(db, "cases", caseId);
      setDocumentNonBlocking(caseRef, {
        id: caseId,
        clientId,
        lawyerId: assignedLawyer,
        caseType: selectedAppt.caseType,
        status: "Active",
        description: `Case initialized from initial consultation (Ref: ${selectedAppt.referenceCode})`,
        createdAt: new Date().toISOString()
      }, { merge: true });

      // 2. Update Appointment Status
      const apptRef = doc(db, "appointments", selectedAppt.id);
      updateDocumentNonBlocking(apptRef, { status: "scheduled", lawyerId: assignedLawyer });

      // 3. Ensure Client User Record exists
      const userRef = doc(db, "users", clientId);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists()) {
        setDocumentNonBlocking(userRef, {
          id: clientId,
          email: selectedAppt.guestMobile ? `${selectedAppt.guestMobile}@epao.mobile` : `${clientId}@epao.system`,
          role: "client",
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      toast({ title: "Triage Complete", description: `Case ${caseId} created and assigned.` });
      setSelectedAppt(null);
    } catch (e: any) {
      toast({ variant: "destructive", title: "Triage Failed", description: e.message });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Client Triage</h1>
          <p className="text-muted-foreground font-medium">Review initial bookings and convert them to official cases.</p>
        </div>

        <Card className="border-none shadow-xl rounded-[2rem]">
          <CardHeader>
            <CardTitle>Pending Initial Consultations</CardTitle>
            <CardDescription>Clients waiting for case assignment and official filing.</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div> : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reference</TableHead>
                    <TableHead>Client Name</TableHead>
                    <TableHead>Matter Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointments?.map((appt) => (
                    <TableRow key={appt.id}>
                      <TableCell className="font-bold text-primary">{appt.referenceCode}</TableCell>
                      <TableCell>{appt.guestName || "Registered Client"}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-primary/5">{appt.caseType}</Badge>
                      </TableCell>
                      <TableCell className="text-xs">{format(new Date(appt.date), "PPP")}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" onClick={() => setSelectedAppt(appt)} className="rounded-xl font-bold bg-secondary">
                          <Plus className="mr-2 h-4 w-4" /> Initialize Case
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(!appointments || appointments.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12 text-muted-foreground italic">
                        No pending consultations for triage.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Dialog open={!!selectedAppt} onOpenChange={() => setSelectedAppt(null)}>
          <DialogContent className="rounded-[2rem] max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black text-primary">Case Initialization</DialogTitle>
              <DialogDescription>
                Review and assign a public attorney to this legal matter.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest mb-1">Matter Profile</p>
                <h4 className="font-bold text-primary">{selectedAppt?.caseType}</h4>
                <p className="text-xs text-muted-foreground">{selectedAppt?.guestName} • {selectedAppt?.guestMobile}</p>
              </div>

              <div className="space-y-3">
                <Label className="text-xs font-black uppercase tracking-widest ml-1">Assign Practitioner</Label>
                <Select value={assignedLawyer} onValueChange={setAssignedLawyer}>
                  <SelectTrigger className="h-12 rounded-xl border-primary/20">
                    <SelectValue placeholder="Select a Public Attorney" />
                  </SelectTrigger>
                  <SelectContent>
                    {lawyers?.map((lawyer) => (
                      <SelectItem key={lawyer.id} value={lawyer.id}>
                        {lawyer.email.split('@')[0]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={() => setSelectedAppt(null)} className="rounded-xl font-bold">Cancel</Button>
              <Button onClick={handleTriage} disabled={!assignedLawyer || isProcessing} className="rounded-xl font-bold bg-primary px-8">
                {isProcessing ? <Loader2 className="animate-spin h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Confirm Case & Lawyer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
