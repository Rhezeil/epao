/**
 * @fileOverview Exhaustive legal database for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 * Includes all 14 sections of Criminal Law and expanded Civil, Labor, and Admin categories.
 */

export const caseCategories = {
  "Criminal": [
    {
      title: "🔴 I. CRIMES AGAINST PERSONS (Destruction of Life)",
      items: ["Parricide (Art 246)", "Murder (Art 248)", "Homicide (Art 249)", "Death in Tumultuous Affray (Art 251)", "Assistance to Suicide (Art 253)", "Infanticide (Art 255)", "Abortion (Art 256-259)"]
    },
    {
      title: "🩹 II. PHYSICAL INJURIES",
      items: ["Mutilation (Art 262)", "Serious Physical Injuries (Art 263)", "Less Serious Physical Injuries (Art 265)", "Slight Physical Injuries (Art 266)"]
    },
    {
      title: "💜 III. VAWC & DOMESTIC ABUSE (R.A. 9262)",
      items: ["Physical Violence (Section 5a)", "Sexual Violence (Section 5b)", "Psychological Violence (Section 5h & 5i)", "Economic Abuse (Section 5e & 5f)"]
    },
    {
      title: "🟠 IV. CRIMES AGAINST PROPERTY (RPC)",
      items: ["Robbery (Art 293)", "Theft (Art 308)", "Qualified Theft (Art 310)", "Estafa (Art 315)", "Malicious Mischief (Art 327)"]
    },
    {
      title: "🛡️ V. PROPERTY CRIMES (SPECIAL LAWS)",
      items: ["BP Blg. 22 (Anti-Bouncing Checks)", "PD 1612 (Anti-Fencing)", "RA 7832 (Anti-Electricity Pilferage)"]
    },
    {
      title: "⚖️ VI. PUBLIC ORDER (STATE SECURITY)",
      items: ["Rebellion (Art 134)", "Coup d'état (Art 134-A)", "Sedition (Art 139)", "Conspiracy to Commit Rebellion (Art 136)"]
    },
    {
      title: "👮 VII. PUBLIC ORDER (AGAINST AUTHORITY)",
      items: ["Direct Assault (Art 148)", "Indirect Assault (Art 149)", "Resistance & Disobedience (Art 151)"]
    },
    {
      title: "📢 VIII. PUBLIC ORDER (DISTURBANCES)",
      items: ["Tumults & Public Disturbance (Art 153)", "Alarms and Scandals (Art 155)", "Illegal Assembly (Art 146)"]
    },
    {
      title: "✍️ IX. PUBLIC INTEREST (FORGERY/FALSIFICATION)",
      items: ["Counterfeiting Currency (Art 161)", "Falsification by Public Officer (Art 171)", "Falsification by Private Individual (Art 172)", "Use of Falsified Documents"]
    },
    {
      title: "🔞 X. PUBLIC MORALS",
      items: ["Grave Scandal (Art 200)", "Vagrancy and Prostitution (Art 202)", "Illegal Gambling (PD 1602)"]
    },
    {
      title: "🏛 XI. CRIMES BY PUBLIC OFFICERS",
      items: ["Malversation of Public Funds (Art 217)", "Direct Bribery (Art 210)", "Indirect Bribery (Art 211)", "Graft and Corruption (RA 3019)"]
    },
    {
      title: "⛓ XII. CRIMES AGAINST LIBERTY & SECURITY",
      items: ["Kidnapping & Serious Illegal Detention (Art 267)", "Slight Illegal Detention (Art 268)", "Grave Threats (Art 282)", "Light Coercion (Art 287)", "Cyber-Libel (RA 10175)"]
    },
    {
      title: "🗣 XIII. CRIMES AGAINST HONOR",
      items: ["Libel (Art 353)", "Slander (Oral Defamation)", "Slander by Deed (Art 359)"]
    },
    {
      title: "🚗 XIV. QUASI-OFFENSES (NEGLIGENCE)",
      items: ["Reckless Imprudence (Art 365)", "Simple Imprudence", "Homicide through Reckless Imprudence"]
    }
  ],
  "Civil": [
    {
      title: "📖 I. FAMILY RELATIONS",
      items: ["Annulment of Marriage (Art 36/45 FC)", "Legal Separation (Art 55 FC)", "Support (Art 194-208 FC)", "Custody of Children (Art 211-213 FC)", "Domestic Adoption"]
    },
    {
      title: "🏠 II. PROPERTY & LAND",
      items: ["Unlawful Detainer (Ejectment)", "Forcible Entry", "Recovery of Possession (Accion Publiciana)", "Partition of Property (Art 494 CC)"]
    },
    {
      title: "💰 III. SUM OF MONEY & DAMAGES",
      items: ["Collection of Sum of Money", "Breach of Contract", "Damages (Actual, Moral, Exemplary)", "Small Claims Cases"]
    },
    {
      title: "📜 IV. SPECIAL PROCEEDINGS",
      items: ["Correction of Clerical Error (RA 9048)", "Change of First Name (RA 10172)", "Guardianship of Minors", "Probate of Will"]
    }
  ],
  "Labor": [
    {
      title: "🔒 I. TERMINATION & TENURE",
      items: ["Illegal Dismissal (Art 279)", "Constructive Dismissal", "Regularization (Labor-Only Contracting)", "Separation Pay Claims"]
    },
    {
      title: "💰 II. MONETARY CLAIMS",
      items: ["Unpaid Wages", "13th Month Pay (PD 851)", "Service Incentive Leave", "Overtime/Holiday Pay", "Illegal Deductions"]
    }
  ],
  "Administrative": [
    {
      title: "🏛 GOVERNMENT & AGENCY CLAIMS",
      items: ["Civil Service Commission Appeals", "SSS / GSIS Benefits Claims", "Agrarian Reform (DARAB) Cases", "Barangay Conciliation (Katarungang Pambarangay)"]
    }
  ]
};

export const standardPaoDocs = [
  "Certificate of Indigency from Barangay Chairman (Residence jurisdiction)",
  "Certificate of Indigency from DSWD or MSWD",
  "Latest ITR, pay slip, or Certificate of No Income",
  "Valid Government-issued ID (SSS, PhilHealth, Voter's, etc.)",
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
  // --- CRIMES AGAINST PERSONS ---
  "Parricide (Art 246)": {
    description: "Killing of one's father, mother, or child (legitimate/illegitimate), or any ascendant/descendant, or spouse.",
    requirements: ["PSA Birth/Marriage Certificate", "Victim Death Certificate", "Police Investigation Report", "Autopsy Report"],
    steps: universalPaoFlow
  },
  "Murder (Art 248)": {
    description: "Unlawful killing with qualifying circumstances like treachery, price/reward, or evident premeditation.",
    requirements: ["Police Investigation Report", "Autopsy Report", "Death Certificate", "Witness Affidavits", "CCTV Evidence"],
    steps: universalPaoFlow
  },
  "Abortion (Art 256-259)": {
    description: "Prohibited acts of ending a pregnancy, whether intentional or not, by the mother or medical practitioners. Strictly penalized in PH.",
    requirements: ["Medico-Legal Report", "Hospital Records", "Police Investigation Report", "Witness Statements"],
    steps: universalPaoFlow
  },
  
  // --- VAWC ---
  "Physical Violence (Section 5a)": {
    description: "Acts causing bodily harm, battery, or causing fear of harm under R.A. 9262 Section 5a.",
    requirements: ["Proof of Relation (Marriage/Birth Cert)", "Medico-Legal Certificate", "Photos of Injuries", "Police/Barangay Blotter"],
    steps: universalPaoFlow
  },
  "Psychological Violence (Section 5h & 5i)": {
    description: "Acts causing mental/emotional anguish, including stalking, verbal abuse, or deprivation of custody (Section 5h/5i).",
    requirements: ["Psychological Evaluation Report", "Chat/SMS Screenshots", "Witness Affidavits", "Barangay Protection Order (BPO)"],
    steps: universalPaoFlow
  },

  // --- PROPERTY ---
  "Robbery (Art 293)": {
    description: "Taking personal property with intent to gain through violence, intimidation, or force.",
    requirements: ["Police Blotter Report", "Proof of Ownership", "Medical Certificate (if violence used)", "CCTV Footage"],
    steps: universalPaoFlow
  },
  "Qualified Theft (Art 310)": {
    description: "Theft committed with grave abuse of confidence, by domestic servants, or involving specific property like motor vehicles.",
    requirements: ["Employment Records", "Proof of Trust Relationship", "Police Investigation Report", "Inventory of Stolen Items"],
    steps: universalPaoFlow
  },

  // --- SPECIAL LAWS ---
  "BP Blg. 22 (Anti-Bouncing Checks)": {
    description: "Punishes issuing a check that is dishonored due to insufficient funds. It is a malum prohibitum offense.",
    requirements: ["Original Dishonored Check", "Bank Return Slip (NSF/Closed)", "Written Demand Letter with Proof of Receipt"],
    steps: universalPaoFlow
  },

  // --- PUBLIC ORDER ---
  "Rebellion (Art 134)": {
    description: "Rising publicly and taking arms against the government to remove allegiance or deprive government powers.",
    requirements: ["Intelligence Reports", "Firearms Seized Inventory", "Witness Testimony", "Arrest Report"],
    steps: universalPaoFlow
  },

  // --- CIVIL ---
  "Annulment of Marriage (Art 36/45 FC)": {
    description: "Legal process to declare a marriage null and void based on psychological incapacity or other legal grounds.",
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates of Children", "Psychological Evaluation Report", "Witness Testimonies"],
    steps: universalPaoFlow
  },
  "Unlawful Detainer (Ejectment)": {
    description: "Legal action to recover possession of property when the occupant refuses to leave after the right to stay has expired.",
    requirements: ["Proof of Ownership (TCT/OCT)", "Demand Letter to Vacate", "Proof of Service of Demand", "Barangay Certificate to File Action"],
    steps: universalPaoFlow
  },

  // --- LABOR ---
  "Illegal Dismissal (Art 279)": {
    description: "When an employee is terminated without just or authorized cause, or without due process.",
    requirements: ["Appointment Letter/Contract", "Payslips", "Termination Letter (if any)", "Notice of Conference"],
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
