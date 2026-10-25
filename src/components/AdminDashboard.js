import React, { useEffect, useState } from 'react';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/workspace.css';

const formatDate = (timestamp) => {
  if (!timestamp) return 'Date unavailable';
  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleString();
};

const statusClass = (status = 'Pending') => `status-badge status-badge-${status.toLowerCase().replaceAll(' ', '-')}`;

const AdminDashboard = () => {
  const [issues, setIssues] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'reportedIssues'), (snapshot) => {
      const issuesData = snapshot.docs.map((issueDoc) => ({
        id: issueDoc.id,
        ...issueDoc.data(),
      }));
      issuesData.sort((left, right) => (right.upvotes || 0) - (left.upvotes || 0));
      setIssues(issuesData);
      setLoadError('');
      setLoading(false);
    }, () => {
      setLoadError('Issues could not be loaded. Please try again.');
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleStatusChange = (issueId, event) => {
    setSelectedStatuses((statuses) => ({ ...statuses, [issueId]: event.target.value }));
    setUpdateError('');
  };

  const handleUpdateStatus = async (issueId) => {
    const newStatus = selectedStatuses[issueId];
    if (!newStatus || isUpdating) {
      if (!newStatus) setUpdateError('Please select a status before updating.');
      return;
    }

    setIsUpdating(true);
    setUpdateError('');
    try {
      await updateDoc(doc(db, 'reportedIssues', issueId), { status: newStatus });
    } catch (error) {
      console.error('Error updating status: ', error);
      setUpdateError('Unable to update the issue status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <section className="workspace-page official-page" aria-labelledby="official-dashboard-title">
      <header className="workspace-page-header">
        <div>
          <h1 id="official-dashboard-title">Official Dashboard</h1>
          <p>Review reported issues and their community support.</p>
        </div>
      </header>

      {updateError && <p className="workspace-error" role="alert">{updateError}</p>}
      {loadError && <p className="workspace-error" role="alert">{loadError}</p>}
      {loading && <p className="workspace-muted" role="status">Loading issues…</p>}
      {!loading && !loadError && issues.length === 0 && (
        <div className="workspace-card reports-empty">No issues have been reported yet.</div>
      )}
      {!loadError && issues.length > 0 && (
        <div className="official-issue-list">
          {issues.map((issue) => (
            <article className="official-issue-row" key={issue.id}>
              <div className="official-issue-details">
                <div className="official-issue-heading">
                  <h2>{issue.issue || 'Community issue'}</h2>
                  <span className={statusClass(issue.status)}>{issue.status || 'Pending'}</span>
                </div>
                <p className="official-issue-address">{issue.address || 'Location unavailable'}</p>
                {issue.reporterName && <p className="official-issue-reporter">Reported by {issue.reporterName}</p>}
                <div className="official-issue-meta">
                  <span>{formatDate(issue.timestamp)}</span>
                  <span className="community-count">Community support: {issue.upvotes || 0}</span>
                  <span>↑ {issue.upvotes || 0} · ↓ {issue.downvotes || 0}</span>
                </div>
              </div>
              <div className="official-status-controls">
                <label htmlFor={`status-${issue.id}`}>Update status</label>
                <select
                  id={`status-${issue.id}`}
                  value={selectedStatuses[issue.id] || issue.status || ''}
                  onChange={(event) => handleStatusChange(issue.id, event)}
                  disabled={isUpdating}
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
                <button
                  className="workspace-secondary-button"
                  type="button"
                  onClick={() => handleUpdateStatus(issue.id)}
                  disabled={isUpdating || !selectedStatuses[issue.id] || selectedStatuses[issue.id] === issue.status}
                >
                  {isUpdating ? 'Updating…' : 'Save'}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
