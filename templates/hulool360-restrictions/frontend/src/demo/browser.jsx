// Click-through demo that runs entirely in the browser (no server needed).
// The real module from src/modules is used unchanged; only the backend and Hulool's analytics screen are simulated.
import { StrictMode, useCallback, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FormularyRestrictions } from '../modules/formulary-restrictions';
import { installMockServer } from './mockServer.js';

const USERS = {
  pharmacist: { id: 'pharm-a', name: 'Pharmacist A', isAdmin: false },
  admin: { id: 'admin-b', name: 'Admin B', isAdmin: true },
};
const LOG_KEY = 'h360.demo.activity';
let current = 'pharmacist';
try { current = localStorage.getItem('h360.demo.user') || 'pharmacist'; } catch { /* storage blocked */ }
const readLog = () => { try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); } catch { return []; } };

/** Stand-in for Hulool 360°'s existing User Analytics activity log (User · Action · Details · Time). */
function HuloolActivityLog({ rows, onClose }) {
  const th = { textAlign: 'left', padding: '8px 10px', fontSize: 12, color: '#6b6585', borderBottom: '1px solid #e6e3ef', position: 'sticky', top: 0, background: '#fff' };
  const td = { padding: '8px 10px', fontSize: 13, borderBottom: '1px solid #f0eef5', verticalAlign: 'top' };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,10,30,.45)', zIndex: 2147483600, display: 'flex', justifyContent: 'flex-end' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 'min(760px, 100%)', height: '100%', background: '#fff', color: '#1a1530', display: 'flex', flexDirection: 'column', fontFamily: 'system-ui' }}>
        <div style={{ padding: '16px 18px', borderBottom: '1px solid #e6e3ef', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div><div style={{ fontWeight: 750, fontSize: 18 }}>Hulool 360° · User Analytics</div><div style={{ fontSize: 12.5, color: '#6b6585' }}>Simulated activity log. In Hulool these rows go to your existing Analytics section.</div></div>
          <button onClick={onClose} style={{ marginLeft: 'auto', border: '1px solid #ddd', background: '#fff', borderRadius: 8, padding: '6px 10px', cursor: 'pointer' }}>Close</button>
        </div>
        <div style={{ overflow: 'auto', flex: 1 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr><th style={th}>User</th><th style={th}>Action</th><th style={th}>Details</th><th style={th}>Time</th></tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td style={td} colSpan={4}>No activity yet. Search for a drug or make an admin change.</td></tr>}
              {rows.map((r, i) => (
                <tr key={i}><td style={td}>{r.user}</td><td style={{ ...td, fontWeight: 600 }}>{r.action}</td><td style={td}>{r.details}</td><td style={{ ...td, whiteSpace: 'nowrap', color: '#6b6585' }}>{new Date(r.at).toLocaleTimeString()}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Demo({ server }) {
  const [who, setWho] = useState(current);
  const [log, setLog] = useState(readLog);
  const [open, setOpen] = useState(false);
  const switchUser = (v) => { current = v; try { localStorage.setItem('h360.demo.user', v); } catch { /* ignore */ } setWho(v); };

  // This is the integration point: Hulool passes its own analytics logger here.
  const onActivity = useCallback((e) => {
    setLog((prev) => {
      const next = [{ user: USERS[current].name, action: e.action, details: e.details, at: e.at }, ...prev].slice(0, 300);
      try { localStorage.setItem(LOG_KEY, JSON.stringify(next)); } catch { /* ignore */ }
      return next;
    });
  }, []);

  const btn = { fontSize: 12, borderRadius: 6, padding: '3px 9px', border: '1px solid #4a4466', background: 'transparent', color: '#cfc9e3', cursor: 'pointer' };
  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', padding: '7px 14px', fontSize: 12.5, background: '#14101f', color: '#cfc9e3' }}>
        <b style={{ color: '#fff' }}>Demo</b>
        <span>Signed in as</span>
        <select value={who} onChange={(e) => switchUser(e.target.value)} aria-label="Demo user" style={{ fontSize: 12.5, borderRadius: 6, padding: '2px 6px' }}>
          <option value="pharmacist">Pharmacist (search only)</option>
          <option value="admin">Admin (can edit data)</option>
        </select>
        <button style={{ ...btn, background: '#8A1538', borderColor: '#8A1538', color: '#fff' }} onClick={() => setOpen(true)} aria-label="Open Hulool User Analytics">
          Hulool User Analytics ({log.length})
        </button>
        <span style={{ opacity: .75 }}>Runs in this browser with a simulated server.</span>
        <button style={{ ...btn, marginLeft: 'auto' }} onClick={() => { server.reset(); localStorage.clear(); location.reload(); }}>Reset demo data</button>
      </div>
      <FormularyRestrictions key={who} showThemeToggle syncUrl={false} onActivity={onActivity} />
      {open && <HuloolActivityLog rows={log} onClose={() => setOpen(false)} />}
    </>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<div style={{ padding: 40, fontFamily: 'system-ui' }}>Loading the formulary…</div>);
installMockServer('formulary-seed.json', () => USERS[current]).then((server) => {
  root.render(<StrictMode><Demo server={server} /></StrictMode>);
});
