const {chromium}=require('playwright');const crypto=require('crypto');const {walk}=require('./parity.js');
const B=__dirname;
const T=[['file-split','file://'+B+'/site/index.html'],['file-standalone','file://'+B+'/site/standalone/spectra.html'],['http-split','http://127.0.0.1:8768/site/index.html'],['http-standalone','http://127.0.0.1:8768/site/standalone/spectra.html'],['http-strict-CSP','http://127.0.0.1:8768/site/index-csp.html'],['iframe-in-host','http://127.0.0.1:8768/host.html']];
(async()=>{const b=await chromium.launch();const R={};let fail=0;
 // reference: ORIGINAL design running the CURRENT data (proves the redesign changes no wording)
 const oc=await b.newContext({viewport:{width:1280,height:900}});await oc.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 const op=await oc.newPage();await op.goto('file://'+B+'/reference/orig-design-current-data/index.html');await op.waitForSelector('.org');
 const ref=await walk(op.mainFrame());await oc.close();
 const refHash=crypto.createHash('sha256').update(ref.join('\n')).digest('hex').slice(0,16);
 for(const [name,url] of T){
  const ctx=await b.newContext({viewport:{width:1280,height:900}});await ctx.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
  const page=await ctx.newPage();const errs=[];page.on('pageerror',e=>errs.push('pageerror '+e.message));page.on('console',m=>{if(m.type()==='error'&&!/ERR_FAILED|fonts/.test(m.text()))errs.push('console '+m.text())});
  await page.goto(url);const fr=name==='iframe-in-host'?(await (await page.$('#f')).contentFrame()):page.mainFrame();
  await fr.waitForSelector('.org');await fr.evaluate(()=>{window.__csp=[];document.addEventListener('securitypolicyviolation',e=>window.__csp.push(e.violatedDirective+' '+e.blockedURI))});
  const got=await walk(fr);
  let diff=0,firstDiff='';
  if(got.length!==ref.length){diff=-1;firstDiff='length '+got.length+' vs '+ref.length;}
  else for(let i=0;i<ref.length;i++)if(ref[i]!==got[i]){diff++;if(!firstDiff)firstDiff=ref[i].slice(0,120)+' ≠ '+got[i].slice(0,120);}
  // global search
  await fr.fill('#gs','stenotroph');await fr.waitForSelector('#gres:not([hidden]) button');await fr.press('#gs','Enter');
  if(!/Stenotrophomonas/.test(await fr.$eval('#orgDetail h2',e=>e.textContent)))errs.push('search org');
  await fr.fill('#gs','vorico');await fr.waitForSelector('#gres:not([hidden]) button');await fr.press('#gs','Enter');
  const dh=await fr.$eval('#drugDetail h2',e=>e.textContent);const g=await fr.$eval('#grpRow [aria-pressed="true"]',e=>e.dataset.g);
  if(!/Voriconazole/.test(dh)||g!=='fun')errs.push('search drug cross-group '+dh+' '+g);
  if(await fr.$eval('#v-drug',e=>e.classList.contains('hide')))errs.push('search tab');
  await fr.fill('#gs','<img src=x onerror="window.__x=1">');await fr.waitForSelector('#gres:not([hidden])');
  if(!/No organism or drug matches/.test(await fr.$eval('#gres',e=>e.textContent)))errs.push('search empty');
  await fr.fill('#gs','');
  // theme toggle
  await fr.click('#thm');const th1=await fr.evaluate(()=>document.documentElement.getAttribute('data-theme'));await fr.click('#thm');const th2=await fr.evaluate(()=>document.documentElement.getAttribute('data-theme'));
  if(!th1||!th2||th1===th2)errs.push('theme '+th1+th2);
  await fr.evaluate(()=>document.documentElement.removeAttribute('data-theme'));
  const ov=[];
  if(name!=='iframe-in-host'){for(const w of [320,360,390,768,1024,1280]){await page.setViewportSize({width:w,height:900});
   for(const v of ['bug','drug','map','tk','chg','ref']){await page.click(`.tabs button[data-v="${v}"]`);
    const sw=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);if(sw>1)ov.push(w+' '+v+' +'+sw);}
   if(w<=760){const pos=await page.$eval('.tabs',e=>getComputedStyle(e).position);if(pos!=='fixed')errs.push('bottom nav '+w);
     const lab=await page.$eval('.tabs button[data-v="bug"]',e=>getComputedStyle(e,'::after').content);if(!/Organism/.test(lab))errs.push('short label');}}}
  const x=await fr.evaluate(()=>window.__x||0);const csp=await fr.evaluate(()=>window.__csp);
  const und=(got.join('\n').match(/\bundefined\b|\bNaN\b|\[object Object\]/g)||[]).length;
  R[name]={items:got.length,diff,firstDiff,errs,csp,ov,x,und};if(diff||errs.length||csp.length||ov.length||x||und)fail++;await ctx.close();}
 await b.close();
 console.log('reference (original design) items:',ref.length,'hash',refHash);
 console.log(JSON.stringify(R,null,1));console.log(fail?'FAIL '+fail:'ALL CHECKS PASSED — rendered content identical to the original design (same data) in all 6 loading methods');})();
