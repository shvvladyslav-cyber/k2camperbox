const CACHE_NAME = "k2camperbox-v1";

const ASSETS = [
  "/", // главная
  "/index.html",
  "/manifest.json",
  "/favicon.ico",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Установка: кешируем по одному, чтобы не падало из-за 404
self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    for (const url of ASSETS) {
      try { await cache.add(url); } catch (e) {}
    }
    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
    self.clients.claim();
  })());
});

// Сеть сначала, если нет — из кеша
self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Не кешируем POST (твоя отправка в CRM)
  if (req.method !== "GET") return;

  event.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      return fresh;
    } catch (e) {
      const cached = await caches.match(req);
      return cached || new Response("Offline", { status: 200, headers: { "Content-Type": "text/plain; charset=utf-8" } });
    }
  })());
});
