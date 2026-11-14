ADMIXA - IV & injectable preparation guide  (sealed web component build)
=======================================================================

FILES
  admixa.js                     The whole app: code, styles, icons and 66 medicines (one file)
  js/config.js                  YOUR SETTINGS: admin password, Hulool360 login, storage, routing
  index.html                    Stand-alone page (open it directly to use Admixa on its own)
  data/medicines.json           The medicines as plain JSON (for importing into a database)
  tools/make-password-hash.html Make a new admin password hash

ADD TO HULOOL360 (3 lines - do not copy code out of admixa.js)
  1. Copy admixa.js and js/config.js to Hulool360's public/static folder.
  2. Load them ONCE, config first (e.g. in index.html <head> or the app shell):
        <script src="/admixa/js/config.js"></script>
        <script src="/admixa/admixa.js"></script>
  3. On the Admixa page/route, place the element:
        <admixa-app></admixa-app>
     React:  return <admixa-app style={{display:'block'}} />;
     Vue:    <admixa-app />   (add compilerOptions.isCustomElement: t => t === 'admixa-app')
     Angular: add CUSTOM_ELEMENTS_SCHEMA to the module/component.

WHY THIS CANNOT BREAK AGAIN
  Admixa runs inside its own Shadow DOM, a sealed box:
  - Its styles cannot change Hulool360, and Hulool360's styles cannot change it
    (this is what removed the colours before).
  - Its element ids (app, q, toast ...) cannot clash with Hulool360's.
  - It never changes the address bar (routing: 'memory'), so Hulool360's router is
    never confused (this caused the blank page).
  - Keyboard shortcuts (Ctrl+K, /, Esc) only work while Admixa is on screen, and never
    while someone types in a Hulool360 field.
  - Loading the script twice, or leaving and returning to the page, is safe.
  - It only reads Hulool360 errors that come from admixa.js.

DO NOT
  - Do not rebuild Admixa's screens inside Hulool360, or copy its HTML/CSS into Hulool360 files.
  - Do not edit admixa.js. Change behaviour in js/config.js; ask for a new build for anything else.
  - Do not set routing: 'hash' inside Hulool360 (only for the stand-alone page).

OPTIONAL: CONTROL FROM HULOOL360
  document.querySelector('admixa-app').api.open('vancomycin-500-mg')  // open a monograph
  document.querySelector('admixa-app').api.home()                     // back to the list
  document.querySelector('admixa-app').api.ids()                      // all medicine ids

WHO CAN DO WHAT
  Staff: search and read (read-only); searches are logged for KPIs.
  Admin only: edit / add / delete / import, label photos, Analytics, export.
  Default admin password: Admixa@HGH2026  -> change it (tools/make-password-hash.html).
  Better: set getCurrentUser in js/config.js to use the Hulool360 login and roles.

WHERE DATA IS SAVED
  storage: 'local'  - this browser only (testing / one shared device).
  storage: 'remote' - connect the "remote" block in js/config.js to the Hulool360 API so
                      all users share one list. The server must also refuse non-admin saves.

IF SOMETHING LOOKS WRONG
  Open the browser console (F12 -> Console) and type:   Admixa.selfCheck()
  It lists any loading problem in plain words. Send a screenshot of the result.
