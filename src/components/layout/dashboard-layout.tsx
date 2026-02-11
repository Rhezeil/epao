
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
  Briefcase, 
  Users, 
  FileText, 
  Calendar,
  CalendarCheck
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { signOut, user } = useAuth();
  const router = useRouter();
  
  const logo = PlaceHolderImages.find(img => img.id === 'pao-logo');

  const getMenuItems = () => {
    if (role === "admin") {
      return [
        { icon: Users, label: "Users Management", path: "/dashboard/admin/users" },
        { icon: Briefcase, label: "Lawyer List", path: "/dashboard/admin/lawyers" },
        { icon: LayoutDashboard, label: "About", path: `/dashboard/admin` },
        { icon: Compass, label: "Case Navigator", path: "/case-navigator" },
      ];
    }

    if (role === "lawyer") {
      return [
        { icon: LayoutDashboard, label: "About", path: `/dashboard/lawyer` },
        { icon: Compass, label: "Case Navigator", path: "/case-navigator" },
        { icon: Users, label: "My Clients", path: "/dashboard/lawyer/clients" },
        { icon: FileText, label: "Active Cases", path: "/dashboard/lawyer/cases" },
      ];
    }

    if (role === "client") {
      return [
        { icon: Compass, label: "Case Navigator", path: "/case-navigator" },
        { icon: Calendar, label: "Book Appointment", path: "/dashboard/client/book-appointment" },
        { icon: CalendarCheck, label: "Manage Appointment", path: "/case-navigator?mode=manage" },
        { icon: FileText, label: "Case Updates", path: "/dashboard/client/cases" },
        { icon: LayoutDashboard, label: "About", path: `/dashboard/client` },
      ];
    }

    return [];
  };

  return (
    <SidebarProvider>
      <Sidebar className="border-r border-border bg-white">
        <SidebarHeader className="p-4 pb-2 space-y-4">
          <div className="flex items-center justify-center">
            {logo && (
              <div className="p-1 bg-white rounded-full shadow-sm border border-border/50 overflow-hidden">
                <Image 
                  src={logo.imageUrl} 
                  alt={logo.description} 
                  width={140} 
                  height={140} 
                  className="rounded-full object-contain"
                  data-ai-hint={logo.imageHint}
                />
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <div className="px-2 py-1 bg-secondary/10 rounded-md inline-block">
              <span className="text-[10px] uppercase tracking-wider font-bold text-secondary">{role} Portal</span>
            </div>
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
      <SidebarInset className="bg-background">
        <header className="flex h-16 items-center border-b bg-white px-6">
          <SidebarTrigger />
          <div className="ml-auto flex items-center space-x-4">
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
