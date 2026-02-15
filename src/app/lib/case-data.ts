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
        "Malicious Mischief (Art. 327)"
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
        "Bouncing Checks (BP 22)", 
        "Anti-Fencing (PD 1612)", 
        "Cybercrime (RA 10175)",
        "Electricity Pilferage (RA 7832)",
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
      title: "🏛 GOVERNMENT & AGENCY CLAIMS",
      items: ["CSC Appeals", "SSS / GSIS Claims", "DARAB Cases", "Barangay Conciliation"]
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
  "Homicide (Art. 249)": {
    description: "Killing without qualifying circumstances of murder or parricide.",
    requirements: ["Death certificate", "Autopsy report", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Physical Injuries (Arts. 262–266)": {
    description: "Inflicting bodily harm resulting in serious, less serious, or slight injuries.",
    requirements: ["Medical Certificate (Original/Certified copy)", "Hospital records", "Photos of injuries", "Police blotter"],
    steps: universalPaoFlow
  },
  "Abortion (Arts. 256–259)": {
    description: "Prohibited and penalized acts regardless of whether practiced by the woman herself, parents, or medical professionals.",
    requirements: ["Medical records", "Witness affidavits", "Police report"],
    steps: universalPaoFlow
  },
  "Death in Tumultuous Affray (Art. 251)": {
    description: "Killing during a chaotic, unorganized fight where the specific killer cannot be determined.",
    requirements: ["Complaint-Affidavit (if filed)", "Subpoena or Warrant (if served)", "Police blotter", "Autopsy report"],
    steps: universalPaoFlow
  },
  "Discharge of Firearms (Art. 254 / RA 11926)": {
    description: "Shooting at another without intent to kill, or willful and indiscriminate discharge (as amended by RA 11926).",
    requirements: ["Police investigation report", "Ballistics report", "Witness affidavits", "Arrest report"],
    steps: universalPaoFlow
  },

  // --- CRIMES AGAINST PROPERTY ---
  "Robbery (Arts. 293–294)": {
    description: "Taking personal property with intent to gain through violence, intimidation, or force.",
    requirements: ["Police blotter report", "Sworn complaint-affidavit", "Medical certificate (if injured)", "Proof of ownership (receipt, title)", "CCTV footage"],
    steps: universalPaoFlow
  },
  "Theft (Art. 308)": {
    description: "Taking personal property without owner's consent and without violence.",
    requirements: ["Police report", "Affidavit of loss", "Proof of ownership", "CCTV footage", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Qualified Theft (Art. 310)": {
    description: "Theft with grave abuse of confidence, by domestic servants, or involving specific property.",
    requirements: ["Employment records", "Proof of trust relationship", "Inventory of stolen items", "Police investigation report"],
    steps: universalPaoFlow
  },
  "Estafa (Art. 315)": {
    description: "Defrauding another through abuse of confidence or deceit causing damage.",
    requirements: ["Written contract / agreement", "Promissory note", "Receipts", "Demand letter with proof of receipt", "Bank records / messages"],
    steps: universalPaoFlow
  },
  "Arson (Arts. 320–326)": {
    description: "Malicious burning of property.",
    requirements: ["Bureau of Fire Protection (BFP) report", "Photos of fire damage", "Witness affidavits", "Property title"],
    steps: universalPaoFlow
  },
  "Malicious Mischief (Art. 327)": {
    description: "Deliberate damage to property of another without intent to gain.",
    requirements: ["Photos of damaged property", "Repair estimates", "Police blotter", "Witness affidavits"],
    steps: universalPaoFlow
  },

  // --- LABOR LAW ---
  "Illegal Dismissal (Art. 294)": {
    description: "Employee dismissed without just cause, authorized cause, or due process. Entitled to reinstatement and backwages.",
    requirements: ["Employment contract", "Appointment letter", "Payslips", "Termination letter", "Notice to Explain (if any)", "Company ID"],
    steps: universalPaoFlow
  },
  "Just Causes for Termination (Art. 297)": {
    description: "Termination due to employee's serious misconduct, willful disobedience, gross neglect, or breach of trust.",
    requirements: ["Notice to Explain", "Written explanation of employee", "Incident reports", "Company rules", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Authorized Causes for Termination (Art. 298-299)": {
    description: "Termination due to business reasons like retrenchment, redundancy, closure, or disease.",
    requirements: ["Notice of termination", "DOLE notification copy", "Financial statements (if retrenchment)", "Medical certificate (if disease)"],
    steps: universalPaoFlow
  },
  "Unlawful Withholding of Wages (Art. 111-113)": {
    description: "Illegal deductions or non-payment of wages earned by the employee.",
    requirements: ["Payslips", "Employment contract", "Payroll records", "Computation of unpaid wages"],
    steps: universalPaoFlow
  },
  "Non-Payment of 13th Month Pay (PD 851)": {
    description: "Failure to provide the mandatory 13th month pay to employees who worked at least one month.",
    requirements: ["Payslips", "Payroll summary", "Computation of 13th month pay"],
    steps: universalPaoFlow
  },
  "Service Incentive Leave (SIL)": {
    description: "Entitlement of 5 days leave with pay for employees with at least one year of service.",
    requirements: ["Employment records", "Leave records", "Payslips"],
    steps: universalPaoFlow
  },
  "Holiday / Premium Pay": {
    description: "Payment for work done on holidays or rest days as prescribed by law.",
    requirements: ["DTR (Daily Time Record)", "Payslips", "Company holiday schedule"],
    steps: universalPaoFlow
  },
  "Night Shift Differential": {
    description: "Additional 10% compensation for work performed between 10 PM and 6 AM.",
    requirements: ["DTR showing 10 PM–6 AM work", "Payroll records"],
    steps: universalPaoFlow
  },
  "Separation Pay (Art. 298-299)": {
    description: "Financial assistance given to employees terminated due to authorized causes.",
    requirements: ["Termination notice", "Computation of separation pay", "Employment contract"],
    steps: universalPaoFlow
  },
  "Claims for Damages (Labor)": {
    description: "Claims for moral and exemplary damages due to illegal dismissal or bad faith actions by the employer.",
    requirements: ["Proof of dismissal", "Proof of bad faith", "Medical certificate (if emotional distress claimed)", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "OFW Money Claims (RA 8042/10022)": {
    description: "Claims for illegal dismissal or breach of overseas employment contract by recruitment agencies or foreign employers.",
    requirements: ["POEA-approved contract", "Passport & visa copy", "Deployment papers", "Proof of premature termination", "Payslips"],
    steps: universalPaoFlow
  },
  "Unfair Labor Practice (ULP)": {
    description: "Acts that violate the right of workers to self-organization or collective bargaining.",
    requirements: ["Union membership documents", "Termination letters", "Written communications", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Sexual Harassment (Workplace)": {
    description: "Acts involving sexual demands or conduct that create an intimidating, hostile, or offensive environment.",
    requirements: ["Screenshots/messages", "Written complaint", "Witness statements", "HR report", "CCTV (if any)"],
    steps: universalPaoFlow
  }
};

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Police Report", "Subpoena"], steps: universalPaoFlow },
  Civil: { requirements: ["PSA Certificates", "Proof of Ownership"], steps: universalPaoFlow },
  Labor: { requirements: ["Company ID", "Payslips", "Contract"], steps: universalPaoFlow },
  Administrative: { requirements: ["Notice from Agency", "Relevant Evidence"], steps: universalPaoFlow }
};
