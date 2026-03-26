
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useDoc, setDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc, orderBy, limit } from "firebase/firestore";
import { format, isWeekend, parseISO, getDay, isBefore, startOfToday, addHours, setHours, setMinutes } from "date-fns";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
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

const HOLIDAYS = [
  "2024-01-01", "2024-04-09", "2024-05-01", "2024-06-12", "2024-08-26",
  "2024-11-01", "2024-11-30", "2024-12-25", "2024-12-30", 
  "2025-01-01", "2025-02-25", "2025-04-17", "2025-04-18", "2025-05-01"
];

const isHoliday = (date: Date) => {
  const ds = format(date, "yyyy-MM-dd");
  return HOLIDAYS.includes(ds);
};

export default function LawyerDashboard() {
  const { user, role, loading } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
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

  useEffect(() => {
    setSelectedDate(new Date());
  }, []);

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

  const workstationAlertsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(
      collection(db, "notifications"),
      where("targetUserId", "==", user.uid),
      where("status", "==", "unread"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
  }, [db, user, role]);

  const { data: workstationAlerts } = useCollection(workstationAlertsQuery);

  const activeConsultations = useMemo(() => {
    if (!apptsData) return [];
    return apptsData.filter(a => a.status === "Consultation in Progress");
  }, [apptsData]);

  const filteredSchedule = useMemo(() => {
    if (!selectedDate) return [];
    const ds = format(selectedDate, "yyyy-MM-dd");
    const dayAppts = apptsData?.filter(a => a.dateString === ds && a.status !== 'cancelled') || [];
    const dayDuties = dutiesData?.filter(d => {
      try {
        const dDate = d.date.includes('T') ? parseISO(d.date) : new Date(d.date);
        return format(dDate, "yyyy-MM-dd") === ds;
      } catch (e) {
        return d.date.startsWith(ds);
      }
    }) || [];
    
    return [
      ...dayAppts.map(a => ({ type: 'appt', data: a, time: a.time })),
      ...dayDuties.map(d => ({ type: 'duty', data: d, time: d.startTime }))
    ].sort((a, b) => a.time.localeCompare(b.time));
  }, [apptsData, dutiesData, selectedDate]);

  const dutyModifiers = useMemo(() => {
    const mods: Record<string, Date[]> = {
      office: [],
      field: [],
      court: [],
      jail: []
    };

    dutiesData?.forEach(d => {
      try {
        const date = d.date.includes('T') ? parseISO(d.date) : new Date(d.date);
        if (d.category === "Office Work") mods.office.push(date);
        else if (d.category === "Field Work") mods.field.push(date);
        else if (d.category === "Court Work") mods.court.push(date);
        else if (d.category === "Prison and Jail Visits") mods.jail.push(date);
      } catch (e) {}
    });

    return mods;
  }, [dutiesData]);

  const handleAcknowledgeAlert = (alert: any) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "notifications", alert.id), { status: "read" });
    
    if (alert.type === 'lawyer' && alert.referenceId) {
      updateDocumentNonBlocking(doc(db, "lawyerDuties", alert.referenceId), { notified: true });
    } else if (alert.type === 'appointment' && alert.referenceId) {
      updateDocumentNonBlocking(doc(db, "appointments", alert.referenceId), { lawyerNotified: true });
    } else if (alert.type === 'case' && alert.referenceId) {
      updateDocumentNonBlocking(doc(db, "cases", alert.referenceId), { lawyerNotified: true });
    }
    
    toast({ title: "Verified", description: "Workstation record synchronized." });
  };

  const handleCancelAppointment = async () => {
    if (!db || !apptToCancel || !cancellationReason) return;
    setIsSubmitting(true);
    try {
      const apptId = apptToCancel.referenceId;
      updateDocumentNonBlocking(doc(db, "appointments", apptId), {
        status: "cancelled",
        cancellationReason,
        cancelledBy: "lawyer",
        lawyerNotified: true,
        clientNotified: false,
        updatedAt: new Date().toISOString()
      });

      toast({ title: "Visit Cancelled", description: "Registry updated." });
      setIsCancelDialogOpen(false);
      setApptToCancel(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMarkStatus = (appt: any, status: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "appointments", appt.id), { status, updatedAt: new Date().toISOString() });
    toast({ title: "Status Set", description: `Record updated to ${status}.` });
  };

  const handleCompleteConsultation = async () => {
    if (!db || !activeConsultation || !consultationForm.outcome) return;
    setIsSubmitting(true);
    try {
      updateDocumentNonBlocking(doc(db, "appointments", activeConsultation.id), {
        status: consultationForm.outcome,
        assessment: consultationForm.assessment,
        outcome: consultationForm.outcome,
        denialReason: consultationForm.outcome === OUTCOME_OPTIONS[0] ? null : consultationForm.denialReason,
        completedAt: new Date().toISOString(),
        clientNotified: false
      });
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
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-12">
        <div className="lg:col-span-3 space-y-12">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
              <AvatarImage src={lawyerData?.photoUrl} className="object-cover" />
              <AvatarFallback className="bg-secondary/10 text-secondary font-black">{lawyerData?.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-black text-secondary font-headline">Atty. {lawyerData?.firstName} {lawyerData?.lastName}</h1>
              <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mt-1">Professional Workstation Registry</p>
            </div>
          </div>

          <div className="space-y-6">
            {activeConsultations.map(appt => (
              <Card key={appt.id} className="border-none shadow-xl rounded-[2.5rem] bg-white border-l-8 border-red-500 overflow-hidden">
                <CardContent className="p-8 flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-red-50 text-red-600 rounded-3xl"><User className="h-8 w-8" /></div>
                    <div>
                      <h3 className="text-xl font-black">{appt.guestName || appt.clientName}</h3>
                      <p className="text-[9px] font-black uppercase text-muted-foreground">REF: {appt.referenceCode}</p>
                    </div>
                  </div>
                  <Button onClick={() => setActiveConsultation(appt)} className="h-14 bg-secondary text-white font-black px-10 rounded-2xl shadow-xl hover:scale-105 transition-transform">Complete Intake <ArrowRight className="ml-2 h-5 w-5" /></Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-secondary text-white overflow-hidden group">
              <CardContent className="p-10 relative">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Briefcase className="h-20 w-20" /></div>
                <p className="text-[10px] font-black uppercase opacity-60">Active Cases</p>
                <p className="text-6xl font-black">{activeCases?.length || 0}</p>
              </CardContent>
            </Card>
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white border-2 border-secondary/5 overflow-hidden group">
              <CardContent className="p-10 relative">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform"><CalendarIcon className="h-20 w-20" /></div>
                <p className="text-[10px] font-black uppercase text-muted-foreground">Daily Load</p>
                <p className="text-6xl font-black text-secondary">{filteredSchedule.length}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden">
            <CardHeader className="bg-secondary/5 p-10"><CardTitle className="text-xl font-bold flex items-center gap-3"><CalendarIcon className="h-6 w-6" /> Office Workstation Schedule</CardTitle></CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                <div className="p-10 border-b border-secondary/5 bg-secondary/[0.02]">
                  <Calendar 
                    mode="single" 
                    selected={selectedDate} 
                    onSelect={(d) => d && setSelectedDate(d)} 
                    disabled={[
                      { dayOfWeek: [0, 5, 6] },
                      (date) => isHoliday(date)
                    ]}
                    modifiers={{
                      office: dutyModifiers.office,
                      field: dutyModifiers.field,
                      court: dutyModifiers.court,
                      jail: dutyModifiers.jail
                    }}
                    modifiersClassNames={{
                      office: "bg-blue-500 text-white font-black rounded-xl shadow-md",
                      field: "bg-emerald-500 text-white font-black rounded-xl shadow-md",
                      court: "bg-indigo-600 text-white font-black rounded-xl shadow-md",
                      jail: "bg-rose-600 text-white font-black rounded-xl shadow-md"
                    }}
                    className="mx-auto" 
                  />
                  <div className="mt-8 flex flex-wrap justify-center gap-4 border-t border-secondary/5 pt-6">
                    <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-blue-500" /><span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Office Work</span></div>
                    <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-indigo-600" /><span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Court Work</span></div>
                    <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-rose-600" /><span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Jail Visits</span></div>
                    <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-emerald-500" /><span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Field Work</span></div>
                  </div>
                </div>
                <div className="p-0 flex flex-col min-h-[300px]">
                  {filteredSchedule.length > 0 ? (
                    <div className="divide-y divide-secondary/5">
                      {filteredSchedule.map((item, idx) => (
                        <div key={idx} className="p-10 flex items-center justify-between group hover:bg-secondary/[0.02] transition-colors">
                          <div className="flex items-center gap-8">
                            <div className="h-16 w-16 bg-secondary/5 rounded-2xl flex flex-col items-center justify-center font-black text-secondary">
                              <span className="text-[9px] uppercase">{item.data.date ? format(new Date(item.data.date), "MMM") : "---"}</span>
                              <span className="text-2xl">{item.data.date ? format(new Date(item.data.date), "dd") : "--"}</span>
                            </div>
                            <div>
                              <h4 className="text-xl font-black">{item.type === 'appt' ? (item.data.guestName || item.data.clientName) : item.data.title}</h4>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.time} • {item.type === 'appt' ? 'Office Visit' : item.data.location}</p>
                            </div>
                          </div>
                          {item.type === 'appt' && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-10 w-10"><MoreVertical className="h-5 w-5" /></Button></DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-xl w-56 p-2">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-secondary/40 px-2 pb-2 border-b mb-2">Registry Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => setActiveConsultation(item.data)} className="font-bold rounded-xl">Start Assessment</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleMarkStatus(item.data, 'No Show')} className="text-red-600 font-bold rounded-xl">Record No Show</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center py-24 px-10 text-center space-y-4">
                      <Inbox className="h-12 w-12 text-secondary/10" />
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground/40">No entries for this date</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-24">
            <CardHeader className="bg-secondary p-8 text-white"><CardTitle className="text-xl font-black flex items-center gap-2"><Bell className="h-5 w-5" /> Workstation Alerts</CardTitle></CardHeader>
            <CardContent className="p-0 overflow-y-auto divide-y divide-secondary/5">
              {workstationAlerts && workstationAlerts.length > 0 ? workstationAlerts.map(alert => (
                <div key={alert.id} className="p-6 bg-amber-50/30 relative group">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />
                  <p className="text-xs font-bold text-secondary">{alert.description}</p>
                  <div className="mt-4 flex flex-col gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleAcknowledgeAlert(alert)} className="h-8 rounded-xl font-black text-[9px] uppercase bg-emerald-100 text-emerald-700">Acknowledge</Button>
                    {alert.type === 'appointment' && <Button size="sm" variant="ghost" onClick={() => { setApptToCancel(alert); setIsCancelDialogOpen(true); }} className="h-8 rounded-xl font-black text-[9px] uppercase bg-rose-100 text-rose-700">Cancel Visit</Button>}
                  </div>
                </div>
              )) : <div className="py-20 text-center text-muted-foreground font-black uppercase text-[10px] opacity-40">No unread alerts</div>}
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={!!activeConsultation} onOpenChange={() => setActiveConsultation(null)}>
        <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className="p-8 bg-secondary text-white shrink-0">
            <DialogTitle className="text-2xl font-black">Intake Assessment: {activeConsultation?.guestName || activeConsultation?.clientName}</DialogTitle>
            <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest mt-1">Registry Reference: {activeConsultation?.referenceCode}</DialogDescription>
          </DialogHeader>
          <div className="p-10 space-y-8 flex-1 overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Statutory Category</Label>
                <Select value={consultationForm.caseType} onValueChange={v => setConsultationForm({...consultationForm, caseType: v})}>
                  <SelectTrigger className="h-12 rounded-xl border-secondary/10 bg-white font-bold"><SelectValue placeholder="Category" /></SelectTrigger>
                  <SelectContent>{Object.keys(caseCategories).map(cat => <SelectItem key={cat} value={cat} className="font-bold">{cat}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Registry Outcome</Label>
                <Select value={consultationForm.outcome} onValueChange={v => setConsultationForm({...consultationForm, outcome: v})}>
                  <SelectTrigger className="h-12 rounded-xl border-secondary/10 bg-white font-bold"><SelectValue placeholder="Outcome" /></SelectTrigger>
                  <SelectContent>{OUTCOME_OPTIONS.map(opt => <SelectItem key={opt} value={opt} className="font-bold">{opt}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Findings & Assessment</Label>
              <Textarea 
                value={consultationForm.assessment} 
                onChange={e => setConsultationForm({...consultationForm, assessment: e.target.value})} 
                className="rounded-2xl min-h-[120px] focus-visible:ring-secondary/20 bg-white" 
                placeholder="Official evaluation for office records..."
              />
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/30 shrink-0 flex gap-3">
            <Button variant="outline" onClick={() => setActiveConsultation(null)} className="h-14 px-8 rounded-2xl font-bold border-2">Cancel</Button>
            <Button onClick={handleCompleteConsultation} disabled={isSubmitting || !consultationForm.outcome} className="h-14 bg-secondary text-white font-black px-10 rounded-2xl shadow-xl flex-1">Finalize Record</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent className="rounded-[3rem] max-w-md p-0 overflow-hidden border-none shadow-2xl">
          <DialogHeader className="p-8 bg-rose-600 text-white">
            <DialogTitle className="text-2xl font-black">Cancel Visit</DialogTitle>
            <DialogDescription className="text-white/60 font-bold uppercase text-[10px] mt-1">Reference: {apptToCancel?.referenceCode}</DialogDescription>
          </DialogHeader>
          <div className="p-10 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-rose-600/60 ml-1">Reason for Cancellation</Label>
              <Input 
                value={cancellationReason} 
                onChange={e => setCancellationReason(e.target.value)} 
                placeholder="Official reason for registry..." 
                className="h-12 rounded-xl border-rose-100" 
              />
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/30 gap-3">
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)} className="flex-1 h-12 rounded-xl font-bold">Close</Button>
            <Button onClick={handleCancelAppointment} disabled={!cancellationReason || isSubmitting} className="flex-1 bg-rose-600 text-white font-black h-12 rounded-xl shadow-lg">Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
