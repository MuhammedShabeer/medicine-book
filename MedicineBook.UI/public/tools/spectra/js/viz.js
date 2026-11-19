/* Spectra (Hulool 360°) visual layer.
   Adds organism icons, drug-class badges, coverage rings and spectrum fingerprints.
   Everything inserted is decorative SVG / empty elements (aria-hidden, no text),
   so the verified wording rendered by app.js is unchanged. */
(function(){
"use strict";
function SMOOTH(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth";}catch(e){return "smooth";}}
var NS="http://www.w3.org/2000/svg";
/* 24×24 line icons (stroke = currentColor) */
var P={
 gpos:'<circle cx="8" cy="8" r="3"/><circle cx="15.5" cy="7" r="3"/><circle cx="11.5" cy="14" r="3"/><circle cx="18" cy="14.5" r="2.6"/><circle cx="6" cy="16.5" r="2.6"/>',
 gpbac:'<rect x="3" y="5" width="12" height="5.5" rx="2.75"/><rect x="9" y="13.5" width="12" height="5.5" rx="2.75"/>',
 gneg:'<rect x="3" y="8" width="13" height="7" rx="3.5"/><path d="M16 11.5c1.5-2 2.5 2 4 0s2-1 2-1"/>',
 gncc:'<path d="M11 6.5a5.5 5.5 0 1 0 0 11c-1.6-1.4-2.4-3.3-2.4-5.5s.8-4.1 2.4-5.5z"/><path d="M13 6.5a5.5 5.5 0 1 1 0 11c1.6-1.4 2.4-3.3 2.4-5.5s-.8-4.1-2.4-5.5z"/>',
 anae:'<rect x="2.5" y="9" width="12" height="6" rx="3"/><circle cx="18.5" cy="7" r="3.5"/><path d="M16 9.5l5-5"/>',
 atyp:'<path d="M6 7c3-3 8-2 11 0s3 7 0 10-9 3-11 0-3-7 0-10z"/><circle cx="10" cy="11" r="1.2"/><circle cx="14" cy="14" r="1"/>',
 spir:'<path d="M2 12c1.5-4 3.5-4 5 0s3.5 4 5 0 3.5-4 5 0 3.5 4 5 0"/>',
 yeast:'<circle cx="10" cy="13" r="6"/><circle cx="17.5" cy="7" r="3"/><circle cx="10" cy="13" r="1.5"/>',
 cryp:'<circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="8.5" stroke-dasharray="2 2.2"/>',
 mould:'<path d="M12 21V10M12 13l-5-5M12 11l5-5M7 8V4M17 6V3M12 10V6"/><circle cx="7" cy="3.5" r="1.5"/><circle cx="17" cy="2.8" r="1.3"/><circle cx="12" cy="5" r="1.4"/>',
 pjp:'<circle cx="12" cy="12" r="8"/><circle cx="9" cy="10" r="1.3"/><circle cx="14.5" cy="9.5" r="1.3"/><circle cx="12" cy="14.5" r="1.3"/><circle cx="16" cy="14" r="1.1"/>',
 herp:'<path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z"/><circle cx="12" cy="12" r="3"/>',
 resp:'<circle cx="12" cy="12" r="5.5"/><path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4M5.3 5.3l2.8 2.8M15.9 15.9l2.8 2.8M5.3 18.7l2.8-2.8M15.9 8.1l2.8-2.8"/>',
 hep:'<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3.2"/><path d="M12 5v-2M12 21v-2M5 12H3M21 12h-2"/>',
 retro:'<circle cx="12" cy="12" r="8"/><path d="M10 7.5l4 0 1.5 9h-7z"/>',
 pox:'<rect x="4" y="6" width="16" height="12" rx="4"/><path d="M8 12c1.5-2 3-2 4 0s2.5 2 4 0"/>',
 tb:'<rect x="2.5" y="10" width="7" height="4" rx="2"/><rect x="8.5" y="7" width="7" height="4" rx="2" transform="rotate(-20 12 9)"/><rect x="14.5" y="10.5" width="7" height="4" rx="2"/>',
 ntm:'<rect x="4" y="9" width="16" height="6" rx="3"/><circle cx="8.5" cy="12" r=".9"/><circle cx="12" cy="12" r=".9"/><circle cx="15.5" cy="12" r=".9"/>',
 mal:'<path d="M5 15c2-7 12-9 15-5-3-1-9 0-12 7z"/><circle cx="12" cy="12.5" r="1"/>',
 proto:'<path d="M5 9c2-4 7-5 10-3s6 2 5 6-3 3-4 6-6 3-8 0-5-5-3-9z"/><circle cx="11" cy="11" r="2"/>',
 helm:'<path d="M3 16c2-5 5-5 7-1s5 4 7-1 3-6 4-6"/><circle cx="21" cy="8" r=".8"/>',
 ecto:'<ellipse cx="12" cy="13" rx="4" ry="5"/><circle cx="12" cy="6.5" r="2"/><path d="M8.3 10L4 8M8 13H3.5M8.3 16L4 18M15.7 10L20 8M16 13h4.5M15.7 16L20 18"/>',
 /* groups */
 g_bac:'<rect x="3" y="8" width="13" height="7" rx="3.5"/><path d="M16 11.5c1.5-2 2.5 2 4 0"/><path d="M6 8V5M10 8V4.5M13 8V5"/>',
 g_fun:'<path d="M4 11a8 8 0 0 1 16 0z"/><path d="M10 11v7a2 2 0 0 0 4 0v-7"/>',
 g_vir:'<circle cx="12" cy="12" r="5"/><path d="M12 3v3.5M12 17.5V21M3 12h3.5M17.5 12H21M5.6 5.6l2.5 2.5M15.9 15.9l2.5 2.5M5.6 18.4l2.5-2.5M15.9 8.1l2.5-2.5"/>',
 g_myc:'<path d="M12 4v8M12 8c-3-2-6-1-7 3s-1 7 1 8 5-1 5-4V8M12 8c3-2 6-1 7 3s1 7-1 8-5-1-5-4V8"/>',
 g_par:'<path d="M3 15c2-5 5-5 7-1s5 4 7-1 3-5 4-5"/>',
 /* status */
 ok:'<path d="M5 12.5l4.5 4.5L19 7.5"/>',
 lim:'<path d="M12 4l9 16H3z"/><path d="M12 10v4M12 17v.5"/>',
 no:'<path d="M7 12h10"/>',
 star:'<path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 eye:'<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
 block:'<circle cx="12" cy="12" r="9"/><path d="M5.6 5.6l12.8 12.8"/>'
};
function svg(k,cls){var s=document.createElementNS(NS,"svg");s.setAttribute("viewBox","0 0 24 24");s.setAttribute("aria-hidden","true");s.setAttribute("focusable","false");
 s.setAttribute("class","ico"+(cls?" "+cls:""));s.innerHTML=P[k]||"";return s;}
function el(tag,cls){var e=document.createElement(tag);e.className=cls;e.setAttribute("aria-hidden","true");return e;}

/* drug-class short codes + hue */
var CODE={"Penicillins":"PEN","Cephalosporins":"CEP","Carbapenems":"CAR","Macrolides":"MAC","Tetracyclines":"TET","Fluoroquinolones":"FQ","Aminoglycosides":"AG","Polymyxins":"PMX","Lincosamides":"LIN","Glycopeptides":"GLY","Oxazolidinones":"OXZ","Other":"OTH","Monobactams":"MON","Newer agents (added 2026)":"NEW",
 "Azoles":"AZ","Polyenes":"PLY","Echinocandins":"ECH","Other antifungals":"OAF","Anti-Pneumocystis":"PJP",
 "Anti-herpes":"HSV","Anti-CMV":"CMV","Influenza":"FLU","COVID-19":"C19","Hepatitis B / HIV":"HBV","Hepatitis C":"HCV","HIV":"HIV","Other antivirals":"OAV",
 "First-line TB":"TB1","MDR-TB / second-line":"MDR","NTM agents":"NTM","Antimalarials":"MAL","Antiprotozoals":"PRO","Anthelmintics":"HEL","Topical":"TOP"};
function hue(name){var h=0;for(var i=0;i<name.length;i++)h=(h*31+name.charCodeAt(i))%360;return h;}
function code(name){return CODE[name]||name.replace(/[^A-Za-z ]/g,"").split(/\s+/).map(function(w){return w[0];}).join("").slice(0,3).toUpperCase();}
function badge(target,name){
 if(!target||target.hasAttribute("data-mono"))return;
 target.setAttribute("data-mono",code(name));target.classList.add("hasmono");
 target.style.setProperty("--mh",String(hue(name)));
}

/* lookups from app.js (globals) */
function orgsNow(){return ORGS();}
function drugsNow(){return DATA();}
function famOf(id){var o=orgById[id];return o?o.f:null;}
function famIcon(f){return P[f]?f:"atyp";}

/* ---------- decorators ---------- */
function decOrgPanel(){
 var ds=drugsNow(),max=1,cnt={};
 orgsNow().forEach(function(o){var n=ds.filter(function(d){return d.cov[o.id];}).length;cnt[o.id]=n;if(n>max)max=n;});
 Array.prototype.forEach.call(document.querySelectorAll("#orgPanel .fam"),function(fam){
  var h=fam.querySelector("h3"),first=fam.querySelector(".org");
  if(h&&first&&!h.querySelector(".ico")){var f=famOf(first.dataset.o);var sw=h.querySelector(".sw");var ic=svg(famIcon(f),"famico");if(sw)h.replaceChild(ic,sw);else h.insertBefore(ic,h.firstChild);}
 });
 Array.prototype.forEach.call(document.querySelectorAll("#orgPanel .org"),function(b){
  if(b.querySelector(".oico"))return;
  var f=famOf(b.dataset.o);var w=el("span","oico");w.appendChild(svg(famIcon(f)));if(FAM[f]){w.style.color="var("+FAM[f].c+")";w.style.background="var("+FAM[f].bg+")";}
  b.insertBefore(w,b.firstChild);
  var bar=el("span","obar");var i=el("i","");i.style.width=Math.round(100*(cnt[b.dataset.o]||0)/max)+"%";if(FAM[f])i.style.background="var("+FAM[f].c+")";bar.appendChild(i);
  var span=b.children[1];if(span)span.appendChild(bar);
 });
}
function decOrgDetail(){
 var hero=document.querySelector("#orgDetail .hero");
 if(hero&&!hero.querySelector(".hico")){var f=famOf(curOrg);var w=el("span","hico");w.appendChild(svg(famIcon(f)));if(FAM[f])w.style.color="var("+FAM[f].c+")";hero.appendChild(w);}
 Array.prototype.forEach.call(document.querySelectorAll("#orgDetail .cls h4"),function(h){badge(h,h.textContent);});
 Array.prototype.forEach.call(document.querySelectorAll("#orgDetail .drug"),function(d){
  if(d.querySelector(".dstat"))return;
  var k=d.querySelector(".pp")?"star":(d.querySelector(".qual")?"lim":"ok");
  var s=el("span","dstat s-"+k);s.appendChild(svg(k));d.insertBefore(s,d.firstChild);
 });
}
function fingerprint(d){
 var wrap=el("span","fp");
 famList().forEach(function(f){
  var os=orgsNow().filter(function(o){return o.f===f;});if(!os.length)return;
  var grp=el("span","fpg");grp.style.setProperty("--fc","var("+FAM[f].c+")");
  os.forEach(function(o){var v=d.cov[o.id];var c=el("i",v?(v.q?"lim":"on"):"");grp.appendChild(c);});
  wrap.appendChild(grp);
 });
 return wrap;
}
/* ---------- interactive fingerprint (drug page) ---------- */
function statusOf(v){if(!v)return{k:"off",label:"Not covered",text:"Not listed as active in this chart"};
 if(v===1)return{k:"on",label:"Active",text:""};
 if(v.q)return{k:"lim",label:"Conditional",text:v.q};
 if(v.p)return{k:"on",label:"Preferred",text:v.p};
 return{k:"on",label:"Active",text:""};}
function fingerprintWide(d,n,t){
 var box=document.createElement("div");box.className="fpx";
 var row=document.createElement("div");row.className="fp";row.setAttribute("role","group");
 row.setAttribute("aria-label","Spectrum fingerprint: "+n+" of "+t+" organism groups covered. Use arrow keys to move, Enter for details.");
 var idx=0;
 famList().forEach(function(f){
  var os=orgsNow().filter(function(o){return o.f===f;});if(!os.length)return;
  var g=document.createElement("span");g.className="fpg";g.style.setProperty("--fc","var("+FAM[f].c+")");
  os.forEach(function(o){var st=statusOf(d.cov[o.id]);
   var b=document.createElement("button");b.type="button";b.className="fq "+(st.k==="off"?"":st.k);
   b.setAttribute("data-o",o.id);b.setAttribute("data-i",String(idx++));b.tabIndex=idx===1?0:-1;
   b.setAttribute("aria-label",orgName(o)+" ("+FAM[f].name+"): "+st.label+(st.text?" — "+st.text:""));
   g.appendChild(b);});
  row.appendChild(g);
 });
 box.appendChild(row);
 var lg=document.createElement("div");lg.className="fplg";
 lg.innerHTML='<span><i class="k on"></i>Active</span><span><i class="k lim"></i>Conditional</span><span><i class="k"></i>Not covered</span><span class="hint">One square per organism group, in list order · tap a square for details</span>';
 box.appendChild(lg);
 return box;
}
var tip=null,tipFor=null,hoverOK=!!(window.matchMedia&&window.matchMedia("(hover:hover) and (pointer:fine)").matches);
function hideTip(){if(tip){tip.hidden=true;}if(tipFor){tipFor.setAttribute("aria-expanded","false");tipFor.classList.remove("cur");}tipFor=null;}
function cellFor(i){var cs=document.querySelectorAll("#drugDetail .ribbon .cell");return cs[i]||null;}
function showTip(b){
 var d=drugsNow().filter(function(x){return x.n===curDrug;})[0];var o=orgById[b.dataset.o];if(!d||!o)return;
 var st=statusOf(d.cov[o.id]);
 if(!tip){tip=document.createElement("div");tip.id="fptip";tip.className="fptip";tip.setAttribute("role","dialog");tip.setAttribute("aria-live","polite");tip.hidden=true;document.body.appendChild(tip);
  tip.addEventListener("click",function(e){var a=e.target.closest?e.target.closest("button"):null;if(!a)return;
   if(a.dataset.act==="close"){var f=tipFor;hideTip();if(f)f.focus();}
   if(a.dataset.act==="go"){var c=cellFor(+a.dataset.i);hideTip();if(c){c.scrollIntoView({behavior:SMOOTH(),block:"center"});c.classList.remove("flash");void c.offsetWidth;c.classList.add("flash");}}});}
 if(tipFor)tipFor.classList.remove("cur");
 tipFor=b;b.classList.add("cur");b.setAttribute("aria-expanded","true");
 var fam=FAM[o.f]?FAM[o.f].name:"";
 tip.innerHTML="";
 var h=document.createElement("div");h.className="tt-h";
 var nm=document.createElement("b");nm.textContent=orgName(o);var fm=document.createElement("small");fm.textContent=fam;
 h.appendChild(nm);h.appendChild(fm);
 var x=document.createElement("button");x.type="button";x.className="tt-x";x.dataset.act="close";x.setAttribute("aria-label","Close");x.textContent="×";h.appendChild(x);
 var s1=document.createElement("div");s1.className="tt-s s-"+st.k;s1.textContent=st.label;
 tip.appendChild(h);tip.appendChild(s1);
 if(st.text){var p=document.createElement("p");p.textContent=st.text;tip.appendChild(p);}
 var go=document.createElement("button");go.type="button";go.className="tt-go";go.dataset.act="go";go.dataset.i=b.dataset.i;go.textContent="Show on this page ↓";tip.appendChild(go);
 tip.style.setProperty("--fc","var("+(FAM[o.f]?FAM[o.f].c:"--accent")+")");
 tip.hidden=false;
 if(window.matchMedia("(max-width:760px)").matches){tip.classList.add("sheet");tip.style.left="";tip.style.top="";}
 else{tip.classList.remove("sheet");var r=b.getBoundingClientRect(),tw=tip.offsetWidth,th=tip.offsetHeight,vw=document.documentElement.clientWidth;
  var left=Math.max(8,Math.min(vw-tw-8,r.left+r.width/2-tw/2)),top=r.bottom+10;if(top+th>window.innerHeight-8)top=Math.max(8,r.top-th-10);
  tip.style.left=left+"px";tip.style.top=top+"px";}
 try{document.dispatchEvent(new CustomEvent("spectra:fingerprint",{detail:{drug:d.n,org:o.id,status:st.k}}));}catch(e){}
}
document.addEventListener("click",function(e){
 var b=e.target.closest?e.target.closest(".fpx .fq"):null;
 if(b){if(!hoverOK&&tipFor===b&&tip&&!tip.hidden)hideTip();else showTip(b);return;}
 if(tip&&!tip.hidden&&!(e.target.closest&&e.target.closest("#fptip")))hideTip();
});
document.addEventListener("keydown",function(e){
 if(e.key==="Escape"&&tip&&!tip.hidden){var f=tipFor;hideTip();if(f)f.focus();return;}
 var b=e.target.closest?e.target.closest(".fpx .fq"):null;if(!b)return;
 var all=Array.prototype.slice.call(document.querySelectorAll(".fpx .fq")),i=all.indexOf(b),j=-1;
 if(e.key==="ArrowRight"||e.key==="ArrowDown")j=Math.min(all.length-1,i+1);
 else if(e.key==="ArrowLeft"||e.key==="ArrowUp")j=Math.max(0,i-1);
 else if(e.key==="Home")j=0;else if(e.key==="End")j=all.length-1;
 if(j>=0){e.preventDefault();all.forEach(function(x){x.tabIndex=-1;});all[j].tabIndex=0;all[j].focus();if(tip&&!tip.hidden)showTip(all[j]);}
});
if(hoverOK){document.addEventListener("mouseover",function(e){var b=e.target.closest?e.target.closest(".fpx .fq"):null;if(b&&b!==tipFor)showTip(b);});}
window.addEventListener("resize",hideTip);
if(hoverOK){var ht=null;document.addEventListener("mouseout",function(e){var to=e.relatedTarget;
 if(!tipFor)return;if(to&&to.closest&&(to.closest(".fpx")||to.closest("#fptip")))return;
 clearTimeout(ht);ht=setTimeout(function(){if(document.activeElement&&document.activeElement.closest&&document.activeElement.closest("#fptip"))return;hideTip();},300);});
 document.addEventListener("mouseover",function(e){if(e.target.closest&&(e.target.closest(".fpx")||e.target.closest("#fptip")))clearTimeout(ht);});}
/* list legend (outside the app.js-rendered list) */
function decListLegend(){
 var dl=document.getElementById("drugList");if(!dl||document.getElementById("fplgList"))return;
 var lg=document.createElement("div");lg.id="fplgList";lg.className="fplg sm";lg.setAttribute("data-viz","");
 lg.innerHTML='<span><i class="k on"></i>Active</span><span><i class="k lim"></i>Conditional</span><span><i class="k"></i>Not covered</span><span class="hint">Squares = organism groups, in list order</span>';
 dl.parentNode.insertBefore(lg,dl);
}
function decDrugList(){
 var ds=drugsNow(),by={};ds.forEach(function(d){by[d.n]=d;});
 Array.prototype.forEach.call(document.querySelectorAll("#drugList > div"),function(h){badge(h,h.textContent);h.classList.add("dlh");});
 Array.prototype.forEach.call(document.querySelectorAll("#drugList .dl"),function(b){
  if(b.querySelector(".fp"))return;var d=by[b.dataset.d];if(!d)return;
  var span=b.querySelector("span");if(span)span.appendChild(fingerprint(d));
 });
}
/* add soft break points after "/" in long names (textContent unchanged) */
function wbr(node){Array.prototype.slice.call(node.childNodes).forEach(function(t){
 if(t.nodeType!==3||t.nodeValue.indexOf("/")<0)return;var parts=t.nodeValue.split("/"),f=document.createDocumentFragment();
 parts.forEach(function(x,i){f.appendChild(document.createTextNode(x+(i<parts.length-1?"/":"")));if(i<parts.length-1)f.appendChild(document.createElement("wbr"));});
 node.replaceChild(f,t);});}
function ring(n,total){
 var r=26,c=2*Math.PI*r,frac=total?n/total:0;
 var s=document.createElementNS(NS,"svg");s.setAttribute("viewBox","0 0 64 64");s.setAttribute("class","ring");s.setAttribute("aria-hidden","true");
 s.innerHTML='<circle cx="32" cy="32" r="'+r+'" class="rt"/><circle cx="32" cy="32" r="'+r+'" class="rv" stroke-dasharray="'+(c*frac).toFixed(1)+' '+c.toFixed(1)+'" transform="rotate(-90 32 32)"/>';
 return s;
}
function decDrugDetail(){
 hideTip();
 var d=drugsNow().filter(function(x){return x.n===curDrug;})[0];if(!d)return;
 var head=document.querySelector("#drugDetail > .panel");
 if(head&&!head.querySelector(".ring")){
  var n=Object.keys(d.cov).length,t=orgsNow().length;
  var right=head.children[1];if(right){right.classList.add("statbox");right.insertBefore(ring(n,t),right.firstChild);}
  var cls=head.children[0]&&head.children[0].children[0];if(cls)badge(cls,d.c);
  var h2=head.querySelector("h2");if(h2)wbr(h2);
  var fpw=document.createElement("div");fpw.className="fpwide";fpw.setAttribute("data-viz","");fpw.appendChild(fingerprintWide(d,n,t));head.appendChild(fpw);
 }
 Array.prototype.forEach.call(document.querySelectorAll("#drugDetail .rrow h3"),function(h){
  if(h.querySelector(".ico"))return;  var sw=h.querySelector(".sw");var f=null;
  orgsNow().some(function(o){if(FAM[o.f]&&FAM[o.f].name===h.textContent.trim()){f=o.f;return true;}return false;});
  var ic=svg(famIcon(f),"famico");if(sw)h.replaceChild(ic,sw);else h.insertBefore(ic,h.firstChild);
 });
 Array.prototype.forEach.call(document.querySelectorAll("#drugDetail .cell"),function(c){
  if(c.querySelector(".cst"))return;
  var on=c.classList.contains("on"),lim=on&&c.querySelector('.q[style*="--warn"]'),pref=on&&c.querySelector('.q[style*="--ok"]');
  var k=!on?"no":(lim?"lim":(pref?"star":"ok"));var s=el("span","cst s-"+k);s.appendChild(svg(k));c.insertBefore(s,c.firstChild);
 });
 var pn=document.querySelector("#drugDetail .pn");
 if(pn)Array.prototype.forEach.call(pn.querySelectorAll(".pns h4"),function(h){if(h.querySelector(".ico"))return;var t=h.textContent.toLowerCase();
  var k=h.parentNode.classList.contains("warn")?"lim":/monitor/.test(t)?"eye":/interaction/.test(t)?"link":/not active|not used/.test(t)?"block":"info";h.insertBefore(svg(k),h.firstChild);});
}
function decMatrix(){
 Array.prototype.forEach.call(document.querySelectorAll("#matrix tr.clsrow td"),function(td){badge(td,td.textContent);});
}
function decGroups(){
 Array.prototype.forEach.call(document.querySelectorAll("#grpRow button"),function(b){if(!b.querySelector(".ico"))b.insertBefore(svg("g_"+b.dataset.g),b.firstChild);});
}

/* run after every app.js render */
var MAP={orgPanel:decOrgPanel,orgDetail:decOrgDetail,drugList:decDrugList,drugDetail:decDrugDetail,matrix:decMatrix};
function safe(fn){try{fn();}catch(e){/* decoration is optional; never break the app */}}
Object.keys(MAP).forEach(function(id){
 var node=document.getElementById(id);if(!node)return;
 new MutationObserver(function(){safe(MAP[id]);}).observe(node,{childList:true});
 safe(MAP[id]);
});
safe(decGroups);safe(decListLegend);
})();
