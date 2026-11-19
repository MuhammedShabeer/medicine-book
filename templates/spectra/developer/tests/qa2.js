const {chromium,devices}=require('playwright');const U='http://127.0.0.1:8768/site/index.html';
const DEV=[['iPhone SE',devices['iPhone SE']],['iPhone 15 Pro',devices['iPhone 15 Pro']],['Pixel 7',devices['Pixel 7']],['Galaxy S9+',devices['Galaxy S9+']],['Galaxy Z Fold (folded 280px)',{viewport:{width:280,height:653},isMobile:true,hasTouch:true,deviceScaleFactor:3,userAgent:devices['Pixel 7'].userAgent}],
 ['iPad Mini',devices['iPad Mini']],['iPad Pro 11 landscape',devices['iPad Pro 11 landscape']],['Desktop 1366',{viewport:{width:1366,height:768}}],['Desktop 1920',{viewport:{width:1920,height:1080}}]];
const out={};let fail=0;const F=(k,m)=>{(out[k].fail=out[k].fail||[]).push(m);};
(async()=>{const b=await chromium.launch();
for(const [name,opt] of DEV){out[name]={};const ctx=await b.newContext(Object.assign({reducedMotion:'reduce'},opt));await ctx.route(/fonts\./,r=>r.abort());const p=await ctx.newPage();const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>{if(m.type()==='error'&&!/ERR_FAILED|fonts/.test(m.text()))errs.push(m.text());});
 try{
 await p.goto(U);await p.waitForSelector('.org');const touch=!!opt.hasTouch;const tapEl=async h=>{await h.evaluate(e=>e.scrollIntoView({block:'center'}));await p.waitForTimeout(60);
  const pt=await h.evaluate(e=>{const r=e.getBoundingClientRect();const x=r.left+r.width/2,y=r.top+r.height/2;const at=document.elementFromPoint(x,y);return {x,y,ok:!!at&&(at===e||e.contains(at))};});
  if(!pt.ok)F(name,'hit-test: element covered '+(await h.evaluate(e=>e.className+' '+(e.dataset.v||e.dataset.d||e.dataset.o||''))));
  if(touch)await p.touchscreen.tap(pt.x,pt.y);else await p.mouse.click(pt.x,pt.y);await p.waitForTimeout(40);};
 const tap=async s=>tapEl(await p.$(s));console.error('device',name);
 // overflow on every tab
 for(const v of ['bug','drug','map','tk','chg','ref']){await tap(`.tabs button[data-v="${v}"]`);await p.waitForTimeout(80);const sw=await p.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);if(sw>1)F(name,'overflow '+v+' +'+sw);}
 // drug + fingerprint
 await tap('.tabs button[data-v="drug"]');await tap('#drugList .dl[data-d="Meropenem/imipenem/doripenem"]');await p.waitForSelector('.fpx .fq',{timeout:5000});
 const nq=await p.$$eval('.fpx .fq',x=>x.length),norg=await p.evaluate(()=>ORGS().length);if(nq!==norg)F(name,'squares '+nq+'/'+norg);
 const sz=await p.$eval('.fpx .fq',e=>{const r=e.getBoundingClientRect();return Math.min(r.width,r.height);});if(sz<24)F(name,'target '+sz);
 const legend=await p.$eval('.fpx .fplg',e=>e.innerText);if(!/Active/.test(legend)||!/Conditional/.test(legend))F(name,'legend');
 const third=await p.$$('.fpx .fq');const want=(await third[11].getAttribute('aria-label')).split(' (')[0];await tapEl(third[11]);
 await p.waitForSelector('#fptip:not([hidden])');const tt=await p.$eval('#fptip',e=>{const r=e.getBoundingClientRect();return {t:e.innerText,l:r.left,r:r.right,top:r.top,b:r.bottom,vw:innerWidth,vh:innerHeight};});
 if(tt.t.indexOf(want)!==0)F(name,'tip text '+tt.t.slice(0,60)+' want '+want);if(tt.l<0||tt.r>tt.vw+1||tt.top<0||tt.b>tt.vh+1)F(name,'tip off-screen '+JSON.stringify(tt));
 await p.$eval('#fptip .tt-go',e=>{const r=e.getBoundingClientRect();window.__go=[r.left+r.width/2,r.top+r.height/2];});{const g=await p.evaluate(()=>window.__go);if(touch)await p.touchscreen.tap(g[0],g[1]);else await p.mouse.click(g[0],g[1]);}await p.waitForTimeout(900);
 const cell=await p.evaluate(()=>{const c=document.querySelectorAll('#drugDetail .ribbon .cell')[11];const r=c.getBoundingClientRect();return {txt:c.textContent.slice(0,40),flash:c.classList.contains('flash'),inview:r.top<innerHeight&&r.bottom>0};});
 if(cell.txt.indexOf(want)!==0||!cell.flash||!cell.inview)F(name,'show-on-page '+JSON.stringify(cell));
 if(!(await p.$eval('#fptip',e=>e.hidden)))F(name,'tip not closed after go');
 if(!touch){await p.focus('.fpx .fq');await p.keyboard.press('ArrowRight');const fi=await p.evaluate(()=>document.activeElement.dataset.i);if(fi!=='1')F(name,'arrow key '+fi);
  await p.keyboard.press('Enter');await p.waitForSelector('#fptip:not([hidden])');await p.keyboard.press('Escape');if(!(await p.$eval('#fptip',e=>e.hidden)))F(name,'esc');}
 // search analytics
 await p.fill('#gs','merop');await p.waitForSelector('#gres:not([hidden]) button');await p.press('#gs','Enter');
 await p.fill('#gs','zzqx patient');await p.waitForTimeout(1400);await p.fill('#gs','');
 await tap('.tabs button[data-v="bug"]');await tap('#orgPanel .org[data-o="steno"]');await p.waitForTimeout(150);
 const ev=await p.evaluate(()=>Spectra.analytics.events());const names=ev.map(e=>e.name);
 for(const n of ['session_start','screen_view','fingerprint_tap','search_select','search_no_result'])if(!names.includes(n))F(name,'event missing '+n);
 const ss=ev.find(e=>e.name==='search_select');if(!ss||ss.props.q!=='merop'||!/^Meropenem/.test(ss.props.id)||ss.props.rank!==1)F(name,'search_select '+JSON.stringify(ss&&ss.props));
 const nr=ev.find(e=>e.name==='search_no_result');if(!nr||nr.props.q!==undefined||nr.props.qlen!==12)F(name,'unmatched query leaked '+JSON.stringify(nr&&nr.props));
 const sv=ev.filter(e=>e.name==='screen_view').map(e=>(e.props.item_id||e.props.tab)+':'+e.props.via);
 if(!sv.includes('steno:tap'))F(name,'org view '+sv.join(','));if(!sv.some(x=>/^Meropenem.*:search$/.test(x))&&!sv.includes(ss.props.id+':search'))F(name,'via search '+sv.join(','));
 const bad=ev.filter(e=>!e.id||!e.sid||!e.ts||e.ctx.cv.indexOf('2026-11-17+')!==0||e.ctx.mv!=='1.0.0');if(bad.length)F(name,'schema '+bad.length);
 const exp=ev.find(e=>e.name==='session_start').ctx.device;out[name].device=exp;
 const csv=await p.evaluate(()=>Spectra.analytics.exportCSV());if(!csv.startsWith('﻿id,ts,sid')||csv.split('\r\n').length!==ev.length+1)F(name,'csv rows');
 // usage panel
 await p.goto(U+'?spectra-admin=1');await p.waitForSelector('.sp-panel:not([hidden])',{timeout:4000}).catch(()=>F(name,'panel did not open'));
 const pv=await p.evaluate(()=>{const c=document.querySelector('.sp-card').getBoundingClientRect();return {w:c.width,vw:innerWidth,txt:document.querySelector('.sp-kpis').innerText,sw:document.documentElement.scrollWidth-document.documentElement.clientWidth};});
 if(pv.w>pv.vw||pv.sw>1)F(name,'panel overflow');if(!/Events/.test(pv.txt))F(name,'panel kpis');
 out[name].panelTop=await p.evaluate(()=>[...document.querySelectorAll('.sp-grid section')][0].innerText.replace(/\n/g,' ').slice(0,80));
 await p.keyboard.press('Escape');if(!(await p.$eval('.sp-panel',e=>e.hidden)))F(name,'panel esc');
 if(name==='iPhone 15 Pro'||name==='Desktop 1366'){await p.goto(U);await p.waitForSelector('.org');await tap('.tabs button[data-v="drug"]');await tap('#drugList .dl[data-d="Cefiderocol"]');const q=await p.$$('.fpx .fq');await tapEl(q[10]);await p.waitForTimeout(300);await p.screenshot({path:'s-'+name.replace(/\W+/g,'_')+'.png'});}
 }catch(e){F(name,'EXCEPTION '+e.message.split('\n')[0]);}
 if(errs.length)F(name,'errors '+errs.join(' | '));if(out[name].fail)fail++;await ctx.close();}
// iframe host bridge
{const ctx=await b.newContext({viewport:{width:1200,height:900}});await ctx.route(/fonts\./,r=>r.abort());const p=await ctx.newPage();out.iframe={};
 await p.goto('http://127.0.0.1:8768/host.html');const fr=await (await p.$('#f')).contentFrame();await fr.waitForSelector('.org');
 await p.evaluate(()=>document.getElementById('f').contentWindow.postMessage({source:'hulool',type:'spectra:setUser',userId:'HGH-PH-0042',role:'pharmacist',site:'HGH',appVersion:'3.1.0'},'*'));
 await fr.click('.tabs button[data-v="drug"]');await fr.click('#drugList .dl[data-d="Cefiderocol"]');await p.waitForTimeout(400);
 await p.evaluate(()=>document.getElementById('f').contentWindow.postMessage({source:'hulool',type:'spectra:getSummary',requestId:'r1'},'*'));await p.waitForTimeout(300);
 const m=await p.evaluate(()=>window.__msgs);const evs=m.filter(x=>x.type==='event').map(x=>x.event);
 if(!m.some(x=>x.type==='ready'))F('iframe','no ready');const last=evs.filter(e=>e.name==='screen_view').pop();
 if(!last||last.uid!=='HGH-PH-0042'||last.role!=='pharmacist'||last.ctx.app!=='3.1.0'||last.props.item_id!=='Cefiderocol')F('iframe','identity/event '+JSON.stringify(last&&{uid:last.uid,role:last.role,id:last.props.item_id}));
 const sm=m.find(x=>x.type==='summary'&&x.requestId==='r1');if(!sm||!sm.summary.top_drugs.length)F('iframe','summary reply');
 out.iframe.messages=m.length;if(out.iframe.fail)fail++;await ctx.close();}
// endpoint upload + auth header
{const ctx=await b.newContext();await ctx.route(/fonts\./,r=>r.abort());await ctx.addInitScript(()=>{window.SPECTRA_CONFIG={analytics:{endpoint:'http://127.0.0.1:8769/ev',batchSize:3,authHeader:'Bearer qa',flushIntervalMs:5000}};});
 const p=await ctx.newPage();out.endpoint={};const errs=[];p.on('pageerror',e=>errs.push(e.message));await p.goto(U);await p.waitForSelector('.org');
 for(const o of ['strep','entero','mssa','esbl','cre']){await p.click(`#orgPanel .org[data-o="${o}"]`);await p.waitForTimeout(250);}await p.waitForTimeout(1500);
 await p.waitForTimeout(2500);await p.evaluate(()=>Spectra.analytics.flush());await p.waitForTimeout(1500);await p.evaluate(()=>Spectra.analytics.flush());await p.waitForTimeout(1500);out.endpoint.generated=await p.evaluate(()=>Spectra.analytics.events().length);
 const got=await (await fetch('http://127.0.0.1:8769/')).json();out.endpoint.batches=got.length;out.endpoint.events=got.reduce((a,x)=>a+(x.n||0),0);
 if(!got.length||got.some(x=>x.bad)||got.some(x=>x.auth!=='Bearer qa'))F('endpoint',JSON.stringify(got));
 if(out.endpoint.events!==out.endpoint.generated)F('endpoint','received '+out.endpoint.events+' of '+out.endpoint.generated);
 if(errs.length)F('endpoint',errs.join('|'));if(out.endpoint.fail)fail++;await ctx.close();}
// storage blocked (private mode / locked-down WebView)
{const ctx=await b.newContext();await ctx.route(/fonts\./,r=>r.abort());await ctx.addInitScript(()=>{for(const k of ['localStorage','sessionStorage'])Object.defineProperty(window,k,{get(){throw new DOMException('blocked','SecurityError');}});});
 const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));out.nostorage={};await p.goto(U);await p.waitForSelector('.org');
 await p.click('#thm');await p.click('.tabs button[data-v="drug"]');await p.click('#drugList .dl[data-d="Cefiderocol"]');await p.waitForTimeout(200);
 const n=await p.evaluate(()=>Spectra.analytics.events().length);out.nostorage.events=n;if(n<2)F('nostorage','events '+n);if(errs.length)F('nostorage',errs.join('|'));if(out.nostorage.fail)fail++;await ctx.close();}
// data integrity
{const ctx=await b.newContext();await ctx.route(/fonts\./,r=>r.abort());const p=await ctx.newPage();await p.goto(U);await p.waitForSelector('.org');
 out.integrity=await p.evaluate(()=>{const prob=[];const refs=new Set(REFS.map(r=>r[0]));let cites=0;
  const chk=(where,r)=>{(r||[]).forEach(k=>{cites++;if(!refs.has(k))prob.push(where+' bad ref '+k);});};
  GORDER.forEach(g=>{const btn=document.querySelector(`#grpRow button[data-g="${g}"]`);btn.click();
   const vers=g==='bac'?['2026','2019']:['-'];vers.forEach(v=>{if(v!=='-')document.querySelector(`#verRow button[data-ver="${v}"]`).click();
    const ids=new Set(ORGS().map(o=>o.id));DATA().forEach(d=>{Object.keys(d.cov).forEach(o=>{if(!ids.has(o))prob.push(g+v+' '+d.n+' unknown org '+o);const c=d.cov[o];if(c&&c.r)chk(d.n,c.r);});
     if(d.src&&!(d.src in SRC)&&!refs.has(d.src))prob.push(d.n+' src '+d.src);});
    ORGS().forEach(o=>{chk(o.id,o.r);});});});
  document.querySelector('#grpRow button[data-g="bac"]').click();document.querySelector('#verRow button[data-ver="2026"]').click();
  const urls=REFS.filter(r=>r[2]&&!/^https:\/\//.test(r[2])).map(r=>r[0]);if(urls.length)prob.push('non-https '+urls);
  const dupe=REFS.map(r=>r[0]).filter((k,i,a)=>a.indexOf(k)!==i);if(dupe.length)prob.push('dup refs '+dupe);
  return {refs:REFS.length,cites,problems:prob};});
 if(out.integrity.problems.length)fail++;await ctx.close();}
await b.close();console.log(JSON.stringify(out,null,1));console.log(fail?'FAIL '+fail:'ALL DEVICE, ANALYTICS AND INTEGRITY CHECKS PASSED');})();
