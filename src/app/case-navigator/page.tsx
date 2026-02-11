
"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { useAuth } from "@/components/auth-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Compass, HelpCircle, Search, ArrowLeft, CalendarCheck } from "lucide-react";
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
  };

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
        <div className="space-y-6 col-span-1">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-primary">Crimes against Persons</h3>
            <ul className="space-y-1">
              {criminalCaseCategories[0].items.map((item) => (
                <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-primary">Special Criminal Cases</h3>
            <ul className="space-y-1">
              {criminalCaseCategories[4].items.map((item) => (
                <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-2 col-span-1">
          <h3 className="text-sm font-bold text-primary">Crimes against Property</h3>
          <ul className="space-y-1">
            {criminalCaseCategories[1].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 col-span-1">
          <h3 className="text-sm font-bold text-primary">Crimes against Public Order</h3>
          <ul className="space-y-1">
            {criminalCaseCategories[2].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 col-span-1">
          <h3 className="text-sm font-bold text-primary">Drug-related Offenses</h3>
          <ul className="space-y-1">
            {criminalCaseCategories[3].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>
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
        <div className="space-y-6 col-span-1">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-primary">Family Law</h3>
            <ul className="space-y-1">
              {civilCaseCategories[0].items.map((item) => (
                <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-primary">Probate / Estate Cases</h3>
            <ul className="space-y-1">
              {civilCaseCategories[4].items.map((item) => (
                <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-2 col-span-1">
          <h3 className="text-sm font-bold text-primary">Property / Real Estate</h3>
          <ul className="space-y-1">
            {civilCaseCategories[1].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 col-span-1">
          <h3 className="text-sm font-bold text-primary">Contract / Business Disputes</h3>
          <ul className="space-y-1">
            {civilCaseCategories[2].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 col-span-1">
          <h3 className="text-sm font-bold text-primary">Tort / Civil Wrongs</h3>
          <ul className="space-y-1">
            {civilCaseCategories[3].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>
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
        <div className="space-y-2 col-span-1">
          <h3 className="text-sm font-bold text-primary">Labor Disputes</h3>
          <ul className="space-y-1">
            {laborCaseCategories[0].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 col-span-1">
          <h3 className="text-sm font-bold text-primary">Workplace & Benefits</h3>
          <ul className="space-y-1">
            {laborCaseCategories[1].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>

        <div className="space-y-2 col-span-1">
          <h3 className="text-sm font-bold text-primary">Union / Collective Bargaining</h3>
          <ul className="space-y-1">
            {laborCaseCategories[2].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderAdministrativeView = () => (
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
        <h2 className="text-xl font-bold text-primary font-headline">Administrative Cases</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-8">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-primary">Government Dealings</h3>
          <ul className="space-y-1">
            {administrativeCaseCategories[0].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderConstitutionalView = () => (
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
        <h2 className="text-xl font-bold text-primary font-headline">Constitutional Cases</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-8">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-primary">Rights & Writs</h3>
          <ul className="space-y-1">
            {constitutionalCaseCategories[0].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderCommercialView = () => (
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
        <h2 className="text-xl font-bold text-primary font-headline">Commercial Cases</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-8">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-primary">Business Law</h3>
          <ul className="space-y-1">
            {commercialCaseCategories[0].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderSpecialView = () => (
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
        <h2 className="text-xl font-bold text-primary font-headline">Special/Other Cases</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-8">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-primary">Miscellaneous</h3>
          <ul className="space-y-1">
            {specialCaseCategories[0].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );

  const renderNotarizationView = () => (
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
        <h2 className="text-xl font-bold text-primary font-headline">Notarization Cases</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-x-8 gap-y-8">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-primary">Legal Documents</h3>
          <ul className="space-y-1">
            {notarizationCaseCategories[0].items.map((item) => (
              <li key={item} className="text-xs text-[#2E5A99] cursor-pointer hover:underline">{item}</li>
            ))}
          </ul>
        </div>
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
                Log in for existing cases.
              </span>
            )}
          </p>
          {!user && (
            <div className="flex justify-center gap-2 pt-2">
              <Button onClick={() => router.push("/login")} size="sm" className="bg-primary px-4 h-8">
                Login
              </Button>
              <Button onClick={() => router.push("/register")} size="sm" variant="outline" className="px-4 h-8 border-primary text-primary">
                Register
              </Button>
            </div>
          )}
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex justify-center gap-4 mb-2">
          <Button 
            variant={mode === "explore" ? "default" : "ghost"}
            onClick={() => {
              setMode("explore");
              router.push("/case-navigator");
            }}
            className={cn("h-9 rounded-full px-6", mode === "explore" ? "bg-primary" : "text-primary hover:bg-primary/5")}
          >
            Explore Cases
          </Button>
          <Button 
            variant={mode === "manage" ? "default" : "ghost"}
            onClick={() => {
              setMode("manage");
              router.push("/case-navigator?mode=manage");
            }}
            className={cn("h-9 rounded-full px-6 flex items-center gap-2", mode === "manage" ? "bg-primary" : "text-primary hover:bg-primary/5")}
          >
            <CalendarCheck className="h-4 w-4" />
            Manage Appointment
          </Button>
        </div>

        {/* Main Content Area */}
        <Card className="border-none bg-[#EBF2FA] shadow-none rounded-xl overflow-hidden min-h-[450px]">
          <CardContent className="p-8">
            {mode === "manage" ? (
              renderManageAppointment()
            ) : selectedCategory === "Criminal" ? (
              renderCriminalView()
            ) : selectedCategory === "Civil" ? (
              renderCivilView()
            ) : selectedCategory === "Labor" ? (
              renderLaborView()
            ) : selectedCategory === "Administrative" ? (
              renderAdministrativeView()
            ) : selectedCategory === "Constitutional" ? (
              renderConstitutionalView()
            ) : selectedCategory === "Commercial" ? (
              renderCommercialView()
            ) : selectedCategory === "Special/Other" ? (
              renderSpecialView()
            ) : selectedCategory === "Notarization" ? (
              renderNotarizationView()
            ) : (
              <div className="space-y-8">
                {/* Search Bar */}
                <div className="flex gap-2 max-w-4xl mx-auto bg-white p-1 rounded-lg border shadow-sm">
                  <div className="flex-1">
                    <Input 
                      placeholder='e.g., "Theft", "Annulment", "Child Support"...' 
                      className="h-10 border-none shadow-none focus-visible:ring-0 text-sm italic text-muted-foreground"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <Button size="sm" className="bg-[#E67E22] hover:bg-[#D35400] text-white h-10 px-6 font-semibold flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>

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
