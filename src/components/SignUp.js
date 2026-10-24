import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

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
    <div className="signup-container">
      <div className="form-box">
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSignUp}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </button>
        </form>
        <p>
          Already have an account? <a href="/Login">Login</a>
        </p>
      </div>

      <style>{
        `.signup-container {
          display: flex;
          height: 100vh;
          justify-content: center;
          align-items: center;
          background: url('https://thumbs.dreamstime.com/b/nighttime-road-work-illuminated-floodlights-workers-repairing-potholes-generative-ai-illustration-346676061.jpg') no-repeat center center fixed;
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
        input, select {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border-radius: 4px;
          background-color: #00334d;
          color: white;
        }
        button {
          width: 100%;
          padding: 10px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
        }
        button:disabled {
          background-color: #0056b3;
        }
        .error {
          color: #ffcc00;
        }
        a {
          color: #ffffff;
          font-weight: bold;
        }`
      }</style>
    </div>
  );
}

export default SignUp;
