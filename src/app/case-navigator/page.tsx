
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
  Scale, 
  CalendarCheck, 
  Loader2, 
  ShieldCheck, 
  Briefcase,
  Layers,
  ClipboardList,
  User,
  Gavel,
  AlertTriangle,
  ArrowRight,
  Globe
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { caseCategories, categoryDefaults, caseSpecificData, pAONotes, standardPaoDocs, universalPaoFlow, allCaseNames } from "@/app/lib/case-data";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function CaseNavigatorContent() {
  const { role, user } = useAuth();
  const db = useFirestore();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [filteredResults, setFilteredResults] = useState<string[]>([]);

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setFilteredResults([]);
      return;
    }
    let results: string[] = [];
    if (q.length === 1) {
      results = allCaseNames.filter(c => c.toLowerCase().startsWith(q));
    } else {
      results = allCaseNames.filter(c => c.toLowerCase().includes(q));
    }
    setFilteredResults(results);
  }, [searchQuery]);

  const reqDocRef = useMemoFirebase(() => {
    if (!db || !selectedCase) return null;
    const docId = selectedCase.toLowerCase().replace(/[\s/().,]+/g, '-').replace(/-+$/, '');
    return doc(db, "caseRequirements", docId);
  }, [db, selectedCase]);

  const { data: dynamicReqs, isLoading: isReqLoading } = useDoc(reqDocRef);

  const categories = Object.keys(caseCategories);

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setSelectedCase(null);
    setSearchQuery("");
  };

  const handleCaseClick = (caseItem: string, category?: string) => {
    setSelectedCase(caseItem);
    setSearchQuery("");
    if (category) setSelectedCategory(category);
  };

  const handleClear = () => {
    setSelectedCase(null);
    setSelectedCategory(null);
    setSearchQuery("");
  };

  const handleBookingRedirect = (caseName: string) => {
    const category = selectedCategory || 'General';
    const queryParams = `?caseType=${encodeURIComponent(caseName)}&category=${encodeURIComponent(category)}&fromNavigator=true`;
    if (user && role === 'client') {
      router.push(`/dashboard/client/book-appointment${queryParams}`);
    } else {
      router.push(`/book-appointment${queryParams}`);
    }
  };

  const getEffectiveData = () => {
    if (dynamicReqs) {
      return { requirements: dynamicReqs.requirements || [], steps: dynamicReqs.steps || universalPaoFlow, description: dynamicReqs.description || (caseSpecificData[selectedCase!]?.description) };
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
        <div className="flex justify-between items-center px-4">
          <Button variant="ghost" size="sm" onClick={() => setSelectedCase(null)} className="text-primary gap-2 font-bold">
            <ArrowLeft className="h-4 w-4" /> Back to Browser
          </Button>
          <Button variant="ghost" size="sm" onClick={handleClear} className="flex items-center gap-2 text-muted-foreground font-medium">
            <X className="h-4 w-4" /> Reset Browser
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="border-none shadow-xl bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden flex flex-col">
            <CardHeader className="pb-4 bg-primary/5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary text-white rounded-xl shadow-md">
                  <Gavel className="h-5 w-5" />
                </div>
                <CardTitle className="text-xl font-bold text-primary">Case Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pt-8 flex-1 px-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-primary/40 uppercase tracking-widest">Selected Classification</p>
                <h2 className="text-2xl font-black text-[#1A3B6B] leading-tight tracking-tight">{caseName}</h2>
                {selectedCategory && (
                  <Badge className="mt-3 px-4 py-1 text-[10px] font-black uppercase rounded-full bg-primary/10 text-primary border-none">
                    {selectedCategory}
                  </Badge>
                )}
              </div>

              {guidance.description && (
                <div className="bg-primary/5 p-5 rounded-3xl border-l-4 border-primary shadow-sm">
                  <p className="text-sm text-[#2E5A99] font-medium leading-relaxed italic">
                    {guidance.description}
                  </p>
                </div>
              )}
              
              <div className="bg-green-50 p-5 rounded-3xl border border-green-100 shadow-sm">
                <div className="flex gap-4">
                  <ShieldCheck className="h-6 w-6 text-green-600 shrink-0" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-green-900 leading-tight">PAO Assistance Eligible</p>
                    <p className="text-[11px] text-green-700 font-medium leading-relaxed">
                      Subject to merit and indigency verification upon arrival.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button 
                  className="w-full h-16 bg-primary hover:bg-[#1A3B6B] text-white text-lg font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-all hover:scale-[1.02]"
                  onClick={() => handleBookingRedirect(caseName)}
                >
                  <CalendarCheck className="h-6 w-6" />
                  Request Consultation
                </Button>
                <p className="text-[9px] text-center text-muted-foreground mt-4 font-black uppercase tracking-widest">
                  Public Portal: No Login Required
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-8">
            <Tabs defaultValue="requirements" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white/50 p-1.5 rounded-[2rem] border-2 border-primary/5 shadow-inner h-16">
                <TabsTrigger value="requirements" className="rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                  <ClipboardList className="h-4 w-4 mr-2" /> Document Checklist
                </TabsTrigger>
                <TabsTrigger value="process" className="rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                  <Layers className="h-4 w-4 mr-2" /> Action Roadmap
                </TabsTrigger>
              </TabsList>

              <TabsContent value="requirements" className="mt-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="border-none shadow-lg bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-amber-50/50 pb-4 border-b border-amber-100">
                      <CardTitle className="text-[10px] font-black text-amber-900 uppercase tracking-[0.2em] flex items-center gap-2">
                        <User className="h-4 w-4" /> Eligibility Credentials
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-4 px-8 pb-10">
                      {standardPaoDocs.map((doc, idx) => (
                        <div key={idx} className="flex gap-4 items-center bg-amber-50/30 p-4 rounded-2xl border border-amber-100/50 transition-all hover:bg-amber-50">
                          <CheckCircle2 className="h-5 w-5 text-amber-600 shrink-0" />
                          <span className="text-xs text-amber-900 font-bold leading-relaxed">{doc}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="border-none shadow-lg bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-primary/5 pb-4 border-b border-primary/10">
                      <CardTitle className="text-[10px] font-black text-primary uppercase tracking-[0.2em] flex items-center gap-2">
                        <Scale className="h-4 w-4" /> Legal Evidence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8 space-y-4 px-8 pb-10">
                      {isReqLoading ? (
                        <div className="flex justify-center py-12"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>
                      ) : (
                        guidance.requirements.map((doc: string, idx: number) => (
                          <div key={idx} className="flex gap-4 items-center bg-primary/5 p-4 rounded-2xl border border-primary/10 transition-all hover:bg-primary/10">
                            <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                            <span className="text-xs text-[#1A3B6B] font-bold leading-relaxed">{doc}</span>
                          </div>
                        ))
                      )}
                      {(!guidance.requirements || guidance.requirements.length === 0) && !isReqLoading && (
                        <p className="text-xs text-muted-foreground italic text-center py-12 px-4">Standard evidence protocols apply. Bring all related correspondence.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="process" className="mt-8">
                <Card className="border-none shadow-xl bg-white/70 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                  <CardHeader className="bg-primary/5 pb-6 px-10 pt-8">
                    <CardTitle className="text-xl font-black text-primary flex items-center gap-4">
                      <div className="p-3 bg-primary text-white rounded-2xl">
                        <Layers className="h-6 w-6" />
                      </div>
                      Service Roadmap
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-8 px-10 pb-12">
                    <Accordion type="single" collapsible className="w-full space-y-4">
                      {guidance.steps.map((step: any, idx: number) => (
                        <AccordionItem key={idx} value={`step-${idx}`} className="border-none rounded-3xl bg-white/80 shadow-sm px-6 hover:bg-white transition-colors">
                          <AccordionTrigger className="hover:no-underline py-6">
                            <div className="flex items-center gap-5 text-left">
                              <div className="h-10 w-10 rounded-2xl bg-primary text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow-lg">
                                {step.step || idx + 1}
                              </div>
                              <span className="text-base font-black text-[#1A3B6B] leading-tight">{step.title}</span>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="text-sm text-[#2E5A99] pb-8 leading-relaxed font-medium whitespace-pre-line px-2">
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

  return (
    <DashboardLayout role={role}>
      <div className="max-w-7xl mx-auto space-y-12 py-4 px-4 pb-20">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-6 bg-primary text-white rounded-[2.5rem] mb-4 shadow-xl border-4 border-white">
            <Globe className="h-12 w-12" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black font-headline text-primary tracking-tight leading-tight">
            Public Assistance Portal
          </h1>
          <p className="text-base text-muted-foreground font-semibold leading-relaxed max-w-2xl mx-auto">
            Find procedural guidance and documentary requirements for public legal services in the Philippines.
          </p>
        </div>

        <div className="flex gap-4 max-w-4xl mx-auto bg-white p-4 rounded-[2.5rem] border-2 border-primary/5 shadow-2xl transition-all focus-within:ring-8 focus-within:ring-primary/5">
          <div className="flex-1 flex items-center px-6">
            <Search className="h-7 w-7 text-primary/20 mr-4" />
            <Input 
              placeholder='Browse by case (e.g., "Theft", "Labor Dispute")...' 
              className="h-14 border-none shadow-none focus-visible:ring-0 text-lg font-bold placeholder:font-medium placeholder:text-muted-foreground/30"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="min-h-[600px]">
          {selectedCase ? renderCaseDetails(selectedCase) : (
            <div className="space-y-16">
              {searchQuery.trim().length > 0 ? (
                <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-500">
                  {filteredResults.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredResults.map((result) => (
                        <button
                          key={result}
                          onClick={() => handleCaseClick(result)}
                          className="text-left bg-white/80 p-6 rounded-[2rem] border border-primary/5 hover:border-primary/20 hover:bg-white hover:shadow-xl transition-all flex items-center justify-between group"
                        >
                          <span className="font-black text-primary text-lg">{result}</span>
                          <div className="p-3 bg-primary/5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
                            <ArrowRight className="h-5 w-5" />
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
                      <div className="p-8 bg-amber-50 rounded-full shadow-inner">
                        <AlertTriangle className="h-16 w-16 text-amber-500" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-amber-900">No category matches</h3>
                        <p className="text-sm text-amber-800/60 font-bold">We couldn't find a statutory match for "{searchQuery}".</p>
                      </div>
                      <Button variant="outline" onClick={() => setSearchQuery("")} className="rounded-2xl font-black px-10 h-14 border-2">Clear Search</Button>
                    </div>
                  )}
                </div>
              ) : selectedCategory ? (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                  <div className="flex items-center gap-6">
                    <Button variant="outline" size="icon" onClick={() => setSelectedCategory(null)} className="h-14 w-14 rounded-2xl text-primary border-primary/10 bg-white shadow-xl hover:scale-110 transition-transform">
                      <ArrowLeft className="h-7 w-7" />
                    </Button>
                    <h2 className="text-3xl font-black text-primary font-headline tracking-tight">{selectedCategory} Service Directory</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {(caseCategories as any)[selectedCategory].map((cat: any, idx: number) => (
                      <div key={idx} className="bg-white/80 backdrop-blur-md rounded-[3rem] border border-primary/5 shadow-2xl overflow-hidden flex flex-col transition-all hover:shadow-primary/5">
                        <div className="bg-primary/5 p-6 border-b border-primary/10">
                          <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">{cat.title}</h3>
                        </div>
                        <div className="p-4 grid grid-cols-1 gap-2">
                          {cat.items.map((item: string) => (
                            <div 
                              key={item} 
                              onClick={() => handleCaseClick(item, selectedCategory)} 
                              className="text-base text-[#1A3B6B] font-black cursor-pointer hover:bg-primary/5 px-6 py-4 rounded-2xl flex items-center justify-between transition-all group"
                            >
                              <div className="flex items-center gap-4">
                                <div className="h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary group-hover:scale-150 transition-all shrink-0" />
                                <span className="leading-tight">{item}</span>
                              </div>
                              <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-40 transition-all" />
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-12 max-w-6xl mx-auto animate-in fade-in duration-700">
                  <div className="flex items-center justify-between border-b-4 border-primary/5 pb-6">
                    <p className="text-[11px] text-primary font-black uppercase tracking-[0.4em]">Browse Legal Jurisdictions</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryClick(category)}
                        className={cn(
                          "h-56 flex flex-col items-center justify-center gap-6 bg-white/70 backdrop-blur-md border-2 border-white text-primary font-black shadow-2xl transition-all hover:-translate-y-3 rounded-[3rem] group p-8",
                          selectedCategory === category && "bg-primary text-white border-primary"
                        )}
                      >
                        <div className="p-5 bg-primary/5 rounded-[2rem] group-hover:bg-white/20 transition-all shadow-inner border border-white">
                          {category === 'Criminal' && <Scale className="h-10 w-10" />}
                          {category === 'Civil' && <FileText className="h-10 w-10" />}
                          {category === 'Labor' && <Briefcase className="h-10 w-10" />}
                          {category === 'Administrative' && <Globe className="h-10 w-10" />}
                          {category === 'Quasi-Judicial' && <Gavel className="h-10 w-10" />}
                        </div>
                        <span className="text-center text-xs uppercase tracking-widest leading-tight">{category}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-20">
                     <Card className="bg-amber-50/50 border-4 border-white rounded-[3.5rem] p-12 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-5">
                         <ShieldCheck className="h-48 w-48 text-amber-900" />
                       </div>
                       <div className="space-y-10 relative z-10">
                         <div className="text-center space-y-2">
                           <h3 className="text-2xl font-black text-amber-950 flex items-center justify-center gap-4">
                             <ShieldCheck className="h-8 w-8" /> Public Office Reminders
                           </h3>
                           <p className="text-amber-800/60 font-black uppercase tracking-[0.3em] text-[10px]">Standard Operating Guidelines</p>
                         </div>
                         <div className="grid md:grid-cols-2 gap-6">
                           {pAONotes.map((note, i) => (
                             <div key={i} className="flex gap-5 bg-white/80 p-6 rounded-[2rem] border border-amber-200/50 shadow-sm transition-all hover:bg-white">
                               <CheckCircle2 className="h-6 w-6 text-amber-600 shrink-0 mt-0.5" />
                               <span className="text-sm text-amber-950 font-bold leading-relaxed">{note}</span>
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading Navigator...</div>}>
      <CaseNavigatorContent />
    </Suspense>
  );
}
