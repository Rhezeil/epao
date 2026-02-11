
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, CheckCircle, Calendar, ShieldCheck, HelpCircle, ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CaseNavigatorPage() {
  const { role, user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const criminalCategories = [
    {
      title: "Crimes against Persons",
      cases: ["Murder", "Homicide", "Physical Injury", "Assault", "Rape", "Sexual Harassment", "Violence Against Women and Children (VAWC)", "Kidnapping", "Abduction"]
    },
    {
      title: "Crimes against Property",
      cases: ["Theft", "Robbery", "Arson", "Estafa / Fraud", "Embezzlement", "Malversation"]
    },
    {
      title: "Crimes against Public Order",
      cases: ["Rebellion", "Sedition", "Resistance to Public Officials", "Illegal Possession of Firearms"]
    },
    {
      title: "Drug-related Offenses",
      cases: ["Drug Possession", "Drug Trafficking", "Drug Use / Distribution"]
    },
    {
      title: "Special Criminal Cases",
      cases: ["Cybercrime", "Human Trafficking", "White-Collar Crimes", "Juvenile Delinquency"]
    }
  ];

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-8 py-4 px-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-full mb-2">
            <Compass className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold font-headline text-primary tracking-tight md:text-4xl">
            ePAO Case Requirements, Appointment, and Service Management System
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
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

        {/* Search Bar Section */}
        <div className="flex gap-2 max-w-4xl mx-auto bg-white p-2 rounded-xl border shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="e.g., 'Theft', 'Annulment', 'Child Support'..." 
              className="pl-10 border-none shadow-none focus-visible:ring-0 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="bg-[#E67E22] hover:bg-[#D35400] text-white px-8">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
        </div>

        {/* Case Directory Section */}
        <Card className="border-none bg-[#F0F7FF] shadow-none">
          <CardContent className="pt-8 px-8">
            <h2 className="text-2xl font-bold text-primary font-headline mb-8 border-b-2 border-primary/10 pb-4">Criminal Cases</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
              {criminalCategories.map((category, idx) => (
                <div key={idx} className="space-y-4">
                  <h3 className="font-bold text-primary text-lg">{category.title}</h3>
                  <ul className="space-y-2">
                    {category.cases.map((caseName, cIdx) => (
                      <li key={cIdx}>
                        <button className="text-sm text-primary/80 hover:text-primary hover:underline text-left transition-colors">
                          {caseName}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Cards */}
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
