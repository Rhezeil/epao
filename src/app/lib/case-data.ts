/**
 * @fileOverview Shared legal database for LexConnect.
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
  "Barangay Certificate of Indigency (stating purpose)",
  "Social Case Study (if available from DSWD)",
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
  // --- PERSONS ---
  "Murder": {
    description: "The unlawful killing of a person with qualifying circumstances such as treachery, price, or premeditation (Art. 248, RPC).",
    requirements: ["Police Investigation Report", "Autopsy/Medico-Legal Report", "Death Certificate", "Sworn Witness Affidavits", "CCTV Footage (if any)"],
    steps: universalPaoFlow
  },
  "Homicide": {
    description: "The unlawful killing of a person without the qualifying circumstances of murder (Art. 249, RPC).",
    requirements: ["Police Blotter", "Death Certificate", "Medico-Legal Report", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Parricide": {
    description: "Killing of one's father, mother, child, or spouse (Art. 246, RPC).",
    requirements: ["Marriage Contract / Birth Certificate (Proof of Relation)", "Death Certificate", "Police Report"],
    steps: universalPaoFlow
  },
  // --- VAWC ---
  "Physical Violence (VAWC)": {
    description: "Acts causing bodily harm or threatening physical harm (Sec. 5a, RA 9262).",
    requirements: ["Proof of Relationship (Marriage/Birth Cert)", "Medico-Legal Certificate", "Photos of Injuries", "Police Blotter/Report"],
    steps: universalPaoFlow
  },
  "Psychological Violence (VAWC)": {
    description: "Acts causing mental/emotional suffering, including intimidation or harassment (Sec. 5h-i, RA 9262).",
    requirements: ["Psychological Evaluation Report", "Screenshots of Threats/Messages", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Economic Abuse (VAWC)": {
    description: "Acts making a woman financially dependent or controlling her money (Sec. 5e, RA 9262).",
    requirements: ["Proof of Financial Denial", "Marriage Contract", "Birth Certificates of Children", "Letter of Demand for Support"],
    steps: universalPaoFlow
  },
  // --- PROPERTY ---
  "Qualified Theft": {
    description: "Theft committed with grave abuse of confidence or by a domestic servant (Art. 310, RPC).",
    requirements: ["Employment Contract (if applicable)", "Inventory of Missing Items", "Police Report", "Audit Report (if corporate)"],
    steps: universalPaoFlow
  },
  "Estafa": {
    description: "Defrauding another by abuse of confidence or by means of deceit (Art. 315, RPC).",
    requirements: ["Demand Letter", "Contract/Agreement", "Proof of Payment/Transaction", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Bouncing Checks (BP 22)": {
    description: "Issuing a check without sufficient funds or upon a closed account (BP 22).",
    requirements: ["Original Bounced Check", "Notice of Dishonor (Demand Letter)", "Registry Return Receipt", "Bank Certification of Dishonor"],
    steps: universalPaoFlow
  },
  // --- PUBLIC ORDER ---
  "Rebellion": {
    description: "Rising publicly and taking arms against the Government to overthrow it (Art. 134, RPC).",
    requirements: ["Police/Military Arrest Report", "Intelligence Reports", "Photos/Videos of Armed Gathering", "Seized Logistics Inventory"],
    steps: universalPaoFlow
  },
  "Coup d'état": {
    description: "A swift attack against military/police installations or public facilities to seize power (Art. 134-A, RPC).",
    requirements: ["Incident Report", "Deployment/Mission Orders", "Witness Testimonies", "Seized Weaponry Documentation"],
    steps: universalPaoFlow
  },
  "Direct Assault": {
    description: "Employing force or intimidation against persons in authority or their agents (Art. 148, RPC).",
    requirements: ["Police/Incident Report", "Proof of Authority Status of Victim", "Medico-Legal (if injured)", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  // --- CYBERCRIME ---
  "Cyberlibel": {
    description: "Libel committed through a computer system or social media (RA 10175).",
    requirements: ["Screenshots of Defamatory Post", "URL/Link to content", "Proof of Publication", "Witness Affidavits", "Police Cybercrime Report"],
    steps: universalPaoFlow
  },
  "Illegal Access (Hacking)": {
    description: "Unauthorized access to a computer system or network (Sec. 4a, RA 10175).",
    requirements: ["Digital Audit/Log Report", "Screenshots of Unauthorized Activity", "Police Anti-Cybercrime Report", "Ownership Proof of Account"],
    steps: universalPaoFlow
  },
  "Computer-Related Identity Theft": {
    description: "Unauthorized use of another person's identifying information via computer (Sec. 4b, RA 10175).",
    requirements: ["Screenshots of Fake Profile/Activity", "Government ID of Victim", "URLs/Links", "Affidavit of Denial"],
    steps: universalPaoFlow
  },
  // --- SPECIAL PENAL ---
  "Dangerous Drugs (RA 9165)": {
    description: "Offenses involving possession, sale, or use of prohibited drugs (RA 9165).",
    requirements: ["Inventory of Seized Items (Sec 21)", "Drug Test Results", "Chemistry Report", "Buy-Bust/Arrest Report", "CCTV (if any)"],
    steps: universalPaoFlow
  },
  "Firearms Possession (RA 10591)": {
    description: "Possessing unlicensed, unregistered, or altered firearms (loose firearms).",
    requirements: ["Police Alarm Report", "Seized Firearm Documentation", "Ballistics Report", "Certification of No License (FEO)"],
    steps: universalPaoFlow
  },
  "Explosives Possession (RA 9516)": {
    description: "Unlawful possession or manufacture of explosives or hand grenades (RA 9516).",
    requirements: ["Police Incident Report", "EOD (Explosive Ordnance Disposal) Certification", "Inventory of Seized Materials"],
    steps: universalPaoFlow
  },
  // --- RECRUITMENT & TRAFFICKING ---
  "Human Trafficking (RA 9208)": {
    description: "Recruitment or transportation of persons by force or fraud for exploitation (RA 9208 as amended).",
    requirements: ["Rescue/Police Report", "Communication Logs", "Travel Documents/Passports", "Witness Affidavits", "IACAT Documentation"],
    steps: universalPaoFlow
  },
  "Illegal Recruitment (RA 8042)": {
    description: "Recruitment activities by non-licensees or prohibited acts by licensees (RA 8042).",
    requirements: ["POEA Certification (Non-licensee)", "Recruitment Ads/Materials", "Proof of Payment", "Affidavit of Complainant"],
    steps: universalPaoFlow
  },
  // --- CIVIL STATUS ---
  "Bigamy": {
    description: "Contracting a second marriage while a previous marriage is still valid (Art. 349, RPC).",
    requirements: ["First Marriage Contract (PSA)", "Second Marriage Contract (PSA)", "CENOMAR", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Simulation of Birth": {
    description: "Deceptively making it appear a child was born to a person not their biological mother (Art. 347, RPC).",
    requirements: ["Simulated Birth Certificate", "Hospital/Clinic Records", "DNA Test Results (if any)", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  // --- TRAFFIC ---
  "Reckless Imprudence (Art 365)": {
    description: "Voluntary act without malice but lacking precaution, resulting in injury or damage (Art. 365, RPC).",
    requirements: ["Police Accident Report", "Medico-Legal / Death Certificate", "Photos of Scene/Vehicles", "Appraisal of Property Damage", "Witness Statements"],
    steps: universalPaoFlow
  },
  // --- CIVIL ---
  "Annulment of Marriage": {
    description: "Cancellation of marriage based on grounds like psychological incapacity (Art. 36/45, Family Code).",
    requirements: ["PSA Marriage Contract", "PSA Birth Certificates of Children", "CENOMAR", "Psychological Evaluation Report", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Unlawful Detainer": {
    description: "Recovery of possession of property after legal right to stay has expired.",
    requirements: ["Demand Letter to Vacate", "Proof of Ownership (Title/Tax Dec)", "Barangay Certificate to File Action", "Lease Contract (if any)"],
    steps: universalPaoFlow
  },
  "Collection of Sum of Money": {
    description: "Claims for debts or unpaid loans. (Art 1170 Civil Code).",
    requirements: ["Promissory Note / Loan Agreement", "Demand Letter with Proof of Receipt", "Statement of Account", "Barangay Cert to File Action"],
    steps: universalPaoFlow
  },
  // --- LABOR ---
  "Illegal Dismissal (Art 279)": {
    description: "Termination of employment without just or authorized cause and due process (Art. 279, Labor Code).",
    requirements: ["Employment Contract", "Notice of Termination", "Latest Payslips", "Company ID", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "OFW Claims (POEA)": {
    description: "Assistance for OFWs regarding illegal dismissal or unpaid benefits under POEA contracts.",
    requirements: ["POEA-approved Contract", "Passport & Visa", "OEC (Overseas Employment Cert)", "Communication Logs with Agency"],
    steps: universalPaoFlow
  },
  "Unpaid Wages (Art 103)": {
    description: "Claims for wages not paid on time or withheld by employer (Art. 103, Labor Code).",
    requirements: ["Latest Payslips", "Daily Time Records (DTR)", "Company ID", "Letter of Demand to Employer"],
    steps: universalPaoFlow
  }
};

export const pAONotes = [
  "✔ All PAO services are COMPLETELY FREE for qualified indigents.",
  "✔ Eligibility: You must pass the Indigency Test (Income) and Merit Test (Legal Basis).",
  "✔ Conflict of Interest: PAO cannot represent both opposing parties.",
  "✔ Preparation: Bring original documents and 3 photocopies to your appointment.",
  "✔ Special Priority: VAWC, Labor, and Criminal Defense for the poor take precedence."
];

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Police Report", "Subpoena"], steps: universalPaoFlow },
  Civil: { requirements: ["PSA Certificates", "Demand Letters"], steps: universalPaoFlow },
  Labor: { requirements: ["Company ID", "Payslips"], steps: universalPaoFlow },
  Administrative: { requirements: ["Notice from Agency", "Evidence"], steps: universalPaoFlow }
};
