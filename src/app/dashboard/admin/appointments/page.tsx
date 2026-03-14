
"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  History, 
  Filter, 
  Trash2, 
  Loader2, 
  User, 
  Briefcase
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminAppointmentsRegistry() {
  const db = useFirestore();
  const { role, user, loading } = useAuth();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const apptsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "appointments"), orderBy("createdAt", "desc"));
  }, [db, user, role]);

  const lawyersQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'admin') return null;
    return query(collection(db, "roleLawyer"));
  }, [db, user, role]);

  const { data: appts, isLoading } = useCollection(apptsQuery);
  const { data: lawyers } = useCollection(lawyersQuery);

  const filteredAppts = useMemo(() => {
    if (!appts) return [];
    return appts.filter(a => {
      const matchesSearch = 
        a.referenceCode?.toLowerCase().includes(search.toLowerCase()) ||
        a.guestName?.toLowerCase().includes(search.toLowerCase()) ||
        a.clientName?.toLowerCase().includes(search.toLowerCase()) ||
        a.caseType?.toLowerCase().includes(search.toLowerCase()) ||
        a.serviceType?.toLowerCase().includes(search.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [appts, search, statusFilter]);

  const handleDelete = (id: string, ref: string) => {
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, "appointments", id));
    toast({ variant: "destructive", title: "Record Removed", description: `Reference ${ref} deleted from logs.` });
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  if (!user || role !== 'admin') return null;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
              <History className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-primary font-headline tracking-tight">System Intake Registry</h1>
              <p className="text-muted-foreground font-medium">Comprehensive logs of all screening appointments and consultations.</p>
            </div>
          </div>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
                <Input 
                  placeholder="Search Ref, Applicant or Matter..." 
                  className="h-12 pl-12 rounded-2xl border-primary/10 bg-white"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-3 w-full md:w-auto">
                <Filter className="h-4 w-4 text-primary/40 hidden sm:block" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 w-full md:w-[200px] rounded-2xl border-primary/10 bg-white font-bold">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="font-bold">All Records</SelectItem>
                    <SelectItem value="For Screening" className="font-bold text-amber-600">For Screening</SelectItem>
                    <SelectItem value="Eligible" className="font-bold text-green-600">Eligible</SelectItem>
                    <SelectItem value="Not Eligible" className="font-bold text-red-600">Not Eligible</SelectItem>
                    <SelectItem value="scheduled" className="font-bold text-blue-600">Consultation Set</SelectItem>
                    <SelectItem value="completed" className="font-bold text-gray-600">Concluded</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-primary/40">Filing Ref</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Applicant</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Matter</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Schedule</TableHead>
                    <TableHead className="text-right px-8 font-black text-[10px] uppercase tracking-widest text-primary/40">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppts.map((a) => {
                    const lawyer = lawyers?.find(l => l.id === a.lawyerId);
                    return (
                      <TableRow key={a.id} className="hover:bg-primary/5 transition-colors group">
                        <TableCell className="px-8 py-6">
                          <p className="font-black text-primary leading-none">{a.referenceCode}</p>
                          <p className="text-[9px] text-muted-foreground font-bold mt-1">LOGGED: {format(new Date(a.createdAt), "MMM dd, HH:mm")}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-primary/40" />
                            <span className="text-sm font-bold text-primary">{a.guestName || a.clientName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <Badge variant="outline" className="bg-primary/5 border-primary/10 text-[9px] font-black uppercase w-fit">
                              {a.serviceType || a.purpose || a.caseType}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn(
                            "font-black text-[9px] uppercase px-3",
                            a.status === 'Eligible' ? 'bg-green-500' : 
                            a.status === 'Not Eligible' ? 'bg-red-500' : 
                            a.status === 'For Screening' ? 'bg-amber-500' : 
                            a.status === 'scheduled' ? 'bg-blue-500' : 'bg-gray-500'
                          )}>
                            {a.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-0.5">
                            <p className="text-xs font-bold text-primary">{format(new Date(a.date), "MMM dd, yyyy")}</p>
                            <p className="text-[10px] text-muted-foreground font-medium">{a.time}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl text-destructive hover:bg-destructive/10"
                            onClick={() => handleDelete(a.id, a.referenceCode)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {filteredAppts.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-24 text-muted-foreground italic font-medium">
                        No intake records match your search criteria.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
