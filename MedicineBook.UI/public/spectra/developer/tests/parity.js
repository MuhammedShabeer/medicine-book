// Walk every view/selection and record textContent; used to compare original vs redesign.
async function walk(fr){
 const out=[];const T=s=>fr.$eval(s,e=>{const c=e.cloneNode(true);c.querySelectorAll('[data-viz]').forEach(x=>x.remove());return c.textContent.replace(/\s+/g,' ').trim();});
 const groups=await fr.$$eval('#grpRow button',b=>b.map(x=>x.dataset.g));
 for(const g of groups){
  await fr.click(`#grpRow button[data-g="${g}"]`);
  const vers=g==='bac'?['2026','2019']:['-'];
  for(const v of vers){
   if(v!=='-')await fr.click(`#verRow button[data-ver="${v}"]`);
   out.push(`G ${g} ${v} intro|`+await T('#intro'),`legend|`+await T('#legend'));
   await fr.click('.tabs button[data-v="bug"]');
   const orgs=await fr.$$eval('#orgPanel .org',b=>b.map(x=>x.dataset.o));
   for(const o of orgs){await fr.click(`#orgPanel .org[data-o="${o}"]`);out.push(`org ${o}|`+await T('#orgDetail'));}
   out.push('orgPanel|'+await T('#orgPanel'));
   await fr.click('.tabs button[data-v="drug"]');
   const drugs=await fr.$$eval('#drugList .dl',b=>b.map(x=>x.dataset.d));
   for(const d of drugs){await fr.click(`#drugList .dl[data-d="${d.replace(/"/g,'\\"')}"]`);out.push(`drug ${d}|`+await T('#drugDetail'));}
   out.push('drugList|'+await T('#drugList'));
   await fr.click('.tabs button[data-v="map"]');out.push('matrix|'+await T('#matrix'),'mapnote|'+await T('#mapnote'));
  }
 }
 await fr.click('#grpRow button[data-g="bac"]');await fr.click('#verRow button[data-ver="2026"]');
 out.push('toolkit|'+await T('#toolkit'),'refs|'+await T('#refs'),'changes|'+await T('#changeList'),'footer|'+await T('footer'));
 return out;
}
module.exports={walk};
