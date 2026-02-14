/**
 * @fileOverview Shared case category data for LexConnect.
 */

export const caseCategories = {
  Criminal: [
    {
      title: "Crimes against Persons",
      items: ["Murder", "Homicide", "Physical Injury", "Assault", "Rape", "Sexual Harassment", "Violence Against Women and Children (VAWC)", "Kidnapping", "Abduction"]
    },
    {
      title: "Crimes against Property",
      items: ["Theft", "Robbery", "Arson", "Estafa / Fraud", "Embezzlement", "Malversation"]
    },
    {
      title: "Crimes against Public Order",
      items: ["Rebellion", "Sedition", "Resistance to Public Officials", "Illegal Possession of Firearms"]
    },
    {
      title: "Drug-related Offenses",
      items: ["Drug Possession", "Drug Trafficking", "Drug Use / Distribution"]
    },
    {
      title: "Special Criminal Cases",
      items: ["Cybercrime", "Human Trafficking", "White-Collar Crimes", "Juvenile Delinquency"]
    }
  ],
  Civil: [
    {
      title: "Family Law",
      items: ["Annulment", "Legal Separation", "Divorce (for Muslims)", "Child Custody / Visitation", "Child Support / Alimony", "Adoption", "Paternity / Legitimacy Claims"]
    },
    {
      title: "Property / Real Estate",
      items: ["Land Disputes", "Boundary Disputes", "Eviction / Ejectment", "Condemnation / Expropriation"]
    },
    {
      title: "Contract / Business Disputes",
      items: ["Breach of Contract", "Non-Performance of Contract", "Sale / Lease Disputes", "Partnership / Corporation Disputes", "Loan / Debt Collection"]
    },
    {
      title: "Tort / Civil Wrongs",
      items: ["Personal Injury", "Medical Malpractice", "Defamation (Libel & Slander)", "Negligence", "Product Liability"]
    },
    {
      title: "Probate / Estate Cases",
      items: ["Estate Settlement", "Will Contests", "Inheritance Disputes", "Trust Administration"]
    }
  ],
  Labor: [
    {
      title: "Labor Disputes",
      items: ["Wrongful Termination", "Non-payment of Wages", "Illegal Dismissal / Wrongful Termination", "Contract Violations"]
    },
    {
      title: "Workplace & Benefits",
      items: ["Workplace Injuries / Compensation Claims", "Benefits Disputes (SSS, PhilHealth, Pag-IBIG)"]
    },
    {
      title: "Union / Collective Bargaining",
      items: ["Union / Collective Bargaining Disputes"]
    }
  ],
  Administrative: [
    {
      title: "Government Dealings",
      items: ["Tax / Revenue Disputes", "Immigration / Deportation", "Licensing / Permit Issues", "Environmental / Regulatory Violations"]
    }
  ],
  Constitutional: [
    {
      title: "Rights & Writs",
      items: [
        "Civil Liberties",
        "Equality / Anti-Discrimination",
        "Separation of Powers",
        "Writ of Habeas Corpus",
        "Writ of Mandamus",
        "Writ of Amparo",
        "Writ of Kalikasan"
      ]
    }
  ],
  Commercial: [
    {
      title: "Business Law",
      items: [
        "Corporate / Partnership Disputes",
        "Intellectual Property",
        "Bankruptcy / Insolvency",
        "Contracts / Trade Disputes"
      ]
    }
  ],
  "Special/Other": [
    {
      title: "Miscellaneous",
      items: [
        "Juvenile Cases",
        "Human Rights Cases",
        "Election Cases",
        "Online Scams / Cyberlaw",
        "Consumer Protection"
      ]
    }
  ],
  Notarization: [
    {
      title: "Legal Documents",
      items: [
        "Notarization",
        "Affidavits / Sworn Statements",
        "Powers of Attorney",
        "Deed of Sale / Transfer",
        "Contracts / Agreements",
        "Certification / Authentication"
      ]
    }
  ]
};

export const allCaseNames = Object.values(caseCategories)
  .flatMap(categories => categories.flatMap(cat => cat.items));

export const defaultRequirements = [
  "Certificate of Indigency from DSWD",
  "Police blotter / complaint report",
  "Medico-legal certificate (for injuries or sexual assault)",
  "Witness information / affidavits",
  "Any prior related court orders"
];

export const defaultSteps = [
  { step: 1, title: "Prepare documents", content: "Collect all listed documents including your Certificate of Indigency and case-related papers." },
  { step: 2, title: "Visit PAO", content: "Go to your nearest PAO District Office with your prepared documents for initial assessment." },
  { step: 3, title: "Screening interview", content: "A screening officer will verify your indigency and the merit of your case." },
  { step: 4, title: "Lawyer assignment", content: "Once qualified, you will be assigned a Public Attorney to handle your legal matter." }
];
