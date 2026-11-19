# Bug–Drug Navigator: verification log

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
