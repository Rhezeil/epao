"use client";

import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
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
  CalendarCheck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useMemo } from "react";
import { format, isAfter, isBefore, startOfToday } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ClientDashboard() {
  const { user, role, loading } = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const [assignedLawyer, setAssignedLawyer] = useState<any>(null);

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

  const { data: cases, isLoading: isCasesLoading } = useCollection(casesQuery);
  const { data: appts, isLoading: isApptsLoading } = useCollection(apptsQuery);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || role !== 'client') {
    return null;
  }

  return (
    <DashboardLayout role="client">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500 text-white rounded-2xl shadow-lg">
              <Heart className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Client Portal</h1>
              <p className="text-muted-foreground font-medium">Welcome back. Track your legal journey and upcoming visits.</p>
            </div>
          </div>
          <Badge className="bg-primary/10 text-primary border-none px-4 py-2 rounded-full font-bold">
            Active or Registered
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
                      <Gavel className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-bold text-primary">My Official Case Record</CardTitle>
                  </div>
                  {activeCase && (
                    <Badge className={cn(
                      "border-none font-black px-4 py-1.5 rounded-full uppercase text-[9px] tracking-widest",
                      activeCase.status === 'Closed' ? 'bg-gray-100 text-gray-800' : 'bg-green-100 text-green-800'
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
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Case Reference ID</p>
                        <p className="text-xl font-black text-[#1A3B6B]">{activeCase.id}</p>
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
                          <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Status Update</p>
                          <p className="text-sm font-bold text-[#1A3B6B]">
                            {activeCase.status}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1 bg-muted/20 p-4 rounded-2xl border-2 border-dashed">
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">Case Summary</p>
                        <p className="text-xs text-muted-foreground font-medium leading-relaxed italic">{activeCase.description}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <FileText className="h-12 w-12 text-primary/10 mx-auto" />
                    <p className="text-muted-foreground font-medium">No official Case file has been initialized yet.</p>
                    <p className="text-xs text-muted-foreground/60 italic">Please wait for the office to process your initial intake.</p>
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
                    <div key={appt.id} className="flex items-center justify-between p-5 bg-primary/5 rounded-3xl border border-primary/10 hover:bg-primary/10 transition-colors">
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
                      <Badge className="bg-primary/10 text-primary border-none text-[9px] font-black uppercase">{appt.status}</Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-12 text-sm text-muted-foreground font-medium italic">You have no upcoming follow-ups scheduled.</p>
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
                    <div key={appt.id} className="flex items-center justify-between p-4 bg-muted/10 rounded-2xl border border-transparent hover:bg-muted/20 transition-colors">
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
                  ))
                ) : (
                  <p className="text-center py-8 text-xs text-muted-foreground font-medium italic">No past visit records found.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* --- LAWYER CARD --- */}
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
                        <Badge className="bg-primary/10 text-primary border-none font-bold uppercase text-[9px] mt-1 px-3">Public Attorney II</Badge>
                      </div>
                    </div>
                    <div className="space-y-3 pt-6 border-t border-primary/10">
                      <div className="flex items-center gap-3 text-xs font-bold text-[#2E5A99]">
                        <ShieldCheck className="h-4 w-4 text-primary" /> District Office North
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-[#2E5A99]">
                        <Briefcase className="h-4 w-4 text-primary" /> Specialist in {activeCase?.caseType || "Legal Matters"}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-10 space-y-4">
                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-inner">
                      <User className="h-8 w-8 text-primary/20" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium italic leading-relaxed px-4">
                      An official lawyer will be assigned once your Case record is fully processed by the office.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
