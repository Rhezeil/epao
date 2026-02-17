
"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend, Cell as RechartsCell
} from "recharts";
import { 
  Shield, Users, Briefcase, Calendar, CheckCircle2, 
  AlertCircle, FileText, TrendingUp, Filter,
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  Scale, Gavel, ClipboardList
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const COLORS = ['#1A237E', '#008080', '#F59E0B', '#EF4444', '#6366F1'];

export default function AdminDashboard() {
  const db = useFirestore();
  const [period, setPeriod] = useState("month");

  const casesQuery = useMemoFirebase(() => db ? query(collection(db, "cases")) : null, [db]);
  const apptsQuery = useMemoFirebase(() => db ? query(collection(db, "appointments")) : null, [db]);
  const lawyersQuery = useMemoFirebase(() => db ? query(collection(db, "roleLawyer")) : null, [db]);

  const { data: cases } = useCollection(casesQuery);
  const { data: appointments } = useCollection(apptsQuery);
  const { data: lawyers } = useCollection(lawyersQuery);

  // --- KPI Processing ---
  const activeCasesCount = cases?.filter(c => c.status === 'Active').length || 0;
  const pendingApptsCount = appointments?.filter(a => a.status === 'pending').length || 0;

  // --- Case Status Breakdown (Bar Chart) ---
  const caseStats = useMemo(() => [
    { name: 'Active', value: cases?.filter(c => c.status === 'Active').length || 0 },
    { name: 'Pending', value: cases?.filter(c => c.status === 'Pending').length || 0 },
    { name: 'Closed', value: cases?.filter(c => c.status === 'Closed').length || 0 },
    { name: 'Compliance', value: cases?.filter(c => c.status === 'For Compliance').length || 0 },
  ], [cases]);

  // --- Appointment Outcomes (Pie Chart) ---
  const apptStats = useMemo(() => [
    { name: 'Scheduled', value: appointments?.filter(a => a.status === 'scheduled').length || 0 },
    { name: 'Completed', value: appointments?.filter(a => a.status === 'completed').length || 0 },
    { name: 'Cancelled', value: appointments?.filter(a => a.status === 'cancelled').length || 0 },
    { name: 'Rescheduled', value: appointments?.filter(a => a.status === 'rescheduled').length || 0 },
  ].filter(stat => stat.value > 0), [appointments]);

  // --- Services Rendered Breakdown ---
  const serviceStats = useMemo(() => {
    const counts: Record<string, number> = {};
    appointments?.forEach(a => {
      const type = a.serviceType || a.purpose || 'Other';
      counts[type] = (counts[type] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [appointments]);

  // --- Top Case Types ---
  const topCases = useMemo(() => {
    const counts: Record<string, number> = {};
    cases?.forEach(c => {
      counts[c.caseType] = (counts[c.caseType] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [cases]);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Admin Command Center</h1>
            <p className="text-muted-foreground font-medium">Strategic overview of legal operations and system performance.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border shadow-sm">
            <Filter className="h-4 w-4 text-primary ml-2" />
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[180px] border-none shadow-none font-bold text-primary">
                <SelectValue placeholder="Filter by Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">Fiscal Year 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* --- KPI Cards --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active Matters", value: activeCasesCount, icon: Scale, color: "text-blue-600", bg: "bg-blue-50", trend: "+5.2%", isUp: true },
            { label: "Total Visits", value: appointments?.length || 0, icon: Calendar, color: "text-teal-600", bg: "bg-teal-50", trend: "+12.1%", isUp: true },
            { label: "Lawyers", value: lawyers?.length || 0, icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50", trend: "Stable", isUp: null },
            { label: "Triage Queue", value: pendingApptsCount, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50", trend: "-2.4%", isUp: false }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-4 rounded-2xl", stat.bg)}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  {stat.isUp !== null && (
                    <Badge variant="outline" className={cn(
                      "flex items-center gap-1 border-none font-black px-2 py-1",
                      stat.isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {stat.isUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {stat.trend}
                    </Badge>
                  )}
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
          {/* --- Case Status Breakdown --- */}
          <Card className="lg:col-span-2 border-none shadow-xl rounded-[2.5rem] bg-white">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" /> Case Status Breakdown
                  </CardTitle>
                  <CardDescription>Current legal workload distribution across all offices.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="h-5 w-5" /></Button>
              </div>
            </CardHeader>
            <CardContent className="h-[350px] pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={caseStats} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fontWeight: 700, fill: '#64748B' }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: '#64748B' }} 
                  />
                  <Tooltip 
                    cursor={{ fill: '#F8FAFC' }}
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                      fontWeight: 700
                    }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#1A237E" 
                    radius={[12, 12, 0, 0]} 
                    barSize={60}
                  >
                    {caseStats.map((entry, index) => (
                      <RechartsCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* --- Appointment Outcomes --- */}
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold text-primary">Outcomes</CardTitle>
              <CardDescription>Daily conversion and attendance rates.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col items-center justify-center pt-0">
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={apptStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={100}
                      paddingAngle={8}
                      dataKey="value"
                    >
                      {apptStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                {apptStats.map((stat, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{stat.name}: {stat.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-12">
          {/* --- Services Rendered Breakdown --- */}
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-primary/5 pb-4">
              <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                <ClipboardList className="h-5 w-5" /> Services Rendered
              </CardTitle>
              <CardDescription>Breakdown of public legal services provided this {period}.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {serviceStats.map((stat, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10 transition-colors hover:bg-primary/10">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-xl shadow-sm border text-primary">
                        <FileText className="h-4 w-4" />
                      </div>
                      <span className="font-bold text-primary">{stat.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-primary text-white font-black">{stat.value}</Badge>
                    </div>
                  </div>
                ))}
                {serviceStats.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground italic">No service data recorded for this period.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* --- Top Filed & Booked Cases --- */}
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
            <CardHeader className="bg-teal-50/50 pb-4">
              <CardTitle className="text-lg font-bold text-teal-900 flex items-center gap-2">
                <Gavel className="h-5 w-5" /> Top Case Categories
              </CardTitle>
              <CardDescription>Most frequently filed matters and booked consultations.</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {topCases.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-teal-50/30 rounded-2xl border border-teal-100 transition-colors hover:bg-teal-50/50">
                    <div className="flex items-center gap-4">
                      <div className="h-8 w-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-xs">
                        #{i + 1}
                      </div>
                      <span className="font-bold text-teal-900 leading-tight">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-black text-teal-700">{item.count}</p>
                      <p className="text-[10px] font-black uppercase text-teal-600/60 tracking-widest">Active Cases</p>
                    </div>
                  </div>
                ))}
                {topCases.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground italic">No case data available for ranking.</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
