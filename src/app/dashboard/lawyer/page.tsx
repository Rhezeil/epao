
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useDoc, setDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { format } from "date-fns";
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
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { caseCategories } from "@/app/lib/case-data";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";

const OUTCOME_OPTIONS = [
  "Completed Consultation – Accept Legal Assistance",
  "Completed Consultation – Denial of Legal Assistance"
];

const DENIAL_REASONS = [
  "Client not eligible for PAO services (Income limit)",
  "Case not covered by PAO (Jurisdictional exclusion)",
  "Insufficient legal merit"
];

export default function LawyerDashboard() {
  const { user, role, loading } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  // UI State
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  
  // Consultation State
  const [activeConsultation, setActiveConsultation] = useState<any>(null);
  const [consultationForm, setConsultationForm] = useState({
    notes: "",
    recommendation: "",
    assessment: "",
    caseType: "",
    outcome: "",
    denialReason: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
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

  const { data: apptsData, isLoading: isApptsLoading } = useCollection(apptsQuery);
  const { data: activeCases } = useCollection(casesQuery);
  const { data: dutiesData } = useCollection(dutiesQuery);

  const pendingConsultations = useMemo(() => {
    if (!apptsData) return [];
    return apptsData.filter(a => a.status === "Consultation in Progress");
  }, [apptsData]);

  const filterAcceptedPendingActivation = useMemo(() => {
    if (!apptsData) return [];
    return apptsData.filter(a => a.status === OUTCOME_OPTIONS[0]);
  }, [apptsData]);

  const filteredSchedule = useMemo(() => {
    if (!selectedDate) return [];
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    
    const dayAppts = apptsData?.filter(a => a.dateString === dateStr && a.status !== 'cancelled') || [];
    const dayDuties = dutiesData?.filter(d => d.date.startsWith(dateStr)) || [];

    return [
      ...dayAppts.map(a => ({ type: 'appt', data: a, time: a.time })),
      ...dayDuties.map(d => ({ type: 'duty', data: d, time: d.startTime }))
    ].sort((a, b) => a.time.localeCompare(b.time));
  }, [apptsData, dutiesData, selectedDate]);

  const handleCompleteConsultation = async () => {
    if (!db || !activeConsultation || !user || !consultationForm.outcome) return;
    setIsSubmitting(true);

    try {
      const apptRef = doc(db, "appointments", activeConsultation.id);
      const isAccepted = consultationForm.outcome === OUTCOME_OPTIONS[0];

      updateDocumentNonBlocking(apptRef, {
        status: consultationForm.outcome,
        consultationNotes: consultationForm.notes,
        recommendation: consultationForm.recommendation,
        assessment: consultationForm.assessment,
        outcome: consultationForm.outcome,
        denialReason: isAccepted ? null : consultationForm.denialReason,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      const notifId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", notifId), {
        id: notifId,
        type: "appointment",
        userRole: "lawyer",
        description: `Official Legal Consultation for ${activeConsultation.referenceCode} completed. Outcome: ${isAccepted ? 'Accepted' : 'Denied'}.`,
        referenceId: activeConsultation.id,
        referenceCode: activeConsultation.referenceCode,
        status: "unread",
        createdAt: new Date().toISOString()
      }, { merge: true });

      toast({ title: "Consultation Concluded", description: isAccepted ? "Citizen marked for legal assistance." : "Consultation closed with denial." });
      setActiveConsultation(null);
      setConsultationForm({ notes: "", recommendation: "", assessment: "", caseType: "", outcome: "", denialReason: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleActivateCase = async (appt: any) => {
    if (!db || !user || !appt) return;
    setIsSubmitting(true);

    try {
      const year = new Date().getFullYear();
      const caseId = `CASE-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      let clientId = appt.clientId;
      const citizenEmail = appt.guestEmail || appt.clientEmail || `${appt.guestMobile || appt.clientMobile}@epao.mobile`;

      if (!clientId) {
        try {
          const secondaryApp = initializeApp(firebaseConfig, "case-activation-" + Date.now());
          const secondaryAuth = getAuth(secondaryApp);
          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, citizenEmail, "password123");
          clientId = userCredential.user.uid;
          await deleteApp(secondaryApp);
        } catch (authError: any) {
          if (authError.code !== 'auth/email-already-in-use') clientId = clientId || crypto.randomUUID();
        }
      }

      updateDocumentNonBlocking(doc(db, "appointments", appt.id), { status: "completed", caseId, clientId, updatedAt: new Date().toISOString() });
      setDocumentNonBlocking(doc(db, "cases", caseId), { id: caseId, clientId, lawyerId: user.uid, caseType: appt.caseType, status: "Active", description: appt.assessment || "Case activated following official consultation.", consultationRef: appt.referenceCode, createdAt: new Date().toISOString() }, { merge: true });
      setDocumentNonBlocking(doc(db, "users", clientId), { id: clientId, mobileNumber: appt.guestMobile || appt.clientMobile || "", email: citizenEmail, fullName: appt.guestName || appt.clientName || "", role: "client", status: "Active Case", createdAt: new Date().toISOString() }, { merge: true });

      const notifId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", notifId), { id: notifId, type: "case", userRole: "lawyer", description: `New Official Case ${caseId} activated for ${appt.guestName || appt.clientName}.`, referenceId: caseId, status: "unread", createdAt: new Date().toISOString() }, { merge: true });

      toast({ title: "Legal Case Activated", description: `Case ${caseId} is now live.` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Activation Failed", description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>;
  if (!user || role !== 'lawyer') return null;

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-8 pb-12">
        <div className="flex items-center gap-6">
          <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
            <AvatarImage src={lawyerData?.photoUrl} className="object-cover" />
            <AvatarFallback className="bg-secondary/10 text-2xl font-black text-secondary">{lawyerData?.firstName?.[0] || "?"}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-black text-secondary font-headline tracking-tight">Atty. {lawyerData?.firstName} {lawyerData?.lastName}</h1>
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em] mt-1">Professional Legal Portal</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {pendingConsultations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1"><Activity className="h-5 w-5 text-red-500 animate-pulse" /><h2 className="text-sm font-black uppercase tracking-widest text-secondary">Awaiting Assessment ({pendingConsultations.length})</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pendingConsultations.map(appt => (
                  <Card key={appt.id} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden border-l-8 border-red-500">
                    <CardContent className="p-8 flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                        <div className="p-3 bg-red-50 rounded-2xl text-red-600 shrink-0"><User className="h-6 w-6" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-secondary truncate">{appt.guestName || appt.clientName}</h3>
                            <Badge className="bg-red-500 text-white text-[8px] font-black uppercase px-2 py-0.5 border-none shrink-0">IN PROGRESS</Badge>
                          </div>
                          <Badge variant="outline" className="text-[9px] uppercase border-red-100 bg-red-50/50 text-red-700 mt-1">{appt.serviceType || appt.purpose || appt.caseType}</Badge>
                        </div>
                      </div>
                      <Button onClick={() => { setActiveConsultation(appt); setConsultationForm({ ...consultationForm, caseType: appt.caseType }); }} className="h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-black px-6 shadow-lg shrink-0">Start Assessment <ArrowRight className="ml-2 h-4 w-4" /></Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {filterAcceptedPendingActivation.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2 px-1 text-primary"><Scale className="h-5 w-5" /><h2 className="text-sm font-black uppercase tracking-widest">Accepted - Pending Activation ({filterAcceptedPendingActivation.length})</h2></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filterAcceptedPendingActivation.map(appt => (
                  <Card key={appt.id} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden border-l-8 border-primary">
                    <CardContent className="p-8 flex items-center justify-between gap-6">
                      <div className="flex items-center gap-5 flex-1 min-w-0">
                        <div className="p-3 bg-primary/5 rounded-2xl text-primary shrink-0"><CheckCircle2 className="h-6 w-6" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-primary truncate">{appt.guestName || appt.clientName}</h3>
                            <Badge className="bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 border-none shrink-0">ACCEPTED</Badge>
                          </div>
                          <div className="flex flex-col mt-1">
                            <Badge variant="outline" className="text-[9px] uppercase border-primary/10 bg-primary/5 text-primary w-fit">{appt.serviceType || appt.purpose || appt.caseType}</Badge>
                            {appt.outcome && <p className="text-[9px] text-muted-foreground font-bold mt-1 italic truncate">Outcome: {appt.outcome}</p>}
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => handleActivateCase(appt)} disabled={isSubmitting} className="h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-black px-6 shadow-lg shrink-0">{isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Scale className="mr-2 h-4 w-4" />}Activate Case</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-secondary text-white overflow-hidden relative"><div className="absolute top-0 right-0 p-4 opacity-10"><Briefcase className="h-24 w-24" /></div><CardContent className="p-8"><p className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Caseload</p><p className="text-5xl font-black">{activeCases?.length || 0}</p></CardContent></Card>
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white text-secondary overflow-hidden border-2 border-secondary/5"><CardContent className="p-8 flex justify-between items-start"><div><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today's Schedule</p><p className="text-5xl font-black">{filteredSchedule.length}</p></div><div className="p-3 bg-secondary/5 rounded-2xl"><Clock className="h-6 w-6 text-secondary" /></div></CardContent></Card>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-secondary/5 pb-4 border-b border-secondary/10"><CardTitle className="text-lg font-bold text-secondary flex items-center gap-2"><CalendarIcon className="h-5 w-5" /> Workstation Calendar</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 xl:grid-cols-12">
              <div className="xl:col-span-4 p-8 border-r border-secondary/5 bg-secondary/[0.02]"><Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="mx-auto" /></div>
              <div className="xl:col-span-8 divide-y divide-secondary/5">
                {filteredSchedule.length > 0 ? filteredSchedule.map((item, idx) => (
                  <div key={idx} className="p-8 flex items-center justify-between hover:bg-secondary/5 transition-colors group">
                    <div className="flex items-center gap-6">
                      <div className="h-16 w-16 rounded-2xl bg-secondary/5 flex flex-col items-center justify-center border border-secondary/10 group-hover:bg-white transition-colors"><span className="text-[10px] font-black text-secondary uppercase leading-none">{format(new Date(item.data.date), "MMM")}</span><span className="text-2xl font-black text-secondary leading-none mt-1">{format(new Date(item.data.date), "dd")}</span></div>
                      <div>
                        <div className="flex items-center gap-2"><h4 className="text-lg font-black text-secondary">{item.type === 'appt' ? (item.data.guestName || item.data.clientName) : item.data.title}</h4><Badge variant="outline" className={cn("text-[8px] font-black uppercase", item.type === 'appt' ? "border-amber-200 text-amber-700 bg-amber-50" : "border-blue-200 text-blue-700 bg-blue-50")}>{item.type === 'appt' ? "Official Consultation" : item.data.category}</Badge></div>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest"><span><Clock className="h-3 w-3 inline mr-1" /> {item.time}</span><span><MapPin className="h-3 w-3 inline mr-1" /> {item.type === 'appt' ? "Office" : item.data.location}</span></div>
                      </div>
                    </div>
                  </div>
                )) : <div className="py-32 text-center space-y-4"><Inbox className="h-20 w-20 text-secondary/10 mx-auto" /><p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No entries for this date</p></div>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Dialog open={!!activeConsultation} onOpenChange={() => setActiveConsultation(null)}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
            <DialogHeader className="p-8 bg-secondary text-white shrink-0">
              <div className="flex justify-between items-center">
                <div><DialogTitle className="text-2xl font-black">Conclude Official Legal Consultation</DialogTitle><DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Citizen: {activeConsultation?.guestName || activeConsultation?.clientName}</DialogDescription></div>
                <div className="p-3 bg-white/20 rounded-2xl"><GavelIcon className="h-6 w-6 text-white" /></div>
              </div>
            </DialogHeader>
            <div className="p-10 space-y-8 flex-1 overflow-y-auto">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Intake Category</Label>
                    <Select value={consultationForm.caseType} onValueChange={(v) => setConsultationForm({...consultationForm, caseType: v})}><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select Category" /></SelectTrigger><SelectContent>{Object.keys(caseCategories).map(cat => <SelectItem key={cat} value={cat} className="font-bold">{cat}</SelectItem>)}</SelectContent></Select>
                  </div>
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Official Legal Assessment</Label><Textarea placeholder="Brief assessment..." className="rounded-2xl h-24" value={consultationForm.assessment || ""} onChange={e => setConsultationForm({...consultationForm, assessment: e.target.value})} /></div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Consultation Outcome</Label>
                    <Select value={consultationForm.outcome} onValueChange={(v) => setConsultationForm({...consultationForm, outcome: v})}><SelectTrigger className="h-12 rounded-xl"><SelectValue placeholder="Select Result" /></SelectTrigger><SelectContent>{OUTCOME_OPTIONS.map(opt => <SelectItem key={opt} value={opt} className="font-bold">{opt}</SelectItem>)}</SelectContent></Select>
                  </div>
                  {consultationForm.outcome === OUTCOME_OPTIONS[1] && <div className="space-y-2 animate-in fade-in"><Label className="text-[10px] font-black uppercase text-red-600/60 ml-1">Reason for Denial</Label><Select value={consultationForm.denialReason} onValueChange={(v) => setConsultationForm({...consultationForm, denialReason: v})}><SelectTrigger className="h-12 rounded-xl border-red-100 bg-red-50/30"><SelectValue placeholder="Select Reason" /></SelectTrigger><SelectContent>{DENIAL_REASONS.map(r => <SelectItem key={r} value={r} className="font-bold">{r}</SelectItem>)}</SelectContent></Select></div>}
                  <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Confidential Case Notes</Label><Textarea placeholder="Factual summary..." className="rounded-2xl h-24" value={consultationForm.notes || ""} onChange={e => setConsultationForm({...consultationForm, notes: e.target.value})} /></div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 flex gap-4"><Button variant="outline" onClick={() => setActiveConsultation(null)} className="flex-1 h-14 rounded-xl font-bold border-2">Cancel</Button><Button onClick={handleCompleteConsultation} disabled={isSubmitting || !consultationForm.outcome || (consultationForm.outcome === OUTCOME_OPTIONS[1] && !consultationForm.denialReason)} className="flex-1 h-14 rounded-xl font-black text-white shadow-xl bg-secondary hover:bg-secondary/90">{isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}Complete & Record Outcome</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
