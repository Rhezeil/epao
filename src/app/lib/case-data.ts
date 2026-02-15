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
    }
  ],
  "Civil": [
    {
      title: "📖 Family Law Cases",
      items: ["Annulment of Marriage", "Declaration of Nullity", "Legal Separation", "Child Custody", "Child Support", "Adoption", "Recognition of Foreign Divorce"]
    },
    {
      title: "📖 Civil Code & Property",
      items: ["Collection of Sum of Money", "Breach of Contract", "Damages", "Property Disputes", "Partition of Property", "Unlawful Detainer", "Forcible Entry", "Small Claims"]
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
    description: "Acts causing mental or emotional suffering, including intimidation, stalking, public ridicule, or marital infidelity.",
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
  "Rape (R.A. 8353 / Art. 266-A)": {
    description: "Sexual assault classified as a crime against persons. Includes qualified rape cases.",
    requirements: ["Medico-legal report (Sexual Abuse Exam)", "Sworn complaint-affidavit", "Psychological evaluation", "Police blotter", "Clothing evidence"],
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
