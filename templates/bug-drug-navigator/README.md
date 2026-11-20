# Spectra — Hulool 360° bug–drug spectrum navigator

**Integration pack · module 1.1 · content verified 4 October 2026, updated 17 November 2026, all 608 statements re-audited 18 November 2026**

Spectra is an anti-infective coverage reference for Hulool 360°. It covers five groups: antibacterial, antifungal, antiviral, TB/mycobacterial and antiparasitic. For each organism group it shows which drugs are active, and for each drug it shows which organisms it covers. Every statement is cited to a primary source: IDSA, CDC, WHO, ECMM, AASLD-IDSA, DHHS, ATS/ERS/ESCMID/IDSA, FDA prescribing information or AHFS. The checks are recorded in `VERIFICATION-LOG.md`. The original antibacterial chart was adapted from the UBC "Best" Antibiotic Sensitivity Chart (2019).

The module is plain HTML, CSS and JavaScript. It needs no framework, build step, server, database, login or internet connection. A usage endpoint is optional.

## What's new in Spectra 1.0

| Area | Change |
|---|---|
| **Clinical content** (audit 17 Nov 2026) | Gonorrhoea: oral **zoliflodacin** and **gepotidacin** (FDA, December 2025) added for uncomplicated urogenital infection only; ceftriaxone remains first line (CDC). **Pritelivir** (FDA, 9 October 2026) added for refractory mucocutaneous HSV in immunocompromised adults. **Bepirovirsen** (FDA, 20 October 2026) added as a 24-week add-on for chronic hepatitis B. 4 references added (63 in total). See `VERIFICATION-LOG.md`. |
| **Spectrum fingerprint** | Each square on the drug page is a button. Tap or hover to see the organism, its family, the status (active / conditional / not covered) and the exact condition, then **Show on this page** jumps to that organism's card. A legend sits under the fingerprint and above the drug list. It works with arrow keys, Enter and Esc, and has 24 px touch targets. |
| **Usage analytics** (`js/analytics.js`) | Screens, organisms, drugs, searches, fingerprint taps, links and errors are recorded as structured events. Each event carries a session, an optional pseudonymous user, the device and the module and content version. Events go to Hulool by iframe `postMessage`, the React Native WebView, a Flutter channel and/or an HTTPS endpoint. An exportable log (CSV/JSON) and an on-device usage panel are included. See **`ANALYTICS.md`**. |
| **Content administration** (`js/admin.js`) | **System administrators only** can add, edit and remove drugs, organisms, coverage, pharmacist notes and references without coding. Every change has an author, time and reason in an append-only, versioned content pack with undo. Changes go live for all users when published. The Hulool server must enforce the sysadmin role. Ordinary users cannot edit. See **`ADMIN.md`**. |
| **Device fixes** | No sideways scroll on 320 px phones or 280 px folded foldables. Search fields are 16 px on phones, so iOS does not zoom on focus. No sticky hover effects on touch screens. Scrolling respects the system "reduce motion" setting. |
| **Brand** | Renamed "Spectra" with the Hulool 360° design, icons, coverage rings, class badges and light/dark themes. |

## What's in the zip

```
spectra/
├── index.html              ← open this (split version)
├── index-csp.html          ← split version with a strict Content-Security-Policy meta tag
├── standalone/spectra.html ← everything in ONE file (identical behaviour)
├── css/styles.css          ← Hulool 360° design, light + dark
├── js/config.js            ← ★ the only file you edit: content server, admin roles, analytics, origin
├── js/content-pack.js      ← published local content updates (replaced by the admin console's download; null = base only)
├── js/app.js               ← clinical data + rendering (verified content)
├── js/viz.js               ← icons, coverage ring, interactive fingerprint, legend
├── js/ui.js                ← global search, theme, navigation, keyboard
├── js/admin.js             ← content administration (sysadmin only): editor, drafts, publish, audit, undo
├── js/analytics.js         ← usage analytics + traceability layer
├── icons/                  ← Spectra app icon: SVG master, PNG 1024/512/192/180/64/32, maskable 512 (Android adaptive)
├── examples/               ← web iframe, React, React Native, Flutter, reference server (events + content), SQL schema
├── ADMIN.md                ← content administration: permissions, workflow, server contract
├── ANALYTICS.md            ← event dictionary, data contract, privacy, evaluation recipes
├── QA-REPORT.md            ← what was tested and the results
├── VERIFICATION-LOG.md     ← clinical verification (4 Oct 2026 + 17 Nov 2026 audit)
└── README.md
```

## Integrate

### Web app (Hulool web)
1. Copy the `spectra` folder to your static folder, e.g. `public/tools/spectra/`. Keep the folder structure.
2. Embed it in an iframe. Pass the pseudonymous staff ID in the URL, or by message (see `examples/iframe.html`):
```html
<iframe id="spectra" src="/tools/spectra/index.html?uid=HGH-PH-0042&role=pharmacist&site=HGH&app=3.1.0"
        title="Spectra" style="width:100%;height:90vh;border:0"></iframe>
```
3. In `js/config.js`, set `parentOrigin` to your Hulool origin (e.g. `"https://hulool.hmc.org.qa"`), so events are posted only to Hulool and only Hulool can send commands.

React, Next.js, Vue and Angular use the same iframe (`examples/react-component.jsx`). Do not paste the HTML into JSX.

### Mobile app (WebView)
Bundle the folder as a local asset and load `index.html`. Events arrive in your native code automatically:
- **React Native:** `onMessage` (`examples/react-native-webview.jsx`).
- **Flutter:** a `SpectraChannel` JavaScript channel (`examples/flutter_webview.dart`).

Forward them to the Hulool backend with the app's own authentication (recommended), or set `endpoint` in `config.js`. JavaScript must be enabled. If the WebView can only load one file, use `standalone/spectra.html`.

### Content administration
Set `content.url` and `content.saveUrl` in `config.js` to your Hulool endpoints. After Hulool's own login confirms a system administrator, grant the role with `Spectra.admin.grant({role:"sysadmin", user, token})`, or with the iframe message `spectra:grantAdmin`. The **server must accept publishes only from sysadmin sessions** (`examples/endpoint-receiver.js` shows the contract). Details are in `ADMIN.md`.

### Controlling it from Hulool
`window.Spectra.analytics` (WebView `evaluateJavascript`/`runJavaScript`) or iframe messages `{source:"hulool", type:"spectra:…"}` provide these actions:
- `setUser`
- `getEvents`
- `getSummary`
- `flush`
- `clear`
- `openPanel`
- `setEnabled`

Full contract: `ANALYTICS.md`.

## Content Security Policy
`index-csp.html` works under `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'`. `'unsafe-inline'` is needed only for style attributes; no inline script is used.
- **Endpoints:** if you use `analytics.endpoint`, `content.url` or `content.saveUrl` on another origin, add it to `connect-src`.
- **Font:** to keep the Manrope font, allow `https://fonts.googleapis.com` (`style-src`) and `https://fonts.gstatic.com` (`font-src`). If the font is blocked or the device is offline, the system font is used.

## Updating clinical content
**Day-to-day updates:** use the in-app **content administration** (system administrators, no coding — `ADMIN.md`).

**Release-level changes:** the verified base content lives in `js/app.js`. In the standalone file it is inside the second `<script>`.
- **Antibacterial:**
  - organisms: `ORG`, `ORG26`
  - drugs: `DRUG`, `NEWDRUGS`
  - 2026 corrections: `CHANGES`
  - organisms added in 2026: `EXTRA`
  - pharmacist notes: `PN`
- **Other groups:** `GROUPS.fun`, `.vir`, `.myc` and `.par`, each with `orgs`, `drugs` and `pn`. Coverage is written as `P(text,[refs])` (first line), `L(text,[refs])` (limited or conditional) or `A([refs])` (active).
- **References:** `REFS` and `NEWREFS`.
- **What changed tab:** `KEYPOINTS`.

Every analytics event records `content_version` (the date plus a hash of `app.js`). After any data edit, usage can therefore be traced to the exact content the user saw. The build stamps it automatically; if you edit by hand, update `CV` at the top of `analytics.js`.

## Before go-live (governance)
1. **ID / antimicrobial stewardship review** of each section, using `VERIFICATION-LOG.md`.
2. **Local fit:** much of the guidance is US-based (IDSA, CDC, DHHS). Check it against the HMC antibiogram, the formulary and national policy. New agents (zoliflodacin, gepotidacin for gonorrhoea, pritelivir, bepirovirsen) appear because they are FDA-approved. Their listing does not imply local availability or formulary status.
3. **Content governance:** decide who holds the Hulool *system administrator* role for Spectra. Require the P&T/stewardship approval reference in the reason of each change, and confirm that the publish endpoint enforces the role server-side.
4. **Analytics governance:** confirm with HMC information governance that pseudonymous staff IDs and usage events may be collected, and set the retention period. Spectra never records patient identifiers. Free text that matches nothing is not stored (see `ANALYTICS.md`).
5. **P&T approval**, with the approver, the date and a next review date (suggested every 12 months, or sooner when key guidelines change).
6. **Keep the footer:** it carries the disclaimer and the UBC credit.


## App icon
`icons/` holds the Spectra icon. It shows a coverage ring in Spectra's four organism-family colours (violet Gram-positive, pink Gram-negative, amber anaerobes, teal atypicals) around a capsule, on the Hulool blue.
- **Use in Hulool:** use `spectra-512.png` (or the SVG) for the module tile, `spectra-180.png` for iOS, and `spectra-maskable-512.png` for Android adaptive icons.
- **Already built in:** the icon is embedded in every version of the page as the browser-tab icon and home-screen icon, and appears next to the title.
- **Web app manifest snippet:**
```json
{ "name": "Spectra", "short_name": "Spectra", "theme_color": "#0e4c92", "background_color": "#eef3f9",
  "icons": [ { "src": "icons/spectra-192.png", "sizes": "192x192", "type": "image/png" },
             { "src": "icons/spectra-512.png", "sizes": "512x512", "type": "image/png" },
             { "src": "icons/spectra-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" } ] }
```
