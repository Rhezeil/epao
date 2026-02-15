/**
 * @fileOverview Shared case category data for LexConnect.
 * Detailed requirements and steps based on official PAO guidance.
 */

export const caseCategories = {
  Criminal: [
    {
      title: "Revised Penal Code",
      items: ["Murder", "Homicide", "Parricide", "Infanticide", "Serious Physical Injuries", "Less Serious Physical Injuries", "Slight Physical Injuries", "Theft", "Qualified Theft", "Robbery", "Robbery with Homicide", "Estafa", "Arson", "Malicious Mischief", "Libel", "Slander (Oral Defamation)", "Incriminating an Innocent Person", "Acts of Lasciviousness", "Seduction", "Concubinage", "Adultery", "Direct Assault", "Resistance and Disobedience", "Illegal Possession of Firearms"]
    },
    {
      title: "Special Criminal Laws",
      items: ["Dangerous Drugs (RA 9165)", "VAWC (RA 9262)", "Cybercrime (RA 10175)", "Bouncing Checks (BP 22)", "Child Abuse (RA 7610)", "Anti-Rape Law (RA 8353)"]
    }
  ],
  Civil: [
    {
      title: "Civil Code Cases",
      items: ["Collection of Sum of Money", "Breach of Contract", "Damages", "Property Disputes", "Partition of Property", "Unlawful Detainer", "Forcible Entry"]
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
  "Special & Social": [
    {
      title: "Protection & Rights",
      items: ["Anti-Trafficking", "Anti-Child Pornography", "Anti-Hazing", "Illegal Recruitment", "Juvenile Justice Cases"]
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
    title: "Establish Eligibility (Indigency Test)", 
    content: "Prove indigent status via Barangay/DSWD Certificate or ITR/Payslip." 
  },
  { 
    step: 2, 
    title: "Locate Nearest PAO Office", 
    content: "Visit the district office assigned to your city or provincial hall." 
  },
  { 
    step: 3, 
    title: "Initial Consultation", 
    content: "A lawyer will evaluate your case for legal merit (ensuring it is not frivolous)." 
  },
  { 
    step: 4, 
    title: "Submit Documents", 
    content: "Provide all evidence related to your case." 
  },
  { 
    step: 5, 
    title: "Case Assignment", 
    content: "If accepted, an attorney is assigned to draft pleadings or represent you in court." 
  }
];

/**
 * Granular data for specific case types
 */
export const caseSpecificData: Record<string, { requirements: string[], steps: any[] }> = {
  "Annulment of Marriage": {
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates of children", "Psychological Evaluation (Article 36 cases)", "Proof of spouse's residence"],
    steps: [
      { step: 1, title: "Merit Evaluation", content: "Strict evaluation of grounds for annulment." },
      { step: 2, title: "Psychological Assessment", content: "Client must undergo evaluation (usually shoulders cost)." },
      { step: 3, title: "Petition Drafting", content: "Lawyer prepares the formal petition." },
      { step: 4, title: "Trial", content: "Court hearings with witnesses and experts." },
      { step: 5, title: "Registration", content: "Final court order is registered with the Civil Registry." }
    ]
  },
  "Child Support": {
    requirements: ["Birth Certificate of child", "Proof of relationship", "Proof of financial capacity of parent", "Proof support is not being given"],
    steps: [
      { step: 1, title: "Consultation", content: "Review of relationship and financial proof." },
      { step: 2, title: "Demand Letter", content: "Lawyer sends a formal demand to the other parent." },
      { step: 3, title: "Petition Filing", content: "Filing for Support in Family Court." },
      { step: 4, title: "Hearing", content: "Presentation of child's needs and parent's capacity." },
      { step: 5, title: "Order", content: "Court issues order for monthly support." }
    ]
  },
  "Collection of Sum of Money": {
    requirements: ["Written contract / Promissory Note", "Receipts / Proof of payment", "Demand Letter (required)", "Proof of non-payment"],
    steps: [
      { step: 1, title: "Document Review", content: "Review of the debt proof and demand letter." },
      { step: 2, title: "Complaint Drafting", content: "Lawyer prepares the formal complaint." },
      { step: 3, title: "Mediation", content: "Mandatory court-annexed mediation attempt." },
      { step: 4, title: "Trial", content: "Presentation of debt evidence in court." },
      { step: 5, title: "Decision", content: "Judge issues ruling on the money claim." }
    ]
  },
  "Illegal Dismissal": {
    requirements: ["Employment contract", "Termination letter", "Payslips", "Company ID", "Notice to Explain"],
    steps: [
      { step: 1, title: "NLRC Filing", content: "Initial complaint filed before the NLRC." },
      { step: 2, title: "Conciliation", content: "Mandatory conference to settle the dispute." },
      { step: 3, title: "Position Papers", content: "Submission of sworn statements and evidence." },
      { step: 4, title: "Decision", content: "Labor Arbiter issues a decision." },
      { step: 5, title: "Appeal", content: "Optional appeal to the NLRC Commission." }
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
    steps: [
      { step: 1, title: "Initial Interview", content: "Review of the complaint or arrest circumstances." },
      { step: 2, title: "Indigency & Merit Test", content: "Checking financial status and legal basis." },
      { step: 3, title: "Pleading Preparation", content: "Drafting Counter-Affidavits or Complaints." },
      { step: 4, title: "Prosecutor Filing", content: "Representation during preliminary investigation." },
      { step: 5, title: "Court Representation", content: "Defense or prosecution assistance during trial." }
    ]
  },
  Civil: {
    requirements: [
      "Demand Letter (Sent before filing)",
      "Contracts or Written Agreements",
      "Land Titles / Tax Decs (for property cases)",
      "Receipts / Proof of Damages"
    ],
    steps: [
      { step: 1, title: "Demand Check", content: "Verifying if a formal demand was already made." },
      { step: 2, title: "Complaint Preparation", content: "Drafting the civil complaint or petition." },
      { step: 3, title: "Filing & Summons", content: "Initiating the case in proper court." },
      { step: 4, title: "Mediation", content: "Mandatory settlement negotiation phase." },
      { step: 5, title: "Trial", content: "Formal presentation of evidence." }
    ]
  },
  "Family Law": {
    requirements: [
      "PSA Marriage Certificate",
      "PSA Birth Certificates",
      "Evidence of Abuse (for VAWC cases)",
      "Proof of relationship and financial capacity"
    ],
    steps: [
      { step: 1, title: "Legal Evaluation", content: "Strict merit test for family petitions." },
      { step: 2, title: "Petition Drafting", content: "Preparation of support, custody, or nullity papers." },
      { step: 3, title: "Family Court Filing", content: "Initiating proceedings in specialized courts." },
      { step: 4, title: "Hearing", content: "Attendance at pre-trial and trial dates." },
      { step: 5, title: "Order/Decision", content: "Resolution of family status or support obligations." }
    ]
  }
};
