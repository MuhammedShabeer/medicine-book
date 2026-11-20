// Small, failure-tolerant wrappers around localStorage (it can be full, disabled or blocked).

const PREFIX = 'h360.fr.';

export const local = {
  get(key, fallback) {
    try { const v = localStorage.getItem(PREFIX + key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); return true; } catch { return false; }
  },
  remove(key) {
    try { localStorage.removeItem(PREFIX + key); } catch { /* ignore */ }
  },
};

/** Caches the last dataset (it is the same for every user) so the module opens instantly and works offline. */
export const datasetCache = {
  read() { return local.get('dataset', null); },
  write(dataset, etag) { if (!local.set('dataset', { dataset, etag, savedAt: Date.now() })) local.remove('dataset'); },
};
