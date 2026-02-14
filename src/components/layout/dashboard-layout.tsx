
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
  CalendarCheck,
  User,
  Settings
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { cn } from "@/lib/utils";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: UserRole;
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { signOut, user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  
  const logo = PlaceHolderImages.find(img => img.id === 'pao-logo');

  const getMenuItems = () => {
    const commonItems = [
      { icon: Compass, label: "Case Navigator", path: "/case-navigator" },
    ];

    if (role === "admin") {
      return [
        ...commonItems,
        { icon: LayoutDashboard, label: "About", path: `/dashboard/admin` },
        { icon: Users, label: "Users Management", path: "/dashboard/admin/users" },
        { icon: Briefcase, label: "Lawyer List", path: "/dashboard/admin/lawyers" },
      ];
    }

    if (role === "lawyer") {
      return [
        ...commonItems,
        { icon: LayoutDashboard, label: "About", path: `/dashboard/lawyer` },
        { icon: Users, label: "My Clients", path: "/dashboard/lawyer/clients" },
        { icon: FileText, label: "Active Cases", path: "/dashboard/lawyer/cases" },
      ];
    }

    if (role === "client") {
      return [
        ...commonItems,
        { icon: LayoutDashboard, label: "About", path: `/dashboard/client` },
        { icon: Calendar, label: "Book Appointment", path: "/dashboard/client/book-appointment" },
        { icon: CalendarCheck, label: "Manage Appointment", path: "/case-navigator?mode=manage" },
        { icon: FileText, label: "Case Updates", path: "/dashboard/client/cases" },
      ];
    }

    return commonItems;
  };

  const menuItems = getMenuItems();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r border-primary/10 bg-white/40 backdrop-blur-md">
          <SidebarHeader className="p-6 flex flex-col items-center space-y-4">
            {logo && (
              <div 
                className="cursor-pointer transition-transform hover:scale-105"
                onClick={() => router.push(role ? `/dashboard/${role}` : '/')}
              >
                <Image 
                  src={logo.imageUrl} 
                  alt={logo.description} 
                  width={140} 
                  height={140} 
                  className="rounded-full object-contain shadow-lg border-2 border-white/50"
                  data-ai-hint={logo.imageHint}
                />
              </div>
            )}
            <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-[10px] uppercase tracking-widest font-bold text-primary">
                {role || 'Guest'} Portal
              </span>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton 
                    onClick={() => router.push(item.path)}
                    isActive={pathname === item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-6 rounded-lg transition-all duration-200 group",
                      pathname === item.path 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "text-primary hover:bg-primary/5 hover:translate-x-1"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 transition-transform group-hover:scale-110",
                      pathname === item.path ? "text-primary-foreground" : "text-primary"
                    )} />
                    <span className="font-semibold text-sm">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-6 border-t border-primary/10 mt-auto">
            <div className="space-y-4">
              <div className="px-4 py-3 bg-white/40 rounded-lg border border-primary/5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-primary truncate">
                      {user?.email?.includes('@epao.mobile') ? user.email.split('@')[0] : user?.email}
                    </p>
                    <p className="text-[10px] text-muted-foreground capitalize">{role}</p>
                  </div>
                </div>
              </div>
              
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={() => router.push('/profile')}
                    className="w-full justify-start text-primary hover:bg-primary/5 py-4"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span className="text-xs font-medium">Settings</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton 
                    onClick={signOut} 
                    className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive py-4"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    <span className="text-xs font-bold">Logout</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-transparent flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white/20 backdrop-blur-lg px-6">
            <SidebarTrigger className="text-primary hover:bg-primary/5" />
            <div className="ml-4">
              <h2 className="text-sm font-bold text-primary uppercase tracking-wider">
                LexConnect Legal Portal
              </h2>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6 md:p-10">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
