// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase';
// import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
// import { useNavigate } from 'react-router-dom';

// function AdminDashboard() {
//   const [issues, setIssues] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     // Fetch issues from Firestore when the component mounts
//     const fetchIssues = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'reportedIssues'));
//         const issuesList = querySnapshot.docs.map(doc => ({
//           id: doc.id,
//           ...doc.data()
//         }));
//         setIssues(issuesList);
//       } catch (error) {
//         console.error("Error fetching issues:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchIssues();
//   }, []);

//   const handleStatusUpdate = async (issueId, newStatus) => {
//     try {
//       const issueRef = doc(db, 'reportedIssues', issueId);
//       await updateDoc(issueRef, { status: newStatus });
//       setIssues(issues.map(issue => issue.id === issueId ? { ...issue, status: newStatus } : issue));
//     } catch (error) {
//       console.error("Error updating status:", error);
//     }
//   };

//   return (
//     <div>
//       <h1>Admin Dashboard</h1>
//       {loading ? <p>Loading...</p> : (
//         <div>
//           <ul>
//             {issues.map((issue) => (
//               <li key={issue.id}>
//                 <h3>{issue.problem}</h3>
//                 <p>{issue.description}</p>
//                 <p>Status: {issue.status}</p>
//                 <select
//                   value={issue.status}
//                   onChange={(e) => handleStatusUpdate(issue.id, e.target.value)}
//                 >
//                   <option value="Pending">Pending</option>
//                   <option value="In Progress">In Progress</option>
//                   <option value="Resolved">Resolved</option>
//                 </select>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// }

// export default AdminDashboard;
// import React, { useEffect, useState } from 'react';
// import { db } from '../firebase';
// import { doc, getDocs, collection } from 'firebase/firestore';

// // Styling for AdminDashboard
// const style = {
//   dashboardContainer: {
//     backgroundColor: '#1f2a44', // Dark Blue background
//     color: 'white',
//     padding: '20px',
//     minHeight: '100vh',
//   },
//   title: {
//     textAlign: 'center',
//     fontSize: '2rem',
//     marginBottom: '30px',
//     color: '#f1f1f1',
//   },
//   cardsContainer: {
//     display: 'flex',
//     flexWrap: 'wrap',
//     justifyContent: 'space-between',
//   },
//   card: {
//     backgroundColor: '#2c3e50', // Slightly lighter blue for cards
//     borderRadius: '10px',
//     padding: '20px',
//     marginBottom: '20px',
//     width: '30%',
//     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//     transition: 'transform 0.3s',
//   },
//   cardHover: {
//     transform: 'scale(1.05)',
//   },
//   cardBody: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'flex-start',
//   },
//   cardTitle: {
//     color: '#ecf0f1',
//     fontWeight: 'bold',
//     marginBottom: '10px',
//   },
//   cardText: {
//     color: '#bdc3c7',
//     fontSize: '14px',
//   },
//   updateBtn: {
//     backgroundColor: '#2980b9',
//     border: 'none',
//     borderRadius: '5px',
//     padding: '10px 15px',
//     cursor: 'pointer',
//     color: 'white',
//     marginTop: '15px',
//   },
//   updateBtnHover: {
//     backgroundColor: '#3498db',
//   },
// };

// const AdminDashboard = () => {
//   const [issues, setIssues] = useState([]);

//   useEffect(() => {
//     // Fetch issues from Firestore
//     const fetchIssues = async () => {
//       try {
//         const querySnapshot = await getDocs(collection(db, 'reportedIssues'));
//         const issuesData = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setIssues(issuesData);
//       } catch (error) {
//         console.error('Error fetching issues: ', error);
//       }
//     };
//     fetchIssues();
//   }, []);

//   return (
//     <div style={style.dashboardContainer}>
//       <h1 style={style.title}>Admin Dashboard</h1>
//       <div style={style.cardsContainer}>
//         {issues.map((issue) => (
//           <div
//             key={issue.id}
//             style={{ ...style.card, ':hover': style.cardHover }}
//             className="card"
//           >
//             <div style={style.cardBody}>
//               <h2 style={style.cardTitle}>Issue: {issue.issue}</h2>
//               <p style={style.cardText}>
//                 <strong>Time: </strong>
//                 {issue.timestamp ? new Date(issue.timestamp.seconds * 1000).toLocaleString() : 'N/A'}
//               </p>
//               <p style={style.cardText}>
//                 <strong>Address: </strong>{issue.address}
//               </p>
//               <p style={style.cardText}>
//                 <strong>Status: </strong>{issue.status}
//               </p>
//               <button
//                 style={style.updateBtn}
//                 onMouseOver={(e) => (e.target.style.backgroundColor = '#3498db')}
//                 onMouseOut={(e) => (e.target.style.backgroundColor = '#2980b9')}
//               >
//                 Update Status
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

import React, { useEffect, useState } from 'react';
import { db } from '../firebase'; // Assuming db is the initialized Firebase Firestore instance
import { doc, getDocs, updateDoc, collection } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

// Styling for AdminDashboard
const style = {
  dashboardContainer: {
    backgroundColor: '#1f2a44', // Dark Blue background
    color: 'white',
    padding: '20px',
    minHeight: '100vh',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    marginBottom: '30px',
    color: '#f1f1f1',
  },
  cardsContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#2c3e50', // Slightly lighter blue for cards
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '20px',
    width: '30%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s',
  },
  cardHover: {
    transform: 'scale(1.05)',
  },
  cardBody: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  cardTitle: {
    color: '#ecf0f1',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  cardText: {
    color: '#bdc3c7',
    fontSize: '14px',
  },
  updateBtn: {
    backgroundColor: '#2980b9',
    border: 'none',
    borderRadius: '5px',
    padding: '10px 15px',
    cursor: 'pointer',
    color: 'white',
    marginTop: '15px',
  },
  updateBtnHover: {
    backgroundColor: '#3498db',
  },
  dropdown: {
    padding: '5px',
    borderRadius: '5px',
    marginTop: '10px',
    fontSize: '14px',
  },
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'reportedIssues'));
        const issuesData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setIssues(issuesData);
      } catch (error) {
        console.error('Error fetching issues: ', error);
      }
    };
    fetchIssues();
  }, []);

  const handleStatusChange = (issueId, event) => {
    setSelectedStatuses((statuses) => ({
      ...statuses,
      [issueId]: event.target.value,
    }));
    setUpdateError('');
  };

  const handleUpdateStatus = async (issueId) => {
    const newStatus = selectedStatuses[issueId];
    if (!newStatus) {
      setUpdateError('Please select a status before updating.');
      return;
    }

    setIsUpdating(true);
    setUpdateError('');
    try {
      const issueRef = doc(db, 'reportedIssues', issueId);
      await updateDoc(issueRef, {
        status: newStatus,
      });
      setIssues((currentIssues) =>
        currentIssues.map((issue) =>
          issue.id === issueId ? { ...issue, status: newStatus } : issue
        )
      );
    } catch (error) {
      console.error('Error updating status: ', error);
      setUpdateError('Unable to update the issue status. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={style.dashboardContainer}>
      <h1 style={style.title}>Admin Dashboard</h1>
      <button onClick={() => navigate('/publicfix')}>View Public Map</button>
      {updateError && <p role="alert">{updateError}</p>}
      <div style={style.cardsContainer}>
        {issues.map((issue) => (
          <div
            key={issue.id}
            style={{ ...style.card, ':hover': style.cardHover }}
            className="card"
          >
            <div style={style.cardBody}>
              <h2 style={style.cardTitle}>Issue: {issue.issue}</h2>
              <p style={style.cardText}>
                <strong>Time: </strong>
                {issue.timestamp ? new Date(issue.timestamp.seconds * 1000).toLocaleString() : 'N/A'}
              </p>
              <p style={style.cardText}>
                <strong>Address: </strong>{issue.address}
              </p>
              <p style={style.cardText}>
                <strong>Status: </strong>{issue.status}
              </p>
              <div>
                <select
                  style={style.dropdown}
                  value={selectedStatuses[issue.id] || ''}
                  onChange={(event) => handleStatusChange(issue.id, event)}
                  disabled={isUpdating}
                >
                  <option value="">Select Status</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                </select>
                <button
                  style={style.updateBtn}
                  onClick={() => handleUpdateStatus(issue.id)}
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

