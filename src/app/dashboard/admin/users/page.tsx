
"use client";

import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { collection, query, orderBy } from "firebase/firestore";
import { User, Shield, Briefcase, UserCircle, Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const db = useFirestore();

  // Memoize the query to fetch all users
  const usersQuery = useMemoFirebase(() => {
    if (!db) return null;
    return query(collection(db, "users"), orderBy("email", "asc"));
  }, [db]);

  // Subscribe to real-time updates
  const { data: users, isLoading } = useCollection(usersQuery);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-primary hover:bg-primary/90"><Shield className="mr-1 h-3 w-3" /> Admin</Badge>;
      case "lawyer":
        return <Badge className="bg-secondary hover:bg-secondary/90"><Briefcase className="mr-1 h-3 w-3" /> Lawyer</Badge>;
      default:
        return <Badge variant="outline"><UserCircle className="mr-1 h-3 w-3" /> Client</Badge>;
    }
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">User Management</h1>
          <p className="text-muted-foreground">View and manage all registered accounts in LexConnect.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
            <CardDescription>
              Total registered users: {users?.length || 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading users...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Registration Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-mono text-[10px] text-muted-foreground">
                          {user.id}
                        </TableCell>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No users found.
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
