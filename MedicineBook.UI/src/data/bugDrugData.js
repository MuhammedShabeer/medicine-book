/**
 * Bug–Drug Navigator: Clinical Antimicrobial Spectrum & Activity Data
 * Based on McCormack, Lalji & Lau (UBC, 2019) and updated to 2026 guidance
 * (IDSA AMR Guidance 2026, EUCAST v1.2, IDSA/SHEA CDI 2021, CDC STI 2021, ASHP Vancomycin 2020)
 */

export const FAMILIES = {
  gpos: {
    id: "gpos",
    name: "Gram-positive cocci",
    badgeLabel: "Gram-positive",
    theme: {
      text: "text-violet-700 dark:text-violet-300",
      bg: "bg-violet-50 dark:bg-violet-950/40",
      border: "border-violet-200 dark:border-violet-800/60",
      activeBg: "bg-violet-100 dark:bg-violet-900/50",
      activeBorder: "border-violet-500 dark:border-violet-400",
      dot: "bg-violet-600 dark:bg-violet-400",
      ring: "border-violet-600 dark:border-violet-400",
      pill: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
    }
  },
  gpbac: {
    id: "gpbac",
    name: "Gram-positive bacilli",
    badgeLabel: "Gram-positive",
    theme: {
      text: "text-violet-700 dark:text-violet-300",
      bg: "bg-violet-50 dark:bg-violet-950/40",
      border: "border-violet-200 dark:border-violet-800/60",
      activeBg: "bg-violet-100 dark:bg-violet-900/50",
      activeBorder: "border-violet-500 dark:border-violet-400",
      dot: "bg-violet-600 dark:bg-violet-400",
      ring: "border-violet-600 dark:border-violet-400",
      pill: "bg-violet-100 text-violet-800 dark:bg-violet-900/40 dark:text-violet-300"
    }
  },
  gneg: {
    id: "gneg",
    name: "Gram-negative bacilli",
    badgeLabel: "Gram-negative",
    theme: {
      text: "text-rose-700 dark:text-rose-300",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-800/60",
      activeBg: "bg-rose-100 dark:bg-rose-900/50",
      activeBorder: "border-rose-500 dark:border-rose-400",
      dot: "bg-rose-600 dark:bg-rose-400",
      ring: "border-rose-600 dark:border-rose-400",
      pill: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
    }
  },
  gncc: {
    id: "gncc",
    name: "Gram-negative cocci",
    badgeLabel: "Gram-negative",
    theme: {
      text: "text-rose-700 dark:text-rose-300",
      bg: "bg-rose-50 dark:bg-rose-950/40",
      border: "border-rose-200 dark:border-rose-800/60",
      activeBg: "bg-rose-100 dark:bg-rose-900/50",
      activeBorder: "border-rose-500 dark:border-rose-400",
      dot: "bg-rose-600 dark:bg-rose-400",
      ring: "border-rose-600 dark:border-rose-400",
      pill: "bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300"
    }
  },
  anae: {
    id: "anae",
    name: "Anaerobes",
    badgeLabel: "Anaerobes",
    theme: {
      text: "text-amber-800 dark:text-amber-300",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-200 dark:border-amber-800/60",
      activeBg: "bg-amber-100 dark:bg-amber-900/50",
      activeBorder: "border-amber-500 dark:border-amber-400",
      dot: "bg-amber-600 dark:bg-amber-400",
      ring: "border-amber-600 dark:border-amber-400",
      pill: "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
    }
  },
  atyp: {
    id: "atyp",
    name: "Atypicals",
    badgeLabel: "Atypicals",
    theme: {
      text: "text-teal-700 dark:text-teal-300",
      bg: "bg-teal-50 dark:bg-teal-950/40",
      border: "border-teal-200 dark:border-teal-800/60",
      activeBg: "bg-teal-100 dark:bg-teal-900/50",
      activeBorder: "border-teal-500 dark:border-teal-400",
      dot: "bg-teal-600 dark:bg-teal-400",
      ring: "border-teal-600 dark:border-teal-400",
      pill: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300"
    }
  }
};

export const FAMILY_ORDER = ["gpos", "gpbac", "gneg", "gncc", "anae", "atyp"];

export const ORGANISMS_BASE = [
  { id: "strep", f: "gpos", n: "Streptococci", s: "S. pneumoniae, S. pyogenes, viridans group", site: "Brain, oral, respiratory tract, heart, skin" },
  { id: "entero", f: "gpos", n: "Enterococci", s: "Group D strep", site: "Intra-abdominal, urinary tract", note: "Listed drugs are active against E. faecalis but have limited activity against E. faecium." },
  { id: "sepi", f: "gpos", n: "Staph epidermidis", s: "Coagulase-negative", site: "Skin, prosthetics", note: "Cloxacillin and clindamycin usually have under 40% activity against S. epidermidis; use depends on local susceptibility data." },
  { id: "mssa", f: "gpos", n: "Staph aureus (MSSA)", s: "Methicillin-sensitive", site: "Oral, respiratory tract, heart, skin, bones/joints" },
  { id: "camrsa", f: "gpos", n: "MRSA, community", s: "Community-acquired", site: "Oral, respiratory tract, heart, skin, bones/joints" },
  { id: "hamrsa", f: "gpos", n: "MRSA, hospital", s: "Hospital-acquired", site: "Oral, respiratory tract, heart, skin, bones/joints" },
  { id: "gnb", f: "gneg", n: "E. coli, Klebsiella, H. influenzae", s: "Non-β-lactamase producing", site: "Brain, respiratory tract, intra-abdominal, urinary tract" },
  { id: "gnbbl", f: "gneg", n: "E. coli, Klebsiella, H. influenzae", s: "β-lactamase producing", site: "Brain, respiratory tract, intra-abdominal, urinary tract" },
  { id: "space", f: "gneg", n: "SPACE organisms", s: "Serratia, Proteus, Acinetobacter, Citrobacter, Enterobacter", site: "Brain, respiratory tract, intra-abdominal, urinary tract", note: "Cephalosporins have in-vitro activity against SPACE organisms but induce β-lactamase production. Tigecycline activity against Proteus and Acinetobacter depends on local susceptibility data." },
  { id: "esbl", f: "gneg", n: "ESBL E. coli, Klebsiella", s: "Extended-spectrum β-lactamase", site: "Brain, respiratory tract, intra-abdominal, urinary tract" },
  { id: "cre", f: "gneg", n: "CRE", s: "Carbapenem-resistant Enterobacteriaceae", site: "Brain, respiratory tract, intra-abdominal, urinary tract" },
  { id: "pseudo", f: "gneg", n: "Pseudomonas aeruginosa", s: "", site: "Brain, respiratory tract, intra-abdominal, urinary tract", note: "Tigecycline has no activity against Pseudomonas aeruginosa." },
  { id: "nmen", f: "gncc", n: "Neisseria meningitidis", s: "", site: "Brain" },
  { id: "ngon", f: "gncc", n: "Neisseria gonorrhoeae", s: "", site: "Pelvic inflammatory disease / STI" },
  { id: "pepto", f: "anae", n: "Above the diaphragm", s: "Peptostreptococcus", site: "Oral, respiratory tract" },
  { id: "bact", f: "anae", n: "Below the diaphragm", s: "Bacteroides sp.", site: "Intra-abdominal, pelvic inflammatory disease" },
  { id: "cdiff", f: "anae", n: "Clostridioides difficile", s: "", site: "Intra-abdominal" },
  { id: "myco", f: "atyp", n: "Mycoplasma, Chlamydophila", s: "M. pneumoniae, Chlamydophila spp.", site: "Respiratory tract" },
  { id: "legion", f: "atyp", n: "Legionella pneumophila", s: "", site: "Respiratory tract" },
  { id: "chlam", f: "atyp", n: "Chlamydia trachomatis", s: "", site: "Pelvic inflammatory disease / STI" }
];

export const ORGANISMS_2026_ADDITIONS = [
  { id: "vre", f: "gpos", n: "VRE", s: "Vancomycin-resistant Enterococcus (mainly E. faecium)", site: "Hospital-acquired infections", only26: true },
  { id: "listeria", f: "gpbac", n: "Listeria monocytogenes", s: "", site: "Brain (meningitis), bloodstream; pregnancy, neonates, immunocompromised", only26: true },
  { id: "steno", f: "gneg", n: "Stenotrophomonas maltophilia", s: "", site: "Hospital-acquired, mainly respiratory tract", only26: true },
  { id: "crab", f: "gneg", n: "CRAB", s: "Carbapenem-resistant Acinetobacter baumannii", site: "Hospital-acquired: respiratory tract, bloodstream", only26: true }
];

export const SHORT_NAMES = {
  vre: "VRE",
  listeria: "Listeria",
  steno: "Stenotrophomonas",
  crab: "CRAB (Acinetobacter)",
  strep: "Streptococci",
  entero: "Enterococci",
  sepi: "S. epidermidis",
  mssa: "MSSA",
  camrsa: "MRSA, community",
  hamrsa: "MRSA, hospital",
  gnb: "E. coli/Kleb/H. flu",
  gnbbl: "Same, β-lactamase+",
  space: "AmpC group (SPACE)",
  esbl: "ESBL",
  cre: "CRE",
  pseudo: "Pseudomonas",
  nmen: "N. meningitidis",
  ngon: "N. gonorrhoeae",
  pepto: "Peptostreptococcus",
  bact: "Bacteroides",
  cdiff: "C. difficile",
  myco: "Mycoplasma/Chlamydophila",
  legion: "Legionella",
  chlam: "C. trachomatis"
};

const Q = (t) => ({ q: t });

export const DRUGS_BASE = [
  { c: "Penicillins", n: "Penicillin V/G", cov: { strep: 1, entero: 1, nmen: Q("IV penicillin G"), pepto: 1 } },
  { c: "Penicillins", n: "Amoxicillin/ampicillin", cov: { strep: 1, entero: 1, gnb: 1, nmen: Q("IV ampicillin"), pepto: 1 } },
  { c: "Penicillins", n: "Cloxacillin", cov: { sepi: Q("Often under 40% active"), mssa: 1 } },
  { c: "Penicillins", n: "Amoxicillin-clavulanate", cov: { strep: 1, entero: 1, mssa: 1, gnb: 1, gnbbl: 1, space: 1, pepto: 1 } },
  { c: "Penicillins", n: "Piperacillin-tazobactam", cov: { strep: 1, entero: 1, mssa: 1, gnb: 1, gnbbl: 1, space: 1, esbl: 1, pseudo: 1, pepto: 1, bact: 1 } },
  { c: "Cephalosporins", n: "Cefazolin/cephalexin", cov: { strep: 1, mssa: 1, gnb: 1, pepto: 1 } },
  { c: "Cephalosporins", n: "Cefuroxime", cov: { strep: 1, mssa: 1, gnb: 1, gnbbl: 1, pepto: 1 } },
  { c: "Cephalosporins", n: "Cefoxitin", cov: { strep: 1, mssa: 1, gnb: 1, gnbbl: 1, pepto: 1, bact: 1 } },
  { c: "Cephalosporins", n: "Ceftriaxone/cefotaxime", cov: { strep: 1, mssa: 1, gnb: 1, gnbbl: 1, nmen: 1, ngon: 1, pepto: 1 } },
  { c: "Cephalosporins", n: "Cefixime", cov: { strep: 1, gnb: 1, gnbbl: 1, ngon: 1 } },
  { c: "Cephalosporins", n: "Ceftazidime", cov: { gnb: 1, gnbbl: 1, pseudo: 1 } },
  { c: "Cephalosporins", n: "Ceftolozane-tazobactam", cov: { gnb: 1, gnbbl: 1, space: 1, esbl: 1, pseudo: 1, pepto: 1, bact: 1 } },
  { c: "Cephalosporins", n: "Cefepime", cov: { strep: 1, mssa: 1, gnb: 1, gnbbl: 1, space: 1, pseudo: 1, pepto: 1 } },
  { c: "Cephalosporins", n: "Ceftobiprole", cov: { strep: 1, sepi: 1, mssa: 1, camrsa: 1, hamrsa: 1, gnb: 1 } },
  { c: "Carbapenems", n: "Meropenem/imipenem/doripenem", cov: { strep: 1, entero: 1, mssa: 1, gnb: 1, gnbbl: 1, space: 1, esbl: 1, pseudo: 1, nmen: 1, pepto: 1, bact: 1 } },
  { c: "Carbapenems", n: "Ertapenem", cov: { strep: 1, mssa: 1, gnb: 1, gnbbl: 1, space: 1, esbl: 1, pepto: 1, bact: 1 } },
  { c: "Macrolides", n: "Erythromycin", cov: { strep: 1, mssa: 1, myco: 1, legion: 1, chlam: 1 } },
  { c: "Macrolides", n: "Clarithromycin/azithromycin", cov: { strep: 1, mssa: 1, gnb: Q("H. influenzae only"), ngon: Q("Azithromycin only"), myco: 1, legion: 1, chlam: Q("Azithromycin only") } },
  { c: "Tetracyclines", n: "Tetracycline/doxycycline", cov: { strep: 1, mssa: 1, camrsa: 1, gnb: Q("H. influenzae only"), pepto: 1, myco: 1, legion: 1, chlam: 1 } },
  { c: "Tetracyclines", n: "Tigecycline", cov: { strep: 1, entero: 1, sepi: 1, mssa: 1, camrsa: 1, hamrsa: 1, gnb: 1, gnbbl: 1, space: Q("Proteus, Acinetobacter: check local data"), esbl: 1, cre: 1, pepto: 1, bact: 1, myco: 1, legion: 1 } },
  { c: "Fluoroquinolones", n: "Ciprofloxacin/norfloxacin", tag: "Norfloxacin: bladder infections only", cov: { gnb: 1, gnbbl: 1, space: 1, esbl: 1, cre: 1, pseudo: 1, nmen: 1, legion: Q("Ciprofloxacin only") } },
  { c: "Fluoroquinolones", n: "Levofloxacin/moxifloxacin", cov: { strep: 1, gnb: 1, gnbbl: 1, space: 1, esbl: 1, pepto: 1, bact: Q("Moxifloxacin only"), myco: 1, legion: 1 } },
  { c: "Aminoglycosides", n: "Gentamicin/tobramycin/amikacin", cov: { gnb: 1, gnbbl: 1, space: 1, esbl: 1, cre: 1, pseudo: 1 } },
  { c: "Polymyxins", n: "Colistin/polymyxin B", cov: { gnb: 1, gnbbl: 1, space: 1, esbl: 1, pseudo: 1 } },
  { c: "Lincosamides", n: "Clindamycin", cov: { strep: 1, sepi: Q("Often under 40% active"), mssa: 1, camrsa: 1, pepto: 1, bact: 1 } },
  { c: "Glycopeptides", n: "Vancomycin/daptomycin", cov: { strep: 1, entero: 1, sepi: 1, mssa: 1, camrsa: 1, hamrsa: 1, pepto: 1, cdiff: Q("Oral vancomycin only") } },
  { c: "Oxazolidinones", n: "Linezolid/tedizolid", cov: { strep: 1, entero: 1, sepi: 1, mssa: 1, camrsa: 1, hamrsa: 1, pepto: 1 } },
  { c: "Other", n: "Trimethoprim-sulfamethoxazole", cov: { mssa: 1, camrsa: 1, gnb: 1, gnbbl: 1, space: 1, esbl: 1 } },
  { c: "Other", n: "Chloramphenicol", cov: { strep: 1, gnb: 1, gnbbl: 1, nmen: 1, ngon: 1, pepto: 1, bact: 1 } },
  { c: "Other", n: "Metronidazole", cov: { pepto: 1, bact: 1, cdiff: 1 } },
  { c: "Other", n: "Nitrofurantoin/fosfomycin", cov: { entero: Q("E. faecalis only; bladder only"), gnb: Q("Bladder infections only"), gnbbl: Q("Bladder infections only"), esbl: Q("Bladder infections only") } },
  { c: "Other", n: "Rifampin", cov: { sepi: 1, mssa: 1, camrsa: 1, hamrsa: 1, nmen: 1 } },
  { c: "Other", n: "Fidaxomicin", cov: { cdiff: 1 } }
];

export const SOURCES = {
  IDSA: "IDSA Guidance on AMR Gram-negative infections, July 2026",
  EUCAST: "EUCAST Expected Resistant Phenotypes v1.2",
  EUCASTV: "EUCAST Expected Resistant Phenotypes — confirm against table",
  IAI: "IDSA complicated intra-abdominal infection guideline",
  CDI: "IDSA/SHEA C. difficile focused update, 2021",
  CDC: "CDC STI Treatment Guidelines, 2021",
  LABEL: "Product labelling (not from the guidance reviewed) — verify locally",
  FDA_LZD: "FDA linezolid labelling and safety communication",
  VREDAP: "High-dose daptomycin for VRE (case report/review) — verify",
  LIST: "Johns Hopkins ABX Guide / IDSA meningitis guideline"
};

export const CHANGES_2026 = [
  ["Colistin/polymyxin B", "space", "remove", "Removed: Serratia and Proteus are expected to be resistant to colistin", "EUCAST"],
  ["Amoxicillin-clavulanate", "space", "remove", "Removed: AmpC organisms (Enterobacter, C. freundii) are intrinsically resistant", "IDSA"],
  ["Tigecycline", "space", "set", "Not active vs Proteus, Morganella, Providencia", "EUCASTV"],
  ["Piperacillin-tazobactam", "space", "set", "Avoid in invasive infections by moderate-risk AmpC organisms", "IDSA"],
  ["Cefepime", "space", "set", "Preferred for moderate-risk AmpC organisms (cefepime MIC ≤8)", "IDSA"],
  ["Ceftolozane-tazobactam", "space", "remove", "Removed: Not suggested for AmpC-producing Enterobacterales", "IDSA"],
  ["Piperacillin-tazobactam", "esbl", "set", "Not for ESBL outside the urinary tract; cUTI only if not critically ill and no bacteraemia", "IDSA"],
  ["Ceftolozane-tazobactam", "esbl", "set", "Active, but reserve for carbapenem-resistant organisms", "IDSA"],
  ["Nitrofurantoin/fosfomycin", "esbl", "set", "Cystitis only; oral fosfomycin for E. coli only", "IDSA"],
  ["Ciprofloxacin/norfloxacin", "cre", "set", "Only if susceptible (fewer than 20% of CRE are)", "IDSA"],
  ["Gentamicin/tobramycin/amikacin", "cre", "set", "Mainly urinary infections, if susceptible", "IDSA"],
  ["Tigecycline", "cre", "set", "Alternative only; not for bloodstream or urinary infections", "IDSA"],
  ["Clindamycin", "bact", "set", "Not recommended: rising B. fragilis resistance", "IAI"],
  ["Cefoxitin", "bact", "set", "Unreliable: rising B. fragilis resistance", "IAI"],
  ["Levofloxacin/moxifloxacin", "bact", "set", "Moxifloxacin only; rising resistance, not reliable", "IAI"],
  ["Vancomycin/daptomycin", "cdiff", "set", "Oral vancomycin: alternative to fidaxomicin", "CDI"],
  ["Fidaxomicin", "cdiff", "set", "Preferred first-line for initial and recurrent CDI", "CDI"],
  ["Metronidazole", "cdiff", "set", "Only for non-severe CDI if fidaxomicin/vancomycin unavailable", "CDI"],
  ["Clarithromycin/azithromycin", "ngon", "remove", "Removed: azithromycin no longer recommended (rising resistance)", "CDC"],
  ["Chloramphenicol", "ngon", "remove", "Removed: not a recommended gonorrhoea regimen", "CDC"],
  ["Ceftriaxone/cefotaxime", "ngon", "set", "First-line: ceftriaxone 500 mg IM single dose, monotherapy", "CDC"],
  ["Cefixime", "ngon", "set", "Alternative only if ceftriaxone unavailable; not for pharyngeal", "CDC"],
  ["Tetracycline/doxycycline", "chlam", "set", "Doxycycline 7 days is preferred", "CDC"],
  ["Clarithromycin/azithromycin", "chlam", "set", "Azithromycin: alternative; preferred in pregnancy", "CDC"]
];

export const NEW_DRUGS_2026 = [
  { c: "Newer agents (added 2026)", n: "Ceftazidime-avibactam", src: "IDSA", cov: { space: Q("Active; reserve for carbapenem resistance"), esbl: Q("Active; reserve for carbapenem resistance"), cre: Q("Preferred for KPC; not active vs NDM"), pseudo: Q("For difficult-to-treat strains") } },
  { c: "Newer agents (added 2026)", n: "Meropenem-vaborbactam", src: "IDSA", cov: { esbl: Q("Active; reserve for carbapenem resistance"), cre: Q("Preferred for KPC; not active vs NDM") } },
  { c: "Newer agents (added 2026)", n: "Imipenem-relebactam", src: "IDSA", cov: { esbl: Q("Active; reserve for carbapenem resistance"), cre: Q("Preferred for KPC; not active vs NDM"), pseudo: Q("For difficult-to-treat strains") } },
  { c: "Newer agents (added 2026)", n: "Aztreonam-avibactam", src: "IDSA", cov: { cre: Q("Preferred for NDM") } },
  { c: "Newer agents (added 2026)", n: "Cefiderocol", src: "IDSA", cov: { cre: Q("Preferred for NDM; alternative for KPC"), pseudo: Q("For difficult-to-treat strains") } },
  { c: "Newer agents (added 2026)", n: "Cefepime-enmetazobactam", src: "IDSA", cov: { esbl: Q("Alternative outside urine; option for cUTI") } },
  { c: "Newer agents (added 2026)", n: "Sulbactam-durlobactam", src: "IDSA", cov: {} },
  { c: "Newer agents (added 2026)", n: "Pivmecillinam (oral)", src: "IDSA", cov: { esbl: Q("Cystitis only") } },
  { c: "Newer agents (added 2026)", n: "Gepotidacin (oral)", src: "IDSA", cov: { esbl: Q("Cystitis only") } },
  { c: "Newer agents (added 2026)", n: "Ceftaroline", src: "LABEL", cov: { strep: 1, mssa: 1, camrsa: 1, hamrsa: 1, gnb: 1 } }
];

export const EXTRA_2026 = [
  ["Linezolid/tedizolid", "vre", "Linezolid is labelled for VRE E. faecium", "FDA_LZD"],
  ["Vancomycin/daptomycin", "vre", "Daptomycin only, high dose; vancomycin inactive", "VREDAP"],
  ["Penicillin V/G", "listeria", "IV penicillin G: preferred option", "LIST"],
  ["Amoxicillin/ampicillin", "listeria", "Ampicillin: preferred; gentamicin often added", "LIST"],
  ["Trimethoprim-sulfamethoxazole", "listeria", "Alternative", "LIST"],
  ["Meropenem/imipenem/doripenem", "listeria", "Meropenem: alternative", "LIST"],
  ["Cefiderocol", "steno", "Preferred for invasive infection", "IDSA"],
  ["Aztreonam-avibactam", "steno", "Alternative, preferably with a second agent", "IDSA"],
  ["Sulbactam-durlobactam", "crab", "Preferred, given with a carbapenem", "IDSA"],
  ["Cefiderocol", "crab", "Bridge only until sulbactam-durlobactam is available", "IDSA"]
];

export const ORG_NOTES_2026 = {
  space: "Updated 2026 (IDSA): the SPACE mnemonic oversimplifies AmpC risk. Moderate risk: Enterobacter cloacae complex, Klebsiella aerogenes, Citrobacter freundii, Hafnia alvei — prefer cefepime; avoid ceftriaxone and piperacillin-tazobactam for invasive infections. Lower risk (Serratia, Morganella, Providencia): treat according to susceptibility results. Serratia and Proteus are expected to be resistant to colistin (EUCAST).",
  esbl: "Updated 2026 (IDSA): carbapenems are preferred for ESBL infections outside the urine (meropenem or imipenem if critically ill). Avoid cefepime and cephamycins. For cystitis, nitrofurantoin, TMP-SMX, single-dose aminoglycoside, pivmecillinam or gepotidacin are preferred.",
  cre: "Updated 2026 (IDSA): choose by carbapenemase type. KPC: meropenem-vaborbactam, ceftazidime-avibactam or imipenem-relebactam. NDM: aztreonam-avibactam or cefiderocol. Colistin is only an alternative for cystitis (about 30% nephrotoxicity).",
  bact: "Updated 2026 (IDSA intra-abdominal guideline): clindamycin and cefotetan are not recommended because of rising B. fragilis resistance. Metronidazole, carbapenems and piperacillin-tazobactam remain reliable.",
  cdiff: "Updated (IDSA/SHEA 2021): fidaxomicin is preferred over oral vancomycin for initial and recurrent CDI. Metronidazole alone only for mild cases when the others are unavailable.",
  ngon: "Updated (CDC 2021): ceftriaxone 500 mg IM single dose (1 g if ≥150 kg). Add doxycycline if chlamydia is not excluded.",
  chlam: "Updated (CDC 2021): doxycycline 100 mg twice daily for 7 days is preferred; azithromycin is the alternative and is preferred in pregnancy.",
  vre: ["Vancomycin is inactive. Linezolid is labelled for VRE E. faecium; daptomycin is used at high doses (≥8 mg/kg) and has poor CSF penetration.", ["FDA_LZD", "VREDAP"]],
  listeria: ["Cephalosporins have NO activity against Listeria. Ampicillin (or IV penicillin G) is preferred, with gentamicin often added; TMP-SMX or meropenem are alternatives.", ["LIST"]],
  steno: ["Expected to be resistant to carbapenems. Cefiderocol monotherapy is now preferred for invasive infection; aztreonam-avibactam, preferably with a second agent, is an alternative. Separate infection from colonisation.", ["EUCAST", "IDSA"]],
  crab: ["Sulbactam-durlobactam (with a carbapenem) is the priority for invasive CRAB infection; other options only as a bridge until it is available.", ["IDSA"]]
};

export const REFERENCES = [
  ["UBC", "McCormack J, Lalji F. The 'Best' Antibiotic Sensitivity Chart Ever. Faculty of Pharmaceutical Sciences, UBC, Nov 2019 (original chart)", ""],
  ["IDSA", "Tamma PD, et al. IDSA 2026 Guidance on the Treatment of Antimicrobial Resistant Gram-Negative Infections (published 30 Jul 2026)", "https://www.idsociety.org/practice-guideline/amr-guidance/"],
  ["EUCAST", "EUCAST. Expected Resistant Phenotypes, v1.2 (2023)", "https://www.eucast.org/expert_rules_and_expected_phenotypes/expected_phenotypes"],
  ["IAI", "Solomkin JS, et al. IDSA/SIS Guidelines for Complicated Intra-abdominal Infection (guideline summary)", "https://eguideline.guidelinecentral.com/i/91854/7"],
  ["CDI", "Johnson S, et al. IDSA/SHEA 2021 Focused Update: Management of Clostridioides difficile Infection in Adults. Clin Infect Dis 2021;73:755-7", "https://shea-online.org/guidance/clinical-practice-guideline-by-the-infectious-diseases-society-of-america-idsa-and-society-for-healthcare-epidemiology-of-america-shea-2021-focused-update-guidelines-on-management-of-clostridioid/"],
  ["CDC", "CDC Sexually Transmitted Infections Treatment Guidelines, 2021 (summary in Am Fam Physician 2022;105:514)", "https://www.aafp.org/pubs/afp/issues/2022/0500/p514.html"],
  ["WHO", "WHO. AWaRe (Access, Watch, Reserve) classification of antibiotics, 2025", "https://www.who.int/publications/i/item/B09489"],
  ["EML", "WHO Model List of Essential Medicines 2025 — Reserve antibiotics (summary, PMC12706710)", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12706710/"],
  ["ASHP", "Rybak MJ, et al. ASHP/IDSA/PIDS/SIDP consensus: Therapeutic monitoring of vancomycin for serious MRSA infections. Am J Health-Syst Pharm 2020", "https://sidp.org/Vancomycin-Guidelines-Press-Release"],
  ["MHRA", "MHRA Drug Safety Update: Carbapenems — concomitant use with valproic acid not recommended", "https://www.gov.uk/drug-safety-update/carbapenems-concomitant-use-with-valproic-acid-not-recommended"],
  ["FDA_TGC", "FDA boxed warning: increased all-cause mortality with intravenous tigecycline (2013)", "https://mdedge.com/content/mortality-data-prompt-boxed-warning-tigecycline"],
  ["FDA_FQ", "FDA boxed warning for fluoroquinolones: tendinitis, tendon rupture, peripheral neuropathy, CNS effects, myasthenia gravis (2016)", "https://mdedge.com/content/recent-fda-boxed-warnings"],
  ["FDA_LZD", "FDA Drug Safety Communication: linezolid and serotonergic psychiatric drugs (2011); linezolid labelled indications", "https://www.drugs.com/fda-alerts/1472-0.html"],
  ["CCJM", "Cleveland Clinic Journal of Medicine review: newer agents for resistant Gram-positive infections (daptomycin in pneumonia, linezolid monitoring)", "https://www.ccjm.org/content/73/9/847.full.pdf"],
  ["DAPP", "Khan DA, et al. Drug allergy: a 2022 practice parameter update. J Allergy Clin Immunol 2022;150:1333-93 (focused summary: J Allergy Clin Immunol Pract 2023)", "https://pubmed.ncbi.nlm.nih.gov/36563781/"],
  ["SIDE", "Beta-lactam side chains and cross-reactivity handout (IDStewardship, 2025) — secondary summary of DAPP 2022", "https://www.idstewardship.com/wp-content/uploads/2017/06/Beta-lactam-side-chain-handout-6.26.2025.pdf"],
  ["AZT", "Safety of aztreonam vs ceftazidime in penicillin allergy (similar R1 side chain). Open Forum Infect Dis 2023", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10677860/"],
  ["IVPO", "Louth Hospitals Antimicrobial Guidelines: IV to oral switch therapy (bioavailability table), 2025", "https://eguides.megsupporttools.com/public/lmh/iv-to-oral-switch-therapy-2/"],
  ["IVPO2", "IV-to-oral switch review, Br J Hosp Med (bioavailability >90%: clindamycin, doxycycline, levofloxacin, linezolid, metronidazole, TMP-SMX)", "https://www.imrpress.com/journal/BJHM/87/3/10.31083/BJHM51725"],
  ["LIST", "Johns Hopkins ABX Guide: Listeria monocytogenes (cites IDSA bacterial meningitis guideline)", "https://peds.unboundmedicine.com/pedscentral/pview/Johns%20Hopkins%20ABX%20Guide/540318/all/Listeria%20Monocytogenes"],
  ["VREDAP", "Case report and review: high-dose daptomycin (≥8 mg/kg) for VRE; poor CSF penetration (PMC10654863) — verify locally", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10654863/"],
  ["UMEM", "University of Maryland EM Educational Pearls: vancomycin alternatives (daptomycin CK monitoring) — secondary source", "https://em.umaryland.edu/educational_pearls/1392/"],
  ["LABEL", "Product labelling — not from the guidance reviewed; verify against HMC formulary", ""]
];

export const REF_NUMBERS = Object.fromEntries(REFERENCES.map((r, i) => [r[0], i + 1]));

export const PHARMACIST_NOTES = {
  "Penicillin V/G": { aw: "A" },
  "Amoxicillin/ampicillin": { aw: "A", po: ["Amoxicillin/ampicillin: good oral bioavailability (50–90%)", ["IVPO2"]], note: [["Ampicillin–cephalexin and amoxicillin–cefadroxil share side chains: consider this in allergy", ["SIDE"]]] },
  "Cloxacillin": { aw: "A" },
  "Amoxicillin-clavulanate": { aw: "A", note: [["Not suggested for ESBL cystitis; not for ESBL bacteraemia step-down", ["IDSA"]]] },
  "Piperacillin-tazobactam": { aw: "W", note: [["Not suggested for ESBL infections outside the urinary tract, even if tested susceptible", ["IDSA"]], ["Suboptimal for invasive infection by moderate-risk AmpC organisms", ["IDSA"]]] },
  "Cefazolin/cephalexin": { aw: "A", note: [["Cefazolin has a unique side chain not shared with penicillins or other cephalosporins", ["SIDE"]], ["No activity against Listeria", ["LIST"]]] },
  "Cefuroxime": { aw: "W", po: ["Oral cefuroxime is NOT recommended for IV→PO switch (low bioavailability)", ["IVPO"]] },
  "Cefoxitin": { aw: "W", note: [["Cephamycins not suggested for ESBL infections", ["IDSA"]]] },
  "Ceftriaxone/cefotaxime": { aw: "W", note: [["No activity against Listeria — add ampicillin when Listeria is possible", ["LIST"]], ["Avoid for invasive infection by E. cloacae, K. aerogenes, C. freundii (AmpC)", ["IDSA"]]] },
  "Cefixime": { aw: "W" },
  "Ceftazidime": { aw: "W", note: [["Shares an R1 side chain with aztreonam", ["AZT"]]] },
  "Ceftolozane-tazobactam": { aw: "R", note: [["Reserve for carbapenem-resistant organisms; not suggested for AmpC-E", ["IDSA", "EML"]]] },
  "Cefepime": { aw: "W", note: [["Preferred for moderate-risk AmpC organisms if MIC ≤8", ["IDSA"]], ["Avoid for ESBL cUTI or invasive ESBL infection, even if susceptible", ["IDSA"]]] },
  "Ceftobiprole": { aw: "R" },
  "Meropenem/imipenem/doripenem": { aw: "W", ix: [["Valproate: carbapenems cause a rapid, large fall in valproate levels — combination not recommended; use an alternative antibiotic", ["MHRA"]]], note: [["Preferred for invasive ESBL infection (meropenem or imipenem if critically ill)", ["IDSA"]]] },
  "Ertapenem": { aw: "W", ix: [["Valproate: combination not recommended (class effect)", ["MHRA"]]], note: [["Highly protein-bound: prefer meropenem/imipenem if critically ill or albumin <2.5 g/dL", ["IDSA"]]] },
  "Erythromycin": { aw: "W" },
  "Clarithromycin/azithromycin": { aw: "W", po: ["Azithromycin/clarithromycin ~50% bioavailable but tissue levels 10–100× serum", ["IVPO2"]], note: [["Azithromycin no longer recommended for gonorrhoea", ["CDC"]]] },
  "Tetracycline/doxycycline": { aw: "A", po: ["Doxycycline: >90% bioavailable", ["IVPO2"]], note: [["Avoid doxycycline for ESBL cystitis (low urine levels)", ["IDSA"]], ["Doxycycline is preferred for chlamydia", ["CDC"]]] },
  "Tigecycline": { aw: "R", warn: [["Boxed warning: increased all-cause mortality — reserve for when alternatives are unsuitable", ["FDA_TGC"]]], note: [["Low serum and urine levels: not for bloodstream or urinary infections", ["IDSA"]], ["Can cause permanent tooth discoloration: avoid in young children and pregnancy", ["CCJM"]]] },
  "Ciprofloxacin/norfloxacin": { aw: "W", po: ["Ciprofloxacin 70–80% bioavailable; oral dose is higher (500 mg PO ≈ 400 mg IV)", ["IVPO", "IVPO2"]], warn: [["Boxed warning: tendinitis/rupture, peripheral neuropathy, CNS effects; avoid in myasthenia gravis", ["FDA_FQ"]]] },
  "Levofloxacin/moxifloxacin": { aw: "W", po: ["Levofloxacin 99–100% bioavailable", ["IVPO"]], warn: [["Boxed warning: tendinitis/rupture, peripheral neuropathy, CNS effects; avoid in myasthenia gravis", ["FDA_FQ"]]] },
  "Gentamicin/tobramycin/amikacin": { aw: "A", awx: "Access (gentamicin, amikacin); tobramycin is Watch", mon: [["Duration-dependent nephrotoxicity: monitor renal function", ["IDSA"]]], note: [["Single-dose aminoglycoside is a preferred option for ESBL cystitis", ["IDSA"]]] },
  "Colistin/polymyxin B": { aw: "R", mon: [["Nephrotoxicity in about 30% of patients even with short courses: monitor renal function", ["IDSA"]]], note: [["Polymyxin B is cleared non-renally: use colistin, not polymyxin B, for urinary infections", ["IDSA"]], ["Serratia, Proteus, Morganella are expected to be resistant", ["EUCAST"]]] },
  "Clindamycin": { aw: "A", po: ["~90% bioavailable", ["IVPO", "IVPO2"]], note: [["Not recommended for intra-abdominal infection (B. fragilis resistance)", ["IAI"]]] },
  "Vancomycin/daptomycin": { aw: "W", awx: "Vancomycin: Watch · Daptomycin: Reserve", mon: [["Vancomycin: AUC-guided dosing, target AUC 400–600 mg·h/L; trough-only monitoring no longer recommended", ["ASHP"]], ["Daptomycin: monitor CK (weekly) for myopathy", ["UMEM"]]], note: [["Daptomycin is inactivated by pulmonary surfactant — do not use for pneumonia", ["CCJM"]], ["Oral vancomycin for C. difficile only (not absorbed)", ["CDI"]]] },
  "Linezolid/tedizolid": { aw: "R", po: ["Linezolid: 100% bioavailable", ["IVPO"]], mon: [["If used for more than 2 weeks, monitor blood counts (cytopenia)", ["CCJM"]]], ix: [["Serotonin syndrome with serotonergic drugs, especially SSRIs/SNRIs; contraindicated with MAOIs", ["FDA_LZD"]]] },
  "Trimethoprim-sulfamethoxazole": { aw: "A", po: ["90–100% bioavailable", ["IVPO"]], note: [["Preferred for ESBL cUTI if susceptible; only ~50% of ESBL urinary isolates are susceptible", ["IDSA"]]] },
  "Chloramphenicol": { aw: "A" },
  "Metronidazole": { aw: "A", po: ["~100% bioavailable", ["IVPO"]], note: [["For C. difficile: only if fidaxomicin/vancomycin unavailable (non-severe)", ["CDI"]]] },
  "Nitrofurantoin/fosfomycin": { aw: "A", awx: "Nitrofurantoin: Access · IV fosfomycin: Reserve", note: [["Cystitis only — not for pyelonephritis or bacteraemia step-down", ["IDSA"]], ["Oral fosfomycin: E. coli only (fosA genes in Klebsiella)", ["IDSA"]], ["IV fosfomycin has a high sodium load: caution in heart failure and the elderly", ["IDSA"]]] },
  "Rifampin": { aw: "W", po: ["70–90% bioavailable", ["IVPO"]] },
  "Fidaxomicin": { aw: "W", note: [["Preferred over oral vancomycin for initial and recurrent CDI", ["CDI"]]] },
  "Ceftazidime-avibactam": { aw: "R", note: [["Resistance emerges during therapy in about 10% (KPC); not active against NDM", ["IDSA"]]] },
  "Meropenem-vaborbactam": { aw: "R", ix: [["Valproate: combination not recommended (carbapenem class)", ["MHRA"]]], note: [["Slightly favoured for KPC; resistance emergence under 3%", ["IDSA"]]] },
  "Imipenem-relebactam": { aw: "R", ix: [["Valproate: combination not recommended (carbapenem class)", ["MHRA"]]] },
  "Aztreonam-avibactam": { aw: "R", note: [["Preferred for NDM-producing CRE", ["IDSA"]]] },
  "Cefiderocol": { aw: "R", note: [["Preferred for NDM-CRE and for invasive Stenotrophomonas", ["IDSA"]]] },
  "Cefepime-enmetazobactam": { aw: null, note: [["AWaRe group not confirmed in the sources reviewed — check WHO list", ["WHO"]]] },
  "Sulbactam-durlobactam": { aw: null, note: [["Give with a carbapenem for CRAB", ["IDSA"]]] },
  "Pivmecillinam (oral)": { aw: null, note: [["Not active against KPC-producing organisms", ["IDSA"]]] },
  "Gepotidacin (oral)": { aw: null, note: [["Also active against N. gonorrhoeae: overuse may select resistance", ["IDSA"]]] },
  "Ceftaroline": { aw: null, note: [["Coverage entered from product labelling: verify locally", ["LABEL"]]] }
};

export const TOOLKIT_DATA = {
  allergyGuide: [
    { title: "Unconfirmed, non-anaphylactic penicillin allergy", desc: "Any cephalosporin can be given without testing or extra precautions.", ref: "DAPP" },
    { title: "Penicillin anaphylaxis", desc: "A cephalosporin with a dissimilar R1 side chain can be given without testing.", ref: "DAPP" },
    { title: "Cefazolin unique side chain", desc: "Cefazolin has a unique side chain not shared with penicillins or other cephalosporins.", ref: "SIDE" },
    { title: "Shared side chains to watch", desc: "Ampicillin–cephalexin and amoxicillin–cefadroxil; aztreonam–ceftazidime.", ref: "AZT" },
    { title: "Carbapenems", desc: "Have side chains dissimilar to other β-lactams.", ref: "SIDE" },
    { title: "Same side chain risk", desc: "About 40% cross-reactivity after an immediate (type I) reaction and about 20% after a delayed (type IV) reaction.", ref: "SIDE" }
  ],
  bioavailability: [
    { drug: "Linezolid", val: "100%", ref: "IVPO" },
    { drug: "Metronidazole", val: "~100%", ref: "IVPO" },
    { drug: "Levofloxacin", val: "99–100%", ref: "IVPO" },
    { drug: "TMP-SMX (co-trimoxazole)", val: "90–100%", ref: "IVPO" },
    { drug: "Clindamycin", val: "~90%", ref: "IVPO" },
    { drug: "Doxycycline", val: ">90%", ref: "IVPO2" },
    { drug: "Rifampin", val: "70–90%", ref: "IVPO" },
    { drug: "Ciprofloxacin", val: "70–80% (use higher oral dose)", ref: "IVPO" },
    { drug: "Amoxicillin / ampicillin", val: "50–90%", ref: "IVPO2" },
    { drug: "Azithromycin / clarithromycin", val: "~50% (high tissue levels)", ref: "IVPO2" },
    { drug: "Cefuroxime (oral)", val: "Low — not recommended for switch", ref: "IVPO", warn: true }
  ],
  glossary: [
    { term: "ESBL", def: "Extended-spectrum β-lactamase: inactivates most penicillins, cephalosporins and aztreonam; carbapenems usually still active", ref: "IDSA" },
    { term: "AmpC", def: "Chromosomal β-lactamase that can be induced during therapy (E. cloacae, K. aerogenes, C. freundii, H. alvei)", ref: "IDSA" },
    { term: "CRE", def: "Enterobacterales resistant to at least one carbapenem or producing a carbapenemase", ref: "IDSA" },
    { term: "KPC / OXA-48", def: "Serine carbapenemases (use an active-site serine); choose the agent by enzyme type — see IDSA Section 3", ref: "IDSA" },
    { term: "NDM / VIM / IMP", def: "Metallo-β-lactamases — avibactam, relebactam, vaborbactam do not inhibit them; use aztreonam-avibactam or cefiderocol", ref: "IDSA" },
    { term: "DTR P. aeruginosa", def: "Not susceptible to pip-tazo, ceftazidime, cefepime, aztreonam, meropenem, imipenem, ciprofloxacin and levofloxacin", ref: "IDSA" },
    { term: "CRAB", def: "Carbapenem-resistant Acinetobacter baumannii", ref: "IDSA" },
    { term: "AUC (vancomycin)", def: "Area under the concentration–time curve over 24 h; target 400–600 mg·h/L", ref: "ASHP" },
    { term: "AWaRe", def: "WHO grouping: Access (first choice), Watch (higher resistance risk), Reserve (last resort)", ref: "WHO" }
  ]
};

// 2026 Processed Dataset
export const DRUGS_2026 = (() => {
  const out = DRUGS_BASE.map(d => ({ ...d, cov: { ...d.cov }, chg: {} }));
  
  CHANGES_2026.forEach(([dn, o, act, t, src]) => {
    const d = out.find(x => x.n === dn);
    if (!d) return;
    if (act === "remove") {
      delete d.cov[o];
    } else {
      d.cov[o] = { q: t };
    }
    d.chg[o] = { t, src, act };
  });

  NEW_DRUGS_2026.forEach(nd => {
    const d = { ...nd, cov: { ...nd.cov }, chg: {}, isNew: true };
    Object.keys(d.cov).forEach(o => {
      d.chg[o] = { t: "New agent", src: nd.src, act: "new" };
    });
    out.push(d);
  });

  EXTRA_2026.forEach(([dn, o, t, src]) => {
    const d = out.find(x => x.n === dn);
    if (!d) return;
    d.cov[o] = { q: t };
    d.chg[o] = { t: "Added organism: " + t, src, act: "new" };
  });

  return out;
})();

export const KEY_GAPS = ["entero", "camrsa", "pseudo", "esbl", "bact", "myco", "listeria"];

/**
 * Get active organisms based on chart version ('2026' or '2019')
 */
export function getOrganisms(version = "2026") {
  return version === "2026" ? ORGANISMS_BASE.concat(ORGANISMS_2026_ADDITIONS) : ORGANISMS_BASE;
}

/**
 * Get active drugs dataset based on chart version
 */
export function getDrugs(version = "2026") {
  return version === "2026" ? DRUGS_2026 : DRUGS_BASE;
}

/**
 * Get organism display name adjusted for version
 */
export function getOrganismName(org, version = "2026") {
  if (version === "2026") {
    if (org.id === "space") return "AmpC organisms (SPACE)";
    if (org.id === "cre") return "CRE";
  }
  return org.n;
}

/**
 * Get organism display subtitle
 */
export function getOrganismSubtitle(org, version = "2026") {
  if (version === "2026") {
    if (org.id === "cre") return "Carbapenem-resistant Enterobacterales";
    if (org.id === "space") return "Enterobacter, K. aerogenes, Citrobacter, Serratia, Proteus, Acinetobacter";
  }
  return org.s;
}

/**
 * Get all drugs active against an organism
 */
export function getDrugsForOrganism(orgId, version = "2026") {
  const dataset = getDrugs(version);
  return dataset.filter(d => d.cov && d.cov[orgId]);
}
