
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
  Scale,
  ArrowRight,
  Gavel as GavelIcon,
  Activity
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
import { Textarea } from "@/components/ui/textarea";
import { DateRange } from "react-day-picker";
import { caseCategories } from "@/app/lib/case-data";
import { initializeApp, deleteApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { firebaseConfig } from "@/firebase/config";

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

export default function LawyerDashboard() {
  const { user, role, loading } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  
  // UI State
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  
  // Consultation State
  const [activeConsultation, setActiveConsultation] = useState<any>(null);
  const [consultationForm, setConsultationForm] = useState({
    notes: "",
    recommendation: "",
    assessment: "",
    caseType: ""
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

  const pendingConsultations = useMemo(() => {
    if (!apptsData) return [];
    return apptsData.filter(a => a.status === "Consultation in Progress");
  }, [apptsData]);

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

  const handleFinalizeCaseActivation = async () => {
    if (!db || !activeConsultation || !user) return;
    setIsSubmitting(true);

    try {
      const year = new Date().getFullYear();
      const caseId = `CASE-${year}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      let clientId = activeConsultation.clientId;
      const citizenEmail = activeConsultation.guestEmail || activeConsultation.clientEmail || `${activeConsultation.guestMobile || activeConsultation.clientMobile}@epao.mobile`;

      // 1. Provision Account if Guest
      if (!clientId) {
        try {
          const secondaryApp = initializeApp(firebaseConfig, "consultation-activation-" + Date.now());
          const secondaryAuth = getAuth(secondaryApp);
          const userCredential = await createUserWithEmailAndPassword(secondaryAuth, citizenEmail, "password123");
          clientId = userCredential.user.uid;
          await deleteApp(secondaryApp);
        } catch (authError: any) {
          if (authError.code !== 'auth/email-already-in-use') {
             clientId = clientId || crypto.randomUUID();
          }
        }
      }

      // 2. Update Appointment
      const apptRef = doc(db, "appointments", activeConsultation.id);
      updateDocumentNonBlocking(apptRef, {
        status: "completed",
        clientId: clientId,
        consultationNotes: consultationForm.notes,
        recommendation: consultationForm.recommendation,
        assessment: consultationForm.assessment,
        caseId: caseId,
        updatedAt: new Date().toISOString()
      });

      // 3. Create Case
      const caseRef = doc(db, "cases", caseId);
      setDocumentNonBlocking(caseRef, {
        id: caseId,
        clientId: clientId,
        lawyerId: user.uid,
        caseType: consultationForm.caseType || activeConsultation.caseType,
        status: "Active",
        description: `Consultation Reference ${activeConsultation.referenceCode}. Assessment: ${consultationForm.assessment}`,
        createdAt: new Date().toISOString()
      }, { merge: true });

      // 4. Update Citizen record
      const userRef = doc(db, "users", clientId);
      setDocumentNonBlocking(userRef, {
        id: clientId,
        mobileNumber: activeConsultation.guestMobile || activeConsultation.clientMobile || "",
        email: citizenEmail,
        fullName: activeConsultation.guestName || activeConsultation.clientName || "",
        role: "client",
        status: "Active Case",
        createdAt: new Date().toISOString()
      }, { merge: true });

      // --- NOTIFICATIONS ---
      const notifId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", notifId), {
        id: notifId,
        type: "case",
        userRole: "lawyer",
        description: `Official Case ${caseId} activated by Atty. ${lawyerData?.lastName} after consultation.`,
        referenceId: caseId,
        status: "unread",
        createdAt: new Date().toISOString()
      }, { merge: true });

      toast({ title: "Case Activated", description: `Official record ${caseId} is now live.` });
      setActiveConsultation(null);
      setConsultationForm({ notes: "", recommendation: "", assessment: "", caseType: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>;
  if (!user || role !== 'lawyer') return null;

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-8 pb-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
              <AvatarImage src={lawyerData?.photoUrl} className="object-cover" />
              <AvatarFallback className="bg-secondary/10 text-2xl font-black text-secondary">{lawyerData?.firstName?.[0] || "?"}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-black text-secondary font-headline tracking-tight">Atty. {lawyerData?.firstName} {lawyerData?.lastName}</h1>
              <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em] mt-1">Professional Legal Portal</p>
            </div>
          </div>
        </div>

        {/* --- PRIORITY CONSULTATIONS --- */}
        {pendingConsultations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-1">
              <Activity className="h-5 w-5 text-red-500 animate-pulse" />
              <h2 className="text-sm font-black uppercase tracking-widest text-secondary">Awaiting Consultation ({pendingConsultations.length})</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingConsultations.map(appt => (
                <Card key={appt.id} className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden border-l-8 border-red-500">
                  <CardContent className="p-5 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-start gap-5 min-w-0 flex-1">
                      <div className="p-3 bg-red-50 rounded-2xl text-red-600 shrink-0">
                        <User className="h-6 w-6" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <div className="flex flex-row items-center gap-3 min-w-0">
                          <h3 className="text-xl font-black text-secondary truncate">{appt.guestName || appt.clientName}</h3>
                          <Badge className="bg-red-500 text-white text-[8px] font-black uppercase shrink-0 px-2 py-0.5 border-none shadow-sm">
                            IN PROGRESS
                          </Badge>
                        </div>
                        <div className="flex">
                          <Badge variant="outline" className="text-[9px] uppercase border-red-100 bg-red-50/50 text-red-700 truncate max-w-full">
                            {appt.caseType}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        setActiveConsultation(appt);
                        setConsultationForm({ ...consultationForm, caseType: appt.caseType });
                      }}
                      className="w-full sm:w-auto h-12 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-black px-6 shadow-lg shrink-0"
                    >
                      Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-secondary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Briefcase className="h-24 w-24" /></div>
            <CardContent className="p-8">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Caseload</p>
              <p className="text-5xl font-black">{activeCases?.length || 0}</p>
              <p className="text-xs font-bold opacity-80 pt-2 flex items-center gap-1 cursor-pointer" onClick={() => router.push('/dashboard/lawyer/cases')}>Open Registry <ChevronRight className="h-3 w-3" /></p>
            </CardContent>
          </Card>
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white text-secondary overflow-hidden border-2 border-secondary/5">
            <CardContent className="p-8 flex justify-between items-start">
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today's Sessions</p>
                <p className="text-5xl font-black">{filteredSchedule.length}</p>
                <p className="text-xs font-bold text-muted-foreground pt-2">Combined office schedule</p>
              </div>
              <div className="p-3 bg-secondary/5 rounded-2xl"><Clock className="h-6 w-6 text-secondary" /></div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-secondary/5 pb-4 border-b border-secondary/10"><CardTitle className="text-lg font-bold text-secondary flex items-center gap-2"><CalendarIcon className="h-5 w-5" /> Official Workstation Calendar</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 xl:grid-cols-12">
              <div className="xl:col-span-4 p-8 border-r border-secondary/5 bg-secondary/[0.02]">
                <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} className="mx-auto rounded-md" />
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
                    </div>
                  ))
                ) : (
                  <div className="py-32 text-center space-y-4">
                    <Inbox className="h-20 w-20 text-secondary/10 mx-auto" />
                    <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">No entries for this date</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* --- CONSULTATION NOTES DIALOG --- */}
        <Dialog open={!!activeConsultation} onOpenChange={() => setActiveConsultation(null)}>
          <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
            <DialogHeader className="p-8 bg-secondary text-white shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <DialogTitle className="text-2xl font-black">Official Legal Consultation</DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Citizen: {activeConsultation?.guestName || activeConsultation?.clientName}</DialogDescription>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl"><GavelIcon className="h-6 w-6 text-white" /></div>
              </div>
            </DialogHeader>
            <div className="p-6 sm:p-10 space-y-8 flex-1 overflow-y-auto min-h-0">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Case Classification</Label>
                    <Select value={consultationForm.caseType} onValueChange={(v) => setConsultationForm({...consultationForm, caseType: v})}>
                      <SelectTrigger className="h-12 rounded-xl border-secondary/10 font-bold"><SelectValue placeholder="Select Category" /></SelectTrigger>
                      <SelectContent>
                        {Object.keys(caseCategories).map(cat => (
                          <SelectItem key={cat} value={cat} className="font-bold">{cat}</SelectItem>
                        ))}
                        <SelectItem value="Criminal" className="font-bold">Criminal Case</SelectItem>
                        <SelectItem value="Civil" className="font-bold">Civil Case</SelectItem>
                        <SelectItem value="Labor" className="font-bold">Labor Dispute</SelectItem>
                        <SelectItem value="Family Law" className="font-bold">Family Law</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Initial Legal Assessment</Label>
                    <Textarea 
                      placeholder="Brief legal assessment of the concern..." 
                      className="rounded-2xl h-24 border-secondary/10 focus-visible:ring-secondary/20"
                      value={consultationForm.assessment}
                      onChange={e => setConsultationForm({...consultationForm, assessment: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Recommended Legal Action</Label>
                    <Textarea 
                      placeholder="Next steps (e.g., File Petition, Mediation, etc.)..." 
                      className="rounded-2xl h-24 border-secondary/10 focus-visible:ring-secondary/20"
                      value={consultationForm.recommendation}
                      onChange={e => setConsultationForm({...consultationForm, recommendation: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Confidential Case Notes</Label>
                    <Textarea 
                      placeholder="Detailed factual summary and evidence review..." 
                      className="rounded-2xl h-24 border-secondary/10 focus-visible:ring-secondary/20"
                      value={consultationForm.notes}
                      onChange={e => setConsultationForm({...consultationForm, notes: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
                <ShieldAlert className="h-6 w-6 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 font-bold leading-relaxed italic">
                  Activation will generate an official Case ID and link these notes to the permanent citizen record. Ensure all statutory criteria are satisfied before finalizing.
                </p>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 flex flex-col sm:flex-row gap-4 shrink-0">
              <Button variant="outline" onClick={() => setActiveConsultation(null)} className="flex-1 h-14 rounded-xl font-bold border-2">Close Record</Button>
              <Button 
                onClick={handleFinalizeCaseActivation} 
                disabled={isSubmitting || !consultationForm.caseType || !consultationForm.assessment} 
                className="flex-1 h-14 rounded-xl font-black text-white shadow-xl bg-secondary hover:bg-secondary/90"
              >
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : <Scale className="mr-2 h-5 w-5" />}
                Activate Official Case Record
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
