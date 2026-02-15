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
      title: "💻 IX. CYBERCRIME (SYSTEMS)",
      items: ["Illegal Access (Hacking)", "Illegal Interception", "Data Interference", "System Interference", "Cybersquatting"]
    },
    {
      title: "🆔 X. CYBERCRIME (IDENTITY & FORGERY)",
      items: ["Computer-Related Identity Theft", "Computer-Related Forgery", "Computer-Related Fraud"]
    },
    {
      title: "🔞 XI. CYBERCRIME (CONTENT)",
      items: ["Cyberlibel", "Cybersex", "Child Pornography (RA 9775)", "Photo/Video Voyeurism (RA 9995)"]
    },
    {
      title: "📦 XII. SPECIAL PENAL LAWS (DRUGS & ARMS)",
      items: ["Dangerous Drugs (RA 9165)", "Firearms Possession (RA 10591)", "Explosives Possession (RA 9516)"]
    },
    {
      title: "🌍 XIII. RECRUITMENT & TRAFFICKING",
      items: ["Illegal Recruitment (RA 8042)", "Human Trafficking (RA 9208)"]
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
      items: ["Correction of Entries (Rule 108)", "Guardianship", "Settlement of Estate", "Habeas Corpus / Data / Amparo"]
    }
  ],
  "Labor": [
    {
      title: "🔒 I. DISMISSAL & TENURE",
      items: ["Illegal Dismissal (Art 279)", "Regularization (Art 280)", "Authorized Causes (Art 283-284)", "Constructive Dismissal"]
    },
    {
      title: "💰 II. MONETARY CLAIMS",
      items: ["Unpaid Wages (Art 103)", "13th Month Pay (PD 851)", "Service Incentive Leave (Art 95)", "Wage Deductions (Art 113)"]
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
    requirements: ["Birth Certificates (Proof of Relation)", "Marriage Contract (PSA)", "Death Certificate", "Police Investigation Report", "Autopsy/Medico-Legal Report"],
    steps: universalPaoFlow
  },
  "Murder (Art 248)": {
    description: "The unlawful killing of a person with qualifying circumstances such as treachery, price/reward, poison, fire, or evident premeditation (Article 248, RPC).",
    requirements: ["Police Blotter/Report", "Autopsy Report", "Death Certificate", "Witness Affidavits", "CCTV/Physical Evidence"],
    steps: universalPaoFlow
  },
  "Homicide (Art 249)": {
    description: "The unlawful killing of a person without the qualifying circumstances of murder or parricide (Article 249, RPC).",
    requirements: ["Police Report", "Death Certificate", "Medico-Legal Certificate", "Witness Statements"],
    steps: universalPaoFlow
  },

  // --- VAWC (RA 9262) ---
  "Physical Violence (VAWC - Sec 5a)": {
    description: "Acts causing bodily harm, such as battery, physical assault, threats, or causing fear of harm (Section 5a, RA 9262).",
    requirements: ["Proof of Relationship (Marriage/Birth Certificate)", "Medico-Legal Certificate", "Photos of Injuries", "Police/Barangay Blotter", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Sexual Violence (VAWC - Sec 5b)": {
    description: "Sexual acts including rape, sexual harassment, acts of lasciviousness, treating someone as a sex object, demeaning remarks, forcing cohabitation with a mistress, or prostituting the woman or child (Section 5b, RA 9262).",
    requirements: ["Medico-Legal Report", "Psychological Evaluation", "Police Report", "Proof of Relationship", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Psychological Violence (VAWC - Sec 5h-i)": {
    description: "Acts causing mental or emotional anguish, such as marital infidelity, intimidation, harassment, stalking, public ridicule, verbal abuse, damage to property, unlawful deprivation of custody or visitation, and causing a child to witness abuse (Section 5h & 5i, RA 9262).",
    requirements: ["Communication Logs (SMS/Chat/Social Media)", "Psychological Evaluation Report", "Barangay Protection Order (if any)", "Witness Affidavits", "Photos of damaged property (if applicable)"],
    steps: universalPaoFlow
  },
  "Economic Abuse (VAWC - Sec 5e-f)": {
    description: "Acts causing financial dependence, including withdrawal of financial support, preventing work or business, controlling assets, and destroying household property (Section 5e & 5f, RA 9262).",
    requirements: ["Evidence of Withheld Support", "Bank Statements/Payslips", "Proof of Assets ownership", "Affidavit of Fact", "Business/Employment Records"],
    steps: universalPaoFlow
  },

  // --- CYBERCRIME ---
  "Cyberlibel": {
    description: "Libel as defined in Art. 355 of the RPC, committed through a computer system (RA 10175).",
    requirements: ["Screenshots of Defamatory Post", "URL/Link", "Proof of Account Identity", "Witness Affidavits", "Cybercrime Division Report"],
    steps: universalPaoFlow
  },
  "Illegal Access (Hacking)": {
    description: "Unauthorized access to a computer system or network (Section 4a, RA 10175).",
    requirements: ["IT Audit Log/Report", "Screenshots of Breach", "Evidence of Account Hijacking", "Police Report"],
    steps: universalPaoFlow
  },

  // --- LABOR ---
  "Illegal Dismissal (Art 279)": {
    description: "Dismissal without just or authorized cause and due process (Art 279, Labor Code). Claims reinstatement and backwages.",
    requirements: ["Employment Contract", "Notice of Termination", "Latest Payslips", "Company ID", "Witness Affidavits"],
    steps: universalPaoFlow
  },

  // --- CIVIL ---
  "Annulment of Marriage (Art 36/45 FC)": {
    description: "Legal process to declare a marriage null and void from the beginning (Article 36) or voidable (Article 45) under the Family Code.",
    requirements: ["PSA Marriage Contract", "PSA Birth Certificates of Children", "Psychological Evaluation Report", "Barangay Certificate of Residency", "Witness Affidavits"],
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
