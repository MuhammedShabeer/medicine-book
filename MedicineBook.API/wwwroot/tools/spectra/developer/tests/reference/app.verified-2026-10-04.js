/* Bug–Drug Navigator: data + rendering. Antibacterial data at the top; other groups in GROUPS (fun, vir, myc, par). Verified and gap-audited 5 Oct 2026 — see VERIFICATION-LOG.md */
/* Compatibility fallback for older Android/iOS web views */
if(!Object.fromEntries){Object.fromEntries=function(it){var o={};Array.prototype.forEach.call(Array.from(it),function(kv){o[kv[0]]=kv[1];});return o;};}
const FAM = {
  gpos:{name:"Gram-positive cocci", c:"--gpos", bg:"--gpos-bg"},
  gpbac:{name:"Gram-positive bacilli", c:"--gpos", bg:"--gpos-bg"},
  gneg:{name:"Gram-negative bacilli", c:"--gneg", bg:"--gneg-bg"},
  gncc:{name:"Gram-negative cocci", c:"--gneg", bg:"--gneg-bg"},
  anae:{name:"Anaerobes", c:"--anae", bg:"--anae-bg"},
  atyp:{name:"Atypicals", c:"--atyp", bg:"--atyp-bg"},
  spir:{name:"Spirochaetes", c:"--atyp", bg:"--atyp-bg"}
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
const SHORT={typhi:"S. Typhi (enteric fever)",brucella:"Brucella",tpall:"T. pallidum (syphilis)",vre:"VRE",listeria:"Listeria",steno:"Stenotrophomonas",crab:"CRAB (Acinetobacter)",strep:"Streptococci",entero:"Enterococci",sepi:"S. epidermidis",mssa:"MSSA",camrsa:"MRSA, community",hamrsa:"MRSA, hospital",gnb:"E. coli/Kleb/H. flu",gnbbl:"Same, β-lactamase+",space:"AmpC group (SPACE)",esbl:"ESBL",cre:"CRE",pseudo:"Pseudomonas",nmen:"N. meningitidis",ngon:"N. gonorrhoeae",pepto:"Peptostreptococcus",bact:"Bacteroides",cdiff:"C. difficile",myco:"Mycoplasma/Chlamydophila",legion:"Legionella",chlam:"C. trachomatis"};
const SRC={
 IDSA:"IDSA Guidance on AMR Gram-negative infections, July 2026",
 AHFS:"AHFS Drug Information monograph (ASHP)",
 IDSA24:"IDSA AMR Guidance v3.0 (2023, updated Jan 2024) — partly superseded by 2026",
 TYPH:"CDC Yellow Book: typhoid and paratyphoid fever",
 BRUC:"CDC: clinical overview of brucellosis",
 IAI:"IDSA/SIS complicated intra-abdominal infection guideline (2010)",
 CDI:"IDSA/SHEA C. difficile focused update, 2021",
 CDC:"CDC STI Treatment Guidelines, 2021",
 LABEL:"FDA prescribing information",SPC:"FDA prescribing information",DAP:"Cubicin (daptomycin) prescribing information",MEN04:"IDSA bacterial meningitis guideline (2004)",
 FDA_LZD:"Zyvox (linezolid) prescribing information"
};
/* ---- 2026 changes: [drug, org, action, text, source] ---- */
const CHANGES=[
 ["Colistin/polymyxin B","space","remove","Removed: most Proteus, Providencia and Serratia strains are resistant to colistin","AHFS"],
 ["Amoxicillin-clavulanate","space","remove","Removed: AmpC organisms (Enterobacter, C. freundii) are intrinsically resistant","IDSA"],
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
 ["Levofloxacin/moxifloxacin","bact","set","Moxifloxacin only; avoid if a quinolone was used in the last 3 months","IAI"],
 ["Vancomycin/daptomycin","cdiff","set","Oral vancomycin: alternative to fidaxomicin","CDI"],
 ["Fidaxomicin","cdiff","set","Preferred first-line for initial and recurrent CDI","CDI"],
 ["Metronidazole","cdiff","set","Only for non-severe CDI if fidaxomicin/vancomycin unavailable","CDI"],
 ["Clarithromycin/azithromycin","ngon","remove","Removed as routine therapy (rising resistance); azithromycin 2 g is used only with gentamicin in cephalosporin allergy","CDC"],
 ["Chloramphenicol","ngon","remove","Removed: not a recommended gonorrhoea regimen","CDC"],
 ["Ceftriaxone/cefotaxime","ngon","set","First-line: ceftriaxone 500 mg IM single dose, monotherapy","CDC"],
 ["Cefixime","ngon","set","Alternative only if ceftriaxone unavailable; not for pharyngeal","CDC"],
 ["Tetracycline/doxycycline","chlam","set","Doxycycline 7 days is preferred","CDC"],
 ["Clarithromycin/azithromycin","chlam","set","Azithromycin: alternative; preferred in pregnancy","CDC"]
];
const NEWDRUGS=[
 {c:"Monobactams",n:"Aztreonam",src:"SPC",why:"Added to the chart: key anti-Pseudomonas agent and an option in β-lactam allergy",cov:{gnb:1,gnbbl:1,pseudo:1}},
 {c:"Newer agents (added 2026)",n:"Ceftazidime-avibactam",src:"IDSA",cov:{space:Q("Active; reserve for carbapenem resistance"),esbl:Q("Active; reserve for carbapenem resistance"),cre:Q("Preferred for KPC and OXA-48-like; not active vs NDM"),pseudo:Q("For difficult-to-treat strains")}},
 {c:"Newer agents (added 2026)",n:"Meropenem-vaborbactam",src:"IDSA",cov:{esbl:Q("Active; reserve for carbapenem resistance"),cre:Q("Preferred for KPC; not active vs NDM")}},
 {c:"Newer agents (added 2026)",n:"Imipenem-relebactam",src:"IDSA",cov:{esbl:Q("Active; reserve for carbapenem resistance"),cre:Q("Preferred for KPC; not active vs NDM"),pseudo:Q("For difficult-to-treat strains")}},
 {c:"Newer agents (added 2026)",n:"Aztreonam-avibactam",src:"IDSA",cov:{cre:Q("Preferred for NDM")}},
 {c:"Newer agents (added 2026)",n:"Cefiderocol",src:"IDSA",cov:{cre:Q("Preferred for NDM; alternative for KPC"),pseudo:Q("For difficult-to-treat strains")}},
 {c:"Newer agents (added 2026)",n:"Cefepime-enmetazobactam",src:"IDSA",cov:{esbl:Q("Alternative outside urine; option for cUTI")}},
 {c:"Newer agents (added 2026)",n:"Sulbactam-durlobactam",src:"IDSA",cov:{}},
 {c:"Newer agents (added 2026)",n:"Pivmecillinam (oral)",src:"IDSA",cov:{esbl:Q("Cystitis only")}},
 {c:"Newer agents (added 2026)",n:"Gepotidacin (oral)",src:"IDSA",cov:{esbl:Q("Cystitis only")}},
 {c:"Penicillins",n:"Ampicillin-sulbactam (high-dose)",src:"SPC",why:"Added to the chart (FDA-labelled spectrum) so its CRAB role can be shown",cov:{strep:1,entero:1,mssa:1,gnb:1,gnbbl:1,bact:Q("Active, but not recommended for intra-abdominal infection (E. coli resistance)")}},
 {c:"Tetracyclines",n:"Minocycline (high-dose)",src:"AHFS",why:"Added to the chart so its S. maltophilia and CRAB roles can be shown",cov:{myco:1,chlam:1}},
 {c:"Newer agents (added 2026)",n:"Ceftaroline",src:"SPC",cov:{strep:1,mssa:1,camrsa:Q("MRSA labelled for skin infections only, not pneumonia"),hamrsa:Q("MRSA labelled for skin infections only, not pneumonia"),gnb:1}}
];
const ORGNOTE26={
 space:"Updated 2026 (IDSA): the SPACE mnemonic oversimplifies AmpC risk. Moderate risk: Enterobacter cloacae complex, Klebsiella aerogenes, Citrobacter freundii, Hafnia alvei — prefer cefepime; avoid ceftriaxone and piperacillin-tazobactam for invasive infections. Lower risk (Serratia, Morganella, Providencia): treat according to susceptibility results. Most Proteus, Providencia and Serratia strains are resistant to colistin (AHFS).",
 esbl:"Updated 2026 (IDSA): carbapenems are preferred for ESBL infections outside the urine (meropenem or imipenem if critically ill). Avoid cefepime and cephamycins. For cystitis, nitrofurantoin, TMP-SMX, single-dose aminoglycoside, pivmecillinam, gepotidacin or sulopenem are preferred.",
 cre:["Updated 2026 (IDSA): choose by carbapenemase type. KPC: meropenem-vaborbactam, ceftazidime-avibactam or imipenem-relebactam. NDM: aztreonam-avibactam or cefiderocol. OXA-48-like: ceftazidime-avibactam (IDSA 2023/24). Polymyxins are not suggested for CRE, except colistin as an alternative for uncomplicated cystitis. Tigecycline/eravacycline only when β-lactams are unsuitable, not for urinary or bloodstream infection.",["IDSA","IDSA24"]],
 bact:"IDSA/SIS intra-abdominal guideline (2010): cefotetan and clindamycin are not recommended because of rising B. fragilis group resistance. Metronidazole, carbapenems and some β-lactam/β-lactamase inhibitors remain uniformly active. Cefoxitin is still a recommended single agent for mild–moderate community-acquired infection. Avoid moxifloxacin if a quinolone was used in the previous 3 months.",
 cdiff:"Updated (IDSA/SHEA 2021): fidaxomicin is preferred over oral vancomycin for initial and recurrent CDI. Metronidazole alone only for mild cases when the others are unavailable.",
 ngon:"Updated (CDC 2021): ceftriaxone 500 mg IM single dose (1 g if ≥150 kg). Add doxycycline if chlamydia is not excluded.",
 chlam:"Updated (CDC 2021): doxycycline 100 mg twice daily for 7 days is preferred; azithromycin is the alternative and is preferred in pregnancy."
};

/* ================= Other anti-infective groups (added October 2026; every statement re-checked 4 Oct 2026) ================= */
const P=(t,r)=>({p:t,r}), L=(t,r)=>({q:t,r}), A=r=>({r});
Object.assign(FAM,{
  yeast:{name:"Yeasts: Candida",c:"--atyp",bg:"--atyp-bg"},
  cryp:{name:"Yeasts: Cryptococcus",c:"--c5",bg:"--c5-bg"},
  mould:{name:"Moulds",c:"--anae",bg:"--anae-bg"},
  pjp:{name:"Pneumocystis",c:"--gpos",bg:"--gpos-bg"},
  herp:{name:"Herpesviruses",c:"--gneg",bg:"--gneg-bg"},
  resp:{name:"Respiratory viruses",c:"--c5",bg:"--c5-bg"},
  hep:{name:"Hepatitis viruses",c:"--anae",bg:"--anae-bg"},
  retro:{name:"HIV",c:"--gpos",bg:"--gpos-bg"},
  pox:{name:"Poxviruses",c:"--c6",bg:"--c6-bg"},
  tb:{name:"Mycobacterium tuberculosis",c:"--gneg",bg:"--gneg-bg"},
  ntm:{name:"Non-tuberculous mycobacteria",c:"--c5",bg:"--c5-bg"},
  mal:{name:"Malaria (Plasmodium)",c:"--gneg",bg:"--gneg-bg"},
  proto:{name:"Other protozoa",c:"--atyp",bg:"--atyp-bg"},
  helm:{name:"Helminths (worms)",c:"--anae",bg:"--anae-bg"},
  ecto:{name:"Ectoparasites",c:"--c6",bg:"--c6-bg"}
});

const GROUPS={
 bac:{label:"Antibacterial",noun:"antibiotic",Noun:"Antibiotic",plural:"antibiotics",unit:"bacterial groups",pick:"Pick a bacterium",pickd:"Pick an antibiotic",ph:"Meropenem",hint:"carbapenem",
  intro:"Tap a bacterium to see which antibiotics are active, or tap an antibiotic to see its spectrum. Colours follow the Gram stain: violet for Gram-positive, pink for Gram-negative."},

 /* ---------------- ANTIFUNGAL ---------------- */
 fun:{label:"Antifungal",noun:"antifungal",Noun:"Antifungal",plural:"antifungals",unit:"fungal groups",pick:"Pick a fungus",pickd:"Pick an antifungal",ph:"Voriconazole",hint:"azole",
  intro:"Tap a fungus to see which antifungals are recommended, or tap an antifungal to see where it is used. Green labels mark first-line choices; amber labels mark limits or specific uses.",
  fams:["yeast","cryp","mould","pjp"],first:{org:"calb",drug:"Caspofungin / micafungin / anidulafungin"},
  orgs:[
   {id:"calb",f:"yeast",n:"Candida albicans",sh:"C. albicans",s:"Most common Candida species",site:"Bloodstream, mucosa (oral, oesophageal, vaginal), urinary tract, abdomen",note:"Candidaemia: start an echinocandin; step down to fluconazole (usually within 5–7 days) when stable, fluconazole-susceptible and repeat blood cultures are negative. Mucosal: clotrimazole troches or miconazole buccal tablets for mild oral thrush; oral fluconazole for moderate–severe oral and for oesophageal candidiasis; uncomplicated vaginal candidiasis: a topical azole or fluconazole 150 mg once. Symptomatic cystitis: fluconazole 200 mg daily for 2 weeks. Asymptomatic candiduria: no treatment unless high risk.",r:["IDSA_CAN"]},
   {id:"cgla",f:"yeast",n:"Candida glabrata",sh:"C. glabrata",s:"Now Nakaseomyces glabratus",site:"Bloodstream, urinary tract, abdomen",note:"Triazole resistance has risen so far that azoles cannot be relied on without susceptibility testing. Start an echinocandin; step down to fluconazole 800 mg daily or voriconazole only if the isolate is susceptible.",r:["IDSA_CAN","AHFS"]},
   {id:"ckru",f:"yeast",n:"Candida krusei",sh:"C. krusei",s:"Now Pichia kudriavzevii",site:"Bloodstream",note:"Intrinsically resistant to fluconazole. Start an echinocandin; voriconazole is the recommended oral step-down.",r:["AHFS","IDSA_CAN"]},
   {id:"cpar",f:"yeast",n:"Candida parapsilosis",sh:"C. parapsilosis",s:"",site:"Bloodstream, intravascular catheters, neonates",note:"Innately higher echinocandin MICs, so it may respond less well to echinocandins. Fluconazole is acceptable initial therapy in selected patients who are not critically ill.",r:["IDSA_CAN"]},
   {id:"caur",f:"yeast",n:"Candida auris",sh:"C. auris",s:"Now Candidozyma auris; multidrug-resistant",site:"Bloodstream, wounds; spreads in hospitals",note:"Echinocandins are first line (adults and children over 2 months). Use liposomal amphotericin B 5 mg/kg daily if the isolate is echinocandin-resistant. Echinocandin- and pan-resistant cases are increasing: test every clinical isolate. Do not treat C. auris found in urine or respiratory samples without clinical disease.",r:["CAURIS"]},
   {id:"cryp",f:"cryp",n:"Cryptococcus neoformans",sh:"Cryptococcus",s:"",site:"Brain (meningitis), lungs, blood; HIV and transplant",note:"Echinocandins are not active. WHO preferred induction for HIV-associated meningitis: single-dose liposomal amphotericin B 10 mg/kg plus 14 days of flucytosine 100 mg/kg/day and fluconazole 1200 mg/day; then fluconazole 800 mg daily for 8 weeks, then 200 mg daily.",r:["CRYPTO","AHFS"]},
   {id:"asp",f:"mould",n:"Aspergillus spp.",sh:"Aspergillus",s:"A. fumigatus, A. flavus, A. terreus",site:"Lungs, sinuses, brain; neutropenia, transplant, ICU",note:"Voriconazole is first line; liposomal amphotericin B or isavuconazole are alternatives. Echinocandins for salvage, or combined with voriconazole in selected patients — not as primary monotherapy. Posaconazole for prophylaxis in prolonged high-risk neutropenia. Azole TDM is recommended.",r:["ASP16"]},
   {id:"muc",f:"mould",n:"Mucorales",sh:"Mucorales",s:"Rhizopus, Mucor, Lichtheimia",site:"Sinuses, orbit, brain, lungs; diabetic ketoacidosis, neutropenia",note:"Liposomal amphotericin B 5–10 mg/kg/day plus early complete surgery. Isavuconazole (moderate support) or posaconazole tablets for first line when amphotericin is unsuitable; both are strongly supported for salvage and oral step-down. Echinocandins are not active.",r:["MUC19","AHFS"]},
   {id:"fus",f:"mould",n:"Fusarium spp.",sh:"Fusarium",s:"",site:"Disseminated in neutropenia; skin, eye",note:"Voriconazole or a lipid amphotericin B formulation, often combined at first with later step-down. Posaconazole and isavuconazole have only a marginal (salvage) recommendation. Susceptibility testing is not standardised and high MICs are common.",r:["RAREM"]},
   {id:"pjp",f:"pjp",n:"Pneumocystis jirovecii",sh:"Pneumocystis (PJP)",s:"A fungus, but treated with TMP-SMX rather than antifungals",site:"Lungs; HIV with low CD4, transplant, immunosuppression",note:"TMP-SMX is preferred for treatment (21 days) and prophylaxis. In HIV, add corticosteroids if PaO₂ is under 70 mmHg on room air or the A–a gradient is 35 mmHg or more.",r:["OI"]}
  ],
  drugs:[
   {c:"Azoles",n:"Fluconazole",cov:{calb:P("Step-down after echinocandin; first line for oesophageal and moderate–severe oral thrush; cystitis",["IDSA_CAN"]),cgla:L("Only if susceptible (800 mg daily)",["IDSA_CAN"]),cpar:P("Acceptable initial therapy if not critically ill",["IDSA_CAN"]),cryp:P("With induction; then consolidation and maintenance",["CRYPTO"])}},
   {c:"Azoles",n:"Itraconazole",cov:{calb:L("Fluconazole-refractory oral or oesophageal disease",["IDSA_CAN"]),asp:L("Chronic cavitary aspergillosis and ABPA; absorption limits use",["ASP16"])}},
   {c:"Azoles",n:"Voriconazole",cov:{calb:L("Ocular disease; refractory oesophageal disease",["IDSA_CAN"]),cgla:L("Step-down only if susceptible",["IDSA_CAN"]),ckru:P("Oral step-down",["IDSA_CAN"]),cpar:A(["AHFS"]),asp:P("First line",["ASP16"]),fus:P("First-line option (or with lipid amphotericin B)",["RAREM"])}},
   {c:"Azoles",n:"Posaconazole",cov:{calb:L("Fluconazole-refractory oropharyngeal disease",["IDSA_CAN"]),asp:P("Prophylaxis in prolonged high-risk neutropenia",["ASP16"]),muc:L("Salvage and step-down (strong); first line if amphotericin unsuitable",["MUC19"]),fus:L("Salvage (marginal)",["RAREM"])}},
   {c:"Azoles",n:"Isavuconazole",cov:{asp:P("Alternative to voriconazole",["ASP16"]),muc:P("First line (moderate); salvage and step-down (strong)",["MUC19"])}},
   {c:"Azoles",n:"Clotrimazole troches / miconazole buccal",cov:{calb:L("Mild oropharyngeal candidiasis",["IDSA_CAN"])}},
   {c:"Polyenes",n:"Amphotericin B (liposomal)",cov:{calb:L("If echinocandins unsuitable; CNS/endocarditis ± flucytosine",["IDSA_CAN"]),cgla:L("Alternative",["IDSA_CAN"]),ckru:L("Alternative",["IDSA_CAN"]),cpar:L("Alternative",["IDSA_CAN"]),caur:L("If echinocandin-resistant (5 mg/kg)",["CAURIS"]),cryp:P("Induction, with flucytosine",["CRYPTO"]),asp:L("Alternative",["ASP16"]),muc:P("First line, 5–10 mg/kg/day",["MUC19"]),fus:P("First-line option (lipid formulation)",["RAREM"])}},
   {c:"Echinocandins",n:"Caspofungin / micafungin / anidulafungin",cov:{calb:P("First line for candidaemia",["IDSA_CAN"]),cgla:P("Initial therapy",["IDSA_CAN"]),ckru:P("Initial therapy",["IDSA_CAN"]),cpar:L("Higher MICs; may respond less well",["IDSA_CAN"]),caur:P("First line",["CAURIS"]),asp:L("Salvage, or combination in selected patients",["ASP16"])}},
   {c:"Echinocandins",n:"Rezafungin (once weekly)",cov:{calb:L("Labelled when limited or no alternative options",["SPC"]),cgla:L("Labelled when limited or no alternative options",["SPC"])}},
   {c:"Other antifungals",n:"Flucytosine",cov:{calb:L("Combination only: CNS (with L-AmB) or endocarditis",["IDSA_CAN"]),cryp:P("Induction, with amphotericin",["CRYPTO"])}},
   {c:"Anti-Pneumocystis",n:"Co-trimoxazole (TMP-SMX)",cov:{pjp:P("Preferred: treatment and prophylaxis",["OI"])}},
   {c:"Anti-Pneumocystis",n:"Atovaquone",cov:{pjp:L("Mild–moderate disease; prophylaxis",["OI"])}},
   {c:"Anti-Pneumocystis",n:"Pentamidine",cov:{pjp:L("IV for moderate–severe disease; aerosolised for prophylaxis",["OI"])}},
   {c:"Anti-Pneumocystis",n:"Primaquine + clindamycin",cov:{pjp:L("Alternative for treatment",["OI"])}},
   {c:"Anti-Pneumocystis",n:"Dapsone",cov:{pjp:L("Prophylaxis; with trimethoprim for mild–moderate disease",["OI"])}}
  ],
  pn:{
   "Fluconazole":{po:["Over 90% bioavailable compared with IV",["SPC"]],ix:[["Moderate CYP2C9/3A4 and strong CYP2C19 inhibitor: raises warfarin effect and phenytoin levels; hypoglycaemia with sulfonylureas; QT prolongation",["SPC"]]],note:[["Give 50% of the dose if CrCl ≤50 mL/min (not on haemodialysis)",["SPC"]],["C. krusei is intrinsically resistant",["AHFS"]]]},
   "Itraconazole":{warn:[["Boxed warning: congestive heart failure; several CYP3A4 substrates are contraindicated",["SPC"]]],mon:[["TDM recommended — use the HMC laboratory target",["ASP16"]]],note:[["Oral solution and capsules are not interchangeable (higher exposure with solution)",["SPC"]]]},
   "Voriconazole":{po:["About 96% bioavailable; take at least 1 h before or after a meal",["AHFS","SPC"]],mon:[["TDM: trough ≥1 mg/L; keep below 5.5 mg/L (below 4 mg/L in Asian patients)",["JTDM"]],["Visual effects incl. optic neuritis; hepatic reactions; skin SCC and melanoma, fluorosis and periostitis with long-term use; avoid direct sunlight",["SPC"]]],ix:[["Contraindicated with rifampicin, rifabutin, carbamazepine, long-acting barbiturates, high-dose ritonavir, efavirenz ≥400 mg, St John's wort, sirolimus, ergots and others",["SPC"]],["When starting: reduce tacrolimus to one-third and ciclosporin to one-half; monitor levels",["SPC"]]],note:[["IV vehicle (SBECD) accumulates if CrCl <50 mL/min",["SPC"]]]},
   "Posaconazole":{po:["Delayed-release tablets: with or without food; oral suspension is not substitutable",["SPC"]],mon:[["TDM recommended — use the HMC laboratory target",["ASP16"]]],ix:[["Contraindicated with sirolimus, ergots, CYP3A4-metabolised statins, pimozide and quinidine",["SPC"]],["Reduce tacrolimus to about one-third and ciclosporin to about three-quarters; QT prolongation",["SPC"]]],note:[["IV: SBECD accumulates if eGFR <50 mL/min/1.73 m²",["SPC"]]]},
   "Isavuconazole":{po:["98% bioavailable; IV and oral interchangeable without a new loading dose",["SPC"]],ix:[["Moderate CYP3A4 inhibitor: monitor tacrolimus, ciclosporin and sirolimus",["SPC"]]],note:[["Shortens QTc: contraindicated in familial short-QT syndrome",["SPC"]]]},
   "Amphotericin B (liposomal)":{warn:[["Not interchangeable mg-for-mg with other amphotericin B products. Conventional amphotericin B overdose can cause fatal cardiac or cardiopulmonary arrest — verify product and dose (conventional: never above 1.5 mg/kg/day)",["SPC"]]],mon:[["Renal, hepatic and haematological function; electrolytes, especially magnesium and potassium; anaphylaxis can occur",["SPC"]]],note:[["Reconstitute with sterile water; dilute in 5% dextrose — never saline",["SPC"]],["Labelled doses 3–6 mg/kg/day; the mucormycosis guideline uses 5–10 mg/kg/day",["SPC","MUC19"]]]},
   "Caspofungin / micafungin / anidulafungin":{note:[["IV only. Caspofungin: no renal adjustment; 35 mg daily in moderate hepatic impairment",["SPC"]],["Do not reach therapeutic levels in eye, CNS or urine",["IDSA_CAN"]],["Not active against Cryptococcus, Fusarium or Mucorales",["AHFS"]]]},
   "Rezafungin (once weekly)":{note:[["400 mg IV in week 1, then 200 mg weekly; safety not established beyond 4 doses",["SPC"]],["Labelled from age 12 for candidaemia/invasive candidiasis when alternatives are limited or absent",["SPC"]]]},
   "Flucytosine":{warn:[["Boxed warning: extreme caution in renal impairment; close haematological, renal and hepatic monitoring",["SPC"]]],mon:[["Prolonged levels above 100 mcg/mL are linked to toxicity",["SPC"]]],note:[["Use with amphotericin B — resistance emerges when used alone",["SPC"]]]},
   "Co-trimoxazole (TMP-SMX)":{mon:[["High-dose trimethoprim raises potassium; frequent blood counts and chemistry; stop at the first rash",["SPC"]]],note:[["PJP: trimethoprim 15–20 mg/kg/day in 3 divided doses (oral for mild–moderate) for 21 days",["OI"]]]},
   "Atovaquone":{po:["Take with food — low levels without it may limit response",["SPC"]]},
   "Pentamidine":{mon:[["Infuse IV over 60–120 min. Fatal hypotension, hypoglycaemia, pancreatitis and arrhythmias reported; nephrotoxicity common; ECG before, during and after",["SPC"]]]},
   "Primaquine + clindamycin":{mon:[["Check G6PD before primaquine",["OI"]]]},
   "Dapsone":{mon:[["Check G6PD before dapsone",["OI"]]]}
  }
 },

 /* ---------------- ANTIVIRAL ---------------- */
 vir:{label:"Antiviral",noun:"antiviral",Noun:"Antiviral",plural:"antivirals",unit:"virus groups",pick:"Pick a virus",pickd:"Pick an antiviral",ph:"Oseltamivir",hint:"influenza",
  intro:"Tap a virus to see which antivirals are used, or tap an antiviral to see what it treats. Green labels mark first-line choices; amber labels mark limits or specific uses.",
  fams:["herp","resp","hep","retro","pox"],first:{org:"cmv",drug:"Ganciclovir / valganciclovir"},
  orgs:[
   {id:"hsv",f:"herp",n:"Herpes simplex (HSV-1, HSV-2)",sh:"HSV",s:"",site:"Skin, mucosa, genital tract, eye, brain (encephalitis)",note:"Aciclovir, valaciclovir and famciclovir are the treatment options. For aciclovir-resistant HSV, foscarnet is the treatment of choice; topical cidofovir 1% gel or imiquimod are alternatives for genital lesions.",r:["CDC"]},
   {id:"vzv",f:"herp",n:"Varicella-zoster (VZV)",sh:"VZV",s:"Chickenpox, shingles",site:"Skin, eye, brain",note:"Oral doses are higher than for HSV (aciclovir 800 mg five times daily for zoster vs 200 mg for initial genital herpes). IV aciclovir is labelled for zoster in immunocompromised patients.",r:["SPC"]},
   {id:"cmv",f:"herp",n:"Cytomegalovirus (CMV)",sh:"CMV",s:"",site:"Transplant and HIV: retina, gut, lung, blood",note:"First line: (val)ganciclovir or foscarnet. Letermovir is for prophylaxis only (stem-cell transplant; kidney transplant D+/R−). Maribavir is for refractory or resistant CMV; never combine it with (val)ganciclovir, and do not use it for retinitis or encephalitis.",r:["ASTCT","SPC","MBV"]},
   {id:"flu",f:"resp",n:"Influenza A and B",sh:"Influenza",s:"",site:"Respiratory tract",note:"Start oral or enteric oseltamivir as soon as possible in anyone admitted with suspected or confirmed influenza. Adding baloxavir to a neuraminidase inhibitor did not improve outcomes in hospitalised patients.",r:["FLU"]},
   {id:"cov",f:"resp",n:"SARS-CoV-2 (COVID-19)",sh:"SARS-CoV-2",s:"",site:"Respiratory tract",note:"Mild–moderate COVID-19 at high risk: nirmatrelvir/ritonavir (best within 5 days) or a 3-day IV remdesivir course (within 7 days). Molnupiravir only when nirmatrelvir/ritonavir cannot be used.",r:["COVID"]},
   {id:"rsv",f:"resp",n:"Respiratory syncytial virus (RSV)",sh:"RSV",s:"",site:"Respiratory tract; infants, older adults, transplant",note:"ECIL-4: aerosolised or systemic ribavirin (with IVIG) for RSV in allogeneic stem-cell transplant recipients or those at risk of progression to lower-tract disease. Prevention products are outside this chart.",r:["ECIL4"]},
   {id:"hbv",f:"hep",n:"Hepatitis B (HBV)",sh:"HBV",s:"",site:"Liver",note:"WHO 2024: tenofovir disoproxil (TDF) or entecavir preferred; TAF for renal or bone concerns; treatment eligibility widened. Test for HIV first — entecavir or lamivudine alone can select HIV resistance. Stopping therapy can cause severe hepatitis flares (boxed warning).",r:["HBV","SPC"]},
   {id:"hcv",f:"hep",n:"Hepatitis C (HCV)",sh:"HCV",s:"",site:"Liver",note:"Simplified treatment (treatment-naive, no cirrhosis): glecaprevir/pibrentasvir 8 weeks with food, or sofosbuvir/velpatasvir 12 weeks. Test HBsAg before starting — DAAs carry a boxed warning for HBV reactivation.",r:["HCV","SPC"]},
   {id:"hiv",f:"retro",n:"HIV-1",sh:"HIV-1",s:"",site:"Systemic",note:"Treated with combination ART chosen by the HIV team; recommended initial regimens are integrase-inhibitor based (e.g. bictegravir/TAF/FTC or dolutegravir-based). Check every new medicine for ART interactions.",r:["DHHS","LIV"]},
   {id:"mpox",f:"pox",n:"Mpox",sh:"Mpox",s:"",site:"Skin, mucosa",note:"In the STOMP trial (clade II), tecovirimat did not improve lesion resolution (83% vs 84% with placebo by day 29) or pain.",r:["MPOX"]}
  ],
  drugs:[
   {c:"Anti-herpes",n:"Aciclovir / valaciclovir",cov:{hsv:P("First line; IV for HSV encephalitis",["CDC","SPC"]),vzv:P("First line; higher oral dose than for HSV",["SPC"])}},
   {c:"Anti-herpes",n:"Famciclovir",cov:{hsv:A(["CDC","SPC"]),vzv:A(["SPC"])}},
   {c:"Anti-CMV",n:"Ganciclovir / valganciclovir",cov:{cmv:P("First line",["ASTCT"])}},
   {c:"Anti-CMV",n:"Foscarnet",cov:{cmv:L("First-line alternative (HCT); labelled for CMV retinitis in AIDS",["ASTCT","SPC"]),hsv:L("Aciclovir-resistant HSV: treatment of choice",["CDC","SPC"])}},
   {c:"Anti-CMV",n:"Cidofovir",cov:{cmv:L("Labelled for CMV retinitis in AIDS",["SPC"]),hsv:L("Topical 1% gel: alternative for aciclovir-resistant genital HSV",["CDC"])}},
   {c:"Anti-CMV",n:"Letermovir",cov:{cmv:L("Prophylaxis only (HCT; kidney transplant D+/R−)",["SPC","ASTCT"])}},
   {c:"Anti-CMV",n:"Maribavir",cov:{cmv:L("Refractory/resistant post-transplant CMV; not for retinitis or encephalitis",["MBV","ASTCT"])}},
   {c:"Influenza",n:"Oseltamivir",cov:{flu:P("First line; all hospitalised patients",["FLU"])}},
   {c:"Influenza",n:"Zanamivir (inhaled)",cov:{flu:L("Not in asthma or COPD",["FLU"])}},
   {c:"Influenza",n:"Peramivir (IV)",cov:{flu:L("Single IV dose; not for prophylaxis",["FLU"])}},
   {c:"Influenza",n:"Baloxavir",cov:{flu:L("Age ≥5; not recommended in pregnancy",["FLU"])}},
   {c:"COVID-19",n:"Nirmatrelvir/ritonavir",cov:{cov:P("High-risk mild–moderate disease",["COVID"])}},
   {c:"COVID-19",n:"Remdesivir",cov:{cov:P("3-day outpatient course, or hospitalised",["COVID"])}},
   {c:"COVID-19",n:"Molnupiravir",cov:{cov:L("Only if nirmatrelvir/ritonavir cannot be used",["COVID"])}},
   {c:"Hepatitis B / HIV",n:"Tenofovir (TDF / TAF)",cov:{hbv:P("Preferred (TDF; TAF for renal/bone concerns)",["HBV"]),hiv:L("Part of combination ART only",["DHHS"])}},
   {c:"Hepatitis B / HIV",n:"Entecavir",cov:{hbv:P("Preferred",["HBV"])}},
   {c:"Hepatitis B / HIV",n:"Lamivudine / emtricitabine",cov:{hbv:L("Not alone: HBV resistance emerges (about 24% at 1 year)",["SPC"]),hiv:L("Part of combination ART only",["DHHS"])}},
   {c:"Hepatitis C",n:"Sofosbuvir/velpatasvir",cov:{hcv:P("Pangenotypic, 12 weeks",["HCV"])}},
   {c:"Hepatitis C",n:"Glecaprevir/pibrentasvir",cov:{hcv:P("8 weeks with food; contraindicated in Child-Pugh B/C",["HCV","SPC"])}},
   {c:"HIV",n:"Antiretroviral therapy (combination)",cov:{hiv:P("Integrase-inhibitor-based initial regimen",["DHHS"])}},
   {c:"Other antivirals",n:"Ribavirin",cov:{rsv:L("Allogeneic HCT or high-risk patients (ECIL-4)",["ECIL4"])}},
   {c:"Other antivirals",n:"Tecovirimat",cov:{mpox:L("No benefit over placebo in clade II trial",["MPOX"])}}
  ],
  pn:{
   "Aciclovir / valaciclovir":{po:["Valaciclovir gives aciclovir bioavailability of about 55% (oral aciclovir 10–20%)",["SPC"]],mon:[["IV: infuse over at least 1 hour with adequate hydration (crystal nephropathy)",["SPC"]],["Encephalopathic changes (about 1%), more likely in renal impairment — adjust the interval by CrCl",["SPC"]]],note:[["Dose IV aciclovir on ideal body weight in obesity",["SPC"]]]},
   "Famciclovir":{po:["Penciclovir bioavailability about 77%",["SPC"]]},
   "Ganciclovir / valganciclovir":{warn:[["Boxed warning: haematological toxicity, impaired fertility, fetal toxicity, mutagenesis and carcinogenesis",["SPC"]]],mon:[["Frequent blood counts with differential and platelets; dose by renal function",["SPC"]]],po:["Valganciclovir: ganciclovir bioavailability about 59%; take with food",["SPC"]],note:[["Handle as a hazardous drug (NIOSH Table 1)",["NIOSH","SPC"]]]},
   "Foscarnet":{warn:[["Boxed warning: renal impairment is the major toxicity; seizures linked to mineral and electrolyte changes",["SPC"]]],mon:[["Hydrate (750–1000 mL before the first dose). Check creatinine, calcium (incl. ionised), magnesium, potassium and phosphorus 2–3 times weekly in induction, weekly in maintenance",["SPC"]]]},
   "Cidofovir":{warn:[["Boxed warning: nephrotoxicity (renal failure after as few as 1–2 doses) and neutropenia",["SPC"]]],mon:[["Oral probenecid and IV normal saline with every dose; renal function within 48 h before each dose",["SPC"]]],note:[["Hazardous drug (NIOSH Table 1)",["NIOSH"]]]},
   "Letermovir":{note:[["No activity against HSV or VZV — aciclovir-based prophylaxis is recommended alongside",["ASTCT"]],["Reduce to 240 mg daily when given with ciclosporin",["SPC"]]],ix:[["Raises tacrolimus, ciclosporin and sirolimus levels (monitor); lowers voriconazole levels",["SPC"]]]},
   "Maribavir":{ix:[["Antagonises ganciclovir and valganciclovir — do not co-administer",["MBV"]],["Raises tacrolimus, ciclosporin, sirolimus and everolimus levels — monitor closely",["MBV"]]],note:[["Taste disturbance in 46% of patients",["MBV"]],["Age ≥12 and weight ≥35 kg; CNS and retinal CMV were excluded from trials",["MBV"]]]},
   "Oseltamivir":{note:[["Start as soon as possible in all hospitalised patients",["FLU"]],["Adjust for CrCl 10–90 mL/min and in dialysis (see CDC table)",["FLU"]]]},
   "Zanamivir (inhaled)":{note:[["Contraindicated in underlying airways disease such as asthma or COPD (bronchospasm)",["FLU"]]]},
   "Peramivir (IV)":{note:[["Single IV dose; adjust if CrCl is under 50 mL/min; not for prophylaxis",["FLU"]]]},
   "Baloxavir":{ix:[["Avoid with dairy, calcium-fortified drinks, polyvalent-cation laxatives, antacids and calcium, iron, magnesium, selenium or zinc supplements",["SPC"]]],note:[["Not recommended in pregnancy or breastfeeding",["FLU"]]]},
   "Nirmatrelvir/ritonavir":{ix:[["Boxed warning: ritonavir is a strong CYP3A inhibitor — review every medicine (Liverpool checker) before prescribing",["SPC","LIV"]]],note:[["eGFR 30–60: 150 mg/100 mg twice daily. eGFR <30 incl. haemodialysis: 300 mg/100 mg on day 1, then 150 mg/100 mg once daily (after dialysis)",["SPC"]]]},
   "Remdesivir":{note:[["No dose adjustment in renal impairment, including dialysis (FDA, 2023)",["REMR"]],["Check LFTs before and during treatment",["REMR"]]]},
   "Molnupiravir":{note:[["Not recommended in pregnancy. Contraception: females until 4 days after the last dose; males for at least 3 months",["SPC"]]]},
   "Tenofovir (TDF / TAF)":{warn:[["Boxed warning: severe hepatitis B flare on stopping",["SPC"]]],mon:[["TAF caused less fall in creatinine clearance and bone density than TDF",["SPC"]]],note:[["Test for HIV before starting for HBV",["SPC"]]]},
   "Entecavir":{warn:[["Boxed warning: hepatitis flare on stopping; not for HIV/HBV co-infection without full ART (HIV resistance)",["SPC"]]],po:["Empty stomach: at least 2 h after and 2 h before food",["SPC"]]},
   "Lamivudine / emtricitabine":{warn:[["Boxed warning: hepatitis B flare on stopping; HIV resistance if HIV is unrecognised",["SPC"]]],note:[["YMDD-mutant HBV emerges with monotherapy (about 24% by 52 weeks)",["SPC"]]]},
   "Sofosbuvir/velpatasvir":{warn:[["Boxed warning: HBV reactivation — test HBsAg and anti-HBc first",["SPC"]]],ix:[["Amiodarone: serious symptomatic bradycardia — not recommended",["SPC"]],["Antacids: separate by 4 h. PPIs not recommended (if essential: take with food 4 h before omeprazole 20 mg)",["SPC"]]]},
   "Glecaprevir/pibrentasvir":{warn:[["Boxed warning: HBV reactivation — test before treatment",["SPC"]]],ix:[["Contraindicated with atazanavir and rifampicin",["SPC"]]],po:["Take with food",["SPC"]]},
   "Antiretroviral therapy (combination)":{ix:[["Integrase-inhibitor levels fall with polyvalent cations (calcium, magnesium, aluminium, iron, zinc); ritonavir and cobicistat are potent CYP3A4 inhibitors",["DHHS","LIV"]]]},
   "Ribavirin":{warn:[["Contraindicated in pregnancy and in male partners of pregnant women; haemolytic anaemia is the main toxicity; hazardous drug (NIOSH Table 2)",["AHFS","NIOSH"]]]},
   "Tecovirimat":{po:["Take within 30 minutes after a full moderate- or high-fat meal",["SPC"]]}
  }
 },

 /* ---------------- ANTIMYCOBACTERIAL ---------------- */
 myc:{label:"TB & mycobacteria",noun:"agent",Noun:"Agent",plural:"agents",unit:"mycobacterial groups",pick:"Pick a mycobacterium",pickd:"Pick an agent",ph:"Rifampicin",hint:"rifamycin",
  intro:"Tap a TB or NTM category to see the agents used, or tap an agent to see where it fits. TB is always treated with combination regimens — single-drug labels show each drug's role in those regimens.",
  fams:["tb","ntm"],first:{org:"tbds",drug:"Rifampicin (R)"},
  orgs:[
   {id:"tbds",f:"tb",n:"TB disease, drug-susceptible",sh:"DS-TB",s:"",site:"Lungs, lymph nodes, spine, brain, any organ",note:"Standard 6 months: 2HRZE/4HR. A 4-month regimen (2HPMZ/2HPM: isoniazid, rifapentine, moxifloxacin, pyrazinamide) is an option for pulmonary TB from age 12 — not in pregnancy or breastfeeding, weight under 40 kg, CD4 under 100 or extrapulmonary TB.",r:["TBW"]},
   {id:"tbmdr",f:"tb",n:"TB, MDR/RR or pre-XDR",sh:"MDR/RR-TB",s:"Rifampicin-resistant",site:"Lungs and other sites",note:"WHO 2025: 6-month BPaLM (bedaquiline, pretomanid, linezolid 600 mg, moxifloxacin); BPaL if fluoroquinolone-resistant; BDLLfxC is an alternative 6-month regimen. Longer regimens are for extensive resistance, intolerance or complicated extrapulmonary TB.",r:["TBW"]},
   {id:"tbhr",f:"tb",n:"TB, isoniazid-resistant (rifampicin-susceptible)",sh:"Hr-TB",s:"",site:"Lungs and other sites",note:"WHO: rifampicin, ethambutol, pyrazinamide and levofloxacin for 6 months (confirm rifampicin susceptibility; test fluoroquinolone susceptibility). Do not add streptomycin or other injectables. Levofloxacin is the preferred fluoroquinolone.",r:["HRTB"]},
   {id:"ltbi",f:"tb",n:"TB infection (latent)",sh:"TB infection",s:"No active disease",site:"Prevents progression to active TB",note:"Preferred: 3HP (weekly isoniazid + rifapentine for 3 months), 4R (daily rifampicin for 4 months) or 3HR (daily isoniazid + rifampicin for 3 months). Alternatives: 6 or 9 months of isoniazid.",r:["LTBI"]},
   {id:"mac",f:"ntm",n:"Mycobacterium avium complex (MAC)",sh:"MAC",s:"",site:"Lungs (bronchiectasis, COPD)",note:"3-drug regimen: macrolide (azithromycin preferred) + ethambutol + rifamycin. Add IV amikacin (or streptomycin) for 2–3 months in cavitary, advanced or macrolide-resistant disease; add inhaled amikacin liposome if refractory after 6 months. Treat for at least 12 months after culture conversion.",r:["NTM"]},
   {id:"mabs",f:"ntm",n:"Mycobacterium abscessus",sh:"M. abscessus",s:"",site:"Lungs (cystic fibrosis, bronchiectasis)",note:"Use a macrolide only if there is no inducible (erm(41)) or mutational resistance. At least 3 active drugs guided by susceptibility testing, designed with experts. Parenteral options: amikacin, imipenem, cefoxitin, tigecycline; oral options: macrolides, linezolid, clofazimine.",r:["NTM"]}
  ],
  drugs:[
   {c:"First-line TB",n:"Isoniazid (H)",cov:{tbds:P("2HRZE/4HR",["TBW"]),ltbi:P("3HP or 3HR; 6–9H alternative",["LTBI"])}},
   {c:"First-line TB",n:"Rifampicin (R)",cov:{tbds:P("2HRZE/4HR",["TBW"]),tbhr:P("6 months with E, Z and levofloxacin",["HRTB"]),ltbi:P("4R or 3HR",["LTBI"]),mac:A(["NTM"])}},
   {c:"First-line TB",n:"Rifapentine (P)",cov:{tbds:L("4-month HPMZ regimen, age ≥12",["TBW"]),ltbi:P("3HP weekly",["LTBI"])}},
   {c:"First-line TB",n:"Rifabutin",cov:{tbds:L("Replaces rifampicin with interacting drugs (e.g. HIV protease inhibitors)",["ATS16","AHFS"]),mac:L("Alternative rifamycin",["NTM"])}},
   {c:"First-line TB",n:"Pyrazinamide (Z)",cov:{tbds:P("First 2 months",["TBW"]),tbhr:P("6 months (Hr-TB regimen)",["HRTB"])}},
   {c:"First-line TB",n:"Ethambutol (E)",cov:{tbds:P("First 2 months",["TBW"]),tbhr:P("6 months (Hr-TB regimen)",["HRTB"]),mac:P("Core drug",["NTM"])}},
   {c:"MDR-TB / second-line",n:"Bedaquiline",cov:{tbmdr:P("In BPaLM, BPaL and BDLLfxC",["TBW"])}},
   {c:"MDR-TB / second-line",n:"Pretomanid",cov:{tbmdr:P("Only within BPaLM or BPaL",["TBW"])}},
   {c:"MDR-TB / second-line",n:"Linezolid (for TB)",cov:{tbmdr:P("600 mg in BPaLM/BPaL",["TBW"]),mabs:L("Oral option",["NTM"])}},
   {c:"MDR-TB / second-line",n:"Moxifloxacin / levofloxacin",cov:{tbds:L("Moxifloxacin in the 4-month HPMZ regimen",["TBW"]),tbhr:P("Levofloxacin (preferred) for 6 months",["HRTB"]),tbmdr:P("Moxifloxacin in BPaLM; levofloxacin in BDLLfxC",["TBW"])}},
   {c:"MDR-TB / second-line",n:"Delamanid",cov:{tbmdr:L("In BDLLfxC (alternative 6-month regimen)",["TBW"])}},
   {c:"MDR-TB / second-line",n:"Clofazimine",cov:{tbmdr:L("Option within BDLLfxC",["TBW"]),mac:L("Companion to ethambutol instead of a rifamycin",["NTM"]),mabs:L("Oral option",["NTM"])}},
   {c:"NTM agents",n:"Azithromycin / clarithromycin",cov:{mac:P("Cornerstone; azithromycin preferred",["NTM"]),mabs:L("Only if no inducible or mutational macrolide resistance",["NTM"])}},
   {c:"NTM agents",n:"Amikacin (IV or inhaled liposomal)",cov:{mac:L("IV for cavitary/advanced disease; inhaled liposomal if refractory",["NTM"]),mabs:P("Parenteral option",["NTM"])}},
   {c:"NTM agents",n:"Imipenem / cefoxitin (IV)",cov:{mabs:P("Parenteral options",["NTM"])}}
  ],
  pn:{
   "Isoniazid (H)":{mon:[["Hepatitis risk rises with age and daily alcohol: baseline LFTs and monthly review",["AHFS"]]],note:[["Give pyridoxine to people at risk of neuropathy (pregnancy, HIV, diabetes, alcohol use, malnutrition, chronic renal failure, older age)",["ATS16"]]]},
   "Rifampicin (R)":{ix:[["Enzyme inducer: lowers warfarin, azoles, many antiretrovirals, hormonal contraceptives, ciclosporin/tacrolimus and corticosteroids",["AHFS"]]],mon:[["ALT/AST before starting and every 2–4 weeks",["AHFS"]]],note:[["Reddish urine, sputum, sweat and tears; can permanently stain soft contact lenses",["AHFS"]],["Food reduces absorption by about 30%",["AHFS"]]]},
   "Rifabutin":{ix:[["Weaker enzyme inducer than rifampicin; clarithromycin and HIV protease inhibitors raise rifabutin levels (uveitis risk)",["AHFS","SPC"]]]},
   "Pyrazinamide (Z)":{mon:[["Dose-related hepatotoxicity; hyperuricaemia expected — stop if gout develops",["AHFS"]]]},
   "Ethambutol (E)":{mon:[["Baseline eye examination; monthly visual acuity and colour testing if dose >15 mg/kg/day, beyond 2 months, or renal impairment",["AHFS"]]],note:[["Renal impairment: extend the dosing interval (e.g. 3 times weekly after haemodialysis)",["AHFS"]]]},
   "Bedaquiline":{mon:[["ECG before starting and at least at weeks 2, 12 and 24; stop if QTcF >500 ms. Extra QT risk with clofazimine and fluoroquinolones",["AHFS"]]],po:["Take with food (about 2-fold higher exposure)",["AHFS"]]},
   "Pretomanid":{mon:[["LFTs at baseline, week 2, then monthly. Blood counts and visual symptoms for linezolid toxicity",["AHFS"]]],note:[["Labelled only with bedaquiline and linezolid",["AHFS"]]]},
   "Linezolid (for TB)":{mon:[["Weekly blood counts, especially beyond 2 weeks; peripheral and optic neuropathy mainly beyond 28 days",["FDA_LZD"]]],ix:[["Serotonergic drugs: serotonin syndrome risk",["FDA_LZD"]]]},
   "Moxifloxacin / levofloxacin":{warn:[["Boxed warning: tendinitis/rupture, peripheral neuropathy, CNS effects; avoid in myasthenia gravis. QT prolongation",["FDA_FQ"]]]},
   "Clofazimine":{mon:[["QT prolongation (additive with bedaquiline); stop if QTcF ≥500 ms. Orange-pink to brownish-black skin discoloration in 75–100%, reversing over months to years",["SPC"]]]},
   "Azithromycin / clarithromycin":{ix:[["Clarithromycin is a strong CYP3A4 inhibitor (raises rifabutin; contraindicated with simvastatin and lovastatin) — azithromycin preferred for MAC",["SPC","NTM"]]],mon:[["QT prolongation; hearing loss and tinnitus reported",["SPC"]]]},
   "Amikacin (IV or inhaled liposomal)":{warn:[["Boxed warning: ototoxicity and nephrotoxicity — serial audiograms where feasible; monitor levels",["SPC"]]]},
   "Imipenem / cefoxitin (IV)":{ix:[["Imipenem with valproate: not recommended",["MHRA"]]]}
  }
 },

 /* ---------------- ANTIPARASITIC ---------------- */
 par:{label:"Antiparasitic",noun:"antiparasitic",Noun:"Antiparasitic",plural:"antiparasitics",unit:"parasite groups",pick:"Pick a parasite",pickd:"Pick an antiparasitic",ph:"Artesunate",hint:"antimalarial",
  intro:"Tap a parasite to see which drugs are used, or tap a drug to see what it treats. Green labels mark first-line choices; amber labels mark limits or specific uses.",
  fams:["mal","proto","helm","ecto"],first:{org:"pfu",drug:"Artemether-lumefantrine"},
  orgs:[
   {id:"pfu",f:"mal",n:"P. falciparum, uncomplicated",sh:"Falciparum (uncomplicated)",s:"",site:"Blood",note:"WHO: an ACT with 3 days of artemisinin. Artemether-lumefantrine is recommended in the first trimester of pregnancy. CDC (US) prefers artemether-lumefantrine, with atovaquone-proguanil second line.",r:["MAL","CDCMAL"]},
   {id:"psev",f:"mal",n:"Severe malaria",sh:"Severe malaria",s:"Any species",site:"Blood, brain, kidneys, lungs",note:"IV or IM artesunate for at least 24 h and until oral therapy is tolerated, then a 3-day ACT. If artesunate is unavailable, artemether is preferred to quinine. After IV artesunate, check weekly for up to 4 weeks for delayed haemolysis.",r:["MAL","CDCMAL"]},
   {id:"pviv",f:"mal",n:"P. vivax / P. ovale",sh:"Vivax / ovale",s:"",site:"Blood, with dormant liver stages (relapse)",note:"Blood stage: ACT, or chloroquine where susceptible. Relapse prevention after G6PD testing: primaquine 0.5 mg/kg/day for 14 days or 1 mg/kg/day for 7 days; tafenoquine only with G6PD activity ≥70% (WHO) — CDC also requires age ≥16. Neither drug in pregnancy.",r:["MAL","CDCMAL"]},
   {id:"toxo",f:"proto",n:"Toxoplasma gondii",sh:"Toxoplasma",s:"",site:"Brain (HIV), eye, congenital",note:"Pyrimethamine + sulfadiazine + leucovorin is preferred; TMP-SMX is an alternative. TMP-SMX is the preferred primary prophylaxis (seropositive, CD4 under 100).",r:["OI"]},
 {id:"trich",f:"proto",n:"Trichomonas vaginalis",sh:"Trichomonas",s:"",site:"Genital tract (STI)",note:"Women: metronidazole 500 mg twice daily for 7 days. Men: metronidazole 2 g once. Alternative: tinidazole 2 g once (avoid in pregnancy). Metronidazole can be used in pregnancy.",r:["CDC"]},
   {id:"cryptos",f:"proto",n:"Cryptosporidium",sh:"Cryptosporidium",s:"",site:"Gut (diarrhoea)",note:"Nitazoxanide is labelled for C. parvum diarrhoea from age 1, but has not been shown effective in HIV-infected or immunodeficient patients.",r:["SPC"]},
   {id:"leish",f:"proto",n:"Leishmania (visceral)",sh:"Visceral leishmaniasis",s:"Kala-azar",site:"Liver, spleen, bone marrow",note:"Liposomal amphotericin B is FDA-approved first line (immunocompetent: 3 mg/kg on days 1–5, 14 and 21). Miltefosine is an oral option for L. donovani (age ≥12, weight ≥30 kg). Cutaneous leishmaniasis does not always need treatment — individualise with expert advice.",r:["LEISH","SPC"]},
   {id:"giar",f:"proto",n:"Giardia duodenalis",sh:"Giardia",s:"",site:"Small intestine (diarrhoea)",note:"Options: tinidazole, nitazoxanide or metronidazole. Tinidazole and nitazoxanide are preferred in the HIV paediatric guideline; metronidazole is the alternative (not FDA-approved for giardiasis).",r:["YB","OIPED"]},
   {id:"ehis",f:"proto",n:"Entamoeba histolytica",sh:"Entamoeba",s:"",site:"Colon (dysentery), liver abscess",note:"Treat with metronidazole or tinidazole, then a luminal agent (paromomycin or iodoquinol).",r:["YB"]},
   {id:"stro",f:"helm",n:"Strongyloides stercoralis",sh:"Strongyloides",s:"",site:"Gut, skin; hyperinfection with steroids or HTLV-1",note:"Ivermectin first line; albendazole is the alternative. Test people on, or about to start, corticosteroids or immunosuppressants, and those with HTLV-1. Ivermectin is contraindicated with Loa loa infection and in pregnancy.",r:["STRO"]},
   {id:"sth",f:"helm",n:"Roundworm, hookworm, pinworm, whipworm",sh:"Intestinal worms",s:"",site:"Gut",note:"Albendazole or mebendazole (ivermectin for ascariasis and whipworm). Pinworm: single dose repeated after 2 weeks, with strict household hand hygiene.",r:["STH","PIN"]},
 {id:"schisto",f:"helm",n:"Schistosoma spp.",sh:"Schistosomiasis",s:"Bilharzia",site:"Bladder, bowel, liver",note:"Praziquantel 40 mg/kg/day in 2 doses for one day (S. mansoni, S. haematobium); 60 mg/kg/day in 3 doses for S. japonicum/mekongi. Treat at least 6–8 weeks after last freshwater exposure; a second dose 2–4 weeks later may be needed.",r:["SCHI"]},
   {id:"taenia",f:"helm",n:"Taenia (intestinal tapeworm)",sh:"Intestinal tapeworm",s:"",site:"Gut",note:"Praziquantel 5–10 mg/kg once. Alternatives: niclosamide 2 g once, or albendazole 400 mg daily for 3 days. Use praziquantel and albendazole cautiously if cysticercosis is possible (seizures reported).",r:["TAEN"]},
   {id:"echino",f:"helm",n:"Echinococcus (hydatid cyst)",sh:"Hydatid cyst",s:"Cystic echinococcosis",site:"Liver, lung",note:"Options: surgery, PAIR, albendazole 10–15 mg/kg/day (max 800 mg, in 2 doses) or mebendazole, or watch-and-wait, depending on the cyst. Alveolar echinococcosis: continuous benzimidazole for at least 2 years, with radical surgery where suitable.",r:["ECHI"]},
   {id:"cest",f:"helm",n:"Neurocysticercosis",sh:"Neurocysticercosis",s:"Taenia solium larvae",site:"Brain",note:"1–2 viable cysts: albendazole 10–14 days; more than 2: albendazole plus praziquantel. Start corticosteroids before antiparasitic drugs; antiepileptics if seizures. With untreated hydrocephalus or diffuse cerebral oedema, treat raised pressure only — no antiparasitic therapy.",r:["NCC"]},
   {id:"scab",f:"ecto",n:"Scabies",sh:"Scabies",s:"Sarcoptes scabiei",site:"Skin",note:"First line: permethrin 5% (neck down, wash off after 8–14 h; a second application about a week later may be needed) or oral ivermectin (2 doses 7–14 days apart). Crusted scabies needs oral and topical treatment together.",r:["SCAB"]}
  ],
  drugs:[
   {c:"Antimalarials",n:"Artemether-lumefantrine",cov:{pfu:P("First-line ACT; first trimester",["MAL","CDCMAL"]),pviv:P("Blood stage (ACT)",["MAL"])}},
   {c:"Antimalarials",n:"Other ACTs (artesunate-amodiaquine, artesunate-mefloquine, DHA-piperaquine, artesunate-SP, artesunate-pyronaridine)",cov:{pfu:P("WHO-recommended ACTs",["MAL"]),pviv:A(["MAL"])}},
   {c:"Antimalarials",n:"Artesunate (IV / IM)",cov:{psev:P("First line ≥24 h, then 3-day ACT",["MAL"])}},
   {c:"Antimalarials",n:"Quinine",cov:{psev:L("Only if artesunate and artemether unavailable",["MAL"])}},
   {c:"Antimalarials",n:"Atovaquone-proguanil",cov:{pfu:L("Second line if artemether-lumefantrine unavailable (CDC)",["CDCMAL"])}},
   {c:"Antimalarials",n:"Chloroquine",cov:{pviv:L("Blood stage, only where chloroquine-susceptible",["MAL"])}},
   {c:"Antimalarials",n:"Primaquine",cov:{pviv:P("Relapse prevention 7 or 14 days; G6PD test first",["MAL"]),pfu:L("Single 0.25 mg/kg dose with ACT in low-transmission areas",["MAL"])}},
   {c:"Antimalarials",n:"Tafenoquine",cov:{pviv:L("Alternative to primaquine; G6PD ≥70%",["MAL","CDCMAL"])}},
   {c:"Antiprotozoals",n:"Pyrimethamine + sulfadiazine",cov:{toxo:P("Preferred, with leucovorin",["OI"])}},
   {c:"Antiprotozoals",n:"Co-trimoxazole (TMP-SMX)",cov:{toxo:L("Treatment alternative; preferred prophylaxis",["OI"])}},
   {c:"Antiprotozoals",n:"Metronidazole / tinidazole",cov:{trich:P("Metronidazole first line; tinidazole alternative",["CDC"]),giar:P("Tinidazole preferred; metronidazole alternative",["OIPED","YB"]),ehis:P("Then a luminal agent",["YB"])}},
   {c:"Antiprotozoals",n:"Nitazoxanide",cov:{giar:P("Preferred option",["OIPED"]),cryptos:L("Labelled; not shown effective in HIV/immunodeficiency",["SPC"])}},
 {c:"Antiprotozoals",n:"Amphotericin B (liposomal)",cov:{leish:P("Visceral: FDA-approved first line",["LEISH","SPC"])}},
   {c:"Antiprotozoals",n:"Miltefosine",cov:{leish:L("Oral: L. donovani, age ≥12, ≥30 kg",["SPC","LEISH"])}},
   {c:"Antiprotozoals",n:"Paromomycin",cov:{ehis:L("Luminal agent after metronidazole/tinidazole",["YB"])}},
   {c:"Anthelmintics",n:"Ivermectin",cov:{stro:P("First line",["STRO"]),scab:P("Oral first-line option; with topical for crusted",["SCAB"]),sth:L("Ascariasis, whipworm",["STH"])}},
   {c:"Anthelmintics",n:"Albendazole",cov:{sth:P("First line",["STH","PIN"]),echino:P("10–15 mg/kg/day, alone or with surgery/PAIR",["ECHI"]),taenia:L("Alternative: 400 mg daily for 3 days",["TAEN"]),cest:P("1–2 cysts alone; >2 with praziquantel",["NCC"]),stro:L("Alternative",["STRO"])}},
   {c:"Anthelmintics",n:"Mebendazole",cov:{sth:P("First line",["STH","PIN"]),echino:L("Alternative to albendazole",["ECHI"])}},
   {c:"Anthelmintics",n:"Praziquantel",cov:{schisto:P("First line: 40 mg/kg/day (60 mg/kg for S. japonicum)",["SCHI"]),taenia:P("First line: 5–10 mg/kg once",["TAEN"]),cest:L("With albendazole for >2 viable cysts",["NCC"])}},
   {c:"Topical",n:"Permethrin 5% cream",cov:{scab:P("First line",["SCAB"])}}
  ],
  pn:{
   "Artemether-lumefantrine":{po:["Take with food — fat greatly increases absorption",["SPC"]],mon:[["Avoid in congenital QT prolongation or other QT-prolonging conditions",["SPC"]]]},
   "Artesunate (IV / IM)":{mon:[["Check weekly for up to 4 weeks for delayed haemolysis",["CDCMAL"]]]},
   "Quinine":{warn:[["Boxed warning: serious haematological reactions when used for leg cramps — not for that use",["SPC"]]],mon:[["Hypoglycaemia (especially in pregnancy), QT prolongation, cinchonism",["SPC"]]]},
   "Atovaquone-proguanil":{po:["Take with food or a milky drink",["SPC"]]},
   "Chloroquine":{mon:[["QT prolongation; irreversible retinal damage (risk with >2.3 mg/kg/day or over 5 years)",["SPC"]]]},
   "Primaquine":{warn:[["Test G6PD first (quantitative); not in pregnancy",["MAL","CDCMAL"]]]},
   "Tafenoquine":{warn:[["G6PD activity ≥70% required (WHO); CDC: normal quantitative G6PD and age ≥16; not in pregnancy",["MAL","CDCMAL"]]]},
   "Pyrimethamine + sulfadiazine":{note:[["Give leucovorin (folinic acid) with pyrimethamine",["OI"]]]},
   "Co-trimoxazole (TMP-SMX)":{mon:[["Frequent blood counts and chemistry; stop at the first rash",["SPC"]]]},
   "Metronidazole / tinidazole":{po:["Metronidazole: IV and oral pharmacokinetics similar",["AHFS"]],ix:[["Potentiates warfarin; avoid alcohol during and for 3 days after metronidazole",["SPC"]]]},
   "Nitazoxanide":{po:["Take with food",["SPC"]]},
   "Amphotericin B (liposomal)":{note:[["Visceral leishmaniasis (immunocompetent): 3 mg/kg on days 1–5, 14 and 21",["LEISH","SPC"]],["Not interchangeable mg-for-mg with conventional amphotericin B",["SPC"]]]},
   "Miltefosine":{warn:[["Boxed warning: embryo-fetal toxicity — pregnancy test first; contraception during and for 5 months after",["SPC"]]],po:["Take with meals; 28-day weight-based course",["SPC"]],mon:[["Kidney and liver function",["SPC"]]]},
   "Ivermectin":{po:["Label: empty stomach with water. CDC scabies guidance: take with food",["SPC","SCAB"]],warn:[["Heavy Loa loa infection: risk of serious or fatal encephalopathy — assess people from West/Central Africa first",["SPC"]]]},
   "Albendazole":{po:["Take with food (a fatty meal increases absorption)",["SPC"]],mon:[["Blood counts and transaminases at the start of each cycle and every 2 weeks; pregnancy test first; avoid in pregnancy",["SPC"]]]},
   "Mebendazole":{note:[["Pinworm: repeat the dose after 2 weeks",["PIN"]]]},
   "Praziquantel":{note:[["Taeniasis: use cautiously if cysticercosis is possible (seizures reported)",["TAEN"]]],ix:[["Contraindicated with strong CYP3A inducers such as rifampicin",["SPC"]]],warn:[["Contraindicated in ocular cysticercosis",["SPC"]]]},
   "Permethrin 5% cream":{note:[["Apply from the neck down; wash off after 8–14 hours",["SCAB"]]]}
  }
 }
};
const GORDER=["bac","fun","vir","myc","par"];
const SEL={bac:{org:"space",drug:"Meropenem/imipenem/doripenem"}};
GORDER.slice(1).forEach(g=>SEL[g]={...GROUPS[g].first});

/* Key current-guidance points shown in the What changed tab */
const KEYPOINTS=[
 ["Antibacterial","Cefoxitin (intra-abdominal)","Correction: cefoxitin IS a recommended single agent for mild–moderate community-acquired intra-abdominal infection; cefotetan and clindamycin are the agents not recommended","IAI"],
 ["Antibacterial","ESBL cystitis","Sulopenem added to the preferred oral options","IDSA"],
 ["Antibacterial","S. maltophilia","2026: cefiderocol monotherapy preferred for invasive infection. TMP-SMX, minocycline and levofloxacin shown as combination options from the 2023/24 guidance","IDSA24"],
 ["Antibacterial","Gaps closed (audit 5 Oct)","Added aztreonam; syphilis, typhoid and brucellosis; levofloxacin for Pseudomonas; gentamicin + azithromycin for gonorrhoea (cephalosporin allergy); levofloxacin and amoxicillin (pregnancy) for chlamydia; colistin for CRE cystitis; OXA-48 option","CDC"],
 ["Antibacterial","CRAB","2026: sulbactam-durlobactam is the priority. High-dose ampicillin-sulbactam, polymyxin B, minocycline and tigecycline shown as 2023/24 combination options (bridge only)","IDSA24"],
 ["Antifungal","Rezafungin","Once-weekly echinocandin, labelled from age 12 when alternatives are limited","SPC"],
 ["Antifungal","Candida auris","Echinocandin first line; test every clinical isolate (echinocandin- and pan-resistance rising)","CAURIS"],
 ["Antifungal","Cryptococcal meningitis","Single high-dose liposomal amphotericin B induction with flucytosine and fluconazole","CRYPTO"],
 ["Antiviral","Influenza","Oseltamivir for every hospitalised patient; adding baloxavir gave no extra benefit","FLU"],
 ["Antiviral","COVID-19","Molnupiravir only when nirmatrelvir/ritonavir cannot be used","COVID"],
 ["Antiviral","Nirmatrelvir/ritonavir","Label now includes dosing for eGFR <30, including haemodialysis","SPC"],
 ["Antiviral","Remdesivir","No renal dose adjustment, including dialysis","REMR"],
 ["Antiviral","CMV","Letermovir labelled for kidney transplant (D+/R−); maribavir for refractory CMV, never with ganciclovir","ASTCT"],
 ["Antiviral","Hepatitis B","WHO 2024: TDF or entecavir preferred; treatment eligibility widened","HBV"],
 ["Antiviral","Mpox","Tecovirimat showed no benefit in clade II mpox (STOMP)","MPOX"],
 ["TB","MDR/RR-TB","6-month BPaLM/BPaL; BDLLfxC as an alternative 6-month regimen (WHO 2025)","TBW"],
 ["TB","Drug-susceptible TB","4-month HPMZ regimen is an option from age 12","TBW"],
 ["TB","Isoniazid-resistant TB","Rifampicin, ethambutol, pyrazinamide and levofloxacin for 6 months","HRTB"],
 ["Antiparasitic","Gaps closed (audit 5 Oct)","Added Trichomonas, Cryptosporidium, visceral leishmaniasis, schistosomiasis, intestinal tapeworm and hydatid cyst","CDC"],
 ["Antifungal","Mucosal candidiasis","Fluconazole shown as first line for oesophageal and moderate–severe oral thrush; topical clotrimazole/miconazole for mild thrush","IDSA_CAN"],
 ["Antiparasitic","Malaria in pregnancy","Artemether-lumefantrine recommended in the first trimester","MAL"]
];

const NEWREFS=[
 ["IDSA_CAN","Pappas PG, et al. Clinical Practice Guideline for the Management of Candidiasis: 2016 Update by IDSA. Clin Infect Dis 2016;62:e1-50","https://www.idsociety.org/globalassets/idsa/practice-guidelines/clinical-practice-guideline-for-the-management-of-candidiasis-2016-update-by-the-infectious-diseases-society-of-america.pdf"],
 ["CAURIS","CDC. Clinical Treatment of Candida auris Infections (accessed 4 October 2026)","https://www.cdc.gov/candida-auris/hcp/clinical-care/index.html"],
 ["ASP16","Patterson TF, et al. IDSA Practice Guidelines for the Diagnosis and Management of Aspergillosis: 2016 Update. Clin Infect Dis 2016;63:e1-60","https://www.idsociety.org/practice-guideline/aspergillosis/"],
 ["MUC19","Cornely OA, et al. Global guideline for the diagnosis and management of mucormycosis (ECMM/MSG ERC). Lancet Infect Dis 2019;19:e405-21","https://www.ecmm.info/wp-content/uploads/Cornely-TLID-2019-Global-guideline-for-the-diagnosis-and-management-of-mucormycosis-an-initiative-of-the-ECMM-in-cooperation-with-theMSG-ERC_OC.pdf"],
 ["RAREM","Hoenigl M, et al. Global guideline for the diagnosis and management of rare mould infections (ECMM/ISHAM/ASM). Lancet Infect Dis 2021;21:e246-57","https://www.ecmm.info/wp-content/uploads/Hoenigl-TLID-2021-Global-guideline-for-the-diagnosis-and-management-of-rare-mould-infections-an-initiative-of-the-European-Confederation-of-Medical-Mycology-in-cooperation-with-the-International-Society.pdf"],
 ["CRYPTO","WHO. Guidelines for diagnosing, preventing and managing cryptococcal disease among adults, adolescents and children living with HIV, 2022 (recommendations chapter)","https://www.ncbi.nlm.nih.gov/books/NBK581839/"],
 ["JTDM","Takesue Y, et al. Clinical practice guideline for the therapeutic drug monitoring of voriconazole in non-Asian and Asian adult patients: consensus review by the Japanese Society of Chemotherapy and the Japanese Society of Therapeutic Drug Monitoring. Clin Ther 2022","https://www.sciencedirect.com/science/article/pii/S0149291822003538"],
 ["OI","NIH/CDC/HIVMA-IDSA. Guidelines for the Prevention and Treatment of Opportunistic Infections in Adults and Adolescents with HIV — Pneumocystis and Toxoplasma sections","https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-opportunistic-infections/pneumocystis"],
 ["OIPED","NIH. Guidelines for the Prevention and Treatment of Opportunistic Infections in Children with HIV — Giardiasis","https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-pediatric-opportunistic-infections/giardiasis"],
 ["FLU","CDC. Influenza Antiviral Medications: Summary for Clinicians (updated 10 March 2026)","https://www.cdc.gov/flu/hcp/antivirals/summary-clinicians.html"],
 ["COVID","IDSA Guidelines on the Treatment and Management of Patients with COVID-19 (page updated 23 September 2026)","https://www.idsociety.org/practice-guideline/covid-19-guideline-treatment-and-management/"],
 ["REMR","Veklury (remdesivir) US prescribing information, 2024","https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/214787s027lbl.pdf"],
 ["ASTCT","ASTCT Series #11: Updated Cytomegalovirus Guidelines in Hematopoietic Cell Transplant and Cellular Therapy Recipients. Transplant Cell Ther 2025","https://www.sciencedirect.com/science/article/pii/S2666636725012680"],
 ["MBV","Livtencity (maribavir) US prescribing information, 2024","https://www.accessdata.fda.gov/drugsatfda_docs/label/2024/215596s005lbl.pdf"],
 ["ECIL4","Hirsch HH, et al. ECIL-4 guidelines for RSV, parainfluenza, metapneumovirus, rhinovirus and coronavirus in leukaemia and HSCT patients. Clin Infect Dis 2013;56:258-66","https://academic.oup.com/cid/article/56/2/258/402780"],
 ["HBV","WHO. Guidelines for the prevention, diagnosis, care and treatment for people with chronic hepatitis B infection, 29 March 2024 (recommendations checked via the World Hepatitis Alliance briefing on the guideline)","https://www.who.int/publications/i/item/9789240090903"],
 ["HCV","AASLD-IDSA. HCV Guidance — simplified treatment for treatment-naive adults without cirrhosis","https://www.hcvguidelines.org/treatment-naive/simplified-treatment"],
 ["DHHS","DHHS Panel. Guidelines for the Use of Antiretroviral Agents in Adults and Adolescents with HIV (initial regimens; drug interactions)","https://clinicalinfo.hiv.gov/en/guidelines/hiv-clinical-guidelines-adult-and-adolescent-arv/what-start-initial-combination-regimens"],
 ["LIV","University of Liverpool drug interaction checkers (HIV, hepatitis, COVID-19)","https://www.hiv-druginteractions.org/"],
 ["MPOX","NIAID. Tecovirimat safe but ineffective as treatment for clade II mpox (STOMP trial)","https://www.niaid.nih.gov/news-events/tecovirimat-safe-ineffective-treatment-clade-ii-mpox"],
 ["TBW","WHO consolidated guidelines on tuberculosis. Module 4: treatment and care, 2025","https://www.ncbi.nlm.nih.gov/books/NBK613101/"],
 ["ATS16","Nahid P, et al. ATS/CDC/IDSA Clinical Practice Guidelines: Treatment of Drug-Susceptible Tuberculosis. Clin Infect Dis 2016;63:e147-95","https://www.idsociety.org/practice-guideline/treatment-of-drug-susceptible-tb/"],
 ["LTBI","Sterling TR, et al. Guidelines for the Treatment of Latent Tuberculosis Infection: NTCA and CDC, 2020. MMWR Recomm Rep 2020;69(1)","https://www.cdc.gov/mmwr/volumes/69/rr/rr6901a1.htm"],
 ["NTM","Daley CL, et al. Treatment of Nontuberculous Mycobacterial Pulmonary Disease: ATS/ERS/ESCMID/IDSA guideline. Clin Infect Dis 2020;71:e1-36","https://ntminfo.org/wp-content/uploads/2020/07/NTMguidelines2020.pdf"],
 ["MAL","WHO guidelines for malaria, 13 August 2025","https://www.severemalaria.org/sites/default/files/content/document/WHO%20malaria%20guidelines%20-%20August%202025.pdf"],
 ["CDCMAL","CDC. Treatment of uncomplicated malaria and treatment of severe malaria (clinical guidance pages)","https://www.cdc.gov/malaria/hcp/clinical-guidance/treatment-of-uncomplicated-malaria.html"],
 ["NCC","White AC Jr, et al. Diagnosis and Treatment of Neurocysticercosis: IDSA/ASTMH Clinical Practice Guidelines, 2017. Clin Infect Dis 2018;66:e49-75","https://www.idsociety.org/practice-guideline/neurocysticercosis/"],
 ["YB","CDC Yellow Book: Travelers' Diarrhea (giardiasis and amebiasis treatment)","https://www.cdc.gov/yellow-book/hcp/preparing-international-travelers/travelers-diarrhea.html"],
 ["STRO","CDC. Clinical Care of Strongyloides","https://www.cdc.gov/strongyloides/hcp/clinical-care/index.html"],
 ["STH","CDC. Clinical Care of Soil-transmitted Helminths","https://www.cdc.gov/sth/hcp/clinical-care/index.html"],
 ["PIN","CDC. Clinical Overview of Pinworm Infection","https://www.cdc.gov/pinworm/hcp/clinical-overview/index.html"],
 ["SCAB","CDC. Clinical Care of Scabies","https://www.cdc.gov/scabies/hcp/clinical-care/index.html"],
 ["NIOSH","NIOSH List of Hazardous Drugs in Healthcare Settings, 2024 (DHHS NIOSH Publication 2025-103)","https://www.cdc.gov/niosh/docs/2025-103/pdfs/2025-103.pdf"],
 ["SPC","FDA prescribing information (US product labels), read on 4 October 2026 via Drugs.com professional label pages and DailyMed — check against the product HMC stocks","https://www.drugs.com/pro/"],
 ["AHFS","AHFS Drug Information monographs (American Society of Health-System Pharmacists), read on 4 October 2026 via Drugs.com","https://www.drugs.com/monograph/"],
 ["IVOS","UKHSA. National antimicrobial intravenous-to-oral switch (IVOS) criteria for early switch","https://www.gov.uk/government/publications/antimicrobial-intravenous-to-oral-switch-criteria-for-early-switch/national-antimicrobial-intravenous-to-oral-switch-ivos-criteria-for-early-switch"],
 ["MEN04","Tunkel AR, et al. IDSA Practice Guidelines for the Management of Bacterial Meningitis. Clin Infect Dis 2004;39:1267-84","https://academic.oup.com/cid/article/39/9/1267/402080"],
 ["CDCLIS","CDC. Listeria: clinical care information","https://www.cdc.gov/listeria/hcp/clinical-care/index.html"],
 ["DAP","Cubicin (daptomycin) US prescribing information","https://www.drugs.com/pro/cubicin.html"],
 ["TYPH","CDC Yellow Book: Typhoid and Paratyphoid Fever (treatment and resistance)","https://www.cdc.gov/yellow-book/hcp/travel-associated-infections-diseases/typhoid-and-paratyphoid-fever.html"],
 ["BRUC","CDC. Clinical Overview of Brucellosis (treatment)","https://www.cdc.gov/brucellosis/hcp/clinical-overview/"],
 ["HRTB","WHO treatment guidelines for isoniazid-resistant tuberculosis, 2018 (policy recommendations)","https://www.ncbi.nlm.nih.gov/books/NBK531408/"],
 ["SCHI","CDC. Clinical Care of Schistosomiasis","https://www.cdc.gov/schistosomiasis/hcp/treatment/index.html"],
 ["TAEN","CDC. Clinical Treatment of Taeniasis","https://www.cdc.gov/taeniasis/hcp/clinical-care/index.html"],
 ["LEISH","CDC. Clinical Care of Leishmaniasis","https://www.cdc.gov/leishmaniasis/hcp/clinical-care/index.html"],
 ["ECHI","CDC. Clinical Treatment of Echinococcosis","https://www.cdc.gov/echinococcosis/hcp/clinical-care/index.html"]
];

/* ---------- References (numbered in this order) ---------- */
const REFS=[
 ["IDSA","Tamma PD, et al. IDSA 2026 Guidance on the Treatment of Antimicrobial Resistant Gram-Negative Infections (published 30 Jul 2026)","https://www.idsociety.org/practice-guideline/amr-guidance/"],
 ["IAI","Solomkin JS, et al. Diagnosis and management of complicated intra-abdominal infection in adults and children: guidelines by SIS and IDSA. Clin Infect Dis 2010;50:133-64 (full text)","https://www.sbp.com.br/fileadmin/user_upload/pdfs/08_Diagnosis_and_Management_of_Complicated_Intra-abdominal_Infection_in_Adults_and_Children_IDSA_2010.pdf"],
 ["CDI","Johnson S, et al. IDSA/SHEA 2021 Focused Update: Management of Clostridioides difficile Infection in Adults. Clin Infect Dis 2021;73:755-7","https://www.idsociety.org/practice-guideline/clostridioides-difficile-2021-focused-update/"],
 ["CDC","CDC Sexually Transmitted Infections Treatment Guidelines, 2021 (gonorrhea, chlamydia, genital herpes sections)","https://www.cdc.gov/std/treatment-guidelines/"],
 ["IDSA24","Tamma PD, et al. IDSA Guidance on the Treatment of Antimicrobial-Resistant Gram-Negative Infections, version 3.0 (7 June 2023, updated 19 January 2024) — S. maltophilia and CRAB sections, checked via the Guideline Central summary. Partly superseded by the 2026 version","https://www.guidelinecentral.com/guideline/308215/"],
 ["WHO","WHO. AWaRe (Access, Watch, Reserve) classification of antibiotics, 2025","https://www.who.int/publications/i/item/B09489"],
 ["ASHP","Rybak MJ, et al. ASHP/IDSA/PIDS/SIDP consensus: Therapeutic monitoring of vancomycin for serious MRSA infections. Am J Health-Syst Pharm 2020","https://www.idsociety.org/practice-guideline/vancomycin/"],
 ["MHRA","MHRA Drug Safety Update: Carbapenems — concomitant use with valproic acid not recommended","https://www.gov.uk/drug-safety-update/carbapenems-concomitant-use-with-valproic-acid-not-recommended"],
 ["FDA_TGC","Tygacil (tigecycline) US prescribing information — boxed warning and warnings","https://www.drugs.com/pro/tygacil.html"],
 ["FDA_FQ","Levofloxacin US prescribing information — fluoroquinolone class boxed warning, QT and pharmacokinetics","https://www.drugs.com/pro/levofloxacin.html"],
 ["FDA_LZD","Zyvox (linezolid) US prescribing information","https://www.drugs.com/pro/zyvox.html"],
 ["DAPP","Khan DA, et al. Drug allergy: a 2022 practice parameter update. J Allergy Clin Immunol 2022;150:1333-93 (AAAAI/ACAAI)","https://www.aaaai.org/Aaaai/media/Media-Library-PDFs/Allergist%20Resources/Statements%20and%20Practice%20Parameters/Drug-Allergy-2022.pdf"],
];
REFS.push(...NEWREFS);
REFS.push(["UBC","McCormack J, Lalji F. The 'Best' Antibiotic Sensitivity Chart Ever. Faculty of Pharmaceutical Sciences, UBC, Nov 2019 (original chart)",""]);
const REFNUM=Object.fromEntries(REFS.map((r,i)=>[r[0],i+1]));
const cite=k=>`<sup class="ref" title="${esc(REFS[REFNUM[k]-1][1])}">[${REFNUM[k]}]</sup>`;
const cites=ks=>ks.map(cite).join("");

/* ---------- Organisms added in 2026 view ---------- */
const ORG26=[
 {id:"vre",f:"gpos",n:"VRE",s:"Vancomycin-resistant Enterococcus (mainly E. faecium)",site:"Hospital-acquired infections",only26:1},
 {id:"listeria",f:"gpbac",n:"Listeria monocytogenes",s:"",site:"Brain (meningitis), bloodstream; pregnancy, neonates, immunocompromised",only26:1},
 {id:"steno",f:"gneg",n:"Stenotrophomonas maltophilia",s:"",site:"Hospital-acquired, mainly respiratory tract",only26:1},
 {id:"crab",f:"gneg",n:"CRAB",s:"Carbapenem-resistant Acinetobacter baumannii",site:"Hospital-acquired: respiratory tract, bloodstream",only26:1},
 {id:"typhi",f:"gneg",n:"Salmonella Typhi / Paratyphi",s:"Enteric (typhoid) fever",site:"Bloodstream, gut",only26:1},
 {id:"brucella",f:"gneg",n:"Brucella spp.",s:"Brucellosis",site:"Bloodstream, bones and joints (spine), endocarditis, CNS",only26:1},
 {id:"tpall",f:"spir",n:"Treponema pallidum",s:"Syphilis",site:"Genital, skin, CNS/eye/ear (neurosyphilis), congenital",only26:1}
];
Object.assign(ORGNOTE26,{
 vre:["Vancomycin is inactive. Linezolid is FDA-labelled for VRE E. faecium. Daptomycin is not labelled for VRE (its enterococcal indication is vancomycin-susceptible E. faecalis only) — off-label use needs ID input.",["FDA_LZD","DAP"]],
 listeria:["Ampicillin or penicillin G is recommended (IDSA meningitis guideline); CDC lists IV ampicillin plus gentamicin for 14–21 days. TMP-SMX or meropenem are alternatives. Cephalosporin-based empirical regimens need ampicillin added when Listeria is possible.",["MEN04","CDCLIS"]],
 steno:["IDSA 2026: cefiderocol monotherapy is preferred for invasive infection; aztreonam-avibactam, preferably with a second agent, is an alternative. The earlier IDSA guidance (2023, updated 2024) recommended combining two of: TMP-SMX, minocycline (favoured over tigecycline), cefiderocol or levofloxacin. AHFS lists minocycline as an alternative to co-trimoxazole. Separate infection from colonisation; confirm the regimen with ID.",["IDSA","IDSA24","AHFS"]],
 typhi:["Most S. Typhi and Paratyphi A infections are now fluoroquinolone-nonsusceptible. From Pakistan or Iraq: azithromycin for uncomplicated illness and a carbapenem for complicated illness (XDR strains); adding azithromycin may help if not improving on a carbapenem alone. From most other countries: ceftriaxone or azithromycin. Adjust to culture susceptibility.",["TYPH"]],
 brucella:["Doxycycline plus rifampin for at least 6 weeks. Alternative: doxycycline plus streptomycin or gentamicin. TMP-SMX if there are contraindications (allergy, pregnancy). The B. abortus RB51 vaccine strain is rifampin-resistant — use TMP-SMX instead.",["BRUC"]],
 tpall:["Primary/secondary syphilis: benzathine penicillin G 2.4 million units IM once. Penicillin allergy (not pregnant): doxycycline 14 days, tetracycline 14 days or ceftriaxone 10 days; azithromycin is no longer recommended. Pregnancy: desensitise and treat with penicillin. Neurosyphilis, ocular or otosyphilis: aqueous penicillin G 18–24 million units/day IV for 10–14 days (ceftriaxone 1–2 g daily is an alternative in penicillin allergy).",["CDC"]],
 crab:["IDSA 2026: sulbactam-durlobactam (with a carbapenem) is the priority for invasive CRAB; other options only as a bridge until it is available. The earlier IDSA guidance (2023, updated 2024) recommended high-dose ampicillin-sulbactam plus at least one other agent (polymyxin B, high-dose minocycline or tigecycline), with cefiderocol for refractory infection.",["IDSA","IDSA24"]]
});
const EXTRA=[
 ["Linezolid/tedizolid","vre","Linezolid is labelled for VRE E. faecium","FDA_LZD"],
 ["Vancomycin/daptomycin","vre","Daptomycin: off-label only (not labelled for VRE); vancomycin inactive","DAP"],
 ["Penicillin V/G","listeria","IV penicillin G: recommended option","MEN04"],
 ["Amoxicillin/ampicillin","listeria","Ampicillin: recommended; CDC adds gentamicin","MEN04"],
 ["Trimethoprim-sulfamethoxazole","listeria","Alternative","MEN04"],
 ["Meropenem/imipenem/doripenem","listeria","Meropenem: alternative","MEN04"],
 ["Cefiderocol","steno","Preferred for invasive infection","IDSA"],
 ["Aztreonam-avibactam","steno","Alternative, preferably with a second agent","IDSA"],
 ["Sulbactam-durlobactam","crab","Preferred, given with a carbapenem","IDSA"],
 ["Cefiderocol","crab","Bridge only until sulbactam-durlobactam is available","IDSA"],
 ["Trimethoprim-sulfamethoxazole","steno","Combination component (IDSA 2023/24); 2026 prefers cefiderocol monotherapy for invasive infection","IDSA24"],
 ["Minocycline (high-dose)","steno","Combination component, favoured over tigecycline (IDSA 2023/24)","IDSA24"],
 ["Tigecycline","steno","Combination component; minocycline favoured (IDSA 2023/24)","IDSA24"],
 ["Levofloxacin/moxifloxacin","steno","Levofloxacin: combination component (IDSA 2023/24)","IDSA24"],
 ["Ampicillin-sulbactam (high-dose)","crab","High-dose, plus another agent (IDSA 2023/24); 2026: bridge until sulbactam-durlobactam","IDSA24"],
 ["Colistin/polymyxin B","crab","Polymyxin B: combination partner (IDSA 2023/24); bridge only","IDSA24"],
 ["Minocycline (high-dose)","crab","Combination partner (IDSA 2023/24); bridge only","IDSA24"],
 ["Tigecycline","crab","Combination partner (IDSA 2023/24); bridge only","IDSA24"],
 ["Clarithromycin/azithromycin","typhi","Azithromycin: uncomplicated illness (incl. from Pakistan/Iraq)","TYPH"],
 ["Ceftriaxone/cefotaxime","typhi","Ceftriaxone: travellers from most countries; not for XDR strains","TYPH"],
 ["Meropenem/imipenem/doripenem","typhi","Carbapenem: complicated illness or XDR (Pakistan/Iraq), ± azithromycin","TYPH"],
 ["Tetracycline/doxycycline","brucella","Doxycycline + rifampin for ≥6 weeks: first line","BRUC"],
 ["Rifampin","brucella","With doxycycline (not for the RB51 strain)","BRUC"],
 ["Gentamicin/tobramycin/amikacin","brucella","Gentamicin (or streptomycin) with doxycycline: alternative","BRUC"],
 ["Trimethoprim-sulfamethoxazole","brucella","If contraindications (allergy, pregnancy) or RB51 strain","BRUC"],
 ["Penicillin V/G","tpall","Benzathine penicillin G: first line; IV aqueous penicillin G for neurosyphilis","CDC"],
 ["Tetracycline/doxycycline","tpall","Doxycycline 14 days: penicillin allergy (not in pregnancy)","CDC"],
 ["Ceftriaxone/cefotaxime","tpall","Ceftriaxone: penicillin-allergy alternative (incl. neurosyphilis)","CDC"],
 ["Gentamicin/tobramycin/amikacin","ngon","Gentamicin 240 mg IM + azithromycin 2 g: if cephalosporin allergy","CDC"],
 ["Levofloxacin/moxifloxacin","chlam","Levofloxacin 7 days: alternative","CDC"],
 ["Amoxicillin/ampicillin","chlam","Amoxicillin 7 days: alternative in pregnancy","CDC"],
 ["Levofloxacin/moxifloxacin","pseudo","Levofloxacin only (labelled, e.g. 750 mg for nosocomial pneumonia)","FDA_FQ"],
 ["Colistin/polymyxin B","cre","Colistin: alternative for uncomplicated CRE cystitis only","IDSA24"],
 ["Ceftriaxone/cefotaxime","entero","Only with ampicillin, for E. faecalis endocarditis (AHA regimen)","AHFS"]
];

/* ---------- Pharmacist notes (AWaRe, IV→PO, monitoring, interactions, warnings, notes) ---------- */
const AW={A:"Access",W:"Watch",R:"Reserve"};
const PN={
 "Penicillin V/G":{aw:"A"},
 "Amoxicillin/ampicillin":{aw:"A",po:["Amoxicillin: 74–92% of an oral dose absorbed",["AHFS"]],note:[["Penicillin–cephalosporin cross-reactivity is mainly through shared R1 side chains",["DAPP"]]]},
 "Cloxacillin":{aw:"A"},
 "Amoxicillin-clavulanate":{aw:"A",note:[["Not suggested for ESBL cystitis; not for ESBL bacteraemia step-down",["IDSA"]]]},
 "Piperacillin-tazobactam":{aw:"W",note:[["Not suggested for ESBL infections outside the urinary tract, even if tested susceptible",["IDSA"]],["Suboptimal for invasive infection by moderate-risk AmpC organisms",["IDSA"]]]},
 "Cefazolin/cephalexin":{aw:"A",note:[["Cefazolin (non-cross-reactive) can be given routinely after penicillin anaphylaxis without testing",["DAPP"]],["Not a Listeria option — use ampicillin",["MEN04"]]]},
 "Cefuroxime":{aw:"W",po:["Cefuroxime axetil bioavailability 37% fasting, 52% with food",["SPC"]]},
 "Cefoxitin":{aw:"W",note:[["Cephamycins not suggested for ESBL infections",["IDSA"]]]},
 "Ceftriaxone/cefotaxime":{aw:"W",note:[["Does not cover Listeria: add ampicillin when Listeria is possible (e.g. neonates, older adults, immunocompromised)",["MEN04"]],["Avoid for invasive infection by E. cloacae, K. aerogenes, C. freundii (AmpC)",["IDSA"]]]},
 "Cefixime":{aw:"W"},
 "Ceftazidime":{aw:"W",note:[["Identical R1 side chain to aztreonam: avoid aztreonam in ceftazidime allergy",["DAPP"]]]},
 "Ceftolozane-tazobactam":{aw:"R",note:[["Reserve for carbapenem-resistant organisms; not suggested for AmpC-E",["IDSA","WHO"]]]},
 "Cefepime":{aw:"W",note:[["Preferred for moderate-risk AmpC organisms if MIC ≤8",["IDSA"]],["Avoid for ESBL cUTI or invasive ESBL infection, even if susceptible",["IDSA"]]]},
 "Ceftobiprole":{aw:"R"},
 "Meropenem/imipenem/doripenem":{aw:"W",ix:[["Valproate: carbapenems cause a rapid, large fall in valproate levels — combination not recommended; use an alternative antibiotic",["MHRA"]]],note:[["Preferred for invasive ESBL infection (meropenem or imipenem if critically ill)",["IDSA"]]]},
 "Ertapenem":{aw:"W",ix:[["Valproate: combination not recommended (class effect)",["MHRA"]]],note:[["Highly protein-bound: prefer meropenem/imipenem if critically ill or albumin <2.5 g/dL",["IDSA"]]]},
 "Erythromycin":{aw:"W"},
 "Clarithromycin/azithromycin":{aw:"W",po:["Absolute bioavailability: azithromycin 38%, clarithromycin 50–55%",["SPC","AHFS"]],note:[["Azithromycin no longer recommended for gonorrhoea",["CDC"]]]},
 "Tetracycline/doxycycline":{aw:"A",po:["Doxycycline: 90–100% absorbed (fasting)",["AHFS"]],note:[["Avoid doxycycline for ESBL cystitis (low urine levels)",["IDSA"]],["Doxycycline is preferred for chlamydia",["CDC"]]]},
 "Tigecycline":{aw:"R",warn:[["Boxed warning: increased all-cause mortality — reserve for when alternatives are unsuitable",["FDA_TGC"]]],note:[["Low serum and urine levels: not for bloodstream or urinary infections",["IDSA"]],["Permanent tooth discoloration if used in the second half of pregnancy, infancy or childhood up to age 8",["FDA_TGC"]]]},
 "Ciprofloxacin/norfloxacin":{aw:"W",po:["Ciprofloxacin 500 mg oral every 12 h = AUC of 400 mg IV every 12 h",["SPC"]],warn:[["Boxed warning: tendinitis/rupture, peripheral neuropathy, CNS effects; avoid in myasthenia gravis",["FDA_FQ"]]]},
 "Levofloxacin/moxifloxacin":{aw:"W",po:["Levofloxacin about 99% bioavailable",["FDA_FQ"]],warn:[["Boxed warning: tendinitis/rupture, peripheral neuropathy, CNS effects; avoid in myasthenia gravis",["FDA_FQ"]]]},
 "Gentamicin/tobramycin/amikacin":{aw:"A",awx:"Access (gentamicin, amikacin); tobramycin is Watch",mon:[["Duration-dependent nephrotoxicity: monitor renal function",["IDSA"]]],note:[["Single-dose aminoglycoside is a preferred option for ESBL cystitis",["IDSA"]]]},
 "Colistin/polymyxin B":{aw:"R",mon:[["Nephrotoxicity in about 30% of patients even with short courses: monitor renal function",["IDSA"]]],note:[["Polymyxin B is cleared non-renally: use colistin, not polymyxin B, for urinary infections",["IDSA"]],["Most Proteus, Providencia and Serratia strains are resistant",["AHFS"]]]},
 "Clindamycin":{aw:"A",po:["Oral absorption virtually complete (90%)",["SPC"]],note:[["Not recommended for intra-abdominal infection (B. fragilis resistance)",["IAI"]]]},
 "Vancomycin/daptomycin":{aw:"W",awx:"Vancomycin: Watch · Daptomycin: Reserve",mon:[["Vancomycin: AUC-guided dosing, target AUC 400–600 mg·h/L; trough-only monitoring no longer recommended",["ASHP"]],["Daptomycin: monitor CPK weekly, more often with statins or renal impairment",["DAP"]]],note:[["Daptomycin is not indicated for pneumonia (inactivated by pulmonary surfactant)",["DAP"]],["Oral vancomycin for C. difficile only (not absorbed)",["CDI"]]]},
 "Linezolid/tedizolid":{aw:"R",po:["Linezolid: about 100% bioavailable — same dose IV or oral",["FDA_LZD"]],mon:[["Weekly blood counts, especially beyond 2 weeks; peripheral/optic neuropathy mainly beyond 28 days",["FDA_LZD"]]],ix:[["Serotonin syndrome with serotonergic drugs, especially SSRIs/SNRIs; contraindicated with MAOIs",["FDA_LZD"]]]},
 "Trimethoprim-sulfamethoxazole":{aw:"A",po:["Rapidly and well absorbed orally",["AHFS"]],note:[["Preferred for ESBL cUTI if susceptible; only ~50% of ESBL urinary isolates are susceptible",["IDSA"]]]},
 "Chloramphenicol":{aw:"A"},
 "Metronidazole":{aw:"A",po:["IV and oral pharmacokinetics similar",["AHFS"]],note:[["For C. difficile: only if fidaxomicin/vancomycin unavailable (non-severe)",["CDI"]]]},
 "Nitrofurantoin/fosfomycin":{aw:"A",awx:"Nitrofurantoin: Access · IV fosfomycin: Reserve",note:[["Cystitis only — not for pyelonephritis or bacteraemia step-down",["IDSA"]],["Oral fosfomycin: E. coli only (fosA genes in Klebsiella)",["IDSA"]],["IV fosfomycin has a high sodium load: caution in heart failure and the elderly",["IDSA"]]]},
 "Rifampin":{aw:"W",po:["Well absorbed; food reduces absorption by about 30%",["AHFS"]]},
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
 "Aztreonam":{aw:null,note:[["Limited activity against Gram-positive and anaerobic bacteria — add other agents empirically if these are possible",["SPC"]],["Can be given in penicillin or cephalosporin allergy without testing, except ceftazidime allergy (identical R1 side chain)",["DAPP"]]]},
 "Ampicillin-sulbactam (high-dose)":{aw:null,note:[["Not recommended for community-acquired intra-abdominal infection: high E. coli resistance",["IAI"]],["CRAB: high-dose sulbactam plus another agent was preferred in IDSA 2023/24; IDSA 2026 prioritises sulbactam-durlobactam",["IDSA24","IDSA"]]]},
 "Minocycline (high-dose)":{aw:null,note:[["Off-label for S. maltophilia (alternative to co-trimoxazole) and Acinetobacter",["AHFS"]]]},
 "Ceftaroline":{aw:null,note:[["Coverage from the FDA label: MRSA only for skin infections, not pneumonia",["SPC"]]]}
};
const DRUG26=(()=>{
  const out=DRUG.map(d=>({...d,cov:{...d.cov},chg:{}}));
  CHANGES.forEach(([dn,o,act,t,src])=>{
    const d=out.find(x=>x.n===dn); if(!d) return;
    if(act==="remove"){delete d.cov[o];} else {d.cov[o]={q:t};}
    d.chg[o]={t,src,act};
  });
  NEWDRUGS.forEach(nd=>{const d={...nd,cov:{...nd.cov},chg:{},isNew:true};Object.keys(d.cov).forEach(o=>d.chg[o]={t:"New agent",src:nd.src,act:"new"});let at=-1;out.forEach((x,i)=>{if(x.c===d.c)at=i});if(at<0){const nw=out.findIndex(x=>/^Newer agents/.test(x.c));if(nw>=0){out.splice(nw,0,d);return;}}if(at>=0)out.splice(at+1,0,d);else out.push(d);});
  EXTRA.forEach(([dn,o,t,src])=>{const d=out.find(x=>x.n===dn);if(!d)return;d.cov[o]={q:t};d.chg[o]={t:"Added organism: "+t,src,act:"new"};});
  return out;
})();
let ver="2026", grp="bac";
const G=()=>GROUPS[grp];
const DATA=()=>grp!=="bac"?G().drugs:(ver==="2026"?DRUG26:DRUG);
const orgName=o=>ver==="2026"&&o.id==="space"?"AmpC organisms (SPACE)":ver==="2026"&&o.id==="cre"?"CRE":o.n;
const orgSub=o=>ver==="2026"&&o.id==="cre"?"Carbapenem-resistant Enterobacterales":ver==="2026"&&o.id==="space"?"Enterobacter, K. aerogenes, Citrobacter, Serratia, Proteus, Acinetobacter":o.s;
const css=v=>`var(${v})`;
const esc=s=>String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]));
const famOrder=["gpos","gpbac","gneg","gncc","anae","atyp","spir"];
const famList=()=>grp==="bac"?famOrder:G().fams;
const ORGS=()=>grp!=="bac"?G().orgs:(ver==="2026"?ORG.concat(ORG26):ORG);
const ALLORGS=ORG.concat(ORG26,...GORDER.slice(1).map(g=>GROUPS[g].orgs));
const orgById=Object.fromEntries(ALLORGS.map(o=>[o.id,o]));
const shortName=id=>SHORT[id]||orgById[id].sh||orgById[id].n;
const drugsFor=id=>DATA().filter(d=>d.cov[id]);
const badge=(d,o)=>grp==="bac"&&ver==="2026"&&d.chg&&d.chg[o]?`<span class="upd" title="${esc(SRC[d.chg[o].src])}">2026</span>`:"";
const vtext=v=>v&&(v.p||v.q)||"";
const vcite=v=>v&&v.r?cites(v.r):"";
const vlabels=(v,tag)=>`${v&&v.p?`<span class="pp">${esc(v.p)}</span>`:""}${(v&&v.q)||tag?`<span class="qual">${esc((v&&v.q)||tag)}</span>`:""}${vcite(v)}`;

function renderLegend(){
  const items=grp==="bac"?[["gpos","Gram-positive"],["gneg","Gram-negative"],["anae","Anaerobes"],["atyp","Atypicals"]]:G().fams.map(f=>[f,FAM[f].name]);
  document.getElementById("legend").innerHTML=items.map(([f,l])=>`<span class="lg"><span class="sw" style="background:${css(FAM[f].c)}"></span>${esc(l)}</span>`).join("")+
   (grp==="bac"?`<span class="lg"><span class="upd">2026</span>updated against current guidance</span>`:`<span class="lg"><span class="pp" style="margin:0">First line</span>preferred</span><span class="lg"><span class="qual" style="margin:0">Limit</span>limitation or specific use</span>`);
}

let curOrg=SEL.bac.org, curDrug=SEL.bac.drug;

const KEYGAPS=["entero","camrsa","pseudo","esbl","bact","myco","listeria"];
function pnPanel(d){
  const bac=grp==="bac";
  const p=(bac?PN:G().pn)[d.n]||{};
  const line=(arr)=>arr.map(([t,r])=>`<li>${esc(t)}${cites(r)}</li>`).join("");
  const gaps=bac?KEYGAPS.filter(o=>orgById[o]&&ORGS().some(x=>x.id===o)&&!d.cov[o]).map(o=>SHORT[o]):ORGS().filter(o=>!d.cov[o.id]).map(o=>shortName(o.id));
  let pills="";
  if(bac){
    const awCls=p.aw?{A:"aw-a",W:"aw-w",R:"aw-r"}[p.aw]:"aw-n";
    const awTxt=p.awx||(p.aw?AW[p.aw]:"Not confirmed");
    pills+=`<span class="awp ${awCls}" title="WHO AWaRe 2025">WHO AWaRe: ${esc(awTxt)}</span>${cite("WHO")}`;
  }
  if(p.po) pills+=`<span class="awp po">${bac?"IV→PO: ":"Oral use: "}${esc(p.po[0])}</span>${cites(p.po[1])}`;
  let h=`<div class="pn"><div class="pnh"><h3>Pharmacist notes</h3><div class="pills">${pills}</div></div><div class="pngrid">`;
  if(p.warn) h+=`<div class="pns warn"><h4>Boxed warning / safety alert</h4><ul>${line(p.warn)}</ul></div>`;
  if(p.mon) h+=`<div class="pns"><h4>Monitoring</h4><ul>${line(p.mon)}</ul></div>`;
  if(p.ix) h+=`<div class="pns"><h4>Key interactions</h4><ul>${line(p.ix)}</ul></div>`;
  if(p.note) h+=`<div class="pns"><h4>Pharmacist points</h4><ul>${line(p.note)}</ul></div>`;
  h+=`<div class="pns"><h4>Not active against / not used for (from this chart)</h4><p style="margin:0;font-size:14px">${gaps.length?gaps.map(esc).join(", "):"None of the key groups"}</p></div>`;
  return h+`</div></div>`;
}
function renderToolkit(){
  const el=document.getElementById("toolkit");
  const iv=[["Linezolid","About 100% (same dose IV/oral)","FDA_LZD"],["Levofloxacin","About 99%","FDA_FQ"],["Isavuconazole","98% (same dose IV/oral)","SPC"],["Voriconazole","About 96% (1 h before/after food)","AHFS"],["Fluconazole","Over 90%","SPC"],["Clindamycin","90% (virtually complete)","SPC"],["Doxycycline","90–100% (fasting)","AHFS"],["Amoxicillin","74–92%","AHFS"],["Famciclovir (as penciclovir)","About 77%","SPC"],["Valganciclovir (as ganciclovir)","About 59% (with food)","SPC"],["Valaciclovir (as aciclovir)","About 55% (oral aciclovir 10–20%)","SPC"],["Clarithromycin","50–55%","AHFS"],["Cefuroxime axetil","37% fasting, 52% with food","SPC"],["Azithromycin","38%","SPC"],["Ciprofloxacin","500 mg oral q12h = AUC of 400 mg IV q12h","SPC"],["Metronidazole","IV and oral pharmacokinetics similar","AHFS"],["TMP-SMX","Rapidly and well absorbed","AHFS"],["Rifampicin","Well absorbed; food reduces absorption ~30%","AHFS"]];
  const tdm=[["Voriconazole","Trough ≥1 mg/L (≥2 mg/L suggested for invasive aspergillosis); keep below 5.5 mg/L, or below 4 mg/L in Asian patients. First level on day 3 (day 5 in Asian patients if possible)","JTDM"],["Posaconazole, itraconazole","TDM recommended once at steady state — use the HMC laboratory target range","ASP16"],["Flucytosine","Prolonged levels above 100 mcg/mL are linked to toxicity","SPC"]];
  const hd=[["Table 1","Ganciclovir, valganciclovir, cidofovir, chloramphenicol"],["Table 2","Ribavirin, voriconazole, fluconazole, zidovudine, entecavir, miltefosine"]];
  const gl=[["ESBL","Extended-spectrum β-lactamase: inactivates most penicillins, cephalosporins and aztreonam; carbapenems usually still active","IDSA"],["AmpC","Chromosomal β-lactamase that can be induced during therapy (E. cloacae, K. aerogenes, C. freundii, H. alvei)","IDSA"],["CRE","Enterobacterales resistant to at least one carbapenem or producing a carbapenemase","IDSA"],["KPC / OXA-48","Serine carbapenemases (use an active-site serine); choose the agent by enzyme type — see IDSA Section 3","IDSA"],["NDM / VIM / IMP","Metallo-β-lactamases — avibactam, relebactam, vaborbactam do not inhibit them; use aztreonam-avibactam or cefiderocol","IDSA"],["DTR P. aeruginosa","Not susceptible to pip-tazo, ceftazidime, cefepime, aztreonam, meropenem, imipenem, ciprofloxacin and levofloxacin","IDSA"],["CRAB","Carbapenem-resistant Acinetobacter baumannii","IDSA"],["AUC (vancomycin)","Area under the concentration–time curve over 24 h; target 400–600 mg·h/L","ASHP"],["AWaRe","WHO grouping: Access (first choice), Watch (higher resistance risk), Reserve (last resort)","WHO"],["TDM","Therapeutic drug monitoring: measuring blood levels to adjust the dose","ASP16"],["ACT","Artemisinin-based combination therapy: first-line treatment for uncomplicated falciparum malaria","MAL"],["Radical cure","Treatment that clears dormant P. vivax/ovale liver stages (primaquine or tafenoquine) to prevent relapse","MAL"],["BPaLM","Bedaquiline, pretomanid, linezolid and moxifloxacin: 6-month regimen for MDR/RR-TB","TBW"],["DAA","Direct-acting antiviral for hepatitis C (e.g. sofosbuvir/velpatasvir)","HCV"]];
  el.innerHTML=`
  <div class="tk">
   <section class="panel"><h2>β-lactam allergy: quick guide</h2>
    <ol class="al">
     <li><strong>Unverified, non-anaphylactic penicillin allergy:</strong> a cephalosporin can be given without testing or extra precautions.${cite("DAPP")}</li>
     <li><strong>Penicillin anaphylaxis:</strong> a cephalosporin with a dissimilar R1 side chain can be given without testing or extra precautions.${cite("DAPP")}</li>
     <li><strong>Cefazolin</strong> is non-cross-reactive and can be given routinely after penicillin anaphylaxis without testing.${cite("DAPP")}</li>
     <li><strong>Aztreonam</strong> can be given in penicillin or cephalosporin allergy without testing — except ceftazidime allergy (identical R1 side chain).${cite("DAPP")}</li>
     <li><strong>Carbapenems</strong> can be given in penicillin or cephalosporin allergy without testing or extra precautions.${cite("DAPP")}</li>
     <li><strong>Cross-reactivity</strong> between cephalosporins (and with penicillins) relates mainly to the R1 side chain, not the β-lactam ring.${cite("DAPP")}</li>
    </ol>
    <p class="fine">Follow the HMC β-lactam allergy pathway, and involve allergy/ID for any history of a severe reaction (for example SJS/TEN or DRESS).</p>
   </section>
   <section class="panel"><h2>IV → oral switch: bioavailability</h2>
    <table class="chgt" style="min-width:0"><thead><tr><th class="l">Drug</th><th class="l">Oral bioavailability</th></tr></thead><tbody>${iv.map(([a,b,r])=>`<tr><td class="l"><strong>${esc(a)}</strong></td><td class="l">${esc(b)}${cite(r)}</td></tr>`).join("")}</tbody></table>
    <p class="fine">National IVOS criteria: review within 48 h of the first IV dose, then daily. Switch when signs are improving, temperature 36–38 °C for 24 h, early warning score falling (WCC/CRP trending down), gut functioning with safe swallow, no vomiting in 24 h, and a suitable oral option exists. Needs special consideration: bloodstream infection, empyema, endocarditis, meningitis, osteomyelitis, severe/necrotising soft-tissue infection, septic arthritis, undrained abscess.${cite("IVOS")}</p>
   </section>
   <section class="panel"><h2>Antifungal TDM targets</h2>
    <table class="chgt" style="min-width:0"><thead><tr><th class="l">Drug</th><th class="l">Target</th></tr></thead><tbody>${tdm.map(([a,b,r])=>`<tr><td class="l"><strong>${esc(a)}</strong></td><td class="l">${esc(b)}${cite(r)}</td></tr>`).join("")}</tbody></table>
    <p class="fine">IDSA recommends azole TDM once steady state is reached. Follow the HMC laboratory range where it differs.${cite("ASP16")}</p>
   </section>
   <section class="panel"><h2>Azole interactions: quick check</h2>
    <ol class="al">
     <li><strong>Voriconazole:</strong> when starting, cut tacrolimus to one-third and ciclosporin to one-half, then monitor levels. Contraindicated with rifampicin, rifabutin, carbamazepine, long-acting barbiturates, St John's wort, sirolimus and ergots.${cite("SPC")}</li>
     <li><strong>Posaconazole:</strong> tacrolimus to about one-third and ciclosporin to about three-quarters. Contraindicated with sirolimus, ergots and CYP3A4-metabolised statins.${cite("SPC")}</li>
     <li><strong>Isavuconazole:</strong> moderate CYP3A4 inhibitor — monitor tacrolimus, ciclosporin and sirolimus; shortens QTc.${cite("SPC")}</li>
     <li><strong>Fluconazole:</strong> moderate CYP2C9/3A4 and strong CYP2C19 inhibitor — warfarin, phenytoin, sulfonylureas.${cite("SPC")}</li>
     <li><strong>Rifampicin</strong> lowers fluconazole, itraconazole and voriconazole levels.${cite("AHFS")} <strong>Letermovir</strong> lowers voriconazole; <strong>maribavir</strong> raises tacrolimus.${cite("SPC")}${cite("MBV")}</li>
    </ol>
   </section>
   <section class="panel"><h2>Hazardous anti-infectives (NIOSH 2024)</h2>
    <table class="chgt" style="min-width:0"><thead><tr><th class="l">NIOSH list</th><th class="l">Drugs</th></tr></thead><tbody>${hd.map(([a,b])=>`<tr><td class="l"><strong>${esc(a)}</strong></td><td class="l">${esc(b)}${cite("NIOSH")}</td></tr>`).join("")}</tbody></table>
    <p class="fine">Table 1 drugs carry cancer risk; Table 2 drugs carry reproductive or other risks. Prepare and handle according to the HMC hazardous drug policy (containment, PPE and labelling).${cite("NIOSH")}</p>
   </section>
   <section class="panel" style="grid-column:1/-1"><h2>Glossary</h2>
    <dl class="gl">${gl.map(([t,d,r])=>`<div><dt>${esc(t)}</dt><dd>${esc(d)}${cite(r)}</dd></div>`).join("")}</dl>
   </section>
  </div>`;
}
function renderRefs(){
  document.getElementById("refs").innerHTML=`<ol class="refl">${REFS.map(([k,t,u])=>`<li id="ref-${k}">${esc(t)}${u?` — <a href="${esc(u)}" target="_blank" rel="noopener">${esc(u.replace(/^https?:\/\//,"").slice(0,70))}${u.length>78?"…":""}</a>`:""}</li>`).join("")}</ol><p class="fine">Every statement in this chart was re-checked on 4 October 2026 against the source cited next to it; statements that could not be confirmed in a primary guideline, an FDA label or AHFS were removed. Two links point to summaries because the original was not reachable: WHO hepatitis B 2024 (checked via the World Hepatitis Alliance briefing) and the cryptococcal guideline chapter on NCBI Bookshelf. US guidance (IDSA, CDC, DHHS) should be checked against the HMC antibiogram, formulary and national policy.</p>`;
}
function renderOrgPanel(){
  const el=document.getElementById("orgPanel");
  el.innerHTML=famList().map(f=>{
    const list=ORGS().filter(o=>o.f===f); if(!list.length) return "";
    return `<div class="fam"><h3 style="color:${css(FAM[f].c)}"><span class="sw" style="background:${css(FAM[f].c)}"></span>${FAM[f].name}</h3><div class="orgs">`+
    list.map(o=>{const on=o.id===curOrg;const hasUpd=grp==="bac"&&ver==="2026"&&ORGNOTE26[o.id];return `<button class="org" data-o="${o.id}" aria-pressed="${on}" style="${on?`border-color:${css(FAM[f].c)};background:${css(FAM[f].bg)}`:""}"><span>${esc(orgName(o))}${hasUpd?` <span class="upd">2026</span>`:""}${orgSub(o)?`<br><small>${esc(orgSub(o))}</small>`:""}</span><span class="count" style="background:${css(FAM[f].bg)};color:${css(FAM[f].c)}">${drugsFor(o.id).length}</span></button>`}).join("")+`</div></div>`;
  }).join("");
  el.querySelectorAll(".org").forEach(b=>b.onclick=()=>{curOrg=b.dataset.o;renderOrgPanel();renderOrgDetail();if(innerWidth<820)document.getElementById("orgDetail").scrollIntoView({behavior:"smooth"})});
}
function renderOrgDetail(){
  const o=orgById[curOrg],F=FAM[o.f],ds=drugsFor(o.id);
  const byC={};ds.forEach(d=>(byC[d.c]=byC[d.c]||[]).push(d));
  const bac=grp==="bac";
  const removed=bac&&ver==="2026"?DRUG26.filter(d=>d.chg[o.id]&&d.chg[o.id].act==="remove"):[];
  const n26=bac&&ver==="2026"&&ORGNOTE26[o.id];
  const gnote=!bac&&o.note?`<div class="note upnote">${esc(o.note)}${cites(o.r||[])}</div>`:"";
  document.getElementById("orgDetail").innerHTML=
  `<div class="hero" style="background:${css(F.bg)}"><div class="kicker" style="color:${css(F.c)}">${F.name}</div><h2>${esc(orgName(o))}</h2>${orgSub(o)?`<div style="margin:-4px 0 10px;color:var(--muted)">${esc(orgSub(o))}</div>`:""}
   <span class="site"><strong>Common sites:</strong> ${esc(o.site)}</span>
   ${bac&&o.note&&!(ver==="2026"&&o.id==="space")?`<div class="note">${esc(o.note)}</div>`:""}
   ${n26?`<div class="note upnote"><span class="upd">2026</span> ${Array.isArray(n26)?esc(n26[0])+cites(n26[1]):esc(n26)}</div>`:""}${gnote}</div>
   <p style="margin:0 0 10px;font-weight:700">${ds.length} ${esc(G().noun)} option${ds.length===1?"":"s"}, grouped by class</p>
   <div class="classes">${Object.entries(byC).map(([c,list])=>`<div class="cls"><h4>${esc(c)}</h4>${list.map(d=>{const v=d.cov[o.id];return `<span class="drug">${esc(d.n)}${badge(d,o.id)}${vlabels(v,d.tag)}</span>`}).join("")}</div>`).join("")}</div>
   ${removed.length?`<div class="cls" style="margin-top:12px;border-style:dashed"><h4>Removed in the 2026 update</h4>${removed.map(d=>`<span class="drug" style="text-decoration:line-through;color:var(--muted)">${esc(d.n)}</span><div style="font-size:13px;color:var(--muted);margin:-2px 0 6px">${esc(d.chg[o.id].t)} · ${esc(SRC[d.chg[o.id].src])}</div>`).join("")}</div>`:""}`;
}
function renderDrugList(){
  const t=document.getElementById("q").value.trim().toLowerCase();
  const el=document.getElementById("drugList");
  const list=DATA().filter(d=>!t||d.n.toLowerCase().includes(t)||d.c.toLowerCase().includes(t));
  if(!DATA().some(d=>d.n===curDrug)) curDrug=grp==="bac"?"Meropenem/imipenem/doripenem":G().first.drug;
  let lc="";
  el.innerHTML=list.length?list.map(d=>{const hd=d.c!==lc?`<div style="font-size:12px;font-weight:700;color:var(--muted);margin:10px 10px 2px">${esc(d.c)}</div>`:"";lc=d.c;const up=grp==="bac"&&ver==="2026"&&d.chg&&Object.keys(d.chg).length;return hd+`<button class="dl" data-d="${esc(d.n)}" aria-pressed="${d.n===curDrug}"><span>${esc(d.n)}${up?` <span class="upd">${d.isNew?"new":"2026"}</span>`:""}</span><small>${Object.keys(d.cov).length}/${ORGS().length}</small></button>`}).join(""):`<p style="color:var(--muted);margin:8px">No ${esc(G().noun)} matches “${esc(t)}”. Try the class name, such as “${esc(G().hint)}”.</p>`;
  el.querySelectorAll(".dl").forEach(b=>b.onclick=()=>{curDrug=b.dataset.d;renderDrugList();renderDrugDetail();if(innerWidth<820)document.getElementById("drugDetail").scrollIntoView({behavior:"smooth"})});
}
function renderDrugDetail(){
  const d=DATA().find(x=>x.n===curDrug),n=Object.keys(d.cov).length,bac=grp==="bac";
  const removed=bac&&ver==="2026"&&d.chg?Object.entries(d.chg).filter(([o,c])=>c.act==="remove"):[];
  document.getElementById("drugDetail").innerHTML=
  `<div class="panel" style="margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap">
     <div style="min-width:0;flex:1 1 240px"><div style="color:var(--muted);font-size:14px;font-weight:700">${esc(d.c)}</div><h2 style="margin:2px 0 0;font-size:clamp(22px,3vw,30px);line-height:1.15;overflow-wrap:anywhere">${esc(d.n)}</h2>${d.tag?`<span class="qual" style="margin:6px 0 0">${esc(d.tag)}</span>`:""}${bac&&d.isNew?`<div style="font-size:13px;color:var(--muted);margin-top:6px">Source: ${esc(SRC[d.src])}</div>`:""}</div>
     <div style="text-align:right"><div class="bigstat">${n}<span style="font-size:20px;color:var(--muted)"> / ${ORGS().length}</span></div><div style="font-size:13px;color:var(--muted)">${esc(G().unit)} covered</div></div>
   </div>
   ${!bac||ver==="2026"?pnPanel(d):""}
   ${removed.length?`<div class="note upnote" style="margin:0 0 14px"><span class="upd">2026</span> Removed: ${removed.map(([o,c])=>`${esc(SHORT[o])} — ${esc(c.t.replace(/^Removed: /,""))}`).join("; ")}</div>`:""}
   <div class="ribbon">${famList().filter(f=>ORGS().some(o=>o.f===f)).map(f=>{const F=FAM[f];return `<div class="rrow"><h3 style="color:${css(F.c)}"><span class="sw" style="background:${css(F.c)}"></span>${F.name}</h3><div class="cells">`+
     ORGS().filter(o=>o.f===f).map(o=>{const v=d.cov[o.id];const sub=o.f==="gneg"&&orgSub(o)?`<span class="q" style="font-weight:400;color:var(--muted)">${esc(orgSub(o))}</span>`:"";return v?`<div class="cell on" style="background:${css(F.bg)};border-color:${css(F.c)}">${esc(orgName(o))}${badge(d,o.id)}${sub}${v.p?`<span class="q" style="color:var(--ok)">${esc(v.p)}${vcite(v)}</span>`:""}${v.q?`<span class="q" style="color:var(--warn)">${esc(v.q)}${vcite(v)}</span>`:""}</div>`:`<div class="cell">${esc(orgName(o))}${sub}<span class="q" style="font-weight:400">Not covered</span></div>`}).join("")+`</div></div>`}).join("")}</div>`;
}
function renderMatrix(){
  const t=document.getElementById("matrix");
  const cols=ORGS().length;
  t.style.minWidth=grp==="bac"?"1060px":(230+cols*46)+"px";
  t.style.width=grp==="bac"?"100%":"auto";
  let h=`<thead><tr><th class="dn">${esc(G().Noun)}</th>`+ORGS().map(o=>`<th class="v" title="${esc(orgName(o)+(orgSub(o)?" – "+orgSub(o):""))}"><span style="color:${css(FAM[o.f].c)}">${esc(shortName(o.id))}</span></th>`).join("")+`</tr></thead><tbody>`;
  let last="";
  DATA().forEach(d=>{
    if(d.c!==last){h+=`<tr class="clsrow"><td colspan="${cols+1}">${esc(d.c)}</td></tr>`;last=d.c}
    h+=`<tr><td class="dn">${esc(d.n)}</td>`+ORGS().map(o=>{const v=d.cov[o.id],c=css(FAM[o.f].c),ch=grp==="bac"&&ver==="2026"&&d.chg&&d.chg[o.id];const mark=ch?`<span class="chg" aria-hidden="true"></span>`:"";const tip=esc(orgName(o))+(vtext(v)?": "+esc(vtext(v)):"")+(ch?" — 2026: "+esc(ch.t)+" ("+esc(SRC[ch.src])+")":"");return `<td title="${tip}" style="position:relative">${v?(v.q?`<span class="dot p" style="border-color:${c}" aria-label="Active with limitation"></span>`:`<span class="dot" style="background:${c}" aria-label="Active"></span>`):(ch?`<span class="x" aria-label="Removed">×</span>`:"")}${mark}</td>`}).join("")+`</tr>`;
  });
  t.innerHTML=h+"</tbody>";
}
function renderChanges(){
  const el=document.getElementById("changeList");
  const rows=CHANGES.map(([dn,o,act,t,src])=>`<tr><td class="l"><strong>${esc(dn)}</strong></td><td class="l">${esc(SHORT[o])}</td><td class="l"><span class="pill ${act}">${act==="remove"?"Removed":"Changed"}</span> ${esc(t.replace(/^Removed: /,""))}</td><td class="l s">${esc(SRC[src])}</td></tr>`).join("")
   +EXTRA.map(([dn,o,t,src])=>`<tr><td class="l"><strong>${esc(dn)}</strong></td><td class="l">${esc(SHORT[o])}</td><td class="l"><span class="pill new">Organism added</span> ${esc(t)}</td><td class="l s">${esc(SRC[src]||REFS[REFNUM[src]-1][1])}</td></tr>`).join("")
   +NEWDRUGS.filter(d=>Object.keys(d.cov).length).map(d=>`<tr><td class="l"><strong>${esc(d.n)}</strong></td><td class="l">${Object.keys(d.cov).map(o=>esc(SHORT[o])).join(", ")}</td><td class="l"><span class="pill new">Added</span> ${d.why?esc(d.why):(Object.values(d.cov).map(v=>v.q).filter(Boolean).filter((x,i,a)=>a.indexOf(x)===i).map(esc).join("; ")||"New agent")}</td><td class="l s">${esc(SRC[d.src])}</td></tr>`).join("");
  const counts=GORDER.slice(1).map(g=>`${GROUPS[g].label}: ${GROUPS[g].orgs.length} pathogen groups, ${GROUPS[g].drugs.length} drugs`).join(" · ");
  el.innerHTML=`<h2 style="margin:16px 16px 8px;font-size:18px">Antibacterial chart: changes to the 2019 original</h2><table class="chgt"><thead><tr><th class="l">Antibiotic</th><th class="l">Bacteria</th><th class="l">Change</th><th class="l">Source</th></tr></thead><tbody>${rows}</tbody></table>
  <h2 style="margin:24px 16px 4px;font-size:18px">New sections added October 2026</h2><p class="fine" style="margin:0 16px 8px">${esc(counts)}. Key points from current guidance:</p>
  <table class="chgt"><thead><tr><th class="l">Section</th><th class="l">Topic</th><th class="l">Current guidance</th><th class="l">Source</th></tr></thead><tbody>${KEYPOINTS.map(([s,t,x,r])=>`<tr><td class="l">${esc(s)}</td><td class="l"><strong>${esc(t)}</strong></td><td class="l"><span class="pill new">Current</span> ${esc(x)}</td><td class="l s">${esc(REFS[REFNUM[r]-1][1])}</td></tr>`).join("")}</tbody></table>`;
}
function syncGroupUI(){
  const g=G();
  document.querySelectorAll(".grp button").forEach(b=>b.setAttribute("aria-pressed",b.dataset.g===grp));
  document.getElementById("verRow").classList.toggle("hide",grp!=="bac");
  document.getElementById("intro").textContent=g.intro;
  document.getElementById("tab-bug").textContent=g.pick;
  document.getElementById("tab-drug").textContent=g.pickd;
  document.getElementById("lblq").textContent=(/^[aeiou]/i.test(g.noun)?"Find an ":"Find a ")+g.noun;
  document.getElementById("q").placeholder=g.ph;
  document.getElementById("mapnote").textContent=grp==="bac"?"Filled dot = active. Ring = active with a limitation. × = removed in the 2026 update. A small orange corner marks every updated cell; hover to read the change and its source.":"Filled dot = active (including first-line choices). Ring = limited or specific use only. Hover a cell, or open the drug, to read the detail and its source.";
}
function setGroup(g){
  if(g===grp) return;
  SEL[grp]={org:curOrg,drug:curDrug};
  grp=g; curOrg=SEL[g].org; curDrug=SEL[g].drug;
  document.getElementById("q").value="";
  syncGroupUI(); renderAll();
}
function renderAll(){renderLegend();renderOrgPanel();renderOrgDetail();renderDrugList();renderDrugDetail();renderMatrix();}
document.getElementById("grpRow").innerHTML=GORDER.map(g=>`<button data-g="${g}" aria-pressed="${g===grp}">${esc(GROUPS[g].label)}</button>`).join("");
document.querySelectorAll(".grp button").forEach(b=>b.onclick=()=>setGroup(b.dataset.g));
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".tabs button").forEach(x=>x.setAttribute("aria-selected",x===b));
  ["bug","drug","map","tk","chg","ref"].forEach(v=>document.getElementById("v-"+v).classList.toggle("hide",v!==b.dataset.v));
});
document.querySelectorAll(".ver button").forEach(b=>b.onclick=()=>{
  ver=b.dataset.ver;document.querySelectorAll(".ver button").forEach(x=>x.setAttribute("aria-pressed",x===b));renderAll();
});
document.getElementById("q").addEventListener("input",renderDrugList);
syncGroupUI();renderAll();renderChanges();renderToolkit();renderRefs();
