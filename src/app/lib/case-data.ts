
/**
 * @fileOverview Official legal database for LexConnect.
 * Standardized documentation and process flows based on official PAO, DOJ, and Supreme Court standards in the Philippines.
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
  ]
};

export const standardPaoDocs = [
  "Certificate of Indigency from Barangay Chairman (Original)",
  "OR DSWD Certification of Indigent Status",
  "Latest ITR, Payslip, OR Affidavit of No Income",
  "Valid Government-issued ID (Original + 2 Photocopies)",
  "Proof of Residency (Utility bill or Voter's Certificate)",
  "Subpoena or Court Summons (If already in court)",
  "Complaint-Affidavit or Sworn Statement (For complainants)"
];

export const universalPaoFlow = [
  { 
    step: 1, 
    title: "Documentary Pre-screening", 
    content: "Prepare proofs of indigency and all documents related to your legal concern. Ensure you have photocopies of all originals." 
  },
  { 
    step: 2, 
    title: "Client Interview", 
    content: "A Public Attorney will conduct an interview to assess both the Indigency Test (financial status) and the Merit Test (legal basis of the case)." 
  },
  { 
    step: 3, 
    title: "Affidavit Preparation", 
    content: "If qualified, the lawyer will assist in drafting affidavits, petitions, or legal responses required for your specific matter." 
  },
  { 
    step: 4, 
    title: "Legal Representation", 
    content: "The office will officially handle your case, including mediation (SENA/Barangay), court representation, or notary services." 
  }
];

export const pAONotes = [
  "Indigency Test: Your net income must not exceed the agency regional threshold (currently based on minimum wage standards).",
  "Merit Test: The Public Attorney must determine that the case has a reasonable chance of success and is not intended to harass.",
  "Conflict of Interest: PAO cannot represent two parties with opposing interests in the same case.",
  "Free Service: All legal services are free. Only minimal court filing fees or publication costs (if required by law) are paid by the client.",
  "Priority: Priority is given to detained persons, women and children in VAWC cases, and indigent laborers."
];

export const caseSpecificData: Record<string, { requirements: string[], steps: any[], description: string }> = {
  // --- CRIMINAL ---
  "Parricide (Art. 246)": {
    description: "Killing of spouse, parent, child, or legitimate ascendant/descendant. Requires proof of relationship.",
    requirements: ["PSA Birth Certificate (Accused/Victim)", "PSA Marriage Certificate", "Death Certificate of victim", "Police Investigation Report", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Murder (Art. 248)": {
    description: "Killing with qualifying circumstances like treachery, price, reward, or evident premeditation.",
    requirements: ["Autopsy Report (Post-mortem)", "Death Certificate", "Police Blotter/Investigation Report", "CCTV Footage (If available)", "Ballistics/Chemistry Report (If relevant)"],
    steps: universalPaoFlow
  },
  "Homicide (Art. 249)": {
    description: "Killing without the qualifying circumstances mentioned in Art. 248.",
    requirements: ["Death Certificate", "Post-Mortem Examination", "Police Blotter", "Witness Sworn Statements", "Medico-Legal Certificate"],
    steps: universalPaoFlow
  },
  "Physical Injuries (Arts. 262–266)": {
    description: "Serious, less serious, or slight bodily harm inflicted on another.",
    requirements: ["Medical Certificate (Original)", "Hospital Records/Discharge Summary", "Photographs of injuries", "Police Blotter", "Barangay Certification to File Action (If applicable)"],
    steps: universalPaoFlow
  },
  "Abortion (Arts. 256–259)": {
    description: "Unlawful termination of pregnancy. Requires medical confirmation.",
    requirements: ["Medical Certificate from attending physician", "Death Certificate of fetus (if applicable)", "Police Blotter", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Discharge of Firearms (Art. 254 / RA 11926)": {
    description: "Unlawful firing of a weapon. Requires ballistics and investigation reports.",
    requirements: ["Police Investigation Report", "Ballistics/Paraffin Test Result", "Pictures of the scene", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Robbery (Arts. 293–294)": {
    description: "Taking personal property with violence or intimidation.",
    requirements: ["Police Blotter/Investigation Report", "Inventory of stolen property with value", "Proof of ownership (Receipts/TCT)", "CCTV Footage (if any)", "Witness Statements"],
    steps: universalPaoFlow
  },
  "Theft (Art. 308)": {
    description: "Taking property without consent and with intent to gain.",
    requirements: ["Police Blotter", "Proof of ownership/Receipts", "Inventory of missing items", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Qualified Theft (Art. 310)": {
    description: "Theft with grave abuse of confidence, or involving motor vehicles, coconuts, or large cattle.",
    requirements: ["Contract of Employment/ID (For abuse of confidence)", "Inventory of missing items", "CCTV/Security Logs", "Proof of ownership (Receipts/TCT)", "Police Report"],
    steps: universalPaoFlow
  },
  "Estafa (Art. 315)": {
    description: "Fraud by deceit or abuse of confidence resulting in financial damage.",
    requirements: ["Written Agreements/Contracts", "Dishonored Checks/Bank Return Slips", "Demand Letter with proof of receipt", "Proof of payment/transfer", "Screenshots of messages"],
    steps: universalPaoFlow
  },
  "Arson (Arts. 320–326)": {
    description: "Willful and malicious burning of property.",
    requirements: ["Fire Marshall's Investigation Report (BFP)", "Photos of the burned premises", "Proof of ownership or tenancy", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Malicious Mischief (Art. 327)": {
    description: "Deliberate damage to property of another.",
    requirements: ["Photographs of the damage", "Estimate of repair/Cost of damage", "Police Blotter", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Bouncing Checks (BP 22)": {
    description: "Issuance of a check without sufficient funds.",
    requirements: ["Original Dishonored Check", "Bank Return Slip", "Notice of Dishonor", "Proof of receipt of Notice (Registry Return Card)", "Affidavit of Complaint"],
    steps: universalPaoFlow
  },
  "Anti-Fencing (PD 1612)": {
    description: "Possession or sale of stolen property.",
    requirements: ["Proof of ownership of stolen item", "Police Report of the original theft", "Inventory of seized items", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Electricity Pilferage (RA 7832)": {
    description: "Illegal electrical connection or meter tampering.",
    requirements: ["Utility Inspection Report", "Violation Notice from Electric Co.", "Police Blotter", "Photographs of illegal connection"],
    steps: universalPaoFlow
  },
  "Kidnapping / Serious Illegal Detention (Art. 267)": {
    description: "Unlawful restraint of liberty of another.",
    requirements: ["Police Investigation Report", "Witness Sworn Statements", "Proof of ransom demand (if applicable)", "Evidence of restraint"],
    steps: universalPaoFlow
  },
  "Grave Threats (Art. 282)": {
    description: "Threatening another with a crime against persons or property.",
    requirements: ["Recording or screenshots of threats", "Police Blotter", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Grave Coercion (Art. 286)": {
    description: "Compelling another by force or intimidation to do something against their will.",
    requirements: ["Police Blotter", "Witness Sworn Statements", "Evidence of force or intimidation used"],
    steps: universalPaoFlow
  },
  "Rape (Art. 266-A)": {
    description: "Sexual assault. Requires specialized medico-legal evidence.",
    requirements: ["Medico-Legal Report (PNP/NBI)", "Psychological Evaluation Report", "Sworn Statement of victim", "Police Investigation Report"],
    steps: universalPaoFlow
  },
  "Acts of Lasciviousness (Art. 336)": {
    description: "Indecent acts committed against another.",
    requirements: ["Medico-Legal Report (if physical contact occurred)", "Sworn Statement of victim", "Police Blotter", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Rebellion (Art. 134)": {
    description: "Rising publicly and taking up arms against the government.",
    requirements: ["PNP/AFP Operational Reports", "Captured Evidence/Documents", "Witness Sworn Statements", "Intelligence Reports"],
    steps: universalPaoFlow
  },
  "Coup d'état (Art. 134-A)": {
    description: "Swift attack against government facilities to diminish state power.",
    requirements: ["Incident Reports", "Official Damage Assessment", "Witness Sworn Statements", "Operational logs"],
    steps: universalPaoFlow
  },
  "Sedition (Art. 139)": {
    description: "Rising publicly to prevent execution of laws or administrative orders.",
    requirements: ["Proof of public uprising", "Video or photographic evidence", "Official Reports", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Conspiracy to Commit Rebellion (Art. 136)": {
    description: "Agreement and decision to commit rebellion.",
    requirements: ["Surveillance evidence", "Captured communications", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Drug Cases (RA 9165)": {
    description: "Possession, sale, or delivery of dangerous drugs.",
    requirements: ["Copy of Information (Charge Sheet)", "Inventory of Seized Items", "Chemistry Report (PDEA/PNP)", "Chain of Custody Form", "Arrest Report (Booking Form)"],
    steps: universalPaoFlow
  },
  "VAWC Criminal (RA 9262)": {
    description: "Violence (Physical, Sexual, Psychological, Economic) against women and their children.",
    requirements: ["Medical Certificate", "PSA Marriage Certificate/Birth Certificate of child", "Barangay Protection Order (If any)", "Psychological Evaluation Report", "Threatening messages/Evidence of abuse"],
    steps: universalPaoFlow
  },
  "Child Abuse (RA 7610)": {
    description: "Abuse, exploitation, or discrimination against children.",
    requirements: ["Medico-Legal Report", "PSA Birth Certificate of child", "Psychological Evaluation Report", "Police Blotter", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Cybercrime (RA 10175)": {
    description: "Illegal acts committed through computer systems (Libel, Fraud, etc.).",
    requirements: ["Screenshots of posts/messages", "Electronic evidence certification", "Police/NBI Cybercrime Report", "Links to defamatory content"],
    steps: universalPaoFlow
  },
  "Illegal Recruitment (RA 8042)": {
    description: "Recruitment activities by unlicensed individuals or agencies.",
    requirements: ["POEA Certification of license status", "Employment Contracts", "Receipts of fees paid", "Witness Sworn Statements", "Passport/Visa docs"],
    steps: universalPaoFlow
  },
  "Bail (Rule 114)": {
    description: "Petition for temporary release from custody.",
    requirements: ["Copy of the Information", "Valid Identification", "Proof of assets/financial capacity", "NBI Clearance"],
    steps: universalPaoFlow
  },
  "Habeas Corpus (Rule 102)": {
    description: "Inquiry into the legality of detention.",
    requirements: ["Proof of detention", "Sworn statement detailing the illegality of detention", "Witness statements"],
    steps: universalPaoFlow
  },

  // --- CIVIL ---
  "Declaration of Nullity of Marriage (Art. 36)": {
    description: "Marriage declared void from the beginning due to psychological incapacity.",
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates of children", "Psychological Evaluation Report (Clinical)", "Witness Testimonies (Friends/Family)", "Certificate of No Marriage (CENOMAR)"],
    steps: universalPaoFlow
  },
  "Annulment of Marriage (Arts. 45–47)": {
    description: "Marriage cancelled due to lack of parental consent, insanity, fraud, force, or physical incapacity.",
    requirements: ["PSA Marriage Certificate", "PSA Birth Certificates of children", "Clinical Psychologist Report", "Witness Sworn Statements", "CENOMAR"],
    steps: universalPaoFlow
  },
  "Support (Child or Spouse)": {
    description: "Legal petition for financial support for children or a spouse.",
    requirements: ["PSA Birth Certificate of child", "Proof of parent's income (If known)", "List of monthly expenses (Education, Food, Health)", "Demand Letter for support", "PSA Marriage Certificate (For spouse)"],
    steps: universalPaoFlow
  },
  "Child Custody (Art. 213)": {
    description: "Legal petition for the care, control, and maintenance of a child.",
    requirements: ["PSA Birth Certificate of child", "Barangay Certification of Residency", "Proof of Financial Stability", "Witness Testimonies regarding moral fitness", "Social Worker Report (If any)"],
    steps: universalPaoFlow
  },
  "VAWC Civil Protection Order (RA 9262)": {
    description: "Civil protection for victims of domestic violence to keep the perpetrator away.",
    requirements: ["Medical Certificate", "Police Blotter or incident report", "Barangay Protection Order (BPO) if available", "Proof of relationship (Marriage/Birth Cert)", "Photos of physical abuse"],
    steps: universalPaoFlow
  },
  "Petition for Habeas Corpus (Minor)": {
    description: "Petition to retrieve custody of a minor from illegal restraint.",
    requirements: ["PSA Birth Certificate of child", "Proof of legal custody right", "Proof of illegal restraint/detention of child", "Witness statements"],
    steps: universalPaoFlow
  },
  "Declaration of Presumptive Death (Art. 41)": {
    description: "Petition to declare a missing spouse dead for remarriage purposes.",
    requirements: ["PSA Marriage Certificate", "Proof of absence (at least 4 years)", "Evidence of diligent search", "Affidavit of the Petitioner"],
    steps: universalPaoFlow
  },
  "Unlawful Detainer / Forcible Entry": {
    description: "Ejection cases involving illegal possession of land or buildings.",
    requirements: ["Transfer Certificate of Title (TCT) / Tax Declaration", "Demand Letter to Vacate (With proof of receipt)", "Lease Contract (If any)", "Barangay Certification to File Action", "Proof of non-payment of rent"],
    steps: universalPaoFlow
  },
  "Quieting of Title / Reconveyance": {
    description: "Removing cloud or conflicting claims on property title.",
    requirements: ["TCT/OCT of the property", "Current Tax Declaration", "Proof of continuous possession", "Evidence of conflicting claim/instrument"],
    steps: universalPaoFlow
  },
  "Partition of Property (Art. 494)": {
    description: "Dividing co-owned land or assets among heirs or partners.",
    requirements: ["TCT/OCT of property", "Tax Declaration", "PSA Birth/Marriage certs showing relationship", "Survey Plan (if available)"],
    steps: universalPaoFlow
  },
  "Easement / Right of Way": {
    description: "Petition for access through another person's property.",
    requirements: ["TCT/OCT of dominant and servient estates", "Survey Plan showing isolation", "Proof of necessity and indemnity"],
    steps: universalPaoFlow
  },
  "Foreclosure of Mortgage Defense": {
    description: "Defending vs bank foreclosure due to payment or procedural issues.",
    requirements: ["Loan Agreement/Mortgage Contract", "Promissory Note", "Proof of payments (Receipts)", "Foreclosure Notice from bank"],
    steps: universalPaoFlow
  },
  "Breach of Contract": {
    description: "Claim for damages due to violation of an agreement.",
    requirements: ["Copy of the Written Contract", "Proof of violation/breach", "Demand Letter with proof of receipt", "Evidence of resulting damages"],
    steps: universalPaoFlow
  },
  "Collection of Sum of Money": {
    description: "Recovery of unpaid debts or loans.",
    requirements: ["Promissory Note/Acknowledgment Receipt", "Demand Letter with proof of receipt", "Invoices or receipts of partial payments", "Witness statements"],
    steps: universalPaoFlow
  },
  "Damages (Tort / Quasi-Delict Art. 2176)": {
    description: "Civil liability for injury or loss caused by negligence.",
    requirements: ["Medical Certificates/Death Certificate", "Hospital Receipts/Repair Estimates", "Police Report", "Witness Sworn Statements"],
    steps: universalPaoFlow
  },
  "Defamation Civil Damages": {
    description: "Civil suit for libel or slander.",
    requirements: ["Screenshots/Recordings of defamatory statement", "Proof of publication", "Witness statements", "Evidence of damage to reputation"],
    steps: universalPaoFlow
  },
  "Guardianship (Rules 92–97)": {
    description: "Legal petition for the care of an incompetent or a minor's property.",
    requirements: ["PSA Birth Certificate of ward", "Medical Certificate of incompetency", "Inventory of ward's properties", "Affidavit of proposed guardian"],
    steps: universalPaoFlow
  },
  "Settlement of Estate (Rule 74)": {
    description: "Distribution of the property of a deceased person among heirs.",
    requirements: ["Death Certificate of decedent", "PSA Birth/Marriage Certificates of heirs", "Title (TCT) or Tax Declaration of properties", "Affidavit of Self-Adjudication or Deed of Partition", "Proof of published notice"],
    steps: universalPaoFlow
  },
  "Change of Name (Rule 103)": {
    description: "Judicial petition to change a person's name for valid legal reasons.",
    requirements: ["PSA Birth Certificate", "NBI, Police, and Prosecutor Clearances", "Affidavit of Merit", "Proof of residence for at least 3 years", "Certificates of employment or school records"],
    steps: universalPaoFlow
  },
  "Correction of Entry (Rule 108 / RA 9048)": {
    description: "Correcting clerical errors in PSA records.",
    requirements: ["PSA Certificate to be corrected", "Baptismal Certificate", "School Records (Form 137)", "Voter's Registration/NBI Clearance", "Birth Certificate of children"],
    steps: universalPaoFlow
  },
  "Interpleader (Rule 62)": {
    description: "Resolution of conflicting claims against a neutral party.",
    requirements: ["Contract or instrument involving conflicting claims", "Proof of neutral interest", "Evidence of conflicting demands"],
    steps: universalPaoFlow
  },
  "Declaratory Relief (Rule 63)": {
    description: "Judicial interpretation of an instrument, contract, or law.",
    requirements: ["Copy of the Law/Contract/Ordinance", "Proof of legal interest in the matter", "Evidence of controversy"],
    steps: universalPaoFlow
  },

  // --- LABOR ---
  "Illegal Dismissal (Art. 294)": {
    description: "Termination of employment without just or authorized cause.",
    requirements: ["Notice of Dismissal (Termination Letter)", "Company ID / Payslips", "Employment Contract", "SENA Referral Form (Failed mediation)", "Evidence of whistleblowing or illegal acts"],
    steps: universalPaoFlow
  },
  "Just Causes for Termination (Art. 297)": {
    description: "Defense against dismissal due to serious misconduct or gross neglect.",
    requirements: ["Notice of Violations/Show Cause Memo", "Written incident reports", "Minutes of Administrative Hearing", "Company Policy/Employee Handbook"],
    steps: universalPaoFlow
  },
  "Authorized Causes for Termination (Art. 298-299)": {
    description: "Termination due to redundancy, retrenchment, or closure of business.",
    requirements: ["Notice of Retrenchment / Redundancy", "Proof of business losses (Financial Statements)", "Payslips", "Evidence of selection criteria for retrenchment"],
    steps: universalPaoFlow
  },
  "Unlawful Withholding of Wages (Art. 111-113)": {
    description: "Claims for unpaid salaries, 13th month pay, or separation pay.",
    requirements: ["Payslips / Bank Statement", "Time Cards / Attendance Records", "Daily Time Record (DTR)", "Company ID", "Notice of separation"],
    steps: universalPaoFlow
  },
  "Non-Payment of 13th Month Pay (PD 851)": {
    description: "Claim for mandatory annual bonus.",
    requirements: ["Payslips", "Company ID", "Employment Certificate", "SENA Referral"],
    steps: universalPaoFlow
  },
  "Service Incentive Leave (SIL)": {
    description: "Unpaid leave credits for employees with 1 year service.",
    requirements: ["Payslips", "Daily Time Records (DTR)", "Company ID", "Attendance records"],
    steps: universalPaoFlow
  },
  "Holiday / Premium Pay": {
    description: "Unpaid additional pay for work during holidays or rest days.",
    requirements: ["Daily Time Records showing work on holidays", "Payslips", "Company ID", "Employment Contract"],
    steps: universalPaoFlow
  },
  "Night Shift Differential": {
    description: "Unpaid 10% premium for work between 10 PM and 6 AM.",
    requirements: ["Daily Time Records (DTR)", "Payslips", "Company ID", "Shift schedules"],
    steps: universalPaoFlow
  },
  "Separation Pay (Art. 298-299)": {
    description: "Claim for payment given to an employee whose service is terminated due to authorized causes.",
    requirements: ["Proof of length of service (Payslips/ID)", "Notice of Termination citing authorized cause", "Latest Payslip", "Company ID"],
    steps: universalPaoFlow
  },
  "Claims for Damages (Labor)": {
    description: "Damages for bad faith dismissal or workplace injuries.",
    requirements: ["Medical Certificates", "Incident Reports", "Proof of bad faith (emails/messages)", "Witness statements"],
    steps: universalPaoFlow
  },
  "OFW Money Claims (RA 8042/10022)": {
    description: "Money claims by Overseas Filipino Workers against recruitment agencies or employers.",
    requirements: ["POEA-verified Employment Contract", "Overseas Employment Certificate (OEC)", "Passport with arrival/departure stamps", "Remittance receipts or payslips"],
    steps: universalPaoFlow
  },
  "Unfair Labor Practice (ULP)": {
    description: "Employer interference with union rights or discrimination.",
    requirements: ["Union Membership proof", "CBA (if any)", "Evidence of discriminatory acts", "Witness statements"],
    steps: universalPaoFlow
  },
  "Sexual Harassment (Workplace)": {
    description: "Harassment occurring in the employment environment.",
    requirements: ["Sworn Statement of victim", "Emails/Messages/Screenshots", "Incident reports filed with HR", "Witness statements"],
    steps: universalPaoFlow
  },

  // --- ADMINISTRATIVE ---
  "Grave Misconduct (RRACCS)": {
    description: "Serious violation of rules by public officials.",
    requirements: ["Sworn Complaint", "Official records/Transaction documents", "Witness Affidavits", "Service Record of respondent"],
    steps: universalPaoFlow
  },
  "Conduct Prejudicial to Service": {
    description: "Acts damaging the reputation of public office.",
    requirements: ["Sworn Complaint", "Proof of specific act (Photos/Video)", "Witness Affidavits"],
    steps: universalPaoFlow
  },
  "Violation of Ethical Standards (RA 6713)": {
    description: "Complaints against government employees for corruption or unethical conduct.",
    requirements: ["Sworn Complaint-Affidavit", "Official Records of the transaction", "Witness statements", "Proof of public office employment", "Evidence of misconduct (Photos/Audio)"],
    steps: universalPaoFlow
  },
  "Administrative Neglect of Duty": {
    description: "Failure of a public official to perform a required task or duty.",
    requirements: ["Sworn Complaint", "Official records showing inaction", "Witness Affidavits", "Service Record of the respondent", "Copy of the request or application filed"],
    steps: universalPaoFlow
  },
  "PNP Administrative Complaint (RA 6975)": {
    description: "Disciplinary complaint against members of the Philippine National Police.",
    requirements: ["Sworn Complaint-Affidavit", "Police Blotter or incident report", "PNP ID or name of respondent", "Photos or videos of the incident", "Witness testimonies"],
    steps: universalPaoFlow
  },
  "Police Grave Misconduct": {
    description: "Serious disciplinary violation by police personnel.",
    requirements: ["Sworn Complaint", "IAS/PNP Investigation Report", "Witness Sworn Statements", "Evidence of specific violation"],
    steps: universalPaoFlow
  },
  "IAS Disciplinary Proceeding": {
    description: "Disciplinary cases handled by the Internal Affairs Service.",
    requirements: ["IAS Resolution/Order", "Complaint and Answer", "Service Record", "Official Reports"],
    steps: universalPaoFlow
  },
  "Agrarian Dispute (DARAB/RA 6657)": {
    description: "Disputes involving land reform, tenancy, or agricultural land distribution.",
    requirements: ["TCT / CLOA / Emancipation Patent (EP)", "Tax Declaration", "MARO/PARO Certifications", "Proof of tenancy relationship", "Notice of Coverage (if any)"],
    steps: universalPaoFlow
  },
  "Immigration / Deportation Case": {
    description: "Contesting visa violations or deportation orders.",
    requirements: ["Passport", "Visa/Stay documents", "BI Notice or Order", "Proof of legal status or contestation"],
    steps: universalPaoFlow
  },
  "Anti-Torture Complaint (RA 9745)": {
    description: "Complaints vs state actors for torture or cruel treatment.",
    requirements: ["Medico-Legal Report (Government/CHR doctor)", "Sworn Statement of victim", "Photographs of injuries", "Witness statements"],
    steps: universalPaoFlow
  }
};

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Subpoena/Summons", "Police Blotter", "Affidavits"], steps: universalPaoFlow },
  Civil: { requirements: ["PSA Certificates", "Land Title/Tax Dec", "Barangay Certificate"], steps: universalPaoFlow },
  Labor: { requirements: ["Payslips", "Company ID", "SENA Referral"], steps: universalPaoFlow },
  Administrative: { requirements: ["Official Complaint", "Public Records", "Service Record"], steps: universalPaoFlow }
};
