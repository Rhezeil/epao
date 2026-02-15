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
        "Robbery (with violence/intimidation of persons - Art. 294)",
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
      title: "👷 Employment Disputes",
      items: ["Illegal Dismissal", "Constructive Dismissal", "Non-payment of Wages", "Overtime Pay Claims", "Separation Pay", "13th Month Pay"]
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
    description: "Acts that include bodily or physical harm, battery, or threatening/placing the victim in fear of physical harm.",
    requirements: ["Marriage Certificate / Proof of Relationship", "Birth Certificates of children", "Medico-Legal Certificate", "Photos of injuries", "Sworn Affidavit", "Police Blotter"],
    steps: defaultSteps
  },
  "Sexual Violence (VAWC - Sec. 5b-c)": {
    description: "Acts of a sexual nature including rape, lasciviousness, sexual harassment, or prostituting the woman or child.",
    requirements: ["Marriage Certificate / Proof of Relationship", "Medico-Legal Certificate", "Psychological Evaluation", "Sworn Complaint-Affidavit", "Police Blotter"],
    steps: defaultSteps
  },
  "Psychological Violence (VAWC - Sec. 5h-i)": {
    description: "Acts causing mental or emotional suffering, including intimidation, harassment, stalking, public ridicule, or marital infidelity.",
    requirements: ["Marriage Certificate / Proof of Relationship", "Psychological Evaluation report", "Screenshots of messages/harassment", "Witness affidavits", "Sworn Affidavit"],
    steps: defaultSteps
  },
  "Economic Abuse (VAWC - Sec. 5e)": {
    description: "Acts making a woman financially dependent, such as withdrawing support, controlling money/assets, or preventing employment.",
    requirements: ["Marriage Certificate / Proof of Relationship", "Birth Certificates of children", "Proof of income of partner", "Proof of denial of support", "Sworn Affidavit"],
    steps: defaultSteps
  },

  // --- CRIMES AGAINST PROPERTY (RPC) ---
  "Robbery (with violence/intimidation of persons - Art. 294)": {
    description: "Taking of personal property belonging to another with intent to gain, by means of violence or intimidation against persons. Includes robbery with homicide, rape, physical injuries, or in a band.",
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

  // --- CRIMES AGAINST STATE SECURITY (PUBLIC ORDER) ---
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
  "Conspiracy and Proposal to Commit Rebellion/Coup d'état": {
    description: "Agreeing and deciding to rise publicly and take up arms against the Government.",
    requirements: ["Intelligence reports", "Proof of meetings/agreement", "Witness affidavits", "Digital evidence"],
    steps: defaultSteps
  },
  "Disloyalty of Public Officers/Employees": {
    description: "Failure of public officers to resist or prevent rebellion/insurrection.",
    requirements: ["Employment records", "Duty logs", "Evidence of non-resistance", "Witness affidavits"],
    steps: defaultSteps
  },
  "Sedition": {
    description: "Rising publicly and tumultuously to prevent the execution of laws or to inflict hate upon public officers.",
    requirements: ["Police report", "Photos/Videos of incident", "Witness affidavits", "Media reports"],
    steps: defaultSteps
  },
  "Conspiracy to Commit Sedition": {
    description: "Agreement and decision to rise publicly and tumultuously for seditious purposes.",
    requirements: ["Proof of agreement", "Witness affidavits", "Surveillance reports"],
    steps: defaultSteps
  },
  "Inciting to Rebellion or Sedition": {
    description: "Inciting others to commit rebellion or sedition through speeches, writing, or proclamations.",
    requirements: ["Copies of written materials", "Recordings of speeches", "Witness affidavits", "Digital evidence"],
    steps: defaultSteps
  },

  // --- CRIMES AGAINST AUTHORITY ---
  "Direct Assault": {
    description: "Employing force or intimidation against persons in authority or their agents while in the performance of official duties.",
    requirements: ["Police blotter", "Medico-legal (if injured)", "Sworn statement of officer", "Witness affidavits"],
    steps: defaultSteps
  },
  "Indirect Assault": {
    description: "Making or delivering gifts or offering presents to persons in authority.",
    requirements: ["Proof of offer/gift", "Officer's affidavit", "Witness statements"],
    steps: defaultSteps
  },
  "Resistance and Disobedience to a Person in Authority": {
    description: "Serious or light disobedience to the lawful orders of a person in authority.",
    requirements: ["Sworn statement of officer", "Evidence of lawful order", "Police report", "Witness affidavits"],
    steps: defaultSteps
  },
  "Acts Against Parliamentary Immunity": {
    description: "Violating the immunity of legislators to prevent them from attending sessions or performing duties.",
    requirements: ["Official complaint from legislator", "Evidence of restraint/violation", "Witness affidavits"],
    steps: defaultSteps
  },

  // --- PUBLIC DISORDER ---
  "Illegal Assemblies": {
    description: "Organizing meetings where persons are armed for terrorism or for purposes against the law.",
    requirements: ["Police report", "Photos/Videos of assembly", "Seized weapons inventory", "Witness affidavits"],
    steps: defaultSteps
  },
  "Illegal Associations": {
    description: "Associations organized for purposes contrary to public morals or to commit crimes.",
    requirements: ["Constitution/Bylaws of association", "Evidence of illegal activities", "Arrest reports", "Witness affidavits"],
    steps: defaultSteps
  },
  "Tumults and Other Disturbances": {
    description: "Causing public chaos or tumultuous disturbances of public order.",
    requirements: ["Police blotter", "Media reports", "Witness affidavits", "Photos/Videos of chaos"],
    steps: defaultSteps
  },
  "Unlawful Utterances, Alarms, and Scandals": {
    description: "Creating panic, firing guns in public, or creating noise that breaks public peace.",
    requirements: ["Police report", "Shell casings (if applicable)", "Witness affidavits", "Audio/Video recordings"],
    steps: defaultSteps
  },
  "Delivering Prisoners from Jail/Evasion of Service of Sentence": {
    description: "Assisting in the escape of prisoners or evading the service of a final sentence.",
    requirements: ["Jail records", "Incident report", "CCTV footage", "Witness affidavits", "Arrest warrant"],
    steps: defaultSteps
  },

  // --- DRUGS ---
  "Illegal Possession of Dangerous Drugs (Section 11)": {
    description: "Possession of prohibited substances like methamphetamine ('shabu') or marijuana without legal authority.",
    requirements: ["Arrest report", "Inventory of seized items", "Chemistry report", "Chain of custody documents", "Confiscation receipt"],
    steps: defaultSteps
  },
  "Illegal Possession of Paraphernalia (Section 12)": {
    description: "Possession of equipment or instruments intended for smoking, consuming, or producing dangerous drugs.",
    requirements: ["Inventory of seized paraphernalia", "Arrest report", "Chemistry report", "Witness affidavits"],
    steps: defaultSteps
  },
  "Drug Trafficking / Pushing (Section 5)": {
    description: "Sale, trading, transportation, or distribution of dangerous drugs.",
    requirements: ["Buy-bust operation records", "Marked money copies", "Inventory of drugs", "Chemistry report", "Police affidavits"],
    steps: defaultSteps
  },
  "Use of Dangerous Drugs (Section 15)": {
    description: "Using prohibited substances, often leading to mandatory rehabilitation for first-time offenders.",
    requirements: ["Drug test results (Positive)", "Confirmatory test result", "Police report", "Psychological evaluation"],
    steps: defaultSteps
  },
  "Drug Cases Involving Minors": {
    description: "Violations of RA 9165 involving minors, requiring specialized handling by the PAO.",
    requirements: ["Birth Certificate of Minor", "DSWD Social Case Study", "Arrest report", "Police blotter"],
    steps: defaultSteps
  },
  "Drug Plea Bargaining Applications": {
    description: "Facilitating plea deals for lesser offenses based on the Supreme Court's Plea Bargaining Framework.",
    requirements: ["Motion for Plea Bargaining", "Prosecution recommendation", "Drug test result", "Court order"],
    steps: defaultSteps
  },

  // --- CHASTITY ---
  "Adultery (Art. 333)": {
    description: "Sexual infidelity committed by a married woman and her paramour.",
    requirements: ["Marriage Certificate", "Evidence of infidelity (Photos/Messages)", "Witness affidavits", "Sworn complaint"],
    steps: defaultSteps
  },
  "Concubinage (Art. 334)": {
    description: "Sexual infidelity committed by a married man by keeping a mistress or cohabiting.",
    requirements: ["Marriage Certificate", "Proof of cohabitation", "Witness affidavits", "Sworn complaint"],
    steps: defaultSteps
  },
  "Acts of Lasciviousness (Art. 336)": {
    description: "Engaging in lewd acts with another person under circumstances of force or intimidation.",
    requirements: ["Medico-legal report", "Sworn complaint of victim", "Witness affidavits", "Psychological evaluation"],
    steps: defaultSteps
  },
  "Qualified Seduction (Art. 337)": {
    description: "Seducing a virgin over 12 but under 18 years old.",
    requirements: ["Birth Certificate of victim", "Sworn complaint", "Witness affidavits"],
    steps: defaultSteps
  },
  "Simple Seduction (Art. 338)": {
    description: "Seducing a woman over 12 but under 18 years old, who is not a virgin, through deceit.",
    requirements: ["Birth Certificate of victim", "Sworn complaint", "Witness affidavits"],
    steps: defaultSteps
  },
  "Forcible Abduction (Art. 342)": {
    description: "Abducting a woman against her will with lewd designs.",
    requirements: ["Police report", "Sworn complaint", "Witness affidavits"],
    steps: defaultSteps
  },
  "Consented Abduction (Art. 343)": {
    description: "Abducting a virgin over 12 but under 18 years old with her consent.",
    requirements: ["Birth Certificate of victim", "Sworn complaint", "Witness affidavits"],
    steps: defaultSteps
  },
  "Corruption of Minors (Art. 340)": {
    description: "Promoting or facilitating the prostitution or corruption of a minor.",
    requirements: ["Birth Certificate of minor", "Proof of illegal acts", "Witness affidavits"],
    steps: defaultSteps
  },
  "White Slave Trade (Art. 341)": {
    description: "Engaging in the business of prostitution.",
    requirements: ["Police report", "Witness affidavits", "Surveillance evidence"],
    steps: defaultSteps
  },
  "Abuses Against Chastity by Public Officers (Art. 245)": {
    description: "Public officers soliciting indecent advances from women with matters pending before them.",
    requirements: ["Proof of public office", "Evidence of solicitation/indecent advances", "Witness affidavits"],
    steps: defaultSteps
  },

  // --- CIVIL LAW: FAMILY RELATIONS ---
  "Declaration of Nullity of Marriage": {
    description: "Declaration that a marriage was void from the beginning (e.g., Art. 36 Psychological Incapacity).",
    requirements: ["PSA Marriage Contract", "PSA Birth Certificates of children", "Psychological Evaluation Report (if Art. 36)", "Barangay Certificate of Residence", "Witness affidavits"],
    steps: defaultSteps
  },
  "Annulment of Marriage": {
    description: "A valid marriage that is canceled due to grounds existing at the time of celebration (e.g., Art. 45).",
    requirements: ["PSA Marriage Contract", "Evidence of grounds (e.g., medical cert for impotence)", "Witness affidavits", "PSA Birth Certificates of children"],
    steps: defaultSteps
  },
  "Legal Separation": {
    description: "Separation of bed and board while the marriage bond remains (Art. 55 Family Code).",
    requirements: ["PSA Marriage Contract", "Evidence of grounds (e.g., proof of infidelity/violence)", "Witness affidavits"],
    steps: defaultSteps
  },
  "Support": {
    description: "Everything indispensable for sustenance, dwelling, clothing, and medical attendance (Art. 194 Family Code).",
    requirements: ["PSA Birth Certificate of child", "Proof of financial need", "Proof of respondent's income (if available)", "Affidavit of dependency"],
    steps: defaultSteps
  },
  "Custody of Children": {
    description: "Determination of who will have physical and legal custody of minors (Art. 211-213 Family Code).",
    requirements: ["PSA Birth Certificate of child", "Social Case Study (from DSWD)", "Barangay Clearance", "Witness affidavits regarding parent's fitness"],
    steps: defaultSteps
  },
  "Adoption": {
    description: "Creation of a parent-child relationship by law through domestic adoption proceedings.",
    requirements: ["PSA Birth Certificate of child", "PSA Birth Certificate of adopter", "Home Study Report (from DSWD)", "Marriage Contract of adopters", "NBI Clearance"],
    steps: defaultSteps
  },
  "Recognition of Foreign Divorce": {
    description: "Judicial recognition of a divorce decree obtained abroad by a foreign spouse (Art. 26 Family Code).",
    requirements: ["Authenticated Foreign Divorce Decree", "Foreign Law on Divorce (duly authenticated)", "PSA Marriage Contract", "Proof of foreign citizenship of spouse"],
    steps: defaultSteps
  },

  // --- CIVIL LAW: PROPERTY AND LAND DISPUTES ---
  "Forcible Entry": {
    description: "Recovery of possession when one is deprived through force, intimidation, strategy, or stealth.",
    requirements: ["Land Title or Tax Declaration", "Proof of prior physical possession", "Police blotter or affidavit regarding entry", "Barangay Certificate to File Action"],
    steps: defaultSteps
  },
  "Unlawful Detainer": {
    description: "Recovery of possession when possession was initially legal but became illegal after notice to vacate.",
    requirements: ["Land Title or Tax Declaration", "Demand Letter to vacate with proof of receipt", "Lease Contract (if any)", "Barangay Certificate to File Action"],
    steps: defaultSteps
  },
  "Recovery of Possession": {
    description: "Accion Publiciana: A plenary action to recover the right of possession when dispossession lasts more than a year.",
    requirements: ["Certified True Copy of Land Title", "Tax Declaration", "Proof of ownership/right to possess", "Survey plan (if applicable)"],
    steps: defaultSteps
  },
  "Recovery of Ownership": {
    description: "Accion Reivindicatoria: An action to recover ownership of real property.",
    requirements: ["Original or Certified Land Title", "History of ownership documents", "Tax Declaration", "Proof of boundaries"],
    steps: defaultSteps
  },
  "Partition": {
    description: "Action to divide shared property among co-owners (Art. 494-495 Civil Code).",
    requirements: ["Certified True Copy of Land Title", "Tax Declaration", "List of co-owners", "Death certificate of original owner (if inheritance)"],
    steps: defaultSteps
  },
  "Easements": {
    description: "Disputes regarding rights of way or other encumbrances on property.",
    requirements: ["Land Title", "Sketch plan showing easement area", "Proof of necessity", "Witness affidavits"],
    steps: defaultSteps
  },

  // --- CIVIL LAW: OBLIGATIONS AND CONTRACTS ---
  "Breach of Contract": {
    description: "Failure to fulfill contractual obligations due to fraud, negligence, or delay (Art. 1170 Civil Code).",
    requirements: ["Original Contract or Agreement", "Proof of violation", "Demand letter", "Evidence of damages incurred"],
    steps: defaultSteps
  },
  "Collection of Sum of Money": {
    description: "Claims for debts, unpaid loans, or services rendered (Small Claims up to P1M).",
    requirements: ["Promissory Note or Acknowledgment Receipt", "Statement of Account", "Demand Letter with proof of service", "Proof of partial payments (if any)"],
    steps: defaultSteps
  },
  "Damages": {
    description: "Claims for moral, exemplary, or nominal damages due to quasi-delicts or breach of contract (Art. 2176-2194).",
    requirements: ["Evidence of injury or loss", "Proof of negligence or fault", "Medical certs/receipts for actual damages", "Witness affidavits"],
    steps: defaultSteps
  },
  "Small Claims": {
    description: "Simplified judicial process for payment of money claims not exceeding P1,000,000.",
    requirements: ["Verified Statement of Claim", "Promissory Note/Contract", "Demand Letter", "Affidavit of Non-Forum Shopping"],
    steps: defaultSteps
  },

  // --- CIVIL LAW: SPECIAL PROCEEDINGS ---
  "Guardianship": {
    description: "Appointment of a guardian for the person or property of a minor or incompetent.",
    requirements: ["PSA Birth Certificate of ward", "Medical Certificate (if incompetent)", "List of properties of ward", "Affidavit of fitness of guardian"],
    steps: defaultSteps
  },
  "Correction of Entries in the Civil Registry": {
    description: "Petitions to correct birth, marriage, or death certificates (Rule 108 / RA 9048).",
    requirements: ["PSA Copy of document to be corrected", "Baptismal Certificate", "School Records (Form 137)", "Affidavit of Discrepancy", "NBI/Police Clearance"],
    steps: defaultSteps
  },
  "Settlement of Estate": {
    description: "Summary settlement of small estates or judicial partition of inheritance.",
    requirements: ["PSA Death Certificate of deceased", "PSA Birth/Marriage certs of heirs", "List of properties/assets", "Last Will (if any)"],
    steps: defaultSteps
  },
  "Writ of Habeas Data/Amparo": {
    description: "Protection of privacy, safety, and liberty against threats or extralegal killings.",
    requirements: ["Sworn statement of victim/petitioner", "Evidence of threat or harassment", "Witness affidavits", "Police reports"],
    steps: defaultSteps
  }
};

export const categoryDefaults: Record<string, { requirements: string[], steps: any[] }> = {
  Criminal: { requirements: ["Court Subpoena", "Arrest Record", "Copy of Complaint"], steps: universalPaoFlow },
  Civil: { requirements: ["Relevant contracts", "Demand letter", "Proof of claim"], steps: universalPaoFlow },
  Labor: { requirements: ["Employment records", "Payslips", "ID card"], steps: universalPaoFlow }
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
