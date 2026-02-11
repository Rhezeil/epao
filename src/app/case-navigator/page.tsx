
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, HelpCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CaseNavigatorPage() {
  const { role, user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const criminalCategories = [
    {
      title: "Persons",
      cases: ["Murder", "Homicide", "Physical Injury", "Assault", "Rape", "Sexual Harassment", "VAWC", "Kidnapping", "Abduction"]
    },
    {
      title: "Property",
      cases: ["Theft", "Robbery", "Arson", "Estafa / Fraud", "Embezzlement", "Malversation"]
    },
    {
      title: "Public Order",
      cases: ["Rebellion", "Sedition", "Resistance", "Illegal Possession of Firearms"]
    },
    {
      title: "Drugs",
      cases: ["Possession", "Trafficking", "Use / Distribution"]
    },
    {
      title: "Special Cases",
      cases: ["Cybercrime", "Human Trafficking", "White-Collar", "Juvenile Delinquency"]
    }
  ];

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-4 py-2 px-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-1">
            <Compass className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-xl font-bold font-headline text-primary tracking-tight">
            ePAO Case Requirements, Appointment, and Service Management
          </h1>
          <p className="text-sm text-muted-foreground leading-tight max-w-2xl mx-auto">
            Check PAO jurisdiction and book a consultation. 
            {!user && (
              <span className="ml-1 font-medium text-secondary">
                Log in for existing cases.
              </span>
            )}
          </p>
          {!user && (
            <div className="flex justify-center gap-2 pt-2">
              <Button onClick={() => router.push("/login")} size="sm" className="bg-primary px-4 h-8">
                Login
              </Button>
              <Button onClick={() => router.push("/register")} size="sm" variant="outline" className="px-4 h-8 border-primary text-primary">
                Register
              </Button>
            </div>
          )}
        </div>

        {/* Search Bar Section */}
        <div className="flex gap-2 max-w-2xl mx-auto bg-white p-1 rounded-lg border shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search case (e.g., 'Theft')..." 
              className="pl-9 h-9 border-none shadow-none focus-visible:ring-0 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button size="sm" className="bg-[#E67E22] hover:bg-[#D35400] text-white h-9">
            Search
          </Button>
        </div>

        {/* Case Directory Section */}
        <Card className="border-none bg-[#F0F7FF] shadow-none">
          <CardContent className="p-4">
            <h2 className="text-lg font-bold text-primary font-headline mb-4 border-b border-primary/10 pb-2">Criminal Cases</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {criminalCategories.map((category, idx) => (
                <div key={idx} className="space-y-1">
                  <h3 className="font-bold text-primary text-sm">{category.title}</h3>
                  <ul className="space-y-0.5">
                    {category.cases.map((caseName, cIdx) => (
                      <li key={cIdx}>
                        <button className="text-[11px] text-primary/80 hover:text-primary hover:underline text-left transition-colors truncate w-full">
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

        <Card className="bg-muted/30 border-dashed border">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="text-xs text-muted-foreground leading-normal">
                  The ePAO system streamlines legal service access for underprivileged Filipinos. 
                  Pre-qualify here or visit your nearest PAO district office.
                </p>
                <div className="flex gap-3 text-[10px] font-medium">
                  <span className="px-2 py-1 bg-white rounded border">Mon-Fri, 8AM - 5PM</span>
                  <span className="px-2 py-1 bg-white rounded border">No fees for qualified indigents</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
