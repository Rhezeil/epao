
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
  Inbox,
  MapPin,
  Scale
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
    return query(collection(db, "appointments"), where("lawyerId", "==", user.uid));
  }, [db, user, role]);

  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "cases"), where("lawyerId", "==", user.uid), where("status", "==", "Active"));
  }, [db, user, role]);

  const availabilityQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return collection(db, "roleLawyer", user.uid, "availability");
  }, [db, user, role]);

  const dutiesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "lawyerDuties"), where("lawyerId", "==", user.uid));
  }, [db, user, role]);

  const { data: apptsData, isLoading: isApptsLoading } = useCollection(apptsQuery);
  const { data: activeCases } = useCollection(casesQuery);
  const { data: availabilityList } = useCollection(availabilityQuery);
  const { data: dutiesData } = useCollection(dutiesQuery);

  // Derived Data
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

  const notifications = useMemo(() => {
    if (!apptsData && !dutiesData) return [];
    
    const pendingAppts = apptsData?.filter(a => a.status === 'pending' || (a.notified === false && a.status === 'scheduled')) || [];
    const newDuties = dutiesData?.filter(d => d.notified === false) || [];

    return [
      ...pendingAppts.map(a => ({ id: a.id, type: 'appt', data: a, createdAt: a.createdAt })),
      ...newDuties.map(d => ({ id: d.id, type: 'duty', data: d, createdAt: d.createdAt }))
    ].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [apptsData, dutiesData]);

  const selectedDayAvail = useMemo(() => {
    if (!availabilityList || !selectedDate) return null;
    const ds = format(selectedDate, "yyyy-MM-dd");
    return availabilityList.find(a => a.date === ds);
  }, [availabilityList, selectedDate]);

  const apptDates = useMemo(() => {
    if (!apptsData) return [];
    return apptsData.filter(a => a.status !== 'cancelled').map(a => new Date(a.date));
  }, [apptsData]);

  const dutyDates = useMemo(() => {
    if (!dutiesData) return [];
    return dutiesData.map(d => new Date(d.date));
  }, [dutiesData]);

  const leaveDates = useMemo(() => {
    if (!availabilityList) return [];
    return availabilityList.filter(a => a.availabilityType?.includes('Leave')).map(a => new Date(a.date));
  }, [availabilityList]);

  // Handlers
  const updateStatus = (apptId: string, status: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "appointments", apptId), { 
      status, 
      notified: true,
      clientNotified: false,
      updatedAt: new Date().toISOString()
    });
    toast({ title: `Status Updated`, description: `Marked as ${status}.` });
  };

  const acknowledgeNotification = (id: string, type: 'appt' | 'duty') => {
    if (!db) return;
    const coll = type === 'appt' ? "appointments" : "lawyerDuties";
    updateDocumentNonBlocking(doc(db, coll, id), { notified: true });
    toast({ title: "Update Acknowledged", description: "Cleared from pending actions." });
  };

  const handleSaveAvailability = () => {
    if (!db || !user || !dateRange?.from) return;
    const dates = eachDayOfInterval({ start: dateRange.from, end: dateRange.to || dateRange.from });
    dates.forEach(d => {
      const ds = format(d, "yyyy-MM-dd");
      setDocumentNonBlocking(doc(db, "roleLawyer", user.uid, "availability", ds), {
        id: ds,
        lawyerId: user.uid,
        date: ds,
        availabilityType: availForm.type,
        startTime: availForm.type.includes('Partial') ? availForm.startTime : null,
        endTime: availForm.type.includes('Partial') ? availForm.endTime : null,
        reasonCategory: availForm.reasonCategory,
        specificReason: availForm.specificReason,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    });
    setIsAvailabilityOpen(false);
    toast({ title: "Schedule Updated", description: "Availability synchronized." });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>;
  if (!user || role !== 'lawyer') return null;

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-8 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
              <AvatarImage src={lawyerData?.photoUrl} className="object-cover" />
              <AvatarFallback className="bg-secondary/10 text-2xl font-black text-secondary">{lawyerData?.firstName?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-black text-secondary font-headline tracking-tight">Atty. {lawyerData?.firstName} {lawyerData?.lastName}</h1>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">Public Attorney Workstation</p>
                {selectedDayAvail && <Badge className="bg-secondary/10 text-secondary border-none text-[9px] uppercase font-black">{selectedDayAvail.availabilityType}</Badge>}
              </div>
            </div>
          </div>
          <Button onClick={() => setIsAvailabilityOpen(true)} variant="outline" className="rounded-full font-black text-[10px] uppercase tracking-widest border-2 border-secondary/20 text-secondary px-6 h-11">
            <Plus className="mr-2 h-4 w-4" /> Manage Availability
          </Button>
        </div>

        {/* --- NOTIFICATIONS --- */}
        {notifications.length > 0 && (
          <Card className="border-none shadow-xl bg-amber-50 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="bg-amber-100/50 pb-4 border-b border-amber-200/50">
              <CardTitle className="text-sm font-black text-amber-900 flex items-center gap-2 uppercase tracking-widest"><Bell className="h-4 w-4" /> Awaiting Action ({notifications.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-amber-200/50">
              {notifications.map(n => (
                <div key={n.id} className="p-6 flex items-center justify-between hover:bg-amber-100/30 transition-colors">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-white rounded-2xl shadow-sm border border-amber-200/50">{n.type === 'appt' ? <Inbox className="h-6 w-6 text-amber-600" /> : <Gavel className="h-6 w-6 text-amber-600" />}</div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-base font-black text-amber-950">{n.type === 'appt' ? (n.data.guestName || n.data.clientName) : n.data.title}</p>
                        <Badge className="bg-amber-600 text-white text-[8px] font-black uppercase px-2 py-0.5">{n.type === 'appt' ? "New Intake" : "New Duty"}</Badge>
                      </div>
                      <p className="text-[10px] font-bold text-amber-700 uppercase tracking-widest mt-1">{format(new Date(n.data.date), "PPP")} @ {n.data.time || n.data.startTime}</p>
                    </div>
                  </div>
                  <Button onClick={() => acknowledgeNotification(n.id, n.type)} className="h-10 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs px-6">Acknowledge</Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* --- METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-secondary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Briefcase className="h-24 w-24" /></div>
            <CardContent className="p-8">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Caseload</p>
              <p className="text-5xl font-black">{activeCases?.length || 0}</p>
              <p className="text-xs font-bold opacity-80 pt-2 flex items-center gap-1 cursor-pointer" onClick={() => router.push('/dashboard/lawyer/cases')}>Manage Cases <ChevronRight className="h-3 w-3" /></p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white text-secondary overflow-hidden border-2 border-secondary/5">
            <CardContent className="p-8 flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today's Sessions</p>
                <p className="text-5xl font-black">{filteredSchedule.length}</p>
                <p className="text-xs font-bold text-muted-foreground pt-2">Combined registry schedule</p>
              </div>
              <div className="p-3 bg-secondary/5 rounded-2xl"><Clock className="h-6 w-6 text-secondary" /></div>
            </CardContent>
          </Card>
        </div>

        {/* --- WORKSTATION --- */}
        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-secondary/5 pb-4 border-b border-secondary/10"><CardTitle className="text-lg font-bold text-secondary flex items-center gap-2"><CalendarIcon className="h-5 w-5" /> Combined Registry Schedule</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 xl:grid-cols-12">
              <div className="xl:col-span-4 p-8 border-r border-secondary/5 bg-secondary/[0.02]">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="mx-auto rounded-md" modifiers={{ hasAppt: apptDates, hasDuty: dutyDates, isLeave: leaveDates }} modifiersStyles={{ hasAppt: { border: '2px solid hsl(var(--primary))' }, hasDuty: { border: '2px solid hsl(var(--secondary))' }, isLeave: { backgroundColor: '#FEE2E2', color: '#EF4444' } }} />
              </div>
              <div className="xl:col-span-8 divide-y divide-secondary/5">
                {filteredSchedule.length > 0 ? (
                  filteredSchedule.map((item, idx) => (
                    <div key={idx} className="p-8 flex items-center justify-between hover:bg-secondary/5 transition-colors group">
                      <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-secondary/5 flex flex-col items-center justify-center border border-secondary/10 group-hover:bg-white transition-colors">
                          <span className="text-[10px] font-black text-secondary uppercase leading-none">{format(new Date(item.data.date), "MMM")}</span>
                          <span className="text-2xl font-black text-secondary leading-none mt-1">{format(new Date(item.data.date), "dd")}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-lg font-black text-secondary">{item.type === 'appt' ? (item.data.guestName || item.data.clientName) : item.data.title}</h4>
                            <Badge variant="outline" className={cn("text-[8px] font-black uppercase", item.type === 'appt' ? "border-amber-200 text-amber-700 bg-amber-50" : "border-blue-200 text-blue-700 bg-blue-50")}>{item.type === 'appt' ? "Consultation" : item.data.category}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">
                            <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.time}</span>
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {item.type === 'appt' ? "Office" : item.data.location}</span>
                          </div>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary/10"><MoreVertical className="h-5 w-5 text-secondary" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2">
                          <DropdownMenuItem onClick={() => updateStatus(item.data.id, 'completed')} className="text-green-600 font-bold rounded-xl"><CheckCircle2 className="mr-2 h-4 w-4" /> Mark Completed</DropdownMenuItem>
                          <DropdownMenuItem className="font-bold rounded-xl"><Edit3 className="mr-2 h-4 w-4" /> Reschedule</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))
                ) : (
                  <div className="py-32 text-center space-y-4">
                    <Inbox className="h-20 w-20 text-secondary/10 mx-auto" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Registry Clear</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- AVAILABILITY DIALOG --- */}
        <Dialog open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-secondary text-white">
              <DialogTitle className="text-2xl font-black">Manage Availability</DialogTitle>
              <DialogDescription className="text-white/60">Configure your professional schedule.</DialogDescription>
            </DialogHeader>
            <div className="p-10 grid lg:grid-cols-2 gap-12">
              <Calendar mode="range" selected={dateRange} onSelect={setDateRange} disabled={{ before: startOfToday() }} className="border rounded-2xl p-4 mx-auto" />
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-secondary/40">Status Type</Label>
                  <Select value={availForm.type} onValueChange={(v) => setAvailForm({...availForm, type: v})}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="FullDayAvailable" className="font-bold">Available</SelectItem><SelectItem value="FullDayLeave" className="font-bold text-red-600">On Leave</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-secondary/40">Leave Justification</Label>
                  <Select value={availForm.reasonCategory} onValueChange={(v) => setAvailForm({ ...availForm, reasonCategory: v, specificReason: OFFICIAL_LEAVE_CATEGORIES[v as keyof typeof OFFICIAL_LEAVE_CATEGORIES][0] })}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{Object.keys(OFFICIAL_LEAVE_CATEGORIES).map(cat => (<SelectItem key={cat} value={cat} className="font-bold">{cat}</SelectItem>))}</SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSaveAvailability} className="w-full h-14 bg-secondary text-white font-black rounded-2xl shadow-xl">Apply Schedule</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
