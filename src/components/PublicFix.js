// // PublicFix.js (Final Clean Version)
// import React, { useEffect, useState, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { db } from '../firebase';
// import { collection, addDoc, onSnapshot } from 'firebase/firestore';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Fix for Leaflet default icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// export default function PublicFix() {
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [selectedIssue, setSelectedIssue] = useState('');
//   const [customIssue, setCustomIssue] = useState('');
//   const [address, setAddress] = useState('');
//   const [markers, setMarkers] = useState([]);

//   const mapRef = useRef(null);

//   const iconMap = {
//     Streetlights: '💡',
//     Garbage: '🗑️',
//     Potholes: '🕳️',
//     'Traffic Signals': '🚦',
//     'Water Leakage': '💧',
//     Other: '❓',
//   };

//   useEffect(() => {
//     const mapInstance = L.map('map').setView([17.385, 78.4867], 13);
//     mapRef.current = mapInstance;

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       maxZoom: 19,
//       attribution: '© OpenStreetMap contributors',
//     }).addTo(mapInstance);

//     const unsubscribe = onSnapshot(collection(db, 'reportedIssues'), (snapshot) => {
//       // Clear existing markers
//       markers.forEach((m) => mapRef.current.removeLayer(m));
//       const newMarkers = [];

//       snapshot.forEach((doc) => {
//         const data = doc.data();
//         if (data.status === 'Resolved') return; // skip resolved

//         const icon = iconMap[data.issue] || '📍';
//         const popup = `${icon} ${data.issue}<br/>Status: ${data.status || 'Pending'}`;
//         const marker = L.marker([data.lat, data.lon]).addTo(mapRef.current);
//         marker.bindPopup(popup);
//         newMarkers.push(marker);
//       });
//       setMarkers(newMarkers);
//     });

//     setTimeout(() => {
//       mapInstance.invalidateSize();
//       setMapLoaded(true);
//     }, 200);

//     return () => {
//       mapInstance.remove();
//       unsubscribe();
//     };
//   }, []);

//   const handleReport = async () => {
//     if (!address || !selectedIssue) return;

//     const issue = selectedIssue === 'Other' ? customIssue : selectedIssue;
//     const icon = iconMap[issue] || '📍';

//     try {
//       const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
//       const data = await response.json();

//       if (data.length > 0) {
//         const { lat, lon } = data[0];

//         await addDoc(collection(db, 'reportedIssues'), {
//           lat: parseFloat(lat),
//           lon: parseFloat(lon),
//           issue,
//           icon,
//           address,
//           timestamp: new Date(),
//           status: 'Pending',
//         });

//         setSelectedIssue('');
//         setCustomIssue('');
//         setAddress('');
//       } else {
//         alert('Could not find that address. Please try again.');
//       }
//     } catch (error) {
//       console.error('Geocoding error:', error);
//       alert('Failed to geocode. Try again later.');
//     }
//   };

//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       {/* Sidebar */}
//       <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
//         <h2>📍 PublicFix</h2>

//         {['Streetlights', 'Garbage', 'Potholes', 'Traffic Signals', 'Water Leakage', 'Other'].map((issue) => (
//           <div
//             key={issue}
//             style={{
//               padding: '10px',
//               cursor: 'pointer',
//               backgroundColor: selectedIssue === issue ? '#34495e' : 'transparent',
//             }}
//             onClick={() => setSelectedIssue(issue)}
//           >
//             {iconMap[issue]} {issue}
//           </div>
//         ))}

//         {selectedIssue === 'Other' && (
//           <input
//             type="text"
//             placeholder="Describe issue"
//             value={customIssue}
//             onChange={(e) => setCustomIssue(e.target.value)}
//             style={{
//               margin: '10px 0',
//               padding: '8px',
//               width: '100%',
//               borderRadius: '5px',
//             }}
//           />
//         )}

//         {selectedIssue && (
//           <>
//             <input
//               type="text"
//               placeholder="Enter address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               style={{
//                 margin: '10px 0',
//                 padding: '8px',
//                 width: '100%',
//                 borderRadius: '5px',
//               }}
//             />
//             <button
//               onClick={handleReport}
//               style={{
//                 backgroundColor: '#1abc9c',
//                 padding: '10px',
//                 width: '100%',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//               }}
//             >
//               Report Issue
//             </button>
//           </>
//         )}
//       </div>

//       {/* Map */}
//       <div style={{ flex: 1, position: 'relative' }}>
//         {!mapLoaded && (
//           <div
//             style={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               zIndex: 10,
//             }}
//           >
//             Loading map...
//           </div>
//         )}
//         <div id="map" style={{ width: '100%', height: '100%' }}></div>
//       </div>
//     </div>
//   );
// }






// import React, { useEffect, useState, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { db } from '../firebase';
// import { collection, addDoc, onSnapshot } from 'firebase/firestore';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Fix for Leaflet default icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// export default function PublicFix() {
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [selectedIssue, setSelectedIssue] = useState('');
//   const [customIssue, setCustomIssue] = useState('');
//   const [address, setAddress] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');

//   const mapRef = useRef(null);

//   const iconMap = {
//     Streetlights: '💡',
//     Garbage: '🗑️',
//     Potholes: '🕳️',
//     'Traffic Signals': '🚦',
//     'Water Leakage': '💧',
//     Other: '❓',
//   };

//   useEffect(() => {
//     const mapInstance = L.map('map').setView([17.385, 78.4867], 13);
//     mapRef.current = mapInstance;

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       maxZoom: 19,
//       attribution: '© OpenStreetMap contributors',
//     }).addTo(mapInstance);

//     const unsubscribe = onSnapshot(collection(db, 'reportedIssues'), (snapshot) => {
//       // Clear existing markers
//       snapshot.docs.forEach(doc => {
//         const data = doc.data();
//         if (data.status !== 'Resolved') {
//           const icon = iconMap[data.issue] || '📍';
//           const popup = `${icon} ${data.issue}<br/>Status: ${data.status || 'Pending'}`;
//           L.marker([data.lat, data.lon]).addTo(mapInstance).bindPopup(popup);
//         }
//       });
//     });

//     setTimeout(() => {
//       mapInstance.invalidateSize();
//       setMapLoaded(true);
//     }, 200);

//     return () => {
//       mapInstance.remove();
//       unsubscribe();
//     };
//   }, []);

//   const handleReport = async () => {
//     setErrorMessage(''); // Clear previous error messages
//     if (!address || !selectedIssue) {
//       setErrorMessage('Please select an issue and enter a valid address.');
//       return;
//     }

//     const issue = selectedIssue === 'Other' ? customIssue : selectedIssue;
//     const icon = iconMap[issue] || '📍';

//     try {
//       const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
//       const data = await response.json();

//       if (data.length > 0) {
//         const { lat, lon } = data[0];

//         await addDoc(collection(db, 'reportedIssues'), {
//           lat: parseFloat(lat),
//           lon: parseFloat(lon),
//           issue,
//           icon,
//           address,
//           timestamp: new Date(),
//           status: 'Pending',
//         });

//         setSelectedIssue('');
//         setCustomIssue('');
//         setAddress('');
//       } else {
//         setErrorMessage('Could not find that address. Please try again.');
//       }
//     } catch (error) {
//       console.error('Geocoding error:', error);
//       setErrorMessage('Failed to geocode. Try again later.');
//     }
//   };

//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       {/* Sidebar */}
//       <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
//         <h2>📍 PublicFix</h2>

//         {['Streetlights', 'Garbage', 'Potholes', 'Traffic Signals', 'Water Leakage', 'Other'].map((issue) => (
//           <div
//             key={issue}
//             style={{
//               padding: '10px',
//               cursor: 'pointer',
//               backgroundColor: selectedIssue === issue ? '#34495e' : 'transparent',
//             }}
//             onClick={() => setSelectedIssue(issue)}
//           >
//             {iconMap[issue]} {issue}
//           </div>
//         ))}

//         {selectedIssue === 'Other' && (
//           <input
//             type="text"
//             placeholder="Describe issue"
//             value={customIssue}
//             onChange={(e) => setCustomIssue(e.target.value)}
//             style={{
//               margin: '10px 0',
//               padding: '8px',
//               width: '100%',
//               borderRadius: '5px',
//             }}
//           />
//         )}

//         {selectedIssue && (
//           <>
//             <input
//               type="text"
//               placeholder="Enter address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               style={{
//                 margin: '10px 0',
//                 padding: '8px',
//                 width: '100%',
//                 borderRadius: '5px',
//               }}
//               autoFocus
//             />
//             <button
//               onClick={handleReport}
//               style={{
//                 backgroundColor: '#1abc9c',
//                 padding: '10px',
//                 width: '100%',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//               }}
//             >
//               Report Issue
//             </button>
//           </>
//         )}

//         {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//       </div>

//       {/* Map */}
//       <div style={{ flex: 1, position: 'relative' }}>
//         {!mapLoaded && (
//           <div
//             style={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               zIndex: 10,
//             }}
//           >
//             Loading map...
//           </div>
//         )}
//         <div id="map" style={{ width: '100%', height: '100%' }}></div>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useState, useRef } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
// import { db } from '../firebase';
// import { collection, addDoc, onSnapshot } from 'firebase/firestore';

// import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
// import markerIcon from 'leaflet/dist/images/marker-icon.png';
// import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// // Fix for Leaflet default icons
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: markerIcon2x,
//   iconUrl: markerIcon,
//   shadowUrl: markerShadow,
// });

// export default function PublicFix() {
//   const [mapLoaded, setMapLoaded] = useState(false);
//   const [selectedIssue, setSelectedIssue] = useState('');
//   const [customIssue, setCustomIssue] = useState('');
//   const [address, setAddress] = useState('');
//   const [errorMessage, setErrorMessage] = useState('');
//   const mapRef = useRef(null);
//   const markersRef = useRef([]); // Store markers

//   const iconMap = {
//     Streetlights: '💡',
//     Garbage: '🗑️',
//     Potholes: '🕳️',
//     'Traffic Signals': '🚦',
//     'Water Leakage': '💧',
//     Other: '❓',
//   };

//   useEffect(() => {
//     const mapInstance = L.map('map').setView([17.385, 78.4867], 13);
//     mapRef.current = mapInstance;

//     L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//       maxZoom: 19,
//       attribution: '© OpenStreetMap contributors',
//     }).addTo(mapInstance);

//     // Listen for real-time updates from Firestore
//     const unsubscribe = onSnapshot(collection(db, 'reportedIssues'), (snapshot) => {
//       snapshot.docs.forEach((doc) => {
//         const data = doc.data();
//         if (data.status !== 'Resolved') {
//           // Check if marker already exists to avoid duplicates
//           const existingMarker = markersRef.current.find(
//             (marker) =>
//               marker.getLatLng().lat === data.lat && marker.getLatLng().lng === data.lon
//           );
          
//           if (!existingMarker) {
//             const icon = iconMap[data.issue] || '📍';
//             const popup = `${icon} ${data.issue}<br/>Status: ${data.status || 'Pending'}`;
//             const marker = L.marker([data.lat, data.lon]).addTo(mapInstance).bindPopup(popup);
//             markersRef.current.push(marker); // Store the marker reference
//           }
//         }
//       });
//     });

//     setTimeout(() => {
//       mapInstance.invalidateSize();
//       setMapLoaded(true);
//     }, 200);

//     return () => {
//       mapInstance.remove();
//       unsubscribe();
//     };
//   }, []);

//   const handleReport = async () => {
//     setErrorMessage(''); // Clear previous error messages
//     if (!address || !selectedIssue) {
//       setErrorMessage('Please select an issue and enter a valid address.');
//       return;
//     }

//     const issue = selectedIssue === 'Other' ? customIssue : selectedIssue;
//     const icon = iconMap[issue] || '📍';

//     try {
//       const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
//       const data = await response.json();

//       if (data.length > 0) {
//         const { lat, lon } = data[0];

//         await addDoc(collection(db, 'reportedIssues'), {
//           lat: parseFloat(lat),
//           lon: parseFloat(lon),
//           issue,
//           icon,
//           address,
//           timestamp: new Date(),
//           status: 'Pending',
//         });

//         setSelectedIssue('');
//         setCustomIssue('');
//         setAddress('');
//       } else {
//         setErrorMessage('Could not find that address. Please try again.');
//       }
//     } catch (error) {
//       console.error('Geocoding error:', error);
//       setErrorMessage('Failed to geocode. Try again later.');
//     }
//   };

//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       {/* Sidebar */}
//       <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
//         <h2>📍 PublicFix</h2>

//         {['Streetlights', 'Garbage', 'Potholes', 'Traffic Signals', 'Water Leakage', 'Other'].map((issue) => (
//           <div
//             key={issue}
//             style={{
//               padding: '10px',
//               cursor: 'pointer',
//               backgroundColor: selectedIssue === issue ? '#34495e' : 'transparent',
//             }}
//             onClick={() => setSelectedIssue(issue)}
//           >
//             {iconMap[issue]} {issue}
//           </div>
//         ))}

//         {selectedIssue === 'Other' && (
//           <input
//             type="text"
//             placeholder="Describe issue"
//             value={customIssue}
//             onChange={(e) => setCustomIssue(e.target.value)}
//             style={{
//               margin: '10px 0',
//               padding: '8px',
//               width: '100%',
//               borderRadius: '5px',
//             }}
//           />
//         )}

//         {selectedIssue && (
//           <>
//             <input
//               type="text"
//               placeholder="Enter address"
//               value={address}
//               onChange={(e) => setAddress(e.target.value)}
//               style={{
//                 margin: '10px 0',
//                 padding: '8px',
//                 width: '100%',
//                 borderRadius: '5px',
//               }}
//               autoFocus
//             />
//             <button
//               onClick={handleReport}
//               style={{
//                 backgroundColor: '#1abc9c',
//                 padding: '10px',
//                 width: '100%',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '5px',
//               }}
//             >
//               Report Issue
//             </button>
//           </>
//         )}

//         {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
//       </div>

//       {/* Map */}
//       <div style={{ flex: 1, position: 'relative' }}>
//         {!mapLoaded && (
//           <div
//             style={{
//               position: 'absolute',
//               top: '50%',
//               left: '50%',
//               transform: 'translate(-50%, -50%)',
//               zIndex: 10,
//             }}
//           >
//             Loading map...
//           </div>
//         )}
//         <div id="map" style={{ width: '100%', height: '100%' }}></div>
//       </div>
//     </div>
//   );
// }




import React, { useEffect, useState, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix for Leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

export default function PublicFix({ isOfficial = false }) {
  const navigate = useNavigate();
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState('');
  const [customIssue, setCustomIssue] = useState('');
  const [address, setAddress] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const mapRef = useRef(null);
  const markersRef = useRef([]); // Store markers

  const iconMap = {
    Streetlights: '💡',
    Garbage: '🗑️',
    Potholes: '🕳️',
    'Traffic Signals': '🚦',
    'Water Leakage': '💧',
    Other: '❓',
  };

  useEffect(() => {
    const mapInstance = L.map('map').setView([17.385, 78.4867], 13);
    mapRef.current = mapInstance;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(mapInstance);

    // Listen for real-time updates from Firestore
    const unsubscribe = onSnapshot(collection(db, 'reportedIssues'), (snapshot) => {
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.status !== 'Resolved') {
          // Check if marker already exists to avoid duplicates
          const existingMarker = markersRef.current.find(
            (marker) =>
              marker.getLatLng().lat === data.lat && marker.getLatLng().lng === data.lon
          );

          if (!existingMarker) {
            const icon = iconMap[data.issue] || '📍';
            const popup = `${icon} ${data.issue}<br/>Status: ${data.status || 'Pending'}`;
            const marker = L.marker([data.lat, data.lon]).addTo(mapInstance).bindPopup(popup);
            markersRef.current.push(marker); // Store the marker reference
          }
        }
      });
    });

    setTimeout(() => {
      mapInstance.invalidateSize();
      setMapLoaded(true);
    }, 200);

    return () => {
      mapInstance.remove();
      unsubscribe();
    };
  }, []);

  const handleReport = async () => {
    setErrorMessage(''); // Clear previous error messages
    if (!address || !selectedIssue) {
      setErrorMessage('Please select an issue and enter a valid address.');
      return;
    }

    const issue = selectedIssue === 'Other' ? customIssue : selectedIssue;
    const icon = iconMap[issue] || '📍';

    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];

        await addDoc(collection(db, 'reportedIssues'), {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
          issue,
          icon,
          address,
          timestamp: new Date(),
          status: 'Pending',
        });

        setSelectedIssue('');
        setCustomIssue('');
        setAddress('');
      } else {
        setErrorMessage('Could not find that address. Please try again.');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      setErrorMessage('Failed to geocode. Try again later.');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#2c3e50', color: 'white', padding: '20px' }}>
        <h2>📍 PublicFix</h2>
        {isOfficial && (
          <button onClick={() => navigate('/admindashboard')}>
            Return to Admin Dashboard
          </button>
        )}

        {['Streetlights', 'Garbage', 'Potholes', 'Traffic Signals', 'Water Leakage', 'Other'].map((issue) => (
          <div
            key={issue}
            style={{
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: selectedIssue === issue ? '#34495e' : 'transparent',
            }}
            onClick={() => setSelectedIssue(issue)}
          >
            {iconMap[issue]} {issue}
          </div>
        ))}

        {selectedIssue === 'Other' && (
          <input
            type="text"
            placeholder="Describe issue"
            value={customIssue}
            onChange={(e) => setCustomIssue(e.target.value)}
            style={{
              margin: '10px 0',
              padding: '8px',
              width: '100%',
              borderRadius: '5px',
            }}
          />
        )}

        {selectedIssue && (
          <>
            <input
              type="text"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{
                margin: '10px 0',
                padding: '8px',
                width: '100%',
                borderRadius: '5px',
              }}
              autoFocus
            />
            <button
              onClick={handleReport}
              style={{
                backgroundColor: '#1abc9c',
                padding: '10px',
                width: '100%',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
              }}
            >
              Report Issue
            </button>
          </>
        )}

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        {!mapLoaded && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10,
            }}
          >
            Loading map...
          </div>
        )}
        <div id="map" style={{ width: '100%', height: '100%' }}></div>
      </div>
    </div>
  );
}
