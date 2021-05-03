import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCc3gUjHmvG9OD82NuwhmNjLBA4qmFfbUI",
    authDomain: "encuestapp-2593f.firebaseapp.com",
    projectId: "encuestapp-2593f",
    storageBucket: "encuestapp-2593f.appspot.com",
    messagingSenderId: "865400880369",
    appId: "1:865400880369:web:3b6c4cf8758b3e03e0bd50",
    measurementId: "G-Q0ZWJDSDH3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export {
    db,
    firebase
}