import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/home.css';

const HomePage = () => (
  <main className="home-page">
    <div className="home-overlay" />
    <div className="home-content">
      <h1>PublicFix</h1>
      <nav className="home-actions" aria-label="Account">
        <Link className="home-action" to="/login">Login</Link>
        <Link className="home-action home-action-secondary" to="/signup">Sign Up</Link>
      </nav>
    </div>
  </main>
);

export default HomePage;
