/**
 * @fileOverview Shared case category data for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

export const caseCategories = {
  Criminal: [
    {
      title: "1️⃣ Crimes Under the Revised Penal Code",
      items: [
        "Murder", "Homicide", "Parricide", "Infanticide", 
        "Physical Injuries (Serious, Less Serious, Slight)",
        "Theft", "Qualified Theft", "Robbery (with violence / intimidation)", 
        "Robbery with Homicide", "Estafa (Swindling)", "Arson", "Malicious Mischief",
        "Libel", "Slander (Oral Defamation)", "Incriminating an Innocent Person",
        "Acts of Lasciviousness", "Seduction", "Concubinage", "Adultery",
        "Direct Assault", "Resistance and Disobedience", "Illegal Possession of Firearms"
      ]
    },
    {
      title: "2️⃣ Dangerous Drugs Cases (RA 9165)",
      items: [
        "Illegal Possession of Drugs", "Illegal Sale of Drugs", "Use of Dangerous Drugs", 
        "Drug Den Operations", "Possession of Drug Paraphernalia", "Drug Planting (as defense)"
      ]
    },
    {
      title: "3️⃣ Violence Against Women & Children (RA 9262)",
      items: ["Physical abuse", "Psychological abuse", "Economic abuse", "Protection Order cases"]
    },
    {
      title: "4️⃣ Child Protection Cases (RA 7610)",
      items: ["Child abuse", "Child exploitation", "Child trafficking"]
    },
    {
      title: "5️⃣ Anti-Rape Law (RA 8353)",
      items: ["Rape by sexual intercourse", "Rape by sexual assault"]
    },
    {
      title: "6️⃣ Cybercrime Cases (RA 10175)",
      items: ["Online libel", "Identity theft", "Online fraud", "Cybersex", "Computer-related fraud"]
    },
    {
      title: "7️⃣ Bouncing Checks Law (BP 22)",
      items: ["Issuance of bouncing checks"]
    }
  ],
  Civil: [
    {
      title: "1️⃣ Family Law Cases (Family Code)",
      items: [
        "Annulment of Marriage", "Declaration of Nullity of Marriage", 
        "Legal Separation", "Child Custody", "Child Support", 
        "Adoption (qualified cases)", "Recognition of Foreign Divorce"
      ]
    },
    {
      title: "2️⃣ Civil Code Cases (Civil Code)",
      items: ["Breach of Contract", "Collection of Sum of Money", "Damages", "Property Disputes", "Partition of Property"]
    },
    {
      title: "3️⃣ Ejectment Cases",
      items: ["Unlawful Detainer", "Forcible Entry"]
    },
    {
      title: "4️⃣ Small Claims (SC Rules)",
      items: ["Collection of small debts (below jurisdictional amount)"]
    }
  ],
  Labor: [
    {
      title: "1️⃣ Employment Disputes (Labor Code)",
      items: ["Illegal Dismissal", "Constructive Dismissal", "Non-payment of Wages", "Overtime Pay Claims", "Separation Pay", "13th Month Pay Claims", "Money Claims"]
    }
  ],
  "Special Legislation": [
    {
      title: "1️⃣ Anti-Trafficking in Persons (RA 9208)",
      items: ["Human trafficking", "Forced labor", "Sexual exploitation"]
    },
    {
      title: "2️⃣ Anti-Child Pornography (RA 9775)",
      items: ["Production/distribution of child pornography"]
    },
    {
      title: "3️⃣ Anti-Hazing Law (RA 11053)",
      items: ["Hazing incidents in fraternities"]
    },
    {
      title: "4️⃣ Anti-Illegal Recruitment",
      items: ["Illegal recruitment", "Recruitment scams"]
    },
    {
      title: "5️⃣ Juvenile Justice Cases (RA 9344)",
      items: ["Representation of children in conflict with the law"]
    }
  ],
  Administrative: [
    {
      title: "Quasi-Judicial & Administrative",
      items: ["Civil Service cases", "SSS / GSIS claims", "DARAB agrarian disputes", "PRC cases", "Barangay conciliation"]
    }
  ]
};

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const generalRequirements = [
  "Valid Government ID",
  "Affidavit of Indigency",
  "Barangay Certificate of Indigency",
  "Proof of income / Certificate of No Income",
  "Community Tax Certificate (Cedula)"
];

export const universalPaoFlow = [
  { step: 1, title: "Client Interview", content: "Initial consultation with a public attorney." },
  { step: 2, title: "Indigency Test", content: "Proof of financial status (low income/no property)." },
  { step: 3, title: "Merit Test", content: "Evaluation of the case's legal basis and chance of success." },
  { step: 4, title: "Document completion", content: "Submission of all required supporting evidence." },
  { step: 5, title: "Case acceptance", content: "Formal acceptance by PAO for legal representation." },
  { step: 6, title: "Case number assignment", content: "Recording the case in the official docket." },
  { step: 7, title: "Filing", content: "Filing before the proper court or agency (e.g., Prosecutor, MTC, NLRC)." },
  { step: 8, title: "Hearing/Trial", content: "Active representation during court or quasi-judicial proceedings." },
  { step: 9, title: "Decision", content: "Final judgment and legal resolution of the case." }
];

export const defaultRequirements = generalRequirements;
export const defaultSteps = universalPaoFlow;

export const pAONotes = [
  "✔ PAO mainly handles criminal defense cases",
  "✔ Civil cases require Indigency + Merit Test",
  "✔ Some cases (like corporations, high-income clients) are NOT accepted",
  "✔ Court-appointed cases (Counsel de Oficio) are automatically handled"
];

const criminalAccusedRequirements = [
  "Copy of Complaint / Information",
  "Arrest Warrant (if any)",
  "Subpoena (if under preliminary investigation)",
  "Bail documents (if applicable)",
  ...generalRequirements
];

const criminalComplainantRequirements = [
  "Police blotter",
  "Sworn Affidavit",
  "Medical certificate (if injury)",
  "Witness affidavits",
  "Photos / Evidence",
  ...generalRequirements
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[] }> = {
  // Criminal Cases (Revised Penal Code)
  "Murder": { requirements: criminalAccusedRequirements, steps: universalPaoFlow },
  "Theft": { requirements: criminalAccusedRequirements, steps: universalPaoFlow },
  "Robbery (with violence / intimidation)": { requirements: criminalAccusedRequirements, steps: universalPaoFlow },
  "Estafa (Swindling)": { requirements: criminalAccusedRequirements, steps: universalPaoFlow },
  "Libel": { requirements: criminalAccusedRequirements, steps: universalPaoFlow },
  
  // Drugs
  "Illegal Possession of Drugs": {
    requirements: ["Arrest report", "Chemistry report", "Confiscation receipt", "Charge sheet", ...generalRequirements],
    steps: universalPaoFlow
  },
  
  // VAWC
  "Physical abuse": {
    requirements: ["Police blotter", "Medical certificate", "Screenshots / messages", "Proof of relationship", "Birth certificate of child", ...generalRequirements],
    steps: universalPaoFlow
  },
  
  // Child Protection
  "Child abuse": {
    requirements: ["Sworn complaint", "Medical / social worker report", "Evidence of abuse", ...generalRequirements],
    steps: universalPaoFlow
  },
  
  // Rape
  "Rape by sexual intercourse": {
    requirements: ["Medico-legal certificate", "Police report", "Victim affidavit", ...generalRequirements],
    steps: universalPaoFlow
  },
  
  // Cybercrime
  "Online libel": {
    requirements: ["Screenshots", "URLs", "Digital evidence", "Police report", ...generalRequirements],
    steps: universalPaoFlow
  },
  
  // Bouncing Checks
  "Issuance of bouncing checks": {
    requirements: ["Dishonored check", "Bank return slip", "Written demand letter", "Proof of receipt of demand", ...generalRequirements],
    steps: universalPaoFlow
  },
  
  // Family Law
  "Annulment of Marriage": {
    requirements: ["PSA Marriage Certificate", "Birth Certificates of children", "Psychological report (if Art. 36)", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Child Support": {
    requirements: ["Birth certificate", "Proof of neglect", "Proof of income of parent", ...generalRequirements],
    steps: universalPaoFlow
  },
  
  // Civil Code
  "Collection of Sum of Money": {
    requirements: ["Contract", "Receipts", "Demand letter", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Unlawful Detainer": {
    requirements: ["Title / Tax Declaration", "Demand to vacate", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Collection of small debts (below jurisdictional amount)": {
    requirements: ["Contract / IOU", "Receipts", "Statement of claim form", ...generalRequirements],
    steps: universalPaoFlow
  },
  
  // Labor
  "Illegal Dismissal": {
    requirements: ["Employment contract", "Payslips", "Termination letter", "Company ID", ...generalRequirements],
    steps: universalPaoFlow
  },
  
  // Special Legislation
  "Human trafficking": {
    requirements: ["Receipts", "Contracts", "Witness statements", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Representation of children in conflict with the law": {
    requirements: ["Birth certificate (minor)", "Police report", ...generalRequirements],
    steps: universalPaoFlow
  },
  
  // Administrative
  "Civil Service cases": {
    requirements: ["Notice of charge", "Employment records", "Written Answer filing", ...generalRequirements],
    steps: universalPaoFlow
  },
  "SSS / GSIS claims": {
    requirements: ["Claim forms", "Contribution records", "Supporting medical docs", ...generalRequirements],
    steps: universalPaoFlow
  }
};

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: criminalAccusedRequirements, steps: universalPaoFlow },
  Civil: { requirements: ["Relevant contracts", "Demand letter", "Evidence", ...generalRequirements], steps: universalPaoFlow },
  Labor: { requirements: ["Employment records", "Termination notice", "Payslips", ...generalRequirements], steps: universalPaoFlow }
};
