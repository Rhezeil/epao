/**
 * @fileOverview Refined legal database for LexConnect.
 * Standardized documentation and process flows based on official PAO, DOJ, and Supreme Court standards.
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
  "OR Certificate of Indigency from DSWD",
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
    description: "Killing without qualifying circumstance.",
    requirements: ["Death certificate", "Autopsy report", "Witness affidavits", "Police investigation report"],
    steps: universalPaoFlow
  },
  "Physical Injuries (Arts. 262–266)": {
    description: "Inflicting bodily harm (serious, less serious, slight). Requires medical evidence.",
    requirements: ["Medical Certificate (Original/Certified copy)", "Hospital records", "Photos of injuries", "Police blotter", "Witness affidavits", "Certificate to File Action (from Barangay)"],
    steps: universalPaoFlow
  },
  "Abortion (Arts. 256–259)": {
    description: "In the Philippines, abortion is prohibited and penalized regardless of whether it is practiced by the woman herself, her parents, or a physician.",
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
    requirements: ["Police blotter report", "Sworn complaint-affidavit", "Medical certificate (if injured)", "Proof of ownership (receipt, title)", "CCTV footage", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Theft (Art. 308)": {
    description: "Taking property without consent and without violence.",
    requirements: ["Police report", "Affidavit of loss", "Proof of ownership", "CCTV footage", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Qualified Theft (Art. 310)": {
    description: "Theft with grave abuse of confidence or involving special property like motor vehicles or large cattle.",
    requirements: ["Employment records", "Proof of trust relationship", "Proof of ownership", "CCTV", "Inventory of stolen items", "Police investigation report"],
    steps: universalPaoFlow
  },
  "Estafa (Art. 315)": {
    description: "Fraud by deceit or abuse of confidence causing damage.",
    requirements: ["Written contract / agreement", "Promissory note", "Receipts", "Demand letter with proof of receipt", "Screenshots / chat messages", "Bank records / messages"],
    steps: universalPaoFlow
  },
  "Arson (Arts. 320–326)": {
    description: "Malicious burning of property.",
    requirements: ["Bureau of Fire Protection (BFP) report", "Photos of fire damage", "Witness affidavits", "Property title / Tax declaration"],
    steps: universalPaoFlow
  },
  "Malicious Mischief (Art. 327)": {
    description: "Deliberate damage to property of another without intent to gain.",
    requirements: ["Photos of damaged property", "Repair estimates", "Police blotter", "Witness affidavits", "CCTV footage", "Proof of ownership"],
    steps: universalPaoFlow
  },
  "Bouncing Checks (BP 22)": {
    description: "Issuing a check without sufficient funds. A malum prohibitum offense.",
    requirements: ["Original dishonored check", "Bank return slip (NSF/Closed)", "Written demand letter", "Proof of receipt of demand", "Contract/Obligation proof"],
    steps: universalPaoFlow
  },
  "Anti-Fencing (PD 1612)": {
    description: "Buying, possessing, or selling property knowing it was stolen.",
    requirements: ["Police report of original theft/robbery", "Proof property was stolen", "Proof accused possessed item", "Receipts of sale", "Witness testimony"],
    steps: universalPaoFlow
  },
  "Electricity Pilferage (RA 7832)": {
    description: "Illegal use of electricity, jumper connections, or tampering with electric meters.",
    requirements: ["Inspection report by electric company", "Photographs of illegal connection", "Disconnection notice", "Meter tampering report"],
    steps: universalPaoFlow
  },

  // --- PERSONAL LIBERTY ---
  "Kidnapping / Serious Illegal Detention (Art. 267)": {
    description: "Illegal deprivation of liberty of a person.",
    requirements: ["Witness statements", "CCTV footage", "Communication records (ransom/threats)", "Rescue report", "Police investigation report"],
    steps: universalPaoFlow
  },
  "Grave Threats (Art. 282)": {
    description: "Threatening another with some wrong amounting to a crime.",
    requirements: ["Threatening messages / Screenshots", "Recorded audio/video", "Witness testimony", "Police blotter"],
    steps: universalPaoFlow
  },
  "Grave Coercion (Art. 286)": {
    description: "Compelling another by means of violence/intimidation to do something against his will.",
    requirements: ["Police report", "Video evidence", "Witness affidavits", "Medical certificate (if violence used)"],
    steps: universalPaoFlow
  },

  // --- SEXUAL OFFENSES ---
  "Rape (Art. 266-A)": {
    description: "Sexual assault as defined under Art. 266-A of the RPC as amended.",
    requirements: ["Medico-legal certificate", "Victim's sworn affidavit", "Birth certificate (if minor)", "Psychological evaluation", "Clothing evidence (if preserved)"],
    steps: universalPaoFlow
  },
  "Acts of Lasciviousness (Art. 336)": {
    description: "Committing lewd acts upon the person of another without the latter's consent.",
    requirements: ["Victim statement", "Medical report", "Witness affidavits", "Police investigation report"],
    steps: universalPaoFlow
  },

  // --- PUBLIC ORDER ---
  "Rebellion (Art. 134)": {
    description: "Public uprising to remove allegiance from the government.",
    requirements: ["Intelligence reports", "Firearms seized", "Witness testimony", "Arrest report", "Photos/Videos"],
    steps: universalPaoFlow
  },
  "Coup d'état (Art. 134-A)": {
    description: "Swift attack by military/police or civilians against government authority.",
    requirements: ["Military/Police reports", "Weapons seized", "Communications records", "Witness testimony"],
    steps: universalPaoFlow
  },
  "Sedition (Art. 139)": {
    description: "Public uprising to prevent execution of laws or inflict acts of hate.",
    requirements: ["Rally videos", "Social media posts", "Police dispersal report", "Witness affidavits", "Arrest records"],
    steps: universalPaoFlow
  },

  // --- CIVIL LAW: FAMILY ---
  "Declaration of Nullity of Marriage (Art. 36)": {
    description: "Marriage void from the beginning due to psychological incapacity or other Art. 35-38 grounds.",
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates of children", "Psychological evaluation report", "Proof of residency", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Annulment of Marriage (Arts. 45–47)": {
    description: "Voidable marriages due to fraud, intimidation, impotence, or lack of consent.",
    requirements: ["PSA Marriage Certificate", "Medical report (if impotence/incapacity)", "Evidence of fraud or force", "Witness statements"],
    steps: universalPaoFlow
  },
  "Support (Child or Spouse)": {
    description: "Legal obligation to provide financial support for sustenance and education.",
    requirements: ["PSA Birth Certificate", "Proof of relationship", "Proof of respondent's income (payslips)", "Demand letter", "Receipts of child's expenses"],
    steps: universalPaoFlow
  },
  "Child Custody (Art. 213)": {
    description: "Determination of custody for minor children based on the best interest rule.",
    requirements: ["PSA Birth Certificate", "School records", "Social worker report", "Proof of parent's fitness / unfitness"],
    steps: universalPaoFlow
  },
  "Declaration of Presumptive Death (Art. 41)": {
    description: "Court declaration when a spouse is absent for 4 years (2 in danger) for remarriage purposes.",
    requirements: ["PSA Marriage Certificate", "Proof of absence", "Police certification", "Affidavits of diligent search"],
    steps: universalPaoFlow
  },

  // --- CIVIL LAW: PROPERTY ---
  "Unlawful Detainer / Forcible Entry": {
    description: "Recovery of possession of property under Rule 70 of the Rules of Court.",
    requirements: ["Land Title (TCT/OCT)", "Lease Contract", "Demand to Vacate Letter", "Tax Declaration", "Barangay Certification"],
    steps: universalPaoFlow
  },
  "Quieting of Title / Reconveyance": {
    description: "Removing cloud over title or reclaiming ownership through judicial action.",
    requirements: ["Land Title", "Deed of Sale", "Tax Declaration", "Evidence of fraud (for Reconveyance)"],
    steps: universalPaoFlow
  },
  "Partition of Property (Art. 494)": {
    description: "Judicial or extrajudicial division of co-owned property.",
    requirements: ["Land Title", "Proof of co-ownership", "Death certificate (if inheritance)", "Tax Declaration"],
    steps: universalPaoFlow
  },
  "Easement / Right of Way": {
    description: "Right of access to landlocked property across another's land.",
    requirements: ["Land Title", "Survey Plan", "Proof property is landlocked", "Demand letter"],
    steps: universalPaoFlow
  },

  // --- CIVIL LAW: OBLIGATIONS & DAMAGES ---
  "Breach of Contract": {
    description: "Failure to comply with an obligation under Arts. 1159 and 1170 of the Civil Code.",
    requirements: ["Written Contract / Agreement", "Proof of Breach", "Demand Letter", "Receipts"],
    steps: universalPaoFlow
  },
  "Collection of Sum of Money": {
    description: "Judicial collection of unpaid loans or debts.",
    requirements: ["Promissory Note", "Loan Agreement", "Receipts", "Demand Letter", "Bank statement"],
    steps: universalPaoFlow
  },
  "Damages (Tort / Quasi-Delict Art. 2176)": {
    description: "Civil liability for damage caused by negligence or fault.",
    requirements: ["Police Report", "Medical Certificate / Death Certificate", "Receipts for expenses", "Photos of damage/injury", "Witness affidavits"],
    steps: universalPaoFlow
  },

  // --- CIVIL LAW: SPECIAL PROCEEDINGS ---
  "Guardianship (Rules 92–97)": {
    description: "Appointment of a guardian for the person and property of a minor or incompetent.",
    requirements: ["PSA Birth Certificate", "Medical Certificate (if incompetent)", "Financial documents (assets list)"],
    steps: universalPaoFlow
  },
  "Settlement of Estate (Rule 74)": {
    description: "Summary or extrajudicial settlement of a deceased person's estate.",
    requirements: ["Death Certificate", "Titles of properties", "PSA Birth Certificates of heirs", "Tax Declarations"],
    steps: universalPaoFlow
  },
  "Change of Name (Rule 103)": {
    description: "Judicial petition for change of name.",
    requirements: ["PSA Birth Certificate", "Police / NBI Clearance", "Publication proof (Newspaper)", "Official ID"],
    steps: universalPaoFlow
  },
  "Correction of Entry (Rule 108 / RA 9048)": {
    description: "Correction of clerical errors or substantial changes in civil registry entries.",
    requirements: ["PSA Certificate to be corrected", "Supporting documents (School/Baptismal)", "Affidavits"],
    steps: universalPaoFlow
  },

  // --- LABOR LAW ---
  "Illegal Dismissal (Art. 294)": {
    description: "Employee terminated without just/authorized cause or due process.",
    requirements: ["Employment Contract", "Appointment Letter", "Payslips", "Termination Letter", "Notice to Explain", "Company ID", "DTR"],
    steps: universalPaoFlow
  },
  "Just Causes for Termination (Art. 297)": {
    description: "Termination due to misconduct, disobedience, or gross neglect.",
    requirements: ["Notice to Explain", "Written explanation of employee", "Incident reports", "Company rules"],
    steps: universalPaoFlow
  },
  "Non-Payment of 13th Month Pay (PD 851)": {
    description: "Mandatory benefit for employees who worked at least 1 month.",
    requirements: ["Payslips", "Payroll summary", "Computation of unpaid amount"],
    steps: universalPaoFlow
  },
  "OFW Money Claims (RA 8042/10022)": {
    description: "Claims arising from overseas employment contracts.",
    requirements: ["POEA-approved contract", "Passport & Visa copy", "Deployment papers", "Proof of termination"],
    steps: universalPaoFlow
  },

  // --- ADMINISTRATIVE LAW ---
  "Grave Misconduct (RRACCS)": {
    description: "Disciplinary case against government employees involving intentional wrongdoing.",
    requirements: ["Sworn Complaint-Affidavit", "Service Record", "Official Records", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "PNP Administrative Complaint (RA 6975)": {
    description: "Complaints against police officers before IAS or NAPOLCOM.",
    requirements: ["Police Blotter", "Incident Report", "Body camera footage", "Medical report", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Agrarian Dispute (DARAB/RA 6657)": {
    description: "Disputes involving land tenancy or agrarian reform implementation.",
    requirements: ["CLOA / EP", "Leasehold contract", "Land Title / Tax Declaration", "BARC Certification"],
    steps: universalPaoFlow
  },
  "Anti-Torture Complaint (RA 9745)": {
    description: "Administrative liability for public officers committing torture.",
    requirements: ["Medical report", "Psychological evaluation", "Witness statements", "Detention records"],
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
