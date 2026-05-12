const firebaseConfig = {
  apiKey: "AIzaSyDh_lOG1OA4AS16Fe4QJK9z_Eal5XTIDxk",
  authDomain: "ai-courses-website.firebaseapp.com",
  projectId: "ai-courses-website",
  storageBucket: "ai-courses-website.firebasestorage.app",
  messagingSenderId: "737788336108",
  appId: "1:737788336108:web:3b9723e04c18b9ea9252c9"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

window.auth = auth;
window.db = db;