
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, orderBy, doc } from "firebase/firestore";
import { format } from "date-fns";
import { 
  Calendar, Clock, CheckCircle2, XCircle, MoreVertical, 
  FileText, Users, Briefcase, TrendingUp, AlertCircle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuTrigger, DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function LawyerDashboard() {
  const { user, role } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const apptsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(
      collection(db, "appointments"), 
      where("lawyerId", "==", user.uid),
      orderBy("date", "asc")
    );
  }, [db, user, role]);

  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "cases"), where("lawyerId", "==", user.uid));
  }, [db, user, role]);

  const { data: appointments, isLoading: isApptsLoading } = useCollection(apptsQuery);
  const { data: cases } = useCollection(casesQuery);

  const updateStatus = (apptId: string, status: string) => {
    if (!db) return;
    const ref = doc(db, "appointments", apptId);
    updateDocumentNonBlocking(ref, { status });
    toast({ title: `Status Updated`, description: `Appointment marked as ${status}.` });
  };

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Lawyer Portal</h1>
            <p className="text-muted-foreground font-medium">Manage your caseload and legal schedule for today.</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-none px-4 py-2 rounded-full font-bold">
            Public Attorney II
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm rounded-3xl bg-primary text-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl"><Briefcase className="h-6 w-6" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">My Caseload</p>
                <p className="text-2xl font-black">{cases?.length || 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-secondary text-white">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl"><Calendar className="h-6 w-6" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Today's Visits</p>
                <p className="text-2xl font-black">
                  {appointments?.filter(a => format(new Date(a.date), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")).length || 0}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm rounded-3xl bg-white">
            <CardContent className="p-6 flex items-center gap-4 text-primary">
              <div className="p-3 bg-primary/5 rounded-2xl"><TrendingUp className="h-6 w-6" /></div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monthly Efficiency</p>
                <p className="text-2xl font-black">94%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
              <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Daily Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isApptsLoading ? <div className="p-12 text-center"><AlertCircle className="animate-spin h-8 w-8 mx-auto text-primary/20" /></div> : (
                <div className="divide-y divide-primary/5">
                  {appointments?.map((appt) => (
                    <div key={appt.id} className="p-6 flex items-center justify-between hover:bg-primary/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-primary/5 flex flex-col items-center justify-center border border-primary/10">
                          <span className="text-[10px] font-black text-primary uppercase leading-none">{format(new Date(appt.date), "MMM")}</span>
                          <span className="text-xl font-black text-primary leading-none mt-1">{format(new Date(appt.date), "dd")}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-primary">{appt.guestName || appt.clientName || "Client"}</h4>
                          <p className="text-xs text-muted-foreground font-medium">{appt.caseType}</p>
                          <Badge variant="outline" className="mt-1 text-[9px] font-black uppercase py-0">{appt.status}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right hidden sm:block">
                          <p className="text-sm font-black text-primary">{appt.time}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase">Time Slot</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-xl"><MoreVertical className="h-4 w-4" /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuItem onClick={() => updateStatus(appt.id, 'completed')} className="text-green-600 font-bold">
                              <CheckCircle2 className="mr-2 h-4 w-4" /> Mark Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => updateStatus(appt.id, 'cancelled')} className="text-red-600 font-bold">
                              <XCircle className="mr-2 h-4 w-4" /> Mark Cancelled
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="font-bold">View Case File</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  {(!appointments || appointments.length === 0) && (
                    <div className="p-12 text-center space-y-2">
                      <Calendar className="h-12 w-12 text-primary/10 mx-auto" />
                      <p className="text-muted-foreground font-medium">No appointments scheduled for this period.</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-amber-50/50 p-6 space-y-4 border border-amber-100">
              <h3 className="font-bold text-amber-900 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" /> Operational Alerts
              </h3>
              <div className="space-y-3">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-amber-200">
                  <p className="text-[10px] font-black text-amber-900/40 uppercase tracking-widest">New Assignment</p>
                  <p className="text-xs text-amber-900 font-bold leading-tight">A new case has been assigned to your caseload today.</p>
                </div>
                <div className="p-3 bg-white rounded-xl shadow-sm border border-amber-200">
                  <p className="text-[10px] font-black text-amber-900/40 uppercase tracking-widest">Client Filing</p>
                  <p className="text-xs text-amber-900 font-bold leading-tight">New evidence uploaded for Case ID: {cases?.[0]?.id || "---"}.</p>
                </div>
              </div>
            </Card>

            <Card className="border-none shadow-xl rounded-[2.5rem] bg-[#1A237E] p-8 text-white space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-black tracking-tight">Lawyer Schedule</h3>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Public Calendar Controls</p>
              </div>
              <p className="text-xs text-white/80 leading-relaxed font-medium">
                Manage your availability by blocking specific slots to ensure balanced daily clinical load.
              </p>
              <Button className="w-full bg-white text-primary hover:bg-white/90 font-black rounded-xl shadow-lg">
                Manage Availability
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
