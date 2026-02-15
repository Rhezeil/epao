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
      items: ["Physical Violence (VAWC)", "Sexual Violence (VAWC)", "Psychological Violence (VAWC)", "Economic Abuse (VAWC)"]
    },
    {
      title: "🟠 IV. CRIMES AGAINST PROPERTY",
      items: ["Robbery", "Theft", "Qualified Theft", "Estafa", "Malicious Mischief"]
    },
    {
      title: "🛡️ V. PROPERTY CRIMES (SPECIAL LAWS)",
      items: ["Carnapping (RA 10883)", "Anti-Fencing (PD 1612)", "Bouncing Checks (BP 22)", "Arson (PD 1613)", "Anti-Electricity Pilferage (RA 7832)"]
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
  // --- CRIMES AGAINST PERSONS (Destruction of Life) ---
  "Parricide (Art 246)": {
    description: "Killing of one's father, mother, or child (legitimate or illegitimate), or any ascendant or descendant, or spouse (Article 246, RPC).",
    requirements: ["Birth Certificates (Proof of Relation)", "Marriage Contract (PSA)", "Death Certificate", "Police Investigation Report", "Autopsy/Medico-Legal Report"],
    steps: universalPaoFlow
  },
  "Death/Injuries under Exceptional Circumstances (Art 247)": {
    description: "Killing or injuring a spouse or daughter in the act of sexual intercourse with another, under specific legal conditions (Article 247, RPC).",
    requirements: ["Marriage Contract", "Birth Certificate of Daughter", "Police Report", "Witness Statements", "Medico-Legal Report"],
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
  "Death in Tumultuous Affray (Art 251)": {
    description: "A person is killed in a chaotic fight (labo-labo), and the specific killer cannot be identified (Article 251, RPC).",
    requirements: ["Police Incident Report", "Medico-Legal Report", "List of Participants (if known)", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Assistance to Suicide (Art 253)": {
    description: "Giving assistance to another to commit suicide (Article 253, RPC).",
    requirements: ["Police Investigation Report", "Suicide Note (if any)", "Witness Statements", "Digital Evidence/Communication"],
    steps: universalPaoFlow
  },
  "Discharge of Firearms (Art 254)": {
    description: "Shooting at another with a firearm, if not considered a higher crime like homicide (Article 254, RPC).",
    requirements: ["Police Blotter", "Ballistics Report", "Paraffin Test (if available)", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Infanticide (Art 255)": {
    description: "The killing of a child less than three days old (Article 255, RPC).",
    requirements: ["Birth Certificate of Infant", "Death Certificate", "Autopsy/Medico-Legal Report", "Police Report"],
    steps: universalPaoFlow
  },
  "Abortion (Art 256-259)": {
    description: "Intentional or unintentional abortion, including abortion practiced by a physician, midwife, or the woman herself (Articles 256-259, RPC).",
    requirements: ["Medical Records", "Physician's Certificate", "Witness Statements", "Physical Evidence"],
    steps: universalPaoFlow
  },
  "Responsibility in Duel (Art 260)": {
    description: "Killing or injuring an opponent in a duel (Article 260, RPC).",
    requirements: ["Police Report", "Death/Injury Certificate", "Witness Statements (Seconds/Participants)"],
    steps: universalPaoFlow
  },

  // --- PHYSICAL INJURIES ---
  "Mutilation (Art 262)": {
    description: "Intentionally depriving a person of a part of their body (Article 262, RPC).",
    requirements: ["Medico-Legal Certificate", "Photos of Injuries", "Police Report", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Serious Physical Injuries (Art 263)": {
    description: "Injuries causing insanity, imbecility, impotence, blindness, or incapacity for labor for more than 90 days (Article 263, RPC).",
    requirements: ["Detailed Medical Certificate", "Doctor's Testimony/Affidavit", "Police Report", "Hospital Records"],
    steps: universalPaoFlow
  },
  "Less Serious Physical Injuries (Art 265)": {
    description: "Injuries incapacitating the victim for labor or requiring medical assistance for 10-29 days (Article 265, RPC).",
    requirements: ["Medical Certificate (10-29 days)", "Police Blotter", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Slight Physical Injuries (Art 266)": {
    description: "Injuries causing incapacity for 1-9 days or simple maltreatment (Article 266, RPC).",
    requirements: ["Medical Certificate (1-9 days)", "Police Blotter", "Witness Statements"],
    steps: universalPaoFlow
  },

  // --- VAWC (RA 9262) ---
  "Physical Violence (VAWC)": {
    description: "Acts causing or threatening physical harm, or inflicting bodily injury resulting in distress (Section 5a-d, RA 9262).",
    requirements: ["Proof of Relationship", "Medico-Legal Certificate", "Photos of Injuries", "Police/Barangay Blotter"],
    steps: universalPaoFlow
  },
  "Sexual Violence (VAWC)": {
    description: "Includes rape, harassment, indecent acts, or treating a woman/child as a sex object (Section 5g, RA 9262).",
    requirements: ["Proof of Relation", "Medico-Legal Report", "Psychological Evaluation", "Police Report", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Psychological Violence (VAWC)": {
    description: "Acts causing mental/emotional anguish, verbal abuse, stalking, or threatening custody (Section 5h-i, RA 9262).",
    requirements: ["Communication Logs (SMS/Chat)", "Psychological Evaluation", "Barangay Protection Order (if any)", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Economic Abuse (VAWC)": {
    description: "Depriving financial support, controlling finances, or preventing the victim from working (Section 5e, RA 9262).",
    requirements: ["Bank Statements", "Evidence of Withheld Support", "Employment Records", "Affidavit of Fact"],
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

  // --- TRAFFICKING ---
  "Human Trafficking (RA 9208)": {
    description: "Recruitment, transportation, or harboring of persons by means of threat, force, fraud, or deception for exploitation (RA 9208 as amended).",
    requirements: ["Rescue Report (IACAT/Police/NBI)", "Travel Documents/Visa", "Communication Logs (SMS/Online)", "Witness Affidavits", "Medical/Psychological Evaluation"],
    steps: universalPaoFlow
  },

  // --- LABOR ---
  "Illegal Dismissal (Art 279)": {
    description: "Dismissal without just or authorized cause and due process (Art 279, Labor Code). Claims reinstatement and backwages.",
    requirements: ["Employment Contract", "Notice of Termination", "Latest Payslips", "Company ID", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Wage Deductions (Art 113)": {
    description: "Prohibits unauthorized deductions from wages (Article 113, Labor Code).",
    requirements: ["Payslips showing deductions", "Company Policy Handbook", "Employment Contract", "Grievance Records"],
    steps: universalPaoFlow
  },

  // --- CIVIL ---
  "Annulment of Marriage (Art 36/45 FC)": {
    description: "Legal process to declare a marriage null and void from the beginning (Article 36) or voidable (Article 45) under the Family Code.",
    requirements: ["PSA Marriage Contract", "PSA Birth Certificates of Children", "Psychological Evaluation Report", "Barangay Certificate of Residency", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Collection of Sum of Money": {
    description: "Claims for debts, unpaid loans, or services rendered (Small Claims or Civil Actions).",
    requirements: ["Promissory Note/Contract", "Demand Letter with Proof of Receipt", "Bank Transfer/Check Copies", "Witness Affidavits"],
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
