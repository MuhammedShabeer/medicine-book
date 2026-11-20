# Spectra usage analytics and traceability

Spectra records how the module is used, so that its uptake, the content consulted and gaps in content can be evaluated later and traced to the exact version in use. It observes the interface only and never alters clinical content.

## 1. Delivery: where events go

Every event is written to every available channel at once:

| Channel | When it is used | How Hulool receives it |
|---|---|---|
| **iframe** `postMessage` | Spectra is in an `<iframe>` (Hulool web) | `window.addEventListener("message", e => e.data.source === "spectra" …)` |
| **React Native** | `window.ReactNativeWebView` exists | `<WebView onMessage={e => JSON.parse(e.nativeEvent.data)} …>` |
| **Flutter** | a JavaScript channel named `SpectraChannel`, or `flutter_inappwebview` handler `spectra` | channel callback (`message.message` is JSON) |
| **HTTPS endpoint** | `endpoint` is set in `js/config.js` | `POST` JSON `{module, schema, sent, events:[…]}`, batched, retried with back-off, kept across reloads (outbox capped at 2000 events) |
| **Local log** | `localLog: true` (default) | on-device ring buffer (5000 events), exportable as CSV/JSON; usage panel |

**Recommended for mobile:** forward bridge messages from native code to the Hulool backend using the app's existing authenticated session. On a WebView loaded from local files, a direct `endpoint` POST comes from origin `null`, so the server must allow that origin.

Message envelope (bridges):
```json
{"source":"spectra","type":"event","event":{ … }}
```
Other `type` values are `ready`, `summary`, `events` and `export`.

## 2. Event schema (v1)

```json
{
  "v": 1,
  "id": "uuid",                 // unique event id
  "ts": "2026-11-17T21:04:11.512Z",
  "t": 1794949451512,           // epoch ms
  "sid": "uuid",                // session (new after 30 min of inactivity)
  "seq": 14,                    // order within the session
  "uid": "HGH-PH-0042",         // pseudonymous staff ID from Hulool, or null
  "role": "pharmacist", "site": "HGH",
  "name": "screen_view",
  "props": { … },               // event-specific, see §3
  "ctx": {
    "mv": "1.0.0",              // module version
    "cv": "2026-11-17+40e61c086d9e|pack-v3", // base content (date + SHA-256 prefix of app.js) | published content pack
    "app": "3.1.0",             // Hulool app version (from host)
    "tab": "drug", "group": "bac", "version": "2026", "theme": "light",
    "device": "mobile|tablet|desktop", "os": "iOS|Android|Windows|macOS|…",
    "host": "iframe|react-native|flutter|web", "lang": "en-GB",
    "vw": 390, "vh": 844, "online": true
  }
}
```

## 3. Event dictionary

| Event | Recorded when | Key `props` |
|---|---|---|
| `session_start` | module opens (or returns after 30 min idle) | `resumed`, `screen_w/h`, `dpr`, `touch`, `standalone`, `reduced_motion`, `load_ms`, `dom_ms`, `referrer_host` |
| `screen_view` | the visible screen changes (tab, group, version, organism or drug) | `tab`, `group`, `version`, `item_type` (organism/drug), `item_id`, `item_name`, `via` (default/tap/search), `prev_dwell_ms` (visible time on the previous screen) |
| `group_change` / `version_change` | drug group or chart version switched | `to` |
| `search` | global search settled (1.2 s) with matches | `q`, `qlen`, `n` |
| `search_no_result` | global search settled with no match | `qlen`, `n` (**text not stored**) |
| `search_select` | a search result chosen | `q`, `type`, `id`, `target_group`, `rank`, `n` |
| `drug_filter` / `drug_filter_no_result` | drug-list filter used | as for search |
| `fingerprint_tap` | a fingerprint square opened | `drug`, `org`, `org_name`, `status` (on/lim/off) |
| `link_open` | a reference or external link opened | `host`, `path`, `ref` (reference key) |
| `theme_change` | light/dark switched | `to` |
| `session_pause` | app hidden or closed | `reason`, `active_ms` (visible time this session), `screen_dwell_ms`, `screen` |
| `session_resume` | app visible again (within 30 min) | — |
| `identify` | host set or changed the user | — |
| `js_error` | a JavaScript error (max 20 per session) | `msg`, `file`, `line` |
| `content_loaded` | a published content pack was applied | `source` (bundled/cache/server/host), `pack_id`, `pack_version`, `changes`, `base_match` |
| `admin_granted` / `admin_denied` / `admin_open` | admin access granted, refused or console opened | `role` |
| `admin_draft` | an administrator saved a change to the draft | `op`, `group`, `key` |
| `admin_published` | an administrator published a pack | `version`, `changes`, `where` |

## 4. Privacy and safety by design
- **No patient data.** Spectra has no patient context. Free text that matched no organism or drug may contain a name or MRN typed by mistake, so it is **never stored**: only its length is kept. Set `logUnmatchedQueries: true` only with information-governance approval.
- **Pseudonymous identity only.** `uid` accepts only `[A-Za-z0-9._:@-]`, up to 64 characters. Supply a staff code, not a name or e-mail.
- **No IP address, no fingerprinting, no third parties.** Device class and OS are coarse categories.
- **Origin control.** Set `parentOrigin` so that events are posted only to Hulool and only Hulool can send commands.
- **Off switch.** Use `enabled: false` in `config.js`, `Spectra.analytics.setEnabled(false)` or the `spectra:setEnabled` message.
- **Fail-safe.** If storage is blocked (private mode, locked-down WebView), Spectra keeps events in memory and still delivers them through the bridges. Analytics errors can never affect the clinical display.
- **CSV injection.** Exported cells that begin with `= + - @` are neutralised.

## 5. Host API

JavaScript, within the page or via `runJavaScript`/`injectJavaScript`:
```js
Spectra.analytics.setUser("HGH-PH-0042", {role:"pharmacist", site:"HGH", appVersion:"3.1.0"});
Spectra.analytics.summary();        // aggregated object (see §6)
Spectra.analytics.events();         // all locally stored events
Spectra.analytics.exportCSV();      // string, UTF-8 BOM, one row per event
Spectra.analytics.exportJSON();     // string with summary + events
Spectra.analytics.download("csv");  // file download (also posted to host as type "export")
Spectra.analytics.flush();          // upload the outbox now
Spectra.analytics.clear();          // clear the local log
Spectra.analytics.openPanel();      // on-device usage panel
const off = Spectra.analytics.on(ev => {/* live stream */});
Spectra.analytics.track("custom_event", {any:"props"});
```

iframe messages, sent to the Spectra frame:
```js
frame.contentWindow.postMessage({source:"hulool", type:"spectra:setUser", userId:"HGH-PH-0042", role:"pharmacist", site:"HGH", appVersion:"3.1.0"}, "*");
frame.contentWindow.postMessage({source:"hulool", type:"spectra:getSummary", requestId:"r1"}, "*");   // reply: {source:"spectra", type:"summary", requestId:"r1", summary}
frame.contentWindow.postMessage({source:"hulool", type:"spectra:getEvents",  requestId:"r2"}, "*");   // reply: type "events"
// also: spectra:flush · spectra:clear · spectra:openPanel · spectra:setEnabled {enabled:false}
```

**Usage panel without code:** open `index.html?spectra-admin=1`. The panel shows:
- events, sessions, users and active minutes;
- no-result searches and errors;
- most viewed drugs and organisms;
- views by section and drug group;
- top searches and devices.

It also has CSV/JSON export and a clear button that needs two taps.

## 6. Evaluation recipes

With events loaded into a table (`examples/analytics-schema.sql`):

| Question | Query idea |
|---|---|
| Uptake | distinct `uid` and `sid` per week; sessions per user |
| Engagement | median `active_ms` per session (`session_pause`); median `prev_dwell_ms` per screen |
| What is consulted | `screen_view` by `item_name`, by `group`, by `role` |
| Content gaps | `search_no_result` and `drug_filter_no_result` counts per week (text not stored; the trend shows a gap). If governance allows, `logUnmatchedQueries` reveals the missing terms. |
| Discoverability | `search_select.rank` (1 = top hit); share of `via = 'search'` vs `'tap'` |
| Fingerprint value | `fingerprint_tap` per session; status mix |
| Reliability | `js_error` by `ctx.mv`, `ctx.os`, `ctx.host` |
| Traceability | every event carries `ctx.cv`, so for any period you can state exactly which content version clinicians were viewing |
