import React, { useState } from 'react';
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

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
    <main className="auth-page">
      <section className="auth-aside" aria-label="About PublicFix">
        <Link className="brand-lockup brand-lockup-light" to="/">
          <span className="brand-mark" aria-hidden="true">P</span>
          <span>PublicFix</span>
        </Link>
        <div className="auth-aside-copy">
          <p className="eyebrow eyebrow-light">A stronger community starts here</p>
          <h1>Make local change visible.</h1>
          <p>Report public issues, follow progress, and help your community move forward.</p>
        </div>
        <p className="auth-aside-footer">A clearer connection between people and the places they share.</p>
      </section>

      <section className="auth-main" aria-labelledby="login-title">
        <div className="auth-card surface-card">
          <Link className="brand-lockup auth-card-brand" to="/" aria-label="PublicFix home">
            <span className="brand-mark" aria-hidden="true">P</span>
            <span>PublicFix</span>
          </Link>
          <div className="auth-heading">
            <p className="eyebrow">Your community, connected</p>
            <h2 id="login-title">Welcome back</h2>
            <p className="form-helper">Sign in to continue to PublicFix.</p>
          </div>
          {(error || profileError) && <p className="form-error" role="alert" aria-live="polite">{error || profileError}</p>}
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="form-field">
              <label className="form-label" htmlFor="login-email">Email</label>
              <input
                className="form-input"
                id="login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="login-password">Password</label>
              <div className="password-field">
                <input
                  className="form-input password-field-input"
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button className="button button-primary auth-submit" type="submit" disabled={loading || profileLoading}>
              {loading && loadingAction === 'email' ? 'Logging in...' : profileLoading ? 'Loading profile...' : 'Sign In'}
            </button>
          </form>
          <div className="auth-divider"><span>or</span></div>
          <button
            type="button"
            className="button button-secondary google-sign-in-button"
            onClick={handleGoogleLogin}
            disabled={loading || profileLoading}
          >
            {loading && loadingAction === 'google'
              ? 'Connecting to Google...'
              : profileLoading
                ? 'Setting up your profile...'
                : 'Continue with Google'}
          </button>
          <p className="auth-footer">Don't have an account? <Link to="/signup">Create one</Link></p>
        </div>
      </section>
    </main>
  );
}

export default Login;
