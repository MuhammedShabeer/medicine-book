ADMIXA AI · IV preparation intelligence (separate module - the Admixa component is unchanged)
==========================================================================================
FILES
  admixa-ai.js                One file: interface, 66 monographs, prep engine, dose-safety rules, question understanding
  index.html                  Stand-alone page
  admixa-ai-standalone.html   Same, as a single file (open by double-click)

======================================================================
INSIDE HULOOL360 (Admixa AI is a screen of Hulool360, not a separate app)
======================================================================
Hulool360 already knows who is logged in, so Admixa AI uses that login.
There is NO separate Admixa password inside Hulool360.

  // once, in index.html
  <script src="/admixa/js/config.js"></script>      // storage: 'remote' + remote{} -> your API
  <script src="/admixa-ai/admixa-ai.js"></script>

  // React route
  import { useEffect, useRef } from 'react';
  export default function AdmixaAIPage({ currentUser }) {   // from Hulool360's auth
    const ref = useRef(null);
    useEffect(() => {
      if (ref.current) ref.current.user = currentUser
        ? { id: currentUser.id, name: currentUser.fullName, role: currentUser.role } : null;
    }, [currentUser]);
    return <admixa-ai ref={ref} embedded="" style={{ display: 'block' }} />;
  }
  // CSS: admixa-ai { --admixa-top-offset: 64px; --admixa-bottom-offset: 72px; }

 - embedded  : hides the stand-alone admin key button
 - .user     : {id, name, role}; roles in ADMIXA_CONFIG.adminRoles (default ['admin'])
               get Add/Edit/Delete and the Usage dashboard. Change it on login/logout;
               Admixa AI updates immediately. null = signed out (read-only).
 - The same user object should be returned by ADMIXA_CONFIG.getCurrentUser so the
   compendium screen behaves the same way.
 - Your ASP.NET API must enforce the same roles (writes to drugs/ and audit/, reads of events/).

STAND-ALONE TEST PAGE / OTHER HOSTS

  <script src="/admixa-ai/admixa-ai.js"></script>      (load once)
  <admixa-ai></admixa-ai>                               (on the page/route)
  React: <admixa-ai style={{display:'block'}} />

FITTING INSIDE HULOOL360'S LAYOUT
  If Hulool360 has a fixed top bar or a mobile bottom navigation bar, tell Admixa AI their heights
  so its header and chat composer are not hidden behind them:
    admixa-ai { --admixa-top-offset: 64px; --admixa-bottom-offset: 72px; }
  Theme: <admixa-ai theme="dark"> forces dark; otherwise the user's choice is remembered.
  Sealed in Shadow DOM: no style, id, shortcut or URL clashes with Hulool360 or with <admixa-app>.

WHAT YOU CAN ASK
  "vancomycin 1750 mg 70 kg q12h CrCl 60"  -> vials, reconstitution, draw-up, bag, concentration check,
                                               infusion time + pump rate, use-by time, dose-safety verdict
  "gentamicin 7 mg/kg 80 kg q24h"          -> mg/kg converted automatically
  "8900005010"                              -> Cerner lookup
  "which antifungals avoid dextrose?"       -> searches all monograph fields
  "rituximab"                               -> monograph summary
  Brands and shorthand work: Tazocin, pip tazo, dapto, vori, AmBisome, Solu-Medrol, Remicade...

HONEST LIMITS
  - Offline engine (default): answers are computed in the browser; nothing leaves the device.
  - Live AI is used only if you connect a model (see CHAT MODE below); the question text is then sent to that service.
  - Preparation maths covers 30 medicines; the others show their monograph.
  - Y-site compatibility is not in the monographs; Admixa AI says so instead of guessing.
  - Adult doses, normal renal function; CrCl only triggers a renal-adjustment warning.
  - Monograph data snapshot: 10 Nov 2026 (66 medicines). Admin edits made in Admixa are not yet synced here.

EVENTS FOR HULOOL360 ANALYTICS
  document.addEventListener('admixa-ai:ask', e => log(e.detail.query, e.detail.intent));

======================================================================
CHAT MODE AND CONNECTING A LIVE AI MODEL (added 19 Nov 2026)
======================================================================
Admixa AI is now a conversation, like ChatGPT or Claude:
 - message thread, composer pinned to the bottom, Enter to send, Stop while answering
 - follow-ups keep context: "what about 80 kg?", "q6h?", "CrCl 25",
   "how long is it stable?", "which diluent?"
 - header: Library (grid), New chat (+), light/dark theme
 - every calculation still appears as the verified card (verdict, vials, volumes,
   rate, use-by); the refine form and "Copy label text" work inside each card

WITHOUT A MODEL (default inside Hulool360): the offline engine writes the replies.
It understands medicines, doses, follow-ups and field questions, but not open-ended
free text such as "why is vancomycin infused slowly?".

WITH A MODEL: give the element an `llm` function. Admixa supplies the conversation and
three tools (prep_check, get_monograph, search_monographs). The model must call these
tools for every number; it writes only the explanation.

  const ax = document.querySelector('admixa-ai');
  ax.llm = async (messages, { onText, signal, tools }) => {
    // messages: [{role:'user'|'assistant', content:string}], ends with a user turn
    //           (the last one carries Admixa's rules + the engine result)
    // tools:    [{name, description, inputSchema, execute(input)}]  (run in the browser)
    // onText({text}) : call with the WHOLE answer so far to stream it
    // return { text }
  };

Recommended Hulool360 set-up: an ASP.NET Core endpoint (e.g. POST /api/admixa/chat)
holds the API key server-side and forwards to the model provider (Claude API with
tool use). The browser runs the tool loop: when the model asks for a tool, call
tools[i].execute(input) and send the JSON result back to the endpoint. Never put an
API key in the front-end.
If the function throws, Admixa falls back to the offline engine and says so.

======================================================================
ADMIN EDITING AND USAGE KPIs (added 20 Nov 2026)
======================================================================
ONE SOURCE OF TRUTH
Admixa AI reads and writes the SAME data as the Admixa compendium (same js/config.js
settings, same storage keys, same admin roles, same sign-in session):
  - an edit in Admixa AI appears in the compendium, and vice versa
  - without saved edits it shows its built-in copy (66 monographs, 10 Nov 2026)
Load config.js BEFORE admixa-ai.js so both modules use the same settings:
  <script src="/admixa/js/config.js"></script>
  <script src="/admixa-ai/admixa-ai.js"></script>

WHO CAN EDIT
  - Hulool360 login (recommended): ADMIXA_CONFIG.getCurrentUser returns {id, name, role};
    roles in ADMIXA_CONFIG.adminRoles can edit. The key button is then hidden.
  - Stand-alone: key button in the header -> name + admin password (same hash as the
    compendium; default Admixa@HGH2026 - CHANGE IT in config.js).
Admins get: Add medicine (Library), Edit and Delete (monograph Actions card), Usage (chart
button). Delete needs the word DELETE typed. Every change is stamped with who/when
(updatedBy, updatedAt) and written to an audit log (audit collection).
Validation: name required; Cerner numbers digits only and not already used by another medicine.

IMPORTANT - DOSE CALCULATOR
The calculator for 30 medicines (vial sizes, max concentration, infusion-time rule, dose
limits) is a separately verified table. Editing a monograph changes the monograph and the
chat answers, NOT the calculator. The editor warns about this on those medicines.

USAGE KPIs (admins: chart button)
Every question, its result (answered / no result), the dose-check outcome (GREEN/AMBER/RED)
and every monograph opened are recorded with user, time, device and source, in the SAME
format as the compendium analytics (events/{uid}/log), so the compendium dashboard counts
Admixa AI too. The Admixa AI dashboard shows:
  KPIs: questions, active users, monographs opened, RED and AMBER dose checks, % unanswered
  Top questions - most asked-about medicines - unanswered questions - time of day
  Doses flagged RED (who/what/when) - per-user table - recent activity
  Filters: period, source (Admixa AI / compendium), user - Export CSV (Excel-ready)

TO SEE ALL USERS (not just one browser) use server storage:
  storage: 'remote' and the remote{list, save, remove} functions in config.js, backed by
  Hulool360 API routes /api/admixa/drugs, /api/admixa/events, /api/admixa/events/{uid}/log,
  /api/admixa/audit. The SERVER must reject writes to drugs/ and audit/ and reads of
  events/ from non-admins - browser checks protect the screen, not the data.
Names appear only when users are identified (Hulool360 login or admin sign-in); otherwise
they show as "Unsigned device XXXX".
GOVERNANCE: recording staff activity should be disclosed to staff and approved under HMC
policy. Ask staff not to type patient identifiers (MRN, names) into questions.

======================================================================
SHOW ADMIXA ACTIVITY IN HULOOL360 "USER ANALYTICS" (added 20 Nov 2026)
======================================================================
Every Admixa AI action is handed to Hulool360 as a browser event, so it can go into the
SAME activity log that already shows "Login" and "Search" rows.

  // Hulool360 front end, once (e.g. in App.jsx)
  document.addEventListener('admixa:usage', e => {
    const r = e.detail;
    api.post('/api/activity', {              // <- the endpoint User Analytics already uses
      action: r.type === 'open' ? 'Admixa' : 'Search',
      details: r.summary,                    // e.g. Admixa AI · Dose calculation: "meropenem 2 g q6h"
                                             //      → Meropenem 500 mg/1000 mg · dose ABOVE MAXIMUM
      module: 'Admixa AI', kind: r.kind, query: r.q, medicine: r.topName || r.drugName,
      doseCheck: r.verdict, results: r.results, time: r.ts
    });
  });
  <admixa-ai embedded usage-log="host"></admixa-ai>   // Hulool360 keeps the log; Admixa stores none

Kinds of search recorded (r.kind):
  Dose calculation · Medicine lookup · Cerner number lookup · Stability / Reconstitution /
  Compatible vehicles / Administration rate / Maximum concentration / Storage / Clinical notes /
  References question · Class search · Topic search · Compatibility question ·
  Dose (no calculator) → monograph · No result · Opened monograph
r.verdict: green / amber / red (dose above maximum).  r.results: 0 = nothing found.

Admixa's own dashboard as a section of Hulool360 Analytics (admins only):
  <admixa-ai embedded mode="usage"></admixa-ai>        // KPIs, kinds, top questions, RED doses,
                                                      // unanswered, per user, CSV - no chat/header
  (With usage-log="host", build these reports from Hulool360's own log instead.)
