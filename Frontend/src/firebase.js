import { initializeApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  getRedirectResult,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // used to store metrics and repos of users
const firebaseConfig = {
  apiKey: "AIzaSyBaXOvbOmPXBfdEnDl2sMLb1jqujGVoZok",
  authDomain: "oss-dev-analytics.firebaseapp.com",
  projectId: "oss-dev-analytics",
  storageBucket: "oss-dev-analytics.firebasestorage.app",
  messagingSenderId: "825783735077",
  appId: "1:825783735077:web:c8d5a7a1adfd0934ebc0cc",
  measurementId: "G-7YFXYWENQH",
  databaseURL: "https://oss-dev-analytics-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)

// GitHub provider
const provider = new GithubAuthProvider();

getRedirectResult(auth)
  .then((result) => {
    if (result) {
      const user = result.user;
      console.log("Redirect login success:", user);
    }
  })
  .catch((error) => {
    console.error("Redirect error:", error);
  });

export const signInWithGitHub = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log("GitHub Sign-in Success:", user);
    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, {
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      uid: user.uid,
    }, {merge: true}); //https://firebase.google.com/docs/reference/android/com/google/firebase/firestore/SetOptions other Set options
  } catch (error) {
    console.error("GitHub Sign-in Error:", error.message);
  }
};

// Auth state listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User signed in:", user);
  } else {
    console.log("No user signed in");
  }
});

export { auth, provider, db };
