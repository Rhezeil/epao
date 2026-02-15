/**
 * @fileOverview Exhaustive legal database for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

export const caseCategories = {
  "Criminal": [
    {
      title: "🔴 I. CRIMES AGAINST PERSONS (Destruction of Life)",
      items: ["Parricide (Art 246)", "Death/Injuries under Exceptional Circumstances (Art 247)", "Murder (Art 248)", "Homicide (Art 249)", "Death in Tumultuous Affray (Art 251)", "Assistance to Suicide (Art 253)", "Discharge of Firearms (Art 254)", "Infanticide (Art 255)", "Abortion (Art 256-259)", "Responsibility in Duel (Art 260)"]
    },
    {
      title: "🩹 II. CRIMES AGAINST PERSONS (Physical Injuries)",
      items: ["Mutilation (Art 262)", "Serious Physical Injuries (Art 263)", "Less Serious Physical Injuries (Art 265)", "Slight Physical Injuries (Art 266)"]
    },
    {
      title: "💜 III. VAWC & DOMESTIC ABUSE (R.A. 9262)",
      items: ["Physical Violence (VAWC - Sec 5a)", "Sexual Violence (VAWC - Sec 5b)", "Psychological Violence (VAWC - Sec 5h-i)", "Economic Abuse (VAWC - Sec 5e-f)"]
    },
    {
      title: "🟠 IV. CRIMES AGAINST PROPERTY",
      items: ["Robbery", "Theft", "Qualified Theft", "Estafa", "Malicious Mischief"]
    },
    {
      title: "🛡️ V. PROPERTY CRIMES (SPECIAL LAWS)",
      items: ["BP Blg. 22 (Anti-Bouncing Checks)", "PD 1612 (Anti-Fencing)", "RA 7832 (Anti-Electricity Pilferage)"]
    },
    {
      title: "⚖️ VI. PUBLIC ORDER (STATE SECURITY)",
      items: ["Rebellion", "Coup d'état", "Sedition", "Conspiracy to Commit Rebellion"]
    },
    {
      title: "👮 VII. PUBLIC ORDER (AUTHORITY)",
      items: ["Direct Assault", "Indirect Assault", "Resistance & Disobedience", "Disloyalty of Public Officers"]
    },
    {
      title: "📢 VIII. PUBLIC ORDER (DISTURBANCES)",
      items: ["Illegal Assembly", "Illegal Association", "Tumults & Public Disturbance", "Alarms and Scandals"]
    },
    {
      title: "💻 IX. CYBERCRIME (OFFENSES AGAINST SYSTEMS)",
      items: ["Illegal Access (Hacking)", "Illegal Interception", "Data Interference", "System Interference", "Misuse of Devices", "Cybersquatting"]
    },
    {
      title: "🆔 X. CYBERCRIME (IDENTITY & FORGERY)",
      items: ["Computer-Related Identity Theft", "Computer-Related Forgery", "Computer-Related Fraud"]
    },
    {
      title: "🔞 XI. CYBERCRIME (CONTENT-RELATED)",
      items: ["Cyberlibel", "Cybersex", "Child Pornography (RA 9775)", "Photo/Video Voyeurism (RA 9995)"]
    },
    {
      title: "📦 XII. SPECIAL PENAL LAWS (DRUGS & ARMS)",
      items: ["Dangerous Drugs (RA 9165)", "Firearms Possession (RA 10591)", "Explosives Possession (RA 9516)"]
    },
    {
      title: "🌍 XIII. RECRUITMENT & TRAFFICKING",
      items: ["Illegal Recruitment (RA 8042)", "Human Trafficking (RA 9208)", "Qualified Trafficking"]
    },
    {
      title: "💍 XIV. CIVIL STATUS CRIMES",
      items: ["Bigamy (Art 349)", "Simulation of Birth (Art 347)", "Usurpation of Civil Status (Art 348)", "Premature Marriage (Art 351)", "Illegal Marriage Ceremony (Art 352)"]
    }
  ],
  "Civil": [
    {
      title: "📖 I. FAMILY RELATIONS",
      items: ["Annulment of Marriage (Art 36/45 FC)", "Legal Separation (Art 55 FC)", "Support (Art 194-208 FC)", "Custody of Children (Art 211-213 FC)", "Adoption (Domestic Adoption Act)"]
    },
    {
      title: "🏠 II. PROPERTY & LAND",
      items: ["Unlawful Detainer", "Forcible Entry", "Recovery of Possession", "Partition (Art 494 CC)", "Easements"]
    },
    {
      title: "📜 III. OBLIGATIONS & CONTRACTS",
      items: ["Breach of Contract (Art 1170 CC)", "Collection of Sum of Money", "Damages (Art 2176-2194 CC)"]
    },
    {
      title: "⚖️ IV. SPECIAL PROCEEDINGS",
      items: ["Correction of Entries (Rule 108)", "Guardianship", "Settlement of Estate", "Habeas Corpus"]
    }
  ],
  "Labor": [
    {
      title: "🔒 I. DISMISSAL & TENURE",
      items: ["Illegal Dismissal (Art 279)", "Regularization (Art 280)", "Just Causes (Art 282)", "Authorized Causes (Art 283-284)", "Constructive Dismissal"]
    },
    {
      title: "💰 II. MONETARY CLAIMS",
      items: ["Unpaid Wages (Art 103)", "13th Month Pay (PD 851)", "Service Incentive Leave (Art 95)", "Wage Deductions (Art 113)", "Attorney's Fees (Art 111)"]
    },
    {
      title: "🌍 III. SPECIAL LABOR",
      items: ["Labor-Only Contracting (Art 106)", "OFW Claims (POEA)", "Illegal Strikes (Art 264)", "Retaliatory Measures (Art 118)"]
    }
  ],
  "Administrative": [
    {
      title: "🏛 GOVERNMENT",
      items: ["Civil Service Cases", "SSS / GSIS Claims", "DARAB Cases", "Barangay Conciliation"]
    }
  ]
};

export const standardPaoDocs = [
  "Affidavit of Indigency (PAO Form)",
  "Latest Income Tax Return (ITR) or BIR Certification of Exemption",
  "Barangay Certificate of Indigency (stating purpose: Legal Assistance)",
  "Valid Government-issued ID (Original & 3 Photocopies)"
];

export const universalPaoFlow = [
  { step: 1, title: "Intake Interview", content: "Meet with PAO staff to narrate facts and identify legal issues." },
  { step: 2, title: "Eligibility Assessment", content: "Submit proof of indigency. Verified against threshold." },
  { step: 3, title: "Merit & Conflict Check", content: "Lawyer verifies case merit and checks for representation conflicts." },
  { step: 4, title: "Acceptance", content: "If qualified, sign representation agreement and take oath of indigency." },
  { step: 5, title: "Legal Strategy", content: "Drafting of complaints, affidavits, or answers. Filing in court." }
];

export const pAONotes = [
  "Indigency Test: Your net income must not exceed the threshold (e.g., P14,000 to P24,000 depending on location).",
  "Merit Test: PAO handles cases where the client's cause appears to be valid and supported by evidence.",
  "Conflict of Interest: PAO cannot represent both parties in the same case.",
  "Public Service: All legal services provided by PAO are free of charge."
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description: string }> = {
  // --- CRIMES AGAINST PERSONS ---
  "Parricide (Art 246)": {
    description: "Killing of one's father, mother, or child (legitimate or illegitimate), or any ascendant or descendant, or spouse (Article 246, RPC).",
    requirements: ["PSA Birth Certificate (Proof of Relation)", "PSA Marriage Contract", "Death Certificate", "Police Investigation Report", "Autopsy/Medico-Legal Report"],
    steps: universalPaoFlow
  },
  "Death/Injuries under Exceptional Circumstances (Art 247)": {
    description: "Killing or injuring a spouse or daughter in the act of sexual intercourse with another, under specific conditions (Article 247, RPC).",
    requirements: ["Proof of Marriage or Relation", "Police Blotter", "Medico-Legal Certificate", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Murder (Art 248)": {
    description: "The unlawful killing of a person with qualifying circumstances such as treachery, price/reward, poison, fire, or evident premeditation (Article 248, RPC).",
    requirements: ["Police Investigation Report", "Autopsy/Post-Mortem Report", "Death Certificate", "Witness Affidavits", "CCTV/Physical Evidence"],
    steps: universalPaoFlow
  },
  "Homicide (Art 249)": {
    description: "The unlawful killing of a person without the qualifying circumstances of murder or the relationship requirements of parricide (Article 249, RPC).",
    requirements: ["Police Report", "Death Certificate", "Medico-Legal Certificate", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Death in Tumultuous Affray (Art 251)": {
    description: "Occurs when a person is killed during a chaotic, unorganized fight involving several people, and it cannot be determined who specifically caused the death (Article 251, RPC).",
    requirements: ["Complaint-Affidavit (if filed)", "Subpoena or Warrant (if served)", "Police Report of the incident", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Assistance to Suicide (Art 253)": {
    description: "Giving assistance to another person to commit suicide (Article 253, RPC).",
    requirements: ["Police Report", "Suicide Note (if any)", "Witness Statements", "Medico-Legal Report"],
    steps: universalPaoFlow
  },
  "Discharge of Firearms (Art 254)": {
    description: "Illegal Discharge of Firearms (Art. 254, RPC as amended by RA 11926). Committed by shooting at another without intent to kill, or willful/indiscriminate discharge.",
    requirements: ["Police Investigation Report", "Paraffin Test Results (if available)", "Firearm Ballistics Report", "Witness Affidavits", "Notice of Inquest"],
    steps: [
      { step: 1, title: "Inquest Proceeding", content: "Immediate PAO assistance after arrest to determine legality of detention." },
      { step: 2, title: "Preliminary Investigation", content: "Filing counter-affidavits to refute charges of indiscriminate firing." },
      { step: 3, title: "Trial Proper", content: "Defense strategies focusing on lack of intent or illegal search/seizure." }
    ]
  },
  "Infanticide (Art 255)": {
    description: "Killing of a child less than three days old (Article 255, RPC).",
    requirements: ["Birth Record", "Death Certificate", "Medico-Legal Report", "Police Investigation"],
    steps: universalPaoFlow
  },

  // --- VAWC ---
  "Physical Violence (VAWC - Sec 5a)": {
    description: "Acts causing bodily harm, such as battery, physical assault, threats, or causing fear of harm (Section 5a, RA 9262).",
    requirements: ["Proof of Relationship (Marriage/Birth Certificate)", "Medico-Legal Certificate", "Photos of Injuries", "Police/Barangay Blotter"],
    steps: universalPaoFlow
  },
  "Sexual Violence (VAWC - Sec 5b)": {
    description: "Sexual acts including rape, sexual harassment, acts of lasciviousness, or prostituting the woman or child (Section 5b, RA 9262).",
    requirements: ["Medico-Legal Report", "Psychological Evaluation", "Police Report", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Psychological Violence (VAWC - Sec 5h-i)": {
    description: "Acts causing mental or emotional anguish, such as marital infidelity, intimidation, stalking, and public ridicule (Section 5h & 5i, RA 9262).",
    requirements: ["Screenshots (SMS/Chat)", "Psychological Evaluation Report", "Barangay Protection Order", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Economic Abuse (VAWC - Sec 5e-f)": {
    description: "Acts causing financial dependence, including withdrawal of financial support or controlling assets (Section 5e & 5f, RA 9262).",
    requirements: ["Evidence of Withheld Support", "Bank Statements/Payslips", "Proof of Assets", "Affidavit of Fact"],
    steps: universalPaoFlow
  },

  // --- CYBERCRIME ---
  "Illegal Access (Hacking)": {
    description: "Unauthorized access to a computer system or network (Section 4a, RA 10175).",
    requirements: ["IT Audit Log/Report", "Screenshots of Unauthorized Access", "Police/NBI Cybercrime Report"],
    steps: universalPaoFlow
  },
  "Computer-Related Identity Theft": {
    description: "Using another person's identifying information without right (Section 4b, RA 10175).",
    requirements: ["Screenshots of Fake Profile", "Proof of Ownership of Real Identity", "Police Report"],
    steps: universalPaoFlow
  },
  "Cyberlibel": {
    description: "Libel as defined in Art. 355 of the RPC, committed through a computer system (Section 4c, RA 10175).",
    requirements: ["Screenshots of Defamatory Post", "URL/Link of Post", "Proof of Identity of Account"],
    steps: universalPaoFlow
  },

  // --- LABOR ---
  "Illegal Dismissal (Art 279)": {
    description: "Dismissal without just or authorized cause and due process (Art 279, Labor Code).",
    requirements: ["Employment Contract", "Notice of Termination", "Latest Payslips", "Company ID", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "OFW Claims (POEA)": {
    description: "Claims for illegal dismissal, death/disability benefits, and violation of POEA contracts (RA 8042).",
    requirements: ["POEA-approved Contract", "Passport & OEC", "Communication Logs with Agency", "Notice of Termination (if any)"],
    steps: universalPaoFlow
  },

  // --- TRAFFICKING ---
  "Human Trafficking (RA 9208)": {
    description: "Recruitment, transportation, or harboring of persons by means of threat or fraud for exploitation (RA 9208).",
    requirements: ["Rescue Report (IACAT/Police/NBI)", "Travel Documents", "Affidavit of Victim", "Communication logs"],
    steps: universalPaoFlow
  },
  "Qualified Trafficking": {
    description: "Trafficking when the victim is a child, committed by a syndicate, or involving public officers (RA 9208).",
    requirements: ["Proof of Age (Victim's Birth Certificate)", "Evidence of Syndicate (if applicable)", "Official identification of accused"],
    steps: universalPaoFlow
  }
};

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Police Report", "Subpoena"], steps: universalPaoFlow },
  Civil: { requirements: ["PSA Certificates", "Demand Letters"], steps: universalPaoFlow },
  Labor: { requirements: ["Company ID", "Payslips"], steps: universalPaoFlow },
  Administrative: { requirements: ["Notice from Agency", "Evidence"], steps: universalPaoFlow }
};
