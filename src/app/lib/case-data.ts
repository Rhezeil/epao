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
  { step: 1, title: "Initial Consultation", content: "Visit PAO for an interview to determine eligibility based on the Indigency and Merit tests." },
  { step: 2, title: "Document Submission", content: "Submit all required documents including IDs, proof of indigency, and case-specific evidence." },
  { step: 3, title: "Case Assessment", content: "A Public Attorney will evaluate the merit of your case and prepare necessary pleadings or affidavits." },
  { step: 4, title: "Legal Representation", content: "Representation in court hearings, mediation, or administrative proceedings until resolution." }
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
    steps: [
      { step: 1, title: "Interview", content: "Interview by PAO lawyer to check Indigency + Merit Test." },
      { step: 2, title: "Acceptance", content: "If qualified, the case is accepted and a Control Number is assigned." },
      { step: 3, title: "Preparation", content: "Lawyer prepares Counter-Affidavits or Pleadings." },
      { step: 4, title: "Trial", content: "Representation in court hearings and appeals if necessary." }
    ]
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
    steps: [
      { step: 1, title: "Initial Interview", content: "Strict Indigency and Merit tests for civil petitions." },
      { step: 2, title: "Drafting", content: "Preparation of Complaint or Petition for filing." },
      { step: 3, title: "Mediation", content: "Mandatory court-annexed mediation if applicable." },
      { step: 4, title: "Trial", content: "Full trial proceedings until court decision." }
    ]
  }
};
