importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDq4aghoTHzLFT_9JISevOAwXTIe0VTy8g",
    authDomain: "alioth-3a1ea.firebaseapp.com",
    projectId: "alioth-3a1ea",
    storageBucket: "alioth-3a1ea.appspot.com",
    messagingSenderId: "320764927605",
    appId: "1:320764927605:web:fde806e3a46e16f273a23c",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log(
    '[firebase-messaging-sw.js] Received background message ',
    payload
    );
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
