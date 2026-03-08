"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, ReferenceLine, Legend
} from "recharts";
import { 
  ShieldCheck, Users, Briefcase, Calendar, 
  TrendingUp, Filter, ArrowUpRight, ArrowDownRight, 
  Scale, Gavel, Loader2, Search, Clock, 
  Activity, PieChart as PieIcon, Sparkles, AlertCircle,
  TrendingDown, BrainCircuit, BarChart3, CheckCircle2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format, subMonths, addMonths } from "date-fns";
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
  
  const [activeTab, setActiveTab] = useState("forecast");
  const [lawyerSearch, setLawyerSearch] = useState("");
  const [sortField, setSortField] = useState<string>("activeCases");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const [forecastCategory, setForecastCategory] = useState("all");
  const [forecastType, setForecastType] = useState("all");

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

  const forecastData = useMemo(() => {
    if (!cases) return [];

    const filteredCases = cases.filter(c => {
      const matchCat = forecastCategory === "all" || Object.keys(caseCategories).find(cat => 
        (caseCategories as any)[cat].some((group: any) => group.items.includes(c.caseType))
      ) === forecastCategory;
      const matchType = forecastType === "all" || c.caseType === forecastType;
      return matchCat && matchType;
    });

    const months = [];
    for (let i = 5; i >= 0; i--) {
      months.push(format(subMonths(new Date(), i), "yyyy-MM"));
    }

    const historical = months.map((m, index) => {
      const count = filteredCases.filter(c => c.createdAt && c.createdAt.startsWith(m)).length;
      return { month: m, count, x: index, isForecast: false };
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
        isForecast: true
      });
    }

    return [...historical, ...predictions];
  }, [cases, forecastCategory, forecastType]);

  const emergingCategories = useMemo(() => {
    if (!cases) return [];
    
    const categories = Object.keys(caseCategories);
    const categoryTrends = categories.map(cat => {
      const catCases = cases.filter(c => 
        (caseCategories as any)[cat].some((group: any) => group.items.includes(c.caseType))
      );
      
      const last3Months = [2, 1, 0].map(i => {
        const m = format(subMonths(new Date(), i), "yyyy-MM");
        return { x: 2 - i, y: catCases.filter(c => c.createdAt && c.createdAt.startsWith(m)).length };
      });

      const { slope } = calculateTrend(last3Months);
      return { category: cat, slope, currentVolume: last3Months[2].y };
    });

    return categoryTrends.sort((a, b) => b.slope - a.slope);
  }, [cases]);

  const lawyerAnalytics = useMemo(() => {
    if (!lawyers || !cases || !appointments) return [];

    return lawyers.map(lawyer => {
      const lawyerAppts = appointments.filter(a => a.lawyerId === lawyer.id);
      const lawyerCases = cases.filter(c => c.lawyerId === lawyer.id);

      return {
        id: lawyer.id,
        name: lawyer.firstName ? `Atty. ${lawyer.firstName} ${lawyer.lastName}` : lawyer.email.split('@')[0],
        email: lawyer.email,
        totalAppts: lawyerAppts.length,
        casesOpened: lawyerCases.length,
        casesClosed: lawyerCases.filter(c => c.status === 'Closed' || c.status === 'Closed Case').length,
        servicesRendered: lawyerAppts.filter(a => a.status === 'completed').length,
        activeCases: lawyerCases.filter(c => c.status === 'Active').length,
      };
    });
  }, [lawyers, cases, appointments]);

  const filteredLawyers = useMemo(() => {
    return lawyerAnalytics
      .filter(l => 
        l.name.toLowerCase().includes(lawyerSearch.toLowerCase()) || 
        l.email.toLowerCase().includes(lawyerSearch.toLowerCase())
      )
      .sort((a: any, b: any) => {
        const multiplier = sortOrder === 'desc' ? -1 : 1;
        if (a[sortField] < b[sortField]) return -1 * multiplier;
        if (a[sortField] > b[sortField]) return 1 * multiplier;
        return 0;
      });
  }, [lawyerAnalytics, lawyerSearch, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || role !== 'admin') return null;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Admin Command Center</h1>
              <p className="text-muted-foreground font-medium">Strategic oversight and predictive resource forecasting.</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14 mb-8">
            <TabsTrigger value="forecast" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <BrainCircuit className="h-4 w-4 mr-2" /> Case Demand Forecast
            </TabsTrigger>
            <TabsTrigger value="workload" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" /> Lawyer Workload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forecast" className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <Card className="lg:col-span-1 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 pb-6">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <Filter className="h-4 w-4" /> Model Filters
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

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-primary/40 ml-1">Specific Case Type</Label>
                    <Select value={forecastType} onValueChange={setForecastType}>
                      <SelectTrigger className="rounded-xl border-primary/10">
                        <SelectValue placeholder="All Types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all" className="font-bold">All Case Types</SelectItem>
                        {forecastCategory !== 'all' && (caseCategories as any)[forecastCategory].flatMap((g: any) => g.items).map((item: string) => (
                          <SelectItem key={item} value={item} className="font-bold">{item}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-6 border-t border-primary/5">
                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-amber-600" />
                        <span className="text-[10px] font-black uppercase text-amber-900">Insight</span>
                      </div>
                      <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                        The prediction model uses linear regression based on the last 6 months of historical filings.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="lg:col-span-3 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 border-b border-primary/5 px-10 pt-8 pb-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="text-xl font-black text-primary flex items-center gap-2">
                        <LineChart className="h-6 w-6" /> Legal Demand Projection
                      </CardTitle>
                      <CardDescription className="font-medium">Historical trends vs. 3-month predictive volume.</CardDescription>
                    </div>
                    <Badge className="bg-primary text-white font-black text-[10px] px-4 py-1.5 uppercase rounded-full">
                      Next 90 Days
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-10">
                  <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastData}>
                        <defs>
                          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
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
                          contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700 }}
                          labelFormatter={(val) => `Period: ${val}`}
                        />
                        <Legend verticalAlign="top" align="right" iconType="circle" />
                        
                        <Area 
                          type="monotone" 
                          dataKey="count" 
                          name="Historical Intake"
                          stroke="#1A237E" 
                          strokeWidth={4}
                          fillOpacity={1} 
                          fill="url(#colorCount)" 
                          data={forecastData.filter(d => !d.isForecast)}
                        />
                        
                        <Line 
                          type="monotone" 
                          dataKey="count" 
                          name="Predicted Demand"
                          stroke="#008080" 
                          strokeWidth={4}
                          strokeDasharray="8 8"
                          dot={{ r: 6, fill: '#008080', strokeWidth: 2, stroke: '#fff' }}
                          data={forecastData.filter((d, i) => i >= 5)}
                        />
                        
                        <ReferenceLine x={forecastData[5]?.month} stroke="#EF4444" strokeDasharray="3 3" label={{ position: 'top', value: 'Today', fill: '#EF4444', fontSize: 10, fontWeight: 900 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {emergingCategories.slice(0, 4).map((cat, i) => (
                <Card key={i} className="border-none shadow-md rounded-3xl bg-white overflow-hidden hover:shadow-lg transition-all group">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-primary/5 rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                        <Scale className="h-5 w-5" />
                      </div>
                      {cat.slope > 0 ? (
                        <Badge className="bg-red-50 text-red-600 border-none flex items-center gap-1 font-black">
                          <ArrowUpRight className="h-3 w-3" /> SURGING
                        </Badge>
                      ) : (
                        <Badge className="bg-green-50 text-green-600 border-none flex items-center gap-1 font-black">
                          <ArrowDownRight className="h-3 w-3" /> STABLE
                        </Badge>
                      )}
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{cat.category}</p>
                      <div className="flex items-end gap-2">
                        <p className="text-3xl font-black text-primary">{cat.currentVolume}</p>
                        <p className="text-[10px] font-bold text-muted-foreground mb-1.5">monthly cases</p>
                      </div>
                      <div className="mt-4 pt-4 border-t border-primary/5 flex items-center justify-between">
                        <span className="text-[9px] font-black uppercase text-primary/40 tracking-widest">Growth Factor</span>
                        <span className={cn(
                          "text-xs font-black",
                          cat.slope > 0 ? "text-red-600" : "text-green-600"
                        )}>
                          {cat.slope > 0 ? '+' : ''}{cat.slope.toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workload" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
                <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                  <div className="flex-1 w-full space-y-4">
                    <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                      <Briefcase className="h-6 w-6" /> Lawyer Activity Registry
                    </CardTitle>
                    <div className="relative max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                      <Input 
                        placeholder="Search Attorney Profile..." 
                        className="pl-9 h-11 rounded-xl border-primary/10 bg-white"
                        value={lawyerSearch}
                        onChange={(e) => setLawyerSearch(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {(isLawyersLoading || isCasesLoading || isApptsLoading) ? (
                  <div className="py-24 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="animate-spin h-10 w-10 text-primary/20" />
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Aggregating Workload Data...</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-8 text-[10px] font-black uppercase tracking-widest text-primary/40">Attorney Profile</TableHead>
                        <TableHead 
                          className="text-[10px] font-black uppercase tracking-widest text-primary/40 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleSort('totalAppts')}
                        >
                          Appts Handled <Clock className="inline h-3 w-3 ml-1" />
                        </TableHead>
                        <TableHead 
                          className="text-[10px] font-black uppercase tracking-widest text-primary/40 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleSort('casesOpened')}
                        >
                          Opened <Sparkles className="inline h-3 w-3 ml-1" />
                        </TableHead>
                        <TableHead 
                          className="text-[10px] font-black uppercase tracking-widest text-primary/40 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleSort('casesClosed')}
                        >
                          Closed <CheckCircle2 className="inline h-3 w-3 ml-1" />
                        </TableHead>
                        <TableHead 
                          className="text-[10px] font-black uppercase tracking-widest text-primary/40 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleSort('servicesRendered')}
                        >
                          Services Rendered <Activity className="inline h-3 w-3 ml-1" />
                        </TableHead>
                        <TableHead 
                          className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleSort('activeCases')}
                        >
                          Active Caseload <BarChart3 className="inline h-3 w-3 ml-1" />
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLawyers.map((lawyer) => (
                        <TableRow key={lawyer.id} className="hover:bg-primary/5 transition-colors group">
                          <TableCell className="px-8 py-6">
                            <div className="flex flex-col">
                              <p className="font-black text-primary leading-none mb-1">{lawyer.name}</p>
                              <p className="text-[10px] text-muted-foreground font-medium">{lawyer.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-bold border-primary/10 bg-white">
                              {lawyer.totalAppts}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-bold text-primary">{lawyer.casesOpened}</span>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm font-bold text-green-600">{lawyer.casesClosed}</span>
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-teal-500/10 text-teal-700 border-none font-bold text-[10px]">
                              {lawyer.servicesRendered} Completed
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right px-8">
                            <div className="flex flex-col items-end">
                              <p className="text-lg font-black text-primary">{lawyer.activeCases}</p>
                              <div className={cn(
                                "h-1 w-16 rounded-full mt-1",
                                lawyer.activeCases > 10 ? "bg-red-500" : 
                                lawyer.activeCases > 5 ? "bg-amber-500" : "bg-green-500"
                              )} />
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredLawyers.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-24 text-muted-foreground italic font-medium">
                            <Users className="h-12 w-12 mx-auto mb-4 opacity-5" />
                            No analytics records found for the selected criteria.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
