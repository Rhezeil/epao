
"use client";

import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase, useDoc, updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc, onSnapshot } from "firebase/firestore";
import { 
  Briefcase, 
  Calendar, 
  FileText, 
  User, 
  ChevronRight, 
  Gavel, 
  Clock, 
  Heart, 
  ShieldCheck, 
  Loader2,
  History,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Scale,
  MoreVertical,
  Edit3,
  Trash2,
  AlertCircle,
  ShieldAlert,
  Bell,
  Inbox,
  Info
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useMemo } from "react";
import { format, isBefore, startOfToday, isWeekend, setHours, setMinutes, parseISO, addHours, getDay } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";

const HOLIDAYS = [
  "2024-01-01", "2024-04-09", "2024-05-01", "2024-06-12", "2024-08-26",
  "2024-11-01", "2024-11-30", "2024-12-25", "2024-12-30", 
  "2025-01-01", "2025-02-25", "2025-04-17", "2025-04-18", "2025-05-01"
];

const isHoliday = (date: Date) => {
  const ds = format(date, "yyyy-MM-dd");
  return HOLIDAYS.includes(ds);
};

export default function ClientDashboard() {
  const { user, role, loading } = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const { toast } = useToast();
  
  const [assignedLawyer, setAssignedLawyer] = useState<any>(null);
  
  // Rescheduling States
  const [selectedApptToReschedule, setSelectedApptToReschedule] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>(undefined);
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [isRescheduling, setIsRescheduling] = useState(false);

  const today = startOfToday();
  const todayStr = format(today, "yyyy-MM-dd");

  // Queries
  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'client') return null;
    return query(collection(db, "cases"), where("clientId", "==", user.uid));
  }, [db, user, role]);

  const apptsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'client') return null;
    return query(collection(db, "appointments"), where("clientId", "==", user.uid));
  }, [db, user, role]);

  const profileRef = useMemoFirebase(() => {
    if (!db || !user || role !== 'client') return null;
    return doc(db, "users", user.uid, "profile", "profile");
  }, [db, user, role]);

  const { data: cases, isLoading: isCasesLoading } = useCollection(casesQuery);
  const { data: appts, isLoading: isApptsLoading } = useCollection(apptsQuery);
  const { data: profile } = useDoc(profileRef);

  const activeCase = cases?.[0];

  // Fetch Lawyer details in real-time
  useEffect(() => {
    let unsub = () => {};
    if (activeCase?.lawyerId && db && role === 'client') {
      const lawyerRef = doc(db, "roleLawyer", activeCase.lawyerId);
      unsub = onSnapshot(lawyerRef, (snap) => {
        if (snap.exists()) setAssignedLawyer(snap.data());
      });
    }
    return () => unsub();
  }, [activeCase, db, role]);

  // Lawyer Leave Collection for red highlights and reasons
  const lawyerAvailQuery = useMemoFirebase(() => {
    if (!db || !activeCase?.lawyerId) return null;
    return collection(db, "roleLawyer", activeCase.lawyerId, "availability");
  }, [db, activeCase?.lawyerId]);
  const { data: allLawyerAvail } = useCollection(lawyerAvailQuery);

  const leaveDates = useMemo(() => {
    if (!allLawyerAvail) return [];
    return allLawyerAvail
      .filter(a => a.availabilityType === 'FullDayLeave' || a.availabilityType === 'PartialLeave')
      .map(a => parseISO(a.date));
  }, [allLawail]);

  // Lawyer status for selected reschedule date
  const reschedDateStr = rescheduleDate ? format(rescheduleDate, "yyyy-MM-dd") : null;
  const selectedReschedDateAvail = useMemo(() => {
    if (!reschedDateStr || !allLawyerAvail) return null;
    return allLawyerAvail.find(a => a.date === reschedDateStr);
  }, [reschedDateStr, allLawyerAvail]);

  // Lawyer Leave logic for today
  const lawyerAvailToday = useMemo(() => {
    if (!allLawyerAvail) return null;
    return allLawyerAvail.find(a => a.date === todayStr);
  }, [allLawyerAvail, todayStr]);

  // Derived Appointment Views
  const upcomingAppts = useMemo(() => {
    if (!appts) return [];
    return appts
      .filter(a => a.status !== 'cancelled' && a.status !== 'completed' && !isBefore(new Date(a.date), today))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [appts, today]);

  const apptHistory = useMemo(() => {
    if (!appts) return [];
    return appts
      .filter(a => a.status === 'completed' || a.status === 'cancelled' || isBefore(new Date(a.date), today))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [appts, today]);

  // Office Notifications
  const officeNotifications = useMemo(() => {
    if (!appts) return [];
    const significantStatuses = [
      'rescheduled', 
      'cancelled', 
      'No Show', 
      'Completed Consultation – Accept Legal Assistance', 
      'Completed Consultation – Denial of Legal Assistance'
    ];
    return appts.filter(a => 
      (a.bookedBy === 'lawyer' || significantStatuses.includes(a.status || '')) && 
      a.clientNotified === false
    ).sort((a, b) => (b.updatedAt || b.createdAt).localeCompare(a.updatedAt || a.createdAt));
  }, [appts]);

  // Rescheduling Slot Logic
  const globalApptsQueryForSlot = useMemoFirebase(() => {
    if (!db || !reschedDateStr) return null;
    return query(collection(db, "appointments"), where("dateString", "==", reschedDateStr));
  }, [db, reschedDateStr]);
  const { data: globalAppts } = useCollection(globalApptsQueryForSlot);

  const timeSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    // Office Hours: 7 AM - 6 PM
    for (let h = 7; h <= 17; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 12) continue; // Lunch
        if (h === 17 && m > 30) continue; // Last slot 5:30 PM
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        const timeString = `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
        const slotDate = rescheduleDate ? setMinutes(setHours(new Date(rescheduleDate), h), m) : null;
        
        // 1 hour leeway for same-day
        const isPast = slotDate ? isBefore(slotDate, addHours(now, 1)) : false;
        
        const isLawyerBusy = globalAppts?.some(a => 
          a.lawyerId === activeCase?.lawyerId && 
          a.time === timeString && 
          a.status !== 'cancelled'
        );

        let isLawyerOnLeave = false;
        if (selectedReschedDateAvail) {
          if (selectedReschedDateAvail.availabilityType === 'FullDayLeave') isLawyerOnLeave = true;
          else if (selectedReschedDateAvail.availabilityType === 'PartialLeave') {
            const slotVal = h + m / 60;
            const start = parseInt((selectedReschedDateAvail.startTime || "08:00").split(':')[0]);
            const end = parseInt((selectedReschedDateAvail.endTime || "17:00").split(':')[0]);
            if (slotVal >= start && slotVal < end) isLawyerOnLeave = true;
          }
        }

        slots.push({ time: timeString, isBooked: isLawyerBusy || isLawyerOnLeave, isPast });
      }
    }
    return slots;
  }, [rescheduleDate, globalAppts, selectedReschedDateAvail, activeCase?.lawyerId]);

  const handleCancel = (apptId: string) => {
    if (!db) return;
    const appt = appts?.find(a => a.id === apptId);
    updateDocumentNonBlocking(doc(db, "appointments", apptId), { 
      status: "cancelled", 
      cancellationReason: "Cancelled by Client",
      updatedAt: new Date().toISOString()
    });

    const notifId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", notifId), {
      id: notifId,
      type: "appointment",
      userRole: "client",
      description: `Client ${profile?.firstName} cancelled visit ${appt?.referenceCode}.`,
      referenceId: apptId,
      referenceCode: appt?.referenceCode,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });

    toast({ title: "Appointment Cancelled", description: "The time slot has been released." });
  };

  const handleRescheduleSubmit = () => {
    if (!db || !selectedApptToReschedule || !rescheduleDate || !rescheduleTime) return;
    setIsRescheduling(true);
    
    updateDocumentNonBlocking(doc(db, "appointments", selectedApptToReschedule.id), {
      date: rescheduleDate.toISOString(),
      dateString: format(rescheduleDate, "yyyy-MM-dd"),
      time: rescheduleTime,
      status: "rescheduled",
      updatedAt: new Date().toISOString()
    });

    const notifId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", notifId), {
      id: notifId,
      type: "appointment",
      userRole: "client",
      description: `Client ${profile?.firstName} rescheduled visit ${selectedApptToReschedule.referenceCode} to ${format(rescheduleDate, "MMM dd")} @ ${rescheduleTime}.`,
      referenceId: selectedApptToReschedule.id,
      referenceCode: selectedApptToReschedule.referenceCode,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });

    setTimeout(() => {
      setIsRescheduling(false);
      setSelectedApptToReschedule(null);
      setRescheduleDate(undefined);
      setRescheduleTime("");
      toast({ title: "Schedule Updated", description: "Your appointment has been successfully rescheduled." });
    }, 800);
  };

  const acknowledgeNotification = (apptId: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "appointments", apptId), { 
      clientNotified: true,
      updatedAt: new Date().toISOString()
    });
    toast({ title: "Update Acknowledged", description: "The notification has been cleared." });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || role !== 'client') return null;

  const displayName = profile?.firstName || user?.email?.split('@')[0] || "User";

  return (
    <DashboardLayout role="client">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-primary font-headline tracking-tight">
                Welcome back, {displayName}.
              </h1>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-none px-4 py-2 rounded-full font-bold">REGISTERED</Badge>
        </div>

        {lawyerAvailToday && lawyerAvailToday.availabilityType !== 'Available' && (
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-indigo-50 border-l-8 border-indigo-500 animate-in slide-in-from-top-4 duration-500">
            <CardContent className="p-8 flex items-start gap-6">
              <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm shrink-0">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-primary">Atty. {assignedLawyer?.lastName} Professional Status</h3>
                <p className="text-sm font-bold text-muted-foreground leading-relaxed">
                  Your assigned attorney is currently **On Leave** today for: <span className="text-indigo-700 uppercase font-black">{lawyerAvailToday.leaveReason}</span>.
                </p>
                <div className="p-3 bg-white/50 rounded-xl border border-indigo-100 mt-2 flex items-start gap-2">
                  <Info className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <p className="text-xs italic text-indigo-900 font-medium">Standard PAO registry update for professional transparency.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {officeNotifications.length > 0 && (
          <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
            {officeNotifications.map(n => (
              <Card key={n.id} className={cn(
                "border-none shadow-xl rounded-[2.5rem] overflow-hidden",
                n.status === 'cancelled' || n.status === 'No Show' || n.status?.includes('Denial') ? "bg-red-50 border-l-8 border-red-500" : "bg-amber-50 border-l-8 border-amber-500"
              )}>
                <CardContent className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className={cn("p-3 rounded-2xl bg-white shadow-sm shrink-0", n.status === 'cancelled' || n.status === 'No Show' || n.status?.includes('Denial') ? "text-red-600" : "text-amber-600")}>
                      {n.status === 'cancelled' || n.status === 'No Show' ? <ShieldAlert className="h-6 w-6" /> : <Bell className="h-6 w-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-primary">Office Update: {n.status}</h3>
                      <div className="text-sm font-bold text-muted-foreground mt-1 space-y-2">
                        <p>
                          {n.status === 'No Show' 
                            ? "Citizen absence for the scheduled visit has been recorded." 
                            : n.status === 'cancelled'
                            ? `Appointment was cancelled by the office.`
                            : n.status?.includes('Accept') 
                            ? "Congratulations! Your legal aid application has been accepted." 
                            : n.status?.includes('Denial') 
                            ? "The office has completed its assessment and denied the request for legal aid." 
                            : "The office has modified the visit schedule:"}
                        </p>
                        {n.status === 'cancelled' && n.cancellationReason && (
                          <div className="p-3 bg-white/50 rounded-xl border border-red-100 mt-2">
                            <span className="text-[10px] uppercase font-black text-red-600 block mb-1">Reason provided by Atty.</span>
                            <p className="italic text-red-900">"{n.cancellationReason}"</p>
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex flex-wrap gap-3">
                        <Badge variant="outline" className="bg-white/50 border-primary/10 text-[10px] font-black uppercase px-3 py-1"><Calendar className="h-3 w-3 mr-1.5" /> {format(new Date(n.date), "PPP")}</Badge>
                        <Badge variant="outline" className="bg-white/50 border-primary/10 text-[10px] font-black uppercase px-3 py-1"><Clock className="h-3 w-3 mr-1.5" /> {n.time}</Badge>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => acknowledgeNotification(n.id)} className={cn("h-12 rounded-2xl font-black text-xs px-8 shadow-lg", n.status === 'cancelled' || n.status === 'No Show' || n.status?.includes('Denial') ? "bg-red-600 hover:bg-red-700 text-white" : "bg-amber-600 hover:bg-amber-700 text-white")}>Acknowledge</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3"><div className="p-2 bg-primary text-white rounded-xl"><Scale className="h-5 w-5" /></div><CardTitle className="text-xl font-bold text-primary">Case Details</CardTitle></div>
                  {activeCase && <Badge className="bg-green-100 text-green-800 font-black px-4 py-1.5 rounded-full uppercase text-[9px] tracking-widest">{activeCase.status}</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6 px-10 pb-10">
                {activeCase ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-1"><p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Case ID</p><p className="text-2xl font-black text-[#1A3B6B] tracking-tight">{activeCase.id}</p></div>
                      <div className="space-y-1"><p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Legal Matter Type</p><p className="text-xl font-black text-[#1A3B6B]">{activeCase.caseType}</p></div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-1 bg-muted/20 p-4 rounded-2xl border-2 border-dashed">
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">Case Summary</p>
                        <p className="text-xs text-muted-foreground font-medium italic">{activeCase.description || "No description provided."}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4"><FileText className="h-12 w-12 text-primary/10 mx-auto" /><p className="text-muted-foreground font-medium">No official Case record found.</p></div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="pb-4 pt-8 px-10"><CardTitle className="text-lg font-bold text-primary flex items-center gap-2"><Calendar className="h-5 w-5" /> Upcoming Appointments</CardTitle></CardHeader>
              <CardContent className="space-y-4 px-10 pb-10">
                {upcomingAppts.length > 0 ? (
                  upcomingAppts.map((appt) => (
                    <div key={appt.id} className="flex items-center justify-between p-5 bg-primary/5 rounded-3xl border border-primary/10">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-white flex flex-col items-center justify-center border shadow-sm">
                          <span className="text-[10px] font-black text-primary uppercase">{format(new Date(appt.date), "MMM")}</span>
                          <span className="text-xl font-black text-[#1A3B6B]">{format(new Date(appt.date), "dd")}</span>
                        </div>
                        <div>
                          <p className="text-base font-black text-[#1A3B6B]">{appt.caseType}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Ref: {appt.referenceCode} • {appt.time}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end"><DropdownMenuItem onClick={() => setSelectedApptToReschedule(appt)}>Reschedule</DropdownMenuItem><DropdownMenuItem onClick={() => handleCancel(appt.id)} className="text-red-600">Cancel</DropdownMenuItem></DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <p className="py-12 text-center text-muted-foreground italic">No upcoming sessions.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="border-none shadow-xl bg-[#F0F4F8] rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary p-6 text-white text-center"><CardTitle className="text-xs font-black uppercase tracking-widest">Assigned Legal Counsel</CardTitle></CardHeader>
              <CardContent className="p-8 text-center space-y-6">
                {assignedLawyer ? (
                  <>
                    <Avatar className="h-32 w-32 border-4 border-white shadow-xl mx-auto"><AvatarImage src={assignedLawyer.photoUrl} className="object-cover" /><AvatarFallback className="bg-primary/10 text-4xl font-black text-primary">{assignedLawyer.firstName?.[0]}</AvatarFallback></Avatar>
                    <div><p className="text-xl font-black text-[#1A3B6B]">Atty. {assignedLawyer.firstName} {assignedLawyer.lastName}</p><Badge className="bg-primary/10 text-primary border-none font-bold uppercase text-[9px] mt-1 px-3">Public Attorney</Badge></div>
                  </>
                ) : (
                  <p className="text-xs text-muted-foreground font-medium italic">Pending assignment.</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <Dialog open={!!selectedApptToReschedule} onOpenChange={() => setSelectedApptToReschedule(null)}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
            <DialogHeader className="p-8 bg-primary text-white shrink-0"><DialogTitle className="text-3xl font-black">Reschedule Visit</DialogTitle></DialogHeader>
            <div className="p-10 grid lg:grid-cols-2 gap-12 flex-1 overflow-y-auto min-h-0">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-primary/40">1. New Date</p>
                <div className="p-4 bg-primary/5 rounded-[2rem] border border-primary/10 overflow-hidden">
                  <CalendarComponent 
                    mode="single" 
                    selected={rescheduleDate} 
                    onSelect={(d) => { 
                      if (d && (getDay(d) === 0 || getDay(d) === 5 || getDay(d) === 6 || isHoliday(d) || isBefore(d, startOfToday()))) { 
                        return;
                      } 
                      setRescheduleDate(d); 
                      setRescheduleTime(""); 
                    }} 
                    disabled={[{ before: startOfToday() }, { dayOfWeek: [0, 5, 6] }, (d) => isHoliday(d)]} 
                    modifiers={{ leave: leaveDates }}
                    modifiersClassNames={{
                      leave: "bg-red-500 text-white rounded-xl shadow-md border-red-600"
                    }}
                    className="mx-auto" 
                  />
                </div>
                
                {selectedReschedDateAvail && selectedReschedDateAvail.availabilityType !== 'Available' && (
                  <div className="p-5 bg-red-50 rounded-[2rem] border border-red-100 flex items-start gap-4 animate-in slide-in-from-top-2">
                    <div className="p-2.5 bg-white rounded-xl shadow-sm text-red-600 shrink-0 mt-0.5">
                      <ShieldAlert className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-red-900 uppercase tracking-widest leading-none">Lawyer Status Alert</p>
                      <p className="text-sm font-bold text-red-800">Reason: {selectedReschedDateAvail.leaveReason}</p>
                      {selectedReschedDateAvail.notes && (
                        <p className="text-xs italic text-red-700/70 font-medium">"{selectedReschedDateAvail.notes}"</p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2 px-2 mt-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-[9px] font-black uppercase text-muted-foreground">Attorney Leave / Unavailable</span>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase text-primary/40">2. Select Time</p>
                {rescheduleDate ? (
                  <div className="grid grid-cols-2 gap-2 h-fit max-h-[300px] overflow-y-auto p-1 border border-primary/5 rounded-3xl bg-primary/[0.02] p-4">{timeSlots.map(slot => (<Button key={slot.time} disabled={slot.isBooked || slot.isPast} variant={rescheduleTime === slot.time ? "default" : "outline"} className={cn("h-11 rounded-xl font-bold", rescheduleTime === slot.time ? "bg-primary text-white" : "bg-white text-primary border-primary/10")} onClick={() => setRescheduleTime(slot.time)}>{slot.time}</Button>))}</div>
                ) : <div className="h-full flex items-center justify-center text-muted-foreground font-medium">Pick a date first</div>}
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 shrink-0"><Button variant="outline" onClick={() => setSelectedApptToReschedule(null)} className="rounded-xl h-14 px-8 font-bold">Cancel</Button><Button onClick={handleRescheduleSubmit} disabled={!rescheduleDate || !rescheduleTime || isRescheduling || (selectedReschedDateAvail?.availabilityType === 'FullDayLeave')} className="rounded-xl h-14 bg-primary text-white font-black px-12 shadow-xl">{isRescheduling ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : "Confirm Update"}</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
