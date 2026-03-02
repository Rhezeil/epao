
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
  Gavel
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

const REASONS = {
  "Work-Related Reasons for Leave": [
    "Mandatory Continuing Professional Development (CPD)",
    "Official Business/Official Time",
    "Legal/Official Matters",
    "Court Attendance",
    "Unexpected Office Suspension",
    "Inquest/Jail Visitation Duty Recovery",
    "Documenting/Filing Leave for Conflicts"
  ],
  "Personal Reasons for Leave": [
    "Illness or Medical Attention",
    "Family Emergencies",
    "Vacation/Rest"
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
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  
  // Availability Form State
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date()
  });
  const [availForm, setAvailForm] = useState({
    type: "FullDayAvailable",
    startTime: "08:00",
    endTime: "17:00",
    reasonCategory: "Work-Related Reasons for Leave",
    specificReason: REASONS["Work-Related Reasons for Leave"][0]
  });

  // Client Booking State
  const [bookingForm, setBookingForm] = useState({
    caseId: "",
    date: undefined as Date | undefined,
    time: "",
    purpose: "consultation"
  });
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);

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
    return collection(db, "users", user.uid, "availability");
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

  // Reschedule / Booking Slot Logic
  const bookingDateStr = bookingForm.date ? format(bookingForm.date, "yyyy-MM-dd") : null;
  const globalApptsQuery = useMemoFirebase(() => {
    if (!db || !bookingDateStr) return null;
    return query(collection(db, "appointments"), where("dateString", "==", bookingDateStr));
  }, [db, bookingDateStr]);
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
        const slotDate = bookingForm.date ? setMinutes(setHours(new Date(bookingForm.date), h), m) : null;
        const isPast = slotDate ? isBefore(slotDate, now) : false;
        const isBooked = globalAppts?.some(a => a.lawyerId === user?.uid && a.time === timeString && a.status !== 'cancelled');
        slots.push({ time: timeString, isBooked, isPast });
      }
    }
    return slots;
  }, [bookingForm.date, globalAppts, user]);

  // Handlers
  const updateStatus = (apptId: string, status: string) => {
    if (!db) return;
    const ref = doc(db, "appointments", apptId);
    updateDocumentNonBlocking(ref, { status });
    toast({ title: `Status Updated`, description: `Appointment marked as ${status}.` });
  };

  const handleSaveAvailability = () => {
    if (!db || !user || !dateRange?.from) {
      toast({ variant: "destructive", title: "Selection Required", description: "Please select at least one date on the calendar." });
      return;
    };

    const start = dateRange.from;
    const end = dateRange.to || dateRange.from;
    
    try {
      const dates = eachDayOfInterval({ start, end });
      
      dates.forEach(d => {
        const dateStr = format(d, "yyyy-MM-dd");
        const availRef = doc(db, "users", user.uid, "availability", dateStr);

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
      toast({ 
        title: "Schedule Synchronized", 
        description: dates.length > 1 
          ? `Status updated for ${dates.length} days.` 
          : `Availability saved for ${format(start, "MMM dd")}.` 
      });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Error", description: "Could not apply availability to selected range." });
    }
  };

  const handleScheduleBooking = async () => {
    if (!db || !user || !bookingForm.caseId || !bookingForm.date || !bookingForm.time) {
      toast({ variant: "destructive", title: "Missing Information", description: "Please complete all booking fields." });
      return;
    }

    setIsSubmittingBooking(true);
    try {
      const selectedCase = activeCases?.find(c => c.id === bookingForm.caseId);
      if (!selectedCase) throw new Error("Selected case not found.");

      const clientDoc = await getDoc(doc(db, "users", selectedCase.clientId));
      const clientData = clientDoc.exists() ? clientDoc.data() : null;

      const apptId = crypto.randomUUID();
      const refCode = `PAO-${Math.floor(100000 + Math.random() * 900000)}`;
      const apptRef = doc(db, "appointments", apptId);

      const data = {
        id: apptId,
        lawyerId: user.uid,
        clientId: selectedCase.clientId,
        referenceCode: refCode,
        caseId: selectedCase.id,
        caseType: selectedCase.caseType,
        purpose: bookingForm.purpose,
        clientName: clientData?.fullName || "Registered Client",
        clientMobile: clientData?.mobileNumber || "",
        clientEmail: clientData?.email || "",
        date: bookingForm.date.toISOString(),
        dateString: format(bookingForm.date, "yyyy-MM-dd"),
        time: bookingForm.time,
        status: "scheduled",
        type: "follow-up",
        bookedBy: "lawyer",
        createdAt: new Date().toISOString()
      };

      setDocumentNonBlocking(apptRef, data, { merge: true });
      
      toast({ title: "Appointment Scheduled", description: `Visit for ${data.clientName} confirmed. Ref: ${refCode}` });
      setIsBookingOpen(false);
      setBookingForm({ caseId: "", date: undefined, time: "", purpose: "consultation" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Booking Failed", description: e.message });
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  const handleDeleteAvailability = () => {
    if (!db || !user || !selectedDayAvail) return;
    const availRef = doc(db, "users", user.uid, "availability", selectedDayAvail.id);
    deleteDocumentNonBlocking(availRef);
    toast({ title: "Entry Removed", description: "Date returned to standard office availability." });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!user || role !== 'lawyer') {
    return null;
  }

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
          
          <div className="flex gap-3">
            <Button 
              onClick={() => setIsBookingOpen(true)}
              className="rounded-full font-black text-[10px] uppercase tracking-widest shadow-md bg-primary hover:bg-primary/90 px-6 h-11 text-white"
            >
              <CalendarCheck className="mr-2 h-4 w-4" /> Schedule Client Visit
            </Button>
            <Button 
              onClick={() => {
                if (selectedDayAvail) {
                  setAvailForm({
                    type: selectedDayAvail.availabilityType,
                    startTime: selectedDayAvail.startTime || "08:00",
                    endTime: selectedDayAvail.endTime || "17:00",
                    reasonCategory: selectedDayAvail.reasonCategory || "Work-Related Reasons for Leave",
                    specificReason: selectedDayAvail.specificReason || REASONS["Work-Related Reasons for Leave"][0]
                  });
                  setDateRange({ from: selectedDate, to: selectedDate });
                } else {
                  setAvailForm({
                    type: "FullDayAvailable",
                    startTime: "08:00",
                    endTime: "17:00",
                    reasonCategory: "Work-Related Reasons for Leave",
                    specificReason: REASONS["Work-Related Reasons for Leave"][0]
                  });
                  setDateRange({ from: selectedDate, to: selectedDate });
                }
                setIsAvailabilityOpen(true);
              }}
              variant="outline"
              className="rounded-full font-black text-[10px] uppercase tracking-widest shadow-sm border-2 border-secondary/20 text-secondary px-6 h-11"
            >
              <Plus className="mr-2 h-4 w-4" /> Manage Availability
            </Button>
          </div>
        </div>

        {/* --- METRICS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl rounded-[2rem] bg-secondary text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Briefcase className="h-24 w-24" />
            </div>
            <CardContent className="p-8 space-y-1 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Caseload</p>
              <p className="text-5xl font-black">{activeCases?.length || 0}</p>
              <p className="text-xs font-bold opacity-80 pt-2 flex items-center gap-1 cursor-pointer hover:opacity-100" onClick={() => router.push('/dashboard/lawyer/cases')}>
                Manage Registry <ChevronRight className="h-3 w-3" />
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-xl rounded-[2rem] bg-white text-secondary overflow-hidden border-2 border-secondary/5">
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
              <p className="text-xs font-bold text-muted-foreground pt-2">Scheduled Sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* --- SCHEDULE WORKSTATION --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-secondary/5 pb-4 border-b border-secondary/10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary text-white rounded-xl">
                  <CalendarIcon className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg font-bold text-secondary">Office Schedule</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 xl:grid-cols-12">
                <div className="xl:col-span-5 p-6 border-r border-secondary/5 bg-secondary/[0.02]">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary/40 ml-2">Navigate Calendar</p>
                    <div className="bg-white rounded-3xl p-2 shadow-sm border border-secondary/5">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border-none"
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
                    <div className="space-y-2 p-4 bg-white rounded-2xl border border-dashed border-secondary/20">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">Scheduled Consultation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-500" />
                        <span className="text-[9px] font-bold text-muted-foreground uppercase">On Leave / Absence</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-7 divide-y divide-secondary/5">
                  <div className="p-6 bg-secondary/5 border-b border-secondary/10 flex justify-between items-center">
                    <h3 className="text-sm font-black text-secondary flex items-center gap-2">
                      <Clock className="h-4 w-4" /> 
                      {selectedDate ? format(selectedDate, "PPPP") : "Daily Consultations"}
                    </h3>
                    {selectedDayAvail && (
                      <Badge className={cn(
                        "border-none font-black text-[9px] uppercase",
                        selectedDayAvail.availabilityType.includes('Leave') ? "bg-red-100 text-red-700" : "bg-secondary/10 text-secondary"
                      )}>
                        {selectedDayAvail.availabilityType}
                      </Badge>
                    )}
                  </div>
                  {isApptsLoading ? (
                    <div className="p-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-secondary/20" /></div>
                  ) : (
                    <div className="max-h-[500px] overflow-y-auto">
                      {filteredSchedule.map((appt) => (
                        <div key={appt.id} className="p-6 flex items-center justify-between hover:bg-secondary/5 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-secondary/5 flex flex-col items-center justify-center border border-secondary/10">
                              <span className="text-[10px] font-black text-secondary uppercase leading-none">{format(new Date(appt.date), "MMM")}</span>
                              <span className="text-xl font-black text-secondary leading-none mt-1">{format(new Date(appt.date), "dd")}</span>
                            </div>
                            <div>
                              <h4 className="font-bold text-secondary">{appt.guestName || appt.clientName || "Citizen Client"}</h4>
                              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                                <Badge variant="outline" className="text-[9px] font-black uppercase py-0 border-secondary/20 text-secondary">{appt.status}</Badge>
                                <span>•</span>
                                <span className="font-bold text-secondary">{appt.caseType}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                              <p className="text-sm font-black text-secondary">{appt.time}</p>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Reserved Slot</p>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary/5">
                                  <MoreVertical className="h-4 w-4 text-secondary" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2">
                                <DropdownMenuItem onClick={() => updateStatus(appt.id, 'completed')} className="text-green-600 font-bold rounded-xl cursor-pointer">
                                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Mark as Completed
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => updateStatus(appt.id, 'cancelled')} className="text-red-600 font-bold rounded-xl cursor-pointer">
                                  <XCircle className="mr-2 h-4 w-4 text-red-600" /> Mark as Cancelled
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="font-bold rounded-xl cursor-pointer" onClick={() => router.push(`/dashboard/lawyer/cases`)}>
                                  <User className="mr-2 h-4 w-4" /> Client Case File
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))}
                      {filteredSchedule.length === 0 && (
                        <div className="p-20 text-center space-y-4">
                          <CalendarDays className="h-16 w-16 text-secondary/10 mx-auto" />
                          <p className="text-sm font-bold text-muted-foreground">No consultations scheduled for this date.</p>
                          <Button variant="outline" size="sm" onClick={() => setSelectedDate(new Date())} className="rounded-xl font-bold">Return to Today</Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-secondary text-white overflow-hidden">
              <CardHeader className="bg-white/10 p-6 border-b border-white/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <User className="h-4 w-4" /> Active Clients ({activeCases?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {activeCases?.slice(0, 5).map((c) => (
                    <div key={c.id} className="p-4 bg-white/10 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/20 transition-all cursor-pointer" onClick={() => router.push('/dashboard/lawyer/cases')}>
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
                          <Gavel className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black leading-none mb-1 text-white">{c.caseType}</p>
                          <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">ID: {c.id}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-40" />
                    </div>
                  ))}
                  {(!activeCases || activeCases.length === 0) && (
                    <p className="text-center py-6 text-xs font-bold opacity-40 italic">Registry is currently empty.</p>
                  )}
                  <Button variant="link" className="w-full text-white font-black text-[10px] uppercase tracking-[0.2em] mt-2 hover:opacity-80 transition-opacity" onClick={() => router.push('/dashboard/lawyer/cases')}>
                    Full Caseload Registry
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- AVAILABILITY DIALOG --- */}
        <Dialog open={isAvailabilityOpen} onOpenChange={setIsAvailabilityOpen}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl max-h-[95vh] flex flex-col">
            <DialogHeader className="p-8 bg-secondary text-white shrink-0">
              <DialogTitle className="text-2xl font-black">Manage Professional Availability</DialogTitle>
              <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                Select dates and status for office coordination
              </DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-8 flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                {/* --- CALENDAR SELECTION --- */}
                <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest ml-2">1. Select Affected Dates</Label>
                  <div className="p-4 bg-secondary/5 rounded-3xl border border-secondary/10 shadow-inner">
                    <Calendar
                      mode="range"
                      selected={dateRange}
                      onSelect={setDateRange}
                      className="rounded-md border-none mx-auto"
                      disabled={{ before: startOfToday() }}
                    />
                  </div>
                  <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <Info className="h-4 w-4 text-amber-600" />
                    <p className="text-[10px] font-bold text-amber-800">Selected: {dateRange?.from ? format(dateRange.from, "MMM dd") : "..."} {dateRange?.to ? `to ${format(dateRange.to, "MMM dd")}` : ""}</p>
                  </div>
                </div>

                {/* --- STATUS & REASON --- */}
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
                      <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in-95">
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

                    <div className="space-y-4 pt-2 border-t border-secondary/5">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">3. Reason Category</Label>
                        <Select 
                          value={availForm.reasonCategory} 
                          onValueChange={(v) => setAvailForm({
                            ...availForm, 
                            reasonCategory: v, 
                            specificReason: REASONS[v as keyof typeof REASONS][0]
                          })}
                        >
                          <SelectTrigger className="h-12 rounded-xl border-secondary/10 bg-secondary/5 font-bold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Work-Related Reasons for Leave" className="font-bold">Work-Related Reasons for Leave</SelectItem>
                            <SelectItem value="Personal Reasons for Leave" className="font-bold">Personal Reasons for Leave</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 animate-in slide-in-from-top-2">
                        <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">4. Specific Reason</Label>
                        <Select 
                          value={availForm.specificReason} 
                          onValueChange={(v) => setAvailForm({...availForm, specificReason: v})}
                        >
                          <SelectTrigger className="h-auto py-3 rounded-xl border-secondary/10 bg-secondary/5 font-bold text-left">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {REASONS[availForm.reasonCategory as keyof typeof REASONS].map((reason) => (
                              <SelectItem key={reason} value={reason} className="font-bold text-xs">
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 gap-3 shrink-0">
              {selectedDayAvail && (
                <Button variant="ghost" onClick={handleDeleteAvailability} className="text-red-600 font-bold hover:bg-red-50">
                  <Trash2 className="mr-2 h-4 w-4" /> Reset Today
                </Button>
              )}
              <Button variant="outline" onClick={() => setIsAvailabilityOpen(false)} className="rounded-xl font-bold">Cancel</Button>
              <Button 
                onClick={handleSaveAvailability} 
                disabled={!dateRange?.from}
                className="bg-secondary text-white font-black rounded-xl px-10 shadow-lg hover:scale-105 transition-transform"
              >
                Apply Schedule Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- CLIENT BOOKING DIALOG --- */}
        <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl max-h-[95vh] flex flex-col">
            <DialogHeader className="p-8 bg-primary text-white shrink-0">
              <DialogTitle className="text-2xl font-black">Schedule Follow-up Visit</DialogTitle>
              <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                Directly book an appointment for an existing client
              </DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-8 flex-1 overflow-y-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">1. Select Handle Case</Label>
                    <Select value={bookingForm.caseId} onValueChange={(v) => setBookingForm({...bookingForm, caseId: v})}>
                      <SelectTrigger className="h-14 rounded-2xl border-primary/20 bg-primary/5 font-bold">
                        <SelectValue placeholder="Select one of your active cases" />
                      </SelectTrigger>
                      <SelectContent>
                        {activeCases?.map(c => (
                          <SelectItem key={c.id} value={c.id} className="font-bold">
                            {c.caseType} ({c.id})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">2. Service Type</Label>
                    <Select value={bookingForm.purpose} onValueChange={(v) => setBookingForm({...bookingForm, purpose: v})}>
                      <SelectTrigger className="h-14 rounded-2xl border-primary/20 bg-primary/5 font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="consultation" className="font-bold">Legal Consultation</SelectItem>
                        <SelectItem value="notarization" className="font-bold">Document Notarization</SelectItem>
                        <SelectItem value="document-preparation" className="font-bold">Document Preparation</SelectItem>
                        <SelectItem value="legal-advice" className="font-bold">Legal Advice</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">3. Select Date</Label>
                    <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10 shadow-inner">
                      <Calendar
                        mode="single"
                        selected={bookingForm.date}
                        onSelect={(d) => setBookingForm({...bookingForm, date: d, time: ""})}
                        className="rounded-md border-none mx-auto"
                        disabled={[
                          { before: startOfToday() },
                          { dayOfWeek: [0, 6] },
                          (date) => isHoliday(date)
                        ]}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">4. Select Time Slot</Label>
                    {!bookingForm.date ? (
                      <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground bg-primary/5 rounded-3xl border border-dashed">
                        <Clock className="h-10 w-10 mb-2 opacity-20" />
                        <p className="text-[10px] font-bold">Pick a date to see availability</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 max-h-[400px] overflow-y-auto p-1 scrollbar-hide">
                        {timeSlots.map(slot => (
                          <Button
                            key={slot.time}
                            disabled={slot.isBooked || slot.isPast}
                            variant={bookingForm.time === slot.time ? "default" : "outline"}
                            className={cn(
                              "h-12 rounded-xl font-bold transition-all border-2",
                              bookingForm.time === slot.time 
                                ? "bg-primary text-white border-primary shadow-md scale-105" 
                                : slot.isBooked || slot.isPast
                                ? "bg-red-50 text-red-300 border-red-100 opacity-50 cursor-not-allowed" 
                                : "bg-white text-primary border-primary/10 hover:bg-primary/5"
                            )}
                            onClick={() => setBookingForm({...bookingForm, time: slot.time})}
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
            <DialogFooter className="p-8 bg-muted/30 gap-3 shrink-0">
              <Button variant="outline" onClick={() => setIsBookingOpen(false)} className="rounded-xl font-bold">Cancel</Button>
              <Button 
                onClick={handleScheduleBooking} 
                disabled={!bookingForm.caseId || !bookingForm.date || !bookingForm.time || isSubmittingBooking}
                className="bg-primary text-white font-black rounded-xl px-10 shadow-lg hover:scale-105 transition-transform"
              >
                {isSubmittingBooking ? <Loader2 className="animate-spin h-5 w-5" /> : "Confirm Official Booking"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
