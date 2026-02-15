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
        "Physical Violence (Section 5a)", 
        "Sexual Violence (Section 5b)", 
        "Psychological Violence (Section 5h & 5i)", 
        "Economic Abuse (Section 5e & 5f)"
      ]
    },
    {
      title: "🟠 IV. CRIMES AGAINST PROPERTY (RPC)",
      items: ["Robbery", "Theft", "Qualified Theft", "Estafa", "Malicious Mischief"]
    },
    {
      title: "🛡️ V. PROPERTY CRIMES (SPECIAL LAWS)",
      items: [
        "BP Blg. 22 (Anti-Bouncing Checks)", 
        "PD 1612 (Anti-Fencing)", 
        "RA 7832 (Anti-Electricity Pilferage)"
      ]
    },
    {
      title: "⚖️ VI. PUBLIC ORDER (STATE SECURITY)",
      items: ["Rebellion (Art 134)", "Coup d'état (Art 134-A)", "Sedition (Art 139)", "Conspiracy to Commit Rebellion (Art 136)"]
    },
    {
      title: "👮 VII. PUBLIC ORDER (AUTHORITY)",
      items: ["Direct Assault", "Indirect Assault", "Resistance & Disobedience", "Disloyalty of Public Officers"]
    },
    {
      title: "📢 VIII. PUBLIC ORDER (DISTURBANCES)",
      items: ["Illegal Assembly", "Illegal Association", "Tumults & Public Disturbance", "Alarms and Scandals"]
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
  "Certificate of Indigency from Barangay Chairman or DSWD",
  "Latest ITR, pay slip, or Certificate of No Income",
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
    content: "Upon approval, a lawyer is officially assigned to your case to provide counseling, mediation, or full court representation." 
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
  // --- CRIMES AGAINST PUBLIC ORDER (STATE SECURITY) ---
  "Rebellion (Art 134)": {
    description: "Rising publicly and taking arms against the government to remove allegiance or deprive government powers.",
    requirements: ["Intelligence Reports", "Firearms Seized Inventory", "Witness Testimony", "Official Confession Records", "Video/Photo Evidence", "Arrest Report"],
    steps: universalPaoFlow
  },
  "Coup d'état (Art 134-A)": {
    description: "Swift attack by military/police or civilians against government authority to seize power.",
    requirements: ["Military/Police Internal Reports", "Weapons Seized Inventory", "Recorded Orders/Communications", "Witness Testimony", "Intelligence Records"],
    steps: universalPaoFlow
  },
  "Sedition (Art 139)": {
    description: "Public uprising to prevent execution of laws or inflict acts of hate/revenge against the state.",
    requirements: ["Rally Videos/Photos", "Social Media Posts Evidence", "Police Dispersal Report", "Witness Affidavits", "Arrest Records"],
    steps: universalPaoFlow
  },
  "Conspiracy to Commit Rebellion (Art 136)": {
    description: "Agreement between two or more persons to commit rebellion with the specific intent to execute it.",
    requirements: ["Recorded Communications", "Documentation of Meetings", "Confession Records", "Witness Testimony"],
    steps: universalPaoFlow
  },

  // --- CRIMES AGAINST PROPERTY ---
  "Robbery": {
    description: "Robbery (Art 293) involves taking personal property belonging to another with intent to gain through violence, intimidation, or force.",
    requirements: ["Police Blotter Report", "Sworn Complaint-Affidavit", "Medical Certificate (if violence used)", "Proof of Ownership (Receipt, OR/CR, Title)", "CCTV Footage", "Witness Affidavits", "Arrest Report"],
    steps: universalPaoFlow
  },
  "Theft": {
    description: "Theft (Art 308) is taking personal property without consent, without violence, and with intent to gain.",
    requirements: ["Police Report", "Affidavit of Loss", "Proof of Ownership", "CCTV Footage", "Witness Affidavits", "Recovery Receipt (if applicable)"],
    steps: universalPaoFlow
  },
  "Qualified Theft": {
    description: "Qualified Theft (Art 310) is theft committed with grave abuse of confidence, by domestic servants, or involving specific property like vehicles.",
    requirements: ["Employment Records", "Proof of Trust Relationship", "Proof of Ownership", "CCTV Footage", "Inventory of Stolen Items", "Police Investigation Report"],
    steps: universalPaoFlow
  },
  "Estafa": {
    description: "Estafa (Art 315) involves defrauding another through abuse of confidence or deceit causing financial damage.",
    requirements: ["Written Contract/Agreement", "Promissory Note", "Receipts/Proof of Payment", "Demand Letter with Registry Receipt", "Chat Messages/Screenshots", "Bank Records/Return Slip"],
    steps: universalPaoFlow
  },
  "Malicious Mischief": {
    description: "Malicious Mischief (Art 327) is the deliberate damage to the property of another without intent to gain.",
    requirements: ["Photos of Damaged Property", "Repair Estimates", "Police Blotter", "Witness Affidavits", "CCTV Footage", "Proof of Ownership"],
    steps: universalPaoFlow
  },

  // --- SPECIAL PROPERTY LAWS ---
  "BP Blg. 22 (Anti-Bouncing Checks)": {
    description: "Punishes issuing a check that is dishonored due to insufficient funds. It is a malum prohibitum offense.",
    requirements: ["Original Dishonored Check", "Bank Return Slip (NSF/Closed)", "Written Demand Letter", "Registry Return Receipt of Demand", "Proof of Underlying Obligation"],
    steps: universalPaoFlow
  },
  "PD 1612 (Anti-Fencing)": {
    description: "Buying, possessing, or selling property knowing it was stolen. Possession creates a presumption of fencing.",
    requirements: ["Original Theft Police Report", "Proof property was stolen", "Proof of Accused Possession", "Receipts of Sale", "Witness Testimony"],
    steps: universalPaoFlow
  },
  "RA 7832 (Anti-Electricity Pilferage)": {
    description: "Illegal use of electricity, jumper connections, or tampering with electric meters.",
    requirements: ["Electric Company Inspection Report", "Photos of Illegal Connection", "Disconnection Notice", "Tampering Report", "Affidavit of Inspecting Officer"],
    steps: universalPaoFlow
  },

  // --- CRIMES AGAINST PERSONS ---
  "Parricide (Art 246)": {
    description: "Killing of one's father, mother, or child (legitimate or illegitimate), or any ascendant or descendant, or spouse.",
    requirements: ["PSA Birth/Marriage Certificate", "Victim Death Certificate", "Police Investigation Report", "Autopsy Report"],
    steps: universalPaoFlow
  },
  "Death/Injuries under Exceptional Circumstances (Art 247)": {
    description: "Killing or injuring a spouse or daughter caught in the act of sexual betrayal.",
    requirements: ["PSA Marriage Contract", "Police Blotter", "Medico-Legal Certificate", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Murder (Art 248)": {
    description: "Unlawful killing with qualifying circumstances like treachery, price/reward, or evident premeditation.",
    requirements: ["Police Investigation Report", "Autopsy Report", "Death Certificate", "Witness Affidavits", "CCTV Evidence"],
    steps: universalPaoFlow
  },
  "Homicide (Art 249)": {
    description: "Unlawful killing without the qualifying circumstances of murder.",
    requirements: ["Police Report", "Death Certificate", "Medico-Legal Certificate", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Death in Tumultuous Affray (Art 251)": {
    description: "Killing during a chaotic fight involving several people where the specific killer cannot be identified.",
    requirements: ["Complaint-Affidavit", "Subpoena/Warrant Records", "Police Incident Report", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Assistance to Suicide (Art 253)": {
    description: "Assisting another to commit suicide. Liability depends on if suicide is consummated.",
    requirements: ["Police Report", "Suicide Note (if any)", "Witness Statements", "Medico-Legal Report"],
    steps: universalPaoFlow
  },
  "Discharge of Firearms (Art 254)": {
    description: "Shooting at another without intent to kill, or willful/indiscriminate discharge (RA 11926).",
    requirements: ["Police Investigation Report", "Ballistics Report", "Firearm License Status", "Witness Affidavits", "Inquest Records"],
    steps: [
      { step: 1, title: "Inquest Assistance", content: "Immediate PAO representation during arrest to check legality of detention." },
      ...universalPaoFlow.slice(1)
    ]
  },
  "Infanticide (Art 255)": {
    description: "Killing of a child less than 72 hours old.",
    requirements: ["PSA Birth Certificate", "Autopsy Report", "Police Report", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Abortion (Art 256-259)": {
    description: "Prohibited acts of ending a pregnancy, whether intentional or not, by the mother or medical practitioners.",
    requirements: ["Medico-Legal Report", "Hospital Records", "Police Investigation Report", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Responsibility in Duel (Art 260)": {
    description: "Killing or injuring an opponent in a duel. Participants and seconds are liable.",
    requirements: ["Police Report", "Witness Statements", "Challenge Evidence", "Medico-Legal Report"],
    steps: universalPaoFlow
  },

  // --- PHYSICAL INJURIES ---
  "Serious Physical Injuries (Art 263)": {
    description: "Injuries causing insanity, blindness, or incapacity for labor for more than 90 days.",
    requirements: ["Medical Certificate (90+ days)", "Police Blotter", "Photos of Injury", "Barangay Certificate to File Action"],
    steps: universalPaoFlow
  },
  "Less Serious Physical Injuries (Art 265)": {
    description: "Injuries requiring medical assistance for 10 to 29 days.",
    requirements: ["Medical Certificate (10-29 days)", "Police Blotter", "Witness Affidavits", "Barangay Certificate to File Action"],
    steps: universalPaoFlow
  },
  "Slight Physical Injuries (Art 266)": {
    description: "Injuries causing incapacity for 1 to 9 days.",
    requirements: ["Medical Certificate (1-9 days)", "Police Blotter", "Barangay Certificate to File Action"],
    steps: universalPaoFlow
  },

  // --- VAWC ---
  "Physical Violence (Section 5a)": {
    description: "Acts causing bodily harm, battery, or causing fear of harm under R.A. 9262.",
    requirements: ["Proof of Relation", "Medico-Legal Certificate", "Photos of Injuries", "Police/Barangay Blotter", "Affidavits"],
    steps: universalPaoFlow
  },
  "Sexual Violence (Section 5b)": {
    description: "Sexual acts including rape, harassment, and treating a woman/child as a sex object.",
    requirements: ["Medico-Legal Report", "Psychological Evaluation", "Police Report", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Psychological Violence (Section 5h & 5i)": {
    description: "Causing mental anguish, marital infidelity, stalking, or public ridicule.",
    requirements: ["Chat/SMS Screenshots", "Psychological Evaluation", "BPO Records", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Economic Abuse (Section 5e & 5f)": {
    description: "Withdrawal of financial support or controlling victim's assets.",
    requirements: ["Evidence of Withheld Support", "Bank Statements", "Affidavit of Fact", "Proof of Property Damage"],
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
