/**
 * @fileOverview Shared case category data for LexConnect.
 */

export const caseCategories = {
  Criminal: [
    {
      title: "Crimes Against Persons",
      items: ["Murder", "Homicide", "Parricide", "Infanticide", "Serious Physical Injuries", "Less Serious Physical Injuries", "Slight Physical Injuries"]
    },
    {
      title: "Crimes Against Property",
      items: ["Theft", "Qualified Theft", "Robbery", "Robbery with Homicide", "Estafa", "Arson", "Malicious Mischief"]
    },
    {
      title: "Crimes Against Honor",
      items: ["Libel", "Slander (Oral Defamation)", "Incriminating an Innocent Person"]
    },
    {
      title: "Crimes Against Chastity",
      items: ["Acts of Lasciviousness", "Seduction", "Concubinage", "Adultery"]
    },
    {
      title: "Crimes Against Public Order",
      items: ["Direct Assault", "Resistance and Disobedience", "Illegal Possession of Firearms"]
    },
    {
      title: "Dangerous Drugs (RA 9165)",
      items: ["Illegal Possession of Drugs", "Illegal Sale of Drugs", "Use of Dangerous Drugs", "Drug Den Operations", "Possession of Drug Paraphernalia", "Drug Planting"]
    }
  ],
  Civil: [
    {
      title: "Collection & Property",
      items: ["Collection of Sum of Money", "Breach of Contract", "Damages", "Property Disputes", "Partition of Property"]
    },
    {
      title: "Ejectment",
      items: ["Unlawful Detainer", "Forcible Entry"]
    },
    {
      title: "Small Claims",
      items: ["Small Claims Collection"]
    }
  ],
  "Family Law": [
    {
      title: "Marriage & Children",
      items: ["Annulment of Marriage", "Declaration of Nullity", "Legal Separation", "Child Custody", "Child Support", "Adoption", "Recognition of Foreign Divorce"]
    }
  ],
  Labor: [
    {
      title: "Employment Disputes",
      items: ["Illegal Dismissal", "Constructive Dismissal", "Non-payment of Wages", "Overtime Pay Claims", "Separation Pay", "13th Month Pay Claims"]
    }
  ],
  "Special Laws": [
    {
      title: "Protection & Rights",
      items: ["VAWC (RA 9262)", "Cybercrime (RA 10175)", "Illegal Recruitment", "Anti-Trafficking", "Anti-Child Pornography", "Anti-Hazing", "Juvenile Justice Cases"]
    }
  ],
  Administrative: [
    {
      title: "Quasi-Judicial",
      items: ["Civil Service Cases", "SSS / GSIS Claims", "DARAB Agrarian Disputes", "PRC Cases", "Barangay Conciliation"]
    }
  ]
};

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const defaultRequirements = [
  "Valid Government ID",
  "Affidavit of Indigency",
  "Barangay Certificate of Indigency",
  "Proof of Income (Payslip / Certificate of No Income / DSWD Certificate)",
  "Community Tax Certificate (Cedula)",
  "All relevant evidence (contracts, receipts, police reports, etc.)"
];

export const defaultSteps = [
  { 
    step: 1, 
    title: "Establish Eligibility (Indigency Test)", 
    content: "You must prove you are an indigent person, usually by providing a Certificate of Indigency from the Barangay Chairman or the Department of Social Welfare and Development (DSWD), or your latest income tax return/pay slip." 
  },
  { 
    step: 2, 
    title: "Locate the Nearest PAO Office", 
    content: "Find the nearest district office (usually located within city/provincial halls or courts)." 
  },
  { 
    step: 3, 
    title: "Initial Consultation & Evaluation", 
    content: "Present your case to a public attorney. The PAO will evaluate the case for merit (ensure it is not frivolous or without legal basis)." 
  },
  { 
    step: 4, 
    title: "Submit Documents", 
    content: "Submit necessary documents (e.g., police report for criminal cases, demand letter for civil cases)." 
  },
  { 
    step: 5, 
    title: "Case Assignment", 
    content: "Once accepted, a public attorney will be assigned to handle the drafting of affidavits, complaints, or other required legal documents to initiate the lawsuit." 
  }
];

/**
 * Category-specific defaults for seeding and fallback
 */
export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: {
    requirements: [
      "Valid Government ID",
      "Affidavit of Indigency",
      "Barangay Certificate of Indigency",
      "Proof of Income",
      "Police Blotter / Complaint Report",
      "Medical Certificate (if injuries)",
      "Witness Affidavits"
    ],
    steps: [
      { step: 1, title: "Initial Interview", content: "Go to PAO for an initial interview and indigency verification." },
      { step: 2, title: "Merit Test", content: "Lawyer evaluates the case merit for filing or defense." },
      { step: 3, title: "Document Preparation", content: "Lawyer prepares Complaint-Affidavit or Counter-Affidavit." },
      { step: 4, title: "Prosecutor Filing", content: "Case is filed at the Prosecutor's Office for preliminary investigation." },
      { step: 5, title: "Trial Representation", content: "Representation during court hearings and trial proceedings." }
    ]
  },
  Civil: {
    requirements: [
      "Valid Government ID",
      "Affidavit of Indigency",
      "Barangay Certificate of Indigency",
      "Written Contract / Promissory Note",
      "Demand Letter (Required before filing)",
      "Proof of Ownership (Land Title / Tax Dec for property cases)"
    ],
    steps: [
      { step: 1, title: "Consultation", content: "Present case documents and proof of demand to the lawyer." },
      { step: 2, title: "Indigency & Merit Test", content: "Verification of financial status and legal basis for the claim." },
      { step: 3, title: "Drafting Complaint", content: "Lawyer drafts the formal complaint or petition." },
      { step: 4, title: "Mediation", content: "Attempts at mandatory court-annexed mediation." },
      { step: 5, title: "Trial & Decision", content: "Formal court proceedings followed by a judge's decision." }
    ]
  },
  "Family Law": {
    requirements: [
      "Valid Government ID",
      "Affidavit of Indigency",
      "PSA Marriage Certificate",
      "PSA Birth Certificates of children",
      "Proof of parent's income (for Support cases)",
      "Psychological Evaluation (for Annulment/Nullity - client shoulders cost)"
    ],
    steps: [
      { step: 1, title: "Case Evaluation", content: "Legal consultation and strict merit test for family-related petitions." },
      { step: 2, title: "Psychological Assessment", content: "Mandatory for Article 36 annulment cases (at client's expense)." },
      { step: 3, title: "Petition Drafting", content: "Preparation of the formal petition for support, custody, or annulment." },
      { step: 4, title: "Family Court Filing", content: "Filing and initial hearings in specialized Family Courts." },
      { step: 5, title: "Registration", content: "Official registration of court decisions with the Civil Registry." }
    ]
  },
  Labor: {
    requirements: [
      "Valid Government ID",
      "Employment Contract / Company ID",
      "Termination Letter (if dismissed)",
      "Payslips",
      "Notice to Explain (if any)"
    ],
    steps: [
      { step: 1, title: "NLRC Filing", content: "Initial filing of the complaint before the NLRC or DOLE." },
      { step: 2, title: "Mandatory Conciliation", content: "Compulsory conference to reach a settlement between parties." },
      { step: 3, title: "Position Papers", content: "Submission of sworn position papers and supporting evidence." },
      { step: 4, title: "Decision", content: "Issuance of the labor arbiter's decision." },
      { step: 5, title: "Appeal", content: "Filing an appeal if the decision is unfavorable." }
    ]
  }
};
