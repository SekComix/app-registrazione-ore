const CACHE_NAME = 'report-interventi-cache-v53';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg'
];

// Installazione: l'assistente si prepara e scarica i file
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aperta, aggiungo i file principali');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting()) // Forza l'attivazione del nuovo Service Worker
  );
});

// Attivazione: l'assistente prende il controllo e pulisce le vecchie versioni
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Elimino vecchia cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Prende il controllo di tutte le schede aperte
  );
});

// Fetch: l'assistente risponde alle richieste
self.addEventListener('fetch', event => {
  // Rispondi sempre prima dalla cache, poi prova la rete.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
