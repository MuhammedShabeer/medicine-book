// Vocabulary, search and wording helpers for the formulary restriction module.
// Pure functions only (no React), so they are easy to test and reuse.

export const CATS = {
  init:   { label: 'Initial prescribing',      color: '--hfr-init',   icon: 'Play',         hint: 'A specialty starts therapy; others may continue' },
  ams:    { label: 'ID / antimicrobial',       color: '--hfr-ams',    icon: 'ShieldCheck',  hint: 'Infectious Diseases team controls prescribing' },
  senior: { label: 'Consultant or specialist', color: '--hfr-senior', icon: 'UserCheck',    hint: 'Prescribing limited by grade' },
  note:   { label: 'Approval record',          color: '--hfr-note',   icon: 'ScrollText',   hint: 'Approval history, no prescriber limit stated' },
  spec:   { label: 'Specialty or team',        color: '--hfr-spec',   icon: 'Stethoscope',  hint: 'Use limited to named services' },
  free:   { label: 'No restriction listed',    color: '--hfr-free',   icon: 'CircleCheck',  hint: 'No register entry linked' },
};
export const CAT_KEYS = Object.keys(CATS);

export const FLAGS = {
  qatari:     { label: 'Qatari patients only',   icon: 'BadgeAlert',     tone: 'red',   hint: 'Eligibility limited by nationality' },
  cd:         { label: 'Controlled drug',        icon: 'Lock',           tone: 'red',   hint: 'Controlled drug status in register' },
  nominated:  { label: 'Nominated prescribers',  icon: 'UserRoundCheck', tone: 'amber', hint: 'Only named consultants may prescribe' },
  form:       { label: 'Varies by dosage form',  icon: 'Split',          tone: 'amber', hint: 'Restriction applies to some forms only' },
  criteria:   { label: 'Criteria or protocol',   icon: 'ListChecks',     tone: '',      hint: 'Indication, protocol or checklist applies' },
  consultant: { label: 'Consultant level',       icon: 'GraduationCap',  tone: '',      hint: 'Wording mentions consultants' },
  unlinked:   { label: 'Register entry only',    icon: 'Unlink',         tone: 'red',   hint: 'No matching item in the formulary list' },
};

export const FORMS = {
  oral: { label: 'Oral solid',     icon: 'Pill',       uoms: ['TAB', 'CAP', 'SUP'] },
  inj:  { label: 'Injectable',     icon: 'Syringe',    uoms: ['VIA', 'AMP', 'PFS', 'PEN', 'CAR'] },
  inf:  { label: 'Infusion',       icon: 'Droplets',   uoms: ['BAG', 'LTR'] },
  liq:  { label: 'Liquids',        icon: 'FlaskRound', uoms: ['BOT', 'SAC', 'ML', 'CAN'] },
  top:  { label: 'Topical',        icon: 'Hand',       uoms: ['TUB', 'JAR', 'GM', 'KG'] },
  inh:  { label: 'Inhaled',        icon: 'Wind',       uoms: ['DOS', 'BEA'] },
  pat:  { label: 'Patch',          icon: 'Bandage',    uoms: ['PAT'] },
  oth:  { label: 'Kits & packs',   icon: 'Package',    uoms: ['EAC', 'PAC', 'KIT', 'PKT'] },
};
const UOM_TO_FORM = {};
for (const [k, v] of Object.entries(FORMS)) for (const u of v.uoms) UOM_TO_FORM[u] = k;

export const UOM = {
  TAB: 'Tablet', CAP: 'Capsule', SUP: 'Suppository', VIA: 'Vial', AMP: 'Ampoule', PFS: 'Prefilled syringe', PEN: 'Pen',
  CAR: 'Cartridge', BAG: 'Bag', LTR: 'Litre', BOT: 'Bottle', SAC: 'Sachet', ML: 'mL', CAN: 'Can', TUB: 'Tube', JAR: 'Jar',
  GM: 'Gram', KG: 'Kilogram', DOS: 'Dose', BEA: 'Inhaler', PAT: 'Patch', EAC: 'Each', PAC: 'Pack', KIT: 'Kit', PKT: 'Packet',
};

export const SPECIALTIES = {
  'Oncology': /oncolog|NCCCR|cancer/i, 'Haematology': /hemat|heamat|haemat/i,
  'Infectious Diseases': /\bID\b|infectious|travel clinic|CDC/i, 'Rheumatology': /rheumat|rhuemat/i,
  'Dermatology': /dermat/i, 'Neurology': /neurol|neurlol|epilep|\bMS\b|headache/i, 'Psychiatry': /psychiat|Umm Salal|\bMHS\b/i,
  'Cardiology': /cardio|heart|\bHH\b|cath lab|CCU/i, 'Endocrinology': /endocrin|diabet/i, 'Nephrology': /nephrol|hemodialysis|renal/i,
  'Gastroenterology / Hepatology': /\bGI\b|gastro|hepatol|\bGIT\b/i, 'Pulmonology': /pulmon|asthma|lung/i,
  'Ophthalmology': /ophthalm|\bOPH\b/i, 'Obstetrics & Gynaecology': /OB\/?GYN|obstet|gyn|IVF|assisted conception/i,
  'Paediatrics / Neonatology': /pediat|paediat|NICU|PICU|\bPEC\b|neonat/i,
  'Critical Care': /\bICU|MICU|SICU|TICU|intensiv|critical care|CTICU/i, 'Anaesthesia & Pain': /anesth|anaesth|pain/i,
  'Urology / Andrology': /urolog|androl/i, 'Orthopaedics': /orthop/i, 'Emergency Medicine': /\bED\b|emergency/i,
  'Palliative Care': /palliat/i, 'Transplant': /transplant|\bBMT\b/i, 'Allergy & Immunology': /allerg|immunolog/i,
  'Geriatrics': /geriat/i, 'Internal Medicine': /internal medicine|general medicine|\bIM\b|AGIM/i, 'ENT': /\bENT\b|rhinolog/i,
  'Dental / Oral Medicine': /dental|oral medicine/i, 'Surgery': /surgeon|surgery/i, 'Bariatrics / Obesity': /bariatric|obesity/i,
};

export const norm = (s) => String(s ?? '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
export const fmtN = (n) => (n || 0).toLocaleString();

/** Suggests type, conditions, specialties and dates from register wording (admin helper; admins review the result). */
export function classify(status, text) {
  const t = text || '';
  let cat;
  if (/\bID Team\b|infectious dis|ID Consultants|ID physicians|ID Transplant/i.test(t) && /only|restrict|prescrib|usage|use by/i.test(t)) cat = 'ams';
  else if (/initial prescribing|to be in[i]?tiated|first prescription|initially be restricted|initiated by/i.test(t)) cat = 'init';
  else if (/all consultants/i.test(t)) cat = 'senior';
  else if (/restrict|for usage by|for use by|usage by|use by|prescribing by|prescribed by|for prescribing|requested by|request of|for usage at|approved for use|limited to|for the management/i.test(t)) cat = 'spec';
  else cat = 'note';
  if (/restrictions lifted/i.test(t)) cat = 'note';
  const fl = [];
  if (/qatari patients only|only for qatari|for qatari patients/i.test(t)) fl.push('qatari');
  if (/nominated/i.test(t)) fl.push('nominated');
  if (/controlled/i.test(status || '')) fl.push('cd');
  if (/^(Tablet|Injection|Infusion|Capsule|IV|PO|Patch|Implant|Inhalation|INJ|Oral|SL|Gel|Cream)\b|\b(Tablet|Injection|Infusion|Capsule|Patch|Implant)\s*(\(|:)|\bIV\b|\bPO\b|Patch weekly|SL Tablet|MMX TAB|CAP of/i.test(t)) fl.push('form');
  if (/criteria|protocol|guideline|checklist|for the management of|indication|in patients (with|suffering)|for patients/i.test(t)) fl.push('criteria');
  if (/consultant/i.test(t)) fl.push('consultant');
  const sp = Object.keys(SPECIALTIES).filter((k) => SPECIALTIES[k].test(t));
  const MON = '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*';
  const DT = `(\\d{1,2}\\s+${MON}\\.?\\s+\\d{4}|${MON}\\.?\\s+\\d{1,2},?\\s*\\d{4}|${MON}\\.?\\s+\\d{4})`;
  const ap = (t.match(new RegExp('approved\\s*(?:on|in)?\\s*' + DT, 'i')) || [])[1] || '';
  const av = (t.match(new RegExp('(?:available|availble|received)\\s*(?:since|from|on|as of)?\\s*(?:[^.]*?\\s)?' + DT, 'i')) || [])[1] || '';
  return { type: cat, conditions: fl, specialties: sp, approved: ap, available: av };
}

/** Turns the API dataset into searchable entries (one per active item, plus register entries with no item). */
export function buildEntries(dataset) {
  const rmap = new Map();
  for (const r of dataset?.restrictions || []) if (!r.isDeleted) rmap.set(r.id, r);
  const used = new Set();
  const entries = [];
  const make = (id, item, r, qat) => {
    const fl = r ? [...(r.conditions || [])] : [];
    if (qat && !fl.includes('qatari')) fl.push('qatari');
    const name = item ? item.name : r.generic;
    const uom = item ? item.uom : '';
    return {
      id, no: item ? item.itemNo : '', name, uom, r, qat, fl,
      cat: r ? r.type : 'free',
      form: UOM_TO_FORM[uom] || '',
      key: norm(name + ' ' + (r ? r.generic : '')),
      hay: norm([name, item?.itemNo, UOM[uom] || '', r ? [r.generic, r.wording, (r.specialties || []).join(' '), CATS[r.type]?.label].join(' ') : 'no restriction', qat ? 'qatari only ' + (qat.wording || '') + ' ' + (qat.exceptions || '') : ''].join(' ')),
    };
  };
  for (const it of dataset?.items || []) {
    if (it.isDeleted) continue;
    let r = it.restrictionId ? rmap.get(it.restrictionId) || null : null;
    if (r) used.add(r.id);
    const qat = it.qatariOnly ? { wording: it.qatariWording || '', exceptions: it.qatariExceptions || '' } : null;
    if (!r && qat && qat.wording) {
      const c = classify('', qat.wording);
      r = { id: '', generic: 'Qatari-only list', status: '', wording: qat.wording, type: c.type === 'note' ? 'spec' : c.type, conditions: c.conditions, specialties: c.specialties, approved: '', available: '', qatariOnlySource: true };
    }
    entries.push(make(it.itemNo, it, r, qat));
  }
  for (const r of rmap.values()) {
    if (used.has(r.id)) continue;
    const e = make('r-' + r.id, null, r, null);
    e.fl.push('unlinked');
    entries.push(e);
  }
  return entries;
}

// ---------- search ----------
export function lev(a, b) {
  if (Math.abs(a.length - b.length) > 2) return 9;
  const m = [...Array(b.length + 1).keys()];
  for (let i = 1; i <= a.length; i++) {
    let p = m[0]; m[0] = i;
    for (let j = 1; j <= b.length; j++) { const t = m[j]; m[j] = Math.min(m[j] + 1, m[j - 1] + 1, p + (a[i - 1] === b[j - 1] ? 0 : 1)); p = t; }
  }
  return m[b.length];
}
const words = (q) => norm(q).split(/\s+/).filter(Boolean);
const textOk = (d, ws) => ws.every((w) => d.hay.includes(w));
function fuzzyOk(d, ws) {
  const tk = d._tk || (d._tk = d.key.split(/[^a-z0-9.]+/).filter(Boolean));
  const tol = (w) => (w.length > 6 ? 2 : 1);
  return ws.every((w) => d.hay.includes(w) || (w.length >= 4 && tk.some((t) => lev(w, t.slice(0, w.length)) <= tol(w) || lev(w, t) <= tol(w))));
}
export function facetOk(d, f, skip) {
  return (skip === 'cat' || !f.cat || d.cat === f.cat)
    && (skip === 'form' || !f.form || d.form === f.form)
    && (skip === 'spec' || !f.spec || (d.r && (d.r.specialties || []).includes(f.spec)))
    && (skip === 'flag' || f.flags.every((x) => d.fl.includes(x)));
}
/** Returns { rows, fuzzy }. Falls back to spelling-tolerant matching when an exact search finds nothing. */
export function runSearch(entries, f) {
  const ws = words(f.q);
  let fuzzy = false;
  let rows = entries.filter((d) => facetOk(d, f) && (!ws.length || textOk(d, ws)));
  if (!rows.length && f.q.trim().length >= 4) {
    rows = entries.filter((d) => facetOk(d, f) && fuzzyOk(d, ws));
    fuzzy = rows.length > 0;
  }
  const q = norm(f.q.trim());
  const rank = (d) => { if (!q) return 0; const n = norm(d.name); return n.startsWith(q) ? 0 : n.includes(' ' + q) ? 1 : (d.r && norm(d.r.generic).startsWith(q)) ? 1 : 2; };
  rows.sort(f.sort === 'cat'
    ? (a, b) => CAT_KEYS.indexOf(a.cat) - CAT_KEYS.indexOf(b.cat) || a.name.localeCompare(b.name)
    : (a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
  return { rows, fuzzy };
}
export function facetCounts(entries, f) {
  const cats = {}, forms = {}, flags = {};
  const ws = words(f.q);
  const match = (d) => !ws.length || textOk(d, ws);
  for (const d of entries) {
    if (!match(d)) continue;
    if (facetOk(d, f, 'cat')) cats[d.cat] = (cats[d.cat] || 0) + 1;
    if (facetOk(d, f, 'form')) forms[d.form] = (forms[d.form] || 0) + 1;
    if (facetOk(d, f, 'flag')) for (const x of d.fl) flags[x] = (flags[x] || 0) + 1;
  }
  return { cats, forms, flags };
}

/** Splits text into [{text, hit}] parts for highlighting the search words. */
export function highlightParts(text, q) {
  const s = String(text ?? '');
  const ws = words(q);
  if (!ws.length) return [{ text: s, hit: false }];
  const ns = norm(s), marks = new Array(s.length).fill(false);
  for (const w of ws) { let i = ns.indexOf(w); while (i > -1) { for (let k = i; k < i + w.length; k++) marks[k] = true; i = ns.indexOf(w, i + w.length); } }
  const parts = [];
  for (let i = 0; i < s.length; i++) {
    const last = parts[parts.length - 1];
    if (last && last.hit === marks[i]) last.text += s[i]; else parts.push({ text: s[i], hit: marks[i] });
  }
  return parts;
}

// ---------- plain-language answers ----------
const andList = (a) => (a.length <= 2 ? a.join(' and ') : a.slice(0, -1).join(', ') + ' and ' + a[a.length - 1]);
const specsOf = (d) => (d.r ? (d.r.specialties || []).filter((x) => d.cat !== 'ams' || x !== 'Infectious Diseases') : []);
export function verdict(d) {
  if (!d.r) return 'No restriction listed in the register';
  if (d.fl.includes('form')) return 'Varies by dosage form. Check this item’s form against the wording below';
  const sp = specsOf(d), few = sp.slice(0, 3), more = sp.length > 3 ? ' and others' : '';
  return ({
    ams: sp.length ? `Infectious Diseases team, plus ${andList(few)}${more}` : 'Infectious Diseases team only',
    init: sp.length ? `Initial prescribing by ${andList(few)}${more}` : 'Initial prescribing is restricted',
    spec: sp.length ? `Restricted to ${andList(few)}${more}` : 'Restricted use. Read the register wording',
    senior: 'Consultants and specialists or fellows',
    note: 'Approval record. Read the register wording',
  })[d.cat] || 'Read the register wording';
}
export function shortVerdict(d) {
  if (!d.r) return 'No restriction listed';
  if (d.fl.includes('form')) return 'Varies by dosage form';
  const sp = specsOf(d);
  return ({
    ams: 'ID team' + (sp.length ? ` + ${sp.length}` : ' only'),
    init: 'Starts with ' + (sp[0] || 'a specialty') + (sp.length > 1 ? ` +${sp.length - 1}` : ''),
    spec: (sp[0] || 'Restricted') + (sp.length > 1 ? ` +${sp.length - 1}` : ''),
    senior: 'Consultant or specialist',
    note: 'Approval record',
  })[d.cat] || '';
}
const DATE_RX = /^((?:update\s+)?(?:\d{1,2}\s+[A-Za-z]{3,9}\.?\s+\d{4}|[A-Za-z]{3,9}\.?\s+\d{1,2},?\s*\d{4}|[A-Za-z]{3,9}\s+\d{4}))\s*[:\-–,.]?\s*/i;
/** Splits register wording into timeline lines: [{date, text, icon}]. */
export function wordingLines(text) {
  return String(text || '').split(/\n+/).map((l) => l.trim()).filter(Boolean).map((l) => {
    const m = l.match(DATE_RX);
    const body = m ? l.slice(m[0].length).replace(/^[.:,\-–\s]+/, '') : l;
    const icon = /extend|extension|extented/i.test(l) ? 'GitBranchPlus' : /approved|available/i.test(l) ? 'CalendarCheck' : /qatari/i.test(l) ? 'BadgeAlert'
      : /initial|first prescription/i.test(l) ? 'Play' : /criteria|patients|management|indicat/i.test(l) ? 'ListChecks' : /restrict|only|usage|prescrib/i.test(l) ? 'Shield' : 'FileText';
    return { date: m ? m[1].replace(/^update\s+/i, 'Update, ') : '', text: body || l, icon };
  });
}
