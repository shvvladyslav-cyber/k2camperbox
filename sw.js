const CACHE_NAME = "k2camperbox-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./favicon.ico",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);

    // addAll падает, если хотя бы 1 файла нет.
    // Поэтому кладём по одному и игнорируем отсутствующие.
    for (const url of ASSETS) {
      try { await cache.add(url); } catch (e) {}
    }

    self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)));
    self.clients.claim();
  })());
});

// Network-first для HTML (чтобы сайт всегда обновлялся), cache-first для остального
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // только наш origin
  if (url.origin !== location.origin) return;

  // Навигация (страницы)
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put("./", fresh.clone());
        return fresh;
      } catch (e) {
        const cached = await caches.match("./");
        return cached || caches.match("./index.html");
      }
    })());
    return;
  }

  // Остальные файлы
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    try {
      const fresh = await fetch(req);
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, fresh.clone());
      return fresh;
    } catch (e) {
      return cached;
    }
  })());
});
