/**
 * @fileOverview Refined legal database for LexConnect.
 * Standardized documentation and process flows based on official PAO standards.
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
        "VAWC (RA 9262)", 
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
      title: "📖 I. FAMILY LAW CASES",
      items: [
        "Declaration of Nullity of Marriage (Art. 35-38/36)",
        "Annulment of Voidable Marriage (Art. 45-47)",
        "Legal Separation (Art. 55-67)",
        "Child Custody (Art. 213)",
        "Support (Art. 194-208)",
        "Adoption (RA 11642)",
        "Recognition of Foreign Divorce (Art. 26)"
      ]
    },
    {
      title: "🏠 II. CIVIL CODE CASES",
      items: [
        "Breach of Contract (Art. 1159)",
        "Collection of Sum of Money",
        "Damages (Art. 2195-2235)",
        "Property Disputes (Accion Publiciana/Reivindicatoria)",
        "Partition of Property (Art. 494-501)",
        "Quieting of Title (Art. 476-481)",
        "Ejectment (Forcible Entry / Unlawful Detainer)"
      ]
    },
    {
      title: "💰 III. SMALL CLAIMS CASES",
      items: ["Collection of Small Debts"]
    },
    {
      title: "🛡️ IV. SPECIAL CIVIL ACTIONS",
      items: ["Habeas Data", "Writ of Amparo"]
    },
    {
      title: "📜 V. SUCCESSION & ESTATE MATTERS",
      items: ["Settlement of Estate", "Declaration of Heirship"]
    },
    {
      title: "🖊️ VI. OTHER CIVIL MATTERS",
      items: ["Change of Name", "Correction of Entries"]
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
    content: "Provide proof of indigency (e.g., Certificate of Indigency, Income Tax Return, or Pay Slip), Valid ID, and documents related to the case (e.g., complaint, subpoena)." 
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
    requirements: ["Medical records", "Witness affidavits", "Police report"],
    steps: universalPaoFlow
  },
  "Death in Tumultuous Affray (Art. 251)": {
    description: "Occurs when a person is killed during a chaotic fight involving several people and the specific killer cannot be determined.",
    requirements: ["Police blotter", "Autopsy report", "Witness affidavits", "Warrant of arrest (if served)"],
    steps: universalPaoFlow
  },
  "Discharge of Firearms (Art. 254 / RA 11926)": {
    description: "Shooting at another without intent to kill, or willful and indiscriminate discharge of any firearm.",
    requirements: ["Police investigation report", "Ballistics report (if any)", "Witness affidavits", "Paraffin test results (if available)"],
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
    description: "Malicious burning of property, including inhabited houses or public buildings.",
    requirements: ["Bureau of Fire Protection (BFP) report", "Photos of fire damage", "Witness affidavits", "Property title / Proof of ownership"],
    steps: universalPaoFlow
  },
  "Malicious Mischief (Art. 327)": {
    description: "Deliberate damage to property of another without intent to gain.",
    requirements: ["Photos of damaged property", "Repair estimates", "Police blotter", "Witness affidavits"],
    steps: universalPaoFlow
  },

  // --- PUBLIC ORDER ---
  "Rebellion (Art. 134)": {
    description: "Rising publicly and taking arms against the government to remove allegiance or deprive powers.",
    requirements: ["Intelligence reports", "Firearms seized", "Witness testimony", "Arrest report"],
    steps: universalPaoFlow
  },
  "Coup d'état (Art. 134-A)": {
    description: "Swift attack by military/police or civilians against government authority to seize power.",
    requirements: ["Military/Police reports", "Weapons seized", "Intelligence records", "Witness testimony"],
    steps: universalPaoFlow
  },
  "Sedition (Art. 139)": {
    description: "Public uprising to prevent execution of laws or inflict acts of hate/revenge.",
    requirements: ["Rally videos", "Social media posts", "Police dispersal report", "Witness affidavits"],
    steps: universalPaoFlow
  },

  // --- SPECIAL LAWS ---
  "Drug Cases (RA 9165)": {
    description: "Violations of the Comprehensive Dangerous Drugs Act (Sale, Possession, or Use).",
    requirements: ["Chemistry report", "Seizure inventory", "Chain of custody documentation", "Arrest report"],
    steps: universalPaoFlow
  },
  "VAWC (RA 9262)": {
    description: "Covers Physical (5a), Sexual (5b), Psychological (5h/i), and Economic (5e/f) violence against women and children.",
    requirements: ["Police blotter", "Marriage/Birth certificate (proof of relation)", "Screenshots of threats", "Medical report / Medico-legal"],
    steps: universalPaoFlow
  },
  "Bouncing Checks (BP 22)": {
    description: "Issuing a check without sufficient funds or drawing against a closed account. Malum prohibitum offense.",
    requirements: ["Original dishonored check", "Bank return slip", "Written demand letter", "Proof of receipt of demand letter"],
    steps: universalPaoFlow
  },
  "Anti-Fencing (PD 1612)": {
    description: "Buying, possessing, or selling property knowing it was stolen.",
    requirements: ["Proof property was stolen", "Proof of possession by accused", "Receipt of sale (if any)"],
    steps: universalPaoFlow
  },
  "Electricity Pilferage (RA 7832)": {
    description: "Illegal use of electricity, jumper connections, or tampering with electric meters.",
    requirements: ["Inspection report by electric company", "Photographs of illegal connection", "Meter tampering report"],
    steps: universalPaoFlow
  },
  "Cybercrime (RA 10175)": {
    description: "Crimes committed through computer systems (Cyber-Libel, Identity Theft, etc.).",
    requirements: ["Screenshots with URLs", "Email headers / logs", "Digital forensic report", "Police cybercrime report"],
    steps: universalPaoFlow
  },

  // --- CIVIL FAMILY LAW ---
  "Declaration of Nullity of Marriage (Art. 35-38/36)": {
    description: "Covers marriages void from the beginning (Arts. 35-38) or due to Psychological Incapacity (Art. 36).",
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates of children", "Psychological evaluation report (for Art. 36)", "Proof of residency"],
    steps: universalPaoFlow
  },
  "Annulment of Voidable Marriage (Art. 45-47)": {
    description: "Marriages valid until annulled due to fraud, intimidation, or other grounds under Arts. 45-47.",
    requirements: ["Marriage certificate", "Evidence of ground (medical report, proof of fraud)", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Legal Separation (Art. 55-67)": {
    description: "Separation of bed and board without dissolving the marriage bond.",
    requirements: ["Marriage certificate", "Evidence of ground (abuse, infidelity)", "Police reports (if applicable)"],
    steps: universalPaoFlow
  },
  "Child Custody (Art. 213)": {
    description: "Determination of custody for minor children based on the best interest of the child.",
    requirements: ["Birth certificate of child", "Social worker report", "Proof of neglect/abuse (if applicable)", "School records"],
    steps: universalPaoFlow
  },
  "Support (Art. 194-208)": {
    description: "Financial support for sustenance, education, and medical care for children or spouse.",
    requirements: ["Birth certificate", "Proof of relationship", "Proof of financial capacity of respondent", "Demand letter"],
    steps: universalPaoFlow
  },
  "Adoption (RA 11642)": {
    description: "Domestic administrative adoption process to legally establish parent-child relationship.",
    requirements: ["Birth certificate of child", "Consent of biological parents", "DSWD case study report", "Home study report"],
    steps: universalPaoFlow
  },
  "Recognition of Foreign Divorce (Art. 26)": {
    description: "Petition to recognize a divorce decree obtained abroad by a Filipino-Foreign spouse.",
    requirements: ["Foreign divorce decree", "Marriage certificate", "Proof of foreign law", "PSA Marriage Certificate with annotation request"],
    steps: universalPaoFlow
  },

  // --- OTHER CIVIL CODE ---
  "Breach of Contract (Art. 1159)": {
    description: "Action for damages or specific performance when one party fails to fulfill obligations.",
    requirements: ["Written contract", "Proof of breach", "Demand letter", "Receipts"],
    steps: universalPaoFlow
  },
  "Collection of Sum of Money": {
    description: "Civil action to recover a specific amount of money owed.",
    requirements: ["Promissory note", "Loan agreement", "Receipts", "Demand letter"],
    steps: universalPaoFlow
  },
  "Damages (Art. 2195-2235)": {
    description: "Action to recover monetary compensation for injury, loss, or harm.",
    requirements: ["Medical bills / receipts", "Proof of injury/loss", "Police report", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Property Disputes (Accion Publiciana/Reivindicatoria)": {
    description: "Recovery of possession (Publiciana) or ownership (Reivindicatoria) of real property.",
    requirements: ["Land Title (TCT/OCT)", "Tax Declaration", "Deed of Sale", "Survey plan"],
    steps: universalPaoFlow
  },
  "Partition of Property (Art. 494-501)": {
    description: "Division of common property among co-owners.",
    requirements: ["Title", "Proof of co-ownership", "Death certificate (if inheritance)", "Tax declarations"],
    steps: universalPaoFlow
  },
  "Quieting of Title (Art. 476-481)": {
    description: "Action to remove a cloud or doubt on real property title.",
    requirements: ["Land title", "Deed of sale", "Evidence of cloud on title"],
    steps: universalPaoFlow
  },
  "Ejectment (Forcible Entry / Unlawful Detainer)": {
    description: "Summary action to recover possession of property within one year of entry or demand.",
    requirements: ["Title / Lease contract", "Demand to vacate letter", "Proof of ownership", "Barangay certification"],
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
