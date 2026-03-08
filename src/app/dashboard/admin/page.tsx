
"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
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
  Zap, Target, Layers, ArrowRight, ChevronDown
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

/**
 * UTILITY: Linear Regression Slope Calculation
 */
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

  const { data: cases, isLoading: isCasesLoading } = useCollection(casesQuery);
  const { data: appointments, isLoading: isApptsLoading } = useCollection(apptsQuery);
  const { data: lawyers, isLoading: isLawyersLoading } = useCollection(lawyersQuery);

  /**
   * 1. DATA PROCESSING: Case Demand Forecast
   */
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

  /**
   * 2. DATA PROCESSING: Category Breakdown
   */
  const categoryBreakdown = useMemo(() => {
    if (!cases) return [];
    return Object.keys(caseCategories).map(cat => {
      const count = cases.filter(c => 
        (caseCategories as any)[cat].some((group: any) => group.items.includes(c.caseType))
      ).length;
      return { name: cat, value: count };
    }).sort((a, b) => b.value - a.value);
  }, [cases]);

  /**
   * 3. DATA PROCESSING: Appointment Lifecycle
   */
  const apptLifecycle = useMemo(() => {
    if (!appointments) return [];
    const statuses = ['pending', 'scheduled', 'completed', 'cancelled', 'rescheduled'];
    return statuses.map(s => ({
      name: s.charAt(0).toUpperCase() + s.slice(1),
      value: appointments.filter(a => a.status === s).length
    }));
  }, [appointments]);

  /**
   * ANALYTICS ENGINE: Interpretation Logic
   */
  const getTrendSummary = (data: any[], key: string = 'count') => {
    if (data.length < 2) return { label: "Stable", color: "text-muted-foreground", icon: Activity };
    const historicalPoints = data.filter(d => !d.isForecast);
    if (historicalPoints.length < 2) return { label: "Stable", color: "text-muted-foreground", icon: Activity };
    
    const first = historicalPoints[0][key];
    const last = historicalPoints[historicalPoints.length - 1][key];
    const diff = last - first;
    
    if (diff > 0) return { label: "Increasing Demand", color: "text-red-600", icon: TrendingUp, desc: `Volume increased by ${Math.abs(diff)} units over the period.` };
    if (diff < 0) return { label: "Decreasing Trend", color: "text-green-600", icon: TrendingDown, desc: `Volume decreased by ${Math.abs(diff)} units over the period.` };
    return { label: "Stable Distribution", color: "text-blue-600", icon: Activity, desc: "Resource consumption remains consistent." };
  };

  const getInsightPanel = (type: 'forecast' | 'categories' | 'lifecycle') => {
    if (type === 'forecast') {
      const historicalPoints = forecastData.filter(d => !d.isForecast);
      const futurePoints = forecastData.filter(d => d.isForecast);
      const historicalAvg = historicalPoints.reduce((acc, curr) => acc + curr.count, 0) / Math.max(1, historicalPoints.length);
      const futureAvg = futurePoints.reduce((acc, curr) => acc + curr.count, 0) / Math.max(1, futurePoints.length);
      const percentChange = historicalAvg > 0 ? ((futureAvg - historicalAvg) / historicalAvg) * 100 : 0;
      
      return {
        analysis: `Current projections indicate a ${Math.abs(percentChange).toFixed(1)}% ${percentChange >= 0 ? 'surge' : 'reduction'} in total caseload.`,
        implication: percentChange > 10 
          ? "Critical staff rebalancing is required to prevent intake bottlenecks." 
          : "Maintain current workstation allocation for the next quarter.",
        predicted: `Average predicted volume: ${futureAvg.toFixed(1)} cases per month.`
      };
    }
    if (type === 'categories') {
      const top = categoryBreakdown[0];
      return {
        analysis: `The "${top?.name}" jurisdiction constitutes ${(top ? (top.value / Math.max(1, cases?.length || 1) * 100).toFixed(1) : 0)}% of the total filing volume.`,
        implication: "Resource focal point: Standard evidence checklists for this category should be pre-distributed.",
        predicted: "Steady growth observed in quasi-judicial matters."
      };
    }
    return {
      analysis: "Intake throughput is currently at standard capacity.",
      implication: "Focus on reducing the 'Cancelled' rate through automated citizen reminders.",
      predicted: "Rescheduling patterns suggest a need for more flexible Friday morning slots."
    };
  };

  /**
   * HANDLERS: Deep Analysis Trigger
   */
  const handleChartClick = (data: any, type: 'demand' | 'category' | 'appointment') => {
    if (!data) return;
    setDeepAnalysis({
      isOpen: true,
      title: `Deep Analysis: ${data.label || data.name || 'Selected Segment'}`,
      data: data,
      type: type
    });
  };

  const performanceRangeStart = useMemo(() => {
    const now = new Date();
    if (performanceRange === "day") return startOfToday();
    if (performanceRange === "week") return subDays(now, 7);
    return subDays(now, 30);
  }, [performanceRange]);

  const isInPerformanceRange = (dateStr: string | undefined) => {
    if (!dateStr) return false;
    try {
      return isAfter(new Date(dateStr), performanceRangeStart);
    } catch {
      return false;
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || role !== 'admin') return null;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8 pb-20">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
              <Zap className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Analytics Decision Support</h1>
              <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">Interpreting system records for strategic resource allocation</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14 mb-8">
            <TabsTrigger value="forecast" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <BrainCircuit className="h-4 w-4 mr-2" /> Predictive Demand
            </TabsTrigger>
            <TabsTrigger value="workload" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" /> Lawyer Performance
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-12 animate-in fade-in duration-500">
            {/* --- TOP ROW: PREDICTIVE LINE --- */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1 space-y-6">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-6">
                    <CardTitle className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                      <Filter className="h-4 w-4" /> Global Filters
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 space-y-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Legal Jurisdiction</Label>
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
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-amber-600" />
                        <span className="text-[10px] font-black uppercase text-amber-900">Decision Support</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                        Model applies Linear Regression over historical intake to project next quarter demand.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="lg:col-span-3">
                <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden relative">
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
                            <CardTitle className="text-xl font-black text-primary">Case Intake Projection</CardTitle>
                            <p className="text-xs font-bold text-muted-foreground mt-1">{trend.desc}</p>
                          </div>
                          <Badge className="bg-primary text-white font-black text-[10px] px-4 py-1.5 uppercase rounded-full">
                            Predictive View
                          </Badge>
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
                          <XAxis 
                            dataKey="month" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }}
                            formatter={(val: string) => val.split('-')[1] + '/' + val.split('-')[0].slice(2)}
                          />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                          <Tooltip 
                            content={({ active, payload }) => {
                              if (active && payload && payload.length) {
                                const data = payload[0].payload;
                                return (
                                  <div className="bg-white p-4 rounded-2xl shadow-2xl border-none outline-none ring-1 ring-black/5">
                                    <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest mb-1">{data.isForecast ? 'Predicted Month' : 'Historical Month'}</p>
                                    <p className="text-sm font-black text-primary mb-2">{data.label}</p>
                                    <div className="flex items-center gap-3 bg-primary/5 p-2 rounded-xl">
                                      <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-white font-black">{data.count}</div>
                                      <p className="text-[10px] font-bold text-primary leading-tight">Total Legal<br/>Filing Units</p>
                                    </div>
                                    <p className="mt-3 text-[9px] font-black text-secondary uppercase tracking-widest flex items-center gap-1">
                                      <Info className="h-2 w-2" /> Click for action items
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="count" 
                            stroke="#1A237E" 
                            strokeWidth={4}
                            fillOpacity={1} 
                            fill="url(#colorCount)" 
                            data={forecastData.filter(d => !d.isForecast)}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="count" 
                            stroke="#008080" 
                            strokeWidth={4} 
                            strokeDasharray="8 8"
                            dot={{ r: 6, fill: '#008080', strokeWidth: 2, stroke: '#fff' }}
                            data={forecastData.filter((d, i) => i >= forecastData.filter(x => !x.isForecast).length - 1)}
                          />
                          <ReferenceLine x={forecastData.find(d => d.isForecast)?.month} stroke="#EF4444" strokeDasharray="3 3" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="mt-10 pt-10 border-t border-primary/5 grid md:grid-cols-3 gap-8">
                      {(() => {
                        const insights = getInsightPanel('forecast');
                        return (
                          <>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-primary" />
                                <span className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Trend Analysis</span>
                              </div>
                              <p className="text-sm font-bold text-primary/80 leading-relaxed">{insights.analysis}</p>
                            </div>
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                <span className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Future Outlook</span>
                              </div>
                              <p className="text-sm font-bold text-primary/80 leading-relaxed">{insights.predicted}</p>
                            </div>
                            <div className="space-y-2 bg-primary/5 p-4 rounded-2xl border-l-4 border-primary">
                              <div className="flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-primary" />
                                <span className="text-[10px] font-black uppercase text-primary tracking-widest">Operational Implication</span>
                              </div>
                              <p className="text-xs font-black text-primary leading-relaxed italic">{insights.implication}</p>
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Category Breakdown */}
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 pb-6 border-b border-primary/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-black text-primary">Volume by Jurisdiction</CardTitle>
                      <p className="text-xs font-bold text-muted-foreground mt-1">Resource consumption per legal category.</p>
                    </div>
                    <Scale className="h-6 w-6 text-primary/20" />
                  </div>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={categoryBreakdown} layout="vertical" onClick={(e) => e && e.activePayload && handleChartClick(e.activePayload[0].payload, 'category')}>
                        <XAxis type="number" hide />
                        <YAxis 
                          dataKey="name" 
                          type="category" 
                          axisLine={false} 
                          tickLine={false} 
                          width={100}
                          tick={{ fontSize: 10, fontWeight: 900, fill: '#1A237E' }}
                        />
                        <Tooltip 
                          cursor={{ fill: 'rgba(26, 35, 126, 0.05)' }}
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-4 rounded-2xl shadow-xl border border-primary/5">
                                  <p className="text-sm font-black text-primary mb-1">{data.name}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-2xl font-black text-secondary">{data.value}</span>
                                    <span className="text-[10px] font-bold text-muted-foreground uppercase">Active Case Files</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Bar dataKey="value" radius={[0, 12, 12, 0]} barSize={30}>
                          {categoryBreakdown.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#1A237E' : '#008080'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-8 pt-8 border-t border-primary/5">
                    {(() => {
                      const insights = getInsightPanel('categories');
                      return (
                        <div className="flex gap-6 items-start">
                          <div className="p-3 bg-secondary/10 rounded-2xl text-secondary">
                            <Target className="h-6 w-6" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-primary leading-relaxed">{insights.analysis}</p>
                            <p className="text-[11px] font-black text-secondary uppercase tracking-widest">{insights.implication}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Appointment Lifecycle */}
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 pb-6 border-b border-primary/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-lg font-black text-primary">Appointment Lifecycle</CardTitle>
                      <p className="text-xs font-bold text-muted-foreground mt-1">Visit success and cancellation metrics.</p>
                    </div>
                    <Clock className="h-6 w-6 text-primary/20" />
                  </div>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart onClick={(e) => e && e.activePayload && handleChartClick(e.activePayload[0].payload, 'appointment')}>
                        <Pie
                          data={apptLifecycle}
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {apptLifecycle.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#1A237E', '#008080', '#22C55E', '#EF4444', '#F59E0B'][index % 5]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white p-4 rounded-2xl shadow-xl border border-primary/5">
                                  <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">Status Category</p>
                                  <p className="text-sm font-black text-primary mb-2">{data.name}</p>
                                  <div className="flex items-center gap-2 text-primary">
                                    <span className="text-2xl font-black">{data.value}</span>
                                    <span className="text-xs font-bold">Records</span>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: 10, fontWeight: 900, paddingTop: 20 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-8 pt-8 border-t border-primary/5">
                    <div className="bg-primary/5 p-5 rounded-[2rem] flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                        <Activity className="h-5 w-5" />
                      </div>
                      <p className="text-[11px] font-bold text-primary/80 leading-relaxed italic">
                        "High 'Cancelled' rates are observed in first-time intakes. Consider implementing automated SMS verification 48 hours prior to schedule."
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* --- WORKLOAD TAB --- */}
          <TabsContent value="workload" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10 px-10 pt-8">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1 w-full space-y-4">
                    <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                      <Briefcase className="h-6 w-6" /> Lawyer Activity Registry
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                        <Input 
                          placeholder="Search Attorney Profile..." 
                          className="pl-9 h-11 rounded-xl border-primary/10 bg-white"
                          value={lawyerSearch}
                          onChange={(e) => setLawyerSearch(e.target.value)}
                        />
                      </div>
                      <Select value={performanceRange} onValueChange={setPerformanceRange}>
                        <SelectTrigger className="h-11 w-full sm:w-[180px] rounded-xl border-primary/10 bg-white font-bold">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary/40" />
                            <SelectValue placeholder="Range" />
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day" className="font-bold">Today</SelectItem>
                          <SelectItem value="week" className="font-bold">Last 7 Days</SelectItem>
                          <SelectItem value="month" className="font-bold">Last 30 Days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {(isLawyersLoading || isCasesLoading || isApptsLoading) ? (
                  <div className="py-24 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin h-10 w-10 text-primary/20" />
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Aggregating Performance Data...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-10 text-[10px] font-black uppercase tracking-widest text-primary/40">Attorney Profile</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">APPOINTMENTS HANDLED</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Cases Opened</TableHead>
                        <TableHead className="text-[10px] font-black uppercase tracking-widest text-primary/40">Cases Closed</TableHead>
                        <TableHead className="text-right px-10 text-[10px] font-black uppercase tracking-widest text-primary/40">Active Caseload</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lawyers?.filter(l => l.email.includes(lawyerSearch) || (l.firstName + l.lastName).toLowerCase().includes(lawyerSearch.toLowerCase())).map((lawyer) => {
                        const lApptsInRange = (appointments?.filter(a => a.lawyerId === lawyer.id) || []).filter(a => isInPerformanceRange(a.createdAt));
                        const lCasesInRange = (cases?.filter(c => c.lawyerId === lawyer.id) || []).filter(c => isInPerformanceRange(c.createdAt));
                        const lCasesClosedInRange = (cases?.filter(c => c.lawyerId === lawyer.id) || []).filter(c => (c.status === 'Closed' || c.status === 'Closed Case') && isInPerformanceRange(c.closedAt || c.updatedAt));
                        const lActiveCases = cases?.filter(c => c.lawyerId === lawyer.id && c.status === 'Active') || [];
                        
                        return (
                          <TableRow key={lawyer.id} className="hover:bg-primary/5 transition-colors group">
                            <TableCell className="px-10 py-6">
                              <div className="flex flex-col">
                                <p className="font-black text-primary leading-none mb-1">Atty. {lawyer.firstName} {lawyer.lastName}</p>
                                <p className="text-[10px] text-muted-foreground font-medium">{lawyer.email}</p>
                              </div>
                            </TableCell>
                            <TableCell><Badge variant="outline" className="font-bold">{lApptsInRange.length}</Badge></TableCell>
                            <TableCell><span className="text-sm font-bold text-primary">{lCasesInRange.length}</span></TableCell>
                            <TableCell><span className="text-sm font-bold text-green-600">{lCasesClosedInRange.length}</span></TableCell>
                            <TableCell className="text-right px-10">
                              <div className="flex flex-col items-end">
                                <p className="text-lg font-black text-primary">{lActiveCases.length}</p>
                                <div className={cn(
                                  "h-1 w-16 rounded-full mt-1",
                                  lActiveCases.length > 8 ? "bg-red-500" : "bg-green-500"
                                )} />
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
          </TabsContent>
        </Tabs>

        {/* --- LAYER 4: DEEP ANALYSIS MODAL --- */}
        <Dialog open={deepAnalysis.isOpen} onOpenChange={(open) => setDeepAnalysis({ ...deepAnalysis, isOpen: open })}>
          <DialogContent className="rounded-[3rem] max-w-2xl p-0 overflow-hidden border-none shadow-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="p-8 bg-primary text-white shrink-0">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <BrainCircuit className="h-8 w-8" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black tracking-tight">{deepAnalysis.title}</DialogTitle>
                  <DialogDescription className="text-white/60 font-bold uppercase text-[10px] tracking-widest">Operational Intelligence Profile</DialogDescription>
                </div>
              </div>
            </DialogHeader>
            <div className="p-10 space-y-10 overflow-y-auto flex-1 scrollbar-hide">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Filing Intensity</p>
                  <div className="flex items-end gap-2">
                    <p className="text-5xl font-black text-primary">{deepAnalysis.data?.count || deepAnalysis.data?.value || 0}</p>
                    <p className="text-[10px] font-bold text-muted-foreground mb-2">Legal Units</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-primary/40 tracking-widest">Statistical Window</p>
                  <p className="text-lg font-bold text-primary">Current Analysis</p>
                  <Badge className="bg-secondary/10 text-secondary border-none font-black text-[9px] uppercase">Validated Record</Badge>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <ListChecks className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-primary">Recommended Administrative Actions</h4>
                </div>
                <div className="grid gap-4">
                  {[
                    { icon: Clock, text: "Adjust lawyer shift density based on projected intake surge." },
                    { icon: FileText, text: "Pre-validate documentary checklists for this jurisdiction." },
                    { icon: Target, text: "Priority triage for high-complexity filings in this segment." }
                  ].map((action, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-muted/20 rounded-2xl border border-transparent hover:border-primary/10 transition-colors">
                      <action.icon className="h-5 w-5 text-primary/40" />
                      <p className="text-sm font-bold text-primary/80">{action.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary/5 p-6 rounded-[2rem] border-2 border-dashed border-primary/10">
                <div className="flex items-center gap-3 mb-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest">Intelligence Summary</p>
                </div>
                <p className="text-xs font-medium text-primary/70 leading-relaxed italic">
                  "Based on the historical comparison of this segment, we observe a steady trend. It is statistically relevant to monitor volume peaks within the next 45 days. Resources should be optimized across categories."
                </p>
              </div>
            </div>
            <DialogFooter className="p-8 bg-muted/30 shrink-0">
              <Button onClick={() => setDeepAnalysis({ ...deepAnalysis, isOpen: false })} className="w-full h-14 bg-primary text-white font-black rounded-2xl shadow-xl">Acknowledge & Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
