import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
// Analytics solo funciona en web, no en React Native
// import { getAnalytics } from 'firebase/analytics';

// Configuración de Firebase para el proyecto Kidiquo
const firebaseConfig = {
  apiKey: "AIzaSyCFB6tKZsu2F3rvvK-SQZUQOYPX_Pnm1nI",
  authDomain: "kidiquo.firebaseapp.com",
  projectId: "kidiquo",
  storageBucket: "kidiquo.firebasestorage.app",
  messagingSenderId: "676075089627",
  appId: "1:676075089627:web:ffd4722e22b47025ba26fe",
  measurementId: "G-05LGJ4D1Y2"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar servicios
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Analytics solo se inicializa en web
// if (Platform.OS === 'web') {
//   const analytics = getAnalytics(app);
// }

export default app;