"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Info, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function BookAppointmentPage() {
  const { role } = useAuth();
  const [date, setDate] = useState<Date>();

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-primary font-headline">Book Appointment</h1>
          <p className="text-sm text-muted-foreground">
            You are booking a new client consultation for: <span className="font-bold text-primary">General Consultation</span>.
          </p>
          <p className="text-sm text-muted-foreground">Please select a date, and time slot below.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Scheduler */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-none shadow-sm bg-[#EBF2FA]">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-bold text-primary">Appointment Scheduler</CardTitle>
                <p className="text-xs text-muted-foreground">
                  This system is for first-time users. If you have an ongoing case, please log in to your dashboard to book with your assigned lawyer.
                </p>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-primary uppercase">Purpose of Visit</Label>
                  <Select defaultValue="consultation">
                    <SelectTrigger className="w-full bg-white border-primary/20 h-11">
                      <SelectValue placeholder="Select purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">Consultation</SelectItem>
                      <SelectItem value="notarization">Notarization</SelectItem>
                      <SelectItem value="document-review">Document Review</SelectItem>
                      <SelectItem value="legal-advice">Legal Advice</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-bold text-primary uppercase">Select a Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal bg-white border-primary/20 h-11 px-3",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                        disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Guidelines */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm bg-[#EBF2FA]">
              <CardHeader className="pb-2 flex-row items-start gap-2 space-y-0">
                <Info className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <CardTitle className="text-lg font-bold text-primary">How to Get PAO Services</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-primary">1. Check Eligibility</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      You must be an indigent person. PAO assesses your financial situation and the merit of your case.
                    </p>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-primary">2. Gather Documents</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Bring your government ID, proof of income (ITR, payslip, Barangay Certificate of Indigency), and any documents related to your case (police reports, contracts).
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-primary uppercase tracking-wider">Key Things to Remember</h4>
                  
                  <div className="bg-white/60 p-3 rounded-lg flex gap-3 border border-primary/5">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-primary">Indigency</p>
                      <p className="text-[10px] text-muted-foreground">Proof is crucial for full legal representation and some document services.</p>
                    </div>
                  </div>

                  <div className="bg-white/60 p-3 rounded-lg flex gap-3 border border-primary/5">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-primary">Case Merit</p>
                      <p className="text-[10px] text-muted-foreground">PAO checks if your case has a valid legal basis.</p>
                    </div>
                  </div>

                  <div className="bg-white/60 p-3 rounded-lg flex gap-3 border border-primary/5">
                    <CheckCircle2 className="h-5 w-5 text-secondary shrink-0" />
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-primary">Notarization</p>
                      <p className="text-[10px] text-muted-foreground">A specific service often available for qualified individuals, sometimes at special events.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
