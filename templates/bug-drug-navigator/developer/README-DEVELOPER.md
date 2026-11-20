# Spectra: developer kit (source, build and tests)

The module in the parent folder is ready to integrate as delivered. This folder lets your developers rebuild it and re-run every test.

```
developer/
├── src/                 ← source of truth
│   ├── app.js           ← verified clinical data + rendering
│   ├── viz.js · ui.js · admin.js · analytics.js
│   ├── styles.css · body.html (page shell)
│   └── config.js · content-pack.js
├── build.py             ← writes spectra/build/ (index.html, index-csp.html, standalone/spectra.html, css/, js/);
│                          stamps the content version (date + SHA-256 of app.js)
└── tests/
    ├── qa.js            ← content parity: 283 screens × 6 loading methods (must print "ALL CHECKS PASSED")
    ├── qa2.js           ← 9 devices, fingerprint, analytics, endpoint, blocked storage, data integrity
    ├── qa3.js           ← content administration: permissions, edit/publish/undo, server refusal
    ├── audit.js         ← keyed comparison of verified 4 Oct 2026 content vs current content
    ├── parity.js · host.html · ep.js (QA server: events + content packs, sysadmin token "admintok")
    └── reference/       ← verified 4 Oct 2026 build, and the original design running current data
```

## Build
```bash
cd developer && python3 build.py          # output in ../build/ — copy its files over the module files
```

## Test (Node 18+, Playwright with Chromium)
```bash
cd developer/tests
rm -rf site && cp -r ../../build site      # or copy the module folder in as "site"
python3 -m http.server 8768 &              # static server for the http tests
node ep.js &                               # QA server on :8769 (restart it before each qa2/qa3 run)
node qa.js && node qa2.js && node qa3.js
node audit.js                              # lists exactly which screens differ from 4 Oct 2026
```

## Rules for changes
- Change clinical content through the **admin console** (`ADMIN.md`). Do not edit `app.js` by hand unless you are making a governed release.
- If you do edit `app.js`, copy it to `tests/reference/orig-design-current-data/js/app.js`, re-run all suites, and record the change and its source in `VERIFICATION-LOG.md`.
