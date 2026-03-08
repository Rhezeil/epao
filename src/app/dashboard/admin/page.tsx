
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
  Loader2, Search, CalendarDays, ArrowUpDown
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { format, isWithinInterval, startOfDay, endOfDay, subDays } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

const COLORS = ['#1A237E', '#008080', '#F59E0B', '#EF4444', '#6366F1'];

export default function AdminDashboard() {
  const db = useFirestore();
  const { user, role, loading } = useAuth();
  
  // Controls
  const [activeTab, setActiveTab] = useState("overview");
  const [lawyerSearch, setLawyerSearch] = useState("");
  const [sortField, setSortField] = useState<string>("activeCases");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  // Date Range Filter
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
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

  // --- ANALYTICS LOGIC ---
  const lawyerAnalytics = useMemo(() => {
    if (!lawyers || !cases || !appointments) return [];

    const interval = dateRange?.from && dateRange?.to ? {
      start: startOfDay(dateRange.from),
      end: endOfDay(dateRange.to)
    } : null;

    return lawyers.map(lawyer => {
      const lawyerAppts = appointments.filter(a => a.lawyerId === lawyer.id);
      const lawyerCases = cases.filter(c => c.lawyerId === lawyer.id);

      // Filter by date range if applicable
      const filteredAppts = interval ? lawyerAppts.filter(a => {
        const d = new Date(a.date);
        return isWithinInterval(d, interval);
      }) : lawyerAppts;

      const filteredCases = interval ? lawyerCases.filter(c => {
        const d = new Date(c.createdAt);
        return isWithinInterval(d, interval);
      }) : lawyerCases;

      const closedInInterval = lawyerCases.filter(c => {
        if (c.status !== 'Closed' || !c.closedAt) return false;
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
  }, [lawyers, cases, appointments, dateRange]);

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

  // Overview Stats
  const activeCasesCount = cases?.filter(c => c.status === 'Active').length || 0;
  const pendingApptsCount = appointments?.filter(a => a.status === 'pending').length || 0;

  const caseStats = useMemo(() => [
    { name: 'Active', value: cases?.filter(c => c.status === 'Active').length || 0 },
    { name: 'Pending', value: cases?.filter(c => c.status === 'Pending').length || 0 },
    { name: 'Closed', value: cases?.filter(c => c.status === 'Closed').length || 0 },
    { name: 'Compliance', value: cases?.filter(c => c.status === 'For Compliance').length || 0 },
  ], [cases]);

  const apptStats = useMemo(() => [
    { name: 'Scheduled', value: appointments?.filter(a => a.status === 'scheduled').length || 0 },
    { name: 'Completed', value: appointments?.filter(a => a.status === 'completed').length || 0 },
    { name: 'Cancelled', value: appointments?.filter(a => a.status === 'cancelled').length || 0 },
    { name: 'Rescheduled', value: appointments?.filter(a => a.status === 'rescheduled').length || 0 },
  ].filter(stat => stat.value > 0), [appointments]);

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
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/50 p-1 rounded-2xl border-2 border-primary/5 h-14 mb-8">
            <TabsTrigger value="overview" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <TrendingUp className="h-4 w-4 mr-2" /> System Overview
            </TabsTrigger>
            <TabsTrigger value="workload" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
              <Briefcase className="h-4 w-4 mr-2" /> Workload & Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Active Registry", value: activeCasesCount, icon: Scale, color: "text-blue-600", bg: "bg-blue-50" },
                { label: "Total Intakes", value: appointments?.length || 0, icon: Calendar, color: "text-teal-600", bg: "bg-teal-50" },
                { label: "Auth Staff", value: lawyers?.length || 0, icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" },
                { label: "Triage Queue", value: pendingApptsCount, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" }
              ].map((stat, i) => (
                <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn("p-4 rounded-2xl", stat.bg)}>
                        <stat.icon className={cn("h-6 w-6", stat.color)} />
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                      <p className="text-3xl font-black text-primary">{stat.value}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white">
                <CardHeader className="pb-2 border-b border-primary/5">
                  <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" /> Caseload Distribution
                  </CardTitle>
                  <CardDescription>Current legal workload status across the district.</CardDescription>
                </CardHeader>
                <CardContent className="h-[350px] pt-8">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={caseStats}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748B' }} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748B' }} />
                      <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 700 }} />
                      <Bar dataKey="value" fill="#1A237E" radius={[12, 12, 0, 0]} barSize={60}>
                        {caseStats.map((entry, index) => <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-none shadow-xl rounded-[2.5rem] bg-white flex flex-col">
                <CardHeader className="pb-2 border-b border-primary/5">
                  <CardTitle className="text-lg font-bold text-primary">Visit Outcomes</CardTitle>
                  <CardDescription>Daily conversion and attendance.</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col items-center justify-center pt-4">
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={apptStats} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value">
                          {apptStats.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 pb-4">
                    {apptStats.map((stat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.name}: {stat.value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="workload" className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                  <div className="flex-1 w-full space-y-4">
                    <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
                      <Briefcase className="h-6 w-6" /> Lawyer Activity Table
                    </CardTitle>
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                        <Input 
                          placeholder="Filter by Attorney Name..." 
                          className="pl-9 h-11 rounded-xl border-primary/10 bg-white"
                          value={lawyerSearch}
                          onChange={(e) => setLawyerSearch(e.target.value)}
                        />
                      </div>
                      
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="h-11 rounded-xl border-primary/10 bg-white font-bold text-primary px-4 gap-2">
                            <CalendarDays className="h-4 w-4" />
                            {dateRange?.from ? (
                              dateRange.to ? (
                                <>
                                  {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(dateRange.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick an Analysis Range</span>
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
