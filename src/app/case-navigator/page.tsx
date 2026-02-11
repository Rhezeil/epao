
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Compass, CheckCircle, Calendar, ShieldCheck, HelpCircle, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CaseNavigatorPage() {
  const { role, user } = useAuth();
  const router = useRouter();

  return (
    <DashboardLayout role={role}>
      <div className="max-w-4xl mx-auto space-y-8 py-4">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
            <Compass className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold font-headline text-primary tracking-tight md:text-5xl">
            ePAO Case Requirements, Appointment, and Service Management System
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Determine if your case is under PAO jurisdiction and book a consultation. 
            {!user && (
              <span className="block mt-2 font-medium text-secondary">
                For existing cases, please log in to manage your appointments.
              </span>
            )}
          </p>
          {!user && (
            <div className="flex justify-center gap-4 pt-4">
              <Button onClick={() => router.push("/login")} className="bg-primary px-8">
                Login to Portal
              </Button>
              <Button onClick={() => router.push("/register")} variant="outline" className="px-8 border-primary text-primary">
                Register as Client
              </Button>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="relative overflow-hidden border-2 border-secondary/10 hover:border-secondary/30 transition-all shadow-sm">
            <CardHeader className="bg-secondary/5">
              <CardTitle className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-secondary" />
                Jurisdiction Assessment
              </CardTitle>
              <CardDescription>Verify if your legal matter qualifies for PAO assistance.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <div>
                    <p className="font-semibold">Indigency Test</p>
                    <p className="text-muted-foreground">Income verification based on latest ITR or Certificate of Indigency.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <div>
                    <p className="font-semibold">Case Type Evaluation</p>
                    <p className="text-muted-foreground">Criminal defense, civil litigation, or administrative matters.</p>
                  </div>
                </li>
              </ul>
              <Button className="w-full bg-secondary hover:bg-secondary/90 group">
                Start Eligibility Check
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-primary/10 hover:border-primary/30 transition-all shadow-sm">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-3">
                <Calendar className="h-6 w-6 text-primary" />
                Appointment Booking
              </CardTitle>
              <CardDescription>Schedule a preliminary meeting with our legal experts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <p className="text-sm text-muted-foreground">
                Connect with an available attorney for initial document review and legal advice. Appointments are held at your local district office.
              </p>
              <div className="pt-4">
                <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5 group">
                  View Available Slots
                  <Calendar className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted/30 border-dashed border-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-muted-foreground" />
              Important Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-4">
            <p className="text-muted-foreground">
              The ePAO system is designed to streamline legal service access for underprivileged Filipinos. 
              If you are unsure about the requirements, you can visit any PAO district office nearest to you. 
              Our system helps you pre-qualify and save time before your physical visit.
            </p>
            <div className="grid sm:grid-cols-2 gap-4 text-xs font-medium">
              <div className="p-3 bg-white rounded border">
                Office Hours: Mon-Fri, 8AM - 5PM
              </div>
              <div className="p-3 bg-white rounded border">
                No legal fees for qualified indigents
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
