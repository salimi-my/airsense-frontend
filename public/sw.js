const CACHE_VERSION = "v1";
const STATIC_CACHE = `static-assets-${CACHE_VERSION}`;
const PAGES_CACHE = `pages-${CACHE_VERSION}`;
const ALL_CACHES = [STATIC_CACHE, PAGES_CACHE];
const OFFLINE_URL = "/offline.html";

/** Immutable public assets — safe to precache at install time. */
const PRECACHE_STATIC = [
  OFFLINE_URL,
  "/manifest.webmanifest",
  "/airsense.png",
  "/favicons/icon-32x32.png",
  "/favicons/icon-180x180.png",
  "/favicons/icon-192x192.png",
  "/favicons/icon-512x512.png",
];

/** Public pages only — never precache authenticated routes. */
const PRECACHE_PAGES = ["/login"];

// ─── Lifecycle ───────────────────────────────────────────────────────────────

self.addEventListener("install", (event) => {
  event.waitUntil(precacheInstallAssets().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches
        .keys()
        .then((keys) =>
          Promise.all(
            keys
              .filter((key) => !ALL_CACHES.includes(key))
              .map((key) => caches.delete(key)),
          ),
        ),
    ]),
  );
});

// ─── Fetch ───────────────────────────────────────────────────────────────────

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/sanctum/") ||
    url.pathname.startsWith("/auth/")
  ) {
    return;
  }

  if (url.pathname.startsWith("/_next/static/")) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  if (
    url.pathname.startsWith("/favicons/") ||
    url.pathname.startsWith("/splash-screens/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/favicon.ico" ||
    url.pathname === OFFLINE_URL ||
    url.pathname === "/sw.js"
  ) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
    return;
  }

  event.respondWith(networkFirst(request, PAGES_CACHE));
});

// ─── Install precache ────────────────────────────────────────────────────────

async function precacheInstallAssets() {
  const staticCache = await caches.open(STATIC_CACHE);
  const pagesCache = await caches.open(PAGES_CACHE);

  const results = await Promise.allSettled([
    ...PRECACHE_STATIC.map((url) => precacheUrl(staticCache, url)),
    ...PRECACHE_PAGES.map((url) => precacheUrl(pagesCache, url)),
  ]);

  for (const result of results) {
    if (result.status === "rejected") {
      console.warn("[SW] Precache failed:", result.reason);
    }
  }
}

async function precacheUrl(cache, url) {
  const response = await fetch(url, { cache: "no-cache" });
  if (!response.ok) {
    throw new Error(`Failed to precache ${url}: ${response.status}`);
  }
  await cache.put(url, response);
}

// ─── Strategies ──────────────────────────────────────────────────────────────

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response("Asset unavailable offline", { status: 503 });
  }
}

function isNavigationRequest(request) {
  return (
    request.mode === "navigate" ||
    (request.headers.get("accept")?.includes("text/html") ?? false)
  );
}

async function networkFirst(request, cacheName) {
  const isNavigation = isNavigationRequest(request);

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    if (isNavigation) {
      const offlinePage = await caches.match(OFFLINE_URL);
      if (offlinePage) return offlinePage;
    }

    return new Response("You are offline", {
      status: 503,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
