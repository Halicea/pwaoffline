const staticCacheName = "staticCache";
const useCache = true;
const dataCacheName = "dataCache1";

const assets = [
  "/",
  "/index.html",
  "/index.js",
  "https://cdn.jsdelivr.net/pyodide/v0.17.0/full/pyodide.js",
];

self.addEventListener("install", () => {
  console.log("Just initialized from withing the service worker");
  caches.open(staticCacheName).then((cache) => cache.addAll(assets));
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) =>
            cacheName != staticCacheName && cacheName != dataCacheName
          )
          .map((cacheName) => caches.delete(cacheName)),
      )
    ),
  );
  console.log("service worker is activated");
});

self.addEventListener("fetch", (evt) => {
  if (!evt.request.url.startsWith("http")) return;
  evt.respondWith(
    caches.match(evt.request).then((response) => {
      if (useCache && response) return response;
      return caches.open(staticCacheName).then(async (cache) => {
        return fetch(evt.request).then((response) => {
          if (response.ok) {
            cache.put(evt.request, response.clone());
          }
          return response;
        });
      });
    }),
  );
});
