
"use client";

import { useState, useMemo, use } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useDoc, useCollection, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { doc, collection, query, where, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  History
} from "lucide-react";
import { useRouter } from "next/navigation";
import { format, startOfToday, isBefore, isWeekend, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const { data: lawyer } = useDoc(lawyerRef);
  const { data: appts } = useCollection(apptsQuery);
  const { data: duties } = useCollection(dutiesQuery);
  const { data: activeCases } = useCollection(casesQuery);

  const selectedDayItems = useMemo(() => {
    if (!selectedDate) return [];
    const ds = format(selectedDate, "yyyy-MM-dd");
    
    const dayAppts = appts?.filter(a => a.dateString === ds && a.status !== 'cancelled') || [];
    const dayDuties = duties?.filter(d => d.date.startsWith(ds)) || [];

    return [
      ...dayAppts.map(a => ({ type: 'appt', data: a, time: a.time })),
      ...dayDuties.map(d => ({ type: 'duty', data: d, time: d.startTime }))
    ].sort((a, b) => a.time.localeCompare(b.time));
  }, [selectedDate, appts, duties]);

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

    const dateStr = format(selectedDate, "yyyy-MM-dd");

    if (hasConflict(dateStr, dutyForm.startTime, dutyForm.endTime)) {
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

    // --- NOTIFICATION ---
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

  if (!lawyer) return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 pb-20">
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
                  onSelect={setSelectedDate} 
                  disabled={{ before: startOfToday() }}
                  className="mx-auto" 
                />
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
            <Card className="border-none shadow-xl rounded-[3rem] bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 p-8 border-b border-primary/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary text-white rounded-xl"><Clock className="h-5 w-5" /></div>
                    <div>
                      <CardTitle className="text-xl font-bold text-primary">Daily Workflow Breakdown</CardTitle>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{selectedDate ? format(selectedDate, "PPPP") : ""}</p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {selectedDayItems.length > 0 ? (
                  <div className="divide-y divide-primary/5">
                    {selectedDayItems.map((item, idx) => (
                      <div key={idx} className="p-8 flex items-center justify-between hover:bg-muted/10 transition-colors group">
                        <div className="flex items-center gap-8">
                          <div className="w-24 text-right">
                            <p className="text-lg font-black text-primary">{item.time}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">Scheduled</p>
                          </div>
                          <div className="h-12 w-1 bg-primary/10 rounded-full group-hover:bg-primary transition-colors" />
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h4 className="text-lg font-black text-primary">
                                {item.type === 'appt' ? item.data.caseType : item.data.title}
                              </h4>
                              <Badge variant="outline" className={cn(
                                "text-[9px] font-black uppercase px-2 py-0.5",
                                item.type === 'appt' ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-blue-50 text-blue-700 border-blue-200"
                              )}>
                                {item.type === 'appt' ? "Client Visit" : item.data.category}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold text-muted-foreground">
                              <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {item.type === 'appt' ? "PAO Main Office" : item.data.location}</span>
                              <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Ref: {item.type === 'appt' ? item.data.referenceCode : item.data.id.slice(0, 8)}</span>
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-primary/5 text-primary border-none font-black text-[10px] px-4 py-1 rounded-full uppercase">Active</Badge>
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
