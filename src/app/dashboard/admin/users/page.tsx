"use client";

import { useFirestore, useCollection, useMemoFirebase, deleteDocumentNonBlocking } from "@/firebase";
import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { UserCircle, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user: currentUser, role: currentRole } = useAuth();

  // Fetch only Client records (from 'users' collection)
  const usersQuery = useMemoFirebase(() => {
    if (!db || !currentUser || currentRole !== 'admin') return null;
    return query(collection(db, "users"), orderBy("email", "asc"));
  }, [db, currentUser, currentRole]);

  const { data: users, isLoading } = useCollection(usersQuery);

  const handleDeleteUser = (userId: string) => {
    if (!db) return;
    const userRef = doc(db, "users", userId);
    deleteDocumentNonBlocking(userRef);
    toast({
      variant: "destructive",
      title: "User Removed",
      description: "Client account deleted."
    });
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Client Registry</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Registered Clients</CardTitle>
            <CardDescription>
              Current active clients: {users?.length || 0}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading clients...</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Registration Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users && users.length > 0 ? (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline"><UserCircle className="mr-1 h-3 w-3" /> Client</Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                        No clients found in registry.
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
