const CACHE_NAME = "undershows-static-v1";
const urlsToCache = [
  "/manifest.json",
  "/images/icons/icon-192x192-v2.png",
  "/images/icons/icon-512x512-v2.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  if (urlsToCache.includes(new URL(event.request.url).pathname)) {
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  }
});

