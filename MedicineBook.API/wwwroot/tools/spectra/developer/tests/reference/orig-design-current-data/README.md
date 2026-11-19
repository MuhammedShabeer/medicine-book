# Bug–Drug Navigator: app integration pack

An anti-infective coverage reference for Hulool 360. It covers five groups: antibacterial, antifungal, antiviral, TB/mycobacterial and antiparasitic.

Every statement was re-checked on 4 October 2026 against the primary source cited next to it: IDSA, CDC, WHO, ECMM, AASLD-IDSA, DHHS, ATS/ERS/ESCMID/IDSA, FDA labels and AHFS. The checks are recorded in `VERIFICATION-LOG.md`. The original antibacterial chart was adapted from the UBC "Best" Antibiotic Sensitivity Chart (2019).

The tool is plain HTML, CSS and JavaScript. It needs no framework, build step, server code, database, login or internet connection.

## What's in the zip

```
bug-drug-navigator/
├── index.html                ← open this (split version)
├── css/styles.css            ← all styling, light + dark mode
├── js/app.js                 ← all data + logic
├── standalone/
│   └── bug-drug-navigator.html   ← the same tool as ONE file
├── examples/                 ← copy-paste snippets (web, React, React Native, Flutter)
├── VERIFICATION-LOG.md       ← what was checked, corrected and removed
└── README.md
```

**Split or standalone:** both give identical content and behaviour. This was tested, and the rendered content matched exactly.

- Use the **split version** if your app has a strict Content Security Policy (CSP).
- Use the **standalone file** if you just want one file to drop in.

## Option 1: Web app (quickest)

1. Copy the whole `bug-drug-navigator` folder into your app's public or static folder, for example `public/tools/bug-drug-navigator/`. Keep the folder structure; `index.html` loads `css/` and `js/` by relative path.
2. Link to `/tools/bug-drug-navigator/index.html` from your menu, or embed it inside one of your screens:

```html
<iframe src="/tools/bug-drug-navigator/index.html"
        title="Bug–Drug Navigator"
        style="width:100%;height:90vh;border:0"></iframe>
```

## Option 2: React / Next.js / Vue / Angular

Put the folder in `public/` and render it in an iframe (see `examples/react-component.jsx`). Don't paste the HTML into JSX: the iframe keeps the navigator's styles and your app's styles from clashing.

## Option 3: Mobile app (WebView)

Bundle the folder as a local asset and load `index.html` in a WebView. See `examples/flutter_webview.dart` and `examples/react-native-webview.jsx`.

- **JavaScript must be enabled** in the WebView, or the page is blank.
- **Android native:** put the folder at `app/src/main/assets/bug-drug-navigator/` and load `file:///android_asset/bug-drug-navigator/index.html`.
- **iOS native:** add the folder as a *folder reference* (blue folder) and call `loadFileURL(indexURL, allowingReadAccessTo: folderURL)`.
- **Single-file loading:** if your WebView setup can only load one file, use `standalone/bug-drug-navigator.html`.

## Tested before delivery

| Check | Result |
|---|---|
| Loading methods | Split and standalone, each opened as a local file (`file://`) and from a web server, plus the split version inside an iframe and under a strict CSP |
| Coverage | Every pathogen and every drug clicked in all 5 groups, and both antibacterial versions (2026 / 2019) |
| Errors | No JavaScript errors and no CSP violations |
| Content | Identical across all loading methods |
| Screen sizes | No sideways scrolling at 320, 360, 390, 768 or 1280 px |
| Offline | Works with no internet: the font falls back to the system font |
| Security | Search box tested with HTML-injection text — escaped, nothing runs |
| Dark mode | Works automatically |
| Keyboard | Tab navigation works |
| References | All 51 references resolve; no "undefined" text anywhere |
| Browser support | Needs a modern browser or WebView (Chrome/Android WebView 60+, iOS Safari 11.3+). A fallback is included for one newer function. |

## Things to know

| Topic | Detail |
|---|---|
| Strict CSP | The split version works with `script-src 'self'; style-src 'self' 'unsafe-inline'`. `unsafe-inline` is needed for inline `style` attributes. To keep the web font, add `https://fonts.googleapis.com` to `style-src` and `https://fonts.gstatic.com` to `font-src`. |
| Font | Atkinson Hyperlegible from Google Fonts is the only online request. If it's blocked, the system font is used. To remove it, delete the two `fonts.googleapis.com` lines in the `<head>`. |
| Reference links | These open in a new tab (`target="_blank"`). Some WebViews ignore new-tab links unless your app handles them; in Android WebView, set a `WebChromeClient` or open external links in the system browser. |
| Hover notes | Matrix-cell tooltips appear on hover (desktop). On phones the same detail appears when you open the drug or pathogen, and in the **What changed** tab. |
| Dark mode | Follows the system setting. Add `data-theme="light"` (or `"dark"`) to the `<html>` tag to force one. |
| Storage / privacy | Stores nothing and sends no data anywhere. |

## Updating content

All content is in `js/app.js`. In the standalone file it's inside the `<script>` tag.

- **Antibacterial:**
  - `ORG`, `ORG26`: organisms
  - `DRUG`, `NEWDRUGS`: antibiotics
  - `CHANGES`: 2026 corrections
  - `EXTRA`: organisms added in 2026
  - `PN`: pharmacist notes
- **Other groups:** `GROUPS.fun`, `GROUPS.vir`, `GROUPS.myc`, `GROUPS.par`. Each has:
  - `orgs`
  - `drugs`, with coverage written as `P(text,[refs])` for first line, `L(text,[refs])` for limited use, or `A([refs])` for active
  - `pn` (pharmacist notes)
- **References:** `REFS` and `NEWREFS`. Cite a reference by its key, e.g. `["IDSA_CAN"]`.
- **What changed tab:** `KEYPOINTS`.

If you edit the split version, edit `js/app.js`. If you use the standalone file, edit the same data inside its `<script>`. Keep the two in step if you ship both.

## Before go-live (important)

The navigator is a clinical reference and needs governance sign-off.

1. **ID / antimicrobial stewardship review** of each section, using `VERIFICATION-LOG.md`.
2. **Local fit:** much of the guidance is US-based (IDSA, CDC, DHHS). Check it against the HMC antibiogram, formulary and national policy.
3. **Governance:** P&T approval, with the approver, the date and a next review date (suggested every 12 months, or sooner when key guidelines change).
4. **Keep the footer:** it carries the disclaimer and credits the original UBC chart.
