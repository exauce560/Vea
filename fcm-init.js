import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, updateDoc, arrayUnion } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getMessaging, getToken, onMessage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyCY5GYE-TeUEVu6rkYQcwIkELmTM-mPZEc",
  authDomain: "v-ea-fb4c4.firebaseapp.com",
  projectId: "v-ea-fb4c4",
  storageBucket: "v-ea-fb4c4.firebasestorage.app",
  messagingSenderId: "357462139035",
  appId: "1:357462139035:web:7aa2ee50350d88a843a63e",
  measurementId: "G-WEG1X65STP"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messaging = getMessaging(app);

// Remplacez par votre clé VAPID Web Push (générée dans Firebase Console > Paramètres du projet > Cloud Messaging)
const VAPID_KEY = "BJreKjyD3izxN-Ie5rf3r2eUHzh6cIFWzbGBSSdpajP4_2wl2BzlBXIaLgfJkppcggUvlKr82mHLY6_nr8D9ntU";

/**
 * Demande la permission et enregistre le token pour l'utilisateur connecté
 * @param {string} userId - L'ID Firebase Auth de l'utilisateur
 * @param {string} collectionName - "vendeurs" ou "vendeurs_clients"
 */
export async function setupFCMNotifications(userId, collectionName = "vendeurs_clients") {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log("Permission de notification refusée.");
      return;
    }

    // Récupération du Token FCM unique
    const currentToken = await getToken(messaging, { vapidKey: VAPID_KEY });

    if (currentToken) {
      // Sauvegarde du token dans Firestore sous forme de tableau (pour gérer plusieurs appareils par utilisateur)
      const userRef = doc(db, collectionName, userId);
      await updateDoc(userRef, {
        fcmTokens: arrayUnion(currentToken),
        lastTokenUpdate: new Date()
      });
      console.log("Token FCM enregistré avec succès !");
    } else {
      console.warn("Aucun token d'enregistrement disponible.");
    }
  } catch (error) {
    console.error("Erreur lors de la configuration des notifications :", error);
  }
}

// Jouer un son personnalisé si l'utilisateur est actif sur l'application au moment de la réception
onMessage(messaging, (payload) => {
  console.log("Notification reçue au premier plan :", payload);

  // Lecture du son personnalisé
  const audio = new Audio("/sounds/notif.mp3");
  audio.play().catch(e => console.log("Erreur lecture audio :", e));

  // Affichage d'un toast ou d'un message dans l'interface si besoin
});