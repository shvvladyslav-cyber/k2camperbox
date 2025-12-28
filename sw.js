/* sw.js — PWA cache (stable, no template literals) */
'use strict';

var VERSION = 'v1.0.5'; // поменяй версию — чтобы обновление точно прилетело
var CACHE_NAME = 'k2camperbox-' + VERSION;

var ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) { return cache.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys()
      .then(function (keys) {
        return Promise.all(
          keys.map(function (k) { return (k !== CACHE_NAME) ? caches.delete(k) : Promise.resolve(); })
        );
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (event) {
  var req = event.request;
  if (req.method !== 'GET') return;

  // HTML навигация: сначала сеть, fallback на кэш
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          caches.open(CACHE_NAME).then(function (c) { c.put('/index.html', copy); });
          return res;
        })
        .catch(function () { return caches.match('/index.html'); })
    );
    return;
  }

  // Остальное: cache-first
  event.respondWith(
    caches.match(req).then(function (cached) {
      if (cached) return cached;
      return fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_NAME).then(function (c) { c.put(req, copy); })["catch"](function () {});
        return res;
      });
    })
  );
});
