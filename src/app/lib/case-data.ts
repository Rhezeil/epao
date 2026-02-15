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
        "Illegal Recruitment (RA 8042)", 
        "Anti-Fencing (PD 1612)", 
        "Cybercrime (RA 10175)",
        "Electricity Pilferage (RA 7832)"
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
        "Habeas Corpus - Custody of Minor",
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
    description: "Killing of spouse, parent, child, or legitimate ascendant/descendant. Requires proof of valid relationship.",
    requirements: ["Death certificate", "Autopsy report", "Marriage/Birth certificate (proof of relationship)", "Witness affidavits", "CCTV footage"],
    steps: universalPaoFlow
  },
  "Murder (Art. 248)": {
    description: "Killing with qualifying circumstances such as treachery, price/reward, poison, fire, or evident premeditation.",
    requirements: ["Autopsy report", "Medico-legal report", "Police investigation report", "Witness statements", "Weapon recovered"],
    steps: universalPaoFlow
  },
  "Homicide (Art. 249)": {
    description: "Killing without qualifying circumstances of murder or parricide.",
    requirements: ["Death certificate", "Autopsy report", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Physical Injuries (Arts. 262–266)": {
    description: "Inflicting bodily harm resulting in serious, less serious, or slight injuries. Requires medical documentation.",
    requirements: ["Medical certificate", "Hospital records", "Photos of injuries", "Police blotter", "Certificate to File Action (Barangay)"],
    steps: universalPaoFlow
  },
  "Abortion (Arts. 256–259)": {
    description: "Prohibited acts penalized under Articles 256-259 RPC, whether practiced by the woman herself or others.",
    requirements: ["Medical records", "Witness affidavits", "Police report", "Sworn statements from involved parties"],
    steps: universalPaoFlow
  },
  "Death in Tumultuous Affray (Art. 251)": {
    description: "Killing during a chaotic fight involving several people where the specific killer cannot be determined.",
    requirements: ["Complaint-Affidavit", "Subpoena or Warrant of Arrest (if served)", "Police blotter", "Autopsy report", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Discharge of Firearms (Art. 254 / RA 11926)": {
    description: "Shooting at another without intent to kill, or willful and indiscriminate discharge of any firearm.",
    requirements: ["Police investigation report", "Ballistics report", "Paraffin test results (if available)", "Witness affidavits", "Seizure receipt of firearm"],
    steps: universalPaoFlow
  },

  // --- CRIMES AGAINST PROPERTY ---
  "Robbery (Arts. 293–294)": {
    description: "Taking personal property with intent to gain through violence, intimidation, or force.",
    requirements: ["Police blotter report", "Sworn complaint-affidavit", "Medical certificate (if injured)", "Proof of ownership (receipt, title)", "CCTV footage", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Theft (Art. 308)": {
    description: "Taking personal property without consent and without violence, with intent to gain.",
    requirements: ["Police report", "Affidavit of loss", "Proof of ownership", "CCTV footage", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Qualified Theft (Art. 310)": {
    description: "Theft committed with grave abuse of confidence, by domestic servants, or involving specific property.",
    requirements: ["Employment records", "Proof of trust relationship", "Inventory of stolen items", "Police investigation report", "CCTV"],
    steps: universalPaoFlow
  },
  "Estafa (Art. 315)": {
    description: "Defrauding another through abuse of confidence or deceit causing damage.",
    requirements: ["Written contract / agreement", "Promissory note", "Receipts / Proof of payment", "Demand letter with proof of receipt", "Bank records", "Screenshots / chat messages"],
    steps: universalPaoFlow
  },
  "Arson (Arts. 320–326)": {
    description: "Malicious burning of property, including inhabited houses or public buildings.",
    requirements: ["Bureau of Fire Protection (BFP) report", "Photos of fire damage", "Witness affidavits", "Property title / Proof of ownership"],
    steps: universalPaoFlow
  },
  "Malicious Mischief (Art. 327)": {
    description: "Deliberate damage to property of another without intent to gain.",
    requirements: ["Photos of damaged property", "Repair estimates", "Police blotter", "Witness affidavits", "CCTV footage"],
    steps: universalPaoFlow
  },

  // --- CRIMES AGAINST PUBLIC ORDER ---
  "Rebellion (Art. 134)": {
    description: "Rising publicly and taking arms against the government to remove allegiance or deprive powers.",
    requirements: ["Intelligence reports", "Firearms seized", "Witness testimony", "Arrest report", "Videos/photos"],
    steps: universalPaoFlow
  },
  "Coup d'état (Art. 134-A)": {
    description: "Swift attack by military/police or civilians against government authority to seize power.",
    requirements: ["Military/Police reports", "Weapons seized", "Intelligence records", "Communications (orders/messages)"],
    steps: universalPaoFlow
  },
  "Sedition (Art. 139)": {
    description: "Public uprising to prevent execution of laws or inflict acts of hate/revenge.",
    requirements: ["Rally videos", "Social media posts", "Police dispersal report", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Conspiracy to Commit Rebellion (Art. 136)": {
    description: "Agreement between two or more persons to commit rebellion.",
    requirements: ["Recorded communications", "Meetings documentation", "Confessions", "Witness testimony"],
    steps: universalPaoFlow
  },

  // --- SPECIAL CRIMINAL LAWS ---
  "Drug Cases (RA 9165)": {
    description: "Violations of the Comprehensive Dangerous Drugs Act (Sale, Possession, or Use).",
    requirements: ["Chemistry report", "Seizure inventory", "Chain of custody documentation", "Arrest report"],
    steps: universalPaoFlow
  },
  "VAWC Criminal (RA 9262)": {
    description: "Criminal aspect of Violence Against Women and Their Children (Physical, Sexual, Psychological, Economic).",
    requirements: ["Police blotter", "Marriage/Birth certificate", "Screenshots of threats", "Medical report / Medico-legal", "Affidavit of victim"],
    steps: universalPaoFlow
  },
  "Bouncing Checks (BP 22)": {
    description: "Issuing a check without sufficient funds or drawing against a closed account.",
    requirements: ["Original dishonored check", "Bank return slip", "Written demand letter", "Proof of receipt of demand letter"],
    steps: universalPaoFlow
  },
  "Anti-Fencing (PD 1612)": {
    description: "Buying, possessing, or selling property knowing it was stolen.",
    requirements: ["Police report of original theft", "Proof property was stolen", "Proof of possession by accused", "Sale receipts"],
    steps: universalPaoFlow
  },
  "Electricity Pilferage (RA 7832)": {
    description: "Illegal use of electricity, jumper connections, or tampering with electric meters.",
    requirements: ["Inspection report by electric company", "Photographs of illegal connection", "Meter tampering report", "Affidavit of inspecting officer"],
    steps: universalPaoFlow
  },
  "Cybercrime (RA 10175)": {
    description: "Crimes committed through computer systems (Cyber-Libel, Identity Theft, etc.).",
    requirements: ["Screenshots with URLs", "Email headers / logs", "Digital forensic report", "Police cybercrime report"],
    steps: universalPaoFlow
  },

  // --- FAMILY RELATIONS AND PERSONS ---
  "Declaration of Nullity of Marriage (Art. 36)": {
    description: "Marriage void from the beginning due to psychological incapacity or other grounds under Arts. 35-38.",
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates of children", "Psychological evaluation report", "Proof of residency", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Annulment of Marriage (Arts. 45–47)": {
    description: "Voidable marriages due to fraud, intimidation, impotence, or lack of consent.",
    requirements: ["Marriage certificate", "Medical report (impotence/incapacity)", "Evidence of fraud or force", "Witness statements"],
    steps: universalPaoFlow
  },
  "Support - Child or Spouse (Arts. 194–208)": {
    description: "Legal obligation to provide financial support for sustenance and welfare.",
    requirements: ["Birth certificate", "Proof of relationship", "Proof of respondent’s income", "Demand letter", "Receipts of expenses"],
    steps: universalPaoFlow
  },
  "Child Custody (Art. 213)": {
    description: "Determination of custody for minor children based on the best interest of the child.",
    requirements: ["Birth certificate", "School records", "Proof of neglect/abuse", "Social worker report"],
    steps: universalPaoFlow
  },
  "VAWC Civil Protection Order (RA 9262)": {
    description: "Petition for TPO/PPO and damages in cases of domestic violence.",
    requirements: ["Police blotter", "Medical certificate", "Screenshots/messages", "Marriage certificate / Birth certificates"],
    steps: universalPaoFlow
  },
  "Habeas Corpus - Custody of Minor": {
    description: "Illegal detention or wrongful custody of a minor child.",
    requirements: ["Birth certificate", "Proof of custody rights", "Affidavit of illegal detention", "Police report"],
    steps: universalPaoFlow
  },
  "Declaration of Presumptive Death (Art. 41)": {
    description: "Judicial declaration for remarrying when a spouse has been absent for 4 years.",
    requirements: ["Marriage certificate", "Proof of absence", "Police certification", "Affidavits of diligent search"],
    steps: universalPaoFlow
  },

  // --- PROPERTY AND LAND DISPUTES ---
  "Unlawful Detainer / Forcible Entry (Rule 70)": {
    description: "Recovery of physical possession of property within one year of unlawful deprivation.",
    requirements: ["Land title (TCT/OCT)", "Lease contract", "Demand to vacate letter", "Tax declaration"],
    steps: universalPaoFlow
  },
  "Quieting of Title / Reconveyance": {
    description: "Removing cloud over title or reclaiming ownership through judicial action.",
    requirements: ["Land title", "Deed of sale", "Tax declaration", "Evidence of fraud (if reconveyance)"],
    steps: universalPaoFlow
  },
  "Partition of Property (Art. 494)": {
    description: "Division of common property among co-owners.",
    requirements: ["Title", "Proof of co-ownership", "Death certificate (if inheritance)"],
    steps: universalPaoFlow
  },
  "Easement / Right of Way (Art. 649)": {
    description: "Right of access for landlocked property to public highway.",
    requirements: ["Land title", "Survey plan", "Proof property is landlocked", "Demand letter"],
    steps: universalPaoFlow
  },
  "Foreclosure of Mortgage Defense": {
    description: "Defense against extrajudicial or judicial foreclosure of real estate mortgage.",
    requirements: ["Loan agreement", "Promissory note", "Mortgage contract", "Notice of foreclosure"],
    steps: universalPaoFlow
  },

  // --- OBLIGATIONS AND CONTRACTS ---
  "Breach of Contract (Art. 1159)": {
    description: "Failure to comply with contractual obligations without valid excuse.",
    requirements: ["Written contract", "Proof of breach", "Demand letter", "Receipts"],
    steps: universalPaoFlow
  },
  "Collection of Sum of Money": {
    description: "Action to recover unpaid loans or monetary debts.",
    requirements: ["Promissory note", "Loan agreement", "Receipts", "Demand letter"],
    steps: universalPaoFlow
  },
  "Damages (Tort / Quasi-Delict Art. 2176)": {
    description: "Civil action for damages caused by fault or negligence.",
    requirements: ["Police report", "Medical certificate", "Receipts", "Photos", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Defamation Civil Damages (Arts. 19-21)": {
    description: "Civil action for damages resulting from libel or slanderous remarks.",
    requirements: ["Copy of defamatory statement", "Screenshot with URL", "Witness affidavits"],
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
