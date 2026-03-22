
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
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";
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

const CANCELLATION_REASONS = {
  work: [
    "Conflict of Interest (Statutory)",
    "Emergency Court Hearing",
    "Jail / Prison Visit",
    "Field Investigation / Coordination",
    "Official Meeting / Seminar",
    "Office Administrative Duty",
    "Repeated Appointment"
  ],
  personal: [
    "Medical / Sick Leave",
    "Family Emergency",
    "Personal Matters"
  ]
};

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

  // Cancellation State
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [apptToCancel, setApptToCancel] = useState<any>(null);
  const [cancellationReason, setCancellationReason] = useState("");

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

  // Fetch all availability for the calendar highlighting
  const allAvailQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return collection(db, "roleLawyer", user.uid, "availability");
  }, [db, user, role]);

  const { data: allAvail } = useCollection(allAvailQuery);

  const leaveDates = useMemo(() => {
    if (!allAvail) return [];
    return allAvail
      .filter(a => a.availabilityType === 'FullDayLeave' || a.availabilityType === 'PartialLeave')
      .map(a => parseISO(a.date));
  }, [allAvail]);

  // Leave status for selected date
  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const availRef = useMemoFirebase(() => {
    if (!db || !user || !dateStr) return null;
    return doc(db, "roleLawyer", user.uid, "availability", dateStr);
  }, [db, user, dateStr]);
  const { data: availData } = useDoc(availRef);

  // Entity-driven alerts for Lawyers (Acknowledgeable)
  const unreadApptsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "appointments"), where("lawyerId", "==", user.uid), where("lawyerNotified", "==", false));
  }, [db, user, role]);

  const unreadCasesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "cases"), where("lawyerId", "==", user.uid), where("lawyerNotified", "==", false));
  }, [db, user, role]);

  // System Notifications targeting the lawyer
  const lawyerNotificationsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "notifications"), where("targetUserId", "==", user.uid), where("status", "==", "unread"), limit(50));
  }, [db, user, role]);

  const { data: apptsData } = useCollection(apptsQuery);
  const { data: activeCases } = useCollection(casesQuery);
  const { data: dutiesData } = useCollection(dutiesQuery);
  const { data: unreadAppts } = useCollection(unreadApptsQuery);
  const { data: unreadCases } = useCollection(unreadCasesQuery);
  const { data: lawyerNotifications } = useCollection(lawyerNotificationsQuery);

  const workstationAlerts = useMemo(() => {
    const alerts: any[] = [];
    if (unreadAppts) {
      unreadAppts.forEach(a => alerts.push({ ...a, alertType: 'appointment', alertSource: 'entity' }));
    }
    if (unreadCases) {
      unreadCases.forEach(c => alerts.push({ ...c, alertType: 'case', alertSource: 'entity' }));
    }
    if (lawyerNotifications) {
      lawyerNotifications.forEach(n => alerts.push({ ...n, alertType: n.type, alertSource: 'notification' }));
    }
    return alerts.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  }, [unreadAppts, unreadCases, lawyerNotifications]);

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
    const ds = format(selectedDate, "yyyy-MM-dd");
    
    const dayAppts = apptsData?.filter(a => a.dateString === ds && a.status !== 'cancelled') || [];
    const dayDuties = dutiesData?.filter(d => d.date.startsWith(ds)) || [];

    return [
      ...dayAppts.map(a => ({ type: 'appt', data: a, time: a.time })),
      ...dayDuties.map(d => ({ type: 'duty', data: d, time: d.startTime }))
    ].sort((a, b) => a.time.localeCompare(b.time));
  }, [apptsData, dutiesData, selectedDate]);

  const handleAcknowledge = (id: string, type: string, source: 'entity' | 'notification') => {
    if (!db) return;
    if (source === 'entity') {
      const ref = doc(db, type === 'case' ? "cases" : "appointments", id);
      updateDocumentNonBlocking(ref, { lawyerNotified: true, updatedAt: new Date().toISOString() });
    } else {
      updateDocumentNonBlocking(doc(db, "notifications", id), { status: "read" });
    }
    toast({ title: "Alert Cleared", description: "Record acknowledged in your workstation." });
  };

  const handleCancelAppointment = async () => {
    if (!db || !apptToCancel || !cancellationReason) return;
    setIsSubmitting(true);

    try {
      const apptId = apptToCancel.id || apptToCancel.referenceId;
      const apptRef = doc(db, "appointments", apptId);
      const clientName = apptToCancel.guestName || apptToCancel.clientName || "Citizen";
      const refCode = apptToCancel.referenceCode || apptId;
      
      updateDocumentNonBlocking(apptRef, {
        status: "cancelled",
        cancellationReason: cancellationReason,
        cancelledBy: "lawyer",
        lawyerNotified: true,
        clientNotified: false,
        updatedAt: new Date().toISOString()
      });

      // Admin Audit
      const adminNotifId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", adminNotifId), {
        id: adminNotifId,
        type: "appointment",
        userRole: "lawyer",
        description: `Atty. ${lawyerData?.lastName || 'Staff'} cancelled Visit ${refCode} for ${clientName}. Reason: ${cancellationReason}`,
        referenceId: apptId,
        referenceCode: refCode,
        status: "unread",
        createdAt: new Date().toISOString()
      }, { merge: true });

      // Client Alert
      const clientId = apptToCancel.clientId || apptToCancel.targetUserId;
      if (clientId) {
        const clientNotifId = crypto.randomUUID();
        setDocumentNonBlocking(doc(db, "notifications", clientNotifId), {
          id: clientNotifId,
          type: "appointment",
          userRole: "lawyer",
          description: `Office Alert: Visit ${refCode} for ${clientName} has been cancelled by Atty. ${lawyerData?.lastName}. Reason: ${cancellationReason}`,
          referenceId: apptId,
          referenceCode: refCode,
          targetUserId: clientId,
          status: "unread",
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      toast({ title: "Appointment Cancelled", description: "Citizen and Admin registries have been updated." });
      setIsCancelDialogOpen(false);
      setApptToCancel(null);
      setCancellationReason("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkStatus = (appt: any, status: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "appointments", appt.id), {
      status: status,
      updatedAt: new Date().toISOString(),
      clientNotified: false // Trigger client alert
    });
    
    const clientName = appt.guestName || appt.clientName || "Citizen";
    const refCode = appt.referenceCode;

    const adminNotifId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", adminNotifId), {
      id: adminNotifId,
      type: "appointment",
      userRole: "lawyer",
      description: `Atty. ${lawyerData?.lastName || 'Staff'} marked Visit ${refCode} for ${clientName} as ${status}.`,
      referenceId: appt.id,
      referenceCode: refCode,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });

    if (appt.clientId) {
      const clientNotifId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", clientNotifId), {
        id: clientNotifId,
        type: "appointment",
        userRole: "lawyer",
        description: `Office Update: Visit ${refCode} for ${clientName} was recorded as ${status}.`,
        referenceId: appt.id,
        referenceCode: refCode,
        targetUserId: appt.clientId,
        status: "unread",
        createdAt: new Date().toISOString()
      }, { merge: true });
    }

    toast({ title: "Status Updated", description: `Appointment marked as ${status}.` });
  };

  const handleCompleteConsultation = async () => {
    if (!db || !activeConsultation || !user || !consultationForm.outcome) return;
    setIsSubmitting(true);

    try {
      const apptRef = doc(db, "appointments", activeConsultation.id);
      const isAccepted = consultationForm.outcome === OUTCOME_OPTIONS[0];
      const clientName = activeConsultation.guestName || activeConsultation.clientName || "Citizen";
      const refCode = activeConsultation.referenceCode;

      updateDocumentNonBlocking(apptRef, {
        status: consultationForm.outcome,
        consultationNotes: consultationForm.notes,
        recommendation: consultationForm.recommendation,
        assessment: consultationForm.assessment,
        outcome: consultationForm.outcome,
        denialReason: isAccepted ? null : consultationForm.denialReason,
        completedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        clientNotified: false 
      });

      const adminNotifId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", adminNotifId), {
        id: adminNotifId,
        type: "appointment",
        userRole: "lawyer",
        description: `Atty. ${lawyerData?.lastName} finalized Consultation ${refCode} for ${clientName}. Result: ${isAccepted ? 'Accepted' : 'Denied'}.`,
        referenceId: activeConsultation.id,
        referenceCode: refCode,
        status: "unread",
        createdAt: new Date().toISOString()
      }, { merge: true });

      if (activeConsultation.clientId) {
        const clientNotifId = crypto.randomUUID();
        setDocumentNonBlocking(doc(db, "notifications", clientNotifId), {
          id: clientNotifId,
          type: "appointment",
          userRole: "lawyer",
          description: `Legal aid application ${refCode} for ${clientName} has been ${isAccepted ? 'ACCEPTED' : 'DENIED'}.`,
          referenceId: activeConsultation.id,
          referenceCode: refCode,
          targetUserId: activeConsultation.clientId,
          status: "unread",
          createdAt: new Date().toISOString()
        }, { merge: true });
      }

      toast({ title: "Consultation Concluded", description: isAccepted ? "Citizen accepted for legal aid." : "Consultation finalized with denial." });
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
      const clientName = appt.guestName || appt.clientName || "Citizen";
      
      let clientId = appt.clientId;
      const citizenEmail = appt.guestEmail || appt.clientEmail || `${appt.guestMobile || appt.clientMobile || appt.mobileNumber}@epao.mobile`;

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
      setDocumentNonBlocking(doc(db, "cases", caseId), { 
        id: caseId, 
        clientId, 
        lawyerId: user.uid, 
        caseType: appt.caseType, 
        status: "Active", 
        description: appt.assessment || "Case activated post-consultation.", 
        consultationRef: appt.referenceCode, 
        lawyerNotified: true,
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

      const notifId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", notifId), { 
        id: notifId, 
        type: "case", 
        userRole: "lawyer", 
        description: `Atty. ${lawyerData?.lastName} activated Official Case ${caseId} for ${clientName} for citizen registry.`, 
        referenceId: caseId, 
        status: "unread", 
        createdAt: new Date().toISOString() 
      }, { merge: true });

      toast({ title: "Legal Case Activated", description: `Case ${caseId} initialized.` });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Activation Failed", description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWeekendDisabled = (date: Date) => {
    return date.getDay() === 0 || date.getDay() === 6;
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>;
  if (!user || role !== 'lawyer') return null;

  return (
    <DashboardLayout role="lawyer">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 pb-12">
        <div className="xl:col-span-3 space-y-12">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
              <AvatarImage src={lawyerData?.photoUrl} className="object-cover" />
              <AvatarFallback className="bg-secondary/10 text-3xl font-black text-secondary">{lawyerData?.firstName?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-4xl font-black text-secondary font-headline tracking-tight">Workstation: Atty. {lawyerData?.firstName} {lawyerData?.lastName}</h1>
              <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em] mt-1">Official Legal Command Home</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {pendingConsultations.map(appt => (
              <Card key={appt.id} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden border-l-8 border-red-500 animate-in slide-in-from-left-4 duration-500">
                <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-red-50 rounded-3xl text-red-600 shrink-0"><User className="h-8 w-8" /></div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3"><h3 className="text-2xl font-black text-secondary">{appt.guestName || appt.clientName}</h3><Badge className="bg-red-500 text-white text-[9px] font-black uppercase px-3 py-1 border-none shadow-sm">IN PROGRESS</Badge></div>
                      <div className="flex flex-wrap gap-4 text-muted-foreground font-bold text-xs uppercase tracking-wider"><span>Ref: {appt.referenceCode}</span><span>Matter: {appt.serviceType || appt.purpose || appt.caseType}</span></div>
                    </div>
                  </div>
                  <Button onClick={() => { setActiveConsultation(appt); setConsultationForm({ ...consultationForm, caseType: appt.caseType || "" }); }} className="h-16 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-black px-10 shadow-xl text-lg">Finalize Intake <ArrowRight className="ml-2 h-6 w-6" /></Button>
                </CardContent>
              </Card>
            ))}

            {filterAcceptedPendingActivation.map(appt => (
              <Card key={appt.id} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden border-l-8 border-primary animate-in slide-in-from-left-4 duration-500">
                <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 bg-primary/5 rounded-3xl text-primary shrink-0"><CheckCircle2 className="h-8 w-8" /></div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3"><h3 className="text-2xl font-black text-primary">{appt.guestName || appt.clientName}</h3><Badge className="bg-primary text-white text-[9px] font-black uppercase px-3 py-1 border-none shadow-sm">ACCEPTED</Badge></div>
                      <div className="flex flex-wrap gap-4 text-muted-foreground font-bold text-xs uppercase tracking-wider"><span>Ref: {appt.referenceCode}</span><span>Matter: {appt.caseType}</span></div>
                    </div>
                  </div>
                  <Button onClick={() => handleActivateCase(appt)} disabled={isSubmitting} className="h-16 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black px-10 shadow-xl text-lg">Initialize Case File <Scale className="ml-2 h-6 w-6" /></Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-secondary text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Briefcase className="h-24 w-24" /></div>
              <CardContent className="p-10"><p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Active Caseload</p><p className="text-6xl font-black">{activeCases?.length || 0}</p></CardContent>
            </Card>
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white text-secondary border-2 border-secondary/5 overflow-hidden">
              <CardContent className="p-10 flex justify-between items-start">
                <div><p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Daily Session Load</p><p className="text-6xl font-black">{filteredSchedule.length}</p></div>
                <div className="p-4 bg-secondary/5 rounded-2xl"><Clock className="h-8 w-8 text-secondary" /></div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="bg-secondary/5 p-10 border-b border-secondary/10"><CardTitle className="text-xl font-bold text-secondary flex items-center gap-3"><CalendarIcon className="h-6 w-6" /> Office Schedule & Workstation Registry</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-4 p-10 border-r border-secondary/5 bg-secondary/[0.02]">
                  <Calendar 
                    mode="single" 
                    selected={selectedDate} 
                    onSelect={(date) => {
                      if (date && isWeekendDisabled(date)) return;
                      setSelectedDate(date);
                    }} 
                    disabled={isWeekendDisabled}
                    modifiers={{ leave: leaveDates }}
                    modifiersClassNames={{
                      leave: "bg-red-500 text-white rounded-xl shadow-md border-red-600"
                    }}
                    className="mx-auto" 
                  />
                  <div className="mt-6 flex items-center gap-2 px-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Filed Leave / Unavailable</span>
                  </div>
                </div>
                <div className="lg:col-span-8 p-0 flex flex-col min-h-[400px]">
                  {availData && availData.availabilityType !== 'Available' && (
                    <div className="p-8 bg-amber-50 border-b border-amber-100 animate-in fade-in duration-500">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-amber-100 rounded-2xl text-amber-700">
                          <ShieldAlert className="h-6 w-6" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-sm font-black text-amber-900 uppercase tracking-widest">Professional Status: Filed Leave</h4>
                          <p className="text-base font-bold text-amber-800">Reason: {availData.leaveReason}</p>
                          {availData.notes && <p className="text-xs italic text-amber-700 mt-2 font-medium">"{availData.notes}"</p>}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="divide-y divide-secondary/5 flex-1">
                    {filteredSchedule.length > 0 ? filteredSchedule.map((item, idx) => (
                      <div key={idx} className="p-10 flex items-center justify-between hover:bg-secondary/5 transition-colors group">
                        <div className="flex items-center gap-8">
                          <div className="h-20 w-20 rounded-2xl bg-secondary/5 flex flex-col items-center justify-center border border-secondary/10 shadow-sm"><span className="text-[10px] font-black text-secondary uppercase leading-none">{format(new Date(item.data.date), "MMM")}</span><span className="text-3xl font-black text-secondary leading-none mt-1">{format(new Date(item.data.date), "dd")}</span></div>
                          <div>
                            <h4 className="text-2xl font-black text-secondary">{item.type === 'appt' ? (item.data.guestName || item.data.clientName) : item.data.title}</h4>
                            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest"><span><Clock className="h-4 w-4 inline mr-1.5" /> {item.time}</span><span><MapPin className="h-4 w-4 inline mr-1.5" /> {item.type === 'appt' ? "Main Office" : item.data.location}</span></div>
                          </div>
                        </div>
                        {item.type === 'appt' && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-12 w-12 rounded-xl group-hover:bg-secondary/10"><MoreVertical className="h-5 w-5 text-secondary" /></Button></DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl w-56">
                              <DropdownMenuItem onClick={() => { setActiveConsultation(item.data); setConsultationForm({ ...consultationForm, caseType: item.data.caseType || "" }); }} className="font-bold">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Start Assessment
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleMarkStatus(item.data, 'No Show')} className="text-red-600 font-bold">
                                <XCircle className="mr-2 h-4 w-4" /> Record No Show
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    )) : <div className="py-32 text-center space-y-4 flex-1 flex flex-col justify-center"><Inbox className="h-20 w-20 text-secondary/5 mx-auto" /><p className="text-xs font-black uppercase text-muted-foreground tracking-widest">No workstation entries for this date</p></div>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="xl:col-span-1">
          <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-24">
            <CardHeader className="bg-secondary p-8 text-white shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Bell className="h-6 w-6 text-white/60" />
                  <CardTitle className="text-xl font-black">Workstation Alerts</CardTitle>
                </div>
                {workstationAlerts.length > 0 && (
                  <Badge className="bg-white/20 text-white border-none font-black text-[10px] animate-pulse">
                    {workstationAlerts.length} NEW
                  </Badge>
                )}
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-2">Assignments & System Logs</p>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1 divide-y divide-secondary/5">
              {workstationAlerts.length > 0 ? (
                workstationAlerts.map((alert) => (
                  <div key={alert.id} className="p-6 bg-amber-50/30 relative group hover:bg-amber-50 transition-colors">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={cn(
                        "text-[8px] font-black uppercase border-none px-2 py-0.5 shadow-sm",
                        alert.alertSource === 'notification' ? 'bg-secondary/10 text-secondary' : 'bg-amber-100 text-amber-700'
                      )}>
                        {alert.alertType === 'case' ? 'CASE ASSIGNMENT' : alert.alertSource === 'notification' ? 'SYSTEM UPDATE' : 'NEW BOOKING'}
                      </Badge>
                      <span className="text-[9px] font-black text-muted-foreground">
                        {alert.createdAt ? format(new Date(alert.createdAt), "HH:mm") : '---'}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-secondary leading-snug">
                      {alert.description || (alert.alertType === 'case' 
                        ? `New Case Assignment: ${alert.caseType} for ${alert.id}` 
                        : `New Consultation Booked: ${alert.caseType} (${alert.referenceCode})`)}
                    </p>
                    <div className="mt-4 flex flex-col gap-2">
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => handleAcknowledge(alert.id, alert.alertType, alert.alertSource)}
                        className="h-8 rounded-xl font-black text-[10px] uppercase text-emerald-700 hover:bg-emerald-100"
                      >
                        <CheckCheck className="h-3 w-3 mr-1.5" /> Acknowledge
                      </Button>
                      {(alert.alertType === 'appointment' || alert.type === 'appointment') && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => { setApptToCancel(alert); setIsCancelDialogOpen(true); }}
                          className="h-8 rounded-xl font-black text-[10px] uppercase text-rose-700 hover:bg-rose-100"
                        >
                          <XCircle className="h-3 w-3 mr-1.5" /> Cancel Visit
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-4">
                  <CheckCheck className="h-12 w-12 text-secondary/5 mx-auto" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest px-8">No unread alerts in queue</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!activeConsultation} onOpenChange={() => setActiveConsultation(null)}>
        <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-8 bg-secondary text-white shrink-0">
            <div className="flex justify-between items-center">
              <div><DialogTitle className="text-3xl font-black">Official Intake Assessment</DialogTitle><DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Citizen: {activeConsultation?.guestName || activeConsultation?.clientName}</DialogDescription></div>
              <div className="p-4 bg-white/20 rounded-3xl"><GavelIcon className="h-8 w-8 text-white" /></div>
            </div>
          </DialogHeader>
          <div className="p-10 space-y-8 flex-1 overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Statutory Category</Label>
                  <Select value={consultationForm.caseType} onValueChange={(v) => setConsultationForm({...consultationForm, caseType: v})}>
                    <SelectTrigger className="h-14 rounded-xl border-secondary/10"><SelectValue placeholder="Select Category" /></SelectTrigger>
                    <SelectContent position="popper" sideOffset={4} className="max-h-[300px] overflow-y-auto">{Object.keys(caseCategories).map(cat => <SelectItem key={cat} value={cat} className="font-bold">{cat}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Legal Assessment Summary</Label><Textarea placeholder="Document the core legal findings..." className="rounded-[2rem] h-32" value={consultationForm.assessment} onChange={e => setconsultationForm({...consultationForm, assessment: e.target.value})} /></div>
              </div>
              <div className="space-y-6">
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Registry Outcome</Label>
                  <Select value={consultationForm.outcome} onValueChange={(v) => setConsultationForm({...consultationForm, outcome: v})}>
                    <SelectTrigger className="h-14 rounded-xl border-secondary/10"><SelectValue placeholder="Select Final Result" /></SelectTrigger>
                    <SelectContent position="popper" sideOffset={4} className="max-h-[300px] overflow-y-auto">{OUTCOME_OPTIONS.map(opt => <SelectItem key={opt} value={opt} className="font-bold">{opt}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                {consultationForm.outcome === OUTCOME_OPTIONS[1] && (
                  <div className="space-y-2 animate-in fade-in">
                    <Label className="text-[10px] font-black uppercase text-red-600/60 ml-1">Reason for Denial</Label>
                    <Select value={consultationForm.denialReason} onValueChange={(v) => setConsultationForm({...consultationForm, denialReason: v})}>
                      <SelectTrigger className="h-14 rounded-xl border-red-100 bg-red-50/30"><SelectValue placeholder="Select Statutory Reason" /></SelectTrigger>
                      <SelectContent position="popper" sideOffset={4} className="max-h-[300px] overflow-y-auto">{DENIAL_REASONS.map(r => <SelectItem key={r} value={r} className="font-bold">{r}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                )}
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Confidential Audit Notes</Label><Textarea placeholder="Internal reference only..." className="rounded-[2rem] h-32" value={consultationForm.notes} onChange={e => setConsultationForm({...consultationForm, notes: e.target.value})} /></div>
              </div>
            </div>
          </div>
          <DialogFooter className="p-10 bg-muted/30 flex gap-4">
            <Button variant="outline" onClick={() => setActiveConsultation(null)} className="flex-1 h-16 rounded-2xl font-black border-2 border-secondary/10">Cancel</Button>
            <Button onClick={handleCompleteConsultation} disabled={isSubmitting || !consultationForm.outcome || (consultationForm.outcome === OUTCOME_OPTIONS[1] && !consultationForm.denialReason)} className="flex-1 h-16 rounded-2xl font-black text-white shadow-xl bg-secondary">
              {isSubmitting ? <Loader2 className="animate-spin h-6 w-6" /> : <CheckCircle2 className="mr-2 h-6 w-6" />}
              Commit Final Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* --- CANCELLATION DIALOG --- */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="rounded-[3rem] max-w-lg p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 bg-rose-600 text-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl"><AlertTriangle className="h-6 w-6" /></div>
              <div>
                <DialogTitle className="text-2xl font-black">Cancel Appointment</DialogTitle>
                <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Atty. Cancellation Registry</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="p-10 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-rose-600/60 ml-1">Mandatory Reason for Cancellation</Label>
              <Select value={cancellationReason} onValueChange={setCancellationReason}>
                <SelectTrigger className="h-14 rounded-xl border-rose-100 bg-rose-50/30 font-bold shadow-sm">
                  <SelectValue placeholder="Select Reason" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4} className="max-h-[300px] overflow-y-auto">
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-black uppercase text-primary/40 tracking-widest px-2 py-2 border-b">Work-Related Reasons</SelectLabel>
                    {CANCELLATION_REASONS.work.map(r => (
                      <SelectItem key={r} value={r} className="font-bold">{r}</SelectItem>
                    ))}
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel className="text-[10px] font-black uppercase text-primary/40 tracking-widest px-2 py-2 border-b mt-2">Personal Reasons</SelectLabel>
                    {CANCELLATION_REASONS.personal.map(r => (
                      <SelectItem key={r} value={r} className="font-bold">{r}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <p className="text-[9px] text-muted-foreground italic mt-2 px-1">Note: This reason will be visible to both the Client and the Administrator.</p>
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/30 flex gap-3">
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} className="flex-1 h-14 rounded-xl font-bold">Close</Button>
            <Button 
              onClick={handleCancelAppointment} 
              disabled={!cancellationReason || isSubmitting} 
              className="flex-1 h-14 rounded-xl bg-rose-600 text-white font-black shadow-xl"
            >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirm Cancellation"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
