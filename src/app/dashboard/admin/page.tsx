"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, Cell as RechartsCell
} from "recharts";
import { 
  Shield, Users, Briefcase, Calendar, CheckCircle2, 
  AlertCircle, FileText, TrendingUp, Filter,
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Scale, Gavel, ClipboardList, ShieldCheck,
  Loader2, Search, CalendarDays, ArrowUpDown, Clock,
  FileSearch, Activity, ListChecks, PieChart as PieIcon,
  CalendarCheck, History
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format, isWithinInterval, startOfDay, endOfDay, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

const COLORS = ['#1A237E', '#008080', '#F59E0B', '#EF4444', '#6366F1', '#8B5CF6', '#EC4899'];

const PURPOSE_LABELS: Record<string, string> = {
  'follow-up': 'Follow-up Consultation',
  'consultation': 'Legal Consultation',
  'notarization': 'Document Notarization',
  'document-preparation': 'Document Preparation',
  'legal-advice': 'Legal Advice'
};

export default function AdminDashboard() {
  const db = useFirestore();
  const { user, role, loading } = useAuth();
  
  // Controls
  const [activeTab, setActiveTab] = useState("overview");
  const [lawyerSearch, setLawyerSearch] = useState("");
  const [sortField, setSortField] = useState<string>("activeCases");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [analysisPeriod, setAnalysisPeriod] = useState("monthly");
  
  // Date Range Filter
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: endOfMonth(new Date()),
  });

  // Queries
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

  const interval = useMemo(() => {
    if (!dateRange?.from || !dateRange?.to) return null;
    return {
      start: startOfDay(dateRange.from),
      end: endOfDay(dateRange.to)
    };
  }, [dateRange]);

  // --- ANALYTICS LOGIC ---
  const lawyerAnalytics = useMemo(() => {
    if (!lawyers || !cases || !appointments) return [];

    return lawyers.map(lawyer => {
      const lawyerAppts = appointments.filter(a => a.lawyerId === lawyer.id);
      const lawyerCases = cases.filter(c => c.lawyerId === lawyer.id);

      const filteredAppts = interval ? lawyerAppts.filter(a => {
        const d = new Date(a.date);
        return isWithinInterval(d, interval);
      }) : lawyerAppts;

      const filteredCases = interval ? lawyerCases.filter(c => {
        const d = new Date(c.createdAt);
        return isWithinInterval(d, interval);
      }) : lawyerCases;

      const closedInInterval = lawyerCases.filter(c => {
        const isClosedStatus = c.status === 'Closed' || c.status === 'Closed Case';
        if (!isClosedStatus || !c.closedAt) return false;
        if (!interval) return true;
        return isWithinInterval(new Date(c.closedAt), interval);
      });

      return {
        id: lawyer.id,
        name: lawyer.firstName ? `Atty. ${lawyer.firstName} ${lawyer.lastName}` : lawyer.email.split('@')[0],
        email: lawyer.email,
        totalAppts: filteredAppts.length,
        casesOpened: filteredCases.length,
        casesClosed: closedInInterval.length,
        servicesRendered: filteredAppts.filter(a => a.status === 'completed').length,
        activeCases: lawyerCases.filter(c => c.status === 'Active').length,
        workloadScore: (lawyerCases.filter(c => c.status === 'Active').length * 2) + filteredAppts.length
      };
    });
  }, [lawyers, cases, appointments, interval]);

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

  const handlePeriodChange = (value: string) => {
    setAnalysisPeriod(value);
    const now = new Date();
    if (value === 'daily') {
      setDateRange({ from: startOfDay(now), to: endOfDay(now) });
    } else if (value === 'weekly') {
      setDateRange({ from: startOfWeek(now), to: endOfWeek(now) });
    } else if (value === 'monthly') {
      setDateRange({ from: startOfMonth(now), to: endOfMonth(now) });
    } else if (value === 'quarterly') {
      setDateRange({ from: startOfQuarter(now), to: endOfQuarter(now) });
    }
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  // --- OVERVIEW DATA AGGREGATIONS ---
  const caseStats = useMemo(() => {
    if (!cases) return [];
    const filtered = interval ? cases.filter(c => isWithinInterval(new Date(c.createdAt), interval)) : cases;
    return [
      { name: 'Active', value: filtered.filter(c => c.status === 'Active').length },
      { name: 'Pending', value: filtered.filter(c => c.status === 'Pending').length },
      { name: 'Closed', value: filtered.filter(c => c.status === 'Closed' || c.status === 'Closed Case').length },
    ];
  }, [cases, interval]);

  const apptStats = useMemo(() => {
    if (!appointments) return [];
    const filtered = interval ? appointments.filter(a => isWithinInterval(new Date(a.date), interval)) : appointments;
    return [
      { name: 'Scheduled', value: filtered.filter(a => a.status === 'scheduled').length },
      { name: 'Completed', value: filtered.filter(a => a.status === 'completed').length },
      { name: 'Cancelled', value: filtered.filter(a => a.status === 'cancelled').length },
      { name: 'Rescheduled', value: filtered.filter(a => a.status === 'rescheduled').length },
    ].filter(s => s.value > 0);
  }, [appointments, interval]);

  const serviceStats = useMemo(() => {
    if (!appointments) return [];
    const filtered = interval ? appointments.filter(a => isWithinInterval(new Date(a.date), interval)) : appointments;
    const completed = filtered.filter(a => a.status === 'completed');
    
    return [
      { label: "Follow-up Consultation", value: completed.filter(a => a.purpose === 'follow-up').length, icon: History },
      { label: "Legal Consultation", value: completed.filter(a => a.purpose === 'consultation').length, icon: Users },
      { label: "Document Notarization", value: completed.filter(a => a.purpose === 'notarization').length, icon: FileSearch },
      { label: "Document Preparation", value: completed.filter(a => a.purpose === 'document-preparation').length, icon: ListChecks },
      { label: "Legal Advice", value: completed.filter(a => a.purpose === 'legal-advice').length, icon: Gavel },
    ];
  }, [appointments, interval]);

  const topCases = useMemo(() => {
    if (!cases) return [];
    const filtered = interval ? cases.filter(c => isWithinInterval(new Date(c.createdAt), interval)) : cases;
    const counts: Record<string, number> = {};
    filtered.forEach(c => {
      if (c.caseType) {
        counts[c.caseType] = (counts[c.caseType] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [cases, interval]);

  const topBookings = useMemo(() => {
    if (!appointments) return [];
    const filtered = interval ? appointments.filter(a => isWithinInterval(new Date(a.date), interval)) : appointments;
    const counts: Record<string, number> = {};
    filtered.forEach(a => {
      const label = PURPOSE_LABELS[a.purpose] || a.purpose || 'Other';
      counts[label] = (counts[label] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [appointments, interval]);

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
              <p className="text-muted-foreground font-medium">Strategic oversight of system-wide legal operations.</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={analysisPeriod} onValueChange={handlePeriodChange}>
              <SelectTrigger className="h-11 w-[160px] rounded-xl border-primary/10 bg-white font-black text-primary px-4 text-xs uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <SelectValue placeholder="Period" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily" className="font-bold">Daily View</SelectItem>
                <SelectItem value="weekly" className="font-bold">Weekly View</SelectItem>
                <SelectItem value="monthly" className="font-bold">Monthly View</SelectItem>
                <SelectItem value="quarterly" className="font-bold">Quarterly View</SelectItem>
                <SelectItem value="custom" className="font-bold">Custom Range</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className={cn(
                    "h-11 rounded-xl border-primary/10 bg-white font-bold text-primary px-4 gap-2 text-xs",
                    analysisPeriod !== 'custom' && "opacity-50"
                  )}
                  disabled={analysisPeriod !== 'custom'}
                >
                  <CalendarDays className="h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>{format(dateRange.from, "LLL dd")} - {format(dateRange.to, "LLL dd")}</>
                    ) : (
                      format(dateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick Range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 rounded-[2rem] border-none shadow-2xl" align="end">
                <CalendarComponent
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14 mb-8">
            <TabsTrigger value="overview" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <PieIcon className="h-4 w-4 mr-2" /> Analytics Overview
            </TabsTrigger>
            <TabsTrigger value="workload" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <Activity className="h-4 w-4 mr-2" /> Lawyer Workload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
            {/* --- TOP ROW: STATS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
              {serviceStats.map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-3 bg-primary/5 rounded-xl">
                        <stat.icon className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1 leading-tight">{stat.label}</p>
                      <p className="text-3xl font-black text-primary">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* --- SECOND ROW: MAIN CHARTS --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="pb-2 border-b border-primary/5 bg-primary/[0.02]">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <Scale className="h-4 w-4" /> Case Status Breakdown
                  </CardTitle>
                  <CardDescription>Visualizing active, pending, and closed legal records.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] pt-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={caseStats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 900, fill: '#64748B' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748B' }} />
                      <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700 }} />
                      <Bar dataKey="value" fill="#1A237E" radius={[12, 12, 0, 0]} barSize={60}>
                        {caseStats.map((entry, index) => <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white flex flex-col overflow-hidden">
                <CardHeader className="pb-2 border-b border-primary/5 bg-primary/[0.02]">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-primary">Appointment Distribution</CardTitle>
                  <CardDescription>Daily intake status outcomes.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center pt-4">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={apptStats} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={8} dataKey="value">
                          {apptStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-4 pb-6 px-6">
                    {apptStats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{stat.name}: {stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- THIRD ROW: TRENDS & TOP CASES --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Top Filed Case Types
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-8 text-[9px] font-black uppercase tracking-widest">Legal Matter</TableHead>
                        <TableHead className="text-right px-8 text-[9px] font-black uppercase tracking-widest">Total Filed</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topCases.map((c, i) => (
                        <TableRow key={i} className="hover:bg-primary/5 border-none">
                          <TableCell className="px-8 font-bold text-primary">{c.name}</TableCell>
                          <TableCell className="text-right px-8">
                            <Badge variant="outline" className="font-black border-primary/10 text-primary">{c.count}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {topCases.length === 0 && (
                        <TableRow><TableCell colSpan={2} className="text-center py-12 text-muted-foreground italic text-xs">No records for this period.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
                <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2">
                    <CalendarCheck className="h-4 w-4" /> Most Booked Services
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead className="px-8 text-[9px] font-black uppercase tracking-widest">Service Type</TableHead>
                        <TableHead className="text-right px-8 text-[9px] font-black uppercase tracking-widest">Bookings</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topBookings.map((b, i) => (
                        <TableRow key={i} className="hover:bg-primary/5 border-none">
                          <TableCell className="px-8 font-bold text-primary">{b.name}</TableCell>
                          <TableCell className="text-right px-8">
                            <Badge variant="outline" className="font-black border-primary/10 text-primary">{b.count}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                      {topBookings.length === 0 && (
                        <TableRow><TableCell colSpan={2} className="text-center py-12 text-muted-foreground italic text-xs">No bookings for this period.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
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
                          Appts Handled <ArrowUpDown className="inline h-3 w-3 ml-1" />
                        </TableHead>
                        <TableHead 
                          className="text-[10px] font-black uppercase tracking-widest text-primary/40 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleSort('casesOpened')}
                        >
                          Opened <ArrowUpDown className="inline h-3 w-3 ml-1" />
                        </TableHead>
                        <TableHead 
                          className="text-[10px] font-black uppercase tracking-widest text-primary/40 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleSort('casesClosed')}
                        >
                          Closed <ArrowUpDown className="inline h-3 w-3 ml-1" />
                        </TableHead>
                        <TableHead 
                          className="text-[10px] font-black uppercase tracking-widest text-primary/40 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleSort('servicesRendered')}
                        >
                          Services Rendered <ArrowUpDown className="inline h-3 w-3 ml-1" />
                        </TableHead>
                        <TableHead 
                          className="text-right px-8 text-[10px] font-black uppercase tracking-widest text-primary/40 cursor-pointer hover:text-primary transition-colors"
                          onClick={() => handleSort('activeCases')}
                        >
                          Active Caseload <ArrowUpDown className="inline h-3 w-3 ml-1" />
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
