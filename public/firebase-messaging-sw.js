importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyDotC7-wC0ldRBzZtd0sbebSdqoejVy5XQ",
    authDomain: "aliothfcm.firebaseapp.com",
    projectId: "aliothfcm",
    storageBucket: "aliothfcm.appspot.com",
    messagingSenderId: "288820360562",
    appId: "1:288820360562:web:5af754e082f1bc75aa99eb",
    measurementId: "G-B47NJH51VZ"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icon.png',
        data: {
            url: payload.data.url
        }
    };

    self.addEventListener('notificationclick', (event) => {
        event.notification.close(); 
        event.waitUntil(
            clients.openWindow(burl+payload.data.url)
        );
    });
    
    self.registration.showNotification(notificationTitle, notificationOptions);
});

