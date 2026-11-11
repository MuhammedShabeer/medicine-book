ADMIXA - IV & injectable preparation guide
==========================================

Files
  index.html            Page structure (open this file)
  css/styles.css        All styles (mobile-first, Outfit font from Google Fonts)
  js/app.js             Application logic (search, monograph pages, editor, analytics)
  js/data.js            The 66 medicines, loaded by the page
  data/medicines.json   Same medicines as plain JSON (for import into your database)

How to run
  Open index.html in any modern browser (Chrome, Edge, Safari), or upload the
  whole "admixa" folder to your web server. Keep the folder structure as it is.

What works on its own (no server needed)
  - Search, category filters, command palette (Ctrl+K or "/")
  - Full monograph pages, barcodes, references, print
  - Works on mobile, tablet and desktop

What needs your Hulool360 backend
  Admin editing, adding medicines, label photos and per-user search tracking
  save to a database. On claude.ai this was provided by the platform
  (window.claude). In your own app, provide an object with the same interface:

    window.claude = {
      use: async (name) => ...   // 'db', 'user', 'assets'
    }

    db.collection('drugs').onSnapshot(onRows, onError)
    db.doc('drugs/<id>').set(data) / .update(data) / .delete()
    db.doc('events/<uid>/log/<id>').set(event)          // search & open log
    db.collection('events/<uid>/log').orderBy(...).limit(n).get()
    user.id(), user.canEdit(), user.profile()            // login + admin role
    assets.upload(file) -> { url }                        // label photos

  Without it, the page runs read-only from js/data.js.

Updating the medicine list without a backend
  Edit js/data.js (or regenerate it from data/medicines.json).
