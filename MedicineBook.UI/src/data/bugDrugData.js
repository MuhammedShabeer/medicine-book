/**
 * Spectra: Comprehensive Antimicrobial & Pathogen Navigator Data
 * Fully updated and verified against 2026 guidelines (IDSA, CDC, WHO, ECMM, FDA Labels, AHFS)
 * Covers: Antibacterials, Antifungals, Antivirals, TB/Mycobacteria, and Antiparasitics
 */

export const FAMILIES = {
  "gpos": {
    "id": "gpos",
    "name": "Gram-positive cocci",
    "badgeLabel": "Gram-positive cocci",
    "theme": {
      "text": "text-violet-700 dark:text-violet-300",
      "bg": "bg-violet-50 dark:bg-violet-950/40",
      "border": "border-violet-200 dark:border-violet-800/60",
      "activeBg": "bg-violet-100 dark:bg-violet-900/50",
      "activeBorder": "border-violet-500 dark:border-violet-400",
      "dot": "bg-violet-600 dark:bg-violet-400",
      "ring": "border-violet-600 dark:border-violet-400",
      "pill": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
    }
  },
  "gpbac": {
    "id": "gpbac",
    "name": "Gram-positive bacilli",
    "badgeLabel": "Gram-positive bacilli",
    "theme": {
      "text": "text-violet-700 dark:text-violet-300",
      "bg": "bg-violet-50 dark:bg-violet-950/40",
      "border": "border-violet-200 dark:border-violet-800/60",
      "activeBg": "bg-violet-100 dark:bg-violet-900/50",
      "activeBorder": "border-violet-500 dark:border-violet-400",
      "dot": "bg-violet-600 dark:bg-violet-400",
      "ring": "border-violet-600 dark:border-violet-400",
      "pill": "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
    }
  },
  "gneg": {
    "id": "gneg",
    "name": "Gram-negative bacilli",
    "badgeLabel": "Gram-negative bacilli",
    "theme": {
      "text": "text-rose-700 dark:text-rose-300",
      "bg": "bg-rose-50 dark:bg-rose-950/40",
      "border": "border-rose-200 dark:border-rose-800/60",
      "activeBg": "bg-rose-100 dark:bg-rose-900/50",
      "activeBorder": "border-rose-500 dark:border-rose-400",
      "dot": "bg-rose-600 dark:bg-rose-400",
      "ring": "border-rose-600 dark:border-rose-400",
      "pill": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
    }
  },
  "gncc": {
    "id": "gncc",
    "name": "Gram-negative cocci",
    "badgeLabel": "Gram-negative cocci",
    "theme": {
      "text": "text-rose-700 dark:text-rose-300",
      "bg": "bg-rose-50 dark:bg-rose-950/40",
      "border": "border-rose-200 dark:border-rose-800/60",
      "activeBg": "bg-rose-100 dark:bg-rose-900/50",
      "activeBorder": "border-rose-500 dark:border-rose-400",
      "dot": "bg-rose-600 dark:bg-rose-400",
      "ring": "border-rose-600 dark:border-rose-400",
      "pill": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
    }
  },
  "anae": {
    "id": "anae",
    "name": "Anaerobes",
    "badgeLabel": "Anaerobes",
    "theme": {
      "text": "text-amber-800 dark:text-amber-300",
      "bg": "bg-amber-50 dark:bg-amber-950/40",
      "border": "border-amber-200 dark:border-amber-800/60",
      "activeBg": "bg-amber-100 dark:bg-amber-900/50",
      "activeBorder": "border-amber-500 dark:border-amber-400",
      "dot": "bg-amber-600 dark:bg-amber-400",
      "ring": "border-amber-600 dark:border-amber-400",
      "pill": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
    }
  },
  "atyp": {
    "id": "atyp",
    "name": "Atypicals",
    "badgeLabel": "Atypicals",
    "theme": {
      "text": "text-teal-700 dark:text-teal-300",
      "bg": "bg-teal-50 dark:bg-teal-950/40",
      "border": "border-teal-200 dark:border-teal-800/60",
      "activeBg": "bg-teal-100 dark:bg-teal-900/50",
      "activeBorder": "border-teal-500 dark:border-teal-400",
      "dot": "bg-teal-600 dark:bg-teal-400",
      "ring": "border-teal-600 dark:border-teal-400",
      "pill": "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300"
    }
  },
  "spir": {
    "id": "spir",
    "name": "Spirochaetes",
    "badgeLabel": "Spirochaetes",
    "theme": {
      "text": "text-cyan-700 dark:text-cyan-300",
      "bg": "bg-cyan-50 dark:bg-cyan-950/40",
      "border": "border-cyan-200 dark:border-cyan-800/60",
      "activeBg": "bg-cyan-100 dark:bg-cyan-900/50",
      "activeBorder": "border-cyan-500 dark:border-cyan-400",
      "dot": "bg-cyan-600 dark:bg-cyan-400",
      "ring": "border-cyan-600 dark:border-cyan-400",
      "pill": "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300"
    }
  },
  "yeast": {
    "id": "yeast",
    "name": "Yeasts: Candida",
    "badgeLabel": "Yeasts",
    "theme": {
      "text": "text-emerald-700 dark:text-emerald-300",
      "bg": "bg-emerald-50 dark:bg-emerald-950/40",
      "border": "border-emerald-200 dark:border-emerald-800/60",
      "activeBg": "bg-emerald-100 dark:bg-emerald-900/50",
      "activeBorder": "border-emerald-500 dark:border-emerald-400",
      "dot": "bg-emerald-600 dark:bg-emerald-400",
      "ring": "border-emerald-600 dark:border-emerald-400",
      "pill": "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300"
    }
  },
  "cryp": {
    "id": "cryp",
    "name": "Yeasts: Cryptococcus",
    "badgeLabel": "Yeasts",
    "theme": {
      "text": "text-blue-700 dark:text-blue-300",
      "bg": "bg-blue-50 dark:bg-blue-950/40",
      "border": "border-blue-200 dark:border-blue-800/60",
      "activeBg": "bg-blue-100 dark:bg-blue-900/50",
      "activeBorder": "border-blue-500 dark:border-blue-400",
      "dot": "bg-blue-600 dark:bg-blue-400",
      "ring": "border-blue-600 dark:border-blue-400",
      "pill": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
    }
  },
  "mould": {
    "id": "mould",
    "name": "Moulds",
    "badgeLabel": "Moulds",
    "theme": {
      "text": "text-amber-700 dark:text-amber-300",
      "bg": "bg-amber-50 dark:bg-amber-950/40",
      "border": "border-amber-200 dark:border-amber-800/60",
      "activeBg": "bg-amber-100 dark:bg-amber-900/50",
      "activeBorder": "border-amber-500 dark:border-amber-400",
      "dot": "bg-amber-600 dark:bg-amber-400",
      "ring": "border-amber-600 dark:border-amber-400",
      "pill": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
    }
  },
  "pjp": {
    "id": "pjp",
    "name": "Pneumocystis",
    "badgeLabel": "Pneumocystis",
    "theme": {
      "text": "text-purple-700 dark:text-purple-300",
      "bg": "bg-purple-50 dark:bg-purple-950/40",
      "border": "border-purple-200 dark:border-purple-800/60",
      "activeBg": "bg-purple-100 dark:bg-purple-900/50",
      "activeBorder": "border-purple-500 dark:border-purple-400",
      "dot": "bg-purple-600 dark:bg-purple-400",
      "ring": "border-purple-600 dark:border-purple-400",
      "pill": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
    }
  },
  "herp": {
    "id": "herp",
    "name": "Herpesviruses",
    "badgeLabel": "Herpesviruses",
    "theme": {
      "text": "text-rose-700 dark:text-rose-300",
      "bg": "bg-rose-50 dark:bg-rose-950/40",
      "border": "border-rose-200 dark:border-rose-800/60",
      "activeBg": "bg-rose-100 dark:bg-rose-900/50",
      "activeBorder": "border-rose-500 dark:border-rose-400",
      "dot": "bg-rose-600 dark:bg-rose-400",
      "ring": "border-rose-600 dark:border-rose-400",
      "pill": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
    }
  },
  "resp": {
    "id": "resp",
    "name": "Respiratory viruses",
    "badgeLabel": "Respiratory viruses",
    "theme": {
      "text": "text-sky-700 dark:text-sky-300",
      "bg": "bg-sky-50 dark:bg-sky-950/40",
      "border": "border-sky-200 dark:border-sky-800/60",
      "activeBg": "bg-sky-100 dark:bg-sky-900/50",
      "activeBorder": "border-sky-500 dark:border-sky-400",
      "dot": "bg-sky-600 dark:bg-sky-400",
      "ring": "border-sky-600 dark:border-sky-400",
      "pill": "bg-sky-100 text-sky-800 dark:bg-sky-900/40 dark:text-sky-300"
    }
  },
  "hep": {
    "id": "hep",
    "name": "Hepatitis viruses",
    "badgeLabel": "Hepatitis viruses",
    "theme": {
      "text": "text-amber-800 dark:text-amber-300",
      "bg": "bg-amber-50 dark:bg-amber-950/40",
      "border": "border-amber-200 dark:border-amber-800/60",
      "activeBg": "bg-amber-100 dark:bg-amber-900/50",
      "activeBorder": "border-amber-500 dark:border-amber-400",
      "dot": "bg-amber-600 dark:bg-amber-400",
      "ring": "border-amber-600 dark:border-amber-400",
      "pill": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
    }
  },
  "retro": {
    "id": "retro",
    "name": "HIV",
    "badgeLabel": "HIV",
    "theme": {
      "text": "text-purple-700 dark:text-purple-300",
      "bg": "bg-purple-50 dark:bg-purple-950/40",
      "border": "border-purple-200 dark:border-purple-800/60",
      "activeBg": "bg-purple-100 dark:bg-purple-900/50",
      "activeBorder": "border-purple-500 dark:border-purple-400",
      "dot": "bg-purple-600 dark:bg-purple-400",
      "ring": "border-purple-600 dark:border-purple-400",
      "pill": "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300"
    }
  },
  "pox": {
    "id": "pox",
    "name": "Poxviruses",
    "badgeLabel": "Poxviruses",
    "theme": {
      "text": "text-green-700 dark:text-green-300",
      "bg": "bg-green-50 dark:bg-green-950/40",
      "border": "border-green-200 dark:border-green-800/60",
      "activeBg": "bg-green-100 dark:bg-green-900/50",
      "activeBorder": "border-green-500 dark:border-green-400",
      "dot": "bg-green-600 dark:bg-green-400",
      "ring": "border-green-600 dark:border-green-400",
      "pill": "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
    }
  },
  "tb": {
    "id": "tb",
    "name": "Mycobacterium tuberculosis",
    "badgeLabel": "Mycobacterium tuberculosis",
    "theme": {
      "text": "text-rose-700 dark:text-rose-300",
      "bg": "bg-rose-50 dark:bg-rose-950/40",
      "border": "border-rose-200 dark:border-rose-800/60",
      "activeBg": "bg-rose-100 dark:bg-rose-900/50",
      "activeBorder": "border-rose-500 dark:border-rose-400",
      "dot": "bg-rose-600 dark:bg-rose-400",
      "ring": "border-rose-600 dark:border-rose-400",
      "pill": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
    }
  },
  "ntm": {
    "id": "ntm",
    "name": "Non-tuberculous mycobacteria",
    "badgeLabel": "Non-tuberculous mycobacteria",
    "theme": {
      "text": "text-blue-700 dark:text-blue-300",
      "bg": "bg-blue-50 dark:bg-blue-950/40",
      "border": "border-blue-200 dark:border-blue-800/60",
      "activeBg": "bg-blue-100 dark:bg-blue-900/50",
      "activeBorder": "border-blue-500 dark:border-blue-400",
      "dot": "bg-blue-600 dark:bg-blue-400",
      "ring": "border-blue-600 dark:border-blue-400",
      "pill": "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
    }
  },
  "mal": {
    "id": "mal",
    "name": "Malaria (Plasmodium)",
    "badgeLabel": "Malaria (Plasmodium)",
    "theme": {
      "text": "text-rose-700 dark:text-rose-300",
      "bg": "bg-rose-50 dark:bg-rose-950/40",
      "border": "border-rose-200 dark:border-rose-800/60",
      "activeBg": "bg-rose-100 dark:bg-rose-900/50",
      "activeBorder": "border-rose-500 dark:border-rose-400",
      "dot": "bg-rose-600 dark:bg-rose-400",
      "ring": "border-rose-600 dark:border-rose-400",
      "pill": "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
    }
  },
  "proto": {
    "id": "proto",
    "name": "Other protozoa",
    "badgeLabel": "Other protozoa",
    "theme": {
      "text": "text-teal-700 dark:text-teal-300",
      "bg": "bg-teal-50 dark:bg-teal-950/40",
      "border": "border-teal-200 dark:border-teal-800/60",
      "activeBg": "bg-teal-100 dark:bg-teal-900/50",
      "activeBorder": "border-teal-500 dark:border-teal-400",
      "dot": "bg-teal-600 dark:bg-teal-400",
      "ring": "border-teal-600 dark:border-teal-400",
      "pill": "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300"
    }
  },
  "helm": {
    "id": "helm",
    "name": "Helminths (worms)",
    "badgeLabel": "Helminths (worms)",
    "theme": {
      "text": "text-amber-800 dark:text-amber-300",
      "bg": "bg-amber-50 dark:bg-amber-950/40",
      "border": "border-amber-200 dark:border-amber-800/60",
      "activeBg": "bg-amber-100 dark:bg-amber-900/50",
      "activeBorder": "border-amber-500 dark:border-amber-400",
      "dot": "bg-amber-600 dark:bg-amber-400",
      "ring": "border-amber-600 dark:border-amber-400",
      "pill": "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
    }
  },
  "ecto": {
    "id": "ecto",
    "name": "Ectoparasites",
    "badgeLabel": "Ectoparasites",
    "theme": {
      "text": "text-green-700 dark:text-green-300",
      "bg": "bg-green-50 dark:bg-green-950/40",
      "border": "border-green-200 dark:border-green-800/60",
      "activeBg": "bg-green-100 dark:bg-green-900/50",
      "activeBorder": "border-green-500 dark:border-green-400",
      "dot": "bg-green-600 dark:bg-green-400",
      "ring": "border-green-600 dark:border-green-400",
      "pill": "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300"
    }
  }
};

export const FAMILY_ORDER = ["gpos", "gpbac", "gneg", "gncc", "anae", "atyp", "spir"];

export const ORGANISMS_BASE = [
  {
    "id": "strep",
    "f": "gpos",
    "n": "Streptococci",
    "s": "S. pneumoniae, S. pyogenes, viridans group",
    "site": "Brain, oral, respiratory tract, heart, skin"
  },
  {
    "id": "entero",
    "f": "gpos",
    "n": "Enterococci",
    "s": "Group D strep",
    "site": "Intra-abdominal, urinary tract",
    "note": "Listed drugs are active against E. faecalis but have limited activity against E. faecium."
  },
  {
    "id": "sepi",
    "f": "gpos",
    "n": "Staph epidermidis",
    "s": "Coagulase-negative",
    "site": "Skin, prosthetics",
    "note": "Cloxacillin and clindamycin usually have under 40% activity against S. epidermidis; use depends on local susceptibility data."
  },
  {
    "id": "mssa",
    "f": "gpos",
    "n": "Staph aureus (MSSA)",
    "s": "Methicillin-sensitive",
    "site": "Oral, respiratory tract, heart, skin, bones/joints"
  },
  {
    "id": "camrsa",
    "f": "gpos",
    "n": "MRSA, community",
    "s": "Community-acquired",
    "site": "Oral, respiratory tract, heart, skin, bones/joints"
  },
  {
    "id": "hamrsa",
    "f": "gpos",
    "n": "MRSA, hospital",
    "s": "Hospital-acquired",
    "site": "Oral, respiratory tract, heart, skin, bones/joints"
  },
  {
    "id": "gnb",
    "f": "gneg",
    "n": "E. coli, Klebsiella, H. influenzae",
    "s": "Non-β-lactamase producing",
    "site": "Brain, respiratory tract, intra-abdominal, urinary tract"
  },
  {
    "id": "gnbbl",
    "f": "gneg",
    "n": "E. coli, Klebsiella, H. influenzae",
    "s": "β-lactamase producing",
    "site": "Brain, respiratory tract, intra-abdominal, urinary tract"
  },
  {
    "id": "space",
    "f": "gneg",
    "n": "SPACE organisms",
    "s": "Serratia, Proteus, Acinetobacter, Citrobacter, Enterobacter",
    "site": "Brain, respiratory tract, intra-abdominal, urinary tract",
    "note": "Cephalosporins have in-vitro activity against SPACE organisms but induce β-lactamase production. Tigecycline activity against Proteus and Acinetobacter depends on local susceptibility data."
  },
  {
    "id": "esbl",
    "f": "gneg",
    "n": "ESBL E. coli, Klebsiella",
    "s": "Extended-spectrum β-lactamase",
    "site": "Brain, respiratory tract, intra-abdominal, urinary tract"
  },
  {
    "id": "cre",
    "f": "gneg",
    "n": "CRE",
    "s": "Carbapenem-resistant Enterobacteriaceae",
    "site": "Brain, respiratory tract, intra-abdominal, urinary tract"
  },
  {
    "id": "pseudo",
    "f": "gneg",
    "n": "Pseudomonas aeruginosa",
    "s": "",
    "site": "Brain, respiratory tract, intra-abdominal, urinary tract",
    "note": "Tigecycline has no activity against Pseudomonas aeruginosa."
  },
  {
    "id": "nmen",
    "f": "gncc",
    "n": "Neisseria meningitidis",
    "s": "",
    "site": "Brain"
  },
  {
    "id": "ngon",
    "f": "gncc",
    "n": "Neisseria gonorrhoeae",
    "s": "",
    "site": "Pelvic inflammatory disease / STI"
  },
  {
    "id": "pepto",
    "f": "anae",
    "n": "Above the diaphragm",
    "s": "Peptostreptococcus",
    "site": "Oral, respiratory tract"
  },
  {
    "id": "bact",
    "f": "anae",
    "n": "Below the diaphragm",
    "s": "Bacteroides sp.",
    "site": "Intra-abdominal, pelvic inflammatory disease"
  },
  {
    "id": "cdiff",
    "f": "anae",
    "n": "Clostridioides difficile",
    "s": "",
    "site": "Intra-abdominal"
  },
  {
    "id": "myco",
    "f": "atyp",
    "n": "Mycoplasma, Chlamydophila",
    "s": "M. pneumoniae, Chlamydophila spp.",
    "site": "Respiratory tract"
  },
  {
    "id": "legion",
    "f": "atyp",
    "n": "Legionella pneumophila",
    "s": "",
    "site": "Respiratory tract"
  },
  {
    "id": "chlam",
    "f": "atyp",
    "n": "Chlamydia trachomatis",
    "s": "",
    "site": "Pelvic inflammatory disease / STI"
  }
];

export const ORGANISMS_2026_ADDITIONS = [
  {
    "id": "vre",
    "f": "gpos",
    "n": "VRE",
    "s": "Vancomycin-resistant Enterococcus (mainly E. faecium)",
    "site": "Hospital-acquired infections",
    "only26": 1
  },
  {
    "id": "listeria",
    "f": "gpbac",
    "n": "Listeria monocytogenes",
    "s": "",
    "site": "Brain (meningitis), bloodstream; pregnancy, neonates, immunocompromised",
    "only26": 1
  },
  {
    "id": "steno",
    "f": "gneg",
    "n": "Stenotrophomonas maltophilia",
    "s": "",
    "site": "Hospital-acquired, mainly respiratory tract",
    "only26": 1
  },
  {
    "id": "crab",
    "f": "gneg",
    "n": "CRAB",
    "s": "Carbapenem-resistant Acinetobacter baumannii",
    "site": "Hospital-acquired: respiratory tract, bloodstream",
    "only26": 1
  },
  {
    "id": "typhi",
    "f": "gneg",
    "n": "Salmonella Typhi / Paratyphi",
    "s": "Enteric (typhoid) fever",
    "site": "Bloodstream, gut",
    "only26": 1
  },
  {
    "id": "brucella",
    "f": "gneg",
    "n": "Brucella spp.",
    "s": "Brucellosis",
    "site": "Bloodstream, bones and joints (spine), endocarditis, CNS",
    "only26": 1
  },
  {
    "id": "tpall",
    "f": "spir",
    "n": "Treponema pallidum",
    "s": "Syphilis",
    "site": "Genital, skin, CNS/eye/ear (neurosyphilis), congenital",
    "only26": 1
  }
];

export const DRUGS_BASE = [
  {
    "c": "Penicillins",
    "n": "Penicillin V/G",
    "cov": {
      "strep": 1,
      "entero": 1,
      "nmen": {
        "q": "IV penicillin G"
      },
      "pepto": 1
    }
  },
  {
    "c": "Penicillins",
    "n": "Amoxicillin/ampicillin",
    "cov": {
      "strep": 1,
      "entero": 1,
      "gnb": 1,
      "nmen": {
        "q": "IV ampicillin"
      },
      "pepto": 1
    }
  },
  {
    "c": "Penicillins",
    "n": "Cloxacillin",
    "cov": {
      "sepi": {
        "q": "Often under 40% active"
      },
      "mssa": 1
    }
  },
  {
    "c": "Penicillins",
    "n": "Amoxicillin-clavulanate",
    "cov": {
      "strep": 1,
      "entero": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "pepto": 1
    }
  },
  {
    "c": "Penicillins",
    "n": "Piperacillin-tazobactam",
    "cov": {
      "strep": 1,
      "entero": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "pseudo": 1,
      "pepto": 1,
      "bact": 1
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Cefazolin/cephalexin",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": 1,
      "pepto": 1
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Cefuroxime",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "pepto": 1
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Cefoxitin",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "pepto": 1,
      "bact": 1
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Ceftriaxone/cefotaxime",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "nmen": 1,
      "ngon": 1,
      "pepto": 1
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Cefixime",
    "cov": {
      "strep": 1,
      "gnb": 1,
      "gnbbl": 1,
      "ngon": 1
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Ceftazidime",
    "cov": {
      "gnb": 1,
      "gnbbl": 1,
      "pseudo": 1
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Ceftolozane-tazobactam",
    "cov": {
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "pseudo": 1,
      "pepto": 1,
      "bact": 1
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Cefepime",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "pseudo": 1,
      "pepto": 1
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Ceftobiprole",
    "cov": {
      "strep": 1,
      "sepi": 1,
      "mssa": 1,
      "camrsa": 1,
      "hamrsa": 1,
      "gnb": 1
    }
  },
  {
    "c": "Carbapenems",
    "n": "Meropenem/imipenem/doripenem",
    "cov": {
      "strep": 1,
      "entero": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "pseudo": 1,
      "nmen": 1,
      "pepto": 1,
      "bact": 1
    }
  },
  {
    "c": "Carbapenems",
    "n": "Ertapenem",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "pepto": 1,
      "bact": 1
    }
  },
  {
    "c": "Macrolides",
    "n": "Erythromycin",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "myco": 1,
      "legion": 1,
      "chlam": 1
    }
  },
  {
    "c": "Macrolides",
    "n": "Clarithromycin/azithromycin",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": {
        "q": "H. influenzae only"
      },
      "ngon": {
        "q": "Azithromycin only"
      },
      "myco": 1,
      "legion": 1,
      "chlam": {
        "q": "Azithromycin only"
      }
    }
  },
  {
    "c": "Tetracyclines",
    "n": "Tetracycline/doxycycline",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "camrsa": 1,
      "gnb": {
        "q": "H. influenzae only"
      },
      "pepto": 1,
      "myco": 1,
      "legion": 1,
      "chlam": 1
    }
  },
  {
    "c": "Tetracyclines",
    "n": "Tigecycline",
    "cov": {
      "strep": 1,
      "entero": 1,
      "sepi": 1,
      "mssa": 1,
      "camrsa": 1,
      "hamrsa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": {
        "q": "Proteus, Acinetobacter: check local data"
      },
      "esbl": 1,
      "cre": 1,
      "pepto": 1,
      "bact": 1,
      "myco": 1,
      "legion": 1
    }
  },
  {
    "c": "Fluoroquinolones",
    "n": "Ciprofloxacin/norfloxacin",
    "tag": "Norfloxacin: bladder infections only",
    "cov": {
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "cre": 1,
      "pseudo": 1,
      "nmen": 1,
      "legion": {
        "q": "Ciprofloxacin only"
      }
    }
  },
  {
    "c": "Fluoroquinolones",
    "n": "Levofloxacin/moxifloxacin",
    "cov": {
      "strep": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "pepto": 1,
      "bact": {
        "q": "Moxifloxacin only"
      },
      "myco": 1,
      "legion": 1
    }
  },
  {
    "c": "Aminoglycosides",
    "n": "Gentamicin/tobramycin/amikacin",
    "cov": {
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "cre": 1,
      "pseudo": 1
    }
  },
  {
    "c": "Polymyxins",
    "n": "Colistin/polymyxin B",
    "cov": {
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "pseudo": 1
    }
  },
  {
    "c": "Lincosamides",
    "n": "Clindamycin",
    "cov": {
      "strep": 1,
      "sepi": {
        "q": "Often under 40% active"
      },
      "mssa": 1,
      "camrsa": 1,
      "pepto": 1,
      "bact": 1
    }
  },
  {
    "c": "Glycopeptides",
    "n": "Vancomycin/daptomycin",
    "cov": {
      "strep": 1,
      "entero": 1,
      "sepi": 1,
      "mssa": 1,
      "camrsa": 1,
      "hamrsa": 1,
      "pepto": 1,
      "cdiff": {
        "q": "Oral vancomycin only"
      }
    }
  },
  {
    "c": "Oxazolidinones",
    "n": "Linezolid/tedizolid",
    "cov": {
      "strep": 1,
      "entero": 1,
      "sepi": 1,
      "mssa": 1,
      "camrsa": 1,
      "hamrsa": 1,
      "pepto": 1
    }
  },
  {
    "c": "Other",
    "n": "Trimethoprim-sulfamethoxazole",
    "cov": {
      "mssa": 1,
      "camrsa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1
    }
  },
  {
    "c": "Other",
    "n": "Chloramphenicol",
    "cov": {
      "strep": 1,
      "gnb": 1,
      "gnbbl": 1,
      "nmen": 1,
      "ngon": 1,
      "pepto": 1,
      "bact": 1
    }
  },
  {
    "c": "Other",
    "n": "Metronidazole",
    "cov": {
      "pepto": 1,
      "bact": 1,
      "cdiff": 1
    }
  },
  {
    "c": "Other",
    "n": "Nitrofurantoin/fosfomycin",
    "cov": {
      "entero": {
        "q": "E. faecalis only; bladder only"
      },
      "gnb": {
        "q": "Bladder infections only"
      },
      "gnbbl": {
        "q": "Bladder infections only"
      },
      "esbl": {
        "q": "Bladder infections only"
      }
    }
  },
  {
    "c": "Other",
    "n": "Rifampin",
    "cov": {
      "sepi": 1,
      "mssa": 1,
      "camrsa": 1,
      "hamrsa": 1,
      "nmen": 1
    }
  },
  {
    "c": "Other",
    "n": "Fidaxomicin",
    "cov": {
      "cdiff": 1
    }
  }
];

export const DRUGS_2026 = [
  {
    "c": "Penicillins",
    "n": "Penicillin V/G",
    "cov": {
      "strep": 1,
      "entero": 1,
      "nmen": {
        "q": "IV penicillin G"
      },
      "pepto": 1,
      "listeria": {
        "q": "IV penicillin G: recommended option"
      },
      "tpall": {
        "q": "Benzathine penicillin G: first line; IV aqueous penicillin G for neurosyphilis"
      }
    },
    "chg": {
      "listeria": {
        "t": "Added organism: IV penicillin G: recommended option",
        "src": "MEN04",
        "act": "new"
      },
      "tpall": {
        "t": "Added organism: Benzathine penicillin G: first line; IV aqueous penicillin G for neurosyphilis",
        "src": "CDC",
        "act": "new"
      }
    }
  },
  {
    "c": "Penicillins",
    "n": "Amoxicillin/ampicillin",
    "cov": {
      "strep": 1,
      "entero": 1,
      "gnb": 1,
      "nmen": {
        "q": "IV ampicillin"
      },
      "pepto": 1,
      "listeria": {
        "q": "Ampicillin: recommended; CDC adds gentamicin"
      },
      "chlam": {
        "q": "Amoxicillin 7 days: alternative in pregnancy"
      }
    },
    "chg": {
      "listeria": {
        "t": "Added organism: Ampicillin: recommended; CDC adds gentamicin",
        "src": "MEN04",
        "act": "new"
      },
      "chlam": {
        "t": "Added organism: Amoxicillin 7 days: alternative in pregnancy",
        "src": "CDC",
        "act": "new"
      }
    }
  },
  {
    "c": "Penicillins",
    "n": "Cloxacillin",
    "cov": {
      "sepi": {
        "q": "Often under 40% active"
      },
      "mssa": 1
    },
    "chg": {}
  },
  {
    "c": "Penicillins",
    "n": "Amoxicillin-clavulanate",
    "cov": {
      "strep": 1,
      "entero": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "pepto": 1
    },
    "chg": {
      "space": {
        "t": "Removed: AmpC organisms (Enterobacter, C. freundii) are intrinsically resistant",
        "src": "IDSA",
        "act": "remove"
      }
    }
  },
  {
    "c": "Penicillins",
    "n": "Piperacillin-tazobactam",
    "cov": {
      "strep": 1,
      "entero": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": {
        "q": "Avoid in invasive infections by moderate-risk AmpC organisms"
      },
      "esbl": {
        "q": "Not for ESBL outside the urinary tract; cUTI only if not critically ill and no bacteraemia"
      },
      "pseudo": 1,
      "pepto": 1,
      "bact": 1
    },
    "chg": {
      "space": {
        "t": "Avoid in invasive infections by moderate-risk AmpC organisms",
        "src": "IDSA",
        "act": "set"
      },
      "esbl": {
        "t": "Not for ESBL outside the urinary tract; cUTI only if not critically ill and no bacteraemia",
        "src": "IDSA",
        "act": "set"
      }
    }
  },
  {
    "c": "Penicillins",
    "n": "Ampicillin-sulbactam (high-dose)",
    "src": "SPC",
    "why": "Added to the chart (FDA-labelled spectrum) so its CRAB role can be shown",
    "cov": {
      "strep": 1,
      "entero": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "bact": {
        "q": "Active, but not recommended for intra-abdominal infection (E. coli resistance)"
      },
      "crab": {
        "q": "High-dose, plus another agent (IDSA 2023/24); 2026: bridge until sulbactam-durlobactam"
      }
    },
    "chg": {
      "strep": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      },
      "entero": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      },
      "mssa": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      },
      "gnb": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      },
      "gnbbl": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      },
      "bact": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      },
      "crab": {
        "t": "Added organism: High-dose, plus another agent (IDSA 2023/24); 2026: bridge until sulbactam-durlobactam",
        "src": "IDSA24",
        "act": "new"
      }
    },
    "isNew": true
  },
  {
    "c": "Cephalosporins",
    "n": "Cefazolin/cephalexin",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": 1,
      "pepto": 1
    },
    "chg": {}
  },
  {
    "c": "Cephalosporins",
    "n": "Cefuroxime",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "pepto": 1
    },
    "chg": {}
  },
  {
    "c": "Cephalosporins",
    "n": "Cefoxitin",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "pepto": 1,
      "bact": 1
    },
    "chg": {}
  },
  {
    "c": "Cephalosporins",
    "n": "Ceftriaxone/cefotaxime",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "nmen": 1,
      "ngon": {
        "q": "First-line: ceftriaxone 500 mg IM single dose, monotherapy"
      },
      "pepto": 1,
      "typhi": {
        "q": "Ceftriaxone: travellers from most countries; not for XDR strains"
      },
      "tpall": {
        "q": "Ceftriaxone: penicillin-allergy alternative (incl. neurosyphilis)"
      },
      "entero": {
        "q": "Only with ampicillin, for E. faecalis endocarditis (AHA regimen)"
      }
    },
    "chg": {
      "ngon": {
        "t": "First-line: ceftriaxone 500 mg IM single dose, monotherapy",
        "src": "CDC",
        "act": "set"
      },
      "typhi": {
        "t": "Added organism: Ceftriaxone: travellers from most countries; not for XDR strains",
        "src": "TYPH",
        "act": "new"
      },
      "tpall": {
        "t": "Added organism: Ceftriaxone: penicillin-allergy alternative (incl. neurosyphilis)",
        "src": "CDC",
        "act": "new"
      },
      "entero": {
        "t": "Added organism: Only with ampicillin, for E. faecalis endocarditis (AHA regimen)",
        "src": "AHFS",
        "act": "new"
      }
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Cefixime",
    "cov": {
      "strep": 1,
      "gnb": 1,
      "gnbbl": 1,
      "ngon": {
        "q": "Alternative only if ceftriaxone unavailable; not for pharyngeal"
      }
    },
    "chg": {
      "ngon": {
        "t": "Alternative only if ceftriaxone unavailable; not for pharyngeal",
        "src": "CDC",
        "act": "set"
      }
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Ceftazidime",
    "cov": {
      "gnb": 1,
      "gnbbl": 1,
      "pseudo": 1
    },
    "chg": {}
  },
  {
    "c": "Cephalosporins",
    "n": "Ceftolozane-tazobactam",
    "cov": {
      "gnb": 1,
      "gnbbl": 1,
      "esbl": {
        "q": "Active, but reserve for carbapenem-resistant organisms"
      },
      "pseudo": 1,
      "pepto": 1,
      "bact": 1
    },
    "chg": {
      "space": {
        "t": "Removed: Not suggested for AmpC-producing Enterobacterales",
        "src": "IDSA",
        "act": "remove"
      },
      "esbl": {
        "t": "Active, but reserve for carbapenem-resistant organisms",
        "src": "IDSA",
        "act": "set"
      }
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Cefepime",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": {
        "q": "Preferred for moderate-risk AmpC organisms (cefepime MIC ≤8)"
      },
      "pseudo": 1,
      "pepto": 1
    },
    "chg": {
      "space": {
        "t": "Preferred for moderate-risk AmpC organisms (cefepime MIC ≤8)",
        "src": "IDSA",
        "act": "set"
      }
    }
  },
  {
    "c": "Cephalosporins",
    "n": "Ceftobiprole",
    "cov": {
      "strep": 1,
      "sepi": 1,
      "mssa": 1,
      "camrsa": 1,
      "hamrsa": 1,
      "gnb": 1
    },
    "chg": {}
  },
  {
    "c": "Carbapenems",
    "n": "Meropenem/imipenem/doripenem",
    "cov": {
      "strep": 1,
      "entero": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "pseudo": 1,
      "nmen": 1,
      "pepto": 1,
      "bact": 1,
      "listeria": {
        "q": "Meropenem: alternative"
      },
      "typhi": {
        "q": "Carbapenem: complicated illness or XDR (Pakistan/Iraq), ± azithromycin"
      }
    },
    "chg": {
      "listeria": {
        "t": "Added organism: Meropenem: alternative",
        "src": "MEN04",
        "act": "new"
      },
      "typhi": {
        "t": "Added organism: Carbapenem: complicated illness or XDR (Pakistan/Iraq), ± azithromycin",
        "src": "TYPH",
        "act": "new"
      }
    }
  },
  {
    "c": "Carbapenems",
    "n": "Ertapenem",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "pepto": 1,
      "bact": 1
    },
    "chg": {}
  },
  {
    "c": "Macrolides",
    "n": "Erythromycin",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "myco": 1,
      "legion": 1,
      "chlam": 1
    },
    "chg": {}
  },
  {
    "c": "Macrolides",
    "n": "Clarithromycin/azithromycin",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "gnb": {
        "q": "H. influenzae only"
      },
      "myco": 1,
      "legion": 1,
      "chlam": {
        "q": "Azithromycin: alternative; preferred in pregnancy"
      },
      "typhi": {
        "q": "Azithromycin: uncomplicated illness (incl. from Pakistan/Iraq)"
      }
    },
    "chg": {
      "ngon": {
        "t": "Removed as routine therapy (rising resistance); azithromycin 2 g is used only with gentamicin in cephalosporin allergy",
        "src": "CDC",
        "act": "remove"
      },
      "chlam": {
        "t": "Azithromycin: alternative; preferred in pregnancy",
        "src": "CDC",
        "act": "set"
      },
      "typhi": {
        "t": "Added organism: Azithromycin: uncomplicated illness (incl. from Pakistan/Iraq)",
        "src": "TYPH",
        "act": "new"
      }
    }
  },
  {
    "c": "Tetracyclines",
    "n": "Tetracycline/doxycycline",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "camrsa": 1,
      "gnb": {
        "q": "H. influenzae only"
      },
      "pepto": 1,
      "myco": 1,
      "legion": 1,
      "chlam": {
        "q": "Doxycycline 7 days is preferred"
      },
      "brucella": {
        "q": "Doxycycline + rifampin for ≥6 weeks: first line"
      },
      "tpall": {
        "q": "Doxycycline 14 days: penicillin allergy (not in pregnancy)"
      }
    },
    "chg": {
      "chlam": {
        "t": "Doxycycline 7 days is preferred",
        "src": "CDC",
        "act": "set"
      },
      "brucella": {
        "t": "Added organism: Doxycycline + rifampin for ≥6 weeks: first line",
        "src": "BRUC",
        "act": "new"
      },
      "tpall": {
        "t": "Added organism: Doxycycline 14 days: penicillin allergy (not in pregnancy)",
        "src": "CDC",
        "act": "new"
      }
    }
  },
  {
    "c": "Tetracyclines",
    "n": "Tigecycline",
    "cov": {
      "strep": 1,
      "entero": 1,
      "sepi": 1,
      "mssa": 1,
      "camrsa": 1,
      "hamrsa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": {
        "q": "Proteus, Acinetobacter: check local data"
      },
      "esbl": 1,
      "cre": {
        "q": "Alternative only; not for bloodstream or urinary infections"
      },
      "pepto": 1,
      "bact": 1,
      "myco": 1,
      "legion": 1,
      "steno": {
        "q": "Combination component; minocycline favoured (IDSA 2023/24)"
      },
      "crab": {
        "q": "Combination partner (IDSA 2023/24); bridge only"
      }
    },
    "chg": {
      "cre": {
        "t": "Alternative only; not for bloodstream or urinary infections",
        "src": "IDSA",
        "act": "set"
      },
      "steno": {
        "t": "Added organism: Combination component; minocycline favoured (IDSA 2023/24)",
        "src": "IDSA24",
        "act": "new"
      },
      "crab": {
        "t": "Added organism: Combination partner (IDSA 2023/24); bridge only",
        "src": "IDSA24",
        "act": "new"
      }
    }
  },
  {
    "c": "Tetracyclines",
    "n": "Minocycline (high-dose)",
    "src": "AHFS",
    "why": "Added to the chart so its S. maltophilia and CRAB roles can be shown",
    "cov": {
      "myco": 1,
      "chlam": 1,
      "steno": {
        "q": "Combination component, favoured over tigecycline (IDSA 2023/24)"
      },
      "crab": {
        "q": "Combination partner (IDSA 2023/24); bridge only"
      }
    },
    "chg": {
      "myco": {
        "t": "New agent",
        "src": "AHFS",
        "act": "new"
      },
      "chlam": {
        "t": "New agent",
        "src": "AHFS",
        "act": "new"
      },
      "steno": {
        "t": "Added organism: Combination component, favoured over tigecycline (IDSA 2023/24)",
        "src": "IDSA24",
        "act": "new"
      },
      "crab": {
        "t": "Added organism: Combination partner (IDSA 2023/24); bridge only",
        "src": "IDSA24",
        "act": "new"
      }
    },
    "isNew": true
  },
  {
    "c": "Fluoroquinolones",
    "n": "Ciprofloxacin/norfloxacin",
    "tag": "Norfloxacin: bladder infections only",
    "cov": {
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "cre": {
        "q": "Only if susceptible (fewer than 20% of CRE are)"
      },
      "pseudo": 1,
      "nmen": 1,
      "legion": {
        "q": "Ciprofloxacin only"
      }
    },
    "chg": {
      "cre": {
        "t": "Only if susceptible (fewer than 20% of CRE are)",
        "src": "IDSA",
        "act": "set"
      }
    }
  },
  {
    "c": "Fluoroquinolones",
    "n": "Levofloxacin/moxifloxacin",
    "cov": {
      "strep": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "pepto": 1,
      "bact": {
        "q": "Moxifloxacin only; avoid if a quinolone was used in the last 3 months"
      },
      "myco": 1,
      "legion": 1,
      "steno": {
        "q": "Levofloxacin: combination component (IDSA 2023/24)"
      },
      "chlam": {
        "q": "Levofloxacin 7 days: alternative"
      },
      "pseudo": {
        "q": "Levofloxacin only (labelled, e.g. 750 mg for nosocomial pneumonia)"
      }
    },
    "chg": {
      "bact": {
        "t": "Moxifloxacin only; avoid if a quinolone was used in the last 3 months",
        "src": "IAI",
        "act": "set"
      },
      "steno": {
        "t": "Added organism: Levofloxacin: combination component (IDSA 2023/24)",
        "src": "IDSA24",
        "act": "new"
      },
      "chlam": {
        "t": "Added organism: Levofloxacin 7 days: alternative",
        "src": "CDC",
        "act": "new"
      },
      "pseudo": {
        "t": "Added organism: Levofloxacin only (labelled, e.g. 750 mg for nosocomial pneumonia)",
        "src": "FDA_FQ",
        "act": "new"
      }
    }
  },
  {
    "c": "Aminoglycosides",
    "n": "Gentamicin/tobramycin/amikacin",
    "cov": {
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "cre": {
        "q": "Mainly urinary infections, if susceptible"
      },
      "pseudo": 1,
      "brucella": {
        "q": "Gentamicin (or streptomycin) with doxycycline: alternative"
      },
      "ngon": {
        "q": "Gentamicin 240 mg IM + azithromycin 2 g: if cephalosporin allergy"
      }
    },
    "chg": {
      "cre": {
        "t": "Mainly urinary infections, if susceptible",
        "src": "IDSA",
        "act": "set"
      },
      "brucella": {
        "t": "Added organism: Gentamicin (or streptomycin) with doxycycline: alternative",
        "src": "BRUC",
        "act": "new"
      },
      "ngon": {
        "t": "Added organism: Gentamicin 240 mg IM + azithromycin 2 g: if cephalosporin allergy",
        "src": "CDC",
        "act": "new"
      }
    }
  },
  {
    "c": "Polymyxins",
    "n": "Colistin/polymyxin B",
    "cov": {
      "gnb": 1,
      "gnbbl": 1,
      "esbl": 1,
      "pseudo": 1,
      "crab": {
        "q": "Polymyxin B: combination partner (IDSA 2023/24); bridge only"
      },
      "cre": {
        "q": "Colistin: alternative for uncomplicated CRE cystitis only"
      }
    },
    "chg": {
      "space": {
        "t": "Removed: most Proteus, Providencia and Serratia strains are resistant to colistin",
        "src": "AHFS",
        "act": "remove"
      },
      "crab": {
        "t": "Added organism: Polymyxin B: combination partner (IDSA 2023/24); bridge only",
        "src": "IDSA24",
        "act": "new"
      },
      "cre": {
        "t": "Added organism: Colistin: alternative for uncomplicated CRE cystitis only",
        "src": "IDSA24",
        "act": "new"
      }
    }
  },
  {
    "c": "Lincosamides",
    "n": "Clindamycin",
    "cov": {
      "strep": 1,
      "sepi": {
        "q": "Often under 40% active"
      },
      "mssa": 1,
      "camrsa": 1,
      "pepto": 1,
      "bact": {
        "q": "Not recommended: rising B. fragilis resistance"
      }
    },
    "chg": {
      "bact": {
        "t": "Not recommended: rising B. fragilis resistance",
        "src": "IAI",
        "act": "set"
      }
    }
  },
  {
    "c": "Glycopeptides",
    "n": "Vancomycin/daptomycin",
    "cov": {
      "strep": 1,
      "entero": 1,
      "sepi": 1,
      "mssa": 1,
      "camrsa": 1,
      "hamrsa": 1,
      "pepto": 1,
      "cdiff": {
        "q": "Oral vancomycin: alternative to fidaxomicin"
      },
      "vre": {
        "q": "Daptomycin: off-label only (not labelled for VRE); vancomycin inactive"
      }
    },
    "chg": {
      "cdiff": {
        "t": "Oral vancomycin: alternative to fidaxomicin",
        "src": "CDI",
        "act": "set"
      },
      "vre": {
        "t": "Added organism: Daptomycin: off-label only (not labelled for VRE); vancomycin inactive",
        "src": "DAP",
        "act": "new"
      }
    }
  },
  {
    "c": "Oxazolidinones",
    "n": "Linezolid/tedizolid",
    "cov": {
      "strep": 1,
      "entero": 1,
      "sepi": 1,
      "mssa": 1,
      "camrsa": 1,
      "hamrsa": 1,
      "pepto": 1,
      "vre": {
        "q": "Linezolid is labelled for VRE E. faecium"
      }
    },
    "chg": {
      "vre": {
        "t": "Added organism: Linezolid is labelled for VRE E. faecium",
        "src": "FDA_LZD",
        "act": "new"
      }
    }
  },
  {
    "c": "Other",
    "n": "Trimethoprim-sulfamethoxazole",
    "cov": {
      "mssa": 1,
      "camrsa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "space": 1,
      "esbl": 1,
      "listeria": {
        "q": "Alternative"
      },
      "steno": {
        "q": "Combination component (IDSA 2023/24); 2026 prefers cefiderocol monotherapy for invasive infection"
      },
      "brucella": {
        "q": "If contraindications (allergy, pregnancy) or RB51 strain"
      }
    },
    "chg": {
      "listeria": {
        "t": "Added organism: Alternative",
        "src": "MEN04",
        "act": "new"
      },
      "steno": {
        "t": "Added organism: Combination component (IDSA 2023/24); 2026 prefers cefiderocol monotherapy for invasive infection",
        "src": "IDSA24",
        "act": "new"
      },
      "brucella": {
        "t": "Added organism: If contraindications (allergy, pregnancy) or RB51 strain",
        "src": "BRUC",
        "act": "new"
      }
    }
  },
  {
    "c": "Other",
    "n": "Chloramphenicol",
    "cov": {
      "strep": 1,
      "gnb": 1,
      "gnbbl": 1,
      "nmen": 1,
      "pepto": 1,
      "bact": 1
    },
    "chg": {
      "ngon": {
        "t": "Removed: not a recommended gonorrhoea regimen",
        "src": "CDC",
        "act": "remove"
      }
    }
  },
  {
    "c": "Other",
    "n": "Metronidazole",
    "cov": {
      "pepto": 1,
      "bact": 1,
      "cdiff": {
        "q": "Only for non-severe CDI if fidaxomicin/vancomycin unavailable"
      }
    },
    "chg": {
      "cdiff": {
        "t": "Only for non-severe CDI if fidaxomicin/vancomycin unavailable",
        "src": "CDI",
        "act": "set"
      }
    }
  },
  {
    "c": "Other",
    "n": "Nitrofurantoin/fosfomycin",
    "cov": {
      "entero": {
        "q": "E. faecalis only; bladder only"
      },
      "gnb": {
        "q": "Bladder infections only"
      },
      "gnbbl": {
        "q": "Bladder infections only"
      },
      "esbl": {
        "q": "Cystitis only; oral fosfomycin for E. coli only"
      }
    },
    "chg": {
      "esbl": {
        "t": "Cystitis only; oral fosfomycin for E. coli only",
        "src": "IDSA",
        "act": "set"
      }
    }
  },
  {
    "c": "Other",
    "n": "Rifampin",
    "cov": {
      "sepi": 1,
      "mssa": 1,
      "camrsa": 1,
      "hamrsa": 1,
      "nmen": 1,
      "brucella": {
        "q": "With doxycycline (not for the RB51 strain)"
      }
    },
    "chg": {
      "brucella": {
        "t": "Added organism: With doxycycline (not for the RB51 strain)",
        "src": "BRUC",
        "act": "new"
      }
    }
  },
  {
    "c": "Other",
    "n": "Fidaxomicin",
    "cov": {
      "cdiff": {
        "q": "Preferred first-line for initial and recurrent CDI"
      }
    },
    "chg": {
      "cdiff": {
        "t": "Preferred first-line for initial and recurrent CDI",
        "src": "CDI",
        "act": "set"
      }
    }
  },
  {
    "c": "Monobactams",
    "n": "Aztreonam",
    "src": "SPC",
    "why": "Added to the chart: key anti-Pseudomonas agent and an option in β-lactam allergy",
    "cov": {
      "gnb": 1,
      "gnbbl": 1,
      "pseudo": 1
    },
    "chg": {
      "gnb": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      },
      "gnbbl": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      },
      "pseudo": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      }
    },
    "isNew": true
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Ceftazidime-avibactam",
    "src": "IDSA",
    "cov": {
      "space": {
        "q": "Active; reserve for carbapenem resistance"
      },
      "esbl": {
        "q": "Active; reserve for carbapenem resistance"
      },
      "cre": {
        "q": "Preferred for KPC and OXA-48-like; not active vs NDM"
      },
      "pseudo": {
        "q": "For difficult-to-treat strains"
      }
    },
    "chg": {
      "space": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      },
      "esbl": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      },
      "cre": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      },
      "pseudo": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      }
    },
    "isNew": true
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Meropenem-vaborbactam",
    "src": "IDSA",
    "cov": {
      "esbl": {
        "q": "Active; reserve for carbapenem resistance"
      },
      "cre": {
        "q": "Preferred for KPC; not active vs NDM"
      }
    },
    "chg": {
      "esbl": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      },
      "cre": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      }
    },
    "isNew": true
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Imipenem-relebactam",
    "src": "IDSA",
    "cov": {
      "esbl": {
        "q": "Active; reserve for carbapenem resistance"
      },
      "cre": {
        "q": "Preferred for KPC; not active vs NDM"
      },
      "pseudo": {
        "q": "For difficult-to-treat strains"
      }
    },
    "chg": {
      "esbl": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      },
      "cre": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      },
      "pseudo": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      }
    },
    "isNew": true
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Aztreonam-avibactam",
    "src": "IDSA",
    "cov": {
      "cre": {
        "q": "Preferred for NDM"
      },
      "steno": {
        "q": "Alternative, preferably with a second agent"
      }
    },
    "chg": {
      "cre": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      },
      "steno": {
        "t": "Added organism: Alternative, preferably with a second agent",
        "src": "IDSA",
        "act": "new"
      }
    },
    "isNew": true
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Cefiderocol",
    "src": "IDSA",
    "cov": {
      "cre": {
        "q": "Preferred for NDM; alternative for KPC"
      },
      "pseudo": {
        "q": "For difficult-to-treat strains"
      },
      "steno": {
        "q": "Preferred for invasive infection"
      },
      "crab": {
        "q": "Bridge only until sulbactam-durlobactam is available"
      }
    },
    "chg": {
      "cre": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      },
      "pseudo": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      },
      "steno": {
        "t": "Added organism: Preferred for invasive infection",
        "src": "IDSA",
        "act": "new"
      },
      "crab": {
        "t": "Added organism: Bridge only until sulbactam-durlobactam is available",
        "src": "IDSA",
        "act": "new"
      }
    },
    "isNew": true
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Cefepime-enmetazobactam",
    "src": "IDSA",
    "cov": {
      "esbl": {
        "q": "Alternative outside urine; option for cUTI"
      }
    },
    "chg": {
      "esbl": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      }
    },
    "isNew": true
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Sulbactam-durlobactam",
    "src": "IDSA",
    "cov": {
      "crab": {
        "q": "Preferred, given with a carbapenem"
      }
    },
    "chg": {
      "crab": {
        "t": "Added organism: Preferred, given with a carbapenem",
        "src": "IDSA",
        "act": "new"
      }
    },
    "isNew": true
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Pivmecillinam (oral)",
    "src": "IDSA",
    "cov": {
      "esbl": {
        "q": "Cystitis only"
      }
    },
    "chg": {
      "esbl": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      }
    },
    "isNew": true
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Gepotidacin (oral)",
    "src": "IDSA",
    "cov": {
      "esbl": {
        "q": "Cystitis only"
      }
    },
    "chg": {
      "esbl": {
        "t": "New agent",
        "src": "IDSA",
        "act": "new"
      }
    },
    "isNew": true
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Ceftaroline",
    "src": "SPC",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "camrsa": {
        "q": "MRSA labelled for skin infections only, not pneumonia"
      },
      "hamrsa": {
        "q": "MRSA labelled for skin infections only, not pneumonia"
      },
      "gnb": 1
    },
    "chg": {
      "strep": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      },
      "mssa": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      },
      "camrsa": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      },
      "hamrsa": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      },
      "gnb": {
        "t": "New agent",
        "src": "SPC",
        "act": "new"
      }
    },
    "isNew": true
  }
];

export const GROUPS = {
  "bac": {
    "label": "Antibacterial",
    "noun": "antibiotic",
    "Noun": "Antibiotic",
    "plural": "antibiotics",
    "unit": "bacterial groups",
    "pick": "Pick a bacterium",
    "pickd": "Pick an antibiotic",
    "ph": "Meropenem",
    "hint": "carbapenem",
    "intro": "Tap a bacterium to see which antibiotics are active, or tap an antibiotic to see its spectrum. Colours follow the Gram stain: violet for Gram-positive, pink for Gram-negative."
  },
  "fun": {
    "label": "Antifungal",
    "noun": "antifungal",
    "Noun": "Antifungal",
    "plural": "antifungals",
    "unit": "fungal groups",
    "pick": "Pick a fungus",
    "pickd": "Pick an antifungal",
    "ph": "Voriconazole",
    "hint": "azole",
    "intro": "Tap a fungus to see which antifungals are recommended, or tap an antifungal to see where it is used. Green labels mark first-line choices; amber labels mark limits or specific uses.",
    "fams": [
      "yeast",
      "cryp",
      "mould",
      "pjp"
    ],
    "first": {
      "org": "calb",
      "drug": "Caspofungin / micafungin / anidulafungin"
    },
    "orgs": [
      {
        "id": "calb",
        "f": "yeast",
        "n": "Candida albicans",
        "sh": "C. albicans",
        "s": "Most common Candida species",
        "site": "Bloodstream, mucosa (oral, oesophageal, vaginal), urinary tract, abdomen",
        "note": "Candidaemia: start an echinocandin; step down to fluconazole (usually within 5–7 days) when stable, fluconazole-susceptible and repeat blood cultures are negative. Mucosal: clotrimazole troches or miconazole buccal tablets for mild oral thrush; oral fluconazole for moderate–severe oral and for oesophageal candidiasis; uncomplicated vaginal candidiasis: a topical azole or fluconazole 150 mg once. Symptomatic cystitis: fluconazole 200 mg daily for 2 weeks. Asymptomatic candiduria: no treatment unless high risk.",
        "r": [
          "IDSA_CAN"
        ]
      },
      {
        "id": "cgla",
        "f": "yeast",
        "n": "Candida glabrata",
        "sh": "C. glabrata",
        "s": "Now Nakaseomyces glabratus",
        "site": "Bloodstream, urinary tract, abdomen",
        "note": "Triazole resistance has risen so far that azoles cannot be relied on without susceptibility testing. Start an echinocandin; step down to fluconazole 800 mg daily or voriconazole only if the isolate is susceptible.",
        "r": [
          "IDSA_CAN",
          "AHFS"
        ]
      },
      {
        "id": "ckru",
        "f": "yeast",
        "n": "Candida krusei",
        "sh": "C. krusei",
        "s": "Now Pichia kudriavzevii",
        "site": "Bloodstream",
        "note": "Intrinsically resistant to fluconazole. Start an echinocandin; voriconazole is the recommended oral step-down.",
        "r": [
          "AHFS",
          "IDSA_CAN"
        ]
      },
      {
        "id": "cpar",
        "f": "yeast",
        "n": "Candida parapsilosis",
        "sh": "C. parapsilosis",
        "s": "",
        "site": "Bloodstream, intravascular catheters, neonates",
        "note": "Innately higher echinocandin MICs, so it may respond less well to echinocandins. Fluconazole is acceptable initial therapy in selected patients who are not critically ill.",
        "r": [
          "IDSA_CAN"
        ]
      },
      {
        "id": "caur",
        "f": "yeast",
        "n": "Candida auris",
        "sh": "C. auris",
        "s": "Now Candidozyma auris; multidrug-resistant",
        "site": "Bloodstream, wounds; spreads in hospitals",
        "note": "Echinocandins are first line (adults and children over 2 months). Use liposomal amphotericin B 5 mg/kg daily if the isolate is echinocandin-resistant. Echinocandin- and pan-resistant cases are increasing: test every clinical isolate. Do not treat C. auris found in urine or respiratory samples without clinical disease.",
        "r": [
          "CAURIS"
        ]
      },
      {
        "id": "cryp",
        "f": "cryp",
        "n": "Cryptococcus neoformans",
        "sh": "Cryptococcus",
        "s": "",
        "site": "Brain (meningitis), lungs, blood; HIV and transplant",
        "note": "Echinocandins are not active. WHO preferred induction for HIV-associated meningitis: single-dose liposomal amphotericin B 10 mg/kg plus 14 days of flucytosine 100 mg/kg/day and fluconazole 1200 mg/day; then fluconazole 800 mg daily for 8 weeks, then 200 mg daily.",
        "r": [
          "CRYPTO",
          "AHFS"
        ]
      },
      {
        "id": "asp",
        "f": "mould",
        "n": "Aspergillus spp.",
        "sh": "Aspergillus",
        "s": "A. fumigatus, A. flavus, A. terreus",
        "site": "Lungs, sinuses, brain; neutropenia, transplant, ICU",
        "note": "Voriconazole is first line; liposomal amphotericin B or isavuconazole are alternatives. Echinocandins for salvage, or combined with voriconazole in selected patients — not as primary monotherapy. Posaconazole for prophylaxis in prolonged high-risk neutropenia. Azole TDM is recommended.",
        "r": [
          "ASP16"
        ]
      },
      {
        "id": "muc",
        "f": "mould",
        "n": "Mucorales",
        "sh": "Mucorales",
        "s": "Rhizopus, Mucor, Lichtheimia",
        "site": "Sinuses, orbit, brain, lungs; diabetic ketoacidosis, neutropenia",
        "note": "Liposomal amphotericin B 5–10 mg/kg/day plus early complete surgery. Isavuconazole (moderate support) or posaconazole tablets for first line when amphotericin is unsuitable; both are strongly supported for salvage and oral step-down. Echinocandins are not active.",
        "r": [
          "MUC19",
          "AHFS"
        ]
      },
      {
        "id": "fus",
        "f": "mould",
        "n": "Fusarium spp.",
        "sh": "Fusarium",
        "s": "",
        "site": "Disseminated in neutropenia; skin, eye",
        "note": "Voriconazole or a lipid amphotericin B formulation, often combined at first with later step-down. Posaconazole and isavuconazole have only a marginal (salvage) recommendation. Susceptibility testing is not standardised and high MICs are common.",
        "r": [
          "RAREM"
        ]
      },
      {
        "id": "pjp",
        "f": "pjp",
        "n": "Pneumocystis jirovecii",
        "sh": "Pneumocystis (PJP)",
        "s": "A fungus, but treated with TMP-SMX rather than antifungals",
        "site": "Lungs; HIV with low CD4, transplant, immunosuppression",
        "note": "TMP-SMX is preferred for treatment (21 days) and prophylaxis. In HIV, add corticosteroids if PaO₂ is under 70 mmHg on room air or the A–a gradient is 35 mmHg or more.",
        "r": [
          "OI"
        ]
      }
    ],
    "drugs": [
      {
        "c": "Azoles",
        "n": "Fluconazole",
        "cov": {
          "calb": {
            "p": "Step-down after echinocandin; first line for oesophageal and moderate–severe oral thrush; cystitis",
            "r": [
              "IDSA_CAN"
            ]
          },
          "cgla": {
            "q": "Only if susceptible (800 mg daily)",
            "r": [
              "IDSA_CAN"
            ]
          },
          "cpar": {
            "p": "Acceptable initial therapy if not critically ill",
            "r": [
              "IDSA_CAN"
            ]
          },
          "cryp": {
            "p": "With induction; then consolidation and maintenance",
            "r": [
              "CRYPTO"
            ]
          }
        }
      },
      {
        "c": "Azoles",
        "n": "Itraconazole",
        "cov": {
          "calb": {
            "q": "Fluconazole-refractory oral or oesophageal disease",
            "r": [
              "IDSA_CAN"
            ]
          },
          "asp": {
            "q": "Chronic cavitary aspergillosis and ABPA; absorption limits use",
            "r": [
              "ASP16"
            ]
          }
        }
      },
      {
        "c": "Azoles",
        "n": "Voriconazole",
        "cov": {
          "calb": {
            "q": "Ocular disease; refractory oesophageal disease",
            "r": [
              "IDSA_CAN"
            ]
          },
          "cgla": {
            "q": "Step-down only if susceptible",
            "r": [
              "IDSA_CAN"
            ]
          },
          "ckru": {
            "p": "Oral step-down",
            "r": [
              "IDSA_CAN"
            ]
          },
          "cpar": {
            "r": [
              "AHFS"
            ]
          },
          "asp": {
            "p": "First line",
            "r": [
              "ASP16"
            ]
          },
          "fus": {
            "p": "First-line option (or with lipid amphotericin B)",
            "r": [
              "RAREM"
            ]
          }
        }
      },
      {
        "c": "Azoles",
        "n": "Posaconazole",
        "cov": {
          "calb": {
            "q": "Fluconazole-refractory oropharyngeal disease",
            "r": [
              "IDSA_CAN"
            ]
          },
          "asp": {
            "p": "Prophylaxis in prolonged high-risk neutropenia",
            "r": [
              "ASP16"
            ]
          },
          "muc": {
            "q": "Salvage and step-down (strong); first line if amphotericin unsuitable",
            "r": [
              "MUC19"
            ]
          },
          "fus": {
            "q": "Salvage (marginal)",
            "r": [
              "RAREM"
            ]
          }
        }
      },
      {
        "c": "Azoles",
        "n": "Isavuconazole",
        "cov": {
          "asp": {
            "p": "Alternative to voriconazole",
            "r": [
              "ASP16"
            ]
          },
          "muc": {
            "p": "First line (moderate); salvage and step-down (strong)",
            "r": [
              "MUC19"
            ]
          }
        }
      },
      {
        "c": "Azoles",
        "n": "Clotrimazole troches / miconazole buccal",
        "cov": {
          "calb": {
            "q": "Mild oropharyngeal candidiasis",
            "r": [
              "IDSA_CAN"
            ]
          }
        }
      },
      {
        "c": "Polyenes",
        "n": "Amphotericin B (liposomal)",
        "cov": {
          "calb": {
            "q": "If echinocandins unsuitable; CNS/endocarditis ± flucytosine",
            "r": [
              "IDSA_CAN"
            ]
          },
          "cgla": {
            "q": "Alternative",
            "r": [
              "IDSA_CAN"
            ]
          },
          "ckru": {
            "q": "Alternative",
            "r": [
              "IDSA_CAN"
            ]
          },
          "cpar": {
            "q": "Alternative",
            "r": [
              "IDSA_CAN"
            ]
          },
          "caur": {
            "q": "If echinocandin-resistant (5 mg/kg)",
            "r": [
              "CAURIS"
            ]
          },
          "cryp": {
            "p": "Induction, with flucytosine",
            "r": [
              "CRYPTO"
            ]
          },
          "asp": {
            "q": "Alternative",
            "r": [
              "ASP16"
            ]
          },
          "muc": {
            "p": "First line, 5–10 mg/kg/day",
            "r": [
              "MUC19"
            ]
          },
          "fus": {
            "p": "First-line option (lipid formulation)",
            "r": [
              "RAREM"
            ]
          }
        }
      },
      {
        "c": "Echinocandins",
        "n": "Caspofungin / micafungin / anidulafungin",
        "cov": {
          "calb": {
            "p": "First line for candidaemia",
            "r": [
              "IDSA_CAN"
            ]
          },
          "cgla": {
            "p": "Initial therapy",
            "r": [
              "IDSA_CAN"
            ]
          },
          "ckru": {
            "p": "Initial therapy",
            "r": [
              "IDSA_CAN"
            ]
          },
          "cpar": {
            "q": "Higher MICs; may respond less well",
            "r": [
              "IDSA_CAN"
            ]
          },
          "caur": {
            "p": "First line",
            "r": [
              "CAURIS"
            ]
          },
          "asp": {
            "q": "Salvage, or combination in selected patients",
            "r": [
              "ASP16"
            ]
          }
        }
      },
      {
        "c": "Echinocandins",
        "n": "Rezafungin (once weekly)",
        "cov": {
          "calb": {
            "q": "Labelled when limited or no alternative options",
            "r": [
              "SPC"
            ]
          },
          "cgla": {
            "q": "Labelled when limited or no alternative options",
            "r": [
              "SPC"
            ]
          }
        }
      },
      {
        "c": "Other antifungals",
        "n": "Flucytosine",
        "cov": {
          "calb": {
            "q": "Combination only: CNS (with L-AmB) or endocarditis",
            "r": [
              "IDSA_CAN"
            ]
          },
          "cryp": {
            "p": "Induction, with amphotericin",
            "r": [
              "CRYPTO"
            ]
          }
        }
      },
      {
        "c": "Anti-Pneumocystis",
        "n": "Co-trimoxazole (TMP-SMX)",
        "cov": {
          "pjp": {
            "p": "Preferred: treatment and prophylaxis",
            "r": [
              "OI"
            ]
          }
        }
      },
      {
        "c": "Anti-Pneumocystis",
        "n": "Atovaquone",
        "cov": {
          "pjp": {
            "q": "Mild–moderate disease; prophylaxis",
            "r": [
              "OI"
            ]
          }
        }
      },
      {
        "c": "Anti-Pneumocystis",
        "n": "Pentamidine",
        "cov": {
          "pjp": {
            "q": "IV for moderate–severe disease; aerosolised for prophylaxis",
            "r": [
              "OI"
            ]
          }
        }
      },
      {
        "c": "Anti-Pneumocystis",
        "n": "Primaquine + clindamycin",
        "cov": {
          "pjp": {
            "q": "Alternative for treatment",
            "r": [
              "OI"
            ]
          }
        }
      },
      {
        "c": "Anti-Pneumocystis",
        "n": "Dapsone",
        "cov": {
          "pjp": {
            "q": "Prophylaxis; with trimethoprim for mild–moderate disease",
            "r": [
              "OI"
            ]
          }
        }
      }
    ],
    "pn": {
      "Fluconazole": {
        "po": [
          "Over 90% bioavailable compared with IV",
          [
            "SPC"
          ]
        ],
        "ix": [
          [
            "Moderate CYP2C9/3A4 and strong CYP2C19 inhibitor: raises warfarin effect and phenytoin levels; hypoglycaemia with sulfonylureas; QT prolongation",
            [
              "SPC"
            ]
          ]
        ],
        "note": [
          [
            "Give 50% of the dose if CrCl ≤50 mL/min (not on haemodialysis)",
            [
              "SPC"
            ]
          ],
          [
            "C. krusei is intrinsically resistant",
            [
              "AHFS"
            ]
          ]
        ]
      },
      "Itraconazole": {
        "warn": [
          [
            "Boxed warning: congestive heart failure; several CYP3A4 substrates are contraindicated",
            [
              "SPC"
            ]
          ]
        ],
        "mon": [
          [
            "TDM recommended — use the HMC laboratory target",
            [
              "ASP16"
            ]
          ]
        ],
        "note": [
          [
            "Oral solution and capsules are not interchangeable (higher exposure with solution)",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Voriconazole": {
        "po": [
          "About 96% bioavailable; take at least 1 h before or after a meal",
          [
            "AHFS",
            "SPC"
          ]
        ],
        "mon": [
          [
            "TDM: trough ≥1 mg/L; keep below 5.5 mg/L (below 4 mg/L in Asian patients)",
            [
              "JTDM"
            ]
          ],
          [
            "Visual effects incl. optic neuritis; hepatic reactions; skin SCC and melanoma, fluorosis and periostitis with long-term use; avoid direct sunlight",
            [
              "SPC"
            ]
          ]
        ],
        "ix": [
          [
            "Contraindicated with rifampicin, rifabutin, carbamazepine, long-acting barbiturates, high-dose ritonavir, efavirenz ≥400 mg, St John's wort, sirolimus, ergots and others",
            [
              "SPC"
            ]
          ],
          [
            "When starting: reduce tacrolimus to one-third and ciclosporin to one-half; monitor levels",
            [
              "SPC"
            ]
          ]
        ],
        "note": [
          [
            "IV vehicle (SBECD) accumulates if CrCl <50 mL/min",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Posaconazole": {
        "po": [
          "Delayed-release tablets: with or without food; oral suspension is not substitutable",
          [
            "SPC"
          ]
        ],
        "mon": [
          [
            "TDM recommended — use the HMC laboratory target",
            [
              "ASP16"
            ]
          ]
        ],
        "ix": [
          [
            "Contraindicated with sirolimus, ergots, CYP3A4-metabolised statins, pimozide and quinidine",
            [
              "SPC"
            ]
          ],
          [
            "Reduce tacrolimus to about one-third and ciclosporin to about three-quarters; QT prolongation",
            [
              "SPC"
            ]
          ]
        ],
        "note": [
          [
            "IV: SBECD accumulates if eGFR <50 mL/min/1.73 m²",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Isavuconazole": {
        "po": [
          "98% bioavailable; IV and oral interchangeable without a new loading dose",
          [
            "SPC"
          ]
        ],
        "ix": [
          [
            "Moderate CYP3A4 inhibitor: monitor tacrolimus, ciclosporin and sirolimus",
            [
              "SPC"
            ]
          ]
        ],
        "note": [
          [
            "Shortens QTc: contraindicated in familial short-QT syndrome",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Amphotericin B (liposomal)": {
        "warn": [
          [
            "Not interchangeable mg-for-mg with other amphotericin B products. Conventional amphotericin B overdose can cause fatal cardiac or cardiopulmonary arrest — verify product and dose (conventional: never above 1.5 mg/kg/day)",
            [
              "SPC"
            ]
          ]
        ],
        "mon": [
          [
            "Renal, hepatic and haematological function; electrolytes, especially magnesium and potassium; anaphylaxis can occur",
            [
              "SPC"
            ]
          ]
        ],
        "note": [
          [
            "Reconstitute with sterile water; dilute in 5% dextrose — never saline",
            [
              "SPC"
            ]
          ],
          [
            "Labelled doses 3–6 mg/kg/day; the mucormycosis guideline uses 5–10 mg/kg/day",
            [
              "SPC",
              "MUC19"
            ]
          ]
        ]
      },
      "Caspofungin / micafungin / anidulafungin": {
        "note": [
          [
            "IV only. Caspofungin: no renal adjustment; 35 mg daily in moderate hepatic impairment",
            [
              "SPC"
            ]
          ],
          [
            "Do not reach therapeutic levels in eye, CNS or urine",
            [
              "IDSA_CAN"
            ]
          ],
          [
            "Not active against Cryptococcus, Fusarium or Mucorales",
            [
              "AHFS"
            ]
          ]
        ]
      },
      "Rezafungin (once weekly)": {
        "note": [
          [
            "400 mg IV in week 1, then 200 mg weekly; safety not established beyond 4 doses",
            [
              "SPC"
            ]
          ],
          [
            "Labelled from age 12 for candidaemia/invasive candidiasis when alternatives are limited or absent",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Flucytosine": {
        "warn": [
          [
            "Boxed warning: extreme caution in renal impairment; close haematological, renal and hepatic monitoring",
            [
              "SPC"
            ]
          ]
        ],
        "mon": [
          [
            "Prolonged levels above 100 mcg/mL are linked to toxicity",
            [
              "SPC"
            ]
          ]
        ],
        "note": [
          [
            "Use with amphotericin B — resistance emerges when used alone",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Co-trimoxazole (TMP-SMX)": {
        "mon": [
          [
            "High-dose trimethoprim raises potassium; frequent blood counts and chemistry; stop at the first rash",
            [
              "SPC"
            ]
          ]
        ],
        "note": [
          [
            "PJP: trimethoprim 15–20 mg/kg/day in 3 divided doses (oral for mild–moderate) for 21 days",
            [
              "OI"
            ]
          ]
        ]
      },
      "Atovaquone": {
        "po": [
          "Take with food — low levels without it may limit response",
          [
            "SPC"
          ]
        ]
      },
      "Pentamidine": {
        "mon": [
          [
            "Infuse IV over 60–120 min. Fatal hypotension, hypoglycaemia, pancreatitis and arrhythmias reported; nephrotoxicity common; ECG before, during and after",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Primaquine + clindamycin": {
        "mon": [
          [
            "Check G6PD before primaquine",
            [
              "OI"
            ]
          ]
        ]
      },
      "Dapsone": {
        "mon": [
          [
            "Check G6PD before dapsone",
            [
              "OI"
            ]
          ]
        ]
      }
    }
  },
  "vir": {
    "label": "Antiviral",
    "noun": "antiviral",
    "Noun": "Antiviral",
    "plural": "antivirals",
    "unit": "virus groups",
    "pick": "Pick a virus",
    "pickd": "Pick an antiviral",
    "ph": "Oseltamivir",
    "hint": "influenza",
    "intro": "Tap a virus to see which antivirals are used, or tap an antiviral to see what it treats. Green labels mark first-line choices; amber labels mark limits or specific uses.",
    "fams": [
      "herp",
      "resp",
      "hep",
      "retro",
      "pox"
    ],
    "first": {
      "org": "cmv",
      "drug": "Ganciclovir / valganciclovir"
    },
    "orgs": [
      {
        "id": "hsv",
        "f": "herp",
        "n": "Herpes simplex (HSV-1, HSV-2)",
        "sh": "HSV",
        "s": "",
        "site": "Skin, mucosa, genital tract, eye, brain (encephalitis)",
        "note": "Aciclovir, valaciclovir and famciclovir are the treatment options. For aciclovir-resistant HSV, foscarnet is the treatment of choice; topical cidofovir 1% gel or imiquimod are alternatives for genital lesions.",
        "r": [
          "CDC"
        ]
      },
      {
        "id": "vzv",
        "f": "herp",
        "n": "Varicella-zoster (VZV)",
        "sh": "VZV",
        "s": "Chickenpox, shingles",
        "site": "Skin, eye, brain",
        "note": "Oral doses are higher than for HSV (aciclovir 800 mg five times daily for zoster vs 200 mg for initial genital herpes). IV aciclovir is labelled for zoster in immunocompromised patients.",
        "r": [
          "SPC"
        ]
      },
      {
        "id": "cmv",
        "f": "herp",
        "n": "Cytomegalovirus (CMV)",
        "sh": "CMV",
        "s": "",
        "site": "Transplant and HIV: retina, gut, lung, blood",
        "note": "First line: (val)ganciclovir or foscarnet. Letermovir is for prophylaxis only (stem-cell transplant; kidney transplant D+/R−). Maribavir is for refractory or resistant CMV; never combine it with (val)ganciclovir, and do not use it for retinitis or encephalitis.",
        "r": [
          "ASTCT",
          "SPC",
          "MBV"
        ]
      },
      {
        "id": "flu",
        "f": "resp",
        "n": "Influenza A and B",
        "sh": "Influenza",
        "s": "",
        "site": "Respiratory tract",
        "note": "Start oral or enteric oseltamivir as soon as possible in anyone admitted with suspected or confirmed influenza. Adding baloxavir to a neuraminidase inhibitor did not improve outcomes in hospitalised patients.",
        "r": [
          "FLU"
        ]
      },
      {
        "id": "cov",
        "f": "resp",
        "n": "SARS-CoV-2 (COVID-19)",
        "sh": "SARS-CoV-2",
        "s": "",
        "site": "Respiratory tract",
        "note": "Mild–moderate COVID-19 at high risk: nirmatrelvir/ritonavir (best within 5 days) or a 3-day IV remdesivir course (within 7 days). Molnupiravir only when nirmatrelvir/ritonavir cannot be used.",
        "r": [
          "COVID"
        ]
      },
      {
        "id": "rsv",
        "f": "resp",
        "n": "Respiratory syncytial virus (RSV)",
        "sh": "RSV",
        "s": "",
        "site": "Respiratory tract; infants, older adults, transplant",
        "note": "ECIL-4: aerosolised or systemic ribavirin (with IVIG) for RSV in allogeneic stem-cell transplant recipients or those at risk of progression to lower-tract disease. Prevention products are outside this chart.",
        "r": [
          "ECIL4"
        ]
      },
      {
        "id": "hbv",
        "f": "hep",
        "n": "Hepatitis B (HBV)",
        "sh": "HBV",
        "s": "",
        "site": "Liver",
        "note": "WHO 2024: tenofovir disoproxil (TDF) or entecavir preferred; TAF for renal or bone concerns; treatment eligibility widened. Test for HIV first — entecavir or lamivudine alone can select HIV resistance. Stopping therapy can cause severe hepatitis flares (boxed warning).",
        "r": [
          "HBV",
          "SPC"
        ]
      },
      {
        "id": "hcv",
        "f": "hep",
        "n": "Hepatitis C (HCV)",
        "sh": "HCV",
        "s": "",
        "site": "Liver",
        "note": "Simplified treatment (treatment-naive, no cirrhosis): glecaprevir/pibrentasvir 8 weeks with food, or sofosbuvir/velpatasvir 12 weeks. Test HBsAg before starting — DAAs carry a boxed warning for HBV reactivation.",
        "r": [
          "HCV",
          "SPC"
        ]
      },
      {
        "id": "hiv",
        "f": "retro",
        "n": "HIV-1",
        "sh": "HIV-1",
        "s": "",
        "site": "Systemic",
        "note": "Treated with combination ART chosen by the HIV team; recommended initial regimens are integrase-inhibitor based (e.g. bictegravir/TAF/FTC or dolutegravir-based). Check every new medicine for ART interactions.",
        "r": [
          "DHHS",
          "LIV"
        ]
      },
      {
        "id": "mpox",
        "f": "pox",
        "n": "Mpox",
        "sh": "Mpox",
        "s": "",
        "site": "Skin, mucosa",
        "note": "In the STOMP trial (clade II), tecovirimat did not improve lesion resolution (83% vs 84% with placebo by day 29) or pain.",
        "r": [
          "MPOX"
        ]
      }
    ],
    "drugs": [
      {
        "c": "Anti-herpes",
        "n": "Aciclovir / valaciclovir",
        "cov": {
          "hsv": {
            "p": "First line; IV for HSV encephalitis",
            "r": [
              "CDC",
              "SPC"
            ]
          },
          "vzv": {
            "p": "First line; higher oral dose than for HSV",
            "r": [
              "SPC"
            ]
          }
        }
      },
      {
        "c": "Anti-herpes",
        "n": "Famciclovir",
        "cov": {
          "hsv": {
            "r": [
              "CDC",
              "SPC"
            ]
          },
          "vzv": {
            "r": [
              "SPC"
            ]
          }
        }
      },
      {
        "c": "Anti-CMV",
        "n": "Ganciclovir / valganciclovir",
        "cov": {
          "cmv": {
            "p": "First line",
            "r": [
              "ASTCT"
            ]
          }
        }
      },
      {
        "c": "Anti-CMV",
        "n": "Foscarnet",
        "cov": {
          "cmv": {
            "q": "First-line alternative (HCT); labelled for CMV retinitis in AIDS",
            "r": [
              "ASTCT",
              "SPC"
            ]
          },
          "hsv": {
            "q": "Aciclovir-resistant HSV: treatment of choice",
            "r": [
              "CDC",
              "SPC"
            ]
          }
        }
      },
      {
        "c": "Anti-CMV",
        "n": "Cidofovir",
        "cov": {
          "cmv": {
            "q": "Labelled for CMV retinitis in AIDS",
            "r": [
              "SPC"
            ]
          },
          "hsv": {
            "q": "Topical 1% gel: alternative for aciclovir-resistant genital HSV",
            "r": [
              "CDC"
            ]
          }
        }
      },
      {
        "c": "Anti-CMV",
        "n": "Letermovir",
        "cov": {
          "cmv": {
            "q": "Prophylaxis only (HCT; kidney transplant D+/R−)",
            "r": [
              "SPC",
              "ASTCT"
            ]
          }
        }
      },
      {
        "c": "Anti-CMV",
        "n": "Maribavir",
        "cov": {
          "cmv": {
            "q": "Refractory/resistant post-transplant CMV; not for retinitis or encephalitis",
            "r": [
              "MBV",
              "ASTCT"
            ]
          }
        }
      },
      {
        "c": "Influenza",
        "n": "Oseltamivir",
        "cov": {
          "flu": {
            "p": "First line; all hospitalised patients",
            "r": [
              "FLU"
            ]
          }
        }
      },
      {
        "c": "Influenza",
        "n": "Zanamivir (inhaled)",
        "cov": {
          "flu": {
            "q": "Not in asthma or COPD",
            "r": [
              "FLU"
            ]
          }
        }
      },
      {
        "c": "Influenza",
        "n": "Peramivir (IV)",
        "cov": {
          "flu": {
            "q": "Single IV dose; not for prophylaxis",
            "r": [
              "FLU"
            ]
          }
        }
      },
      {
        "c": "Influenza",
        "n": "Baloxavir",
        "cov": {
          "flu": {
            "q": "Age ≥5; not recommended in pregnancy",
            "r": [
              "FLU"
            ]
          }
        }
      },
      {
        "c": "COVID-19",
        "n": "Nirmatrelvir/ritonavir",
        "cov": {
          "cov": {
            "p": "High-risk mild–moderate disease",
            "r": [
              "COVID"
            ]
          }
        }
      },
      {
        "c": "COVID-19",
        "n": "Remdesivir",
        "cov": {
          "cov": {
            "p": "3-day outpatient course, or hospitalised",
            "r": [
              "COVID"
            ]
          }
        }
      },
      {
        "c": "COVID-19",
        "n": "Molnupiravir",
        "cov": {
          "cov": {
            "q": "Only if nirmatrelvir/ritonavir cannot be used",
            "r": [
              "COVID"
            ]
          }
        }
      },
      {
        "c": "Hepatitis B / HIV",
        "n": "Tenofovir (TDF / TAF)",
        "cov": {
          "hbv": {
            "p": "Preferred (TDF; TAF for renal/bone concerns)",
            "r": [
              "HBV"
            ]
          },
          "hiv": {
            "q": "Part of combination ART only",
            "r": [
              "DHHS"
            ]
          }
        }
      },
      {
        "c": "Hepatitis B / HIV",
        "n": "Entecavir",
        "cov": {
          "hbv": {
            "p": "Preferred",
            "r": [
              "HBV"
            ]
          }
        }
      },
      {
        "c": "Hepatitis B / HIV",
        "n": "Lamivudine / emtricitabine",
        "cov": {
          "hbv": {
            "q": "Not alone: HBV resistance emerges (about 24% at 1 year)",
            "r": [
              "SPC"
            ]
          },
          "hiv": {
            "q": "Part of combination ART only",
            "r": [
              "DHHS"
            ]
          }
        }
      },
      {
        "c": "Hepatitis C",
        "n": "Sofosbuvir/velpatasvir",
        "cov": {
          "hcv": {
            "p": "Pangenotypic, 12 weeks",
            "r": [
              "HCV"
            ]
          }
        }
      },
      {
        "c": "Hepatitis C",
        "n": "Glecaprevir/pibrentasvir",
        "cov": {
          "hcv": {
            "p": "8 weeks with food; contraindicated in Child-Pugh B/C",
            "r": [
              "HCV",
              "SPC"
            ]
          }
        }
      },
      {
        "c": "HIV",
        "n": "Antiretroviral therapy (combination)",
        "cov": {
          "hiv": {
            "p": "Integrase-inhibitor-based initial regimen",
            "r": [
              "DHHS"
            ]
          }
        }
      },
      {
        "c": "Other antivirals",
        "n": "Ribavirin",
        "cov": {
          "rsv": {
            "q": "Allogeneic HCT or high-risk patients (ECIL-4)",
            "r": [
              "ECIL4"
            ]
          }
        }
      },
      {
        "c": "Other antivirals",
        "n": "Tecovirimat",
        "cov": {
          "mpox": {
            "q": "No benefit over placebo in clade II trial",
            "r": [
              "MPOX"
            ]
          }
        }
      }
    ],
    "pn": {
      "Aciclovir / valaciclovir": {
        "po": [
          "Valaciclovir gives aciclovir bioavailability of about 55% (oral aciclovir 10–20%)",
          [
            "SPC"
          ]
        ],
        "mon": [
          [
            "IV: infuse over at least 1 hour with adequate hydration (crystal nephropathy)",
            [
              "SPC"
            ]
          ],
          [
            "Encephalopathic changes (about 1%), more likely in renal impairment — adjust the interval by CrCl",
            [
              "SPC"
            ]
          ]
        ],
        "note": [
          [
            "Dose IV aciclovir on ideal body weight in obesity",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Famciclovir": {
        "po": [
          "Penciclovir bioavailability about 77%",
          [
            "SPC"
          ]
        ]
      },
      "Ganciclovir / valganciclovir": {
        "warn": [
          [
            "Boxed warning: haematological toxicity, impaired fertility, fetal toxicity, mutagenesis and carcinogenesis",
            [
              "SPC"
            ]
          ]
        ],
        "mon": [
          [
            "Frequent blood counts with differential and platelets; dose by renal function",
            [
              "SPC"
            ]
          ]
        ],
        "po": [
          "Valganciclovir: ganciclovir bioavailability about 59%; take with food",
          [
            "SPC"
          ]
        ],
        "note": [
          [
            "Handle as a hazardous drug (NIOSH Table 1)",
            [
              "NIOSH",
              "SPC"
            ]
          ]
        ]
      },
      "Foscarnet": {
        "warn": [
          [
            "Boxed warning: renal impairment is the major toxicity; seizures linked to mineral and electrolyte changes",
            [
              "SPC"
            ]
          ]
        ],
        "mon": [
          [
            "Hydrate (750–1000 mL before the first dose). Check creatinine, calcium (incl. ionised), magnesium, potassium and phosphorus 2–3 times weekly in induction, weekly in maintenance",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Cidofovir": {
        "warn": [
          [
            "Boxed warning: nephrotoxicity (renal failure after as few as 1–2 doses) and neutropenia",
            [
              "SPC"
            ]
          ]
        ],
        "mon": [
          [
            "Oral probenecid and IV normal saline with every dose; renal function within 48 h before each dose",
            [
              "SPC"
            ]
          ]
        ],
        "note": [
          [
            "Hazardous drug (NIOSH Table 1)",
            [
              "NIOSH"
            ]
          ]
        ]
      },
      "Letermovir": {
        "note": [
          [
            "No activity against HSV or VZV — aciclovir-based prophylaxis is recommended alongside",
            [
              "ASTCT"
            ]
          ],
          [
            "Reduce to 240 mg daily when given with ciclosporin",
            [
              "SPC"
            ]
          ]
        ],
        "ix": [
          [
            "Raises tacrolimus, ciclosporin and sirolimus levels (monitor); lowers voriconazole levels",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Maribavir": {
        "ix": [
          [
            "Antagonises ganciclovir and valganciclovir — do not co-administer",
            [
              "MBV"
            ]
          ],
          [
            "Raises tacrolimus, ciclosporin, sirolimus and everolimus levels — monitor closely",
            [
              "MBV"
            ]
          ]
        ],
        "note": [
          [
            "Taste disturbance in 46% of patients",
            [
              "MBV"
            ]
          ],
          [
            "Age ≥12 and weight ≥35 kg; CNS and retinal CMV were excluded from trials",
            [
              "MBV"
            ]
          ]
        ]
      },
      "Oseltamivir": {
        "note": [
          [
            "Start as soon as possible in all hospitalised patients",
            [
              "FLU"
            ]
          ],
          [
            "Adjust for CrCl 10–90 mL/min and in dialysis (see CDC table)",
            [
              "FLU"
            ]
          ]
        ]
      },
      "Zanamivir (inhaled)": {
        "note": [
          [
            "Contraindicated in underlying airways disease such as asthma or COPD (bronchospasm)",
            [
              "FLU"
            ]
          ]
        ]
      },
      "Peramivir (IV)": {
        "note": [
          [
            "Single IV dose; adjust if CrCl is under 50 mL/min; not for prophylaxis",
            [
              "FLU"
            ]
          ]
        ]
      },
      "Baloxavir": {
        "ix": [
          [
            "Avoid with dairy, calcium-fortified drinks, polyvalent-cation laxatives, antacids and calcium, iron, magnesium, selenium or zinc supplements",
            [
              "SPC"
            ]
          ]
        ],
        "note": [
          [
            "Not recommended in pregnancy or breastfeeding",
            [
              "FLU"
            ]
          ]
        ]
      },
      "Nirmatrelvir/ritonavir": {
        "ix": [
          [
            "Boxed warning: ritonavir is a strong CYP3A inhibitor — review every medicine (Liverpool checker) before prescribing",
            [
              "SPC",
              "LIV"
            ]
          ]
        ],
        "note": [
          [
            "eGFR 30–60: 150 mg/100 mg twice daily. eGFR <30 incl. haemodialysis: 300 mg/100 mg on day 1, then 150 mg/100 mg once daily (after dialysis)",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Remdesivir": {
        "note": [
          [
            "No dose adjustment in renal impairment, including dialysis (FDA, 2023)",
            [
              "REMR"
            ]
          ],
          [
            "Check LFTs before and during treatment",
            [
              "REMR"
            ]
          ]
        ]
      },
      "Molnupiravir": {
        "note": [
          [
            "Not recommended in pregnancy. Contraception: females until 4 days after the last dose; males for at least 3 months",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Tenofovir (TDF / TAF)": {
        "warn": [
          [
            "Boxed warning: severe hepatitis B flare on stopping",
            [
              "SPC"
            ]
          ]
        ],
        "mon": [
          [
            "TAF caused less fall in creatinine clearance and bone density than TDF",
            [
              "SPC"
            ]
          ]
        ],
        "note": [
          [
            "Test for HIV before starting for HBV",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Entecavir": {
        "warn": [
          [
            "Boxed warning: hepatitis flare on stopping; not for HIV/HBV co-infection without full ART (HIV resistance)",
            [
              "SPC"
            ]
          ]
        ],
        "po": [
          "Empty stomach: at least 2 h after and 2 h before food",
          [
            "SPC"
          ]
        ]
      },
      "Lamivudine / emtricitabine": {
        "warn": [
          [
            "Boxed warning: hepatitis B flare on stopping; HIV resistance if HIV is unrecognised",
            [
              "SPC"
            ]
          ]
        ],
        "note": [
          [
            "YMDD-mutant HBV emerges with monotherapy (about 24% by 52 weeks)",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Sofosbuvir/velpatasvir": {
        "warn": [
          [
            "Boxed warning: HBV reactivation — test HBsAg and anti-HBc first",
            [
              "SPC"
            ]
          ]
        ],
        "ix": [
          [
            "Amiodarone: serious symptomatic bradycardia — not recommended",
            [
              "SPC"
            ]
          ],
          [
            "Antacids: separate by 4 h. PPIs not recommended (if essential: take with food 4 h before omeprazole 20 mg)",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Glecaprevir/pibrentasvir": {
        "warn": [
          [
            "Boxed warning: HBV reactivation — test before treatment",
            [
              "SPC"
            ]
          ]
        ],
        "ix": [
          [
            "Contraindicated with atazanavir and rifampicin",
            [
              "SPC"
            ]
          ]
        ],
        "po": [
          "Take with food",
          [
            "SPC"
          ]
        ]
      },
      "Antiretroviral therapy (combination)": {
        "ix": [
          [
            "Integrase-inhibitor levels fall with polyvalent cations (calcium, magnesium, aluminium, iron, zinc); ritonavir and cobicistat are potent CYP3A4 inhibitors",
            [
              "DHHS",
              "LIV"
            ]
          ]
        ]
      },
      "Ribavirin": {
        "warn": [
          [
            "Contraindicated in pregnancy and in male partners of pregnant women; haemolytic anaemia is the main toxicity; hazardous drug (NIOSH Table 2)",
            [
              "AHFS",
              "NIOSH"
            ]
          ]
        ]
      },
      "Tecovirimat": {
        "po": [
          "Take within 30 minutes after a full moderate- or high-fat meal",
          [
            "SPC"
          ]
        ]
      }
    }
  },
  "myc": {
    "label": "TB & mycobacteria",
    "noun": "agent",
    "Noun": "Agent",
    "plural": "agents",
    "unit": "mycobacterial groups",
    "pick": "Pick a mycobacterium",
    "pickd": "Pick an agent",
    "ph": "Rifampicin",
    "hint": "rifamycin",
    "intro": "Tap a TB or NTM category to see the agents used, or tap an agent to see where it fits. TB is always treated with combination regimens — single-drug labels show each drug's role in those regimens.",
    "fams": [
      "tb",
      "ntm"
    ],
    "first": {
      "org": "tbds",
      "drug": "Rifampicin (R)"
    },
    "orgs": [
      {
        "id": "tbds",
        "f": "tb",
        "n": "TB disease, drug-susceptible",
        "sh": "DS-TB",
        "s": "",
        "site": "Lungs, lymph nodes, spine, brain, any organ",
        "note": "Standard 6 months: 2HRZE/4HR. A 4-month regimen (2HPMZ/2HPM: isoniazid, rifapentine, moxifloxacin, pyrazinamide) is an option for pulmonary TB from age 12 — not in pregnancy or breastfeeding, weight under 40 kg, CD4 under 100 or extrapulmonary TB.",
        "r": [
          "TBW"
        ]
      },
      {
        "id": "tbmdr",
        "f": "tb",
        "n": "TB, MDR/RR or pre-XDR",
        "sh": "MDR/RR-TB",
        "s": "Rifampicin-resistant",
        "site": "Lungs and other sites",
        "note": "WHO 2025: 6-month BPaLM (bedaquiline, pretomanid, linezolid 600 mg, moxifloxacin); BPaL if fluoroquinolone-resistant; BDLLfxC is an alternative 6-month regimen. Longer regimens are for extensive resistance, intolerance or complicated extrapulmonary TB.",
        "r": [
          "TBW"
        ]
      },
      {
        "id": "tbhr",
        "f": "tb",
        "n": "TB, isoniazid-resistant (rifampicin-susceptible)",
        "sh": "Hr-TB",
        "s": "",
        "site": "Lungs and other sites",
        "note": "WHO: rifampicin, ethambutol, pyrazinamide and levofloxacin for 6 months (confirm rifampicin susceptibility; test fluoroquinolone susceptibility). Do not add streptomycin or other injectables. Levofloxacin is the preferred fluoroquinolone.",
        "r": [
          "HRTB"
        ]
      },
      {
        "id": "ltbi",
        "f": "tb",
        "n": "TB infection (latent)",
        "sh": "TB infection",
        "s": "No active disease",
        "site": "Prevents progression to active TB",
        "note": "Preferred: 3HP (weekly isoniazid + rifapentine for 3 months), 4R (daily rifampicin for 4 months) or 3HR (daily isoniazid + rifampicin for 3 months). Alternatives: 6 or 9 months of isoniazid.",
        "r": [
          "LTBI"
        ]
      },
      {
        "id": "mac",
        "f": "ntm",
        "n": "Mycobacterium avium complex (MAC)",
        "sh": "MAC",
        "s": "",
        "site": "Lungs (bronchiectasis, COPD)",
        "note": "3-drug regimen: macrolide (azithromycin preferred) + ethambutol + rifamycin. Add IV amikacin (or streptomycin) for 2–3 months in cavitary, advanced or macrolide-resistant disease; add inhaled amikacin liposome if refractory after 6 months. Treat for at least 12 months after culture conversion.",
        "r": [
          "NTM"
        ]
      },
      {
        "id": "mabs",
        "f": "ntm",
        "n": "Mycobacterium abscessus",
        "sh": "M. abscessus",
        "s": "",
        "site": "Lungs (cystic fibrosis, bronchiectasis)",
        "note": "Use a macrolide only if there is no inducible (erm(41)) or mutational resistance. At least 3 active drugs guided by susceptibility testing, designed with experts. Parenteral options: amikacin, imipenem, cefoxitin, tigecycline; oral options: macrolides, linezolid, clofazimine.",
        "r": [
          "NTM"
        ]
      }
    ],
    "drugs": [
      {
        "c": "First-line TB",
        "n": "Isoniazid (H)",
        "cov": {
          "tbds": {
            "p": "2HRZE/4HR",
            "r": [
              "TBW"
            ]
          },
          "ltbi": {
            "p": "3HP or 3HR; 6–9H alternative",
            "r": [
              "LTBI"
            ]
          }
        }
      },
      {
        "c": "First-line TB",
        "n": "Rifampicin (R)",
        "cov": {
          "tbds": {
            "p": "2HRZE/4HR",
            "r": [
              "TBW"
            ]
          },
          "tbhr": {
            "p": "6 months with E, Z and levofloxacin",
            "r": [
              "HRTB"
            ]
          },
          "ltbi": {
            "p": "4R or 3HR",
            "r": [
              "LTBI"
            ]
          },
          "mac": {
            "r": [
              "NTM"
            ]
          }
        }
      },
      {
        "c": "First-line TB",
        "n": "Rifapentine (P)",
        "cov": {
          "tbds": {
            "q": "4-month HPMZ regimen, age ≥12",
            "r": [
              "TBW"
            ]
          },
          "ltbi": {
            "p": "3HP weekly",
            "r": [
              "LTBI"
            ]
          }
        }
      },
      {
        "c": "First-line TB",
        "n": "Rifabutin",
        "cov": {
          "tbds": {
            "q": "Replaces rifampicin with interacting drugs (e.g. HIV protease inhibitors)",
            "r": [
              "ATS16",
              "AHFS"
            ]
          },
          "mac": {
            "q": "Alternative rifamycin",
            "r": [
              "NTM"
            ]
          }
        }
      },
      {
        "c": "First-line TB",
        "n": "Pyrazinamide (Z)",
        "cov": {
          "tbds": {
            "p": "First 2 months",
            "r": [
              "TBW"
            ]
          },
          "tbhr": {
            "p": "6 months (Hr-TB regimen)",
            "r": [
              "HRTB"
            ]
          }
        }
      },
      {
        "c": "First-line TB",
        "n": "Ethambutol (E)",
        "cov": {
          "tbds": {
            "p": "First 2 months",
            "r": [
              "TBW"
            ]
          },
          "tbhr": {
            "p": "6 months (Hr-TB regimen)",
            "r": [
              "HRTB"
            ]
          },
          "mac": {
            "p": "Core drug",
            "r": [
              "NTM"
            ]
          }
        }
      },
      {
        "c": "MDR-TB / second-line",
        "n": "Bedaquiline",
        "cov": {
          "tbmdr": {
            "p": "In BPaLM, BPaL and BDLLfxC",
            "r": [
              "TBW"
            ]
          }
        }
      },
      {
        "c": "MDR-TB / second-line",
        "n": "Pretomanid",
        "cov": {
          "tbmdr": {
            "p": "Only within BPaLM or BPaL",
            "r": [
              "TBW"
            ]
          }
        }
      },
      {
        "c": "MDR-TB / second-line",
        "n": "Linezolid (for TB)",
        "cov": {
          "tbmdr": {
            "p": "600 mg in BPaLM/BPaL",
            "r": [
              "TBW"
            ]
          },
          "mabs": {
            "q": "Oral option",
            "r": [
              "NTM"
            ]
          }
        }
      },
      {
        "c": "MDR-TB / second-line",
        "n": "Moxifloxacin / levofloxacin",
        "cov": {
          "tbds": {
            "q": "Moxifloxacin in the 4-month HPMZ regimen",
            "r": [
              "TBW"
            ]
          },
          "tbhr": {
            "p": "Levofloxacin (preferred) for 6 months",
            "r": [
              "HRTB"
            ]
          },
          "tbmdr": {
            "p": "Moxifloxacin in BPaLM; levofloxacin in BDLLfxC",
            "r": [
              "TBW"
            ]
          }
        }
      },
      {
        "c": "MDR-TB / second-line",
        "n": "Delamanid",
        "cov": {
          "tbmdr": {
            "q": "In BDLLfxC (alternative 6-month regimen)",
            "r": [
              "TBW"
            ]
          }
        }
      },
      {
        "c": "MDR-TB / second-line",
        "n": "Clofazimine",
        "cov": {
          "tbmdr": {
            "q": "Option within BDLLfxC",
            "r": [
              "TBW"
            ]
          },
          "mac": {
            "q": "Companion to ethambutol instead of a rifamycin",
            "r": [
              "NTM"
            ]
          },
          "mabs": {
            "q": "Oral option",
            "r": [
              "NTM"
            ]
          }
        }
      },
      {
        "c": "NTM agents",
        "n": "Azithromycin / clarithromycin",
        "cov": {
          "mac": {
            "p": "Cornerstone; azithromycin preferred",
            "r": [
              "NTM"
            ]
          },
          "mabs": {
            "q": "Only if no inducible or mutational macrolide resistance",
            "r": [
              "NTM"
            ]
          }
        }
      },
      {
        "c": "NTM agents",
        "n": "Amikacin (IV or inhaled liposomal)",
        "cov": {
          "mac": {
            "q": "IV for cavitary/advanced disease; inhaled liposomal if refractory",
            "r": [
              "NTM"
            ]
          },
          "mabs": {
            "p": "Parenteral option",
            "r": [
              "NTM"
            ]
          }
        }
      },
      {
        "c": "NTM agents",
        "n": "Imipenem / cefoxitin (IV)",
        "cov": {
          "mabs": {
            "p": "Parenteral options",
            "r": [
              "NTM"
            ]
          }
        }
      }
    ],
    "pn": {
      "Isoniazid (H)": {
        "mon": [
          [
            "Hepatitis risk rises with age and daily alcohol: baseline LFTs and monthly review",
            [
              "AHFS"
            ]
          ]
        ],
        "note": [
          [
            "Give pyridoxine to people at risk of neuropathy (pregnancy, HIV, diabetes, alcohol use, malnutrition, chronic renal failure, older age)",
            [
              "ATS16"
            ]
          ]
        ]
      },
      "Rifampicin (R)": {
        "ix": [
          [
            "Enzyme inducer: lowers warfarin, azoles, many antiretrovirals, hormonal contraceptives, ciclosporin/tacrolimus and corticosteroids",
            [
              "AHFS"
            ]
          ]
        ],
        "mon": [
          [
            "ALT/AST before starting and every 2–4 weeks",
            [
              "AHFS"
            ]
          ]
        ],
        "note": [
          [
            "Reddish urine, sputum, sweat and tears; can permanently stain soft contact lenses",
            [
              "AHFS"
            ]
          ],
          [
            "Food reduces absorption by about 30%",
            [
              "AHFS"
            ]
          ]
        ]
      },
      "Rifabutin": {
        "ix": [
          [
            "Weaker enzyme inducer than rifampicin; clarithromycin and HIV protease inhibitors raise rifabutin levels (uveitis risk)",
            [
              "AHFS",
              "SPC"
            ]
          ]
        ]
      },
      "Pyrazinamide (Z)": {
        "mon": [
          [
            "Dose-related hepatotoxicity; hyperuricaemia expected — stop if gout develops",
            [
              "AHFS"
            ]
          ]
        ]
      },
      "Ethambutol (E)": {
        "mon": [
          [
            "Baseline eye examination; monthly visual acuity and colour testing if dose >15 mg/kg/day, beyond 2 months, or renal impairment",
            [
              "AHFS"
            ]
          ]
        ],
        "note": [
          [
            "Renal impairment: extend the dosing interval (e.g. 3 times weekly after haemodialysis)",
            [
              "AHFS"
            ]
          ]
        ]
      },
      "Bedaquiline": {
        "mon": [
          [
            "ECG before starting and at least at weeks 2, 12 and 24; stop if QTcF >500 ms. Extra QT risk with clofazimine and fluoroquinolones",
            [
              "AHFS"
            ]
          ]
        ],
        "po": [
          "Take with food (about 2-fold higher exposure)",
          [
            "AHFS"
          ]
        ]
      },
      "Pretomanid": {
        "mon": [
          [
            "LFTs at baseline, week 2, then monthly. Blood counts and visual symptoms for linezolid toxicity",
            [
              "AHFS"
            ]
          ]
        ],
        "note": [
          [
            "Labelled only with bedaquiline and linezolid",
            [
              "AHFS"
            ]
          ]
        ]
      },
      "Linezolid (for TB)": {
        "mon": [
          [
            "Weekly blood counts, especially beyond 2 weeks; peripheral and optic neuropathy mainly beyond 28 days",
            [
              "FDA_LZD"
            ]
          ]
        ],
        "ix": [
          [
            "Serotonergic drugs: serotonin syndrome risk",
            [
              "FDA_LZD"
            ]
          ]
        ]
      },
      "Moxifloxacin / levofloxacin": {
        "warn": [
          [
            "Boxed warning: tendinitis/rupture, peripheral neuropathy, CNS effects; avoid in myasthenia gravis. QT prolongation",
            [
              "FDA_FQ"
            ]
          ]
        ]
      },
      "Clofazimine": {
        "mon": [
          [
            "QT prolongation (additive with bedaquiline); stop if QTcF ≥500 ms. Orange-pink to brownish-black skin discoloration in 75–100%, reversing over months to years",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Azithromycin / clarithromycin": {
        "ix": [
          [
            "Clarithromycin is a strong CYP3A4 inhibitor (raises rifabutin; contraindicated with simvastatin and lovastatin) — azithromycin preferred for MAC",
            [
              "SPC",
              "NTM"
            ]
          ]
        ],
        "mon": [
          [
            "QT prolongation; hearing loss and tinnitus reported",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Amikacin (IV or inhaled liposomal)": {
        "warn": [
          [
            "Boxed warning: ototoxicity and nephrotoxicity — serial audiograms where feasible; monitor levels",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Imipenem / cefoxitin (IV)": {
        "ix": [
          [
            "Imipenem with valproate: not recommended",
            [
              "MHRA"
            ]
          ]
        ]
      }
    }
  },
  "par": {
    "label": "Antiparasitic",
    "noun": "antiparasitic",
    "Noun": "Antiparasitic",
    "plural": "antiparasitics",
    "unit": "parasite groups",
    "pick": "Pick a parasite",
    "pickd": "Pick an antiparasitic",
    "ph": "Artesunate",
    "hint": "antimalarial",
    "intro": "Tap a parasite to see which drugs are used, or tap a drug to see what it treats. Green labels mark first-line choices; amber labels mark limits or specific uses.",
    "fams": [
      "mal",
      "proto",
      "helm",
      "ecto"
    ],
    "first": {
      "org": "pfu",
      "drug": "Artemether-lumefantrine"
    },
    "orgs": [
      {
        "id": "pfu",
        "f": "mal",
        "n": "P. falciparum, uncomplicated",
        "sh": "Falciparum (uncomplicated)",
        "s": "",
        "site": "Blood",
        "note": "WHO: an ACT with 3 days of artemisinin. Artemether-lumefantrine is recommended in the first trimester of pregnancy. CDC (US) prefers artemether-lumefantrine, with atovaquone-proguanil second line.",
        "r": [
          "MAL",
          "CDCMAL"
        ]
      },
      {
        "id": "psev",
        "f": "mal",
        "n": "Severe malaria",
        "sh": "Severe malaria",
        "s": "Any species",
        "site": "Blood, brain, kidneys, lungs",
        "note": "IV or IM artesunate for at least 24 h and until oral therapy is tolerated, then a 3-day ACT. If artesunate is unavailable, artemether is preferred to quinine. After IV artesunate, check weekly for up to 4 weeks for delayed haemolysis.",
        "r": [
          "MAL",
          "CDCMAL"
        ]
      },
      {
        "id": "pviv",
        "f": "mal",
        "n": "P. vivax / P. ovale",
        "sh": "Vivax / ovale",
        "s": "",
        "site": "Blood, with dormant liver stages (relapse)",
        "note": "Blood stage: ACT, or chloroquine where susceptible. Relapse prevention after G6PD testing: primaquine 0.5 mg/kg/day for 14 days or 1 mg/kg/day for 7 days; tafenoquine only with G6PD activity ≥70% (WHO) — CDC also requires age ≥16. Neither drug in pregnancy.",
        "r": [
          "MAL",
          "CDCMAL"
        ]
      },
      {
        "id": "toxo",
        "f": "proto",
        "n": "Toxoplasma gondii",
        "sh": "Toxoplasma",
        "s": "",
        "site": "Brain (HIV), eye, congenital",
        "note": "Pyrimethamine + sulfadiazine + leucovorin is preferred; TMP-SMX is an alternative. TMP-SMX is the preferred primary prophylaxis (seropositive, CD4 under 100).",
        "r": [
          "OI"
        ]
      },
      {
        "id": "trich",
        "f": "proto",
        "n": "Trichomonas vaginalis",
        "sh": "Trichomonas",
        "s": "",
        "site": "Genital tract (STI)",
        "note": "Women: metronidazole 500 mg twice daily for 7 days. Men: metronidazole 2 g once. Alternative: tinidazole 2 g once (avoid in pregnancy). Metronidazole can be used in pregnancy.",
        "r": [
          "CDC"
        ]
      },
      {
        "id": "cryptos",
        "f": "proto",
        "n": "Cryptosporidium",
        "sh": "Cryptosporidium",
        "s": "",
        "site": "Gut (diarrhoea)",
        "note": "Nitazoxanide is labelled for C. parvum diarrhoea from age 1, but has not been shown effective in HIV-infected or immunodeficient patients.",
        "r": [
          "SPC"
        ]
      },
      {
        "id": "leish",
        "f": "proto",
        "n": "Leishmania (visceral)",
        "sh": "Visceral leishmaniasis",
        "s": "Kala-azar",
        "site": "Liver, spleen, bone marrow",
        "note": "Liposomal amphotericin B is FDA-approved first line (immunocompetent: 3 mg/kg on days 1–5, 14 and 21). Miltefosine is an oral option for L. donovani (age ≥12, weight ≥30 kg). Cutaneous leishmaniasis does not always need treatment — individualise with expert advice.",
        "r": [
          "LEISH",
          "SPC"
        ]
      },
      {
        "id": "giar",
        "f": "proto",
        "n": "Giardia duodenalis",
        "sh": "Giardia",
        "s": "",
        "site": "Small intestine (diarrhoea)",
        "note": "Options: tinidazole, nitazoxanide or metronidazole. Tinidazole and nitazoxanide are preferred in the HIV paediatric guideline; metronidazole is the alternative (not FDA-approved for giardiasis).",
        "r": [
          "YB",
          "OIPED"
        ]
      },
      {
        "id": "ehis",
        "f": "proto",
        "n": "Entamoeba histolytica",
        "sh": "Entamoeba",
        "s": "",
        "site": "Colon (dysentery), liver abscess",
        "note": "Treat with metronidazole or tinidazole, then a luminal agent (paromomycin or iodoquinol).",
        "r": [
          "YB"
        ]
      },
      {
        "id": "stro",
        "f": "helm",
        "n": "Strongyloides stercoralis",
        "sh": "Strongyloides",
        "s": "",
        "site": "Gut, skin; hyperinfection with steroids or HTLV-1",
        "note": "Ivermectin first line; albendazole is the alternative. Test people on, or about to start, corticosteroids or immunosuppressants, and those with HTLV-1. Ivermectin is contraindicated with Loa loa infection and in pregnancy.",
        "r": [
          "STRO"
        ]
      },
      {
        "id": "sth",
        "f": "helm",
        "n": "Roundworm, hookworm, pinworm, whipworm",
        "sh": "Intestinal worms",
        "s": "",
        "site": "Gut",
        "note": "Albendazole or mebendazole (ivermectin for ascariasis and whipworm). Pinworm: single dose repeated after 2 weeks, with strict household hand hygiene.",
        "r": [
          "STH",
          "PIN"
        ]
      },
      {
        "id": "schisto",
        "f": "helm",
        "n": "Schistosoma spp.",
        "sh": "Schistosomiasis",
        "s": "Bilharzia",
        "site": "Bladder, bowel, liver",
        "note": "Praziquantel 40 mg/kg/day in 2 doses for one day (S. mansoni, S. haematobium); 60 mg/kg/day in 3 doses for S. japonicum/mekongi. Treat at least 6–8 weeks after last freshwater exposure; a second dose 2–4 weeks later may be needed.",
        "r": [
          "SCHI"
        ]
      },
      {
        "id": "taenia",
        "f": "helm",
        "n": "Taenia (intestinal tapeworm)",
        "sh": "Intestinal tapeworm",
        "s": "",
        "site": "Gut",
        "note": "Praziquantel 5–10 mg/kg once. Alternatives: niclosamide 2 g once, or albendazole 400 mg daily for 3 days. Use praziquantel and albendazole cautiously if cysticercosis is possible (seizures reported).",
        "r": [
          "TAEN"
        ]
      },
      {
        "id": "echino",
        "f": "helm",
        "n": "Echinococcus (hydatid cyst)",
        "sh": "Hydatid cyst",
        "s": "Cystic echinococcosis",
        "site": "Liver, lung",
        "note": "Options: surgery, PAIR, albendazole 10–15 mg/kg/day (max 800 mg, in 2 doses) or mebendazole, or watch-and-wait, depending on the cyst. Alveolar echinococcosis: continuous benzimidazole for at least 2 years, with radical surgery where suitable.",
        "r": [
          "ECHI"
        ]
      },
      {
        "id": "cest",
        "f": "helm",
        "n": "Neurocysticercosis",
        "sh": "Neurocysticercosis",
        "s": "Taenia solium larvae",
        "site": "Brain",
        "note": "1–2 viable cysts: albendazole 10–14 days; more than 2: albendazole plus praziquantel. Start corticosteroids before antiparasitic drugs; antiepileptics if seizures. With untreated hydrocephalus or diffuse cerebral oedema, treat raised pressure only — no antiparasitic therapy.",
        "r": [
          "NCC"
        ]
      },
      {
        "id": "scab",
        "f": "ecto",
        "n": "Scabies",
        "sh": "Scabies",
        "s": "Sarcoptes scabiei",
        "site": "Skin",
        "note": "First line: permethrin 5% (neck down, wash off after 8–14 h; a second application about a week later may be needed) or oral ivermectin (2 doses 7–14 days apart). Crusted scabies needs oral and topical treatment together.",
        "r": [
          "SCAB"
        ]
      }
    ],
    "drugs": [
      {
        "c": "Antimalarials",
        "n": "Artemether-lumefantrine",
        "cov": {
          "pfu": {
            "p": "First-line ACT; first trimester",
            "r": [
              "MAL",
              "CDCMAL"
            ]
          },
          "pviv": {
            "p": "Blood stage (ACT)",
            "r": [
              "MAL"
            ]
          }
        }
      },
      {
        "c": "Antimalarials",
        "n": "Other ACTs (artesunate-amodiaquine, artesunate-mefloquine, DHA-piperaquine, artesunate-SP, artesunate-pyronaridine)",
        "cov": {
          "pfu": {
            "p": "WHO-recommended ACTs",
            "r": [
              "MAL"
            ]
          },
          "pviv": {
            "r": [
              "MAL"
            ]
          }
        }
      },
      {
        "c": "Antimalarials",
        "n": "Artesunate (IV / IM)",
        "cov": {
          "psev": {
            "p": "First line ≥24 h, then 3-day ACT",
            "r": [
              "MAL"
            ]
          }
        }
      },
      {
        "c": "Antimalarials",
        "n": "Quinine",
        "cov": {
          "psev": {
            "q": "Only if artesunate and artemether unavailable",
            "r": [
              "MAL"
            ]
          }
        }
      },
      {
        "c": "Antimalarials",
        "n": "Atovaquone-proguanil",
        "cov": {
          "pfu": {
            "q": "Second line if artemether-lumefantrine unavailable (CDC)",
            "r": [
              "CDCMAL"
            ]
          }
        }
      },
      {
        "c": "Antimalarials",
        "n": "Chloroquine",
        "cov": {
          "pviv": {
            "q": "Blood stage, only where chloroquine-susceptible",
            "r": [
              "MAL"
            ]
          }
        }
      },
      {
        "c": "Antimalarials",
        "n": "Primaquine",
        "cov": {
          "pviv": {
            "p": "Relapse prevention 7 or 14 days; G6PD test first",
            "r": [
              "MAL"
            ]
          },
          "pfu": {
            "q": "Single 0.25 mg/kg dose with ACT in low-transmission areas",
            "r": [
              "MAL"
            ]
          }
        }
      },
      {
        "c": "Antimalarials",
        "n": "Tafenoquine",
        "cov": {
          "pviv": {
            "q": "Alternative to primaquine; G6PD ≥70%",
            "r": [
              "MAL",
              "CDCMAL"
            ]
          }
        }
      },
      {
        "c": "Antiprotozoals",
        "n": "Pyrimethamine + sulfadiazine",
        "cov": {
          "toxo": {
            "p": "Preferred, with leucovorin",
            "r": [
              "OI"
            ]
          }
        }
      },
      {
        "c": "Antiprotozoals",
        "n": "Co-trimoxazole (TMP-SMX)",
        "cov": {
          "toxo": {
            "q": "Treatment alternative; preferred prophylaxis",
            "r": [
              "OI"
            ]
          }
        }
      },
      {
        "c": "Antiprotozoals",
        "n": "Metronidazole / tinidazole",
        "cov": {
          "trich": {
            "p": "Metronidazole first line; tinidazole alternative",
            "r": [
              "CDC"
            ]
          },
          "giar": {
            "p": "Tinidazole preferred; metronidazole alternative",
            "r": [
              "OIPED",
              "YB"
            ]
          },
          "ehis": {
            "p": "Then a luminal agent",
            "r": [
              "YB"
            ]
          }
        }
      },
      {
        "c": "Antiprotozoals",
        "n": "Nitazoxanide",
        "cov": {
          "giar": {
            "p": "Preferred option",
            "r": [
              "OIPED"
            ]
          },
          "cryptos": {
            "q": "Labelled; not shown effective in HIV/immunodeficiency",
            "r": [
              "SPC"
            ]
          }
        }
      },
      {
        "c": "Antiprotozoals",
        "n": "Amphotericin B (liposomal)",
        "cov": {
          "leish": {
            "p": "Visceral: FDA-approved first line",
            "r": [
              "LEISH",
              "SPC"
            ]
          }
        }
      },
      {
        "c": "Antiprotozoals",
        "n": "Miltefosine",
        "cov": {
          "leish": {
            "q": "Oral: L. donovani, age ≥12, ≥30 kg",
            "r": [
              "SPC",
              "LEISH"
            ]
          }
        }
      },
      {
        "c": "Antiprotozoals",
        "n": "Paromomycin",
        "cov": {
          "ehis": {
            "q": "Luminal agent after metronidazole/tinidazole",
            "r": [
              "YB"
            ]
          }
        }
      },
      {
        "c": "Anthelmintics",
        "n": "Ivermectin",
        "cov": {
          "stro": {
            "p": "First line",
            "r": [
              "STRO"
            ]
          },
          "scab": {
            "p": "Oral first-line option; with topical for crusted",
            "r": [
              "SCAB"
            ]
          },
          "sth": {
            "q": "Ascariasis, whipworm",
            "r": [
              "STH"
            ]
          }
        }
      },
      {
        "c": "Anthelmintics",
        "n": "Albendazole",
        "cov": {
          "sth": {
            "p": "First line",
            "r": [
              "STH",
              "PIN"
            ]
          },
          "echino": {
            "p": "10–15 mg/kg/day, alone or with surgery/PAIR",
            "r": [
              "ECHI"
            ]
          },
          "taenia": {
            "q": "Alternative: 400 mg daily for 3 days",
            "r": [
              "TAEN"
            ]
          },
          "cest": {
            "p": "1–2 cysts alone; >2 with praziquantel",
            "r": [
              "NCC"
            ]
          },
          "stro": {
            "q": "Alternative",
            "r": [
              "STRO"
            ]
          }
        }
      },
      {
        "c": "Anthelmintics",
        "n": "Mebendazole",
        "cov": {
          "sth": {
            "p": "First line",
            "r": [
              "STH",
              "PIN"
            ]
          },
          "echino": {
            "q": "Alternative to albendazole",
            "r": [
              "ECHI"
            ]
          }
        }
      },
      {
        "c": "Anthelmintics",
        "n": "Praziquantel",
        "cov": {
          "schisto": {
            "p": "First line: 40 mg/kg/day (60 mg/kg for S. japonicum)",
            "r": [
              "SCHI"
            ]
          },
          "taenia": {
            "p": "First line: 5–10 mg/kg once",
            "r": [
              "TAEN"
            ]
          },
          "cest": {
            "q": "With albendazole for >2 viable cysts",
            "r": [
              "NCC"
            ]
          }
        }
      },
      {
        "c": "Topical",
        "n": "Permethrin 5% cream",
        "cov": {
          "scab": {
            "p": "First line",
            "r": [
              "SCAB"
            ]
          }
        }
      }
    ],
    "pn": {
      "Artemether-lumefantrine": {
        "po": [
          "Take with food — fat greatly increases absorption",
          [
            "SPC"
          ]
        ],
        "mon": [
          [
            "Avoid in congenital QT prolongation or other QT-prolonging conditions",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Artesunate (IV / IM)": {
        "mon": [
          [
            "Check weekly for up to 4 weeks for delayed haemolysis",
            [
              "CDCMAL"
            ]
          ]
        ]
      },
      "Quinine": {
        "warn": [
          [
            "Boxed warning: serious haematological reactions when used for leg cramps — not for that use",
            [
              "SPC"
            ]
          ]
        ],
        "mon": [
          [
            "Hypoglycaemia (especially in pregnancy), QT prolongation, cinchonism",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Atovaquone-proguanil": {
        "po": [
          "Take with food or a milky drink",
          [
            "SPC"
          ]
        ]
      },
      "Chloroquine": {
        "mon": [
          [
            "QT prolongation; irreversible retinal damage (risk with >2.3 mg/kg/day or over 5 years)",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Primaquine": {
        "warn": [
          [
            "Test G6PD first (quantitative); not in pregnancy",
            [
              "MAL",
              "CDCMAL"
            ]
          ]
        ]
      },
      "Tafenoquine": {
        "warn": [
          [
            "G6PD activity ≥70% required (WHO); CDC: normal quantitative G6PD and age ≥16; not in pregnancy",
            [
              "MAL",
              "CDCMAL"
            ]
          ]
        ]
      },
      "Pyrimethamine + sulfadiazine": {
        "note": [
          [
            "Give leucovorin (folinic acid) with pyrimethamine",
            [
              "OI"
            ]
          ]
        ]
      },
      "Co-trimoxazole (TMP-SMX)": {
        "mon": [
          [
            "Frequent blood counts and chemistry; stop at the first rash",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Metronidazole / tinidazole": {
        "po": [
          "Metronidazole: IV and oral pharmacokinetics similar",
          [
            "AHFS"
          ]
        ],
        "ix": [
          [
            "Potentiates warfarin; avoid alcohol during and for 3 days after metronidazole",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Nitazoxanide": {
        "po": [
          "Take with food",
          [
            "SPC"
          ]
        ]
      },
      "Amphotericin B (liposomal)": {
        "note": [
          [
            "Visceral leishmaniasis (immunocompetent): 3 mg/kg on days 1–5, 14 and 21",
            [
              "LEISH",
              "SPC"
            ]
          ],
          [
            "Not interchangeable mg-for-mg with conventional amphotericin B",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Miltefosine": {
        "warn": [
          [
            "Boxed warning: embryo-fetal toxicity — pregnancy test first; contraception during and for 5 months after",
            [
              "SPC"
            ]
          ]
        ],
        "po": [
          "Take with meals; 28-day weight-based course",
          [
            "SPC"
          ]
        ],
        "mon": [
          [
            "Kidney and liver function",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Ivermectin": {
        "po": [
          "Label: empty stomach with water. CDC scabies guidance: take with food",
          [
            "SPC",
            "SCAB"
          ]
        ],
        "warn": [
          [
            "Heavy Loa loa infection: risk of serious or fatal encephalopathy — assess people from West/Central Africa first",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Albendazole": {
        "po": [
          "Take with food (a fatty meal increases absorption)",
          [
            "SPC"
          ]
        ],
        "mon": [
          [
            "Blood counts and transaminases at the start of each cycle and every 2 weeks; pregnancy test first; avoid in pregnancy",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Mebendazole": {
        "note": [
          [
            "Pinworm: repeat the dose after 2 weeks",
            [
              "PIN"
            ]
          ]
        ]
      },
      "Praziquantel": {
        "note": [
          [
            "Taeniasis: use cautiously if cysticercosis is possible (seizures reported)",
            [
              "TAEN"
            ]
          ]
        ],
        "ix": [
          [
            "Contraindicated with strong CYP3A inducers such as rifampicin",
            [
              "SPC"
            ]
          ]
        ],
        "warn": [
          [
            "Contraindicated in ocular cysticercosis",
            [
              "SPC"
            ]
          ]
        ]
      },
      "Permethrin 5% cream": {
        "note": [
          [
            "Apply from the neck down; wash off after 8–14 hours",
            [
              "SCAB"
            ]
          ]
        ]
      }
    }
  }
};

export const GROUP_ORDER = [
  "bac",
  "fun",
  "vir",
  "myc",
  "par"
];

export const SHORT_NAMES = {
  "typhi": "S. Typhi (enteric fever)",
  "brucella": "Brucella",
  "tpall": "T. pallidum (syphilis)",
  "vre": "VRE",
  "listeria": "Listeria",
  "steno": "Stenotrophomonas",
  "crab": "CRAB (Acinetobacter)",
  "strep": "Streptococci",
  "entero": "Enterococci",
  "sepi": "S. epidermidis",
  "mssa": "MSSA",
  "camrsa": "MRSA, community",
  "hamrsa": "MRSA, hospital",
  "gnb": "E. coli/Kleb/H. flu",
  "gnbbl": "Same, β-lactamase+",
  "space": "AmpC group (SPACE)",
  "esbl": "ESBL",
  "cre": "CRE",
  "pseudo": "Pseudomonas",
  "nmen": "N. meningitidis",
  "ngon": "N. gonorrhoeae",
  "pepto": "Peptostreptococcus",
  "bact": "Bacteroides",
  "cdiff": "C. difficile",
  "myco": "Mycoplasma/Chlamydophila",
  "legion": "Legionella",
  "chlam": "C. trachomatis"
};

export const SOURCES = {
  "IDSA": "IDSA Guidance on AMR Gram-negative infections, July 2026",
  "AHFS": "AHFS Drug Information monograph (ASHP)",
  "IDSA24": "IDSA AMR Guidance v3.0 (2023, updated Jan 2024) — partly superseded by 2026",
  "TYPH": "CDC Yellow Book: typhoid and paratyphoid fever",
  "BRUC": "CDC: clinical overview of brucellosis",
  "IAI": "IDSA/SIS complicated intra-abdominal infection guideline (2010)",
  "CDI": "IDSA/SHEA C. difficile focused update, 2021",
  "CDC": "CDC STI Treatment Guidelines, 2021",
  "LABEL": "FDA prescribing information",
  "SPC": "FDA prescribing information",
  "DAP": "Cubicin (daptomycin) prescribing information",
  "MEN04": "IDSA bacterial meningitis guideline (2004)",
  "FDA_LZD": "Zyvox (linezolid) prescribing information"
};

export const CHANGES_2026 = [
  [
    "Colistin/polymyxin B",
    "space",
    "remove",
    "Removed: most Proteus, Providencia and Serratia strains are resistant to colistin",
    "AHFS"
  ],
  [
    "Amoxicillin-clavulanate",
    "space",
    "remove",
    "Removed: AmpC organisms (Enterobacter, C. freundii) are intrinsically resistant",
    "IDSA"
  ],
  [
    "Piperacillin-tazobactam",
    "space",
    "set",
    "Avoid in invasive infections by moderate-risk AmpC organisms",
    "IDSA"
  ],
  [
    "Cefepime",
    "space",
    "set",
    "Preferred for moderate-risk AmpC organisms (cefepime MIC ≤8)",
    "IDSA"
  ],
  [
    "Ceftolozane-tazobactam",
    "space",
    "remove",
    "Removed: Not suggested for AmpC-producing Enterobacterales",
    "IDSA"
  ],
  [
    "Piperacillin-tazobactam",
    "esbl",
    "set",
    "Not for ESBL outside the urinary tract; cUTI only if not critically ill and no bacteraemia",
    "IDSA"
  ],
  [
    "Ceftolozane-tazobactam",
    "esbl",
    "set",
    "Active, but reserve for carbapenem-resistant organisms",
    "IDSA"
  ],
  [
    "Nitrofurantoin/fosfomycin",
    "esbl",
    "set",
    "Cystitis only; oral fosfomycin for E. coli only",
    "IDSA"
  ],
  [
    "Ciprofloxacin/norfloxacin",
    "cre",
    "set",
    "Only if susceptible (fewer than 20% of CRE are)",
    "IDSA"
  ],
  [
    "Gentamicin/tobramycin/amikacin",
    "cre",
    "set",
    "Mainly urinary infections, if susceptible",
    "IDSA"
  ],
  [
    "Tigecycline",
    "cre",
    "set",
    "Alternative only; not for bloodstream or urinary infections",
    "IDSA"
  ],
  [
    "Clindamycin",
    "bact",
    "set",
    "Not recommended: rising B. fragilis resistance",
    "IAI"
  ],
  [
    "Levofloxacin/moxifloxacin",
    "bact",
    "set",
    "Moxifloxacin only; avoid if a quinolone was used in the last 3 months",
    "IAI"
  ],
  [
    "Vancomycin/daptomycin",
    "cdiff",
    "set",
    "Oral vancomycin: alternative to fidaxomicin",
    "CDI"
  ],
  [
    "Fidaxomicin",
    "cdiff",
    "set",
    "Preferred first-line for initial and recurrent CDI",
    "CDI"
  ],
  [
    "Metronidazole",
    "cdiff",
    "set",
    "Only for non-severe CDI if fidaxomicin/vancomycin unavailable",
    "CDI"
  ],
  [
    "Clarithromycin/azithromycin",
    "ngon",
    "remove",
    "Removed as routine therapy (rising resistance); azithromycin 2 g is used only with gentamicin in cephalosporin allergy",
    "CDC"
  ],
  [
    "Chloramphenicol",
    "ngon",
    "remove",
    "Removed: not a recommended gonorrhoea regimen",
    "CDC"
  ],
  [
    "Ceftriaxone/cefotaxime",
    "ngon",
    "set",
    "First-line: ceftriaxone 500 mg IM single dose, monotherapy",
    "CDC"
  ],
  [
    "Cefixime",
    "ngon",
    "set",
    "Alternative only if ceftriaxone unavailable; not for pharyngeal",
    "CDC"
  ],
  [
    "Tetracycline/doxycycline",
    "chlam",
    "set",
    "Doxycycline 7 days is preferred",
    "CDC"
  ],
  [
    "Clarithromycin/azithromycin",
    "chlam",
    "set",
    "Azithromycin: alternative; preferred in pregnancy",
    "CDC"
  ]
];

export const NEW_DRUGS_2026 = [
  {
    "c": "Monobactams",
    "n": "Aztreonam",
    "src": "SPC",
    "why": "Added to the chart: key anti-Pseudomonas agent and an option in β-lactam allergy",
    "cov": {
      "gnb": 1,
      "gnbbl": 1,
      "pseudo": 1
    }
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Ceftazidime-avibactam",
    "src": "IDSA",
    "cov": {
      "space": {
        "q": "Active; reserve for carbapenem resistance"
      },
      "esbl": {
        "q": "Active; reserve for carbapenem resistance"
      },
      "cre": {
        "q": "Preferred for KPC and OXA-48-like; not active vs NDM"
      },
      "pseudo": {
        "q": "For difficult-to-treat strains"
      }
    }
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Meropenem-vaborbactam",
    "src": "IDSA",
    "cov": {
      "esbl": {
        "q": "Active; reserve for carbapenem resistance"
      },
      "cre": {
        "q": "Preferred for KPC; not active vs NDM"
      }
    }
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Imipenem-relebactam",
    "src": "IDSA",
    "cov": {
      "esbl": {
        "q": "Active; reserve for carbapenem resistance"
      },
      "cre": {
        "q": "Preferred for KPC; not active vs NDM"
      },
      "pseudo": {
        "q": "For difficult-to-treat strains"
      }
    }
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Aztreonam-avibactam",
    "src": "IDSA",
    "cov": {
      "cre": {
        "q": "Preferred for NDM"
      }
    }
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Cefiderocol",
    "src": "IDSA",
    "cov": {
      "cre": {
        "q": "Preferred for NDM; alternative for KPC"
      },
      "pseudo": {
        "q": "For difficult-to-treat strains"
      }
    }
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Cefepime-enmetazobactam",
    "src": "IDSA",
    "cov": {
      "esbl": {
        "q": "Alternative outside urine; option for cUTI"
      }
    }
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Sulbactam-durlobactam",
    "src": "IDSA",
    "cov": {}
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Pivmecillinam (oral)",
    "src": "IDSA",
    "cov": {
      "esbl": {
        "q": "Cystitis only"
      }
    }
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Gepotidacin (oral)",
    "src": "IDSA",
    "cov": {
      "esbl": {
        "q": "Cystitis only"
      }
    }
  },
  {
    "c": "Penicillins",
    "n": "Ampicillin-sulbactam (high-dose)",
    "src": "SPC",
    "why": "Added to the chart (FDA-labelled spectrum) so its CRAB role can be shown",
    "cov": {
      "strep": 1,
      "entero": 1,
      "mssa": 1,
      "gnb": 1,
      "gnbbl": 1,
      "bact": {
        "q": "Active, but not recommended for intra-abdominal infection (E. coli resistance)"
      }
    }
  },
  {
    "c": "Tetracyclines",
    "n": "Minocycline (high-dose)",
    "src": "AHFS",
    "why": "Added to the chart so its S. maltophilia and CRAB roles can be shown",
    "cov": {
      "myco": 1,
      "chlam": 1
    }
  },
  {
    "c": "Newer agents (added 2026)",
    "n": "Ceftaroline",
    "src": "SPC",
    "cov": {
      "strep": 1,
      "mssa": 1,
      "camrsa": {
        "q": "MRSA labelled for skin infections only, not pneumonia"
      },
      "hamrsa": {
        "q": "MRSA labelled for skin infections only, not pneumonia"
      },
      "gnb": 1
    }
  }
];

export const EXTRA_2026 = [
  [
    "Linezolid/tedizolid",
    "vre",
    "Linezolid is labelled for VRE E. faecium",
    "FDA_LZD"
  ],
  [
    "Vancomycin/daptomycin",
    "vre",
    "Daptomycin: off-label only (not labelled for VRE); vancomycin inactive",
    "DAP"
  ],
  [
    "Penicillin V/G",
    "listeria",
    "IV penicillin G: recommended option",
    "MEN04"
  ],
  [
    "Amoxicillin/ampicillin",
    "listeria",
    "Ampicillin: recommended; CDC adds gentamicin",
    "MEN04"
  ],
  [
    "Trimethoprim-sulfamethoxazole",
    "listeria",
    "Alternative",
    "MEN04"
  ],
  [
    "Meropenem/imipenem/doripenem",
    "listeria",
    "Meropenem: alternative",
    "MEN04"
  ],
  [
    "Cefiderocol",
    "steno",
    "Preferred for invasive infection",
    "IDSA"
  ],
  [
    "Aztreonam-avibactam",
    "steno",
    "Alternative, preferably with a second agent",
    "IDSA"
  ],
  [
    "Sulbactam-durlobactam",
    "crab",
    "Preferred, given with a carbapenem",
    "IDSA"
  ],
  [
    "Cefiderocol",
    "crab",
    "Bridge only until sulbactam-durlobactam is available",
    "IDSA"
  ],
  [
    "Trimethoprim-sulfamethoxazole",
    "steno",
    "Combination component (IDSA 2023/24); 2026 prefers cefiderocol monotherapy for invasive infection",
    "IDSA24"
  ],
  [
    "Minocycline (high-dose)",
    "steno",
    "Combination component, favoured over tigecycline (IDSA 2023/24)",
    "IDSA24"
  ],
  [
    "Tigecycline",
    "steno",
    "Combination component; minocycline favoured (IDSA 2023/24)",
    "IDSA24"
  ],
  [
    "Levofloxacin/moxifloxacin",
    "steno",
    "Levofloxacin: combination component (IDSA 2023/24)",
    "IDSA24"
  ],
  [
    "Ampicillin-sulbactam (high-dose)",
    "crab",
    "High-dose, plus another agent (IDSA 2023/24); 2026: bridge until sulbactam-durlobactam",
    "IDSA24"
  ],
  [
    "Colistin/polymyxin B",
    "crab",
    "Polymyxin B: combination partner (IDSA 2023/24); bridge only",
    "IDSA24"
  ],
  [
    "Minocycline (high-dose)",
    "crab",
    "Combination partner (IDSA 2023/24); bridge only",
    "IDSA24"
  ],
  [
    "Tigecycline",
    "crab",
    "Combination partner (IDSA 2023/24); bridge only",
    "IDSA24"
  ],
  [
    "Clarithromycin/azithromycin",
    "typhi",
    "Azithromycin: uncomplicated illness (incl. from Pakistan/Iraq)",
    "TYPH"
  ],
  [
    "Ceftriaxone/cefotaxime",
    "typhi",
    "Ceftriaxone: travellers from most countries; not for XDR strains",
    "TYPH"
  ],
  [
    "Meropenem/imipenem/doripenem",
    "typhi",
    "Carbapenem: complicated illness or XDR (Pakistan/Iraq), ± azithromycin",
    "TYPH"
  ],
  [
    "Tetracycline/doxycycline",
    "brucella",
    "Doxycycline + rifampin for ≥6 weeks: first line",
    "BRUC"
  ],
  [
    "Rifampin",
    "brucella",
    "With doxycycline (not for the RB51 strain)",
    "BRUC"
  ],
  [
    "Gentamicin/tobramycin/amikacin",
    "brucella",
    "Gentamicin (or streptomycin) with doxycycline: alternative",
    "BRUC"
  ],
  [
    "Trimethoprim-sulfamethoxazole",
    "brucella",
    "If contraindications (allergy, pregnancy) or RB51 strain",
    "BRUC"
  ],
  [
    "Penicillin V/G",
    "tpall",
    "Benzathine penicillin G: first line; IV aqueous penicillin G for neurosyphilis",
    "CDC"
  ],
  [
    "Tetracycline/doxycycline",
    "tpall",
    "Doxycycline 14 days: penicillin allergy (not in pregnancy)",
    "CDC"
  ],
  [
    "Ceftriaxone/cefotaxime",
    "tpall",
    "Ceftriaxone: penicillin-allergy alternative (incl. neurosyphilis)",
    "CDC"
  ],
  [
    "Gentamicin/tobramycin/amikacin",
    "ngon",
    "Gentamicin 240 mg IM + azithromycin 2 g: if cephalosporin allergy",
    "CDC"
  ],
  [
    "Levofloxacin/moxifloxacin",
    "chlam",
    "Levofloxacin 7 days: alternative",
    "CDC"
  ],
  [
    "Amoxicillin/ampicillin",
    "chlam",
    "Amoxicillin 7 days: alternative in pregnancy",
    "CDC"
  ],
  [
    "Levofloxacin/moxifloxacin",
    "pseudo",
    "Levofloxacin only (labelled, e.g. 750 mg for nosocomial pneumonia)",
    "FDA_FQ"
  ],
  [
    "Colistin/polymyxin B",
    "cre",
    "Colistin: alternative for uncomplicated CRE cystitis only",
    "IDSA24"
  ],
  [
    "Ceftriaxone/cefotaxime",
    "entero",
    "Only with ampicillin, for E. faecalis endocarditis (AHA regimen)",
    "AHFS"
  ]
];

export const ORG_NOTES_2026 = {
  "space": "Updated 2026 (IDSA): the SPACE mnemonic oversimplifies AmpC risk. Moderate risk: Enterobacter cloacae complex, Klebsiella aerogenes, Citrobacter freundii, Hafnia alvei — prefer cefepime; avoid ceftriaxone and piperacillin-tazobactam for invasive infections. Lower risk (Serratia, Morganella, Providencia): treat according to susceptibility results. Most Proteus, Providencia and Serratia strains are resistant to colistin (AHFS).",
  "esbl": "Updated 2026 (IDSA): carbapenems are preferred for ESBL infections outside the urine (meropenem or imipenem if critically ill). Avoid cefepime and cephamycins. For cystitis, nitrofurantoin, TMP-SMX, single-dose aminoglycoside, pivmecillinam, gepotidacin or sulopenem are preferred.",
  "cre": [
    "Updated 2026 (IDSA): choose by carbapenemase type. KPC: meropenem-vaborbactam, ceftazidime-avibactam or imipenem-relebactam. NDM: aztreonam-avibactam or cefiderocol. OXA-48-like: ceftazidime-avibactam (IDSA 2023/24). Polymyxins are not suggested for CRE, except colistin as an alternative for uncomplicated cystitis. Tigecycline/eravacycline only when β-lactams are unsuitable, not for urinary or bloodstream infection.",
    [
      "IDSA",
      "IDSA24"
    ]
  ],
  "bact": "IDSA/SIS intra-abdominal guideline (2010): cefotetan and clindamycin are not recommended because of rising B. fragilis group resistance. Metronidazole, carbapenems and some β-lactam/β-lactamase inhibitors remain uniformly active. Cefoxitin is still a recommended single agent for mild–moderate community-acquired infection. Avoid moxifloxacin if a quinolone was used in the previous 3 months.",
  "cdiff": "Updated (IDSA/SHEA 2021): fidaxomicin is preferred over oral vancomycin for initial and recurrent CDI. Metronidazole alone only for mild cases when the others are unavailable.",
  "ngon": "Updated (CDC 2021): ceftriaxone 500 mg IM single dose (1 g if ≥150 kg). Add doxycycline if chlamydia is not excluded.",
  "chlam": "Updated (CDC 2021): doxycycline 100 mg twice daily for 7 days is preferred; azithromycin is the alternative and is preferred in pregnancy.",
  "vre": [
    "Vancomycin is inactive. Linezolid is FDA-labelled for VRE E. faecium. Daptomycin is not labelled for VRE (its enterococcal indication is vancomycin-susceptible E. faecalis only) — off-label use needs ID input.",
    [
      "FDA_LZD",
      "DAP"
    ]
  ],
  "listeria": [
    "Ampicillin or penicillin G is recommended (IDSA meningitis guideline); CDC lists IV ampicillin plus gentamicin for 14–21 days. TMP-SMX or meropenem are alternatives. Cephalosporin-based empirical regimens need ampicillin added when Listeria is possible.",
    [
      "MEN04",
      "CDCLIS"
    ]
  ],
  "steno": [
    "IDSA 2026: cefiderocol monotherapy is preferred for invasive infection; aztreonam-avibactam, preferably with a second agent, is an alternative. The earlier IDSA guidance (2023, updated 2024) recommended combining two of: TMP-SMX, minocycline (favoured over tigecycline), cefiderocol or levofloxacin. AHFS lists minocycline as an alternative to co-trimoxazole. Separate infection from colonisation; confirm the regimen with ID.",
    [
      "IDSA",
      "IDSA24",
      "AHFS"
    ]
  ],
  "typhi": [
    "Most S. Typhi and Paratyphi A infections are now fluoroquinolone-nonsusceptible. From Pakistan or Iraq: azithromycin for uncomplicated illness and a carbapenem for complicated illness (XDR strains); adding azithromycin may help if not improving on a carbapenem alone. From most other countries: ceftriaxone or azithromycin. Adjust to culture susceptibility.",
    [
      "TYPH"
    ]
  ],
  "brucella": [
    "Doxycycline plus rifampin for at least 6 weeks. Alternative: doxycycline plus streptomycin or gentamicin. TMP-SMX if there are contraindications (allergy, pregnancy). The B. abortus RB51 vaccine strain is rifampin-resistant — use TMP-SMX instead.",
    [
      "BRUC"
    ]
  ],
  "tpall": [
    "Primary/secondary syphilis: benzathine penicillin G 2.4 million units IM once. Penicillin allergy (not pregnant): doxycycline 14 days, tetracycline 14 days or ceftriaxone 10 days; azithromycin is no longer recommended. Pregnancy: desensitise and treat with penicillin. Neurosyphilis, ocular or otosyphilis: aqueous penicillin G 18–24 million units/day IV for 10–14 days (ceftriaxone 1–2 g daily is an alternative in penicillin allergy).",
    [
      "CDC"
    ]
  ],
  "crab": [
    "IDSA 2026: sulbactam-durlobactam (with a carbapenem) is the priority for invasive CRAB; other options only as a bridge until it is available. The earlier IDSA guidance (2023, updated 2024) recommended high-dose ampicillin-sulbactam plus at least one other agent (polymyxin B, high-dose minocycline or tigecycline), with cefiderocol for refractory infection.",
    [
      "IDSA",
      "IDSA24"
    ]
  ]
};

export const KEY_POINTS = [
  [
    "Antibacterial",
    "Cefoxitin (intra-abdominal)",
    "Correction: cefoxitin IS a recommended single agent for mild–moderate community-acquired intra-abdominal infection; cefotetan and clindamycin are the agents not recommended",
    "IAI"
  ],
  [
    "Antibacterial",
    "ESBL cystitis",
    "Sulopenem added to the preferred oral options",
    "IDSA"
  ],
  [
    "Antibacterial",
    "S. maltophilia",
    "2026: cefiderocol monotherapy preferred for invasive infection. TMP-SMX, minocycline and levofloxacin shown as combination options from the 2023/24 guidance",
    "IDSA24"
  ],
  [
    "Antibacterial",
    "Gaps closed (audit 5 Oct)",
    "Added aztreonam; syphilis, typhoid and brucellosis; levofloxacin for Pseudomonas; gentamicin + azithromycin for gonorrhoea (cephalosporin allergy); levofloxacin and amoxicillin (pregnancy) for chlamydia; colistin for CRE cystitis; OXA-48 option",
    "CDC"
  ],
  [
    "Antibacterial",
    "CRAB",
    "2026: sulbactam-durlobactam is the priority. High-dose ampicillin-sulbactam, polymyxin B, minocycline and tigecycline shown as 2023/24 combination options (bridge only)",
    "IDSA24"
  ],
  [
    "Antifungal",
    "Rezafungin",
    "Once-weekly echinocandin, labelled from age 12 when alternatives are limited",
    "SPC"
  ],
  [
    "Antifungal",
    "Candida auris",
    "Echinocandin first line; test every clinical isolate (echinocandin- and pan-resistance rising)",
    "CAURIS"
  ],
  [
    "Antifungal",
    "Cryptococcal meningitis",
    "Single high-dose liposomal amphotericin B induction with flucytosine and fluconazole",
    "CRYPTO"
  ],
  [
    "Antiviral",
    "Influenza",
    "Oseltamivir for every hospitalised patient; adding baloxavir gave no extra benefit",
    "FLU"
  ],
  [
    "Antiviral",
    "COVID-19",
    "Molnupiravir only when nirmatrelvir/ritonavir cannot be used",
    "COVID"
  ],
  [
    "Antiviral",
    "Nirmatrelvir/ritonavir",
    "Label now includes dosing for eGFR <30, including haemodialysis",
    "SPC"
  ],
  [
    "Antiviral",
    "Remdesivir",
    "No renal dose adjustment, including dialysis",
    "REMR"
  ],
  [
    "Antiviral",
    "CMV",
    "Letermovir labelled for kidney transplant (D+/R−); maribavir for refractory CMV, never with ganciclovir",
    "ASTCT"
  ],
  [
    "Antiviral",
    "Hepatitis B",
    "WHO 2024: TDF or entecavir preferred; treatment eligibility widened",
    "HBV"
  ],
  [
    "Antiviral",
    "Mpox",
    "Tecovirimat showed no benefit in clade II mpox (STOMP)",
    "MPOX"
  ],
  [
    "TB",
    "MDR/RR-TB",
    "6-month BPaLM/BPaL; BDLLfxC as an alternative 6-month regimen (WHO 2025)",
    "TBW"
  ],
  [
    "TB",
    "Drug-susceptible TB",
    "4-month HPMZ regimen is an option from age 12",
    "TBW"
  ],
  [
    "TB",
    "Isoniazid-resistant TB",
    "Rifampicin, ethambutol, pyrazinamide and levofloxacin for 6 months",
    "HRTB"
  ],
  [
    "Antiparasitic",
    "Gaps closed (audit 5 Oct)",
    "Added Trichomonas, Cryptosporidium, visceral leishmaniasis, schistosomiasis, intestinal tapeworm and hydatid cyst",
    "CDC"
  ],
  [
    "Antifungal",
    "Mucosal candidiasis",
    "Fluconazole shown as first line for oesophageal and moderate–severe oral thrush; topical clotrimazole/miconazole for mild thrush",
    "IDSA_CAN"
  ],
  [
    "Antiparasitic",
    "Malaria in pregnancy",
    "Artemether-lumefantrine recommended in the first trimester",
    "MAL"
  ]
];

export const REFERENCES = [
  [
    "IDSA",
    "Tamma PD, et al. IDSA 2026 Guidance on the Treatment of Antimicrobial Resistant Gram-Negative Infections (published 30 Jul 2026)",
    "https://www.idsociety.org/practice-guideline/amr-guidance/"
  ],
  [
    "IAI",
    "Solomkin JS, et al. Diagnosis and management of complicated intra-abdominal infection in adults and children: guidelines by SIS and IDSA. Clin Infect Dis 2010;50:133-64 (full text)",
    "https://www.sbp.com.br/fileadmin/user_upload/pdfs/08_Diagnosis_and_Management_of_Complicated_Intra-abdominal_Infection_in_Adults_and_Children_IDSA_2010.pdf"
  ],
  [
    "CDI",
    "Johnson S, et al. IDSA/SHEA 2021 Focused Update: Management of Clostridioides difficile Infection in Adults. Clin Infect Dis 2021;73:755-7",
    "https://www.idsociety.org/practice-guideline/clostridioides-difficile-2021-focused-update/"
  ],
  [
    "CDC",
    "CDC Sexually Transmitted Infections Treatment Guidelines, 2021 (gonorrhea, chlamydia, genital herpes sections)",
    "https://www.cdc.gov/std/treatment-guidelines/"
  ],
  [
    "IDSA24",
    "Tamma PD, et al. IDSA Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections, version 3.0 (7 June 2023, updated 19 January 2024) — S. maltophilia and CRAB sections, checked via the Guideline Central summary. Partly superseded by the 2026 version",
    "https://www.guidelinecentral.com/guideline/308215/"
  ],
  [
    "WHO",
    "WHO. AWaRe (Access, Watch, Reserve) classification of antibiotics, 2025",
    "https://www.who.int/publications/i/item/B09489"
  ],
  [
    "ASHP",
    "Rybak MJ, et al. ASHP/IDSA/PIDS/SIDP consensus: Therapeutic monitoring of vancomycin for serious MRSA infections. Am J Health-Syst Pharm 2020",
    "https://www.idsociety.org/practice-guideline/vancomycin/"
  ],
  [
    "MHRA",
    "MHRA Drug Safety Update: Carbapenems — concomitant use with valproic acid not recommended",
    "https://www.gov.uk/drug-safety-update/carbapenems-concomitant-use-with-valproic-acid-not-recommended"
  ],
  [
    "FDA_TGC",
    "Tygacil (tigecycline) US prescribing information — boxed warning and warnings",
    "https://www.drugs.com/pro/tygacil.html"
  ],
  [
    "FDA_FQ",
    "Levofloxacin US prescribing information — fluoroquinolone class boxed warning, QT and pharmacokinetics",
    "https://www.drugs.com/pro/levofloxacin.html"
  ],
  [
    "FDA_LZD",
    "Zyvox (linezolid) US prescribing information",
    "https://www.drugs.com/pro/zyvox.html"
  ],
  [
    "DAPP",
    "Khan DA, et al. Drug allergy: a 2022 practice parameter update. J Allergy Clin Immunol 2022;150:1333-93 (AAAAI/ACAAI)",
    "https://www.aaaai.org/Aaaai/media/Media-Library-PDFs/Allergist%20Resources/Statements%20and%20Practice%20Parameters/Drug-Allergy-2022.pdf"
  ],
  [
    "IDSA_CAN",
    "Pappas PG, et al. Clinical Practice Guideline for the Management of Candidiasis: 2016 Update by IDSA. Clin Infect Dis 2016;62:e1-50",
    "https://www.idsociety.org/globalassets/idsa/practice-guidelines/clinical-practice-guideline-for-the-management-of-candidiasis-2016-update-by-the-infectious-diseases-society-of-america.pdf"
  ],
  [
    "CAURIS",
    "CDC. Clinical Treatment of Candida auris Infections (accessed 4 October 2026)",
    "https://www.cdc.gov/candida-auris/hcp/clinical-care/index.html"
  ],
  [
    "ASP16",
    "Patterson TF, et al. IDSA Practice Guidelines for the Diagnosis and Management of Aspergillosis: 2016 Update. Clin Infect Dis 2016;63:e1-60",
    "https://www.idsociety.org/practice-guideline/aspergillosis/"
  ],
  [
    "MUC19",
    "Cornely OA, et al. Global guideline for the diagnosis and management of mucormycosis (ECMM/MSG ERC). Lancet Infect Dis 2019;19:e405-21",
    "https://www.ecmm.info/wp-content/uploads/Cornely-TLID-2019-Global-guideline-for-the-diagnosis-and-management-of-mucormycosis-an-initiative-of-the-ECMM-in-cooperation-with-theMSG-ERC_OC.pdf"
  ],
  [
    "RAREM",
    "Hoenigl M, et al. Global guideline for the diagnosis and management of rare mould infections (ECMM/ISHAM/ASM). Lancet Infect Dis 2021;21:e246-57",
    "https://www.ecmm.info/wp-content/uploads/Hoenigl-TLID-2021-Global-guideline-for-the-diagnosis-and-management-of-rare-mould-infections-an-initiative-of-the-European-Confederation-of-Medical-Mycology-in-cooperation-with-the-International-Society.pdf"
  ],
  [
    "CRYPTO",
    "WHO. Guidelines for diagnosing, preventing and managing cryptococcal disease among adults, adolescents and children living with HIV, 2022 (recommendations chapter)",
    "https://www.ncbi.nlm.nih.gov/books/NBK581839/"
  ],
  [
    "JTDM",
    "Takesue Y, et al. Clinical practice guideline for the therapeutic drug monitoring of voriconazole in non-Asian and Asian adult patients: consensus review by the Japanese Society of Chemotherapy and the Japanese Society of Therapeutic Drug Monitoring. Clin Ther 2022",
    "https://www.sciencedirect.com/science/article/pii/S0149291822003538"
  ],
  [
    "OI",
    "NIH/CDC/HIVMA-IDSA. Guidelines for the Prevention and Treatment of Opportunistic Infections in Adults and Adolescents with HIV — Pneumocystis and Toxoplasma sections",
    "https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-opportunistic-infections/pneumocystis"
  ],
  [
    "OIPED",
    "NIH. Guidelines for the Prevention and Treatment of Opportunistic Infections in Children with HIV — Giardiasis",
    "https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-pediatric-opportunistic-infections/giardiasis"
  ],
  [
    "FLU",
    "CDC. Influenza Antiviral Medications: Summary for Clinicians (updated 10 March 2026)",
    "https://www.cdc.gov/flu/hcp/antivirals/summary-clinicians.html"
  ],
  [
    "COVID",
    "IDSA Guidelines on the Treatment and Management of Patients with COVID-19 (page updated 23 September 2026)",
    "https://www.idsociety.org/practice-guideline/covid-19-guideline-treatment-and-management/"
  ],
  [
    "REMR",
    "Veklury (remdesivir) US prescribing information, 2024",
    "https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/214787s027lbl.pdf"
  ],
  [
    "ASTCT",
    "ASTCT Series #11: Updated Cytomegalovirus Guidelines in Hematopoietic Cell Transplant and Cellular Therapy Recipients. Transplant Cell Ther 2025",
    "https://www.sciencedirect.com/science/article/pii/S2666636725012680"
  ],
  [
    "MBV",
    "Livtencity (maribavir) US prescribing information, 2024",
    "https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/215596s005lbl.pdf"
  ],
  [
    "ECIL4",
    "Hirsch HH, et al. ECIL-4 guidelines for RSV, parainfluenza, metapneumovirus, rhinovirus and coronavirus in leukaemia and HSCT patients. Clin Infect Dis 2013;56:258-66",
    "https://academic.oup.com/cid/article/56/2/258/402780"
  ],
  [
    "HBV",
    "WHO. Guidelines for the prevention, diagnosis, care and treatment for people with chronic hepatitis B infection, 29 March 2024 (recommendations checked via the World Hepatitis Alliance briefing on the guideline)",
    "https://www.who.int/publications/i/item/9789240090903"
  ],
  [
    "HCV",
    "AASLD-IDSA. HCV Guidance — simplified treatment for treatment-naive adults without cirrhosis",
    "https://www.hcvguidelines.org/treatment-naive/simplified-treatment"
  ],
  [
    "DHHS",
    "DHHS Panel. Guidelines for the Use of Antiretroviral Agents in Adults and Adolescents with HIV (initial regimens; drug interactions)",
    "https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-arv/what-start-initial-combination-regimens"
  ],
  [
    "LIV",
    "University of Liverpool drug interaction checkers (HIV, hepatitis, COVID-19)",
    "https://www.hiv-druginteractions.org/"
  ],
  [
    "MPOX",
    "NIAID. Tecovirimat safe but ineffective as treatment for clade II mpox (STOMP trial)",
    "https://www.niaid.nih.gov/news-events/tecovirimat-safe-ineffective-treatment-clade-ii-mpox"
  ],
  [
    "TBW",
    "WHO consolidated guidelines on tuberculosis. Module 4: treatment and care, 2025",
    "https://www.ncbi.nlm.nih.gov/books/NBK613101/"
  ],
  [
    "ATS16",
    "Nahid P, et al. ATS/CDC/IDSA Clinical Practice Guidelines: Treatment of Drug-Susceptible Tuberculosis. Clin Infect Dis 2016;63:e147-95",
    "https://www.idsociety.org/practice-guideline/treatment-of-drug-susceptible-tb/"
  ],
  [
    "LTBI",
    "Sterling TR, et al. Guidelines for the Treatment of Latent Tuberculosis Infection: NTCA and CDC, 2020. MMWR Recomm Rep 2020;69(1)",
    "https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm"
  ],
  [
    "NTM",
    "Daley CL, et al. Treatment of Nontuberculous Mycobacterial Pulmonary Disease: ATS/ERS/ESCMID/IDSA guideline. Clin Infect Dis 2020;71:e1-36",
    "https://ntminfo.org/wp-content/uploads/2020/07/NTMguidelines2020.pdf"
  ],
  [
    "MAL",
    "WHO guidelines for malaria, 13 August 2025",
    "https://www.severemalaria.org/sites/default/files/content/document/WHO%20malaria%20guidelines%20-%20August%202025.pdf"
  ],
  [
    "CDCMAL",
    "CDC. Treatment of uncomplicated malaria and treatment of severe malaria (clinical guidance pages)",
    "https://www.cdc.gov/malaria/hcp/clinical-guidance/treatment-of-uncomplicated-malaria.html"
  ],
  [
    "NCC",
    "White AC Jr, et al. Diagnosis and Treatment of Neurocysticercosis: IDSA/ASTMH Clinical Practice Guidelines, 2017. Clin Infect Dis 2018;66:e49-75",
    "https://www.idsociety.org/practice-guideline/neurocysticercosis/"
  ],
  [
    "YB",
    "CDC Yellow Book: Travelers' Diarrhea (giardiasis and amebiasis treatment)",
    "https://www.cdc.gov/yellow-book/hcp/preparing-international-travelers/travelers-diarrhea.html"
  ],
  [
    "STRO",
    "CDC. Clinical Care of Strongyloides",
    "https://www.cdc.gov/strongyloides/hcp/clinical-care/index.html"
  ],
  [
    "STH",
    "CDC. Clinical Care of Soil-transmitted Helminths",
    "https://www.cdc.gov/sth/hcp/clinical-care/index.html"
  ],
  [
    "PIN",
    "CDC. Clinical Overview of Pinworm Infection",
    "https://www.cdc.gov/pinworm/hcp/clinical-overview/index.html"
  ],
  [
    "SCAB",
    "CDC. Clinical Care of Scabies",
    "https://www.cdc.gov/scabies/hcp/clinical-care/index.html"
  ],
  [
    "NIOSH",
    "NIOSH List of Hazardous Drugs in Healthcare Settings, 2024 (DHHS NIOSH Publication 2025-103)",
    "https://www.cdc.gov/niosh/docs/2025-103/pdfs/2025-103.pdf"
  ],
  [
    "SPC",
    "FDA prescribing information (US product labels), read on 4 October 2026 via Drugs.com professional label pages and DailyMed — check against the product HMC stocks",
    "https://www.drugs.com/pro/"
  ],
  [
    "AHFS",
    "AHFS Drug Information monographs (American Society of Health-System Pharmacists), read on 4 October 2026 via Drugs.com",
    "https://www.drugs.com/monograph/"
  ],
  [
    "IVOS",
    "UKHSA. National antimicrobial intravenous-to-oral switch (IVOS) criteria for early switch",
    "https://www.gov.uk/government/publications/antimicrobial-intravenous-to-oral-switch-criteria-for-early-switch/national-antimicrobial-intravenous-to-oral-switch-ivos-criteria-for-early-switch"
  ],
  [
    "MEN04",
    "Tunkel AR, et al. IDSA Practice Guidelines for the Management of Bacterial Meningitis. Clin Infect Dis 2004;39:1267-84",
    "https://academic.oup.com/cid/article/39/9/1267/402080"
  ],
  [
    "CDCLIS",
    "CDC. Listeria: clinical care information",
    "https://www.cdc.gov/listeria/hcp/clinical-care/index.html"
  ],
  [
    "DAP",
    "Cubicin (daptomycin) US prescribing information",
    "https://www.drugs.com/pro/cubicin.html"
  ],
  [
    "TYPH",
    "CDC Yellow Book: Typhoid and Paratyphoid Fever (treatment and resistance)",
    "https://www.cdc.gov/yellow-book/hcp/travel-associated-infections-diseases/typhoid-and-paratyphoid-fever.html"
  ],
  [
    "BRUC",
    "CDC. Clinical Overview of Brucellosis (treatment)",
    "https://www.cdc.gov/brucellosis/hcp/clinical-overview/"
  ],
  [
    "HRTB",
    "WHO treatment guidelines for isoniazid-resistant tuberculosis, 2018 (policy recommendations)",
    "https://www.ncbi.nlm.nih.gov/books/NBK531408/"
  ],
  [
    "SCHI",
    "CDC. Clinical Care of Schistosomiasis",
    "https://www.cdc.gov/schistosomiasis/hcp/treatment/index.html"
  ],
  [
    "TAEN",
    "CDC. Clinical Treatment of Taeniasis",
    "https://www.cdc.gov/taeniasis/hcp/clinical-care/index.html"
  ],
  [
    "LEISH",
    "CDC. Clinical Care of Leishmaniasis",
    "https://www.cdc.gov/leishmaniasis/hcp/clinical-care/index.html"
  ],
  [
    "ECHI",
    "CDC. Clinical Treatment of Echinococcosis",
    "https://www.cdc.gov/echinococcosis/hcp/clinical-care/index.html"
  ],
  [
    "UBC",
    "McCormack J, Lalji F. The 'Best' Antibiotic Sensitivity Chart Ever. Faculty of Pharmaceutical Sciences, UBC, Nov 2019 (original chart)",
    ""
  ]
];

export const REF_NUMBERS = {
  "IDSA": 1,
  "IAI": 2,
  "CDI": 3,
  "CDC": 4,
  "IDSA24": 5,
  "WHO": 6,
  "ASHP": 7,
  "MHRA": 8,
  "FDA_TGC": 9,
  "FDA_FQ": 10,
  "FDA_LZD": 11,
  "DAPP": 12,
  "IDSA_CAN": 13,
  "CAURIS": 14,
  "ASP16": 15,
  "MUC19": 16,
  "RAREM": 17,
  "CRYPTO": 18,
  "JTDM": 19,
  "OI": 20,
  "OIPED": 21,
  "FLU": 22,
  "COVID": 23,
  "REMR": 24,
  "ASTCT": 25,
  "MBV": 26,
  "ECIL4": 27,
  "HBV": 28,
  "HCV": 29,
  "DHHS": 30,
  "LIV": 31,
  "MPOX": 32,
  "TBW": 33,
  "ATS16": 34,
  "LTBI": 35,
  "NTM": 36,
  "MAL": 37,
  "CDCMAL": 38,
  "NCC": 39,
  "YB": 40,
  "STRO": 41,
  "STH": 42,
  "PIN": 43,
  "SCAB": 44,
  "NIOSH": 45,
  "SPC": 46,
  "AHFS": 47,
  "IVOS": 48,
  "MEN04": 49,
  "CDCLIS": 50,
  "DAP": 51,
  "TYPH": 52,
  "BRUC": 53,
  "HRTB": 54,
  "SCHI": 55,
  "TAEN": 56,
  "LEISH": 57,
  "ECHI": 58,
  "UBC": 59
};

export const AWARE_MAP = {
  A: { name: "Access", color: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800" },
  W: { name: "Watch", color: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800" },
  R: { name: "Reserve", color: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800" }
};

export const PHARMACIST_NOTES = {
  "Penicillin V/G": {
    "aw": "A"
  },
  "Amoxicillin/ampicillin": {
    "aw": "A",
    "po": [
      "Amoxicillin: 74–92% of an oral dose absorbed",
      [
        "AHFS"
      ]
    ],
    "note": [
      [
        "Penicillin–cephalosporin cross-reactivity is mainly through shared R1 side chains",
        [
          "DAPP"
        ]
      ]
    ]
  },
  "Cloxacillin": {
    "aw": "A"
  },
  "Amoxicillin-clavulanate": {
    "aw": "A",
    "note": [
      [
        "Not suggested for ESBL cystitis; not for ESBL bacteraemia step-down",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Piperacillin-tazobactam": {
    "aw": "W",
    "note": [
      [
        "Not suggested for ESBL infections outside the urinary tract, even if tested susceptible",
        [
          "IDSA"
        ]
      ],
      [
        "Suboptimal for invasive infection by moderate-risk AmpC organisms",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Cefazolin/cephalexin": {
    "aw": "A",
    "note": [
      [
        "Cefazolin (non-cross-reactive) can be given routinely after penicillin anaphylaxis without testing",
        [
          "DAPP"
        ]
      ],
      [
        "Not a Listeria option — use ampicillin",
        [
          "MEN04"
        ]
      ]
    ]
  },
  "Cefuroxime": {
    "aw": "W",
    "po": [
      "Cefuroxime axetil bioavailability 37% fasting, 52% with food",
      [
        "SPC"
      ]
    ]
  },
  "Cefoxitin": {
    "aw": "W",
    "note": [
      [
        "Cephamycins not suggested for ESBL infections",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Ceftriaxone/cefotaxime": {
    "aw": "W",
    "note": [
      [
        "Does not cover Listeria: add ampicillin when Listeria is possible (e.g. neonates, older adults, immunocompromised)",
        [
          "MEN04"
        ]
      ],
      [
        "Avoid for invasive infection by E. cloacae, K. aerogenes, C. freundii (AmpC)",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Cefixime": {
    "aw": "W"
  },
  "Ceftazidime": {
    "aw": "W",
    "note": [
      [
        "Identical R1 side chain to aztreonam: avoid aztreonam in ceftazidime allergy",
        [
          "DAPP"
        ]
      ]
    ]
  },
  "Ceftolozane-tazobactam": {
    "aw": "R",
    "note": [
      [
        "Reserve for carbapenem-resistant organisms; not suggested for AmpC-E",
        [
          "IDSA",
          "WHO"
        ]
      ]
    ]
  },
  "Cefepime": {
    "aw": "W",
    "note": [
      [
        "Preferred for moderate-risk AmpC organisms if MIC ≤8",
        [
          "IDSA"
        ]
      ],
      [
        "Avoid for ESBL cUTI or invasive ESBL infection, even if susceptible",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Ceftobiprole": {
    "aw": "R"
  },
  "Meropenem/imipenem/doripenem": {
    "aw": "W",
    "ix": [
      [
        "Valproate: carbapenems cause a rapid, large fall in valproate levels — combination not recommended; use an alternative antibiotic",
        [
          "MHRA"
        ]
      ]
    ],
    "note": [
      [
        "Preferred for invasive ESBL infection (meropenem or imipenem if critically ill)",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Ertapenem": {
    "aw": "W",
    "ix": [
      [
        "Valproate: combination not recommended (class effect)",
        [
          "MHRA"
        ]
      ]
    ],
    "note": [
      [
        "Highly protein-bound: prefer meropenem/imipenem if critically ill or albumin <2.5 g/dL",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Erythromycin": {
    "aw": "W"
  },
  "Clarithromycin/azithromycin": {
    "aw": "W",
    "po": [
      "Absolute bioavailability: azithromycin 38%, clarithromycin 50–55%",
      [
        "SPC",
        "AHFS"
      ]
    ],
    "note": [
      [
        "Azithromycin no longer recommended for gonorrhoea",
        [
          "CDC"
        ]
      ]
    ]
  },
  "Tetracycline/doxycycline": {
    "aw": "A",
    "po": [
      "Doxycycline: 90–100% absorbed (fasting)",
      [
        "AHFS"
      ]
    ],
    "note": [
      [
        "Avoid doxycycline for ESBL cystitis (low urine levels)",
        [
          "IDSA"
        ]
      ],
      [
        "Doxycycline is preferred for chlamydia",
        [
          "CDC"
        ]
      ]
    ]
  },
  "Tigecycline": {
    "aw": "R",
    "warn": [
      [
        "Boxed warning: increased all-cause mortality — reserve for when alternatives are unsuitable",
        [
          "FDA_TGC"
        ]
      ]
    ],
    "note": [
      [
        "Low serum and urine levels: not for bloodstream or urinary infections",
        [
          "IDSA"
        ]
      ],
      [
        "Permanent tooth discoloration if used in the second half of pregnancy, infancy or childhood up to age 8",
        [
          "FDA_TGC"
        ]
      ]
    ]
  },
  "Ciprofloxacin/norfloxacin": {
    "aw": "W",
    "po": [
      "Ciprofloxacin 500 mg oral every 12 h = AUC of 400 mg IV every 12 h",
      [
        "SPC"
      ]
    ],
    "warn": [
      [
        "Boxed warning: tendinitis/rupture, peripheral neuropathy, CNS effects; avoid in myasthenia gravis",
        [
          "FDA_FQ"
        ]
      ]
    ]
  },
  "Levofloxacin/moxifloxacin": {
    "aw": "W",
    "po": [
      "Levofloxacin about 99% bioavailable",
      [
        "FDA_FQ"
      ]
    ],
    "warn": [
      [
        "Boxed warning: tendinitis/rupture, peripheral neuropathy, CNS effects; avoid in myasthenia gravis",
        [
          "FDA_FQ"
        ]
      ]
    ]
  },
  "Gentamicin/tobramycin/amikacin": {
    "aw": "A",
    "awx": "Access (gentamicin, amikacin); tobramycin is Watch",
    "mon": [
      [
        "Duration-dependent nephrotoxicity: monitor renal function",
        [
          "IDSA"
        ]
      ]
    ],
    "note": [
      [
        "Single-dose aminoglycoside is a preferred option for ESBL cystitis",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Colistin/polymyxin B": {
    "aw": "R",
    "mon": [
      [
        "Nephrotoxicity in about 30% of patients even with short courses: monitor renal function",
        [
          "IDSA"
        ]
      ]
    ],
    "note": [
      [
        "Polymyxin B is cleared non-renally: use colistin, not polymyxin B, for urinary infections",
        [
          "IDSA"
        ]
      ],
      [
        "Most Proteus, Providencia and Serratia strains are resistant",
        [
          "AHFS"
        ]
      ]
    ]
  },
  "Clindamycin": {
    "aw": "A",
    "po": [
      "Oral absorption virtually complete (90%)",
      [
        "SPC"
      ]
    ],
    "note": [
      [
        "Not recommended for intra-abdominal infection (B. fragilis resistance)",
        [
          "IAI"
        ]
      ]
    ]
  },
  "Vancomycin/daptomycin": {
    "aw": "W",
    "awx": "Vancomycin: Watch · Daptomycin: Reserve",
    "mon": [
      [
        "Vancomycin: AUC-guided dosing, target AUC 400–600 mg·h/L; trough-only monitoring no longer recommended",
        [
          "ASHP"
        ]
      ],
      [
        "Daptomycin: monitor CPK weekly, more often with statins or renal impairment",
        [
          "DAP"
        ]
      ]
    ],
    "note": [
      [
        "Daptomycin is not indicated for pneumonia (inactivated by pulmonary surfactant)",
        [
          "DAP"
        ]
      ],
      [
        "Oral vancomycin for C. difficile only (not absorbed)",
        [
          "CDI"
        ]
      ]
    ]
  },
  "Linezolid/tedizolid": {
    "aw": "R",
    "po": [
      "Linezolid: about 100% bioavailable — same dose IV or oral",
      [
        "FDA_LZD"
      ]
    ],
    "mon": [
      [
        "Weekly blood counts, especially beyond 2 weeks; peripheral/optic neuropathy mainly beyond 28 days",
        [
          "FDA_LZD"
        ]
      ]
    ],
    "ix": [
      [
        "Serotonin syndrome with serotonergic drugs, especially SSRIs/SNRIs; contraindicated with MAOIs",
        [
          "FDA_LZD"
        ]
      ]
    ]
  },
  "Trimethoprim-sulfamethoxazole": {
    "aw": "A",
    "po": [
      "Rapidly and well absorbed orally",
      [
        "AHFS"
      ]
    ],
    "note": [
      [
        "Preferred for ESBL cUTI if susceptible; only ~50% of ESBL urinary isolates are susceptible",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Chloramphenicol": {
    "aw": "A"
  },
  "Metronidazole": {
    "aw": "A",
    "po": [
      "IV and oral pharmacokinetics similar",
      [
        "AHFS"
      ]
    ],
    "note": [
      [
        "For C. difficile: only if fidaxomicin/vancomycin unavailable (non-severe)",
        [
          "CDI"
        ]
      ]
    ]
  },
  "Nitrofurantoin/fosfomycin": {
    "aw": "A",
    "awx": "Nitrofurantoin: Access · IV fosfomycin: Reserve",
    "note": [
      [
        "Cystitis only — not for pyelonephritis or bacteraemia step-down",
        [
          "IDSA"
        ]
      ],
      [
        "Oral fosfomycin: E. coli only (fosA genes in Klebsiella)",
        [
          "IDSA"
        ]
      ],
      [
        "IV fosfomycin has a high sodium load: caution in heart failure and the elderly",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Rifampin": {
    "aw": "W",
    "po": [
      "Well absorbed; food reduces absorption by about 30%",
      [
        "AHFS"
      ]
    ]
  },
  "Fidaxomicin": {
    "aw": "W",
    "note": [
      [
        "Preferred over oral vancomycin for initial and recurrent CDI",
        [
          "CDI"
        ]
      ]
    ]
  },
  "Ceftazidime-avibactam": {
    "aw": "R",
    "note": [
      [
        "Resistance emerges during therapy in about 10% (KPC); not active against NDM",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Meropenem-vaborbactam": {
    "aw": "R",
    "ix": [
      [
        "Valproate: combination not recommended (carbapenem class)",
        [
          "MHRA"
        ]
      ]
    ],
    "note": [
      [
        "Slightly favoured for KPC; resistance emergence under 3%",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Imipenem-relebactam": {
    "aw": "R",
    "ix": [
      [
        "Valproate: combination not recommended (carbapenem class)",
        [
          "MHRA"
        ]
      ]
    ]
  },
  "Aztreonam-avibactam": {
    "aw": "R",
    "note": [
      [
        "Preferred for NDM-producing CRE",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Cefiderocol": {
    "aw": "R",
    "note": [
      [
        "Preferred for NDM-CRE and for invasive Stenotrophomonas",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Cefepime-enmetazobactam": {
    "aw": null,
    "note": [
      [
        "AWaRe group not confirmed in the sources reviewed — check WHO list",
        [
          "WHO"
        ]
      ]
    ]
  },
  "Sulbactam-durlobactam": {
    "aw": null,
    "note": [
      [
        "Give with a carbapenem for CRAB",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Pivmecillinam (oral)": {
    "aw": null,
    "note": [
      [
        "Not active against KPC-producing organisms",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Gepotidacin (oral)": {
    "aw": null,
    "note": [
      [
        "Also active against N. gonorrhoeae: overuse may select resistance",
        [
          "IDSA"
        ]
      ]
    ]
  },
  "Aztreonam": {
    "aw": null,
    "note": [
      [
        "Limited activity against Gram-positive and anaerobic bacteria — add other agents empirically if these are possible",
        [
          "SPC"
        ]
      ],
      [
        "Can be given in penicillin or cephalosporin allergy without testing, except ceftazidime allergy (identical R1 side chain)",
        [
          "DAPP"
        ]
      ]
    ]
  },
  "Ampicillin-sulbactam (high-dose)": {
    "aw": null,
    "note": [
      [
        "Not recommended for community-acquired intra-abdominal infection: high E. coli resistance",
        [
          "IAI"
        ]
      ],
      [
        "CRAB: high-dose sulbactam plus another agent was preferred in IDSA 2023/24; IDSA 2026 prioritises sulbactam-durlobactam",
        [
          "IDSA24",
          "IDSA"
        ]
      ]
    ]
  },
  "Minocycline (high-dose)": {
    "aw": null,
    "note": [
      [
        "Off-label for S. maltophilia (alternative to co-trimoxazole) and Acinetobacter",
        [
          "AHFS"
        ]
      ]
    ]
  },
  "Ceftaroline": {
    "aw": null,
    "note": [
      [
        "Coverage from the FDA label: MRSA only for skin infections, not pneumonia",
        [
          "SPC"
        ]
      ]
    ]
  }
};

export const KEY_GAPS = [
  "entero",
  "camrsa",
  "pseudo",
  "esbl",
  "bact",
  "myco",
  "listeria"
];

export const TOOLKIT_DATA = {
  "betaLactamAllergy": [
    {
      "rule": "Unverified, non-anaphylactic penicillin allergy",
      "detail": "A cephalosporin can be given without testing or extra precautions.",
      "ref": "DAPP"
    },
    {
      "rule": "Penicillin anaphylaxis",
      "detail": "A cephalosporin with a dissimilar R1 side chain can be given without testing or extra precautions.",
      "ref": "DAPP"
    },
    {
      "rule": "Cefazolin is non-cross-reactive",
      "detail": "Can be given routinely after penicillin anaphylaxis without testing.",
      "ref": "DAPP"
    },
    {
      "rule": "Aztreonam",
      "detail": "Can be given in penicillin or cephalosporin allergy without testing — except ceftazidime allergy (identical R1 side chain).",
      "ref": "DAPP"
    },
    {
      "rule": "Carbapenems",
      "detail": "Can be given in penicillin or cephalosporin allergy without testing or extra precautions.",
      "ref": "DAPP"
    },
    {
      "rule": "Cross-reactivity mechanism",
      "detail": "Cross-reactivity between cephalosporins (and with penicillins) relates mainly to the R1 side chain, not the β-lactam ring.",
      "ref": "DAPP"
    }
  ],
  "ivToOralBioavailability": [
    [
      "Linezolid",
      "About 100% (same dose IV/oral)",
      "FDA_LZD"
    ],
    [
      "Levofloxacin",
      "About 99%",
      "FDA_FQ"
    ],
    [
      "Isavuconazole",
      "98% (same dose IV/oral)",
      "SPC"
    ],
    [
      "Voriconazole",
      "About 96% (1 h before/after food)",
      "AHFS"
    ],
    [
      "Fluconazole",
      "Over 90%",
      "SPC"
    ],
    [
      "Clindamycin",
      "90% (virtually complete)",
      "SPC"
    ],
    [
      "Doxycycline",
      "90–100% (fasting)",
      "AHFS"
    ],
    [
      "Amoxicillin",
      "74–92%",
      "AHFS"
    ],
    [
      "Famciclovir (as penciclovir)",
      "About 77%",
      "SPC"
    ],
    [
      "Valganciclovir (as ganciclovir)",
      "About 59% (with food)",
      "SPC"
    ],
    [
      "Valaciclovir (as aciclovir)",
      "About 55% (oral aciclovir 10–20%)",
      "SPC"
    ],
    [
      "Clarithromycin",
      "50–55%",
      "AHFS"
    ],
    [
      "Cefuroxime axetil",
      "37% fasting, 52% with food",
      "SPC"
    ],
    [
      "Azithromycin",
      "38%",
      "SPC"
    ],
    [
      "Ciprofloxacin",
      "500 mg oral q12h = AUC of 400 mg IV q12h",
      "SPC"
    ],
    [
      "Metronidazole",
      "IV and oral pharmacokinetics similar",
      "AHFS"
    ],
    [
      "TMP-SMX",
      "Rapidly and well absorbed",
      "AHFS"
    ],
    [
      "Rifampicin",
      "Well absorbed; food reduces absorption ~30%",
      "AHFS"
    ]
  ],
  "ivosCriteria": "Review within 48 h of the first IV dose, then daily. Switch when signs are improving, temperature 36–38 °C for 24 h, early warning score falling (WCC/CRP trending down), gut functioning with safe swallow, no vomiting in 24 h, and a suitable oral option exists. Needs special consideration: bloodstream infection, empyema, endocarditis, meningitis, osteomyelitis, severe/necrotising soft-tissue infection, septic arthritis, undrained abscess.",
  "antifungalTdmTargets": [
    [
      "Voriconazole",
      "Trough ≥1 mg/L (≥2 mg/L suggested for invasive aspergillosis); keep below 5.5 mg/L, or below 4 mg/L in Asian patients. First level on day 3 (day 5 in Asian patients if possible)",
      "JTDM"
    ],
    [
      "Posaconazole, itraconazole",
      "TDM recommended once at steady state — use the HMC laboratory target range",
      "ASP16"
    ],
    [
      "Flucytosine",
      "Prolonged levels above 100 mcg/mL are linked to toxicity",
      "SPC"
    ]
  ],
  "azoleInteractions": [
    {
      "drug": "Voriconazole",
      "detail": "When starting, cut tacrolimus to one-third and ciclosporin to one-half, then monitor levels. Contraindicated with rifampicin, rifabutin, carbamazepine, long-acting barbiturates, St John's wort, sirolimus and ergots.",
      "ref": "SPC"
    },
    {
      "drug": "Posaconazole",
      "detail": "Tacrolimus to about one-third and ciclosporin to about three-quarters. Contraindicated with sirolimus, ergots and CYP3A4-metabolised statins.",
      "ref": "SPC"
    },
    {
      "drug": "Isavuconazole",
      "detail": "Moderate CYP3A4 inhibitor — monitor tacrolimus, ciclosporin and sirolimus; shortens QTc.",
      "ref": "SPC"
    },
    {
      "drug": "Fluconazole",
      "detail": "Moderate CYP2C9/3A4 and strong CYP2C19 inhibitor — warfarin, phenytoin, sulfonylureas.",
      "ref": "SPC"
    },
    {
      "drug": "Rifampicin & Others",
      "detail": "Rifampicin lowers fluconazole, itraconazole and voriconazole levels (AHFS). Letermovir lowers voriconazole; maribavir raises tacrolimus (SPC, MBV).",
      "ref": "AHFS"
    }
  ],
  "hazardousDrugs": [
    [
      "Table 1 (Carcinogenicity risk)",
      "Ganciclovir, valganciclovir, cidofovir, chloramphenicol"
    ],
    [
      "Table 2 (Reproductive/organ toxicity)",
      "Ribavirin, voriconazole, fluconazole, zidovudine, entecavir, miltefosine"
    ]
  ],
  "glossary": [
    [
      "ESBL",
      "Extended-spectrum β-lactamase: inactivates most penicillins, cephalosporins and aztreonam; carbapenems usually still active",
      "IDSA"
    ],
    [
      "AmpC",
      "Chromosomal β-lactamase that can be induced during therapy (E. cloacae, K. aerogenes, C. freundii, H. alvei)",
      "IDSA"
    ],
    [
      "CRE",
      "Enterobacterales resistant to at least one carbapenem or producing a carbapenemase",
      "IDSA"
    ],
    [
      "KPC / OXA-48",
      "Serine carbapenemases (use an active-site serine); choose the agent by enzyme type — see IDSA Section 3",
      "IDSA"
    ],
    [
      "NDM / VIM / IMP",
      "Metallo-β-lactamases — avibactam, relebactam, vaborbactam do not inhibit them; use aztreonam-avibactam or cefiderocol",
      "IDSA"
    ],
    [
      "DTR P. aeruginosa",
      "Difficult-to-treat: not susceptible to pip-tazo, ceftazidime, cefepime, aztreonam, meropenem, imipenem, ciprofloxacin and levofloxacin",
      "IDSA"
    ],
    [
      "CRAB",
      "Carbapenem-resistant Acinetobacter baumannii",
      "IDSA"
    ],
    [
      "AUC (vancomycin)",
      "Area under the concentration–time curve over 24 h; target 400–600 mg·h/L",
      "ASHP"
    ],
    [
      "AWaRe",
      "WHO grouping: Access (first choice), Watch (higher resistance risk), Reserve (last resort)",
      "WHO"
    ],
    [
      "TDM",
      "Therapeutic drug monitoring: measuring blood levels to adjust the dose",
      "ASP16"
    ],
    [
      "ACT",
      "Artemisinin-based combination therapy: first-line treatment for uncomplicated falciparum malaria",
      "MAL"
    ],
    [
      "Radical cure",
      "Treatment that clears dormant P. vivax/ovale liver stages (primaquine or tafenoquine) to prevent relapse",
      "MAL"
    ],
    [
      "BPaLM",
      "Bedaquiline, pretomanid, linezolid and moxifloxacin: 6-month regimen for MDR/RR-TB",
      "TBW"
    ],
    [
      "DAA",
      "Direct-acting antiviral for hepatitis C (e.g. sofosbuvir/velpatasvir)",
      "HCV"
    ]
  ]
};

// Fast lookup of all organisms across all groups
const ALL_ORGS = [
  ...ORGANISMS_BASE,
  ...ORGANISMS_2026_ADDITIONS,
  ...(GROUPS.fun?.orgs || []),
  ...(GROUPS.vir?.orgs || []),
  ...(GROUPS.myc?.orgs || []),
  ...(GROUPS.par?.orgs || [])
];

export const ORGANISMS_BY_ID = Object.fromEntries(ALL_ORGS.map(o => [o.id, o]));

/**
 * Returns organisms for the active group and version
 */
export function getOrganisms(group = 'bac', version = '2026') {
  if (group !== 'bac') {
    return GROUPS[group]?.orgs || [];
  }
  return version === '2026' ? [...ORGANISMS_BASE, ...ORGANISMS_2026_ADDITIONS] : ORGANISMS_BASE;
}

/**
 * Returns drugs for the active group and version
 */
export function getDrugs(group = 'bac', version = '2026') {
  if (group !== 'bac') {
    return GROUPS[group]?.drugs || [];
  }
  return version === '2026' ? DRUGS_2026 : DRUGS_BASE;
}

/**
 * Returns the family order list for the active group
 */
export function getFamilyOrder(group = 'bac') {
  if (group === 'bac') return FAMILY_ORDER;
  return GROUPS[group]?.fams || [];
}

/**
 * Formats organism name accounting for 2026 updates
 */
export function getOrganismName(org, version = '2026') {
  if (!org) return '';
  if (version === '2026') {
    if (org.id === 'space') return 'AmpC organisms (SPACE)';
    if (org.id === 'cre') return 'CRE';
  }
  return org.n;
}

/**
 * Formats organism subtitle accounting for 2026 updates
 */
export function getOrganismSubtitle(org, version = '2026') {
  if (!org) return '';
  if (version === '2026') {
    if (org.id === 'cre') return 'Carbapenem-resistant Enterobacterales';
    if (org.id === 'space') return 'Enterobacter, K. aerogenes, Citrobacter, Serratia, Proteus, Acinetobacter';
  }
  return org.s || '';
}

/**
 * Returns short display name for organisms
 */
export function getShortName(id) {
  if (SHORT_NAMES[id]) return SHORT_NAMES[id];
  const org = ORGANISMS_BY_ID[id];
  return org ? (org.sh || org.n) : id;
}

/**
 * Returns drugs active against a specific organism
 */
export function getDrugsForOrganism(orgId, group = 'bac', version = '2026') {
  const drugs = getDrugs(group, version);
  return drugs.filter(d => d.cov && d.cov[orgId]);
}

/**
 * Formats coverage value or null
 */
export function getCoverageValue(drug, orgId) {
  if (!drug || !drug.cov) return null;
  return drug.cov[orgId] || null;
}

/**
 * Returns coverage text description
 */
export function getCoverageText(val) {
  if (!val) return '';
  if (typeof val === 'object') {
    return val.p || val.q || '';
  }
  return '';
}

/**
 * Pharmacist clinical notes for drug
 */
export function getPharmacistNotes(drugName, group = 'bac') {
  if (group === 'bac') {
    return PHARMACIST_NOTES[drugName] || {};
  }
  return GROUPS[group]?.pn?.[drugName] || {};
}

/**
 * Uncovered pathogen gaps
 */
export function getGapsForDrug(drug, group = 'bac', version = '2026') {
  if (!drug || !drug.cov) return [];
  if (group === 'bac') {
    return KEY_GAPS.filter(o => {
      const activeOrgs = getOrganisms('bac', version);
      return activeOrgs.some(x => x.id === o) && !drug.cov[o];
    }).map(o => SHORT_NAMES[o] || o);
  }
  const orgs = getOrganisms(group, version);
  return orgs.filter(o => !drug.cov[o.id]).map(o => getShortName(o.id));
}
