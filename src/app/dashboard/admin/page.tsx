
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import { Shield, Users, Briefcase, Calendar, CheckCircle2, AlertCircle, FileText, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const COLORS = ['#1A237E', '#008080', '#F59E0B', '#EF4444'];

export default function AdminDashboard() {
  const db = useFirestore();

  const casesQuery = useMemoFirebase(() => db ? query(collection(db, "cases")) : null, [db]);
  const apptsQuery = useMemoFirebase(() => db ? query(collection(db, "appointments")) : null, [db]);
  const lawyersQuery = useMemoFirebase(() => db ? query(collection(db, "roleLawyer")) : null, [db]);

  const { data: cases } = useCollection(casesQuery);
  const { data: appointments } = useCollection(apptsQuery);
  const { data: lawyers } = useCollection(lawyersQuery);

  // Data Processing
  const caseStats = [
    { name: 'Active', value: cases?.filter(c => c.status === 'Active').length || 0 },
    { name: 'Pending', value: cases?.filter(c => c.status === 'Pending').length || 0 },
    { name: 'Closed', value: cases?.filter(c => c.status === 'Closed').length || 0 },
    { name: 'Compliance', value: cases?.filter(c => c.status === 'For Compliance').length || 0 },
  ];

  const apptStats = [
    { name: 'Scheduled', value: appointments?.filter(a => a.status === 'scheduled').length || 0 },
    { name: 'Completed', value: appointments?.filter(a => a.status === 'completed').length || 0 },
    { name: 'Cancelled', value: appointments?.filter(a => a.status === 'cancelled').length || 0 },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Admin Command Center</h1>
            <p className="text-muted-foreground font-medium">Real-time operational overview and legal analytics.</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="px-4 py-2 border-primary/20 bg-primary/5 font-bold">
              <TrendingUp className="mr-2 h-4 w-4" /> Live System Monitor
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Active Cases", value: cases?.length || 0, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
            { label: "Total Appts", value: appointments?.length || 0, icon: Calendar, color: "text-teal-600", bg: "bg-teal-50" },
            { label: "Practitioners", value: lawyers?.length || 0, icon: Briefcase, color: "text-amber-600", bg: "bg-amber-50" },
            { label: "Pending Triage", value: appointments?.filter(a => a.status === 'pending').length || 0, icon: AlertCircle, color: "text-red-600", bg: "bg-red-50" }
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm rounded-3xl overflow-hidden">
              <CardContent className="p-6 flex items-center gap-4">
                <div className={cn("p-4 rounded-2xl", stat.bg)}>
                  <stat.icon className={cn("h-6 w-6", stat.color)} />
                </div>
                <div>
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <p className="text-2xl font-black text-primary">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">Case Status Breakdown</CardTitle>
              <CardDescription>Visual distribution of current legal workload.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={caseStats}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="value" fill="#1A237E" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-primary">Appointment Outcomes</CardTitle>
              <CardDescription>Daily conversion and attendance rates.</CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={apptStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {apptStats.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
