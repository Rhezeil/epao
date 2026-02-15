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
  "Certificate of Indigency (from Barangay, DSWD, or MSWD)",
  "Latest Income Tax Return (ITR) or BIR Certification of Exemption",
  "Valid Government-issued ID (Original & 3 Photocopies)",
  "Case Narrative (Written account for the affidavit)"
];

export const universalPaoFlow = [
  { step: 1, title: "Intake Interview", content: "Meet with PAO staff to narrate facts and identify legal issues." },
  { step: 2, title: "Eligibility Assessment", content: "Submit proof of indigency. Verified against threshold." },
  { step: 3, title: "Merit & Conflict Check", content: "Lawyer verifies case merit and checks for representation conflicts." },
  { step: 4, title: "Acceptance", content: "If qualified, sign representation agreement and take oath of indigency." },
  { step: 5, title: "Legal Strategy", content: "Drafting of complaints, affidavits, or answers. Filing in court." }
];

export const pAONotes = [
  "Indigency Test: Your net income must not exceed the threshold (varies by location).",
  "Merit Test: PAO handles cases where the cause is valid and supported by evidence.",
  "Conflict of Interest: PAO cannot represent both parties in the same case.",
  "Public Service: All legal services provided by PAO are free of charge."
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description: string }> = {
  // --- CRIMES AGAINST PERSONS: DESTRUCTION OF LIFE ---
  "Parricide (Art 246)": {
    description: "The killing of one's father, mother, or child (legitimate or illegitimate), or any ascendant or descendant, or spouse. This is a higher crime than murder or homicide due to the familial relationship.",
    requirements: ["PSA Birth Certificate (Proof of Relation)", "PSA Marriage Contract (if spouse)", "Death Certificate", "Police Investigation Report", "Autopsy/Medico-Legal Report"],
    steps: universalPaoFlow
  },
  "Death/Injuries under Exceptional Circumstances (Art 247)": {
    description: "Killing or injuring a spouse or daughter in the act of sexual intercourse with another, or immediately thereafter, while in the act of surprised betrayal.",
    requirements: ["Proof of Marriage (PSA Contract)", "Police Blotter of the Incident", "Medico-Legal Certificate", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Murder (Art 248)": {
    description: "The unlawful killing of a person with qualifying circumstances such as treachery, price/reward, poison, fire, or evident premeditation. Penalized with Reclusion Perpetua.",
    requirements: ["Police Investigation Report", "Autopsy/Post-Mortem Report", "Death Certificate", "Witness Affidavits", "CCTV/Physical Evidence"],
    steps: universalPaoFlow
  },
  "Homicide (Art 249)": {
    description: "The unlawful killing of a person without the qualifying circumstances of murder and without the relationship elements of parricide.",
    requirements: ["Police Report", "Death Certificate", "Medico-Legal Certificate", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Death in Tumultuous Affray (Art 251)": {
    description: "Occurs when a person is killed during a chaotic, unorganized fight involving several people (labo-labo), and the specific killer cannot be identified.",
    requirements: ["Complaint-Affidavit (if filed)", "Subpoena or Warrant (if served)", "Police Report of the chaotic incident", "Witness Statements confirming the affray"],
    steps: universalPaoFlow
  },
  "Assistance to Suicide (Art 253)": {
    description: "Giving assistance to another person to commit suicide. If the person dies, the penalty is higher.",
    requirements: ["Police Report", "Suicide Note (if any)", "Witness Statements", "Medico-Legal Report"],
    steps: universalPaoFlow
  },
  "Discharge of Firearms (Art 254)": {
    description: "As amended by RA 11926. Involves shooting at another without intent to kill, or willful and indiscriminate discharge of any firearm.",
    requirements: ["Police Investigation Report", "Firearm Ballistics Report", "Witness Affidavits", "Notice of Inquest"],
    steps: [
      { step: 1, title: "Inquest Proceeding", content: "Immediate PAO assistance after arrest to determine legality of detention." },
      { step: 2, title: "Preliminary Investigation", content: "Filing counter-affidavits to refute charges of intent or indiscriminate firing." },
      { step: 3, title: "Trial", content: "Defense focusing on lack of intent or illegal search/seizure." }
    ]
  },
  "Infanticide (Art 255)": {
    description: "The killing of a child less than three days (72 hours) old.",
    requirements: ["PSA Birth Certificate of Child", "Autopsy Report", "Police Report", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Abortion (Art 256-259)": {
    description: "Abortion is strictly prohibited and penalized in the Philippines under Articles 256-259 RPC, whether intentional or unintentional, and whether practiced by the woman, her parents, a physician, or a midwife. PAO provides legal assistance to indigent persons facing these criminal charges.",
    requirements: ["Medico-Legal Report/Medical Certificate", "Police Investigation Report", "Hospital Records (if applicable)", "Witness Statements"],
    steps: [
      { step: 1, title: "Legal Consultation", content: "Determine the specific Article (256-259) being charged." },
      { step: 2, title: "Defense Strategy", content: "Identifying lack of intent or medical necessity if applicable for unintentional cases." },
      { step: 3, title: "Bail Application", content: "Assisting in bail procedures if the charge allows it." },
      { step: 4, title: "Trial Support", content: "Representation in all court hearings." }
    ]
  },
  "Responsibility in Duel (Art 260)": {
    description: "Killing or injuring an opponent in a formal duel.",
    requirements: ["Police Report", "Witness Statements", "Medico-Legal Report"],
    steps: universalPaoFlow
  },

  // --- CRIMES AGAINST PERSONS: PHYSICAL INJURIES ---
  "Mutilation (Art 262)": {
    description: "Intentionally depriving a person of a part of their body.",
    requirements: ["Medical Certificate", "Police Blotter", "Photos of Injury"],
    steps: universalPaoFlow
  },
  "Serious Physical Injuries (Art 263)": {
    description: "Injuries causing insanity, imbecility, impotence, blindness, or incapacity for labor for more than 90 days. Handled under standard DOJ procedures.",
    requirements: ["Medical Certificate (Original/Certified Copy)", "Police Report/Blotter", "Witness Affidavits", "Photographs of Injuries", "Medical Receipts (for damages)"],
    steps: [
      { step: 1, title: "Barangay Conciliation", content: "Attempted settlement if parties reside in same municipality (if applicable)." },
      { step: 2, title: "Filing of Complaint", content: "Submission of Complaint-Affidavit and Evidence to the Prosecutor." },
      { step: 3, title: "Preliminary Investigation", content: "Prosecutor determines probable cause for court filing." }
    ]
  },
  "Less Serious Physical Injuries (Art 265)": {
    description: "Injuries incapacitating the victim for labor or requiring medical assistance for 10 to 29 days.",
    requirements: ["Medical Certificate stating 10-29 days healing", "Police Blotter", "Witness Affidavits", "Photographs"],
    steps: universalPaoFlow
  },
  "Slight Physical Injuries (Art 266)": {
    description: "Injuries causing incapacity for 1 to 9 days or maltreatment without injury.",
    requirements: ["Medical Certificate stating 1-9 days healing", "Police Blotter", "Certificate to File Action (from Barangay)"],
    steps: universalPaoFlow
  },

  // --- VAWC (RA 9262) ---
  "Physical Violence (VAWC - Sec 5a)": {
    description: "Acts causing bodily harm, battery, or physical assault against a woman or her child. Section 5a of R.A. 9262.",
    requirements: ["Proof of Relation (Marriage/Birth Cert)", "Medico-Legal Certificate", "Photos of Injuries", "Police/Barangay Blotter"],
    steps: universalPaoFlow
  },
  "Sexual Violence (VAWC - Sec 5b)": {
    description: "Sexual acts including rape, sexual harassment, acts of lasciviousness, or prostituting the woman/child. Section 5b of R.A. 9262.",
    requirements: ["Medico-Legal Report", "Psychological Evaluation", "Police Report", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Psychological Violence (VAWC - Sec 5h-i)": {
    description: "Acts causing mental anguish, such as marital infidelity, intimidation, harassment, or stalking. Section 5h & 5i of R.A. 9262.",
    requirements: ["Screenshots (SMS/Chat)", "Psychological Evaluation Report", "Barangay Protection Order (BPO)", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Economic Abuse (VAWC - Sec 5e-f)": {
    description: "Acts causing financial dependence, including withdrawal of support or controlling assets. Section 5e & 5f of R.A. 9262.",
    requirements: ["Evidence of Withheld Support", "Bank Statements/Payslips", "Affidavit of Fact"],
    steps: universalPaoFlow
  },

  // --- TRAFFICKING ---
  "Human Trafficking (RA 9208)": {
    description: "Recruitment, transportation, or harboring of persons by means of threat, force, fraud, or deception for exploitation (e.g., forced labor, slavery).",
    requirements: ["Rescue Report (IACAT/Police/NBI)", "Travel Documents (Passport/VISA)", "Affidavit of Victim", "Communication Logs"],
    steps: [
      { step: 1, title: "Rescue & Protective Custody", content: "Immediate coordination with DSWD and law enforcement." },
      { step: 2, title: "Confidentiality Protocol", content: "Ensuring the victim's identity is strictly protected under RA 9208." },
      { step: 3, title: "Prosecution", content: "PAO assists in filing cases for qualified or simple trafficking." }
    ]
  },
  "Qualified Trafficking": {
    description: "Trafficking penalized with life imprisonment when the victim is a child, committed by a syndicate, or involving public officers.",
    requirements: ["Proof of Age (Victim's Birth Cert)", "Evidence of Syndicate", "Official ID of Accused (if public officer)"],
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
