"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, MessageSquare, Clock } from "lucide-react";

export default function LawyerDashboard() {
  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Lawyer Workspace</h1>
          <p className="text-muted-foreground">Manage your cases, clients, and consultations.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">My Clients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">2 new this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Pending Meetings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
              <p className="text-xs text-muted-foreground">Next: 2:00 PM today</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Unread Messages</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Urgent action required (3)</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">142.5</div>
              <p className="text-xs text-muted-foreground">Target: 160 hrs</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Consultations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center p-3 rounded-lg bg-muted/30">
                    <div className="mr-4 text-center border-r pr-4 border-muted">
                      <p className="text-lg font-bold">24</p>
                      <p className="text-[10px] uppercase">OCT</p>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">Discovery Meeting - Case #8241</p>
                      <p className="text-xs text-muted-foreground">Client: James Sterling</p>
                    </div>
                    <div className="text-xs font-medium text-secondary">09:30 AM</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Case Timeline Updates</CardTitle>
            </CardHeader>
            <CardContent>
               <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="relative pl-6 pb-4 border-l last:pb-0 last:border-0">
                    <div className="absolute left-[-5px] top-1 h-2 w-2 rounded-full bg-primary" />
                    <p className="text-xs text-muted-foreground">Yesterday</p>
                    <p className="text-sm font-medium">Documents Filed: Court Hearing Ready</p>
                  </div>
                ))}
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}