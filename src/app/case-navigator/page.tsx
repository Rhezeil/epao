
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
  ListChecks, 
  CalendarCheck, 
  Loader2, 
  ShieldCheck, 
  Scale, 
  AlertCircle,
  Briefcase 
} from "lucide-react";
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
      <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" onClick={() => setSelectedCase(null)} className="text-primary gap-2 font-black text-lg">
            <ArrowLeft className="h-6 w-6" /> Back
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} className="flex items-center gap-2 text-muted-foreground font-bold">
            <X className="h-5 w-5" /> Clear
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Information */}
          <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
            <CardHeader className="pb-4 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
                  <FileText className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-black text-primary">Case Info</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <p className="text-xs font-black text-primary/40 uppercase tracking-[0.2em]">Matter Subject</p>
                <h2 className="text-4xl font-black text-[#1A3B6B] leading-[1.1] tracking-tighter">{caseName}</h2>
                {selectedCategory && <Badge className="mt-2 px-4 py-1.5 text-sm font-black rounded-full bg-primary/10 text-primary border-none">{selectedCategory}</Badge>}
              </div>

              {guidance.description && (
                <div className="bg-primary/5 p-6 rounded-[2rem] border-l-8 border-primary shadow-inner">
                  <p className="text-lg text-[#2E5A99] font-bold leading-relaxed italic">
                    {guidance.description}
                  </p>
                </div>
              )}
              
              <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 shadow-sm">
                <div className="flex gap-4">
                  <ShieldCheck className="h-7 w-7 text-green-600 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-lg font-black text-green-900 leading-tight">PAO Qualified</p>
                    <p className="text-sm text-green-700 font-bold leading-snug">
                      Assistance is subject to the mandatory Indigency & Merit evaluation.
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full h-16 bg-primary hover:bg-[#1A3B6B] text-white text-xl font-black rounded-[2rem] flex items-center justify-center gap-4 shadow-2xl transition-all hover:scale-[1.03] active:scale-95"
                onClick={() => router.push(`/dashboard/client/book-appointment?caseType=${encodeURIComponent(caseName)}&category=${encodeURIComponent(selectedCategory || 'General')}`)}
              >
                <CalendarCheck className="h-7 w-7" />
                Book Consultation
              </Button>
            </CardContent>
          </Card>

          {/* Card 2: Requirements */}
          <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
            <CardHeader className="pb-4 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
                  <ListChecks className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-black text-primary">Checklist</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              {isReqLoading ? (
                <div className="flex justify-center py-20"><Loader2 className="animate-spin h-10 w-10 text-primary" /></div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-black text-primary/40 uppercase tracking-[0.2em]">Required Documents</p>
                  <div className="grid gap-3">
                    {guidance.requirements.map((doc: string, idx: number) => (
                      <div key={idx} className="flex gap-4 items-center bg-white/50 p-4 rounded-2xl border border-primary/5 hover:border-primary/20 transition-colors shadow-sm">
                        <CheckCircle2 className="h-6 w-6 text-green-500 shrink-0" />
                        <span className="text-lg text-[#1A3B6B] font-bold leading-tight">{doc}</span>
                      </div>
                    ))}
                    {guidance.requirements.length === 0 && (
                      <div className="p-10 text-center space-y-3">
                        <AlertCircle className="h-10 w-10 text-primary/20 mx-auto" />
                        <p className="text-base text-muted-foreground font-bold italic">Standard indigent documentation applies for this matter.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Card 3: Process */}
          <Card className="border-none shadow-2xl bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
            <CardHeader className="pb-4 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-primary text-white rounded-2xl shadow-lg">
                  <Compass className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl font-black text-primary">Process Flow</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <Accordion type="single" collapsible className="w-full space-y-4">
                {guidance.steps.map((step: any, idx: number) => (
                  <AccordionItem key={idx} value={`step-${idx}`} className="border-none rounded-[1.5rem] bg-white/80 shadow-md px-5 hover:bg-white transition-colors">
                    <AccordionTrigger className="hover:no-underline py-6">
                      <div className="flex items-center gap-5 text-left">
                        <div className="h-10 w-10 rounded-2xl bg-primary text-white text-sm font-black flex items-center justify-center shrink-0 shadow-xl">
                          {step.step || idx + 1}
                        </div>
                        <span className="text-lg font-black text-[#1A3B6B] leading-tight">{step.title}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="text-base text-[#2E5A99] pb-6 leading-relaxed font-bold whitespace-pre-line px-2">
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
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-6">
        <Button variant="outline" size="icon" onClick={() => setSelectedCategory(null)} className="h-14 w-14 rounded-[1.5rem] text-primary border-primary/20 bg-white shadow-lg hover:scale-105 transition-transform">
          <ArrowLeft className="h-7 w-7" />
        </Button>
        <h2 className="text-4xl font-black text-primary font-headline tracking-tighter">{title} Case Library</h2>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {subCategories.map((cat, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-md rounded-[2.5rem] border border-primary/10 shadow-xl overflow-hidden flex flex-col transition-all hover:shadow-2xl">
            <div className="bg-primary/5 p-6 border-b border-primary/10">
              <h3 className="text-sm font-black text-primary uppercase tracking-[0.25em]">{cat.title}</h3>
            </div>
            <div className="p-4 grid grid-cols-1 gap-2">
              {cat.items.map((item: string) => (
                <div 
                  key={item} 
                  onClick={() => handleCaseClick(item, title)} 
                  className="text-lg text-[#1A3B6B] font-black cursor-pointer hover:bg-primary/5 px-6 py-4 rounded-[1.5rem] flex items-center justify-between transition-all group border border-transparent hover:border-primary/20"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-3 w-3 rounded-full bg-primary/20 group-hover:bg-primary group-hover:scale-150 transition-all shrink-0" />
                    <span className="leading-tight">{item}</span>
                  </div>
                  <Search className="h-5 w-5 opacity-0 group-hover:opacity-40 transition-all group-hover:translate-x-1" />
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
      <div className="max-w-7xl mx-auto space-y-12 py-4 px-4">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-6 bg-primary/10 rounded-[3rem] mb-2 shadow-inner border border-white/50">
            <Compass className="h-16 w-16 text-primary" />
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-headline text-primary tracking-tighter leading-[0.9]">
            Case Navigator
          </h1>
          <p className="text-xl text-muted-foreground font-bold leading-relaxed max-w-2xl mx-auto">
            Official statutory requirements and process flows for the Public Attorney's Office (PAO).
          </p>
        </div>

        <div className="flex gap-4 max-w-5xl mx-auto bg-white p-4 rounded-[2.5rem] border-2 shadow-[0_32px_64px_-12px_rgba(26,35,126,0.15)] transition-all focus-within:ring-4 focus-within:ring-primary/10">
          <div className="flex-1 flex items-center px-6">
            <Search className="h-8 w-8 text-primary/30 mr-4" />
            <Input 
              placeholder='Search a legal matter (e.g., "Murder", "Labor", "RA 9165")...' 
              className="h-16 border-none shadow-none focus-visible:ring-0 text-2xl font-black placeholder:font-bold placeholder:text-muted-foreground/40"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button size="lg" onClick={handleSearch} className="bg-primary hover:bg-[#1A3B6B] text-white h-16 px-12 text-xl font-black rounded-[1.8rem] flex items-center gap-4 shadow-2xl transition-all hover:scale-[1.03] active:scale-95">
            Navigator
          </Button>
        </div>

        <div className="min-h-[600px]">
          {selectedCase ? renderCaseDetails(selectedCase) : mode === "manage" ? (
             <div className="flex flex-col items-center justify-center py-20 text-center animate-in zoom-in-95">
               <div className="p-8 bg-primary/5 rounded-[3.5rem] mb-8 shadow-inner border border-primary/5">
                 <CalendarCheck className="h-16 w-16 text-primary" />
               </div>
               <h2 className="text-4xl font-black text-primary tracking-tight">Manage Appointment</h2>
               <p className="text-xl text-muted-foreground mt-4 font-bold">Enter your reference code PAO-XXXXXX to continue.</p>
               <div className="mt-12 w-full max-w-md flex flex-col gap-5">
                  <Input 
                    placeholder="PAO-123456" 
                    className="h-20 text-3xl font-black text-center tracking-[0.2em] rounded-[2rem] border-4 focus:border-primary border-primary/10 shadow-2xl" 
                    value={refCode} 
                    onChange={(e) => setRefCode(e.target.value)} 
                  />
                  <Button className="h-16 text-xl font-black rounded-[1.8rem] shadow-2xl" onClick={() => router.push('/case-navigator?mode=manage')}>Track Appointment</Button>
               </div>
             </div>
          ) : (
            <div className="space-y-16">
              {selectedCategory ? (
                renderCategoryListView(selectedCategory, (caseCategories as any)[selectedCategory])
              ) : (
                <div className="space-y-12 max-w-6xl mx-auto animate-in fade-in duration-700">
                  <div className="flex items-center justify-between border-b-4 border-primary/5 pb-6">
                    <p className="text-sm text-primary font-black uppercase tracking-[0.4em]">Browse Law Areas</p>
                    <Badge className="text-xs border-primary/20 text-primary font-black px-5 py-2 rounded-full bg-white shadow-sm uppercase tracking-widest">Official Standards</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={cn(
                          "h-56 flex flex-col items-center justify-center gap-6 bg-white/70 backdrop-blur-md border border-primary/5 text-primary font-black text-2xl hover:bg-primary hover:text-white shadow-2xl transition-all hover:-translate-y-3 rounded-[3.5rem] group p-8",
                          selectedCategory === category && "bg-primary text-white"
                        )}
                      >
                        <div className="p-6 bg-primary/10 rounded-[2.5rem] group-hover:bg-white/20 transition-all shadow-inner border border-white/50">
                          {category === 'Criminal' && <Scale className="h-10 w-10" />}
                          {category === 'Civil' && <FileText className="h-10 w-10" />}
                          {category === 'Labor' && <Briefcase className="h-10 w-10" />}
                          {category === 'Special Legislation' && <ShieldCheck className="h-10 w-10" />}
                          {category === 'Administrative' && <Info className="h-10 w-10" />}
                        </div>
                        <span className="text-center leading-tight tracking-tighter">{category}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-20">
                     <Card className="bg-amber-50/50 border-4 border-amber-100 rounded-[3.5rem] p-12 shadow-2xl backdrop-blur-sm">
                       <div className="space-y-10">
                         <div className="text-center space-y-2">
                           <h3 className="text-3xl font-black text-amber-900 flex items-center justify-center gap-4">
                             <AlertCircle className="h-8 w-8" /> Important Reminders
                           </h3>
                           <p className="text-amber-800/60 font-bold uppercase tracking-widest text-xs">Standard Operating Procedures</p>
                         </div>
                         <div className="grid md:grid-cols-2 gap-6">
                           {pAONotes.map((note, i) => (
                             <div key={i} className="flex gap-4 bg-white/60 p-6 rounded-[2rem] border-2 border-amber-200/50 shadow-sm">
                               <CheckCircle2 className="h-6 w-6 text-amber-600 shrink-0 mt-1" />
                               <span className="text-lg text-amber-900 font-bold leading-relaxed">{note}</span>
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
