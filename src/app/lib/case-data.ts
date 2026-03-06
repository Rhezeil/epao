
/**
 * @fileOverview Official legal database for LexConnect.
 * Standardized documentation and process flows based on official PAO, DOJ, and Supreme Court standards in the Philippines.
 */

export const caseCategories = {
  "Criminal": [
    {
      title: "🔴 I. CRIMES AGAINST PERSONS",
      items: [
        "Parricide (Art. 246)", 
        "Murder (Art. 248)", 
        "Homicide (Art. 249)", 
        "Physical Injuries (Arts. 262–266)",
        "Abortion (Arts. 256–259)",
        "Discharge of Firearms (Art. 254 / RA 11926)"
      ]
    },
    {
      title: "🟠 II. CRIMES AGAINST PROPERTY",
      items: [
        "Robbery (Arts. 293–294)", 
        "Theft (Art. 308)", 
        "Qualified Theft (Art. 310)", 
        "Estafa (Art. 315)", 
        "Arson (Arts. 320–326)", 
        "Malicious Mischief (Art. 327)",
        "Bouncing Checks (BP 22)", 
        "Anti-Fencing (PD 1612)",
        "Electricity Pilferage (RA 7832)"
      ]
    },
    {
      title: "⛓ III. CRIMES AGAINST PERSONAL LIBERTY",
      items: [
        "Kidnapping / Serious Illegal Detention (Art. 267)", 
        "Grave Threats (Art. 282)", 
        "Grave Coercion (Art. 286)"
      ]
    },
    {
      title: "🔞 IV. SEXUAL OFFENSES",
      items: [
        "Rape (Art. 266-A)", 
        "Acts of Lasciviousness (Art. 336)"
      ]
    },
    {
      title: "🏛 V. CRIMES AGAINST PUBLIC ORDER",
      items: [
        "Rebellion (Art. 134)",
        "Coup d'état (Art. 134-A)",
        "Sedition (Art. 139)",
        "Conspiracy to Commit Rebellion (Art. 136)"
      ]
    },
    {
      title: "🛡️ VI. SPECIAL CRIMINAL LAWS",
      items: [
        "Drug Cases (RA 9165)", 
        "VAWC Criminal (RA 9262)", 
        "Child Abuse (RA 7610)", 
        "Cybercrime (RA 10175)",
        "Illegal Recruitment (RA 8042)"
      ]
    },
    {
      title: "⚖️ VII. PROCEDURAL CRIMINAL MATTERS",
      items: [
        "Bail (Rule 114)", 
        "Habeas Corpus (Rule 102)"
      ]
    }
  ],
  "Civil": [
    {
      title: "📖 I. FAMILY RELATIONS AND PERSONS",
      items: [
        "Declaration of Nullity of Marriage (Art. 36)",
        "Annulment of Marriage (Arts. 45–47)",
        "Support (Child or Spouse)",
        "Child Custody (Art. 213)",
        "VAWC Civil Protection Order (RA 9262)",
        "Petition for Habeas Corpus (Minor)",
        "Declaration of Presumptive Death (Art. 41)"
      ]
    },
    {
      title: "🏠 II. PROPERTY AND LAND DISPUTES",
      items: [
        "Unlawful Detainer / Forcible Entry",
        "Quieting of Title / Reconveyance",
        "Partition of Property (Art. 494)",
        "Easement / Right of Way",
        "Foreclosure of Mortgage Defense"
      ]
    },
    {
      title: "💰 III. OBLIGATIONS, CONTRACTS, AND DAMAGES",
      items: [
        "Breach of Contract",
        "Collection of Sum of Money",
        "Damages (Tort / Quasi-Delict Art. 2176)",
        "Defamation Civil Damages"
      ]
    },
    {
      title: "📜 IV. SPECIAL PROCEEDINGS",
      items: [
        "Guardianship (Rules 92–97)",
        "Settlement of Estate (Rule 74)",
        "Change of Name (Rule 103)",
        "Correction of Entry (Rule 108 / RA 9048)"
      ]
    },
    {
      title: "🛡️ V. OTHER SPECIAL CIVIL ACTIONS",
      items: [
        "Interpleader (Rule 62)",
        "Declaratory Relief (Rule 63)"
      ]
    }
  ],
  "Labor": [
    {
      title: "🔒 I. TERMINATION DISPUTES",
      items: [
        "Illegal Dismissal (Art. 294)",
        "Just Causes for Termination (Art. 297)",
        "Authorized Causes for Termination (Art. 298-299)"
      ]
    },
    {
      title: "💰 II. LABOR STANDARDS (MONEY CLAIMS)",
      items: [
        "Unlawful Withholding of Wages (Art. 111-113)",
        "Non-Payment of 13th Month Pay (PD 851)",
        "Service Incentive Leave (SIL)",
        "Holiday / Premium Pay",
        "Night Shift Differential",
        "Separation Pay (Art. 298-299)"
      ]
    },
    {
      title: "🛡️ III. OTHER LABOR MATTERS",
      items: [
        "Claims for Damages (Labor)",
        "OFW Money Claims (RA 8042/10022)",
        "Unfair Labor Practice (ULP)",
        "Sexual Harassment (Workplace)"
      ]
    }
  ],
  "Administrative": [
    {
      title: "🏛 I. DISCIPLINARY (CSC / GOVERNMENT)",
      items: [
        "Grave Misconduct (RRACCS)",
        "Conduct Prejudicial to Service",
        "Violation of Ethical Standards (RA 6713)",
        "Administrative Neglect of Duty"
      ]
    },
    {
      title: "👮 II. DISCIPLINARY (POLICE / PNP)",
      items: [
        "PNP Administrative Complaint (RA 6975)",
        "Police Grave Misconduct",
        "IAS Disciplinary Proceeding"
      ]
    },
    {
      title: "⚖️ III. QUASI-JUDICIAL (GENERAL)",
      items: [
        "Agrarian Dispute (DARAB/RA 6657)",
        "Immigration / Deportation Case",
        "Anti-Torture Complaint (RA 9745)"
      ]
    }
  ]
};

export const standardPaoDocs = [
  "Certificate of Indigency from Barangay Chairman (Original)",
  "OR DSWD Certification of Indigent Status",
  "Latest ITR, Payslip, OR Affidavit of No Income",
  "Valid Government-issued ID (Original + 2 Photocopies)",
  "Proof of Residency (Utility bill or Voter's Certificate)",
  "Subpoena or Court Summons (If already in court)",
  "Complaint-Affidavit or Sworn Statement (For complainants)"
];

export const universalPaoFlow = [
  { 
    step: 1, 
    title: "Documentary Pre-screening", 
    content: "Prepare proofs of indigency and all documents related to your legal concern. Ensure you have photocopies of all originals." 
  },
  { 
    step: 2, 
    title: "Client Interview", 
    content: "A Public Attorney will conduct an interview to assess both the Indigency Test (financial status) and the Merit Test (legal basis of the case)." 
  },
  { 
    step: 3, 
    title: "Affidavit Preparation", 
    content: "If qualified, the lawyer will assist in drafting affidavits, petitions, or legal responses required for your specific matter." 
  },
  { 
    step: 4, 
    title: "Legal Representation", 
    content: "The office will officially handle your case, including mediation (SENA/Barangay), court representation, or notary services." 
  }
];

export const pAONotes = [
  "Indigency Test: Your net income must not exceed the agency regional threshold (currently based on minimum wage standards).",
  "Merit Test: The Public Attorney must determine that the case has a reasonable chance of success and is not intended to harass.",
  "Conflict of Interest: PAO cannot represent two parties with opposing interests in the same case.",
  "Free Service: All legal services are free. Only minimal court filing fees or publication costs (if required by law) are paid by the client.",
  "Priority: Priority is given to detained persons, women and children in VAWC cases, and indigent laborers."
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description: string }> = {
  // --- CRIMINAL ---
  "Parricide (Art. 246)": {
    description: "Killing of spouse, parent, child, or legitimate ascendant/descendant. Requires proof of relationship.",
    requirements: ["PSA Birth Certificate (Accused/Victim)", "PSA Marriage Certificate", "Death Certificate of victim", "Police Investigation Report", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Murder (Art. 248)": {
    description: "Killing with qualifying circumstances like treachery, price, reward, or evident premeditation.",
    requirements: ["Autopsy Report (Post-mortem)", "Death Certificate", "Police Blotter/Investigation Report", "CCTV Footage (If available)", "Ballistics/Chemistry Report (If relevant)"],
    steps: universalPaoFlow
  },
  "Homicide (Art. 249)": {
    description: "Killing without the qualifying circumstances mentioned in Art. 248.",
    requirements: ["Death Certificate", "Post-Mortem Examination", "Police Blotter", "Witness Sworn Statements", "Medico-Legal Certificate"],
    steps: universalPaoFlow
  },
  "Physical Injuries (Arts. 262–266)": {
    description: "Serious, less serious, or slight bodily harm inflicted on another.",
    requirements: ["Medical Certificate (Original)", "Hospital Records/Discharge Summary", "Photographs of injuries", "Police Blotter", "Barangay Certification to File Action (If applicable)"],
    steps: universalPaoFlow
  },
  "Qualified Theft (Art. 310)": {
    description: "Theft with grave abuse of confidence, or involving motor vehicles, coconuts, or large cattle.",
    requirements: ["Contract of Employment/ID (For abuse of confidence)", "Inventory of missing items", "CCTV/Security Logs", "Proof of ownership (Receipts/TCT)", "Police Report"],
    steps: universalPaoFlow
  },
  "Estafa (Art. 315)": {
    description: "Fraud by deceit or abuse of confidence resulting in financial damage.",
    requirements: ["Written Agreements/Contracts", "Dishonored Checks/Bank Return Slips", "Demand Letter with proof of receipt", "Proof of payment/transfer", "Screenshots of messages"],
    steps: universalPaoFlow
  },
  "Drug Cases (RA 9165)": {
    description: "Possession, sale, or delivery of dangerous drugs.",
    requirements: ["Copy of Information (Charge Sheet)", "Inventory of Seized Items", "Chemistry Report (PDEA/PNP)", "Chain of Custody Form", "Arrest Report (Booking Form)"],
    steps: universalPaoFlow
  },
  "VAWC Criminal (RA 9262)": {
    description: "Violence (Physical, Sexual, Psychological, Economic) against women and their children.",
    requirements: ["Medical Certificate", "PSA Marriage Certificate/Birth Certificate of child", "Barangay Protection Order (If any)", "Psychological Evaluation Report", "Threatening messages/Evidence of abuse"],
    steps: universalPaoFlow
  },

  // --- CIVIL ---
  "Declaration of Nullity of Marriage (Art. 36)": {
    description: "Marriage declared void from the beginning due to psychological incapacity.",
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates of children", "Psychological Evaluation Report (Clinical)", "Witness Testimonies (Friends/Family)", "Certificate of No Marriage (CENOMAR)"],
    steps: universalPaoFlow
  },
  "Support (Child or Spouse)": {
    description: "Legal petition for financial support for children or a spouse.",
    requirements: ["PSA Birth Certificate of child", "Proof of father's income (If known)", "List of monthly expenses (Education, Food, Health)", "Demand Letter for support", "Marriage Certificate (For spouse)"],
    steps: universalPaoFlow
  },
  "Unlawful Detainer / Forcible Entry": {
    description: "Ejection cases involving illegal possession of land or buildings.",
    requirements: ["Transfer Certificate of Title (TCT) / Tax Declaration", "Demand Letter to Vacate (With proof of receipt)", "Lease Contract (If any)", "Barangay Certification to File Action", "Proof of non-payment of rent"],
    steps: universalPaoFlow
  },

  // --- LABOR ---
  "Illegal Dismissal (Art. 294)": {
    description: "Termination of employment without just or authorized cause.",
    requirements: ["Notice of Dismissal (Termination Letter)", "Company ID / Payslips", "Employment Contract", "SENA Referral Form (Failed mediation)", "Evidence of whistleblowing or illegal acts"],
    steps: universalPaoFlow
  },
  "Unlawful Withholding of Wages (Art. 111-113)": {
    description: "Claims for unpaid salaries, 13th month pay, or separation pay.",
    requirements: ["Payslips / Bank Statement", "Time Cards / Attendance Records", "Daily Time Record (DTR)", "Company ID", "Notice of separation"],
    steps: universalPaoFlow
  },

  // --- ADMINISTRATIVE ---
  "Violation of Ethical Standards (RA 6713)": {
    description: "Complaints against government employees for corruption or unethical conduct.",
    requirements: ["Sworn Complaint-Affidavit", "Official Records of the transaction", "Witness statements", "Proof of public office employment", "Evidence of misconduct (Photos/Audio)"],
    steps: universalPaoFlow
  }
};

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Subpoena/Summons", "Police Blotter", "Affidavits"], steps: universalPaoFlow },
  Civil: { requirements: ["PSA Certificates", "Land Title/Tax Dec", "Barangay Certificate"], steps: universalPaoFlow },
  Labor: { requirements: ["Payslips", "Company ID", "SENA Referral"], steps: universalPaoFlow },
  Administrative: { requirements: ["Official Complaint", "Public Records", "Service Record"], steps: universalPaoFlow }
};
