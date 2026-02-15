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
      items: ["Robbery", "Theft", "Qualified Theft", "Estafa", "Bouncing Checks (BP 22)", "Arson", "Anti-Fencing (PD 1612)"]
    },
    {
      title: "💖 IV. CRIMES AGAINST CHASTITY",
      items: ["Rape", "Acts of Lasciviousness", "Seduction", "Abduction", "Corruption of Minors"]
    },
    {
      title: "📡 V. CYBERCRIME & SPECIAL LAWS",
      items: ["Cyberlibel", "Online Scams", "Illegal Access", "Identity Theft", "Dangerous Drugs (RA 9165)", "Illegal Possession of Firearms"]
    },
    {
      title: "🏛 VI. CRIMES AGAINST PUBLIC ORDER & STATUS",
      items: ["Direct Assault", "Resistance and Disobedience", "Rebellion", "Bigamy", "Simulation of Birth"]
    }
  ],
  "Civil": [
    {
      title: "📖 I. FAMILY RELATIONS",
      items: ["Annulment of Marriage", "Declaration of Nullity", "Legal Separation", "Support", "Custody of Children"]
    },
    {
      title: "🏠 II. PROPERTY & CONTRACTS",
      items: ["Ejectment (Forcible Entry/Unlawful Detainer)", "Recovery of Possession", "Collection of Sum of Money", "Breach of Contract", "Damages"]
    },
    {
      title: "⚖️ III. SPECIAL PROCEEDINGS",
      items: ["Correction of Entries", "Guardianship", "Settlement of Estate", "Habeas Corpus"]
    }
  ],
  "Labor": [
    {
      title: "🔒 I. TERMINATION & TENURE",
      items: ["Illegal Dismissal", "Constructive Dismissal", "Illegal Suspension", "Regularization"]
    },
    {
      title: "💰 II. MONETARY CLAIMS",
      items: ["Non-payment of Wages", "13th Month Pay", "Service Incentive Leave", "Underpayment of Benefits"]
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

const standardPaoDocs = [
  "Affidavit of Indigency",
  "Barangay Certificate of Indigency",
  "Proof of Income (ITR, or Certification from Employer/DSWD)",
  "Valid Government-issued ID"
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description: string }> = {
  // --- CRIMINAL LAW ---
  "Murder": {
    description: "The unlawful killing of a person with qualifying circumstances such as treachery, taking advantage of superior strength, or for a price/reward (Art. 248, RPC).",
    requirements: [...standardPaoDocs, "Police Blotter/Report", "Sworn Complaint-Affidavit", "Medico-Legal Certificate", "Death Certificate", "Autopsy Report", "Witness Affidavits"],
    steps: [] 
  },
  "Homicide": {
    description: "The killing of a person without qualifying circumstances for murder and not being parricide or infanticide (Art. 249, RPC).",
    requirements: [...standardPaoDocs, "Police Report", "Death Certificate", "Medico-Legal Report", "Witness Statements"],
    steps: []
  },
  "Physical Violence (VAWC)": {
    description: "Acts that cause bodily or physical harm to a woman or her child, including battery or threatening physical harm (Sec. 5a, RA 9262).",
    requirements: [...standardPaoDocs, "Marriage Certificate/Proof of Relationship", "Medico-Legal Certificate", "Photos of injuries", "Barangay Protection Order (if any)", "Police Blotter"],
    steps: []
  },
  "Sexual Violence (VAWC)": {
    description: "Acts of a sexual nature including rape, sexual harassment, or prostituting the woman or child (Sec. 5b-c, RA 9262).",
    requirements: [...standardPaoDocs, "Proof of Relationship", "Medico-Legal Examination", "Psychological Evaluation", "Witness Affidavits"],
    steps: []
  },
  "Psychological Violence (VAWC)": {
    description: "Acts causing mental or emotional suffering, such as intimidation, stalking, public ridicule, or marital infidelity (Sec. 5h-i, RA 9262).",
    requirements: [...standardPaoDocs, "Proof of Relationship", "Psychological Evaluation Report", "Screenshots of threats/harassment", "Witness Affidavits"],
    steps: []
  },
  "Economic Abuse (VAWC)": {
    description: "Acts that make a woman financially dependent, such as withdrawing support or preventing her from working (Sec. 5e, RA 9262).",
    requirements: [...standardPaoDocs, "Marriage Certificate", "Birth Certificates of children", "Proof of respondent's income", "Evidence of non-support"],
    steps: []
  },
  "Robbery": {
    description: "Taking personal property belonging to another with intent to gain, by means of violence or intimidation against persons or force upon things (Art. 293-305, RPC).",
    requirements: [...standardPaoDocs, "Police Report", "Affidavit of Loss", "Proof of ownership", "Inventory of stolen items", "Photos of forced entry (if applicable)"],
    steps: []
  },
  "Theft": {
    description: "Taking personal property with intent to gain but without violence or intimidation (Art. 308, RPC).",
    requirements: [...standardPaoDocs, "Police Blotter", "Affidavit of Loss", "Proof of Ownership (Receipts)", "CCTV Footage (if any)"],
    steps: []
  },
  "Qualified Theft": {
    description: "Theft committed by a domestic servant, or with grave abuse of confidence, or involving specific items like motor vehicles (Art. 310, RPC).",
    requirements: [...standardPaoDocs, "Employment Records/Contract", "Police Report", "Affidavit of Loss", "Witness statements"],
    steps: []
  },
  "Estafa": {
    description: "Defrauding another through unfaithfulness, abuse of confidence, or false pretenses (Art. 315, RPC).",
    requirements: [...standardPaoDocs, "Contracts/Agreements", "Receipts/Proof of Payment", "Demand Letter with Proof of Receipt", "Communication logs"],
    steps: []
  },
  "Bouncing Checks (BP 22)": {
    description: "Issuing a check without sufficient funds or failing to maintain funds after issuance (Batas Pambansa Blg. 22).",
    requirements: [...standardPaoDocs, "Original Bounced Check", "Notice of Dishonor (Demand Letter)", "Registry Return Receipt", "Bank Certification of Dishonor"],
    steps: []
  },
  "Cyberlibel": {
    description: "Defamation committed through a computer system or social media (RA 10175).",
    requirements: [...standardPaoDocs, "Screenshots of defamatory posts", "URLs of the content", "Proof of Publication", "Witness Affidavits"],
    steps: []
  },
  "Dangerous Drugs (RA 9165)": {
    description: "Cases involving illegal possession, sale, or use of prohibited drugs. PAO handles defense for indigent accused (Sec. 5, 11, 15, RA 9165).",
    requirements: [...standardPaoDocs, "Inventory of Seized Items", "Chemistry Report", "Arrest Report", "Chain of Custody forms (for defense review)"],
    steps: []
  },
  "Bigamy": {
    description: "Contracting a second or subsequent marriage before the former marriage has been legally dissolved (Art. 349, RPC).",
    requirements: [...standardPaoDocs, "PSA Marriage Certificate (1st Marriage)", "PSA Marriage Certificate (2nd Marriage)", "CENOMAR", "Witness Affidavits"],
    steps: []
  },

  // --- CIVIL LAW ---
  "Annulment of Marriage": {
    description: "A legal proceeding to cancel a marriage that was valid at the start but has grounds for termination like fraud or lack of consent (Art. 45, Family Code).",
    requirements: [...standardPaoDocs, "PSA Marriage Contract", "PSA Birth Certificates of Children", "Psychological Evaluation (if ground is Art. 36)", "Barangay Residency Certificate"],
    steps: []
  },
  "Declaration of Nullity": {
    description: "A proceeding for marriages that were void from the beginning, such as bigamous or incestuous marriages (Art. 35-38, Family Code).",
    requirements: [...standardPaoDocs, "PSA Marriage Contract", "CENOMAR", "Witness Affidavits", "PSA Birth Certificates of Children"],
    steps: []
  },
  "Support": {
    description: "A petition to compel a parent or spouse to provide for the indispensable needs (sustenance, dwelling, medical) of the family (Art. 194-208, Family Code).",
    requirements: [...standardPaoDocs, "PSA Birth Certificate of Child", "Marriage Certificate (if spouse)", "Proof of financial need", "Proof of respondent's income"],
    steps: []
  },
  "Custody of Children": {
    description: "Legal dispute over who should have physical and legal care of a child (Art. 211-213, Family Code).",
    requirements: [...standardPaoDocs, "PSA Birth Certificate of Child", "Evidence of unfit parent (if applicable)", "Witness Affidavits", "Social Case Study Report"],
    steps: []
  },
  "Ejectment (Forcible Entry/Unlawful Detainer)": {
    description: "Summary legal action to recover possession of real property from someone who entered by force or stayed after their right expired.",
    requirements: [...standardPaoDocs, "Land Title/Tax Declaration", "Demand Letter to Vacate", "Proof of Receipt of Demand", "Barangay Certificate to File Action"],
    steps: []
  },
  "Collection of Sum of Money": {
    description: "A civil case to recover a specific amount of money owed from a loan or service rendered.",
    requirements: [...standardPaoDocs, "Promissory Note/Contract", "Demand Letter", "Proof of Receipt", "Statement of Account"],
    steps: []
  },

  // --- LABOR LAW ---
  "Illegal Dismissal": {
    description: "Termination of an employee without just/authorized cause or without following due process (Art. 279, Labor Code).",
    requirements: [...standardPaoDocs, "Employment Contract", "Notice of Termination", "Payslips/Company ID", "Witness Affidavits"],
    steps: []
  },
  "Constructive Dismissal": {
    description: "When an employee is forced to resign because continued employment is rendered impossible or unbearable due to the employer's actions.",
    requirements: [...standardPaoDocs, "Resignation Letter (if any)", "Evidence of harassment/demotion", "Company ID/Payslips"],
    steps: []
  },
  "13th Month Pay": {
    description: "A claim for the mandatory 13th-month pay for employees who rendered at least 1 month of service (P.D. 851).",
    requirements: [...standardPaoDocs, "Company ID", "Payslips", "Proof of non-payment", "Employment record"],
    steps: []
  },
  "OFW Claims": {
    description: "Legal assistance for Overseas Filipino Workers regarding illegal dismissal or unpaid benefits under POEA contracts.",
    requirements: [...standardPaoDocs, "POEA-approved Contract", "Passport/Visa", "OEC", "Notice of termination", "Communication logs with Agency"],
    steps: []
  }
};

export const universalPaoFlow = [
  { step: 1, title: "Initial Interview", content: "Client undergoes an interview to determine the facts of the case and immediate needs." },
  { step: 2, title: "Indigency Test", content: "Verification of financial status. Client must present proofs of low income or lack of property." },
  { step: 3, title: "Merit Test", content: "A PAO lawyer evaluates if the case has a valid legal basis and a reasonable chance of success." },
  { step: 4, title: "Conflict Check", content: "The office ensures they do not represent the opposing party in the same or related matter." },
  { step: 5, title: "Legal Action", content: "If qualified, the PAO provides representation, drafts affidavits, or files the necessary court petitions." }
];

export const defaultSteps = universalPaoFlow;

// Apply default steps to all entries
Object.keys(caseSpecificData).forEach(key => {
  if (caseSpecificData[key].steps.length === 0) {
    caseSpecificData[key].steps = defaultSteps;
  }
});

export const pAONotes = [
  "✔ All PAO services are COMPLETELY FREE. No lawyer fees or filing fees for qualified indigents.",
  "✔ Standard requirements: Valid ID, Proof of Indigency, and Barangay Certificate.",
  "✔ Merit Test: Cases must have a sound legal basis to be accepted for full representation.",
  "✔ The office prioritizes criminal defense, VAWC, and labor disputes for the underprivileged.",
  "✔ Bring original documents and at least 3 photocopies to your appointment."
];

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: [...standardPaoDocs, "Police Report", "Subpoena"], steps: universalPaoFlow },
  Civil: { requirements: [...standardPaoDocs, "Relevant PSA Certificates", "Demand Letters"], steps: universalPaoFlow },
  Labor: { requirements: [...standardPaoDocs, "Company ID", "Payslips", "Contract"], steps: universalPaoFlow },
  Administrative: { requirements: [...standardPaoDocs, "Notice from Agency", "Evidence of Claim"], steps: universalPaoFlow }
};
