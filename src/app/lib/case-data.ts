/**
 * @fileOverview Shared legal database for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

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
    content: "The client visits the nearest PAO district office to file a request for legal assistance." 
  },
  { 
    step: 2, 
    title: "Indigency Test", 
    content: "The applicant must prove they are indigent. This generally means having a low income and owning no significant real property. Required documents: Affidavit of Indigency, Certificate of Income, or ITR." 
  },
  { 
    step: 3, 
    title: "Merit Test", 
    content: "A PAO lawyer assesses if the case has merit—meaning it has a chance of success and is not intended merely to harass the opposite party." 
  },
  { 
    step: 4, 
    title: "Conflict of Interest Check", 
    content: "The PAO verifies that they do not already represent the opposing party to avoid conflicts of interest." 
  },
  { 
    step: 5, 
    title: "Acceptance", 
    content: "If the applicant passes, the lawyer formally accepts the case and provides representation, counseling, or document drafting." 
  }
];

export const defaultRequirements: string[] = [];
export const defaultSteps = universalPaoFlow;

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description?: string }> = {
  "Murder": { 
    description: "Unlawful killing of a person with qualifying circumstances such as treachery, superior strength, or for reward/price.",
    requirements: ["Police blotter", "Sworn Complaint-Affidavit", "Medico-Legal Certificate", "Hospital records", "Death Certificate", "Autopsy report", "Witness affidavits", "Information (If Accused)", "Arrest warrant (If Accused)"], 
    steps: defaultSteps 
  },
  "Homicide": {
    description: "Unlawful killing of a person that does not amount to murder, parricide, or infanticide.",
    requirements: ["Police blotter", "Sworn Complaint-Affidavit", "Medico-Legal Certificate", "Death Certificate", "Autopsy report", "Witness affidavits", "Information (If Accused)"],
    steps: defaultSteps
  },
  "Parricide": {
    description: "The killing of a father, mother, or child (legitimate/illegitimate), or any ascendant/descendant, or spouse.",
    requirements: ["Marriage Certificate (if spouse)", "Birth Certificate (if parent/child)", "Police blotter", "Death Certificate"],
    steps: defaultSteps
  },
  "Infanticide": {
    description: "The killing of a child less than three days (72 hours) of age.",
    requirements: ["Birth Certificate of child", "Police report", "Medico-legal report (cause of death)", "Witness affidavits"],
    steps: defaultSteps
  },
  "Illegal Detention/Kidnapping": {
    description: "Unlawful deprivation of liberty, including cases involving unlawful arrest by public officers.",
    requirements: ["Police blotter", "Sworn affidavit of witness/victim", "CCTV footage (if any)", "Identity documentation of victim"],
    steps: defaultSteps
  },
  "Illegal Possession of Dangerous Drugs (Section 11)": {
    description: "Possession of prohibited substances like methamphetamine ('shabu'), marijuana, or ecstasy without legal authority.",
    requirements: ["Arrest report", "Inventory of seized items", "Chemistry report", "Chain of custody documents", "Confiscation receipt"],
    steps: defaultSteps
  },
  "Illegal Possession of Paraphernalia (Section 12)": {
    description: "Possession of equipment, instruments, or apparatus intended for smoking, consuming, or injecting dangerous drugs.",
    requirements: ["Arrest report", "Inventory of seized items (paraphernalia)", "Chemistry report (residues)", "Chain of custody"],
    steps: defaultSteps
  },
  "Drug Trafficking / Pushing (Section 5)": {
    description: "Sale, trading, delivery, distribution, or transportation of illegal drugs (non-bailable if evidence is strong).",
    requirements: ["Buy-bust report", "Inventory of seized items", "Chemistry report", "Marked money copies", "Chain of custody"],
    steps: defaultSteps
  },
  "Use of Dangerous Drugs (Section 15)": {
    description: "Offense for positive drug tests. PAO assists first-time offenders in entering rehabilitation programs.",
    requirements: ["Drug test result", "Arrest report", "Confiscation receipt", "Recommendation for rehab"],
    steps: defaultSteps
  },
  "Swindling and Estafa (Arts. 315-318)": {
    description: "Fraudulent acts or deceits that cause damage or prejudice to another person.",
    requirements: ["Contract/Agreement", "Promissory note", "Receipts", "Demand letter with proof of receipt", "SMS/Chat logs"],
    steps: defaultSteps
  },
  "Robbery (Arts. 294-305)": {
    description: "Taking of personal property belonging to another with intent to gain, by means of violence or intimidation.",
    requirements: ["Police report", "Affidavit of loss", "Proof of ownership (receipts/titles)", "CCTV footage", "Witness affidavits"],
    steps: defaultSteps
  },
  "Theft (Arts. 308-311)": {
    description: "Taking of personal property without consent, with intent to gain, but without violence or intimidation.",
    requirements: ["Police report", "Proof of ownership", "Inventory of stolen items", "Witness affidavits"],
    steps: defaultSteps
  },
  "Annulment of Marriage": {
    description: "Legal process to declare a marriage void due to specific grounds like psychological incapacity (Art. 36).",
    requirements: ["PSA Marriage Certificate", "Birth certificates of children", "Psychological report (if Art. 36)", "Proof of residency"],
    steps: defaultSteps
  },
  "Illegal Dismissal": {
    description: "Unlawful termination of employment without just or authorized cause or without due process.",
    requirements: ["Employment contract", "Payslips", "Termination letter", "Company ID", "Written explanation"],
    steps: [
      { step: 1, title: "Filing before NLRC", content: "Submission of the complaint to the National Labor Relations Commission." },
      { step: 2, title: "Conciliation", content: "Mandatory conference to explore settlement." },
      { step: 3, title: "Position papers", content: "Submission of sworn statements and evidence." },
      { step: 4, title: "Decision", content: "Labor Arbiter's ruling." }
    ]
  },
  "Bouncing Checks Law (BP 22)": {
    description: "Issuance of a check without sufficient funds or upon credit to cover the full amount of the check.",
    requirements: ["Original dishonored check", "Bank return slip", "Written demand letter", "Proof of receipt of demand"],
    steps: defaultSteps
  }
};

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Court Subpoena", "Arrest Record", "Copy of Complaint"], steps: universalPaoFlow },
  Civil: { requirements: ["Relevant contracts", "Demand letter", "Proof of claim"], steps: universalPaoFlow },
  Labor: { requirements: ["Employment records", "Payslips", "ID card"], steps: universalPaoFlow }
};

export const pAONotes = [
  "✔ Mandatory Prerequisites: Valid ID, Affidavit of Indigency, Barangay Certificate of Indigency, Proof of Income.",
  "✔ PAO mainly handles criminal defense cases for indigent accused.",
  "✔ Civil and Labor cases require both Indigency and Merit Tests.",
  "✔ Wealthy individuals or corporations are NOT qualified for PAO services.",
  "✔ All services provided by the PAO are completely FREE of charge."
];

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));
