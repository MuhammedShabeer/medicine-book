/* Bug–Drug Navigator: data + rendering. Edit the data arrays at the top to update content. */
const FAM = {
  gpos:{name:"Gram-positive cocci", c:"--gpos", bg:"--gpos-bg"},
  gpbac:{name:"Gram-positive bacilli", c:"--gpos", bg:"--gpos-bg"},
  gneg:{name:"Gram-negative bacilli", c:"--gneg", bg:"--gneg-bg"},
  gncc:{name:"Gram-negative cocci", c:"--gneg", bg:"--gneg-bg"},
  anae:{name:"Anaerobes", c:"--anae", bg:"--anae-bg"},
  atyp:{name:"Atypicals", c:"--atyp", bg:"--atyp-bg"}
};
const ORG = [
 {id:"strep",f:"gpos",n:"Streptococci",s:"S. pneumoniae, S. pyogenes, viridans group",site:"Brain, oral, respiratory tract, heart, skin"},
 {id:"entero",f:"gpos",n:"Enterococci",s:"Group D strep",site:"Intra-abdominal, urinary tract",note:"Listed drugs are active against E. faecalis but have limited activity against E. faecium."},
 {id:"sepi",f:"gpos",n:"Staph epidermidis",s:"Coagulase-negative",site:"Skin, prosthetics",note:"Cloxacillin and clindamycin usually have under 40% activity against S. epidermidis; use depends on local susceptibility data."},
 {id:"mssa",f:"gpos",n:"Staph aureus (MSSA)",s:"Methicillin-sensitive",site:"Oral, respiratory tract, heart, skin, bones/joints"},
 {id:"camrsa",f:"gpos",n:"MRSA, community",s:"Community-acquired",site:"Oral, respiratory tract, heart, skin, bones/joints"},
 {id:"hamrsa",f:"gpos",n:"MRSA, hospital",s:"Hospital-acquired",site:"Oral, respiratory tract, heart, skin, bones/joints"},
 {id:"gnb",f:"gneg",n:"E. coli, Klebsiella, H. influenzae",s:"Non-β-lactamase producing",site:"Brain, respiratory tract, intra-abdominal, urinary tract"},
 {id:"gnbbl",f:"gneg",n:"E. coli, Klebsiella, H. influenzae",s:"β-lactamase producing",site:"Brain, respiratory tract, intra-abdominal, urinary tract"},
 {id:"space",f:"gneg",n:"SPACE organisms",s:"Serratia, Proteus, Acinetobacter, Citrobacter, Enterobacter",site:"Brain, respiratory tract, intra-abdominal, urinary tract",note:"Cephalosporins have in-vitro activity against SPACE organisms but induce β-lactamase production. Tigecycline activity against Proteus and Acinetobacter depends on local susceptibility data."},
 {id:"esbl",f:"gneg",n:"ESBL E. coli, Klebsiella",s:"Extended-spectrum β-lactamase",site:"Brain, respiratory tract, intra-abdominal, urinary tract"},
 {id:"cre",f:"gneg",n:"CRE",s:"Carbapenem-resistant Enterobacteriaceae",site:"Brain, respiratory tract, intra-abdominal, urinary tract"},
 {id:"pseudo",f:"gneg",n:"Pseudomonas aeruginosa",s:"",site:"Brain, respiratory tract, intra-abdominal, urinary tract",note:"Tigecycline has no activity against Pseudomonas aeruginosa."},
 {id:"nmen",f:"gncc",n:"Neisseria meningitidis",s:"",site:"Brain"},
 {id:"ngon",f:"gncc",n:"Neisseria gonorrhoeae",s:"",site:"Pelvic inflammatory disease / STI"},
 {id:"pepto",f:"anae",n:"Above the diaphragm",s:"Peptostreptococcus",site:"Oral, respiratory tract"},
 {id:"bact",f:"anae",n:"Below the diaphragm",s:"Bacteroides sp.",site:"Intra-abdominal, pelvic inflammatory disease"},
 {id:"cdiff",f:"anae",n:"Clostridioides difficile",s:"",site:"Intra-abdominal"},
 {id:"myco",f:"atyp",n:"Mycoplasma, Chlamydophila",s:"M. pneumoniae, Chlamydophila spp.",site:"Respiratory tract"},
 {id:"legion",f:"atyp",n:"Legionella pneumophila",s:"",site:"Respiratory tract"},
 {id:"chlam",f:"atyp",n:"Chlamydia trachomatis",s:"",site:"Pelvic inflammatory disease / STI"}
];
const Q = (t)=>({q:t});
const DRUG = [
 {c:"Penicillins",n:"Penicillin V/G",cov:{strep:1,entero:1,nmen:Q("IV penicillin G"),pepto:1}},
 {c:"Penicillins",n:"Amoxicillin/ampicillin",cov:{strep:1,entero:1,gnb:1,nmen:Q("IV ampicillin"),pepto:1}},
 {c:"Penicillins",n:"Cloxacillin",cov:{sepi:Q("Often under 40% active"),mssa:1}},
 {c:"Penicillins",n:"Amoxicillin-clavulanate",cov:{strep:1,entero:1,mssa:1,gnb:1,gnbbl:1,space:1,pepto:1}},
 {c:"Penicillins",n:"Piperacillin-tazobactam",cov:{strep:1,entero:1,mssa:1,gnb:1,gnbbl:1,space:1,esbl:1,pseudo:1,pepto:1,bact:1}},
 {c:"Cephalosporins",n:"Cefazolin/cephalexin",cov:{strep:1,mssa:1,gnb:1,pepto:1}},
 {c:"Cephalosporins",n:"Cefuroxime",cov:{strep:1,mssa:1,gnb:1,gnbbl:1,pepto:1}},
 {c:"Cephalosporins",n:"Cefoxitin",cov:{strep:1,mssa:1,gnb:1,gnbbl:1,pepto:1,bact:1}},
 {c:"Cephalosporins",n:"Ceftriaxone/cefotaxime",cov:{strep:1,mssa:1,gnb:1,gnbbl:1,nmen:1,ngon:1,pepto:1}},
 {c:"Cephalosporins",n:"Cefixime",cov:{strep:1,gnb:1,gnbbl:1,ngon:1}},
 {c:"Cephalosporins",n:"Ceftazidime",cov:{gnb:1,gnbbl:1,pseudo:1}},
 {c:"Cephalosporins",n:"Ceftolozane-tazobactam",cov:{gnb:1,gnbbl:1,space:1,esbl:1,pseudo:1,pepto:1,bact:1}},
 {c:"Cephalosporins",n:"Cefepime",cov:{strep:1,mssa:1,gnb:1,gnbbl:1,space:1,pseudo:1,pepto:1}},
 {c:"Cephalosporins",n:"Ceftobiprole",cov:{strep:1,sepi:1,mssa:1,camrsa:1,hamrsa:1,gnb:1}},
 {c:"Carbapenems",n:"Meropenem/imipenem/doripenem",cov:{strep:1,entero:1,mssa:1,gnb:1,gnbbl:1,space:1,esbl:1,pseudo:1,nmen:1,pepto:1,bact:1}},
 {c:"Carbapenems",n:"Ertapenem",cov:{strep:1,mssa:1,gnb:1,gnbbl:1,space:1,esbl:1,pepto:1,bact:1}},
 {c:"Macrolides",n:"Erythromycin",cov:{strep:1,mssa:1,myco:1,legion:1,chlam:1}},
 {c:"Macrolides",n:"Clarithromycin/azithromycin",cov:{strep:1,mssa:1,gnb:Q("H. influenzae only"),ngon:Q("Azithromycin only"),myco:1,legion:1,chlam:Q("Azithromycin only")}},
 {c:"Tetracyclines",n:"Tetracycline/doxycycline",cov:{strep:1,mssa:1,camrsa:1,gnb:Q("H. influenzae only"),pepto:1,myco:1,legion:1,chlam:1}},
 {c:"Tetracyclines",n:"Tigecycline",cov:{strep:1,entero:1,sepi:1,mssa:1,camrsa:1,hamrsa:1,gnb:1,gnbbl:1,space:Q("Proteus, Acinetobacter: check local data"),esbl:1,cre:1,pepto:1,bact:1,myco:1,legion:1}},
 {c:"Fluoroquinolones",n:"Ciprofloxacin/norfloxacin",tag:"Norfloxacin: bladder infections only",cov:{gnb:1,gnbbl:1,space:1,esbl:1,cre:1,pseudo:1,nmen:1,legion:Q("Ciprofloxacin only")}},
 {c:"Fluoroquinolones",n:"Levofloxacin/moxifloxacin",cov:{strep:1,gnb:1,gnbbl:1,space:1,esbl:1,pepto:1,bact:Q("Moxifloxacin only"),myco:1,legion:1}},
 {c:"Aminoglycosides",n:"Gentamicin/tobramycin/amikacin",cov:{gnb:1,gnbbl:1,space:1,esbl:1,cre:1,pseudo:1}},
 {c:"Polymyxins",n:"Colistin/polymyxin B",cov:{gnb:1,gnbbl:1,space:1,esbl:1,pseudo:1}},
 {c:"Lincosamides",n:"Clindamycin",cov:{strep:1,sepi:Q("Often under 40% active"),mssa:1,camrsa:1,pepto:1,bact:1}},
 {c:"Glycopeptides",n:"Vancomycin/daptomycin",cov:{strep:1,entero:1,sepi:1,mssa:1,camrsa:1,hamrsa:1,pepto:1,cdiff:Q("Oral vancomycin only")}},
 {c:"Oxazolidinones",n:"Linezolid/tedizolid",cov:{strep:1,entero:1,sepi:1,mssa:1,camrsa:1,hamrsa:1,pepto:1}},
 {c:"Other",n:"Trimethoprim-sulfamethoxazole",cov:{mssa:1,camrsa:1,gnb:1,gnbbl:1,space:1,esbl:1}},
 {c:"Other",n:"Chloramphenicol",cov:{strep:1,gnb:1,gnbbl:1,nmen:1,ngon:1,pepto:1,bact:1}},
 {c:"Other",n:"Metronidazole",cov:{pepto:1,bact:1,cdiff:1}},
 {c:"Other",n:"Nitrofurantoin/fosfomycin",cov:{entero:Q("E. faecalis only; bladder only"),gnb:Q("Bladder infections only"),gnbbl:Q("Bladder infections only"),esbl:Q("Bladder infections only")}},
 {c:"Other",n:"Rifampin",cov:{sepi:1,mssa:1,camrsa:1,hamrsa:1,nmen:1}},
 {c:"Other",n:"Fidaxomicin",cov:{cdiff:1}}
];
const SHORT={vre:"VRE",listeria:"Listeria",steno:"Stenotrophomonas",crab:"CRAB (Acinetobacter)",strep:"Streptococci",entero:"Enterococci",sepi:"S. epidermidis",mssa:"MSSA",camrsa:"MRSA, community",hamrsa:"MRSA, hospital",gnb:"E. coli/Kleb/H. flu",gnbbl:"Same, β-lactamase+",space:"AmpC group (SPACE)",esbl:"ESBL",cre:"CRE",pseudo:"Pseudomonas",nmen:"N. meningitidis",ngon:"N. gonorrhoeae",pepto:"Peptostreptococcus",bact:"Bacteroides",cdiff:"C. difficile",myco:"Mycoplasma/Chlamydophila",legion:"Legionella",chlam:"C. trachomatis"};
const SRC={
 IDSA:"IDSA Guidance on AMR Gram-negative infections, July 2026",
 EUCAST:"EUCAST Expected Resistant Phenotypes v1.2",
 EUCASTV:"EUCAST Expected Resistant Phenotypes — confirm against the table",
 IAI:"IDSA complicated intra-abdominal infection guideline",
 CDI:"IDSA/SHEA C. difficile focused update, 2021",
 CDC:"CDC STI Treatment Guidelines, 2021",
 LABEL:"Product labelling (not from the guidance reviewed) — verify locally",
 FDA_LZD:"FDA linezolid labelling and safety communication",VREDAP:"High-dose daptomycin for VRE (case report/review) — verify",LIST:"Johns Hopkins ABX Guide / IDSA meningitis guideline"
};
/* ---- 2026 changes: [drug, org, action, text, source] ---- */
const CHANGES=[
 ["Colistin/polymyxin B","space","remove","Removed: Serratia and Proteus are expected to be resistant to colistin","EUCAST"],
 ["Amoxicillin-clavulanate","space","remove","Removed: AmpC organisms (Enterobacter, C. freundii) are intrinsically resistant","IDSA"],
 ["Tigecycline","space","set","Not active vs Proteus, Morganella, Providencia","EUCASTV"],
 ["Piperacillin-tazobactam","space","set","Avoid in invasive infections by moderate-risk AmpC organisms","IDSA"],
 ["Cefepime","space","set","Preferred for moderate-risk AmpC organisms (cefepime MIC ≤8)","IDSA"],
 ["Ceftolozane-tazobactam","space","remove","Removed: Not suggested for AmpC-producing Enterobacterales","IDSA"],
 ["Piperacillin-tazobactam","esbl","set","Not for ESBL outside the urinary tract; cUTI only if not critically ill and no bacteraemia","IDSA"],
 ["Ceftolozane-tazobactam","esbl","set","Active, but reserve for carbapenem-resistant organisms","IDSA"],
 ["Nitrofurantoin/fosfomycin","esbl","set","Cystitis only; oral fosfomycin for E. coli only","IDSA"],
 ["Ciprofloxacin/norfloxacin","cre","set","Only if susceptible (fewer than 20% of CRE are)","IDSA"],
 ["Gentamicin/tobramycin/amikacin","cre","set","Mainly urinary infections, if susceptible","IDSA"],
 ["Tigecycline","cre","set","Alternative only; not for bloodstream or urinary infections","IDSA"],
 ["Clindamycin","bact","set","Not recommended: rising B. fragilis resistance","IAI"],
 ["Cefoxitin","bact","set","Unreliable: rising B. fragilis resistance","IAI"],
 ["Levofloxacin/moxifloxacin","bact","set","Moxifloxacin only; rising resistance, not reliable","IAI"],
 ["Vancomycin/daptomycin","cdiff","set","Oral vancomycin: alternative to fidaxomicin","CDI"],
 ["Fidaxomicin","cdiff","set","Preferred first-line for initial and recurrent CDI","CDI"],
 ["Metronidazole","cdiff","set","Only for non-severe CDI if fidaxomicin/vancomycin unavailable","CDI"],
 ["Clarithromycin/azithromycin","ngon","remove","Removed: azithromycin no longer recommended (rising resistance)","CDC"],
 ["Chloramphenicol","ngon","remove","Removed: not a recommended gonorrhoea regimen","CDC"],
 ["Ceftriaxone/cefotaxime","ngon","set","First-line: ceftriaxone 500 mg IM single dose, monotherapy","CDC"],
 ["Cefixime","ngon","set","Alternative only if ceftriaxone unavailable; not for pharyngeal","CDC"],
 ["Tetracycline/doxycycline","chlam","set","Doxycycline 7 days is preferred","CDC"],
 ["Clarithromycin/azithromycin","chlam","set","Azithromycin: alternative; preferred in pregnancy","CDC"]
];
const NEWDRUGS=[
 {c:"Newer agents (added 2026)",n:"Ceftazidime-avibactam",src:"IDSA",cov:{space:Q("Active; reserve for carbapenem resistance"),esbl:Q("Active; reserve for carbapenem resistance"),cre:Q("Preferred for KPC; not active vs NDM"),pseudo:Q("For difficult-to-treat strains")}},
 {c:"Newer agents (added 2026)",n:"Meropenem-vaborbactam",src:"IDSA",cov:{esbl:Q("Active; reserve for carbapenem resistance"),cre:Q("Preferred for KPC; not active vs NDM")}},
 {c:"Newer agents (added 2026)",n:"Imipenem-relebactam",src:"IDSA",cov:{esbl:Q("Active; reserve for carbapenem resistance"),cre:Q("Preferred for KPC; not active vs NDM"),pseudo:Q("For difficult-to-treat strains")}},
 {c:"Newer agents (added 2026)",n:"Aztreonam-avibactam",src:"IDSA",cov:{cre:Q("Preferred for NDM")}},
 {c:"Newer agents (added 2026)",n:"Cefiderocol",src:"IDSA",cov:{cre:Q("Preferred for NDM; alternative for KPC"),pseudo:Q("For difficult-to-treat strains")}},
 {c:"Newer agents (added 2026)",n:"Cefepime-enmetazobactam",src:"IDSA",cov:{esbl:Q("Alternative outside urine; option for cUTI")}},
 {c:"Newer agents (added 2026)",n:"Sulbactam-durlobactam",src:"IDSA",cov:{}},
 {c:"Newer agents (added 2026)",n:"Pivmecillinam (oral)",src:"IDSA",cov:{esbl:Q("Cystitis only")}},
 {c:"Newer agents (added 2026)",n:"Gepotidacin (oral)",src:"IDSA",cov:{esbl:Q("Cystitis only")}},
 {c:"Newer agents (added 2026)",n:"Ceftaroline",src:"LABEL",cov:{strep:1,mssa:1,camrsa:1,hamrsa:1,gnb:1}}
];
const ORGNOTE26={
 space:"Updated 2026 (IDSA): the SPACE mnemonic oversimplifies AmpC risk. Moderate risk: Enterobacter cloacae complex, Klebsiella aerogenes, Citrobacter freundii, Hafnia alvei — prefer cefepime; avoid ceftriaxone and piperacillin-tazobactam for invasive infections. Lower risk (Serratia, Morganella, Providencia): treat according to susceptibility results. Serratia and Proteus are expected to be resistant to colistin (EUCAST).",
 esbl:"Updated 2026 (IDSA): carbapenems are preferred for ESBL infections outside the urine (meropenem or imipenem if critically ill). Avoid cefepime and cephamycins. For cystitis, nitrofurantoin, TMP-SMX, single-dose aminoglycoside, pivmecillinam or gepotidacin are preferred.",
 cre:"Updated 2026 (IDSA): choose by carbapenemase type. KPC: meropenem-vaborbactam, ceftazidime-avibactam or imipenem-relebactam. NDM: aztreonam-avibactam or cefiderocol. Colistin is only an alternative for cystitis (about 30% nephrotoxicity).",
 bact:"Updated 2026 (IDSA intra-abdominal guideline): clindamycin and cefotetan are not recommended because of rising B. fragilis resistance. Metronidazole, carbapenems and piperacillin-tazobactam remain reliable.",
 cdiff:"Updated (IDSA/SHEA 2021): fidaxomicin is preferred over oral vancomycin for initial and recurrent CDI. Metronidazole alone only for mild cases when the others are unavailable.",
 ngon:"Updated (CDC 2021): ceftriaxone 500 mg IM single dose (1 g if ≥150 kg). Add doxycycline if chlamydia is not excluded.",
 chlam:"Updated (CDC 2021): doxycycline 100 mg twice daily for 7 days is preferred; azithromycin is the alternative and is preferred in pregnancy."
};

/* ---------- References (numbered in this order) ---------- */
const REFS=[
 ["UBC","McCormack J, Lalji F. The 'Best' Antibiotic Sensitivity Chart Ever. Faculty of Pharmaceutical Sciences, UBC, Nov 2019 (original chart)",""],
 ["IDSA","Tamma PD, et al. IDSA 2026 Guidance on the Treatment of Antimicrobial Resistant Gram-Negative Infections (published 30 Jul 2026)","https://www.idsociety.org/practice-guideline/amr-guidance/"],
 ["EUCAST","EUCAST. Expected Resistant Phenotypes, v1.2 (2023)","https://www.eucast.org/expert_rules_and_expected_phenotypes/expected_phenotypes"],
 ["IAI","Solomkin JS, et al. IDSA/SIS Guidelines for Complicated Intra-abdominal Infection (guideline summary)","https://eguideline.guidelinecentral.com/i/91854/7"],
 ["CDI","Johnson S, et al. IDSA/SHEA 2021 Focused Update: Management of Clostridioides difficile Infection in Adults. Clin Infect Dis 2021;73:755-7","https://shea-online.org/guidance/clinical-practice-guideline-by-the-infectious-diseases-society-of-america-idsa-and-society-for-healthcare-epidemiology-of-america-shea-2021-focused-update-guidelines-on-management-of-clostridioid/"],
 ["CDC","CDC Sexually Transmitted Infections Treatment Guidelines, 2021 (summary in Am Fam Physician 2022;105:514)","https://www.aafp.org/pubs/afp/issues/2022/0500/p514.html"],
 ["WHO","WHO. AWaRe (Access, Watch, Reserve) classification of antibiotics, 2025","https://www.who.int/publications/i/item/B09489"],
 ["EML","WHO Model List of Essential Medicines 2025 — Reserve antibiotics (summary, PMC12706710)","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC12706710/"],
 ["ASHP","Rybak MJ, et al. ASHP/IDSA/PIDS/SIDP consensus: Therapeutic monitoring of vancomycin for serious MRSA infections. Am J Health-Syst Pharm 2020","https://sidp.org/Vancomycin-Guidelines-Press-Release"],
 ["MHRA","MHRA Drug Safety Update: Carbapenems — concomitant use with valproic acid not recommended","https://www.gov.uk/drug-safety-update/carbapenems-concomitant-use-with-valproic-acid-not-recommended"],
 ["FDA_TGC","FDA boxed warning: increased all-cause mortality with intravenous tigecycline (2013)","https://mdedge.com/content/mortality-data-prompt-boxed-warning-tigecycline"],
 ["FDA_FQ","FDA boxed warning for fluoroquinolones: tendinitis, tendon rupture, peripheral neuropathy, CNS effects, myasthenia gravis (2016)","https://mdedge.com/content/recent-fda-boxed-warnings"],
 ["FDA_LZD","FDA Drug Safety Communication: linezolid and serotonergic psychiatric drugs (2011); linezolid labelled indications","https://www.drugs.com/fda-alerts/1472-0.html"],
 ["CCJM","Cleveland Clinic Journal of Medicine review: newer agents for resistant Gram-positive infections (daptomycin in pneumonia, linezolid monitoring)","https://www.ccjm.org/content/73/9/847.full.pdf"],
 ["DAPP","Khan DA, et al. Drug allergy: a 2022 practice parameter update. J Allergy Clin Immunol 2022;150:1333-93 (focused summary: J Allergy Clin Immunol Pract 2023)","https://pubmed.ncbi.nlm.nih.gov/36563781/"],
 ["SIDE","Beta-lactam side chains and cross-reactivity handout (IDStewardship, 2025) — secondary summary of DAPP 2022","https://www.idstewardship.com/wp-content/uploads/2017/06/Beta-lactam-side-chain-handout-6.26.2025.pdf"],
 ["AZT","Safety of aztreonam vs ceftazidime in penicillin allergy (similar R1 side chain). Open Forum Infect Dis 2023","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10677860/"],
 ["IVPO","Louth Hospitals Antimicrobial Guidelines: IV to oral switch therapy (bioavailability table), 2025","https://eguides.megsupporttools.com/public/lmh/iv-to-oral-switch-therapy-2/"],
 ["IVPO2","IV-to-oral switch review, Br J Hosp Med (bioavailability >90%: clindamycin, doxycycline, levofloxacin, linezolid, metronidazole, TMP-SMX)","https://www.imrpress.com/journal/BJHM/87/3/10.31083/BJHM51725"],
 ["LIST","Johns Hopkins ABX Guide: Listeria monocytogenes (cites IDSA bacterial meningitis guideline)","https://peds.unboundmedicine.com/pedscentral/pview/Johns%20Hopkins%20ABX%20Guide/540318/all/Listeria%20Monocytogenes"],
 ["VREDAP","Case report and review: high-dose daptomycin (≥8 mg/kg) for VRE; poor CSF penetration (PMC10654863) — verify locally","https://www.ncbi.nlm.nih.gov/pmc/articles/PMC10654863/"],
 ["UMEM","University of Maryland EM Educational Pearls: vancomycin alternatives (daptomycin CK monitoring) — secondary source","https://em.umaryland.edu/educational_pearls/1392/"],
 ["LABEL","Product labelling — not from the guidance reviewed; verify against HMC formulary",""]
];
const REFNUM=Object.fromEntries(REFS.map((r,i)=>[r[0],i+1]));
const cite=k=>`<sup class="ref" title="${esc(REFS[REFNUM[k]-1][1])}">[${REFNUM[k]}]</sup>`;
const cites=ks=>ks.map(cite).join("");

/* ---------- Organisms added in 2026 view ---------- */
const ORG26=[
 {id:"vre",f:"gpos",n:"VRE",s:"Vancomycin-resistant Enterococcus (mainly E. faecium)",site:"Hospital-acquired infections",only26:1},
 {id:"listeria",f:"gpbac",n:"Listeria monocytogenes",s:"",site:"Brain (meningitis), bloodstream; pregnancy, neonates, immunocompromised",only26:1},
 {id:"steno",f:"gneg",n:"Stenotrophomonas maltophilia",s:"",site:"Hospital-acquired, mainly respiratory tract",only26:1},
 {id:"crab",f:"gneg",n:"CRAB",s:"Carbapenem-resistant Acinetobacter baumannii",site:"Hospital-acquired: respiratory tract, bloodstream",only26:1}
];
Object.assign(ORGNOTE26,{
 vre:["Vancomycin is inactive. Linezolid is labelled for VRE E. faecium; daptomycin is used at high doses (≥8 mg/kg) and has poor CSF penetration.",["FDA_LZD","VREDAP"]],
 listeria:["Cephalosporins have NO activity against Listeria. Ampicillin (or IV penicillin G) is preferred, with gentamicin often added; TMP-SMX or meropenem are alternatives.",["LIST"]],
 steno:["Expected to be resistant to carbapenems. Cefiderocol monotherapy is now preferred for invasive infection; aztreonam-avibactam, preferably with a second agent, is an alternative. Separate infection from colonisation.",["EUCAST","IDSA"]],
 crab:["Sulbactam-durlobactam (with a carbapenem) is the priority for invasive CRAB infection; other options only as a bridge until it is available.",["IDSA"]]
});
const EXTRA=[
 ["Linezolid/tedizolid","vre","Linezolid is labelled for VRE E. faecium","FDA_LZD"],
 ["Vancomycin/daptomycin","vre","Daptomycin only, high dose; vancomycin inactive","VREDAP"],
 ["Penicillin V/G","listeria","IV penicillin G: preferred option","LIST"],
 ["Amoxicillin/ampicillin","listeria","Ampicillin: preferred; gentamicin often added","LIST"],
 ["Trimethoprim-sulfamethoxazole","listeria","Alternative","LIST"],
 ["Meropenem/imipenem/doripenem","listeria","Meropenem: alternative","LIST"],
 ["Cefiderocol","steno","Preferred for invasive infection","IDSA"],
 ["Aztreonam-avibactam","steno","Alternative, preferably with a second agent","IDSA"],
 ["Sulbactam-durlobactam","crab","Preferred, given with a carbapenem","IDSA"],
 ["Cefiderocol","crab","Bridge only until sulbactam-durlobactam is available","IDSA"]
];

/* ---------- Pharmacist notes (AWaRe, IV→PO, monitoring, interactions, warnings, notes) ---------- */
const AW={A:"Access",W:"Watch",R:"Reserve"};
const PN={
 "Penicillin V/G":{aw:"A"},
 "Amoxicillin/ampicillin":{aw:"A",po:["Amoxicillin/ampicillin: good oral bioavailability (50–90%)",["IVPO2"]],note:[["Ampicillin–cephalexin and amoxicillin–cefadroxil share side chains: consider this in allergy",["SIDE"]]]},
 "Cloxacillin":{aw:"A"},
 "Amoxicillin-clavulanate":{aw:"A",note:[["Not suggested for ESBL cystitis; not for ESBL bacteraemia step-down",["IDSA"]]]},
 "Piperacillin-tazobactam":{aw:"W",note:[["Not suggested for ESBL infections outside the urinary tract, even if tested susceptible",["IDSA"]],["Suboptimal for invasive infection by moderate-risk AmpC organisms",["IDSA"]]]},
 "Cefazolin/cephalexin":{aw:"A",note:[["Cefazolin has a unique side chain not shared with penicillins or other cephalosporins",["SIDE"]],["No activity against Listeria",["LIST"]]]},
 "Cefuroxime":{aw:"W",po:["Oral cefuroxime is NOT recommended for IV→PO switch (low bioavailability)",["IVPO"]]},
 "Cefoxitin":{aw:"W",note:[["Cephamycins not suggested for ESBL infections",["IDSA"]]]},
 "Ceftriaxone/cefotaxime":{aw:"W",note:[["No activity against Listeria — add ampicillin when Listeria is possible",["LIST"]],["Avoid for invasive infection by E. cloacae, K. aerogenes, C. freundii (AmpC)",["IDSA"]]]},
 "Cefixime":{aw:"W"},
 "Ceftazidime":{aw:"W",note:[["Shares an R1 side chain with aztreonam",["AZT"]]]},
 "Ceftolozane-tazobactam":{aw:"R",note:[["Reserve for carbapenem-resistant organisms; not suggested for AmpC-E",["IDSA","EML"]]]},
 "Cefepime":{aw:"W",note:[["Preferred for moderate-risk AmpC organisms if MIC ≤8",["IDSA"]],["Avoid for ESBL cUTI or invasive ESBL infection, even if susceptible",["IDSA"]]]},
 "Ceftobiprole":{aw:"R"},
 "Meropenem/imipenem/doripenem":{aw:"W",ix:[["Valproate: carbapenems cause a rapid, large fall in valproate levels — combination not recommended; use an alternative antibiotic",["MHRA"]]],note:[["Preferred for invasive ESBL infection (meropenem or imipenem if critically ill)",["IDSA"]]]},
 "Ertapenem":{aw:"W",ix:[["Valproate: combination not recommended (class effect)",["MHRA"]]],note:[["Highly protein-bound: prefer meropenem/imipenem if critically ill or albumin <2.5 g/dL",["IDSA"]]]},
 "Erythromycin":{aw:"W"},
 "Clarithromycin/azithromycin":{aw:"W",po:["Azithromycin/clarithromycin ~50% bioavailable but tissue levels 10–100× serum",["IVPO2"]],note:[["Azithromycin no longer recommended for gonorrhoea",["CDC"]]]},
 "Tetracycline/doxycycline":{aw:"A",po:["Doxycycline: >90% bioavailable",["IVPO2"]],note:[["Avoid doxycycline for ESBL cystitis (low urine levels)",["IDSA"]],["Doxycycline is preferred for chlamydia",["CDC"]]]},
 "Tigecycline":{aw:"R",warn:[["Boxed warning: increased all-cause mortality — reserve for when alternatives are unsuitable",["FDA_TGC"]]],note:[["Low serum and urine levels: not for bloodstream or urinary infections",["IDSA"]],["Can cause permanent tooth discoloration: avoid in young children and pregnancy",["CCJM"]]]},
 "Ciprofloxacin/norfloxacin":{aw:"W",po:["Ciprofloxacin 70–80% bioavailable; oral dose is higher (500 mg PO ≈ 400 mg IV)",["IVPO","IVPO2"]],warn:[["Boxed warning: tendinitis/rupture, peripheral neuropathy, CNS effects; avoid in myasthenia gravis",["FDA_FQ"]]]},
 "Levofloxacin/moxifloxacin":{aw:"W",po:["Levofloxacin 99–100% bioavailable",["IVPO"]],warn:[["Boxed warning: tendinitis/rupture, peripheral neuropathy, CNS effects; avoid in myasthenia gravis",["FDA_FQ"]]]},
 "Gentamicin/tobramycin/amikacin":{aw:"A",awx:"Access (gentamicin, amikacin); tobramycin is Watch",mon:[["Duration-dependent nephrotoxicity: monitor renal function",["IDSA"]]],note:[["Single-dose aminoglycoside is a preferred option for ESBL cystitis",["IDSA"]]]},
 "Colistin/polymyxin B":{aw:"R",mon:[["Nephrotoxicity in about 30% of patients even with short courses: monitor renal function",["IDSA"]]],note:[["Polymyxin B is cleared non-renally: use colistin, not polymyxin B, for urinary infections",["IDSA"]],["Serratia, Proteus, Morganella are expected to be resistant",["EUCAST"]]]},
 "Clindamycin":{aw:"A",po:["~90% bioavailable",["IVPO","IVPO2"]],note:[["Not recommended for intra-abdominal infection (B. fragilis resistance)",["IAI"]]]},
 "Vancomycin/daptomycin":{aw:"W",awx:"Vancomycin: Watch · Daptomycin: Reserve",mon:[["Vancomycin: AUC-guided dosing, target AUC 400–600 mg·h/L; trough-only monitoring no longer recommended",["ASHP"]],["Daptomycin: monitor CK (weekly) for myopathy",["UMEM"]]],note:[["Daptomycin is inactivated by pulmonary surfactant — do not use for pneumonia",["CCJM"]],["Oral vancomycin for C. difficile only (not absorbed)",["CDI"]]]},
 "Linezolid/tedizolid":{aw:"R",po:["Linezolid: 100% bioavailable",["IVPO"]],mon:[["If used for more than 2 weeks, monitor blood counts (cytopenia)",["CCJM"]]],ix:[["Serotonin syndrome with serotonergic drugs, especially SSRIs/SNRIs; contraindicated with MAOIs",["FDA_LZD"]]]},
 "Trimethoprim-sulfamethoxazole":{aw:"A",po:["90–100% bioavailable",["IVPO"]],note:[["Preferred for ESBL cUTI if susceptible; only ~50% of ESBL urinary isolates are susceptible",["IDSA"]]]},
 "Chloramphenicol":{aw:"A"},
 "Metronidazole":{aw:"A",po:["~100% bioavailable",["IVPO"]],note:[["For C. difficile: only if fidaxomicin/vancomycin unavailable (non-severe)",["CDI"]]]},
 "Nitrofurantoin/fosfomycin":{aw:"A",awx:"Nitrofurantoin: Access · IV fosfomycin: Reserve",note:[["Cystitis only — not for pyelonephritis or bacteraemia step-down",["IDSA"]],["Oral fosfomycin: E. coli only (fosA genes in Klebsiella)",["IDSA"]],["IV fosfomycin has a high sodium load: caution in heart failure and the elderly",["IDSA"]]]},
 "Rifampin":{aw:"W",po:["70–90% bioavailable",["IVPO"]]},
 "Fidaxomicin":{aw:"W",note:[["Preferred over oral vancomycin for initial and recurrent CDI",["CDI"]]]},
 "Ceftazidime-avibactam":{aw:"R",note:[["Resistance emerges during therapy in about 10% (KPC); not active against NDM",["IDSA"]]]},
 "Meropenem-vaborbactam":{aw:"R",ix:[["Valproate: combination not recommended (carbapenem class)",["MHRA"]]],note:[["Slightly favoured for KPC; resistance emergence under 3%",["IDSA"]]]},
 "Imipenem-relebactam":{aw:"R",ix:[["Valproate: combination not recommended (carbapenem class)",["MHRA"]]]},
 "Aztreonam-avibactam":{aw:"R",note:[["Preferred for NDM-producing CRE",["IDSA"]]]},
 "Cefiderocol":{aw:"R",note:[["Preferred for NDM-CRE and for invasive Stenotrophomonas",["IDSA"]]]},
 "Cefepime-enmetazobactam":{aw:null,note:[["AWaRe group not confirmed in the sources reviewed — check WHO list",["WHO"]]]},
 "Sulbactam-durlobactam":{aw:null,note:[["Give with a carbapenem for CRAB",["IDSA"]]]},
 "Pivmecillinam (oral)":{aw:null,note:[["Not active against KPC-producing organisms",["IDSA"]]]},
 "Gepotidacin (oral)":{aw:null,note:[["Also active against N. gonorrhoeae: overuse may select resistance",["IDSA"]]]},
 "Ceftaroline":{aw:null,note:[["Coverage entered from product labelling: verify locally",["LABEL"]]]}
};
const DRUG26=(()=>{
  const out=DRUG.map(d=>({...d,cov:{...d.cov},chg:{}}));
  CHANGES.forEach(([dn,o,act,t,src])=>{
    const d=out.find(x=>x.n===dn); if(!d) return;
    if(act==="remove"){delete d.cov[o];} else {d.cov[o]={q:t};}
    d.chg[o]={t,src,act};
  });
  NEWDRUGS.forEach(nd=>{const d={...nd,cov:{...nd.cov},chg:{},isNew:true};Object.keys(d.cov).forEach(o=>d.chg[o]={t:"New agent",src:nd.src,act:"new"});out.push(d)});
  EXTRA.forEach(([dn,o,t,src])=>{const d=out.find(x=>x.n===dn);if(!d)return;d.cov[o]={q:t};d.chg[o]={t:"Added organism: "+t,src,act:"new"};});
  return out;
})();
let ver="2026";
const DATA=()=>ver==="2026"?DRUG26:DRUG;
const orgName=o=>ver==="2026"&&o.id==="space"?"AmpC organisms (SPACE)":ver==="2026"&&o.id==="cre"?"CRE":o.n;
const orgSub=o=>ver==="2026"&&o.id==="cre"?"Carbapenem-resistant Enterobacterales":ver==="2026"&&o.id==="space"?"Enterobacter, K. aerogenes, Citrobacter, Serratia, Proteus, Acinetobacter":o.s;
const css=v=>`var(${v})`;
const esc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const famOrder=["gpos","gpbac","gneg","gncc","anae","atyp"];
const ORGS=()=>ver==="2026"?ORG.concat(ORG26):ORG;
const orgById=Object.fromEntries(ORG.concat(ORG26).map(o=>[o.id,o]));
const drugsFor=id=>DATA().filter(d=>d.cov[id]);
const badge=(d,o)=>ver==="2026"&&d.chg&&d.chg[o]?`<span class="upd" title="${esc(SRC[d.chg[o].src])}">2026</span>`:"";

document.getElementById("legend").innerHTML=[["gpos","Gram-positive"],["gneg","Gram-negative"],["anae","Anaerobes"],["atyp","Atypicals"]]
 .map(([f,l])=>`<span class="lg"><span class="sw" style="background:${css(FAM[f].c)}"></span>${l}</span>`).join("")+`<span class="lg"><span class="upd">2026</span>updated against current guidance</span>`;

let curOrg="space", curDrug="Meropenem/imipenem/doripenem";


const KEYGAPS=["entero","camrsa","pseudo","esbl","bact","myco","listeria"];
function pnPanel(d){
  const p=PN[d.n]||{};
  const line=(arr)=>arr.map(([t,r])=>`<li>${esc(t)}${cites(r)}</li>`).join("");
  const gaps=KEYGAPS.filter(o=>orgById[o]&&ORGS().some(x=>x.id===o)&&!d.cov[o]).map(o=>SHORT[o]);
  const awCls=p.aw?{A:"aw-a",W:"aw-w",R:"aw-r"}[p.aw]:"aw-n";
  const awTxt=p.awx||(p.aw?AW[p.aw]:"Not confirmed");
  let h=`<div class="pn"><div class="pnh"><h3>Pharmacist notes</h3><div class="pills"><span class="awp ${awCls}" title="WHO AWaRe 2025">WHO AWaRe: ${esc(awTxt)}</span>${cite(p.aw==="R"&&["Ceftolozane-tazobactam","Colistin/polymyxin B","Linezolid/tedizolid","Ceftazidime-avibactam","Meropenem-vaborbactam","Cefiderocol"].includes(d.n)?"EML":"WHO")}${p.po?`<span class="awp po">IV→PO: ${esc(p.po[0])}</span>${cites(p.po[1])}`:""}</div></div><div class="pngrid">`;
  if(p.warn) h+=`<div class="pns warn"><h4>Boxed warning</h4><ul>${line(p.warn)}</ul></div>`;
  if(p.mon) h+=`<div class="pns"><h4>Monitoring</h4><ul>${line(p.mon)}</ul></div>`;
  if(p.ix) h+=`<div class="pns"><h4>Key interactions</h4><ul>${line(p.ix)}</ul></div>`;
  if(p.note) h+=`<div class="pns"><h4>Pharmacist points</h4><ul>${line(p.note)}</ul></div>`;
  h+=`<div class="pns"><h4>Not active against (from this chart)</h4><p style="margin:0;font-size:14px">${gaps.length?gaps.map(esc).join(", "):"None of the key groups"}</p></div>`;
  return h+`</div></div>`;
}
function renderToolkit(){
  const el=document.getElementById("toolkit");
  const iv=[["Linezolid","100%","IVPO"],["Metronidazole","~100%","IVPO"],["Levofloxacin","99–100%","IVPO"],["TMP-SMX (co-trimoxazole)","90–100%","IVPO"],["Clindamycin","~90%","IVPO"],["Doxycycline",">90%","IVPO2"],["Rifampin","70–90%","IVPO"],["Ciprofloxacin","70–80% (use higher oral dose)","IVPO"],["Amoxicillin / ampicillin","50–90%","IVPO2"],["Azithromycin / clarithromycin","~50% (high tissue levels)","IVPO2"],["Cefuroxime (oral)","Low — not recommended for switch","IVPO"]];
  const gl=[["ESBL","Extended-spectrum β-lactamase: inactivates most penicillins, cephalosporins and aztreonam; carbapenems usually still active","IDSA"],["AmpC","Chromosomal β-lactamase that can be induced during therapy (E. cloacae, K. aerogenes, C. freundii, H. alvei)","IDSA"],["CRE","Enterobacterales resistant to at least one carbapenem or producing a carbapenemase","IDSA"],["KPC / OXA-48","Serine carbapenemases (use an active-site serine); choose the agent by enzyme type — see IDSA Section 3","IDSA"],["NDM / VIM / IMP","Metallo-β-lactamases — avibactam, relebactam, vaborbactam do not inhibit them; use aztreonam-avibactam or cefiderocol","IDSA"],["DTR P. aeruginosa","Not susceptible to pip-tazo, ceftazidime, cefepime, aztreonam, meropenem, imipenem, ciprofloxacin and levofloxacin","IDSA"],["CRAB","Carbapenem-resistant Acinetobacter baumannii","IDSA"],["AUC (vancomycin)","Area under the concentration–time curve over 24 h; target 400–600 mg·h/L","ASHP"],["AWaRe","WHO grouping: Access (first choice), Watch (higher resistance risk), Reserve (last resort)","WHO"]];
  el.innerHTML=`
  <div class="tk">
   <section class="panel"><h2>β-lactam allergy: quick guide</h2>
    <ol class="al">
     <li><strong>Unconfirmed, non-anaphylactic penicillin allergy:</strong> any cephalosporin can be given without testing or extra precautions.${cite("DAPP")}</li>
     <li><strong>Penicillin anaphylaxis:</strong> a cephalosporin with a dissimilar R1 side chain can be given without testing.${cite("DAPP")}</li>
     <li><strong>Cefazolin</strong> has a unique side chain not shared with penicillins or other cephalosporins.${cite("SIDE")}</li>
     <li><strong>Shared side chains to watch:</strong> ampicillin–cephalexin and amoxicillin–cefadroxil; aztreonam–ceftazidime.${cite("SIDE")}${cite("AZT")}</li>
     <li><strong>Carbapenems</strong> have side chains dissimilar to other β-lactams.${cite("SIDE")}</li>
     <li><strong>Same side chain risk:</strong> about 40% cross-reactivity after an immediate (type I) reaction and about 20% after a delayed (type IV) reaction.${cite("SIDE")}</li>
    </ol>
    <p class="fine">Follow the HMC β-lactam allergy pathway, and involve allergy/ID for any history of a severe reaction (for example SJS/TEN or DRESS).</p>
   </section>
   <section class="panel"><h2>IV → oral switch: bioavailability</h2>
    <table class="chgt" style="min-width:0"><thead><tr><th class="l">Antibiotic</th><th class="l">Oral bioavailability</th></tr></thead><tbody>${iv.map(([a,b,r])=>`<tr><td class="l"><strong>${esc(a)}</strong></td><td class="l">${esc(b)}${cite(r)}</td></tr>`).join("")}</tbody></table>
    <p class="fine">Switch criteria (COMS): Clinical improvement and afebrile 24–48 h · Oral route feasible · Markers improving · Specific infections needing prolonged IV excluded (meningitis, endocarditis, S. aureus bacteraemia, osteomyelitis, deep abscess).${cite("IVPO")}</p>
   </section>
   <section class="panel" style="grid-column:1/-1"><h2>Glossary</h2>
    <dl class="gl">${gl.map(([t,d,r])=>`<div><dt>${esc(t)}</dt><dd>${esc(d)}${cite(r)}</dd></div>`).join("")}</dl>
   </section>
  </div>`;
}
function renderRefs(){
  document.getElementById("refs").innerHTML=`<ol class="refl">${REFS.map(([k,t,u])=>`<li id="ref-${k}">${esc(t)}${u?` — <a href="${esc(u)}" target="_blank" rel="noopener">${esc(u.replace(/^https?:\/\//,"").slice(0,70))}${u.length>78?"…":""}</a>`:""}</li>`).join("")}</ol><p class="fine">Accessed 26 September 2026. Sources marked "secondary" or "verify" should be confirmed against the primary document before clinical sign-off. The IDSA AMR guidance is written for US practice; check against the HMC antibiogram and formulary.</p>`;
}
function renderOrgPanel(){
  const el=document.getElementById("orgPanel");
  el.innerHTML=famOrder.map(f=>{
    const list=ORGS().filter(o=>o.f===f); if(!list.length) return "";
    return `<div class="fam"><h3 style="color:${css(FAM[f].c)}"><span class="sw" style="background:${css(FAM[f].c)}"></span>${FAM[f].name}</h3><div class="orgs">`+
    list.map(o=>{const on=o.id===curOrg;const hasUpd=ver==="2026"&&ORGNOTE26[o.id];return `<button class="org" data-o="${o.id}" aria-pressed="${on}" style="${on?`border-color:${css(FAM[f].c)};background:${css(FAM[f].bg)}`:""}"><span>${esc(orgName(o))}${hasUpd?` <span class="upd">2026</span>`:""}${orgSub(o)?`<br><small>${esc(orgSub(o))}</small>`:""}</span><span class="count" style="background:${css(FAM[f].bg)};color:${css(FAM[f].c)}">${drugsFor(o.id).length}</span></button>`}).join("")+`</div></div>`;
  }).join("");
  el.querySelectorAll(".org").forEach(b=>b.onclick=()=>{curOrg=b.dataset.o;renderOrgPanel();renderOrgDetail();if(innerWidth<820)document.getElementById("orgDetail").scrollIntoView({behavior:"smooth"})});
}
function renderOrgDetail(){
  const o=orgById[curOrg],F=FAM[o.f],ds=drugsFor(o.id);
  const byC={};ds.forEach(d=>(byC[d.c]=byC[d.c]||[]).push(d));
  const removed=ver==="2026"?DRUG26.filter(d=>d.chg[o.id]&&d.chg[o.id].act==="remove"):[];
  const n26=ver==="2026"&&ORGNOTE26[o.id];
  document.getElementById("orgDetail").innerHTML=
  `<div class="hero" style="background:${css(F.bg)}"><div class="kicker" style="color:${css(F.c)}">${F.name}</div><h2>${esc(orgName(o))}</h2>${orgSub(o)?`<div style="margin:-4px 0 10px;color:var(--muted)">${esc(orgSub(o))}</div>`:""}
   <span class="site"><strong>Common sites:</strong> ${esc(o.site)}</span>
   ${o.note&&!(ver==="2026"&&o.id==="space")?`<div class="note">${esc(o.note)}</div>`:""}
   ${n26?`<div class="note upnote"><span class="upd">2026</span> ${Array.isArray(n26)?esc(n26[0])+cites(n26[1]):esc(n26)}</div>`:""}</div>
   <p style="margin:0 0 10px;font-weight:700">${ds.length} antibiotic options, grouped by class</p>
   <div class="classes">${Object.entries(byC).map(([c,list])=>`<div class="cls"><h4>${esc(c)}</h4>${list.map(d=>{const v=d.cov[o.id];return `<span class="drug">${esc(d.n)}${badge(d,o.id)}${(v.q||d.tag)?`<span class="qual">${esc(v.q||d.tag)}</span>`:""}</span>`}).join("")}</div>`).join("")}</div>
   ${removed.length?`<div class="cls" style="margin-top:12px;border-style:dashed"><h4>Removed in the 2026 update</h4>${removed.map(d=>`<span class="drug" style="text-decoration:line-through;color:var(--muted)">${esc(d.n)}</span><div style="font-size:13px;color:var(--muted);margin:-2px 0 6px">${esc(d.chg[o.id].t)} · ${esc(SRC[d.chg[o.id].src])}</div>`).join("")}</div>`:""}`;
}
function renderDrugList(){
  const t=document.getElementById("q").value.trim().toLowerCase();
  const el=document.getElementById("drugList");
  const list=DATA().filter(d=>!t||d.n.toLowerCase().includes(t)||d.c.toLowerCase().includes(t));
  if(!DATA().some(d=>d.n===curDrug)) curDrug="Meropenem/imipenem/doripenem";
  let lc="";
  el.innerHTML=list.length?list.map(d=>{const hd=d.c!==lc?`<div style="font-size:12px;font-weight:700;color:var(--muted);margin:10px 10px 2px">${esc(d.c)}</div>`:"";lc=d.c;const up=ver==="2026"&&d.chg&&Object.keys(d.chg).length;return hd+`<button class="dl" data-d="${esc(d.n)}" aria-pressed="${d.n===curDrug}"><span>${esc(d.n)}${up?` <span class="upd">${d.isNew?"new":"2026"}</span>`:""}</span><small>${Object.keys(d.cov).length}/${ORGS().length}</small></button>`}).join(""):`<p style="color:var(--muted);margin:8px">No antibiotic matches “${esc(t)}”. Try the class name, such as “carbapenem”.</p>`;
  el.querySelectorAll(".dl").forEach(b=>b.onclick=()=>{curDrug=b.dataset.d;renderDrugList();renderDrugDetail();if(innerWidth<820)document.getElementById("drugDetail").scrollIntoView({behavior:"smooth"})});
}
function renderDrugDetail(){
  const d=DATA().find(x=>x.n===curDrug),n=Object.keys(d.cov).length;
  const removed=ver==="2026"&&d.chg?Object.entries(d.chg).filter(([o,c])=>c.act==="remove"):[];
  document.getElementById("drugDetail").innerHTML=
  `<div class="panel" style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
     <div><div style="color:var(--muted);font-size:14px;font-weight:700">${esc(d.c)}</div><h2 style="margin:2px 0 0;font-size:clamp(22px,3vw,30px);line-height:1.15">${esc(d.n)}</h2>${d.tag?`<span class="qual" style="margin:6px 0 0">${esc(d.tag)}</span>`:""}${d.isNew?`<div style="font-size:13px;color:var(--muted);margin-top:6px">Source: ${esc(SRC[d.src])}</div>`:""}</div>
     <div style="text-align:right"><div class="bigstat">${n}<span style="font-size:20px;color:var(--muted)"> / ${ORGS().length}</span></div><div style="font-size:13px;color:var(--muted)">bacterial groups covered</div></div>
   </div>
   ${ver==="2026"?pnPanel(d):""}
   ${removed.length?`<div class="note upnote" style="margin:0 0 14px"><span class="upd">2026</span> Removed: ${removed.map(([o,c])=>`${esc(SHORT[o])} — ${esc(c.t.replace(/^Removed: /,""))}`).join("; ")}</div>`:""}
   <div class="ribbon">${famOrder.filter(f=>ORGS().some(o=>o.f===f)).map(f=>{const F=FAM[f];return `<div class="rrow"><h3 style="color:${css(F.c)}"><span class="sw" style="background:${css(F.c)}"></span>${F.name}</h3><div class="cells">`+
     ORGS().filter(o=>o.f===f).map(o=>{const v=d.cov[o.id];const sub=o.f==="gneg"&&orgSub(o)?`<span class="q" style="font-weight:400;color:var(--muted)">${esc(orgSub(o))}</span>`:"";return v?`<div class="cell on" style="background:${css(F.bg)};border-color:${css(F.c)}">${esc(orgName(o))}${badge(d,o.id)}${sub}${v.q?`<span class="q" style="color:var(--warn)">${esc(v.q)}</span>`:""}</div>`:`<div class="cell">${esc(orgName(o))}${sub}<span class="q" style="font-weight:400">Not covered</span></div>`}).join("")+`</div></div>`}).join("")}</div>`;
}
function renderMatrix(){
  const t=document.getElementById("matrix");
  let h=`<thead><tr><th class="dn">Antibiotic</th>`+ORGS().map(o=>`<th class="v" title="${esc(orgName(o)+(orgSub(o)?" – "+orgSub(o):""))}"><span style="color:${css(FAM[o.f].c)}">${esc(SHORT[o.id])}</span></th>`).join("")+`</tr></thead><tbody>`;
  let last="";
  DATA().forEach(d=>{
    if(d.c!==last){h+=`<tr class="clsrow"><td colspan="${ORGS().length+1}">${esc(d.c)}</td></tr>`;last=d.c}
    h+=`<tr><td class="dn">${esc(d.n)}</td>`+ORGS().map(o=>{const v=d.cov[o.id],c=css(FAM[o.f].c),ch=ver==="2026"&&d.chg&&d.chg[o.id];const mark=ch?`<span class="chg" aria-hidden="true"></span>`:"";const tip=esc(orgName(o))+(v&&v.q?": "+esc(v.q):"")+(ch?" — 2026: "+esc(ch.t)+" ("+esc(SRC[ch.src])+")":"");return `<td title="${tip}" style="position:relative">${v?(v.q?`<span class="dot p" style="border-color:${c}" aria-label="Active with limitation"></span>`:`<span class="dot" style="background:${c}" aria-label="Active"></span>`):(ch?`<span class="x" aria-label="Removed">×</span>`:"")}${mark}</td>`}).join("")+`</tr>`;
  });
  t.innerHTML=h+"</tbody>";
}
function renderChanges(){
  const el=document.getElementById("changeList");
  const rows=CHANGES.map(([dn,o,act,t,src])=>`<tr><td class="l"><strong>${esc(dn)}</strong></td><td class="l">${esc(SHORT[o])}</td><td class="l"><span class="pill ${act}">${act==="remove"?"Removed":"Changed"}</span> ${esc(t.replace(/^Removed: /,""))}</td><td class="l s">${esc(SRC[src])}</td></tr>`).join("")
   +EXTRA.map(([dn,o,t,src])=>`<tr><td class="l"><strong>${esc(dn)}</strong></td><td class="l">${esc(SHORT[o])}</td><td class="l"><span class="pill new">Organism added</span> ${esc(t)}</td><td class="l s">${esc(SRC[src]||REFS[REFNUM[src]-1][1])}</td></tr>`).join("")
   +NEWDRUGS.filter(d=>Object.keys(d.cov).length).map(d=>`<tr><td class="l"><strong>${esc(d.n)}</strong></td><td class="l">${Object.keys(d.cov).map(o=>esc(SHORT[o])).join(", ")}</td><td class="l"><span class="pill new">Added</span> ${Object.values(d.cov).map(v=>v.q).filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i).map(esc).join("; ")||"New agent"}</td><td class="l s">${esc(SRC[d.src])}</td></tr>`).join("");
  el.innerHTML=`<table class="chgt"><thead><tr><th class="l">Antibiotic</th><th class="l">Bacteria</th><th class="l">Change</th><th class="l">Source</th></tr></thead><tbody>${rows}</tbody></table>`;
}
function renderAll(){renderOrgPanel();renderOrgDetail();renderDrugList();renderDrugDetail();renderMatrix();}
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tabs button").forEach(x=>x.setAttribute("aria-selected",x===b));
  ["bug","drug","map","tk","chg","ref"].forEach(v=>document.getElementById("v-"+v).classList.toggle("hide",v!==b.dataset.v));
});
document.querySelectorAll(".ver button").forEach(b=>b.onclick=()=>{
  ver=b.dataset.ver;document.querySelectorAll(".ver button").forEach(x=>x.setAttribute("aria-pressed",x===b));renderAll();
});
document.getElementById("q").addEventListener("input",renderDrugList);
renderAll();renderChanges();renderToolkit();renderRefs();
