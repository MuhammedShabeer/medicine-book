import { useEffect, useMemo, useRef, useState } from 'react';
import './formulary.css';
import { createApi } from './lib/api.js';
import { createUsageTracker } from './lib/usage.js';
import { useDarkMode, useDataset, useMe } from './ui/hooks.js';
import SearchView from './ui/SearchView.jsx';
import AdminView from './ui/AdminView.jsx';

function readParam(name) {
  try { return new URL(window.location.href).searchParams.get(name) || ''; } catch { return ''; }
}

/**
 * Hulool 360° formulary restriction module.
 *
 * @param {object}   props
 * @param {string}   [props.apiBaseUrl="/api/formulary-restrictions"]  where MapFormularyRestrictions() is served
 * @param {Function} [props.getToken]       returns the signed-in user's JWT (string or Promise); omit when using cookies
 * @param {RequestCredentials} [props.credentials]  e.g. "include" for cookie authentication
 * @param {Record<string,string>} [props.headers]   extra request headers
 * @param {"auto"|"light"|"dark"} [props.theme="auto"]  "auto" follows Tailwind's `dark` class on <html>, then the OS
 * @param {boolean}  [props.showThemeToggle=false]  show a light/dark button (when the host app has no theme control)
 * @param {boolean}  [props.hotkeys=true]   keyboard shortcuts (/, arrows, Enter, Esc, 1–6)
 * @param {boolean}  [props.syncUrl=true]   keep ?q= and ?item= in the address bar so links reopen the same view
 * @param {(event: {module: string, action: string, details: string, data: object, at: string}) => void} [props.onActivity]
 *        Hulool 360° analytics hook. Called for every search, look-up, filter and admin change, so the events appear in
 *        Hulool's User Analytics activity log. Example action/details: "Restrictions search" / "“linezolid” — 2 results".
 * @param {boolean}  [props.moduleAnalytics]  keep the module's own usage log and Analytics tab as well.
 *        Default: false when onActivity is given (Hulool analytics only), true otherwise.
 * @param {boolean}  [props.trackUsage=true]  set false to record nothing at all
 * @param {"search"|"admin"} [props.initialView="search"]
 * @param {string}   [props.title="Hulool 360°"]   app name shown under the module name
 * @param {string}   [props.moduleName="Restrictions"]  module heading
 */
export default function FormularyRestrictions({
  apiBaseUrl = '/api/formulary-restrictions', getToken, credentials, headers,
  theme = 'auto', showThemeToggle = false, hotkeys = true, syncUrl = true, trackUsage = true,
  initialView = 'search', title = 'Hulool 360°', moduleName = 'Restrictions', onActivity, moduleAnalytics,
}) {
  // Keep the latest token getter without rebuilding the client on every render.
  const tokenRef = useRef(getToken);
  tokenRef.current = getToken;
  const headersKey = JSON.stringify(headers || {});
  const api = useMemo(
    () => createApi({ baseUrl: apiBaseUrl, credentials, headers: JSON.parse(headersKey), getToken: tokenRef.current ? () => tokenRef.current() : undefined }),
    [apiBaseUrl, credentials, headersKey],
  );

  // Hulool analytics callback: keep the latest without rebuilding the tracker on every render.
  const activityRef = useRef(onActivity);
  activityRef.current = onActivity;
  const hasHost = typeof onActivity === 'function';
  const ownAnalytics = moduleAnalytics ?? !hasHost;
  const tracker = useMemo(() => createUsageTracker(api, {
    sendToModule: trackUsage && ownAnalytics,
    onActivity: trackUsage && hasHost ? (e) => activityRef.current?.(e) : undefined,
    moduleName,
  }), [api, trackUsage, ownAnalytics, hasHost, moduleName]);
  useEffect(() => { tracker.start(); return () => { tracker.flush(true); tracker.stop(); }; }, [tracker]);

  const [themeOverride, setThemeOverride] = useState(null);
  const dark = useDarkMode(themeOverride || theme);
  const { dataset, entries, status, reload } = useDataset(api);
  const me = useMe(api);
  const [view, setView] = useState(initialView === 'admin' || readParam('view') === 'admin' ? 'admin' : 'search');
  const initial = useRef({ q: readParam('q'), item: readParam('item') });

  const counts = useMemo(() => {
    const items = dataset?.items?.filter((i) => !i.isDeleted) || [];
    return {
      items: items.length,
      restrictions: dataset?.restrictions?.filter((r) => !r.isDeleted).length || 0,
      qatari: items.filter((i) => i.qatariOnly).length,
    };
  }, [dataset]);

  const isAdmin = !!me?.isAdmin;
  const showAdmin = view === 'admin' && isAdmin;

  return (
    <div className={'hfr' + (dark ? ' hfr-dark' : '')} data-view={showAdmin ? 'admin' : 'search'}>
      {showAdmin
        ? <AdminView api={api} dark={dark} title={moduleName} onBack={() => setView('search')} onDataChanged={reload} showAnalytics={ownAnalytics} tracker={tracker} />
        : <SearchView entries={entries} status={status} counts={counts} me={me} dark={dark} tracker={tracker}
            hotkeys={hotkeys} syncUrl={syncUrl} initialQuery={initial.current.q} initialItem={initial.current.item} title={title} moduleName={moduleName}
            onOpenAdmin={() => setView('admin')} showThemeToggle={showThemeToggle}
            onThemeToggle={() => setThemeOverride(dark ? 'light' : 'dark')} />}
    </div>
  );
}
