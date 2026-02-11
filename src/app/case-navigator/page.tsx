
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, HelpCircle, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CaseNavigatorPage() {
  const { role, user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    "Criminal",
    "Civil",
    "Labor",
    "Administrative",
    "Constitutional",
    "Commercial",
    "Special/Other",
    "Notarization"
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
            Determine if your case is under PAO jurisdiction and book a consultation. 
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

        {/* Search and Category Exploration Section */}
        <Card className="border-none bg-[#EBF2FA] shadow-none rounded-xl overflow-hidden">
          <CardContent className="p-6 space-y-6">
            {/* Search Bar */}
            <div className="flex gap-2 max-w-4xl mx-auto bg-white p-1 rounded-lg border shadow-sm">
              <div className="flex-1">
                <Input 
                  placeholder='e.g., "Theft", "Annulment", "Child Support"...' 
                  className="h-10 border-none shadow-none focus-visible:ring-0 text-sm italic text-muted-foreground"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button size="sm" className="bg-[#E67E22] hover:bg-[#D35400] text-white h-10 px-6 font-semibold flex items-center gap-2">
                <Search className="h-4 w-4" />
                Search
              </Button>
            </div>

            {/* Category Selection */}
            <div className="space-y-4 max-w-4xl mx-auto">
              <p className="text-sm text-primary font-medium opacity-80">
                Or select a category to explore case types:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant="outline"
                    className="h-12 bg-[#DCE6F5] border-none text-primary font-bold text-sm hover:bg-[#CAD6E8] hover:text-primary transition-all shadow-sm justify-start px-4"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Guidelines / Help Section */}
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
