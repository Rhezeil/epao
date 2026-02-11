"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { FileText, Briefcase, Bell, MessageSquare, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ClientDashboard() {
  return (
    <DashboardLayout role="client">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-headline">My Legal Portal</h1>
            <p className="text-muted-foreground">Welcome back. View your active cases and communicate with your legal team.</p>
          </div>
          <Button className="bg-secondary hover:bg-secondary/90">
            <MessageSquare className="mr-2 h-4 w-4" />
            Contact Lawyer
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Active Case: #4492 - Property Dispute</CardTitle>
              <CardDescription>Status: In Progress - Documentation Review Phase</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-primary/5 p-4 rounded-xl mb-6">
                <p className="text-sm font-semibold text-primary mb-2">Next Step</p>
                <p className="text-sm">Submit proof of ownership documents before Oct 30, 2023.</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Recent Documents</h4>
                <div className="grid gap-3">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/10 transition-colors">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-secondary mr-3" />
                        <div>
                          <p className="text-sm font-medium">Initial_Discovery_Draft.pdf</p>
                          <p className="text-[10px] text-muted-foreground">Added by Lawyer Mark S. • 2.4 MB</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Legal Team</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    MS
                  </div>
                  <div>
                    <p className="text-sm font-bold">Mark Stevenson</p>
                    <p className="text-xs text-muted-foreground">Senior Partner, Real Estate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Bell className="h-4 w-4 mr-2 text-secondary" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="text-xs border-b pb-2 last:border-0 last:pb-0">
                    <p className="font-semibold">New Document Uploaded</p>
                    <p className="text-muted-foreground">Your lawyer has uploaded a new draft for review.</p>
                    <p className="mt-1 text-secondary">3 hours ago</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}