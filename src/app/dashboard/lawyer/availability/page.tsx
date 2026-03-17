
"use client";

import { useState, useMemo } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format, startOfToday, isWeekend, isBefore } from "date-fns";
import { Clock, CalendarDays, Loader2, Save, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const HOLIDAYS = [
  "2024-01-01", "2024-04-09", "2024-05-01", "2024-06-12", "2024-08-26",
  "2024-11-01", "2024-11-30", "2024-12-25", "2024-12-30", 
  "2025-01-01", "2025-02-25", "2025-04-17", "2025-04-18", "2025-05-01"
];

const isHoliday = (date: Date) => {
  const ds = format(date, "yyyy-MM-dd");
  return HOLIDAYS.includes(ds);
};

const AVAILABILITY_TYPES = [
  { value: "Available", label: "Office Standard (08:00 - 17:00)", color: "text-green-600 bg-green-50 border-green-100" },
  { value: "FullDayLeave", label: "Official Leave (Full Day)", color: "text-red-600 bg-red-50 border-red-100" },
  { value: "PartialLeave", label: "Unavailable During Specific Hours", color: "text-amber-600 bg-amber-50 border-amber-100" },
  { value: "PartialDayAvailable", label: "Available Only During Specific Hours", color: "text-blue-600 bg-blue-50 border-blue-100" },
];

const REASON_CATEGORIES = [
  { 
    label: "Work Related Duties", 
    reasons: [
      "Court Hearing / Litigation",
      "Jail / Prison Visit",
      "Field Investigation",
      "Official Meeting / Seminar",
      "Barangay Conciliation / Mediation",
      "Office Administrative Work"
    ]
  },
  { 
    label: "Personal Leave", 
    reasons: [
      "Sick Leave / Medical Appointment",
      "Vacation / Privilege Leave",
      "Family Emergency",
      "Personal Matters"
    ]
  }
];

export default function LawyerAvailabilityPage() {
  const { user, role, loading } = useAuth();
  const db = useFirestore();
  const { toast } = useToast();

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isSaving, setIsSaving] = useState(false);

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : null;
  const availRef = useMemoFirebase(() => {
    if (!db || !user || !dateStr) return null;
    return doc(db, "roleLawyer", user.uid, "availability", dateStr);
  }, [db, user, dateStr]);

  const { data: availData, isLoading: isDataLoading } = useDoc(availRef);

  const [formData, setFormData] = useState({
    availabilityType: "Available",
    startTime: "08:00",
    endTime: "17:00",
    leaveReason: "Court Hearing / Litigation",
    notes: ""
  });

  // Sync form when data loads
  useMemo(() => {
    if (availData) {
      setFormData({
        availabilityType: availData.availabilityType || "Available",
        startTime: availData.startTime || "08:00",
        endTime: availData.endTime || "17:00",
        leaveReason: availData.leaveReason || "Court Hearing / Litigation",
        notes: availData.notes || ""
      });
    } else {
      setFormData({
        availabilityType: "Available",
        startTime: "08:00",
        endTime: "17:00",
        leaveReason: "Court Hearing / Litigation",
        notes: ""
      });
    }
  }, [availData]);

  const handleSave = async () => {
    if (!db || !user || !dateStr) return;
    setIsSaving(true);

    try {
      const data = {
        date: dateStr,
        ...formData,
        updatedAt: new Date().toISOString()
      };

      setDocumentNonBlocking(availRef!, data, { merge: true });
      
      // --- NOTIFICATION ---
      const notifId = crypto.randomUUID();
      setDocumentNonBlocking(doc(db, "notifications", notifId), {
        id: notifId,
        type: "lawyer",
        userRole: "lawyer",
        description: `Atty. ${user.email?.split('@')[0]} modified schedule for ${format(selectedDate!, "MMM dd")} to ${formData.availabilityType} (${formData.leaveReason}).`,
        referenceId: user.uid,
        status: "unread",
        createdAt: new Date().toISOString()
      }, { merge: true });

      toast({
        title: "Availability Synchronized",
        description: `Office registry updated for ${format(selectedDate!, "MMM dd")}.`
      });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Sync Failed", description: e.message });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="h-8 w-8 animate-spin text-secondary" /></div>;
  if (!user || role !== 'lawyer') return null;

  const isLeave = formData.availabilityType !== 'Available';

  return (
    <DashboardLayout role="lawyer">
      <div className="space-y-8 max-w-6xl mx-auto pb-12">
        <div>
          <h1 className="text-3xl font-black text-secondary font-headline tracking-tight">Availability Management</h1>
          <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-widest mt-1">Official Office Schedule Registry</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="border-none shadow-xl rounded-[2.5rem] bg-white overflow-hidden lg:col-span-1">
            <CardHeader className="bg-secondary/5 border-b border-secondary/10">
              <CardTitle className="text-sm font-black uppercase text-secondary flex items-center gap-2">
                <CalendarDays className="h-4 w-4" /> Select Date
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  if (date && (isWeekend(date) || isHoliday(date) || isBefore(date, startOfToday()))) return;
                  setSelectedDate(date);
                }}
                disabled={[
                  { before: startOfToday() },
                  { dayOfWeek: [0, 6] },
                  (date) => isHoliday(date)
                ]}
                className="mx-auto border rounded-2xl p-4"
              />
              <div className="mt-6 p-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
                  Availability updates are only permitted for official working days (Monday-Friday).
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl rounded-[3rem] bg-white overflow-hidden lg:col-span-2">
            <CardHeader className="bg-secondary/5 p-8 border-b border-secondary/10">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <CardTitle className="text-xl font-bold text-secondary">
                    {selectedDate ? format(selectedDate, "PPPP") : "Workstation Settings"}
                  </CardTitle>
                  <CardDescription className="text-[10px] font-black uppercase tracking-widest">
                    Manage Duty Status
                  </CardDescription>
                </div>
                {availData ? (
                  <Badge className="bg-secondary text-white border-none font-black px-4 py-1.5 rounded-xl uppercase text-[9px]">Live Sync Active</Badge>
                ) : (
                  <Badge variant="outline" className="border-dashed font-black px-4 py-1.5 rounded-xl uppercase text-[9px]">Standard Hours</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-8 md:p-10 space-y-10">
              {isDataLoading ? (
                <div className="py-20 flex justify-center"><Loader2 className="animate-spin h-10 w-10 text-secondary/20" /></div>
              ) : (
                <>
                  <div className="space-y-4">
                    <Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Availability Classification</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {AVAILABILITY_TYPES.map((type) => (
                        <button
                          key={type.value}
                          onClick={() => setFormData({ ...formData, availabilityType: type.value })}
                          className={cn(
                            "flex flex-col items-start p-5 rounded-[1.5rem] border-2 transition-all text-left group",
                            formData.availabilityType === type.value 
                              ? cn("border-secondary shadow-lg scale-[1.02]", type.color)
                              : "border-transparent bg-muted/30 hover:bg-muted/50"
                          )}
                        >
                          <span className="text-xs font-black uppercase tracking-tight">{type.value === 'Available' ? 'Standard' : type.value.replace(/([A-Z])/g, ' $1').trim()}</span>
                          <span className="text-[9px] font-medium opacity-60 mt-1">{type.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {isLeave && (
                    <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                      <Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Specific Classification of Reason</Label>
                      <Select value={formData.leaveReason} onValueChange={(v) => setFormData({...formData, leaveReason: v})}>
                        <SelectTrigger className="h-auto min-h-[3.5rem] py-3 rounded-xl border-secondary/10 bg-white font-bold text-sm shadow-sm overflow-hidden whitespace-normal text-left">
                          <SelectValue placeholder="Choose Reason" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-secondary/10 max-h-[300px]">
                          {REASON_CATEGORIES.map((cat) => (
                            <div key={cat.label}>
                              <div className="px-3 py-2 text-[9px] font-black uppercase text-secondary/40 tracking-widest bg-secondary/5 border-y">{cat.label}</div>
                              {cat.reasons.map((reason) => (
                                <SelectItem key={reason} value={reason} className="font-bold text-xs py-3 px-4">
                                  {reason}
                                </SelectItem>
                              ))}
                            </div>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {(formData.availabilityType === 'PartialLeave' || formData.availabilityType === 'PartialDayAvailable') && (
                    <div className="grid grid-cols-2 gap-6 animate-in slide-in-from-top-4 duration-500">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">
                          {formData.availabilityType === 'PartialLeave' ? 'Start of Unavailability' : 'Available From'}
                        </Label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/30" />
                          <Input 
                            type="time" 
                            className="h-12 pl-12 rounded-xl border-secondary/10 bg-white font-bold"
                            value={formData.startTime}
                            onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">
                          {formData.availabilityType === 'PartialLeave' ? 'End of Unavailability' : 'Until'}
                        </Label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary/30" />
                          <Input 
                            type="time" 
                            className="h-12 pl-12 rounded-xl border-secondary/10 bg-white font-bold"
                            value={formData.endTime}
                            onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-secondary/40 ml-1">Registry Audit Notes</Label>
                    <Textarea 
                      placeholder="Specify additional details or constraints for office records..." 
                      className="rounded-[1.5rem] min-h-[100px] border-secondary/10 focus-visible:ring-secondary/20"
                      value={formData.notes}
                      onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    />
                  </div>

                  <div className="pt-6 border-t border-secondary/5">
                    <Button 
                      onClick={handleSave} 
                      disabled={isSaving}
                      className="w-full h-16 bg-secondary hover:bg-secondary/90 text-white font-black text-lg rounded-2xl shadow-xl hover:scale-[1.02] transition-transform"
                    >
                      {isSaving ? <Loader2 className="animate-spin mr-2 h-6 w-6" /> : <Save className="mr-2 h-6 w-6" />}
                      Publish Schedule Update
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
