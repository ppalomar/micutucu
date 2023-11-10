// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDD7TuaNFQbsz4CTYc3Q52qkiwfEt1nEEw",
    authDomain: "micutucu-e5fd5.firebaseapp.com",
    projectId: "micutucu-e5fd5",
    storageBucket: "micutucu-e5fd5.appspot.com",
    messagingSenderId: "615727207764",
    appId: "1:615727207764:web:6f7dd481133726c6ade4c1",
    measurementId: "G-V3WY46BPYK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };