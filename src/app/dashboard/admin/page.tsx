
"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, setDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc, limit } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { 
  BarChart, Bar, Cell, PieChart, Pie, Tooltip, ResponsiveContainer, CartesianGrid, XAxis, YAxis
} from "recharts";
import { 
  Briefcase, 
  Activity, PieChart as PieIcon, 
  FileSearch,
  Bell,
  Target,
  Clock,
  ArrowRight,
  ShieldCheck,
  User,
  Inbox,
  CheckCircle2,
  Filter,
  Loader2,
  XCircle,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format, startOfToday, subDays, isAfter } from "date-fns";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";

/**
 * Maps raw rejection reasons to standardized statutory categories for the bar chart.
 */
const mapToStandardCategory = (reason: string) => {
  if (!reason) return "Procedural Disqualification";
  const r = reason.toLowerCase();
  
  if (r.includes("income") || r.includes("indigency") || r.includes("means test") || r.includes("threshold")) {
    return "Non-Indigent (Failed Means Test)";
  }
  if (r.includes("jurisdiction") || r.includes("not covered") || r.includes("merit") || r.includes("scope")) {
    return "Case Not Covered / Not Qualified";
  }
  if (r.includes("document") || r.includes("identification") || r.includes("proof") || r.includes("requirements") || r.includes("id")) {
    return "Incomplete Requirements";
  }
  if (r.includes("conflict")) {
    return "Conflict of Interest";
  }
  if (r.includes("false") || r.includes("misrepresentation") || r.includes("fraud") || r.includes("deceit")) {
    return "Misrepresentation / False Information";
  }
  return "Procedural Disqualification";
};

export default function AdminDashboard() {
  const db = useFirestore();
  const { user, role, loading } = useAuth();
  const router = useRouter();
  
  // Dashboard State
  const [activeTab, setActiveTab] = useState("analysis");
  const [lawyerSearch, setLawyerSearch] = useState("");
  const [performanceRange, setPerformanceRange] = useState("month");
  const [notifFilter, setNotifFilter] = useState("all");

  // Interactive Analytics State
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [isInsightOpen, setIsInsightOpen] = useState(false);

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

  const performanceRangeStart = useMemo(() => {
    const now = new Date();
    if (performanceRange === "day") return startOfToday();
    if (performanceRange === "week") return subDays(now, 7);
    return subDays(now, 30);
  }, [performanceRange]);

  // Optimized Analysis Pre-processing
  const analyticsData = useMemo(() => {
    if (!appointments || !cases || !lawyers) return null;

    // 1. Intake Analysis - Broadened criteria to include all successful outcomes
    const intakeResults = appointments.filter(a => 
      ['Eligible', 'Not Eligible', 'Consultation in Progress', 'Completed Consultation – Accept Legal Assistance', 'Completed Consultation – Denial of Legal Assistance', 'completed', 'For Screening'].includes(a.status) || 
      a.caseId
    );
    
    const eligible = intakeResults.filter(a => 
      ['Eligible', 'Consultation in Progress', 'Completed Consultation – Accept Legal Assistance', 'completed'].includes(a.status) || 
      a.caseId
    );
    
    const ineligible = intakeResults.filter(a => 
      ['Not Eligible', 'Completed Consultation – Denial of Legal Assistance'].includes(a.status)
    );
    
    const reasonsMap: Record<string, number> = {};
    ineligible.forEach(a => {
      const fullReason = a.screeningDetails?.rejectionReason || a.denialReason || "Procedural Disqualification";
      const standardCategory = mapToStandardCategory(fullReason);
      reasonsMap[standardCategory] = (reasonsMap[standardCategory] || 0) + 1;
    });
    
    const reasonsData = Object.entries(reasonsMap).map(([name, value]) => ({ 
      name,
      value,
      percentage: ineligible.length > 0 ? ((value / ineligible.length) * 100).toFixed(1) : "0"
    }));
    reasonsData.sort((a, b) => b.value - a.value);

    // 2. Lawyer Workload (Single Pass)
    const apptCountByLawyer: Record<string, number> = {};
    const activeCaseByLawyer: Record<string, number> = {};

    appointments.forEach(a => {
      if (!a.lawyerId) return;
      try {
        if (isAfter(new Date(a.date), performanceRangeStart)) {
          apptCountByLawyer[a.lawyerId] = (apptCountByLawyer[a.lawyerId] || 0) + 1;
        }
      } catch (e) {}
    });

    cases.forEach(c => {
      if (!c.lawyerId || c.status !== 'Active') return;
      activeCaseByLawyer[c.lawyerId] = (activeCaseByLawyer[c.lawyerId] || 0) + 1;
    });

    const eligiblePct = intakeResults.length > 0 ? ((eligible.length / intakeResults.length) * 100).toFixed(1) : "0";
    const ineligiblePct = intakeResults.length > 0 ? ((ineligible.length / intakeResults.length) * 100).toFixed(1) : "0";
    
    // Auto-generated Insights
    const dynamicInsight = parseFloat(eligiblePct) > 70 
      ? "Strong qualification trend: Public outreach matches office mandate."
      : parseFloat(eligiblePct) < 40 
      ? "High rejection rate: Possible public misinformation on requirements."
      : "Standard intake distribution observed.";

    return {
      screening: {
        summary: [
          { name: 'Eligible', value: eligible.length, fill: '#10B981', insight: dynamicInsight },
          { name: 'Ineligible', value: ineligible.length, fill: '#EF4444', insight: "Root cause analysis recommended for denials." }
        ],
        reasons: reasonsData,
        total: intakeResults.length,
        eligiblePct,
        ineligiblePct,
        topReason: reasonsData[0]?.name || "N/A"
      },
      workload: {
        appts: apptCountByLawyer,
        cases: activeCaseByLawyer
      }
    };
  }, [appointments, cases, lawyers, performanceRangeStart]);

  const filteredNotifs = useMemo(() => {
    if (!notifications) return [];
    if (notifFilter === "all") return notifications;
    return notifications.filter(n => n.type === notifFilter);
  }, [notifications, notifFilter]);

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
              <h1 className="text-3xl font-black text-primary font-headline tracking-tight">System Command Center</h1>
              <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">Real-time Platform Activity & Operational Analysis</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14 mb-8">
              <TabsTrigger value="analysis" className="rounded-xl font-bold">Intake Analysis</TabsTrigger>
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
                    {!analyticsData ? <Loader2 className="animate-spin h-10 w-10 text-primary/20 my-20" /> : (
                      <>
                        <div className="h-[250px] w-full cursor-pointer">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={analyticsData.screening.summary}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                                stroke="none"
                                onClick={(data) => {
                                  setSelectedInsight(data);
                                  setIsInsightOpen(true);
                                }}
                              >
                                {analyticsData.screening.summary.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.fill} className="hover:opacity-80 transition-opacity" />
                                ))}
                              </Pie>
                              <Tooltip 
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload;
                                    return (
                                      <div className="bg-white p-4 rounded-2xl shadow-2xl border border-primary/5 space-y-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-primary/40">{data.name}</p>
                                        <p className="text-xl font-black text-primary">{data.value} Clients</p>
                                        <p className="text-[9px] font-bold text-muted-foreground max-w-[150px] leading-tight italic">"{data.insight}"</p>
                                      </div>
                                    );
                                  }
                                  return null;
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="grid grid-cols-2 gap-4 w-full mt-4">
                          <div className="text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 shadow-sm transition-transform hover:scale-105">
                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Eligible</p>
                            <p className="text-2xl font-black text-emerald-700">{analyticsData.screening.eligiblePct}%</p>
                          </div>
                          <div className="text-center p-4 bg-rose-50 rounded-2xl border border-rose-100 shadow-sm transition-transform hover:scale-105">
                            <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Ineligible</p>
                            <p className="text-2xl font-black text-rose-700">{analyticsData.screening.ineligiblePct}%</p>
                          </div>
                        </div>
                        <p className="mt-6 text-[9px] text-muted-foreground font-black uppercase tracking-[0.2em] animate-pulse">Click segments for detailed factors</p>
                      </>
                    )}
                  </CardContent>
                </Card>

                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden lg:col-span-2">
                  <CardHeader className="bg-primary/5 pb-6 border-b border-primary/5">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xs font-black uppercase text-primary flex items-center gap-2">
                        <FileSearch className="h-4 w-4" /> Root Causes of Ineligibility
                      </CardTitle>
                      <Badge variant="outline" className="border-rose-200 text-rose-700 bg-rose-50 font-black text-[9px]">TOP: {analyticsData?.screening.topReason || '---'}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-10">
                    {!analyticsData ? <Loader2 className="animate-spin h-10 w-10 text-primary/20 my-20" /> : (
                      <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={analyticsData.screening.reasons} layout="vertical" margin={{ left: 40, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#F1F5F9" />
                            <XAxis type="number" hide />
                            <YAxis 
                              dataKey="name" 
                              type="category" 
                              axisLine={false} 
                              tickLine={false} 
                              tick={{ fontSize: 8, fontWeight: 700, fill: '#1A237E' }} 
                              width={150} 
                            />
                            <Tooltip 
                              cursor={{ fill: 'transparent' }} 
                              contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} 
                              labelStyle={{ fontWeight: 'black', color: '#1A237E' }}
                            />
                            <Bar dataKey="value" fill="#EF4444" radius={[0, 10, 10, 0]} barSize={20}>
                              {analyticsData.screening.reasons.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? '#B91C1C' : '#EF4444'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="workload">
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 px-10 pt-8 border-b">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1 w-full space-y-4">
                      <CardTitle className="text-xl font-bold text-primary flex items-center gap-2"><Briefcase className="h-6 w-6" /> Staff Operational Status</CardTitle>
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
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Intakes Handled</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Active Cases</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lawyers?.filter(l => (l.firstName + ' ' + l.lastName).toLowerCase().includes(lawyerSearch.toLowerCase())).map((lawyer) => {
                        const apptCount = analyticsData?.workload.appts[lawyer.id] || 0;
                        const caseCount = analyticsData?.workload.cases[lawyer.id] || 0;
                        return (
                          <TableRow key={lawyer.id} className="hover:bg-primary/5 transition-colors">
                            <TableCell className="px-10 py-6">
                              <p className="font-black text-primary leading-none">Atty. {lawyer.firstName} {lawyer.lastName}</p>
                              <p className="text-[10px] text-muted-foreground mt-1">{lawyer.email}</p>
                            </TableCell>
                            <TableCell className="text-center font-black text-lg">{apptCount}</TableCell>
                            <TableCell className="text-center font-black text-lg text-secondary">{caseCount}</TableCell>
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
                    <SelectItem value="lawyer" className="font-bold text-purple-600">Staff Actions</SelectItem>
                    <SelectItem value="client" className="font-bold text-amber-600">Client Actions</SelectItem>
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
                        <span className="text-[9px] font-black">{notif.referenceCode || "View Detail"}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-4">
                  <Inbox className="h-12 w-12 text-primary/5 mx-auto" />
                  <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">No activities recorded</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- INTERACTIVE ANALYTICS DRILL-DOWN --- */}
      <Dialog open={isInsightOpen} onOpenChange={setIsInsightOpen}>
        <DialogContent className="rounded-[3rem] max-w-4xl p-0 overflow-hidden border-none shadow-2xl flex flex-col max-h-[90vh]">
          <DialogHeader className={cn(
            "p-10 text-white flex flex-row items-center justify-between",
            selectedInsight?.name === 'Eligible' ? "bg-emerald-600" : "bg-rose-600"
          )}>
            <div className="space-y-1">
              <DialogTitle className="text-4xl font-black tracking-tighter">
                {selectedInsight?.name} Segment Analysis
              </DialogTitle>
              <DialogDescription className="text-white/60 font-black uppercase tracking-[0.2em] text-xs">
                Diagnostic Factors & Supporting Statistics
              </DialogDescription>
            </div>
            <div className="p-4 bg-white/20 rounded-[2rem]">
              {selectedInsight?.name === 'Eligible' ? <ShieldCheck className="h-10 w-10" /> : <XCircle className="h-10 w-10" />}
            </div>
          </DialogHeader>
          <div className="p-10 space-y-10 flex-1 overflow-y-auto">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-none bg-muted/30 rounded-[2rem] p-6 text-center">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Raw Volume</p>
                <p className="text-4xl font-black text-primary">{selectedInsight?.value}</p>
                <p className="text-[9px] font-bold text-muted-foreground mt-2 uppercase">Total Applicants</p>
              </Card>
              <Card className="border-none bg-muted/30 rounded-[2rem] p-6 text-center">
                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-1">Percentage Share</p>
                <p className="text-4xl font-black text-secondary">
                  {analyticsData ? (selectedInsight?.name === 'Eligible' ? analyticsData.screening.eligiblePct : analyticsData.screening.ineligiblePct) : '0'}%
                </p>
                <p className="text-[9px] font-bold text-muted-foreground mt-2 uppercase">Of Screened Intakes</p>
              </Card>
              <Card className="border-none bg-muted/30 rounded-[2rem] p-6 text-center flex flex-col justify-center">
                <div className="flex items-center justify-center gap-2 text-primary font-black uppercase text-[10px] mb-2 tracking-widest">
                  <TrendingUp className="h-3 w-3" /> Trend
                </div>
                <p className="text-xs font-bold leading-tight px-4">{selectedInsight?.insight}</p>
              </Card>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-primary/5 pb-4">
                <div className="p-2 bg-primary/5 rounded-xl text-primary"><AlertTriangle className="h-5 w-5" /></div>
                <h4 className="text-sm font-black uppercase tracking-widest text-primary">Contributing Factors</h4>
              </div>
              
              {selectedInsight?.name === 'Ineligible' ? (
                <div className="grid gap-4">
                  {analyticsData?.screening.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center justify-between p-5 bg-rose-50 rounded-2xl border border-rose-100 group transition-all hover:bg-rose-100/50">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-rose-900 leading-none">{reason.name}</p>
                        <p className="text-[10px] text-rose-700 font-bold uppercase tracking-widest">{reason.value} Occurrences</p>
                      </div>
                      <Badge className="bg-rose-600 text-white border-none font-black text-xs px-4 py-1.5 rounded-xl shadow-sm">
                        {reason.percentage}%
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-4">
                  <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100 space-y-2">
                    <p className="font-black text-emerald-900 text-base">Verified Merit & Indigency</p>
                    <p className="text-xs text-emerald-700 font-medium leading-relaxed italic">The majority of applicants in this segment successfully satisfied the statutory income threshold and presented cases within PAO's legal jurisdiction.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-8 bg-primary/5 rounded-[2.5rem] border-2 border-dashed border-primary/10 space-y-4">
              <div className="flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-primary" />
                <h4 className="text-sm font-black uppercase tracking-widest text-primary">Administrative Recommendations</h4>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><ArrowUpRight className="h-3 w-3 text-primary" /></div>
                  <p className="text-xs text-muted-foreground font-bold">
                    {selectedInsight?.name === 'Ineligible' 
                      ? "Enhance public awareness campaigns detailing required documents to reduce 'Missing Proof' rejections." 
                      : "Allocate additional paralegal staff to speed up the transition from eligibility to consultation."}
                  </p>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5"><ArrowUpRight className="h-3 w-3 text-primary" /></div>
                  <p className="text-xs text-muted-foreground font-bold">
                    {selectedInsight?.name === 'Ineligible' 
                      ? "Audit the 'Income Threshold' denials to determine if regional minimum wage adjustments are reflected in screening guidelines." 
                      : "Scale up legal standards seeding for dominant case classifications observed this month."}
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/30">
            <Button onClick={() => setIsInsightOpen(false)} className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl hover:scale-[1.02] transition-transform">
              Close Segment Analysis
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
