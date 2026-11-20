// Reference server for Spectra (Node.js 18+, no dependencies) — shows the contract Hulool must implement.
//   POST /api/spectra/events   usage events (any signed-in user)
//   GET  /api/spectra/content  latest published content pack (any signed-in user)
//   POST /api/spectra/content  publish a new pack — SYSTEM ADMINISTRATORS ONLY (enforced here, server-side)
// Run: SPECTRA_ORIGIN=https://hulool.example node endpoint-receiver.js
// In production, replace tokenRole() with Hulool's real session/role lookup and store in the database.
const http = require("http");
const fs = require("fs");
const ALLOW_ORIGIN = process.env.SPECTRA_ORIGIN || "https://hulool.example";
const PACK_FILE = "spectra-content-pack.json";              // current pack
const HISTORY_DIR = "spectra-content-history";              // every published version is kept (audit / rollback)

// DEMO ONLY: map bearer tokens to roles. Hulool must use its own authenticated session instead.
function tokenRole(req) {
  const t = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
  if (t && t === process.env.SPECTRA_ADMIN_TOKEN) return { role: "sysadmin", user: "demo-admin" };
  if (t && t === process.env.SPECTRA_USER_TOKEN) return { role: "user", user: "demo-user" };
  return null;
}
function readPack() { try { return JSON.parse(fs.readFileSync(PACK_FILE, "utf8")); } catch { return null; } }
function send(res, code, obj) { res.writeHead(code, { "Content-Type": "application/json" }); res.end(obj ? JSON.stringify(obj) : ""); }
function validPack(p) {
  return p && p.format === "spectra-content-pack" && p.schema === 1 && Number.isInteger(p.version) && Array.isArray(p.changes) &&
    p.changes.every((c) => c && typeof c.id === "string" && typeof c.op === "string" && typeof c.reason === "string" && c.reason.trim().length >= 5);
}

http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", ALLOW_ORIGIN);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }

  if (req.url === "/api/spectra/content" && req.method === "GET") {
    const p = readPack(); return p ? send(res, 200, p) : send(res, 404);
  }
  let body = "";
  req.on("data", (c) => { body += c; if (body.length > 5e6) req.destroy(); });
  req.on("end", () => {
    if (req.url === "/api/spectra/content" && req.method === "POST") {
      const who = tokenRole(req);
      if (!who) return send(res, 401, { error: "sign in required" });
      if (who.role !== "sysadmin") return send(res, 403, { error: "system administrators only" });   // ← the real permission gate
      let p; try { p = JSON.parse(body); } catch { return send(res, 400, { error: "invalid JSON" }); }
      if (!validPack(p)) return send(res, 400, { error: "not a valid Spectra content pack" });
      const cur = readPack();
      if ((cur ? cur.version : 0) + 1 !== p.version) return send(res, 409, { error: "version conflict", current: cur ? cur.version : 0 });
      // history is append-only: the new pack must contain every previously published change unchanged
      if (cur) {
        const ids = new Set(p.changes.map((c) => c.id));
        if (!cur.changes.every((c) => ids.has(c.id))) return send(res, 400, { error: "published history may not be removed" });
      }
      p.serverReceived = new Date().toISOString(); p.serverPublishedBy = who.user;
      fs.mkdirSync(HISTORY_DIR, { recursive: true });
      fs.writeFileSync(`${HISTORY_DIR}/v${p.version}.json`, JSON.stringify(p));
      fs.writeFileSync(PACK_FILE, JSON.stringify(p));
      return send(res, 200, { version: p.version });
    }
    if (req.url === "/api/spectra/events" && req.method === "POST") {
      try {
        const { events } = JSON.parse(body);
        if (!Array.isArray(events)) throw new Error();
        const lines = events.filter((e) => e && e.id && e.name && e.ts).map((e) => JSON.stringify(e)).join("\n");
        if (lines) fs.appendFileSync("spectra-events.ndjson", lines + "\n");
        return send(res, 200, { stored: events.length });
      } catch { return send(res, 400); }
    }
    send(res, 404);
  });
}).listen(8787, () => console.log("Spectra reference server on :8787"));
