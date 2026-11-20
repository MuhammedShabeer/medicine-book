import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATS, CAT_KEYS, FLAGS, FORMS, UOM, fmtN, runSearch, facetCounts, highlightParts, verdict, shortVerdict, wordingLines } from '../lib/model.js';
import { Icon, RestrictionMark } from './icons.jsx';
import { Layer, Toast } from './Overlay.jsx';
import { useDebounced, usePersistentList, useToast } from './hooks.js';

const PAGE = 36;

function Hl({ text, q }) {
  return highlightParts(text, q).map((p, i) => (p.hit ? <mark key={i}>{p.text}</mark> : <Fragment key={i}>{p.text}</Fragment>));
}

function copyText(text, toast, label) {
  const ok = () => toast(label, 'Check');
  const fail = () => toast('Copying is blocked on this device', 'X');
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(ok, fail);
  else fail();
}

export default function SearchView({ entries, status, counts, me, dark, tracker, hotkeys, syncUrl, initialQuery, initialItem, onOpenAdmin, onThemeToggle, showThemeToggle, title, moduleName }) {
  const [q, setQ] = useState(initialQuery || '');
  const [f, setF] = useState({ cat: '', form: '', spec: '', flags: [], sort: 'name' });
  const [k, setK] = useState(0);
  const [shown, setShown] = useState(PAGE);
  const [menu, setMenu] = useState(false);
  const [sel, setSel] = useState(null);
  const [pins, setPins] = usePersistentList('pins', 30);
  const [recent, setRecent] = usePersistentList('recent', 8);
  const [toast, showToast] = useToast();
  const input = useRef(null);
  const moreRef = useRef(null);
  const qd = useDebounced(q, 60);
  const isDesktop = typeof window !== 'undefined' && window.matchMedia?.('(min-width: 861px)').matches;

  const filters = useMemo(() => ({ ...f, q: qd }), [f, qd]);
  const { rows, fuzzy } = useMemo(() => runSearch(entries, filters), [entries, filters]);
  const facets = useMemo(() => facetCounts(entries, filters), [entries, filters]);
  const specialties = useMemo(() => [...new Set(entries.flatMap((d) => (d.r?.specialties || [])))].sort(), [entries]);
  const byId = useMemo(() => new Map(entries.map((d) => [d.id, d])), [entries]);
  const active = !!(qd.trim() || f.cat || f.form || f.spec || f.flags.length);
  const current = active ? rows[k] : null;
  const selected = sel ? byId.get(sel) : null;

  // reset keyboard position and paging whenever the result set changes
  useEffect(() => { setK(0); setShown(PAGE); }, [rows]);

  // usage: one "search" event once typing settles
  const lastTracked = useRef('');
  useEffect(() => {
    const term = qd.trim().toLowerCase();
    if (term.length < 2) { lastTracked.current = ''; return undefined; }
    const t = setTimeout(() => { if (term !== lastTracked.current) { lastTracked.current = term; tracker.search(term, rows.length); } }, 1500);
    return () => clearTimeout(t);
  }, [qd, rows.length, tracker]);

  // keep ?q= and ?item= in the address bar so a link reopens the same view
  useEffect(() => {
    if (!syncUrl) return;
    try {
      const u = new URL(window.location.href);
      if (qd.trim()) u.searchParams.set('q', qd.trim()); else u.searchParams.delete('q');
      if (sel) u.searchParams.set('item', sel); else u.searchParams.delete('item');
      if (u.href !== window.location.href) window.history.replaceState(window.history.state, '', u);
    } catch { /* sandboxed frames may block history */ }
  }, [qd, sel, syncUrl]);

  // open ?item= on first load once data exists
  const opened = useRef(false);
  useEffect(() => {
    if (opened.current || !entries.length || !initialItem) return;
    opened.current = true;
    if (byId.has(initialItem)) setSel(initialItem);
  }, [entries, initialItem, byId]);

  useEffect(() => { if (isDesktop && !initialItem) input.current?.focus(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // lazy paging
  useEffect(() => {
    const el = moreRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver((e) => { if (e[0].isIntersecting) setShown((n) => (n < rows.length ? n + PAGE : n)); }, { rootMargin: '700px' });
    io.observe(el);
    return () => io.disconnect();
  }, [rows.length]);

  const open = useCallback((id) => {
    const d = byId.get(id);
    if (!d) return;
    setSel(id);
    setRecent((r) => [id, ...r.filter((x) => x !== id)]);
    // a search that led to a look-up counts even if the user acted before typing "settled"
    const term = qd.trim().toLowerCase();
    if (term.length >= 2 && term !== lastTracked.current) { lastTracked.current = term; tracker.search(term, rows.length); }
    tracker.view(d);
  }, [byId, setRecent, tracker, qd, rows.length]);
  const close = useCallback(() => { setSel(null); if (isDesktop) input.current?.focus(); }, [isDesktop]);
  const togglePin = useCallback((id) => {
    const on = !pins.includes(id);
    setPins((p) => (on ? [id, ...p] : p.filter((x) => x !== id)));
    showToast(on ? 'Pinned to your quick list' : 'Removed from pinned', on ? 'Pin' : 'PinOff');
  }, [pins, setPins, showToast]);

  const setFilter = (patch, trackKey) => { setF((x) => ({ ...x, ...patch })); if (trackKey) tracker.filter(trackKey); };
  const clearAll = () => { setQ(''); setF((x) => ({ ...x, cat: '', form: '', spec: '', flags: [] })); };

  const move = useCallback((dir) => {
    if (!rows.length) return;
    setK((i) => {
      const n = Math.max(0, Math.min(rows.length - 1, i + dir));
      if (n >= shown) setShown(n + PAGE);
      return n;
    });
  }, [rows.length, shown]);

  useEffect(() => {
    document.querySelector('.hfr-card.hfr-kb')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [k]);

  // keyboard shortcuts
  useEffect(() => {
    if (!hotkeys) return undefined;
    const onKey = (e) => {
      const el = document.activeElement;
      const inQ = el === input.current;
      const typing = el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName) && !inQ;
      if (e.defaultPrevented || typing || e.ctrlKey || e.metaKey || e.altKey) return;
      if (document.querySelector('.hfr-modal')) return;
      if (e.key === 'Escape') {
        if (sel) { e.preventDefault(); close(); } else if (q) { setQ(''); } else if (f.cat || f.form || f.spec || f.flags.length) clearAll();
        return;
      }
      if (sel) return;
      if (e.key === '/' && !inQ) { e.preventDefault(); input.current?.focus(); input.current?.select(); return; }
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { if (rows.length && (inQ || el === document.body)) { e.preventDefault(); move(e.key === 'ArrowDown' ? 1 : -1); } return; }
      if (e.key === 'Enter' && current && (inQ || el === document.body)) {
        e.preventDefault();
        if (e.shiftKey) { if (current.no) copyText(current.no, showToast, `Item number ${current.no} copied`); } else open(current.id);
        return;
      }
      if (!inQ && /^[1-6]$/.test(e.key)) {
        const c = CAT_KEYS[Number(e.key) - 1];
        setFilter({ cat: f.cat === c ? '' : c }, f.cat === c ? null : 'type:' + c);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const activeLabels = [f.cat && CATS[f.cat].label, f.form && FORMS[f.form].label, f.spec, ...f.flags.map((x) => FLAGS[x].label)].filter(Boolean);
  const pick = (ids) => ids.map((id) => byId.get(id)).filter(Boolean);
  const pinned = pick(pins), recents = pick(recent.filter((x) => !pins.includes(x)));
  const searching = !!qd.trim();

  return (
    <div className={'hfr-search' + (searching ? ' hfr-searching-inner' : '')}>
      <section className="hfr-hero">
        <div className="hfr-aur" />
        <div className="hfr-wrap">
          <nav className="hfr-nav">
            <div className="hfr-logo"><div className="hfr-lg" title={moduleName}><RestrictionMark /></div><div>{title}<small>Formulary {moduleName.toLowerCase()}</small></div></div>
            <div className="hfr-grow" />
            <span className={'hfr-live' + (status === 'live' ? '' : ' hfr-off')} title={status === 'live' ? 'Up to date with the server' : 'Showing the copy saved on this device'}>
              <i /><span className="hfr-txt">{status === 'live' ? 'Live' : status === 'loading' ? 'Loading' : 'Offline copy'}</span>
            </span>
            {me?.isAdmin && <button className="hfr-gbtn hfr-solid" onClick={onOpenAdmin}><Icon name="LayoutDashboard" /><span className="hfr-txt">Admin</span></button>}
            {showThemeToggle && <button className="hfr-gbtn" onClick={onThemeToggle} aria-label="Switch light or dark"><Icon name={dark ? 'Sun' : 'Moon'} /></button>}
          </nav>
          <h1 className="hfr-disp">{moduleName}</h1>
          <p className="hfr-lead">Who can prescribe it? Search the HMC formulary to see each drug’s prescribing restriction, the conditions attached and the full register wording.</p>
          <label className="hfr-sbox">
            <Icon name="Search" />
            <span className="hfr-sr">Search the formulary</span>
            <input ref={input} type="search" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" spellCheck={false} enterKeyHint="search"
              placeholder="Type a drug, item number or specialty. The answer appears instantly" />
            {q && <button className="hfr-clr" onClick={() => { setQ(''); input.current?.focus(); }} aria-label="Clear search"><Icon name="X" /></button>}
            <span className="hfr-kb">/</span>
          </label>
          <div className="hfr-hrow">
            {hotkeys && <div className="hfr-keys"><span><kbd>↑</kbd><kbd>↓</kbd> move</span><span><kbd>Enter</kbd> full details</span><span><kbd>Shift</kbd>+<kbd>Enter</kbd> copy item no.</span><span><kbd>1</kbd>–<kbd>6</kbd> restriction type</span><span><kbd>Esc</kbd> clear</span></div>}
            <div className="hfr-meta">
              <span><Icon name="Database" /><b>{fmtN(counts.items)}</b>&nbsp;formulary items</span>
              <span><Icon name="ScrollText" /><b>{fmtN(counts.restrictions)}</b>&nbsp;restriction entries</span>
              <span><Icon name="BadgeAlert" /><b>{fmtN(counts.qatari)}</b>&nbsp;Qatari-only items</span>
            </div>
          </div>
        </div>
      </section>

      <div className="hfr-tiles" role="group" aria-label="Restriction types">
        {CAT_KEYS.map((c, i) => (
          <button key={c} className={'hfr-tile' + (f.cat === c ? ' hfr-on' : '')} style={{ '--c': `var(${CATS[c].color})` }} title={CATS[c].hint}
            aria-pressed={f.cat === c} onClick={() => setFilter({ cat: f.cat === c ? '' : c }, f.cat === c ? null : 'type:' + c)}>
            <span className="hfr-hk">{i + 1}</span>
            <div className="hfr-sq"><Icon name={CATS[c].icon} /></div>
            <div className="hfr-n">{fmtN(facets.cats[c])}</div>
            <div className="hfr-l">{CATS[c].label}</div>
          </button>
        ))}
      </div>

      <div className="hfr-bar">
        <div className="hfr-pills" role="group" aria-label="Dosage form">
          <button className={'hfr-pill' + (!f.form ? ' hfr-on' : '')} onClick={() => setFilter({ form: '' })}><Icon name="LayoutGrid" />All forms</button>
          {Object.entries(FORMS).map(([key, v]) => (
            <button key={key} className={'hfr-pill' + (f.form === key ? ' hfr-on' : '')} onClick={() => setFilter({ form: key }, 'form:' + key)}>
              <Icon name={v.icon} />{v.label}<span className="hfr-c">{facets.forms[key] || 0}</span>
            </button>
          ))}
        </div>
        <label className="hfr-sel"><Icon name="Stethoscope" />
          <select aria-label="Prescribing specialty" value={f.spec} onChange={(e) => setFilter({ spec: e.target.value }, e.target.value ? 'specialty:' + e.target.value : null)}>
            <option value="">Any specialty</option>
            {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
          </select><Icon name="ChevronDown" />
        </label>
        <div className="hfr-drop">
          <button className={'hfr-pill' + (f.flags.length ? ' hfr-on' : '')} onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
            <Icon name="SlidersHorizontal" />Conditions{f.flags.length ? <span className="hfr-c">{f.flags.length}</span> : null}
          </button>
          {menu && (
            <>
              <div style={{ position: 'fixed', inset: 0, zIndex: 29 }} onClick={() => setMenu(false)} />
              <div className="hfr-menu" role="menu">
                {Object.entries(FLAGS).filter(([x]) => x !== 'consultant').map(([x, v]) => {
                  const on = f.flags.includes(x);
                  return (
                    <button key={x} role="menuitemcheckbox" aria-checked={on} className={'hfr-mi' + (on ? ' hfr-on' : '')}
                      onClick={() => setFilter({ flags: on ? f.flags.filter((y) => y !== x) : [...f.flags, x] }, on ? null : 'condition:' + x)}>
                      <Icon name={v.icon} /><span>{v.label}<small>{v.hint}, {facets.flags[x] || 0} items</small></span><span className="hfr-ck"><Icon name="Check" /></span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <div className="hfr-seg" role="group" aria-label="Sort">
          <button className={f.sort === 'name' ? 'hfr-on' : ''} onClick={() => setFilter({ sort: 'name' })}>A–Z</button>
          <button className={f.sort === 'cat' ? 'hfr-on' : ''} onClick={() => setFilter({ sort: 'cat' })}>By type</button>
        </div>
      </div>

      {status === 'error' && !entries.length && (
        <div className="hfr-notice"><div><Icon name="WifiOff" />The formulary could not be loaded. Check your connection and sign-in, then reload the page.</div></div>
      )}

      {current && <AnswerCard d={current} q={qd} pos={k} total={rows.length} pinned={pins.includes(current.id)}
        onOpen={() => open(current.id)} onCopy={() => copyText(current.no, showToast, `Item number ${current.no} copied`)} onPin={() => togglePin(current.id)} />}

      {!searching && (pinned.length > 0 || recents.length > 0) && (
        <div className="hfr-quick">
          {pinned.length > 0 && <span className="hfr-lab"><Icon name="Pin" />Pinned</span>}
          {pinned.map((d) => <QuickChip key={d.id} d={d} onClick={() => open(d.id)} />)}
          {recents.length > 0 && <span className="hfr-lab" style={{ marginLeft: pinned.length ? 10 : 0 }}><Icon name="History" />Recent</span>}
          {recents.slice(0, 6).map((d) => <QuickChip key={d.id} d={d} onClick={() => open(d.id)} />)}
        </div>
      )}

      {entries.length > 0 && (
        <div className="hfr-status">
          <b>{fmtN(rows.length)}</b>{rows.length === 1 ? ' result' : ' results'}
          {qd.trim() && (fuzzy ? <> closest to “{qd.trim()}”, allowing for spelling</> : <> for “{qd.trim()}”</>)}
          {activeLabels.length > 0 && <> · {activeLabels.join(', ')}</>}
          {(activeLabels.length > 0 || q) && <button onClick={clearAll}>Clear</button>}
        </div>
      )}

      <div className="hfr-grid" role="list">
        {!entries.length && status === 'loading' && Array.from({ length: 6 }, (_, i) => <div key={i} className="hfr-skel" />)}
        {entries.length > 0 && rows.length === 0 && (
          <div className="hfr-empty"><b>Nothing matches{qd.trim() ? ` “${qd.trim()}”` : ''}</b>Try a generic name, a strength such as 500 mg, an item number, or clear a filter.</div>
        )}
        {rows.slice(0, shown).map((d, i) => (
          <ResultCard key={d.id} d={d} q={fuzzy ? '' : qd} kb={active && i === k} pinned={pins.includes(d.id)}
            onClick={() => open(d.id)} onHover={() => { if (active && i !== k && window.matchMedia?.('(hover: hover)').matches) setK(i); }} />
        ))}
      </div>
      <div ref={moreRef} style={{ height: 1 }} />
      <p className="hfr-foot">Restriction types and specialties are read from the register wording. The wording shown in each drug’s details is the authority.</p>

      <Layer dark={dark}>
        <div className={'hfr-scrim' + (selected ? ' hfr-on' : '')} onClick={close} />
        <DetailSheet d={selected} q={qd} pinned={selected ? pins.includes(selected.id) : false}
          onClose={close} onPin={() => togglePin(selected.id)}
          onCopy={() => copyText(selected.no, showToast, `Item number ${selected.no} copied`)}
          onCopyLink={() => copyText(linkFor(selected.id), showToast, 'Link copied')} />
        <Toast toast={toast} />
      </Layer>
    </div>
  );
}

function linkFor(id) {
  try { const u = new URL(window.location.href); u.searchParams.delete('q'); u.searchParams.set('item', id); return u.href; } catch { return id; }
}

function QuickChip({ d, onClick }) {
  return (
    <button className="hfr-qc" style={{ '--c': `var(${CATS[d.cat].color})` }} onClick={onClick}>
      <span className="hfr-dot"><Icon name={CATS[d.cat].icon} /></span><span>{d.name}</span>
    </button>
  );
}

function ResultCard({ d, q, kb, pinned, onClick, onHover }) {
  const c = CATS[d.cat];
  const form = FORMS[d.form];
  const fl = d.fl.filter((x) => x !== 'consultant' && x !== 'criteria');
  return (
    <button role="listitem" className={'hfr-card' + (kb ? ' hfr-kb' : '') + (pinned ? ' hfr-pinned' : '')} style={{ '--c': `var(${c.color})` }} onClick={onClick} onMouseEnter={onHover}>
      <span className="hfr-ic"><Icon name={form ? form.icon : 'FileQuestion'} /></span>
      <span style={{ minWidth: 0, display: 'block' }}>
        <span className="hfr-nm"><Hl text={d.name} q={q} /></span>
        <span className="hfr-sub">{d.no ? <><span>#<Hl text={d.no} q={q} /></span><span>{UOM[d.uom] || d.uom}</span></> : <span>Register entry only</span>}</span>
        <span className="hfr-vd"><span className="hfr-b"><Icon name={c.icon} />{c.label}</span><span className="hfr-t">{shortVerdict(d)}</span></span>
      </span>
      {fl.length > 0 && <span className="hfr-fl">{fl.map((x) => <span key={x} className={FLAGS[x].tone ? 'hfr-' + FLAGS[x].tone : ''} title={FLAGS[x].label}><Icon name={FLAGS[x].icon} /></span>)}</span>}
    </button>
  );
}

function Flags({ d }) {
  const fl = d.fl.filter((x) => x !== 'consultant');
  if (!fl.length) return null;
  return <div className="hfr-flags">{fl.map((x) => <span key={x} className={'hfr-flag' + (FLAGS[x].tone ? ' hfr-' + FLAGS[x].tone : '')}><Icon name={FLAGS[x].icon} />{FLAGS[x].label}</span>)}</div>;
}

function AnswerCard({ d, q, pos, total, pinned, onOpen, onCopy, onPin }) {
  const c = CATS[d.cat];
  const qOnly = d.qat && (!d.r || d.r.qatariOnlySource);
  const wording = qOnly ? d.qat.wording : d.r ? d.r.wording.replace(/\s*\n+\s*/g, ' · ') : 'No entry in the restriction register is linked to this item. Confirm with the current register before treating it as unrestricted.';
  return (
    <div className="hfr-answer" aria-live="polite">
      <div className="hfr-ans" style={{ '--c': `var(${c.color})` }}>
        <div className="hfr-al">
          <div className="hfr-top"><Icon name={c.icon} />{c.label}<span className="hfr-no">{d.no ? `#${d.no} · ${UOM[d.uom] || d.uom}` : 'Register entry only'}</span></div>
          <h2><Hl text={d.name} q={q} /></h2>
          <div className="hfr-who">Who can prescribe</div>
          <div className="hfr-vt">{verdict(d)}</div>
          <Flags d={d} />
        </div>
        <div className="hfr-ar">
          <h4><Icon name={qOnly ? 'BadgeAlert' : 'ScrollText'} />{qOnly ? 'Qatari-only list wording' : d.r ? 'Register wording' : 'Register check'}</h4>
          <div className={'hfr-wd' + (qOnly ? ' hfr-q' : '')}><Hl text={wording} q={q} /></div>
          {d.qat && !qOnly && <div className="hfr-wd hfr-q" style={{ WebkitLineClamp: 2 }}><b>Qatari patients only:</b> {d.qat.wording}</div>}
          <div className="hfr-pos">Result {pos + 1} of {fmtN(total)}</div>
          <div className="hfr-bt">
            <button className="hfr-pri" onClick={onOpen}><Icon name="Maximize2" />Full details <kbd>Enter</kbd></button>
            {d.no && <button onClick={onCopy}><Icon name="Copy" />Copy item no. <kbd>⇧ Enter</kbd></button>}
            <button className={pinned ? 'hfr-on' : ''} onClick={onPin}><Icon name="Pin" />{pinned ? 'Pinned' : 'Pin'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSheet({ d, q, pinned, onClose, onPin, onCopy, onCopyLink }) {
  const last = useRef(d);
  if (d) last.current = d;
  const v = d || last.current; // keep content during the closing animation
  const closeBtn = useRef(null);
  useEffect(() => { if (d) setTimeout(() => closeBtn.current?.focus(), 60); }, [d]);
  if (!v) return <aside className="hfr-sheet" aria-hidden="true" />;
  const c = CATS[v.cat], form = FORMS[v.form], r = v.r;
  const qOnly = r && r.qatariOnlySource;
  return (
    <aside className={'hfr-sheet' + (d ? ' hfr-on' : '')} style={{ '--c': `var(${c.color})` }} role="dialog" aria-modal="true" aria-label={v.name} aria-hidden={!d}>
      <div className="hfr-sh-head">
        <div className="hfr-sh-top">
          <span className="hfr-cat"><Icon name={c.icon} />{c.label}</span><span className="hfr-grow" />
          <button className="hfr-gbtn" onClick={onPin} aria-label={pinned ? 'Unpin' : 'Pin'}><Icon name={pinned ? 'PinOff' : 'Pin'} /></button>
          <button className="hfr-gbtn" onClick={onClose} ref={closeBtn} aria-label="Close"><Icon name="X" /></button>
        </div>
        <h2>{v.name}</h2>
        <div className="hfr-sub">{v.no ? <><span>Item {v.no}</span><span>{UOM[v.uom] || v.uom}</span></> : <span>Register entry with no formulary item</span>}{r && !qOnly && <span>Register: {r.generic}</span>}</div>
        <div className="hfr-verdict"><div><div className="hfr-k">Who can prescribe</div><div className="hfr-t">{verdict(v)}</div></div></div>
      </div>
      <div className="hfr-sh-body">
        <Flags d={v} />
        <div className="hfr-info" style={{ marginTop: 14 }}>
          <div className="hfr-it"><small>Dosage form</small><b>{form ? form.label : 'Not in formulary list'}{v.uom ? ` · ${UOM[v.uom] || v.uom}` : ''}</b></div>
          <div className="hfr-it"><small>Item number</small><b>{v.no || 'None'}</b></div>
          {r && !qOnly && <><div className="hfr-it"><small>Approved</small><b>{r.approved || 'Not stated'}</b></div><div className="hfr-it"><small>Available</small><b>{r.available || 'Not stated'}</b></div></>}
        </div>
        {v.qat && (
          <div className="hfr-blk"><h3><Icon name="BadgeAlert" />Qatari patients only</h3>
            <ol className="hfr-tl" style={{ '--c': 'var(--hfr-red)' }}>
              <li><span className="hfr-node"><Icon name="BadgeAlert" /></span><div><time>HMC list of items restricted to Qatari patients, 1 Jan 2025</time><p><Hl text={v.qat.wording || 'Restricted to Qatari patients.'} q={q} /></p></div></li>
              {v.qat.exceptions && <li><span className="hfr-node"><Icon name="CircleAlert" /></span><div><time>Exceptions</time><p><Hl text={v.qat.exceptions} q={q} /></p></div></li>}
            </ol>
          </div>
        )}
        {r && !qOnly && (
          <div className="hfr-blk"><h3><Icon name="ScrollText" />Register wording</h3>
            <ol className="hfr-tl">
              {wordingLines(r.wording).map((l, i) => (
                <li key={i}><span className="hfr-node"><Icon name={l.icon} /></span><div>{l.date && <time>{l.date}</time>}<p><Hl text={l.text} q={q} /></p></div></li>
              ))}
            </ol>
          </div>
        )}
        {!r && (
          <div className="hfr-blk"><h3><Icon name="CircleCheck" />Register check</h3>
            <ol className="hfr-tl"><li><span className="hfr-node"><Icon name="SearchCheck" /></span><div><p>No restriction entry is linked to this item. Confirm with the current register before treating it as unrestricted.</p></div></li></ol>
          </div>
        )}
        {r && (r.specialties || []).length > 0 && (
          <div className="hfr-blk"><h3><Icon name="Stethoscope" />Specialties named</h3><div className="hfr-tags">{r.specialties.map((s) => <span key={s} className="hfr-tag">{s}</span>)}</div></div>
        )}
        <div className="hfr-acts">
          {v.no && <button className="hfr-act hfr-pri" onClick={onCopy}><Icon name="Copy" />Copy item number</button>}
          <button className="hfr-act" onClick={onCopyLink}><Icon name="Link" />Copy link</button>
          <button className={'hfr-act' + (pinned ? ' hfr-on' : '')} onClick={onPin}><Icon name="Pin" />{pinned ? 'Pinned' : 'Pin'}</button>
        </div>
        {r && <p className="hfr-disc"><Icon name="Info" />The restriction type, specialties and flags summarise the register wording. The wording above is the authority.</p>}
      </div>
    </aside>
  );
}
