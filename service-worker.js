/* global caches */
const CACHE_NAME = "photo-frame-tool-v2";
const APP_SHELL_ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./styles/main.css",
    "./scripts/main.js",
    "./scripts/core.js",
    "./scripts/services.js",
    "./scripts/ui.js",
    "./scripts/utils.js",
    "./assets/favicon/favicon.png"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL_ASSETS))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames
                .filter((name) => name !== CACHE_NAME)
                .map((name) => caches.delete(name))
        ))
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {
    if (event.request.method !== "GET") {
        return;
    }

    const requestUrl = new URL(event.request.url);
    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === "basic") {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                }
                return networkResponse;
            });
        }).catch(() => caches.match("./index.html"))
    );
});
