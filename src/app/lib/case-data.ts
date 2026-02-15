/**
 * @fileOverview Shared legal database for LexConnect.
 * Comprehensive documentation and process flows based on official PAO standards.
 */

export const caseCategories = {
  "Criminal": [
    {
      title: "🔴 I. CRIMES AGAINST PERSONS",
      items: [
        "Murder", 
        "Homicide", 
        "Parricide", 
        "Infanticide", 
        "Physical Injuries (Serious, Less Serious, Slight)",
        "Illegal Detention/Kidnapping"
      ]
    },
    {
      title: "💜 II. VAWC (R.A. 9262)",
      items: [
        "Physical Violence (VAWC - Sec. 5a)",
        "Sexual Violence (VAWC - Sec. 5b-c)",
        "Psychological Violence (VAWC - Sec. 5h-i)",
        "Economic Abuse (VAWC - Sec. 5e)"
      ]
    },
    {
      title: "🟠 III. CRIMES AGAINST PROPERTY (RPC Title Ten)",
      items: [
        "Robbery (with violence/intimidation - Art. 294)",
        "Robbery (with force upon things - Art. 299 & 302)",
        "Brigandage (Art. 306)",
        "Theft (Art. 308)",
        "Qualified Theft (Art. 310)",
        "Usurpation of Real Rights (Art. 312)",
        "Altering Boundaries (Art. 313)",
        "Swindling/Estafa (Art. 315)",
        "Other Forms of Swindling (Art. 316)",
        "Removal, Sale, or Pledge of Mortgaged Property (Art. 319)",
        "Arson (Art. 320-323)",
        "Malicious Mischief (Art. 327-331)"
      ]
    },
    {
      title: "🛠 IV. PROPERTY CRIMES (Special Laws)",
      items: [
        "New Anti-Carnapping Act (RA 10883)",
        "Anti-Cattle Rustling Law (PD 533)",
        "Forestry Code & Timber Smuggling (PD 705/330)",
        "Anti-Fencing Law (PD 1612)",
        "Bouncing Checks Law (BP 22)",
        "Trust Receipts Law (PD 115)",
        "Qualified Estafa (PD 1689)",
        "Anti-Arson Law (PD 1613)",
        "Anti-Electricity Pilferage (RA 7832)",
        "Anti-Cable Television & Internet Tapping (RA 10088)",
        "Unauthorized Installation of Water/Telephone (PD 401)",
        "Anti-Agricultural Smuggling (RA 10845)",
        "Illegal Fishing (RA 8550)"
      ]
    },
    {
      title: "🔵 V. CRIMES AGAINST STATE SECURITY",
      items: [
        "Rebellion or Insurrection",
        "Coup d'état",
        "Conspiracy and Proposal to Commit Rebellion/Coup d'état",
        "Disloyalty of Public Officers/Employees",
        "Sedition",
        "Conspiracy to Commit Sedition",
        "Inciting to Rebellion or Sedition"
      ]
    },
    {
      title: "🛡 VI. CRIMES AGAINST AUTHORITY",
      items: [
        "Direct Assault",
        "Indirect Assault",
        "Resistance and Disobedience to a Person in Authority",
        "Acts Against Parliamentary Immunity"
      ]
    },
    {
      title: "📢 VII. PUBLIC DISORDER",
      items: [
        "Illegal Assemblies",
        "Illegal Associations",
        "Tumults and Other Disturbances",
        "Unlawful Utterances, Alarms, and Scandals",
        "Delivering Prisoners from Jail/Evasion of Service of Sentence"
      ]
    },
    {
      title: "📦 VIII. DANGEROUS DRUGS CASES (RA 9165)",
      items: [
        "Illegal Possession of Dangerous Drugs (Section 11)",
        "Illegal Possession of Paraphernalia (Section 12)",
        "Drug Trafficking / Pushing (Section 5)",
        "Use of Dangerous Drugs (Section 15)",
        "Cultivation of Marijuana (Section 16)",
        "Drug Cases Involving Minors",
        "Drug Plea Bargaining Applications"
      ]
    },
    {
      title: "💖 IX. CRIMES AGAINST CHASTITY (RPC)",
      items: [
        "Adultery (Art. 333)",
        "Concubinage (Art. 334)",
        "Acts of Lasciviousness (Art. 336)",
        "Qualified Seduction (Art. 337)",
        "Simple Seduction (Art. 338)",
        "Forcible Abduction (Art. 342)",
        "Consented Abduction (Art. 343)",
        "Corruption of Minors (Art. 340)",
        "White Slave Trade (Art. 341)",
        "Abuses Against Chastity by Public Officers (Art. 245)"
      ]
    },
    {
      title: "💻 X. SEXUAL VIOLENCE & SPECIAL LAWS",
      items: [
        "Rape (R.A. 8353 / Art. 266-A)",
        "Acts of Lasciviousness under R.A. 7610",
        "Anti-Trafficking (R.A. 9208)",
        "Anti-Sexual Harassment (R.A. 7877)"
      ]
    },
    {
      title: "🔫 XI. FIREARMS & EXPLOSIVES LAWS (RA 10591 & RA 9516)",
      items: [
        "Illegal Possession of Firearms (RA 10591)",
        "Illegal Possession of Explosives (RA 9516)",
        "Unlawful Manufacture of Explosives"
      ]
    },
    {
      title: "🚗 XII. TRAFFIC LAWS & RECKLESS IMPRUDENCE (Art. 365)",
      items: [
        "Reckless Imprudence Resulting in Homicide",
        "Reckless Imprudence Resulting in Physical Injuries",
        "Reckless Imprudence Resulting in Damage to Property"
      ]
    },
    {
      title: "📜 XIII. CRIMES AGAINST CIVIL STATUS (RPC)",
      items: [
        "Simulation of Births (Art. 347)",
        "Usurpation of Civil Status (Art. 348)",
        "Bigamy (Art. 349)",
        "Marriage Contracted Against Provisions of Law (Art. 350)",
        "Premature Marriage (Art. 351)",
        "Performance of Illegal Marriage Ceremony (Art. 352)"
      ]
    },
    {
      title: "📡 XIV. CYBERCRIME (RA 10175 & Special Laws)",
      items: [
        "Illegal Access (Hacking)",
        "Illegal Interception",
        "Data Interference",
        "System Interference",
        "Misuse of Devices",
        "Cybersquatting",
        "Computer-related Forgery",
        "Computer-related Fraud (Online Scams)",
        "Computer-related Identity Theft",
        "Cybersex",
        "Child Pornography (Cyber-related)",
        "Cyberlibel",
        "Online Estafa/Swindling",
        "Online Threats/Coercion",
        "Photo/Video Voyeurism (RA 9995)",
        "Violation of Data Privacy Act (RA 10173)",
        "Financial Account Scamming (AFASA - RA 12010)"
      ]
    }
  ],
  "Civil": [
    {
      title: "📖 I. FAMILY RELATIONS CASES",
      items: [
        "Declaration of Nullity of Marriage", 
        "Annulment of Marriage", 
        "Legal Separation", 
        "Support", 
        "Custody of Children", 
        "Adoption",
        "Recognition of Foreign Divorce"
      ]
    },
    {
      title: "🏠 II. PROPERTY AND LAND DISPUTES",
      items: [
        "Forcible Entry", 
        "Unlawful Detainer", 
        "Recovery of Possession", 
        "Recovery of Ownership", 
        "Partition", 
        "Easements"
      ]
    },
    {
      title: "📝 III. OBLIGATIONS AND CONTRACTS",
      items: [
        "Breach of Contract", 
        "Collection of Sum of Money", 
        "Damages", 
        "Small Claims"
      ]
    },
    {
      title: "⚖️ IV. SPECIAL PROCEEDINGS AND OTHERS",
      items: [
        "Guardianship", 
        "Correction of Entries in the Civil Registry", 
        "Settlement of Estate", 
        "Writ of Habeas Data/Amparo"
      ]
    }
  ],
  "Labor": [
    {
      title: "🔒 I. ILLEGAL DISMISSAL & SECURITY OF TENURE",
      items: [
        "Illegal Dismissal (Art. 279)",
        "Regular and Casual Employment (Art. 280)",
        "Termination by Employer (Art. 282)",
        "Closure of Business/Disease (Art. 283-284)",
        "Constructive Dismissal",
        "Illegal Suspension"
      ]
    },
    {
      title: "💰 II. LABOR STANDARDS (MONETARY CLAIMS)",
      items: [
        "Service Incentive Leave (Art. 95)",
        "Payment by Results (Art. 101)",
        "Time of Payment of Wages (Art. 103)",
        "Unlawful Wage Deductions (Art. 113)",
        "13th Month Pay (P.D. 851)",
        "Underpayment of Wages",
        "Non-payment of Overtime/Holiday Pay"
      ]
    },
    {
      title: "🌍 III. SPECIAL LABOR CASES",
      items: [
        "Labor-Only Contracting (Art. 106-109)",
        "Illegal Strikes/Lockouts (Art. 264)",
        "Retaliatory Measures (Art. 118)",
        "OFW Cases (Illegal Dismissal/Benefits)"
      ]
    }
  ],
  "Special Legislation": [
    {
      title: "🏢 Social & Special Laws",
      items: ["Anti-Trafficking (RA 9208)", "Anti-Child Pornography (RA 9775)", "Anti-Hazing (RA 11053)", "Anti-Illegal Recruitment", "Juvenile Justice (RA 9344)"]
    }
  ],
  "Administrative": [
    {
      title: "🏛 Quasi-Judicial",
      items: ["Civil Service Cases", "SSS / GSIS Claims", "DARAB Cases", "PRC Cases", "Barangay Conciliation"]
    }
  ]
};

export const universalPaoFlow = [
  { step: 1, title: "Application and Evaluation", content: "The client visits the nearest PAO district office to file a request for legal assistance." },
  { step: 2, title: "Indigency Test", content: "The applicant must prove they are indigent. This generally means having a low income and owning no significant real property." },
  { step: 3, title: "Merit Test", content: "A PAO lawyer assesses if the case has merit—meaning it has a chance of success and is not intended merely to harass the opposite party." },
  { step: 4, title: "Conflict of Interest Check", content: "The PAO verifies that they do not already represent the opposing party to avoid conflicts of interest." },
  { step: 5, title: "Acceptance", content: "If the applicant passes, the lawyer formally accepts the case and provides representation, counseling, or document drafting." }
];

export const defaultSteps = universalPaoFlow;

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description?: string }> = {
  // --- CRIMES AGAINST PERSONS ---
  "Murder": { 
    description: "Unlawful killing of a person with qualifying circumstances such as treachery, superior strength, or for reward/price.",
    requirements: ["Police blotter", "Sworn Complaint-Affidavit", "Medico-Legal Certificate", "Death Certificate", "Autopsy report", "Witness affidavits"], 
    steps: defaultSteps 
  },
  "Homicide": {
    description: "Unlawful killing of a person that does not amount to murder, parricide, or infanticide.",
    requirements: ["Police blotter", "Sworn Complaint-Affidavit", "Medico-Legal Certificate", "Death Certificate", "Autopsy report", "Witness affidavits"],
    steps: defaultSteps
  },
  "Parricide": {
    description: "The killing of a father, mother, or child (whether legitimate or illegitimate), or any of the ascendants or descendants, or the spouse.",
    requirements: ["Marriage Certificate (if spouse)", "Birth Certificate (if parent/child)", "Police blotter", "Death Certificate", "Witness affidavits"],
    steps: defaultSteps
  },
  "Infanticide": {
    description: "The killing of a child less than three days (72 hours) of age.",
    requirements: ["Birth Certificate of child", "Police report", "Medico-legal report (cause of death)", "Witness affidavits"],
    steps: defaultSteps
  },
  "Illegal Detention/Kidnapping": {
    description: "Unlawful deprivation of liberty, including cases involving unlawful arrest by public officers.",
    requirements: ["Police report", "Sworn Affidavit of victim/witnesses", "Evidence of detention duration", "Arrest report (if applicable)"],
    steps: defaultSteps
  },

  // --- VAWC (R.A. 9262) ---
  "Physical Violence (VAWC - Sec. 5a)": {
    description: "Acts that include bodily or physical harm, battery, or threatening/placing the victim in fear of physical harm (Sec. 5a, RA 9262).",
    requirements: ["Marriage Certificate / Proof of Relationship", "Birth Certificates of children", "Medico-Legal Certificate", "Photos of injuries", "Sworn Affidavit", "Police Blotter"],
    steps: defaultSteps
  },
  "Sexual Violence (VAWC - Sec. 5b-c)": {
    description: "Acts of a sexual nature including rape, lasciviousness, sexual harassment, or prostituting the woman or child (Sec. 5b-c, RA 9262).",
    requirements: ["Marriage Certificate / Proof of Relationship", "Medico-Legal Certificate", "Psychological Evaluation", "Sworn Complaint-Affidavit", "Police Blotter"],
    steps: defaultSteps
  },
  "Psychological Violence (VAWC - Sec. 5h-i)": {
    description: "Acts causing mental or emotional suffering, including intimidation, harassment, stalking, or marital infidelity (Sec. 5h-i, RA 9262).",
    requirements: ["Marriage Certificate / Proof of Relationship", "Psychological Evaluation report", "Screenshots of messages/harassment", "Witness affidavits", "Sworn Affidavit"],
    steps: defaultSteps
  },
  "Economic Abuse (VAWC - Sec. 5e)": {
    description: "Acts making a woman financially dependent, such as withdrawing support or controlling assets (Sec. 5e, RA 9262).",
    requirements: ["Marriage Certificate / Proof of Relationship", "Birth Certificates of children", "Proof of income of partner", "Proof of denial of support", "Sworn Affidavit"],
    steps: defaultSteps
  },

  // --- CRIMES AGAINST PROPERTY (RPC) ---
  "Robbery (with violence/intimidation - Art. 294)": {
    description: "Taking of personal property belonging to another with intent to gain, by means of violence or intimidation against persons.",
    requirements: ["Police report", "Affidavit of loss", "Proof of ownership", "Inventory of stolen items", "Witness affidavits", "CCTV footage"],
    steps: defaultSteps
  },
  "Robbery (with force upon things - Art. 299 & 302)": {
    description: "Taking of property by breaking into an inhabited house, public building, or private building using force upon things.",
    requirements: ["Police report", "Affidavit of loss", "Photos of forced entry", "Inventory of stolen items", "Witness affidavits"],
    steps: defaultSteps
  },
  "Brigandage (Art. 306)": {
    description: "Robbery committed by a band of more than three armed persons on the highway.",
    requirements: ["Police report", "Arrest records", "Witness affidavits", "Inventory of seized items"],
    steps: defaultSteps
  },
  "Theft (Art. 308)": {
    description: "Taking personal property belonging to another without consent, with intent to gain, but without violence or intimidation.",
    requirements: ["Police report", "Affidavit of loss", "Proof of ownership (receipts)", "CCTV footage", "Witness affidavits"],
    steps: defaultSteps
  },
  "Qualified Theft (Art. 310)": {
    description: "Theft committed by a domestic servant, or with grave abuse of confidence, or involving specific items.",
    requirements: ["Employment records", "Police report", "Affidavit of loss", "Proof of ownership", "Witness affidavits"],
    steps: defaultSteps
  },
  "Usurpation of Real Rights (Art. 312)": {
    description: "Taking possession of real property or claiming real rights through violence or intimidation.",
    requirements: ["Land Title / Proof of Ownership", "Police blotter", "Witness affidavits", "Photos of site"],
    steps: defaultSteps
  },
  "Altering Boundaries (Art. 313)": {
    description: "Moving landmarks on boundary lines to change property extent.",
    requirements: ["Property Survey report", "Photos of altered landmarks", "Witness affidavits", "Land titles"],
    steps: defaultSteps
  },
  "Swindling/Estafa (Art. 315)": {
    description: "Defrauding another through unfaithfulness, abuse of confidence, or false pretenses causing damage or prejudice.",
    requirements: ["Contract/Agreement", "Promissory note", "Receipts", "Demand letter with proof of receipt", "SMS/Chat logs"],
    steps: defaultSteps
  },
  "Other Forms of Swindling (Art. 316)": {
    description: "Includes selling, mortgaging, or pledging property as free from encumbrances when it is not.",
    requirements: ["Sales Contract", "Certified True Copy of Title", "Evidence of encumbrance", "Demand Letter"],
    steps: defaultSteps
  },
  "Removal, Sale, or Pledge of Mortgaged Property (Art. 319)": {
    description: "Removing, selling, or pledging mortgaged property without the mortgagee's consent (Chattel Mortgage Law).",
    requirements: ["Chattel Mortgage contract", "Proof of unauthorized sale", "Demand Letter", "Police report"],
    steps: defaultSteps
  },
  "Arson (Art. 320-323)": {
    description: "Intentional burning of property, including destructive arson.",
    requirements: ["Bureau of Fire Protection (BFP) report", "Photos of site", "Sworn Affidavit of witnesses", "Affidavit of loss"],
    steps: defaultSteps
  },
  "Malicious Mischief (Art. 327-331)": {
    description: "Deliberately destroying or damaging another’s property for vengeance or mere pleasure.",
    requirements: ["Police report", "Photos of damage", "Estimate of repair cost", "Witness affidavits"],
    steps: defaultSteps
  },

  // --- SPECIAL PROPERTY LAWS ---
  "New Anti-Carnapping Act (RA 10883)": {
    description: "Theft/taking of a motor vehicle with intent to gain, without the owner's consent.",
    requirements: ["Police blotter", "OR/CR of vehicle", "Affidavit of loss", "Purchase documents", "CCTV/Witness statements"],
    steps: defaultSteps
  },
  "Bouncing Checks Law (BP 22)": {
    description: "Issuing checks without sufficient funds or failing to maintain funds after issuance.",
    requirements: ["Original Bounced Check", "Notice of Dishonor (Demand Letter)", "Registry return receipt", "Affidavit of complainant"],
    steps: defaultSteps
  },
  "Trust Receipts Law (PD 115)": {
    description: "Failure to turn over proceeds or return goods held in trust to the entrustee.",
    requirements: ["Trust Receipt agreement", "Demand Letter", "Evidence of non-payment", "Contract of sale"],
    steps: defaultSteps
  },
  "Qualified Estafa (PD 1689)": {
    description: "Fraud committed by a syndicate or on funds/property, which carries higher penalties.",
    requirements: ["Proof of syndicate/organized group", "Contract/Agreement", "Receipts", "Demand Letter", "Witness affidavits"],
    steps: defaultSteps
  },
  "Anti-Cattle Rustling Law (PD 533)": {
    description: "Theft of large cattle such as cows, carabaos, or horses.",
    requirements: ["Police report", "Proof of ownership (Cattle certificate)", "Witness affidavits", "Photos of animal"],
    steps: defaultSteps
  },
  "Anti-Agricultural Smuggling (RA 10845)": {
    description: "Economic sabotage through large-scale illicit trade of agricultural products.",
    requirements: ["Customs report", "Inventory of seized goods", "Import documents", "Witness statements"],
    steps: defaultSteps
  },
  "Anti-Electricity Pilferage (RA 7832)": {
    description: "Theft of electricity or tampering with electric transmission lines/materials.",
    requirements: ["Inspection report from Utility Company", "Photos of tampered meter/lines", "Police blotter", "Witness affidavits"],
    steps: defaultSteps
  },
  "Anti-Cable Television & Internet Tapping (RA 10088)": {
    description: "Theft of cable television or internet service through unauthorized tapping.",
    requirements: ["Inspection report from Service Provider", "Photos of unauthorized connection", "Police report"],
    steps: defaultSteps
  },
  "Unauthorized Installation of Water/Telephone (PD 401)": {
    description: "Illegal tapping or installation of water or telephone lines.",
    requirements: ["Utility company report", "Photos of illegal tapping", "Police blotter", "Witness statements"],
    steps: defaultSteps
  },

  // --- PUBLIC ORDER & SECURITY ---
  "Rebellion or Insurrection": {
    description: "Rising publicly and taking up arms against the Government for the purpose of removing allegiance or power.",
    requirements: ["Arrest report", "Witness affidavits", "Intelligence reports", "Media/Video evidence"],
    steps: defaultSteps
  },
  "Coup d'état": {
    description: "A swift attack against military/police installations or public facilities to seize state power.",
    requirements: ["After-operation reports", "Arrest records", "Evidence of organized planning", "Witness affidavits"],
    steps: defaultSteps
  },
  "Sedition": {
    description: "Rising publicly and tumultuously to prevent the execution of laws or to inflict hate upon public officers.",
    requirements: ["Police report", "Photos/Videos of incident", "Witness affidavits", "Media reports"],
    steps: defaultSteps
  },
  "Direct Assault": {
    description: "Employing force or intimidation against persons in authority or their agents while in the performance of official duties.",
    requirements: ["Police blotter", "Medico-legal (if injured)", "Sworn statement of officer", "Witness affidavits"],
    steps: defaultSteps
  },

  // --- CHASTITY & SEXUAL VIOLENCE ---
  "Adultery (Art. 333)": {
    description: "Sexual infidelity committed by a married woman and her paramour.",
    requirements: ["Marriage Certificate", "Evidence of infidelity (Photos/Messages)", "Witness affidavits", "Sworn complaint"],
    steps: defaultSteps
  },
  "Acts of Lasciviousness (Art. 336)": {
    description: "Engaging in lewd acts with another person under circumstances of force or intimidation.",
    requirements: ["Medico-legal report", "Sworn complaint of victim", "Witness affidavits", "Psychological evaluation"],
    steps: defaultSteps
  },
  "Rape (R.A. 8353 / Art. 266-A)": {
    description: "Classified as a crime against persons; involves carnal knowledge or sexual assault through force, threat, or intimidation.",
    requirements: ["Medico-legal Examination", "Sworn Affidavit of victim", "Police Blotter", "Photos of injuries (if any)", "Psychological evaluation"],
    steps: defaultSteps
  },

  // --- FIREARMS & TRAFFIC ---
  "Illegal Possession of Firearms (RA 10591)": {
    description: "Possessing unlicensed, unregistered, or altered firearms (loose firearms).",
    requirements: ["Police Arrest Report", "Inventory of Seized Items", "Firearms License Verification", "Chemistry/Ballistics report"],
    steps: defaultSteps
  },
  "Reckless Imprudence Resulting in Homicide": {
    description: "Voluntary act without malice but lacking precaution, resulting in death (Art. 365 RPC).",
    requirements: ["Police Accident Report", "Death Certificate", "Driver's License", "Vehicle Registration", "Witness affidavits"],
    steps: defaultSteps
  },

  // --- CIVIL STATUS ---
  "Bigamy (Art. 349)": {
    description: "Contracting a second or subsequent marriage while a previous marriage is still valid and subsisting.",
    requirements: ["Marriage Certificate (1st Marriage)", "Marriage Certificate (2nd Marriage)", "CENOMAR", "Witness affidavits"],
    steps: defaultSteps
  },

  // --- CYBERCRIME (RA 10175) ---
  "Illegal Access (Hacking)": {
    description: "Unauthorized access to a computer system or network (Section 4a of RA 10175).",
    requirements: ["Screenshots of unauthorized access", "IP logs (if available)", "Proof of account ownership", "Police blotter from PNP Anti-Cybercrime Group"],
    steps: defaultSteps
  },
  "Illegal Interception": {
    description: "Unauthorized interception of technical communications (Section 4a of RA 10175).",
    requirements: ["Evidence of data transmission tapping", "Device logs", "Witness statements", "PNP/NBI Cybercrime report"],
    steps: defaultSteps
  },
  "Data Interference": {
    description: "Intentionally altering, damaging, or deleting computer data/viruses (Section 4a of RA 10175).",
    requirements: ["System logs showing alterations", "Evidence of corrupted files", "Forensic computer report", "Police blotter"],
    steps: defaultSteps
  },
  "System Interference": {
    description: "Intentionally hindering the functioning of a computer system (e.g., DDoS attacks) (Section 4a of RA 10175).",
    requirements: ["Network traffic logs", "Server uptime records", "Evidence of system downtime", "Incident report from IT/Security"],
    steps: defaultSteps
  },
  "Misuse of Devices": {
    description: "Producing or selling tools/passwords designed to commit cybercrimes (Section 4a of RA 10175).",
    requirements: ["Evidence of prohibited tools/software", "Transaction records", "Screenshots of advertisements/sales", "Expert testimony"],
    steps: defaultSteps
  },
  "Cybersquatting": {
    description: "Registering a domain name in bad faith to profit or destroy reputation (Section 4a of RA 10175).",
    requirements: ["Proof of domain registration", "Evidence of bad faith/intent to profit", "Prior trademark/copyright proof", "Screenshots of the domain"],
    steps: defaultSteps
  },
  "Computer-related Forgery": {
    description: "Inputting or altering computer data to create false documents with intent to defraud (Section 4b of RA 10175).",
    requirements: ["Original and forged data/documents", "System logs showing input/alteration", "Evidence of fraudulent intent", "Witness affidavits"],
    steps: defaultSteps
  },
  "Computer-related Fraud (Online Scams)": {
    description: "Unauthorized input or alteration of data for personal gain, such as phishing or online scams (Section 4b of RA 10175).",
    requirements: ["Screenshots of fraudulent communications", "Transaction records (GCash, Bank)", "URLs of fraudulent sites", "Proof of loss"],
    steps: defaultSteps
  },
  "Computer-related Identity Theft": {
    description: "Unauthorized acquisition or use of another person's identifying information through a computer (Section 4b of RA 10175).",
    requirements: ["Proof of identity ownership", "Evidence of unauthorized use", "Screenshots of impersonation", "Police report"],
    steps: defaultSteps
  },
  "Cybersex": {
    description: "Operating lascivious exhibitions of sexual organs/activity via computer for consideration (Section 4c of RA 10175).",
    requirements: ["Recorded video/audio evidence", "Transaction records for payments", "IP logs", "Witness statements"],
    steps: defaultSteps
  },
  "Child Pornography (Cyber-related)": {
    description: "Acts of child pornography committed through a computer system (RA 9775 in relation to RA 10175).",
    requirements: ["Illegal content evidence", "Device forensic report", "Communication logs", "Birth certificate of minor", "Police/NBI report"],
    steps: defaultSteps
  },
  "Cyberlibel": {
    description: "Libelous acts committed through a computer system or social media (Section 4c of RA 10175).",
    requirements: ["Screenshots of defamatory posts/comments", "URLs of the content", "Proof of publication and malice", "Witness affidavits"],
    steps: defaultSteps
  },
  "Online Estafa/Swindling": {
    description: "Traditional estafa committed through online platforms, carrying higher penalties (RA 10175 Section 6).",
    requirements: ["Screenshots of transactions", "Communication logs (Chat/SMS)", "Proof of payment", "Evidence of false pretenses"],
    steps: defaultSteps
  },
  "Online Threats/Coercion": {
    description: "Threatening or coercing someone through private messages or social media.",
    requirements: ["Screenshots of threats/coercion", "Proof of sender identity (if known)", "Timeline of harassment", "Police blotter"],
    steps: defaultSteps
  },
  "Photo/Video Voyeurism (RA 9995)": {
    description: "Recording or distributing sexual content without the consent of the subject (Anti-Photo and Video Voyeurism Act).",
    requirements: ["The illegal photo/video evidence", "Proof of distribution", "Witness statements", "Device forensic report"],
    steps: defaultSteps
  },
  "Violation of Data Privacy Act (RA 10173)": {
    description: "Improper processing or unauthorized disclosure of personal data (RA 10173).",
    requirements: ["Evidence of data leak/misuse", "Proof of unauthorized processing", "Communications from the data controller", "NPC complaint records"],
    steps: defaultSteps
  },
  "Financial Account Scamming (AFASA - RA 12010)": {
    description: "Targeting mule accounts and online selling of registered SIMs for fraudulent purposes (RA 12010).",
    requirements: ["Evidence of mule account activity", "SIM registration records", "Transaction logs", "Police/NBI report"],
    steps: defaultSteps
  },

  // --- CIVIL LAW ---
  "Declaration of Nullity of Marriage": {
    description: "Declaration that a marriage was void from the beginning (e.g., Art. 36 Psychological Incapacity).",
    requirements: ["PSA Marriage Contract", "PSA Birth Certificates of children", "Psychological Evaluation Report (if Art. 36)", "Barangay Certificate of Residence", "Witness affidavits"],
    steps: defaultSteps
  },
  "Support": {
    description: "Everything indispensable for sustenance, dwelling, clothing, and medical attendance (Art. 194-208 Family Code).",
    requirements: ["PSA Birth Certificate of child", "Proof of financial need", "Proof of respondent's income (if available)", "Affidavit of dependency"],
    steps: defaultSteps
  },
  "Collection of Sum of Money": {
    description: "Claims for debts, unpaid loans, or services rendered (Small Claims up to P1M).",
    requirements: ["Promissory Note or Acknowledgment Receipt", "Statement of Account", "Demand Letter with proof of service", "Proof of partial payments"],
    steps: defaultSteps
  },

  // --- LABOR LAW ---
  "Illegal Dismissal (Art. 279)": {
    description: "Protection for employees dismissed without just or authorized cause. Claims include reinstatement and full backwages.",
    requirements: ["Employment Contract", "Notice of Termination (if any)", "Payslips", "SSS/PhilHealth records", "Company ID", "Witness affidavits"],
    steps: defaultSteps
  },
  "Regular and Casual Employment (Art. 280)": {
    description: "Distinguishing employment types to determine entitlement to regularization and separation pay.",
    requirements: ["Employment Contract", "Appointment Letter", "Performance Reviews", "Proof of work duration", "Payslips"],
    steps: defaultSteps
  },
  "Termination by Employer (Art. 282)": {
    description: "Disputes regarding dismissal based on serious misconduct, willful disobedience, gross neglect of duty, or fraud.",
    requirements: ["Notice of Termination", "Notice of Hearing/Explanation", "Company Rules/Handbook", "Payslips", "Counter-affidavit"],
    steps: defaultSteps
  },
  "Closure of Business/Disease (Art. 283-284)": {
    description: "Disputes regarding authorized causes such as retrenchment, redundancy, or closure of business.",
    requirements: ["Notice of Closure to DOLE", "Termination Notice", "Financial Statements of Company (if retrenchment)", "Medical Certificate (if disease)"],
    steps: defaultSteps
  },
  "Constructive Dismissal": {
    description: "When continued employment is rendered impossible, unreasonable, or unlikely, forcing the employee to quit.",
    requirements: ["Resignation Letter (if forced)", "Evidence of harassment/demotion", "Proof of floating status (>6 months)", "Witness affidavits"],
    steps: defaultSteps
  },
  "Illegal Suspension": {
    description: "Employees suspended without valid cause or proper procedure beyond the legal limit of 30 days.",
    requirements: ["Notice of Suspension", "Explanation/Counter-statement", "Company ID", "Payslips"],
    steps: defaultSteps
  },
  "Service Incentive Leave (Art. 95)": {
    description: "Claims for five (5) days of leave with pay for employees who rendered at least one year of service.",
    requirements: ["Payslips", "Employment Contract", "Service Records", "Company ID"],
    steps: defaultSteps
  },
  "Time of Payment of Wages (Art. 103)": {
    description: "Claims for unpaid or delayed wages according to the legally mandated schedule.",
    requirements: ["Payslips", "Timesheets/Logbooks", "Employment Contract", "Demand Letter"],
    steps: defaultSteps
  },
  "Unlawful Wage Deductions (Art. 113)": {
    description: "Prohibits unauthorized deductions from wages such as 'cash bonds' or 'company losses' without consent.",
    requirements: ["Payslips showing deductions", "Notice of deduction", "Employment Contract", "Company ID"],
    steps: defaultSteps
  },
  "13th Month Pay (P.D. 851)": {
    description: "Mandatory benefit for all rank-and-file employees who rendered at least one month of service during the calendar year.",
    requirements: ["Payslips", "Proof of employment duration", "Company ID", "DOLE complaint (if already filed)"],
    steps: defaultSteps
  },
  "Underpayment of Wages": {
    description: "Claims for wages below the legally mandated minimum wage for the region.",
    requirements: ["Payslips", "Timesheets", "Regional Wage Order info", "Company ID"],
    steps: defaultSteps
  },
  "Labor-Only Contracting (Art. 106-109)": {
    description: "Cases where employees claim regular employment with the principal employer due to prohibited contracting practices.",
    requirements: ["Contract with Agency", "Company ID of Principal", "Daily Time Records", "Directives from Principal supervisors"],
    steps: defaultSteps
  },
  "OFW Cases (Illegal Dismissal/Benefits)": {
    description: "Claims for illegal dismissal, death/disability benefits, and violations of POEA contracts for overseas workers.",
    requirements: ["POEA Contract", "OWIA/Deployment records", "Passport & Visa copies", "Proof of remittance", "Medical reports (if disability)"],
    steps: defaultSteps
  }
};

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Court Subpoena", "Arrest Record", "Copy of Complaint"], steps: universalPaoFlow },
  Civil: { requirements: ["Relevant contracts", "Demand letter", "Proof of claim"], steps: universalPaoFlow },
  Labor: { requirements: ["Employment records", "Payslips", "Notice of Dismissal", "Company ID"], steps: universalPaoFlow }
};

export const pAONotes = [
  "✔ Mandatory Prerequisites: Valid ID, Affidavit of Indigency, Barangay Certificate of Indigency, Proof of Income.",
  "✔ PAO mainly handles criminal defense cases for indigent accused.",
  "✔ Civil and Labor cases require both Indigency and Merit Tests.",
  "✔ Wealthy individuals or corporations are NOT qualified for PAO services.",
  "✔ All services provided by the PAO are completely FREE of charge."
];

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));
