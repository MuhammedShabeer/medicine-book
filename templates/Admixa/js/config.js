/* Admixa settings - edit this file only. */
window.ADMIXA_CONFIG = {
  /* 'memory' (default) = never changes the address bar - REQUIRED when Admixa runs inside Hulool360.
     'hash' = standalone with shareable links (index.html#vancomycin-500-mg). */
  routing: 'memory',

  /* 'local'  = data saved in this browser only (testing / one shared device)
     'remote' = data saved through your Hulool360 server (fill in "remote" below) */
  storage: 'local',

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
  }
};
