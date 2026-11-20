# End-to-end test used before delivery. Start backend/samples/SampleHost on http://127.0.0.1:5080 (after "npm run build" in frontend), then: python tests/e2e_playwright.py
import re, time, json
from playwright.sync_api import sync_playwright, expect
B="http://127.0.0.1:5080/"
errs=[]
def watch(pg):
    pg.on("pageerror", lambda e: errs.append("PAGEERROR "+str(e)))
    pg.on("console", lambda m: m.type=="error" and errs.append("CONSOLE "+m.text))
def ok(cond,msg):
    print(("PASS " if cond else "FAIL ")+msg)
    if not cond: errs.append("FAIL "+msg)
with sync_playwright() as p:
    b=p.chromium.launch()
    # ---------- pharmacist, desktop ----------
    ctx=b.new_context(viewport={"width":1366,"height":768}); pg=ctx.new_page(); watch(pg)
    pg.goto(B+"?as=pharmacist"); pg.wait_for_selector(".hfr-live:not(.hfr-off)",timeout=15000)
    ok("2,127" in pg.inner_text(".hfr-meta"),"counts shown: "+pg.inner_text(".hfr-meta").replace("\n"," | "))
    ok(pg.evaluate("document.activeElement.type")=="search","search box focused on load")
    ok(pg.query_selector(".hfr-gbtn:has-text('Admin')") is None,"no Admin button for pharmacist")
    pg.keyboard.type("linez"); pg.wait_for_selector(".hfr-ans")
    ok("LINEZOLID" in pg.inner_text(".hfr-ans h2"),"answer card shows linezolid")
    ok("Infectious" in pg.inner_text(".hfr-ans .hfr-vt"),"verdict: "+pg.inner_text(".hfr-ans .hfr-vt"))
    ab=pg.query_selector(".hfr-ans").bounding_box(); ok(ab["y"]<768,"answer card above the fold (y=%d)"%ab["y"])
    pg.keyboard.press("ArrowDown"); ok("Result 2 of" in pg.inner_text(".hfr-ans .hfr-pos"),"arrow moves to result 2")
    pg.keyboard.press("Enter"); pg.wait_for_selector(".hfr-sheet.hfr-on"); pg.wait_for_timeout(600); sb=pg.query_selector(".hfr-sheet").bounding_box(); ok(sb["x"]+sb["width"]<=1366,"Enter opens detail sheet, fully on screen (right edge %d)"%(sb["x"]+sb["width"]))
    pg.screenshot(path="/home/claude/e2e/d_sheet.png")
    pg.keyboard.press("Escape"); pg.wait_for_timeout(400); ok(pg.query_selector(".hfr-sheet.hfr-on") is None,"Esc closes sheet")
    pg.fill("input[type=search]","vancomicin"); pg.wait_for_timeout(300)
    ok("allowing for spelling" in pg.inner_text(".hfr-status"),"spelling-tolerant: "+pg.inner_text(".hfr-status").replace("\n"," "))
    pg.fill("input[type=search]","zzqqxx"); pg.wait_for_timeout(300); ok(pg.query_selector(".hfr-empty") is not None,"empty state for no match")
    pg.fill("input[type=search]",""); pg.click(".hfr-foot"); pg.keyboard.press("2"); pg.wait_for_timeout(300)
    ok(pg.query_selector(".hfr-tile.hfr-on") is not None and "ID / antimicrobial" in pg.inner_text(".hfr-status"),"hotkey 2 filters ID / antimicrobial")
    pg.keyboard.press("Escape"); pg.wait_for_timeout(200)
    pg.fill("input[type=search]","bermuda"); pg.wait_for_timeout(300)
    ok("Qatari" in pg.inner_text(".hfr-ans"),"Qatari-only item shows Qatari flag")
    pg.click(".hfr-ans .hfr-pri"); pg.wait_for_selector(".hfr-sheet.hfr-on"); ok("HMC list of items restricted to Qatari" in pg.inner_text(".hfr-sheet"),"sheet shows Qatari-only list block")
    pg.click(".hfr-sheet button[aria-label=Pin]"); pg.wait_for_timeout(200); pg.keyboard.press("Escape")
    pg.fill("input[type=search]","tirzepatide 5"); pg.wait_for_timeout(1700)   # let the search event settle
    pg.fill("input[type=search]","qqzzxy"); pg.wait_for_timeout(1700)
    pg.fill("input[type=search]",""); pg.wait_for_timeout(300)
    ok(pg.query_selector(".hfr-quick .hfr-qc") is not None,"pinned/recent quick list shown")
    pg.evaluate("document.dispatchEvent(new Event('visibilitychange'))")
    pg.wait_for_timeout(16500)  # periodic flush
    q=pg.evaluate("JSON.parse(localStorage.getItem('h360.fr.usageQueue')||'[]').length"); ok(q==0,"usage queue flushed (left %d)"%q)
    pg.screenshot(path="/home/claude/e2e/d_home.png")
    ctx.close()
    # ---------- admin, desktop ----------
    ctx=b.new_context(viewport={"width":1440,"height":900},accept_downloads=True); pg=ctx.new_page(); watch(pg)
    pg.goto(B+"?as=admin"); pg.wait_for_selector(".hfr-live:not(.hfr-off)")
    pg.click(".hfr-gbtn:has-text('Admin')"); pg.wait_for_selector(".hfr-kpi"); pg.wait_for_timeout(500)
    k=pg.inner_text(".hfr-kpis"); ok("Searches" in k,"analytics KPIs: "+k.replace("\n"," | ")[:120])
    ok("Pharmacist A" in pg.inner_text(".hfr-abody"),"per-user row for Pharmacist A")
    ok("qqzzxy" in pg.inner_text(".hfr-abody"),"zero-result term listed")
    pg.screenshot(path="/home/claude/e2e/a_analytics.png",full_page=True)
    pg.click(".hfr-tr.hfr-usr >> text=Details"); pg.wait_for_selector(".hfr-modal .hfr-tr.hfr-ev")
    ok("linez" in pg.inner_text(".hfr-modal") or "tirzepatide" in pg.inner_text(".hfr-modal"),"user drill-down lists searches"); pg.keyboard.press("Escape")
    # add medicine from zero-result
    pg.click("button[aria-label='Add qqzzxy as a medicine']"); pg.wait_for_selector(".hfr-modal")
    ok(pg.input_value("#hfr-name")=="QQZZXY","prefilled from zero-result term")
    pg.fill("#hfr-no","8900099998"); pg.fill("#hfr-name","DEMOTEST 5 MG"); pg.select_option("#hfr-rid",label=re.compile("^Linezolid")) if False else None
    opts=pg.eval_on_selector_all("#hfr-rid option","els=>els.map(e=>[e.value,e.textContent])"); lz=[v for v,t in opts if t.startswith("Linezolid")][0]
    pg.select_option("#hfr-rid",lz); pg.click(".hfr-mf >> text=Add medicine"); pg.wait_for_selector(".hfr-modal",state="detached")
    ok("Medicine added" in pg.inner_text(".hfr-toast"),"toast: medicine added")
    # duplicate validation
    pg.click(".hfr-tabs >> text=Medicines"); pg.click(".hfr-atool >> text=Add medicine"); pg.fill("#hfr-no","8900099998"); pg.fill("#hfr-name","DUP"); pg.click(".hfr-mf >> text=Add medicine")
    ok("already exists" in pg.inner_text(".hfr-modal"),"duplicate item number rejected"); pg.keyboard.press("Escape")
    pg.fill(".hfr-asearch input","demotest"); pg.wait_for_timeout(200); ok("DEMOTEST 5 MG" in pg.inner_text(".hfr-tbl"),"new medicine in admin list")
    # restriction with link + suggest
    pg.click(".hfr-tabs >> text=Restrictions"); pg.click(".hfr-atool >> text=Add restriction"); pg.fill("#hfr-g","Demotestmab")
    pg.fill("#hfr-tx","Approved on 6 MAR 2024. Restricted for usage by nominated Rheumatology consultants for Qatari patients ONLY.")
    pg.click("text=Suggest from wording"); pg.wait_for_timeout(100)
    ok(pg.is_checked(".hfr-checks label:has-text('Nominated prescribers') input") and pg.is_checked(".hfr-checks label:has-text('Rheumatology') input"),"suggest filled conditions and specialty")
    pg.fill("#hfr-lq","demotest"); pg.click(".hfr-sugg button"); ok("moves from Linezolid" in pg.inner_text(".hfr-links"),"link shows it moves from Linezolid")
    pg.click(".hfr-mf >> text=Add restriction"); pg.wait_for_selector(".hfr-modal",state="detached")
    # back to search to confirm live update
    pg.click(".hfr-ahead .hfr-btn:has-text('Search')"); pg.wait_for_selector(".hfr-sbox"); pg.fill("input[type=search]","demotest"); pg.wait_for_selector(".hfr-ans")
    ok("Rheumatology" in pg.inner_text(".hfr-ans .hfr-vt"),"search shows new restriction: "+pg.inner_text(".hfr-ans .hfr-vt"))
    # remove + restore
    pg.click(".hfr-gbtn:has-text('Admin')"); pg.click(".hfr-tabs >> text=Medicines"); pg.fill(".hfr-asearch input","demotest"); pg.wait_for_timeout(200)
    pg.click("button[aria-label='Remove DEMOTEST 5 MG']"); pg.click(".hfr-mf >> text=Remove medicine"); pg.wait_for_timeout(600)
    ok("No medicines match" in pg.inner_text(".hfr-tbl"),"removed from active list")
    pg.click(".hfr-seg2 >> text=Removed"); pg.wait_for_timeout(200); pg.click("text=Restore"); pg.wait_for_timeout(600)
    pg.click(".hfr-seg2 >> text=Active"); pg.wait_for_timeout(200); ok("DEMOTEST 5 MG" in pg.inner_text(".hfr-tbl"),"restored")
    pg.click(".hfr-tabs >> text=Change log"); pg.wait_for_selector(".hfr-tr.hfr-aud:not(.hfr-h)")
    log=pg.inner_text(".hfr-tbl"); ok(all(x in log for x in ["Added medicine","Added restriction","Linked medicine","Removed medicine","Restored medicine"]),"change log complete")
    ok("Admin B" in log,"change log records the admin's name")
    pg.click(".hfr-tabs >> text=Export")
    with pg.expect_download() as d: pg.click("text=Download CSV")
    path=d.value.path(); txt=open(path,encoding="utf-8-sig").read(); ok(txt.startswith("Item No,") and "DEMOTEST 5 MG" in txt,"CSV export downloaded (%d rows)"%txt.count("\n"))
    pg.click(".hfr-tabs >> text=Medicines"); pg.screenshot(path="/home/claude/e2e/a_meds.png")
    ctx.close()
    # ---------- mobile ----------
    ctx=b.new_context(viewport={"width":390,"height":844},is_mobile=True,has_touch=True,device_scale_factor=2); pg=ctx.new_page(); watch(pg)
    pg.goto(B+"?as=admin"); pg.wait_for_selector(".hfr-live:not(.hfr-off)")
    sw=pg.evaluate("document.documentElement.scrollWidth"); ok(sw<=390,"no horizontal overflow on phone (scrollWidth %d)"%sw)
    pg.screenshot(path="/home/claude/e2e/m_home.png")
    pg.fill("input[type=search]","tirzep"); pg.wait_for_selector(".hfr-ans")
    ab=pg.query_selector(".hfr-ans").bounding_box(); ok(ab["y"]<320,"phone: answer directly under search (y=%d)"%ab["y"])
    pg.screenshot(path="/home/claude/e2e/m_answer.png")
    pg.tap(".hfr-ans .hfr-pri"); pg.wait_for_selector(".hfr-sheet.hfr-on"); pg.wait_for_timeout(500)
    bb=pg.query_selector(".hfr-sheet").bounding_box(); ok(bb["width"]>=389,"phone: details open full width")
    pg.screenshot(path="/home/claude/e2e/m_sheet.png")
    pg.tap(".hfr-sheet button[aria-label=Close]"); pg.wait_for_timeout(400)
    pg.fill("input[type=search]",""); pg.tap(".hfr-gbtn:has-text('Admin')"); pg.wait_for_selector(".hfr-kpi"); pg.wait_for_timeout(400)
    sw=pg.evaluate("document.documentElement.scrollWidth"); ok(sw<=390,"phone admin: no horizontal overflow (%d)"%sw)
    pg.screenshot(path="/home/claude/e2e/m_admin.png",full_page=True)
    pg.tap(".hfr-tabs >> text=Medicines"); pg.wait_for_timeout(300); pg.screenshot(path="/home/claude/e2e/m_meds.png")
    pg.tap("button:has-text('Edit') >> nth=0"); pg.wait_for_selector(".hfr-modal"); pg.screenshot(path="/home/claude/e2e/m_form.png"); pg.keyboard.press("Escape")
    # offline
    pg.tap(".hfr-ahead .hfr-btn:has-text('Search')"); pg.wait_for_selector(".hfr-sbox")
    ctx.close()
    # offline needs the page cached; test cache path by blocking the API instead
    ctx=b.new_context(viewport={"width":1366,"height":768}); pg=ctx.new_page(); watch(pg)
    pg.goto(B+"?as=pharmacist"); pg.wait_for_selector(".hfr-live:not(.hfr-off)")
    pg.route("**/api/**",lambda r:r.abort()); pg.reload(); pg.wait_for_selector(".hfr-card",timeout=10000)
    ok("Offline copy" in pg.inner_text(".hfr-live"),"API down: shows saved copy, labelled 'Offline copy'")
    pg.fill("input[type=search]","meropen"); pg.wait_for_selector(".hfr-ans"); ok("MEROPENUM" in pg.inner_text(".hfr-ans h2"),"search works offline")
    errs[:]=[e for e in errs if "Failed to load resource" not in e]   # expected while API is blocked
    pg.unroute("**/api/**")
    # dark
    pg.emulate_media(color_scheme="dark"); pg.reload(); pg.wait_for_selector(".hfr.hfr-dark .hfr-card"); pg.fill("input[type=search]","linezolid"); pg.wait_for_selector(".hfr-ans")
    pg.screenshot(path="/home/claude/e2e/d_dark.png"); ok(True,"dark mode follows system setting")
    ctx.close(); b.close()
print("\nERRORS:",errs if errs else "none")
