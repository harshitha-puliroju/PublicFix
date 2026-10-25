import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';

const getSignupErrorText = (error) => {
  const code = error.match(/auth\/([a-z-]+)/)?.[1];
  switch (code) {
    case 'email-already-in-use':
      return 'An account already exists for this email. Try signing in instead.';
    case 'invalid-email':
      return 'Enter a valid email address.';
    case 'weak-password':
      return 'Choose a stronger password and try again.';
    case 'network-request-failed':
      return 'Could not connect to the sign-up service. Check your connection and try again.';
    default:
      return 'We could not create your account. Please check your details and try again.';
  }
};

function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous error messages
    setLoading(true); // Show loading state

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      console.log('User created:', uid);

      // Set user role in Firestore
      await setDoc(doc(db, 'users', uid), {
        email,
        role: 'Citizen',
        displayName: userCredential.user.displayName || 'Citizen',
        createdAt: serverTimestamp(),
      });

      console.log('User role saved: Citizen');
      setLoading(false); // Hide loading state
      navigate('/Login'); // Redirect to login page
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message); // Show Firebase error message
      setLoading(false); // Hide loading state
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
          <p className="eyebrow eyebrow-light">Small actions, lasting impact</p>
          <h1>Help your neighborhood thrive.</h1>
          <p>Create an account to report local issues and stay connected to their progress.</p>
        </div>
        <p className="auth-aside-footer">Together, we can make everyday places work better for everyone.</p>
      </section>

      <section className="auth-main" aria-labelledby="signup-title">
        <div className="auth-card surface-card">
          <Link className="brand-lockup auth-card-brand" to="/" aria-label="PublicFix home">
            <span className="brand-mark" aria-hidden="true">P</span>
            <span>PublicFix</span>
          </Link>
          <div className="auth-heading">
            <p className="eyebrow">Join your community</p>
            <h2 id="signup-title">Create your PublicFix account</h2>
            <p className="form-helper">A few details are all you need to get started.</p>
          </div>
          {error && <p className="form-error" role="alert" aria-live="polite">{getSignupErrorText(error)}</p>}
          <form className="auth-form" onSubmit={handleSignUp}>
            <div className="form-field">
              <label className="form-label" htmlFor="signup-email">Email</label>
              <input
                className="form-input"
                id="signup-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="signup-password">Password</label>
              <input
                className="form-input"
                id="signup-password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <p className="form-helper password-hint">Use a password you can remember and keep secure.</p>
            <button className="button button-primary auth-submit" type="submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-footer">Already have an account? <Link to="/login">Sign in</Link></p>
        </div>
      </section>
    </main>
  );
}

export default SignUp;
