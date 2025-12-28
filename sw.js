/* sw.js — PWA cache (robust offline, won't fail on missing files) */
'use strict';

const VERSION = 'v1.0.8';
const CACHE_NAME = `k2camperbox-${VERSION}`;

/**
 * IMPORTANT:
 * Add here ONLY what реально существует на сервере.
 * Если файла нет — всё равно не упадёт (мы кешируем по одному).
 */
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
  '/assets/gallery-6.jpg',
];

async function cacheIndividually(cache, urls){
  for(const url of urls){
    try{
      const req = new Request(url, { cache: 'reload' });
      const res = await fetch(req);
      if(res && res.ok) await cache.put(url, res.clone());
    }catch(e){
      // ignore missing or offline during install
    }
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cacheIndividually(cache, ASSETS);
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

/**
 * Strategy:
 * - navigation: network-first -> cached /index.html fallback
 * - static: cache-first -> network fallback
 */
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // Navigation requests
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      try{
        const res = await fetch(req);
        const copy = res.clone();
        const cache = await caches.open(CACHE_NAME);
        await cache.put('/index.html', copy);
        return res;
      }catch(e){
        const cached = await caches.match('/index.html');
        return cached || new Response('Offline', { status: 200, headers: { 'Content-Type':'text/plain; charset=utf-8' }});
      }
    })());
    return;
  }

  // Cache-first for assets
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    try{
      const res = await fetch(req);
      const copy = res.clone();
      const cache = await caches.open(CACHE_NAME);
      await cache.put(req, copy);
      return res;
    }catch(e){
      return cached || new Response('', { status: 504 });
    }
  })());
});
