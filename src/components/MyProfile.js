import React, { useEffect, useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/workspace.css';

const formatDate = (timestamp) => {
  if (!timestamp) return 'Not available';
  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
  return Number.isNaN(date.getTime()) ? 'Not available' : date.toLocaleDateString();
};

const MyProfile = ({ user, profile, role }) => {
  const currentName = profile?.displayName || user.displayName || (role === 'Official' ? 'Official' : 'Citizen');
  const [displayName, setDisplayName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => setDisplayName(currentName), [currentName]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextName = displayName.trim();
    if (!nextName || nextName.length > 60) {
      setError('Enter a display name between 1 and 60 characters.');
      setMessage('');
      return;
    }

    setSaving(true);
    setError('');
    setMessage('');
    try {
      await updateDoc(doc(db, 'users', user.uid), { displayName: nextName });
      setMessage('Your display name has been saved.');
    } catch (saveError) {
      setError('Your profile could not be updated. Please try again.');
      if (process.env.NODE_ENV === 'development') {
        console.error('Profile update failed:', { code: saveError.code, message: saveError.message });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="workspace-page" aria-labelledby="profile-title">
      <header className="workspace-page-header">
        <div>
          <h1 id="profile-title">My Profile</h1>
          <p>Manage the name shown in PublicFix.</p>
        </div>
      </header>

      <div className="workspace-card profile-card">
        <form className="workspace-form" onSubmit={handleSubmit}>
          <div className="workspace-form-field">
            <label htmlFor="profile-display-name">Display name</label>
            <input
              id="profile-display-name"
              name="displayName"
              value={displayName}
              maxLength={60}
              autoComplete="name"
              onChange={(event) => setDisplayName(event.target.value)}
              required
            />
          </div>
          <button className="workspace-primary-button" type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save name'}
          </button>
        </form>

        {error && <p className="workspace-error profile-message" role="alert">{error}</p>}
        {message && <p className="profile-success" role="status">{message}</p>}

        <dl className="profile-details">
          <dt>Email</dt><dd>{user.email || 'Not available'}</dd>
          <dt>Role</dt><dd>{role}</dd>
          <dt>Account created</dt><dd>{formatDate(profile?.createdAt || user.metadata?.creationTime)}</dd>
        </dl>
      </div>
    </section>
  );
};

export default MyProfile;
