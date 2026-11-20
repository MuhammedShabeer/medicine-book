import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CATS, FLAGS, FORMS, UOM, SPECIALTIES, classify, fmtN, norm } from '../lib/model.js';
import { Icon } from './icons.jsx';
import { Confirm, Layer, Modal, Toast } from './Overlay.jsx';
import { useToast } from './hooks.js';

const TABS = [
  ['analytics', 'Analytics', 'ChartColumn'],
  ['meds', 'Medicines', 'Pill'],
  ['rules', 'Restrictions', 'ShieldCheck'],
  ['audit', 'Change log', 'History'],
  ['export', 'Export', 'Download'],
];
const typeOf = (k) => CATS[k] || CATS.note;
const when = (iso) => new Date(iso).toLocaleString();

function StatusTag({ x }) {
  if (x.isDeleted) return <span className="hfr-st hfr-gone">Removed</span>;
  if (x.source === 'admin') return <span className="hfr-st hfr-edit">Changed</span>;
  return <span className="hfr-st">Original</span>;
}

export default function AdminView({ api, dark, onBack, onDataChanged, title, showAnalytics = true, tracker }) {
  const [tab, setTab] = useState(showAnalytics ? 'analytics' : 'meds');
  const tabs = showAnalytics ? TABS : TABS.filter(([k]) => k !== 'analytics');
  const [data, setData] = useState(null);       // admin dataset (includes removed rows)
  const [loadErr, setLoadErr] = useState(null);
  const [toast, showToast] = useToast();
  const [dialog, setDialog] = useState(null);   // { kind, ... }

  const load = useCallback(async () => {
    try { setData(await api.admin.dataset()); setLoadErr(null); } catch (e) { setLoadErr(e.message); }
  }, [api]);
  useEffect(() => { load(); }, [load]);

  /** Runs an admin call, reports the outcome, and refreshes both admin and search data. */
  const run = useCallback(async (fn, okText, what) => {
    try {
      await fn(); showToast(okText);
      tracker?.admin(what ? `${okText}: ${what}` : okText, { change: okText });
      await load(); onDataChanged?.(); return true;
    }
    catch (e) { showToast(e.message || 'The change could not be saved', 'X'); return false; }
  }, [load, onDataChanged, showToast, tracker]);

  const rmap = useMemo(() => new Map((data?.restrictions || []).map((r) => [r.id, r])), [data]);

  return (
    <div className="hfr-admin">
      <header className="hfr-ahead"><div className="hfr-in">
        <button className="hfr-btn" onClick={onBack}><Icon name="ArrowLeft" />Search</button>
        <h1>{title} admin</h1>
        <nav className="hfr-tabs" aria-label="Admin sections">
          {tabs.map(([k, label, icon]) => <button key={k} className={tab === k ? 'hfr-on' : ''} onClick={() => setTab(k)} aria-current={tab === k}><Icon name={icon} />{label}</button>)}
        </nav>
      </div></header>
      <div className="hfr-abody">
        {loadErr && tab !== 'analytics' && <div className="hfr-banner"><Icon name="CircleAlert" />{loadErr} Changes need a connection to the server.</div>}
        {tab === 'analytics' && <Analytics api={api} data={data} onAddFromSearch={(term) => setDialog({ kind: 'med', prefill: term.toUpperCase() })} />}
        {tab === 'meds' && <Medicines data={data} rmap={rmap} onEdit={(item) => setDialog({ kind: 'med', item })} onAdd={() => setDialog({ kind: 'med' })}
          onRemove={(item) => setDialog({ kind: 'confirm', title: 'Remove this medicine?', text: `${item.name} will disappear from search for everyone. You can restore it later from the Removed list.`, action: 'Remove medicine', go: () => run(() => api.admin.removeItem(item.itemNo), 'Medicine removed', `${item.name} (#${item.itemNo})`) })}
          onRestore={(item) => run(() => api.admin.restoreItem(item.itemNo), 'Medicine restored', `${item.name} (#${item.itemNo})`)} />}
        {tab === 'rules' && <Restrictions data={data} onEdit={(r) => setDialog({ kind: 'rule', r })} onAdd={() => setDialog({ kind: 'rule' })}
          onRemove={(r) => setDialog({ kind: 'confirm', title: 'Remove this restriction?', text: `Items linked to “${r.generic}” will show “No restriction listed” until they are linked to another entry. You can restore it later.`, action: 'Remove restriction', go: () => run(() => api.admin.removeRestriction(r.id), 'Restriction removed', r.generic) })}
          onRestore={(r) => run(() => api.admin.restoreRestriction(r.id), 'Restriction restored', r.generic)} />}
        {tab === 'audit' && <Audit api={api} />}
        {tab === 'export' && <ExportTab api={api} showToast={showToast} />}
      </div>
      <Layer dark={dark}>
        {dialog?.kind === 'med' && <MedForm item={dialog.item} prefill={dialog.prefill} data={data} rmap={rmap} onClose={() => setDialog(null)}
          onSave={async (itemNo, input, isNew) => { if (await run(() => api.admin.saveItem(itemNo, input), isNew ? 'Medicine added' : 'Medicine saved', `${input.name} (#${itemNo})`)) setDialog(null); }} />}
        {dialog?.kind === 'rule' && <RuleForm r={dialog.r} data={data} onClose={() => setDialog(null)}
          onSave={async (id, input, links) => {
            const ok = await run(async () => {
              const saved = id ? await api.admin.saveRestriction(id, input) : await api.admin.createRestriction(input);
              await api.admin.setLinks(saved.id, links);
            }, id ? 'Restriction saved' : 'Restriction added', `${input.generic} (${links.length} linked item${links.length === 1 ? '' : 's'})`);
            if (ok) setDialog(null);
          }} />}
        {dialog?.kind === 'confirm' && <Confirm title={dialog.title} text={dialog.text} action={dialog.action} onConfirm={dialog.go} onClose={() => setDialog(null)} />}
        <Toast toast={toast} />
      </Layer>
    </div>
  );
}

/* ---------------- Analytics ---------------- */
function Analytics({ api, data, onAddFromSearch }) {
  const [days, setDays] = useState(30);
  const [st, setSt] = useState(null);
  const [err, setErr] = useState(null);
  const [user, setUser] = useState(null);
  const load = useCallback(async () => {
    setErr(null);
    try { setSt(await api.admin.analytics(days)); } catch (e) { setErr(e.message); }
  }, [api, days]);
  useEffect(() => { load(); }, [load]);
  const names = useMemo(() => new Map((data?.items || []).map((i) => [i.itemNo, i.name])), [data]);
  const zr = st && st.searches ? Math.round((st.zeroResults / st.searches) * 100) : 0;
  const catTotal = st ? st.viewsByRestrictionType.reduce((a, b) => a + b.count, 0) || 1 : 1;
  const catCount = (k) => st?.viewsByRestrictionType.find((x) => x.key === k)?.count || 0;
  const filterLabel = (k) => { const [t, v] = String(k).split(':'); return t === 'type' ? 'Type: ' + (CATS[v]?.label || v) : t === 'form' ? 'Form: ' + (FORMS[v]?.label || v) : t === 'condition' ? 'Condition: ' + (FLAGS[v]?.label || v) : 'Specialty: ' + v; };

  return (
    <>
      <div className="hfr-atool">
        <h2>Usage analytics</h2>
        <div className="hfr-seg2">{[7, 30, 90].map((n) => <button key={n} className={days === n ? 'hfr-on' : ''} onClick={() => setDays(n)}>{n} days</button>)}</div>
        <button className="hfr-btn" onClick={load}><Icon name="RefreshCw" />Refresh</button>
      </div>
      <div className="hfr-banner"><Icon name="Info" /><span>Every search and look-up is recorded against the signed-in user, so you can see who searched what, when and how often. Only admins can see this page.</span></div>
      {err && <div className="hfr-nodata">Usage data could not be loaded: {err}</div>}
      {!st && !err && <div className="hfr-nodata">Loading usage…</div>}
      {st && (
        <>
          <div className="hfr-kpis">
            <Kpi icon="Search" label="Searches" value={st.searches} note={`Last ${st.days} days`} />
            <Kpi icon="MousePointerClick" label="Drug look-ups" value={st.views} note="Detail views opened" />
            <Kpi icon="Users" label="Active users" value={st.activeUsers} note="Searched or looked up at least once" />
            <Kpi icon="SearchX" label="Searches with no result" value={st.zeroResults} note={`${zr}% of searches`} />
          </div>
          <div className="hfr-panels">
            <div className="hfr-panel hfr-p8"><h3><Icon name="ChartColumn" />Daily activity</h3><p className="hfr-hint">Searches plus look-ups per day. Hover or tap a bar for the breakdown.</p><DayChart daily={st.daily} /></div>
            <div className="hfr-panel hfr-p4"><h3><Icon name="ShieldCheck" />Look-ups by restriction type</h3><p className="hfr-hint">What pharmacists check most.</p>
              {st.viewsByRestrictionType.length ? <div className="hfr-hbar">{Object.entries(CATS).map(([k, v]) => (
                <div key={k} className="hfr-hb" style={{ '--c': `var(${v.color})` }}><span className="hfr-l"><Icon name={v.icon} />{v.label}</span><span className="hfr-t"><i style={{ width: `${(catCount(k) / catTotal) * 100}%` }} /></span><span className="hfr-n">{fmtN(catCount(k))}</span></div>
              ))}</div> : <div className="hfr-nodata">No look-ups yet.</div>}
            </div>
            <div className="hfr-panel hfr-p12"><h3><Icon name="Users" />Users</h3><p className="hfr-hint">Per-user activity for KPI reporting. Select a user to see every search and look-up.</p>
              {st.users.length ? <div className="hfr-tbl">
                <div className="hfr-tr hfr-usr hfr-h"><span>User</span><span>Searches</span><span>Look-ups</span><span>No result</span><span>Last active</span><span /></div>
                {st.users.map((u) => (
                  <div key={u.userId} className="hfr-tr hfr-usr"><span className="hfr-nm hfr-wide">{u.userName}</span><span className="hfr-mut">{fmtN(u.searches)} searches</span><span className="hfr-mut">{fmtN(u.views)} look-ups</span><span className="hfr-mut">{fmtN(u.zeroResults)} no result</span><span className="hfr-mut">{when(u.lastSeenUtc)}</span>
                    <span className="hfr-acts2"><button className="hfr-btn hfr-sm" onClick={() => setUser(u)}>Details</button></span></div>
                ))}
              </div> : <div className="hfr-nodata">No usage in this period yet.</div>}
            </div>
            <div className="hfr-panel hfr-p4"><h3><Icon name="Flame" />Most viewed drugs</h3><p className="hfr-hint">Candidates for pinning or a quick-reference card.</p><Rank list={st.topItems} label={(k) => names.get(k) || k} /></div>
            <div className="hfr-panel hfr-p4"><h3><Icon name="TextSearch" />Top search terms</h3><p className="hfr-hint">Exactly what people typed.</p><Rank list={st.topTerms} label={(k) => k} /></div>
            <div className="hfr-panel hfr-p4"><h3><Icon name="CircleHelp" />Searches with no result</h3><p className="hfr-hint">Possible missing medicines or spelling gaps.</p>
              <Rank list={st.zeroResultTerms} label={(k) => k} action={(k) => <button className="hfr-btn hfr-sm" onClick={() => onAddFromSearch(k)} title="Add as a medicine" aria-label={`Add ${k} as a medicine`}><Icon name="Plus" /></button>} /></div>
            <div className="hfr-panel hfr-p6"><h3><Icon name="SlidersHorizontal" />Filters used</h3><p className="hfr-hint">How people narrow their search.</p><Rank list={st.filters} label={filterLabel} /></div>
            <div className="hfr-panel hfr-p6"><h3><Icon name="Database" />Formulary at a glance</h3><p className="hfr-hint">Live totals including admin changes.</p><Health data={data} /></div>
          </div>
          <p className="hfr-hint" style={{ marginTop: 12 }}>Period from {new Date(st.sinceUtc).toLocaleDateString()}.</p>
        </>
      )}
      {user && <UserEvents api={api} user={user} days={days} names={names} onClose={() => setUser(null)} />}
    </>
  );
}

function Kpi({ icon, label, value, note }) {
  return <div className="hfr-kpi"><small><Icon name={icon} />{label}</small><b>{fmtN(value)}</b><p>{note}</p></div>;
}

function Rank({ list, label, action }) {
  if (!list?.length) return <div className="hfr-nodata">No data in this period yet.</div>;
  const max = list[0].count || 1;
  return (
    <div className="hfr-rank">{list.map((x, i) => (
      <div key={x.key} className="hfr-rk"><span className="hfr-i">{i + 1}</span><span className="hfr-lb"><span title={label(x.key)}>{label(x.key)}</span><i style={{ width: `${Math.max(3, (x.count / max) * 100)}%` }} /></span>
        <span className="hfr-v">{fmtN(x.count)}{action?.(x.key)}</span></div>
    ))}</div>
  );
}

function DayChart({ daily }) {
  const [tip, setTip] = useState(null);
  const wrap = useRef(null);
  const [W, setW] = useState(900);
  // Draw at the real pixel width so labels never stretch or squash.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return undefined;
    const ro = new ResizeObserver((e) => setW(Math.max(280, Math.round(e[0].contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const H = 220, pl = 36, pb = 24, pt = 10;
  const totals = daily.map((d) => d.searches + d.views);
  const mx = Math.max(4, ...totals);
  const step = Math.pow(10, Math.floor(Math.log10(mx)));
  const top = Math.ceil(mx / step) * step;
  const bw = (W - pl - 8) / daily.length;
  const y = (v) => pt + (H - pt - pb) * (1 - v / top);
  const every = Math.ceil(daily.length / Math.max(2, Math.floor(W / 90)));
  const fmtDay = (iso, opts) => new Date(iso + 'T00:00:00').toLocaleDateString(undefined, opts);
  const showTip = (e, d) => {
    const r = wrap.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    setTip({ d, x: p.clientX - r.left, y: p.clientY - r.top });
  };
  return (
    <div className="hfr-chartwrap" ref={wrap} onMouseLeave={() => setTip(null)}>
      <svg className="hfr-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Daily searches and look-ups">
        {[0, 0.5, 1].map((f) => <g key={f}><line className="hfr-gl" x1={pl} x2={W} y1={y(top * f)} y2={y(top * f)} /><text className="hfr-ax" x={pl - 6} y={y(top * f) + 4} textAnchor="end">{fmtN(Math.round(top * f))}</text></g>)}
        {daily.map((d, i) => {
          const t = d.searches + d.views, x = pl + i * bw + bw * 0.18, w = Math.max(2, bw * 0.64), h = (H - pt - pb) - (y(t) - pt);
          return (
            <g key={d.date} onMouseMove={(e) => showTip(e, d)} onTouchStart={(e) => showTip(e, d)}>
              <rect className="hfr-hit" x={pl + i * bw} y={pt} width={bw} height={H - pt - pb} />
              {t > 0 && <path className="hfr-bar" d={`M${x},${H - pb} v-${Math.max(0, h - 4)} q0,-4 4,-4 h${Math.max(0, w - 8)} q4,0 4,4 v${Math.max(0, h - 4)} z`} />}
              {i % every === 0 && <text className="hfr-ax" x={x + w / 2} y={H - 6} textAnchor="middle">{fmtDay(d.date, { day: 'numeric', month: 'short' })}</text>}
            </g>
          );
        })}
      </svg>
      {tip && <div className="hfr-tip" style={{ left: tip.x, top: tip.y }}><b>{fmtDay(tip.d.date, { weekday: 'short', day: 'numeric', month: 'short' })}</b>{fmtN(tip.d.searches)} searches · {fmtN(tip.d.views)} look-ups · {tip.d.users} users</div>}
    </div>
  );
}

function Health({ data }) {
  if (!data) return <div className="hfr-nodata">Loading…</div>;
  const items = data.items.filter((i) => !i.isDeleted);
  const rs = data.restrictions.filter((r) => !r.isDeleted);
  const live = new Set(rs.map((r) => r.id));
  const restricted = items.filter((i) => (i.restrictionId && live.has(i.restrictionId)) || i.qatariOnly).length;
  const changed = data.items.filter((i) => i.source === 'admin').length + data.restrictions.filter((r) => r.source === 'admin').length;
  return (
    <div className="hfr-health">
      <div><small>Medicines</small><b>{fmtN(items.length)}</b></div>
      <div><small>With a restriction</small><b>{fmtN(restricted)}</b></div>
      <div><small>No restriction listed</small><b>{fmtN(items.length - restricted)}</b></div>
      <div><small>Restriction entries</small><b>{fmtN(rs.length)}</b></div>
      <div><small>Qatari-only items</small><b>{fmtN(items.filter((i) => i.qatariOnly).length)}</b></div>
      <div><small>Changed by admins</small><b>{fmtN(changed)}</b></div>
    </div>
  );
}

function UserEvents({ api, user, days, names, onClose }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => { api.admin.userEvents(user.userId, days).then(setRows, (e) => setErr(e.message)); }, [api, user, days]);
  return (
    <Modal title={`${user.userName}: last ${days} days`} onClose={onClose}>
      {err && <div className="hfr-nodata">{err}</div>}
      {!rows && !err && <div className="hfr-nodata">Loading…</div>}
      {rows && (rows.length ? <div className="hfr-tbl">
        <div className="hfr-tr hfr-ev hfr-h"><span>When</span><span>Action</span><span>Details</span></div>
        {rows.map((e, i) => (
          <div key={i} className="hfr-tr hfr-ev"><span className="hfr-mut">{when(e.atUtc)}</span><span><span className={'hfr-st' + (e.type === 'search' && e.zeroResult ? ' hfr-gone' : '')}>{e.type === 'view' ? 'Look-up' : e.type === 'search' ? 'Search' : 'Filter'}</span></span>
            <span className="hfr-nm hfr-wide">{e.type === 'view' ? names.get(e.itemNo) || e.itemNo || 'Register entry' : e.type === 'search' ? `“${e.term}”${e.zeroResult ? ' (no result)' : ''}` : e.detail}</span></div>
        ))}
      </div> : <div className="hfr-nodata">No activity in this period.</div>)}
    </Modal>
  );
}

/* ---------------- Medicines ---------------- */
function usePaged(list, per) {
  const [page, setPage] = useState(0);
  const pages = Math.max(1, Math.ceil(list.length / per));
  const p = Math.min(page, pages - 1);
  return { rows: list.slice(p * per, p * per + per), page: p, pages, setPage };
}

function Medicines({ data, rmap, onEdit, onAdd, onRemove, onRestore }) {
  const [q, setQ] = useState('');
  const [show, setShow] = useState('all');
  const list = useMemo(() => {
    const nq = norm(q);
    return (data?.items || []).filter((i) => (show === 'all' ? !i.isDeleted : show === 'changed' ? i.source === 'admin' : i.isDeleted)
      && (!nq || norm(`${i.name} ${i.itemNo} ${rmap.get(i.restrictionId)?.generic || ''}`).includes(nq)));
  }, [data, q, show, rmap]);
  const pg = usePaged(list, 50);
  useEffect(() => pg.setPage(0), [q, show]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <div className="hfr-atool">
        <h2>Medicines</h2>
        <label className="hfr-asearch"><Icon name="Search" /><input className="hfr-inp" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, item number or restriction" aria-label="Search medicines" /></label>
        <Seg value={show} onChange={setShow} options={[['all', 'Active'], ['changed', 'Changed'], ['del', 'Removed']]} />
        <button className="hfr-btn hfr-pri" onClick={onAdd}><Icon name="Plus" />Add medicine</button>
      </div>
      {!data ? <div className="hfr-nodata">Loading…</div> : (
        <>
          <div className="hfr-tbl">
            <div className="hfr-tr hfr-med hfr-h"><span>Item no.</span><span>Medicine</span><span>Unit</span><span>Restriction</span><span>Status</span><span /></div>
            {pg.rows.map((i) => {
              const r = i.restrictionId ? rmap.get(i.restrictionId) : null;
              const c = r && !r.isDeleted ? typeOf(r.type) : i.qatariOnly ? { color: '--hfr-red', icon: 'BadgeAlert' } : CATS.free;
              return (
                <div key={i.itemNo} className={'hfr-tr hfr-med' + (i.isDeleted ? ' hfr-del' : '')}>
                  <span className="hfr-mut">{i.itemNo}</span><span className="hfr-nm hfr-wide">{i.name}</span><span className="hfr-mut">{UOM[i.uom] || i.uom}</span>
                  <span style={{ minWidth: 0 }}><span className="hfr-chip" style={{ '--c': `var(${c.color})` }}><Icon name={c.icon} /><span>{r && !r.isDeleted ? r.generic : i.qatariOnly ? 'Qatari patients only' : 'No restriction'}</span></span></span>
                  <span><StatusTag x={i} /></span>
                  <span className="hfr-acts2">{i.isDeleted
                    ? <button className="hfr-btn hfr-sm" onClick={() => onRestore(i)}><Icon name="Undo2" />Restore</button>
                    : <><button className="hfr-btn hfr-sm" onClick={() => onEdit(i)}><Icon name="Pencil" />Edit</button><button className="hfr-btn hfr-sm hfr-danger" onClick={() => onRemove(i)} aria-label={`Remove ${i.name}`}><Icon name="Trash2" /></button></>}
                  </span>
                </div>
              );
            })}
            {!pg.rows.length && <div className="hfr-nodata">No medicines match.</div>}
          </div>
          <Pager pg={pg} total={list.length} noun="medicines" />
        </>
      )}
    </>
  );
}

function Seg({ value, onChange, options }) {
  return <div className="hfr-seg2">{options.map(([k, l]) => <button key={k} className={value === k ? 'hfr-on' : ''} onClick={() => onChange(k)}>{l}</button>)}</div>;
}
function Pager({ pg, total, noun }) {
  return (
    <div className="hfr-pager"><span>{fmtN(total)} {noun} · page {pg.page + 1} of {pg.pages}</span>
      <span style={{ display: 'flex', gap: 6 }}>
        <button className="hfr-btn hfr-sm" disabled={pg.page === 0} onClick={() => pg.setPage(pg.page - 1)} aria-label="Previous page"><Icon name="ChevronLeft" /></button>
        <button className="hfr-btn hfr-sm" disabled={pg.page >= pg.pages - 1} onClick={() => pg.setPage(pg.page + 1)} aria-label="Next page"><Icon name="ChevronRight" /></button>
      </span>
    </div>
  );
}

function MedForm({ item, prefill, data, onClose, onSave }) {
  const [no, setNo] = useState(item?.itemNo || '');
  const [name, setName] = useState(item?.name || prefill || '');
  const [uom, setUom] = useState(item?.uom || 'TAB');
  const [rid, setRid] = useState(item?.restrictionId || '');
  const [qat, setQat] = useState(!!item?.qatariOnly);
  const [qw, setQw] = useState(item?.qatariWording || '');
  const [qx, setQx] = useState(item?.qatariExceptions || '');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const options = useMemo(() => (data?.restrictions || []).filter((r) => !r.isDeleted).sort((a, b) => a.generic.localeCompare(b.generic)), [data]);
  const save = async () => {
    const n = no.trim();
    if (!/^[A-Za-z0-9-]{3,40}$/.test(n)) return setErr('Enter an item number of 3 to 40 letters, digits or hyphens.');
    if (!item && data?.items.some((x) => x.itemNo === n)) return setErr('That item number already exists.');
    if (name.trim().length < 2) return setErr('Enter the medicine name.');
    if (qat && !qw.trim()) return setErr('Enter the Qatari-only wording, or untick Qatari patients only.');
    setErr(''); setBusy(true);
    await onSave(n, { name: name.trim(), uom, restrictionId: rid || null, qatariOnly: qat, qatariWording: qat ? qw.trim() : null, qatariExceptions: qat ? qx.trim() || null : null }, !item);
    setBusy(false);
  };
  return (
    <Modal title={item ? 'Edit medicine' : 'Add medicine'} onClose={onClose} footer={<>
      <button className="hfr-btn" onClick={onClose}>Cancel</button>
      <button className="hfr-btn hfr-pri" onClick={save} disabled={busy}><Icon name="Check" />{item ? 'Save changes' : 'Add medicine'}</button>
    </>}>
      <div className="hfr-fg">
        <div className="hfr-fd"><label htmlFor="hfr-no">Item number</label><input id="hfr-no" className="hfr-inp" value={no} onChange={(e) => setNo(e.target.value)} readOnly={!!item} inputMode="numeric" placeholder="e.g. 8900007001" />
          <span className="hfr-help">{item ? 'Item numbers cannot be changed.' : 'Must be unique.'}</span></div>
        <div className="hfr-fd"><label htmlFor="hfr-uom">Unit of measure</label><select id="hfr-uom" className="hfr-inp" value={uom} onChange={(e) => setUom(e.target.value)}>{Object.entries(UOM).map(([k, v]) => <option key={k} value={k}>{v} ({k})</option>)}</select></div>
        <div className="hfr-fd hfr-full"><label htmlFor="hfr-name">Medicine name as listed</label><input id="hfr-name" className="hfr-inp" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. LINEZOLID 600MG" /></div>
        <div className="hfr-fd hfr-full"><label htmlFor="hfr-rid">Restriction entry</label>
          <select id="hfr-rid" className="hfr-inp" value={rid} onChange={(e) => setRid(e.target.value)}>
            <option value="">No restriction</option>
            {options.map((r) => <option key={r.id} value={r.id}>{r.generic} · {typeOf(r.type).label}</option>)}
          </select><span className="hfr-help">Need a new entry? Create it under Restrictions, then link it here.</span></div>
        <div className="hfr-fd hfr-full"><div className="hfr-checks"><label className={qat ? 'hfr-on' : ''}><input type="checkbox" checked={qat} onChange={(e) => setQat(e.target.checked)} />Restricted to Qatari patients only</label></div></div>
        {qat && <div className="hfr-fd hfr-full"><label htmlFor="hfr-qw">Qatari-only restriction wording</label>
          <textarea id="hfr-qw" style={{ minHeight: 80 }} value={qw} onChange={(e) => setQw(e.target.value)} placeholder="Who may prescribe and any criteria" />
          <input className="hfr-inp" value={qx} onChange={(e) => setQx(e.target.value)} placeholder="Exceptions (optional)" aria-label="Exceptions" /></div>}
        {err && <div className="hfr-err hfr-fd hfr-full" role="alert">{err}</div>}
      </div>
    </Modal>
  );
}

/* ---------------- Restrictions ---------------- */
function Restrictions({ data, onEdit, onAdd, onRemove, onRestore }) {
  const [q, setQ] = useState('');
  const [show, setShow] = useState('all');
  const linked = useMemo(() => { const m = {}; for (const i of data?.items || []) if (!i.isDeleted && i.restrictionId) m[i.restrictionId] = (m[i.restrictionId] || 0) + 1; return m; }, [data]);
  const list = useMemo(() => {
    const nq = norm(q);
    return (data?.restrictions || []).filter((r) => (show === 'all' ? !r.isDeleted : show === 'changed' ? r.source === 'admin' : r.isDeleted)
      && (!nq || norm(`${r.generic} ${r.wording} ${r.specialties.join(' ')}`).includes(nq)));
  }, [data, q, show]);
  const pg = usePaged(list, 40);
  useEffect(() => pg.setPage(0), [q, show]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <>
      <div className="hfr-atool">
        <h2>Restrictions</h2>
        <label className="hfr-asearch"><Icon name="Search" /><input className="hfr-inp" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search generic name, wording or specialty" aria-label="Search restrictions" /></label>
        <Seg value={show} onChange={setShow} options={[['all', 'Active'], ['changed', 'Changed'], ['del', 'Removed']]} />
        <button className="hfr-btn hfr-pri" onClick={onAdd}><Icon name="Plus" />Add restriction</button>
      </div>
      {!data ? <div className="hfr-nodata">Loading…</div> : (
        <>
          <div className="hfr-tbl">
            <div className="hfr-tr hfr-res hfr-h"><span>Generic name</span><span>Type</span><span>Items</span><span>Specialties</span><span>Status</span><span /></div>
            {pg.rows.map((r) => {
              const c = typeOf(r.type);
              return (
                <div key={r.id} className={'hfr-tr hfr-res' + (r.isDeleted ? ' hfr-del' : '')}>
                  <span className="hfr-nm hfr-wide">{r.generic}</span>
                  <span><span className="hfr-chip" style={{ '--c': `var(${c.color})` }}><Icon name={c.icon} /><span>{c.label}</span></span></span>
                  <span className="hfr-mut">{linked[r.id] || 0} linked</span>
                  <span className="hfr-mut" style={{ whiteSpace: 'nowrap' }}>{r.specialties.join(', ') || 'None named'}</span>
                  <span><StatusTag x={r} /></span>
                  <span className="hfr-acts2">{r.isDeleted
                    ? <button className="hfr-btn hfr-sm" onClick={() => onRestore(r)}><Icon name="Undo2" />Restore</button>
                    : <><button className="hfr-btn hfr-sm" onClick={() => onEdit(r)}><Icon name="Pencil" />Edit</button><button className="hfr-btn hfr-sm hfr-danger" onClick={() => onRemove(r)} aria-label={`Remove ${r.generic}`}><Icon name="Trash2" /></button></>}
                  </span>
                </div>
              );
            })}
            {!pg.rows.length && <div className="hfr-nodata">No restriction entries match.</div>}
          </div>
          <Pager pg={pg} total={list.length} noun="entries" />
        </>
      )}
    </>
  );
}

function RuleForm({ r, data, onClose, onSave }) {
  const [g, setG] = useState(r?.generic || '');
  const [st, setSt] = useState(r?.status || '');
  const [tx, setTx] = useState(r?.wording || '');
  const [type, setType] = useState(r?.type || 'spec');
  const [cond, setCond] = useState(r?.conditions || []);
  const [specs, setSpecs] = useState(r?.specialties || []);
  const [ap, setAp] = useState(r?.approved || '');
  const [av, setAv] = useState(r?.available || '');
  const [links, setLinks] = useState(() => (data?.items || []).filter((i) => !i.isDeleted && r && i.restrictionId === r.id).map((i) => i.itemNo));
  const [lq, setLq] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const items = useMemo(() => new Map((data?.items || []).map((i) => [i.itemNo, i])), [data]);
  const rnames = useMemo(() => new Map((data?.restrictions || []).map((x) => [x.id, x.generic])), [data]);
  const sugg = useMemo(() => {
    const nq = norm(lq.trim());
    if (nq.length < 2) return [];
    return (data?.items || []).filter((i) => !i.isDeleted && !links.includes(i.itemNo) && norm(`${i.name} ${i.itemNo}`).includes(nq)).slice(0, 20);
  }, [lq, data, links]);
  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const suggest = () => { const c = classify(st, tx); setType(c.type); setCond(c.conditions); setSpecs(c.specialties); if (c.approved) setAp(c.approved); if (c.available) setAv(c.available); };
  const allSpecs = [...new Set([...Object.keys(SPECIALTIES), ...specs])];
  const save = async () => {
    if (g.trim().length < 2) return setErr('Enter the generic name.');
    if (tx.trim().length < 5) return setErr('Enter the register wording.');
    setErr(''); setBusy(true);
    await onSave(r?.id || null, { generic: g.trim(), status: st, wording: tx.trim(), type, conditions: cond, specialties: specs, approved: ap.trim(), available: av.trim() }, links);
    setBusy(false);
  };
  return (
    <Modal title={r ? 'Edit restriction' : 'Add restriction'} onClose={onClose} footer={<>
      <button className="hfr-btn" onClick={onClose}>Cancel</button>
      <button className="hfr-btn hfr-pri" onClick={save} disabled={busy}><Icon name="Check" />{r ? 'Save changes' : 'Add restriction'}</button>
    </>}>
      <div className="hfr-fg">
        <div className="hfr-fd"><label htmlFor="hfr-g">Generic name</label><input id="hfr-g" className="hfr-inp" value={g} onChange={(e) => setG(e.target.value)} placeholder="e.g. Linezolid" /></div>
        <div className="hfr-fd"><label htmlFor="hfr-st">Register status</label>
          <select id="hfr-st" className="hfr-inp" value={st} onChange={(e) => setSt(e.target.value)}>{['', 'Restricted', 'Restricted Controlled Drug', 'Controlled Drug'].concat(st && !['', 'Restricted', 'Restricted Controlled Drug', 'Controlled Drug'].includes(st) ? [st] : []).map((s) => <option key={s} value={s}>{s || 'Not stated'}</option>)}</select></div>
        <div className="hfr-fd hfr-full"><label htmlFor="hfr-tx">Register wording</label>
          <textarea id="hfr-tx" value={tx} onChange={(e) => setTx(e.target.value)} placeholder="Paste the wording exactly as approved. Put each update on its own line." />
          <span className="hfr-help">Shown word for word to users. Start a line with a date (for example “Update June 7, 2023:”) to show it on the timeline.</span></div>
        <div className="hfr-fd hfr-full" style={{ gridTemplateColumns: '1fr auto', alignItems: 'end' }}>
          <span className="hfr-help">Fill the type, conditions and specialties from the wording, then review them.</span>
          <button className="hfr-btn hfr-sm" onClick={suggest}><Icon name="WandSparkles" />Suggest from wording</button></div>
        <div className="hfr-fd"><label htmlFor="hfr-type">Restriction type</label>
          <select id="hfr-type" className="hfr-inp" value={type} onChange={(e) => setType(e.target.value)}>{Object.entries(CATS).filter(([k]) => k !== 'free').map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
        <div className="hfr-fd"><label>Dates</label><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          <input className="hfr-inp" value={ap} onChange={(e) => setAp(e.target.value)} placeholder="Approved" aria-label="Approved" />
          <input className="hfr-inp" value={av} onChange={(e) => setAv(e.target.value)} placeholder="Available" aria-label="Available" /></div></div>
        <div className="hfr-fd hfr-full"><label>Conditions</label><div className="hfr-checks">
          {Object.entries(FLAGS).filter(([k]) => k !== 'unlinked').map(([k, v]) => <label key={k} className={cond.includes(k) ? 'hfr-on' : ''}><input type="checkbox" checked={cond.includes(k)} onChange={() => toggle(cond, setCond, k)} />{v.label}</label>)}</div></div>
        <div className="hfr-fd hfr-full"><label>Specialties named</label><div className="hfr-checks">
          {allSpecs.map((s) => <label key={s} className={specs.includes(s) ? 'hfr-on' : ''}><input type="checkbox" checked={specs.includes(s)} onChange={() => toggle(specs, setSpecs, s)} />{s}</label>)}</div></div>
        <div className="hfr-fd hfr-full" style={{ position: 'relative' }}><label htmlFor="hfr-lq">Formulary items this applies to</label>
          <input id="hfr-lq" className="hfr-inp" value={lq} onChange={(e) => setLq(e.target.value)} placeholder="Type a name or item number, then pick from the list" autoComplete="off" />
          {sugg.length > 0 && <div className="hfr-sugg">{sugg.map((i) => <button key={i.itemNo} onClick={() => { setLinks((l) => [...l, i.itemNo]); setLq(''); }}>{i.name} <span style={{ color: 'var(--hfr-ink-3)' }}>#{i.itemNo}</span></button>)}</div>}
          <div className="hfr-links">{links.length ? links.map((no) => {
            const it = items.get(no);
            const other = it?.restrictionId && it.restrictionId !== r?.id ? ` (moves from ${rnames.get(it.restrictionId) || 'another entry'})` : '';
            return <span key={no}>{it ? it.name : no}{other}<button onClick={() => setLinks((l) => l.filter((x) => x !== no))} aria-label={`Unlink ${it ? it.name : no}`}><Icon name="X" /></button></span>;
          }) : <span className="hfr-help" style={{ border: 0, background: 'none', padding: 0 }}>No items linked yet.</span>}</div></div>
        {err && <div className="hfr-err hfr-fd hfr-full" role="alert">{err}</div>}
      </div>
    </Modal>
  );
}

/* ---------------- Change log & export ---------------- */
function Audit({ api }) {
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState(null);
  useEffect(() => { api.admin.audit(200).then(setRows, (e) => setErr(e.message)); }, [api]);
  return (
    <>
      <div className="hfr-atool"><h2>Change log</h2><span className="hfr-hint" style={{ margin: 0 }}>The latest 200 admin changes, newest first.</span></div>
      {err && <div className="hfr-nodata">{err}</div>}
      {!rows && !err && <div className="hfr-nodata">Loading…</div>}
      {rows && <div className="hfr-tbl">
        <div className="hfr-tr hfr-aud hfr-h"><span>When</span><span>Action</span><span>Item</span><span>By</span></div>
        {rows.map((a, i) => (
          <div key={i} className="hfr-tr hfr-aud"><span className="hfr-mut">{when(a.atUtc)}</span>
            <span><span className={'hfr-st ' + (/Removed|Unlinked/.test(a.action) ? 'hfr-gone' : /Added|Restored|Linked/.test(a.action) ? 'hfr-new' : 'hfr-edit')}>{a.action}</span></span>
            <span className="hfr-nm hfr-wide">{a.label} <span className="hfr-mut">{a.kind === 'medicine' ? '#' + a.key : ''}</span></span><span className="hfr-mut">{a.userName}</span></div>
        ))}
        {!rows.length && <div className="hfr-nodata">No changes yet. Edits made under Medicines and Restrictions appear here.</div>}
      </div>}
    </>
  );
}

function ExportTab({ api, showToast }) {
  const [busy, setBusy] = useState('');
  const download = async (kind) => {
    setBusy(kind);
    try {
      const blob = await api.admin.exportFile(kind);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `hulool360-formulary-${new Date().toISOString().slice(0, 10)}.${kind}`;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      showToast(`Downloaded ${kind.toUpperCase()}`, 'Download');
    } catch (e) { showToast(e.message, 'X'); }
    setBusy('');
  };
  return (
    <>
      <div className="hfr-atool"><h2>Export</h2></div>
      <div className="hfr-panels">
        <div className="hfr-panel hfr-p6"><h3><Icon name="Sheet" />Spreadsheet</h3><p className="hfr-hint">Every active medicine with its restriction, conditions, specialties, register wording and Qatari-only status. Opens in Excel.</p>
          <button className="hfr-btn hfr-pri" disabled={!!busy} onClick={() => download('csv')}><Icon name="Download" />Download CSV</button></div>
        <div className="hfr-panel hfr-p6"><h3><Icon name="Braces" />Data file</h3><p className="hfr-hint">The full dataset as JSON, for other systems or backups.</p>
          <button className="hfr-btn" disabled={!!busy} onClick={() => download('json')}><Icon name="Download" />Download JSON</button></div>
      </div>
    </>
  );
}
