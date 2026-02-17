
"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
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
  Scale, Gavel, ClipboardList, ShieldCheck,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const COLORS = ['#1A237E', '#008080', '#F59E0B', '#EF4444', '#6366F1'];

export default function AdminDashboard() {
  const db = useFirestore();
  const { user, role, loading } = useAuth();
  const [period, setPeriod] = useState("month");

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

  const { data: cases } = useCollection(casesQuery);
  const { data: appointments } = useCollection(apptsQuery);
  const { data: lawyers } = useCollection(lawyersQuery);

  // SAFE GUARD: Do not mount or show UI until role is verified
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || role !== 'admin') {
    return null; // AuthProvider handles redirects
  }

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
      </div>
    </DashboardLayout>
  );
}
