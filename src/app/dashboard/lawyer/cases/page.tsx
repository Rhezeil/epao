
"use client";

import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking, useDoc } from "@/firebase";
import { collection, query, where, doc, getDoc } from "firebase/firestore";
import { format, startOfToday, isWeekend, setHours, setMinutes, isBefore } from "date-fns";
import { 
  FileText, 
  Scale, 
  Search,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Loader2,
  CalendarCheck,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  Info,
  ChevronRight,
  Gavel,
  FolderOpen,
  Plus,
  File
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
import { Calendar } from "@/components/ui/calendar";
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

  // Folder State
  const [selectedCaseForFolder, setSelectedCaseForFolder] = useState<any>(null);
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [newDoc, setNewDoc] = useState({ name: "", folder: "Evidence" });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(
      collection(db, "cases"), 
      where("lawyerId", "==", user.uid)
    );
  }, [db, user, role]);

  const { data: cases, isLoading } = useCollection(casesQuery);

  const filteredCases = useMemo(() => {
    if (!cases) return [];
    return cases.filter(c => 
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.caseType.toLowerCase().includes(search.toLowerCase())
    );
  }, [cases, search]);

  // Folder Documents Query
  const docsQuery = useMemoFirebase(() => {
    if (!db || !selectedCaseForFolder) return null;
    return collection(db, "cases", selectedCaseForFolder.id, "documents");
  }, [db, selectedCaseForFolder]);
  const { data: caseDocs } = useCollection(docsQuery);

  // Client Fetchers
  const clientDocRef = useMemoFirebase(() => {
    if (!db || !selectedClientIdForProfile || !user) return null;
    return doc(db, "users", selectedClientIdForProfile);
  }, [db, selectedClientIdForProfile, user]);
  
  const profileDocRef = useMemoFirebase(() => {
    if (!db || !selectedClientIdForProfile || !user) return null;
    return doc(db, "users", selectedClientIdForProfile, "profile", "profile");
  }, [db, selectedClientIdForProfile, user]);

  const { data: clientUser } = useDoc(clientDocRef);
  const { data: clientProfile } = useDoc(profileDocRef);

  const selectedCaseForProfile = useMemo(() => {
    if (!selectedClientIdForProfile || !cases) return null;
    return cases.find(c => c.clientId === selectedClientIdForProfile);
  }, [selectedClientIdForProfile, cases]);

  // Slot Logic for Booking Dialog
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
      const clientDoc = await getDoc(doc(db, "users", selectedCaseForBooking.clientId));
      const clientData = clientDoc.exists() ? clientDoc.data() : null;

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

  const handleSaveDoc = () => {
    if (!db || !selectedCaseForFolder || !newDoc.name) return;
    const docId = crypto.randomUUID();
    const docRef = doc(db, "cases", selectedCaseForFolder.id, "documents", docId);
    setDocumentNonBlocking(docRef, {
      id: docId,
      name: newDoc.name,
      folder: newDoc.folder,
      uploadDate: new Date().toISOString(),
      uploadedBy: user.uid
    }, { merge: true });
    setNewDoc({ name: "", folder: "Evidence" });
    toast({ title: "Document Saved", description: `Successfully added to ${newDoc.folder}.` });
  };

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-secondary font-headline tracking-tight">Case Registry</h1>
            <p className="text-muted-foreground font-medium">Manage matters and case files assigned to your workstation.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/30" />
            <Input 
              placeholder="Search Classification or ID..." 
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
              <CardTitle className="text-xl font-bold text-secondary">Workload Registry</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-secondary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-secondary/40">Classification</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-secondary/40">Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-secondary/40">Case ID</TableHead>
                    <TableHead className="text-right px-8 font-black text-[10px] uppercase tracking-widest text-secondary/40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((c) => (
                    <TableRow key={c.id} className="hover:bg-secondary/5 transition-colors group">
                      <TableCell className="px-8 py-6">
                        <p className="font-black text-secondary leading-none text-base">{c.caseType}</p>
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
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedCaseForFolder(c); setIsFolderOpen(true); }} className="h-9 w-9 rounded-xl text-primary hover:bg-primary/5">
                            <FolderOpen className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => { setSelectedClientIdForProfile(c.clientId); setIsProfileOpen(true); }} className="h-9 w-9 rounded-xl text-secondary hover:bg-secondary/5">
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
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* --- CASE FOLDER DIALOG --- */}
        <Dialog open={isFolderOpen} onOpenChange={setIsFolderOpen}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="p-8 bg-primary text-white shrink-0">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <DialogTitle className="text-3xl font-black">Case Digital Folder</DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                    Registry ID: {selectedCaseForFolder?.id}
                  </DialogDescription>
                </div>
                <FolderOpen className="h-10 w-10 opacity-40" />
              </div>
            </DialogHeader>
            <div className="p-8 flex-1 overflow-y-auto space-y-8">
              <div className="bg-primary/5 p-6 rounded-[2rem] border-2 border-dashed border-primary/10 flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1 space-y-2 w-full">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Document Name</Label>
                  <Input placeholder="e.g. Sworn Statement" value={newDoc.name} onChange={e => setNewDoc({...newDoc, name: e.target.value})} className="h-12 rounded-xl bg-white border-primary/10" />
                </div>
                <div className="w-full sm:w-48 space-y-2">
                  <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Select Folder</Label>
                  <Select value={newDoc.folder} onValueChange={v => setNewDoc({...newDoc, folder: v})}>
                    <SelectTrigger className="h-12 rounded-xl bg-white border-primary/10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {["Evidence", "Pleadings", "Court Orders", "Correspondence"].map(f => (
                        <SelectItem key={f} value={f} className="font-bold">{f}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSaveDoc} className="h-12 px-8 rounded-xl bg-primary text-white font-black">
                  <Plus className="mr-2 h-4 w-4" /> Add Record
                </Button>
              </div>

              <Tabs defaultValue="Evidence" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-muted/50 p-1 rounded-2xl h-14">
                  {["Evidence", "Pleadings", "Court Orders", "Correspondence"].map(f => (
                    <TabsTrigger key={f} value={f} className="rounded-xl font-bold text-[10px] uppercase">{f}</TabsTrigger>
                  ))}
                </TabsList>
                {["Evidence", "Pleadings", "Court Orders", "Correspondence"].map(f => (
                  <TabsContent key={f} value={f} className="mt-6">
                    <div className="grid gap-3">
                      {caseDocs?.filter(d => d.folder === f).map(doc => (
                        <div key={doc.id} className="p-4 bg-white rounded-2xl border border-primary/5 shadow-sm flex items-center justify-between hover:border-primary/20 transition-colors group">
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-primary/5 rounded-xl group-hover:bg-primary/10 transition-colors">
                              <File className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-bold text-primary">{doc.name}</p>
                              <p className="text-[9px] text-muted-foreground font-black uppercase tracking-tighter">
                                Uploaded: {format(new Date(doc.uploadDate), "PPP p")}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="font-black text-[8px] uppercase border-primary/10">Ref: {doc.id.slice(0, 8)}</Badge>
                        </div>
                      ))}
                      {caseDocs?.filter(d => d.folder === f).length === 0 && (
                        <div className="py-12 text-center bg-muted/10 rounded-3xl border border-dashed border-primary/10">
                          <FileText className="h-10 w-10 text-primary/10 mx-auto mb-2" />
                          <p className="text-xs font-bold text-muted-foreground italic">No document records found in this folder.</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
            <DialogFooter className="p-8 bg-muted/30 shrink-0">
              <Button onClick={() => setIsFolderOpen(false)} className="w-full h-14 rounded-2xl font-black bg-primary text-white shadow-xl">Close Workstation Folder</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

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
            <div className="p-10 space-y-8 flex-1 overflow-y-auto">
              {selectedCaseForProfile && (
                <div className="space-y-4 p-8 bg-secondary/5 rounded-[2.5rem] border-2 border-dashed border-secondary/10">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <Gavel className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] font-black uppercase text-secondary/40 tracking-widest">Handled Case Classification</Label>
                      <p className="text-2xl font-black text-secondary leading-tight">{selectedCaseForProfile.caseType}</p>
                      <p className="text-[10px] font-black text-secondary/60 tracking-[0.2em] uppercase">ID: {selectedCaseForProfile.id}</p>
                    </div>
                  </div>
                  {selectedCaseForProfile.description && (
                    <div className="pt-4 border-t border-secondary/10">
                      <p className="text-sm text-secondary/80 font-medium italic leading-relaxed">{selectedCaseForProfile.description}</p>
                    </div>
                  )}
                </div>
              )}
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
            </div>
            <DialogFooter className="p-8 bg-muted/30 shrink-0">
              <Button onClick={() => setIsProfileOpen(false)} className="w-full h-14 rounded-2xl font-black bg-secondary text-white shadow-xl">Close Citizen Record</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* --- BOOKING DIALOG --- */}
        <Dialog open={!!selectedCaseForBooking} onOpenChange={() => setSelectedCaseForBooking(null)}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl max-h-[95vh] flex flex-col">
            <DialogHeader className="p-8 bg-primary text-white shrink-0">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <DialogTitle className="text-2xl font-black">Schedule Follow-up</DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">
                    Case: {selectedCaseForBooking?.id}
                  </DialogDescription>
                </div>
                <CalendarCheck className="h-8 w-8 opacity-40" />
              </div>
            </DialogHeader>
            <div className="p-10 space-y-8 flex-1 overflow-y-auto scrollbar-hide">
              <div className="grid lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">Case Classification</Label>
                    <div className="p-6 bg-primary/5 rounded-[2rem] border-2 border-dashed border-primary/10">
                      <p className="text-lg font-black text-primary leading-tight">{selectedCaseForBooking?.caseType}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">Service Classification</Label>
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
                    <Label className="text-[10px] font-black uppercase text-primary/40 tracking-widest ml-1">Visit Date</Label>
                    <div className="p-4 bg-primary/5 rounded-3xl border border-primary/10 shadow-inner">
                      <Calendar
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
                      <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground bg-primary/5 rounded-3xl border border-dashed">
                        <Clock className="h-10 w-10 mb-2 opacity-20" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">Pick a date above</p>
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
                              bookingForm.time === slot.time ? "bg-primary text-white border-primary" : "bg-white text-primary border-primary/10"
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
              <Button variant="outline" onClick={() => setSelectedCaseForBooking(null)} className="rounded-xl font-bold h-12 px-8">Cancel</Button>
              <Button onClick={handleCreateAppointment} disabled={!bookingForm.date || !bookingForm.time || isSubmitting} className="bg-primary text-white font-black rounded-xl px-10 h-12 shadow-lg">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : "Finalize Appointment"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
