// Usage tracking.
//
// Two destinations, usable together or alone:
//  1. Hulool 360° analytics (recommended): every event is handed to the host app's `onActivity` callback,
//     so it lands in Hulool's existing User Analytics activity log (User · Action · Details · Time).
//  2. The module's own usage log (optional): events are queued locally (nothing lost offline) and sent in
//     batches to POST /usage, which also feeds the server-side IFormularyActivitySink bridge.
import { local } from './storage.js';
import { CATS, FLAGS, FORMS } from './model.js';

const KEY = 'usageQueue';
const MAX_QUEUE = 500;

function describeFilter(key) {
  const [t, v] = String(key).split(':');
  if (t === 'type') return 'Type: ' + (CATS[v]?.label || v);
  if (t === 'form') return 'Dosage form: ' + (FORMS[v]?.label || v);
  if (t === 'condition') return 'Condition: ' + (FLAGS[v]?.label || v);
  return 'Specialty: ' + v;
}

/**
 * @param {object} api                      module API client
 * @param {object} opts
 * @param {boolean} [opts.sendToModule]     also POST events to the module's own usage endpoint
 * @param {(event: object) => void} [opts.onActivity]  host analytics callback (Hulool 360°)
 * @param {string}  [opts.moduleName]       e.g. "Restrictions"; prefixes every Action
 */
export function createUsageTracker(api, { sendToModule = true, onActivity, moduleName = 'Restrictions', intervalMs = 15000 } = {}) {
  let sending = false;
  let timer = null;

  const queue = () => local.get(KEY, []);
  const save = (q) => local.set(KEY, q.slice(-MAX_QUEUE));

  /** Hands one event to Hulool. A failure in the host callback must never break the module. */
  function toHost(action, details, data) {
    if (typeof onActivity !== 'function') return;
    try {
      onActivity({ module: moduleName, action: `${moduleName} ${action}`, details, data, at: new Date().toISOString() });
    } catch (e) {
      if (typeof console !== 'undefined') console.warn('[Restrictions] onActivity callback failed:', e);
    }
  }

  function toModule(event) {
    if (!sendToModule) return;
    const q = queue();
    q.push({ ...event, atUtc: new Date().toISOString() });
    save(q);
  }

  async function flush(keepalive = false) {
    if (!sendToModule || sending || (typeof navigator !== 'undefined' && navigator.onLine === false)) return;
    const q = queue();
    if (!q.length) return;
    sending = true;
    const batch = q.slice(0, 200);
    try {
      await api.usage(batch, keepalive);
      save(queue().slice(batch.length));
    } catch (e) {
      // 400/401/403 will not succeed on retry: drop the batch so the queue cannot grow forever.
      if (e && (e.status === 400 || e.status === 401 || e.status === 403)) save(queue().slice(batch.length));
    } finally {
      sending = false;
    }
  }

  function onVisibility() { if (document.visibilityState === 'hidden') flush(true); }
  function onOnline() { flush(); }

  function start() {
    if (!sendToModule || timer) return;
    timer = setInterval(() => flush(), intervalMs);
    document.addEventListener('visibilitychange', onVisibility);
    window.addEventListener('online', onOnline);
    flush();
  }
  function stop() {
    if (timer) clearInterval(timer);
    timer = null;
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('online', onOnline);
  }

  return {
    start, stop, flush,
    /** A settled search. */
    search(term, resultCount) {
      const zero = resultCount === 0;
      toModule({ type: 'search', term, zeroResult: zero });
      toHost('search', `“${term}” — ${zero ? 'no result' : `${resultCount} result${resultCount === 1 ? '' : 's'}`}`,
        { type: 'search', term, resultCount, zeroResult: zero });
    },
    /** A drug's details opened. */
    view(entry) {
      toModule({ type: 'view', itemNo: entry.no || null, restrictionType: entry.cat, term: null, zeroResult: false });
      toHost('look-up', `${entry.name}${entry.no ? ` (#${entry.no})` : ''} — ${CATS[entry.cat]?.label || ''}`,
        { type: 'view', itemNo: entry.no || null, name: entry.name, restrictionType: entry.cat });
    },
    /** A filter switched on. */
    filter(key) {
      toModule({ type: 'filter', detail: key, zeroResult: false });
      toHost('filter', describeFilter(key), { type: 'filter', key });
    },
    /** An admin change (add, edit, remove, restore, link). Host analytics only; the module keeps its own change log. */
    admin(text, data) {
      toHost('admin', text, { type: 'admin', ...data });
    },
  };
}
