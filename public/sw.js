const CACHE = "pregnancy-clearly-v7";
const fromScope = (path) => new URL(path, self.registration.scope).toString();
const CORE = [
  "./",
  "getting-pregnant/",
  "timeline/",
  "timeline/after-birth/",
  "essentials/",
  "essentials/food-dishes/",
  "essentials/drinks-caffeine/",
  "essentials/exercise-movement/",
  "essentials/medicines-supplements/",
  "essentials/everyday-home/",
  "essentials/work-lifting/",
  "essentials/travel/",
  "essentials/sex-relationships/",
  "essentials/sleep-comfort/",
  "essentials/appointments-warning-signs/",
  "essentials/common-symptoms/",
  "essentials/dental-skin-personal-care/",
  "essentials/infections-vaccinations/",
  "essentials/mental-health-safety/",
  "essentials/health-conditions-accessibility/",
  "essentials/pregnancy-complications/",
  "essentials/loss-uncertainty-support/",
  "essentials/birth-newborn-preparation/",
  "urgent-help/",
  "data/search-manifest.json",
  "data/search/core.json",
  "data/search/everyday.json",
  "data/search/care.json",
  "data/search/planning.json",
  "data/search-index.json",
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
