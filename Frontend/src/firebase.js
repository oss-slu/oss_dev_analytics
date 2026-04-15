import { initializeApp } from "firebase/app";
import {
  getAuth,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  getRedirectResult,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBaXOvbOmPXBfdEnDl2sMLb1jqujGVoZok",
  authDomain: "oss-dev-analytics.firebaseapp.com",
  projectId: "oss-dev-analytics",
  storageBucket: "oss-dev-analytics.firebasestorage.app",
  messagingSenderId: "825783735077",
  appId: "1:825783735077:web:c8d5a7a1adfd0934ebc0cc",
  measurementId: "G-7YFXYWENQH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

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
    console.log("User:", result.user);
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

export { auth, provider };
