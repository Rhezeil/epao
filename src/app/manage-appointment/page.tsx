
"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, query, where, doc } from "firebase/firestore";
import { Search, Calendar, XCircle, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function ManageAppointmentPage() {
  const [refCode, setRefCode] = useState("");
  const [searchTriggered, setSearchTriggered] = useState(false);
  const db = useFirestore();
  const { toast } = useToast();

  const appointmentQuery = useMemoFirebase(() => {
    if (!db || !refCode || !searchTriggered) return null;
    return query(collection(db, "appointments"), where("referenceCode", "==", refCode.trim().toUpperCase()));
  }, [db, refCode, searchTriggered]);

  const { data: results, isLoading } = useCollection(appointmentQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (refCode.trim()) setSearchTriggered(true);
  };

  const handleCancel = (appointmentId: string) => {
    if (!db) return;
    const apptRef = doc(db, "appointments", appointmentId);
    updateDocumentNonBlocking(apptRef, { status: "cancelled" });
    toast({ title: "Appointment Cancelled", description: "Your visit has been removed from our schedule." });
  };

  const appointment = results?.[0];

  return (
    <DashboardLayout role={null}>
      <div className="max-w-2xl mx-auto py-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Manage Your Booking</h1>
          <p className="text-muted-foreground font-medium">Enter your unique reference code to view or change your appointment.</p>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-[2.5rem]">
          <CardContent className="p-8">
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input 
                placeholder="PAO-XXXXXX" 
                value={refCode}
                onChange={(e) => {
                  setRefCode(e.target.value);
                  setSearchTriggered(false);
                }}
                className="h-14 rounded-2xl border-primary/20 text-lg font-black tracking-widest placeholder:tracking-normal placeholder:font-medium text-center"
              />
              <Button type="submit" size="lg" className="h-14 rounded-2xl bg-primary px-8">
                {isLoading ? <Loader2 className="animate-spin" /> : <Search className="h-5 w-5" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        {searchTriggered && !isLoading && !appointment && (
          <div className="text-center p-12 bg-white/40 rounded-[2.5rem] border-2 border-dashed border-primary/10 animate-in fade-in zoom-in-95">
            <AlertCircle className="h-12 w-12 text-primary/20 mx-auto mb-4" />
            <h3 className="text-xl font-black text-primary">No Record Found</h3>
            <p className="text-muted-foreground">Double check your reference code and try again.</p>
          </div>
        )}

        {appointment && (
          <Card className="border-none shadow-2xl bg-white rounded-[2.5rem] overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
            <div className="bg-primary p-8 text-white flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Reference Code</p>
                <h3 className="text-3xl font-black tracking-tighter">{appointment.referenceCode}</h3>
              </div>
              <Badge className={cn(
                "px-4 py-2 rounded-full font-black uppercase text-[10px]",
                appointment.status === 'pending' ? 'bg-amber-400 text-amber-900' : 
                appointment.status === 'scheduled' ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
              )}>
                {appointment.status}
              </Badge>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                    <Calendar className="h-3 w-3" /> Date & Time
                  </div>
                  <p className="text-lg font-bold text-[#1A3B6B]">
                    {format(new Date(appointment.date), "PPP")} at {appointment.time}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-widest">
                    <CheckCircle2 className="h-3 w-3" /> Legal Matter
                  </div>
                  <p className="text-lg font-bold text-[#1A3B6B]">{appointment.caseType}</p>
                </div>
              </div>

              <div className="p-6 bg-[#F0F4F8] rounded-3xl space-y-3">
                <h4 className="text-xs font-black text-primary/60 uppercase tracking-widest">Important Reminder</h4>
                <p className="text-sm text-[#1A3B6B] font-medium leading-relaxed">
                  Please arrive 15 minutes before your scheduled time. Bring all required documents found in the Legal Navigator.
                </p>
              </div>

              {appointment.status !== 'cancelled' && (
                <Button 
                  variant="outline" 
                  className="w-full h-14 border-red-200 text-red-600 hover:bg-red-50 rounded-2xl font-bold"
                  onClick={() => handleCancel(appointment.id)}
                >
                  <XCircle className="mr-2 h-5 w-5" /> Cancel Appointment
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
