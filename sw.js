const CACHE_NAME = 'vea-market-v1';

// Liste complète de toutes les ressources du projet
const ASSETS = [
  './',
  './landing.html',
  './index.html',
  './index1.html',
  './acceuil.html',
  './acheteur.html',
  './achet-pref.html',
  './vendeur.html',
  './vend-pref.html',
  './vend-client-dashboard.html',
  './dashboard-vendeur.html',
  './add-product.html',
  './article.html',
  './favoris.html',
  './abonnement.html',
  './compte-a.html',
  './compte-v.html',
  './connect.html',
  './les-deux.html',
  './particulariter.html',
  './premium.html',
  './privacy.html',
  './conditions.html',
  './visit-visit-v.html',
  './404.html',
  './google346551b2dbefead0.html',
  './site.webmanifest',
  './favicon.ico',
  './favicon-16x16.png',
  './favicon-32x32.png',
  './apple-touch-icon.png',
  './android-chrome-192x192.png',
  './android-chrome-512x512.png',
  './hero-splash.avif',
  './appa1.jfif',
  './appa2.jfif',
  './appa3.jfif',
  './habit1.jfif',
  './habit2.jfif',
  './habit3.jfif',
  './habit4.jfif',
  './habit5.jfif',
  './meuble1.jfif',
  './meuble2.jfif',
  './shoes1.jfif',
  './shoes2.jfif'
];

// Installation du Service Worker et mise en cache des ressources
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Nettoyage des anciens caches lors de la mise à jour
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interception des requêtes : Réseau en priorité, repli sur le cache si hors ligne
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // Mise à jour dynamique du cache avec les nouvelles réponses
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // Si pas de réseau, récupération dans le cache
        return caches.match(e.request);
      })
  );
});