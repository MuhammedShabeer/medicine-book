# Spectra (Bug–Drug Navigator): verification log

**Date:** 4 October 2026

**Method:** I re-checked every statement in the tool against the source cited next to it. I read the actual text of each primary guideline, each FDA prescribing information (US label) and each AHFS Drug Information monograph (ASHP). Anything I could not confirm in one of these was **removed or reworded**; nothing was left in from memory.

The navigator is still a **reference tool, not an approved clinical guideline**. It needs sign-off from ID / antimicrobial stewardship / P&T and a check against the HMC antibiogram and formulary.

## Corrections (the previous content was wrong)

| Item | Was | Now (source) |
|---|---|---|
| Cefoxitin vs B. fragilis | "Unreliable: rising resistance" | Still a recommended single agent for mild–moderate community-acquired intra-abdominal infection. The agents that are not recommended are cefotetan and clindamycin (IDSA/SIS 2010). |
| Moxifloxacin (intra-abdominal) | "Not reliable" | Avoid if a quinolone was used in the previous 3 months (IDSA/SIS 2010). |
| Azithromycin bioavailability | ~50% | 38% (FDA label) |
| Clarithromycin bioavailability | ~50% | 50–55% (AHFS) |
| Amoxicillin/ampicillin bioavailability | 50–90% | Amoxicillin 74–92% (AHFS) |
| Posaconazole DR tablets | Take with food | With or without food (FDA label) |
| Posaconazole + ciclosporin | Reduce dose (no figure given) | Reduce to about three-quarters (FDA label) |
| Rezafungin | Adults | Age 12 and over, when alternatives are limited or absent; safety not established beyond 4 doses (FDA label) |
| Nirmatrelvir/ritonavir, eGFR <30 | "Check label" | Now has dosing: 300/100 mg on day 1, then 150/100 mg daily, including haemodialysis (FDA label) |
| AmBisome dose | 3–10 mg/kg | Labelled 3–6 mg/kg/day; the mucormycosis guideline uses 5–10 mg/kg/day |
| Flucytosine | Renal threshold CrCl ≤40 | Removed. The label gives no threshold; it says to use extreme caution and monitor closely. |
| Voriconazole TDM target | "1–5.5 mg/L (IDSA)" | IDSA 2016 gives no figure. Replaced with the Japanese Society of Chemotherapy / JSTDM consensus (2022): ≥1 mg/L; below 5.5 mg/L (below 4 mg/L in Asian patients). |
| Foscarnet for VZV, ganciclovir for HSV/VZV | Listed | Removed (not confirmed) |
| Cidofovir for HSV | IV cidofovir | CDC lists topical cidofovir 1% gel as an alternative for aciclovir-resistant genital HSV |
| Scabies | Ivermectin second line | Oral ivermectin and permethrin are both first line (CDC) |
| Nitazoxanide (Giardia) | Alternative | Preferred option, with tinidazole (NIH paediatric OI guideline) |
| Quinine (severe malaria) | Fallback if no artesunate | WHO prefers artemether to quinine when artesunate is unavailable |
| ESBL cystitis | Sulopenem missing | Sulopenem added to the preferred oral options (IDSA 2026) |
| Ceftaroline | MRSA covered (all sites) | MRSA is labelled for skin infections only, not pneumonia (FDA label) |

## Removed because no accredited source confirmed them

- "40% / 20% cross-reactivity" figures and the specific ampicillin–cephalexin / amoxicillin–cefadroxil pairings. The 2022 practice parameter does not list them.
- High-dose daptomycin (≥8 mg/kg) for VRE. Now stated as: not labelled for VRE, off-label use needs ID input.
- Tigecycline "not active vs Proteus/Morganella/Providencia". EUCAST could not be accessed from here, and neither the FDA label nor AHFS states this.
- Posaconazole, itraconazole and flucytosine numeric TDM targets (BSMM 2014 could not be accessed). The tool now says "TDM recommended — use the HMC laboratory range" (IDSA 2016); flucytosine keeps the label statement that levels above 100 mcg/mL are linked to toxicity.
- "Fluconazole/voriconazole inactive vs Mucorales", "A. terreus resistant to amphotericin", "C. auris mostly fluconazole-resistant", "HCV cure over 95%", "remove central lines", "contact precautions", "treat household contacts" (scabies), "do not interrupt ART", delamanid QT monitoring, "amikacin in longer MDR-TB regimens", "albendazole less effective" (Strongyloides), tafenoquine/praziquantel uses outside the guideline text.
- Secondary sources removed entirely: IDStewardship handout, Louth hospital guide, BJHM review, Johns Hopkins ABX Guide, UMEM pearls, CCJM 2006 review, mdedge news pages, VRE case report, WHO EML summary, AFP summary of CDC STI, and the EUCAST table (not accessible).

## Replaced with primary sources

| Topic | Old source | New source |
|---|---|---|
| β-lactam allergy | IDStewardship handout | AAAAI/ACAAI Drug Allergy Practice Parameter 2022 (full text) |
| IV-to-oral switch criteria | Louth hospital guide | UKHSA national IVOS criteria |
| Bioavailability figures | Secondary | FDA labels and AHFS monographs |
| Listeria | Johns Hopkins | IDSA bacterial meningitis guideline 2004; CDC Listeria clinical care |
| Daptomycin, linezolid, tigecycline, fluoroquinolone safety | Secondary | Respective FDA labels |
| CDC STI | AFP summary | CDC STI guidelines 2021 (gonorrhea, chlamydia, herpes pages) |
| Intra-abdominal | Guideline summary | IDSA/SIS 2010 full text |
| CMV | Not opened | ASTCT Series #11 (2025) plus Prevymis and Livtencity labels |

## Sources not fully accessible (stated honestly in the tool)

- **WHO hepatitis B 2024:** the WHO PDF was blocked. Its recommendations (TDF or entecavir preferred; TAF for renal or bone concerns; wider eligibility) were checked through the World Hepatitis Alliance briefing on the guideline.
- **ECMM/ISHAM/ASM candidiasis 2025:** the full text was blocked, so no statement in the tool relies on it. The candida content uses IDSA 2016 and CDC.

## Before go-live

1. ID / stewardship review of each section, with the HMC antibiogram.
2. P&T approval; record the approver, the date and the next review date (suggested 12 months).
3. Check product-specific label details against the brands HMC stocks.

## Update: 4 October 2026 (evening), after pharmacist review

You spotted that **TMP-SMX (Septrin) was missing for S. maltophilia**. A check of the other resistant organisms found the same kind of gap for **CRAB**.

| Organism | Added | Source |
|---|---|---|
| S. maltophilia | TMP-SMX, high-dose minocycline (favoured over tigecycline), tigecycline, levofloxacin — as **combination components** | IDSA AMR Guidance v3.0 (2023, updated Jan 2024), checked via the Guideline Central summary. AHFS lists minocycline as an alternative to co-trimoxazole. |
| S. maltophilia | Kept: cefiderocol monotherapy **preferred** for invasive infection; aztreonam-avibactam ± second agent as alternative | IDSA 2026 update history |
| CRAB | High-dose ampicillin-sulbactam plus another agent; polymyxin B, minocycline, tigecycline as partners; cefiderocol for refractory infection | IDSA v3.0 (2023/24) |
| CRAB | Kept: sulbactam-durlobactam (with a carbapenem) is the **priority**; other options are a bridge only | IDSA 2026 |
| New rows | "Ampicillin-sulbactam (high-dose)", with its FDA-labelled spectrum and a note that it is not recommended for intra-abdominal infection (E. coli resistance, IDSA/SIS 2010); "Minocycline (high-dose)" (AHFS) | FDA label, AHFS |

**Limitation, stated in the tool:** the online 2026 IDSA guidance page is cut off before its S. maltophilia section, so the exact 2026 wording on TMP-SMX could not be read. TMP-SMX is therefore labelled as a 2023/24 combination option, alongside the 2026 cefiderocol preference. Confirm local practice with ID.

## Full gap audit: 5 October 2026

I compared every pathogen's options against its guideline (first line and main alternatives), checked each group for missing key pathogens and drugs, and opened every reference link. Each addition below was confirmed in the cited source before it was added.

**Antibacterial: added**

| Gap | Fix | Source |
|---|---|---|
| Aztreonam missing from the whole chart | New row: E. coli/Klebsiella/H. influenzae and Pseudomonas; note on poor Gram-positive/anaerobe activity; usable in β-lactam allergy except ceftazidime allergy | Azactam FDA label; AAAAI/ACAAI 2022 |
| Levofloxacin not linked to Pseudomonas | Added (levofloxacin only; labelled for P. aeruginosa) | Levofloxacin FDA label |
| Syphilis missing | New organism: benzathine penicillin G first line; doxycycline/tetracycline/ceftriaxone in allergy; penicillin desensitisation in pregnancy; IV penicillin G for neurosyphilis | CDC STI 2021 |
| Typhoid missing | New organism: azithromycin (uncomplicated), ceftriaxone (most regions), carbapenem (complicated/XDR from Pakistan/Iraq); fluoroquinolone non-susceptibility note | CDC Yellow Book |
| Brucellosis missing | New organism: doxycycline + rifampin ≥6 weeks; doxycycline + gentamicin/streptomycin; TMP-SMX if contraindications or RB51 strain | CDC |
| Gonorrhoea, cephalosporin allergy | Gentamicin 240 mg IM + azithromycin 2 g | CDC STI 2021 |
| Chlamydia alternatives | Levofloxacin 7 days; amoxicillin in pregnancy | CDC STI 2021 |
| CRE | OXA-48-like: ceftazidime-avibactam; colistin only for uncomplicated cystitis; polymyxins otherwise not suggested | IDSA 2023/24 |
| E. faecalis endocarditis | Ceftriaxone only with ampicillin (AHA regimen) | AHFS ceftriaxone monograph (cites AHA). The AHA document itself was cut off when opened. |

**Antifungal: added.** Fluconazole as first line for oesophageal and moderate–severe oral thrush, and for cystitis. Clotrimazole troches/miconazole buccal for mild thrush. Vaginal candidiasis and candiduria guidance. Source: IDSA candidiasis 2016.

**TB: added.** Isoniazid-resistant (rifampicin-susceptible) TB: rifampicin, ethambutol, pyrazinamide and levofloxacin for 6 months; no injectables. Source: WHO 2018 Hr-TB guidelines.

**Antiparasitic: added.**

| Organism | Content | Source |
|---|---|---|
| Trichomonas | Metronidazole first line; tinidazole as alternative | CDC STI 2021 |
| Cryptosporidium | Nitazoxanide (labelled; not shown effective in HIV/immunodeficiency) | Alinia FDA label |
| Visceral leishmaniasis | Liposomal amphotericin B; miltefosine (with its boxed warning) | CDC; Impavido FDA label |
| Schistosomiasis | Praziquantel dosing by species and timing | CDC |
| Intestinal tapeworm | Praziquantel 5–10 mg/kg once; niclosamide or albendazole as alternatives; cysticercosis caution | CDC |
| Hydatid cyst | Albendazole or mebendazole; surgery, PAIR, watch-and-wait | CDC |

**Reference links:** all 59 checked.

| Link | Problem | Fix |
|---|---|---|
| C. difficile | Could not be opened | Replaced with the official IDSA guideline page |
| Vancomycin | Pointed to a press release | Replaced with the official IDSA guideline page |
| NIOSH | Opened a blank index page | Now points directly to the PDF |

**Honest limit:** no reference tool can be guaranteed 100% complete. Rare organisms and niche agents (e.g. Nocardia, Bartonella, dalbavancin, eravacycline) are intentionally not listed. The tool covers the common and important hospital pathogens with their guideline first-line and main alternative options.


---

## Audit of 17 November 2026: guidance and approvals since 4 October 2026

**Method:**
- Searched for guideline publications and FDA anti-infective approvals between 4 October and 17 November 2026: the IDSA guideline status page, FDA announcements and the CDC influenza clinician summary.
- Each new item was checked against the FDA announcement or approval record before entry.
- Statements were limited to the approved indication; nothing was extrapolated.

### Added

| Item | Entry | Source |
|---|---|---|
| Zoliflodacin (oral), new drug in *Newer agents* | *N. gonorrhoeae*: uncomplicated urogenital (urethra/cervix) only; single oral dose; age ≥12 y and ≥35 kg (77 lb). Note: not yet in CDC guidance; ceftriaxone 500 mg IM remains first line. | FDA announcement, 12 Dec 2025; CDC STI Guidelines 2021 |
| Gepotidacin (oral), new organism | *N. gonorrhoeae*: uncomplicated urogenital only (age ≥12 y, ≥45 kg/99 lb); FDA: for patients with few or no other treatment options. Pharmacist note: urethra/cervix only; not studied for pharyngeal or rectal infection. | FDA announcement, 12 Dec 2025 (Blujepa approved 11 Dec 2025) |
| Gonorrhoea organism note | Sentence added: both oral agents are FDA-approved for uncomplicated urogenital infection only and are not yet incorporated into CDC guidance, which keeps ceftriaxone first line. | FDA; CDC |
| Pritelivir (oral), new drug in *Anti-herpes* | HSV: immunocompromised adults with mucocutaneous HSV refractory to aciclovir, valaciclovir or famciclovir (with or without documented resistance). Interactions: acid-reducing agents (avoid esomeprazole and rabeprazole; omeprazole/lansoprazole ≤20 mg/day; pantoprazole ≤40 mg/day; separate H2RA 2 h before or 12 h after and antacids by 2 h); BCRP inhibitor. | FDA approval 9 Oct 2026 (Drugs.com approval history); label interactions as reported by Contagion Live, 10 Oct 2026. **Check against the full US prescribing information.** |
| HSV organism note | Sentence added on pritelivir approval. | as above |
| Bepirovirsen (SC), new drug in *Hepatitis B / HIV* | HBV: add-on to a nucleos(t)ide analogue for up to 24 weeks; adults without cirrhosis, ≥6 months of NA therapy, HBV DNA suppressed, HBsAg ≤3000 IU/mL; continue the NA ≥24 weeks after the last injection. | FDA approval 20 Oct 2026 (GSK announcement, reported by Healio and Contagion Live) |
| What changed tab | 3 key points added (gonorrhoea, refractory HSV, hepatitis B). | — |
| References | FDAGC, PRIT, PRIT2, BEPI added (63 in total). | — |

### Reviewed — no change needed
- **IDSA guideline status (Nov 2026):**
  - No new candidiasis, C. difficile, COVID-19, intra-abdominal (treatment) or bacterial-meningitis guidance.
  - The 2026 aspergillosis document covers **prevention in solid-organ transplant** and does not change the treatment spectrum shown.
  - The S. aureus bacteraemia consensus (IDSA/ESCMID) and the ACCP β-lactam dosing consensus concern management and dosing, not spectrum.
- **CDC influenza antiviral summary:** content dated 10 March 2026, already cited; recommendations unchanged.
- **IDSA AMR Gram-negative guidance (July 2026):** already the basis of the antibacterial update.

### Automated integrity checks (every build)
- Every coverage entry points to an organism that exists in its group.
- Every citation key resolves to a reference (212 citations, 63 references).
- All reference URLs use HTTPS; no duplicate keys.
- No "undefined", "NaN" or "[object Object]" in any of the 283 rendered screens.
- A keyed comparison against the 4 October 2026 content shows only the screens listed above changed:
  - **changed:** gonorrhoea, HSV and HBV pages; gepotidacin; drug lists, matrices and counts; references; What changed;
  - **added:** zoliflodacin, pritelivir, bepirovirsen;
  - **removed:** none.
- The 2019 chart version is unchanged.

**Limit:** pritelivir and bepirovirsen were approved weeks ago and their full prescribing information was not retrievable here. The entries state only the approved indication; check the interaction text against the label when HMC stocks the product.


---

## Independent re-audit of 18 November 2026: all 608 statements

**Scope:**
- **Statements:** every clinical statement in the data, 608 in total: coverage entries, organism notes, pharmacist notes, 2026 change rows, key points, the Pharmacist toolkit and the WHO AWaRe groups.
- **Sources:** they cite 61 sources, and each source was checked in two ways.
  - **Currency:** is a newer edition available?
  - **Content:** does the cited text support the statement?
- **Primary texts read for this audit:**
  - the IDSA 2026 AMR guidance (full text, all 221,000 characters);
  - the IDSA 2023/24 guidance (Guideline Central summary);
  - WHO TB Module 4, 2nd edition (2026);
  - WHO guidelines for malaria (10 September 2026);
  - the SIS/IDSA 2010 intra-abdominal guideline (AAFP summary);
  - the WHO AWaRe antibiotic list;
  - the CDC Strongyloides and scabies clinical-care pages;
  - FDA labels for rezafungin, lamivudine (Epivir-HBV) and minocycline IV;
  - the ECIL-10 publication record.
- **Remaining statements:** checked against the same primary guidelines and labels cited in the October audit.

### Newer editions found, and the data updated

| Source | Was | Now |
|---|---|---|
| WHO TB Module 4 | 2025 edition | **2nd edition, 25 Sept 2026.** New: BPaL for non-severe and BPaLC for severe pulmonary pre-XDR-TB (B1.1a/b); BDLC for non-severe pre-XDR-TB only, not for severe (B1.2a/b); BDLLfx/C remains the alternative 6-month regimen. Bedaquiline, pretomanid, linezolid, clofazimine and delamanid entries and the MDR/pre-XDR note updated. DS-TB 4-month HPMZ (age ≥12) and Hr-TB (6 months REZ-Lfx) confirmed unchanged. |
| WHO malaria guidelines | 13 Aug 2025 | **10 Sept 2026.** Confirmed: AL in the first trimester; artesunate ≥24 h then 3-day ACT; single low-dose primaquine 0.25 mg/kg with ACT in low-transmission areas. Added precision: the 7-day high-dose primaquine course needs G6PD activity ≥70% (14-day course >30%). Tafenoquine (WHO) is given with chloroquine, not with an ACT, from age 2 with G6PD activity ≥70%, and the recommendation applies to South America. |
| ECIL-4 (2013), RSV | ribavirin (aerosolised/systemic) ± IVIG | **ECIL-10, *Lancet Infect Dis* 27 Aug 2025:** ribavirin and/or IVIG for severely immunocompromised stem-cell transplant recipients. Reference replaced. |
| CDC STI guidelines | 2021 | Still current, no newer edition. Zoliflodacin and gepotidacin remain outside CDC guidance. |
| IDSA candidiasis (2016), aspergillosis (2016), *C. difficile* (2021), meningitis (2004) | — | Still the current IDSA versions. The 2026 IDSA aspergillosis document covers prevention in solid-organ transplant only. |

### Statements corrected (not supported by the cited source)

| Item | Was | Now (source) |
|---|---|---|
| Quinolones in intra-abdominal infection (*Bacteroides* note, the "Levofloxacin/moxifloxacin" change row and the 4 Oct log above) | "Avoid moxifloxacin if a quinolone was used in the previous 3 months" | The guideline contains no such rule. It says quinolones are not advised unless local *E. coli* susceptibility exceeds 90% (SIS/IDSA 2010). **This also corrects the 4 October entry above.** |
| Ertapenem | "albumin <2.5 g/dL" | "hypoalbuminaemic". Neither the 2026 nor the 2023/24 IDSA text gives a numeric threshold. |
| TMP-SMX | "only ~50% of ESBL urinary isolates are susceptible" | Figure removed (not in IDSA); "confirm susceptibility". |
| Oral fosfomycin | "E. coli only (fosA genes in Klebsiella)" | "E. coli only" (IDSA 2023/24 and 2026); the mechanism is not in the cited source. |
| IV fosfomycin | "high sodium load …" (cited to IDSA) | Removed; not in the cited source. |
| Gepotidacin | "overuse may select gonococcal resistance" (cited to IDSA) | Replaced: FDA-approved for uncomplicated urogenital gonorrhoea (Dec 2025), restricted to patients with few or no other options (FDA). |
| Minocycline | "off-label for … Acinetobacter" | IV minocycline is **FDA-labelled** for susceptible *Acinetobacter* species (Minocin IV label); *S. maltophilia* use is off-label. |
| Ivermectin, Strongyloides | "contraindicated … in pregnancy" | CDC: *Loa loa* co-infection is a relative contraindication; data in pregnancy are limited. |

### WHO AWaRe groups completed (WHO AWaRe antibiotic list)
- **Reserve:** aztreonam, ceftaroline.
- **Access:** ampicillin-sulbactam, and pivmecillinam (listed by WHO as mecillinam).
- **Watch:** gepotidacin (2025 Expert Committee).
- **Split:** minocycline is Watch orally and Reserve as an injection.
- **Fosfomycin:** oral fosfomycin added as Watch.
- **Not classified:** sulbactam-durlobactam, cefepime-enmetazobactam and zoliflodacin were not found on the list and remain "not confirmed".

### Confirmed (examples of figures re-checked word for word)
- **IDSA 2026:**
  - cefepime for moderate-risk AmpC organisms if MIC ≤8 µg/mL;
  - KPC preference order (meropenem-vaborbactam, then ceftazidime-avibactam, then imipenem-relebactam);
  - ceftazidime-avibactam resistance emergence ~10%, versus <3% for the other two;
  - <20% of CRE susceptible to fluoroquinolones;
  - colistin nephrotoxicity ~30%;
  - polymyxin B not for urinary infection;
  - pivmecillinam not active against KPC;
  - the NDM, OXA-48, DTR-*P. aeruginosa*, CRAB and *S. maltophilia* preferences.
- **FDA labels:**
  - rezafungin from age 12 (current label), 400 mg then 200 mg weekly, safety beyond 4 doses not established;
  - lamivudine YMDD resistance 24% at 52 weeks.
- **CDC scabies:** permethrin washed off after 8–14 h; ivermectin 200 µg/kg × 2 doses 7–14 days apart, with food.

**Result:** after correction, every statement traces to a current primary source. Keyed comparison shows only the screens listed here and in the 17 Nov audit changed. All QA suites pass (283-screen parity, 9 devices, analytics, administration).


---

## Addition of 18 November 2026: teicoplanin

| Field | Entry | Source |
|---|---|---|
| Coverage | Streptococci, MSSA, MRSA (community and hospital), *Peptostreptococcus*: active. *E. faecalis* susceptible / *E. faecium* acquired resistance; CoNS (*S. epidermidis*, *S. haemolyticus*, *S. hominis*) acquired resistance; VRE: some VanB-phenotype strains susceptible, cross-resistance with vancomycin; *C. difficile*: oral 100–200 mg twice daily for 7–14 days | Targocid SmPC §4.1, §4.2, §5.1 (emc) |
| Dosing / TDM | Loading 6 mg/kg q12h × 3 (12 mg/kg q12h × 3–5 for bone/joint and endocarditis), then once daily. Trough (FPIA): >15 mg/L SSTI/pneumonia/cUTI; >20 mg/L bone/joint; 30–40 mg/L loading then >30 mg/L endocarditis; HPLC targets differ | SmPC §4.2 |
| Renal | From day 4: CrCl 30–80 mL/min half dose; <30 mL/min or haemodialysis one-third; not removed by haemodialysis | SmPC §4.2 |
| Safety | Vancomycin cross-hypersensitivity (prior red-man reaction not a contraindication); SJS/TEN/DRESS/AGEP; thrombocytopenia (FBC); nephrotoxicity; ototoxicity (auditory tests with other oto/nephrotoxic drugs) | SmPC §4.4 |
| AWaRe | Watch | UKHSA UK-AWaRe 2024 (WHO list page not retrievable during the check) |


## Addition of 18 November 2026: ofloxacin (requested; on the HGH list)

| Field | Entry | Source |
|---|---|---|
| Use restriction | Adults only; prescribe only when commonly recommended antibiotics are inappropriate (resistance, contraindication, intolerance, failure) | Ofloxacin 200 mg tablets SmPC §4.1 (Viatris, emc, rev. 08/2026) |
| Coverage | Susceptible: MSSA, *S. epidermidis*, *N. meningitidis*, *H. influenzae*, *E. coli*, *Klebsiella*, *Enterobacter*, *Citrobacter*, *Chlamydiae*, *Legionella*. Moderately susceptible: *S. pneumoniae*, *S. pyogenes*, enterococci, *P. aeruginosa*, *Acinetobacter*, *Mycoplasma*. *N. gonorrhoeae*: only if susceptibility is confirmed. Not for MRSA unless susceptible. Resistant: *Bacteroides*, *Peptostreptococcus*, *C. difficile*, *T. pallidum* | SmPC §4.1, §4.4, §5.1 |
| Dosing | 200–800 mg/day (max 400 mg twice daily); gonococcal 400 mg single dose; ≤2 months. Renal: CrCl 20–50 mL/min 100–200 mg/day; <20 mL/min or dialysis 100 mg/day. Severe hepatic: max 400 mg/day | SmPC §4.2 |
| Safety | Class warnings (tendon, aorta/valves, QT, dysglycaemia, CNS, neuropathy, myasthenia). Contraindications: epilepsy, prior FQ tendon disorder, children/adolescents, pregnancy, breastfeeding, G6PD deficiency. Separate divalent/trivalent cations by 2 h | SmPC §4.3–4.5 |
| AWaRe | Watch | UKHSA UK-AWaRe 2024 |

### HGH IV list cross-check
All 30 anti-infectives on the HGH IV medication list are now in Spectra:
- **Antibacterials:** ampicillin, ampicillin-sulbactam, amikacin, aztreonam, cefazolin, cefepime, ceftazidime, ceftazidime-avibactam, cefotaxime, ceftolozane-tazobactam, ceftriaxone, cefuroxime, cefiderocol, cloxacillin, clindamycin, colistin, daptomycin, gentamicin, ertapenem, meropenem, piperacillin-tazobactam, teicoplanin, tigecycline, vancomycin.
- **Antivirals:** aciclovir, ganciclovir.
- **Antifungals:** liposomal amphotericin B, anidulafungin, caspofungin, voriconazole.

The other drugs requested (ciprofloxacin, moxifloxacin, fluconazole) were already present.
