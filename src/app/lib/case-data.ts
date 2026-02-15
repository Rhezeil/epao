/**
 * @fileOverview Shared case category data for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

export const caseCategories = {
  Criminal: [
    {
      title: "1️⃣ Crimes Under the Revised Penal Code (Act No. 3815)",
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
  "Proof of Income (Payslip / Cert of No Income / DSWD Cert)",
  "Community Tax Certificate (Cedula)",
  "All relevant evidence (contracts, receipts, police reports, etc.)",
  "Demand letter (if required)",
  "Subpoena / Court Notice (if already filed)"
];

export const universalPaoFlow = [
  { step: 1, title: "Client Interview", content: "Initial consultation with a public attorney to gather facts." },
  { step: 2, title: "Indigency Test", content: "Verification of financial status to qualify for free assistance." },
  { step: 3, title: "Merit Test", content: "Legal evaluation to ensure the case has basis and isn't frivolous." },
  { step: 4, title: "Document Completion", content: "Submission of all required forms and supporting evidence." },
  { step: 5, title: "Case Acceptance", content: "Formal approval of the case by the District Head or lawyer." },
  { step: 6, title: "Case Number Assignment", content: "The case is officially logged into the PAO monitoring system." },
  { step: 7, title: "Filing Before Proper Body", content: "Submitting the complaint/petition to the Prosecutor, Court, or Agency." },
  { step: 8, title: "Hearing / Trial", content: "Legal representation during mediation, conferences, and court trials." },
  { step: 9, title: "Decision", content: "Receiving the official judgment or resolution from the court/agency." }
];

export const defaultRequirements = generalRequirements;
export const defaultSteps = universalPaoFlow;

export const pAONotes = [
  "✔ PAO mainly handles criminal defense cases",
  "✔ Civil cases require Indigency + Merit Test",
  "✔ Some cases (like corporations, high-income clients) are NOT accepted",
  "✔ Court-appointed cases (Counsel de Oficio) are automatically handled"
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[] }> = {
  "Murder": {
    requirements: [
      "If ACCUSED: Copy of Complaint, Arrest Warrant, Subpoena, Bail Documents",
      "If COMPLAINANT: Police Blotter, Sworn Affidavit, Medico-Legal, Witness Affidavits",
      "Valid ID & Indigency Documents"
    ],
    steps: universalPaoFlow
  },
  "Illegal Dismissal": {
    requirements: ["Employment Contract", "Latest Payslips", "Termination Letter", "Company ID", "Notice to Explain (if any)"],
    steps: [
      { step: 1, title: "Filing before NLRC", content: "Submitting the initial complaint (SENA)." },
      { step: 2, title: "Conciliation", content: "Mandatory meetings to try and reach a settlement." },
      { step: 3, title: "Position Papers", content: "Drafting and submitting evidence." },
      { step: 4, title: "Decision", content: "Judgment by the Labor Arbiter." }
    ]
  },
  "Annulment of Marriage": {
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates of children", "Psychological Evaluation Report (Client shoulders cost)", "IDs", "Affidavit of Indigency"],
    steps: [
      { step: 1, title: "Case Evaluation", content: "Strict merit test for Article 36 or other legal grounds." },
      { step: 2, title: "Psychological Assessment", content: "Client undergoes clinical evaluation." },
      { step: 3, title: "Filing Petition", content: "Submitting to Family Court." },
      { step: 4, title: "Trial", content: "Presentation of witnesses and experts." },
      { step: 5, title: "Decision", content: "Judgment and Civil Registry registration." }
    ]
  },
  "VAWC (RA 9262)": {
    requirements: ["Police Blotter", "Medical Certificate", "Screenshots / Messages", "Proof of Relationship", "Birth Certificate of children"],
    steps: [
      { step: 1, title: "Filing of Complaint", content: "Submission to Prosecutor or for Protection Order." },
      { step: 2, title: "Application for Protection Order", content: "TPO or PPO request." },
      { step: 3, title: "Investigation", content: "Prosecutor determination of probable cause." },
      { step: 4, title: "Trial", content: "Criminal proceedings in Family Court." }
    ]
  }
};

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: {
    requirements: ["Police Blotter / Complaint", "Subpoena / Court Order", "Valid ID & Indigency Documents"],
    steps: universalPaoFlow
  },
  Civil: {
    requirements: ["Contracts / Written Agreements", "Demand Letter", "Land Titles / Deeds", "Receipts"],
    steps: universalPaoFlow
  },
  Labor: {
    requirements: ["Proof of Employment", "Dismissal Notice", "Payslips"],
    steps: [
      { step: 1, title: "SENA filing", content: "The initial step for labor disputes." },
      { step: 2, title: "Conciliation", content: "Attempting settlement." },
      { step: 3, title: "Position Paper", content: "Submission of evidence." },
      { step: 4, title: "Decision", content: "Arbiter's ruling." }
    ]
  }
};
