/**
 * @fileOverview Shared case category data for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

export const generalRequirements = [
  "Valid Government ID",
  "Affidavit of Indigency",
  "Barangay Certificate of Indigency",
  "Proof of income / Certificate of No Income"
];

export const caseCategories = {
  "Criminal": [
    {
      title: "🔴 Crimes Against Persons",
      items: ["Murder", "Homicide", "Parricide", "Infanticide", "Physical Injuries"]
    },
    {
      title: "🟠 Crimes Against Property",
      items: ["Theft", "Robbery", "Estafa", "Arson", "Malicious Mischief"]
    },
    {
      title: "🟡 Crimes Against Honor",
      items: ["Libel", "Slander"]
    },
    {
      title: "🟢 Crimes Against Chastity",
      items: ["Acts of Lasciviousness", "Seduction", "Adultery", "Concubinage"]
    },
    {
      title: "🔵 Crimes Against Public Order",
      items: ["Direct Assault", "Illegal Possession of Firearms"]
    },
    {
      title: "2️⃣ Dangerous Drugs Cases (RA 9165)",
      items: ["Illegal Possession of Drugs", "Illegal Sale of Drugs", "Use of Dangerous Drugs"]
    },
    {
      title: "3️⃣ VAWC Cases (RA 9262)",
      items: ["Physical abuse", "Psychological abuse", "Economic abuse", "Protection Order"]
    },
    {
      title: "4️⃣ Child Protection (RA 7610)",
      items: ["Child abuse", "Child exploitation", "Child trafficking"]
    },
    {
      title: "5️⃣ Anti-Rape Law (RA 8353)",
      items: ["Rape by sexual intercourse", "Rape by sexual assault"]
    },
    {
      title: "6️⃣ Cybercrime (RA 10175)",
      items: ["Online libel", "Identity theft", "Online fraud"]
    },
    {
      title: "7️⃣ Bouncing Checks (BP 22)",
      items: ["Issuance of bouncing checks"]
    }
  ],
  "Civil": [
    {
      title: "📖 Family Law Cases",
      items: ["Annulment of Marriage", "Legal Separation", "Child Support", "Child Custody", "Adoption", "Recognition of Foreign Divorce"]
    },
    {
      title: "📖 Civil Code Cases",
      items: ["Collection of Sum of Money", "Breach of Contract", "Damages", "Property Disputes", "Partition of Property"]
    },
    {
      title: "📖 Ejectment & Small Claims",
      items: ["Unlawful Detainer", "Forcible Entry", "Small Claims"]
    }
  ],
  "Labor": [
    {
      title: "👷 Employment Disputes",
      items: ["Illegal Dismissal", "Non-payment of Wages", "13th Month / Separation Pay"]
    }
  ],
  "Special Legislation": [
    {
      title: "🏢 Special & Social Laws",
      items: ["Anti-Trafficking", "Anti-Child Pornography", "Anti-Hazing", "Anti-Illegal Recruitment", "Juvenile Justice Cases"]
    }
  ],
  "Administrative": [
    {
      title: "🏛 Quasi-Judicial",
      items: ["Civil Service Cases", "SSS / GSIS Claims", "DARAB agrarian disputes", "PRC cases", "Barangay conciliation"]
    }
  ]
};

export const universalPaoFlow = [
  { 
    step: 1, 
    title: "Application and Evaluation", 
    content: "The client visits the nearest PAO district office (often at the local Hall of Justice) to file a request for legal assistance." 
  },
  { 
    step: 2, 
    title: "Indigency Test", 
    content: "The applicant must prove they are indigent. This generally means having a low income and owning no significant real property. Required documents include Affidavit of Indigency, Certificate of Income, or ITR." 
  },
  { 
    step: 3, 
    title: "Merit Test", 
    content: "A PAO lawyer assesses if the case has merit—meaning it has a chance of success and is not intended merely to harass the opposite party.\n\n- Criminal Defense: Generally considered meritorious.\n- Civil/Other: Evaluated based on law and evidence." 
  },
  { 
    step: 4, 
    title: "Conflict of Interest Check", 
    content: "The PAO verifies that they do not already represent the opposing party to avoid conflicts of interest." 
  },
  { 
    step: 5, 
    title: "Acceptance", 
    content: "If the applicant passes both tests, the lawyer will formally accept the case and provide representation, counseling, or document drafting." 
  }
];

export const defaultRequirements = generalRequirements;
export const defaultSteps = universalPaoFlow;

export const caseSpecificData: Record<string, { requirements: string[], steps: any[] }> = {
  // --- Criminal: Accused Context ---
  "Murder": { 
    requirements: ["Copy of Complaint/Information", "Arrest warrant", "Subpoena", "Bail bond papers", ...generalRequirements], 
    steps: universalPaoFlow 
  },
  "Theft": { 
    requirements: ["Police report", "Affidavit of loss", "Proof of ownership (receipts, OR/CR)", "CCTV footage (if any)", ...generalRequirements], 
    steps: universalPaoFlow 
  },
  "Estafa": { 
    requirements: ["Contract or agreement", "Promissory note", "Receipts", "Demand letter with proof of receipt", "Screenshots (SMS/Chat)", ...generalRequirements], 
    steps: universalPaoFlow 
  },
  "Libel": { 
    requirements: ["Copy of defamatory statement", "Newspaper clipping / screenshot", "Certification of publication", ...generalRequirements], 
    steps: universalPaoFlow 
  },
  "VAWC": { 
    requirements: ["Police blotter", "Sworn affidavit", "Marriage certificate / Proof of relationship", "Birth certificate of child", "Medical certificate", "Screenshots of threats", ...generalRequirements], 
    steps: universalPaoFlow 
  },
  "Illegal Possession of Drugs": {
    requirements: ["Arrest report", "Inventory of seized items", "Chemistry report", "Chain of custody documents", "Confiscation receipt", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Annulment of Marriage": {
    requirements: ["PSA Marriage Certificate", "Birth certificates of children", "Psychological report (Art. 36)", "Proof of residency", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Child Support": {
    requirements: ["Birth certificate", "Proof of relationship", "Proof of financial capacity of parent", "Demand letter for support", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Collection of Sum of Money": {
    requirements: ["Written contract", "Promissory note", "Receipts", "Demand letter", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Illegal Dismissal": {
    requirements: ["Employment contract", "Payslips", "Termination letter", "Company ID", "Written explanation (if any)", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Anti-Trafficking": {
    requirements: ["Recruitment contract", "Receipts", "Travel documents", "Witness affidavit", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Juvenile Justice Cases": {
    requirements: ["Birth certificate (minor)", "Police report", "Social worker report", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Civil Service Cases": {
    requirements: ["Notice of charge", "Employment records", "Written explanation", ...generalRequirements],
    steps: universalPaoFlow
  }
};

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Court Subpoena", "Arrest Record", ...generalRequirements], steps: universalPaoFlow },
  Civil: { requirements: ["Relevant contracts", "Demand letter", ...generalRequirements], steps: universalPaoFlow },
  Labor: { requirements: ["Employment records", "Payslips", ...generalRequirements], steps: universalPaoFlow }
};

export const pAONotes = [
  "✔ PAO mainly handles criminal defense cases",
  "✔ Civil cases require Indigency + Merit Test",
  "✔ Some cases (like corporations, high-income clients) are NOT accepted",
  "✔ Court-appointed cases (Counsel de Oficio) are automatically handled"
];

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));
