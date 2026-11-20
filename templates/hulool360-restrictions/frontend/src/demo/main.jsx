// Demo shell: stands in for Hulool 360° so the module can be tried with the sample backend.
// The sample backend signs users in from X-Dev-User / X-Dev-Roles headers (development only).
import { StrictMode, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { FormularyRestrictions } from '../modules/formulary-restrictions';

const USERS = { pharmacist: { 'X-Dev-User': 'Pharmacist A' }, admin: { 'X-Dev-User': 'Admin B', 'X-Dev-Roles': 'Admin' } };

function Demo() {
  const [who, setWho] = useState(() => new URLSearchParams(location.search).get('as') || 'pharmacist');
  return (
    <>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 12px', fontSize: 12, background: '#111', color: '#ddd' }}>
        Demo sign-in:
        <select value={who} onChange={(e) => setWho(e.target.value)} aria-label="Demo user">
          <option value="pharmacist">Pharmacist (search only)</option>
          <option value="admin">Admin</option>
        </select>
      </div>
      <FormularyRestrictions key={who} headers={USERS[who]} showThemeToggle />
    </>
  );
}

createRoot(document.getElementById('root')).render(<StrictMode><Demo /></StrictMode>);
