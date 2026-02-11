
"use client";

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { collection, query, where } from "firebase/firestore";
import { Briefcase, Loader2 } from "lucide-react";

export default function AdminLawyersPage() {
  const db = useFirestore();

  // Memoize the query to fetch only lawyers
  const lawyersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "users"), where("role", "==", "lawyer"));
  }, [db]);

  const { data: lawyers, isLoading } = useCollection(lawyersQuery);

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Lawyer Directory</h1>
          <p className="text-muted-foreground">Manage professional legal service providers.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-secondary" />
              Verified Lawyers
            </CardTitle>
            <CardDescription>
              List of all lawyers currently active on the platform.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-secondary" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name/Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lawyers && lawyers.length > 0 ? (
                    lawyers.map((lawyer) => (
                      <TableRow key={lawyer.id}>
                        <TableCell className="font-medium">{lawyer.email}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Active
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {lawyer.createdAt ? new Date(lawyer.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        No lawyers found.
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
