import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { addDoc, collection, doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { voteOnIssue } from '../services/issueVoting';
import '../styles/workspace.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const iconMap = {
  Streetlights: '💡',
  Garbage: '🗑️',
  Potholes: '🕳️',
  'Traffic Signals': '🚦',
  'Water Leakage': '💧',
  Other: '❓',
};

const issueTypes = ['Streetlights', 'Garbage', 'Potholes', 'Traffic Signals', 'Water Leakage', 'Other'];

const statusClass = (status = 'Pending') => `status-badge status-badge-${status.toLowerCase().replaceAll(' ', '-')}`;

const createIssuePopup = (initialIssue, userId) => {
  const container = document.createElement('div');
  container.className = 'issue-popup';
  const title = document.createElement('h3');
  title.className = 'issue-popup-title';
  const address = document.createElement('p');
  address.className = 'issue-popup-address';
  const reporter = document.createElement('p');
  reporter.className = 'issue-popup-reporter';
  const status = document.createElement('span');
  status.className = 'status-badge issue-popup-status';
  const support = document.createElement('p');
  support.className = 'issue-popup-support';
  const votes = document.createElement('div');
  votes.className = 'issue-popup-votes';
  const upButton = document.createElement('button');
  upButton.className = 'vote-button';
  upButton.type = 'button';
  upButton.setAttribute('aria-label', 'Upvote issue');
  const downButton = document.createElement('button');
  downButton.className = 'vote-button vote-button-down';
  downButton.type = 'button';
  downButton.setAttribute('aria-label', 'Downvote issue');
  const error = document.createElement('p');
  error.className = 'workspace-error';
  error.setAttribute('role', 'alert');
  error.hidden = true;
  votes.append(upButton, downButton);
  container.append(title, address, reporter, status, support, votes, error);

  const state = { issue: initialIssue, userVote: null, isVoting: false, error: '' };
  const render = () => {
    const issue = state.issue;
    const upvotes = issue.upvotes || 0;
    const downvotes = issue.downvotes || 0;
    title.textContent = issue.issue || 'Community issue';
    address.textContent = issue.address || 'Location unavailable';
    reporter.textContent = `Reported by ${issue.reporterName || 'Citizen'}`;
    status.textContent = issue.status || 'Pending';
    status.className = `${statusClass(issue.status)} issue-popup-status`;
    support.textContent = `${upvotes} ${upvotes === 1 ? 'person supports' : 'people support'} this`;
    upButton.textContent = `↑ ${upvotes}`;
    downButton.textContent = `↓ ${downvotes}`;
    upButton.setAttribute('aria-pressed', state.userVote === 'up' ? 'true' : 'false');
    downButton.setAttribute('aria-pressed', state.userVote === 'down' ? 'true' : 'false');
    upButton.disabled = state.isVoting;
    downButton.disabled = state.isVoting;
    error.textContent = state.error;
    error.hidden = !state.error;
  };

  const handleVote = async (voteType) => {
    if (!userId || state.isVoting) return;
    state.isVoting = true;
    state.error = '';
    render();
    try {
      const result = await voteOnIssue(db, state.issue.id, userId, voteType);
      state.issue = { ...state.issue, upvotes: result.upvotes, downvotes: result.downvotes };
      state.userVote = result.userVote;
    } catch (voteError) {
      state.error = 'Your vote could not be saved. Please try again.';
      if (process.env.NODE_ENV === 'development') {
        console.error('Issue vote failed:', { code: voteError.code, message: voteError.message });
      }
    } finally {
      state.isVoting = false;
      render();
    }
  };

  upButton.addEventListener('click', () => handleVote('up'));
  downButton.addEventListener('click', () => handleVote('down'));
  L.DomEvent.disableClickPropagation(container);
  render();
  return { container, render, state };
};

export default function PublicFix({ user, profile }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [hasIssues, setHasIssues] = useState(false);
  const [mapError, setMapError] = useState('');
  const [selectedIssue, setSelectedIssue] = useState('');
  const [customIssue, setCustomIssue] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [reporting, setReporting] = useState(false);
  const reportPanelRef = useRef(null);

  useEffect(() => {
    const markers = new Map();
    const mapInstance = L.map('publicfix-map').setView([17.385, 78.4867], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance);

    const updateMarker = (issue) => {
      const existingMarker = markers.get(issue.id);
      if (issue.status === 'Resolved') {
        if (existingMarker) {
          existingMarker.unsubscribeVote?.();
          mapInstance.removeLayer(existingMarker.marker);
          markers.delete(issue.id);
        }
        return;
      }

      if (existingMarker) {
        existingMarker.popup.state.issue = issue;
        existingMarker.marker.setLatLng([issue.lat, issue.lon]);
        existingMarker.popup.render();
        return;
      }

      const popup = createIssuePopup(issue, user.uid);
      const marker = L.marker([issue.lat, issue.lon]).addTo(mapInstance).bindPopup(popup.container);
      const markerRecord = { marker, popup, unsubscribeVote: null };
      markers.set(issue.id, markerRecord);

      marker.on('popupopen', () => {
        markerRecord.unsubscribeVote?.();
        markerRecord.unsubscribeVote = onSnapshot(
          doc(db, 'reportedIssues', issue.id, 'votes', user.uid),
          (voteSnapshot) => {
            popup.state.userVote = voteSnapshot.exists() ? voteSnapshot.data().type : null;
            popup.state.error = '';
            popup.render();
          },
          () => {
            popup.state.error = 'Your current vote could not be loaded.';
            popup.render();
          }
        );
      });

      marker.on('popupclose', () => {
        markerRecord.unsubscribeVote?.();
        markerRecord.unsubscribeVote = null;
      });
    };

    const unsubscribeIssues = onSnapshot(collection(db, 'reportedIssues'), (snapshot) => {
      setMapError('');
      setHasIssues(snapshot.docs.some((issueDoc) => issueDoc.data().status !== 'Resolved'));
      snapshot.docChanges().forEach((change) => {
        if (change.type === 'removed') {
          const record = markers.get(change.doc.id);
          if (record) {
            record.unsubscribeVote?.();
            mapInstance.removeLayer(record.marker);
            markers.delete(change.doc.id);
          }
          return;
        }
        updateMarker({ id: change.doc.id, ...change.doc.data() });
      });
    }, () => {
      setMapError('Issue reports could not be loaded. Please try again.');
    });

    const resizeTimer = window.setTimeout(() => {
      mapInstance.invalidateSize();
      setMapLoaded(true);
    }, 200);

    return () => {
      window.clearTimeout(resizeTimer);
      unsubscribeIssues();
      markers.forEach(({ marker, unsubscribeVote }) => {
        unsubscribeVote?.();
        mapInstance.removeLayer(marker);
      });
      markers.clear();
      mapInstance.remove();
    };
  }, [user.uid]);

  useEffect(() => {
    if (window.location.hash === '#report-issue') {
      reportPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleReport = async (event) => {
    event.preventDefault();
    setErrorMessage('');
    if (!address.trim() || !selectedIssue) {
      setErrorMessage('Please select an issue and enter an address.');
      return;
    }

    const issue = selectedIssue === 'Other' ? customIssue.trim() : selectedIssue;
    if (!issue) {
      setErrorMessage('Please describe the issue.');
      return;
    }

    setReporting(true);
    const name = profile?.displayName || user.displayName || '';
    const reporterName = name.trim() && name.length <= 60 ? name : 'Citizen';
    const icon = iconMap[selectedIssue] || '📍';

    let submissionStage = 'Address lookup';
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address.trim())}`);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        submissionStage = 'Firestore write';
        await addDoc(collection(db, 'reportedIssues'), {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          issue,
          icon,
          address: address.trim(),
          timestamp: new Date(),
          status: 'Pending',
          reportedBy: user.uid,
          reporterName,
          upvotes: 0,
          downvotes: 0,
        });
        setSelectedIssue('');
        setCustomIssue('');
        setAddress('');
      } else {
        setErrorMessage('Could not find that address. Please try again.');
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        const errorCode = error.code ? ` (${error.code})` : '';
        const errorDetails = error.message || 'Unknown error';
        setErrorMessage(`${submissionStage} failed${errorCode}: ${errorDetails}`);
        console.error(`${submissionStage} failed:`, { code: error.code, message: error.message });
      } else {
        setErrorMessage('The issue could not be submitted. Please try again.');
      }
    } finally {
      setReporting(false);
    }
  };

  return (
    <div className="publicfix-layout">
      <section className="report-panel" id="report-issue" ref={reportPanelRef} aria-labelledby="report-panel-title">
        <h1 id="report-panel-title">Report an Issue</h1>
        <p className="report-panel-intro">Select a category and enter its location.</p>
        <h2>Issue type</h2>
        <div className="issue-type-list" role="group" aria-label="Issue type">
          {issueTypes.map((issueType) => (
            <button
              className="issue-type-button"
              key={issueType}
              type="button"
              aria-pressed={selectedIssue === issueType}
              onClick={() => setSelectedIssue(issueType)}
            >
              <span aria-hidden="true">{iconMap[issueType]}</span>
              <span>{issueType}</span>
            </button>
          ))}
        </div>

        {selectedIssue && (
          <form className="report-form" onSubmit={handleReport}>
            {selectedIssue === 'Other' && (
              <input
                type="text"
                placeholder="Describe the issue"
                aria-label="Describe the issue"
                value={customIssue}
                onChange={(event) => setCustomIssue(event.target.value)}
                required
              />
            )}
            <input
              type="text"
              placeholder="Enter address or location"
              aria-label="Issue address or location"
              autoComplete="street-address"
              value={address}
              onChange={(event) => setAddress(event.target.value)}
              required
            />
            <button type="submit" disabled={reporting}>
              {reporting ? 'Submitting…' : 'Submit Issue'}
            </button>
          </form>
        )}
        {errorMessage && <p className="workspace-error" role="alert">{errorMessage}</p>}
      </section>

      <section className="report-map" aria-label="Community issue map">
        {!mapLoaded && <div className="map-loading" role="status">Loading map…</div>}
        {mapLoaded && !hasIssues && !mapError && <div className="map-loading">No reported issues yet.</div>}
        {mapError && <div className="map-loading" role="alert">{mapError}</div>}
        <div className="report-map-canvas" id="publicfix-map" />
      </section>
    </div>
  );
}
