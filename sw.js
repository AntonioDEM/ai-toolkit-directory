// sw.js - Service Worker migliorato per AI Toolkit Directory PWA
// Versione: 1.4.6 - Aggiornato: 2025-09-05T15:03:50.831Z

const CACHE_NAME = 'ai-tools-v1.4.6'; // ⬅️ INCREMENTA SEMPRE QUESTA VERSIONE
const STATIC_CACHE = 'static-v1.4.6';
const DYNAMIC_CACHE = 'dynamic-v1.4.6';

const STATIC_FILES = [
  '/',
  '/index.html',
  '/suggest-tool.html',
  '/suggest-bug.html',
  '/success.html',
  '/privacy.html',
  '/offline.html',
  '/css/styles.css',
  '/css/offline.css',
  '/js/app.js',
  '/js/enhanced-app.js',
  '/js/offline.js',
  '/js/rating-system.js',
  '/data/ai-tools.json',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap'
];

const DYNAMIC_FILES_PATTERNS = [
  /^https:\/\/logo\.clearbit\.com\//,
  /^https:\/\/fonts\.googleapis\.com\//,
  /^https:\/\/fonts\.gstatic\.com\//
];

const CACHE_STRATEGIES = {
  cacheFirst: [
    /\.(?:js|css|woff|woff2)$/,
    /^https:\/\/fonts\./
  ],
  
  cacheFirstUpdate: [
    /^https:\/\/logo\.clearbit\.com\//,
    /\.(?:png|jpg|jpeg|svg|gif|webp)$/
  ],
  
  networkFirst: [
    /\/api\//,
    /\.json$/
  ],
  
  staleWhileRevalidate: [
    /\.html$/,
    /\/$/
  ]
};

self.addEventListener('install', (event) => {
  console.log('🚀 [SW] Install event - versione:', CACHE_NAME);
  
  event.waitUntil(
    (async () => {
      const staticCache = await caches.open(STATIC_CACHE);
      
      try {
        await staticCache.addAll(STATIC_FILES);
        console.log('✅ [SW] Cache statica creata con successo');
      } catch (error) {
        console.error('❌ [SW] Errore cache statica:', error);
        // Prova a cachare file uno per uno per identificare problemi
        for (const file of STATIC_FILES) {
          try {
            await staticCache.add(file);
          } catch (e) {
            console.warn(`⚠️ [SW] Impossibile cachare: ${file}`, e);
          }
        }
      }
      
      // ⭐ FORZA ATTIVAZIONE IMMEDIATA DEL NUOVO SW
      console.log('🔄 [SW] Forzando skipWaiting per attivazione immediata');
      await self.skipWaiting();
    })()
  );
});

self.addEventListener('activate', (event) => {
  console.log('🔥 [SW] Activate event - versione:', CACHE_NAME);
  
  event.waitUntil(
    (async () => {
      // Elimina tutte le cache vecchie
      const cacheNames = await caches.keys();
      const deletePromises = cacheNames.map((cacheName) => {
        if (![STATIC_CACHE, DYNAMIC_CACHE, CACHE_NAME].includes(cacheName)) {
          console.log('🗑️ [SW] Rimozione cache obsoleta:', cacheName);
          return caches.delete(cacheName);
        }
      });
      
      await Promise.all(deletePromises);
      
      // ⭐ PRENDI CONTROLLO IMMEDIATO DI TUTTE LE PAGINE
      await self.clients.claim();
      console.log('✅ [SW] Nuovo SW attivo e in controllo');
      
      // ⭐ NOTIFICA TUTTI I CLIENT DEL NUOVO AGGIORNAMENTO
      const allClients = await self.clients.matchAll();
      allClients.forEach(client => {
        client.postMessage({
          type: 'SW_ACTIVATED',
          version: CACHE_NAME,
          message: '🎉 Nuova versione installata!'
        });
      });
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  if (request.method !== 'GET' || 
      url.protocol === 'chrome-extension:' ||
      url.protocol === 'moz-extension:') {
    return;
  }
  
  event.respondWith(
    handleFetchRequest(request)
  );
});

async function handleFetchRequest(request) {
  const url = new URL(request.url);
  
  try {
    const strategy = getCacheStrategy(request.url);
    
    switch (strategy) {
      case 'cacheFirst':
        return await cacheFirst(request);
      case 'cacheFirstUpdate':
        return await cacheFirstUpdate(request);
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

function getCacheStrategy(url) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pattern.test(url))) {
      return strategy;
    }
  }
  return 'networkFirst';
}

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    updateCacheInBackground(request);
    return cachedResponse;
  }
  
  const networkResponse = await fetch(request);
  await cacheResponse(request, networkResponse.clone());
  return networkResponse;
}

async function cacheFirstUpdate(request) {
  const cachedResponse = await caches.match(request);
  
  updateCacheInBackground(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      await cacheResponse(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response(
      '<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><rect width="100" height="100" fill="#f0f0f0"/><text x="50" y="50" text-anchor="middle" dy=".3em" fill="#999" font-family="sans-serif" font-size="12">No Image</text></svg>',
      {
        headers: { 'Content-Type': 'image/svg+xml' }
      }
    );
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
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

async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request).then(async (response) => {
    if (response.ok) {
      await cacheResponse(request, response.clone());
    }
    return response;
  }).catch(() => null);
  
  return cachedResponse || await networkResponsePromise;
}

async function cacheResponse(request, response) {
  if (!response || !response.ok || response.status === 206) {
    return;
  }
  
  const url = new URL(request.url);
  const cacheName = getDynamicCacheName(url);
  const cache = await caches.open(cacheName);
  
  return cache.put(request, response);
}

function getDynamicCacheName(url) {
  if (DYNAMIC_FILES_PATTERNS.some(pattern => pattern.test(url.href))) {
    return DYNAMIC_CACHE;
  }
  return STATIC_CACHE;
}

async function updateCacheInBackground(request) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cacheResponse(request, response);
    }
  } catch (error) {
    // Errore silente per aggiornamenti in background
  }
}

async function handleFetchError(request) {
  const url = new URL(request.url);
  
  if (request.mode === 'navigate' || request.destination === 'document') {
    const cachedResponse = await caches.match('/offline.html') || 
                           await caches.match('/index.html');
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(
      '<!DOCTYPE html><html><head><title>AI Toolkit Directory - Offline</title><style>body{font-family: sans-serif; padding: 20px; text-align: center;}</style></head><body><h1>Modalità offline</h1><p>La funzionalità richiesta non è disponibile offline.</p><a href="/">Torna alla homepage</a></body></html>',
      {
        headers: { 'Content-Type': 'text/html' }
      }
    );
  }
  
  if (request.destination === 'style') {
    return new Response(
      '/* Stili non disponibili offline */',
      { headers: { 'Content-Type': 'text/css' } }
    );
  }
  
  if (request.destination === 'script') {
    return new Response(
      'console.log("Script non disponibile offline");',
      { headers: { 'Content-Type': 'application/javascript' } }
    );
  }
  
  if (request.destination === 'image') {
    return cacheFirstUpdate(request);
  }
  
  return new Response('Contenuto non disponibile offline', {
    status: 503,
    statusText: 'Service Unavailable',
    headers: { 'Content-Type': 'text/plain' }
  });
}

// ⭐ GESTIONE MESSAGGI PER AGGIORNAMENTI
self.addEventListener('message', (event) => {
  console.log('📨 [SW] Messaggio ricevuto:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ [SW] Skip waiting richiesto');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME,
      updated: new Date().toISOString()
    });
  }
  
  if (event.data && event.data.type === 'FORCE_UPDATE') {
    console.log('🔄 [SW] Aggiornamento forzato richiesto');
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
      }).then(() => {
        return self.clients.claim();
      })
    );
  }
});

// ⭐ NOTIFICA QUANDO UN NUOVO SW È IN ATTESA
self.addEventListener('waiting', () => {
  console.log('⏳ [SW] Nuovo service worker in attesa');
  
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SW_UPDATE_WAITING',
        version: CACHE_NAME,
        message: '🔄 Nuova versione pronta!'
      });
    });
  });
});

// Background Sync per future implementazioni
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'suggested-tools') {
    event.waitUntil(syncSuggestedTools());
  }
});

async function syncSuggestedTools() {
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

console.log('🚀 [SW] Service Worker inizializzato:', CACHE_NAME);