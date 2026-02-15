/**
 * @fileOverview Refined legal database for LexConnect.
 * Standardized documentation and process flows based on official PAO and DOJ standards.
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
        "Death in Tumultuous Affray (Art. 251)",
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
        "Support - Child or Spouse (Arts. 194–208)",
        "Child Custody (Art. 213)",
        "VAWC Civil Protection Order (RA 9262)",
        "Petition for Habeas Corpus (Minor)",
        "Declaration of Presumptive Death (Art. 41)"
      ]
    },
    {
      title: "🏠 II. PROPERTY AND LAND DISPUTES",
      items: [
        "Unlawful Detainer / Forcible Entry (Rule 70)",
        "Quieting of Title / Reconveyance",
        "Partition of Property (Art. 494)",
        "Easement / Right of Way (Art. 649)",
        "Foreclosure of Mortgage Defense"
      ]
    },
    {
      title: "💰 III. OBLIGATIONS, CONTRACTS, AND DAMAGES",
      items: [
        "Breach of Contract (Art. 1159)",
        "Collection of Sum of Money",
        "Damages (Tort / Quasi-Delict Art. 2176)",
        "Defamation Civil Damages (Arts. 19-21)"
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
      title: "⚖️ III. QUASI-JUDICIAL DISPUTES",
      items: [
        "Agrarian Dispute (DARAB/RA 6657)",
        "Immigration / Deportation Case",
        "NLRC Labor Appeal (Admin)"
      ]
    },
    {
      title: "🛡️ IV. SPECIAL ADMINISTRATIVE CASES",
      items: [
        "Anti-Torture Complaint (RA 9745)",
        "Election / BEI Service Incident",
        "Social Welfare Officer Incident (ALSWDOPI)"
      ]
    }
  ]
};

export const standardPaoDocs = [
  "Certificate of Indigency from Barangay Chairman (residency jurisdiction)",
  "OR Certificate of Indigency from DSWD/MSWD",
  "Latest ITR, pay slip, or Certificate of No Income",
  "Valid Government-issued ID (SSS, PhilHealth, Voter's, etc.)",
  "Case-Related Documents (Complaints, summons, affidavits, or police reports)",
  "Merit Test: The case must not be frivolous and must have legal basis."
];

export const universalPaoFlow = [
  { 
    step: 1, 
    title: "Locate Nearest Office", 
    content: "Find the nearest PAO district office, usually located near courts or local government units. PAO operates nationwide to serve indigent litigants." 
  },
  { 
    step: 2, 
    title: "Submit Requirements", 
    content: "Provide proof of indigency (e.g., Certificate of Indigency, ITR, or Pay Slip), Valid ID, and documents related to the case (e.g., complaint, subpoena)." 
  },
  { 
    step: 3, 
    title: "Client Interview & Evaluation", 
    content: "A public attorney will interview you to determine if the case has merit (Merit Test) and if you qualify for assistance (Indigency Test)." 
  },
  { 
    step: 4, 
    title: "Acceptance & Case Assignment", 
    content: "Upon approval, a lawyer is officially assigned to your case to provide counseling, mediation, or representation." 
  }
];

export const pAONotes = [
  "Indigency Test: Your net income must meet the agency's regional threshold.",
  "Merit Test: The case must not be frivolous and must have legal basis.",
  "Conflict of Interest: PAO cannot represent opposing parties in the same matter.",
  "Free Service: All legal services provided by PAO are free of charge.",
  "Eligibility: Must provide proof of indigency and valid government ID."
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description: string }> = {
  // --- CRIMES AGAINST PERSONS ---
  "Parricide (Art. 246)": {
    description: "Killing of spouse, parent, child, or legitimate ascendant/descendant. Requires proof of relationship.",
    requirements: ["Death certificate", "Autopsy report", "Marriage/Birth certificate (proof of relationship)", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Murder (Art. 248)": {
    description: "Killing with qualifying circumstances (treachery, cruelty, evident premeditation, etc.).",
    requirements: ["Autopsy report", "Medico-legal report", "Police investigation report", "Witness statements", "Weapon recovered"],
    steps: universalPaoFlow
  },
  "Physical Injuries (Arts. 262–266)": {
    description: "Inflicting bodily harm resulting in serious, less serious, or slight injuries. Requires medical evidence.",
    requirements: ["Medical Certificate (Original/Certified copy)", "Hospital records", "Photos of injuries", "Police blotter", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Abortion (Arts. 256–259)": {
    description: "Prohibited and penalized acts regardless of whether practiced by the woman herself, parents, or medical professionals.",
    requirements: ["Medical records", "Witness affidavits", "Police report", "Birth certificate (if applicable)"],
    steps: universalPaoFlow
  },
  "Discharge of Firearms (Art. 254 / RA 11926)": {
    description: "Shooting at another without intent to kill, or willful and indiscriminate discharge (as amended by RA 11926).",
    requirements: ["Police investigation report", "Ballistics report", "Witness affidavits", "Arrest report", "Paraffin test (if available)"],
    steps: universalPaoFlow
  },

  // --- CRIMES AGAINST PROPERTY ---
  "Robbery (Arts. 293–294)": {
    description: "Taking personal property with intent to gain through violence, intimidation, or force.",
    requirements: ["Police blotter report", "Sworn complaint-affidavit", "Medical certificate (if injured)", "Proof of ownership (receipt, title)", "CCTV footage"],
    steps: universalPaoFlow
  },
  "Estafa (Art. 315)": {
    description: "Defrauding another through abuse of confidence or deceit causing damage.",
    requirements: ["Written contract / agreement", "Promissory note", "Receipts", "Demand letter with proof of receipt", "Bank records / messages"],
    steps: universalPaoFlow
  },
  "Bouncing Checks (BP 22)": {
    description: "Issuing a check without sufficient funds or against a closed account. A malum prohibitum offense.",
    requirements: ["Original dishonored check", "Bank return slip (NSF/Closed)", "Written demand letter", "Proof of receipt of demand", "Contract/Obligation proof"],
    steps: universalPaoFlow
  },

  // --- ADMINISTRATIVE LAW ---
  "Grave Misconduct (RRACCS)": {
    description: "Administrative offense by government employees involving intentional wrongdoing or flagrant disregard of rules.",
    requirements: ["Sworn complaint-affidavit", "Official service record", "Notice of charge", "Witness affidavits", "Agency memoranda"],
    steps: universalPaoFlow
  },
  "Violation of Ethical Standards (RA 6713)": {
    description: "Violation of the Code of Conduct and Ethical Standards for Public Officials and Employees.",
    requirements: ["SALN (if applicable)", "Official records", "Written complaints", "Proof of violation of ethics", "Service record"],
    steps: universalPaoFlow
  },
  "PNP Administrative Complaint (RA 6975)": {
    description: "Administrative charges against police officers filed before the IAS or NAPOLCOM.",
    requirements: ["Police blotter", "Incident report", "Body camera footage (if any)", "Witness affidavits", "Medical report (if physical abuse)"],
    steps: universalPaoFlow
  },
  "Agrarian Dispute (DARAB/RA 6657)": {
    description: "Disputes involving land tenancy, leasehold, or implementation of agrarian reform laws.",
    requirements: ["CLOA (Certificate of Land Ownership Award)", "Leasehold contract", "Land title / Tax declaration", "BARC certification", "Photos of land"],
    steps: universalPaoFlow
  },
  "Anti-Torture Complaint (RA 9745)": {
    description: "Administrative or criminal liability of public officers committing torture or other cruel treatments.",
    requirements: ["Medical report", "Psychological evaluation", "Witness statements", "Police detention records", "Photos of injuries"],
    steps: universalPaoFlow
  },
  "Immigration / Deportation Case": {
    description: "Administrative proceedings before the Bureau of Immigration regarding visa violations or deportation.",
    requirements: ["Passport copy", "Visa documents", "Alien Certificate of Registration (ACR)", "Notice of charge", "Affidavit of support/residency"],
    steps: universalPaoFlow
  }
};

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Police Report", "Subpoena"], steps: universalPaoFlow },
  Civil: { requirements: ["PSA Certificates", "Proof of Ownership"], steps: universalPaoFlow },
  Labor: { requirements: ["Company ID", "Payslips", "Contract"], steps: universalPaoFlow },
  Administrative: { requirements: ["Official Records", "Sworn Complaint", "Service Record"], steps: universalPaoFlow }
};
