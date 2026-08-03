const CACHE = "pregnancy-clearly-__BUILD_ID__";
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
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "icons/apple-touch-icon.png",
].map(fromScope);
const BUILD_ASSETS = [/* BUILD_ASSETS */].map(fromScope);
const PRECACHE = [...new Set([...CORE, ...BUILD_ASSETS])];

const store = async (request, response) => {
  if (response.ok) {
    const cache = await caches.open(CACHE);
    await cache.put(request, response.clone());
  }
  return response;
};

const networkFirst = async (request, fallback) => {
  try {
    return await store(request, await fetch(request));
  } catch {
    return (
      (await caches.match(request)) ||
      (fallback ? await caches.match(fallback) : undefined) ||
      new Response("Offline", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(PRECACHE))
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
  if (event.request.mode === "navigate") {
    event.respondWith(networkFirst(event.request, fromScope("./")));
    return;
  }

  const requestUrl = new URL(event.request.url);
  const immutableAsset = requestUrl.pathname.includes("/assets/");
  if (immutableAsset) {
    event.respondWith(
      caches
        .match(event.request)
        .then(
          (cached) =>
            cached ||
            fetch(event.request).then((response) =>
              store(event.request, response),
            ),
        ),
    );
    return;
  }

  event.respondWith(networkFirst(event.request));
});
