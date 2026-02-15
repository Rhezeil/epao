/**
 * @fileOverview Exhaustive legal database for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

export const caseCategories = {
  "Criminal": [
    {
      title: "🔴 I. CRIMES AGAINST PERSONS (Destruction of Life)",
      items: [
        "Parricide (Art 246)", 
        "Death/Injuries under Exceptional Circumstances (Art 247)", 
        "Murder (Art 248)", 
        "Homicide (Art 249)", 
        "Death in Tumultuous Affray (Art 251)", 
        "Assistance to Suicide (Art 253)", 
        "Discharge of Firearms (Art 254)", 
        "Infanticide (Art 255)", 
        "Abortion (Art 256-259)", 
        "Responsibility in Duel (Art 260)"
      ]
    },
    {
      title: "🩹 II. PHYSICAL INJURIES (Revised Penal Code)",
      items: [
        "Mutilation (Art 262)", 
        "Serious Physical Injuries (Art 263)", 
        "Less Serious Physical Injuries (Art 265)", 
        "Slight Physical Injuries (Art 266)"
      ]
    },
    {
      title: "💜 III. VAWC & DOMESTIC ABUSE (R.A. 9262)",
      items: [
        "Physical Violence (VAWC - Sec 5a)", 
        "Sexual Violence (VAWC - Sec 5b)", 
        "Psychological Violence (VAWC - Sec 5h-i)", 
        "Economic Abuse (VAWC - Sec 5e-f)"
      ]
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
    }
  ],
  "Labor": [
    {
      title: "🔒 I. DISMISSAL & TENURE",
      items: ["Illegal Dismissal (Art 279)", "Regularization (Art 280)", "Just Causes (Art 282)", "Authorized Causes (Art 283-284)"]
    },
    {
      title: "💰 II. MONETARY CLAIMS",
      items: ["Unpaid Wages (Art 103)", "13th Month Pay (PD 851)", "Service Incentive Leave (Art 95)"]
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
  "Certificate of Indigency (from Barangay Chairman or DSWD)",
  "Latest Income Tax Return (ITR), pay slip, or Proof of No Income",
  "Valid Government-issued ID (SSS, PhilHealth, Voter's, etc.)",
  "Case-Related Documents (Complaints, summons, or police reports)",
  "Merit Test compliance (Determined during lawyer interview)"
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
    content: "Provide proof of indigency (Barangay/DSWD Certificate), valid ID, and documents related to the case for initial screening." 
  },
  { 
    step: 3, 
    title: "Interview & Evaluation", 
    content: "A public attorney will interview you to perform the Indigency Test (financial check) and the Merit Test (legal basis check)." 
  },
  { 
    step: 4, 
    title: "Acceptance & Assignment", 
    content: "Upon approval, a lawyer is officially assigned to your case for counseling, mediation, or full court representation." 
  }
];

export const pAONotes = [
  "Indigency Test: Your net income must meet the agency's regional threshold.",
  "Merit Test: PAO handles cases where the cause is valid and has a legal basis.",
  "Conflict of Interest: PAO cannot represent opposing parties in the same matter.",
  "Free Service: All legal services provided by PAO are free of charge."
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description: string }> = {
  // --- CRIMES AGAINST PERSONS: DESTRUCTION OF LIFE ---
  "Parricide (Art 246)": {
    description: "Killing of one's father, mother, or child (legitimate or illegitimate), or any ascendant or descendant, or spouse. Penalized with Reclusion Perpetua to Death.",
    requirements: ["PSA Birth Certificate (Proof of Relation)", "PSA Marriage Contract (if spouse)", "Death Certificate of the Victim", "Police Investigation Report", "Autopsy/Post-Mortem Report"],
    steps: universalPaoFlow
  },
  "Death/Injuries under Exceptional Circumstances (Art 247)": {
    description: "Killing or injuring a spouse or daughter in the act of sexual intercourse with another, while in the act of surprised betrayal.",
    requirements: ["PSA Marriage Contract (Proof of Relation)", "Police Blotter of the Incident", "Medico-Legal Certificate", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Murder (Art 248)": {
    description: "The unlawful killing of a person with qualifying circumstances such as treachery, price/reward, poison, fire, or evident premeditation.",
    requirements: ["Police Investigation Report", "Autopsy/Post-Mortem Report", "Death Certificate", "Witness Affidavits", "CCTV or Physical Evidence"],
    steps: universalPaoFlow
  },
  "Homicide (Art 249)": {
    description: "The unlawful killing of a person without the qualifying circumstances of murder and without the relationship elements of parricide.",
    requirements: ["Police Report", "Death Certificate", "Medico-Legal Certificate", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Death in Tumultuous Affray (Art 251)": {
    description: "Occurs when a person is killed during a chaotic, unorganized fight involving several people (labo-labo), and the specific killer cannot be identified.",
    requirements: ["Complaint-Affidavit (if already filed)", "Subpoena or Warrant of Arrest (if served)", "Police Report of the chaotic incident", "Witness Statements confirming the affray"],
    steps: universalPaoFlow
  },
  "Assistance to Suicide (Art 253)": {
    description: "Giving assistance to another person to commit suicide. Penalties vary if the suicide is consummated or merely attempted.",
    requirements: ["Police Report", "Suicide Note (if any)", "Witness Statements", "Medico-Legal Report"],
    steps: universalPaoFlow
  },
  "Discharge of Firearms (Art 254)": {
    description: "Under Art. 254, as amended by RA 11926: Shooting at another without intent to kill, or willful and indiscriminate discharge of any firearm regardless of target.",
    requirements: ["Police Investigation Report", "Firearm Ballistics Report", "Witness Affidavits", "Notice of Inquest", "Gun License Status (if any)"],
    steps: [
      { step: 1, title: "Inquest Assistance", content: "Immediate PAO assistance after arrest to determine legality of detention and presence of probable cause." },
      ...universalPaoFlow.slice(1)
    ]
  },
  "Infanticide (Art 255)": {
    description: "The killing of a child less than three days (72 hours) old. Handled with specialized sensitivity.",
    requirements: ["PSA Birth Certificate of Child", "Autopsy Report", "Police Report", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Abortion (Art 256-259)": {
    description: "Abortion is prohibited and penalized under Articles 256-259 RPC, whether intentional or unintentional, practiced by the woman, parents, or medical professionals.",
    requirements: ["Medico-Legal Report", "Police Investigation Report", "Hospital Records (if any)", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Responsibility in Duel (Art 260)": {
    description: "Killing or injuring an opponent in a duel. Both participants and seconds may be held liable under the RPC.",
    requirements: ["Police Report", "Witness Statements", "Duel Challenge/Agreement evidence", "Medico-Legal Report"],
    steps: universalPaoFlow
  },

  // --- PHYSICAL INJURIES ---
  "Mutilation (Art 262)": {
    description: "Intentionally depriving a person of a part of their body. Penalized based on the importance of the organ or limb.",
    requirements: ["Medical Certificate", "Police Blotter", "Photos of Injury"],
    steps: universalPaoFlow
  },
  "Serious Physical Injuries (Art 263)": {
    description: "Injuries causing insanity, imbecility, impotence, blindness, or incapacity for labor for more than 90 days.",
    requirements: ["Detailed Medical Certificate (90+ days healing)", "Police Report/Blotter", "Witness Affidavits", "Photographs of Injuries"],
    steps: universalPaoFlow
  },
  "Less Serious Physical Injuries (Art 265)": {
    description: "Injuries incapacitating the victim for labor or requiring medical assistance for 10 to 29 days.",
    requirements: ["Medical Certificate stating 10-29 days healing", "Police Blotter", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Slight Physical Injuries (Art 266)": {
    description: "Injuries causing incapacity for 1 to 9 days or maltreatment without injury.",
    requirements: ["Medical Certificate stating 1-9 days healing", "Police Blotter", "Certificate to File Action (from Barangay)"],
    steps: universalPaoFlow
  },

  // --- VAWC (RA 9262) ---
  "Physical Violence (VAWC - Sec 5a)": {
    description: "Acts causing bodily harm, battery, physical assault, or threats. Section 5a of R.A. 9262.",
    requirements: ["Proof of Relation (Marriage/Birth Cert)", "Medico-Legal Certificate", "Photos of Injuries", "Police/Barangay Blotter"],
    steps: universalPaoFlow
  },
  "Sexual Violence (VAWC - Sec 5b)": {
    description: "Sexual acts including rape, harassment, acts of lasciviousness, or prostituting the woman or child. Section 5b of R.A. 9262.",
    requirements: ["Medico-Legal Report", "Psychological Evaluation", "Police Report", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Psychological Violence (VAWC - Sec 5h-i)": {
    description: "Acts causing mental/emotional anguish: infidelity, intimidation, stalking, or deprivation of custody. Section 5h & 5i of R.A. 9262.",
    requirements: ["Screenshots (SMS/Chat)", "Psychological Evaluation Report", "Barangay Protection Order (BPO)", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Economic Abuse (VAWC - Sec 5e-f)": {
    description: "Acts causing financial dependence: withdrawal of support or preventing work. Section 5e & 5f of R.A. 9262.",
    requirements: ["Evidence of Withheld Support", "Bank Statements/Payslips", "Affidavit of Fact"],
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
