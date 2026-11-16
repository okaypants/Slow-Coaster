// Slow Coaster: offline shell. Network first, cache as fallback, so a new push shows up on the next online visit.
const CACHE = 'slow-coaster-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png'];
const FONT_CSS = 'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;700&display=swap';
const isFont = url => url.startsWith('https://fonts.googleapis.com/') || url.startsWith('https://fonts.gstatic.com/');

// the title font comes from Google Fonts: keep its stylesheet and the files it names, so the look survives offline
async function cacheFont(c) {
  try {
    const res = await fetch(FONT_CSS);
    if (!res.ok) return;
    const css = await res.clone().text();
    await c.put(FONT_CSS, res);
    const files = [...new Set((css.match(/https:\/\/fonts\.gstatic\.com\/[^)'"\s]+/g) || []))];
    await Promise.all(files.map(u => fetch(u).then(r => r.ok && c.put(u, r)).catch(() => {})));
  } catch (e) {}
}

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).then(() => cacheFont(c))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (e.request.method !== 'GET' || !(url.startsWith(self.location.origin) || isFont(url))) return;
  e.respondWith(
    fetch(e.request).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request, { ignoreVary: true }).then(r => r || (e.request.mode === 'navigate' ? caches.match('./index.html') : Response.error())))
  );
});
