
"use client";

import { useState, useMemo, use, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useDoc, useCollection, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { doc, collection, query, where, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  ArrowLeft, 
  CalendarDays, 
  Clock, 
  MapPin, 
  Briefcase, 
  Gavel, 
  ShieldCheck, 
  Loader2, 
  Plus, 
  AlertCircle,
  FileText,
  User,
  History,
  Save,
  ShieldAlert
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format, startOfToday, isBefore, isWeekend, setHours, setMinutes, parseISO } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const HOLIDAYS = [
  "2024-01-01", "2024-04-09", "2024-05-01", "2024-06-12", "2024-08-26",
  "2024-11-01", "2024-11-30", "2024-12-25", "2024-12-30", 
  "2025-01-01", "2025-02-25", "2025-04-17", "2025-04-18", "2025-05-01"
];

const isHoliday = (date: Date) => {
  const ds = format(date, "yyyy-MM-dd");
  return HOLIDAYS.includes(ds);
};

const DUTY_CATEGORIES = [
  "Office Work",
  "Field Work",
  "Court Work",
  "Prison and Jail Visits"
];

const LOCATIONS = {
  "Office Work": "Public Attorney's Office",
  "Field Work": "On-Site Coordination",
  "Court Work": "Regional Trial Court",
  "Prison and Jail Visits": "Detention Facility"
};

const AVAILABILITY_TYPES = [
  { value: "Available", label: "Office Standard (08:00 - 17:00)" },
  { value: "FullDayLeave", label: "Official Leave (Full Day)" },
  { value: "PartialLeave", label: "Unavailable During Specific Hours" },
];

export default function LawyerScheduleWorkstation({ params }: { params: Promise<{ lawyerId: string }> }) {
  const { lawyerId } = use(params);
  const router = useRouter();
  const db = useFirestore();
  const { user, role } = useAuth();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAssignOpen, setIsAssignOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [dutyForm, setDutyForm] = useState({
    category: DUTY_CATEGORIES[0],
    title: "",
    description: "",
    startTime: "08:00",
    endTime: "10:00",
    location: LOCATIONS[DUTY_CATEGORIES[0] as keyof typeof LOCATIONS]
  });

  const [availForm, setAvailForm] = useState({
    availabilityType: "Available",
    startTime: "08:00",
    endTime: "17:00",
    notes: "",
    leaveReason: "Court Hearing / Litigation"
  });

  // Queries
  const lawyerRef = useMemoFirebase(() => db ? doc(db, "roleLawyer", lawyerId) : null, [db, lawyerId]);
  const apptsQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "appointments"), where("lawyerId", "==", lawyerId));
  }, [db, lawyerId]);
  const dutiesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "lawyerDuties"), where("lawyerId", "==", lawyerId));
  }, [db, lawyerId]);
  const casesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "cases"), where("lawyerId", "==", lawyerId), where("status", "==", "Active"));
  }, [db, lawyerId]);

  // Fetch all availability for highlighting red dates
  const allAvailQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, "roleLawyer", lawyerId, "availability");
  }, [db, lawyerId]);

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const availRef = useMemoFirebase(() => {
    if (!db || !dateStr) return null;
    return doc(db, "roleLawyer", lawyerId, "availability", dateStr);
  }, [db, lawyerId, dateStr]);

  const { data: lawyer } = useDoc(lawyerRef);
  const { data: appts } = useCollection(apptsQuery);
  const { data: duties } = useCollection(dutiesQuery);
  const { data: activeCases } = useCollection(casesQuery);
  const { data: availData, isLoading: isAvailLoading } = useDoc(availRef);
  const { data: allAvail } = useCollection(allAvailQuery);

  const leaveDates = useMemo(() => {
    if (!allAvail) return [];
    return allAvail
      .filter(a => a.availabilityType === 'FullDayLeave' || a.availabilityType === 'PartialLeave')
      .map(a => parseISO(a.date));
  }, [allAvail]);

  useEffect(() => {
    if (availData) {
      setAvailForm({
        availabilityType: availData.availabilityType || "Available",
        startTime: availData.startTime || "08:00",
        endTime: availData.endTime || "17:00",
        notes: availData.notes || "",
        leaveReason: availData.leaveReason || "Court Hearing / Litigation"
      });
    } else {
      setAvailForm({
        availabilityType: "Available",
        startTime: "08:00",
        endTime: "17:00",
        notes: "",
        leaveReason: "Court Hearing / Litigation"
      });
    }
  }, [availData]);

  const selectedDayItems = useMemo(() => {
    if (!selectedDate) return [];
    const ds = format(selectedDate, "yyyy-MM-dd");
    
    const dayAppts = appts?.filter(a => a.dateString === ds && a.status !== 'cancelled') || [];
    const dayDuties = duties?.filter(d => d.date.startsWith(ds)) || [];

    const items = [
      ...dayAppts.map(a => ({ type: 'appt', data: a, time: a.time })),
      ...dayDuties.map(d => ({ type: 'duty', data: d, time: d.startTime }))
    ].sort((a, b) => a.time.localeCompare(b.time));

    // Inject leave as a persistent entry at the top if active
    if (availData && availData.availabilityType !== 'Available') {
      items.unshift({
        type: 'leave',
        data: availData,
        time: availData.startTime || "00:00"
      } as any);
    }

    return items;
  }, [selectedDate, appts, duties, availData]);

  const hasConflict = (date: string, start: string, end: string) => {
    const startVal = parseInt(start.replace(':', ''));
    const endVal = parseInt(end.replace(':', ''));

    const conflictDuty = duties?.find(d => {
      if (!d.date.startsWith(date)) return false;
      const dStart = parseInt(d.startTime.replace(':', ''));
      const dEnd = parseInt(d.endTime.replace(':', ''));
      return (startVal < dEnd && endVal > dStart);
    });

    return !!conflictDuty;
  };

  const handleAssignDuty = async () => {
    if (!db || !user || !selectedDate) return;
    
    const startParts = dutyForm.startTime.split(':');
    const endParts = dutyForm.endTime.split(':');
    const startH = parseInt(startParts[0]);
    const startM = parseInt(startParts[1]);
    const endH = parseInt(endParts[0]);
    const endM = parseInt(endParts[1]);

    if (startH < 8 || (endH > 17 || (endH === 17 && endM > 0))) {
      toast({ variant: "destructive", title: "Outside Office Hours", description: "Statutory office hours are restricted to 8:00 AM - 5:00 PM." });
      return;
    }

    const now = new Date();
    const assignmentStart = setMinutes(setHours(new Date(selectedDate), startH), startM);
    if (isBefore(assignmentStart, now)) {
      toast({ variant: "destructive", title: "Invalid Timing", description: "Official assignments cannot be logged for past dates or times." });
      return;
    }

    const ds = format(selectedDate, "yyyy-MM-dd");

    if (hasConflict(ds, dutyForm.startTime, dutyForm.endTime)) {
      toast({ variant: "destructive", title: "Schedule Conflict", description: "This lawyer already has an assignment during this time slot." });
      return;
    }

    setIsSubmitting(true);
    const dutyId = crypto.randomUUID();
    const dutyRef = doc(db, "lawyerDuties", dutyId);

    const data = {
      id: dutyId,
      lawyerId,
      adminId: user.uid,
      category: dutyForm.category,
      title: dutyForm.title || dutyForm.category,
      description: dutyForm.description,
      date: selectedDate.toISOString(),
      startTime: dutyForm.startTime,
      endTime: dutyForm.endTime,
      location: dutyForm.location,
      status: "Scheduled",
      notified: false,
      createdAt: new Date().toISOString()
    };

    setDocumentNonBlocking(dutyRef, data, { merge: true });

    const notifId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", notifId), {
      id: notifId,
      type: "lawyer",
      userRole: "admin",
      description: `New duty assignment (${dutyForm.category}) created for Atty. ${lawyer?.lastName}.`,
      referenceId: dutyId,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsAssignOpen(false);
      setDutyForm({ ...dutyForm, title: "", description: "" });
      toast({ title: "Duty Assigned", description: "The schedule has been synchronized with the lawyer's dashboard." });
    }, 1000);
  };

  const handleUpdateAvailability = async () => {
    if (!db || !dateStr) return;
    setIsSubmitting(true);
    
    try {
      const data = {
        date: dateStr,
        ...availForm,
        adminId: user?.uid,
        updatedAt: new Date().toISOString()
      };
      setDocumentNonBlocking(availRef!, data, { merge: true });
      toast({ title: "Availability Updated", description: `Professional status for ${format(selectedDate!, "MMM dd")} synchronized.` });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!lawyer) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 pb-20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-xl"><ArrowLeft className="h-5 w-5" /></Button>
            <Avatar className="h-16 w-16 border-2 border-primary/10">
              <AvatarImage src={lawyer.photoUrl} className="object-cover" />
              <AvatarFallback className="font-black">{lawyer.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-black text-primary font-headline tracking-tight">
                Atty. {lawyer.firstName} {lawyer.lastName}
              </h1>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Master Schedule Registry</p>
            </div>
          </div>
          <Badge className={cn(
            "font-black text-[10px] px-4 py-2 rounded-full uppercase",
            lawyer.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          )}>{lawyer.status}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-primary text-white overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform"><Briefcase className="h-20 w-20" /></div>
              <CardContent className="p-8">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Caseload</p>
                <p className="text-5xl font-black">{activeCases?.length || 0}</p>
                <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                  <div className="flex justify-between items-center"><span className="text-[10px] font-bold opacity-60 uppercase">Appointments</span><span className="text-sm font-black">{appts?.length || 0}</span></div>
                  <div className="flex justify-between items-center"><span className="text-[10px] font-bold opacity-60 uppercase">External Duties</span><span className="text-sm font-black">{duties?.length || 0}</span></div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-muted/30 pb-4"><CardTitle className="text-xs font-black uppercase tracking-widest text-primary/40">Select Observation Date</CardTitle></CardHeader>
              <CardContent className="p-4">
                <Calendar 
                  mode="single" 
                  selected={selectedDate} 
                  onSelect={(date) => {
                    if (date && (isWeekend(date) || isHoliday(date) || isBefore(date, startOfToday()))) return;
                    setSelectedDate(date);
                  }} 
                  disabled={[
                    { before: startOfToday() },
                    { dayOfWeek: [0, 6] },
                    (date) => isHoliday(date)
                  ]}
                  modifiers={{ leave: leaveDates }}
                  modifiersClassNames={{
                    leave: "bg-red-500 text-white rounded-xl shadow-sm"
                  }}
                  className="mx-auto border rounded-xl p-2" 
                />
                <div className="mt-4 flex items-center gap-2 px-2">
                  <div className="h-2 w-2 rounded-full bg-red-500" />
                  <span className="text-[9px] font-black uppercase text-muted-foreground">Attorney Filed Leave</span>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={() => setIsAssignOpen(true)}
              className="w-full h-16 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-black text-lg shadow-xl"
            >
              <Plus className="mr-2 h-6 w-6" /> Assign New Duty
            </Button>
          </div>

          <div className="lg:col-span-3">
            <Tabs defaultValue="workflow" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/50 p-1.5 rounded-[2rem] border-2 border-primary/5 shadow-inner h-16 mb-8">
                <TabsTrigger value="workflow" className="rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                  Daily Workflow Breakdown
                </TabsTrigger>
                <TabsTrigger value="availability" className="rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                  Availability Override
                </TabsTrigger>
              </TabsList>

              <TabsContent value="workflow">
                <Card className="border-none shadow-xl rounded-[3rem] bg-white overflow-hidden">
                  <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary text-white rounded-xl"><Clock className="h-5 w-5" /></div>
                      <div>
                        <CardTitle className="text-xl font-bold text-primary">Daily Schedule</CardTitle>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{selectedDate ? format(selectedDate, "PPPP") : ""}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    {selectedDayItems.length > 0 ? (
                      <div className="divide-y divide-primary/5">
                        {selectedDayItems.map((item, idx) => (
                          <div key={idx} className={cn(
                            "p-8 flex items-center justify-between hover:bg-muted/10 transition-colors group",
                            item.type === 'leave' && "bg-amber-50/50"
                          )}>
                            <div className="flex items-center gap-8">
                              <div className="w-24 text-right">
                                <p className="text-lg font-black text-primary">{item.time}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.type === 'leave' ? 'Registry' : 'Scheduled'}</p>
                              </div>
                              <div className={cn(
                                "h-12 w-1 rounded-full transition-colors",
                                item.type === 'leave' ? "bg-amber-500" : "bg-primary/10 group-hover:bg-primary"
                              )} />
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <h4 className="text-lg font-black text-primary">
                                    {item.type === 'appt' ? (item.data.guestName || item.data.clientName) : 
                                     item.type === 'leave' ? `Filed Leave: ${item.data.leaveReason}` : item.data.title}
                                  </h4>
                                  <Badge variant="outline" className={cn(
                                    "text-[9px] font-black uppercase px-2 py-0.5",
                                    item.type === 'appt' ? "bg-amber-50 text-amber-700 border-amber-200" : 
                                    item.type === 'leave' ? "bg-red-50 text-red-700 border-red-200" : "bg-blue-50 text-blue-700 border-blue-200"
                                  )}>
                                    {item.type === 'appt' ? "Citizen Visit" : item.type === 'leave' ? "Unavailable" : item.data.category}
                                  </Badge>
                                </div>
                                <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                                  {item.type === 'leave' ? (
                                    <span className="flex items-center gap-1 italic"><ShieldAlert className="h-3 w-3" /> Note: {item.data.notes || "Official Registry Entry"}</span>
                                  ) : (
                                    <>
                                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {item.type === 'appt' ? "PAO Main Office" : item.data.location}</span>
                                      <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Ref: {item.type === 'appt' ? item.data.referenceCode : item.data.id.slice(0, 8)}</span>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Badge className={cn(
                              "border-none font-black text-[10px] px-4 py-1 rounded-full uppercase",
                              item.type === 'leave' ? "bg-red-100 text-red-700" : "bg-primary/5 text-primary"
                            )}>
                              {item.type === 'leave' ? "ON LEAVE" : "Scheduled"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="py-32 text-center space-y-4">
                        <History className="h-16 w-16 text-primary/10 mx-auto" />
                        <p className="text-muted-foreground font-medium italic">No assignments recorded for this date.</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="availability">
                <Card className="border-none shadow-xl rounded-[3rem] bg-white overflow-hidden">
                  <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                    <CardTitle className="text-xl font-bold text-primary">Professional Availability Override</CardTitle>
                    <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Admin Control Panel</p>
                  </CardHeader>
                  <CardContent className="p-10 space-y-8">
                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-primary/40 ml-1">Availability Type</Label>
                        <Select value={availForm.availabilityType} onValueChange={(v) => setAvailForm({...availForm, availabilityType: v})}>
                          <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>
                            {AVAILABILITY_TYPES.map(t => <SelectItem key={t.value} value={t.value} className="font-bold">{t.label}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      {(availForm.availabilityType === 'PartialLeave') && (
                        <div className="grid grid-cols-2 gap-4 animate-in fade-in">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Start Time</Label>
                            <Input type="time" value={availForm.startTime} onChange={e => setAvailForm({...availForm, startTime: e.target.value})} className="h-12 rounded-xl" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-[10px) font-black uppercase text-primary/40 ml-1">End Time</Label>
                            <Input type="time" value={availForm.endTime} onChange={e => setAvailForm({...availForm, endTime: e.target.value})} className="h-12 rounded-xl" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Administrative Notes</Label>
                      <Textarea value={availForm.notes} onChange={e => setAvailForm({...availForm, notes: e.target.value})} className="rounded-2xl h-24" placeholder="Reason for status override..." />
                    </div>
                    <Button onClick={handleUpdateAvailability} disabled={isSubmitting} className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl">
                      {isSubmitting ? <Loader2 className="animate-spin mr-2 h-5 w-5" /> : <Save className="mr-2 h-5 w-5" />}
                      Confirm Schedule Override
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* --- ASSIGN DUTY DIALOG --- */}
        <Dialog open={isAssignOpen} onOpenChange={setIsAssignOpen}>
          <DialogContent className="rounded-[3rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
            <DialogHeader className="p-8 bg-secondary text-white shrink-0">
              <DialogTitle className="text-3xl font-black">Official Assignment</DialogTitle>
              <DialogDescription className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Administrative Duty Allocation</DialogDescription>
            </DialogHeader>
            <div className="p-10 space-y-6 flex-1 overflow-y-auto">
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3 mb-2">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-800 font-bold leading-relaxed">
                  Reminder: Statutory office hours are 08:00 AM to 05:00 PM. Assignments must be chronological and within this window.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Duty Category</Label>
                  <Select value={dutyForm.category} onValueChange={(v) => setDutyForm({...dutyForm, category: v, location: LOCATIONS[v as keyof typeof LOCATIONS]})}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>{DUTY_CATEGORIES.map(c => <SelectItem key={c} value={c} className="font-bold">{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Duty Title</Label><Input value={dutyForm.title} onChange={e => setDutyForm({...dutyForm, title: e.target.value})} className="h-12 rounded-xl" placeholder="e.g. Jail Visit Unit A" /></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Start Time (Min 08:00)</Label>
                  <Input type="time" value={dutyForm.startTime} onChange={e => setDutyForm({...dutyForm, startTime: e.target.value})} className="h-12 rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">End Time (Max 17:00)</Label>
                  <Input type="time" value={dutyForm.endTime} onChange={e => setDutyForm({...dutyForm, endTime: e.target.value})} className="h-12 rounded-xl" />
                </div>
              </div>
              <div className="space-y-2"><Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Exact Location</Label><Input value={dutyForm.location} onChange={e => setDutyForm({...dutyForm, location: e.target.value})} className="h-12 rounded-xl" /></div>
              <div className="space-y-2"><Label className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1">Instructions / Audit Notes</Label><Textarea value={dutyForm.description} onChange={e => setDutyForm({...dutyForm, description: e.target.value})} className="rounded-2xl min-h-[100px]" placeholder="Specific instructions for the lawyer..." /></div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 gap-3 shrink-0">
              <Button variant="outline" onClick={() => setIsAssignOpen(false)} className="rounded-xl h-12 px-8 font-bold">Cancel</Button>
              <Button onClick={handleAssignDuty} disabled={isSubmitting} className="rounded-xl h-12 bg-secondary text-white font-black px-10 shadow-xl">
                {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
                Confirm Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
