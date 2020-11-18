import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = firebase.initializeApp({
  apiKey: "AIzaSyAUyGO8zzTlj0sAQEsYcLucJiLVKWxbW_U",
  authDomain: "posterwall-c4575.firebaseapp.com",
  databaseURL: "https://posterwall-c4575.firebaseio.com",
  projectId: "posterwall-c4575",
  storageBucket: "posterwall-c4575.appspot.com",
  messagingSenderId: "724985867044",
  appId: "1:724985867044:web:f6a672b573e902e82521b1"
});

export { firebaseConfig as firebase };