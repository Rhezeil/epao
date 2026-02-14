"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Compass, HelpCircle, Search, ArrowLeft, X, CheckCircle2, FileText, Info, ListChecks, ArrowRight, CalendarCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { cn } from "@/lib/utils";

const criminalCaseCategories = [
  {
    title: "Crimes against Persons",
    items: ["Murder", "Homicide", "Physical Injury", "Assault", "Rape", "Sexual Harassment", "Violence Against Women and Children (VAWC)", "Kidnapping", "Abduction"]
  },
  {
    title: "Crimes against Property",
    items: ["Theft", "Robbery", "Arson", "Estafa / Fraud", "Embezzlement", "Malversation"]
  },
  {
    title: "Crimes against Public Order",
    items: ["Rebellion", "Sedition", "Resistance to Public Officials", "Illegal Possession of Firearms"]
  },
  {
    title: "Drug-related Offenses",
    items: ["Drug Possession", "Drug Trafficking", "Drug Use / Distribution"]
  },
  {
    title: "Special Criminal Cases",
    items: ["Cybercrime", "Human Trafficking", "White-Collar Crimes", "Juvenile Delinquency"]
  }
];

const civilCaseCategories = [
  {
    title: "Family Law",
    items: ["Annulment", "Legal Separation", "Divorce (for Muslims)", "Child Custody / Visitation", "Child Support / Alimony", "Adoption", "Paternity / Legitimacy Claims"]
  },
  {
    title: "Property / Real Estate",
    items: ["Land Disputes", "Boundary Disputes", "Eviction / Ejectment", "Condemnation / Expropriation"]
  },
  {
    title: "Contract / Business Disputes",
    items: ["Breach of Contract", "Non-Performance of Contract", "Sale / Lease Disputes", "Partnership / Corporation Disputes", "Loan / Debt Collection"]
  },
  {
    title: "Tort / Civil Wrongs",
    items: ["Personal Injury", "Medical Malpractice", "Defamation (Libel & Slander)", "Negligence", "Product Liability"]
  },
  {
    title: "Probate / Estate Cases",
    items: ["Estate Settlement", "Will Contests", "Inheritance Disputes", "Trust Administration"]
  }
];

const laborCaseCategories = [
  {
    title: "Labor Disputes",
    items: ["Wrongful Termination", "Non-payment of Wages", "Illegal Dismissal / Wrongful Termination", "Contract Violations"]
  },
  {
    title: "Workplace & Benefits",
    items: ["Workplace Injuries / Compensation Claims", "Benefits Disputes (SSS, PhilHealth, Pag-IBIG)"]
  },
  {
    title: "Union / Collective Bargaining",
    items: ["Union / Collective Bargaining Disputes"]
  }
];

const administrativeCaseCategories = [
  {
    title: "Government Dealings",
    items: ["Tax / Revenue Disputes", "Immigration / Deportation", "Licensing / Permit Issues", "Environmental / Regulatory Violations"]
  }
];

const constitutionalCaseCategories = [
  {
    title: "Rights & Writs",
    items: [
      "Civil Liberties",
      "Equality / Anti-Discrimination",
      "Separation of Powers",
      "Writ of Habeas Corpus",
      "Writ of Mandamus",
      "Writ of Amparo",
      "Writ of Kalikasan"
    ]
  }
];

const commercialCaseCategories = [
  {
    title: "Business Law",
    items: [
      "Corporate / Partnership Disputes",
      "Intellectual Property",
      "Bankruptcy / Insolvency",
      "Contracts / Trade Disputes"
    ]
  }
];

const specialCaseCategories = [
  {
    title: "Miscellaneous",
    items: [
      "Juvenile Cases",
      "Human Rights Cases",
      "Election Cases",
      "Online Scams / Cyberlaw",
      "Consumer Protection"
    ]
  }
];

const notarizationCaseCategories = [
  {
    title: "Legal Documents",
    items: [
      "Notarization",
      "Affidavits / Sworn Statements",
      "Powers of Attorney",
      "Deed of Sale / Transfer",
      "Contracts / Agreements",
      "Certification / Authentication"
    ]
  }
];

function CaseNavigatorContent() {
  const { role, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  const [mode, setMode] = useState<"explore" | "manage">("explore");
  const [refCode, setRefCode] = useState("");

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "manage") {
      setMode("manage");
    } else {
      setMode("explore");
    }
  }, [searchParams]);

  const categories = [
    "Criminal",
    "Civil",
    "Labor",
    "Administrative",
    "Constitutional",
    "Commercial",
    "Special/Other",
    "Notarization"
  ];

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setSelectedCase(null);
  };

  const handleCaseClick = (caseItem: string) => {
    setSelectedCase(caseItem);
    setSearchQuery(caseItem);
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

  const renderCaseDetails = (caseName: string) => (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button variant="ghost" size="sm" onClick={handleClear} className="flex items-center gap-1 text-muted-foreground">
          <X className="h-4 w-4" /> Clear
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Case Information */}
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
              <h2 className="text-3xl font-bold text-[#1A3B6B]">{caseName}</h2>
            </div>
            
            <div className="bg-[#E8F5E9] p-4 rounded-xl border border-green-200">
              <div className="flex gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-bold text-green-800 leading-tight">Under PAO Jurisdiction</p>
                  <p className="text-xs text-green-700 leading-snug">
                    You are eligible to seek assistance from the Public Attorney's Office for this type of case.
                  </p>
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-12 bg-primary hover:bg-[#1A3B6B] text-white font-bold rounded-xl flex items-center justify-center gap-2"
              onClick={() => router.push("/dashboard/client/book-appointment")}
            >
              <CalendarCheck className="h-5 w-5" />
              Book a Consultation
            </Button>
          </CardContent>
        </Card>

        {/* Initial Documents */}
        <Card className="border-none shadow-none bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <ListChecks className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg font-bold text-primary">Initial Documents</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">A general checklist of documents you may need to prepare.</p>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {[
              "Certificate of Indigency from DSWD",
              "Police blotter / complaint report",
              "Medico-legal certificate (for injuries or sexual assault)",
              "Witness information / affidavits",
              "Any prior related court orders"
            ].map((doc, idx) => (
              <div key={idx} className="flex gap-3 items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                <span className="text-sm text-[#2E5A99] font-medium leading-tight">{doc}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-none shadow-none bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Info className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-lg font-bold text-primary">Next Steps</CardTitle>
            </div>
            <p className="text-xs text-muted-foreground">A general guide to the legal process for this case type.</p>
          </CardHeader>
          <CardContent className="pt-4">
            <Accordion type="single" collapsible className="w-full space-y-2">
              {[
                { step: 1, title: "Prepare documents", content: "Collect all listed documents including your Certificate of Indigency and case-related papers." },
                { step: 2, title: "Visit PAO", content: "Go to your nearest PAO District Office with your prepared documents for initial assessment." },
                { step: 3, title: "Screening interview", content: "A screening officer will verify your indigency and the merit of your case." },
                { step: 4, title: "Lawyer assignment", content: "Once qualified, you will be assigned a Public Attorney to handle your legal matter." }
              ].map((step) => (
                <AccordionItem key={step.step} value={`step-${step.step}`} className="border rounded-xl bg-white px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-3 text-left">
                      <div className="h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {step.step}
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

  const renderCriminalView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedCategory(null)}
          className="p-0 h-8 w-8 text-primary hover:bg-primary/5"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold text-primary font-headline">Criminal Cases</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-8">
        {criminalCaseCategories.map((cat, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-sm font-bold text-primary">{cat.title}</h3>
            <ul className="space-y-1">
              {cat.items.map((item) => (
                <li 
                  key={item} 
                  onClick={() => handleCaseClick(item)}
                  className="text-xs text-[#2E5A99] cursor-pointer hover:underline hover:text-primary transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderCivilView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedCategory(null)}
          className="p-0 h-8 w-8 text-primary hover:bg-primary/5"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold text-primary font-headline">Civil Cases</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-8">
        {civilCaseCategories.map((cat, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-sm font-bold text-primary">{cat.title}</h3>
            <ul className="space-y-1">
              {cat.items.map((item) => (
                <li 
                  key={item} 
                  onClick={() => handleCaseClick(item)}
                  className="text-xs text-[#2E5A99] cursor-pointer hover:underline hover:text-primary transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderLaborView = () => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedCategory(null)}
          className="p-0 h-8 w-8 text-primary hover:bg-primary/5"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold text-primary font-headline">Labor Cases</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-8">
        {laborCaseCategories.map((cat, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-sm font-bold text-primary">{cat.title}</h3>
            <ul className="space-y-1">
              {cat.items.map((item) => (
                <li 
                  key={item} 
                  onClick={() => handleCaseClick(item)}
                  className="text-xs text-[#2E5A99] cursor-pointer hover:underline hover:text-primary transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSimpleCategoryView = (title: string, categoriesList: any[]) => (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setSelectedCategory(null)}
          className="p-0 h-8 w-8 text-primary hover:bg-primary/5"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold text-primary font-headline">{title}</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-8">
        {categoriesList.map((cat, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-sm font-bold text-primary">{cat.title}</h3>
            <ul className="space-y-1">
              {cat.items.map((item: string) => (
                <li 
                  key={item} 
                  onClick={() => handleCaseClick(item)}
                  className="text-xs text-[#2E5A99] cursor-pointer hover:underline hover:text-primary transition-colors"
                >
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
        <h2 className="text-3xl font-bold text-primary font-headline">Manage Your Appointment</h2>
        <p className="text-sm text-muted-foreground">
          Enter the reference code you received after booking to view, reschedule, or cancel your appointment.
        </p>
      </div>

      <Card className="border-none bg-white shadow-sm rounded-xl overflow-hidden">
        <CardContent className="p-8 space-y-6">
          <h3 className="text-xl font-bold text-primary">Find Your Appointment</h3>
          <div className="flex gap-2 bg-[#F0F4F8] p-1 rounded-lg border">
            <div className="flex-1">
              <Input 
                placeholder="Enter reference code (e.g., PAO-123456)" 
                className="h-12 border-none shadow-none focus-visible:ring-0 text-sm bg-transparent"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value)}
              />
            </div>
            <Button size="lg" className="bg-[#2E5A99] hover:bg-[#1A3B6B] text-white h-12 px-8 font-semibold">
              Search
            </Button>
          </div>
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
          <h1 className="text-xl font-bold font-headline text-primary tracking-tight">
            ePAO Case Requirements, Appointment, and Service Management
          </h1>
          <p className="text-sm text-muted-foreground leading-tight max-w-2xl mx-auto">
            Determine if your case is under PAO jurisdiction and book a consultation. 
            {!user && (
              <span className="ml-1 font-medium text-secondary">
                For existing cases, please log in to manage your appointments.
              </span>
            )}
          </p>
        </div>

        {/* Main Search Bar */}
        <div className="flex gap-2 max-w-4xl mx-auto bg-white p-1 rounded-lg border shadow-sm">
          <div className="flex-1">
            <Input 
              placeholder='e.g., "Murder", "Theft", "Annulment", "Child Support"...' 
              className="h-10 border-none shadow-none focus-visible:ring-0 text-sm italic text-muted-foreground"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button 
            size="sm" 
            onClick={handleSearch}
            className="bg-[#E67E22] hover:bg-[#D35400] text-white h-10 px-6 font-semibold flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>

        {/* Main Content Area */}
        <Card className="border-none bg-[#EBF2FA]/80 backdrop-blur-sm shadow-none rounded-xl overflow-hidden min-h-[450px]">
          <CardContent className="p-8">
            {selectedCase ? (
              renderCaseDetails(selectedCase)
            ) : mode === "manage" ? (
              renderManageAppointment()
            ) : selectedCategory === "Criminal" ? (
              renderCriminalView()
            ) : selectedCategory === "Civil" ? (
              renderCivilView()
            ) : selectedCategory === "Labor" ? (
              renderLaborView()
            ) : selectedCategory === "Administrative" ? (
              renderSimpleCategoryView("Administrative Cases", administrativeCaseCategories)
            ) : selectedCategory === "Constitutional" ? (
              renderSimpleCategoryView("Constitutional Cases", constitutionalCaseCategories)
            ) : selectedCategory === "Commercial" ? (
              renderSimpleCategoryView("Commercial Cases", commercialCaseCategories)
            ) : selectedCategory === "Special/Other" ? (
              renderSimpleCategoryView("Special/Other Cases", specialCaseCategories)
            ) : selectedCategory === "Notarization" ? (
              renderSimpleCategoryView("Notarization Cases", notarizationCaseCategories)
            ) : (
              <div className="space-y-8">
                {/* Category Selection */}
                <div className="space-y-4 max-w-4xl mx-auto">
                  <p className="text-sm text-primary font-medium opacity-80">
                    Or select a category to explore case types:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant="outline"
                        onClick={() => handleCategoryClick(category)}
                        className={cn(
                          "h-12 bg-[#DCE6F5] border-none text-primary font-bold text-sm hover:bg-[#CAD6E8] hover:text-primary transition-all shadow-sm justify-start px-4",
                          selectedCategory === category && "bg-[#CAD6E8] ring-1 ring-primary/20"
                        )}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Guidelines / Help Section */}
        <Card className="bg-muted/30 border-dashed border">
          <CardContent className="p-3">
            <div className="flex items-start gap-3">
              <HelpCircle className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <p className="text-xs text-muted-foreground leading-normal">
                  The ePAO system streamlines legal service access for underprivileged Filipinos. 
                  Pre-qualify here or visit your nearest PAO district office.
                </p>
                <div className="flex gap-3 text-[10px] font-medium">
                  <span className="px-2 py-1 bg-white rounded border">Mon-Fri, 8AM - 5PM</span>
                  <span className="px-2 py-1 bg-white rounded border">No fees for qualified indigents</span>
                </div>
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
