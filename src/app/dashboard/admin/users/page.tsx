
"use client";

import { useFirestore, useCollection, useMemoFirebase, setDocumentNonBlocking, updateDocumentNonBlocking, deleteDocumentNonBlocking } from "@/firebase";
import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { Shield, Briefcase, UserCircle, Loader2, MoreVertical, ShieldAlert, Trash2 } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsersPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const { user: currentUser, role: currentRole } = useAuth();

  // Memoize the query to fetch all users, guarding with auth check
  const usersQuery = useMemoFirebase(() => {
    if (!db || !currentUser || currentRole !== 'admin') return null;
    return query(collection(db, "users"), orderBy("email", "asc"));
  }, [db, currentUser, currentRole]);

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

  const handlePromoteToAdmin = (userId: string, currentEmail: string) => {
    if (!db) return;
    
    const userRef = doc(db, "users", userId);
    const adminRef = doc(db, "roleAdmin", userId);

    // Remove from users if you want strict separation, or just mark role
    updateDocumentNonBlocking(userRef, { role: "admin" });
    setDocumentNonBlocking(adminRef, {
      id: userId,
      role: "admin",
      email: currentEmail,
      permission: "read/write",
      createdAt: new Date().toISOString(),
    }, { merge: true });

    toast({
      title: "User Promoted",
      description: `${currentEmail} has been granted administrative access in 'roleAdmin'.`
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (!db) return;
    const userRef = doc(db, "users", userId);
    deleteDocumentNonBlocking(userRef);
    toast({
      variant: "destructive",
      title: "User Removed",
      description: "User account has been deleted from the database."
    });
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
                    <TableHead className="text-right">Actions</TableHead>
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
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {user.role !== 'admin' && (
                                <DropdownMenuItem onClick={() => handlePromoteToAdmin(user.id, user.email)}>
                                  <ShieldAlert className="mr-2 h-4 w-4" />
                                  Make Admin
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem 
                                onClick={() => handleDeleteUser(user.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete User
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
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
