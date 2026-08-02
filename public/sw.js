const CACHE = "pregnancy-clearly-v4";
const fromScope = (path) => new URL(path, self.registration.scope).toString();
const CORE = [
  "./",
  "getting-pregnant/",
  "timeline/",
  "essentials/",
  "urgent-help/",
  "manifest.webmanifest",
].map(fromScope);

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.method !== "GET" ||
    new URL(event.request.url).origin !== self.location.origin
  )
    return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok)
          caches
            .open(CACHE)
            .then((cache) => cache.put(event.request, response.clone()));
        return response;
      })
      .catch(() =>
        caches
          .match(event.request)
          .then((cached) => cached || caches.match(fromScope("./"))),
      ),
  );
});
