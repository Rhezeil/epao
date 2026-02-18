
"use client";

import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { format } from "date-fns";
import { 
  FileText, 
  Scale, 
  Search,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Loader2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function LawyerCasesPage() {
  const { user, role, loading } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();
  const [search, setSearch] = useState("");

  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'lawyer') return null;
    return query(
      collection(db, "cases"), 
      where("lawyerId", "==", user.uid)
    );
  }, [db, user, role]);

  const { data: cases, isLoading } = useCollection(casesQuery ? casesQuery : null);

  const filteredCases = useMemo(() => {
    if (!cases) return [];
    return cases.filter(c => 
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.caseType.toLowerCase().includes(search.toLowerCase())
    );
  }, [cases, search]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-secondary" />
      </div>
    );
  }

  if (!user || role !== 'lawyer') return null;

  const handleUpdateStatus = (caseId: string, status: string) => {
    if (!db) return;
    updateDocumentNonBlocking(doc(db, "cases", caseId), { 
      status,
      updatedAt: new Date().toISOString(),
      ...(status === 'Closed' ? { closedAt: new Date().toISOString() } : { closedAt: null })
    });
    toast({ title: "Case Updated", description: `Case ${caseId} is now ${status}.` });
  };

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-secondary font-headline tracking-tight">Case Registry</h1>
            <p className="text-muted-foreground font-medium">Manage and progress legal matters assigned to your district office.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/30" />
            <Input 
              placeholder="Search Case ID or Type..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 h-11 rounded-xl border-secondary/10 bg-white focus-visible:ring-secondary/20 font-bold"
            />
          </div>
        </div>

        <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden">
          <CardHeader className="bg-secondary/5 pb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-secondary text-white rounded-xl">
                <Scale className="h-5 w-5" />
              </div>
              <CardTitle className="text-xl font-bold text-secondary">My Professional Caseload</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-secondary" /></div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="px-8 font-black text-[10px] uppercase tracking-widest text-secondary/40">Legal Matter</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-secondary/40">Status</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-secondary/40">Date Opened</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-secondary/40">Case ID</TableHead>
                    <TableHead className="text-right px-8 font-black text-[10px] uppercase tracking-widest text-secondary/40">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCases.map((c) => (
                    <TableRow key={c.id} className="hover:bg-secondary/5 transition-colors group">
                      <TableCell className="px-8 py-6">
                        <p className="font-black text-secondary leading-none">{c.caseType}</p>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "font-black text-[9px] uppercase px-3",
                          c.status === 'Active' ? 'bg-green-500' : 
                          c.status === 'Closed' ? 'bg-gray-500' : 
                          c.status === 'For Compliance' ? 'bg-amber-500' : 'bg-secondary'
                        )}>
                          {c.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs font-bold text-secondary">
                        {c.createdAt ? format(new Date(c.createdAt), "MMM dd, yyyy") : '---'}
                      </TableCell>
                      <TableCell className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        {c.id}
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" className="h-9 rounded-xl font-bold text-[10px] uppercase text-secondary hover:bg-secondary/10">
                            View File
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-secondary/5">
                                <Settings2 className="h-4 w-4 text-secondary" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="rounded-2xl w-56 p-2">
                              <DropdownMenuLabel className="text-[10px] font-black uppercase text-secondary/40 tracking-widest px-2 pb-2">Status Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(c.id, "Active")} className="rounded-xl font-bold">
                                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Mark as Active
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(c.id, "For Compliance")} className="rounded-xl font-bold">
                                <AlertCircle className="mr-2 h-4 w-4 text-amber-600" /> Mark For Compliance
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(c.id, "Closed")} className="rounded-xl font-bold">
                                <FileText className="mr-2 h-4 w-4 text-muted-foreground" /> Close Legal Case
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {filteredCases.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-20 text-muted-foreground italic font-medium">
                        No Case records found in your workstation.
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
