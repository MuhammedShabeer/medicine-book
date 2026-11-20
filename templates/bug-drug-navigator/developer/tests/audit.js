// Keyed content audit: verified 4 Oct 2026 data vs current data, both in the ORIGINAL design.
const {chromium}=require('playwright');const {walk}=require('./parity.js');const B=__dirname;
(async()=>{const b=await chromium.launch();
 async function run(dir){const c=await b.newContext();await c.route(/fonts\./,r=>r.abort());const p=await c.newPage();await p.goto('file://'+B+'/reference/'+dir+'/index.html');await p.waitForSelector('.org');const w=await walk(p.mainFrame());await c.close();
  const m=new Map();let ctxg='';for(const s of w){if(s.startsWith('G '))ctxg=s.split('|')[0];const i=s.indexOf('|');const k=(s.startsWith('G ')?'':ctxg+' :: ')+s.slice(0,i);m.set(k,s.slice(i+1));}return m;}
 const A=await run('orig-2026-10-04'),N=await run('orig-design-current-data');
 const changed=[],added=[],removed=[];
 for(const [k,v] of N){if(!A.has(k))added.push(k);else if(A.get(k)!==v)changed.push(k);}
 for(const k of A.keys())if(!N.has(k))removed.push(k);
 console.log(JSON.stringify({old:A.size,new:N.size,changed,added,removed},null,1));await b.close();})();
