/**
 * @fileOverview Shared case category data for LexConnect.
 */

export const caseCategories = {
  Criminal: [
    {
      title: "Revised Penal Code (Persons)",
      items: ["Murder", "Homicide", "Parricide", "Infanticide", "Serious Physical Injuries", "Less Serious Physical Injuries", "Slight Physical Injuries"]
    },
    {
      title: "Revised Penal Code (Property)",
      items: ["Theft", "Qualified Theft", "Robbery", "Robbery with Homicide", "Estafa", "Arson", "Malicious Mischief"]
    },
    {
      title: "Revised Penal Code (Honor/Chastity)",
      items: ["Libel", "Slander", "Acts of Lasciviousness", "Seduction", "Concubinage", "Adultery"]
    },
    {
      title: "Dangerous Drugs (RA 9165)",
      items: ["Illegal Possession of Drugs", "Illegal Sale of Drugs", "Use of Dangerous Drugs", "Drug Den Operations", "Possession of Drug Paraphernalia"]
    },
    {
      title: "Special Laws",
      items: ["VAWC (RA 9262)", "Child Abuse (RA 7610)", "Rape (RA 8353)", "Cybercrime (RA 10175)", "Bouncing Checks (BP 22)"]
    }
  ],
  Civil: [
    {
      title: "Family Law",
      items: ["Annulment of Marriage", "Declaration of Nullity", "Legal Separation", "Child Custody", "Child Support", "Adoption", "Recognition of Foreign Divorce"]
    },
    {
      title: "Property & Contracts",
      items: ["Breach of Contract", "Collection of Sum of Money", "Damages", "Property Disputes", "Partition of Property"]
    },
    {
      title: "Ejectment & Small Claims",
      items: ["Unlawful Detainer", "Forcible Entry", "Small Claims Collection"]
    }
  ],
  Labor: [
    {
      title: "Dismissal & Wages",
      items: ["Illegal Dismissal", "Constructive Dismissal", "Non-payment of Wages", "Overtime Pay Claims", "Separation Pay", "13th Month Pay"]
    }
  ],
  "Special Legislation": [
    {
      title: "Protection Acts",
      items: ["Anti-Trafficking", "Anti-Child Pornography", "Anti-Hazing", "Anti-Illegal Recruitment", "Juvenile Justice Cases"]
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
  "Barangay Certificate of Indigency",
  "Affidavit of Indigency",
  "Proof of Income (Payslip / DSWD Certificate)",
  "Police Blotter or Complaint Report",
  "Court Subpoena or Notice (if any)"
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
      "Valid ID",
      "Barangay Certificate of Indigency",
      "Proof of Income",
      "Copy of Complaint / Information",
      "Arrest Warrant (if available)",
      "Police Blotter"
    ],
    steps: defaultSteps
  },
  Civil: {
    requirements: [
      "Valid ID",
      "Barangay Certificate of Indigency",
      "Proof of Income",
      "Land Title / Tax Dec (for Property)",
      "Marriage/Birth Cert (for Family)",
      "Demand Letter / Receipts"
    ],
    steps: defaultSteps
  }
};
