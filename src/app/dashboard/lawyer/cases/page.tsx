"use client";

import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking, useDoc } from "@/firebase";
import { collection, query, where, doc, orderBy } from "firebase/firestore";
import { format, startOfToday, setHours, setMinutes, isBefore, isAfter } from "date-fns";
import { 
  Scale, 
  Search,
  CheckCircle2,
  Loader2,
  CalendarCheck,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Info,
  Settings2,
  History,
  XCircle,
  FileText,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger, 
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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

export default function LawyerCasesPage() {
  const { user, role, loading } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  // Quick Booking State
  const [selectedCaseForBooking, setSelectedCaseForBooking] = useState<any>(null);
  const [bookingForm, setBookingForm] = useState({
    date: undefined as Date | undefined,
    time: "",
    purpose: "consultation"
  });
  
  // Profile State
  const [selectedClientIdForProfile, setSelectedClientIdForProfile] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Queries
  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(
      collection(db, "cases"), 
      where("lawyerId", "==", user.uid)
    );
  }, [db, user, role]);

  const usersQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "users"));
  }, [db, user, role]);

  const apptsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "appointments"), where("lawyerId", "==", user.uid));
  }, [db, user, role]);

  const { data: cases, isLoading: isCasesLoading } = useCollection(casesQuery);
  const { data: allUsers } = useCollection(usersQuery);
  const { data: allAppts } = useCollection(apptsQuery);

  const filteredCases = useMemo(() => {
    if (!cases) return [];
    return cases.filter(c => {
      const client = allUsers?.find(u => u.id === c.clientId);
      const searchStr = search.toLowerCase();
      return (
        c.id.toLowerCase().includes(searchStr) ||
        c.caseType.toLowerCase().includes(searchStr) ||
        client?.fullName?.toLowerCase().includes(searchStr)
      );
    });
  }, [cases, allUsers, search]);

  // Document Fetchers for current context
  const activeClientId = selectedCaseForBooking?.clientId || selectedClientIdForProfile;

  const clientDocRef = useMemoFirebase(() => {
    if (!db || !activeClientId || !user) return null;
    return doc(db, "users", activeClientId);
  }, [db, activeClientId, user]);
  
  const profileDocRef = useMemoFirebase(() => {
    if (!db || !activeClientId || !user) return null;
    return doc(db, "users", activeClientId, "profile", "profile");
  }, [db, activeClientId, user]);

  const { data: clientUser } = useDoc(clientDocRef);
  const { data: clientProfile } = useDoc(profileDocRef);

  // Client Specific Appointment History
  const clientApptsQuery = useMemoFirebase(() => {
    if (!db || !activeClientId || !user) return null;
    return query(
      collection(db, "appointments"),
      where("clientId", "==", activeClientId)
    );
  }, [db, activeClientId, user]);

  const { data: clientAppts, isLoading: isClientApptsLoading } = useCollection(clientApptsQuery);

  // Sorted History Views
  const sortedHistory = useMemo(() => {
    if (!clientAppts) return { upcoming: [], past: [] };
    const now = new Date();
    const sorted = [...clientAppts].sort((a, b) => b.date.localeCompare(a.date));
    return {
      upcoming: sorted.filter(a => isAfter(new Date(a.date), now) && a.status !== 'cancelled' && a.status !== 'completed'),
      past: sorted.filter(a => isBefore(new Date(a.date), now) || a.status === 'cancelled' || a.status === 'completed')
    };
  }, [clientAppts]);

  // Slot Logic for Booking Dialog
  const bookingDateStr = bookingForm.date ? format(bookingForm.date, "yyyy-MM-dd") : null;
  const globalApptsQueryForSlot = useMemoFirebase(() => {
    if (!db || !bookingDateStr || !user) return null;
    return query(collection(db, "appointments"), where("dateString", "==", bookingDateStr));
  }, [db, bookingDateStr, user]);
  const { data: globalApptsForSlot } = useCollection(globalApptsQueryForSlot);

  const timeSlots = useMemo(() => {
    const slots = [];
    const now = new Date();
    for (let h = 8; h <= 16; h++) {
      for (let m = 0; m < 60; m += 30) {
        if (h === 12) continue; // Lunch
        if (h === 16 && m > 30) continue;
        const ampm = h >= 12 ? 'PM' : 'AM';
        const displayHour = h % 12 || 12;
        const timeString = `${displayHour.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${ampm}`;
        const slotDate = bookingForm.date ? setMinutes(setHours(new Date(bookingForm.date), h), m) : null;
        const isPast = slotDate ? isBefore(slotDate, now) : false;
        const isBooked = globalApptsForSlot?.some(a => a.lawyerId === user?.uid && a.time === timeString && a.status !== 'cancelled');
        slots.push({ time: timeString, isBooked, isPast });
      }
    }
    return slots;
  }, [bookingForm.date, globalApptsForSlot, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!user || role !== 'lawyer') return null;

  const handleUpdateStatus = (caseId: string, status: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "cases", caseId), { 
      status,
      updatedAt: new Date().toISOString(),
      ...(status === 'Closed' ? { closedAt: new Date().toISOString() } : { closedAt: null })
    });
    toast({ title: "Case Updated", description: `Case ${caseId} is now ${status}.` });
  };

  const handleCreateAppointment = async () => {
    if (!db || !user || !selectedCaseForBooking || !bookingForm.date || !bookingForm.time) return;
    setIsSubmitting(true);

    try {
      const apptId = crypto.randomUUID();
      const refCode = `PAO-${Math.floor(100000 + Math.random() * 900000)}`;
      
      const data = {
        id: apptId,
        lawyerId: user.uid,
        clientId: selectedCaseForBooking.clientId,
        referenceCode: refCode,
        caseId: selectedCaseForBooking.id,
        caseType: selectedCaseForBooking.caseType,
        purpose: bookingForm.purpose,
        clientName: clientUser?.fullName || "Registered Client",
        clientMobile: clientUser?.mobileNumber || "",
        clientEmail: clientUser?.email || "",
        date: bookingForm.date.toISOString(),
        dateString: format(bookingForm.date, "yyyy-MM-dd"),
        time: bookingForm.time,
        status: "scheduled",
        type: "follow-up",
        bookedBy: "lawyer",
        createdAt: new Date().toISOString()
      };

      setDocumentNonBlocking(doc(db, "appointments", apptId), data, { merge: true });
      
      toast({ title: "Appointment Set", description: `Follow-up for ${selectedCaseForBooking.id} scheduled.` });
      setSelectedCaseForBooking(null);
      setBookingForm({ date: undefined, time: "", purpose: "consultation" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Booking Failed", description: e.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-secondary font-headline tracking-tight">My Cases</h1>
            <p className="text-muted-foreground font-medium">Manage matters and case files assigned to your workstation.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/30" />
            <Input 
              placeholder="Search Classification, Client or ID..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-11 rounded-xl border-secondary/10 bg-white"
            />
          </div>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-secondary/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary text-white rounded-xl">
                <Scale className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-secondary">Registry Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isCasesLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-secondary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-secondary/40">Classification</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-secondary/40">Citizen Client</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-secondary/40">Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-secondary/40">Case ID</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-secondary/40">Next Visit</TableHead>
                    <TableHead className="text-right px-8 font-black text-[10px] uppercase tracking-widest text-secondary/40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((c) => {
                    const client = allUsers?.find(u => u.id === c.clientId);
                    const nextAppt = allAppts?.filter(a => a.caseId === c.id && (a.status === 'scheduled' || a.status === 'rescheduled'))
                      .sort((a, b) => a.date.localeCompare(b.date))[0];

                    return (
                      <TableRow key={c.id} className="hover:bg-secondary/5 transition-colors group">
                        <TableCell className="px-8 py-6">
                          <p className="font-black text-secondary leading-none text-base">{c.caseType}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-secondary/40" />
                            <span className="text-sm font-bold text-secondary">{client?.fullName || "Registered Client"}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "font-black text-[9px] uppercase px-3",
                            c.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'
                          )}>
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                          {c.id}
                        </TableCell>
                        <TableCell>
                          {nextAppt ? (
                            <div className="space-y-0.5">
                              <p className="text-[10px] font-black text-primary uppercase">{format(new Date(nextAppt.date), "MMM dd, yyyy")}</p>
                              <p className="text-[9px] font-bold text-muted-foreground">{nextAppt.time}</p>
                            </div>
                          ) : (
                            <span className="text-[10px] font-bold text-muted-foreground italic">No Visit Set</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedClientIdForProfile(c.clientId); setIsProfileOpen(true); }} title="Client Profile" className="h-9 w-9 rounded-xl text-secondary hover:bg-secondary/5">
                              <User className="h-4 w-4" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary/5">
                                  <Settings2 className="h-4 w-4 text-secondary" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="rounded-2xl w-56">
                                <DropdownMenuLabel className="text-[10px] font-black uppercase text-secondary/40 px-2 pb-2">Status Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(c.id, "Active")} className="rounded-xl font-bold">
                                  <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Mark as Active
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleUpdateStatus(c.id, "Closed")} className="rounded-xl font-bold">
                                  <FileText className="mr-2 h-4 w-4 text-muted-foreground" /> Close Legal Case
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSelectedCaseForBooking(c)} className="rounded-xl font-bold text-primary">
                                  <CalendarCheck className="mr-2 h-4 w-4" /> Schedule Visit
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* --- CLIENT PROFILE DIALOG --- */}
        <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
          <DialogContent className="rounded-[3rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="p-8 bg-secondary text-white shrink-0">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <DialogTitle className="text-3xl font-black">
                    {clientProfile ? `${clientProfile.firstName} ${clientProfile.lastName}` : (clientUser?.fullName || "Citizen Profile")}
                  </DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                    Reference ID: {selectedClientIdForProfile?.slice(0, 8)}...
                  </DialogDescription>
                </div>
                <div className="p-4 bg-white/20 rounded-[2rem]">
                  <User className="h-8 w-8" />
                </div>
              </div>
            </DialogHeader>
            <div className="overflow-hidden flex-1 flex flex-col min-h-0">
              <Tabs defaultValue="details" className="w-full h-full flex flex-col min-h-0">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 p-1 rounded-none h-14 shrink-0">
                  <TabsTrigger value="details" className="rounded-none font-bold">Personal Details</TabsTrigger>
                  <TabsTrigger value="history" className="rounded-none font-bold">Visit History</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="p-10 space-y-8 flex-1 overflow-y-auto min-h-0">
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">Contact Details</Label>
                        <p className="font-bold text-secondary flex items-center gap-3 text-base">
                          <Phone className="h-4 w-4 text-secondary/40" /> {clientUser?.mobileNumber || clientProfile?.phoneNumber || "N/A"}
                        </p>
                        <p className="font-bold text-secondary flex items-center gap-3 text-base">
                          <Mail className="h-4 w-4 text-secondary/40" /> {clientUser?.email || "N/A"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">Home Address</Label>
                        <p className="text-sm font-bold text-secondary flex items-start gap-3 leading-relaxed">
                          <MapPin className="h-4 w-4 text-secondary/40 shrink-0 mt-0.5" /> 
                          {clientProfile?.address || "Address not provided."}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-1">
                        <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">Eligibility Status</Label>
                        <Badge className="bg-secondary text-white font-black px-4 py-1.5 rounded-full uppercase text-[10px] tracking-wider border-none shadow-sm">
                          {clientUser?.incomeClassification || "Indigent"}
                        </Badge>
                      </div>
                      <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
                        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[11px] text-amber-800/70 font-bold leading-relaxed">Privacy Protocol: Data for official legal correspondence only.</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="p-6 flex-1 overflow-y-auto min-h-0">
                  <div className="space-y-8">
                    {isClientApptsLoading ? (
                      <div className="py-12 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-secondary/20" /></div>
                    ) : clientAppts && clientAppts.length > 0 ? (
                      <>
                        {/* Upcoming Section */}
                        {sortedHistory.upcoming.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-[10px] font-black uppercase text-secondary/40 tracking-[0.2em] flex items-center gap-2">
                              <Calendar className="h-3 w-3" /> Upcoming Visits
                            </h4>
                            <div className="space-y-3">
                              {sortedHistory.upcoming.map((appt) => (
                                <div key={appt.id} className="p-4 bg-primary/5 rounded-2xl border border-primary/10 transition-colors">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border shadow-sm text-primary">
                                        <Clock className="h-5 w-5" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-primary leading-tight">{appt.caseType}</p>
                                        <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                                          {format(new Date(appt.date), "MMM dd, yyyy")} • {appt.time}
                                        </p>
                                      </div>
                                    </div>
                                    <Badge className="bg-primary text-white text-[8px] font-black uppercase">{appt.status}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Past Section */}
                        <div className="space-y-4">
                          <h4 className="text-[10px] font-black uppercase text-secondary/40 tracking-[0.2em] flex items-center gap-2">
                            <History className="h-3 w-3" /> Visit Log Archive
                          </h4>
                          <div className="space-y-3">
                            {sortedHistory.past.map((appt) => (
                              <div key={appt.id} className="p-4 bg-muted/20 rounded-2xl border border-transparent hover:border-secondary/10 transition-colors">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className={cn(
                                      "h-10 w-10 rounded-xl flex items-center justify-center",
                                      appt.status === 'completed' ? 'bg-green-50 text-green-600' : 
                                      appt.status === 'cancelled' ? 'bg-red-50 text-red-600' : 'bg-secondary/5 text-secondary'
                                    )}>
                                      {appt.status === 'completed' ? <CheckCircle2 className="h-5 w-5" /> : 
                                       appt.status === 'cancelled' ? <XCircle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                    </div>
                                    <div>
                                      <p className="text-sm font-bold text-secondary leading-tight">{appt.caseType}</p>
                                      <p className="text-[9px] text-muted-foreground font-black uppercase tracking-widest mt-1">
                                        {format(new Date(appt.date), "MMM dd, yyyy")} • {appt.time}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge variant="outline" className={cn(
                                      "text-[8px] font-black uppercase px-2",
                                      appt.status === 'completed' ? 'border-green-200 text-green-700 bg-green-50' : 
                                      appt.status === 'cancelled' ? 'border-red-200 text-red-700 bg-red-50' : 'border-secondary/20 text-secondary'
                                    )}>
                                      {appt.status}
                                    </Badge>
                                    <p className="text-[8px] font-bold text-muted-foreground mt-1">{appt.referenceCode}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="py-12 text-center bg-muted/5 rounded-3xl border-2 border-dashed">
                        <History className="h-10 w-10 text-muted-foreground/20 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground font-medium italic">No visit history recorded for this citizen.</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <DialogFooter className="p-8 bg-muted/30 shrink-0">
              <Button onClick={() => setIsProfileOpen(false)} className="w-full h-14 rounded-2xl font-black bg-secondary text-white shadow-xl">Close Citizen Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- BOOKING DIALOG --- */}
        <Dialog open={!!selectedCaseForBooking} onOpenChange={() => setSelectedCaseForBooking(null)}>
          <DialogContent className="rounded-[3rem] max-w-5xl p-0 overflow-hidden border-none shadow-2xl max-h-[95vh] flex flex-col">
            <DialogHeader className="p-8 bg-primary text-white shrink-0">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-black">Schedule Follow-up Visit</DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                    Registry ID: {selectedCaseForBooking?.id}
                  </DialogDescription>
                </div>
                <CalendarCheck className="h-8 w-8 opacity-40" />
              </div>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="grid lg:grid-cols-5 h-full">
                <div className="lg:col-span-2 bg-primary/[0.02] border-r border-primary/5 p-8 space-y-8">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="text-xs font-black text-primary uppercase tracking-widest">Client Profile</h4>
                    </div>
                    <div className="space-y-4 bg-white p-6 rounded-[2rem] shadow-sm border border-primary/5">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</p>
                        <p className="font-black text-primary">
                          {clientProfile ? `${clientProfile.firstName} ${clientProfile.lastName}` : (clientUser?.fullName || "...")}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Contact</p>
                          <p className="text-xs font-bold text-primary">{clientUser?.mobileNumber || "---"}</p>
                        </div>
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Income</p>
                          <Badge className="bg-primary/10 text-primary text-[8px] uppercase">{clientUser?.incomeClassification || "Indigent"}</Badge>
                        </div>
                      </div>
                      <div className="space-y-1 pt-2 border-t border-primary/5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Address</p>
                        <p className="text-[10px] font-medium text-primary/80 leading-relaxed italic">{clientProfile?.address || "No address provided."}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-xl">
                        <Scale className="h-5 w-5 text-primary" />
                      </div>
                      <h4 className="text-xs font-black text-primary uppercase tracking-widest">Legal Matter</h4>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-primary/5 space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">Matter Classification</p>
                        <p className="text-sm font-black text-primary leading-tight">{selectedCaseForBooking?.caseType}</p>
                      </div>
                      {selectedCaseForBooking?.description && (
                        <div className="space-y-1 pt-2 border-t border-primary/5">
                          <p className="text-[10px] font-bold text-muted-foreground uppercase">Brief Summary</p>
                          <p className="text-[10px] text-muted-foreground font-medium italic leading-relaxed">
                            {selectedCaseForBooking.description}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3 p-8 space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">Service Type</Label>
                        <Select value={bookingForm.purpose} onValueChange={(v) => setBookingForm({...bookingForm, purpose: v})}>
                          <SelectTrigger className="h-12 rounded-xl border-primary/20 bg-white font-bold shadow-sm">
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
                        <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">Select Visit Date</Label>
                        <div className="p-2 bg-primary/5 rounded-3xl border border-primary/10 shadow-inner">
                          <CalendarComponent
                            mode="single"
                            selected={bookingForm.date}
                            onSelect={(d) => setBookingForm({...bookingForm, date: d, time: ""})}
                            className="rounded-md border-none mx-auto"
                            disabled={[{ before: startOfToday() }, { dayOfWeek: [0, 6] }, (date) => isHoliday(date)]}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">Daily Availability</Label>
                        {!bookingForm.date ? (
                          <div className="h-[250px] flex flex-col items-center justify-center text-muted-foreground bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/10">
                            <Clock className="h-10 w-10 mb-2 opacity-20" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary/30">Pick a date first</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-2 gap-2 max-h-[350px] overflow-y-auto p-1 scrollbar-hide">
                            {timeSlots.map(slot => (
                              <Button
                                key={slot.time}
                                disabled={slot.isBooked || slot.isPast}
                                variant={bookingForm.time === slot.time ? "default" : "outline"}
                                className={cn(
                                  "h-11 rounded-xl font-bold transition-all border-2",
                                  bookingForm.time === slot.time 
                                    ? "bg-primary text-white border-primary shadow-md scale-105" 
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
              </div>
            </div>

            <DialogFooter className="p-8 bg-muted/30 gap-3 shrink-0">
              <Button variant="outline" onClick={() => setSelectedCaseForBooking(null)} className="rounded-xl font-bold h-14 px-8 border-2">Cancel</Button>
              <Button 
                onClick={handleCreateAppointment} 
                disabled={!bookingForm.date || !bookingForm.time || isSubmitting} 
                className="bg-primary text-white font-black rounded-xl px-12 h-14 shadow-xl hover:scale-[1.02] transition-transform"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-6 w-6 mr-2" /> : <CalendarCheck className="mr-2 h-5 w-5" />}
                Confirm Follow-up Schedule
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
