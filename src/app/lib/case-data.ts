/**
 * @fileOverview Exhaustive legal database for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

export const caseCategories = {
  "Criminal": [
    {
      title: "🔴 I. CRIMES AGAINST PERSONS",
      items: ["Murder", "Homicide", "Parricide", "Infanticide", "Physical Injuries", "Illegal Detention"]
    },
    {
      title: "💜 II. VAWC (R.A. 9262)",
      items: ["Physical Violence (VAWC)", "Sexual Violence (VAWC)", "Psychological Violence (VAWC)", "Economic Abuse (VAWC)"]
    },
    {
      title: "🟠 III. CRIMES AGAINST PROPERTY",
      items: ["Robbery", "Theft", "Qualified Theft", "Estafa", "Malicious Mischief"]
    },
    {
      title: "🛡️ IV. PROPERTY CRIMES (SPECIAL LAWS)",
      items: ["Carnapping (RA 10883)", "Anti-Fencing (PD 1612)", "Bouncing Checks (BP 22)", "Arson (PD 1613)", "Anti-Electricity Pilferage (RA 7832)"]
    },
    {
      title: "⚖️ V. PUBLIC ORDER (STATE SECURITY)",
      items: ["Rebellion", "Coup d'état", "Sedition", "Conspiracy to Commit Rebellion"]
    },
    {
      title: "👮 VI. PUBLIC ORDER (AUTHORITY)",
      items: ["Direct Assault", "Indirect Assault", "Resistance & Disobedience", "Disloyalty of Public Officers"]
    },
    {
      title: "📢 VII. PUBLIC ORDER (DISTURBANCES)",
      items: ["Illegal Assembly", "Illegal Association", "Tumults & Public Disturbance", "Alarms and Scandals"]
    },
    {
      title: "💻 VIII. CYBERCRIME (SYSTEMS)",
      items: ["Illegal Access (Hacking)", "Illegal Interception", "Data Interference", "System Interference", "Cybersquatting"]
    },
    {
      title: "🆔 IX. CYBERCRIME (IDENTITY & FORGERY)",
      items: ["Computer-Related Identity Theft", "Computer-Related Forgery", "Computer-Related Fraud"]
    },
    {
      title: "🔞 X. CYBERCRIME (CONTENT)",
      items: ["Cyberlibel", "Cybersex", "Child Pornography (RA 9775)", "Photo/Video Voyeurism (RA 9995)"]
    },
    {
      title: "📦 XI. SPECIAL PENAL LAWS (DRUGS & ARMS)",
      items: ["Dangerous Drugs (RA 9165)", "Firearms Possession (RA 10591)", "Explosives Possession (RA 9516)"]
    },
    {
      title: "🌍 XII. RECRUITMENT & TRAFFICKING",
      items: ["Illegal Recruitment (RA 8042)", "Human Trafficking (RA 9208)"]
    },
    {
      title: "💍 XIII. CIVIL STATUS CRIMES",
      items: ["Bigamy", "Simulation of Birth", "Usurpation of Civil Status", "Premature Marriage"]
    },
    {
      title: "🚗 XIV. TRAFFIC & MISC",
      items: ["Reckless Imprudence (Art 365)", "Anti-Graft (RA 3019)", "Illegal Gambling (PD 1602)"]
    }
  ],
  "Civil": [
    {
      title: "📖 I. FAMILY RELATIONS",
      items: ["Annulment of Marriage", "Nullity of Marriage", "Legal Separation", "Support", "Custody of Children", "Adoption"]
    },
    {
      title: "🏠 II. PROPERTY & LAND",
      items: ["Unlawful Detainer", "Forcible Entry", "Recovery of Possession", "Partition", "Easements"]
    },
    {
      title: "📜 III. OBLIGATIONS & CONTRACTS",
      items: ["Breach of Contract", "Collection of Sum of Money", "Damages (Quasi-Delicts)"]
    },
    {
      title: "⚖️ IV. SPECIAL PROCEEDINGS",
      items: ["Correction of Entries", "Guardianship", "Settlement of Estate", "Habeas Corpus / Data / Amparo"]
    }
  ],
  "Labor": [
    {
      title: "🔒 I. DISMISSAL & TENURE",
      items: ["Illegal Dismissal (Art 279)", "Constructive Dismissal", "Regularization (Art 280)", "Closure / Redundancy (Art 283)"]
    },
    {
      title: "💰 II. MONETARY CLAIMS",
      items: ["Unpaid Wages (Art 103)", "13th Month Pay (PD 851)", "Service Incentive Leave", "Illegal Deductions (Art 113)"]
    },
    {
      title: "🌍 III. SPECIAL LABOR",
      items: ["Labor-Only Contracting", "OFW Claims (POEA)", "Illegal Strikes", "Retaliatory Measures"]
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
  "Social Case Study (if available from DSWD/MSWD)",
  "Valid Government-issued ID (Original & 3 Photocopies)"
];

export const universalPaoFlow = [
  { step: 1, title: "Intake Interview", content: "Meet with PAO staff to narrate facts and identify legal issues." },
  { step: 2, title: "Eligibility Assessment", content: "Submit proof of indigency (Income/ITR/Barangay Cert). Verified against threshold." },
  { step: 3, title: "Merit & Conflict Check", content: "Lawyer verifies case merit and checks for existing representation of the opposing party." },
  { step: 4, title: "Acceptance & Oath", content: "If qualified, sign representation agreement and take oath of indigency." },
  { step: 5, title: "Legal Strategy", content: "Drafting of complaints, affidavits, or answers. Filing in the appropriate court." }
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description: string }> = {
  // --- CRIMES AGAINST PERSONS ---
  "Murder": {
    description: "The unlawful killing of a person with qualifying circumstances such as treachery, price, reward, or evident premeditation (Art. 248, Revised Penal Code).",
    requirements: ["Police Investigation Report", "Autopsy/Medico-Legal Report", "Death Certificate (PSA)", "Sworn Witness Affidavits", "CCTV Footage/Photos (if available)"],
    steps: universalPaoFlow
  },
  "Homicide": {
    description: "The unlawful killing of a person without the qualifying circumstances of murder (Art. 249, Revised Penal Code).",
    requirements: ["Police Blotter/Report", "Death Certificate (PSA)", "Medico-Legal Report", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Parricide": {
    description: "Killing of one's father, mother, child (whether legitimate or illegitimate), or legitimate spouse (Art. 246, Revised Penal Code).",
    requirements: ["Marriage Contract / Birth Certificate (Proof of Relation)", "Death Certificate", "Police Report", "Witness Statements"],
    steps: universalPaoFlow
  },

  // --- VAWC ---
  "Physical Violence (VAWC)": {
    description: "Acts causing bodily harm or threatening physical harm against a woman or her child (Sec. 5a, RA 9262).",
    requirements: ["Proof of Relationship (Marriage/Birth Cert)", "Medico-Legal Certificate", "Photos of Injuries", "Police Blotter/Report"],
    steps: universalPaoFlow
  },
  "Psychological Violence (VAWC)": {
    description: "Acts causing mental/emotional suffering, including intimidation, harassment, or stalking (Sec. 5h-i, RA 9262).",
    requirements: ["Psychological Evaluation Report", "Screenshots of Threats/Messages", "Witness Affidavits", "Police Report"],
    steps: universalPaoFlow
  },

  // --- CRIMES AGAINST PROPERTY ---
  "Theft": {
    description: "Taking of personal property with intent to gain but without violence or intimidation (Art. 308, Revised Penal Code).",
    requirements: ["Inventory of Missing Items", "Proof of Ownership (Receipts/Photos)", "Police Report", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Qualified Theft": {
    description: "Theft committed with grave abuse of confidence, such as by a domestic servant or employee (Art. 310, Revised Penal Code).",
    requirements: ["Employment Contract / Proof of Employment", "Inventory of Loss", "Police Blotter", "Audit/Accounting Report (if applicable)"],
    steps: universalPaoFlow
  },
  "Estafa": {
    description: "Defrauding another by abuse of confidence or by means of deceit, such as false pretenses (Art. 315, Revised Penal Code).",
    requirements: ["Demand Letter with Proof of Receipt", "Contract/Agreement", "Proof of Payment/Transfer", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Bouncing Checks (BP 22)": {
    description: "Issuing a check without sufficient funds or upon a closed account (BP 22 - Bouncing Checks Law).",
    requirements: ["Original Bounced Check", "Notice of Dishonor (Demand Letter)", "Registry Return Receipt (Proof of Service)", "Bank Certification of Dishonor"],
    steps: universalPaoFlow
  },

  // --- CYBERCRIME ---
  "Cyberlibel": {
    description: "Libel as defined in Art. 355 of the RPC, committed through a computer system or social media (RA 10175).",
    requirements: ["Screenshots of Defamatory Post", "URL/Link to content", "Proof of Identity of Account Owner", "Witness Affidavits", "Police Cybercrime Report"],
    steps: universalPaoFlow
  },
  "Computer-Related Identity Theft": {
    description: "Unauthorized use of another person's identifying information via a computer system (Sec. 4b, RA 10175).",
    requirements: ["Screenshots of Unauthorized Activity", "Government ID of Victim", "URLs/Links of fake profiles", "Affidavit of Denial"],
    steps: universalPaoFlow
  },

  // --- DRUGS & ARMS ---
  "Dangerous Drugs (RA 9165)": {
    description: "Offenses involving possession, sale, or use of prohibited drugs (Comprehensive Dangerous Drugs Act of 2002).",
    requirements: ["Inventory of Seized Items (Sec 21)", "Drug Test Results", "Chemistry Report", "Buy-Bust/Arrest Report", "Chain of Custody Form"],
    steps: universalPaoFlow
  },
  "Firearms Possession (RA 10591)": {
    description: "Possessing unlicensed, unregistered, or altered 'loose firearms' (RA 10591).",
    requirements: ["Police Alarm/Incident Report", "Seized Firearm Documentation", "Ballistics Report", "Certification of No License from FEO-PNP"],
    steps: universalPaoFlow
  },

  // --- CIVIL STATUS ---
  "Bigamy": {
    description: "Contracting a second marriage while a previous marriage is still valid and subsisting (Art. 349, Revised Penal Code).",
    requirements: ["First Marriage Contract (PSA)", "Second Marriage Contract (PSA)", "CENOMAR (PSA)", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Simulation of Birth": {
    description: "Deceptively making it appear a child was born to a person not their biological mother (Art. 347, Revised Penal Code).",
    requirements: ["PSA Birth Certificate of Child", "Hospital/Clinic Records", "DNA Test Results (if any)", "Witness Affidavits"],
    steps: universalPaoFlow
  },

  // --- TRAFFIC ---
  "Reckless Imprudence (Art 365)": {
    description: "A voluntary act without malice but lacking precaution, resulting in injury or damage (Art. 365, Revised Penal Code).",
    requirements: ["Police Accident Report", "Medico-Legal Report / Death Certificate", "Photos of Scene/Vehicles", "Appraisal of Property Damage", "Witness Statements"],
    steps: universalPaoFlow
  },

  // --- CIVIL LAW ---
  "Annulment of Marriage": {
    description: "Cancellation of marriage based on grounds like psychological incapacity existing at the time of celebration (Art. 36/45, Family Code).",
    requirements: ["PSA Marriage Contract", "PSA Birth Certificates of Children", "CENOMAR", "Psychological Evaluation Report", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Unlawful Detainer": {
    description: "Recovery of possession of property after a legal right to stay (like a lease) has expired or been terminated.",
    requirements: ["Demand Letter to Vacate with Proof of Receipt", "Proof of Ownership (Title/Tax Dec)", "Barangay Certificate to File Action", "Lease Contract"],
    steps: universalPaoFlow
  },
  "Collection of Sum of Money": {
    description: "Claims for debts, unpaid loans, or services rendered (Small Claims or Civil Case).",
    requirements: ["Promissory Note / Loan Agreement", "Demand Letter with Proof of Receipt", "Statement of Account", "Barangay Cert to File Action"],
    steps: universalPaoFlow
  },

  // --- LABOR LAW ---
  "Illegal Dismissal (Art 279)": {
    description: "Termination of employment without just or authorized cause and due process (Art. 279, Labor Code).",
    requirements: ["Employment Contract", "Notice of Termination", "Latest Payslips", "Company ID", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Unpaid Wages (Art 103)": {
    description: "Claims for wages withheld, delayed, or underpaid by the employer (Art. 103, Labor Code).",
    requirements: ["Latest Payslips", "Daily Time Records (DTR)", "Company ID", "Letter of Demand to Employer"],
    steps: universalPaoFlow
  },
  "OFW Claims (POEA)": {
    description: "Assistance for OFWs regarding illegal dismissal, unpaid benefits, or death/disability claims under POEA contracts.",
    requirements: ["POEA-approved Contract", "Passport & Visa", "OEC (Overseas Employment Cert)", "Proof of Remittances / Communication Logs"],
    steps: universalPaoFlow
  }
};

export const pAONotes = [
  "✔ All PAO services are COMPLETELY FREE for qualified indigents.",
  "✔ Eligibility: You must pass the Indigency Test (Income) and Merit Test (Legal Basis).",
  "✔ Conflict of Interest: PAO cannot represent both opposing parties.",
  "✔ Preparation: Bring original documents and 3 photocopies to your appointment.",
  "✔ Special Priority: VAWC, Labor, and Criminal Defense cases take precedence."
];

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Police Report", "Subpoena"], steps: universalPaoFlow },
  Civil: { requirements: ["PSA Certificates", "Demand Letters"], steps: universalPaoFlow },
  Labor: { requirements: ["Company ID", "Payslips"], steps: universalPaoFlow },
  Administrative: { requirements: ["Notice from Agency", "Evidence"], steps: universalPaoFlow }
};
