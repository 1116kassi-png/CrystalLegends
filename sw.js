/* CRYSTAL LEGENDS service worker: offline play */
const CACHE = 'crystal-legends-v133'; // character images under assets/ are cached on first use
const FILES = ["./", "index.html", "style.css", "manifest.webmanifest", "icon.svg", "game.js"];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  // network-first (always fresh when online), cache fallback (offline play)
  e.respondWith(fetch(e.request).then(res => { if (res && (res.ok || res.type === 'opaque')) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); } return res; })
    .catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
