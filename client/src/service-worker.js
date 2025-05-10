const CACHE_NAME = "blog-cache-v1";
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;

// Assets that should be cached on install
const urlsToCache = [
  "/",
  "/index.html",
  "/styles.css",
  "/script.js",
  "/images/logo.png",
  "/static/js/bundle.js",
];

// Check if a request is a navigation or asset request that should be cached
const isAssetRequest = (request) => {
  const url = new URL(request.url);
  return (
    request.method === "GET" &&
    (request.destination === "style" ||
     request.destination === "script" ||
     request.destination === "font" ||
     request.destination === "image" ||
     url.pathname.endsWith(".css") ||
     url.pathname.endsWith(".js") ||
     url.pathname.endsWith(".png") ||
     url.pathname.endsWith(".jpg") ||
     url.pathname.endsWith(".svg") ||
     url.pathname.endsWith(".ico"))
  );
};

// Install event - cache static assets
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing...");
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log("Service Worker: Caching Static Files");
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.error("Service Worker: Cache Failed", err);
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating...");
  
  // Get all cache names
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete any old caches that don't match our current cache names
          if (
            cacheName !== STATIC_CACHE &&
            cacheName !== DYNAMIC_CACHE
          ) {
            console.log("Service Worker: Deleting Old Cache", cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log("Service Worker: Activated");
      // Claim clients so the service worker is in control without reload
      return self.clients.claim();
    })
  );
});

// Fetch event - respond with cache then network strategy
self.addEventListener("fetch", (event) => {
  const request = event.request;
  
  // Don't cache POST requests or API calls
  if (
    request.method !== "GET" || 
    request.url.includes("/api/") ||
    request.url.includes("chrome-extension://")
  ) {
    return;
  }
  
  console.log("Service Worker: Fetching", request.url);
  
  event.respondWith(
    // Try the cache first
    caches.match(request)
      .then((cachedResponse) => {
        // Return the cached response if we have it
        if (cachedResponse) {
          console.log("Service Worker: Returning Cached Response", request.url);
          return cachedResponse;
        }

        // Otherwise, fetch from network
        return fetch(request)
          .then((networkResponse) => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              console.log("Service Worker: Not Caching Non-OK Response", request.url);
              return networkResponse;
            }

            // For assets, cache a copy of the response
            if (isAssetRequest(request)) {
              console.log("Service Worker: Caching Asset Response", request.url);
              const responseToCache = networkResponse.clone();
              caches.open(STATIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            } else if (request.mode === 'navigate') {
              // Cache HTML navigations in the dynamic cache
              console.log("Service Worker: Caching Navigation Response", request.url);
              const responseToCache = networkResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then((cache) => {
                  cache.put(request, responseToCache);
                });
            }

            return networkResponse;
          })
          .catch((error) => {
            console.error("Service Worker: Fetch Failed", error);
            
            // For navigation requests, try to return the offline page
            if (request.mode === 'navigate') {
              console.log("Service Worker: Returning Offline Page");
              return caches.match('/');
            }
            
            // Let the error propagate for other types of requests
            throw error;
          });
      })
  );
});

// Listen for messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
