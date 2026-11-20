/* Spectra (Hulool 360°) — content administration layer.
   Lets a SYSTEM ADMINISTRATOR (role granted by the Hulool host) add, edit and remove drugs, organisms,
   coverage, pharmacist notes and references without coding. Every edit is an audited, append-only
   change ("op") in a versioned content pack that is applied over the verified base data in app.js.
   Ordinary users never see the editor; they only receive packs that an administrator has published.
   NOTE: the authoritative permission check is server-side (Hulool must accept a published pack only
   from a sysadmin session). The client gate below hides the editor; it is not a security boundary. */
(function(){
"use strict";
var CFG=window.SPECTRA_CONFIG||{},CC=CFG.content||{},AC=CFG.admin||{},AN=CFG.analytics||{};
var ROLES=(AC.roles||["sysadmin"]).map(String),BASE="__APPHASH__";
var LSK={draft:"spectra-admin-draft",cache:"spectra-content-cache"};
var LS={get:function(k){try{return localStorage.getItem(k);}catch(e){return null;}},set:function(k,v){try{localStorage.setItem(k,v);return true;}catch(e){return false;}},del:function(k){try{localStorage.removeItem(k);}catch(e){}}};
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m];});}
function uuid(){try{if(crypto.randomUUID)return crypto.randomUUID();}catch(e){}var s="";for(var i=0;i<32;i++)s+=Math.floor(Math.random()*16).toString(16);return s.slice(0,8)+"-"+s.slice(8,12)+"-4"+s.slice(13,16)+"-a"+s.slice(17,20)+"-"+s.slice(20);}
function emit(n,d){try{document.dispatchEvent(new CustomEvent("spectra:"+n,{detail:d}));}catch(e){}}
function clone(o){return o==null?o:JSON.parse(JSON.stringify(o));}
function inIframe(){try{return window.parent&&window.parent!==window;}catch(e){return true;}}
function post(msg){
 try{if(inIframe())window.parent.postMessage(msg,(AN.parentOrigin||"*"));}catch(e){}
 var j;try{j=JSON.stringify(msg);}catch(e){return;}
 try{if(window.ReactNativeWebView)window.ReactNativeWebView.postMessage(j);}catch(e){}
 try{if(window.SpectraChannel)window.SpectraChannel.postMessage(j);}catch(e){}
 try{if(window.flutter_inappwebview)window.flutter_inappwebview.callHandler("spectra",msg);}catch(e){}
}

/* ================= live data accessors (globals from app.js) ================= */
function groups(){return GORDER.slice();}
function gLabel(g){return GROUPS[g].label;}
function orgsOf(g){return g==="bac"?ORG.concat(ORG26):GROUPS[g].orgs;}
function drugsOf(g){return g==="bac"?DRUG26:GROUPS[g].drugs;}
function pnOf(g){if(g==="bac")return PN;if(!GROUPS[g].pn)GROUPS[g].pn={};return GROUPS[g].pn;}
function famsOf(g){return g==="bac"?famOrder:GROUPS[g].fams;}
function findDrug(g,n){var a=drugsOf(g);for(var i=0;i<a.length;i++)if(a[i].n===n)return a[i];return null;}
function findOrg(g,id){var a=orgsOf(g);for(var i=0;i<a.length;i++)if(a[i].id===id)return a[i];return null;}
function refExists(k){return Object.prototype.hasOwnProperty.call(REFNUM,k);}

/* ---------- normalised model used by the editor and stored in ops ---------- */
function covIn(v){if(v===1||v===true)return {s:"active",t:"",r:[]};if(!v)return null;
 if(v.p)return {s:"first",t:v.p,r:(v.r||[]).slice()};if(v.q)return {s:"limited",t:v.q,r:(v.r||[]).slice()};return {s:"active",t:"",r:(v.r||[]).slice()};}
function covOut(g,c){if(c.s==="first")return {p:c.t,r:c.r.slice()};if(c.s==="limited")return c.r.length?{q:c.t,r:c.r.slice()}:{q:c.t};
 if(g==="bac"&&!c.r.length)return 1;return {r:c.r.slice()};}
function linesIn(a){return (a||[]).map(function(x){return {t:x[0],r:(x[1]||[]).slice()};});}
function linesOut(a){return (a||[]).map(function(x){return [x.t,x.r.slice()];});}
function drugModel(g,d){
 var p=pnOf(g)[d.n]||{},cov={};
 Object.keys(d.cov).forEach(function(k){var c=covIn(d.cov[k]);if(c)cov[k]=c;});
 return {n:d.n,c:d.c,tag:d.tag||"",src:d.src||"",cov:cov,
  pn:{aw:p.aw||null,awx:p.awx||"",po:p.po?{t:p.po[0],r:(p.po[1]||[]).slice()}:null,warn:linesIn(p.warn),mon:linesIn(p.mon),ix:linesIn(p.ix),note:linesIn(p.note)}};
}
function orgModel(g,o){
 var note="",r=[];
 if(g==="bac"){var n=ORGNOTE26[o.id];if(Array.isArray(n)){note=n[0];r=(n[1]||[]).slice();}else note=n||"";}
 else{note=o.note||"";r=(o.r||[]).slice();}
 return {id:o.id,n:o.n,sh:g==="bac"?(SHORT[o.id]||""):(o.sh||""),s:o.s||"",f:o.f,site:o.site||"",note:note,r:r};
}
function refModel(k){var i=REFNUM[k];if(!i)return null;var x=REFS[i-1];return {k:x[0],t:x[1],u:x[2]||""};}

/* ---------- validation ---------- */
var KEYRE=/^[A-Z0-9_]{2,24}$/,IDRE=/^[a-z0-9_]{2,32}$/;
function needRefs(list,where,pending){(list||[]).forEach(function(k){if(!refExists(k)&&!(pending&&pending[k]))throw new Error(where+": unknown reference key “"+k+"”");});}
function txt(v,max,label,req){v=(v==null?"":String(v)).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g,"").trim();if(req&&!v)throw new Error(label+" is required");if(v.length>max)throw new Error(label+" is longer than "+max+" characters");return v;}
function validateOp(op,pending){
 if(!op||!op.op)throw new Error("Malformed change");
 if(op.op!=="ref.put"&&groups().indexOf(op.group)<0)throw new Error("Unknown drug group");
 if(op.op==="drug.put"){var v=op.value;v.n=txt(v.n,120,"Drug name",true);v.c=txt(v.c,80,"Class",true);v.tag=txt(v.tag,120,"Tag");
  Object.keys(v.cov).forEach(function(k){var c=v.cov[k];if(!findOrg(op.group,k))throw new Error("Coverage: organism “"+k+"” is not in "+gLabel(op.group));
   if(["active","first","limited"].indexOf(c.s)<0)throw new Error("Coverage status");c.t=txt(c.t,300,"Coverage text for "+k,c.s!=="active");needRefs(c.r,"Coverage "+k,pending);});
  ["warn","mon","ix","note"].forEach(function(f){(v.pn[f]||[]).forEach(function(x){x.t=txt(x.t,500,"Note",true);needRefs(x.r,"Pharmacist note",pending);});});
  if(v.pn.po){v.pn.po.t=txt(v.pn.po.t,200,"IV→PO / oral note",true);needRefs(v.pn.po.r,"IV→PO note",pending);}
  if(v.pn.aw&&["A","W","R"].indexOf(v.pn.aw)<0)throw new Error("AWaRe must be A, W or R");
  if(v.src&&!refExists(v.src)&&!SRC[v.src]&&!(pending&&pending[v.src]))throw new Error("Source key “"+v.src+"” not found");
 }
 else if(op.op==="org.put"){var o=op.value;o.n=txt(o.n,120,"Organism name",true);o.sh=txt(o.sh,60,"Short name");o.s=txt(o.s,160,"Subtitle");o.site=txt(o.site,200,"Common sites");o.note=txt(o.note,1200,"Note");
  if(famsOf(op.group).indexOf(o.f)<0)throw new Error("Family is not valid for "+gLabel(op.group));if(!IDRE.test(o.id))throw new Error("Organism ID must be 2–32 lower-case letters, digits or _");needRefs(o.r,"Organism note",pending);}
 else if(op.op==="ref.put"){var r=op.value;if(!KEYRE.test(r.k))throw new Error("Reference key must be 2–24 capitals, digits or _");r.t=txt(r.t,400,"Citation",true);r.u=txt(r.u,500,"URL");if(r.u&&!/^https:\/\/[^\s<>"']+$/.test(r.u))throw new Error("URL must start with https://");}
 else if(op.op!=="drug.del"&&op.op!=="org.del")throw new Error("Unknown change type "+op.op);
 op.reason=txt(op.reason,500,"Reason for change",true);if(op.reason.length<5)throw new Error("Please give a reason for the change (at least 5 characters)");
}

/* ---------- apply one change to the live data (idempotent upserts) ---------- */
function insertByClass(arr,d){var at=-1;arr.forEach(function(x,i){if(x.c===d.c)at=i;});if(at>=0)arr.splice(at+1,0,d);else arr.push(d);}
function fixSel(){
 groups().forEach(function(g){var os=orgsOf(g),ds=drugsOf(g);if(!os.length||!ds.length)return;
  [SEL[g],g==="bac"?null:GROUPS[g].first].forEach(function(s){if(!s)return;if(!findOrg(g,s.org))s.org=os[0].id;if(!findDrug(g,s.drug))s.drug=ds[0].n;});});
 if(ORGS().length&&!ORGS().some(function(o){return o.id===curOrg;}))curOrg=ORGS()[0].id;
 if(DATA().length&&!DATA().some(function(d){return d.n===curDrug;}))curDrug=DATA()[0].n;
}
function renameSel(g,a,b){if(SEL[g]&&SEL[g].drug===a)SEL[g].drug=b;if(g!=="bac"&&GROUPS[g].first.drug===a)GROUPS[g].first.drug=b;if(grp===g&&curDrug===a)curDrug=b;}
function applyOp(op){
 var g=op.group,v=op.value;
 if(op.op==="ref.put"){var i=REFNUM[v.k];if(!op.key&&i)throw new Error("Reference key "+v.k+" already exists");if(op.key&&!i)throw new Error("Reference "+op.key+" was not found");if(i){REFS[i-1][1]=v.t;REFS[i-1][2]=v.u||"";}else{REFS.push([v.k,v.t,v.u||""]);REFNUM[v.k]=REFS.length;}if(SRC[v.k])SRC[v.k]=v.t;return;}
 if(op.op==="drug.put"){
  var arr=drugsOf(g),pn=pnOf(g),d=op.key?findDrug(g,op.key):null;
  if(op.key&&!d)throw new Error("Drug “"+op.key+"” was not found in "+gLabel(g));
  if(!op.key&&findDrug(g,v.n))throw new Error("A drug called “"+v.n+"” already exists in "+gLabel(g));
  if(d&&d.n!==v.n&&findDrug(g,v.n))throw new Error("A drug called “"+v.n+"” already exists in "+gLabel(g));
  var old={};
  if(!d){d={n:v.n,c:v.c,cov:{}};if(g==="bac"){d.chg={};d.isNew=true;}insertByClass(arr,d);}
  else{old=d.cov;if(d.n!==v.n){if(pn[d.n]){pn[v.n]=pn[d.n];delete pn[d.n];}renameSel(g,d.n,v.n);d.n=v.n;}
   if(d.c!==v.c){arr.splice(arr.indexOf(d),1);d.c=v.c;insertByClass(arr,d);}}
  if(v.tag)d.tag=v.tag;else delete d.tag;
  if(v.src){d.src=v.src;if(!SRC[v.src]&&REFNUM[v.src])SRC[v.src]=REFS[REFNUM[v.src]-1][1];}else if(g==="bac"&&d.isNew&&!d.src)d.src="ADMIN";
  var nc={};Object.keys(v.cov).forEach(function(k){nc[k]=covOut(g,v.cov[k]);});
  if(g==="bac"){d.chg=d.chg||{};Object.keys(old).concat(Object.keys(nc)).forEach(function(k){
   if(JSON.stringify(old[k])!==JSON.stringify(nc[k]))d.chg[k]=nc[k]?{t:"Local update: "+op.reason,src:"ADMIN",act:"set"}:{t:"Removed: "+op.reason,src:"ADMIN",act:"remove"};});}
  d.cov=nc;
  var p={},m=v.pn||{};
  var keepAw=pn[v.n]&&pn[v.n].awx;
  if(g==="bac"){p.aw=m.aw||null;if(m.awx||keepAw)p.awx=m.awx||keepAw;}
  if(m.po)p.po=[m.po.t,m.po.r.slice()];
  ["warn","mon","ix","note"].forEach(function(f){if(m[f]&&m[f].length)p[f]=linesOut(m[f]);});
  if(g!=="bac"&&!Object.keys(p).length)delete pn[v.n];else pn[v.n]=p;
  return;
 }
 if(op.op==="drug.del"){var a2=drugsOf(g),x=findDrug(g,op.key);if(!x)return;if(a2.length<2)throw new Error("A group must keep at least one drug");a2.splice(a2.indexOf(x),1);delete pnOf(g)[op.key];return;}
 if(op.op==="org.put"){
  var o=op.key?findOrg(g,op.key):null;
  if(op.key&&!o)throw new Error("Organism “"+op.key+"” was not found in "+gLabel(g));
  if(!o){if(orgById[v.id]&&(findOrg(g,v.id)||!op.restore))throw new Error("Organism ID “"+v.id+"” already exists");
   o={id:v.id,f:v.f,n:v.n,s:v.s,site:v.site};(g==="bac"?ORG26:GROUPS[g].orgs).push(o);orgById[v.id]=o;}
  else{o.n=v.n;o.s=v.s;o.site=v.site;o.f=v.f;o.edited=true;}
  if(g==="bac"){SHORT[o.id]=v.sh||v.n;if(v.note)ORGNOTE26[o.id]=v.r.length?[v.note,v.r.slice()]:v.note;else delete ORGNOTE26[o.id];}
  else{if(v.sh)o.sh=v.sh;else delete o.sh;if(v.note)o.note=v.note;else delete o.note;if(v.r.length)o.r=v.r.slice();else delete o.r;}
  return;
 }
 if(op.op==="org.del"){var oa=g==="bac"?(ORG26.some(function(q){return q.id===op.key;})?ORG26:ORG):GROUPS[g].orgs,oo=null;
  oa.forEach(function(q){if(q.id===op.key)oo=q;});if(!oo)return;if(orgsOf(g).length<2)throw new Error("A group must keep at least one organism");
  oa.splice(oa.indexOf(oo),1);drugsOf(g).forEach(function(d){delete d.cov[op.key];if(d.chg)delete d.chg[op.key];});return;}
}

/* ---------- content state ---------- */
var published=null,draft=[],appliedIds={},errors=[],source="base",admin=null,keyRows=0;
function opTitle(op){var v=op.value||{};switch(op.op){
 case"drug.put":return (op.key?"Edit drug ":"Add drug ")+(v.n||op.key);case"drug.del":return "Remove drug "+op.key;
 case"org.put":return (op.key?"Edit organism ":"Add organism ")+(v.n||op.key);case"org.del":return "Remove organism "+((op.before&&op.before.n)||op.key);
 case"ref.put":return (op.key?"Edit reference ":"Add reference ")+v.k;}return op.op;}
function opRef(op){var v=op.value||{},r=[];if(op.op==="drug.put"){Object.keys(v.cov||{}).forEach(function(k){r=r.concat(v.cov[k].r);});}else if(op.op==="org.put")r=v.r||[];else if(op.op==="ref.put")r=[v.k];
 for(var i=0;i<r.length;i++)if(refExists(r[i]))return r[i];return "ADMINREF";}
function ensureAdminMeta(){
 SRC.ADMIN="Local update approved by the Hulool system administrator (see the content audit log)";
 if(!refExists("ADMINREF")){REFS.push(["ADMINREF","Hulool 360° Spectra local content updates — each change, its author, date and reason are recorded in the content pack audit log",""]);REFNUM.ADMINREF=REFS.length;}
}
function applyList(list,mark){
 var n=0;list.forEach(function(op){if(appliedIds[op.id])return;
  try{validateOp(clone(op));applyOp(op);appliedIds[op.id]=1;n++;
   ensureAdminMeta();KEYPOINTS.push([op.group?gLabel(op.group):"References",(mark==="draft"?"Draft — ":"Local update — ")+opTitle(op),op.reason+(op.at?" ("+op.at.slice(0,10)+(op.by?", "+op.by:"")+")":""),opRef(op)]);keyRows++;}
  catch(e){errors.push({id:op.id,title:opTitle(op),error:e.message});}});
 return n;
}
function rerender(){try{fixSel();renderAll();renderRefs();renderChanges();}catch(e){errors.push({error:"render: "+e.message});}}
function validPack(p){return p&&p.format==="spectra-content-pack"&&p.schema===1&&Array.isArray(p.changes)&&typeof p.version==="number";}
function usePack(p,src){
 if(!validPack(p))return false;if(published&&p.version<published.version)return false;
 published=p;source=src;var n=applyList(p.changes,"pub");if(n)rerender();
 emit("content",{source:src,id:p.id,version:p.version,changes:p.changes.length,base_match:p.base===BASE});
 return true;
}
/* 1) bundled pack (js/content-pack.js) */
usePack(window.SPECTRA_CONTENT,"bundled");
/* 2) device cache (last published/remote pack seen on this device) */
try{var cached=JSON.parse(LS.get(LSK.cache)||"null");if(validPack(cached)&&(!published||cached.version>published.version))usePack(cached,"cache");}catch(e){}
/* 3) Hulool server (authoritative) */
if(CC.url&&window.fetch){
 fetch(CC.url,{cache:"no-store",credentials:"include"}).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);return r.json();})
 .then(function(p){if(validPack(p)&&(!published||p.version>=published.version)){LS.set(LSK.cache,JSON.stringify(p));usePack(p,"server");}})
 .catch(function(e){errors.push({error:"content server: "+e.message});});
}

/* ================= administrator access ================= */
function grant(info){
 info=info||{};var role=String(info.role||"");
 if(ROLES.indexOf(role)<0){emit("admin",{action:"denied",role:role});return false;}
 admin={role:role,user:String(info.user||info.userId||"").slice(0,64)||null,token:info.token?String(info.token):null,at:new Date().toISOString()};
 try{draft=JSON.parse(LS.get(LSK.draft)||"[]");if(!Array.isArray(draft))draft=[];}catch(e){draft=[];}
 if(applyList(draft,"draft"))rerender();
 showButton();emit("admin",{action:"granted",role:role});return true;
}
function revoke(){if(!admin)return;admin=null;closeConsole();var b=document.getElementById("adBtn");if(b)b.remove();if(draft.length)location.reload();}
function saveDraft(){LS.set(LSK.draft,JSON.stringify(draft));}
function addToDraft(op){
 if(!admin)throw new Error("Administrator access is required");
 op.id=uuid();op.at=new Date().toISOString();op.by=admin.user;op.role=admin.role;
 var pending={};draft.forEach(function(o){if(o.op==="ref.put")pending[o.value.k]=1;});
 validateOp(op,pending);
 applyOp(op);appliedIds[op.id]=1;ensureAdminMeta();KEYPOINTS.push([op.group?gLabel(op.group):"References","Draft — "+opTitle(op),op.reason,opRef(op)]);
 draft.push(op);saveDraft();rerender();
 emit("admin",{action:"draft",op:op.op,group:op.group||null,key:op.key||(op.value&&(op.value.n||op.value.k))||null});
}
function buildPack(){return {format:"spectra-content-pack",schema:1,id:(published&&published.id)||uuid(),version:(published?published.version:0)+1,
 base:BASE,published:new Date().toISOString(),publishedBy:admin?admin.user:null,changes:(published?published.changes:[]).concat(draft)};}
function packJS(p){return "/* Spectra content pack v"+p.version+" — published "+p.published+(p.publishedBy?" by "+p.publishedBy:"")+". Generated by the Spectra admin console; do not edit by hand. */\nwindow.SPECTRA_CONTENT = "+JSON.stringify(p,null,1)+";\n";}
function download(name,data,type){try{var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:type}));a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},1500);}catch(e){}}
function publish(){
 if(!admin)return Promise.reject(new Error("Administrator access is required"));
 if(!draft.length)return Promise.reject(new Error("There are no draft changes to publish"));
 var p=buildPack();
 function done(where){published=p;source=where;LS.set(LSK.cache,JSON.stringify(p));draft=[];saveDraft();
  post({source:"spectra",type:"content-published",pack:p});emit("admin",{action:"published",version:p.version,changes:p.changes.length,where:where});return {pack:p,where:where};}
 if(CC.saveUrl&&window.fetch){
  var h={"Content-Type":"application/json"};if(admin.token)h.Authorization="Bearer "+admin.token;
  return fetch(CC.saveUrl,{method:"POST",headers:h,body:JSON.stringify(p),credentials:"include"}).then(function(r){
   if(r.status===401||r.status===403)throw new Error("The Hulool server refused this publish: your session is not a system-administrator session.");
   if(r.status===409)throw new Error("Someone else has published a newer version. Reload, review and publish again.");
   if(!r.ok)throw new Error("The Hulool server returned HTTP "+r.status+"; nothing was published.");
   return done("server");});
 }
 return Promise.resolve(done("host"));
}
window.Spectra=window.Spectra||{};
window.Spectra.content={version:function(){return published?published.version:0;},id:function(){return published?published.id:null;},
 pack:function(){return clone(published);},source:function(){return source;},errors:function(){return errors.slice();},
 load:function(p){if(!validPack(p))return false;LS.set(LSK.cache,JSON.stringify(p));return usePack(p,"host");}};
window.Spectra.admin={grant:grant,revoke:revoke,isAdmin:function(){return !!admin;},open:function(){if(admin)openConsole();},close:closeConsole,
 draft:function(){return clone(draft);},publish:publish,exportPack:function(){return clone(buildPack());},
 apply:function(op){addToDraft(clone(op));return true;}};
window.addEventListener("message",function(e){
 var d=e.data;if(!d||typeof d!=="object"||d.source!=="hulool")return;
 try{if(e.source!==window.parent)return;}catch(x){return;}
 var po=AN.parentOrigin;
 /* admin and content commands require a configured, exact parent origin */
 if(!po||po==="*"||e.origin!==po){if(/^spectra:(grantAdmin|loadContent)$/.test(d.type))errors.push({error:"Refused "+d.type+": set analytics.parentOrigin in config.js"});return;}
 if(d.type==="spectra:grantAdmin")grant(d);else if(d.type==="spectra:revokeAdmin")revoke();
 else if(d.type==="spectra:loadContent")window.Spectra.content.load(d.pack);
 else if(d.type==="spectra:openAdmin"&&admin)openConsole();
});

/* ================= admin console UI ================= */
var ui=null,st={tab:"drug",g:"bac",sel:null,q:"",msg:null,lastFocus:null};
function showButton(){
 if(document.getElementById("adBtn"))return;var thm=document.getElementById("thm");if(!thm)return;
 var b=document.createElement("button");b.type="button";b.id="adBtn";b.className="thm adbtn";b.setAttribute("aria-label","Open content administration");b.title="Content administration";
 b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10.5-10.5a2.1 2.1 0 0 0-4-4L4 16v4z"/><path d="M13.5 6.5l4 4"/></svg>';
 b.addEventListener("click",openConsole);thm.parentNode.insertBefore(b,thm);
}
function openConsole(){
 if(!admin)return;
 if(!ui){ui=document.createElement("div");ui.className="ad";ui.setAttribute("role","dialog");ui.setAttribute("aria-modal","true");ui.setAttribute("aria-labelledby","adTitle");ui.hidden=true;document.body.appendChild(ui);
  ui.addEventListener("click",onClick);ui.addEventListener("change",onChange);ui.addEventListener("input",onInput);
  ui.addEventListener("keydown",function(e){if(e.key==="Escape"){closeConsole();}});}
 st.lastFocus=document.activeElement;st.g=grp;ui.hidden=false;document.documentElement.classList.add("sp-open");draw();var c=ui.querySelector(".ad-x");if(c)c.focus();
 emit("admin",{action:"open"});
}
function closeConsole(){if(!ui||ui.hidden)return;ui.hidden=true;document.documentElement.classList.remove("sp-open");if(st.lastFocus&&st.lastFocus.focus)st.lastFocus.focus();}
function refsStr(r){return (r||[]).join(", ");}
function parseRefs(s){return String(s||"").split(/[,\s]+/).map(function(x){return x.trim().toUpperCase();}).filter(Boolean);}
function linesStr(a){return (a||[]).map(function(x){return x.t+(x.r.length?" ["+x.r.join(", ")+"]":"");}).join("\n");}
function parseLines(s){return String(s||"").split(/\n+/).map(function(l){l=l.trim();if(!l)return null;var m=l.match(/^(.*?)\s*\[([A-Za-z0-9_ ,]+)\]\s*$/);return m?{t:m[1].trim(),r:parseRefs(m[2])}:{t:l,r:[]};}).filter(Boolean);}
function one(s){var a=parseLines(s);return a.length?a[0]:null;}
function slug(n,g){var b=String(n).toLowerCase().replace(/[^a-z0-9]+/g,"_").replace(/^_|_$/g,"").slice(0,24)||"org";var id=b,i=2;while(orgById[id])id=b.slice(0,22)+"_"+(i++);return id;}

function head(){
 var pv=published?("Published v"+published.version+(published.published?" · "+published.published.slice(0,10):"")):"Base content (no local updates published)";
 return '<header class="ad-head"><div><h2 id="adTitle">Spectra content administration</h2><small>'+esc(admin.user||"Administrator")+' · '+esc(admin.role)+' · '+esc(pv)+'</small></div>'+
 '<div class="ad-hb"><button type="button" class="ad-pub" data-a="publish"'+(draft.length?'':' disabled')+'>Publish'+(draft.length?' ('+draft.length+')':'')+'</button><button type="button" class="ad-x" data-a="close" aria-label="Close administration">×</button></div></header>'+
 (st.msg?'<div class="ad-msg '+(st.msg.ok?'ok':'err')+'" role="'+(st.msg.ok?'status':'alert')+'">'+esc(st.msg.t)+'</div>':'')+
 '<nav class="ad-tabs" role="tablist">'+[["drug","Drugs"],["org","Organisms"],["ref","References"],["draft","Draft ("+draft.length+")"],["hist","History"]].map(function(t){return '<button type="button" role="tab" data-tab="'+t[0]+'" aria-selected="'+(st.tab===t[0])+'">'+esc(t[1])+'</button>';}).join("")+'</nav>';
}
function groupSel(){return '<label class="ad-fl"><span>Drug group</span><select data-f="group">'+groups().map(function(g){return '<option value="'+g+'"'+(g===st.g?' selected':'')+'>'+esc(gLabel(g))+'</option>';}).join("")+'</select></label>';}
function draw(){
 if(!ui)return;var h='<div class="ad-card">'+head();
 if(st.tab==="drug"||st.tab==="org"){
  var list=st.tab==="drug"?drugsOf(st.g).map(function(d){return [d.n,d.n,d.c];}):orgsOf(st.g).map(function(o){return [o.id,o.n,FAM[o.f]?FAM[o.f].name:o.f];});
  var q=st.q.toLowerCase();list=list.filter(function(x){return !q||(x[1]+" "+x[2]).toLowerCase().indexOf(q)>-1;});
  h+='<div class="ad-tools">'+groupSel()+'<label class="ad-fl grow"><span>Find</span><input type="search" data-f="q" value="'+esc(st.q)+'" placeholder="Search…"></label><button type="button" class="ad-add" data-a="new">+ Add '+(st.tab==="drug"?"drug":"organism")+'</button></div>'+
   '<div class="ad-main"><div class="ad-list" role="listbox" aria-label="Items">'+list.map(function(x){return '<button type="button" role="option" data-sel="'+esc(x[0])+'" aria-selected="'+(st.sel===x[0])+'"><b>'+esc(x[1])+'</b><small>'+esc(x[2])+'</small></button>';}).join("")+'</div><div class="ad-form">'+(st.sel!==null?(st.tab==="drug"?drugForm():orgForm()):'<p class="ad-empty">Select an item to edit, or add a new one.</p>')+'</div></div>';
 }
 else if(st.tab==="ref"){
  h+='<div class="ad-tools"><label class="ad-fl grow"><span>Find</span><input type="search" data-f="q" value="'+esc(st.q)+'" placeholder="Key or citation…"></label><button type="button" class="ad-add" data-a="new">+ Add reference</button></div>';
  var rq=st.q.toLowerCase();
  h+='<div class="ad-main"><div class="ad-list">'+REFS.filter(function(r){return !rq||(r[0]+" "+r[1]).toLowerCase().indexOf(rq)>-1;}).map(function(r){return '<button type="button" role="option" data-sel="'+esc(r[0])+'" aria-selected="'+(st.sel===r[0])+'"><b>['+REFNUM[r[0]]+'] '+esc(r[0])+'</b><small>'+esc(r[1].slice(0,90))+'</small></button>';}).join("")+'</div><div class="ad-form">'+(st.sel!==null?refForm():'<p class="ad-empty">Select a reference to edit, or add a new one. Cite references in other forms by their KEY.</p>')+'</div></div>';
 }
 else if(st.tab==="draft"){
  h+='<div class="ad-pane"><p class="ad-help">Draft changes are already shown in the app on <b>this device only</b>, so you can check them. Users see them only after you <b>Publish</b>.</p>'+
   (draft.length?'<ol class="ad-log">'+draft.map(function(op,i){return '<li><div><b>'+esc(opTitle(op))+'</b><small>'+esc(op.group?gLabel(op.group):"References")+' · '+esc(op.reason)+'</small></div><button type="button" data-a="discard" data-i="'+i+'">Discard</button></li>';}).join("")+'</ol><p><button type="button" class="ad-danger" data-a="discardAll">Discard all drafts</button></p>':'<p class="ad-empty">No draft changes.</p>')+
   (errors.length?'<h3>Problems</h3><ul class="ad-err">'+errors.map(function(e){return '<li>'+esc((e.title?e.title+": ":"")+e.error)+'</li>';}).join("")+'</ul>':'')+'</div>';
 }
 else{
  var ch=published?published.changes.slice().reverse():[];
  h+='<div class="ad-pane"><p class="ad-help">The complete, append-only audit trail of published changes (newest first). <b>Undo</b> adds a reversing change to the draft; nothing is ever deleted from history.</p>'+
   (published&&published.base!==BASE?'<p class="ad-msg err">This pack was made for a different base release ('+esc(published.base)+'); review the changes after updating the module.</p>':'')+
   (ch.length?'<ol class="ad-log">'+ch.map(function(op){return '<li><div><b>'+esc(opTitle(op))+'</b><small>'+esc((op.at||"").slice(0,16).replace("T"," "))+' · '+esc(op.by||"—")+' · '+esc(op.reason)+'</small></div>'+(op.op!=="ref.put"||op.before?'<button type="button" data-a="undo" data-id="'+esc(op.id)+'">Undo</button>':'')+'</li>';}).join("")+'</ol>':'<p class="ad-empty">Nothing has been published yet; the verified base content is in use.</p>')+
   '<div class="ad-row"><button type="button" data-a="exportJs">Download content-pack.js</button><button type="button" data-a="exportJson">Download JSON</button><label class="ad-imp">Import pack (.json)<input type="file" accept="application/json,.json" data-f="import"></label></div></div>';
 }
 ui.innerHTML=h+'</div>';
}
function fieldset(label,inner){return '<fieldset class="ad-fs"><legend>'+esc(label)+'</legend>'+inner+'</fieldset>';}
function inp(label,f,val,attrs){return '<label class="ad-fl"><span>'+esc(label)+'</span><input data-f="'+f+'" value="'+esc(val)+'"'+(attrs||"")+'></label>';}
function area(label,f,val,hint,rows){return '<label class="ad-fl"><span>'+esc(label)+'</span><textarea data-f="'+f+'" rows="'+(rows||3)+'">'+esc(val)+'</textarea>'+(hint?'<em>'+esc(hint)+'</em>':'')+'</label>';}
function reasonBox(){return '<label class="ad-fl req"><span>Reason for change and source (required — recorded in the audit log)</span><textarea data-f="reason" rows="2" placeholder="e.g. IDSA 2026 update; P&amp;T approval 12/2026"></textarea></label>';}
function drugForm(){
 var g=st.g,isNew=st.sel==="",d=isNew?null:findDrug(g,st.sel),m=d?drugModel(g,d):{n:"",c:"",tag:"",src:"",cov:{},pn:{aw:null,po:null,warn:[],mon:[],ix:[],note:[]}};
 var classes={};drugsOf(g).forEach(function(x){classes[x.c]=1;});
 var rows=famsOf(g).map(function(f){var os=orgsOf(g).filter(function(o){return o.f===f;});if(!os.length)return "";
  return '<tr class="fam"><th colspan="4">'+esc(FAM[f]?FAM[f].name:f)+'</th></tr>'+os.map(function(o){var c=m.cov[o.id]||{s:"",t:"",r:[]};
   return '<tr data-org="'+esc(o.id)+'"><td>'+esc(g==="bac"?orgName(o):o.n)+'</td><td><select data-c="s" aria-label="Status for '+esc(o.n)+'"><option value="">Not covered</option><option value="active"'+(c.s==="active"?" selected":"")+'>Active</option><option value="first"'+(c.s==="first"?" selected":"")+'>First line</option><option value="limited"'+(c.s==="limited"?" selected":"")+'>Limited / conditional</option></select></td>'+
   '<td><input data-c="t" value="'+esc(c.t)+'" placeholder="Condition / note"'+(c.s==="first"||c.s==="limited"?'':' disabled')+' aria-label="Text for '+esc(o.n)+'"></td><td><input data-c="r" value="'+esc(refsStr(c.r))+'" placeholder="REF, REF" aria-label="References for '+esc(o.n)+'"></td></tr>';}).join("");}).join("");
 var p=m.pn;
 return '<form class="ad-f" data-form="drug" novalidate><h3>'+(isNew?"New drug — "+esc(gLabel(g)):esc(m.n))+'</h3>'+
  fieldset("Identity",inp("Name","n",m.n,' maxlength="120" required')+'<label class="ad-fl"><span>Class</span><input data-f="c" list="adCls" value="'+esc(m.c)+'" maxlength="80" required><datalist id="adCls">'+Object.keys(classes).map(function(c){return '<option value="'+esc(c)+'">';}).join("")+'</datalist></label>'+
   inp("Label shown under the name (optional)","tag",m.tag,' maxlength="120"')+(g==="bac"?inp("Source reference key (optional)","src",m.src,' maxlength="24"'):""))+
  fieldset("Coverage — one row per organism",'<div class="ad-tw"><table class="ad-cov"><thead><tr><th>Organism</th><th>Status</th><th>Condition / note</th><th>References</th></tr></thead><tbody>'+rows+'</tbody></table></div>')+
  fieldset("Pharmacist notes",(g==="bac"?'<label class="ad-fl"><span>WHO AWaRe</span><select data-f="aw"><option value="">Not confirmed</option>'+[["A","Access"],["W","Watch"],["R","Reserve"]].map(function(a){return '<option value="'+a[0]+'"'+(p.aw===a[0]?" selected":"")+'>'+a[1]+'</option>';}).join("")+'</select></label>':"")+
   inp(g==="bac"?"IV→PO switch note":"Oral use note","po",p.po?linesStr([p.po]):"",' placeholder="text [REF]"')+
   area("Boxed warning / safety alert","warn",linesStr(p.warn),"One point per line. End a line with [KEY, KEY] to cite references.")+
   area("Monitoring","mon",linesStr(p.mon))+area("Key interactions","ix",linesStr(p.ix))+area("Pharmacist points","note",linesStr(p.note)))+
  reasonBox()+'<div class="ad-row"><button type="submit" class="ad-save">Save to draft</button>'+(isNew?'':'<button type="button" class="ad-danger" data-a="delete">Remove drug</button>')+'</div></form>';
}
function orgForm(){
 var g=st.g,isNew=st.sel==="",o=isNew?null:findOrg(g,st.sel),m=o?orgModel(g,o):{id:"",n:"",sh:"",s:"",f:famsOf(g)[0],site:"",note:"",r:[]};
 return '<form class="ad-f" data-form="org" novalidate><h3>'+(isNew?"New organism — "+esc(gLabel(g)):esc(m.n))+'</h3>'+
  fieldset("Identity",inp("Name","n",m.n,' maxlength="120" required')+inp("Short name (matrix column)","sh",m.sh,' maxlength="60"')+inp("Subtitle","s",m.s,' maxlength="160"')+
   '<label class="ad-fl"><span>Family</span><select data-f="f">'+famsOf(g).map(function(f){return '<option value="'+f+'"'+(m.f===f?" selected":"")+'>'+esc(FAM[f]?FAM[f].name:f)+'</option>';}).join("")+'</select></label>'+
   (isNew?'':'<p class="ad-help">ID: <code>'+esc(m.id)+'</code> (fixed; used by coverage)</p>')+inp("Common sites","site",m.site,' maxlength="200"'))+
  fieldset(g==="bac"?"Current-guidance note (2026 view)":"Clinical note",area("Note","note",m.note,"",4)+inp("References for the note","r",refsStr(m.r),' placeholder="REF, REF"'))+
  '<p class="ad-help">Set which drugs cover this organism from each drug\'s form (Drugs tab).</p>'+
  reasonBox()+'<div class="ad-row"><button type="submit" class="ad-save">Save to draft</button>'+(isNew?'':'<button type="button" class="ad-danger" data-a="delete">Remove organism</button>')+'</div></form>';
}
function refForm(){
 var isNew=st.sel==="",m=isNew?{k:"",t:"",u:""}:refModel(st.sel);
 return '<form class="ad-f" data-form="ref" novalidate><h3>'+(isNew?"New reference":"["+REFNUM[m.k]+"] "+esc(m.k))+'</h3>'+
  fieldset("Citation",(isNew?inp("Key (capitals, e.g. IDSA_2027)","k",m.k,' maxlength="24"'):'')+area("Full citation","t",m.t,"Authors. Title. Journal/Issuer, year.",3)+inp("URL (https://, optional)","u",m.u,' inputmode="url"'))+
  reasonBox()+'<div class="ad-row"><button type="submit" class="ad-save">Save to draft</button></div></form>';
}
function val(form,f){var e=form.querySelector('[data-f="'+f+'"]');return e?e.value:"";}
function collect(form){
 var kind=form.getAttribute("data-form"),g=st.g,reason=val(form,"reason"),op;
 if(kind==="drug"){
  var cov={};Array.prototype.forEach.call(form.querySelectorAll("tr[data-org]"),function(tr){var s=tr.querySelector('[data-c="s"]').value;if(!s)return;
   cov[tr.getAttribute("data-org")]={s:s,t:s==="active"?"":tr.querySelector('[data-c="t"]').value,r:parseRefs(tr.querySelector('[data-c="r"]').value)};});
  var key=st.sel===""?null:st.sel,before=key?drugModel(g,findDrug(g,key)):null;
  op={op:"drug.put",group:g,key:key,before:before,reason:reason,value:{n:val(form,"n"),c:val(form,"c"),tag:val(form,"tag"),src:val(form,"src").toUpperCase(),cov:cov,
   pn:{aw:val(form,"aw")||null,awx:before?before.pn.awx:"",po:one(val(form,"po")),warn:parseLines(val(form,"warn")),mon:parseLines(val(form,"mon")),ix:parseLines(val(form,"ix")),note:parseLines(val(form,"note"))}}};
 }else if(kind==="org"){
  var okey=st.sel===""?null:st.sel,ob=okey?orgModel(g,findOrg(g,okey)):null;
  op={op:"org.put",group:g,key:okey,before:ob,reason:reason,value:{id:okey||slug(val(form,"n"),g),n:val(form,"n"),sh:val(form,"sh"),s:val(form,"s"),f:val(form,"f"),site:val(form,"site"),note:val(form,"note"),r:parseRefs(val(form,"r"))}};
 }else{
  var rk=st.sel===""?String(val(form,"k")).trim().toUpperCase():st.sel;
  if(st.sel===""&&refExists(rk))throw new Error("Reference key "+rk+" already exists");
  op={op:"ref.put",key:st.sel===""?null:st.sel,before:st.sel===""?null:refModel(st.sel),reason:reason,value:{k:rk,t:val(form,"t"),u:val(form,"u")}};
 }
 return op;
}
function say(t,ok){st.msg={t:t,ok:!!ok};}
/* show an error WITHOUT redrawing, so nothing the administrator typed is lost */
function flash(t){st.msg={t:t,ok:false};var m=ui.querySelector(".ad-msg");if(!m){m=document.createElement("div");var tabs=ui.querySelector(".ad-tabs");tabs.parentNode.insertBefore(m,tabs);}
 m.className="ad-msg err";m.setAttribute("role","alert");m.textContent=t;var f=ui.querySelector(".ad-form");if(f)f.scrollTop=0;}
function onClick(e){
 var t=e.target.closest?e.target.closest("button"):null;if(!t)return;
 if(t.hasAttribute("data-tab")){st.tab=t.getAttribute("data-tab");st.sel=null;st.q="";st.msg=null;draw();return;}
 if(t.hasAttribute("data-sel")){st.sel=t.getAttribute("data-sel");st.msg=null;draw();var f=ui.querySelector(".ad-form");if(f&&window.innerWidth<820)f.scrollIntoView();return;}
 var a=t.getAttribute("data-a");if(!a)return;
 if(a==="close"){closeConsole();return;}
 if(a==="new"){st.sel="";st.msg=null;draw();return;}
 if(a==="delete"){
  if(!t.getAttribute("data-armed")){t.setAttribute("data-armed","1");t.textContent="Tap again to confirm removal";return;}
  var form=ui.querySelector("form.ad-f"),reason=val(form,"reason");
  try{var kind=form.getAttribute("data-form"),g=st.g;
   addToDraft({op:kind==="drug"?"drug.del":"org.del",group:g,key:st.sel,before:kind==="drug"?drugModel(g,findDrug(g,st.sel)):orgModel(g,findOrg(g,st.sel)),reason:reason});
   say("Removal saved to draft. Publish to apply it for all users.",true);st.sel=null;}catch(err){flash(err.message);return;}
  draw();return;}
 if(a==="publish"){t.disabled=true;publish().then(function(r){say("Published version "+r.pack.version+(r.where==="server"?" to the Hulool server. All users receive it on their next load.":". The pack was sent to the Hulool app; for a bundled deployment, also download content-pack.js and replace js/content-pack.js."),true);draw();})
  .catch(function(err){say(err.message,false);draw();});return;}
 if(a==="discard"||a==="discardAll"){if(a==="discard")draft.splice(+t.getAttribute("data-i"),1);else draft=[];saveDraft();location.reload();return;}
 if(a==="undo"){var op=null;(published?published.changes:[]).forEach(function(o){if(o.id===t.getAttribute("data-id"))op=o;});if(!op)return;
  try{var inv;
   if(op.op==="drug.put")inv=op.before?{op:"drug.put",group:op.group,key:op.value.n,value:clone(op.before)}:{op:"drug.del",group:op.group,key:op.value.n};
   else if(op.op==="drug.del")inv={op:"drug.put",group:op.group,key:null,value:clone(op.before)};
   else if(op.op==="org.put")inv=op.before?{op:"org.put",group:op.group,key:op.value.id,value:clone(op.before)}:{op:"org.del",group:op.group,key:op.value.id};
   else if(op.op==="org.del")inv={op:"org.put",group:op.group,key:null,restore:true,value:clone(op.before)};
   else if(op.op==="ref.put")inv={op:"ref.put",key:op.value.k,value:clone(op.before)};
   inv.before=null;inv.reason="Undo of: "+opTitle(op)+" ("+(op.at||"").slice(0,10)+")";addToDraft(inv);say("Undo saved to draft.",true);}catch(err){say(err.message,false);}
  draw();return;}
 if(a==="exportJs"){var p=published||buildPack();download("content-pack.js",packJS(p),"text/javascript");post({source:"spectra",type:"export",format:"content-pack.js",data:packJS(p)});return;}
 if(a==="exportJson"){var pj=JSON.stringify(published||buildPack(),null,1);download("spectra-content-pack.json",pj,"application/json");post({source:"spectra",type:"export",format:"json",data:pj});return;}
}
function onChange(e){
 var f=e.target.getAttribute&&e.target.getAttribute("data-f");
 if(f==="group"){st.g=e.target.value;st.sel=null;st.msg=null;draw();return;}
 if(e.target.getAttribute("data-c")==="s"){var tr=e.target.closest("tr"),ti=tr.querySelector('[data-c="t"]');ti.disabled=!(e.target.value==="first"||e.target.value==="limited");return;}
 if(f==="import"){var file=e.target.files&&e.target.files[0];if(!file)return;var rd=new FileReader();rd.onload=function(){
  try{var p=JSON.parse(rd.result);if(!validPack(p))throw new Error("Not a Spectra content pack");if(published&&p.version<=published.version)throw new Error("This pack (v"+p.version+") is not newer than the published v"+published.version);
   var have={};(published?published.changes:[]).forEach(function(o){have[o.id]=1;});draft=draft.concat(p.changes.filter(function(o){return !have[o.id];}).map(function(o){return o;}));saveDraft();location.reload();}
  catch(err){say(err.message,false);draw();}};rd.readAsText(file);}
}
function onInput(e){if(e.target.getAttribute&&e.target.getAttribute("data-f")==="q"){st.q=e.target.value;var pos=e.target.selectionStart;draw();var q=ui.querySelector('[data-f="q"]');if(q){q.focus();try{q.setSelectionRange(pos,pos);}catch(x){}}}}
document.addEventListener("submit",function(e){
 var form=e.target;if(!ui||!ui.contains(form))return;e.preventDefault();
 try{var op=collect(form);addToDraft(op);
  if(op.op==="drug.put")st.sel=op.value.n;else if(op.op==="org.put")st.sel=op.value.id;else st.sel=op.value.k;
  say("Saved to draft and shown on this device. Publish to make it live for all users.",true);}
 catch(err){flash(err.message);return;}
 draw();var m=ui.querySelector(".ad-msg");if(m&&m.scrollIntoView)m.scrollIntoView({block:"nearest"});
},true);
})();
