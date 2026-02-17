
"use client";

import { useAuth } from "@/components/auth-provider";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, where, doc, getDoc } from "firebase/firestore";
import { Briefcase, Calendar, FileText, User, ChevronRight, Gavel, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ClientDashboard() {
  const { user, role } = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const [assignedLawyer, setAssignedLawyer] = useState<any>(null);

  // Fetch Client's official case
  const casesQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'client') return null;
    return query(collection(db, "cases"), where("clientId", "==", user.uid));
  }, [db, user, role]);

  const { data: cases, isLoading: isCasesLoading } = useCollection(casesQuery);

  // Fetch upcoming appointments
  const apptsQuery = useMemoFirebase(() => {
    if (!db || !user || role !== 'client') return null;
    return query(collection(db, "appointments"), where("clientId", "==", user.uid));
  }, [db, user, role]);

  const { data: appts, isLoading: isApptsLoading } = useCollection(apptsQuery);

  const activeCase = cases?.[0];

  useEffect(() => {
    async function fetchLawyer() {
      if (activeCase?.lawyerId && db && role === 'client') {
        const lawyerRef = doc(db, "roleLawyer", activeCase.lawyerId);
        const snap = await getDoc(lawyerRef);
        if (snap.exists()) setAssignedLawyer(snap.data());
      }
    }
    fetchLawyer();
  }, [activeCase, db, role]);

  return (
    <DashboardLayout role="client">
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-primary font-headline tracking-tight">Citizen Portal</h1>
            <p className="text-muted-foreground font-medium">Welcome back. Track your legal case and manage your appointments.</p>
          </div>
          <Badge className="bg-primary/10 text-primary border-none px-4 py-2 rounded-full font-bold">
            Registered Client
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Official Case Card */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary/5 pb-6 border-b border-primary/10">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary text-white rounded-xl">
                      <Gavel className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-bold text-primary">My Active Legal Matter</CardTitle>
                  </div>
                  {activeCase && (
                    <Badge className="bg-green-100 text-green-800 border-none font-bold px-3">
                      {activeCase.status}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                {isCasesLoading ? (
                  <div className="py-12 flex justify-center"><Clock className="animate-spin h-8 w-8 text-primary/20" /></div>
                ) : activeCase ? (
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Official Case ID</p>
                        <p className="text-lg font-black text-[#1A3B6B]">{activeCase.id}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Legal Classification</p>
                        <p className="text-lg font-black text-[#1A3B6B]">{activeCase.caseType}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Filing Date</p>
                        <p className="text-lg font-black text-[#1A3B6B]">
                          {activeCase.createdAt ? format(new Date(activeCase.createdAt), "PPP") : '---'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-primary/40 uppercase tracking-widest">Case Description</p>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">{activeCase.description}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <FileText className="h-12 w-12 text-primary/10 mx-auto" />
                    <p className="text-muted-foreground font-medium">No official case records found yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card className="border-none shadow-xl bg-white rounded-[2.5rem]">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-bold text-primary flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  My Scheduled Visits
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {appts?.filter(a => a.status !== 'cancelled').map((appt) => (
                  <div key={appt.id} className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10 hover:bg-primary/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-white flex flex-col items-center justify-center shadow-sm border">
                        <span className="text-[10px] font-black text-primary leading-none uppercase">{format(new Date(appt.date), "MMM")}</span>
                        <span className="text-lg font-black text-[#1A3B6B] leading-none">{format(new Date(appt.date), "dd")}</span>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#1A3B6B]">{appt.caseType}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Reference: {appt.referenceCode} • {appt.time}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-primary/30" />
                  </div>
                ))}
                {(!appts || appts.length === 0) && (
                  <p className="text-center py-8 text-sm text-muted-foreground font-medium italic">No upcoming follow-ups scheduled.</p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Assigned Lawyer Card */}
            <Card className="border-none shadow-xl bg-[#F0F4F8] rounded-[2.5rem] overflow-hidden">
              <CardHeader className="bg-primary p-6 text-white">
                <CardTitle className="text-sm font-black uppercase tracking-widest">Assigned Public Attorney</CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {assignedLawyer ? (
                  <>
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                        <User className="h-10 w-10 text-primary/20" />
                      </div>
                      <div>
                        <p className="text-lg font-black text-[#1A3B6B]">{assignedLawyer.email.split('@')[0]}</p>
                        <Badge className="bg-primary/10 text-primary border-none font-bold uppercase text-[9px]">Public Attorney II</Badge>
                      </div>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-primary/10">
                      <div className="flex items-center gap-3 text-xs font-bold text-[#2E5A99]">
                        <Briefcase className="h-4 w-4" /> District Office North
                      </div>
                      <div className="flex items-center gap-3 text-xs font-bold text-[#2E5A99]">
                        <FileText className="h-4 w-4" /> Managing your {activeCase?.caseType || "Legal Matter"}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-xs text-muted-foreground font-medium italic leading-relaxed">Your assigned lawyer will appear here once your case is triaged.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-none shadow-xl bg-amber-50 rounded-[2.5rem] p-8 space-y-4">
              <h4 className="text-sm font-black text-amber-900 flex items-center gap-2">
                <Clock className="h-4 w-4" /> Booking Follow-ups
              </h4>
              <p className="text-xs text-amber-800/70 font-medium leading-relaxed">
                Registered clients can book follow-up consultations with their assigned lawyer to ensure continuous legal support.
              </p>
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 rounded-xl font-bold shadow-md" 
                onClick={() => router.push('/dashboard/client/book-appointment')}
              >
                Schedule Follow-up
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
