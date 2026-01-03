/* sw.js — PWA cache (ultra-safe, no addAll crashes) */
'use strict';

const VERSION = 'v1.0.9';
const CACHE_NAME = `k2camperbox-${VERSION}`;

// IMPORTANT: list only what реально существует (если файла нет — он просто пропустится)
const ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/assets/logo.png',
  '/assets/revolut-qr.png',
  '/assets/gallery-1.jpg',
  '/assets/gallery-2.jpg',
  '/assets/gallery-3.jpg',
  '/assets/gallery-4.jpg',
  '/assets/gallery-5.jpg',
  '/assets/gallery-6.jpg'
];

// Add one-by-one so missing assets won't break install
async function safeCacheAll(cache, urls) {
  const results = await Promise.allSettled(
    urls.map(async (u) => {
      try {
        const req = new Request(u, { cache: 'reload' });
        const res = await fetch(req);
        if (res && res.ok) await cache.put(u, res.clone());
      } catch (_) {}
    })
  );
  return results;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await safeCacheAll(cache, ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Navigation: network-first -> fallback index.html
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put('/index.html', res.clone()).catch(()=>{});
        return res;
      } catch (_) {
        return (await caches.match('/index.html')) || Response.error();
      }
    })());
    return;
  }

  // Cache-first for static files
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    try {
      const res = await fetch(req);
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, res.clone()).catch(()=>{});
      return res;
    } catch (_) {
      // last resort: try to serve index for same-origin html
      if (req.headers.get('accept')?.includes('text/html')) {
        return (await caches.match('/index.html')) || Response.error();
      }
      return Response.error();
    }
  })());
});
