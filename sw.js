// sw.js - Service Worker per AI Toolkit Directory PWA

const CACHE_NAME = 'ai-tools-v1.2.0';
const STATIC_CACHE = 'static-v1.2.0';
const DYNAMIC_CACHE = 'dynamic-v1.2.0';

// File da cacheare immediatamente
const STATIC_FILES = [
  '/',
  '/index.html',
  '/suggest-tool.html',
  '/css/styles.css',
  '/js/app.js',
  '/js/enhanced-app.js',
  '/data/ai-tools.json',
  '/manifest.json',
  // Icone essenziali
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Font e risorse esterne essenziali
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

// File da cacheare dinamicamente
const DYNAMIC_FILES_PATTERNS = [
  /^https:\/\/logo\.clearbit\.com\//,
  /^https:\/\/fonts\.googleapis\.com\//,
  /^https:\/\/fonts\.gstatic\.com\//
];

// Strategie di cache
const CACHE_STRATEGIES = {
  // Cache First - per risorse statiche
  cacheFirst: [
    /\.(?:js|css|png|jpg|jpeg|svg|gif|ico|woff|woff2)$/,
    /^https:\/\/fonts\./,
    /^https:\/\/logo\.clearbit\.com\//
  ],
  
  // Network First - per contenuti dinamici
  networkFirst: [
    /\/api\//,
    /\.json$/
  ],
  
  // Stale While Revalidate - per HTML
  staleWhileRevalidate: [
    /\.html$/,
    /\/$/
  ]
};

// Install event - caching delle risorse statiche
self.addEventListener('install', (event) => {
  console.log('[SW] Install event');
  
  event.waitUntil(
    Promise.all([
      // Cache risorse statiche
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('[SW] Caching static files');
        return cache.addAll(STATIC_FILES);
      }),
      
      // Skip waiting per aggiornamenti immediati
      self.skipWaiting()
    ])
  );
});

// Activate event - pulizia cache vecchie
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate event');
  
  event.waitUntil(
    Promise.all([
      // Pulizia cache obsolete
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && 
                cacheName !== DYNAMIC_CACHE && 
                cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Claim clients per controllo immediato
      self.clients.claim()
    ])
  );
});

// Fetch event - gestione richieste di rete
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip richieste non GET e extension
  if (request.method !== 'GET' || 
      url.protocol === 'chrome-extension:' ||
      url.protocol === 'moz-extension:') {
    return;
  }
  
  event.respondWith(
    handleFetchRequest(request)
  );
});

// Gestione strategia di fetch
async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Determina la strategia di cache
    const strategy = getCacheStrategy(request.url);
    
    switch (strategy) {
      case 'cacheFirst':
        return await cacheFirst(request);
      case 'networkFirst':
        return await networkFirst(request);
      case 'staleWhileRevalidate':
        return await staleWhileRevalidate(request);
      default:
        return await networkFirst(request);
    }
  } catch (error) {
    console.error('[SW] Fetch error:', error);
    return await handleFetchError(request);
  }
}

// Determina strategia di cache
function getCacheStrategy(url) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pattern.test(url))) {
      return strategy;
    }
  }
  return 'networkFirst';
}

// Cache First Strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Aggiorna cache in background
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  await cacheResponse(request, networkResponse.clone());
  return networkResponse;
}

// Network First Strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache solo risposte valide
    if (networkResponse.ok) {
      await cacheResponse(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // Fetch in background
  const networkResponsePromise = fetch(request).then(async (response) => {
    if (response.ok) {
      await cacheResponse(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  // Ritorna cache se disponibile, altrimenti aspetta network
  return cachedResponse || await networkResponsePromise;
}

// Cache response helper
async function cacheResponse(request, response) {
  if (!response || !response.ok || response.status === 206) {
    return;
  }
  
  const url = new URL(request.url);
  const cacheName = getDynamicCacheName(url);
  const cache = await caches.open(cacheName);
  
  return cache.put(request, response);
}

// Get appropriate cache name
function getDynamicCacheName(url) {
  if (DYNAMIC_FILES_PATTERNS.some(pattern => pattern.test(url.href))) {
    return DYNAMIC_CACHE;
  }
  return STATIC_CACHE;
}

// Background cache update
async function updateCacheInBackground(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cacheResponse(request, response);
    }
  } catch (error) {
    // Silent fail per update in background
  }
}

// Error handling
async function handleFetchError(request) {
  const url = new URL(request.url);
  
  // Fallback per pagine HTML
  if (request.destination === 'document') {
    const cachedResponse = await caches.match('/index.html');
    if (cachedResponse) {
      return cachedResponse;
    }
  }
  
  // Fallback per immagini
  if (request.destination === 'image') {
    return new Response(
      '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f0f0f0"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="#999">No Image</text></svg>',
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
  
  // Fallback generico
  return new Response('Content not available offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' }
  });
}

// Background Sync per future implementazioni
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'suggested-tools') {
    event.waitUntil(syncSuggestedTools());
  }
});

async function syncSuggestedTools() {
  // Implementazione futura per sincronizzare suggerimenti offline
  console.log('[SW] Syncing suggested tools...');
}

// Push notifications (per future implementazioni)
self.addEventListener('push', (event) => {
  console.log('[SW] Push received');
  
  if (!event.data) return;
  
  const data = event.data.json();
  const options = {
    body: data.body || 'Nuovi strumenti AI disponibili!',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data,
    actions: [
      {
        action: 'view',
        title: 'Visualizza',
        icon: '/icons/action-view.png'
      },
      {
        action: 'dismiss',
        title: 'Ignora',
        icon: '/icons/action-dismiss.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'AI Toolkit Directory',
      options
    )
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data;
  
  if (action === 'view' || !action) {
    event.waitUntil(
      clients.openWindow(data.url || '/')
    );
  }
});

// Periodic background sync (se supportato)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'update-tools') {
    event.waitUntil(updateToolsData());
  }
});

async function updateToolsData() {
  try {
    const response = await fetch('/data/ai-tools.json');
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      await cache.put('/data/ai-tools.json', response);
      console.log('[SW] Tools data updated in background');
    }
  } catch (error) {
    console.log('[SW] Background update failed:', error);
  }
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME,
      updated: new Date().toISOString()
    });
  }
});

console.log('[SW] Service Worker initialized:', CACHE_NAME);