// import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const HomePage = () => {
//   const navigate = useNavigate();

//   // Inject animation styles when component mounts
//   useEffect(() => {
//     const style = document.createElement('style');
//     style.innerHTML = `
//       @keyframes moveBackground {
//         0% {
//           background-position: 0 0;
//         }
//         100% {
//           background-position: 100% 100%;
//         }
//       }
//     `;
//     document.head.appendChild(style);

//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   return (
//     <div style={styles.container}>
//       <div style={styles.content}>
//         <h1 style={styles.heading}>Welcome to PublicFix</h1>
//         <p style={styles.description}>
//           PublicFix is a platform where citizens can report local issues such as streetlight failures, garbage collection, potholes, and more. Join us in creating a better community.
//         </p>

//         <div style={styles.buttonContainer}>
//           <button style={styles.button} onClick={() => navigate('/Login')}>Get Started</button>
//           <button style={styles.button} onClick={() => navigate('/SignUp')}>Join Now</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     height: '100vh',
//     width: '100%',
//     backgroundImage: 'url(https://images.pexels.com/photos/41949/earth-earth-at-night-night-lights-41949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)',
//     backgroundSize: '150%',
//     backgroundRepeat: 'repeat',
//     backgroundPosition: '0 0',
//     animation: 'moveBackground 60s linear infinite', // Animate background over 60 seconds in a loop
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     color: '#fff',
//   },
//   content: {
//     textAlign: 'center',
//     padding: '20px',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//     borderRadius: '10px',
//     maxWidth: '600px',
//   },
//   heading: {
//     fontSize: '40px',
//     marginBottom: '20px',
//   },
//   description: {
//     fontSize: '18px',
//     marginBottom: '30px',
//     lineHeight: '1.6',
//   },
//   buttonContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     gap: '20px',
//   },
//   button: {
//     padding: '15px 30px',
//     fontSize: '16px',
//     backgroundColor: '#1abc9c',
//     color: 'white',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     transition: 'background 0.3s ease',
//   },
// };

// export default HomePage;








// import React from 'react';
// import { Link } from 'react-router-dom';

// const HomePage = () => {
//   return (
//     <div style={styles.container}>
//       <div style={styles.overlay}></div>
//       <div style={styles.content}>
//         <h1 style={styles.title}>Welcome to PublicFix</h1>
//         <p style={styles.description}>Report local issues and track their resolution</p>
//         <div>
//           <Link to="/login" style={styles.button}>Get Started</Link>
//           <Link to="/signup" style={styles.button}>Join</Link>
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     position: 'relative',
//     height: '100vh',
//     background: 'url(https://images.pexels.com/photos/41949/earth-earth-at-night-night-lights-41949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2) center/cover no-repeat',
//     animation: 'moveBackground 20s linear infinite', // Animation for background movement
//   },
//   overlay: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     width: '100%',
//     height: '100%',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
//   },
//   content: {
//     position: 'absolute',
//     top: '50%',
//     left: '50%',
//     transform: 'translate(-50%, -50%)',
//     textAlign: 'center',
//     color: 'white',
//   },
//   title: {
//     fontSize: '3rem',
//     fontWeight: 'bold',
//   },
//   description: {
//     fontSize: '1.2rem',
//     marginBottom: '20px',
//   },
//   button: {
//     backgroundColor: '#2980b9',
//     color: 'white',
//     padding: '10px 20px',
//     borderRadius: '5px',
//     margin: '10px',
//     textDecoration: 'none',
//     fontSize: '1rem',
//   },
// };

// // Adding embedded CSS for background movement
// const css = `
//   @keyframes moveBackground {
//     0% { background-position: 0 0; }
//     100% { background-position: -1000px 0; }
//   }
// `;

// document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

// export default HomePage;

import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.overlay}></div>
      <div style={styles.content}>
        <h1 style={styles.title}>Welcome to PublicFix</h1>
        <p style={styles.description}>Report local issues and track their resolution</p>
        <div>
          <Link to="/login" style={styles.button}>Get Started</Link>
          <Link to="/signup" style={styles.button}>Join</Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',  // Ensure full viewport height
    width: '100%',    // Ensure full width
    background: 'url(https://images.pexels.com/photos/41949/earth-earth-at-night-night-lights-41949.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2) center/cover no-repeat',  // Set your map URL here
    backgroundSize: 'cover',  // Ensure the background image covers the entire container
    animation: 'moveBackground 30s infinite',  // Animation for background zoom and movement
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Dark overlay for better text visibility
    zIndex: 1,  // Make sure overlay is on top of the background
  },
  content: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
    color: 'white',
    zIndex: 2,  // Ensure content is above the overlay
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  description: {
    fontSize: '1.2rem',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#2980b9',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '5px',
    margin: '10px',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'background-color 0.3s ease',  // Adding hover effect
  },
};

// Adding embedded CSS for background zoom and movement
const css = `
  @keyframes moveBackground {
    0% {
      background-size: 110%;
      background-position: 0 0;
    }
    50% {
      background-size: 120%;
      background-position: center center;
    }
    100% {
      background-size: 110%;
      background-position: 0 0;
    }
  }
`;

// Inject the CSS into the document head
document.head.insertAdjacentHTML('beforeend', `<style>${css}</style>`);

export default HomePage;

