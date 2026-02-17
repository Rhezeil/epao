
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
  Settings,
  LogIn,
  Database,
  Search,
  ShieldCheck,
  TrendingUp,
  Clock
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
    if (!user) {
      return [
        { icon: Compass, label: "Case Requirement Navigator", path: "/case-navigator" },
        { icon: Calendar, label: "Book an appointment", path: "/book-appointment" },
        { icon: Search, label: "Manage Booking", path: "/manage-appointment" },
        { icon: TrendingUp, label: "About Us", path: "/about" },
      ];
    }

    if (role === "client") {
      return [
        { icon: LayoutDashboard, label: "Client Dashboard", path: "/dashboard/client" },
        { icon: Compass, label: "Case Requirement Navigator", path: "/case-navigator" },
        { icon: CalendarCheck, label: "Book an appointment", path: "/dashboard/client/book-appointment" },
      ];
    }

    if (role === "admin") {
      return [
        { icon: LayoutDashboard, label: "Analytics Overview", path: "/dashboard/admin" },
        { icon: ShieldCheck, label: "Client Triage", path: "/dashboard/admin/triage" },
        { icon: Users, label: "Client Directory", path: "/dashboard/admin/users" },
        { icon: Briefcase, label: "Lawyers", path: "/dashboard/admin/lawyers" },
        { icon: Database, label: "Legal Standards", path: "/dashboard/admin/case-requirements" },
      ];
    }

    if (role === "lawyer") {
      return [
        { icon: LayoutDashboard, label: "Lawyer Home", path: "/dashboard/lawyer" },
        { icon: Clock, label: "Clinical Schedule", path: "/dashboard/lawyer" },
        { icon: FileText, label: "My Active Cases", path: "/dashboard/lawyer/cases" },
      ];
    }

    return [];
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
                  width={120} 
                  height={120} 
                  className="rounded-full object-contain shadow-lg border-2 border-white/50"
                  data-ai-hint={logo.imageHint}
                />
              </div>
            )}
            <div className="px-3 py-1 bg-primary/10 rounded-full border border-primary/20">
              <span className="text-[10px] uppercase tracking-widest font-black text-primary">
                {role || 'Guest'} Portal
              </span>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="px-4">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path + item.label}>
                  <SidebarMenuButton 
                    onClick={() => router.push(item.path)}
                    isActive={pathname === item.path}
                    className={cn(
                      "flex items-center gap-3 px-4 py-6 rounded-2xl transition-all duration-300",
                      pathname === item.path 
                        ? "bg-primary text-white shadow-xl scale-[1.02]" 
                        : "text-primary hover:bg-primary/5"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5",
                      pathname === item.path ? "text-white" : "text-primary"
                    )} />
                    <span className="font-bold text-sm">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-6 border-t border-primary/10 mt-auto">
            <div className="space-y-4">
              {user && (
                <div className="px-4 py-3 bg-white/40 rounded-2xl border border-primary/5 shadow-sm">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-primary truncate leading-none">
                        {user?.email?.split('@')[0]}
                      </p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest font-bold mt-1">{role}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <SidebarMenu>
                {user && (
                  <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => router.push('/profile')} className="w-full text-primary hover:bg-primary/5 rounded-xl">
                      <Settings className="h-4 w-4 mr-2" />
                      <span className="text-xs font-bold">Profile Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )}
                <SidebarMenuItem>
                  {user ? (
                    <SidebarMenuButton onClick={signOut} className="w-full text-red-600 hover:bg-red-50 rounded-xl">
                      <LogOut className="h-4 w-4 mr-2" />
                      <span className="text-xs font-black uppercase">Logout</span>
                    </SidebarMenuButton>
                  ) : (
                    <SidebarMenuButton onClick={() => router.push('/login')} className="w-full text-primary hover:bg-primary/5 rounded-xl border-2 border-primary/20 bg-primary/5">
                      <LogIn className="h-4 w-4 mr-2" />
                      <span className="text-xs font-black uppercase tracking-widest">Sign In</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              </SidebarMenu>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="bg-transparent flex-1">
          <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white/40 backdrop-blur-lg px-6">
            <SidebarTrigger className="text-primary hover:bg-primary/5" />
          </header>
          <main className="flex-1 overflow-auto p-6 md:p-10">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
