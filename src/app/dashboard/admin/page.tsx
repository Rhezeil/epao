
"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  BarChart, Bar, Cell, PieChart, Pie, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis
} from "recharts";
import { 
  Briefcase, 
  Activity, PieChart as PieIcon, Lightbulb, 
  Microscope,
  FileSearch,
  Bell,
  Target,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  Inbox,
  CheckCircle2,
  Filter
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format, startOfToday, subDays, isAfter } from "date-fns";

export default function AdminDashboard() {
  const db = useFirestore();
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  // Dashboard State
  const [activeTab, setActiveTab] = useState("analysis");
  const [lawyerSearch, setLawyerSearch] = useState("");
  const [performanceRange, setPerformanceRange] = useState("month");
  const [notifFilter, setNotifFilter] = useState("all");

  // Database Queries
  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "cases"));
  }, [db, user, role]);

  const apptsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "appointments"));
  }, [db, user, role]);

  const lawyersQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "roleLawyer"));
  }, [db, user, role]);

  const notifsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(100));
  }, [db, user, role]);

  const { data: cases } = useCollection(casesQuery);
  const { data: appointments } = useCollection(apptsQuery);
  const { data: lawyers } = useCollection(lawyersQuery);
  const { data: notifications } = useCollection(notifsQuery);

  const screeningAnalysis = useMemo(() => {
    if (!appointments) return { summary: [], reasons: [], total: 0, eligible: 0, ineligible: 0, topReason: "", eligiblePct: "0", ineligiblePct: "0" };
    
    const screeningAppts = appointments.filter(a => a.status === 'Eligible' || a.status === 'Not Eligible');
    const eligible = screeningAppts.filter(a => a.status === 'Eligible');
    const ineligible = screeningAppts.filter(a => a.status === 'Not Eligible');
    
    const reasonsMap: Record<string, number> = {};
    ineligible.forEach(a => {
      const reason = a.screeningDetails?.rejectionReason || "Unspecified";
      reasonsMap[reason] = (reasonsMap[reason] || 0) + 1;
    });
    
    const reasonsData = Object.entries(reasonsMap).map(([name, value]) => ({ name, value }));
    reasonsData.sort((a, b) => b.value - a.value);

    const total = screeningAppts.length;

    return {
      summary: [
        { name: 'Eligible', value: eligible.length, fill: '#10B981' },
        { name: 'Not Eligible', value: ineligible.length, fill: '#EF4444' }
      ],
      reasons: reasonsData,
      total: total,
      eligible: eligible.length,
      ineligible: ineligible.length,
      topReason: reasonsData[0]?.name || "N/A",
      eligiblePct: total > 0 ? ((eligible.length / total) * 100).toFixed(1) : "0",
      ineligiblePct: total > 0 ? ((ineligible.length / total) * 100).toFixed(1) : "0"
    };
  }, [appointments]);

  const filteredNotifs = useMemo(() => {
    if (!notifications) return [];
    if (notifFilter === "all") return notifications;
    return notifications.filter(n => n.type === notifFilter);
  }, [notifications, notifFilter]);

  const performanceRangeStart = useMemo(() => {
    const now = new Date();
    if (performanceRange === "day") return startOfToday();
    if (performanceRange === "week") return subDays(now, 7);
    return subDays(now, 30);
  }, [performanceRange]);

  const isInPerformanceRange = (dateStr: string | undefined) => {
    if (!dateStr) return false;
    try { return isAfter(new Date(dateStr), performanceRangeStart); } catch { return false; }
  };

  const markNotifRead = (id: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "notifications", id), { status: "read" });
  };

  const handleNotifClick = (notif: any) => {
    markNotifRead(notif.id);
    if (notif.type === 'appointment') router.push('/dashboard/admin/appointments');
    if (notif.type === 'case') router.push('/dashboard/admin/users');
    if (notif.type === 'lawyer') router.push('/dashboard/admin/lawyers');
    if (notif.type === 'client') router.push('/dashboard/admin/users');
    if (notif.type === 'system') router.push('/dashboard/admin/triage');
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Activity className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || role !== 'admin') return null;

  return (
    <DashboardLayout role="admin">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 pb-20">
        <div className="xl:col-span-3 space-y-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
              <Target className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary font-headline tracking-tight">System Diagnostic Dashboard</h1>
              <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">Real-time Platform Activity & Operational Analysis</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14 mb-8">
              <TabsTrigger value="analysis" className="rounded-xl font-bold">Screening Analytics</TabsTrigger>
              <TabsTrigger value="workload" className="rounded-xl font-bold">Staff Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden lg:col-span-1">
                  <CardHeader className="bg-primary/5 pb-6">
                    <CardTitle className="text-xs font-black uppercase text-primary flex items-center gap-2">
                      <PieIcon className="h-4 w-4" /> Eligibility Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 flex flex-col items-center">
                    <div className="h-[250px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={screeningAnalysis.summary}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {screeningAnalysis.summary.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                      <div className="text-center p-4 bg-emerald-50 rounded-2xl">
                        <p className="text-[10px] font-black text-emerald-600 uppercase">Eligible</p>
                        <p className="text-2xl font-black text-emerald-700">{screeningAnalysis.eligiblePct}%</p>
                      </div>
                      <div className="text-center p-4 bg-rose-50 rounded-2xl">
                        <p className="text-[10px] font-black text-rose-600 uppercase">Ineligible</p>
                        <p className="text-2xl font-black text-rose-700">{screeningAnalysis.ineligiblePct}%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden lg:col-span-2">
                  <CardHeader className="bg-primary/5 pb-6 border-b border-primary/5">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xs font-black uppercase text-primary flex items-center gap-2">
                        <FileSearch className="h-4 w-4" /> Root Causes of Denial
                      </CardTitle>
                      <Badge variant="outline" className="border-rose-200 text-rose-700 bg-rose-50 font-black text-[9px]">TOP: {screeningAnalysis.topReason}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10">
                    <div className="h-[300px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={screeningAnalysis.reasons} layout="vertical" margin={{ left: 40 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 700, fill: '#1A237E' }} width={120} />
                          <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="value" fill="#EF4444" radius={[0, 10, 10, 0]} barSize={20}>
                            {screeningAnalysis.reasons.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={index === 0 ? '#B91C1C' : '#EF4444'} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="workload">
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 px-10 pt-8 border-b">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1 w-full space-y-4">
                      <CardTitle className="text-xl font-bold text-primary flex items-center gap-2"><Briefcase className="h-6 w-6" /> Lawyer Operational Status</CardTitle>
                      <div className="flex gap-4">
                        <Input placeholder="Search Attorney..." className="max-w-xs h-11 rounded-xl" value={lawyerSearch} onChange={e => setLawyerSearch(e.target.value)} />
                        <Select value={performanceRange} onValueChange={setPerformanceRange}>
                          <SelectTrigger className="h-11 w-[180px] rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="day" className="font-bold">Today</SelectItem><SelectItem value="week" className="font-bold">Last 7 Days</SelectItem><SelectItem value="month" className="font-bold">Last 30 Days</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest text-primary/40">Attorney Profile</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Visits Handled</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Active Cases</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lawyers?.filter(l => (l.firstName + l.lastName).toLowerCase().includes(lawyerSearch.toLowerCase())).map((lawyer) => {
                        const lAppts = (appointments?.filter(a => a.lawyerId === lawyer.id) || []).filter(a => isInPerformanceRange(a.date));
                        const lCases = cases?.filter(c => c.lawyerId === lawyer.id && c.status === 'Active') || [];
                        return (
                          <TableRow key={lawyer.id} className="hover:bg-primary/5 transition-colors">
                            <TableCell className="px-10 py-6">
                              <p className="font-black text-primary leading-none">Atty. {lawyer.firstName} {lawyer.lastName}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{lawyer.email}</p>
                            </TableCell>
                            <TableCell className="text-center font-black text-lg">{lAppts.length}</TableCell>
                            <TableCell className="text-center font-black text-lg text-secondary">{lCases.length}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="xl:col-span-1 space-y-6">
          <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-24">
            <CardHeader className="bg-primary p-8 text-white shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Bell className="h-6 w-6 text-white/60" />
                  <CardTitle className="text-xl font-black">System Audit</CardTitle>
                </div>
                <Badge className="bg-white/20 text-white border-none font-black text-[10px]">{notifications?.filter(n => n.status === 'unread').length || 0} NEW</Badge>
              </div>
              <div className="mt-6">
                <Select value={notifFilter} onValueChange={setNotifFilter}>
                  <SelectTrigger className="h-10 bg-white/10 border-none text-white text-xs font-black rounded-xl focus:ring-0 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <Filter className="h-3 w-3" />
                      <SelectValue placeholder="All Activities" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="font-bold">All Activities</SelectItem>
                    <SelectItem value="appointment" className="font-bold text-blue-600">Appointments</SelectItem>
                    <SelectItem value="case" className="font-bold text-green-600">Cases</SelectItem>
                    <SelectItem value="lawyer" className="font-bold text-purple-600">Lawyer Action</SelectItem>
                    <SelectItem value="client" className="font-bold text-amber-600">Client Action</SelectItem>
                    <SelectItem value="system" className="font-bold text-slate-600">System Logs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto flex-1 divide-y divide-primary/5">
              {filteredNotifs.length > 0 ? (
                filteredNotifs.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={cn(
                      "p-6 transition-all cursor-pointer hover:bg-primary/[0.02] relative group",
                      notif.status === 'unread' && "bg-amber-50/30"
                    )}
                    onClick={() => handleNotifClick(notif)}
                  >
                    {notif.status === 'unread' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />}
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 border-none shadow-sm",
                        notif.type === 'appointment' ? 'bg-blue-100 text-blue-700' :
                        notif.type === 'case' ? 'bg-green-100 text-green-700' :
                        notif.type === 'lawyer' ? 'bg-purple-100 text-purple-700' :
                        notif.type === 'client' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                      )}>
                        {notif.type}
                      </Badge>
                      <span className="text-[9px] font-black text-muted-foreground uppercase">{notif.createdAt ? format(new Date(notif.createdAt), "HH:mm") : '---'}</span>
                    </div>
                    <p className="text-sm font-bold text-primary leading-snug group-hover:underline">{notif.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <div className="flex items-center gap-1.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary/20" />
                        <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest">{notif.userRole}</p>
                      </div>
                      <div className="flex items-center gap-1 text-secondary">
                        <ArrowRight className="h-3 w-3" />
                        <span className="text-[9px] font-black">{notif.referenceCode || "View Record"}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-4">
                  <Inbox className="h-12 w-12 text-primary/5 mx-auto" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">No activities logged</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
