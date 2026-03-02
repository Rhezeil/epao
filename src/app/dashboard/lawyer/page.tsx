
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useDoc } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, addDays } from "date-fns";
import { 
  Calendar, Clock, CheckCircle2, XCircle, MoreVertical, 
  Briefcase, Scale, User, ChevronRight, Loader2,
  CalendarDays, CalendarRange, Filter
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
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LawyerDashboard() {
  const { user, role, loading } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const router = useRouter();
  const [scheduleView, setScheduleView] = useState<"daily" | "weekly" | "monthly">("daily");

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

  const { data: appointments, isLoading: isApptsLoading } = useCollection(apptsQuery);
  const { data: activeCases } = useCollection(casesQuery);

  const filteredSchedule = useMemo(() => {
    if (!appointments) return [];
    const now = new Date();
    
    return appointments.filter(appt => {
      const apptDate = new Date(appt.date);
      if (scheduleView === "daily") {
        return format(apptDate, "yyyy-MM-dd") === format(now, "yyyy-MM-dd");
      }
      if (scheduleView === "weekly") {
        const start = startOfWeek(now, { weekStartsOn: 1 });
        const end = endOfWeek(now, { weekStartsOn: 1 });
        return isWithinInterval(apptDate, { start, end });
      }
      if (scheduleView === "monthly") {
        const start = startOfMonth(now);
        const end = endOfMonth(now);
        return isWithinInterval(apptDate, { start, end });
      }
      return true;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [appointments, scheduleView]);

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

  const updateStatus = (apptId: string, status: string) => {
    if (!db) return;
    const ref = doc(db, "appointments", apptId);
    updateDocumentNonBlocking(ref, { status });
    toast({ title: `Status Updated`, description: `Appointment marked as ${status}.` });
  };

  const handleSetAvailability = (status: "Available" | "Onsite" | "On Leave") => {
    if (!db || !user) return;
    const ref = doc(db, "roleLawyer", user.uid);
    updateDocumentNonBlocking(ref, { status });
    toast({ 
      title: "Availability Updated", 
      description: `Your status has been set to ${status}.` 
    });
  };

  const isLeave = lawyerData?.status === 'On Leave';

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
              <div className="flex items-center gap-2 mt-1">
                <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.2em]">Professional Staff Workstation</p>
                <Badge variant="outline" className={cn(
                  "font-black text-[9px] uppercase px-2 py-0 border-secondary/20",
                  isLeave ? "text-amber-600 bg-amber-50" : "text-secondary bg-secondary/5"
                )}>
                  {lawyerData?.status || "Available"}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className={cn(
                  "rounded-full font-black text-[10px] uppercase tracking-widest shadow-md transition-colors px-6 h-11",
                  isLeave ? "bg-amber-500 hover:bg-amber-600" : "bg-secondary hover:bg-secondary/90"
                )}>
                  Update Availability
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2">
                <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">Set Duty Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleSetAvailability("Available")} className="rounded-xl font-bold cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-green-500 mr-2" /> Mark Available
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetAvailability("Onsite")} className="rounded-xl font-bold cursor-pointer">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-2" /> Mark Onsite
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetAvailability("On Leave")} className="rounded-xl font-bold cursor-pointer text-amber-600">
                  <div className="w-2 h-2 rounded-full bg-amber-500 mr-2" /> Mark On Leave
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-secondary text-white rounded-xl">
                    <Clock className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg font-bold text-secondary">Clinical Schedule</CardTitle>
                </div>
                
                <Tabs value={scheduleView} onValueChange={(v) => setScheduleView(v as any)} className="w-full sm:w-auto">
                  <TabsList className="bg-white/50 border border-secondary/10 rounded-xl h-10 p-1">
                    <TabsTrigger value="daily" className="rounded-lg text-[10px] font-black uppercase data-[state=active]:bg-secondary data-[state=active]:text-white">Daily</TabsTrigger>
                    <TabsTrigger value="weekly" className="rounded-lg text-[10px] font-black uppercase data-[state=active]:bg-secondary data-[state=active]:text-white">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly" className="rounded-lg text-[10px] font-black uppercase data-[state=active]:bg-secondary data-[state=active]:text-white">Monthly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isApptsLoading ? (
                <div className="p-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-secondary/20" /></div>
              ) : (
                <div className="divide-y divide-secondary/5">
                  {filteredSchedule.map((appt) => (
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
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                            {scheduleView === 'daily' ? 'Reserved Slot' : format(new Date(appt.date), "EEEE")}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl hover:bg-secondary/5">
                              <MoreVertical className="h-4 w-4 text-secondary" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2">
                            <DropdownMenuItem onClick={() => updateStatus(appt.id, 'completed')} className="text-green-600 font-bold rounded-xl cursor-pointer">
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(appt.id, 'cancelled')} className="text-red-600 font-bold rounded-xl cursor-pointer">
                              <XCircle className="mr-2 h-4 w-4" /> Mark as Cancelled
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="font-bold rounded-xl cursor-pointer">
                              <User className="mr-2 h-4 w-4" /> Client History
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  {filteredSchedule.length === 0 && (
                    <div className="p-20 text-center space-y-4">
                      {scheduleView === 'daily' ? <CalendarDays className="h-16 w-16 text-secondary/10 mx-auto" /> : <CalendarRange className="h-16 w-16 text-secondary/10 mx-auto" />}
                      <p className="text-sm font-bold text-muted-foreground">
                        {scheduleView === 'daily' ? 'No consultations scheduled for today.' : 
                         scheduleView === 'weekly' ? 'No appointments found for this week.' : 'No records for the selected month.'}
                      </p>
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
                  <User className="h-4 w-4" /> Active Clients ({activeCases?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {activeCases?.slice(0, 5).map((c) => (
                    <div key={c.id} className="p-4 bg-white/10 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/20 transition-all cursor-pointer" onClick={() => router.push('/dashboard/lawyer/cases')}>
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
                  <Filter className="h-5 w-5" /> Professional Duty
                </h3>
                <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                  Toggle your availability to manage clinic walk-ins. Status changes are reflected in the public portal immediately.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                <Button variant="outline" size="sm" className="rounded-xl font-bold bg-white" onClick={() => setScheduleView("daily")}>Today's Session</Button>
                <Button variant="outline" size="sm" className="rounded-xl font-bold bg-white" onClick={() => router.push('/dashboard/lawyer/cases')}>Open Full Registry</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
