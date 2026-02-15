
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Compass, Search, ArrowLeft, X, CheckCircle2, FileText, Info, ListChecks, CalendarCheck, Loader2, ShieldCheck, Scale } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection, query, where, limit } from "firebase/firestore";
import { caseCategories, defaultRequirements, defaultSteps, categoryDefaults, caseSpecificData, generalRequirements, universalPaoFlow } from "@/app/lib/case-data";
import { Badge } from "@/components/ui/badge";

function CaseNavigatorContent() {
  const { role } = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [mode, setMode] = useState<"explore" | "manage">("explore");
  const [refCode, setRefCode] = useState("");

  // Memoize requirements query
  const reqDocRef = useMemoFirebase(() => {
    if (!db || !selectedCase) return null;
    return doc(db, "caseRequirements", selectedCase.toLowerCase().replace(/\s+/g, '-'));
  }, [db, selectedCase]);

  const { data: dynamicReqs, isLoading: isReqLoading } = useDoc(reqDocRef);

  // Manage Appointment Logic
  const appointmentsQuery = useMemoFirebase(() => {
    if (!db || !refCode) return null;
    return query(collection(db, "appointments"), where("referenceCode", "==", refCode), limit(1));
  }, [db, refCode]);

  const { data: appointmentFound, isLoading: isSearching } = useCollection(appointmentsQuery);

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "manage") {
      setMode("manage");
    } else {
      setMode("explore");
    }
  }, [searchParams]);

  const categories = Object.keys(caseCategories);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setSelectedCase(null);
  };

  const handleCaseClick = (caseItem: string, category?: string) => {
    setSelectedCase(caseItem);
    setSearchQuery(caseItem);
    if (category) setSelectedCategory(category);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      // Find case in categories if it exists exactly, else just search the text
      setSelectedCase(searchQuery);
    }
  };

  const handleClear = () => {
    setSelectedCase(null);
    setSearchQuery("");
  };

  const getEffectiveData = () => {
    // Priority: Firestore > Case Specific > Category Defaults > Global Defaults
    if (dynamicReqs) {
      return { 
        requirements: dynamicReqs.requirements || [], 
        steps: dynamicReqs.steps || defaultSteps 
      };
    }
    if (selectedCase && caseSpecificData[selectedCase]) {
      return caseSpecificData[selectedCase];
    }
    if (selectedCategory && categoryDefaults[selectedCategory]) {
      return categoryDefaults[selectedCategory];
    }
    return { requirements: defaultRequirements, steps: defaultSteps };
  };

  const renderCaseDetails = (caseName: string) => {
    const guidance = getEffectiveData();
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={() => setSelectedCase(null)} className="text-primary gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to Categories
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} className="flex items-center gap-1 text-muted-foreground">
            <X className="h-4 w-4" /> Clear Search
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-none shadow-none bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-bold text-primary">Case Information</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">Detailed guidance for {caseName}.</p>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-1">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Case Type</p>
                <h2 className="text-2xl font-black text-[#1A3B6B]">{caseName}</h2>
                {selectedCategory && <Badge variant="secondary" className="mt-1">{selectedCategory} Matter</Badge>}
              </div>
              
              <div className="bg-[#E8F5E9] p-4 rounded-xl border border-green-200">
                <div className="flex gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-green-800 leading-tight">PAO Assistance Qualified</p>
                    <p className="text-xs text-green-700 leading-snug">
                      This case falls under the standard PAO jurisdiction. Assistance is subject to Indigency and Merit tests.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <div className="flex gap-3">
                  <Scale className="h-5 w-5 text-blue-600 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-blue-800">Legal Authority</p>
                    <p className="text-[10px] text-blue-700 italic">Based on the Revised Penal Code, Family Code, and RA 9406.</p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-12 bg-primary hover:bg-[#1A3B6B] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
                onClick={() => router.push(`/dashboard/client/book-appointment?caseType=${encodeURIComponent(caseName)}&category=${encodeURIComponent(selectedCategory || 'General')}`)}
              >
                <CalendarCheck className="h-5 w-5" />
                Book Consultation
              </Button>
            </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <ListChecks className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-bold text-primary">Required Documents</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">Mandatory checklist for {caseName}.</p>
            </CardHeader>
            <CardContent className="space-y-3 pt-4">
              <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
                <div className="flex gap-2">
                  <Info className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-[10px] text-amber-800 font-bold uppercase tracking-wider">General Requirements (Mandatory for All)</p>
                    <ul className="text-[10px] text-amber-800 list-disc pl-3">
                      {generalRequirements.map((r, i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                </div>
              </div>

              {isReqLoading ? (
                <div className="flex justify-center py-4"><Loader2 className="animate-spin h-5 w-5 text-primary" /></div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-primary uppercase mb-2">Case-Specific Documentation</p>
                  {guidance.requirements.map((doc: string, idx: number) => (
                    <div key={idx} className="flex gap-3 items-start border-l-2 border-primary/10 pl-3 py-1">
                      <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm text-[#2E5A99] font-medium leading-tight">{doc}</span>
                    </div>
                  ))}
                  {guidance.requirements.length === 0 && <p className="text-xs text-muted-foreground italic">Refer to general requirements for this case type.</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-none shadow-none bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="p-1.5 bg-primary/10 rounded-lg">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg font-bold text-primary">Universal PAO Flow</CardTitle>
              </div>
              <p className="text-xs text-muted-foreground">The 9-step legal process for your case.</p>
            </CardHeader>
            <CardContent className="pt-4">
              <Accordion type="single" collapsible className="w-full space-y-2">
                {guidance.steps.map((step: any, idx: number) => (
                  <AccordionItem key={idx} value={`step-${idx}`} className="border rounded-xl bg-white px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left">
                        <div className="h-6 w-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {step.step || idx + 1}
                        </div>
                        <span className="text-sm font-bold text-primary">{step.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-xs text-muted-foreground pb-4 leading-relaxed whitespace-pre-line">
                      {step.content}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderCategoryListView = (title: string, data: any[]) => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="p-0 h-8 w-8 text-primary">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold text-primary font-headline tracking-tight">{title}</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.map((cat, idx) => (
          <div key={idx} className="space-y-3 p-6 bg-white rounded-2xl border border-primary/5 shadow-sm">
            <h3 className="text-xs font-black text-primary uppercase tracking-widest border-b pb-2 mb-4">{cat.title}</h3>
            <div className="grid grid-cols-1 gap-2">
              {cat.items.map((item: string) => (
                <div 
                  key={item} 
                  onClick={() => handleCaseClick(item, title)} 
                  className="text-sm text-[#2E5A99] cursor-pointer hover:bg-primary/5 p-3 rounded-xl flex items-center gap-3 transition-all border border-transparent hover:border-primary/10"
                >
                  <div className="h-2 w-2 rounded-full bg-primary/40 shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderManageAppointment = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2 text-center">
        <h2 className="text-3xl font-bold text-primary font-headline">Manage Appointment</h2>
        <p className="text-sm text-muted-foreground">
          Enter your PAO-XXXXXX reference code to view or update your schedule.
        </p>
      </div>

      <Card className="border-none bg-white shadow-lg rounded-2xl overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="flex gap-2 bg-[#F0F4F8] p-2 rounded-xl border">
            <div className="flex-1">
              <Input 
                placeholder="Reference Code (e.g., PAO-123456)" 
                className="h-12 border-none shadow-none focus-visible:ring-0 text-sm font-bold tracking-widest bg-transparent"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value.toUpperCase())}
              />
            </div>
            <Button size="lg" disabled={isSearching} className="bg-[#2E5A99] hover:bg-[#1A3B6B] text-white h-12 px-8 font-semibold rounded-lg">
              {isSearching ? <Loader2 className="animate-spin h-5 w-5" /> : "Track Case"}
            </Button>
          </div>

          {appointmentFound && appointmentFound.length > 0 && (
            <div className="mt-8 p-6 bg-[#E8F5E9] rounded-2xl border border-green-200 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-green-900">Record Found</h4>
                  <p className="text-sm text-green-800">Reference: {appointmentFound[0].referenceCode}</p>
                </div>
                <Badge className="bg-green-600 px-4 py-1">{appointmentFound[0].status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm bg-white/50 p-4 rounded-xl border border-white/80">
                <div>
                  <p className="text-xs text-green-700 font-bold uppercase tracking-tighter">Case Category</p>
                  <p className="text-green-900 font-bold">{appointmentFound[0].caseCategory}</p>
                </div>
                <div>
                  <p className="text-xs text-green-700 font-bold uppercase tracking-tighter">Service Date</p>
                  <p className="text-green-900 font-bold">
                    {new Date(appointmentFound[0].date).toLocaleDateString()}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-green-700 font-bold uppercase tracking-tighter">Case Type</p>
                  <p className="text-green-900 font-bold">{appointmentFound[0].caseType}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <DashboardLayout role={role}>
      <div className="max-w-6xl mx-auto space-y-8 py-4 px-4">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-2">
            <Compass className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-black font-headline text-primary tracking-tighter">
            Legal Case Navigator
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Accurate legal requirements and process flows based on the Public Attorney's Office (PAO) standards.
          </p>
        </div>

        <div className="flex gap-2 max-w-4xl mx-auto bg-white p-2 rounded-2xl border shadow-xl">
          <div className="flex-1">
            <Input 
              placeholder='Search for a case (e.g., "Murder", "Labor", "Annulment")...' 
              className="h-12 border-none shadow-none focus-visible:ring-0 text-sm italic font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button size="lg" onClick={handleSearch} className="bg-primary hover:bg-[#1A3B6B] text-white h-12 px-8 font-bold rounded-xl flex items-center gap-2">
            <Search className="h-4 w-4" />
            Navigator
          </Button>
        </div>

        <Card className="border-none bg-white/40 backdrop-blur-md shadow-sm rounded-3xl overflow-hidden min-h-[500px]">
          <CardContent className="p-10">
            {selectedCase ? renderCaseDetails(selectedCase) : mode === "manage" ? renderManageAppointment() : (
              <div className="space-y-12">
                {selectedCategory ? (
                  renderCategoryListView(selectedCategory, (caseCategories as any)[selectedCategory])
                ) : (
                  <div className="space-y-8 max-w-5xl mx-auto">
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-primary font-black uppercase tracking-[0.2em]">Browse Case Categories</p>
                      <Badge variant="outline" className="text-[10px] border-primary/20 text-primary">Official PAO Standards</Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant="outline"
                          onClick={() => handleCategoryClick(category)}
                          className={cn(
                            "h-32 flex flex-col gap-3 bg-white border-primary/5 text-primary font-bold text-sm hover:bg-primary hover:text-white shadow-sm transition-all hover:-translate-y-1 rounded-3xl group",
                            selectedCategory === category && "bg-primary text-white"
                          )}
                        >
                          <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-white/20">
                            {category === 'Criminal' && <Scale className="h-6 w-6" />}
                            {category === 'Civil' && <FileText className="h-6 w-6" />}
                            {category === 'Labor' && <CheckCircle2 className="h-6 w-6" />}
                            {category === 'Special Legislation' && <ShieldCheck className="h-6 w-6" />}
                            {category === 'Administrative' && <Info className="h-6 w-6" />}
                          </div>
                          {category}
                        </Button>
                      ))}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mt-12">
                       <Card className="bg-primary text-primary-foreground border-none rounded-3xl p-8">
                         <div className="space-y-4">
                           <h3 className="text-xl font-black">Universal PAO Flow</h3>
                           <p className="text-xs text-primary-foreground/80 leading-relaxed">
                             Every Filipino seeking assistance follows a 9-step journey from initial interview to final decision.
                             Learn the roadmap for justice today.
                           </p>
                           <Button variant="secondary" onClick={() => handleCaseClick("Murder", "Criminal")} className="w-full font-bold">
                             View Process Map
                           </Button>
                         </div>
                       </Card>
                       <Card className="bg-[#EBF2FA] border-none rounded-3xl p-8">
                         <div className="space-y-4">
                           <h3 className="text-xl font-black text-primary">Eligibility Check</h3>
                           <p className="text-xs text-muted-foreground leading-relaxed">
                             Are you qualified for free legal assistance? PAO provides services to indigent citizens based on 
                             regional income caps and case merit.
                           </p>
                           <Button variant="outline" className="w-full border-primary/20 text-primary font-bold" onClick={() => router.push('/about')}>
                             Check Qualification
                           </Button>
                         </div>
                       </Card>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-dashed border-primary/20 rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <ShieldCheck className="h-6 w-6 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 space-y-1">
                <p className="text-xs text-primary font-black uppercase tracking-wider">Public Attorney's Office (PAO) Jurisdiction</p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  The PAO mandate is to represent indigent accused persons, litigants in civil and labor cases, 
                  and victims of specialized laws. Note: Civil cases (like Annulment) undergo a very strict Merit Test 
                  to ensure legal and factual basis before acceptance.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

export default function CaseNavigatorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CaseNavigatorContent />
    </Suspense>
  );
}
