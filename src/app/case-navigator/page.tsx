
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Compass, Search, ArrowLeft, X, CheckCircle2, FileText, Info, ListChecks, CalendarCheck, Loader2, ShieldCheck, Scale, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection, query, where, limit } from "firebase/firestore";
import { caseCategories, defaultRequirements, defaultSteps, categoryDefaults, caseSpecificData, pAONotes } from "@/app/lib/case-data";
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

  const reqDocRef = useMemoFirebase(() => {
    if (!db || !selectedCase) return null;
    const docId = selectedCase.toLowerCase().replace(/[\s/]+/g, '-');
    return doc(db, "caseRequirements", docId);
  }, [db, selectedCase]);

  const { data: dynamicReqs, isLoading: isReqLoading } = useDoc(reqDocRef);

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
        steps: dynamicReqs.steps || defaultSteps,
        description: dynamicReqs.description || caseSpecificData[selectedCase!]?.description
      };
    }
    if (selectedCase && caseSpecificData[selectedCase]) {
      return caseSpecificData[selectedCase];
    }
    if (selectedCategory && categoryDefaults[selectedCategory]) {
      return categoryDefaults[selectedCategory];
    }
    return { requirements: defaultRequirements, steps: defaultSteps, description: undefined };
  };

  const renderCaseDetails = (caseName: string) => {
    const guidance = getEffectiveData();
    
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={() => setSelectedCase(null)} className="text-primary gap-2 font-bold">
            <ArrowLeft className="h-5 w-5" /> Back to Categories
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} className="flex items-center gap-2 text-muted-foreground">
            <X className="h-5 w-5" /> Clear Search
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Information */}
          <Card className="border-none shadow-xl bg-white/60 backdrop-blur-sm rounded-3xl">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-black text-primary">Case Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="space-y-1">
                <p className="text-xs font-black text-primary/60 uppercase tracking-widest">Selected Matter</p>
                <h2 className="text-3xl font-black text-[#1A3B6B] leading-tight tracking-tight">{caseName}</h2>
                {selectedCategory && <Badge variant="secondary" className="mt-2 px-3 py-1 font-bold">{selectedCategory}</Badge>}
              </div>

              {guidance.description && (
                <div className="bg-primary/5 p-5 rounded-2xl border-l-4 border-primary/30 shadow-inner">
                  <p className="text-base text-[#2E5A99] font-semibold leading-relaxed italic">
                    {guidance.description}
                  </p>
                </div>
              )}
              
              <div className="bg-[#E8F5E9] p-5 rounded-2xl border border-green-200">
                <div className="flex gap-4">
                  <ShieldCheck className="h-6 w-6 text-green-600 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-base font-black text-green-800 leading-tight">Qualified for PAO</p>
                    <p className="text-sm text-green-700 font-medium leading-snug">
                      Assistance subject to Indigency & Merit tests.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-14 bg-primary hover:bg-[#1A3B6B] text-white text-lg font-black rounded-2xl flex items-center justify-center gap-3 shadow-xl transition-all hover:scale-[1.02]"
                onClick={() => router.push(`/dashboard/client/book-appointment?caseType=${encodeURIComponent(caseName)}&category=${encodeURIComponent(selectedCategory || 'General')}`)}
              >
                <CalendarCheck className="h-6 w-6" />
                Book Consultation
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Requirements */}
          <Card className="border-none shadow-xl bg-white/60 backdrop-blur-sm rounded-3xl">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <ListChecks className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-black text-primary">Checklist</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              {isReqLoading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-black text-primary/60 uppercase tracking-widest">Required Documents</p>
                  <div className="grid gap-2">
                    {guidance.requirements.map((doc: string, idx: number) => (
                      <div key={idx} className="flex gap-4 items-start bg-white/40 p-3 rounded-xl border border-primary/5">
                        <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                        <span className="text-base text-[#2E5A99] font-bold leading-tight">{doc}</span>
                      </div>
                    ))}
                    {guidance.requirements.length === 0 && (
                      <p className="text-sm text-muted-foreground italic p-4">Standard indigent documentation applies.</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Process */}
          <Card className="border-none shadow-xl bg-white/60 backdrop-blur-sm rounded-3xl">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3 mb-1">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <Compass className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-black text-primary">Process Flow</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <Accordion type="single" collapsible className="w-full space-y-3">
                {guidance.steps.map((step: any, idx: number) => (
                  <AccordionItem key={idx} value={`step-${idx}`} className="border-none rounded-2xl bg-white/80 shadow-sm px-4">
                    <AccordionTrigger className="hover:no-underline py-5">
                      <div className="flex items-center gap-4 text-left">
                        <div className="h-8 w-8 rounded-xl bg-primary text-white text-xs font-black flex items-center justify-center shrink-0 shadow-lg">
                          {step.step || idx + 1}
                        </div>
                        <span className="text-base font-black text-primary leading-tight">{step.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground pb-5 leading-relaxed font-medium whitespace-pre-line px-2">
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

  const renderCategoryListView = (title: string, subCategories: any[]) => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => setSelectedCategory(null)} className="h-10 w-10 rounded-xl text-primary border-primary/20 bg-white">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-black text-primary font-headline tracking-tighter">{title} Case Library</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subCategories.map((cat, idx) => (
          <div key={idx} className="bg-white/80 rounded-3xl border border-primary/5 shadow-md overflow-hidden flex flex-col">
            <div className="bg-primary/5 p-4 border-b border-primary/10">
              <h3 className="text-sm font-black text-primary uppercase tracking-[0.15em]">{cat.title}</h3>
            </div>
            <div className="p-3 grid grid-cols-1 gap-1">
              {cat.items.map((item: string) => (
                <div 
                  key={item} 
                  onClick={() => handleCaseClick(item, title)} 
                  className="text-[15px] text-[#2E5A99] font-bold cursor-pointer hover:bg-primary/5 px-4 py-3 rounded-2xl flex items-center justify-between transition-all group border border-transparent hover:border-primary/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-2 w-2 rounded-full bg-primary/30 group-hover:bg-primary transition-colors shrink-0" />
                    <span className="leading-tight">{item}</span>
                  </div>
                  <Search className="h-4 w-4 opacity-0 group-hover:opacity-40 transition-opacity" />
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
      <div className="max-w-6xl mx-auto space-y-10 py-4 px-4">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-[2rem] mb-2 shadow-inner">
            <Compass className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-headline text-primary tracking-tighter">
            Case Navigator
          </h1>
          <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
            Search or browse official statutory requirements for the Public Attorney's Office (PAO).
          </p>
        </div>

        <div className="flex gap-3 max-w-4xl mx-auto bg-white p-3 rounded-3xl border shadow-2xl transition-all focus-within:ring-2 focus-within:ring-primary/20">
          <div className="flex-1 flex items-center px-4">
            <Search className="h-6 w-6 text-primary/40 mr-3" />
            <Input 
              placeholder='Type a case (e.g., "Murder", "Labor", "RA 9165")...' 
              className="h-14 border-none shadow-none focus-visible:ring-0 text-lg font-bold placeholder:font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button size="lg" onClick={handleSearch} className="bg-primary hover:bg-[#1A3B6B] text-white h-14 px-10 text-lg font-black rounded-2xl flex items-center gap-3 shadow-lg transition-transform hover:scale-105">
            Navigator
          </Button>
        </div>

        <div className="min-h-[600px]">
          {selectedCase ? renderCaseDetails(selectedCase) : mode === "manage" ? (
             <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95">
               <div className="p-6 bg-primary/5 rounded-[2.5rem] mb-6">
                 <CalendarCheck className="h-12 w-12 text-primary" />
               </div>
               <h2 className="text-3xl font-black text-primary">Manage Appointment</h2>
               <p className="text-lg text-muted-foreground mt-3 font-medium">Enter your reference code PAO-XXXXXX to start.</p>
               <div className="mt-10 w-full max-w-md flex flex-col gap-4">
                  <Input 
                    placeholder="PAO-123456" 
                    className="h-16 text-2xl font-black text-center tracking-widest rounded-2xl border-2 focus:border-primary" 
                    value={refCode} 
                    onChange={(e) => setRefCode(e.target.value)} 
                  />
                  <Button className="h-14 text-lg font-black rounded-2xl shadow-xl" onClick={() => router.push('/case-navigator?mode=manage')}>Track Appointment</Button>
               </div>
             </div>
          ) : (
            <div className="space-y-12">
              {selectedCategory ? (
                renderCategoryListView(selectedCategory, (caseCategories as any)[selectedCategory])
              ) : (
                <div className="space-y-10 max-w-5xl mx-auto animate-in fade-in duration-700">
                  <div className="flex items-center justify-between border-b border-primary/10 pb-4">
                    <p className="text-sm text-primary font-black uppercase tracking-[0.3em]">Browse Law Areas</p>
                    <Badge variant="outline" className="text-xs border-primary/20 text-primary font-bold px-3 py-1">Official Standards</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={cn(
                          "h-48 flex flex-col items-center justify-center gap-4 bg-white/60 backdrop-blur-md border border-primary/5 text-primary font-black text-lg hover:bg-primary hover:text-white shadow-xl transition-all hover:-translate-y-2 rounded-[2.5rem] group p-6",
                          selectedCategory === category && "bg-primary text-white"
                        )}
                      >
                        <div className="p-5 bg-primary/10 rounded-[1.5rem] group-hover:bg-white/20 transition-colors shadow-inner">
                          {category === 'Criminal' && <Scale className="h-8 w-8" />}
                          {category === 'Civil' && <FileText className="h-8 w-8" />}
                          {category === 'Labor' && <Briefcase className="h-8 w-8" />}
                          {category === 'Special Legislation' && <ShieldCheck className="h-8 w-8" />}
                          {category === 'Administrative' && <Info className="h-8 w-8" />}
                        </div>
                        <span className="text-center leading-tight">{category}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-16">
                     <Card className="bg-amber-50 border border-amber-100 rounded-[2.5rem] p-10 shadow-lg">
                       <div className="space-y-6">
                         <h3 className="text-2xl font-black text-amber-900 flex items-center gap-3">
                           <AlertCircle className="h-7 w-7" /> Important Reminders
                         </h3>
                         <div className="grid md:grid-cols-2 gap-4">
                           {pAONotes.map((note, i) => (
                             <div key={i} className="flex gap-3 bg-white/50 p-4 rounded-2xl border border-amber-200/50">
                               <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                               <span className="text-sm text-amber-800 font-bold leading-relaxed">{note}</span>
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
