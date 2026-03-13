
"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc, limit } from "firebase/firestore";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, ReferenceLine, Legend, BarChart, Bar, Cell, PieChart, Pie
} from "recharts";
import { 
  ShieldCheck, Users, Briefcase, Calendar, 
  TrendingUp, Filter, ArrowUpRight, ArrowDownRight, 
  Scale, Gavel, Loader2, Search, Clock, 
  Activity, PieChart as PieIcon, Sparkles, AlertCircle,
  TrendingDown, BrainCircuit, BarChart3, CheckCircle2,
  ListChecks, Lightbulb, Info, FileText, CalendarCheck,
  Zap, Target, Layers, ArrowRight, ChevronDown, Bell, Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { format, subMonths, addMonths, parseISO, startOfToday, subDays, isAfter } from "date-fns";
import { caseCategories } from "@/app/lib/case-data";

const calculateTrend = (data: { x: number, y: number }[]) => {
  if (data.length < 2) return { slope: 0, intercept: data[0]?.y || 0 };
  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (let i = 0; i < n; i++) {
    sumX += data[i].x;
    sumY += data[i].y;
    sumXY += data[i].x * data[i].y;
    sumXX += data[i].x * data[i].x;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
};

export default function AdminDashboard() {
  const db = useFirestore();
  const { user, role, loading } = useAuth();
  
  // Dashboard State
  const [activeTab, setActiveTab] = useState("forecast");
  const [lawyerSearch, setLawyerSearch] = useState("");
  const [forecastCategory, setForecastCategory] = useState("all");
  const [performanceRange, setPerformanceRange] = useState("month");
  const [notifFilter, setNotifFilter] = useState("all");
  
  // Deep Analysis Modal State
  const [deepAnalysis, setDeepAnalysis] = useState<{
    isOpen: boolean;
    title: string;
    data: any;
    type: 'demand' | 'category' | 'appointment';
  }>({
    isOpen: false,
    title: "",
    data: null,
    type: 'demand'
  });

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
    return query(collection(db, "notifications"), orderBy("createdAt", "desc"), limit(50));
  }, [db, user, role]);

  const { data: cases } = useCollection(casesQuery);
  const { data: appointments } = useCollection(apptsQuery);
  const { data: lawyers } = useCollection(lawyersQuery);
  const { data: notifications } = useCollection(notifsQuery);

  const forecastData = useMemo(() => {
    if (!cases) return [];
    const filteredCases = cases.filter(c => {
      const matchCat = forecastCategory === "all" || Object.keys(caseCategories).find(cat => 
        (caseCategories as any)[cat].some((group: any) => group.items.includes(c.caseType))
      ) === forecastCategory;
      return matchCat;
    });

    const months = [];
    for (let i = 5; i >= 0; i--) months.push(format(subMonths(new Date(), i), "yyyy-MM"));

    const historical = months.map((m, index) => {
      const count = filteredCases.filter(c => c.createdAt && c.createdAt.startsWith(m)).length;
      return { month: m, count, x: index, isForecast: false, label: format(parseISO(`${m}-01`), 'MMMM yyyy') };
    });

    const trend = calculateTrend(historical.map(d => ({ x: d.x, y: d.count })));
    const predictions = [];
    for (let i = 1; i <= 3; i++) {
      const futureMonth = format(addMonths(new Date(), i), "yyyy-MM");
      const x = historical.length + i - 1;
      const predictedCount = Math.max(0, Math.round(trend.slope * x + trend.intercept));
      predictions.push({
        month: futureMonth,
        count: predictedCount,
        x: x,
        isForecast: true,
        label: format(parseISO(`${futureMonth}-01`), 'MMMM yyyy')
      });
    }
    return [...historical, ...predictions];
  }, [cases, forecastCategory]);

  const categoryBreakdown = useMemo(() => {
    if (!cases) return [];
    return Object.keys(caseCategories).map(cat => {
      const count = cases.filter(c => 
        (caseCategories as any)[cat].some((group: any) => group.items.includes(c.caseType))
      ).length;
      return { name: cat, value: count };
    }).sort((a, b) => b.value - a.value);
  }, [cases]);

  const apptLifecycle = useMemo(() => {
    if (!appointments) return [];
    const statuses = ['pending', 'scheduled', 'completed', 'cancelled', 'rescheduled'];
    return statuses.map(s => ({
      name: s.charAt(0).toUpperCase() + s.slice(1),
      value: appointments.filter(a => a.status === s).length
    }));
  }, [appointments]);

  const filteredNotifs = useMemo(() => {
    if (!notifications) return [];
    if (notifFilter === "all") return notifications;
    return notifications.filter(n => n.type === notifFilter);
  }, [notifications, notifFilter]);

  const getTrendSummary = (data: any[], key: string = 'count') => {
    if (data.length < 2) return { label: "Stable", color: "text-muted-foreground", icon: Activity };
    const historicalPoints = data.filter(d => !d.isForecast);
    if (historicalPoints.length < 2) return { label: "Stable", color: "text-muted-foreground", icon: Activity };
    const first = historicalPoints[0][key];
    const last = historicalPoints[historicalPoints.length - 1][key];
    const diff = last - first;
    if (diff > 0) return { label: "Increasing Demand", color: "text-red-600", icon: TrendingUp, desc: `Volume increased by ${Math.abs(diff)} units.` };
    if (diff < 0) return { label: "Decreasing Trend", color: "text-green-600", icon: TrendingDown, desc: `Volume decreased by ${Math.abs(diff)} units.` };
    return { label: "Stable Distribution", color: "text-blue-600", icon: Activity, desc: "Resource consumption remains consistent." };
  };

  const handleChartClick = (data: any, type: 'demand' | 'category' | 'appointment') => {
    if (!data) return;
    setDeepAnalysis({ isOpen: true, title: `Analysis: ${data.label || data.name || 'Segment'}`, data: data, type: type });
  };

  const getInsight = (type: string, data: any) => {
    const val = data?.count || data?.value || 0;
    const name = data?.name || data?.label || "this segment";

    if (type === 'demand') {
      if (val > 10) return `Significant intake volume detected for ${name}. Administrative oversight should ensure that triage processing times remain within target KPIs to avoid backlogs.`;
      if (val > 0) return `Stable demand for ${name}. Current resources are well-aligned with the intake rate. No structural shifts required at this time.`;
      return `Zero intake recorded for ${name}. This may indicate a reporting delay or a temporary shift in public demand for legal assistance in this specific period.`;
    }

    if (type === 'category') {
      const total = cases?.length || 1;
      const ratio = val / total;
      if (ratio > 0.3) return `${name} represents a major pillar of the office's active caseload. Staffing allocations should prioritize attorneys with expertise in this jurisdiction to ensure high-quality representation.`;
      if (val > 0) return `${name} maintains a steady volume within the system. Current standardized templates are sufficient for handling this load without additional specialization.`;
      return `${name} has no active cases. Consider reviewing if this jurisdiction requires better public awareness or if it reflects current community legal trends.`;
    }

    if (type === 'appointment') {
      if (name === 'Completed') return "Operational efficiency is optimal. High completion rates reflect successful coordination between the office and the citizens.";
      if (name === 'Cancelled') return "Elevated cancellation rate detected. Reviewing the automated notification logs is recommended to identify potential communication gaps before the visit date.";
      if (name === 'Pending') return "The triage queue is active. Ensuring that the admin team reviews these within 24 hours will maintain the system's reputation for responsive public service.";
      return `Current status distribution for ${name} is consistent with historical patterns. Monitor for any sudden deviations in weekly logs.`;
    }

    return "System-wide resource consumption for this segment remains consistent. No immediate realignment required.";
  };

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

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || role !== 'admin') return null;

  return (
    <DashboardLayout role="admin">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 pb-20">
        <div className="xl:col-span-3 space-y-12">
          {/* --- HEADER --- */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
                <Zap className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-black text-primary font-headline tracking-tight">System Intelligence</h1>
                <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">Real-time synchronization across all legal assistance endpoints</p>
              </div>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14 mb-8">
              <TabsTrigger value="forecast" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                <BrainCircuit className="h-4 w-4 mr-2" /> Predictive Demand
              </TabsTrigger>
              <TabsTrigger value="workload" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                <Activity className="h-4 w-4 mr-2" /> Lawyer Activity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forecast" className="space-y-12 animate-in fade-in duration-500">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-6">
                      <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                        <Filter className="h-4 w-4" /> Parameters
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Jurisdiction</Label>
                        <Select value={forecastCategory} onValueChange={setForecastCategory}>
                          <SelectTrigger className="rounded-xl border-primary/10">
                            <SelectValue placeholder="All Categories" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all" className="font-bold">All Jurisdictions</SelectItem>
                            {Object.keys(caseCategories).map(cat => (
                              <SelectItem key={cat} value={cat} className="font-bold">{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-3">
                  <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-primary/5 px-10 pt-8 pb-6">
                      {(() => {
                        const trend = getTrendSummary(forecastData);
                        return (
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <trend.icon className={cn("h-4 w-4", trend.color)} />
                                <span className={cn("text-sm font-black uppercase tracking-widest", trend.color)}>{trend.label}</span>
                              </div>
                              <CardTitle className="text-xl font-black text-primary">Intake Demand Projection</CardTitle>
                            </div>
                          </div>
                        );
                      })()}
                    </CardHeader>
                    <CardContent className="p-10">
                      <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={forecastData} onClick={(e) => e && e.activePayload && handleChartClick(e.activePayload[0].payload, 'demand')}>
                            <defs>
                              <linearGradient id="colorCount" x1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#1A237E" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#1A237E" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }} formatter={(val: string) => val.split('-')[1] + '/' + val.split('-')[0].slice(2)} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                            <Tooltip content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return <div className="bg-white p-4 rounded-2xl shadow-2xl border border-primary/5"><p className="text-sm font-black text-primary">{data.label}</p><p className="text-2xl font-black text-primary">{data.count}</p></div>;
                              }
                              return null;
                            }} />
                            <Area type="monotone" dataKey="count" stroke="#1A237E" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" data={forecastData.filter(d => !d.isForecast)} />
                            <Line type="monotone" dataKey="count" stroke="#008080" strokeWidth={4} strokeDasharray="8 8" dot={{ r: 6, fill: '#008080', strokeWidth: 2, stroke: '#fff' }} data={forecastData.filter((d, i) => i >= forecastData.filter(x => !x.isForecast).length - 1)} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="workload" className="animate-in slide-in-from-bottom-4 duration-500">
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 px-10 pt-8 border-b">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                    <div className="flex-1 w-full space-y-4">
                      <CardTitle className="text-xl font-bold text-primary flex items-center gap-2"><Briefcase className="h-6 w-6" /> Lawyer Activity Registry</CardTitle>
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
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Appointments Handled</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40 text-center">Cases Active</TableHead>
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
                              <p className="text-[10px] text-muted-foreground">{lawyer.email}</p>
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

        {/* --- NOTIFICATION PANEL --- */}
        <div className="xl:col-span-1 space-y-6">
          <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden flex flex-col h-[calc(100vh-12rem)] sticky top-24">
            <CardHeader className="bg-primary p-8 text-white shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Bell className="h-6 w-6 text-white/60" />
                  <CardTitle className="text-xl font-black">System Activity</CardTitle>
                </div>
                <Badge className="bg-white/20 text-white border-none font-black text-[10px]">{notifications?.filter(n => n.status === 'unread').length || 0} NEW</Badge>
              </div>
              <div className="mt-6">
                <Select value={notifFilter} onValueChange={setNotifFilter}>
                  <SelectTrigger className="h-9 bg-white/10 border-none text-white text-xs font-bold rounded-lg focus:ring-0">
                    <SelectValue placeholder="All Activities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="font-bold">All Activities</SelectItem>
                    <SelectItem value="appointment" className="font-bold">Appointments</SelectItem>
                    <SelectItem value="case" className="font-bold">Cases</SelectItem>
                    <SelectItem value="lawyer" className="font-bold">Lawyer Action</SelectItem>
                    <SelectItem value="client" className="font-bold">Client Action</SelectItem>
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
                    onClick={() => markNotifRead(notif.id)}
                  >
                    {notif.status === 'unread' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500" />}
                    <div className="flex justify-between items-start mb-2">
                      <Badge className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 border-none",
                        notif.type === 'appointment' ? 'bg-blue-100 text-blue-700' :
                        notif.type === 'case' ? 'bg-green-100 text-green-700' :
                        notif.type === 'lawyer' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                      )}>
                        {notif.type}
                      </Badge>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase">{format(new Date(notif.createdAt), "HH:mm")}</span>
                    </div>
                    <p className="text-sm font-bold text-primary leading-snug">{notif.description}</p>
                    <div className="flex justify-between items-center mt-3">
                      <p className="text-[9px] font-black text-primary/40 uppercase tracking-widest">{notif.userRole}</p>
                      {notif.referenceCode && <p className="text-[9px] font-black text-secondary">{notif.referenceCode}</p>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 text-center space-y-4">
                  <Activity className="h-12 w-12 text-primary/5 mx-auto" />
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No activities logged</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* --- DEEP ANALYSIS MODAL --- */}
      <Dialog open={deepAnalysis.isOpen} onOpenChange={(open) => setDeepAnalysis({ ...deepAnalysis, isOpen: open })}>
        <DialogContent className="rounded-[3rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="p-8 bg-primary text-white shrink-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl"><BrainCircuit className="h-8 w-8" /></div>
              <DialogTitle className="text-2xl font-black">{deepAnalysis.title}</DialogTitle>
            </div>
          </DialogHeader>
          <div className="p-10 space-y-10 overflow-y-auto flex-1 scrollbar-hide">
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Intensity</p>
                <p className="text-5xl font-black text-primary">{deepAnalysis.data?.count || deepAnalysis.data?.value || 0} Units</p>
              </div>
            </div>
            <div className="bg-primary/5 p-6 rounded-[2rem] border-2 border-dashed border-primary/10">
              <p className="text-sm font-bold text-primary mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4" /> Administrative Insight:
              </p>
              <p className="text-xs font-medium text-primary/70 leading-relaxed italic">
                "{getInsight(deepAnalysis.type, deepAnalysis.data)}"
              </p>
            </div>
          </div>
          <DialogFooter className="p-8 bg-muted/30 shrink-0">
            <Button onClick={() => setDeepAnalysis({ ...deepAnalysis, isOpen: false })} className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl">Acknowledge & Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
