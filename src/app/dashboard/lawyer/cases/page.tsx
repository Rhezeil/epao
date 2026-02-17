
"use client";

import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, orderBy } from "firebase/firestore";
import { format } from "date-fns";
import { 
  FileText, 
  Scale, 
  User, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Search,
  Filter,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

export default function LawyerCasesPage() {
  const { user, role } = useAuth();
  const db = useFirestore();
  const [search, setSearch] = useState("");

  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(collection(db, "cases"), where("lawyerId", "==", user.uid), orderBy("createdAt", "desc"));
  }, [db, user, role]);

  const { data: cases, isLoading } = useCollection(casesQuery);

  const filteredCases = useMemo(() => {
    if (!cases) return [];
    return cases.filter(c => 
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.caseType.toLowerCase().includes(search.toLowerCase())
    );
  }, [cases, search]);

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Case Registry</h1>
            <p className="text-muted-foreground font-medium">Comprehensive list of all legal matters assigned to your office.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/30" />
            <Input 
              placeholder="Search Case ID or Type..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-11 rounded-xl border-primary/10 bg-white"
            />
          </div>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-primary/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary text-white rounded-xl">
                <Scale className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-primary">Assigned Caseload</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-primary/40">Case Profile</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Date Opened</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-primary/40">Date Closed</TableHead>
                    <TableHead className="text-right px-8 font-black text-[10px] uppercase tracking-widest text-primary/40">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((c) => (
                    <TableRow key={c.id} className="hover:bg-primary/5 transition-colors group">
                      <TableCell className="px-8 py-6">
                        <div className="space-y-1">
                          <p className="font-black text-primary leading-none">{c.caseType}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{c.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "font-black text-[9px] uppercase px-3",
                          c.status === 'Active' ? 'bg-green-500' : 
                          c.status === 'Closed' ? 'bg-gray-500' : 'bg-primary'
                        )}>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-primary">
                        {c.createdAt ? format(new Date(c.createdAt), "MMM dd, yyyy") : '---'}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-muted-foreground">
                        {c.closedAt ? format(new Date(c.closedAt), "MMM dd, yyyy") : '---'}
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <Badge variant="outline" className="cursor-pointer hover:bg-primary/5">
                          View File <ChevronRight className="h-3 w-3 ml-1" />
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCases.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic">
                        No Case records found in your directory.
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
