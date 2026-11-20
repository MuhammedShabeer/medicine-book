import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { datasetCache, local } from '../lib/storage.js';
import { buildEntries } from '../lib/model.js';

/**
 * Resolves the colour scheme: "light", "dark", or "auto" (follows Tailwind's `dark` class on <html> when present,
 * otherwise the operating-system preference). Updates live when either changes.
 */
export function useDarkMode(theme = 'auto') {
  const read = useCallback(() => {
    if (theme === 'dark') return true;
    if (theme === 'light') return false;
    const root = document.documentElement;
    if (root.classList.contains('dark') || root.dataset.theme === 'dark') return true;
    if (root.classList.contains('light') || root.dataset.theme === 'light') return false;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
  }, [theme]);
  const [dark, setDark] = useState(read);
  useEffect(() => {
    setDark(read());
    if (theme !== 'auto') return undefined;
    const mo = new MutationObserver(() => setDark(read()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onMq = () => setDark(read());
    mq?.addEventListener?.('change', onMq);
    return () => { mo.disconnect(); mq?.removeEventListener?.('change', onMq); };
  }, [theme, read]);
  return dark;
}

/**
 * Offline-first dataset: shows the cached copy at once, then revalidates with the server (ETag).
 * status: "loading" | "live" | "offline" | "error"
 */
export function useDataset(api) {
  const cached = useRef(datasetCache.read());
  const [dataset, setDataset] = useState(cached.current?.dataset || null);
  const [status, setStatus] = useState(cached.current ? 'offline' : 'loading');
  const [error, setError] = useState(null);
  const etag = useRef(cached.current?.etag || null);
  const alive = useRef(true);

  const reload = useCallback(async () => {
    try {
      const res = await api.dataset(etag.current);
      if (!alive.current) return;
      if (!res.notModified) {
        etag.current = res.etag;
        setDataset(res.dataset);
        datasetCache.write(res.dataset, res.etag);
      }
      setStatus('live');
      setError(null);
    } catch (e) {
      if (!alive.current) return;
      setError(e);
      setStatus((s) => (s === 'loading' ? 'error' : 'offline'));
    }
  }, [api]);

  useEffect(() => {
    alive.current = true;
    reload();
    const onFocus = () => { if (document.visibilityState === 'visible') reload(); };
    const onOnline = () => reload();
    document.addEventListener('visibilitychange', onFocus);
    window.addEventListener('online', onOnline);
    return () => { alive.current = false; document.removeEventListener('visibilitychange', onFocus); window.removeEventListener('online', onOnline); };
  }, [reload]);

  const entries = useMemo(() => (dataset ? buildEntries(dataset) : []), [dataset]);
  return { dataset, entries, status, error, reload };
}

/** Who is signed in, and whether they may open the admin workspace. */
export function useMe(api) {
  const [me, setMe] = useState(() => local.get('me', null));
  useEffect(() => {
    let on = true;
    api.me().then((m) => { if (on && m) { setMe(m); local.set('me', m); } }).catch(() => { /* offline: keep cached */ });
    return () => { on = false; };
  }, [api]);
  return me;
}

/** Pins and recently viewed entries, kept per device. */
export function usePersistentList(key, max) {
  const [list, setList] = useState(() => local.get(key, []));
  const update = useCallback((fn) => setList((prev) => { const next = fn(prev).slice(0, max); local.set(key, next); return next; }), [key, max]);
  return [list, update];
}

export function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const show = useCallback((text, icon = 'Check') => {
    setToast({ text, icon, id: Date.now() });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2000);
  }, []);
  useEffect(() => () => clearTimeout(timer.current), []);
  return [toast, show];
}

export function useDebounced(value, ms) {
  const [v, setV] = useState(value);
  useEffect(() => { const t = setTimeout(() => setV(value), ms); return () => clearTimeout(t); }, [value, ms]);
  return v;
}
