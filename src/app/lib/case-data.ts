/**
 * @fileOverview Shared case category data for LexConnect.
 * Detailed requirements and steps based on official PAO guidance.
 */

export const caseCategories = {
  Criminal: [
    {
      title: "Revised Penal Code - Crimes Against Persons",
      items: ["Murder", "Homicide", "Parricide", "Infanticide", "Serious Physical Injuries", "Less Serious Physical Injuries", "Slight Physical Injuries"]
    },
    {
      title: "Revised Penal Code - Crimes Against Property",
      items: ["Theft", "Qualified Theft", "Robbery (with violence / intimidation)", "Robbery with Homicide", "Estafa (Swindling)", "Arson", "Malicious Mischief"]
    },
    {
      title: "Revised Penal Code - Crimes Against Honor",
      items: ["Libel", "Slander (Oral Defamation)", "Incriminating an Innocent Person"]
    },
    {
      title: "Revised Penal Code - Crimes Against Chastity",
      items: ["Acts of Lasciviousness", "Seduction", "Concubinage", "Adultery"]
    },
    {
      title: "Revised Penal Code - Crimes Against Public Order",
      items: ["Direct Assault", "Resistance and Disobedience", "Illegal Possession of Firearms"]
    },
    {
      title: "Dangerous Drugs Cases (RA 9165)",
      items: ["Illegal Possession of Drugs", "Illegal Sale of Drugs", "Use of Dangerous Drugs", "Drug Den Operations", "Possession of Drug Paraphernalia", "Drug Planting (as defense)"]
    },
    {
      title: "Violence Against Women & Children (RA 9262)",
      items: ["Physical abuse", "Psychological abuse", "Economic abuse", "Protection Order cases"]
    },
    {
      title: "Child Protection Cases (RA 7610)",
      items: ["Child abuse", "Child exploitation", "Child trafficking"]
    },
    {
      title: "Anti-Rape Law (RA 8353)",
      items: ["Rape by sexual intercourse", "Rape by sexual assault"]
    },
    {
      title: "Cybercrime Cases (RA 10175)",
      items: ["Online libel", "Identity theft", "Online fraud", "Cybersex", "Computer-related fraud"]
    },
    {
      title: "Bouncing Checks Law (BP 22)",
      items: ["Issuance of bouncing checks"]
    }
  ],
  Civil: [
    {
      title: "Family Law Cases",
      items: ["Annulment of Marriage", "Declaration of Nullity of Marriage", "Legal Separation", "Child Custody", "Child Support", "Adoption (qualified cases)", "Recognition of Foreign Divorce"]
    },
    {
      title: "Civil Code Cases",
      items: ["Breach of Contract", "Collection of Sum of Money", "Damages", "Property Disputes", "Partition of Property"]
    },
    {
      title: "Ejectment Cases",
      items: ["Unlawful Detainer", "Forcible Entry"]
    },
    {
      title: "Small Claims",
      items: ["Collection of small debts (Small Claims)"]
    }
  ],
  Labor: [
    {
      title: "Labor Code Disputes",
      items: ["Illegal Dismissal", "Constructive Dismissal", "Non-payment of Wages", "Overtime Pay Claims", "Separation Pay", "13th Month Pay Claims", "Money Claims"]
    }
  ],
  "Special & Social": [
    {
      title: "Anti-Trafficking (RA 9208)",
      items: ["Human trafficking", "Forced labor", "Sexual exploitation"]
    },
    {
      title: "Anti-Child Pornography (RA 9775)",
      items: ["Production/distribution of child pornography"]
    },
    {
      title: "Anti-Hazing Law (RA 11053)",
      items: ["Hazing incidents in fraternities"]
    },
    {
      title: "Anti-Illegal Recruitment (RA 8042)",
      items: ["Illegal recruitment", "Recruitment scams"]
    },
    {
      title: "Juvenile Justice (RA 9344)",
      items: ["Representation of children in conflict with the law"]
    }
  ],
  Administrative: [
    {
      title: "Quasi-Judicial Cases",
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
  "All relevant evidence (contracts, receipts, police reports, etc.)"
];

export const defaultRequirements = generalRequirements;

export const defaultSteps = [
  { 
    step: 1, 
    title: "Establish Eligibility (Indigency)", 
    content: "PAO assists individuals who cannot afford private counsel. You must prove you are an indigent person, usually by providing a Certificate of Indigency from the Barangay Chairman or the Department of Social Welfare and Development (DSWD), or your latest income tax return/pay slip." 
  },
  { 
    step: 2, 
    title: "Initial Consultation", 
    content: "Meet with a public attorney to discuss the merits of your case. The PAO will evaluate the case to ensure it is not frivolous or without legal basis." 
  },
  { 
    step: 3, 
    title: "Document Preparation", 
    content: "The lawyer assists in drafting the following:\n\n• Complaint-Affidavit: A sworn statement detailing facts, parties, and evidence.\n• Witness Affidavits: Sworn statements from witnesses.\n• Supporting Evidence: Police reports, medical certificates (for physical injuries), photographs, and relevant documents." 
  },
  { 
    step: 4, 
    title: "Filing the Case", 
    content: "The PAO lawyer will assist in filing the complaint with the appropriate prosecutor's office (for criminal cases) or court." 
  },
  { 
    step: 5, 
    title: "Preliminary Investigation", 
    content: "For criminal complaints, the prosecutor will conduct a preliminary investigation to determine if there is probable cause to file a case in court." 
  }
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[] }> = {
  "Annulment of Marriage": {
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates of children", "Psychological Evaluation (Article 36 cases)", "Proof of spouse's residence", "Affidavit of Indigency"],
    steps: defaultSteps
  },
  "Child Support": {
    requirements: ["Birth Certificate of child", "Proof of relationship", "Proof of financial capacity of parent", "Proof support is not being given", "Barangay Certificate of Indigency"],
    steps: defaultSteps
  },
  "Collection of Sum of Money": {
    requirements: ["Written contract / Promissory Note", "Receipts / Proof of payment", "Demand Letter (required)", "Proof of non-payment", "Cedula"],
    steps: defaultSteps
  },
  "Illegal Dismissal": {
    requirements: ["Employment contract", "Termination letter", "Payslips", "Company ID", "Notice to Explain"],
    steps: [
      { step: 1, title: "Establish Eligibility", content: "Prove indigent status as per standard PAO guidelines." },
      { step: 2, title: "Initial Consultation", content: "Presentation of employment records to the public attorney." },
      { step: 3, title: "Filing before NLRC", content: "The initial complaint is filed before the National Labor Relations Commission." },
      { step: 4, title: "Mandatory Conciliation", content: "A conference is held to attempt a settlement between employer and employee." },
      { step: 5, title: "Position Papers", content: "Submission of sworn statements and evidence for the Labor Arbiter's decision." }
    ]
  }
};

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: {
    requirements: [
      "Police Blotter / Complaint Report",
      "Medical Certificate (if injuries)",
      "Witness Affidavits",
      "Copy of Complaint/Information (if already filed)",
      "Bail Documents (if applicable)"
    ],
    steps: defaultSteps
  },
  Civil: {
    requirements: [
      "Demand Letter (Sent before filing)",
      "Contracts or Written Agreements",
      "Land Titles / Tax Decs (for property cases)",
      "Receipts / Proof of Damages"
    ],
    steps: defaultSteps
  }
};
