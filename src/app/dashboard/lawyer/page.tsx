"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useDoc } from "@/firebase";
import { collection, query, where, orderBy, doc } from "firebase/firestore";
import { format } from "date-fns";
import { 
  Calendar, Clock, CheckCircle2, XCircle, MoreVertical, 
  FileText, Users, Briefcase, TrendingUp, AlertCircle,
  Scale, User, Phone, ChevronRight, LayoutDashboard,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export default function LawyerDashboard() {
  const { user, role, loading } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();

  // EVEN SAFER PATTERN: Define queries with strict role checks
  // This ensures the query isn't even initialized until we are sure of the role
  const lawyerRef = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return doc(db, "roleLawyer", user.uid);
  }, [db, user, role]);

  const { data: lawyerData } = useDoc(lawyerRef);

  const apptsQuery = useMemoFirebase(() => {
    // CRITICAL: Prevent raw collection listing by returning null if role is not confirmed
    // This matches the "Clean Working Rules" pattern
    if (!db || !user || role !== 'lawyer') return null;
    return query(
      collection(db, "appointments"), 
      where("lawyerId", "==", user.uid),
      orderBy("date", "asc")
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

  // Hook calls remain at top level, handled by null queries above
  const { data: appointments, isLoading: isApptsLoading } = useCollection(apptsQuery);
  const { data: activeCases } = useCollection(casesQuery);

  // SAFE GUARD: Do not show UI or mount heavy Logic until role is verified
  // This is the "Even Safer Version" to prevent unauthorized "list" attempts
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!user || role !== 'lawyer') {
    return null; // AuthProvider handles redirects to /login
  }

  const updateStatus = (apptId: string, status: string) => {
    if (!db) return;
    const ref = doc(db, "appointments", apptId);
    updateDocumentNonBlocking(ref, { status });
    toast({ title: `Status Updated`, description: `Appointment marked as ${status}.` });
  };

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-8 pb-12">
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
              <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">Professional Staff Workstation</p>
            </div>
          </div>
          <Badge className="bg-secondary text-white border-none px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest shadow-md">
            Clinical Registry Active
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-xl rounded-[2rem] bg-secondary text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <Briefcase className="h-24 w-24" />
            </div>
            <CardContent className="p-8 space-y-1 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Active Caseload</p>
              <p className="text-5xl font-black">{activeCases?.length || 0}</p>
              <p className="text-xs font-bold opacity-80 pt-2 flex items-center gap-1 cursor-pointer" onClick={() => router.push('/dashboard/lawyer/cases')}>
                Manage Registry <ChevronRight className="h-3 w-3" />
              </p>
            </CardContent>
          </Card>
          
          <Card className="border-none shadow-xl rounded-[2rem] bg-white text-secondary overflow-hidden border-2 border-secondary/5">
            <CardContent className="p-8 space-y-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Today's Clinic</p>
                  <p className="text-5xl font-black">
                    {appointments?.filter(a => a.dateString === format(new Date(), "yyyy-MM-dd")).length || 0}
                  </p>
                </div>
                <div className="p-3 bg-secondary/5 rounded-2xl">
                  <Calendar className="h-6 w-6 text-secondary" />
                </div>
              </div>
              <p className="text-xs font-bold text-muted-foreground pt-2">Scheduled Consultations</p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-[2rem] bg-amber-400 text-amber-950 overflow-hidden">
            <CardContent className="p-8 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Success Rate</p>
              <p className="text-5xl font-black">94%</p>
              <p className="text-xs font-bold opacity-80 pt-2">Monthly Efficiency Metric</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-secondary/5 pb-4 border-b border-secondary/10">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-bold text-secondary flex items-center gap-2">
                  <Clock className="h-5 w-5" /> Clinical Schedule
                </CardTitle>
                <Badge variant="outline" className="border-secondary/20 text-secondary font-black text-[9px] uppercase px-3 py-1">
                  {format(new Date(), "EEEE, MMM dd")}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isApptsLoading ? (
                <div className="p-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-secondary/20" /></div>
              ) : (
                <div className="divide-y divide-secondary/5">
                  {appointments?.slice(0, 10).map((appt) => (
                    <div key={appt.id} className="p-6 flex items-center justify-between hover:bg-secondary/5 transition-colors">
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
                            <span>{appt.caseType}</span>
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
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary/5">
                              <MoreVertical className="h-4 w-4 text-secondary" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2">
                            <DropdownMenuItem onClick={() => updateStatus(appt.id, 'completed')} className="text-green-600 font-bold rounded-xl">
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(appt.id, 'cancelled')} className="text-red-600 font-bold rounded-xl">
                              <XCircle className="mr-2 h-4 w-4" /> Mark as Cancelled
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="font-bold rounded-xl">
                              <User className="mr-2 h-4 w-4" /> Client History
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  {(!appointments || appointments.length === 0) && (
                    <div className="p-20 text-center space-y-4">
                      <Calendar className="h-16 w-16 text-secondary/10 mx-auto" />
                      <p className="text-muted-foreground font-medium">No professional visits scheduled for today.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-secondary text-white overflow-hidden">
              <CardHeader className="bg-white/10 p-6 border-b border-white/5">
                <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                  <Users className="h-4 w-4" /> My Active Clients
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {activeCases?.slice(0, 3).map((c) => (
                    <div key={c.id} className="p-4 bg-white/10 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/20 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
                          {c.id.split('-').pop()?.slice(0, 3)}
                        </div>
                        <div>
                          <p className="text-xs font-black leading-none mb-1">{c.caseType}</p>
                          <p className="text-[9px] font-bold opacity-60 uppercase tracking-widest">ID: {c.id}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 opacity-40" />
                    </div>
                  ))}
                  {(!activeCases || activeCases.length === 0) && (
                    <p className="text-center py-6 text-xs font-bold opacity-40 italic">Registry is currently empty.</p>
                  )}
                  <Button variant="link" className="w-full text-white font-black text-[10px] uppercase tracking-[0.2em] mt-2" onClick={() => router.push('/dashboard/lawyer/cases')}>
                    Full Caseload Registry
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] bg-amber-50 p-8 space-y-6 border border-amber-100">
              <div className="space-y-2">
                <h3 className="font-black text-amber-900 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" /> Professional Duty
                </h3>
                <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                  Please update clinic results immediately after each session to maintain system-wide performance metrics.
                </p>
              </div>
              <div className="p-4 bg-white rounded-2xl border border-amber-200 shadow-sm flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Scale className="h-4 w-4 text-amber-700" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-amber-900/40 uppercase">Action Items</p>
                  <p className="text-[11px] font-bold text-amber-900">Cases require review</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}