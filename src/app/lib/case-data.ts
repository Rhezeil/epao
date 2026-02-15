/**
 * @fileOverview Shared case category data for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

export const caseCategories = {
  Criminal: [
    {
      title: "Revised Penal Code (RPC)",
      items: ["Murder", "Homicide", "Parricide", "Infanticide", "Serious Physical Injuries", "Less Serious Physical Injuries", "Slight Physical Injuries", "Theft", "Qualified Theft", "Robbery", "Estafa (Swindling)", "Arson", "Malicious Mischief", "Libel", "Slander", "Acts of Lasciviousness", "Adultery", "Concubinage", "Direct Assault", "Resistance and Disobedience", "Illegal Possession of Firearms"]
    },
    {
      title: "Special Criminal Laws",
      items: ["Dangerous Drugs (RA 9165)", "VAWC (RA 9262)", "Child Protection (RA 7610)", "Anti-Rape Law (RA 8353)", "Cybercrime (RA 10175)", "Bouncing Checks (BP 22)"]
    }
  ],
  Civil: [
    {
      title: "Family Law Cases",
      items: ["Annulment of Marriage", "Declaration of Nullity of Marriage", "Legal Separation", "Child Custody", "Child Support", "Adoption", "Recognition of Foreign Divorce"]
    },
    {
      title: "Property & Money",
      items: ["Collection of Sum of Money", "Damages", "Property Disputes", "Partition of Property", "Unlawful Detainer (Ejectment)", "Forcible Entry", "Small Claims"]
    }
  ],
  Labor: [
    {
      title: "Employment Disputes",
      items: ["Illegal Dismissal", "Constructive Dismissal", "Non-payment of Wages", "Overtime Pay Claims", "Separation Pay", "13th Month Pay Claims", "Money Claims"]
    }
  ],
  "Special Legislation": [
    {
      title: "Social Legislation",
      items: ["Anti-Trafficking (RA 9208)", "Anti-Child Pornography (RA 9775)", "Anti-Hazing Law (RA 11053)", "Anti-Illegal Recruitment", "Juvenile Justice (RA 9344)"]
    }
  ],
  Administrative: [
    {
      title: "Quasi-Judicial Agencies",
      items: ["Civil Service Cases", "SSS / GSIS Claims", "DARAB Agrarian Disputes", "PRC Professional Cases", "Barangay Conciliation"]
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
  "Relevant evidence (contracts, receipts, police reports, etc.)"
];

export const universalPaoFlow = [
  { step: 1, title: "Client Interview", content: "Initial consultation with a public attorney to gather facts." },
  { step: 2, title: "Indigency Test", content: "Verification of financial status to qualify for free assistance." },
  { step: 3, title: "Merit Test", content: "Legal evaluation to ensure the case has basis and isn't frivolous." },
  { step: 4, title: "Document Completion", content: "Submission of all required forms and supporting evidence." },
  { step: 5, title: "Case Acceptance", content: "Formal approval of the case by the District Head or lawyer." },
  { step: 6, title: "Case Number Assignment", content: "The case is officially logged into the PAO monitoring system." },
  { step: 7, title: "Filing Before Proper Body", content: "Submitting the complaint/petition to the Prosecutor, Court, or Agency." },
  { step: 8, title: "Hearing / Trial", content: "Legal representation during mediation, conferences, and court trials." },
  { step: 9, title: "Decision", content: "Receiving the official judgment or resolution from the court/agency." }
];

export const defaultSteps = universalPaoFlow;

export const caseSpecificData: Record<string, { requirements: string[], steps: any[] }> = {
  // --- CRIMINAL (RPC) ---
  "Murder": {
    requirements: [
      "FOR COMPLAINANT: Police Blotter, Sworn Affidavit, Medico-Legal, Witness Affidavits",
      "FOR ACCUSED: Copy of Complaint, Arrest Warrant (if any), Subpoena, Bail Documents",
      "Valid ID & Indigency Documents"
    ],
    steps: universalPaoFlow
  },
  "Theft": {
    requirements: [
      "FOR COMPLAINANT: Police Report, List of missing items/value, CCTV/Witnesses",
      "FOR ACCUSED: Copy of Complaint, Subpoena",
      "Valid ID & Indigency Documents"
    ],
    steps: universalPaoFlow
  },
  
  // --- SPECIAL CRIMINAL ---
  "Dangerous Drugs (RA 9165)": {
    requirements: ["Arrest Report", "Chemistry Report (PDEA/PNP)", "Confiscation Receipt / Inventory", "Charge Sheet (Information)", "Subpoena"],
    steps: [
      { step: 1, title: "Inquest Representation", content: "PAO assists during the summary investigation by the prosecutor." },
      { step: 2, title: "Bail Hearing", content: "Application for temporary liberty (if the quantity allows)." },
      { step: 3, title: "Pre-Trial", content: "Simplification of issues and marking of evidence." },
      { step: 4, title: "Trial", content: "Strict verification of the chain of custody of evidence." },
      { step: 5, title: "Judgment", content: "Decision by the Regional Trial Court (RTC)." }
    ]
  },
  "VAWC (RA 9262)": {
    requirements: ["Police Blotter", "Medical Certificate / Psychological Eval", "Screenshots of messages / Photos", "Proof of Relationship (Marriage/Birth Cert)", "Birth Certificate of children"],
    steps: [
      { step: 1, title: "Filing of Complaint", content: "Submission to the Prosecutor or filing a Protection Order petition." },
      { step: 2, title: "Application for Protection Order", content: "Requesting a TPO (Temporary) or PPO (Permanent) for safety." },
      { step: 3, title: "Prosecutor Investigation", content: "Determining probable cause for criminal charges." },
      { step: 4, title: "Criminal Case Filing", content: "Filing the information in a Family Court." },
      { step: 5, title: "Trial", content: "Presentation of evidence and testimony." }
    ]
  },
  "Cybercrime (RA 10175)": {
    requirements: ["Screenshots of online activity", "URL Links", "Digital evidence (saved files)", "Police / NBI Cybercrime report", "Affidavit of Complainant"],
    steps: [
      { step: 1, title: "Complaint Filing", content: "Filing with the Specialized Cybercrime Prosecutor." },
      { step: 2, title: "Digital Evidence Evaluation", content: "Forensic verification of screenshots and digital trails." },
      { step: 3, title: "Prosecutor Resolution", content: "Determination of probable cause." },
      { step: 4, title: "RTC Cybercrime Court Trial", content: "Full trial in a court designated for cyber offenses." }
    ]
  },
  "Bouncing Checks (BP 22)": {
    requirements: ["Original Dishonored Check", "Bank Return Slip", "Written Demand Letter (with Registry Receipt)", "Proof of receipt of Demand Letter"],
    steps: universalPaoFlow
  },

  // --- CIVIL / FAMILY ---
  "Annulment of Marriage": {
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates of children", "Psychological Evaluation Report (for Article 36)", "IDs of both spouses", "Affidavit of Indigency"],
    steps: [
      { step: 1, title: "Case Evaluation", content: "Strict merit test to see if legal grounds for annulment exist." },
      { step: 2, title: "Filing Petition", content: "Submitting the case to the Family Court." },
      { step: 3, title: "Court Hearings", content: "Collusion investigation and pre-trial." },
      { step: 4, title: "Trial", content: "Presentation of psychologists and witnesses." },
      { step: 5, title: "Decision", content: "Judgment and subsequent registration with Civil Registry." }
    ]
  },
  "Child Support": {
    requirements: ["Child's Birth Certificate", "Proof of Parentage / Relationship", "Proof of parent's income (if available)", "Evidence that support is not being given"],
    steps: [
      { step: 1, title: "Demand Letter", content: "Written request to the other parent for support." },
      { step: 2, title: "Petition Filing", content: "Filing in the Family Court." },
      { step: 3, title: "Hearing", content: "Mediation and presentation of child's needs." },
      { step: 4, title: "Court Order", content: "Issuance of the Support Order." }
    ]
  },
  "Small Claims": {
    requirements: ["Contract / IOU / Promissory Note", "Receipts", "Demand Letter", "Filled out Statement of Claim Form"],
    steps: [
      { step: 1, title: "Filing Form", content: "Submitting the standardized claim form to the MTC." },
      { step: 2, title: "Hearing", content: "Summary hearing where lawyers are not allowed to appear for the parties." },
      { step: 3, title: "Decision", content: "Final judgment usually issued on the same day." }
    ]
  },

  // --- LABOR ---
  "Illegal Dismissal": {
    requirements: ["Employment Contract", "Latest Payslips", "Termination / Dismissal Letter", "Company ID", "Notice to Explain (if any)"],
    steps: [
      { step: 1, title: "Filing before NLRC", content: "Submitting the initial complaint (SENA)." },
      { step: 2, title: "Conciliation", content: "Mandatory meetings to try and reach a settlement." },
      { step: 3, title: "Position Papers", content: "Drafting and submitting sworn statements of facts and evidence." },
      { step: 4, title: "Decision", content: "Judgment by the Labor Arbiter." }
    ]
  },

  // --- SPECIAL LEGISLATION ---
  "Juvenile Justice (RA 9344)": {
    requirements: ["Minor's PSA Birth Certificate", "Police Report / Intake Form", "Social Worker Assessment Report"],
    steps: [
      { step: 1, title: "Social Worker Assessment", content: "Evaluating the child's discernment." },
      { step: 2, title: "Diversion Proceedings", content: "Alternative community-based resolutions without court filing." },
      { step: 3, title: "Court Proceedings", content: "Representation in Family Court if diversion is not applicable." }
    ]
  }
};

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: {
    requirements: ["Police Blotter / Complaint", "Subpoena / Court Order", "Valid ID & Indigency Documents"],
    steps: universalPaoFlow
  },
  Civil: {
    requirements: ["Contracts / Written Agreements", "Demand Letter", "Land Titles / Deeds (if property)", "Receipts / Evidence of Damage"],
    steps: universalPaoFlow
  },
  Labor: {
    requirements: ["Proof of Employment (ID/Payslips)", "Dismissal Notice", "Company Records"],
    steps: [
      { step: 1, title: "NLRC / SENA filing", content: "The initial step for labor disputes." },
      { step: 2, title: "Conciliation", content: "Attempting settlement." },
      { step: 3, title: "Position Paper", content: "Submission of evidence." },
      { step: 4, title: "Decision", content: "Arbiter's ruling." }
    ]
  }
};
