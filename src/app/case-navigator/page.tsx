"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Compass, 
  Search, 
  ArrowLeft, 
  X, 
  CheckCircle2, 
  FileText, 
  Info, 
  CalendarCheck, 
  Loader2, 
  ShieldCheck, 
  Scale, 
  AlertCircle,
  Briefcase,
  Layers,
  ClipboardList,
  User, // Ensure User is imported for the icon
  Gavel
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { caseCategories, categoryDefaults, caseSpecificData, pAONotes, standardPaoDocs, universalPaoFlow } from "@/app/lib/case-data";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

  const reqDocRef = useMemoFirebase(() => {
    if (!db || !selectedCase) return null;
    const docId = selectedCase.toLowerCase().replace(/[\s/]+/g, '-');
    return doc(db, "caseRequirements", docId);
  }, [db, selectedCase]);

  const { data: dynamicReqs, isLoading: isReqLoading } = useDoc(reqDocRef);

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
      setSelectedCase(searchQuery);
    }
  };

  const handleClear = () => {
    setSelectedCase(null);
    setSearchQuery("");
  };

  const getEffectiveData = () => {
    if (dynamicReqs) {
      return { 
        requirements: dynamicReqs.requirements || [], 
        steps: dynamicReqs.steps || universalPaoFlow,
        description: dynamicReqs.description || (caseSpecificData[selectedCase!]?.description)
      };
    }
    if (selectedCase && caseSpecificData[selectedCase]) {
      return caseSpecificData[selectedCase];
    }
    if (selectedCategory && categoryDefaults[selectedCategory]) {
      return { ...categoryDefaults[selectedCategory], description: undefined };
    }
    return { requirements: [], steps: universalPaoFlow, description: undefined };
  };

  const renderCaseDetails = (caseName: string) => {
    const guidance = getEffectiveData();
    
    return (
      <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={() => setSelectedCase(null)} className="text-primary gap-2 font-bold">
            <ArrowLeft className="h-4 w-4" /> Back to Categories
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} className="flex items-center gap-2 text-muted-foreground font-medium">
            <X className="h-4 w-4" /> Clear
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-none shadow-xl bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden flex flex-col">
            <CardHeader className="pb-4 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary text-white rounded-xl shadow-md">
                  <Gavel className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-bold text-primary">Case Profile</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6 flex-1">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Legal Matter</p>
                <h2 className="text-xl font-black text-[#1A3B6B] leading-tight tracking-tight">{caseName}</h2>
                {selectedCategory && <Badge className="mt-2 px-3 py-1 text-xs font-bold rounded-full bg-primary/10 text-primary border-none">{selectedCategory}</Badge>}
              </div>

              {guidance.description && (
                <div className="bg-primary/5 p-4 rounded-xl border-l-4 border-primary shadow-sm">
                  <p className="text-sm text-[#2E5A99] font-medium leading-relaxed italic">
                    {guidance.description}
                  </p>
                </div>
              )}
              
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 shadow-sm">
                <div className="flex gap-3">
                  <ShieldCheck className="h-5 w-5 text-green-600 shrink-0" />
                  <div className="space-y-0.5">
                    <p className="text-sm font-bold text-green-900 leading-tight">PAO Mandated</p>
                    <p className="text-xs text-green-700 font-medium leading-snug">
                      Eligible for free legal assistance if you pass the Merit and Indigency Tests.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full h-12 bg-primary hover:bg-[#1A3B6B] text-white text-base font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                  onClick={() => router.push(`/dashboard/client/book-appointment?caseType=${encodeURIComponent(caseName)}&category=${encodeURIComponent(selectedCategory || 'General')}`)}
                >
                  <CalendarCheck className="h-5 w-5" />
                  Book Consultation
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="requirements" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/50 p-1 rounded-2xl border-2 border-primary/5 shadow-inner h-14">
                <TabsTrigger value="requirements" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                  <ClipboardList className="h-4 w-4 mr-2" /> Requirements
                </TabsTrigger>
                <TabsTrigger value="process" className="rounded-xl font-bold data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Layers className="h-4 w-4 mr-2" /> Process Flow
                </TabsTrigger>
              </TabsList>

              <TabsContent value="requirements" className="mt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="border-none shadow-lg bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
                    <CardHeader className="bg-amber-50/50 pb-4 border-b border-amber-100">
                      <CardTitle className="text-sm font-black text-amber-900 uppercase tracking-widest flex items-center gap-2">
                        <User className="h-4 w-4" /> Eligibility Checklist
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                      {standardPaoDocs.map((doc, idx) => (
                        <div key={idx} className="flex gap-3 items-center bg-amber-50/30 p-3 rounded-xl border border-amber-100/50">
                          <CheckCircle2 className="h-4 w-4 text-amber-600 shrink-0" />
                          <span className="text-xs text-amber-900 font-bold leading-tight">{doc}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg bg-white/80 backdrop-blur-md rounded-3xl overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                      <CardTitle className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
                        <Scale className="h-4 w-4" /> Case Evidence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-3">
                      {isReqLoading ? (
                        <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
                      ) : (
                        guidance.requirements.map((doc: string, idx: number) => (
                          <div key={idx} className="flex gap-3 items-center bg-primary/5 p-3 rounded-xl border border-primary/10">
                            <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                            <span className="text-xs text-[#1A3B6B] font-bold leading-tight">{doc}</span>
                          </div>
                        ))
                      )}
                      {(!guidance.requirements || guidance.requirements.length === 0) && !isReqLoading && (
                        <p className="text-xs text-muted-foreground italic text-center py-8">Standard requirements apply for this case.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="process" className="mt-6">
                <Card className="border-none shadow-xl bg-white/70 backdrop-blur-md rounded-3xl overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-4">
                    <CardTitle className="text-xl font-bold text-primary flex items-center gap-3">
                      <div className="p-2 bg-primary text-white rounded-xl">
                        <Layers className="h-5 w-5" />
                      </div>
                      PAO Process Roadmap
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <Accordion type="single" collapsible className="w-full space-y-3">
                      {guidance.steps.map((step: any, idx: number) => (
                        <AccordionItem key={idx} value={`step-${idx}`} className="border-none rounded-xl bg-white/80 shadow-sm px-4 hover:bg-white transition-colors">
                          <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-4 text-left">
                              <div className="h-8 w-8 rounded-lg bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 shadow-md">
                                {step.step || idx + 1}
                              </div>
                              <span className="text-sm font-bold text-[#1A3B6B] text-left leading-tight">{step.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-xs text-[#2E5A99] pb-4 leading-relaxed font-medium whitespace-pre-line px-1">
                            {step.content}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    );
  }

  const renderCategoryListView = (title: string, subCategories: any[]) => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setSelectedCategory(null)} className="h-12 w-12 rounded-xl text-primary border-primary/20 bg-white shadow-md hover:scale-105 transition-transform">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-2xl font-black text-primary font-headline tracking-tight">{title}</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subCategories.map((cat, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-md rounded-[2rem] border border-primary/10 shadow-lg overflow-hidden flex flex-col transition-all hover:shadow-xl">
            <div className="bg-primary/5 p-4 border-b border-primary/10">
              <h3 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{cat.title}</h3>
            </div>
            <div className="p-3 grid grid-cols-1 gap-1">
              {cat.items.map((item: string) => (
                <div 
                  key={item} 
                  onClick={() => handleCaseClick(item, title)} 
                  className="text-sm text-[#1A3B6B] font-bold cursor-pointer hover:bg-primary/5 px-5 py-3 rounded-xl flex items-center justify-between transition-all group border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary group-hover:scale-125 transition-all shrink-0" />
                    <span className="leading-tight">{item}</span>
                  </div>
                  <Search className="h-4 w-4 opacity-0 group-hover:opacity-40 transition-all group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <DashboardLayout role={role}>
      <div className="max-w-7xl mx-auto space-y-10 py-4 px-4">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-5 bg-primary/10 rounded-[2.5rem] mb-2 shadow-inner border border-white/50">
            <Compass className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-headline text-primary tracking-tight leading-tight">
            Case Navigator
          </h1>
          <p className="text-sm text-muted-foreground font-semibold leading-relaxed max-w-2xl mx-auto">
            Find required documents and process flows for legal matters in the Philippines.
          </p>
        </div>

        <div className="flex gap-3 max-w-4xl mx-auto bg-white p-3 rounded-[2rem] border-2 shadow-xl transition-all focus-within:ring-4 focus-within:ring-primary/10">
          <div className="flex-1 flex items-center px-4">
            <Search className="h-6 w-6 text-primary/30 mr-3" />
            <Input 
              placeholder='Search a legal matter (e.g., "Murder", "Labor")...' 
              className="h-12 border-none shadow-none focus-visible:ring-0 text-base font-bold placeholder:font-medium placeholder:text-muted-foreground/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button size="lg" onClick={handleSearch} className="bg-primary hover:bg-[#1A3B6B] text-white h-12 px-8 text-base font-bold rounded-xl flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-95">
            Search
          </Button>
        </div>

        <div className="min-h-[500px]">
          {selectedCase ? renderCaseDetails(selectedCase) : mode === "manage" ? (
             <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95">
               <div className="p-6 bg-primary/5 rounded-[3rem] mb-6 shadow-inner border border-primary/5">
                 <CalendarCheck className="h-12 w-12 text-primary" />
               </div>
               <h2 className="text-2xl font-black text-primary tracking-tight">Manage Appointment</h2>
               <p className="text-sm text-muted-foreground mt-2 font-semibold">Enter your reference code PAO-XXXXXX to continue.</p>
               <div className="mt-8 w-full max-w-sm flex flex-col gap-4">
                  <Input 
                    placeholder="PAO-123456" 
                    className="h-16 text-2xl font-black text-center tracking-[0.2em] rounded-2xl border-2 focus:border-primary border-primary/10 shadow-lg" 
                    value={refCode} 
                    onChange={(e) => setRefCode(e.target.value)} 
                  />
                  <Button className="h-12 text-base font-bold rounded-xl shadow-lg" onClick={() => router.push('/case-navigator?mode=manage')}>Track Appointment</Button>
               </div>
             </div>
          ) : (
            <div className="space-y-12">
              {selectedCategory ? (
                renderCategoryListView(selectedCategory, (caseCategories as any)[selectedCategory])
              ) : (
                <div className="space-y-10 max-w-5xl mx-auto animate-in fade-in duration-700">
                  <div className="flex items-center justify-between border-b-2 border-primary/5 pb-4">
                    <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">Browse Law Areas</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={cn(
                          "h-48 flex flex-col items-center justify-center gap-4 bg-white/70 backdrop-blur-md border border-primary/5 text-primary font-bold text-lg hover:bg-primary hover:text-white shadow-xl transition-all hover:-translate-y-2 rounded-[2.5rem] group p-6",
                          selectedCategory === category && "bg-primary text-white"
                        )}
                      >
                        <div className="p-4 bg-primary/10 rounded-2xl group-hover:bg-white/20 transition-all shadow-inner border border-white/50">
                          {category === 'Criminal' && <Scale className="h-8 w-8" />}
                          {category === 'Civil' && <FileText className="h-8 w-8" />}
                          {category === 'Labor' && <Briefcase className="h-8 w-8" />}
                          {category === 'Special Legislation' && <ShieldCheck className="h-8 w-8" />}
                          {category === 'Administrative' && <Info className="h-8 w-8" />}
                        </div>
                        <span className="text-center text-sm leading-tight tracking-tight">{category}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-16">
                     <Card className="bg-amber-50/50 border-2 border-amber-100 rounded-[2.5rem] p-8 shadow-xl backdrop-blur-sm">
                       <div className="space-y-8">
                         <div className="text-center space-y-1">
                           <h3 className="text-xl font-black text-amber-900 flex items-center justify-center gap-3">
                             <AlertCircle className="h-6 w-6" /> Important Reminders
                           </h3>
                           <p className="text-amber-800/60 font-bold uppercase tracking-widest text-[10px]">Public Attorney's Office Guidelines</p>
                         </div>
                         <div className="grid md:grid-cols-2 gap-4">
                           {pAONotes.map((note, i) => (
                             <div key={i} className="flex gap-3 bg-white/60 p-4 rounded-xl border border-amber-200/50 shadow-sm">
                               <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                               <span className="text-xs text-amber-900 font-semibold leading-relaxed">{note}</span>
                             </div>
                           ))}
                         </div>
                       </div>
                     </Card>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
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
