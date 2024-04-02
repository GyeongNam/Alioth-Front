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
                console.log('서비스워커 등록 성공:', registration.scope);
            }).catch((err) => {
                console.log('서비스워크 등록 실패:', err);
            });
        });
    }

// Notification permission 요청 및 토큰 가져오기
Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
        console.log('알림 권한이 허용되었습니다.');

        // 토큰 가져오기
        getToken(messaging, { vapidKey: 'BMPifweL0hsWPF1VnGPjXL0S-myULnUgYoZCBhEd2bBNWaRcfegA6OlWd7ylNJq3wRz_cXlMwfcLZurfSVTPEXQ'
            }).then((currentToken) => {
            if (currentToken) {
                console.log('FCM 토큰:', currentToken);
            } else {
                console.log('인스턴스 ID 토큰을 사용할 수 없습니다. 권한을 요청해 토큰을 생성하세요.');
            }
        }).catch((err) => {
            console.log('토큰을 받아오는 중에 문제가 발생했습니다. ', err);
        });
    } else {
        console.log('알림을 보낼 권한을 얻을 수 없습니다.');
    }
});


const app = createApp(App);
registerPlugins(app);
app.mount('#app');