import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { db } from '../firebase';
import '../styles/workspace.css';

const formatDate = (timestamp) => {
  if (!timestamp) return 'Date unavailable';
  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
  return Number.isNaN(date.getTime()) ? 'Date unavailable' : date.toLocaleDateString();
};

const statusClass = (status = 'Pending') => `status-badge status-badge-${status.toLowerCase().replaceAll(' ', '-')}`;

const MyReports = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const reportsQuery = query(
      collection(db, 'reportedIssues'),
      where('reportedBy', '==', user.uid)
    );

    const unsubscribe = onSnapshot(reportsQuery, (snapshot) => {
      const nextReports = snapshot.docs.map((reportDoc) => ({
        id: reportDoc.id,
        ...reportDoc.data(),
      }));
      nextReports.sort((left, right) => (right.timestamp?.toMillis?.() || 0) - (left.timestamp?.toMillis?.() || 0));
      setReports(nextReports);
      setError('');
      setLoading(false);
    }, () => {
      setError('Your reports could not be loaded. Please try again.');
      setLoading(false);
    });

    return unsubscribe;
  }, [user.uid]);

  return (
    <section className="workspace-page" aria-labelledby="my-reports-title">
      <header className="workspace-page-header">
        <div>
          <h1 id="my-reports-title">My Reports</h1>
          <p>Follow the issues you have reported.</p>
        </div>
        <Link className="workspace-primary-button" to="/publicfix#report-issue">Report an Issue</Link>
      </header>

      {error && <p className="workspace-error" role="alert">{error}</p>}
      {loading ? <p className="workspace-muted" role="status">Loading your reports…</p> : null}
      {!loading && !error && reports.length === 0 && (
        <div className="workspace-card reports-empty">
          <p>You haven't reported any issues yet.</p>
          <Link className="workspace-primary-button" to="/publicfix#report-issue">Report an Issue</Link>
        </div>
      )}
      {!loading && reports.length > 0 && (
        <div className="reports-list">
          {reports.map((report) => (
            <article className="report-row" key={report.id}>
              <div>
                <h2>{report.issue || 'Community issue'}</h2>
                <p>{report.address || 'Location unavailable'}</p>
                <div className="report-row-meta">
                  <span>{formatDate(report.timestamp)}</span>
                  <span className={statusClass(report.status)}>{report.status || 'Pending'}</span>
                </div>
              </div>
              <span className="community-count" aria-label={`${report.upvotes || 0} upvotes and ${report.downvotes || 0} downvotes`}>
                ↑ {report.upvotes || 0} <span aria-hidden="true">·</span> ↓ {report.downvotes || 0}
              </span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyReports;
