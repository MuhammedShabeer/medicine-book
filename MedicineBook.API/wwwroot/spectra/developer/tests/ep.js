// QA server: analytics events + content packs (publish requires the sysadmin token; versions must increase by 1)
const http=require('http');const got=[];let pack=null;const pubs=[];
http.createServer((q,r)=>{r.setHeader('Access-Control-Allow-Origin',q.headers.origin||'*');r.setHeader('Access-Control-Allow-Credentials','true');r.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');r.setHeader('Access-Control-Allow-Methods','GET, POST, OPTIONS');
 if(q.method==='OPTIONS'){r.writeHead(204);return r.end();}
 if(q.url.startsWith('/content')){
  if(q.method==='GET'){if(q.url==='/content/log'){r.writeHead(200,{'Content-Type':'application/json'});return r.end(JSON.stringify(pubs));}
   if(!pack){r.writeHead(404);return r.end();}r.writeHead(200,{'Content-Type':'application/json'});return r.end(JSON.stringify(pack));}
  let b='';q.on('data',c=>b+=c);q.on('end',()=>{
   if(q.headers.authorization!=='Bearer admintok'){pubs.push({rejected:401});r.writeHead(401);return r.end();}
   let p;try{p=JSON.parse(b);}catch(e){r.writeHead(400);return r.end();}
   if((pack?pack.version:0)+1!==p.version){pubs.push({rejected:409});r.writeHead(409);return r.end();}
   pack=p;pubs.push({ok:p.version,n:p.changes.length});r.writeHead(200);r.end('{}');});return;}
 if(q.method==='GET'){r.writeHead(200,{'Content-Type':'application/json'});return r.end(JSON.stringify(got));}
 let b='';q.on('data',c=>b+=c);q.on('end',()=>{try{const j=JSON.parse(b);got.push({auth:q.headers.authorization||null,n:j.events.length,names:j.events.map(e=>e.name)});}catch(e){got.push({bad:1});}r.writeHead(200);r.end('ok');});
}).listen(8769);
