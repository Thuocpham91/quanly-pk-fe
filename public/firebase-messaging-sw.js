// Give the service worker access to Firebase Messaging.
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing in the public configurations.
firebase.initializeApp({
  apiKey: "AIzaSyBtzyYoQLvSiM2lJNVPZkXNi7rZolqs2OE",
  projectId: "quanly-pkty",
  messagingSenderId: "403288524720",
  appId: "1:403288524720:web:eb3e86a4361103585f7875",
});

// Retrieve an instance of Firebase Messaging so that it can handle background messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title || 'Thông báo mới';
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Force the service worker to activate immediately without waiting for existing tabs to close
self.addEventListener('install', () => {
  self.skipWaiting();
});
