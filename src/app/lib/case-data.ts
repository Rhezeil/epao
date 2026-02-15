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
      title: "💜 V. CRIMES AGAINST CHASTITY & SEXUAL VIOLENCE",
      items: [
        "Rape (R.A. 8353 / Art. 266-A)",
        "Acts of Lasciviousness (Art. 336)",
        "Acts of Lasciviousness under R.A. 7610",
        "Qualified Seduction (Art. 337)",
        "Simple Seduction (Art. 338)",
        "Forcible Abduction (Art. 342)",
        "Consented Abduction (Art. 343)",
        "Corruption of Minors (Art. 340)",
        "Adultery (Art. 333)",
        "Concubinage (Art. 334)",
        "White Slave Trade (Art. 341)",
        "Anti-Sexual Harassment (R.A. 7877)",
        "Abuses Against Chastity by Public Officers (Art. 245)"
      ]
    },
    {
      title: "💻 VI. CYBERCRIME & SPECIAL LAWS",
      items: ["Online Libel", "Identity Theft", "Child Abuse (RA 7610)", "Anti-Hazing (RA 11053)"]
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
  { step: 1, title: "Application and Evaluation", content: "The client visits the nearest PAO district office to file a request for legal assistance." },
  { step: 2, title: "Indigency Test", content: "The applicant must prove they are indigent. This generally means having a low income and owning no significant real property." },
  { step: 3, title: "Merit Test", content: "A PAO lawyer assesses if the case has merit—meaning it has a chance of success and is not intended merely to harass the opposite party." },
  { step: 4, title: "Conflict of Interest Check", content: "The PAO verifies that they do not already represent the opposing party to avoid conflicts of interest." },
  { step: 5, title: "Acceptance", content: "If the applicant passes, the lawyer formally accepts the case and provides representation, counseling, or document drafting." }
];

export const defaultSteps = universalPaoFlow;

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description?: string }> = {
  // --- CRIMES AGAINST PERSONS ---
  "Murder": { 
    description: "Unlawful killing of a person with qualifying circumstances such as treachery, superior strength, or for reward/price.",
    requirements: ["Police blotter", "Sworn Complaint-Affidavit", "Medico-Legal Certificate", "Hospital records", "Death Certificate", "Autopsy report", "Witness affidavits", "Information (If Accused)"], 
    steps: defaultSteps 
  },
  "Homicide": {
    description: "Unlawful killing of a person that does not amount to murder, parricide, or infanticide.",
    requirements: ["Police blotter", "Sworn Complaint-Affidavit", "Medico-Legal Certificate", "Death Certificate", "Autopsy report", "Witness affidavits", "Information (If Accused)"],
    steps: defaultSteps
  },
  "Parricide": {
    description: "The killing of a father, mother, or child (legitimate/illegitimate), or any ascendant/descendant, or spouse.",
    requirements: ["Marriage Certificate (if spouse)", "Birth Certificate (if parent/child)", "Police blotter", "Death Certificate", "Witness affidavits"],
    steps: defaultSteps
  },
  "Infanticide": {
    description: "The killing of a child less than three days (72 hours) of age.",
    requirements: ["Birth Certificate of child", "Police report", "Medico-legal report (cause of death)", "Witness affidavits"],
    steps: defaultSteps
  },
  "Illegal Detention/Kidnapping": {
    description: "Unlawful deprivation of liberty, including cases involving unlawful arrest by public officers.",
    requirements: ["Police blotter", "Sworn affidavit of victim/witness", "CCTV footage (if any)", "Identity documentation of victim"],
    steps: defaultSteps
  },

  // --- CRIMES AGAINST PROPERTY ---
  "Theft (Arts. 308-311)": {
    description: "Taking of personal property belonging to another without consent, with intent to gain, but without violence or intimidation.",
    requirements: ["Police report", "Affidavit of loss", "Proof of ownership (receipts/titles)", "CCTV footage", "Witness affidavits"],
    steps: defaultSteps
  },
  "Robbery (Arts. 294-305)": {
    description: "Taking of personal property belonging to another with intent to gain, by means of violence or intimidation against persons or force upon things.",
    requirements: ["Police report", "Affidavit of loss", "Proof of ownership", "Inventory of stolen items", "Witness affidavits", "CCTV footage"],
    steps: defaultSteps
  },
  "Swindling and Estafa (Arts. 315-318)": {
    description: "Fraudulent acts or deceits that cause damage or prejudice to another person.",
    requirements: ["Contract/Agreement", "Promissory note", "Receipts", "Demand letter with proof of receipt", "SMS/Chat logs"],
    steps: defaultSteps
  },

  // --- DRUGS ---
  "Illegal Possession of Dangerous Drugs (Section 11)": {
    description: "Possession of prohibited substances like methamphetamine ('shabu'), marijuana, or ecstasy without legal authority.",
    requirements: ["Arrest report", "Inventory of seized items", "Chemistry report", "Chain of custody documents", "Confiscation receipt"],
    steps: defaultSteps
  },
  "Drug Trafficking / Pushing (Section 5)": {
    description: "Sale, trading, delivery, distribution, or transportation of illegal drugs (non-bailable if evidence is strong).",
    requirements: ["Buy-bust report", "Inventory of seized items", "Chemistry report", "Marked money copies", "Chain of custody"],
    steps: defaultSteps
  },

  // --- CHASTITY & SEXUAL VIOLENCE ---
  "Rape (R.A. 8353 / Art. 266-A)": {
    description: "Classified as a crime against persons. Includes sexual intercourse through force, threat, or when the victim is deprived of reason.",
    requirements: ["Medico-legal certificate", "Police blotter", "Sworn affidavit", "Birth certificate (if minor)", "Psychological evaluation"],
    steps: defaultSteps
  },
  "Acts of Lasciviousness (Art. 336)": {
    description: "Engaging in lewd acts with another person under circumstances of force or intimidation.",
    requirements: ["Sworn affidavit", "Police blotter", "Witness affidavits", "Medico-legal (if applicable)"],
    steps: defaultSteps
  },
  "Adultery (Art. 333)": {
    description: "Committed by a married woman who shall have sexual intercourse with a man not her husband.",
    requirements: ["Marriage certificate", "Evidence of sexual intercourse (photos/messages)", "Witness affidavits"],
    steps: defaultSteps
  },
  "Concubinage (Art. 334)": {
    description: "Committed by a husband who keeps a mistress in the conjugal dwelling or under scandalous circumstances.",
    requirements: ["Marriage certificate", "Evidence of mistress (photos/witnesses)", "Proof of cohabitation"],
    steps: defaultSteps
  },
  "Qualified Seduction (Art. 337)": {
    description: "Seducing a virgin over 12 but under 18 years old, by person in authority or trust.",
    requirements: ["Birth certificate of minor", "Sworn affidavit", "Proof of relationship/authority", "Witness affidavits"],
    steps: defaultSteps
  },
  "Corruption of Minors (Art. 340)": {
    description: "Promoting or facilitating the prostitution or corruption of a minor.",
    requirements: ["Birth certificate of minor", "Evidence of promotion/facilitation", "Police report", "Witness affidavits"],
    steps: defaultSteps
  },
  "Abuses Against Chastity by Public Officers (Art. 245)": {
    description: "Public officers taking advantage of their position to solicit immoral advances from women with pending matters.",
    requirements: ["Sworn affidavit", "Proof of pending matter", "Official identification of officer", "Witness affidavits"],
    steps: defaultSteps
  },

  // --- CIVIL ---
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
