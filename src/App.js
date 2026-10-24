// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Login from './components/Login';
// import SignUp from './components/SignUp';
// import PublicFix from './components/PublicFix';
// import AdminDashboard from './components/AdminDashboard';
// import HomePage from './components/HomePage';
// import { auth, db } from './firebase';
// import { onAuthStateChanged } from 'firebase/auth';
// import { doc, getDoc } from 'firebase/firestore';

// function App() {
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // On page load, check if there is a logged-in user
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         try {
//           const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
//           const userRole = userDoc.exists() ? userDoc.data().role : null;
//           setUser(currentUser);
//           setRole(userRole);
//         } catch (error) {
//           console.error('Error fetching user data:', error);
//         }
//       } else {
//         setUser(null);
//         setRole(null);
//       }
//       setLoading(false);
//     });

//     // Logout on page reload
//     const handleBeforeUnload = () => {
//       auth.signOut();
//       localStorage.removeItem('user');
//     };

//     window.addEventListener('beforeunload', handleBeforeUnload);

//     return () => {
//       window.removeEventListener('beforeunload', handleBeforeUnload);
//       unsubscribe();
//     };
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Router>
//       <Routes>
//         {/* Homepage route */}
//         <Route
//           path="/"
//           element={
//             user ? (
//               role === 'Citizen' ? <Navigate to="/PublicFix" /> : <Navigate to="/AdminDashboard" />
//             ) : (
//               <HomePage />
//             )
//           }
//         />
//         {/* Login route */}
//         <Route path="/Login" element={<Login />} />
//         {/* SignUp route */}
//         <Route path="/SignUp" element={<SignUp />} />
//         {/* PublicFix route for citizens */}
//         <Route
//           path="/PublicFix"
//           element={user && role === 'Citizen' ? <PublicFix /> : <Navigate to="/Login" />}
//         />
//         {/* AdminDashboard route for officials */}
//         <Route
//           path="/AdminDashboard"
//           element={user && role === 'Official' ? <AdminDashboard /> : <Navigate to="/Login" />}
//         />
//       </Routes>
//     </Router>
//   );
// }

// export default App;





// import React, { useEffect, useState } from 'react';
// import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// import { auth } from './firebase';
// import HomePage from './components/HomePage'; // Import HomePage component
// import PublicFix from './components/PublicFix';
// import AdminDashboard from './components/AdminDashboard';
// import Login from './components/Login';
// import SignUp from './components/SignUp';

// const App = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Handle user login status
//     const unsubscribe = auth.onAuthStateChanged((currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         {/* Redirect to Home page on refresh */}
//         <Route path="/" element={<HomePage />} />
        
//         {/* User Authentication Routes */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
        
//         {/* PublicFix and AdminDashboard Routes */}
//         <Route
//           path="/publicfix"
//           element={user ? <PublicFix /> : <Navigate to="/login" />}
//         />
//         <Route
//           path="/admin"
//           element={user && user.role === 'Official' ? <AdminDashboard /> : <Navigate to="/login" />}
//         />
//       </Routes>
//     </Router>
//   );
// };

// export default App;



import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth, db } from './firebase';
import { doc, onSnapshot, runTransaction } from 'firebase/firestore';

import HomePage from './components/HomePage';
import PublicFix from './components/PublicFix';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import SignUp from './components/SignUp';

const App = () => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);
  const [profileError, setProfileError] = useState('');
  const isGoogleUser = user?.providerData.some(
    (provider) => provider.providerId === 'google.com'
  );

  useEffect(() => {
    let unsubscribeProfile = null;
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (!currentUser) {
        setUser(null);
        setRole(null);
        setProfileError('');
        setRoleLoading(false);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      setRole(null);
      setRoleLoading(true);
      setProfileError('');

      const userRef = doc(db, 'users', currentUser.uid);
      const isGoogleAccount = currentUser.providerData.some(
        (provider) => provider.providerId === 'google.com'
      );

      unsubscribeProfile = onSnapshot(userRef, async (userDoc) => {
        if (auth.currentUser?.uid !== currentUser.uid) return;

        if (userDoc.exists()) {
          const userRole = userDoc.data().role;
          setRole(userRole || null);
          setProfileError(userRole === 'Citizen' || userRole === 'Official'
            ? ''
            : 'Your profile is missing a valid role. Please contact support.');
          setRoleLoading(false);
          return;
        }

        setRole(null);
        if (!isGoogleAccount) {
          setRoleLoading(false);
          return;
        }

        try {
          const userRole = await runTransaction(db, async (transaction) => {
            const profile = await transaction.get(userRef);
            if (profile.exists()) return profile.data().role;

            transaction.set(userRef, {
              email: currentUser.email || '',
              role: 'Citizen',
            });
            return 'Citizen';
          });

          if (auth.currentUser?.uid !== currentUser.uid) return;
          setRole(userRole || null);
          setProfileError(userRole === 'Citizen' || userRole === 'Official'
            ? ''
            : 'Your profile is missing a valid role. Please contact support.');
          setRoleLoading(false);
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error('Error loading user profile:', { code: err.code, message: err.message });
          }
          setRole(null);
          setProfileError('Your profile could not be loaded. Please try again.');
          setRoleLoading(false);
        }
      }, (err) => {
        if (auth.currentUser?.uid !== currentUser.uid) return;
        if (process.env.NODE_ENV === 'development') {
          console.error('Error loading user profile:', { code: err.code, message: err.message });
        }
        setRole(null);
        setProfileError('Your profile could not be loaded. Please try again.');
        setRoleLoading(false);
      });

      setLoading(false);
    });
    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            isGoogleUser && !roleLoading && role === 'Citizen' ? <Navigate to="/publicfix" /> :
              isGoogleUser && !roleLoading && role === 'Official' ? <Navigate to="/admindashboard" /> :
                <Login profileLoading={Boolean(user) && roleLoading} profileError={profileError} />
          }
        />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/publicfix"
          element={
            user && roleLoading ? <div>Loading...</div> :
              user && (role === 'Citizen' || role === 'Official') ? <PublicFix isOfficial={role === 'Official'} /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/admindashboard"
          element={
            user && roleLoading ? <div>Loading...</div> :
              user && role === 'Official' ? <AdminDashboard /> : <Navigate to="/login" />
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
