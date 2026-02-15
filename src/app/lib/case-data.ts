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
      items: ["Murder", "Homicide", "Parricide", "Infanticide", "Physical Injuries (Serious, Less Serious, Slight)"]
    },
    {
      title: "🟠 Crimes Against Property",
      items: ["Theft", "Qualified Theft", "Robbery (with violence / intimidation)", "Robbery with Homicide", "Estafa (Swindling)", "Arson", "Malicious Mischief"]
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
      title: "🔵 Rebellion, Insurrection, and Coup d'état",
      items: [
        "Rebellion or Insurrection (Art. 134)",
        "Coup d'état (Art. 134-A)",
        "Conspiracy and Proposal to Commit Coup d'état, Rebellion, or Insurrection (Art. 136)",
        "Inciting to Rebellion or Insurrection (Art. 138)"
      ]
    },
    {
      title: "🔵 Sedition and Public Disturbances",
      items: [
        "Sedition (Art. 139)",
        "Conspiracy to Commit Sedition (Art. 141)",
        "Inciting to Sedition (Art. 142)",
        "Illegal Assemblies (Art. 146)",
        "Illegal Associations (Art. 147)",
        "Tumults and Other Disturbances of Public Order (Art. 153)"
      ]
    },
    {
      title: "🔵 Assaults, Resistance, and Disobedience",
      items: [
        "Direct Assaults (Art. 148)",
        "Indirect Assaults (Art. 149)",
        "Resistance and Disobedience to a Person in Authority or Agents (Art. 151)"
      ]
    },
    {
      title: "🔵 Public Disorders and Evasion of Service",
      items: [
        "Alarms and Scandals (Art. 155)",
        "Delivering Prisoners from Jail (Art. 156)",
        "Evasion of Service of Sentence (Art. 157)",
        "Violation of Conditional Pardon (Art. 159)"
      ]
    },
    {
      title: "2️⃣ Dangerous Drugs Cases (RA 9165)",
      items: [
        "Illegal Possession of Dangerous Drugs (Section 11)",
        "Illegal Sale, Trading, Administration, Dispensation, Delivery, Distribution, and Transportation (Section 5)",
        "Possession of Equipment, Instrument, Apparatus, and Other Paraphernalia (Section 12)",
        "Use of Dangerous Drugs (Section 15)",
        "Cultivation of Marijuana (Section 16)"
      ]
    },
    {
      title: "3️⃣ VAWC Cases (RA 9262)",
      items: ["Physical abuse", "Psychological abuse", "Economic abuse", "Protection Order cases"]
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
      items: ["Online libel", "Identity theft", "Online fraud", "Cybersex", "Computer-related fraud"]
    },
    {
      title: "7️⃣ Bouncing Checks (BP 22)",
      items: ["Issuance of bouncing checks"]
    }
  ],
  "Civil": [
    {
      title: "📖 Family Law Cases",
      items: ["Annulment of Marriage", "Declaration of Nullity of Marriage", "Legal Separation", "Child Custody", "Child Support", "Adoption (qualified cases)", "Recognition of Foreign Divorce"]
    },
    {
      title: "📖 Civil Code Cases",
      items: ["Collection of Sum of Money", "Breach of Contract", "Damages", "Property Disputes", "Partition of Property"]
    },
    {
      title: "📖 Ejectment Cases",
      items: ["Unlawful Detainer", "Forcible Entry"]
    },
    {
      title: "📖 Small Claims",
      items: ["Small Claims Collection"]
    }
  ],
  "Labor": [
    {
      title: "👷 Employment Disputes",
      items: ["Illegal Dismissal", "Constructive Dismissal", "Non-payment of Wages", "Overtime Pay Claims", "Separation Pay", "13th Month Pay Claims", "Money Claims"]
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
    requirements: ["Police blotter", "Sworn Complaint-Affidavit", "Medico-Legal Certificate", "Hospital records", "Death Certificate", "Autopsy report", "Photos of injuries", "Witness affidavits", ...generalRequirements], 
    steps: universalPaoFlow 
  },
  "Illegal Possession of Dangerous Drugs (Section 11)": {
    requirements: ["Arrest report", "Inventory of seized items", "Chemistry report", "Chain of custody documents", "Confiscation receipt", ...generalRequirements],
    steps: drugCaseProcess
  },
  "Illegal Sale, Trading, Administration, Dispensation, Delivery, Distribution, and Transportation (Section 5)": {
    requirements: ["Buy-bust operation report", "Inventory of seized items", "Chemistry report", "Chain of custody documents", "Arrest report", ...generalRequirements],
    steps: drugCaseProcess
  },
  "Possession of Equipment, Instrument, Apparatus, and Other Paraphernalia (Section 12)": {
    requirements: ["Arrest report", "Inventory of seized paraphernalia", "Chemistry report on residue", "Chain of custody documents", ...generalRequirements],
    steps: drugCaseProcess
  },
  "Use of Dangerous Drugs (Section 15)": {
    requirements: ["Drug test result", "Arrest report", "Affidavit of arrest", ...generalRequirements],
    steps: [
      { step: 1, title: "Assessment", content: "Evaluation of whether the offender is a first-time user." },
      { step: 2, title: "Rehabilitation Application", content: "Assisting first-time offenders in entering rehabilitation programs rather than serving prison time." },
      { step: 3, title: "Court Monitoring", content: "Monitoring of compliance with the rehab program." }
    ]
  },
  "Cultivation of Marijuana (Section 16)": {
    requirements: ["Police report on plantation site", "Photos of seized plants", "Laboratory report", "Arrest report", ...generalRequirements],
    steps: drugCaseProcess
  },
  "Annulment of Marriage": {
    requirements: ["PSA Marriage Certificate", "Birth certificates of children", "Psychological report (Art. 36)", "Proof of residency", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Child Support": {
    requirements: ["Birth certificate", "Proof of relationship", "Proof of financial capacity of parent", "Demand letter for support", ...generalRequirements],
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
  },
  "Direct Assaults (Art. 148)": {
    requirements: ["Police report", "Arrest report", "Witness affidavits", "Medical certificate (if injury)", ...generalRequirements],
    steps: universalPaoFlow
  },
  "Resistance and Disobedience to a Person in Authority or Agents (Art. 151)": {
    requirements: ["Police report", "Arrest report", "Witness affidavits", ...generalRequirements],
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
