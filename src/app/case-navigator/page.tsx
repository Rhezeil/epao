
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Compass, HelpCircle, Search, ArrowLeft, X, CheckCircle2, FileText, Info, ListChecks, CalendarCheck, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";
import { useFirestore, useDoc, useMemoFirebase, useCollection } from "@/firebase";
import { doc, collection, query, where, limit } from "firebase/firestore";
import { caseCategories, defaultRequirements, defaultSteps, categoryDefaults } from "@/app/lib/case-data";
import { Badge } from "@/components/ui/badge";

function CaseNavigatorContent() {
  const { role, user } = useAuth();
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
      setSelectedCase(searchQuery);
    }
  };

  const handleClear = () => {
    setSelectedCase(null);
    setSearchQuery("");
  };

  const getFallbackRequirements = () => {
    if (selectedCategory && categoryDefaults[selectedCategory]) {
      return categoryDefaults[selectedCategory].requirements;
    }
    return defaultRequirements;
  };

  const getFallbackSteps = () => {
    if (selectedCategory && categoryDefaults[selectedCategory]) {
      return categoryDefaults[selectedCategory].steps;
    }
    return defaultSteps;
  };

  const renderCaseDetails = (caseName: string) => (
    <div className="space-y-6">
      <div className="flex justify-end">
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
            <p className="text-xs text-muted-foreground">Details for the selected case type.</p>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            <div className="space-y-1">
              <p className="text-xs font-bold text-primary uppercase">Case Type</p>
              <h2 className="text-2xl font-bold text-[#1A3B6B]">{caseName}</h2>
              {selectedCategory && <Badge variant="secondary" className="mt-1">{selectedCategory} Case</Badge>}
            </div>
            
            <div className="bg-[#E8F5E9] p-4 rounded-xl border border-green-200">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-green-800 leading-tight">PAO Assistance Available</p>
                  <p className="text-xs text-green-700 leading-snug">
                    Indigent Filipinos are eligible for legal representation in this case type.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-12 bg-primary hover:bg-[#1A3B6B] text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
              onClick={() => router.push(`/dashboard/client/book-appointment?caseType=${encodeURIComponent(caseName)}&category=${encodeURIComponent(selectedCategory || 'General')}`)}
            >
              <CalendarCheck className="h-5 w-5" />
              Book a Consultation
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
            <p className="text-xs text-muted-foreground">Standard checklist for this category.</p>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {isReqLoading ? (
              <div className="flex justify-center py-4"><Loader2 className="animate-spin h-5 w-5 text-primary" /></div>
            ) : (
              (dynamicReqs?.requirements || getFallbackRequirements()).map((doc: string, idx: number) => (
                <div key={idx} className="flex gap-3 items-start">
                  <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm text-[#2E5A99] font-medium leading-tight">{doc}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-none shadow-none bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg font-bold text-primary">Process Flow</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">What to expect at the PAO office.</p>
          </CardHeader>
          <CardContent className="pt-4">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {(dynamicReqs?.steps || getFallbackSteps()).map((step: any, idx: number) => (
                <AccordionItem key={idx} value={`step-${idx}`} className="border rounded-xl bg-white px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <div className="h-6 w-6 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {step.step || idx + 1}
                      </div>
                      <span className="text-sm font-bold text-primary">{step.title}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-xs text-muted-foreground pb-4 leading-relaxed">
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

  const renderCategoryListView = (title: string, data: any[]) => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)} className="p-0 h-8 w-8 text-primary">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold text-primary font-headline">{title} Law Cases</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {data.map((cat, idx) => (
          <div key={idx} className="space-y-3 p-4 bg-white/40 rounded-xl border border-white/50">
            <h3 className="text-sm font-black text-primary uppercase tracking-wider">{cat.title}</h3>
            <ul className="space-y-2">
              {cat.items.map((item: string) => (
                <li 
                  key={item} 
                  onClick={() => handleCaseClick(item, title)} 
                  className="text-sm text-[#2E5A99] cursor-pointer hover:bg-primary/5 p-2 rounded-md flex items-center gap-2 transition-colors"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/40" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderManageAppointment = () => (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-primary font-headline">Manage Appointment</h2>
        <p className="text-sm text-muted-foreground">
          Enter your reference code to view or update your schedule.
        </p>
      </div>

      <Card className="border-none bg-white shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <div className="flex gap-2 bg-[#F0F4F8] p-1 rounded-lg border">
            <div className="flex-1">
              <Input 
                placeholder="Reference Code (e.g., PAO-123456)" 
                className="h-12 border-none shadow-none focus-visible:ring-0 text-sm bg-transparent"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value.toUpperCase())}
              />
            </div>
            <Button size="lg" disabled={isSearching} className="bg-[#2E5A99] hover:bg-[#1A3B6B] text-white h-12 px-8 font-semibold">
              {isSearching ? <Loader2 className="animate-spin h-5 w-5" /> : "Search"}
            </Button>
          </div>

          {appointmentFound && appointmentFound.length > 0 && (
            <div className="mt-8 p-6 bg-[#E8F5E9] rounded-xl border border-green-200 animate-in fade-in slide-in-from-top-2">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="text-lg font-bold text-green-900">Record Located</h4>
                  <p className="text-sm text-green-800">Reference: {appointmentFound[0].referenceCode}</p>
                </div>
                <Badge className="bg-green-600">{appointmentFound[0].status}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-green-700 font-bold uppercase">Service Requested</p>
                  <p className="text-green-900 font-medium">{appointmentFound[0].caseType}</p>
                </div>
                <div>
                  <p className="text-xs text-green-700 font-bold uppercase">Scheduled Date</p>
                  <p className="text-green-900 font-medium">
                    {new Date(appointmentFound[0].date).toLocaleDateString()}
                  </p>
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
      <div className="max-w-6xl mx-auto space-y-4 py-2 px-4">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-1">
            <Compass className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-2xl font-black font-headline text-primary tracking-tight">
            ePAO Case Requirements & Navigator
          </h1>
          <p className="text-sm text-muted-foreground leading-tight max-w-2xl mx-auto">
            Find the legal requirements for your specific case and book a PAO consultation.
          </p>
        </div>

        <div className="flex gap-2 max-w-4xl mx-auto bg-white p-1 rounded-lg border shadow-lg">
          <div className="flex-1">
            <Input 
              placeholder='Search case (e.g., "Murder", "Labor Dispute", "Annulment")...' 
              className="h-10 border-none shadow-none focus-visible:ring-0 text-sm italic"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button size="sm" onClick={handleSearch} className="bg-[#E67E22] hover:bg-[#D35400] text-white h-10 px-6 font-semibold flex items-center gap-2">
            <Search className="h-4 w-4" />
            Find Requirements
          </Button>
        </div>

        <Card className="border-none bg-[#EBF2FA]/80 backdrop-blur-sm shadow-none rounded-xl overflow-hidden min-h-[500px]">
          <CardContent className="p-8">
            {selectedCase ? renderCaseDetails(selectedCase) : mode === "manage" ? renderManageAppointment() : (
              <div className="space-y-8">
                {selectedCategory ? (
                  renderCategoryListView(selectedCategory, caseCategories[selectedCategory as keyof typeof caseCategories])
                ) : (
                  <div className="space-y-6 max-w-4xl mx-auto">
                    <p className="text-sm text-primary font-bold opacity-80 uppercase tracking-widest text-center">Select Case Category</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {categories.map((category) => (
                        <Button
                          key={category}
                          variant="outline"
                          onClick={() => handleCategoryClick(category)}
                          className={cn(
                            "h-16 bg-white border-none text-primary font-black text-sm hover:bg-primary/5 shadow-sm transition-all hover:scale-105",
                            selectedCategory === category && "bg-primary text-white hover:bg-primary"
                          )}
                        >
                          {category}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-dashed border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 space-y-1">
                <p className="text-xs text-primary font-bold">Public Attorney's Office (PAO) Jurisdiction</p>
                <p className="text-xs text-muted-foreground leading-normal">
                  PAO primarily provides free legal assistance to indigent persons in criminal, civil, labor, administrative, 
                  and other quasi-judicial cases. Qualification is determined by an income test and a merit test.
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
