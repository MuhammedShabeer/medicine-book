const {chromium,devices}=require('playwright');const U='http://127.0.0.1:8768/site/index.html';
const CFG={content:{url:'http://127.0.0.1:8769/content',saveUrl:'http://127.0.0.1:8769/content'},analytics:{enabled:true}};
const R={};let fail=0;const F=(k,m)=>{(R[k]=R[k]||{fail:[]}).fail.push(m);};const ok=(k,m)=>{(R[k]=R[k]||{fail:[]});(R[k].ok=R[k].ok||[]).push(m);};
async function newPage(b,opt,cfg){const c=await b.newContext(Object.assign({reducedMotion:'reduce'},opt||{viewport:{width:1366,height:900}}));await c.route(/fonts\./,r=>r.abort());
 await c.addInitScript(x=>{window.SPECTRA_CONFIG=x;},cfg||CFG);const p=await c.newPage();p.__errs=[];p.on('pageerror',e=>p.__errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_FAILED|fonts|404|Failed to load resource/.test(m.text()))p.__errs.push(m.text());});
 await p.goto(U);await p.waitForSelector('.org');return {c,p};}
const T=(p,s)=>p.$eval(s,e=>e.innerText);
async function saveForm(p){await p.click('.ad-form .ad-save');await p.waitForTimeout(150);return p.$eval('.ad-msg',e=>e.className+'|'+e.innerText).catch(()=>'no msg');}
async function pick(p,tab,g,sel){await p.click(`.ad-tabs [data-tab="${tab}"]`);if(g)await p.selectOption('.ad [data-f="group"]',g);if(sel==='')await p.click('.ad [data-a="new"]');else await p.click(`.ad-list [data-sel="${sel.replace(/"/g,'\\"')}"]`);}
async function covRow(p,org,status,text,refs){const r=`.ad-cov tr[data-org="${org}"]`;await p.selectOption(r+' [data-c="s"]',status);if(text!=null)await p.fill(r+' [data-c="t"]',text);if(refs!=null)await p.fill(r+' [data-c="r"]',refs);}
(async()=>{const b=await chromium.launch();
// 1. ordinary user: no editor, grants refused
{const {c,p}=await newPage(b);const k='1 user';
 if(await p.$('#adBtn'))F(k,'admin button visible to user');
 const g=await p.evaluate(()=>[Spectra.admin.isAdmin(),Spectra.admin.grant({role:'pharmacist'}),Spectra.admin.isAdmin()]);if(g.join()!=='false,false,false')F(k,'grant '+g);
 await p.evaluate(()=>Spectra.admin.open());if(await p.$('.ad:not([hidden])'))F(k,'console opened without grant');
 const thr=await p.evaluate(()=>{try{Spectra.admin.apply({op:'drug.del',group:'par',key:'Quinine',reason:'test x'});return 'no throw';}catch(e){return e.message;}});if(!/Administrator access/.test(thr))F(k,'apply without admin: '+thr);
 if(p.__errs.length)F(k,p.__errs.join('|'));ok(k,'done');await c.close();}
// 2. iframe parent cannot grant when parentOrigin is "*"
{const c=await b.newContext();await c.route(/fonts\./,r=>r.abort());const p=await c.newPage();await p.goto('http://127.0.0.1:8768/host.html');const fr=await (await p.$('#f')).contentFrame();await fr.waitForSelector('.org');
 await p.evaluate(()=>document.getElementById('f').contentWindow.postMessage({source:'hulool',type:'spectra:grantAdmin',role:'sysadmin',user:'x'},'*'));await p.waitForTimeout(300);
 if(await fr.evaluate(()=>Spectra.admin.isAdmin()))F('2 iframe','granted with wildcard origin');ok('2 iframe','refused');await c.close();}
// 3. system administrator edits
const A=await newPage(b);{const p=A.p,k='3 admin';
 await p.evaluate(()=>Spectra.admin.grant({role:'sysadmin',user:'HGH-SA-01',token:'admintok'}));
 await p.waitForSelector('#adBtn');await p.click('#adBtn');await p.waitForSelector('.ad:not([hidden])');
 // a) coverage edit, reason missing → refused
 await pick(p,'drug','bac','Cefiderocol');await covRow(p,'steno','first','Test edit: preferred','IDSA');
 let m=await saveForm(p);if(!/err/.test(m)||!/reason/i.test(m))F(k,'missing reason not refused: '+m);
 const kept=await p.$eval('.ad-cov tr[data-org="steno"] [data-c="t"]',e=>e.value);if(kept!=='Test edit: preferred')F(k,'input lost after refused save: '+kept);
 await p.fill('.ad [data-f="reason"]','QA: IDSA 2026 test change');m=await saveForm(p);if(!/ok/.test(m))F(k,'save a: '+m);
 // b) unknown reference refused
 await pick(p,'drug','bac','Aztreonam');await covRow(p,'pseudo','limited','x','NOPE');await p.fill('.ad [data-f="reason"]','QA unknown ref');m=await saveForm(p);if(!/unknown reference/i.test(m))F(k,'unknown ref accepted: '+m);
 // c) rename drug (pharmacist notes must follow)
 await pick(p,'drug','bac','Aztreonam');await p.fill('.ad [data-f="n"]','Aztreonam (IV)');await p.fill('.ad [data-f="reason"]','QA rename');m=await saveForm(p);if(!/ok/.test(m))F(k,'rename: '+m);
 // d) duplicate name refused
 await pick(p,'drug','bac','');await p.fill('.ad [data-f="n"]','Cefiderocol');await p.fill('.ad [data-f="c"]','Newer agents (added 2026)');await p.fill('.ad [data-f="reason"]','QA duplicate');m=await saveForm(p);if(!/already exists/i.test(m))F(k,'duplicate accepted: '+m);
 // e) new reference
 await pick(p,'ref',null,'');await p.fill('.ad [data-f="k"]','TESTREF');await p.fill('.ad [data-f="t"]','QA Society. Test guideline, 2027.');await p.fill('.ad [data-f="u"]','https://example.org/guideline');await p.fill('.ad [data-f="reason"]','QA new reference');m=await saveForm(p);if(!/ok/.test(m))F(k,'ref: '+m);
 // f) new antiviral drug with XSS-like name, coverage + notes
 await pick(p,'drug','vir','');await p.fill('.ad [data-f="n"]','Testavir <img src=x onerror=window.__x=1>');await p.fill('.ad [data-f="c"]','Anti-herpes');
 await covRow(p,'hsv','limited','QA indication only','TESTREF');await p.fill('.ad [data-f="note"]','First QA point [TESTREF]\nSecond point without refs');await p.fill('.ad [data-f="reason"]','QA new drug');m=await saveForm(p);if(!/ok/.test(m))F(k,'new drug: '+m);
 // g) new organism in antifungal
 await pick(p,'org','fun','');await p.fill('.ad [data-f="n"]','Testomyces spp.');await p.selectOption('.ad [data-f="f"]','mould');await p.fill('.ad [data-f="site"]','Lungs');await p.fill('.ad [data-f="note"]','QA organism note');await p.fill('.ad [data-f="r"]','TESTREF');await p.fill('.ad [data-f="reason"]','QA new organism');m=await saveForm(p);if(!/ok/.test(m))F(k,'new org: '+m);
 // h) edit hard-coded-name organism (SPACE) and remove a drug (two-tap)
 await pick(p,'org','bac','space');await p.fill('.ad [data-f="n"]','AmpC-producing Enterobacterales (QA)');await p.fill('.ad [data-f="reason"]','QA rename organism');m=await saveForm(p);if(!/ok/.test(m))F(k,'org edit: '+m);
 await pick(p,'drug','par','Quinine');await p.fill('.ad [data-f="reason"]','QA remove');await p.click('.ad [data-a="delete"]');await p.click('.ad [data-a="delete"]');await p.waitForTimeout(150);
 const nd=await p.evaluate(()=>Spectra.admin.draft().length);if(nd!==7)F(k,'draft count '+nd);
 // live preview on this device
 await p.click('.ad [data-a="close"]');
 await p.evaluate(()=>{document.querySelector('.tabs button[data-v="drug"]').click();});await p.click('#drugList .dl[data-d="Cefiderocol"]');
 const cd=await T(p,'#drugDetail');if(!/Test edit: preferred/.test(cd)||!/4\s*\/\s*27/.test(cd))F(k,'preview cefiderocol '+cd.slice(0,200));
 if(!(await p.$('#drugList .dl[data-d="Aztreonam (IV)"]')))F(k,'rename not shown');await p.click('#drugList .dl[data-d="Aztreonam (IV)"]');if(!/Limited activity against Gram-positive/.test(await T(p,'#drugDetail')))F(k,'notes lost on rename');
 if(await p.evaluate(()=>window.__x))F(k,'XSS executed');
 // publish with server
 await p.click('#adBtn');await p.click('.ad [data-a="publish"]');await p.waitForTimeout(800);m=await p.$eval('.ad-msg',e=>e.innerText);if(!/Published version 1/.test(m))F(k,'publish: '+m);
 ok(k,'drafts '+nd+', '+m.slice(0,40));if(p.__errs.length)F(k,p.__errs.join('|'));}
// 4. wrong token cannot publish
{const {c,p}=await newPage(b);const k='4 bad token';await p.evaluate(()=>Spectra.admin.grant({role:'sysadmin',user:'X',token:'stolen'}));
 await p.evaluate(()=>Spectra.admin.apply({op:'drug.del',group:'par',key:'Chloroquine',reason:'malicious attempt'}));
 const r=await p.evaluate(()=>Spectra.admin.publish().then(()=>'published',e=>e.message));if(!/refused/.test(r))F(k,r);
 const log=await (await fetch('http://127.0.0.1:8769/content/log')).json();if(!log.some(x=>x.rejected===401))F(k,'server did not reject');ok(k,r.slice(0,50));await c.close();}
// 5. ordinary user receives the published pack
{const {c,p}=await newPage(b);const k='5 user sees pack';await p.waitForTimeout(800);
 const v=await p.evaluate(()=>[Spectra.content.version(),Spectra.content.source(),Spectra.contentVersion,Spectra.admin.isAdmin(),!!document.getElementById('adBtn')]);
 if(v[0]!==1||v[1]!=='server'||!/\|pack-v1$/.test(v[2])||v[3]||v[4])F(k,'state '+JSON.stringify(v));
 await p.evaluate(()=>document.querySelector('.tabs button[data-v="drug"]').click());await p.click('#drugList .dl[data-d="Cefiderocol"]');if(!/Test edit: preferred/.test(await T(p,'#drugDetail')))F(k,'cefiderocol');
 await p.click('#grpRow button[data-g="vir"]');const vl=await T(p,'#drugList');if(!/Testavir <img src=x onerror=window.__x=1>/.test(vl))F(k,'new drug missing / not escaped');
 await p.click('.tabs button[data-v="bug"]');await p.click('#orgPanel .org[data-o="hsv"]');const hs=await T(p,'#orgDetail');if(!/QA indication only/.test(hs))F(k,'hsv page');
 await p.click('#grpRow button[data-g="fun"]');if(!/Testomyces/.test(await T(p,'#orgPanel')))F(k,'new organism');
 await p.click('#grpRow button[data-g="par"]');await p.evaluate(()=>document.querySelector('.tabs button[data-v="drug"]').click());if(/Quinine/.test(await T(p,'#drugList')))F(k,'quinine still present');
 await p.click('#grpRow button[data-g="bac"]');await p.evaluate(()=>document.querySelector('.tabs button[data-v="bug"]').click());if(!/AmpC-producing Enterobacterales \(QA\)/.test(await T(p,'#orgPanel')))F(k,'space rename');
 await p.evaluate(()=>document.querySelector('.tabs button[data-v="chg"]').click());if(!/Local update — Add drug Testavir/.test(await T(p,'#changeList')))F(k,'changes tab');
 await p.evaluate(()=>document.querySelector('.tabs button[data-v="ref"]').click());if(!/QA Society/.test(await T(p,'#refs')))F(k,'refs tab');
 await p.evaluate(()=>document.querySelector('#verRow button[data-ver="2019"]').click());await p.evaluate(()=>document.querySelector('.tabs button[data-v="drug"]').click());if(!(await p.$('#drugList .dl[data-d="Aztreonam (IV)"]'))===false)F(k,'2019 archive altered');
 const ev=await p.evaluate(()=>Spectra.analytics.events().filter(e=>e.name==='content_loaded').map(e=>e.props.pack_version));if(!ev.includes(1))F(k,'analytics content_loaded');
 if(await p.evaluate(()=>window.__x))F(k,'XSS');if(p.__errs.length)F(k,p.__errs.join('|'));ok(k,'pack '+v.join(','));await c.close();}
// 6. bundled pack (no server): content-pack.js route
{const pack=await (await fetch('http://127.0.0.1:8769/content')).json();const c=await b.newContext();await c.route(/fonts\./,r=>r.abort());
 await c.route('**/js/content-pack.js',r=>r.fulfill({contentType:'text/javascript',body:'window.SPECTRA_CONTENT='+JSON.stringify(pack)+';'}));
 const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto(U);await p.waitForSelector('.org');const k='6 bundled';
 const v=await p.evaluate(()=>[Spectra.content.version(),Spectra.content.source(),Spectra.content.errors().length]);if(v[0]!==1||v[1]!=='bundled'||v[2])F(k,JSON.stringify(v));
 if(errs.length)F(k,errs.join('|'));ok(k,JSON.stringify(v));await c.close();}
// 7. undo from history (admin), publish v2
{const p=A.p,k='7 undo';await p.reload();await p.waitForSelector('.org');await p.waitForTimeout(500);
 await p.evaluate(()=>Spectra.admin.grant({role:'sysadmin',user:'HGH-SA-01',token:'admintok'}));await p.click('#adBtn');await p.click('.ad-tabs [data-tab="hist"]');
 const btns=await p.$$('.ad-log li');let did=false;for(const li of btns){if(/Remove drug Quinine/.test(await li.innerText())){await (await li.$('button')).click();did=true;break;}}
 if(!did)F(k,'history entry missing');await p.waitForTimeout(200);
 await p.click('.ad [data-a="publish"]');await p.waitForTimeout(800);const m=await p.$eval('.ad-msg',e=>e.innerText);if(!/Published version 2/.test(m))F(k,m);
 await p.click('.ad [data-a="close"]');await p.click('#grpRow button[data-g="par"]');await p.evaluate(()=>document.querySelector('.tabs button[data-v="drug"]').click());if(!/Quinine/.test(await T(p,'#drugList')))F(k,'quinine not restored');
 if(p.__errs.length)F(k,p.__errs.join('|'));ok(k,m.slice(0,30));await A.c.close();}
// 8. admin console on a 320px phone
{const {c,p}=await newPage(b,devices['iPhone SE']);const k='8 phone console';await p.evaluate(()=>Spectra.admin.grant({role:'sysadmin',user:'SA',token:'admintok'}));
 await p.evaluate(()=>document.getElementById('adBtn').click());await p.waitForSelector('.ad:not([hidden])');await p.click('.ad-list [data-sel="Cefiderocol"]');await p.waitForTimeout(200);
 const w=await p.evaluate(()=>{const c=document.querySelector('.ad-card').getBoundingClientRect();return {w:c.width,vw:innerWidth,sw:document.documentElement.scrollWidth-document.documentElement.clientWidth,save:!!document.querySelector('.ad-save')};});
 if(w.w>w.vw||w.sw>1||!w.save)F(k,JSON.stringify(w));await p.screenshot({path:'ad-phone.png'});
 await p.evaluate(()=>document.querySelector('.ad-form').scrollTop=0);ok(k,JSON.stringify(w));await c.close();}
// desktop screenshot of console
{const {c,p}=await newPage(b);await p.evaluate(()=>Spectra.admin.grant({role:'sysadmin',user:'HGH-SA-01',token:'admintok'}));await p.click('#adBtn');await p.click('.ad-list [data-sel="Cefiderocol"]');await p.waitForTimeout(200);await p.screenshot({path:'ad-desk.png'});await c.close();}
await b.close();for(const k in R)if(R[k].fail.length)fail++;console.log(JSON.stringify(R,null,1));console.log(fail?'FAIL '+fail:'ALL ADMIN CHECKS PASSED');})();
