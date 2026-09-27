// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyCY5GYE-TeUEVu6rkYQcwIkELmTM-mPZEc",
  authDomain: "v-ea-fb4c4.firebaseapp.com",
  projectId: "v-ea-fb4c4",
  storageBucket: "v-ea-fb4c4.firebasestorage.app",
  messagingSenderId: "357462139035",
  appId: "1:357462139035:web:7aa2ee50350d88a843a63e"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || "Vea Market";
  const notificationOptions = {
    body: payload.notification?.body || "Vous avez reçu un nouveau message.",
    icon: payload.notification?.icon || '/favicon.ico', // Utiliser un chemin absolu vers l'image PNG
    badge: '/favicon-32x32.png',
    data: {
      url: payload.data?.url || '/acceuil.html'
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/acceuil.html';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url.includes(urlToOpen) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});