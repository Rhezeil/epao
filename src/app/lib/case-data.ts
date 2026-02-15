/**
 * @fileOverview Refined legal database for LexConnect.
 * Standardized documentation and process flows based on official PAO standards.
 */

export const caseCategories = {
  "Criminal": [
    {
      title: "🔴 I. CRIMES AGAINST PERSONS",
      items: ["Parricide (Art. 246)", "Murder (Art. 248)", "Homicide (Art. 249)", "Physical Injuries (Arts. 262–266)"]
    },
    {
      title: "🟠 II. CRIMES AGAINST PROPERTY",
      items: ["Robbery (Arts. 293–294)", "Theft (Art. 308)", "Qualified Theft (Art. 310)", "Estafa (Art. 315)", "Arson (Arts. 320–326)", "Malicious Mischief (Art. 327)"]
    },
    {
      title: "⛓ III. CRIMES AGAINST PERSONAL LIBERTY",
      items: ["Kidnapping / Serious Illegal Detention (Art. 267)", "Grave Threats (Art. 282)", "Grave Coercion (Art. 286)"]
    },
    {
      title: "🔞 IV. SEXUAL OFFENSES",
      items: ["Rape (Art. 266-A)", "Acts of Lasciviousness (Art. 336)"]
    },
    {
      title: "🛡️ V. SPECIAL CRIMINAL LAWS",
      items: ["Drug Cases (RA 9165)", "VAWC (RA 9262)", "Child Abuse (RA 7610)", "Bouncing Checks (BP 22)", "Illegal Recruitment (RA 8042)", "Anti-Fencing (PD 1612)", "Cybercrime (RA 10175)"]
    },
    {
      title: "⚖️ VI. PROCEDURAL CRIMINAL MATTERS",
      items: ["Bail (Rule 114)", "Habeas Corpus (Rule 102)"]
    }
  ],
  "Civil": [
    {
      title: "📖 I. FAMILY RELATIONS",
      items: ["Annulment of Marriage", "Legal Separation", "Support", "Custody of Children", "Adoption"]
    },
    {
      title: "🏠 II. PROPERTY & LAND",
      items: ["Unlawful Detainer", "Forcible Entry", "Recovery of Possession", "Partition"]
    }
  ],
  "Labor": [
    {
      title: "🔒 I. TERMINATION & TENURE",
      items: ["Illegal Dismissal", "Constructive Dismissal", "Separation Pay"]
    },
    {
      title: "💰 II. MONETARY CLAIMS",
      items: ["Unpaid Wages", "13th Month Pay", "Overtime Pay"]
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
  "Certificate of Indigency from Barangay Chairman (Residence jurisdiction)",
  "OR Certificate of Indigency from DSWD/MSWD",
  "Latest ITR, pay slip, or Certificate of No Income",
  "Valid Government-issued ID (SSS, PhilHealth, Voter's, etc.)",
  "Relevant Case Documents (Complaint, Summons, Police Report)"
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
    content: "Provide proof of indigency (e.g., Certificate of Indigency, Income Tax Return, or Pay Slip), Valid ID, and documents related to the case." 
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
    description: "Killing of spouse, parent, child, or legitimate ascendant/descendant. Elements: A person is killed; Accused killed the person; Victim is a spouse or close relative.",
    requirements: ["Death certificate", "Autopsy report", "Marriage/Birth certificate (proof of relationship)", "Witness affidavits", "CCTV footage"],
    steps: universalPaoFlow
  },
  "Murder (Art. 248)": {
    description: "Killing with qualifying circumstances (treachery, price/reward, poison, fire, evident premeditation, or cruelty).",
    requirements: ["Autopsy report", "Medico-legal report", "Police investigation report", "Witness statements", "Weapon recovered (if any)"],
    steps: universalPaoFlow
  },
  "Homicide (Art. 249)": {
    description: "Killing a person without the qualifying circumstances of murder or parricide.",
    requirements: ["Death certificate", "Autopsy report", "Witness affidavits", "Police Blotter"],
    steps: universalPaoFlow
  },
  "Physical Injuries (Arts. 262–266)": {
    description: "Inflicting bodily harm resulting in mutilation, serious, less serious, or slight injuries.",
    requirements: ["Medical certificate", "Hospital records", "Photos of injuries", "Police blotter", "Witness affidavits"],
    steps: universalPaoFlow
  },

  // --- CRIMES AGAINST PROPERTY ---
  "Robbery (Arts. 293–294)": {
    description: "Taking personal property with intent to gain through violence, intimidation, or force.",
    requirements: ["Police report", "Sworn complaint-affidavit", "Medical certificate (if injured)", "Proof of ownership", "CCTV footage"],
    steps: universalPaoFlow
  },
  "Theft (Art. 308)": {
    description: "Taking personal property without consent and without violence, with intent to gain.",
    requirements: ["Affidavit of loss", "Proof of ownership (receipts)", "CCTV footage", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Qualified Theft (Art. 310)": {
    description: "Theft committed with grave abuse of confidence, by domestic servants, or involving specific property.",
    requirements: ["Employment records", "Proof of trust relationship", "Inventory of stolen items", "Police investigation report"],
    steps: universalPaoFlow
  },
  "Estafa (Art. 315)": {
    description: "Defrauding another through abuse of confidence or deceit causing damage.",
    requirements: ["Contract / agreement", "Promissory note", "Receipts / Proof of payment", "Demand letter with proof of receipt", "Bank records", "Screenshots / chat messages"],
    steps: universalPaoFlow
  },
  "Arson (Arts. 320–326)": {
    description: "The malicious burning of property, including inhabited houses or public buildings.",
    requirements: ["Bureau of Fire Protection (BFP) report", "Photos of fire damage", "Witness affidavits", "Property title / Proof of ownership"],
    steps: universalPaoFlow
  },
  "Malicious Mischief (Art. 327)": {
    description: "Deliberate damage to the property of another without intent to gain.",
    requirements: ["Photos of damaged property", "Repair estimates", "Police blotter", "Witness affidavits", "CCTV footage"],
    steps: universalPaoFlow
  },

  // --- PERSONAL LIBERTY ---
  "Kidnapping / Serious Illegal Detention (Art. 267)": {
    description: "Depriving a person of liberty through kidnapping or serious illegal detention.",
    requirements: ["Witness statements", "CCTV footage", "Communication records (ransom/threats)", "Police rescue report"],
    steps: universalPaoFlow
  },
  "Grave Threats (Art. 282)": {
    description: "Threatening another with the infliction of a wrong amounting to a crime.",
    requirements: ["Threatening messages / recordings", "Screenshots", "Witness testimony"],
    steps: universalPaoFlow
  },
  "Grave Coercion (Art. 286)": {
    description: "Compelling another to do something against their will using violence or intimidation.",
    requirements: ["Police report", "Video evidence", "Witness affidavits"],
    steps: universalPaoFlow
  },

  // --- SEXUAL OFFENSES ---
  "Rape (Art. 266-A)": {
    description: "Sexual assault as defined under Art. 266-A of the RPC as amended by RA 8353.",
    requirements: ["Medico-legal certificate", "Victim affidavit", "Birth certificate (if minor)", "Psychological evaluation report"],
    steps: universalPaoFlow
  },
  "Acts of Lasciviousness (Art. 336)": {
    description: "Committing lascivious acts under circumstances which would constitute rape but without penetration.",
    requirements: ["Victim statement", "Medical report", "Witness affidavits"],
    steps: universalPaoFlow
  },

  // --- SPECIAL LAWS ---
  "Drug Cases (RA 9165)": {
    description: "Violations of the Comprehensive Dangerous Drugs Act (Sale, Possession, or Use).",
    requirements: ["Chemistry report", "Seizure inventory / Receipt of property seized", "Chain of custody documentation", "Arrest report"],
    steps: universalPaoFlow
  },
  "VAWC (RA 9262)": {
    description: "Violence against women and their children, covering physical, sexual, psychological, and economic abuse.",
    requirements: ["Police blotter", "Marriage/Birth certificate (proof of relation)", "Screenshots of threats", "Medical report / Medico-legal"],
    steps: universalPaoFlow
  },
  "Child Abuse (RA 7610)": {
    description: "Special protection of children against abuse, exploitation, and discrimination.",
    requirements: ["Birth certificate of victim", "Medical report", "Social worker's assessment", "Photos/Videos of abuse"],
    steps: universalPaoFlow
  },
  "Bouncing Checks (BP 22)": {
    description: "Issuing a check without sufficient funds or drawing against a closed account.",
    requirements: ["Original dishonored check", "Bank return slip", "Written demand letter", "Proof of receipt of demand letter"],
    steps: universalPaoFlow
  },
  "Illegal Recruitment (RA 8042)": {
    description: "Recruitment activities for overseas employment without a valid license or authority.",
    requirements: ["Receipts of payment", "Employment contract", "Recruitment advertisement / Postings", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Anti-Fencing (PD 1612)": {
    description: "Buying, possessing, or selling property knowing it was stolen.",
    requirements: ["Proof property was stolen", "Proof of possession by accused", "Receipt of sale (if any)"],
    steps: universalPaoFlow
  },
  "Cybercrime (RA 10175)": {
    description: "Crimes committed through computer systems (Cyber-Libel, Identity Theft, etc.).",
    requirements: ["Screenshots with URLs", "Email headers / logs", "Digital forensic report (if available)", "Police cybercrime report"],
    steps: universalPaoFlow
  },

  // --- PROCEDURAL ---
  "Bail (Rule 114)": {
    description: "The security given for the release of a person in custody of the law.",
    requirements: ["Copy of Information", "Commitment Order", "Bail petition / Motion"],
    steps: universalPaoFlow
  },
  "Habeas Corpus (Rule 102)": {
    description: "A writ requiring a person under arrest to be brought before a judge or into court.",
    requirements: ["Proof of detention", "Affidavit of illegal restraint", "Verified Petition"],
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
