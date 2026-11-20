/* Spectra (Hulool 360°) UI layer.
   Adds: global search (all groups), theme switch, keyboard shortcuts, back-to-top.
   Reads app.js data and calls its render functions; it never changes clinical content. */
(function(){
"use strict";
function SMOOTH(){try{return window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth";}catch(e){return "smooth";}}
var $=function(id){return document.getElementById(id);};
var esc=function(s){return String(s==null?"":s).replace(/[&<>"']/g,function(m){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[m];});};
var norm=function(s){s=String(s||"").toLowerCase();return s.normalize?s.normalize("NFD").replace(/[̀-ͯ]/g,""):s;};

/* ---------- theme ---------- */
var root=document.documentElement;
function emit(n,d){try{document.dispatchEvent(new CustomEvent("spectra:"+n,{detail:d}));}catch(e){}}
try{var saved=localStorage.getItem("spectra-theme")||localStorage.getItem("bdn-theme");if(saved==="light"||saved==="dark")root.setAttribute("data-theme",saved);}catch(e){}
function isDark(){var t=root.getAttribute("data-theme");if(t)return t==="dark";return !!(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches);}
$("thm").addEventListener("click",function(){var next=isDark()?"light":"dark";root.setAttribute("data-theme",next);try{localStorage.setItem("spectra-theme",next);}catch(e){}emit("theme",{theme:next});});

/* ---------- global search index (built live from app.js data) ---------- */
function groupOrgs(g){return g==="bac"?(ver==="2026"?ORG.concat(ORG26):ORG):GROUPS[g].orgs;}
function groupDrugs(g){return g==="bac"?(ver==="2026"?DRUG26:DRUG):GROUPS[g].drugs;}
function oName(g,o){return g==="bac"?orgName(o):o.n;}
function oSub(g,o){return g==="bac"?orgSub(o):(o.s||"");}
function index(){
 var out=[];
 GORDER.forEach(function(g){
  var lab=GROUPS[g].label;
  groupOrgs(g).forEach(function(o){out.push({t:"org",g:g,id:o.id,name:oName(g,o),sub:(FAM[o.f]?FAM[o.f].name:"")+(oSub(g,o)?" · "+oSub(g,o):""),lab:lab,key:norm(oName(g,o)+" "+oSub(g,o)+" "+(o.sh||""))});});
  groupDrugs(g).forEach(function(d){out.push({t:"drug",g:g,id:d.n,name:d.n,sub:d.c,lab:lab,key:norm(d.n+" "+d.c)});});
 });
 return out;
}
var gs=$("gs"),gres=$("gres"),hits=[],sel=-1,st=null;
/* shorter placeholder on narrow phones so it is never cut off */
(function(){var full=gs.getAttribute("placeholder")||"";function fit(){gs.setAttribute("placeholder",window.innerWidth<420?"Search…":full);}fit();window.addEventListener("resize",fit);})();
function close(){gres.hidden=true;gs.setAttribute("aria-expanded","false");sel=-1;}
function paint(){
 gres.innerHTML=hits.length?hits.map(function(h,i){return '<button type="button" role="option" id="gr'+i+'" aria-selected="'+(i===sel)+'" data-i="'+i+'"><span class="t"><b>'+esc(h.name)+'</b><small>'+esc(h.sub)+'</small></span><span class="k">'+(h.t==="org"?"Organism":"Drug")+' · '+esc(h.lab)+'</span></button>';}).join(""):'<div class="none">No organism or drug matches. Try a class (e.g. “carbapenem”) or a shorter word.</div>';
 if(sel>=0)gs.setAttribute("aria-activedescendant","gr"+sel);else gs.removeAttribute("aria-activedescendant");
}
function search(){
 var q=norm(gs.value.trim());
 if(!q){close();return;}
 var all=index();
 hits=all.filter(function(h){return h.key.indexOf(q)>-1;}).sort(function(a,b){
  var as=norm(a.name).indexOf(q)===0?0:1,bs=norm(b.name).indexOf(q)===0?0:1;
  if(as!==bs)return as-bs;
  var ag=a.g===grp?0:1,bg=b.g===grp?0:1;if(ag!==bg)return ag-bg;
  return a.name.localeCompare(b.name);
 }).slice(0,30);
 sel=hits.length?0:-1;gres.hidden=false;gs.setAttribute("aria-expanded","true");paint();
 clearTimeout(st);var qq=gs.value.trim(),nn=hits.length;st=setTimeout(function(){emit("search",{q:qq,n:nn});},1200);
}
function tab(v){var b=document.querySelector('.tabs button[data-v="'+v+'"]');if(b)b.click();}
function go(h){
 if(!h)return;
 clearTimeout(st);emit("search-select",{q:gs.value.trim(),type:h.t,id:h.id,group:h.g,rank:hits.indexOf(h)+1,n:hits.length});
 if(grp!==h.g)setGroup(h.g);
 if(h.t==="org"){curOrg=h.id;renderOrgPanel();renderOrgDetail();tab("bug");scrollTo($("orgDetail"));}
 else{$("q").value="";curDrug=h.id;renderDrugList();renderDrugDetail();tab("drug");scrollTo($("drugDetail"));}
 gs.value="";close();gs.blur();
}
function scrollTo(el){
 var y=el.getBoundingClientRect().top+window.pageYOffset-84;
 if(window.innerWidth>=820){var c=document.querySelector(".ctrl");y=c.getBoundingClientRect().top+window.pageYOffset-80;}
 window.scrollTo({top:Math.max(0,y),behavior:SMOOTH()});
}
gs.addEventListener("input",search);
gs.addEventListener("focus",function(){if(gs.value.trim())search();});
gs.addEventListener("keydown",function(e){
 if(gres.hidden)return;
 if(e.key==="ArrowDown"){sel=Math.min(hits.length-1,sel+1);paint();e.preventDefault();}
 else if(e.key==="ArrowUp"){sel=Math.max(0,sel-1);paint();e.preventDefault();}
 else if(e.key==="Enter"){if(sel>=0)go(hits[sel]);e.preventDefault();}
 else if(e.key==="Escape"){close();}
});
gres.addEventListener("mousedown",function(e){e.preventDefault();});
gres.addEventListener("click",function(e){var b=e.target.closest?e.target.closest("button[data-i]"):null;if(b)go(hits[+b.dataset.i]);});
document.addEventListener("click",function(e){if(!e.target.closest||!e.target.closest(".gsw"))close();});
document.addEventListener("keydown",function(e){
 var t=e.target,typing=t&&(t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.isContentEditable);
 if(e.key==="/"&&!typing){e.preventDefault();gs.focus();}
});

/* ---------- tabs: arrow keys + keep the active view in sight ---------- */
var tabs=document.querySelector(".tabs");
tabs.addEventListener("keydown",function(e){
 if(e.key!=="ArrowRight"&&e.key!=="ArrowLeft")return;
 var bs=Array.prototype.slice.call(tabs.querySelectorAll("button")),i=bs.indexOf(document.activeElement);if(i<0)return;
 var n=bs[(i+(e.key==="ArrowRight"?1:bs.length-1))%bs.length];n.click();n.focus();e.preventDefault();
});
tabs.addEventListener("click",function(e){
 var b=e.target.closest?e.target.closest("button"):null;if(!b)return;
 var c=document.querySelector(".ctrl"),y=c.getBoundingClientRect().top+window.pageYOffset-70;
 if(window.pageYOffset>y)window.scrollTo({top:y,behavior:SMOOTH()});
});

/* ---------- back to top ---------- */
var tt=$("toTop");
window.addEventListener("scroll",function(){tt.classList.toggle("on",window.pageYOffset>700);},{passive:true});
tt.addEventListener("click",function(){window.scrollTo({top:0,behavior:SMOOTH()});});
})();
