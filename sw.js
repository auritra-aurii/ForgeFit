const C='forgefit-v7',A=['./','index.html','styles.css','app.js','manifest.json','icon.png'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>c.addAll(A)))});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=C&&x!='ff-media').map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
 if(/raw\.githubusercontent\.com|cdn\.jsdelivr\.net/.test(e.request.url)){e.respondWith(caches.open('ff-media').then(c=>c.match(e.request).then(r=>r||fetch(e.request).then(n=>{c.put(e.request,n.clone());return n}))));return}
 e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
