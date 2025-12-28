/* sw.js — PWA cache (robust / safe) */
'use strict';

const VERSION = 'v1.0.5';
const CACHE_NAME = `k2camperbox-${VERSION}`;

/**
 * Важно:
 * - Если какого-то файла нет (404), cache.addAll падал и SW не ставился.
 * - Здесь: кэшируем "best-effort" (не валим установку).
 */
const ASSETS = [
  '/',                // навигация
  '/index.html',
  '/manifest.json',
  '/styles.css',
  '/app.js',

  // эти файлы могут быть не у всех — но теперь это НЕ сломает install
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/assets/logo.png',
  '/assets/revolut-qr.png',
  '/assets/gallery-1.jpg',
  '/assets/gallery-2.jpg',
  '/assets/gallery-3.jpg',
  '/assets/gallery-4.jpg',
];

// best-effort caching (не падает на 404/Request failed)
async function cacheBestEffort(cache, urls) {
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      try {
        // cache.add делает fetch сам; но иногда "Request failed" (например, CORS/404)
        // поэтому используем явный fetch и только потом put
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res || !res.ok) throw new Error(`Skip ${url} (${res?.status})`);
        await cache.put(url, res.clone());
        return true;
      } catch (e) {
        return false;
      }
    })
  );
  return results;
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cacheBestEffort(cache, ASSETS);
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

// Сообщение для принудительного обновления
self.addEventListener('message', (event) => {
  if (event?.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Не трогаем чужие домены (шрифты Google и т.п.)
  if (url.origin !== self.location.origin) return;

  // Навигация: сеть -> кэш -> fallback index
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const copy = res.clone();
        const cache = await caches.open(CACHE_NAME);
        await cache.put('/index.html', copy);
        return res;
      } catch (e) {
        const cached = await caches.match('/index.html');
        return cached || new Response('Offline', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }

  // Остальное: кэш -> сеть -> (опционально) кладем в кэш
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    try {
      const res = await fetch(req);
      // кэшируем только успешные ответы
      if (res && res.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(req, res.clone());
      }
      return res;
    } catch (e) {
      return cached || new Response('', { status: 504 });
    }
  })());
});
