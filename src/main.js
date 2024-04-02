// Firebase 관련 모듈 import
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { registerPlugins } from '@/plugins'
import App from './App.vue';



// Firebase 프로젝트 설정
const firebaseConfig = {
    apiKey: "AIzaSyDq4aghoTHzLFT_9JISevOAwXTIe0VTy8g",
    authDomain: "alioth-3a1ea.firebaseapp.com",
    projectId: "alioth-3a1ea",
    storageBucket: "alioth-3a1ea.appspot.com",
    messagingSenderId: "320764927605",
    appId: "1:320764927605:web:fde806e3a46e16f273a23c",
    measurementId: "G-J6V1GS14W5"
};

// Firebase 초기화
const firebaseApp = initializeApp(firebaseConfig);

// Firebase Messaging 서비스 인스턴스 초기화
const messaging = getMessaging(firebaseApp);

// 서비스 워커 등록
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/firebase-messaging-sw.js')
        .then((registration) => {
          console.log('Service Worker 등록 성공:', registration.scope);
        }).catch((err) => {
          console.log('Service Worker 등록 실패:', err);
        });
    });
  }
  
// Notification permission 요청 및 토큰 가져오기
Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
        console.log('Notification permission granted.');

        // 토큰 가져오기
        getToken(messaging, { vapidKey: 'BMPifweL0hsWPF1VnGPjXL0S-myULnUgYoZCBhEd2bBNWaRcfegA6OlWd7ylNJq3wRz_cXlMwfcLZurfSVTPEXQ'
         }).then((currentToken) => {
            if (currentToken) {
                console.log('FCM Token:', currentToken);
                // TODO: 토큰을 서버로 전송하여 저장하는 로직 구현
            } else {
                console.log('No Instance ID token available. Request permission to generate one.');
            }
        }).catch((err) => {
            console.log('An error occurred while retrieving token. ', err);
        });
    } else {
        console.log('Unable to get permission to notify.');
    }
});


const app = createApp(App);
registerPlugins(app);
app.mount('#app');