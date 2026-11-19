/* Admixa settings - edit this file only. */
window.ADMIXA_CONFIG = {
  /* 'memory' (default) = never changes the address bar - REQUIRED when Admixa runs inside Hulool360.
     'hash' = standalone with shareable links (index.html#vancomycin-500-mg). */
  routing: 'hash',

  /* 'local'  = data saved in this browser only (testing / one shared device)
     'remote' = data saved through your Hulool360 server (fill in "remote" below) */
  storage: 'remote',

  /* Roles that may edit. Everyone else is read-only. */
  adminRoles: ['admin', 'Admin'],

  /* Stand-alone admin password, stored as a SHA-256 hash.
     Default password: Admixa@HGH2026 */
  adminPasswordSha256: 'f9e4cd88b9f4c1c961f2c3b1e0108a989311e260b8b55163d501a2e632fea32a',

  /* Hulool360 login: return the logged-in user from localStorage.
     When this is set, Hulool360 roles decide edit rights seamlessly. */
  getCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      const roles = JSON.parse(localStorage.getItem('roles') || '[]');
      const fullName = localStorage.getItem('fullName') || 'User';
      const isAdmin = roles.includes('Admin');
      return { id: fullName, name: fullName, role: isAdmin ? 'admin' : 'staff' };
    } catch(e) {
      return null;
    }
  },

  /* Remote API integration for central persistence across devices */
  remote: {
    pollSeconds: 45,
    list: async (coll) => {
      if (coll === 'drugs') {
        try {
          const res = await fetch('/api/admixa/drugs');
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data) && data.length > 0) return data;
          }
        } catch (e) {
          console.warn('Could not fetch remote drugs:', e);
        }
        return window.ADMIXA_DATA || [];
      }
      return [];
    },
    save: async (path, data, mode) => {
      try {
        let list = [];
        try {
          const res = await fetch('/api/admixa/drugs');
          if (res.ok) {
            const d = await res.json();
            if (Array.isArray(d)) list = d;
          }
        } catch {}
        if (!list.length && window.ADMIXA_DATA) list = [...window.ADMIXA_DATA];

        const parts = path.split('/');
        const id = parts[1];
        const idx = list.findIndex(x => x.id === id);
        if (idx > -1) {
          list[idx] = Object.assign({}, list[idx], data);
        } else {
          list.unshift(Object.assign({ id }, data));
        }

        const token = localStorage.getItem('token');
        await fetch('/api/admixa/drugs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': 'Bearer ' + token } : {})
          },
          body: JSON.stringify(list)
        });
        return true;
      } catch (e) {
        console.error('Remote save error:', e);
        throw e;
      }
    },
    remove: async (path) => {
      try {
        let list = [];
        try {
          const res = await fetch('/api/admixa/drugs');
          if (res.ok) {
            const d = await res.json();
            if (Array.isArray(d)) list = d;
          }
        } catch {}

        const parts = path.split('/');
        const id = parts[1];
        list = list.filter(x => x.id !== id);

        const token = localStorage.getItem('token');
        await fetch('/api/admixa/drugs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': 'Bearer ' + token } : {})
          },
          body: JSON.stringify(list)
        });
        return true;
      } catch (e) {
        console.error('Remote remove error:', e);
        throw e;
      }
    },
    uploadPhoto: async (blob) => {
      const token = localStorage.getItem('token');
      const fd = new FormData();
      fd.append('file', blob, 'label_' + Date.now() + '.jpg');
      const r = await fetch('/api/admixa/upload-photo', {
        method: 'POST',
        headers: token ? { 'Authorization': 'Bearer ' + token } : {},
        body: fd
      });
      if (!r.ok) {
        const err = await r.text();
        throw new Error(err || 'Failed to upload photo');
      }
      return await r.json();
    }
  }
};
