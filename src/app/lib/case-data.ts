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
      items: [
        "Murder", 
        "Homicide", 
        "Parricide", 
        "Infanticide", 
        "Physical Injuries (Serious, Less Serious, Slight)",
        "Violence Against Women and Children (VAWC)",
        "Illegal Detention/Kidnapping"
      ]
    },
    {
      title: "🟠 Crimes Against Property (RPC)",
      items: [
        "Robbery (Arts. 294-305)",
        "Brigandage (Arts. 306-307)",
        "Theft (Arts. 308-311)",
        "Usurpation (Arts. 312-313)",
        "Fraudulent Insolvency (Art. 314)",
        "Swindling and Estafa (Arts. 315-318)",
        "Removal, Sale, or Pledge of Mortgaged Property",
        "Arson and Destruction (Arts. 320-326)",
        "Malicious Mischief (Arts. 327-331)"
      ]
    },
    {
      title: "📦 Crimes Against Property (Special Laws)",
      items: [
        "Anti-Fencing Law (PD 1612)",
        "Anti-Cattle Rustling Law (PD 533)",
        "New Anti-Carnapping Act (RA 10883)",
        "Bouncing Checks Law (BP 22)",
        "Trust Receipts Law (PD 115)",
        "Anti-Electricity Pilferage (RA 7832)",
        "Anti-Cable/Internet Tapping (RA 10515)",
        "Anti-Agricultural Smuggling (RA 10845)",
        "Timber Smuggling (PD 330/705)",
        "Illegal Fishing (RA 8550)",
        "Unauthorized Water/Phone Install (PD 401)"
      ]
    },
    {
      title: "🔵 Crimes Against Public Order",
      items: [
        "Rebellion or Insurrection (Art. 134)",
        "Coup d'état (Art. 134-A)",
        "Sedition (Art. 139)",
        "Direct Assaults (Art. 148)",
        "Resistance and Disobedience (Art. 151)",
        "Alarms and Scandals",
        "Evasion of Service of Sentence"
      ]
    },
    {
      title: "2️⃣ Dangerous Drugs Cases (RA 9165)",
      items: [
        "Illegal Possession of Dangerous Drugs (Section 11)",
        "Illegal Sale, Trading, etc. (Section 5)",
        "Possession of Paraphernalia (Section 12)",
        "Use of Dangerous Drugs (Section 15)",
        "Cultivation of Marijuana (Section 16)"
      ]
    },
    {
      title: "3️⃣ Cybercrime & Special Laws",
      items: ["Online Libel", "Identity Theft", "Bouncing Checks (BP 22)"]
    }
  ],
  "Civil": [
    {
      title: "📖 Family Law Cases",
      items: ["Annulment of Marriage", "Declaration of Nullity", "Legal Separation", "Child Custody", "Child Support", "Adoption"]
    },
    {
      title: "📖 Civil Code Cases",
      items: ["Collection of Sum of Money", "Breach of Contract", "Damages", "Property Disputes", "Partition of Property"]
    },
    {
      title: "📖 Land & Ejectment",
      items: ["Unlawful Detainer", "Forcible Entry", "Small Claims"]
    }
  ],
  "Labor": [
    {
      title: "👷 Employment Disputes",
      items: ["Illegal Dismissal", "Non-payment of Wages", "Overtime Pay Claims", "Separation Pay", "13th Month Pay"]
    }
  ],
  "Special Legislation": [
    {
      title: "🏢 Social & Special Laws",
      items: ["Anti-Trafficking", "Anti-Child Pornography", "Anti-Hazing", "Anti-Illegal Recruitment", "Juvenile Justice"]
    }
  ],
  "Administrative": [
    {
      title: "🏛 Quasi-Judicial",
      items: ["Civil Service Cases", "SSS / GSIS Claims", "DARAB Cases", "PRC Cases", "Barangay Conciliation"]
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
    content: "The applicant must prove they are indigent. This generally means having a low income (set thresholds apply depending on location, e.g., Metro Manila vs. other areas) and owning no significant real property. Required documents may include an Affidavit of Indigency, Certificate of Income, or Income Tax Return." 
  },
  { 
    step: 3, 
    title: "Merit Test", 
    content: "A PAO lawyer assesses if the case has merit—meaning it has a chance of success and is not intended merely to harass the opposite party.\n\nCriminal Defense: Cases for the accused are generally considered meritorious.\nCivil/Other Cases: Evaluated based on law and evidence." 
  },
  { 
    step: 4, 
    title: "Conflict of Interest Check", 
    content: "The PAO verifies that they do not already represent the opposing party to avoid conflicts of interest." 
  },
  { 
    step: 5, 
    title: "Acceptance", 
    content: "If the applicant passes both tests, the lawyer will formally accept the case and provide legal representation, counseling, or document drafting (e.g., affidavits, complaints)." 
  }
];

export const defaultRequirements = generalRequirements;
export const defaultSteps = universalPaoFlow;

export const caseSpecificData: Record<string, { requirements: string[], steps: any[] }> = {
  "Murder": { 
    requirements: [
      "If COMPLAINANT: Police blotter, Sworn Complaint-Affidavit, Medico-Legal Certificate, Hospital records, Death Certificate, Autopsy report, Photos of injuries, Witness affidavits",
      "If ACCUSED: Copy of Complaint/Information, Arrest warrant, Subpoena, Bail bond papers, Court notices"
    ], 
    steps: universalPaoFlow 
  },
  "Homicide": {
    requirements: [
      "If COMPLAINANT: Police blotter, Sworn Complaint-Affidavit, Medico-Legal Certificate, Hospital records, Death Certificate, Autopsy report, Witness affidavits",
      "If ACCUSED: Copy of Information, Arrest warrant, Subpoena, Bail documents"
    ],
    steps: universalPaoFlow
  },
  "Parricide": {
    requirements: [
      "Marriage Certificate (if spouse)",
      "Birth Certificate (if parent/child)",
      "Police blotter",
      "Sworn Affidavit",
      "Death Certificate"
    ],
    steps: universalPaoFlow
  },
  "Infanticide": {
    requirements: [
      "Birth Certificate of child less than 72 hours old",
      "Police report",
      "Medico-legal report (cause of death)",
      "Witness affidavits"
    ],
    steps: universalPaoFlow
  },
  "Physical Injuries (Serious, Less Serious, Slight)": {
    requirements: [
      "Medical Certificate",
      "Police blotter",
      "Photos of injuries",
      "Sworn Complaint-Affidavit"
    ],
    steps: universalPaoFlow
  },
  "Violence Against Women and Children (VAWC)": {
    requirements: [
      "Police blotter",
      "Medical Certificate",
      "Screenshots of threats/messages",
      "Proof of relationship",
      "Birth certificate of child",
      "Barangay Protection Order (if any)"
    ],
    steps: universalPaoFlow
  },
  "Illegal Detention/Kidnapping": {
    requirements: [
      "Police blotter",
      "Sworn Complaint-Affidavit",
      "Witness affidavits",
      "Photos / Evidence of deprivation of liberty",
      "Arrest report (if involving public officer)"
    ],
    steps: universalPaoFlow
  },
  "Theft (Arts. 308-311)": {
    requirements: [
      "Police report",
      "Affidavit of loss",
      "Proof of ownership (receipts, title, OR/CR)",
      "CCTV footage (if available)",
      "Witness affidavits"
    ],
    steps: universalPaoFlow
  },
  "Robbery (Arts. 294-305)": {
    requirements: [
      "Police report",
      "Proof of ownership (receipts, title, OR/CR)",
      "Medical certificate (if with violence)",
      "CCTV footage (if available)",
      "Witness affidavits"
    ],
    steps: universalPaoFlow
  },
  "Swindling and Estafa (Arts. 315-318)": {
    requirements: [
      "Contract or agreement",
      "Promissory note",
      "Receipts",
      "Proof of payment",
      "Demand letter with proof of receipt",
      "Messages (SMS/chat screenshots)"
    ],
    steps: universalPaoFlow
  },
  "Illegal Possession of Dangerous Drugs (Section 11)": {
    requirements: ["Arrest report", "Inventory of seized items", "Chemistry report", "Chain of custody documents", "Confiscation receipt"],
    steps: universalPaoFlow
  },
  "Annulment of Marriage": {
    requirements: ["PSA Marriage Certificate", "Birth certificates of children", "Psychological report (Art. 36)", "Proof of residency"],
    steps: universalPaoFlow
  },
  "Illegal Dismissal": {
    requirements: ["Employment contract", "Payslips", "Termination letter", "Company ID", "Written explanation (if any)"],
    steps: [
      { step: 1, title: "Filing before NLRC", content: "Submission of the complaint to the National Labor Relations Commission." },
      { step: 2, title: "Conciliation", content: "Mandatory conference to explore settlement." },
      { step: 3, title: "Position papers", content: "Submission of sworn statements and evidence." },
      { step: 4, title: "Decision", content: "Labor Arbiter's ruling." }
    ]
  },
  "Bouncing Checks Law (BP 22)": {
    requirements: [
      "Original dishonored check",
      "Bank return slip (insufficient funds)",
      "Written demand letter",
      "Proof of receipt of demand letter"
    ],
    steps: universalPaoFlow
  }
};

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Court Subpoena", "Arrest Record", "Copy of Complaint"], steps: universalPaoFlow },
  Civil: { requirements: ["Relevant contracts", "Demand letter", "Proof of claim"], steps: universalPaoFlow },
  Labor: { requirements: ["Employment records", "Payslips", "ID card"], steps: universalPaoFlow }
};

export const pAONotes = [
  "✔ PAO mainly handles criminal defense cases",
  "✔ Civil cases require Indigency + Merit Test",
  "✔ Some cases (like corporations, high-income clients) are NOT accepted",
  "✔ Court-appointed cases (Counsel de Oficio) are automatically handled"
];

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));
