
/**
 * @fileOverview Shared legal database for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

export const caseCategories = {
  "Criminal": [
    {
      title: "🔴 I. CRIMES AGAINST PERSONS",
      items: ["Murder", "Homicide", "Parricide", "Infanticide", "Physical Injuries", "Illegal Detention"]
    },
    {
      title: "💜 II. VAWC (R.A. 9262)",
      items: ["Physical Violence (VAWC)", "Sexual Violence (VAWC)", "Psychological Violence (VAWC)", "Economic Abuse (VAWC)"]
    },
    {
      title: "🟠 III. CRIMES AGAINST PROPERTY",
      items: ["Robbery", "Theft", "Qualified Theft", "Estafa", "Malicious Mischief", "Anti-Fencing (PD 1612)"]
    },
    {
      title: "🛡️ IV. PROPERTY CRIMES (SPECIAL LAWS)",
      items: ["Carnapping (RA 10883)", "Trust Receipts (PD 115)", "Bouncing Checks (BP 22)", "Qualified Estafa (PD 1689)", "Cattle Rustling (PD 533)", "Agricultural Smuggling (RA 10845)", "Utility Pilferage (RA 7832)", "Arson (PD 1613)"]
    },
    {
      title: "⚖️ V. PUBLIC ORDER & AUTHORITY",
      items: ["Rebellion", "Coup d'état", "Sedition", "Direct Assault", "Resistance & Disobedience", "Illegal Assembly"]
    },
    {
      title: "💻 VI. CYBERCRIME (RA 10175)",
      items: ["Illegal Access", "Computer Fraud", "Identity Theft", "Cyberlibel", "Cybersex", "Voyeurism (RA 9995)"]
    },
    {
      title: "📦 VII. SPECIAL PENAL LAWS",
      items: ["Firearms Possession (RA 10591)", "Dangerous Drugs (RA 9165)", "Human Trafficking (RA 9208)", "Illegal Recruitment", "Anti-Graft (RA 3019)"]
    },
    {
      title: "💍 VIII. CIVIL STATUS CRIMES",
      items: ["Bigamy", "Simulation of Birth", "Usurpation of Civil Status", "Premature Marriage"]
    }
  ],
  "Civil": [
    {
      title: "📖 I. FAMILY RELATIONS",
      items: ["Annulment of Marriage", "Nullity of Marriage", "Support", "Custody of Children", "Adoption"]
    },
    {
      title: "🏠 II. PROPERTY & CONTRACTS",
      items: ["Unlawful Detainer", "Forcible Entry", "Collection of Sum of Money", "Breach of Contract", "Damages"]
    },
    {
      title: "📜 III. SPECIAL PROCEEDINGS",
      items: ["Correction of Entries", "Guardianship", "Settlement of Estate", "Habeas Corpus"]
    }
  ],
  "Labor": [
    {
      title: "🔒 I. TERMINATION & TENURE",
      items: ["Illegal Dismissal", "Constructive Dismissal", "Regularization", "Retrenchment Dispute"]
    },
    {
      title: "💰 II. MONETARY CLAIMS",
      items: ["Unpaid Wages", "13th Month Pay", "Service Incentive Leave", "Illegal Deductions"]
    },
    {
      title: "🌍 III. OFW & SPECIAL CASES",
      items: ["OFW Claims", "Labor-Only Contracting", "Retaliatory Measures"]
    }
  ],
  "Administrative": [
    {
      title: "🏛 GOVERNMENT & QUASI-JUDICIAL",
      items: ["Civil Service Cases", "SSS / GSIS Claims", "DARAB Cases", "Barangay Conciliation"]
    }
  ]
};

export const standardPaoDocs = [
  "Affidavit of Indigency (PAO Form)",
  " Latest Income Tax Return (ITR) or BIR Certification of Exemption",
  "Barangay Certificate of Indigency (stating purpose)",
  "Social Case Study (if available from DSWD)",
  "Valid Government-issued ID (Original & 3 Photocopies)"
];

export const universalPaoFlow = [
  { step: 1, title: "Intake Interview", content: "Meet with PAO staff to narrate facts and identify legal issues." },
  { step: 2, title: "Eligibility Assessment", content: "Submit proof of indigency (Income/ITR/Barangay Cert). Verified against threshold." },
  { step: 3, title: "Merit & Conflict Check", content: "Lawyer verifies case merit and checks for existing representation of the opposing party." },
  { step: 4, title: "Acceptance & Oath", content: "If qualified, sign representation agreement and take oath of indigency." },
  { step: 5, title: "Legal Strategy", content: "Drafting of complaints, affidavits, or answers. Filing in the appropriate court." }
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description: string }> = {
  // --- CRIMINAL: PERSONS ---
  "Murder": {
    description: "The unlawful killing of a person with qualifying circumstances such as treachery or premeditation (Art. 248, RPC).",
    requirements: ["Police Investigation Report", "Autopsy/Medico-Legal Report", "Death Certificate", "Sworn Witness Affidavits", "Police Blotter"],
    steps: universalPaoFlow
  },
  // --- CRIMINAL: VAWC ---
  "Physical Violence (VAWC)": {
    description: "Acts causing bodily harm or threatening physical harm (Sec. 5a, RA 9262). Includes Battery and Placing in Fear.",
    requirements: ["Marriage Contract / Proof of Relationship", "Medico-Legal Certificate", "Photos of Injuries", "Police Blotter", "Barangay Protection Order (if any)"],
    steps: universalPaoFlow
  },
  "Psychological Violence (VAWC)": {
    description: "Acts causing mental or emotional suffering, including intimidation, stalking, or marital infidelity (Sec. 5h-i, RA 9262).",
    requirements: ["Psychological Evaluation Report", "Screenshots of Threats/Harassment", "Witness Affidavits", "Proof of Relationship"],
    steps: universalPaoFlow
  },
  "Economic Abuse (VAWC)": {
    description: "Acts making a woman financially dependent, such as withdrawing support or controlling money (Sec. 5e, RA 9262).",
    requirements: ["Proof of Financial Denial", "Marriage Contract", "Birth Certificates of Children", "Affidavit of Fact"],
    steps: universalPaoFlow
  },
  // --- CRIMINAL: PUBLIC ORDER ---
  "Rebellion": {
    description: "Rising publicly and taking arms against the Government for the purpose of overthrowing it (Art. 134, RPC).",
    requirements: ["Intelligence/Arrest Report", "Photos/Videos of Armed Gathering", "Seized Firearms/Logistics Inventory", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Direct Assault": {
    description: "Employing force or intimidation against persons in authority or their agents (Art. 148, RPC).",
    requirements: ["Incident/Police Report", "Witness Statements", "Medico-Legal (if injured)", "Proof of Authority Status of Victim"],
    steps: universalPaoFlow
  },
  // --- CRIMINAL: PROPERTY SPECIAL ---
  "Carnapping (RA 10883)": {
    description: "Theft/taking of a motor vehicle with or without use of force, or through intimidation (RA 10883).",
    requirements: ["LTO Certificate of Registration & OR", "Police Alarm/Flash Report", "Affidavit of Loss/Taking", "CCTV Footage (if any)"],
    steps: universalPaoFlow
  },
  "Bouncing Checks (BP 22)": {
    description: "Issuing a check without sufficient funds or failing to maintain funds (BP Blg 22).",
    requirements: ["Original Bounced Check", "Notice of Dishonor (Demand Letter)", "Registry Return Receipt (Proof of Demand)", "Bank Certification of Dishonor"],
    steps: universalPaoFlow
  },
  // --- CRIMINAL: CYBERCRIME ---
  "Identity Theft": {
    description: "Unauthorized use of another person's identifying information (Sec. 4b, RA 10175).",
    requirements: ["Screenshots of Fake Profile/Activity", "URLs/Links", "Government ID of Victim", "Affidavit of Denial"],
    steps: universalPaoFlow
  },
  "Cyberlibel": {
    description: "Defamation committed through a computer system or social media (RA 10175).",
    requirements: ["Screenshots of Defamatory Post/Comments", "URL of the content", "Proof of Publication/Reach", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  // --- CIVIL ---
  "Annulment of Marriage": {
    description: "Legal cancellation of marriage based on grounds like fraud or lack of consent (Art. 45, Family Code).",
    requirements: ["PSA Marriage Contract", "PSA Birth Certificates of Children", "Barangay Residency Certificate", "CENOMAR", "Psychological Evaluation (if applicable)"],
    steps: universalPaoFlow
  },
  "Support": {
    description: "Compelling a parent or spouse to provide for sustenance and medical needs (Art. 194, Family Code).",
    requirements: ["PSA Birth Certificate of Child", "Marriage Contract", "Proof of Need (Tuition, Medical Bills)", "Proof of Respondent's Income (if known)"],
    steps: universalPaoFlow
  },
  "Collection of Sum of Money": {
    description: "Claims for debts or unpaid loans. Handled under Small Claims if under P1M.",
    requirements: ["Promissory Note / Contract", "Demand Letter with Proof of Receipt", "Statement of Account", "Barangay Certificate to File Action"],
    steps: universalPaoFlow
  },
  // --- LABOR ---
  "Illegal Dismissal": {
    description: "Termination without just/authorized cause or due process (Art. 279, Labor Code).",
    requirements: ["Employment Contract / Appointment Letter", "Notice of Termination", "Latest Payslips & Company ID", "Affidavit of Witnesses"],
    steps: universalPaoFlow
  },
  "13th Month Pay": {
    description: "Claim for mandatory benefit for employees rendering at least 1 month service (PD 851).",
    requirements: ["Company ID", "Latest Payslips", "Employment Records", "Affidavit of Non-Payment"],
    steps: universalPaoFlow
  },
  "OFW Claims": {
    description: "Assistance for OFWs regarding illegal dismissal or unpaid benefits under POEA contracts.",
    requirements: ["POEA-approved Contract", "Passport & Visa", "Overseas Employment Certificate (OEC)", "Communication Logs with Agency"],
    steps: universalPaoFlow
  }
};

export const pAONotes = [
  "✔ All PAO services are COMPLETELY FREE for qualified indigents.",
  "✔ Eligibility: You must pass the Indigency Test (Income) and Merit Test (Legal Basis).",
  "✔ Conflict of Interest: PAO cannot represent both opposing parties.",
  "✔ Preparation: Bring original documents and 3 photocopies to your appointment.",
  "✔ Special Priority: VAWC, Labor, and Criminal Defense for the poor take precedence."
];

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Police Report", "Subpoena"], steps: universalPaoFlow },
  Civil: { requirements: ["PSA Certificates", "Demand Letters"], steps: universalPaoFlow },
  Labor: { requirements: ["Company ID", "Payslips"], steps: universalPaoFlow },
  Administrative: { requirements: ["Notice from Agency", "Evidence"], steps: universalPaoFlow }
};
