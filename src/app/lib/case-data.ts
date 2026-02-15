/**
 * @fileOverview Refined legal database for LexConnect.
 * Standardized documentation and process flows based on official PAO, DOJ, and Supreme Court standards.
 */

export const caseCategories = {
  "Criminal": [
    {
      title: "🔴 I. CRIMES AGAINST PERSONS",
      items: [
        "Parricide (Art. 246)", 
        "Murder (Art. 248)", 
        "Homicide (Art. 249)", 
        "Physical Injuries (Arts. 262–266)",
        "Abortion (Arts. 256–259)",
        "Discharge of Firearms (Art. 254 / RA 11926)"
      ]
    },
    {
      title: "🟠 II. CRIMES AGAINST PROPERTY",
      items: [
        "Robbery (Arts. 293–294)", 
        "Theft (Art. 308)", 
        "Qualified Theft (Art. 310)", 
        "Estafa (Art. 315)", 
        "Arson (Arts. 320–326)", 
        "Malicious Mischief (Art. 327)",
        "Bouncing Checks (BP 22)", 
        "Anti-Fencing (PD 1612)",
        "Electricity Pilferage (RA 7832)"
      ]
    },
    {
      title: "⛓ III. CRIMES AGAINST PERSONAL LIBERTY",
      items: [
        "Kidnapping / Serious Illegal Detention (Art. 267)", 
        "Grave Threats (Art. 282)", 
        "Grave Coercion (Art. 286)"
      ]
    },
    {
      title: "🔞 IV. SEXUAL OFFENSES",
      items: [
        "Rape (Art. 266-A)", 
        "Acts of Lasciviousness (Art. 336)"
      ]
    },
    {
      title: "🏛 V. CRIMES AGAINST PUBLIC ORDER",
      items: [
        "Rebellion (Art. 134)",
        "Coup d'état (Art. 134-A)",
        "Sedition (Art. 139)",
        "Conspiracy to Commit Rebellion (Art. 136)"
      ]
    },
    {
      title: "🛡️ VI. SPECIAL CRIMINAL LAWS",
      items: [
        "Drug Cases (RA 9165)", 
        "VAWC Criminal (RA 9262)", 
        "Child Abuse (RA 7610)", 
        "Cybercrime (RA 10175)",
        "Illegal Recruitment (RA 8042)"
      ]
    },
    {
      title: "⚖️ VII. PROCEDURAL CRIMINAL MATTERS",
      items: [
        "Bail (Rule 114)", 
        "Habeas Corpus (Rule 102)"
      ]
    }
  ],
  "Civil": [
    {
      title: "📖 I. FAMILY RELATIONS AND PERSONS",
      items: [
        "Declaration of Nullity of Marriage (Art. 36)",
        "Annulment of Marriage (Arts. 45–47)",
        "Support (Child or Spouse)",
        "Child Custody (Art. 213)",
        "VAWC Civil Protection Order (RA 9262)",
        "Petition for Habeas Corpus (Minor)",
        "Declaration of Presumptive Death (Art. 41)"
      ]
    },
    {
      title: "🏠 II. PROPERTY AND LAND DISPUTES",
      items: [
        "Unlawful Detainer / Forcible Entry",
        "Quieting of Title / Reconveyance",
        "Partition of Property (Art. 494)",
        "Easement / Right of Way",
        "Foreclosure of Mortgage Defense"
      ]
    },
    {
      title: "💰 III. OBLIGATIONS, CONTRACTS, AND DAMAGES",
      items: [
        "Breach of Contract",
        "Collection of Sum of Money",
        "Damages (Tort / Quasi-Delict Art. 2176)",
        "Defamation Civil Damages"
      ]
    },
    {
      title: "📜 IV. SPECIAL PROCEEDINGS",
      items: [
        "Guardianship (Rules 92–97)",
        "Settlement of Estate (Rule 74)",
        "Change of Name (Rule 103)",
        "Correction of Entry (Rule 108 / RA 9048)"
      ]
    },
    {
      title: "🛡️ V. OTHER SPECIAL CIVIL ACTIONS",
      items: [
        "Interpleader (Rule 62)",
        "Declaratory Relief (Rule 63)"
      ]
    }
  ],
  "Labor": [
    {
      title: "🔒 I. TERMINATION DISPUTES",
      items: [
        "Illegal Dismissal (Art. 294)",
        "Just Causes for Termination (Art. 297)",
        "Authorized Causes for Termination (Art. 298-299)"
      ]
    },
    {
      title: "💰 II. LABOR STANDARDS (MONEY CLAIMS)",
      items: [
        "Unlawful Withholding of Wages (Art. 111-113)",
        "Non-Payment of 13th Month Pay (PD 851)",
        "Service Incentive Leave (SIL)",
        "Holiday / Premium Pay",
        "Night Shift Differential",
        "Separation Pay (Art. 298-299)"
      ]
    },
    {
      title: "🛡️ III. OTHER LABOR MATTERS",
      items: [
        "Claims for Damages (Labor)",
        "OFW Money Claims (RA 8042/10022)",
        "Unfair Labor Practice (ULP)",
        "Sexual Harassment (Workplace)"
      ]
    }
  ],
  "Administrative": [
    {
      title: "🏛 I. DISCIPLINARY (CSC / GOVERNMENT)",
      items: [
        "Grave Misconduct (RRACCS)",
        "Conduct Prejudicial to Service",
        "Violation of Ethical Standards (RA 6713)",
        "Administrative Neglect of Duty"
      ]
    },
    {
      title: "👮 II. DISCIPLINARY (POLICE / PNP)",
      items: [
        "PNP Administrative Complaint (RA 6975)",
        "Police Grave Misconduct",
        "IAS Disciplinary Proceeding"
      ]
    },
    {
      title: "⚖️ III. QUASI-JUDICIAL (GENERAL)",
      items: [
        "Agrarian Dispute (DARAB/RA 6657)",
        "Immigration / Deportation Case",
        "Anti-Torture Complaint (RA 9745)"
      ]
    }
  ],
  "Quasi-Judicial": [
    {
      title: "🏢 I. LABOR AND EMPLOYMENT CASES",
      items: [
        "National Labor Relations Commission (NLRC)",
        "Employees’ Compensation Commission (ECC)",
        "National Conciliation and Mediation Board (NCMB)"
      ]
    },
    {
      title: "🌱 II. LAND AND AGRARIAN REFORM CASES",
      items: [
        "DAR Adjudication Board (DARAB)",
        "Land Registration Authority (LRA)"
      ]
    },
    {
      title: "🏛 III. ADMINISTRATIVE & GOVERNMENT EMPLOYEE CASES",
      items: [
        "Civil Service Commission (CSC)",
        "Office of the Ombudsman",
        "GSIS / Social Security Commission (SSC)",
        "National Police Commission (NAPOLCOM)"
      ]
    },
    {
      title: "📈 IV. COMMERCIAL, TRADE & REGULATORY CASES",
      items: [
        "Securities and Exchange Commission (SEC)",
        "Insurance Commission",
        "Energy Regulatory Commission (ERC)",
        "Civil Aeronautics Board (CAB)",
        "Construction Industry Arbitration Commission (CIAC)",
        "Intellectual Property Office (IPO)",
        "Tariff Commission"
      ]
    },
    {
      title: "⚖️ V. SPECIALIZED / OTHER QUASI-JUDICIAL CASES",
      items: [
        "Commission on Elections (COMELEC)",
        "Commission on Audit (COA)",
        "Human Settlements Adjudication Commission (HSAC)",
        "Department of Social Welfare and Development (DSWD)",
        "Dangerous Drugs Board (DDB)",
        "Barangay Agrarian Reform Council (BARC)"
      ]
    }
  ]
};

export const standardPaoDocs = [
  "Certificate of Indigency from Barangay Chairman (residency jurisdiction)",
  "OR Certificate of Indigency from DSWD",
  "Latest ITR, pay slip, or Certificate of No Income",
  "Valid Government-issued ID (SSS, PhilHealth, Voter's, etc.)",
  "Case-Related Documents (Complaints, summons, affidavits, or police reports)",
  "Merit Test: The case must not be frivolous and must have legal basis."
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
    content: "Upon approval, a lawyer is officially assigned to your case to provide counseling, mediation, or representation." 
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
  // --- CRIMINAL ---
  "Parricide (Art. 246)": {
    description: "Killing of spouse, parent, child, or legitimate ascendant/descendant. Requires proof of relationship.",
    requirements: ["Death certificate", "Autopsy report", "Marriage/Birth certificate (proof of relationship)", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Murder (Art. 248)": {
    description: "Killing with qualifying circumstances (treachery, cruelty, evident premeditation, etc.).",
    requirements: ["Autopsy report", "Medico-legal report", "Police investigation report", "Witness statements", "Weapon recovered"],
    steps: universalPaoFlow
  },
  "Homicide (Art. 249)": {
    description: "Killing without qualifying circumstance.",
    requirements: ["Death certificate", "Autopsy report", "Witness affidavits", "Police investigation report"],
    steps: universalPaoFlow
  },
  "Physical Injuries (Arts. 262–266)": {
    description: "Inflicting bodily harm (serious, less serious, slight). Requires medical evidence.",
    requirements: ["Medical Certificate (Original/Certified copy)", "Hospital records", "Photos of injuries", "Police blotter", "Witness affidavits", "Certificate to File Action (from Barangay)"],
    steps: universalPaoFlow
  },
  "Abortion (Arts. 256–259)": {
    description: "In the Philippines, abortion is prohibited and penalized under Arts. 256–259 of the RPC.",
    requirements: ["Medical records", "Witness affidavits", "Police report", "Medical history"],
    steps: universalPaoFlow
  },
  "Discharge of Firearms (Art. 254 / RA 11926)": {
    description: "Shooting at another without intent to kill, or willful and indiscriminate discharge (as amended by RA 11926).",
    requirements: ["Police investigation report", "Ballistics report", "Witness affidavits", "Paraffin test (if available)"],
    steps: universalPaoFlow
  },
  "Robbery (Arts. 293–294)": {
    description: "Taking personal property with intent to gain through violence, intimidation, or force.",
    requirements: ["Police blotter report", "Sworn complaint-affidavit", "Medical certificate (if injured)", "Proof of ownership (receipt, title)", "CCTV footage", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Theft (Art. 308)": {
    description: "Taking property without consent and without violence.",
    requirements: ["Police report", "Affidavit of loss", "Proof of ownership", "CCTV footage", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Qualified Theft (Art. 310)": {
    description: "Theft with grave abuse of confidence or involving special property like motor vehicles.",
    requirements: ["Employment records", "Proof of trust relationship", "Proof of ownership", "CCTV", "Inventory of stolen items", "Police investigation report"],
    steps: universalPaoFlow
  },
  "Estafa (Art. 315)": {
    description: "Fraud by deceit or abuse of confidence causing damage.",
    requirements: ["Written contract / agreement", "Promissory note", "Receipts", "Demand letter with proof of receipt", "Screenshots / chat messages"],
    steps: universalPaoFlow
  },
  "Arson (Arts. 320–326)": {
    description: "Malicious burning of property.",
    requirements: ["Bureau of Fire Protection (BFP) report", "Photos of fire damage", "Witness affidavits", "Property title / Tax declaration"],
    steps: universalPaoFlow
  },
  "Malicious Mischief (Art. 327)": {
    description: "Deliberate damage to property of another without intent to gain.",
    requirements: ["Photos of damaged property", "Repair estimates", "Police blotter", "Witness affidavits", "CCTV footage"],
    steps: universalPaoFlow
  },
  "Bouncing Checks (BP 22)": {
    description: "Issuing a check without sufficient funds (BP 22).",
    requirements: ["Original dishonored check", "Bank return slip (NSF/Closed)", "Written demand letter", "Proof of receipt of demand"],
    steps: universalPaoFlow
  },
  "Anti-Fencing (PD 1612)": {
    description: "Buying, possessing, or selling property knowing it was stolen.",
    requirements: ["Police report of original theft", "Proof accused possessed item", "Receipts of sale", "Witness testimony"],
    steps: universalPaoFlow
  },
  "Electricity Pilferage (RA 7832)": {
    description: "Illegal use of electricity, jumper connections, or tampering with meters.",
    requirements: ["Inspection report by electric company", "Photographs of illegal connection", "Disconnection notice", "Meter tampering report"],
    steps: universalPaoFlow
  },
  "Kidnapping / Serious Illegal Detention (Art. 267)": {
    description: "Illegal deprivation of liberty of a person.",
    requirements: ["Witness statements", "CCTV footage", "Communication records", "Rescue report", "Police report"],
    steps: universalPaoFlow
  },
  "Grave Threats (Art. 282)": {
    description: "Threatening another with some wrong amounting to a crime.",
    requirements: ["Threatening messages / Screenshots", "Recorded audio/video", "Witness testimony", "Police blotter"],
    steps: universalPaoFlow
  },
  "Grave Coercion (Art. 286)": {
    description: "Compelling another by means of violence/intimidation to do something against his will.",
    requirements: ["Police report", "Video evidence", "Witness affidavits", "Medical certificate"],
    steps: universalPaoFlow
  },
  "Rape (Art. 266-A)": {
    description: "Sexual assault as defined under Art. 266-A of the RPC as amended.",
    requirements: ["Medico-legal certificate", "Victim's sworn affidavit", "Birth certificate (if minor)", "Psychological evaluation"],
    steps: universalPaoFlow
  },
  "Acts of Lasciviousness (Art. 336)": {
    description: "Committing lewd acts upon the person of another without consent.",
    requirements: ["Victim statement", "Medical report", "Witness affidavits", "Police investigation report"],
    steps: universalPaoFlow
  },
  "Rebellion (Art. 134)": {
    description: "Public uprising to remove allegiance from the government.",
    requirements: ["Intelligence reports", "Firearms seized", "Witness testimony", "Arrest report"],
    steps: universalPaoFlow
  },
  "Coup d'état (Art. 134-A)": {
    description: "Swift attack by military/police or civilians against government authority.",
    requirements: ["Military/Police reports", "Weapons seized", "Communications records", "Witness testimony"],
    steps: universalPaoFlow
  },
  "Sedition (Art. 139)": {
    description: "Public uprising to prevent execution of laws or inflict acts of hate.",
    requirements: ["Rally videos", "Social media posts", "Police dispersal report", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Conspiracy to Commit Rebellion (Art. 136)": {
    description: "Agreement between two or more persons to commit rebellion.",
    requirements: ["Recorded communications", "Meetings documentation", "Confessions", "Witness testimony"],
    steps: universalPaoFlow
  },
  "Drug Cases (RA 9165)": {
    description: "Offenses involving sale, possession, or use of dangerous drugs (RA 9165).",
    requirements: ["Chemistry report", "Seizure inventory", "Chain of custody documents", "Arrest report"],
    steps: universalPaoFlow
  },
  "VAWC Criminal (RA 9262)": {
    description: "Violence against women and children criminal offenses (RA 9262).",
    requirements: ["Police blotter", "Marriage certificate / proof of relationship", "Birth certificate", "Medical report"],
    steps: universalPaoFlow
  },
  "Child Abuse (RA 7610)": {
    description: "Special protection of children against abuse, exploitation and discrimination (RA 7610).",
    requirements: ["Birth certificate", "Medical report", "Social worker report", "Photos/videos"],
    steps: universalPaoFlow
  },
  "Cybercrime (RA 10175)": {
    description: "Crimes committed through computers and information systems (RA 10175).",
    requirements: ["Screenshots with URL", "Email headers", "Digital logs", "Police cybercrime report"],
    steps: universalPaoFlow
  },
  "Illegal Recruitment (RA 8042)": {
    description: "Illegal recruitment of migrant workers (RA 8042).",
    requirements: ["Receipts of payment", "Contract", "Advertisement proof", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Bail (Rule 114)": {
    description: "Security given for the release of a person in custody.",
    requirements: ["Copy of Information", "Commitment Order", "Bail petition", "Notice of hearing"],
    steps: universalPaoFlow
  },
  "Habeas Corpus (Rule 102)": {
    description: "Writ directed to a person detaining another, commanding him to produce the body.",
    requirements: ["Proof of detention", "Affidavit of illegal restraint", "Witness testimony"],
    steps: universalPaoFlow
  },

  // --- CIVIL ---
  "Declaration of Nullity of Marriage (Art. 36)": {
    description: "Marriage void from the beginning due to psychological incapacity or Art. 35-38 grounds.",
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates", "Psychological evaluation report", "Proof of residency", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Annulment of Marriage (Arts. 45–47)": {
    description: "Voidable marriages due to fraud, intimidation, impotence, or lack of consent.",
    requirements: ["PSA Marriage Certificate", "Medical report (if impotence)", "Evidence of fraud or force", "Witness statements"],
    steps: universalPaoFlow
  },
  "Support (Child or Spouse)": {
    description: "Legal obligation to provide financial support for sustenance and education.",
    requirements: ["PSA Birth Certificate", "Proof of relationship", "Proof of respondent's income (payslips)", "Demand letter", "Receipts of expenses"],
    steps: universalPaoFlow
  },
  "Child Custody (Art. 213)": {
    description: "Determination of custody for minor children based on the best interest rule.",
    requirements: ["PSA Birth Certificate", "School records", "Social worker report", "Proof of parent fitness"],
    steps: universalPaoFlow
  },
  "VAWC Civil Protection Order (RA 9262)": {
    description: "Petition for protection order and damages in VAWC cases.",
    requirements: ["Police blotter", "Medical certificate", "Screenshots/messages", "Marriage certificate / proof of relationship", "Birth certificate"],
    steps: universalPaoFlow
  },
  "Petition for Habeas Corpus (Minor)": {
    description: "Illegal detention or wrongful custody of a minor.",
    requirements: ["Birth certificate", "Proof of custody rights", "Affidavit of illegal detention", "Police report"],
    steps: universalPaoFlow
  },
  "Declaration of Presumptive Death (Art. 41)": {
    description: "Court declaration when a spouse is absent for 4 years (2 in danger) for remarriage.",
    requirements: ["PSA Marriage Certificate", "Proof of absence", "Police certification", "Affidavits of diligent search"],
    steps: universalPaoFlow
  },
  "Unlawful Detainer / Forcible Entry": {
    description: "Recovery of possession of property under Rule 70 of the Rules of Court.",
    requirements: ["Land Title (TCT/OCT)", "Lease Contract", "Demand to Vacate Letter", "Tax Declaration"],
    steps: universalPaoFlow
  },
  "Quieting of Title / Reconveyance": {
    description: "Removing cloud over title or reclaiming ownership through judicial action.",
    requirements: ["Land Title", "Deed of Sale", "Tax Declaration", "Evidence of fraud (for reconveyance)"],
    steps: universalPaoFlow
  },
  "Partition of Property (Art. 494)": {
    description: "Judicial or extrajudicial division of co-owned property.",
    requirements: ["Land Title", "Proof of co-ownership", "Death certificate (if inheritance)", "Tax Declaration"],
    steps: universalPaoFlow
  },
  "Easement / Right of Way": {
    description: "Right of access to landlocked property across another's land.",
    requirements: ["Land Title", "Survey Plan", "Proof property is landlocked", "Demand letter"],
    steps: universalPaoFlow
  },
  "Foreclosure of Mortgage Defense": {
    description: "Defense against extrajudicial foreclosure of real estate mortgage.",
    requirements: ["Loan agreement", "Promissory note", "Mortgage contract", "Notice of foreclosure"],
    steps: universalPaoFlow
  },
  "Breach of Contract": {
    description: "Failure to comply with an obligation under the Civil Code.",
    requirements: ["Written Contract / Agreement", "Proof of Breach", "Demand Letter", "Receipts"],
    steps: universalPaoFlow
  },
  "Collection of Sum of Money": {
    description: "Judicial collection of unpaid loans or debts.",
    requirements: ["Promissory Note", "Loan Agreement", "Receipts", "Demand Letter"],
    steps: universalPaoFlow
  },
  "Damages (Tort / Quasi-Delict Art. 2176)": {
    description: "Civil liability for damage caused by negligence or fault.",
    requirements: ["Police Report", "Medical Certificate", "Receipts for expenses", "Photos of damage/injury", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Defamation Civil Damages": {
    description: "Civil action for damages from libel or slander (Arts. 19-21, 26).",
    requirements: ["Copy of defamatory statement", "Screenshot with URL", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Guardianship (Rules 92–97)": {
    description: "Appointment of a guardian for the person and property of a minor or incompetent.",
    requirements: ["PSA Birth Certificate", "Medical Certificate (if incompetent)", "Financial documents (assets list)"],
    steps: universalPaoFlow
  },
  "Settlement of Estate (Rule 74)": {
    description: "Summary or extrajudicial settlement of a deceased person's estate.",
    requirements: ["Death Certificate", "Titles of properties", "PSA Birth Certificates of heirs"],
    steps: universalPaoFlow
  },
  "Change of Name (Rule 103)": {
    description: "Judicial petition for change of name.",
    requirements: ["PSA Birth Certificate", "Police / NBI Clearance", "Publication proof (Newspaper)"],
    steps: universalPaoFlow
  },
  "Correction of Entry (Rule 108 / RA 9048)": {
    description: "Correction of clerical errors or substantial changes in civil registry entries.",
    requirements: ["PSA Certificate to be corrected", "Supporting documents proving error", "Affidavits"],
    steps: universalPaoFlow
  },
  "Interpleader (Rule 62)": {
    description: "Special civil action when conflicting parties claim the same property.",
    requirements: ["Contracts", "Demand letters from conflicting claimants", "Property documentation"],
    steps: universalPaoFlow
  },
  "Declaratory Relief (Rule 63)": {
    description: "Special civil action for judicial interpretation of a contract or deed.",
    requirements: ["Contract or Deed", "Affidavit explaining dispute", "Proof of legal interest"],
    steps: universalPaoFlow
  },

  // --- LABOR ---
  "Illegal Dismissal (Art. 294)": {
    description: "Employee terminated without just/authorized cause or due process (Art. 294).",
    requirements: ["Employment Contract", "Appointment Letter", "Payslips", "Termination Letter", "Notice to Explain", "Company ID", "DTR"],
    steps: universalPaoFlow
  },
  "Just Causes for Termination (Art. 297)": {
    description: "Termination due to misconduct, disobedience, or gross neglect (Art. 297).",
    requirements: ["Notice to Explain", "Written explanation of employee", "Incident reports", "Company rules", "CCTV footage"],
    steps: universalPaoFlow
  },
  "Authorized Causes for Termination (Art. 298-299)": {
    description: "Termination due to retrenchment, business closure, or redundancy (Art. 298-299).",
    requirements: ["Notice of termination", "DOLE notification", "Financial statements (if retrenchment)", "Medical certificate (if disease)"],
    steps: universalPaoFlow
  },
  "Unlawful Withholding of Wages (Art. 111-113)": {
    description: "Illegal deductions or non-payment of wages (Art. 111-113).",
    requirements: ["Payslips", "Employment contract", "Payroll records", "Computation of unpaid wages"],
    steps: universalPaoFlow
  },
  "Non-Payment of 13th Month Pay (PD 851)": {
    description: "Mandatory benefit for employees who worked at least 1 month (PD 851).",
    requirements: ["Payslips", "Payroll summary", "Computation of unpaid amount"],
    steps: universalPaoFlow
  },
  "Service Incentive Leave (SIL)": {
    description: "Entitlement to 5 days of leave with pay for employees with 1 year of service.",
    requirements: ["Employment records", "Leave records", "Payslips"],
    steps: universalPaoFlow
  },
  "Holiday / Premium Pay": {
    description: "Entitlement to pay for work during holidays or rest days.",
    requirements: ["DTR", "Payslips", "Company holiday schedule"],
    steps: universalPaoFlow
  },
  "Night Shift Differential": {
    description: "Additional 10% pay for work between 10 PM and 6 AM.",
    requirements: ["DTR showing 10 PM–6 AM work", "Payroll records", "Payslips"],
    steps: universalPaoFlow
  },
  "Separation Pay (Art. 298-299)": {
    description: "Pay given to employees terminated due to authorized causes (Art. 298-299).",
    requirements: ["Termination notice", "Computation of separation pay", "Employment contract"],
    steps: universalPaoFlow
  },
  "Claims for Damages (Labor)": {
    description: "Moral and exemplary damages due to illegal dismissal or bad faith (Art. 217).",
    requirements: ["Proof of dismissal", "Proof of bad faith", "Medical certificate (if emotional distress)", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "OFW Money Claims (RA 8042/10022)": {
    description: "Claims arising from overseas employment contracts (RA 8042/10022).",
    requirements: ["POEA-approved contract", "Passport & Visa copy", "Deployment papers", "Proof of premature termination"],
    steps: universalPaoFlow
  },
  "Unfair Labor Practice (ULP)": {
    description: "Violation of the right to self-organization (Arts. 258-260).",
    requirements: ["Union membership documents", "Termination letters", "Written communications", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Sexual Harassment (Workplace)": {
    description: "Sexual demands or conduct in a work environment (Anti-Sexual Harassment Act).",
    requirements: ["Screenshots/messages", "Written complaint", "Witness statements", "HR report", "CCTV"],
    steps: universalPaoFlow
  },

  // --- ADMINISTRATIVE ---
  "Grave Misconduct (RRACCS)": {
    description: "Disciplinary case against government employees involving intentional wrongdoing.",
    requirements: ["Sworn Complaint-Affidavit", "Service Record", "Official Records", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Conduct Prejudicial to Service": {
    description: "Acts that tarnish the image and integrity of a public office.",
    requirements: ["Complaint affidavit", "Service Record", "Official memoranda", "Witness statements"],
    steps: universalPaoFlow
  },
  "Violation of Ethical Standards (RA 6713)": {
    description: "Failure to adhere to the Code of Conduct for Public Officials (RA 6713).",
    requirements: ["SALN (if applicable)", "Complaint affidavit", "Evidence of violation", "Official records"],
    steps: universalPaoFlow
  },
  "Administrative Neglect of Duty": {
    description: "Failure of a government employee to perform mandated tasks.",
    requirements: ["Duty logs", "Official orders", "Performance evaluations", "Witness statements"],
    steps: universalPaoFlow
  },
  "PNP Administrative Complaint (RA 6975)": {
    description: "Complaints against police officers before IAS or NAPOLCOM (RA 6975).",
    requirements: ["Police Blotter", "Incident Report", "Body camera footage", "Medical report", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Police Grave Misconduct": {
    description: "Serious misconduct cases involving PNP personnel.",
    requirements: ["Police Report", "Witness affidavits", "Official records", "Evidence of misconduct"],
    steps: universalPaoFlow
  },
  "IAS Disciplinary Proceeding": {
    description: "Internal affairs service investigation of police personnel.",
    requirements: ["Incident Report", "Witness statements", "PNP records", "Body camera footage"],
    steps: universalPaoFlow
  },
  "Agrarian Dispute (DARAB/RA 6657)": {
    description: "Disputes involving land tenancy or agrarian reform (RA 6657).",
    requirements: ["CLOA / EP", "Leasehold contract", "Land Title / Tax Declaration", "BARC Certification"],
    steps: universalPaoFlow
  },
  "Immigration / Deportation Case": {
    description: "Administrative cases before the Bureau of Immigration.",
    requirements: ["Passport", "Visa documents", "Alien Certificate of Registration", "Notice of charge"],
    steps: universalPaoFlow
  },
  "Anti-Torture Complaint (RA 9745)": {
    description: "Administrative liability for public officers committing torture (RA 9745).",
    requirements: ["Medical report", "Psychological evaluation", "Witness statements", "Detention records"],
    steps: universalPaoFlow
  },

  // --- QUASI-JUDICIAL ---
  "National Labor Relations Commission (NLRC)": {
    description: "Quasi-judicial body for labor disputes (Illegal dismissal, money claims, ULP).",
    requirements: ["Employment contract", "Payslips", "Termination letter", "Notice to Explain", "DTR", "Payroll records"],
    steps: universalPaoFlow
  },
  "Employees’ Compensation Commission (ECC)": {
    description: "Work-related sickness, injury, disability, or death claims.",
    requirements: ["Medical certificate", "Hospital records", "Accident report", "Employer certification", "SSS/GSIS contribution record"],
    steps: universalPaoFlow
  },
  "National Conciliation and Mediation Board (NCMB)": {
    description: "Preventive mediation and labor dispute settlement.",
    requirements: ["Collective Bargaining Agreement (if any)", "Notice of strike/lockout", "Employment documents"],
    steps: universalPaoFlow
  },
  "DAR Adjudication Board (DARAB)": {
    description: "Tenancy disputes, ejectment of farmer-beneficiaries, and CLOA disputes.",
    requirements: ["Certificate of Land Ownership Award (CLOA)", "Leasehold contract", "Land title", "Tax declaration", "Survey plan"],
    steps: universalPaoFlow
  },
  "Land Registration Authority (LRA)": {
    description: "Land registration and title correction disputes (PD 1529).",
    requirements: ["Land title (TCT/OCT)", "Deed of sale", "Tax declaration", "Survey plan"],
    steps: universalPaoFlow
  },
  "Civil Service Commission (CSC)": {
    description: "Administrative charges, illegal termination, and suspension of government employees.",
    requirements: ["Notice of charge", "Written explanation", "Service records", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Office of the Ombudsman": {
    description: "Administrative complaints against public officials (RA 6770).",
    requirements: ["Sworn complaint", "Official documents", "Financial records (if applicable)", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "GSIS / Social Security Commission (SSC)": {
    description: "Disputes regarding benefits and contributions (GSIS/SSS Act).",
    requirements: ["Contribution record", "Claim forms", "Medical certificate", "Employment record"],
    steps: universalPaoFlow
  },
  "National Police Commission (NAPOLCOM)": {
    description: "Administrative complaints against police officers (RA 6975).",
    requirements: ["Incident report", "Police blotter", "Medical certificate", "Witness affidavits"],
    steps: universalPaoFlow
  },
  "Securities and Exchange Commission (SEC)": {
    description: "Intra-corporate and partnership disputes (Revised Corporation Code).",
    requirements: ["Articles of Incorporation", "By-laws", "Stock certificates", "Corporate records"],
    steps: universalPaoFlow
  },
  "Insurance Commission": {
    description: "Insurance claims and denial disputes (Insurance Code).",
    requirements: ["Insurance policy", "Proof of loss", "Claim denial letter", "Medical/fire reports"],
    steps: universalPaoFlow
  },
  "Energy Regulatory Commission (ERC)": {
    description: "Utility rate disputes and service complaints (EPIRA Law).",
    requirements: ["Utility billing statements", "Service complaints", "Inspection report"],
    steps: universalPaoFlow
  },
  "Civil Aeronautics Board (CAB)": {
    description: "Air transport disputes regarding refunds and cancellations.",
    requirements: ["Airline ticket", "Booking confirmation", "Receipts", "Correspondence"],
    steps: universalPaoFlow
  },
  "Construction Industry Arbitration Commission (CIAC)": {
    description: "Construction contract disputes (EO 1008).",
    requirements: ["Construction contract", "Billing statements", "Project reports", "Engineering documents"],
    steps: universalPaoFlow
  },
  "Intellectual Property Office (IPO)": {
    description: "Trademark and patent disputes (IP Code).",
    requirements: ["Registration certificate", "Proof of infringement", "Product samples"],
    steps: universalPaoFlow
  },
  "Tariff Commission": {
    description: "Trade and tariff disputes under the Tariff and Customs Code.",
    requirements: ["Import/export documents", "Customs assessment", "Product technical data"],
    steps: universalPaoFlow
  },
  "Commission on Elections (COMELEC)": {
    description: "Election contests and administrative election matters.",
    requirements: ["Election returns", "Voter registration record", "Affidavits", "Official IDs"],
    steps: universalPaoFlow
  },
  "Commission on Audit (COA)": {
    description: "Money claims against the government and disallowance disputes.",
    requirements: ["Official receipts", "Government contracts", "Disallowance notice", "Vouchers"],
    steps: universalPaoFlow
  },
  "Human Settlements Adjudication Commission (HSAC)": {
    description: "Homeowner vs developer disputes (RA 11201).",
    requirements: ["Contract to sell", "Receipts", "Subdivision plan", "HLURB/HSAC registration"],
    steps: universalPaoFlow
  },
  "Department of Social Welfare and Development (DSWD)": {
    description: "Adoption, foster care, and rescue petitions.",
    requirements: ["Birth certificate", "Social case study report", "Consent forms", "Case study"],
    steps: universalPaoFlow
  },
  "Dangerous Drugs Board (DDB)": {
    description: "Administrative supervision and rehabilitation of drug offenders.",
    requirements: ["Drug test result", "Rehabilitation order", "Personal profile"],
    steps: universalPaoFlow
  },
  "Barangay Agrarian Reform Council (BARC)": {
    description: "Mediation of land disputes at the barangay level.",
    requirements: ["CLOA", "Land title", "Mediation records", "Barangay certificate"],
    steps: universalPaoFlow
  }
};

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Police Report", "Subpoena"], steps: universalPaoFlow },
  Civil: { requirements: ["PSA Certificates", "Proof of Ownership"], steps: universalPaoFlow },
  Labor: { requirements: ["Company ID", "Payslips", "Contract"], steps: universalPaoFlow },
  Administrative: { requirements: ["Official Records", "Sworn Complaint", "Service Record"], steps: universalPaoFlow },
  "Quasi-Judicial": { requirements: ["Official Records", "Contracts", "Agency decision"], steps: universalPaoFlow }
};
