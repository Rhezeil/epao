"use client";

import React from "react";
import { useAuth, UserRole } from "@/components/auth-provider";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Compass, 
  LogOut, 
  Scale, 
  Briefcase, 
  Users, 
  FileText, 
  Settings,
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { signOut, user } = useAuth();
  const router = useRouter();

  const getMenuItems = () => {
    const common = [
      { icon: LayoutDashboard, label: "About", path: `/dashboard/${role}` },
      { icon: Compass, label: "Case Navigator", path: "/case-navigator" },
    ];

    if (role === "admin") {
      return [
        ...common,
        { icon: Users, label: "Users Management", path: "/dashboard/admin/users" },
        { icon: Briefcase, label: "Lawyer List", path: "/dashboard/admin/lawyers" },
        { icon: Settings, label: "System Settings", path: "/dashboard/admin/settings" },
      ];
    }

    if (role === "lawyer") {
      return [
        ...common,
        { icon: Users, label: "My Clients", path: "/dashboard/lawyer/clients" },
        { icon: FileText, label: "Active Cases", path: "/dashboard/lawyer/cases" },
      ];
    }

    if (role === "client") {
      return [
        ...common,
        { icon: Calendar, label: "Book Appointment", path: "/dashboard/client/book-appointment" },
        { icon: FileText, label: "Case Updates", path: "/dashboard/client/cases" },
      ];
    }

    return common;
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border bg-white">
        <SidebarHeader className="p-6">
          <div className="flex items-center space-x-2">
            <Scale className="h-6 w-6 text-primary" />
          </div>
          <div className="mt-4 px-2 py-1 bg-secondary/10 rounded-md inline-block">
            <span className="text-[10px] uppercase tracking-wider font-bold text-secondary">{role} Portal</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-3">
          <SidebarMenu>
            {getMenuItems().map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton 
                  onClick={() => router.push(item.path)}
                  className="hover:bg-muted/50 transition-colors"
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold text-muted-foreground truncate">{user?.email}</p>
          </div>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                onClick={signOut} 
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-16 items-center border-b bg-white px-6">
          <SidebarTrigger />
          <div className="ml-auto flex items-center space-x-4">
            {/* Additional Header Actions */}
          </div>
        </header>
        <main className="flex-1 overflow-auto bg-background p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
