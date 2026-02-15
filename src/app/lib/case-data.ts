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
    title: "Establish Eligibility (Indigency)", 
    content: "PAO assists individuals who cannot afford private counsel. You must prove you are an indigent person, usually by providing a Certificate of Indigency from the Barangay or DSWD, or your latest income tax return/pay slip." 
  },
  { 
    step: 2, 
    title: "Initial Consultation", 
    content: "Meet with a public attorney to discuss the merits of your case. The PAO will evaluate the case to ensure it is not frivolous or without legal basis." 
  },
  { 
    step: 3, 
    title: "Document Preparation", 
    content: "The lawyer assists in drafting the Complaint-Affidavit (detailing facts and parties) and Witness Affidavits. You must submit supporting evidence such as police reports, medical certificates, or photographs." 
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
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates of children", "Psychological Evaluation (Article 36 cases)", "Proof of spouse's residence"],
    steps: defaultSteps
  },
  "Child Support": {
    requirements: ["Birth Certificate of child", "Proof of relationship", "Proof of financial capacity of parent", "Proof support is not being given"],
    steps: defaultSteps
  },
  "Collection of Sum of Money": {
    requirements: ["Written contract / Promissory Note", "Receipts / Proof of payment", "Demand Letter (required)", "Proof of non-payment"],
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
