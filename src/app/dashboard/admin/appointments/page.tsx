
"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking, updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc, where } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  History, 
  Filter, 
  Trash2, 
  Loader2, 
  User, 
  Briefcase,
  MoreVertical,
  CheckCircle2,
  XCircle,
  CalendarCheck,
  Clock,
  ArrowRight,
  AlertTriangle
} from "lucide-react";
import { format, isWeekend, startOfToday, isBefore, setHours, setMinutes } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";

const HOLIDAYS = [
  "2024-01-01", "2024-04-09", "2024-05-01", "2024-06-12", "2024-08-26",
  "2024-11-01", "2024-11-30", "2024-12-25", "2024-12-30", 
  "2025-01-01", "2025-02-25", "2025-04-17", "2025-04-18", "2025-05-01"
];

const isHoliday = (date: Date) => {
  const ds = format(date, "yyyy-MM-dd");
  return HOLIDAYS.includes(ds);
};

export default function AdminAppointmentsRegistry() {
  const db = useFirestore();
  const { role, user, loading } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Reschedule State
  const [selectedAppt, setSelectedAppt] = useState<any>(null);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [resDate, setResDate] = useState<Date | undefined>(undefined);
  const [resTime, setResTime] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const apptsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "appointments"), orderBy("createdAt", "desc"));
  }, [db, user, role]);

  const lawyersQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "roleLawyer"));
  }, [db, user, role]);

  const { data: appts, isLoading } = useCollection(apptsQuery);
  const { data: lawyers } = useCollection(lawyersQuery);

  // Time slots for rescheduling
  const resDateStr = resDate ? format(resDate, "yyyy-MM-dd") : null;
  const existingApptsQuery = useMemoFirebase(() => {
    if (!db || !resDateStr) return null;
    return query(collection(db, "appointments"), where("dateString", "==", resDateStr));
  }, [db, resDateStr]);
  const { data: dayAppts } = useCollection(existingApptsQuery);

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
        const slotDate = resDate ? setMinutes(setHours(new Date(resDate), h), m) : null;
        const isPast = slotDate ? isBefore(slotDate, now) : false;
        const isBooked = dayAppts?.some(a => a.time === timeString && a.status !== 'cancelled');
        slots.push({ time: timeString, isBooked, isPast });
      }
    }
    return slots;
  }, [resDate, dayAppts]);

  const filteredAppts = useMemo(() => {
    if (!appts) return [];
    return appts.filter(a => {
      const matchesSearch = 
        a.referenceCode?.toLowerCase().includes(search.toLowerCase()) ||
        a.guestName?.toLowerCase().includes(search.toLowerCase()) ||
        a.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        a.caseType?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [appts, search, statusFilter]);

  const handleUpdateStatus = (id: string, ref: string, status: string) => {
    if (!db) return;
    const appt = appts?.find(a => a.id === id);
    const clientName = appt?.guestName || appt?.clientName || "Citizen";
    
    updateDocumentNonBlocking(doc(db, "appointments", id), { status, updatedAt: new Date().toISOString() });
    
    // --- NOTIFICATION ---
    const notifId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", notifId), {
      id: notifId,
      type: "appointment",
      userRole: "admin",
      description: `Admin updated status of Visit ${ref} for ${clientName} to ${status}.`,
      referenceId: id,
      referenceCode: ref,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });

    toast({ title: "Status Synchronized", description: `${ref} is now marked as ${status}.` });
  };

  const handleRescheduleSubmit = () => {
    if (!db || !selectedAppt || !resDate || !resTime) return;
    setIsProcessing(true);
    const clientName = selectedAppt.guestName || selectedAppt.clientName || "Citizen";
    
    updateDocumentNonBlocking(doc(db, "appointments", selectedAppt.id), {
      date: resDate.toISOString(),
      dateString: format(resDate, "yyyy-MM-dd"),
      time: resTime,
      status: "rescheduled",
      updatedAt: new Date().toISOString()
    });

    const notifId = crypto.randomUUID();
    setDocumentNonBlocking(doc(db, "notifications", notifId), {
      id: notifId,
      type: "appointment",
      userRole: "admin",
      description: `Admin rescheduled Visit ${selectedAppt.referenceCode} for ${clientName} to ${format(resDate, "MMM dd")} @ ${resTime}.`,
      referenceId: selectedAppt.id,
      referenceCode: selectedAppt.referenceCode,
      status: "unread",
      createdAt: new Date().toISOString()
    }, { merge: true });

    setTimeout(() => {
      setIsProcessing(false);
      setIsRescheduleOpen(false);
      setSelectedAppt(null);
      toast({ title: "Reschedule Confirmed", description: "The new visit time has been logged." });
    }, 800);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || role !== 'admin') return null;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 pb-20">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
            <History className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Visit & Intake Registry</h1>
            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">Terminal Schedule Management & Activity Logs</p>
          </div>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                <Input 
                  placeholder="Search Ref, Applicant or Classification..." 
                  className="h-12 pl-12 rounded-2xl border-primary/10 bg-white"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 w-full md:w-[200px] rounded-2xl border-primary/10 bg-white font-bold">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-bold">All Records</SelectItem>
                  <SelectItem value="For Screening" className="font-bold text-amber-600">For Screening</SelectItem>
                  <SelectItem value="Eligible" className="font-bold text-green-600">Eligible</SelectItem>
                  <SelectItem value="scheduled" className="font-bold text-blue-600">Scheduled</SelectItem>
                  <SelectItem value="rescheduled" className="font-bold text-indigo-600">Rescheduled</SelectItem>
                  <SelectItem value="cancelled" className="font-bold text-red-600">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-primary/40">Filing Ref</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Citizen</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Schedule</TableHead>
                    <TableHead className="text-right px-8 font-black text-[10px] uppercase tracking-widest text-primary/40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppts.map((a) => (
                    <TableRow key={a.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell className="px-8 py-6">
                        <p className="font-black text-primary leading-none">{a.referenceCode}</p>
                        <p className="text-[9px] text-muted-foreground font-black uppercase mt-1">LOGGED: {a.createdAt ? format(new Date(a.createdAt), "MMM dd, HH:mm") : '---'}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-primary/40" />
                          <span className="text-sm font-bold text-primary">{a.guestName || a.clientName || "Registered User"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge className={cn(
                            "font-black text-[9px] uppercase px-3 w-fit",
                            a.status === 'Eligible' ? 'bg-green-500' : 
                            a.status === 'Not Eligible' ? 'bg-red-500' : 
                            a.status === 'For Screening' ? 'bg-amber-500' : 
                            a.status === 'scheduled' || a.status === 'rescheduled' ? 'bg-blue-500' : 'bg-gray-500'
                          )}>
                            {a.status}
                          </Badge>
                          {a.status === 'cancelled' && a.cancellationReason && (
                            <p className="text-[8px] font-bold text-red-600 uppercase max-w-[150px] truncate" title={a.cancellationReason}>
                              Reason: {a.cancellationReason}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-primary">{format(new Date(a.date), "MMM dd, yyyy")}</p>
                          <p className="text-[10px] text-muted-foreground font-black uppercase">{a.time}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-primary/10">
                              <MoreVertical className="h-4 w-4 text-primary" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-primary/40 px-2 pb-2 border-b mb-2">Management Controls</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(a.id, a.referenceCode, 'scheduled')} className="rounded-xl font-bold">
                              <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Confirm Request
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setSelectedAppt(a); setResDate(new Date(a.date)); setIsRescheduleOpen(true); }} className="rounded-xl font-bold">
                              <CalendarCheck className="mr-2 h-4 w-4 text-indigo-600" /> Reschedule Visit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateStatus(a.id, a.referenceCode, 'cancelled')} className="rounded-xl font-bold text-red-600">
                              <XCircle className="mr-2 h-4 w-4" /> Mark Cancelled
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => deleteDocumentNonBlocking(doc(db, "appointments", a.id))} className="rounded-xl font-bold text-muted-foreground">
                              <Trash2 className="mr-2 h-4 w-4" /> Remove Record
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* --- RESCHEDULE DIALOG --- */}
        <Dialog open={isRescheduleOpen} onOpenChange={setIsRescheduleOpen}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl">
            <DialogHeader className="p-8 bg-primary text-white shrink-0">
              <DialogTitle className="text-3xl font-black">Override Visit Schedule</DialogTitle>
              <DialogDescription className="text-white/60 font-bold uppercase tracking-widest text-[10px]">Reference: {selectedAppt?.referenceCode}</DialogDescription>
            </DialogHeader>
            <div className="p-10 grid lg:grid-cols-2 gap-12 max-h-[70vh] overflow-y-auto">
              <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">1. Select New Date</Label>
                <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10">
                  <Calendar
                    mode="single"
                    selected={resDate}
                    onSelect={(d) => { if (d && !isWeekend(d) && !isHoliday(d) && !isBefore(d, startOfToday())) setResDate(d); setResTime(""); }}
                    disabled={[{ before: startOfToday() }, { dayOfWeek: [0, 6] }, (date) => isHoliday(date)]}
                    className="mx-auto"
                  />
                </div>
              </div>
              <div className="space-y-6 flex flex-col">
                <div className="flex-1">
                  <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">2. Availability for {resDate ? format(resDate, "MMM dd") : "..."}</Label>
                  {!resDate ? (
                    <div className="h-full min-h-[250px] flex flex-col items-center justify-center bg-muted/20 rounded-[2rem] border-2 border-dashed">
                      <Clock className="h-10 w-10 text-muted-foreground/20 mb-2" />
                      <p className="text-[10px] font-black uppercase text-muted-foreground/40">Select date first</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 mt-4 max-h-[300px] overflow-y-auto p-1 scrollbar-hide">
                      {timeSlots.map(slot => (
                        <Button
                          key={slot.time}
                          disabled={slot.isBooked || slot.isPast}
                          variant={resTime === slot.time ? "default" : "outline"}
                          className={cn(
                            "h-11 rounded-xl font-bold transition-all border-2",
                            resTime === slot.time ? "bg-primary text-white" : "bg-white text-primary border-primary/10"
                          )}
                          onClick={() => setResTime(slot.time)}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="pt-6 border-t flex gap-3">
                  <Button variant="outline" onClick={() => setIsRescheduleOpen(false)} className="flex-1 h-14 rounded-xl font-bold">Cancel</Button>
                  <Button 
                    onClick={handleRescheduleSubmit} 
                    disabled={!resDate || !resTime || isProcessing} 
                    className="flex-1 h-14 rounded-xl bg-primary text-white font-black shadow-xl"
                  >
                    {isProcessing ? <Loader2 className="animate-spin h-5 w-5" /> : <CalendarCheck className="mr-2 h-5 w-5" />}
                    Update visit
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
