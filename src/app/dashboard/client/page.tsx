
"use client";

import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase, useDoc, updateDocumentNonBlocking } from "@/firebase";
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
  ShieldAlert
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useMemo } from "react";
import { format, isBefore, startOfToday, isWeekend, setHours, setMinutes } from "date-fns";
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

  // Rescheduling Slot Logic
  const reschedDateStr = rescheduleDate ? format(rescheduleDate, "yyyy-MM-dd") : null;
  const lawyerAvailRef = useMemoFirebase(() => {
    if (!db || !activeCase?.lawyerId || !reschedDateStr) return null;
    return doc(db, "roleLawyer", activeCase.lawyerId, "availability", reschedDateStr);
  }, [db, activeCase?.lawyerId, reschedDateStr]);
  const { data: lawyerAvail } = useDoc(lawyerAvailRef);

  const globalApptsQuery = useMemoFirebase(() => {
    if (!db || !reschedDateStr) return null;
    return query(collection(db, "appointments"), where("dateString", "==", reschedDateStr));
  }, [db, reschedDateStr]);
  const { data: globalAppts } = useCollection(globalApptsQuery);

  const timeSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    for (let h = 8; h <= 16; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 12) continue;
        if (h === 16 && m > 30) continue;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        const timeString = `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
        const slotDate = rescheduleDate ? setMinutes(setHours(new Date(rescheduleDate), h), m) : null;
        const isPast = slotDate ? isBefore(slotDate, now) : false;
        
        // Lawyer specific check
        const isLawyerBusy = globalAppts?.some(a => 
          a.lawyerId === activeCase?.lawyerId && 
          a.time === timeString && 
          a.status !== 'cancelled'
        );

        let isLawyerOnLeave = false;
        if (lawyerAvail) {
          if (lawyerAvail.availabilityType === 'FullDayLeave') isLawyerOnLeave = true;
          else if (lawyerAvail.availabilityType.includes('Partial')) {
            const slotVal = h + m / 60;
            const start = parseInt((lawyerAvail.startTime || "08:00").split(':')[0]);
            const end = parseInt((lawyerAvail.endTime || "17:00").split(':')[0]);
            if (lawyerAvail.availabilityType === 'PartialLeave' && slotVal >= start && slotVal < end) isLawyerOnLeave = true;
            if (lawyerAvail.availabilityType === 'PartialDayAvailable' && (slotVal < start || slotVal >= end)) isLawyerOnLeave = true;
          }
        }

        slots.push({ time: timeString, isBooked: isLawyerBusy || isLawyerOnLeave, isPast });
      }
    }
    return slots;
  }, [rescheduleDate, globalAppts, lawyerAvail, activeCase?.lawyerId]);

  const handleCancel = (apptId: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "appointments", apptId), { status: "cancelled", cancellationReason: "Cancelled by Client" });
    toast({ title: "Appointment Cancelled", description: "The time slot has been released." });
  };

  const handleRescheduleSubmit = () => {
    if (!db || !selectedApptToReschedule || !rescheduleDate || !rescheduleTime) return;
    setIsRescheduling(true);
    
    updateDocumentNonBlocking(doc(db, "appointments", selectedApptToReschedule.id), {
      date: rescheduleDate.toISOString(),
      dateString: format(rescheduleDate, "yyyy-MM-dd"),
      time: rescheduleTime,
      status: "rescheduled"
    });

    setTimeout(() => {
      setIsRescheduling(false);
      setSelectedApptToReschedule(null);
      setRescheduleDate(undefined);
      setRescheduleTime("");
      toast({ title: "Schedule Updated", description: "Your appointment has been successfully rescheduled." });
    }, 800);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
              <p className="text-muted-foreground font-medium">Welcome back, {displayName}. Track your legal journey and upcoming visits.</p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-none px-4 py-2 rounded-full font-bold">
            REGISTERED
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* --- CASE STATUS CARD --- */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary text-white rounded-xl">
                      <Scale className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-bold text-primary">Case Details</CardTitle>
                  </div>
                  {activeCase && (
                    <Badge className={cn(
                      "border-none font-black px-4 py-1.5 rounded-full uppercase text-[9px] tracking-widest shadow-sm",
                      activeCase.status === 'Closed' ? 'bg-gray-100 text-gray-800' : 
                      activeCase.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    )}>
                      {activeCase.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6 px-10 pb-10">
                {isCasesLoading ? (
                  <div className="py-12 flex justify-center"><Clock className="animate-spin h-8 w-8 text-primary/20" /></div>
                ) : activeCase ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Case ID</p>
                        <p className="text-2xl font-black text-[#1A3B6B] tracking-tight">{activeCase.id}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Legal Matter Type</p>
                        <p className="text-xl font-black text-[#1A3B6B]">{activeCase.caseType}</p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Date Opened</p>
                          <p className="text-sm font-bold text-[#1A3B6B]">
                            {activeCase.createdAt ? format(new Date(activeCase.createdAt), "MMM dd, yyyy") : '---'}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Current Status</p>
                          <p className="text-sm font-bold text-[#1A3B6B]">
                            {activeCase.status}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1 bg-muted/20 p-4 rounded-2xl border-2 border-dashed">
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">Case Summary</p>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">{activeCase.description || "No description provided."}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <FileText className="h-12 w-12 text-primary/10 mx-auto" />
                    <p className="text-muted-foreground font-medium">No official Case record found.</p>
                    <p className="text-xs text-muted-foreground/60 italic">Your file will be initialized once the triage process is complete.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* --- UPCOMING APPOINTMENTS --- */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="pb-4 pt-8 px-10">
                <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                  <Calendar className="h-5 w-5" /> Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-10 pb-10">
                {upcomingAppts.length > 0 ? (
                  upcomingAppts.map((appt) => (
                    <div key={appt.id} className="flex flex-col p-5 bg-primary/5 rounded-3xl border border-primary/10 hover:bg-primary/10 transition-colors group">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-5">
                          <div className="h-14 w-14 rounded-2xl bg-white flex flex-col items-center justify-center shadow-sm border border-primary/5">
                            <span className="text-[10px] font-black text-primary leading-none uppercase">{format(new Date(appt.date), "MMM")}</span>
                            <span className="text-xl font-black text-[#1A3B6B] leading-none mt-1">{format(new Date(appt.date), "dd")}</span>
                          </div>
                          <div>
                            <p className="text-base font-black text-[#1A3B6B]">{appt.caseType}</p>
                            <div className="flex items-center gap-2">
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.1em]">Ref: {appt.referenceCode} • {appt.time}</p>
                              {assignedLawyer && (
                                <>
                                  <span className="text-[10px] text-muted-foreground/40">•</span>
                                  <p className="text-[10px] text-secondary font-black uppercase">with Atty. {assignedLawyer.lastName}</p>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase">{appt.status}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-xl w-48 p-2">
                              <DropdownMenuItem 
                                className="rounded-lg font-bold text-primary cursor-pointer"
                                onClick={() => setSelectedApptToReschedule(appt)}
                              >
                                <Edit3 className="mr-2 h-4 w-4" /> Reschedule Visit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="rounded-lg font-bold text-destructive cursor-pointer"
                                onClick={() => handleCancel(appt.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Cancel Booking
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      {appt.rescheduleReason && (
                        <div className="mt-4 p-3 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                          <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-black uppercase text-amber-900 tracking-widest">Lawyer Note (Rescheduled)</p>
                            <p className="text-xs font-bold text-amber-800 italic leading-relaxed">{appt.rescheduleReason}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center bg-muted/5 rounded-3xl border-2 border-dashed">
                    <CalendarCheck className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground font-medium italic">No upcoming follow-ups scheduled.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* --- APPOINTMENT HISTORY --- */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="pb-4 pt-8 px-10 border-t border-primary/5">
                <CardTitle className="text-lg font-bold text-muted-foreground flex items-center gap-2">
                  <History className="h-5 w-5" /> Visit History
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 px-10 pb-10">
                {apptHistory.length > 0 ? (
                  apptHistory.map((appt) => (
                    <div key={appt.id} className="flex flex-col p-4 bg-muted/10 rounded-2xl border border-transparent hover:bg-muted/20 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={cn(
                            "h-10 w-10 rounded-xl flex items-center justify-center",
                            appt.status === 'completed' ? 'bg-green-50 text-green-600' : 
                            appt.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-primary/5 text-primary'
                          )}>
                            {appt.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : 
                             appt.status === 'cancelled' ? <XCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-primary">{appt.caseType}</p>
                            <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">
                              {format(new Date(appt.date), "MMM dd, yyyy")} • {appt.time}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-[8px] font-black uppercase">{appt.status}</Badge>
                      </div>

                      {appt.status === 'cancelled' && appt.cancellationReason && (
                        <div className="mt-3 p-3 bg-red-50/50 rounded-xl border border-red-100/50 flex items-start gap-3">
                          <ShieldAlert className="h-3.5 w-3.5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[9px] font-black uppercase text-red-900 tracking-widest">Official Reason</p>
                            <p className="text-xs font-bold text-red-800 leading-relaxed italic">{appt.cancellationReason}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center py-8 text-xs text-muted-foreground font-medium italic">No past visit records found.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* --- ASSIGNED LAWYER CARD --- */}
            <Card className="border-none shadow-xl bg-[#F0F4F8] rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary p-6 text-white text-center">
                <CardTitle className="text-xs font-black uppercase tracking-widest">Assigned Legal Counsel</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {assignedLawyer ? (
                  <>
                    <div className="flex flex-col items-center gap-4">
                      <Avatar className="h-32 w-32 border-4 border-white shadow-xl">
                        <AvatarImage src={assignedLawyer.photoUrl} className="object-cover" />
                        <AvatarFallback className="bg-primary/10 text-4xl font-black text-primary">
                          {assignedLawyer.firstName?.[0] || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-center">
                        <p className="text-xl font-black text-[#1A3B6B]">
                          Atty. {assignedLawyer.firstName} {assignedLawyer.lastName}
                        </p>
                        <Badge className="bg-primary/10 text-primary border-none font-bold uppercase text-[9px] mt-1 px-3">Public Attorney</Badge>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10 space-y-4">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <User className="h-8 w-8 text-primary/20" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium italic leading-relaxed px-4">
                      An official lawyer will be assigned once your case is processed by the triage team.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- RESCHEDULE DIALOG --- */}
        <Dialog open={!!selectedApptToReschedule} onOpenChange={() => setSelectedApptToReschedule(null)}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-primary text-white">
              <DialogTitle className="text-3xl font-black">Reschedule Visit</DialogTitle>
              <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                Modifying Appointment Ref: {selectedApptToReschedule?.referenceCode}
              </DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase text-primary/40 tracking-[0.2em] ml-2">1. Choose New Date</p>
                  <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10 shadow-inner">
                    <CalendarComponent
                      mode="single"
                      selected={rescheduleDate}
                      onSelect={(d) => {
                        if (d && (isWeekend(d) || isHoliday(d) || isBefore(d, startOfToday()))) return;
                        setRescheduleDate(d);
                        setRescheduleTime("");
                      }}
                      disabled={[{ before: startOfToday() }, { dayOfWeek: [0, 6] }, (d) => isHoliday(d)]}
                      className="rounded-md border-none mx-auto"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-primary/40 tracking-[0.2em]">2. Select Available Slot</p>
                    {!rescheduleDate ? (
                      <div className="h-[300px] flex flex-col items-center justify-center bg-primary/5 rounded-3xl border-2 border-dashed border-primary/10 text-muted-foreground/40">
                        <Clock className="h-12 w-12 mb-2" />
                        <p className="text-xs font-black uppercase">Pick a Date First</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-[350px] overflow-y-auto p-1 scrollbar-hide">
                        {timeSlots.map(slot => (
                          <Button
                            key={slot.time}
                            disabled={slot.isBooked || slot.isPast}
                            variant={rescheduleTime === slot.time ? "default" : "outline"}
                            className={cn(
                              "h-12 rounded-xl font-bold transition-all border-2",
                              rescheduleTime === slot.time 
                                ? "bg-primary text-white border-primary shadow-md scale-105" 
                                : slot.isBooked || slot.isPast
                                ? "bg-red-50 text-red-300 border-red-100 opacity-50 cursor-not-allowed" 
                                : "bg-white text-primary border-primary/10 hover:bg-primary/5"
                            )}
                            onClick={() => setRescheduleTime(slot.time)}
                          >
                            {slot.time}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30">
              <Button variant="outline" onClick={() => setSelectedApptToReschedule(null)} className="rounded-xl h-14 px-8 font-bold">Cancel</Button>
              <Button 
                onClick={handleRescheduleSubmit} 
                disabled={!rescheduleDate || !rescheduleTime || isRescheduling}
                className="rounded-xl h-14 bg-primary text-white font-black px-12 shadow-xl"
              >
                {isRescheduling ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <CheckCircle2 className="mr-2 h-5 w-5" />}
                Confirm Reschedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
