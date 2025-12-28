/* sw.js — PWA cache (safe version, fixed) */
'use strict';

const VERSION = 'v1.0.5';
const CACHE_NAME = `k2camperbox-${VERSION}`;

// Кэшируем только то, что реально существует на сайте
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/styles.css',
  '/app.js',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/assets/logo.png',
  '/assets/revolut-qr.png',
  '/assets/gallery-1.jpg',
  '/assets/gallery-2.jpg',
  '/assets/gallery-3.jpg',
  '/assets/gallery-4.jpg',
].filter(Boolean);

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // reload: чтобы не схватить старые ответы из HTTP cache браузера
      await cache.addAll(ASSETS.map((u) => new Request(u, { cache: 'reload' })));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())));
      await self.clients.claim();
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Не вмешиваемся в расширения/кросс-доменные запросы
  if (url.origin !== self.location.origin) return;

  // Навигация — сеть сначала, потом fallback на index.html
  if (req.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          const cache = await caches.open(CACHE_NAME);
          cache.put('/index.html', res.clone());
          return res;
        } catch {
          const cached = await caches.match('/index.html');
          return cached || new Response('Offline', { status: 200, headers: { 'Content-Type': 'text/plain' } });
        }
      })()
    );
    return;
  }

  // Статика — cache-first
  event.respondWith(
    (async () => {
      const cached = await caches.match(req);
      if (cached) return cached;

      try {
        const res = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put(req, res.clone()).catch(() => {});
        return res;
      } catch {
        return new Response('', { status: 504 });
      }
    })()
  );
});
