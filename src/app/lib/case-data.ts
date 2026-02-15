/**
 * @fileOverview Shared legal database for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

export const generalRequirements: string[] = [];

export const caseCategories = {
  "Criminal": [
    {
      title: "🔴 I. CRIMES AGAINST PERSONS",
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
      title: "🟠 II. CRIMES AGAINST PROPERTY",
      items: [
        "Robbery (Arts. 294-305)",
        "Brigandage (Arts. 306-307)",
        "Theft (Arts. 308-311)",
        "Usurpation (Arts. 312-313)",
        "Fraudulent Insolvency (Art. 314)",
        "Swindling and Estafa (Arts. 315-318)",
        "Removal, Sale, or Pledge of Mortgaged Property",
        "Arson and Destruction (Arts. 320-326)",
        "Malicious Mischief (Arts. 327-331)",
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
      title: "🔵 III. CRIMES AGAINST PUBLIC ORDER",
      items: [
        "Rebellion or Insurrection (Art. 134)",
        "Coup d'état (Art. 134-A)",
        "Conspiracy and Proposal to Commit Coup d'état/Rebellion (Art. 136)",
        "Inciting to Rebellion or Insurrection (Art. 138)",
        "Sedition (Art. 139)",
        "Conspiracy to Commit Sedition (Art. 141)",
        "Inciting to Sedition (Art. 142)",
        "Illegal Assemblies (Art. 146)",
        "Illegal Associations (Art. 147)",
        "Direct Assaults (Art. 148)",
        "Indirect Assaults (Art. 149)",
        "Resistance and Disobedience (Art. 151)",
        "Tumults and Other Disturbances (Art. 153)",
        "Alarms and Scandals (Art. 155)",
        "Delivering Prisoners from Jail (Art. 156)",
        "Evasion of Service of Sentence (Art. 157)",
        "Violation of Conditional Pardon (Art. 159)"
      ]
    },
    {
      title: "📦 IV. DANGEROUS DRUGS CASES (RA 9165)",
      items: [
        "Illegal Possession of Dangerous Drugs (Section 11)",
        "Illegal Possession of Paraphernalia (Section 12)",
        "Drug Trafficking / Pushing (Section 5)",
        "Use of Dangerous Drugs (Section 15)",
        "Cultivation of Marijuana (Section 16)",
        "Drug Cases Involving Minors",
        "Drug Plea Bargaining Applications"
      ]
    },
    {
      title: "💻 V. CYBERCRIME & SPECIAL LAWS",
      items: ["Online Libel", "Identity Theft", "Anti-Rape Law (RA 8353)", "Child Abuse (RA 7610)"]
    }
  ],
  "Civil": [
    {
      title: "📖 Family Law Cases",
      items: ["Annulment of Marriage", "Declaration of Nullity", "Legal Separation", "Child Custody", "Child Support", "Adoption", "Recognition of Foreign Divorce"]
    },
    {
      title: "📖 Civil Code & Property",
      items: ["Collection of Sum of Money", "Breach of Contract", "Damages", "Property Disputes", "Partition of Property", "Unlawful Detainer", "Forcible Entry", "Small Claims"]
    }
  ],
  "Labor": [
    {
      title: "👷 Employment Disputes",
      items: ["Illegal Dismissal", "Constructive Dismissal", "Non-payment of Wages", "Overtime Pay Claims", "Separation Pay", "13th Month Pay"]
    }
  ],
  "Special Legislation": [
    {
      title: "🏢 Social & Special Laws",
      items: ["Anti-Trafficking (RA 9208)", "Anti-Child Pornography (RA 9775)", "Anti-Hazing (RA 11053)", "Anti-Illegal Recruitment", "Juvenile Justice (RA 9344)"]
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
    content: "The applicant must prove they are indigent. This generally means having a low income and owning no significant real property. Required baseline documents include Affidavit of Indigency and Barangay Certificate." 
  },
  { 
    step: 3, 
    title: "Merit Test", 
    content: "A PAO lawyer assesses if the case has merit. Criminal defense is generally considered meritorious. Civil/Other cases are evaluated based on law and evidence." 
  },
  { 
    step: 4, 
    title: "Conflict of Interest Check", 
    content: "The PAO verifies that they do not already represent the opposing party." 
  },
  { 
    step: 5, 
    title: "Acceptance", 
    content: "If the applicant passes, the lawyer formally accepts the case for representation, counseling, or document drafting." 
  }
];

export const defaultRequirements = [];
export const defaultSteps = universalPaoFlow;

export const caseSpecificData: Record<string, { requirements: string[], steps: any[] }> = {
  "Murder": { 
    requirements: [
      "Police blotter", "Sworn Complaint-Affidavit", "Medico-Legal Certificate", "Hospital records", "Death Certificate", "Autopsy report", "Photos of injuries", "Witness affidavits", "Copy of Complaint/Information (If Accused)", "Arrest warrant (If Accused)", "Subpoena (If Accused)", "Bail bond papers (If Accused)"
    ], 
    steps: universalPaoFlow 
  },
  "Homicide": {
    requirements: [
      "Police blotter", "Sworn Complaint-Affidavit", "Medico-Legal Certificate", "Hospital records", "Death Certificate", "Autopsy report", "Witness affidavits", "Copy of Information (If Accused)", "Arrest warrant (If Accused)"
    ],
    steps: universalPaoFlow
  },
  "Parricide": {
    requirements: [
      "Marriage Certificate (if spouse)", "Birth Certificate (if parent/child)", "Police blotter", "Sworn Affidavit", "Death Certificate"
    ],
    steps: universalPaoFlow
  },
  "Infanticide": {
    requirements: [
      "Birth Certificate of child (less than 72 hours old)", "Police report", "Medico-legal report (cause of death)", "Witness affidavits"
    ],
    steps: universalPaoFlow
  },
  "Illegal Possession of Dangerous Drugs (Section 11)": {
    requirements: ["Arrest report", "Inventory of seized items", "Chemistry report", "Chain of custody documents", "Confiscation receipt", "Charge sheet"],
    steps: universalPaoFlow
  },
  "Illegal Possession of Paraphernalia (Section 12)": {
    requirements: ["Arrest report", "Inventory of seized items (paraphernalia)", "Chemistry report (if residues found)", "Chain of custody documents", "Confiscation receipt"],
    steps: universalPaoFlow
  },
  "Drug Trafficking / Pushing (Section 5)": {
    requirements: ["Arrest report / Buy-bust report", "Inventory of seized items", "Chemistry report", "Chain of custody documents", "Confiscation receipt", "Marked money copies (if applicable)"],
    steps: universalPaoFlow
  },
  "Use of Dangerous Drugs (Section 15)": {
    requirements: ["Drug test result", "Arrest report", "Confiscation receipt", "Recommendation for rehabilitation (if applicable)"],
    steps: universalPaoFlow
  },
  "Drug Cases Involving Minors": {
    requirements: ["Birth Certificate of minor", "Social worker report", "Arrest report", "Inventory of seized items"],
    steps: universalPaoFlow
  },
  "Drug Plea Bargaining Applications": {
    requirements: ["Copy of Information", "Plea Bargaining Proposal", "Court Order (if any)", "Evaluation from Prosecutor/Court"],
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
    requirements: ["Original dishonored check", "Bank return slip (insufficient funds)", "Written demand letter", "Proof of receipt of demand letter"],
    steps: universalPaoFlow
  }
};

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Court Subpoena", "Arrest Record", "Copy of Complaint"], steps: universalPaoFlow },
  Civil: { requirements: ["Relevant contracts", "Demand letter", "Proof of claim"], steps: universalPaoFlow },
  Labor: { requirements: ["Employment records", "Payslips", "ID card"], steps: universalPaoFlow }
};

export const pAONotes = [
  "✔ Mandatory Prerequisites: Valid ID, Affidavit of Indigency, Barangay Certificate of Indigency, Proof of Income.",
  "✔ PAO mainly handles criminal defense cases.",
  "✔ Civil cases require Indigency + Merit Test.",
  "✔ Some cases (like corporations, high-income clients) are NOT accepted.",
  "✔ Court-appointed cases (Counsel de Oficio) are automatically handled."
];

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));
