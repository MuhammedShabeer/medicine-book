/* Spectra — host configuration (edit this file when integrating into Hulool 360°).
   Loaded before every other script. All keys are optional. */
window.SPECTRA_CONFIG = window.SPECTRA_CONFIG || {
  content: {
    url: null,                // GET: published content pack from the Hulool server, e.g. "/api/spectra/content" (newest wins)
    saveUrl: null             // POST: publish a new pack. The SERVER must accept it only from a system-administrator session.
  },
  admin: {
    roles: ["sysadmin", "Admin", "admin"]       // roles the Hulool host may grant to open the content editor (users never can)
  },
  analytics: {
    enabled: true,            // false = no events are recorded or sent
    endpoint: null,           // e.g. "https://hulool.example/api/spectra/events" (POST, JSON array). Add it to connect-src in a CSP.
    authHeader: null,         // optional, e.g. "Bearer <token>" — only used for endpoint POSTs (not for sendBeacon)
    batchSize: 20,            // events per POST
    flushIntervalMs: 15000,   // periodic upload while the page is open
    parentOrigin: "*",        // iframe: origin of the Hulool page allowed to receive / send messages, e.g. "https://hulool.example"
    localLog: true,           // keep a local, exportable copy of events on this device
    localLogMax: 5000,        // ring-buffer size
    logUnmatchedQueries: false, // free text that matched nothing is NOT stored (may contain patient identifiers); only its length is
    userId: null,             // pseudonymous staff ID supplied by Hulool (never a name, MRN or e-mail)
    role: null,               // e.g. "pharmacist", "physician", "nurse"
    site: null,               // e.g. "HGH"
    appVersion: null          // Hulool 360° app version, for traceability
  }
};
