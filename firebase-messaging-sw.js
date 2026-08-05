/* Service worker do Firebase Cloud Messaging (Web Push).
 * Registrado em escopo dedicado (/firebase-cloud-messaging-push-scope) pelo client,
 * então coexiste com o /service-worker.js de cache sem conflito.
 *
 * Usa os SDKs compat VENDORADOS (mesma origem, /vendor/*) em vez do gstatic:
 * a CSP que o Cloudflare injeta (também no header do .js do SW) só permite
 * script-src 'self', então importScripts do gstatic é bloqueado — self-host resolve.
 *
 * Sem onBackgroundMessage de propósito: para mensagens com bloco `notification`,
 * o SDK do FCM exibe a notificação automaticamente (notification + webpush.notification).
 * Definir onBackgroundMessage aqui causaria notificação DUPLICADA. */
importScripts("/vendor/firebase-app-compat.js");
importScripts("/vendor/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyBYg3i2JhINM6Q14T1-qPdjj5TQNwcfKzI",
  authDomain: "undershows.firebaseapp.com",
  projectId: "undershows",
  storageBucket: "undershows.firebasestorage.app",
  messagingSenderId: "432774323974",
  appId: "1:432774323974:web:c3dd042aaf2172b3bf8887",
});

// Inicializa o messaging no SW: registra o handler interno que exibe as notificações.
firebase.messaging();
