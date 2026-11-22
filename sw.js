// Версия приложения. При каждом обновлении поднимайте её здесь и в index.html (APP_VERSION).
const VERSION='1.2.0';
const CACHE='app-'+VERSION;
const FILES=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png','icon-maskable-512.png','apple-touch-icon.png'];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES.map(f=>new Request(f,{cache:'reload'})))));
});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('activate',e=>{
  // Удаляем только старые кэши самого приложения. Кэш словаря (ru-dict-v1) и данные пользователя не трогаем.
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('app-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request)));
});
