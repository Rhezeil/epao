
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useDoc, setDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc, getDoc } from "firebase/firestore";
import { format, startOfToday, isWeekend, isBefore, eachDayOfInterval, addDays, setHours, setMinutes } from "date-fns";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  Briefcase, 
  User, 
  ChevronRight, 
  Loader2,
  CalendarDays, 
  Check,
  Plus,
  Trash2,
  AlertCircle,
  FileText,
  Info,
  CalendarCheck,
  Gavel,
  Edit3,
  ShieldAlert,
  Bell,
  Inbox
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useState, useMemo, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";

const OFFICIAL_LEAVE_CATEGORIES = {
  "Personal Leave": [
    "Wellness Leave",
    "Special Leave Privileges (SLP)"
  ],
  "Work-Related Leave": [
    "Mandatory Continuing Professional Development (CPD)",
    "Official Business / Official Time",
    "Court Attendance (Official Witness)",
    "Occupational Disease / Work-Related Injury Leave",
    "Office Suspension (Emergency Situations)",
    "Inquest / Jail Visitation Duty Recovery Leave",
    "Conflict of Interest Documentation Leave",
    "Preparation of Mandatory Reports"
  ]
};

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
  
  // UI State
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  
  // Reschedule Logic
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [selectedApptToReschedule, setSelectedApptToReschedule] = useState<any>(null);
  const [rescheduleReason, setRescheduleReason] = useState({
    category: Object.keys(OFFICIAL_LEAVE_CATEGORIES)[0],
    reason: OFFICIAL_LEAVE_CATEGORIES[Object.keys(OFFICIAL_LEAVE_CATEGORIES)[0] as keyof typeof OFFICIAL_LEAVE_CATEGORIES][0]
  });

  // Cancellation Logic
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [selectedApptToCancel, setSelectedApptToCancel] = useState<any>(null);
  const [cancelReason, setCancelReason] = useState({
    category: Object.keys(OFFICIAL_LEAVE_CATEGORIES)[0],
    reason: OFFICIAL_LEAVE_CATEGORIES[Object.keys(OFFICIAL_LEAVE_CATEGORIES)[0] as keyof typeof OFFICIAL_LEAVE_CATEGORIES][0]
  });
  
  // Availability Form State
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });
  const [availForm, setAvailForm] = useState({
    type: "FullDayAvailable",
    startTime: "08:00",
    endTime: "17:00",
    reasonCategory: Object.keys(OFFICIAL_LEAVE_CATEGORIES)[0],
    specificReason: OFFICIAL_LEAVE_CATEGORIES[Object.keys(OFFICIAL_LEAVE_CATEGORIES)[0] as keyof typeof OFFICIAL_LEAVE_CATEGORIES][0]
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
    return query(
      collection(db, "appointments"), 
      where("lawyerId", "==", user.uid)
    );
  }, [db, user, role]);

  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(
      collection(db, "cases"), 
      where("lawyerId", "==", user.uid), 
      where("status", "==", "Active")
    );
  }, [db, user, role]);

  const availabilityQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return collection(db, "roleLawyer", user.uid, "availability");
  }, [db, user, role]);

  const { data: apptsData, isLoading: isApptsLoading } = useCollection(apptsQuery);
  const { data: activeCases } = useCollection(casesQuery);
  const { data: availabilityList } = useCollection(availabilityQuery);

  // Derived Data
  const filteredSchedule = useMemo(() => {
    if (!apptsData || !selectedDate) return [];
    const dateStr = format(selectedDate, "yyyy-MM-dd");
    return apptsData
      .filter(appt => appt.dateString === dateStr && appt.status !== 'deleted')
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [apptsData, selectedDate]);

  const notifications = useMemo(() => {
    if (!apptsData) return [];
    return apptsData.filter(a => 
      a.status === 'pending' || 
      (a.notified === false && (a.status === 'scheduled' || a.status === 'rescheduled'))
    ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [apptsData]);

  const selectedDayAvail = useMemo(() => {
    if (!availabilityList || !selectedDate) return null;
    const ds = format(selectedDate, "yyyy-MM-dd");
    return availabilityList.find(a => a.date === ds);
  }, [availabilityList, selectedDate]);

  const apptDates = useMemo(() => {
    if (!apptsData) return [];
    return apptsData.filter(a => a.status !== 'cancelled').map(a => new Date(a.date));
  }, [apptsData]);

  const leaveDates = useMemo(() => {
    if (!availabilityList) return [];
    return availabilityList
      .filter(a => a.availabilityType?.includes('Leave'))
      .map(a => new Date(a.date));
  }, [availabilityList]);

  // Reschedule Slot Logic
  const globalApptsQuery = useMemoFirebase(() => {
    const dStr = isRescheduleOpen ? (selectedApptToReschedule?.date ? format(new Date(selectedApptToReschedule.date), "yyyy-MM-dd") : null) : null;
    if (!db || !dStr) return null;
    return query(collection(db, "appointments"), where("dateString", "==", dStr));
  }, [db, isRescheduleOpen, selectedApptToReschedule]);
  const { data: globalAppts } = useCollection(globalApptsQuery);

  const timeSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    const activeDate = isRescheduleOpen && selectedApptToReschedule ? new Date(selectedApptToReschedule.date) : null;
    
    if (!activeDate) return [];

    for (let h = 8; h <= 16; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 12) continue;
        if (h === 16 && m > 30) continue;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        const timeString = `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
        const slotDate = setMinutes(setHours(new Date(activeDate), h), m);
        const isPast = isBefore(slotDate, now);
        const isBooked = globalAppts?.some(a => a.lawyerId === user?.uid && a.time === timeString && a.status !== 'cancelled' && a.id !== selectedApptToReschedule?.id);
        slots.push({ time: timeString, isBooked, isPast });
      }
    }
    return slots;
  }, [globalAppts, user, isRescheduleOpen, selectedApptToReschedule]);

  // Handlers
  const updateStatus = (apptId: string, status: string) => {
    if (!db) return;
    const ref = doc(db, "appointments", apptId);
    updateDocumentNonBlocking(ref, { 
      status, 
      notified: true,
      clientNotified: false,
      updatedAt: new Date().toISOString()
    });
    toast({ title: `Status Updated`, description: `Appointment marked as ${status}.` });
  };

  const acknowledgeAssignment = (apptId: string) => {
    if (!db) return;
    const ref = doc(db, "appointments", apptId);
    updateDocumentNonBlocking(ref, { notified: true });
    toast({ title: "Schedule Acknowledged", description: "The assignment has been confirmed." });
  };

  const handleCancelSubmit = () => {
    if (!db || !selectedApptToCancel) return;
    setIsSubmitting(true);
    
    const ref = doc(db, "appointments", selectedApptToCancel.id);
    updateDocumentNonBlocking(ref, { 
      status: "cancelled",
      cancellationReason: cancelReason.reason,
      cancellationCategory: cancelReason.category,
      notified: true,
      clientNotified: false,
      updatedAt: new Date().toISOString()
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsCancelOpen(false);
      setSelectedApptToCancel(null);
      toast({ title: "Appointment Cancelled", description: "Record updated." });
    }, 800);
  };

  const handleRescheduleSubmit = () => {
    if (!db || !selectedApptToReschedule || !selectedApptToReschedule.date || !selectedApptToReschedule.time) return;
    
    setIsSubmitting(true);
    const ref = doc(db, "appointments", selectedApptToReschedule.id);
    updateDocumentNonBlocking(ref, {
      date: new Date(selectedApptToReschedule.date).toISOString(),
      dateString: format(new Date(selectedApptToReschedule.date), "yyyy-MM-dd"),
      time: selectedApptToReschedule.time,
      status: "rescheduled",
      rescheduleReason: rescheduleReason.reason,
      rescheduleCategory: rescheduleReason.category,
      notified: true,
      clientNotified: false,
      updatedAt: new Date().toISOString()
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsRescheduleOpen(false);
      setSelectedApptToReschedule(null);
      toast({ title: "Appointment Rescheduled", description: "Schedule synchronized." });
    }, 800);
  };

  const handleSaveAvailability = () => {
    if (!db || !user || !dateRange?.from) {
      toast({ variant: "destructive", title: "Selection Required", description: "Please select a date." });
      return;
    };

    const start = dateRange.from;
    const end = dateRange.to || dateRange.from;
    
    try {
      const dates = eachDayOfInterval({ start, end });
      
      dates.forEach(d => {
        const dateStr = format(d, "yyyy-MM-dd");
        const availRef = doc(db, "roleLawyer", user.uid, "availability", dateStr);

        const data = {
          id: dateStr,
          lawyerId: user.uid,
          date: dateStr,
          availabilityType: availForm.type,
          startTime: availForm.type.includes('Partial') ? availForm.startTime : null,
          endTime: availForm.type.includes('Partial') ? availForm.endTime : null,
          reasonCategory: availForm.reasonCategory,
          specificReason: availForm.specificReason,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString()
        };

        setDocumentNonBlocking(availRef, data, { merge: true });
      });

      setIsAvailabilityOpen(false);
      toast({ title: "Schedule Updated", description: "Professional availability synchronized." });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Error", description: "Could not save availability." });
    }
  };

  const handleDeleteAvailability = () => {
    if (!db || !user || !selectedDayAvail) return;
    const availRef = doc(db, "roleLawyer", user.uid, "availability", selectedDayAvail.id);
    deleteDocumentNonBlocking(availRef);
    toast({ title: "Entry Removed", description: "Availability reset." });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!user || role !== 'lawyer') return null;

  const isLeave = lawyerData?.status === 'On Leave' || selectedDayAvail?.availabilityType?.includes('Leave');

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-8 pb-12">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
              <AvatarImage src={lawyerData?.photoUrl} className="object-cover" />
              <AvatarFallback className="bg-secondary/10 text-2xl font-black text-secondary">
                {lawyerData?.firstName?.[0] || user?.email?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-black text-secondary font-headline tracking-tight">
                Atty. {lawyerData?.firstName || lawyerData?.email?.split('@')[0]} {lawyerData?.lastName || ""}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">Public Attorney Workstation</p>
                <Badge variant="outline" className={cn(
                  "font-black text-[9px] uppercase px-2 py-0 border-secondary/20",
                  isLeave ? "text-red-600 bg-red-50 border-red-200" : "text-secondary bg-secondary/5"
                )}>
                  {selectedDayAvail ? selectedDayAvail.availabilityType : (lawyerData?.status || "Available")}
                </Badge>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => {
              setAvailForm({
                type: selectedDayAvail?.availabilityType || "FullDayAvailable",
                startTime: selectedDayAvail?.startTime || "08:00",
                endTime: selectedDayAvail?.endTime || "17:00",
                reasonCategory: selectedDayAvail?.reasonCategory || Object.keys(OFFICIAL_LEAVE_CATEGORIES)[0],
                specificReason: selectedDayAvail?.specificReason || OFFICIAL_LEAVE_CATEGORIES[Object.keys(OFFICIAL_LEAVE_CATEGORIES)[0] as keyof typeof OFFICIAL_LEAVE_CATEGORIES][0]
              });
              setDateRange({ from: selectedDate, to: selectedDate });
              setIsAvailabilityOpen(true);
            }}
            variant="outline"
            className="rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm border-2 border-secondary/20 text-secondary px-6 h-11"
          >
            <Plus className="mr-2 h-4 w-4" /> Manage Availability
          </Button>
        </div>

        {/* --- NOTIFICATIONS (AWAITING ACTION) --- */}
        {notifications.length > 0 && (
          <Card className="border-none shadow-xl bg-amber-50 rounded-[2.5rem] overflow-hidden animate-in fade-in slide-in-from-top-4">
            <CardHeader className="bg-amber-100/50 pb-4 border-b border-amber-200/50">
              <CardTitle className="text-sm font-black text-amber-900 flex items-center gap-2 uppercase tracking-widest">
                <Bell className="h-4 w-4" /> Awaiting Action ({notifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-amber-200/50">
              {notifications.map(n => (
                <div key={n.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-amber-100/30 transition-colors gap-6">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-amber-200/50">
                      <Inbox className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <p className="text-base font-black text-amber-950">{n.guestName || n.clientName || "Citizen Client"}</p>
                        {n.notified === false && (
                          <Badge className="bg-amber-600 text-white text-[8px] font-black uppercase px-2 py-0.5 border-none shadow-sm">New Assignment</Badge>
                        )}
                      </div>
                      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.1em] mt-1">
                        {format(new Date(n.date), "PPP")} @ {n.time} • {n.caseType}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {n.status === 'pending' ? (
                      <Button onClick={() => updateStatus(n.id, 'scheduled')} className="h-10 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-6 shadow-md">Confirm Intake</Button>
                    ) : (
                      <Button onClick={() => acknowledgeAssignment(n.id)} className="h-10 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-6 shadow-md">Acknowledge</Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-amber-200/50">
                          <MoreVertical className="h-4 w-4 text-amber-700" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2">
                        <DropdownMenuItem onClick={() => { setSelectedApptToReschedule(n); setIsRescheduleOpen(true); }} className="rounded-xl font-bold">Reschedule</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedApptToCancel(n); setIsCancelOpen(true); }} className="rounded-xl font-bold text-red-600">Cancel</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* --- METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-secondary text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Briefcase className="h-24 w-24" />
            </div>
            <CardContent className="p-8 space-y-1 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Caseload</p>
              <p className="text-5xl font-black">{activeCases?.length || 0}</p>
              <p className="text-xs font-bold opacity-80 pt-2 flex items-center gap-1 cursor-pointer hover:opacity-100" onClick={() => router.push('/dashboard/lawyer/cases')}>
                Manage Cases <ChevronRight className="h-3 w-3" />
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white text-secondary overflow-hidden border-2 border-secondary/5">
            <CardContent className="p-8 space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today's Consultations</p>
                  <p className="text-5xl font-black">
                    {apptsData?.filter(a => a.dateString === format(new Date(), "yyyy-MM-dd") && a.status !== 'cancelled').length || 0}
                  </p>
                </div>
                <div className="p-3 bg-secondary/5 rounded-2xl">
                  <Clock className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <p className="text-xs font-bold text-muted-foreground pt-2">Confirmed sessions for {format(new Date(), "MMM dd")}</p>
            </CardContent>
          </Card>
        </div>

        {/* --- WORKSTATION --- */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-secondary/5 pb-4 border-b border-secondary/10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary text-white rounded-xl">
                <CalendarIcon className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg font-bold text-secondary">Registry Schedule</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 xl:grid-cols-12">
              <div className="xl:col-span-4 p-8 border-r border-secondary/5 bg-secondary/[0.02]">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 ml-2 mb-4">Focus Date</p>
                <div className="bg-white rounded-[2rem] p-4 shadow-sm border border-secondary/5">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border-none mx-auto"
                    modifiers={{ 
                      hasAppt: apptDates,
                      isLeave: leaveDates 
                    }}
                    modifiersStyles={{ 
                      hasAppt: { fontWeight: 'black', textDecoration: 'underline', color: 'hsl(var(--primary))' },
                      isLeave: { border: '2px solid #EF4444', borderRadius: '12px', color: '#EF4444' }
                    }}
                  />
                </div>
              </div>

              <div className="xl:col-span-8 divide-y divide-secondary/5">
                <div className="p-6 bg-secondary/5 border-b border-secondary/10 flex justify-between items-center px-8">
                  <h3 className="text-sm font-black text-secondary flex items-center gap-2">
                    <Clock className="h-4 w-4" /> 
                    {selectedDate ? format(selectedDate, "PPPP") : "Registry View"}
                  </h3>
                </div>
                {isApptsLoading ? (
                  <div className="p-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-secondary/20" /></div>
                ) : (
                  <div className="max-h-[600px] overflow-y-auto">
                    {filteredSchedule.map((appt) => (
                      <div key={appt.id} className="p-8 flex flex-col hover:bg-secondary/5 transition-colors group">
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-6">
                            <div className="h-16 w-16 rounded-2xl bg-secondary/5 flex flex-col items-center justify-center border border-secondary/10 group-hover:bg-white transition-colors">
                              <span className="text-[10px] font-black text-secondary uppercase leading-none">{format(new Date(appt.date), "MMM")}</span>
                              <span className="text-2xl font-black text-secondary leading-none mt-1">{format(new Date(appt.date), "dd")}</span>
                            </div>
                            <div>
                              <h4 className="text-lg font-black text-secondary">{appt.guestName || appt.clientName || "Citizen Client"}</h4>
                              <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground mt-1">
                                <Badge variant="outline" className={cn(
                                  "text-[9px] font-black uppercase py-0 px-2",
                                  appt.status === 'cancelled' ? "bg-red-50 text-red-600 border-red-200" : "border-secondary/20 text-secondary"
                                )}>{appt.status}</Badge>
                                <span>•</span>
                                <span className="font-bold text-secondary/60">{appt.caseType}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="text-right hidden sm:block">
                              <p className="text-lg font-black text-secondary">{appt.time}</p>
                              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">Reserved Slot</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary/10">
                                  <MoreVertical className="h-5 w-5 text-secondary" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-secondary/40 px-2 pb-2">Status Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => updateStatus(appt.id, 'completed')} className="text-green-600 font-bold rounded-xl">
                                  <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setSelectedApptToReschedule(appt); setIsRescheduleOpen(true); }} className="font-bold rounded-xl text-primary">
                                  <Edit3 className="mr-2 h-4 w-4" /> Reschedule Visit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setSelectedApptToCancel(appt); setIsCancelOpen(true); }} className="text-red-600 font-bold rounded-xl">
                                  <XCircle className="mr-2 h-4 w-4" /> Mark as Cancelled
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="font-bold rounded-xl" onClick={() => router.push(`/dashboard/lawyer/cases`)}>
                                  <User className="mr-2 h-4 w-4" /> Go to Case File
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        {appt.status === 'cancelled' && appt.cancellationReason && (
                          <div className="mt-4 p-4 bg-red-50 rounded-[1.5rem] border border-red-100 flex items-start gap-4 mx-2">
                            <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-black uppercase text-red-900 tracking-widest">Office Documentation</p>
                              <p className="text-sm font-bold text-red-800 italic leading-relaxed">{appt.cancellationReason}</p>
                            </div>
                          </div>
                        )}
                        {appt.status === 'rescheduled' && appt.rescheduleReason && (
                          <div className="mt-4 p-4 bg-amber-50 rounded-[1.5rem] border border-amber-100 flex items-start gap-4 mx-2">
                            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-black uppercase text-amber-900 tracking-widest">Reschedule Justification</p>
                              <p className="text-sm font-bold text-amber-800 italic leading-relaxed">{appt.rescheduleReason}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {filteredSchedule.length === 0 && (
                      <div className="p-32 text-center space-y-4">
                        <Inbox className="h-20 w-20 text-secondary/10 mx-auto" />
                        <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Registry Clear</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- DIALOGS (Availability, Cancel, Reschedule) --- */}
        <Dialog open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl max-h-[95vh] flex flex-col">
            <DialogHeader className="p-8 bg-secondary text-white shrink-0 pr-12">
              <DialogTitle className="text-2xl font-black">Manage Professional Availability</DialogTitle>
              <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Select dates and status for office coordination</DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-8 flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest ml-2">1. Affected Dates</Label>
                  <div className="p-4 bg-secondary/5 rounded-[2rem] border border-secondary/10 shadow-inner">
                    <Calendar mode="range" selected={dateRange} onSelect={setDateRange} className="rounded-md border-none mx-auto" disabled={{ before: startOfToday() }} />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">2. Availability Type</Label>
                      <Select value={availForm.type} onValueChange={(v) => setAvailForm({...availForm, type: v})}>
                        <SelectTrigger className="h-12 rounded-xl border-secondary/10 bg-secondary/5 font-bold">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FullDayAvailable" className="font-bold">Full Day Available</SelectItem>
                          <SelectItem value="PartialDayAvailable" className="font-bold">Partial Day Available</SelectItem>
                          <SelectItem value="FullDayLeave" className="font-bold text-red-600">Full Day Leave</SelectItem>
                          <SelectItem value="PartialLeave" className="font-bold text-amber-600">Partial Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {availForm.type.includes('Partial') && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">Start Time</Label>
                          <Input type="time" value={availForm.startTime} onChange={e => setAvailForm({...availForm, startTime: e.target.value})} className="h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">End Time</Label>
                          <Input type="time" value={availForm.endTime} onChange={e => setAvailForm({...availForm, endTime: e.target.value})} className="h-12 rounded-xl" />
                        </div>
                      </div>
                    )}
                    <div className="space-y-2 pt-2 border-t border-secondary/5">
                      <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">3. Reason Category</Label>
                      <Select value={availForm.reasonCategory} onValueChange={(v) => setAvailForm({ ...availForm, reasonCategory: v, specificReason: OFFICIAL_LEAVE_CATEGORIES[v as keyof typeof OFFICIAL_LEAVE_CATEGORIES][0] })}>
                        <SelectTrigger className="h-12 rounded-xl border-secondary/10 bg-secondary/5 font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent>{Object.keys(OFFICIAL_LEAVE_CATEGORIES).map(cat => (<SelectItem key={cat} value={cat} className="font-bold">{cat}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">4. Specific Reason</Label>
                      <Select value={availForm.specificReason} onValueChange={(v) => setAvailForm({...availForm, specificReason: v})}>
                        <SelectTrigger className="h-12 rounded-xl border-secondary/10 bg-secondary/5 font-bold"><SelectValue /></SelectTrigger>
                        <SelectContent>{OFFICIAL_LEAVE_CATEGORIES[availForm.reasonCategory as keyof typeof OFFICIAL_LEAVE_CATEGORIES].map(reason => (<SelectItem key={reason} value={reason} className="font-bold">{reason}</SelectItem>))}</SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 flex-col sm:flex-row gap-3 shrink-0">
              {selectedDayAvail && <Button variant="ghost" onClick={handleDeleteAvailability} className="text-red-600 font-bold sm:mr-auto">Reset Date</Button>}
              <Button variant="outline" onClick={() => setIsAvailabilityOpen(false)} className="rounded-xl font-bold h-12">Cancel</Button>
              <Button onClick={handleSaveAvailability} disabled={!dateRange?.from} className="bg-secondary text-white font-black rounded-xl px-10 h-12 shadow-lg">Apply Schedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- CANCELLATION DIALOG --- */}
        <Dialog open={isCancelOpen} onOpenChange={setIsCancelOpen}>
          <DialogContent className="rounded-[3rem] max-w-lg p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
            <DialogHeader className="p-8 bg-red-600 text-white shrink-0 pr-12">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl"><XCircle className="h-8 w-8" /></div>
                <div className="min-w-0">
                  <DialogTitle className="text-2xl font-black truncate">Cancel Appointment</DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest truncate">Citizen: {selectedApptToCancel?.guestName || selectedApptToCancel?.clientName}</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="p-8 space-y-6 overflow-y-auto flex-1">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-red-900/40 tracking-widest ml-1">Duty Category</Label>
                  <Select value={cancelReason.category} onValueChange={(v) => setCancelReason({ ...cancelReason, category: v, reason: OFFICIAL_LEAVE_CATEGORIES[v as keyof typeof OFFICIAL_LEAVE_CATEGORIES][0] })}>
                    <SelectTrigger className="h-12 rounded-xl border-red-100 bg-red-50/50 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.keys(OFFICIAL_LEAVE_CATEGORIES).map(cat => (<SelectItem key={cat} value={cat} className="font-bold">{cat}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-red-900/40 tracking-widest ml-1">Specific Reason</Label>
                  <Select value={cancelReason.reason} onValueChange={(v) => setCancelReason({...cancelReason, reason: v})}>
                    <SelectTrigger className="h-12 rounded-xl border-red-100 bg-red-50/50 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>{OFFICIAL_LEAVE_CATEGORIES[cancelReason.category as keyof typeof OFFICIAL_LEAVE_CATEGORIES].map(reason => (<SelectItem key={reason} value={reason} className="font-bold">{reason}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 flex-col sm:flex-row gap-3 shrink-0">
              <Button variant="outline" onClick={() => { setIsCancelOpen(false); setSelectedApptToCancel(null); }} className="rounded-xl font-bold flex-1 h-12">Keep Booking</Button>
              <Button onClick={handleCancelSubmit} disabled={isSubmitting} className="bg-red-600 text-white font-black rounded-xl flex-1 h-12 shadow-lg">Confirm Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- RESCHEDULE DIALOG --- */}
        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl max-h-[95vh] flex flex-col">
            <DialogHeader className="p-8 bg-secondary text-white shrink-0 pr-12">
              <DialogTitle className="text-2xl font-black">Reschedule Appointment</DialogTitle>
              <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Modifying Visit for: {selectedApptToReschedule?.guestName || selectedApptToReschedule?.clientName}</DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-8 flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-2">1. Select New Date</Label>
                    <div className="p-4 bg-secondary/5 rounded-[2rem] border border-secondary/10 shadow-inner">
                      <Calendar mode="single" selected={selectedApptToReschedule?.date ? new Date(selectedApptToReschedule.date) : undefined} onSelect={(d) => d && setSelectedApptToReschedule({...selectedApptToReschedule, date: d.toISOString(), dateString: format(d, "yyyy-MM-dd"), time: ""})} className="rounded-md border-none mx-auto" disabled={[{ before: startOfToday() }, { dayOfWeek: [0, 6] }, (date) => isHoliday(date)]} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">2. Choose New Time</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-[250px] overflow-y-auto p-1 scrollbar-hide">
                      {timeSlots.map(slot => (
                        <Button key={slot.time} disabled={slot.isBooked || slot.isPast} variant={selectedApptToReschedule?.time === slot.time ? "default" : "outline"} className={cn("h-12 rounded-xl font-bold transition-all border-2", selectedApptToReschedule?.time === slot.time ? "bg-secondary text-white border-secondary shadow-md" : "bg-white text-secondary border-secondary/10")} onClick={() => setSelectedApptToReschedule({...selectedApptToReschedule, time: slot.time})}>
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 space-y-6">
                    <div className="flex items-center gap-2">
                      <ShieldAlert className="h-5 w-5 text-amber-600" />
                      <span className="text-[10px] font-black uppercase text-amber-900 tracking-widest">3. Reason for Reschedule</span>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-amber-900/40">Duty Category</Label>
                        <Select value={rescheduleReason.category} onValueChange={(v) => setRescheduleReason({ ...rescheduleReason, category: v, reason: OFFICIAL_LEAVE_CATEGORIES[v as keyof typeof OFFICIAL_LEAVE_CATEGORIES][0] })}>
                          <SelectTrigger className="h-12 rounded-xl border-amber-200 bg-white font-bold"><SelectValue /></SelectTrigger>
                          <SelectContent>{Object.keys(OFFICIAL_LEAVE_CATEGORIES).map(cat => (<SelectItem key={cat} value={cat} className="font-bold">{cat}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-amber-900/40">Specific Reason</Label>
                        <Select value={rescheduleReason.reason} onValueChange={(v) => setRescheduleReason({...rescheduleReason, reason: v})}>
                          <SelectTrigger className="h-12 rounded-xl border-amber-200 bg-white font-bold"><SelectValue /></SelectTrigger>
                          <SelectContent>{OFFICIAL_LEAVE_CATEGORIES[rescheduleReason.category as keyof typeof OFFICIAL_LEAVE_CATEGORIES].map(reason => (<SelectItem key={reason} value={reason} className="font-bold">{reason}</SelectItem>))}</SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 flex-col sm:flex-row gap-3 shrink-0">
              <Button variant="outline" onClick={() => { setIsRescheduleOpen(false); setSelectedApptToReschedule(null); }} className="rounded-xl font-bold h-12 px-8">Cancel</Button>
              <Button onClick={handleRescheduleSubmit} disabled={!selectedApptToReschedule?.time || isSubmitting} className="bg-secondary text-white font-black rounded-xl px-10 h-12 shadow-lg">Confirm Reschedule</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
