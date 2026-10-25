import React from 'react';
import { useOutletContext } from 'react-router-dom';
import '../styles/workspace.css';

const Settings = ({ user }) => {
  const { theme, toggleTheme } = useOutletContext();
  const methods = user.providerData
    .map((provider) => provider.providerId === 'password' ? 'Email and password' : provider.providerId === 'google.com' ? 'Google' : provider.providerId)
    .filter((method, index, allMethods) => allMethods.indexOf(method) === index);

  return (
    <section className="workspace-page" aria-labelledby="settings-title">
      <header className="workspace-page-header">
        <div>
          <h1 id="settings-title">Settings</h1>
          <p>Account access and security.</p>
        </div>
      </header>

      <div className="workspace-card settings-card">
        <h2>Sign-in methods</h2>
        <p className="settings-method"><strong>Connected:</strong> {methods.length ? methods.join(', ') : 'Not available'}</p>
        <p className="workspace-muted">Your email address and role are managed by your account and cannot be changed here.</p>
      </div>

      <div className="workspace-card settings-card theme-card">
        <div>
          <h2>Appearance</h2>
          <p className="workspace-muted">Choose the theme used across your PublicFix workspace.</p>
        </div>
        <button
          className="theme-toggle"
          type="button"
          aria-pressed={theme === 'dark'}
          onClick={toggleTheme}
        >
          <span className="theme-toggle-icon" aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          <span>{theme === 'dark' ? 'Dark mode on' : 'Dark mode off'}</span>
        </button>
      </div>
    </section>
  );
};

export default Settings;
