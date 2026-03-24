
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useDoc, setDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc, orderBy, limit } from "firebase/firestore";
import { format, isWeekend, parseISO } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Briefcase, 
  User, 
  ChevronRight, 
  Loader2,
  Inbox,
  MapPin,
  Scale,
  ArrowRight,
  Gavel as GavelIcon,
  Activity,
  MoreVertical,
  XCircle,
  Hash,
  Phone,
  Mail,
  Bell,
  CheckCheck,
  AlertTriangle,
  Info,
  ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { caseCategories } from "@/app/lib/case-data";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";

const OUTCOME_OPTIONS = [
  "Completed Consultation – Accept Legal Assistance",
  "Completed Consultation – Denial of Legal Assistance"
];

const DENIAL_REASONS = [
  "Non-Indigent (Failed Means Test)",
  "Case Not Covered / Not Qualified",
  "Incomplete Requirements",
  "Conflict of Interest",
  "Misrepresentation / False Information",
  "Procedural Disqualification"
];

export default function LawyerDashboard() {
  const { user, role, loading } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [activeConsultation, setActiveConsultation] = useState<any>(null);
  const [consultationForm, setConsultationForm] = useState({
    notes: "",
    recommendation: "",
    assessment: "",
    caseType: "",
    outcome: "",
    denialReason: ""
  });

  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [apptToCancel, setApptToCancel] = useState<any>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const lawyerRef = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return doc(db, "roleLawyer", user.uid);
  }, [db, user, role]);

  const { data: lawyerData } = useDoc(lawyerRef);

  const apptsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "appointments"), where("lawyerId", "==", user.uid));
  }, [db, user, role]);

  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "cases"), where("lawyerId", "==", user.uid), where("status", "==", "Active"));
  }, [db, user, role]);

  const dutiesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "lawyerDuties"), where("lawyerId", "==", user.uid));
  }, [db, user, role]);

  const { data: apptsData } = useCollection(apptsQuery);
  const { data: activeCases } = useCollection(casesQuery);
  const { data: dutiesData } = useCollection(dutiesQuery);

  const unreadApptsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "appointments"), where("lawyerId", "==", user.uid), where("lawyerNotified", "==", false));
  }, [db, user, role]);

  const unreadCasesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "cases"), where("lawyerId", "==", user.uid), where("lawyerNotified", "==", false));
  }, [db, user, role]);

  const { data: unreadAppts } = useCollection(unreadApptsQuery);
  const { data: unreadCases } = useCollection(unreadCasesQuery);

  const workstationAlerts = useMemo(() => {
    const alerts: any[] = [];
    if (unreadAppts) unreadAppts.forEach(a => alerts.push({ ...a, alertType: 'appointment' }));
    if (unreadCases) unreadCases.forEach(c => alerts.push({ ...c, alertType: 'case' }));
    return alerts.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [unreadAppts, unreadCases]);

  const filteredSchedule = useMemo(() => {
    if (!selectedDate) return [];
    const ds = format(selectedDate, "yyyy-MM-dd");
    const dayAppts = apptsData?.filter(a => a.dateString === ds && a.status !== 'cancelled') || [];
    const dayDuties = dutiesData?.filter(d => d.date.startsWith(ds)) || [];
    return [
      ...dayAppts.map(a => ({ type: 'appt', data: a, time: a.time })),
      ...dayDuties.map(d => ({ type: 'duty', data: d, time: d.startTime }))
    ].sort((a, b) => a.time.localeCompare(b.time));
  }, [apptsData, dutiesData, selectedDate]);

  const handleAcknowledge = (id: string, type: string) => {
    if (!db) return;
    const ref = doc(db, type === 'case' ? "cases" : "appointments", id);
    updateDocumentNonBlocking(ref, { lawyerNotified: true, updatedAt: new Date().toISOString() });
    toast({ title: "Acknowledge", description: "Record verified." });
  };

  const handleCancelAppointment = async () => {
    if (!db || !apptToCancel || !cancellationReason) return;
    setIsSubmitting(true);
    try {
      const apptId = apptToCancel.id;
      const clientName = apptToCancel.guestName || apptToCancel.clientName || "Citizen";
      const refCode = apptToCancel.referenceCode;
      
      updateDocumentNonBlocking(doc(db, "appointments", apptId), {
        status: "cancelled",
        cancellationReason,
        cancelledBy: "lawyer",
        lawyerNotified: true,
        clientNotified: false,
        updatedAt: new Date().toISOString()
      });

      const auditId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", auditId), {
        id: auditId,
        type: "appointment",
        userRole: "lawyer",
        description: `Atty. ${lawyerData?.lastName || 'Counsel'} cancelled Visit ${refCode} for ${clientName}. Reason: ${cancellationReason}`,
        referenceId: apptId,
        referenceCode: refCode,
        status: "unread",
        createdAt: new Date().toISOString()
      }, { merge: true });

      toast({ title: "Visit Cancelled", description: "Audit trail synchronized." });
      setIsCancelDialogOpen(false);
      setApptToCancel(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkStatus = (appt: any, status: string) => {
    if (!db) return;
    const clientName = appt.guestName || appt.clientName || "Citizen";
    updateDocumentNonBlocking(doc(db, "appointments", appt.id), { status, updatedAt: new Date().toISOString() });
    const auditId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", auditId), {
      id: auditId,
      type: "appointment",
      userRole: "lawyer",
      description: `Office Update: Visit ${appt.referenceCode} for ${clientName} recorded as ${status}.`,
      referenceId: appt.id,
      referenceCode: appt.referenceCode,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });
    toast({ title: "Status Set", description: `Record updated to ${status}.` });
  };

  const handleCompleteConsultation = async () => {
    if (!db || !activeConsultation || !consultationForm.outcome) return;
    setIsSubmitting(true);
    try {
      const isAccepted = consultationForm.outcome === OUTCOME_OPTIONS[0];
      const clientName = activeConsultation.guestName || activeConsultation.clientName || "Citizen";
      updateDocumentNonBlocking(doc(db, "appointments", activeConsultation.id), {
        status: consultationForm.outcome,
        assessment: consultationForm.assessment,
        outcome: consultationForm.outcome,
        denialReason: isAccepted ? null : consultationForm.denialReason,
        completedAt: new Date().toISOString(),
        clientNotified: false
      });

      const auditId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", auditId), {
        id: auditId,
        type: "appointment",
        userRole: "lawyer",
        description: `Intake Assessment: Visit ${activeConsultation.referenceCode} for ${clientName} finalized as ${isAccepted ? 'Accepted' : 'Denied'}.`,
        referenceId: activeConsultation.id,
        referenceCode: activeConsultation.referenceCode,
        status: "unread",
        createdAt: new Date().toISOString()
      }, { merge: true });

      toast({ title: "Intake Finalized", description: "Registry updated." });
      setActiveConsultation(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-secondary" /></div>;
  if (!user || role !== 'lawyer') return null;

  return (
    <DashboardLayout role="lawyer">
      <div className="grid grid-cols-4 gap-8 pb-12">
        <div className="col-span-3 space-y-12">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
              <AvatarImage src={lawyerData?.photoUrl} />
              <AvatarFallback className="bg-secondary/10 text-secondary font-black">{lawyerData?.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-black text-secondary">Atty. {lawyerData?.firstName} {lawyerData?.lastName}</h1>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">Professional Workstation Registry</p>
            </div>
          </div>

          <div className="space-y-6">
            {apptsData?.filter(a => a.status === "Consultation in Progress").map(appt => (
              <Card key={appt.id} className="border-none shadow-xl rounded-[2.5rem] bg-white border-l-8 border-red-500">
                <CardContent className="p-8 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-red-50 text-red-600 rounded-3xl"><User className="h-8 w-8" /></div>
                    <div>
                      <h3 className="text-xl font-black">{appt.guestName || appt.clientName}</h3>
                      <p className="text-[9px] font-black uppercase text-muted-foreground">REF: {appt.referenceCode}</p>
                    </div>
                  </div>
                  <Button onClick={() => setActiveConsultation(appt)} className="h-14 bg-secondary text-white font-black px-10 rounded-2xl shadow-xl">Complete Intake <ArrowRight className="ml-2 h-5 w-5" /></Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-secondary text-white">
              <CardContent className="p-10">
                <p className="text-[10px] font-black uppercase opacity-60">Active Cases</p>
                <p className="text-6xl font-black">{activeCases?.length || 0}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white border-2 border-secondary/5">
              <CardContent className="p-10">
                <p className="text-[10px] font-black uppercase text-muted-foreground">Daily Load</p>
                <p className="text-6xl font-black text-secondary">{filteredSchedule.length}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="bg-secondary/5 p-10"><CardTitle className="text-xl font-bold flex items-center gap-3"><CalendarIcon className="h-6 w-6" /> Office Workstation Schedule</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-12">
                <div className="col-span-4 p-10 border-r border-secondary/5 bg-secondary/[0.02]">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="mx-auto" />
                </div>
                <div className="col-span-8 p-0 divide-y divide-secondary/5 min-h-[400px]">
                  {filteredSchedule.length > 0 ? filteredSchedule.map((item, idx) => (
                    <div key={idx} className="p-10 flex items-center justify-between group">
                      <div className="flex items-center gap-8">
                        <div className="h-16 w-16 bg-secondary/5 rounded-2xl flex flex-col items-center justify-center font-black text-secondary">
                          <span className="text-[9px] uppercase">{format(new Date(item.data.date), "MMM")}</span>
                          <span className="text-2xl">{format(new Date(item.data.date), "dd")}</span>
                        </div>
                        <div>
                          <h4 className="text-xl font-black">{item.type === 'appt' ? (item.data.guestName || item.data.clientName) : item.data.title}</h4>
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.time} • {item.type === 'appt' ? 'Office Visit' : item.data.location}</p>
                        </div>
                      </div>
                      {item.type === 'appt' && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-10 w-10"><MoreVertical className="h-5 w-5" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem onClick={() => setActiveConsultation(item.data)} className="font-bold">Start Assessment</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleMarkStatus(item.data, 'No Show')} className="text-red-600 font-bold">Record No Show</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  )) : <div className="py-32 text-center text-muted-foreground font-black uppercase text-[10px]">No entries for this date</div>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
          <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-24">
            <CardHeader className="bg-secondary p-8 text-white"><CardTitle className="text-xl font-black flex items-center gap-2"><Bell className="h-5 w-5" /> Workstation Alerts</CardTitle></CardHeader>
            <CardContent className="p-0 overflow-y-auto divide-y divide-secondary/5">
              {workstationAlerts.length > 0 ? workstationAlerts.map(alert => (
                <div key={alert.id} className="p-6 bg-amber-50/30 relative group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                  <p className="text-xs font-bold text-secondary">{alert.alertType === 'case' ? `New Case Assigned: ${alert.caseType}` : `Intake Booked: ${alert.caseType}`}</p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleAcknowledge(alert.id, alert.alertType)} className="h-8 rounded-xl font-black text-[9px] uppercase bg-emerald-100 text-emerald-700">Acknowledge</Button>
                    {alert.alertType === 'appointment' && <Button size="sm" variant="ghost" onClick={() => { setApptToCancel(alert); setIsCancelDialogOpen(true); }} className="h-8 rounded-xl font-black text-[9px] uppercase bg-rose-100 text-rose-700">Cancel Visit</Button>}
                  </div>
                </div>
              )) : <div className="py-20 text-center text-muted-foreground font-black uppercase text-[10px]">No unread alerts</div>}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!activeConsultation} onOpenChange={() => setActiveConsultation(null)}>
        <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 bg-secondary text-white">
            <DialogTitle className="text-2xl font-black">Intake Assessment: {activeConsultation?.guestName || activeConsultation?.clientName}</DialogTitle>
          </DialogHeader>
          <div className="p-10 space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase">Statutory Category</Label>
                <Select value={consultationForm.caseType} onValueChange={v => setConsultationForm({...consultationForm, caseType: v})}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>{Object.keys(caseCategories).map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase">Registry Outcome</Label>
                <Select value={consultationForm.outcome} onValueChange={v => setConsultationForm({...consultationForm, outcome: v})}>
                  <SelectTrigger className="h-12"><SelectValue placeholder="Outcome" /></SelectTrigger>
                  <SelectContent>{OUTCOME_OPTIONS.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase">Findings & Assessment</Label>
              <Textarea value={consultationForm.assessment} onChange={e => setConsultationForm({...consultationForm, assessment: e.target.value})} className="rounded-2xl min-h-[120px]" />
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/30">
            <Button variant="outline" onClick={() => setActiveConsultation(null)} className="h-14 font-bold">Cancel</Button>
            <Button onClick={handleCompleteConsultation} disabled={isSubmitting || !consultationForm.outcome} className="h-14 bg-secondary text-white font-black px-10 rounded-xl shadow-lg">Finalize Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="rounded-[3rem] max-w-md p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 bg-rose-600 text-white"><DialogTitle className="text-2xl font-black">Cancel Visit</DialogTitle></DialogHeader>
          <div className="p-10 space-y-6">
            <Label className="text-[10px] font-black uppercase text-rose-600/60">Reason for Cancellation</Label>
            <Input value={cancellationReason} onChange={e => setCancellationReason(e.target.value)} placeholder="Official reason for registry..." className="h-12 rounded-xl" />
          </div>
          <DialogFooter className="p-8 bg-muted/30">
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} className="font-bold">Close</Button>
            <Button onClick={handleCancelAppointment} disabled={!cancellationReason || isSubmitting} className="bg-rose-600 text-white font-black px-10 shadow-lg">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
