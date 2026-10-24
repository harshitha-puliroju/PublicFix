// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHecjJbYeB2TPLIQaBxKGyuW_JYX7TF0E",
  authDomain: "public-fix.firebaseapp.com",
  projectId: "public-fix",
  storageBucket: "public-fix.firebasestorage.app",
  messagingSenderId: "732914066529",
  appId: "1:732914066529:web:3016f0d45d62f5e9757620",
  measurementId: "G-HWZ5GKP0G8"
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyDp8SwwO5pGOyTAcqjyAjgNnvPVwmscL7A",
//   authDomain: "publicfix.firebaseapp.com",
//   projectId: "publicfix",
//   storageBucket: "publicfix.firebasestorage.app",
//   messagingSenderId: "760884045050",
//   appId: "1:760884045050:web:9316cf5b6c70abeaa15543",
//   measurementId: "G-XQHTQ1MCJG"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const db = getFirestore(app);

// //✅ Export the auth instance
// export { auth, db };


// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';

// // Your Firebase config
// const firebaseConfig = {
//   apiKey: 'your-api-key',
//   authDomain: 'your-auth-domain',
//   projectId: 'your-project-id',
//   storageBucket: 'your-storage-bucket',
//   messagingSenderId: 'your-messaging-sender-id',
//   appId: 'your-app-id',
// };

// const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);
// const db = getFirestore(app);

// export { auth, db };


// firebase.js
/*
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDp8SwwO5pGOyTAcqjyAjgNnvPVwmscL7A",  // your actual API key
  authDomain: "publicfix.firebaseapp.com",
  projectId: "publicfix",
  storageBucket: "publicfix.firebasestorage.app",
  messagingSenderId: "760884045050",
  appId: "1:760884045050:web:9316cf5b6c70abeaa15543",
  measurementId: "G-XQHTQ1MCJG"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

*/
// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { auth, db } from '../firebase';
// import { doc, getDoc } from 'firebase/firestore';

// import HomePage from './components/HomePage';
// import PublicFix from './components/PublicFix';
// import AdminDashboard from './components/AdminDashboard';
// import Login from './components/Login';
// import SignUp from './components/SignUp';

// const App = () => {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
//       if (currentUser) {
//         setUser(currentUser);

//         try {
//           const docRef = doc(db, 'users', currentUser.uid);
//           const docSnap = await getDoc(docRef);
//           if (docSnap.exists()) {
//             const userRole = docSnap.data().role;
//             setRole(userRole);
//           } else {
//             console.error('User role not found in Firestore');
//           }
//         } catch (err) {
//           console.error('Error fetching user role:', err);
//         }
//       } else {
//         setUser(null);
//         setRole(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   if (loading) return <div>Loading...</div>;

//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<HomePage />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />

//         <Route
//           path="/publicfix"
//           element={user && role === 'Citizen' ? <PublicFix /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/admindashboard"
//           element={user && role === 'Official' ? <AdminDashboard /> : <Navigate to="/login" />}
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;
