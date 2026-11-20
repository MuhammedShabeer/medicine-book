// In-browser stand-in for the ASP.NET Core module, for the click-through demo only.
// It answers the same routes and JSON shapes as MapFormularyRestrictions(), keeping data in this browser's localStorage.
const KEY = 'h360.demo.db.v1';
const PREFIX = '/api/formulary-restrictions';

export async function installMockServer(seedUrl, getUser) {
  const realFetch = window.fetch.bind(window);
  let db = null;
  try { db = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { db = null; }
  if (!db) {
    const seed = await (await realFetch(seedUrl)).json();
    const now = new Date().toISOString();
    db = {
      items: seed.items.map((i) => ({ ...i, isDeleted: false, source: 'seed', updatedAtUtc: now })),
      restrictions: seed.restrictions.map((r) => ({ ...r, isDeleted: false, source: 'seed', updatedAtUtc: now })),
      usage: [], audit: [], rev: 1,
    };
  }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(db)); } catch { /* storage full: keep in memory */ } };
  save();

  const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...headers } });
  const bad = (msg) => json({ error: msg }, 400);
  const version = () => `"demo-${db.rev}"`;
  const touch = () => { db.rev += 1; save(); };
  const audit = (user, action, kind, key, label) => db.audit.unshift({ atUtc: new Date().toISOString(), userId: user.id, userName: user.name, action, kind, key, label });
  const dataset = (all) => ({
    version: String(db.rev), sourceNote: 'HMC lists (demo copy)',
    items: db.items.filter((i) => all || !i.isDeleted), restrictions: db.restrictions.filter((r) => all || !r.isDeleted),
  });
  const top = (arr, n) => Object.entries(arr.reduce((m, k) => { if (k) m[k] = (m[k] || 0) + 1; return m; }, {}))
    .map(([key, count]) => ({ key, count })).sort((a, b) => b.count - a.count || a.key.localeCompare(b.key)).slice(0, n);

  function analytics(days) {
    const since = new Date(); since.setUTCHours(0, 0, 0, 0); since.setUTCDate(since.getUTCDate() - (days - 1));
    const ev = db.usage.filter((e) => new Date(e.atUtc) >= since);
    const s = ev.filter((e) => e.type === 'search'), v = ev.filter((e) => e.type === 'view');
    const daily = Array.from({ length: days }, (_, i) => {
      const d = new Date(since); d.setUTCDate(d.getUTCDate() + i);
      const key = d.toISOString().slice(0, 10), day = ev.filter((e) => e.atUtc.slice(0, 10) === key);
      return { date: key, searches: day.filter((e) => e.type === 'search').length, views: day.filter((e) => e.type === 'view').length, users: new Set(day.map((e) => e.userId)).size };
    });
    const users = Object.values(ev.reduce((m, e) => {
      const u = m[e.userId] || (m[e.userId] = { userId: e.userId, userName: e.userName, searches: 0, views: 0, zeroResults: 0, lastSeenUtc: e.atUtc });
      if (e.type === 'search') { u.searches++; if (e.zeroResult) u.zeroResults++; }
      if (e.type === 'view') u.views++;
      if (e.atUtc > u.lastSeenUtc) u.lastSeenUtc = e.atUtc;
      return m;
    }, {})).sort((a, b) => (b.searches + b.views) - (a.searches + a.views));
    return {
      days, sinceUtc: since.toISOString(), searches: s.length, views: v.length, zeroResults: s.filter((e) => e.zeroResult).length, activeUsers: users.length, daily,
      topTerms: top(s.map((e) => e.term), 15), zeroResultTerms: top(s.filter((e) => e.zeroResult).map((e) => e.term), 15),
      topItems: top(v.map((e) => e.itemNo), 15), viewsByRestrictionType: top(v.map((e) => e.restrictionType || 'free'), 10),
      filters: top(ev.filter((e) => e.type === 'filter').map((e) => e.detail), 12), users,
    };
  }

  async function handle(method, path, query, body, user) {
    const isAdmin = user.isAdmin;
    if (path === '/dataset' && method === 'GET') return null; // handled with ETag below
    if (path === '/me') return json({ id: user.id, name: user.name, isAdmin });
    if (path === '/usage' && method === 'POST') {
      const evs = (body?.events || []).slice(0, 200).filter((e) => ['search', 'view', 'filter'].includes(e.type));
      for (const e of evs) db.usage.push({ ...e, term: e.term ? String(e.term).toLowerCase() : null, atUtc: e.atUtc || new Date().toISOString(), userId: user.id, userName: user.name });
      save();
      return json({ recorded: evs.length });
    }
    if (!path.startsWith('/admin')) return json({ error: 'Not found' }, 404);
    if (!isAdmin) return json({ error: 'You do not have permission for this action.' }, 403);
    const now = new Date().toISOString();
    let m;
    if (path === '/admin/dataset') return json(dataset(true));
    if ((m = path.match(/^\/admin\/items\/([^/]+)$/)) && method === 'PUT') {
      const no = decodeURIComponent(m[1]);
      if (!/^[A-Za-z0-9-]{3,40}$/.test(no)) return bad('Item number must be 3 to 40 letters, digits or hyphens.');
      if (!body?.name || body.name.trim().length < 2) return bad('Enter the medicine name (2 to 300 characters).');
      if (body.restrictionId && !db.restrictions.some((r) => r.id === body.restrictionId)) return bad('The selected restriction entry does not exist.');
      if (body.qatariOnly && !body.qatariWording) return bad('Enter the Qatari-only restriction wording, or untick Qatari patients only.');
      const ex = db.items.find((i) => i.itemNo === no);
      const it = { itemNo: no, name: body.name.trim(), uom: String(body.uom || '').toUpperCase(), restrictionId: body.restrictionId || null, qatariOnly: !!body.qatariOnly, qatariWording: body.qatariOnly ? body.qatariWording : null, qatariExceptions: body.qatariOnly ? body.qatariExceptions || null : null, isDeleted: false, source: 'admin', updatedAtUtc: now };
      if (ex) Object.assign(ex, it); else db.items.push(it);
      audit(user, ex ? 'Edited medicine' : 'Added medicine', 'medicine', no, it.name); touch();
      return json(it);
    }
    if ((m = path.match(/^\/admin\/items\/([^/]+)(\/restore)?$/)) && (method === 'DELETE' || method === 'POST')) {
      const it = db.items.find((i) => i.itemNo === decodeURIComponent(m[1]));
      if (!it) return json({ error: 'Medicine not found.' }, 404);
      it.isDeleted = method === 'DELETE'; it.source = 'admin'; it.updatedAtUtc = now;
      audit(user, it.isDeleted ? 'Removed medicine' : 'Restored medicine', 'medicine', it.itemNo, it.name); touch();
      return json(it);
    }
    if ((path === '/admin/restrictions' && method === 'POST') || ((m = path.match(/^\/admin\/restrictions\/([^/]+)$/)) && method === 'PUT')) {
      if (!body?.generic || body.generic.trim().length < 2) return bad('Enter the generic name (2 to 200 characters).');
      if (!body.wording || body.wording.trim().length < 5) return bad('Enter the register wording (at least 5 characters).');
      const id = m ? decodeURIComponent(m[1]) : 'n' + Date.now().toString(36);
      const ex = db.restrictions.find((r) => r.id === id);
      const r = { id, generic: body.generic.trim(), status: body.status || '', wording: body.wording.trim(), type: body.type, conditions: body.conditions || [], specialties: body.specialties || [], approved: body.approved || '', available: body.available || '', isDeleted: false, source: 'admin', updatedAtUtc: now };
      if (ex) Object.assign(ex, r); else db.restrictions.push(r);
      audit(user, ex ? 'Edited restriction' : 'Added restriction', 'restriction', id, r.generic); touch();
      return json(r);
    }
    if ((m = path.match(/^\/admin\/restrictions\/([^/]+)\/links$/)) && method === 'PUT') {
      const id = decodeURIComponent(m[1]), r = db.restrictions.find((x) => x.id === id);
      if (!r) return bad('Restriction entry not found.');
      const want = new Set(body?.itemNos || []);
      let changed = 0;
      for (const it of db.items) {
        const should = want.has(it.itemNo), linked = it.restrictionId === id;
        if (should === linked) continue;
        it.restrictionId = should ? id : null; it.source = 'admin'; it.updatedAtUtc = now; changed++;
        audit(user, should ? 'Linked medicine' : 'Unlinked medicine', 'medicine', it.itemNo, `${it.name} → ${r.generic}`);
      }
      touch();
      return json({ changed });
    }
    if ((m = path.match(/^\/admin\/restrictions\/([^/]+)(\/restore)?$/)) && (method === 'DELETE' || method === 'POST')) {
      const r = db.restrictions.find((x) => x.id === decodeURIComponent(m[1]));
      if (!r) return json({ error: 'Restriction not found.' }, 404);
      r.isDeleted = method === 'DELETE'; r.source = 'admin'; r.updatedAtUtc = now;
      audit(user, r.isDeleted ? 'Removed restriction' : 'Restored restriction', 'restriction', r.id, r.generic); touch();
      return json(r);
    }
    if (path === '/admin/analytics') return json(analytics(Math.min(366, Math.max(1, Number(query.get('days')) || 30))));
    if ((m = path.match(/^\/admin\/analytics\/users\/([^/]+)$/))) {
      const id = decodeURIComponent(m[1]);
      return json(db.usage.filter((e) => e.userId === id).slice().reverse().slice(0, 1000));
    }
    if (path === '/admin/audit') return json(db.audit.slice(0, Number(query.get('take')) || 200));
    if (path === '/admin/export.json') return json(dataset(false));
    if (path === '/admin/export.csv') {
      const R = new Map(db.restrictions.filter((r) => !r.isDeleted).map((r) => [r.id, r]));
      const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
      const lines = ['Item No,Medicine,UOM,Generic (register),Register wording,Qatari only'];
      for (const i of db.items.filter((x) => !x.isDeleted)) { const r = R.get(i.restrictionId); lines.push([i.itemNo, i.name, i.uom, r?.generic, r?.wording, i.qatariOnly ? 'Yes' : 'No'].map(q).join(',')); }
      return new Response('﻿' + lines.join('\r\n'), { headers: { 'Content-Type': 'text/csv' } });
    }
    return json({ error: 'Not found' }, 404);
  }

  window.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === 'string' ? input : input.url, window.location.href);
    const at = url.pathname.indexOf(PREFIX);
    if (at < 0) return realFetch(input, init);
    const path = url.pathname.slice(at + PREFIX.length) || '/';
    const method = (init.method || 'GET').toUpperCase();
    const body = init.body ? JSON.parse(init.body) : null;
    await new Promise((r) => setTimeout(r, 60)); // feel of a network round trip
    if (path === '/dataset') {
      const tag = version();
      const sent = new Headers(init.headers || {}).get('If-None-Match');
      if (sent === tag) return new Response(null, { status: 304, headers: { ETag: tag } });
      return json(dataset(false), 200, { ETag: tag });
    }
    return handle(method, path, url.searchParams, body, getUser());
  };

  return {
    reset() { localStorage.removeItem(KEY); },
  };
}
