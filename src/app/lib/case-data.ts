/**
 * @fileOverview Shared legal database for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

export const caseCategories = {
  "Criminal": [
    {
      title: "🔴 I. CRIMES AGAINST PERSONS (RPC)",
      items: ["Murder", "Homicide", "Parricide", "Infanticide", "Physical Injuries", "Illegal Detention"]
    },
    {
      title: "💜 II. VAWC (R.A. 9262)",
      items: ["Physical Violence (VAWC)", "Sexual Violence (VAWC)", "Psychological Violence (VAWC)", "Economic Abuse (VAWC)"]
    },
    {
      title: "🟠 III. CRIMES AGAINST PROPERTY (RPC)",
      items: ["Robbery (Art. 294)", "Robbery (Art. 299/302)", "Theft", "Qualified Theft", "Estafa", "Malicious Mischief"]
    },
    {
      title: "🛡️ IV. PROPERTY CRIMES (SPECIAL LAWS)",
      items: ["Carnapping (RA 10883)", "Bouncing Checks (BP 22)", "Cattle Rustling (PD 533)", "Utility Pilferage (RA 7832)", "Arson (PD 1613)"]
    },
    {
      title: "⚖️ V. PUBLIC ORDER & AUTHORITY",
      items: ["Direct Assault", "Resistance & Disobedience", "Illegal Assembly", "Sedition", "Rebellion"]
    },
    {
      title: "💻 VI. CYBERCRIME (RA 10175)",
      items: ["Illegal Access", "Computer Fraud", "Identity Theft", "Cyberlibel", "Photo/Video Voyeurism"]
    },
    {
      title: "📦 VII. SPECIAL PENAL LAWS",
      items: ["Illegal Possession of Firearms", "Dangerous Drugs (RA 9165)", "Human Trafficking (RA 9208)", "Illegal Recruitment"]
    }
  ],
  "Civil": [
    {
      title: "📖 I. FAMILY RELATIONS",
      items: ["Annulment of Marriage", "Declaration of Nullity", "Support", "Custody of Children", "Adoption"]
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
      items: ["Illegal Dismissal", "Constructive Dismissal", "Regularization"]
    },
    {
      title: "💰 II. MONETARY CLAIMS",
      items: ["Unpaid Wages", "13th Month Pay", "Service Incentive Leave", "Illegal Deductions"]
    },
    {
      title: "🌍 III. OFW & SPECIAL CASES",
      items: ["OFW Claims", "Labor-Only Contracting"]
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
  "Latest Income Tax Return (ITR) or BIR Certification of Exemption",
  "Barangay Certificate of Indigency (stating purpose)",
  "Social Case Study (if available from DSWD)",
  "Valid Government-issued ID (Original & 3 Photocopies)"
];

export const universalPaoFlow = [
  { step: 1, title: "Intake Interview", content: "Client meets with a PAO staff/lawyer to narrate the facts of the case and identify the legal issue." },
  { step: 2, title: "Eligibility Assessment", content: "Submission of proof of indigency. The lawyer verifies if the client falls within the income threshold." },
  { step: 3, title: "Merit & Conflict Check", content: "Verification that the case has legal merit and that PAO does not already represent the opposing party." },
  { step: 4, title: "Acceptance & Oath", content: "If qualified, the client signs the representation agreement and takes an oath of indigency." },
  { step: 5, title: "Legal Strategy", content: "Drafting of complaints, affidavits, or answers. Filing of petitions in the appropriate court or tribunal." }
];

export const defaultSteps = universalPaoFlow;

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description: string }> = {
  // CRIMINAL
  "Murder": {
    description: "The unlawful killing of a person with qualifying circumstances such as treachery, price/reward, or evident premeditation (Art. 248, RPC).",
    requirements: ["Police Blotter & Investigation Report", "Sworn Complaint-Affidavit", "Medico-Legal / Autopsy Report", "Death Certificate", "Witness Affidavits"],
    steps: defaultSteps
  },
  "Illegal Possession of Firearms": {
    description: "Possession of unlicensed, unregistered, or altered firearms (loose firearms) as defined under RA 10591.",
    requirements: ["Arrest Report", "Inventory of Seized Firearms", "Certification of Non-Licensing from FEO-PNP", "Witness Statements"],
    steps: defaultSteps
  },
  "Physical Violence (VAWC)": {
    description: "Acts that cause bodily or physical harm to a woman or her child, including battery or threatening physical harm (Sec. 5a, RA 9262).",
    requirements: ["Marriage Contract or Proof of Relationship", "Medico-Legal Certificate", "Photos of Physical Injuries", "Barangay Protection Order (if any)", "Police Blotter"],
    steps: defaultSteps
  },
  "Estafa": {
    description: "Defrauding another through unfaithfulness, abuse of confidence, or false pretenses (Art. 315, RPC).",
    requirements: ["Contracts / Agreements", "Receipts / Proof of Payment", "Demand Letter with Proof of Receipt", "Communication Logs (SMS/Email)"],
    steps: defaultSteps
  },
  "Bouncing Checks (BP 22)": {
    description: "Issuing a check without sufficient funds or failing to maintain funds (Batas Pambansa Blg. 22).",
    requirements: ["Original Bounced Check(s)", "Notice of Dishonor (Demand Letter)", "Registry Return Receipt (Proof of Demand)", "Bank Certification of Dishonor"],
    steps: defaultSteps
  },
  "Cyberlibel": {
    description: "Defamation committed through a computer system or social media platform (RA 10175).",
    requirements: ["Screenshots of Defamatory Content", "URLs / Links to the Posts", "Proof of Publication", "Witness Affidavits"],
    steps: defaultSteps
  },
  "Human Trafficking (RA 9208)": {
    description: "Recruitment, transportation, or harboring of persons for exploitation through force, fraud, or deception.",
    requirements: ["IACAT / Police Rescue Report", "Passport / Travel Documents (if applicable)", "Screenshots of Recruitment Ads", "Witness Statements"],
    steps: defaultSteps
  },

  // CIVIL
  "Annulment of Marriage": {
    description: "A legal proceeding to cancel a marriage that was valid at the start but has grounds like fraud or lack of consent (Art. 45, Family Code).",
    requirements: ["PSA Marriage Contract", "PSA Birth Certificates of Children", "Psychological Evaluation Report (if for Art. 36)", "Barangay Residency Certificate"],
    steps: defaultSteps
  },
  "Support": {
    description: "Petition to compel a parent/spouse to provide for sustenance, dwelling, and medical needs (Art. 194-208, Family Code).",
    requirements: ["PSA Birth Certificate of Child", "Proof of Financial Need (e.g., Tuition, Bills)", "Proof of Respondent's Income", "Marriage Contract"],
    steps: defaultSteps
  },
  "Unlawful Detainer": {
    description: "Summary action to recover possession of property when a tenant refuses to leave after the right to stay expires.",
    requirements: ["Land Title / Tax Declaration", "Lease Contract", "Demand Letter to Vacate", "Proof of Receipt of Demand", "Barangay Certificate to File Action"],
    steps: defaultSteps
  },

  // LABOR
  "Illegal Dismissal": {
    description: "Termination of an employee without just/authorized cause or without following due process (Art. 279, Labor Code).",
    requirements: ["Employment Contract / Appointment Letter", "Notice of Termination", "Latest Payslips & Company ID", "Affidavit of Witnesses"],
    steps: defaultSteps
  },
  "13th Month Pay": {
    description: "A claim for the mandatory 13th-month pay for employees who rendered at least 1 month of service (P.D. 851).",
    requirements: ["Company ID", "Payslips", "Proof of Non-payment", "Employment Records"],
    steps: defaultSteps
  },
  "OFW Claims": {
    description: "Assistance for Overseas Filipino Workers regarding illegal dismissal or unpaid benefits under POEA contracts.",
    requirements: ["POEA-approved Contract", "Passport / Visa", "Overseas Employment Certificate (OEC)", "Communication Logs with Agency"],
    steps: defaultSteps
  }
};

export const pAONotes = [
  "✔ All PAO services are COMPLETELY FREE. No lawyer fees or filing fees for qualified indigents.",
  "✔ Eligibility: You must pass the Indigency Test (Income Threshold) and the Merit Test (Legal Basis).",
  "✔ Conflict of Interest: PAO cannot represent both parties in the same case.",
  "✔ Preparation: Bring original documents and at least 3 photocopies to your appointment.",
  "✔ Priority: Criminal defense, VAWC, and labor disputes for the underprivileged take precedence."
];

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Police Report", "Subpoena"], steps: universalPaoFlow },
  Civil: { requirements: ["Relevant PSA Certificates", "Demand Letters"], steps: universalPaoFlow },
  Labor: { requirements: ["Company ID", "Payslips", "Contract"], steps: universalPaoFlow },
  Administrative: { requirements: ["Notice from Agency", "Evidence of Claim"], steps: universalPaoFlow }
};
