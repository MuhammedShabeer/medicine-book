# Bug–Drug Navigator: app integration pack

An antibiotic coverage reference for Hulool 360. It is built from the UBC "Best" Antibiotic Sensitivity Chart (2019) and updated in September 2026 against accredited references, which are listed inside the tool under the References tab.

It is plain HTML, CSS and JavaScript. It needs no framework, no build step, no server code and no database.

## What's in the zip

```
bug-drug-navigator/
├── index.html            ← page markup (open this)
├── css/styles.css        ← all styling, light + dark mode
├── js/app.js             ← all data + logic (organisms, drugs, notes, references)
├── standalone/
│   └── bug-drug-navigator.html   ← same tool as ONE file (easiest to drop in)
├── examples/             ← copy-paste snippets for common app types
└── README.md
```

Use either the split version (`index.html` + `css/` + `js/`) or the single standalone file. They behave the same. The split version is better if your app has a strict Content Security Policy (CSP) or if you want to edit the data separately.

## Option 1: Web app (quickest)

1. Copy the `bug-drug-navigator` folder into your app's public or static folder, for example `public/tools/bug-drug-navigator/`.
2. Add a menu item that links to `/tools/bug-drug-navigator/index.html`.
3. To show it inside one of your own screens, embed it with an iframe:

```html
<iframe src="/tools/bug-drug-navigator/index.html"
        title="Bug–Drug Navigator"
        style="width:100%;height:90vh;border:0"></iframe>
```

## Option 2: React / Next.js / Vue / Angular

Put the folder in `public/`, then render it through an iframe. The example is `examples/react-component.jsx`. Don't paste the HTML into JSX: the iframe keeps the navigator's styles from clashing with yours.

## Option 3: Mobile app (Flutter, React Native, Android, iOS)

Bundle the folder as a local asset and load `index.html` in a WebView. The examples are `examples/flutter_webview.dart` and `examples/react-native-webview.jsx`.

- **Turn JavaScript on in the WebView.** Without it the page is blank.
- **Android native:** put the folder under `app/src/main/assets/` and load `file:///android_asset/bug-drug-navigator/index.html`.
- **iOS native:** add the folder as a *folder reference* (blue folder) and call `loadFileURL` with read access to that folder.

## Things to know

| Topic | Detail |
|---|---|
| Offline | Works fully offline. The only online call is the Google Font (Atkinson Hyperlegible). If it's blocked, the system font is used automatically. To make it fully self-hosted, delete the two `fonts.googleapis.com` lines in `index.html`. |
| CSP | The split version needs `script-src 'self'` and `style-src 'self' 'unsafe-inline'`, because some elements use inline `style` attributes. Add `https://fonts.googleapis.com` to `style-src` and `https://fonts.gstatic.com` to `font-src` if you keep the font. |
| Dark mode | Follows the phone or system setting automatically. To force light mode, add `data-theme="light"` to the `<html>` tag. |
| Mobile | Responsive down to phone width. Source notes on 2026 badges show on hover on desktop, and each change and its source are also listed in the **What changed** tab, so mobile users can read them there. |
| Storage / login | None. The tool stores nothing and sends no data anywhere. |

## Updating content

All content is in the arrays at the top of `js/app.js`:

- `ORG` and `ORG26`: organisms. `DRUG` and `NEWDRUGS`: antibiotics.
- `CHANGES`: the 2026 corrections, as `[drug, organism, activity, note, referenceKey]`.
- `PN`: pharmacist notes for each drug.
- `REFS`: the reference list. Cite a reference by using its key.

Edit a value, save and reload. No build step is needed.

## Before go-live (important)

This is a clinical reference and needs sign-off before release.

1. **Review by ID and antimicrobial stewardship.** Pay particular attention to the items marked "verify": tigecycline vs *Proteus*, the ceftaroline positioning, the AWaRe labels and entries from secondary sources.
2. **Local fit.** IDSA 2026 guidance is written for US practice. Check the coverage against the current HMC antibiogram and formulary, and mark any non-formulary agents.
3. **Governance.** Record the approver, the approval date and the next review date (suggested: every 12 months, or when IDSA, EUCAST or the local antibiogram updates).
4. **Keep the footer.** It credits the original UBC chart (McCormack, Lalji, Lau) and carries the disclaimer.
