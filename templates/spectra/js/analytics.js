/* Spectra (Hulool 360°) — usage analytics and traceability layer.
   Records what is used (screens, organisms, drugs, searches, fingerprint taps, errors) as structured
   events, stamps each with the module and content version, and delivers them to the Hulool host
   (iframe postMessage, React Native WebView, Flutter channel and/or an HTTPS endpoint).
   A local, exportable log is kept on the device. No names, MRNs or free text that matched nothing
   are recorded. It observes the interface only and never changes clinical content. */
(function(){
"use strict";
var MV="1.0.0",CV="2026-11-17+0605d7f3df65",SCHEMA=1;
var D={enabled:true,endpoint:null,authHeader:null,batchSize:20,flushIntervalMs:15000,parentOrigin:"*",localLog:true,localLogMax:5000,
       logUnmatchedQueries:false,userId:null,role:null,site:null,appVersion:null};
var cfg=(window.SPECTRA_CONFIG&&window.SPECTRA_CONFIG.analytics)||{},C={},k;
for(k in D)C[k]=D[k];for(k in cfg)if(Object.prototype.hasOwnProperty.call(cfg,k))C[k]=cfg[k];

/* content version = verified base (date + app.js hash) + published local content pack, if any */
function cvNow(){try{var v=window.Spectra&&window.Spectra.content&&window.Spectra.content.version();return v?CV+"|pack-v"+v:CV;}catch(e){return CV;}}
/* ---------- small utils ---------- */
function clean(v,max){if(v==null)return null;v=String(v).replace(/[\u0000-\u001f]/g," ").trim();return v?v.slice(0,max||80):null;}
function cleanId(v){v=clean(v,64);return v&&/^[A-Za-z0-9._:@-]+$/.test(v)?v:null;}
function now(){return Date.now();}
function uuid(){
 try{if(window.crypto&&crypto.randomUUID)return crypto.randomUUID();}catch(e){}
 var b=new Uint8Array(16);try{crypto.getRandomValues(b);}catch(e){for(var i=0;i<16;i++)b[i]=Math.floor(Math.random()*256);}
 b[6]=(b[6]&15)|64;b[8]=(b[8]&63)|128;var h=[];for(var j=0;j<16;j++)h.push((b[j]+256).toString(16).slice(1));
 return h.slice(0,4).join("")+"-"+h.slice(4,6).join("")+"-"+h.slice(6,8).join("")+"-"+h.slice(8,10).join("")+"-"+h.slice(10).join("");
}
var LS={get:function(k){try{return window.localStorage.getItem(k);}catch(e){return null;}},set:function(k,v){try{window.localStorage.setItem(k,v);return true;}catch(e){return false;}},del:function(k){try{window.localStorage.removeItem(k);}catch(e){}}};
var SS={get:function(k){try{return window.sessionStorage.getItem(k);}catch(e){return null;}},set:function(k,v){try{window.sessionStorage.setItem(k,v);}catch(e){}}};
function readJSON(k){try{var v=JSON.parse(LS.get(k)||"null");return Array.isArray(v)?v:[];}catch(e){return [];}}

/* ---------- identity supplied by the host (URL or config); never personal data ---------- */
try{var qs=new URLSearchParams(window.location.search);
 if(!C.userId&&qs.get("uid"))C.userId=qs.get("uid");
 if(!C.role&&qs.get("role"))C.role=qs.get("role");
 if(!C.site&&qs.get("site"))C.site=qs.get("site");
 if(!C.appVersion&&qs.get("app"))C.appVersion=qs.get("app");
}catch(e){}
C.userId=cleanId(C.userId);C.role=clean(C.role,32);C.site=clean(C.site,32);C.appVersion=clean(C.appVersion,32);

/* ---------- session (new after 30 min idle) ---------- */
var IDLE=30*60*1000,sid=SS.get("spectra-sid"),last=+SS.get("spectra-last")||0,resumed=!!sid&&now()-last<IDLE;
if(!resumed)sid=uuid();SS.set("spectra-sid",sid);
var seq=+SS.get("spectra-seq")||0;if(!resumed)seq=0;

/* ---------- environment ---------- */
function device(){
 var w=Math.min(screen.width||0,screen.height||0)||window.innerWidth,coarse=!!(window.matchMedia&&matchMedia("(pointer:coarse)").matches);
 if(coarse&&w<600)return "mobile";if(coarse&&w<1100)return "tablet";return "desktop";
}
function os(){var u=navigator.userAgent||"";if(/iPhone|iPad|iPod/.test(u)||(/Macintosh/.test(u)&&navigator.maxTouchPoints>1))return "iOS";
 if(/Android/.test(u))return "Android";if(/Windows/.test(u))return "Windows";if(/Mac OS X/.test(u))return "macOS";if(/CrOS/.test(u))return "ChromeOS";if(/Linux/.test(u))return "Linux";return "other";}
function hostKind(){if(window.ReactNativeWebView)return "react-native";if(window.SpectraChannel||window.flutter_inappwebview)return "flutter";
 try{if(window.parent&&window.parent!==window)return "iframe";}catch(e){return "iframe";}return "web";}
var ENV={device:device(),os:os(),host:hostKind(),lang:(navigator.language||"").slice(0,12)};
function theme(){var t=document.documentElement.getAttribute("data-theme");if(t)return t;return window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";}
function tabNow(){var b=document.querySelector('.tabs button[aria-selected="true"]');return b?b.getAttribute("data-v"):null;}
function g(name){try{switch(name){case"grp":return grp;case"ver":return ver;case"curOrg":return curOrg;case"curDrug":return curDrug;}}catch(e){}return null;}
function orgLabel(id){try{var o=ORGS().filter(function(x){return x.id===id;})[0];if(!o)return id;try{return orgName(o);}catch(e){return o.n||id;}}catch(e){return id;}}

/* ---------- event store and delivery ---------- */
var log=C.localLog?readJSON("spectra-events"):[],outbox=C.endpoint?readJSON("spectra-outbox"):[],listeners=[],dirty=false,errCount=0;
function persist(){if(!dirty)return;dirty=false;
 if(C.localLog){if(log.length>C.localLogMax)log=log.slice(log.length-C.localLogMax);
  if(!LS.set("spectra-events",JSON.stringify(log))){log=log.slice(Math.floor(log.length/2));LS.set("spectra-events",JSON.stringify(log));}}
 if(C.endpoint){if(outbox.length>2000)outbox=outbox.slice(outbox.length-2000);LS.set("spectra-outbox",JSON.stringify(outbox));}
 SS.set("spectra-seq",String(seq));SS.set("spectra-last",String(now()));
}
setInterval(persist,2000);
function post(msg){
 var json;try{json=JSON.stringify(msg);}catch(e){return;}
 try{if(ENV.host==="iframe")window.parent.postMessage(msg,C.parentOrigin||"*");}catch(e){}
 try{if(window.ReactNativeWebView&&window.ReactNativeWebView.postMessage)window.ReactNativeWebView.postMessage(json);}catch(e){}
 try{if(window.SpectraChannel&&window.SpectraChannel.postMessage)window.SpectraChannel.postMessage(json);}catch(e){}
 try{if(window.flutter_inappwebview&&window.flutter_inappwebview.callHandler)window.flutter_inappwebview.callHandler("spectra",msg);}catch(e){}
}
function track(name,props){
 if(!C.enabled)return null;
 var t=now(),ev={v:SCHEMA,id:uuid(),ts:new Date(t).toISOString(),t:t,sid:sid,seq:++seq,uid:C.userId,role:C.role,site:C.site,
  name:clean(name,40),props:props||{},
  ctx:{mv:MV,cv:cvNow(),app:C.appVersion,tab:tabNow(),group:g("grp"),version:g("ver"),theme:theme(),
       device:ENV.device,os:ENV.os,host:ENV.host,lang:ENV.lang,vw:window.innerWidth,vh:window.innerHeight,online:navigator.onLine!==false}};
 if(C.localLog)log.push(ev);
 if(C.endpoint)outbox.push(ev);
 dirty=true;
 post({source:"spectra",type:"event",event:ev});
 for(var i=0;i<listeners.length;i++){try{listeners[i](ev);}catch(e){}}
 if(C.endpoint&&outbox.length>=C.batchSize)flush();
 return ev;
}

/* ---------- endpoint upload (batched, retried, survives reloads) ---------- */
var sending=false,backoff=0;
function flush(useBeacon){
 if(!C.endpoint||!outbox.length||sending)return;
 var batch=outbox.slice(0,Math.max(1,C.batchSize*(useBeacon?5:1))),body=JSON.stringify({module:"spectra",schema:SCHEMA,sent:new Date().toISOString(),events:batch});
 if(useBeacon&&!C.authHeader&&navigator.sendBeacon){
  try{if(navigator.sendBeacon(C.endpoint,new Blob([body],{type:"application/json"}))){outbox=outbox.slice(batch.length);dirty=true;persist();}}catch(e){}
  return;
 }
 if(!window.fetch)return;
 sending=true;var h={"Content-Type":"application/json"};if(C.authHeader)h.Authorization=C.authHeader;
 fetch(C.endpoint,{method:"POST",headers:h,body:body,keepalive:body.length<60000,credentials:"same-origin",mode:"cors"}).then(function(r){
  sending=false;if(!r.ok)throw new Error("HTTP "+r.status);
  var ids={};batch.forEach(function(e){ids[e.id]=1;});outbox=outbox.filter(function(e){return !ids[e.id];});backoff=0;dirty=true;persist();
  if(outbox.length>=C.batchSize)flush();
 }).catch(function(){sending=false;backoff=Math.min(backoff+1,6);});
}
if(C.endpoint){setInterval(function(){if(backoff&&Math.random()>1/backoff)return;flush();},Math.max(5000,C.flushIntervalMs));window.addEventListener("online",function(){backoff=0;flush();});}

/* ---------- what counts as a "screen" (with visible dwell time) ---------- */
var screenKey=null,screenAt=now(),screenProps=null,visibleMs=0,visSince=document.visibilityState==="hidden"?0:now(),nextVia=null;
function activeMs(){return visibleMs+(visSince?now()-visSince:0);}
var dwellBase=0;
function currentScreen(){
 var tab=tabNow();if(!tab)return null;
 var p={tab:tab,group:g("grp"),version:g("ver")};
 if(tab==="bug"&&g("curOrg")){p.item_type="organism";p.item_id=g("curOrg");p.item_name=orgLabel(p.item_id);}
 else if(tab==="drug"&&g("curDrug")){p.item_type="drug";p.item_id=g("curDrug");p.item_name=g("curDrug");}
 return p;
}
function checkScreen(){
 var p=currentScreen();if(!p)return;
 var key=[p.tab,p.group,p.version,p.item_id||""].join("|");if(key===screenKey)return;
 var a=activeMs();
 if(screenKey!==null)p.prev_dwell_ms=Math.max(0,a-dwellBase);
 p.via=nextVia||(screenKey===null?"default":"tap");nextVia=null;
 screenKey=key;dwellBase=a;screenProps=p;
 track("screen_view",p);
}
var pend=null;function soon(){clearTimeout(pend);pend=setTimeout(checkScreen,60);}
["orgDetail","drugDetail"].forEach(function(id){var n=document.getElementById(id);if(n)new MutationObserver(soon).observe(n,{childList:true});});

/* ---------- interface listeners ---------- */
document.addEventListener("click",function(e){
 var t=e.target;if(!t||!t.closest)return;
 var b=t.closest(".tabs button");if(b){soon();return;}
 b=t.closest("#grpRow button");if(b){track("group_change",{to:b.getAttribute("data-g")});soon();return;}
 b=t.closest("#verRow button");if(b){track("version_change",{to:b.getAttribute("data-ver")});soon();return;}
 var a=t.closest("a[href]");
 if(a&&/^https?:/i.test(a.href)){var u;try{u=new URL(a.href);}catch(x){u=null;}
  var li=a.closest("li[id^='ref-']");track("link_open",{host:u?u.host:null,path:u?u.pathname.slice(0,120):null,ref:li?li.id.slice(4):null});}
},true);
function qProps(q,n){var p={qlen:(q||"").length,n:n};if(n>0||C.logUnmatchedQueries)p.q=clean(q,80);return p;}
document.addEventListener("spectra:search",function(e){var d=e.detail||{};track(d.n?"search":"search_no_result",qProps(d.q,d.n));});
document.addEventListener("spectra:search-select",function(e){var d=e.detail||{};nextVia="search";
 var p=qProps(d.q,d.n);p.type=d.type;p.id=clean(d.id,80);p.target_group=d.group;p.rank=d.rank;track("search_select",p);});
document.addEventListener("spectra:fingerprint",function(e){var d=e.detail||{};track("fingerprint_tap",{drug:clean(d.drug,80),org:d.org,org_name:orgLabel(d.org),status:d.status});});
document.addEventListener("spectra:admin",function(e){var d=e.detail||{};track("admin_"+clean(d.action,20),{op:d.op||null,group:d.group||null,key:clean(d.key,120),version:d.version||null,changes:d.changes||null,where:d.where||null,role:d.role||null});});
document.addEventListener("spectra:content",function(e){var d=e.detail||{};track("content_loaded",{source:d.source,pack_id:d.id,pack_version:d.version,changes:d.changes,base_match:d.base_match});});
document.addEventListener("spectra:theme",function(e){track("theme_change",{to:(e.detail||{}).theme});});
var fq=null,fqT=null;
document.addEventListener("input",function(e){if(!e.target||e.target.id!=="q")return;fq=e.target.value;clearTimeout(fqT);
 fqT=setTimeout(function(){var q=(fq||"").trim();if(!q)return;var n=document.querySelectorAll("#drugList .dl").length;track(n?"drug_filter":"drug_filter_no_result",qProps(q,n));},1200);});

/* ---------- reliability: JavaScript errors and load performance ---------- */
function errEv(msg,src,line){if(errCount++>=20)return;track("js_error",{msg:clean(msg,200),file:src?String(src).split(/[?#]/)[0].split("/").pop().slice(0,60):null,line:line||null});}
window.addEventListener("error",function(e){if(e&&e.message)errEv(e.message,e.filename,e.lineno);});
window.addEventListener("unhandledrejection",function(e){var r=e&&e.reason;errEv("Unhandled promise: "+(r&&r.message?r.message:String(r)));});

/* ---------- visibility, pause and end of session ---------- */
function pause(reason){
 if(visSince){visibleMs+=now()-visSince;visSince=0;}
 track("session_pause",{reason:reason,active_ms:visibleMs,screen_dwell_ms:Math.max(0,visibleMs-dwellBase),screen:screenProps?{tab:screenProps.tab,item_type:screenProps.item_type||null,item_id:screenProps.item_id||null}:null});
 dirty=true;persist();flush(true);
}
document.addEventListener("visibilitychange",function(){
 if(document.visibilityState==="hidden")pause("hidden");
 else{if(!visSince)visSince=now();if(now()-(+SS.get("spectra-last")||0)>IDLE){sid=uuid();seq=0;SS.set("spectra-sid",sid);track("session_start",startProps(false));}else track("session_resume",{});}
});
window.addEventListener("pagehide",function(){if(document.visibilityState!=="hidden")pause("pagehide");});

function startProps(res){
 var p={resumed:res,screen_w:screen.width,screen_h:screen.height,dpr:window.devicePixelRatio||1,
  touch:navigator.maxTouchPoints||0,standalone:!!(window.matchMedia&&matchMedia("(display-mode: standalone)").matches),
  reduced_motion:!!(window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches),referrer_host:null};
 try{if(document.referrer)p.referrer_host=new URL(document.referrer).host;}catch(e){}
 try{var n=performance.getEntriesByType&&performance.getEntriesByType("navigation")[0];if(n){p.load_ms=Math.round(n.loadEventEnd||n.domComplete||0)||null;p.dom_ms=Math.round(n.domContentLoadedEventEnd||0)||null;}}catch(e){}
 return p;
}

/* ---------- reporting ---------- */
function events(){return log.slice();}
function count(arr,key){var m={};arr.forEach(function(x){var v=key(x);if(v==null||v==="")return;m[v]=(m[v]||0)+1;});
 return Object.keys(m).map(function(k){return [k,m[k]];}).sort(function(a,b){return b[1]-a[1]||(a[0]<b[0]?-1:1);});}
function summary(){
 var L=log,views=L.filter(function(e){return e.name==="screen_view";});
 var act=0,bySid={};L.forEach(function(e){if(e.name==="session_pause"&&e.props&&e.props.active_ms){bySid[e.sid]=Math.max(bySid[e.sid]||0,e.props.active_ms);}});
 Object.keys(bySid).forEach(function(s){act+=bySid[s];});
 return {
  module:"spectra",module_version:MV,content_version:cvNow(),generated:new Date().toISOString(),
  events:L.length,first:L.length?L[0].ts:null,last:L.length?L[L.length-1].ts:null,
  sessions:count(L,function(e){return e.sid;}).length,users:count(L,function(e){return e.uid;}).length,
  active_minutes:Math.round(act/600)/100,
  top_drugs:count(views,function(e){return e.props.item_type==="drug"?e.props.item_name:null;}).slice(0,15),
  top_organisms:count(views,function(e){return e.props.item_type==="organism"?e.props.item_name:null;}).slice(0,15),
  tabs:count(views,function(e){return e.props.tab;}),
  groups:count(views,function(e){return e.props.group;}),
  top_searches:count(L.filter(function(e){return e.name==="search_select";}),function(e){return e.props.q?e.props.q.toLowerCase():null;}).slice(0,15),
  searches_without_result:L.filter(function(e){return /no_result$/.test(e.name);}).length,
  fingerprint_taps:L.filter(function(e){return e.name==="fingerprint_tap";}).length,
  errors:L.filter(function(e){return e.name==="js_error";}).length,
  devices:count(L.filter(function(e){return e.name==="session_start";}),function(e){return e.ctx.device+" · "+e.ctx.os;}),
  hosts:count(L.filter(function(e){return e.name==="session_start";}),function(e){return e.ctx.host;})
 };
}
var COLS=["id","ts","sid","seq","uid","role","site","name","tab","group","version","item_type","item_id","item_name","via","prev_dwell_ms","q","qlen","n","device","os","host","vw","vh","theme","module_version","content_version","app_version","props"];
function csvCell(v){if(v==null)return "";v=String(v);if(/^[=+\-@\t\r]/.test(v))v="'"+v;return /[",\n\r]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;}
function exportCSV(){
 return "﻿"+COLS.join(",")+"\r\n"+log.map(function(e){var p=e.props||{},c=e.ctx||{};
  var row=[e.id,e.ts,e.sid,e.seq,e.uid,e.role,e.site,e.name,c.tab,c.group,c.version,p.item_type,p.item_id,p.item_name,p.via,p.prev_dwell_ms,p.q,p.qlen,p.n,c.device,c.os,c.host,c.vw,c.vh,c.theme,c.mv,c.cv,c.app,JSON.stringify(p)];
  return row.map(csvCell).join(",");}).join("\r\n");
}
function exportJSON(){return JSON.stringify({module:"spectra",module_version:MV,content_version:CV,schema:SCHEMA,exported:new Date().toISOString(),summary:summary(),events:log},null,1);}
function download(fmt){
 var csv=fmt==="csv",data=csv?exportCSV():exportJSON(),name="spectra-usage-"+new Date().toISOString().slice(0,10)+(csv?".csv":".json");
 post({source:"spectra",type:"export",format:csv?"csv":"json",filename:name,data:data});
 try{var a=document.createElement("a");a.href=URL.createObjectURL(new Blob([data],{type:csv?"text/csv;charset=utf-8":"application/json"}));a.download=name;
  document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},1500);}catch(e){}
 return name;
}
function clearLog(){log=[];LS.del("spectra-events");dirty=true;persist();}
function setUser(id,extra){C.userId=cleanId(id);if(extra){if(extra.role!=null)C.role=clean(extra.role,32);if(extra.site!=null)C.site=clean(extra.site,32);if(extra.appVersion!=null)C.appVersion=clean(extra.appVersion,32);}track("identify",{});}

/* ---------- host messages (iframe) ---------- */
window.addEventListener("message",function(e){
 var d=e.data;if(!d||typeof d!=="object"||d.source!=="hulool")return;
 if(C.parentOrigin&&C.parentOrigin!=="*"&&e.origin!==C.parentOrigin)return;
 try{if(e.source!==window.parent)return;}catch(x){return;}
 switch(d.type){
  case "spectra:setUser":setUser(d.userId,d);break;
  case "spectra:getEvents":post({source:"spectra",type:"events",requestId:d.requestId||null,summary:summary(),events:events()});break;
  case "spectra:getSummary":post({source:"spectra",type:"summary",requestId:d.requestId||null,summary:summary()});break;
  case "spectra:flush":flush();break;
  case "spectra:clear":clearLog();break;
  case "spectra:openPanel":openPanel();break;
  case "spectra:setEnabled":C.enabled=!!d.enabled;break;
 }
});

/* ---------- usage panel (opened by the host, or ?spectra-admin=1) ---------- */
var panel=null,lastFocus=null;
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m];});}
function list(title,rows){return '<section><h3>'+esc(title)+'</h3>'+(rows.length?'<ol>'+rows.map(function(r){return '<li><span>'+esc(r[0])+'</span><b>'+r[1]+'</b></li>';}).join("")+'</ol>':'<p class="none">No data yet</p>')+'</section>';}
function renderPanel(){
 var s=summary();
 panel.querySelector(".sp-body").innerHTML=
  '<div class="sp-kpis">'+[["Events",s.events],["Sessions",s.sessions],["Users",s.users],["Active min",s.active_minutes],["No-result searches",s.searches_without_result],["Errors",s.errors]].map(function(k){return '<div><b>'+esc(k[1])+'</b><span>'+esc(k[0])+'</span></div>';}).join("")+'</div>'+
  '<p class="sp-meta">Module '+esc(MV)+' · content '+esc(CV)+' · '+(s.first?esc(s.first.slice(0,10))+' → '+esc(s.last.slice(0,10)):'no events')+' · stored on this device'+(C.endpoint?' and sent to the Hulool endpoint':'')+'</p>'+
  '<div class="sp-grid">'+list("Most viewed drugs",s.top_drugs)+list("Most viewed organisms",s.top_organisms)+list("Views by section",s.tabs)+list("Views by drug group",s.groups)+list("Top searches (matched)",s.top_searches)+list("Devices",s.devices)+'</div>';
}
function openPanel(){
 if(!panel){
  panel=document.createElement("div");panel.className="sp-panel";panel.setAttribute("role","dialog");panel.setAttribute("aria-modal","true");panel.setAttribute("aria-labelledby","spTitle");panel.hidden=true;
  panel.innerHTML='<div class="sp-card"><div class="sp-head"><h2 id="spTitle">Spectra usage</h2><button type="button" class="sp-x" data-a="close" aria-label="Close usage panel">×</button></div>'+
   '<div class="sp-body"></div><div class="sp-actions"><button type="button" data-a="csv">Export CSV</button><button type="button" data-a="json">Export JSON</button>'+(C.endpoint?'<button type="button" data-a="flush">Send now</button>':'')+'<button type="button" data-a="clear" class="sp-danger">Clear log</button></div></div>';
  document.body.appendChild(panel);
  panel.addEventListener("click",function(e){var b=e.target.closest?e.target.closest("button[data-a]"):null;if(e.target===panel){closePanel();return;}if(!b)return;var a=b.getAttribute("data-a");
   if(a==="close")closePanel();else if(a==="csv"||a==="json")download(a);else if(a==="flush")flush();
   else if(a==="clear"){if(b.getAttribute("data-armed")){clearLog();b.removeAttribute("data-armed");b.textContent="Clear log";renderPanel();}else{b.setAttribute("data-armed","1");b.textContent="Tap again to clear";}}});
  panel.addEventListener("keydown",function(e){if(e.key==="Escape"){closePanel();return;}
   if(e.key==="Tab"){var f=panel.querySelectorAll("button"),a=f[0],z=f[f.length-1];if(e.shiftKey&&document.activeElement===a){z.focus();e.preventDefault();}else if(!e.shiftKey&&document.activeElement===z){a.focus();e.preventDefault();}}});
 }
 persist();renderPanel();lastFocus=document.activeElement;panel.hidden=false;document.documentElement.classList.add("sp-open");panel.querySelector(".sp-x").focus();
}
function closePanel(){if(!panel)return;panel.hidden=true;document.documentElement.classList.remove("sp-open");if(lastFocus&&lastFocus.focus)lastFocus.focus();}

/* ---------- public API for the Hulool host ---------- */
window.Spectra=window.Spectra||{};
window.Spectra.version=MV;Object.defineProperty(window.Spectra,"contentVersion",{get:cvNow,configurable:true});
window.Spectra.analytics={track:function(n,p){return track(n,p&&typeof p==="object"?p:{});},events:events,summary:summary,exportCSV:exportCSV,exportJSON:exportJSON,download:download,
 clear:clearLog,flush:function(){flush();},setUser:setUser,openPanel:openPanel,closePanel:closePanel,
 setEnabled:function(v){C.enabled=!!v;},config:function(){var o={};for(var k in C)o[k]=C[k];return o;},
 on:function(fn){if(typeof fn==="function")listeners.push(fn);return function(){listeners=listeners.filter(function(f){return f!==fn;});};}};

/* ---------- start ---------- */
track("session_start",startProps(resumed));
post({source:"spectra",type:"ready",version:MV,contentVersion:CV});
soon();
try{if(new URLSearchParams(window.location.search).get("spectra-admin")==="1")setTimeout(openPanel,300);}catch(e){}
})();
