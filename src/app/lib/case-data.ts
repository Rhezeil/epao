/**
 * @fileOverview Shared case category data for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

export const generalRequirements = [
  "Valid Government ID",
  "Affidavit of Indigency",
  "Barangay Certificate of Indigency",
  "Proof of income / Certificate of No Income",
  "Community Tax Certificate (Cedula)"
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
        "VAWC (RA 9262)",
        "Illegal Detention / Kidnapping"
      ]
    },
    {
      title: "🟠 Crimes Against Property",
      items: [
        "Theft", 
        "Qualified Theft", 
        "Robbery (with violence / intimidation)", 
        "Robbery with Homicide", 
        "Estafa (Swindling)", 
        "Arson", 
        "Malicious Mischief"
      ]
    },
    {
      title: "🟡 Crimes Against Honor",
      items: ["Libel", "Slander (Oral Defamation)", "Incriminating an Innocent Person"]
    },
    {
      title: "🟢 Crimes Against Chastity",
      items: ["Acts of Lasciviousness", "Seduction", "Adultery", "Concubinage"]
    },
    {
      title: "🔵 Crimes Against Public Order",
      items: [
        "Rebellion or Insurrection (Art. 134)",
        "Coup d'état (Art. 134-A)",
        "Sedition (Art. 139)",
        "Direct Assaults (Art. 148)",
        "Resistance and Disobedience (Art. 151)",
        "Illegal Possession of Firearms"
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

export const drugCaseProcess = [
  { step: 1, title: "Inquest representation", content: "Immediate legal assistance during the inquest proceeding following arrest." },
  { step: 2, title: "Bail hearing", content: "Petition for bail if the offense is bailable or if evidence of guilt is not strong." },
  { step: 3, title: "Pre-trial", content: "Stipulation of facts and identification of issues." },
  { step: 4, title: "Trial", content: "Presentation of evidence and witnesses." },
  { step: 5, title: "Judgment", content: "Court's final decision on the case." }
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[] }> = {
  "Murder": { 
    requirements: [
      "If COMPLAINANT: Police blotter, Sworn Complaint-Affidavit, Medico-Legal Certificate, Hospital records, Death Certificate, Autopsy report, Photos of injuries, Witness affidavits",
      "If ACCUSED: Copy of Complaint/Information, Arrest warrant, Subpoena, Bail bond papers, Court notices",
      ...generalRequirements
    ], 
    steps: universalPaoFlow 
  },
  "Homicide": {
    requirements: [
      "If COMPLAINANT: Police blotter, Sworn Complaint-Affidavit, Medico-Legal Certificate, Hospital records, Death Certificate, Autopsy report, Witness affidavits",
      "If ACCUSED: Copy of Information, Arrest warrant, Subpoena, Bail documents",
      ...generalRequirements
    ],
    steps: universalPaoFlow
  },
  "Parricide": {
    requirements: [
      "Marriage Certificate (if spouse)",
      "Birth Certificate (if parent/child)",
      "Police blotter",
      "Sworn Affidavit",
      "Death Certificate",
      ...generalRequirements
    ],
    steps: universalPaoFlow
  },
  "Infanticide": {
    requirements: [
      "Birth Certificate of child",
      "Police report",
      "Medico-legal report (cause of death)",
      "Witness affidavits",
      ...generalRequirements
    ],
    steps: universalPaoFlow
  },
  "Physical Injuries (Serious, Less Serious, Slight)": {
    requirements: [
      "Medical Certificate",
      "Police blotter",
      "Photos of injuries",
      "Sworn Complaint-Affidavit",
      ...generalRequirements
    ],
    steps: universalPaoFlow
  },
  "VAWC (RA 9262)": {
    requirements: [
      "Police blotter",
      "Medical Certificate",
      "Screenshots of threats/messages",
      "Proof of relationship",
      "Birth certificate of child",
      "Barangay Protection Order (if any)",
      ...generalRequirements
    ],
    steps: universalPaoFlow
  },
  "Illegal Detention / Kidnapping": {
    requirements: [
      "Police blotter",
      "Sworn Complaint-Affidavit",
      "Witness affidavits",
      "Photos / Evidence of deprivation of liberty",
      "Arrest report (if involving public officer)",
      ...generalRequirements
    ],
    steps: universalPaoFlow
  },
  "Illegal Possession of Dangerous Drugs (Section 11)": {
    requirements: ["Arrest report", "Inventory of seized items", "Chemistry report", "Chain of custody documents", "Confiscation receipt", ...generalRequirements],
    steps: drugCaseProcess
  },
  "Annulment of Marriage": {
    requirements: ["PSA Marriage Certificate", "Birth certificates of children", "Psychological report (Art. 36)", "Proof of residency", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Illegal Dismissal": {
    requirements: ["Employment contract", "Payslips", "Termination letter", "Company ID", "Written explanation (if any)", ...generalRequirements],
    steps: [
      { step: 1, title: "Filing before NLRC", content: "Submission of the complaint to the National Labor Relations Commission." },
      { step: 2, title: "Conciliation", content: "Mandatory conference to explore settlement." },
      { step: 3, title: "Position papers", content: "Submission of sworn statements and evidence." },
      { step: 4, title: "Decision", content: "Labor Arbiter's ruling." }
    ]
  }
};

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Court Subpoena", "Arrest Record", "Copy of Complaint", ...generalRequirements], steps: universalPaoFlow },
  Civil: { requirements: ["Relevant contracts", "Demand letter", "Proof of claim", ...generalRequirements], steps: universalPaoFlow },
  Labor: { requirements: ["Employment records", "Payslips", "ID card", ...generalRequirements], steps: universalPaoFlow }
};

export const pAONotes = [
  "✔ PAO mainly handles criminal defense cases",
  "✔ Civil cases require Indigency + Merit Test",
  "✔ Some cases (like corporations, high-income clients) are NOT accepted",
  "✔ Court-appointed cases (Counsel de Oficio) are automatically handled"
];

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));
