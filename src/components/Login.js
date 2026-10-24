import React, { useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const getLoginErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/invalid-credential':
      return 'Email or password is incorrect.';
    case 'auth/user-not-found':
      return 'No account was found for this email.';
    case 'auth/wrong-password':
      return 'The password is incorrect.';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Could not connect to the sign-in service. Check your connection and try again.';
    case 'auth/invalid-email':
      return 'Enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    default:
      return 'Unable to sign in. Please try again.';
  }
};

const getGoogleErrorMessage = (error) => {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'Google sign-in was cancelled.';
    case 'auth/popup-blocked':
      return 'Your browser blocked the sign-in popup. Allow popups and try again.';
    case 'auth/network-request-failed':
      return 'Could not connect to the sign-in service. Check your connection and try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account with this email already uses a different sign-in method.';
    case 'auth/operation-not-allowed':
      return 'Google sign-in is not enabled for this Firebase project.';
    default:
      return 'Unable to sign in with Google. Please try again.';
  }
};

const logLoginError = (context, error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(context, { code: error.code, message: error.message });
  }
};

function Login({ profileLoading = false, profileError = '' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;

    setError('');
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Enter both your email and password.');
      return;
    }

    setLoading(true);
    setLoadingAction('email');
    try {
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      } catch (authError) {
        logLoginError('Firebase sign-in failed:', authError);
        setError(getLoginErrorMessage(authError));
        return;
      }

      let userDoc;
      try {
        userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      } catch (profileError) {
        logLoginError('Firestore profile lookup failed:', profileError);
        setError('Signed in, but your profile could not be loaded. Please try again.');
        return;
      }

      if (userDoc.exists()) {
        const role = userDoc.data().role;
        if (role === 'Citizen') {
          navigate('/publicfix');
        } else if (role === 'Official') {
          navigate('/admindashboard');
        } else if (!role) {
          setError('Your profile is missing a role. Please contact support.');
        } else {
          setError('Your profile has an unsupported role. Please contact support.');
        }
      } else {
        setError('Your account profile is missing. Please contact support.');
      }
    } finally {
      setLoading(false);
      setLoadingAction('');
    }
  };

  const handleGoogleLogin = async () => {
    if (loading || profileLoading) return;

    setError('');
    setLoading(true);
    setLoadingAction('google');
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (authError) {
      logLoginError('Google sign-in failed:', authError);
      setError(getGoogleErrorMessage(authError));
    } finally {
      setLoading(false);
      setLoadingAction('');
    }
  };

  return (
    <div className="login-container">
      <div className="form-box">
        <h2>Login</h2>
        {(error || profileError) && <p className="error">{error || profileError}</p>}
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} required />
          <div className="password-input-wrapper">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-visibility-button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
          <button type="submit" disabled={loading || profileLoading}>
            {loading && loadingAction === 'email' ? 'Logging in...' : profileLoading ? 'Loading profile...' : 'Login'}
          </button>
        </form>
        <button
          type="button"
          className="google-sign-in-button"
          onClick={handleGoogleLogin}
          disabled={loading || profileLoading}
        >
          {loading && loadingAction === 'google'
            ? 'Connecting to Google...'
            : profileLoading
              ? 'Setting up your profile...'
              : 'Continue with Google'}
        </button>
        <p>Don't have an account? <a href="/SignUp">Sign Up</a></p>
      </div>

      {/* Your background will remain intact here */}
      <style>{`
        .login-container {
          display: flex;
          height: 100vh;
          justify-content: center;
          align-items: center;
          background: url('https://images.pexels.com/photos/41949/earth-earth-at-night-night-lights-41949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2') no-repeat center center fixed;
          background-size: cover;
        }
        .form-box {
          background: rgba(0, 0, 0, 0.7);
          padding: 30px;
          border-radius: 8px;
          box-shadow: 0 0 10px rgba(0,0,0,0.2);
          width: 300px;
          text-align: center;
        }
        h2 {
          color: #ffffff;
        }
        input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border-radius: 4px;
          background-color: #00334d;
          color: white;
        }
        .password-input-wrapper {
          position: relative;
          width: 100%;
        }
        .password-input-wrapper input {
          padding-right: 48px;
        }
        .password-visibility-button {
          position: absolute;
          top: 50%;
          right: 6px;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          padding: 4px;
          background: transparent;
          color: white;
          cursor: pointer;
        }
        .google-sign-in-button {
          margin-top: 10px;
        }
        button {
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
        }
        .error {
          color: #ffcc00;
        }
        a {
          color: #ffffff;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
}

export default Login;
