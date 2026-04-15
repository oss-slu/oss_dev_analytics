Steps to implement Github Authentication 

Goals: 
- Authenticate users using Github
- Link authenticated users to their GitHub account
- help support different access based on Tech lead versus Developer for future need


Arcitechture:  
- Frontend (React + Vite)  
- Handles login redirects and login page 
- Store session tokens securely  
    Caches: 
    - User profile (name, email, role)  
    - GitHub username  

Backend (API Server)  
- Store user data
- What is being cached:
    {
  uid,
  displayName,
  email,
  photoURL
}


GitHub:  
- Authenticaion provider for repository access 

How it works: 
- The user navigates to dashboard and if no valid session 
- User navigates to Login page and clicks button in React
- Firebase opens GitHub login popup
- GitHub confirms identity
- Firebase returns a user object to your app


Step-by-step: 
In Firebase Console:
- Go to Authentication -> Sign-in method
- Enable GitHub provider
    - Add:
        - GitHub Client ID
        - GitHub Client Secret
        - Configure GitHub OAuth App
- In GitHub Developer Settings:
    - Create a new OAuth App
    - Set: Homepage URL: http://localhost:5173
    - Get authorization callback URL
    - Copy the Client ID and paste into the Firebase Github provider config
- On the frontend add: 'const result = await signInWithPopup(auth, provider);' to open github OAuth popup and allow user to log into Github

-  SDK setup 
- Copy and paste the SDK setup and configuation from your project settings on the firebase website.
Example: 
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


Architecture:
GitHub → Firebase Auth → React App → Local Storage (cache)

Component overview:
- Login.jsx → UI trigger
- firebase.js → auth logic + state listener
- Firebase Auth → session provider


