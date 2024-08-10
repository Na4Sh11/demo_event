// import React from 'react';
// import { useAuth0 } from '@auth0/auth0-react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import authConfig from './auth_config.json';

// function App() {
//   const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  
//   const requestedScopes = ["openid","profile", "email"];

//   const fetchUserData = async () => {
//     if (isAuthenticated) {
//       try {
//         const token = await getAccessTokenSilently({
//           authorizationParams: {
//             audience: authConfig.REACT_APP_AUTH0_AUDIENCE,
//             scope: requestedScopes.join(" "),
//           },
//         });
        
//         console.log("here the token = {}", token);
//         const response = await fetch(`http://localhost:5001/users/authentication`, {
//           headers: {
//             Authorization: `Bearer ${token}`
//           },
//         });
  
//         if (!response.ok) {
//           throw new Error('Network response was not ok');
//         }
  
//         console.log("Everything on frontend is successful");
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     }
//   };

//   return (
//     <Router>
//       <div>
//         {isAuthenticated ? (
//           <>
//             <p>Hello, {user.name}</p>
//             <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
//             <button onClick={fetchUserData}>Fetch User Data</button>
//           </>
//         ) : (
//           <button onClick={() => loginWithRedirect()}>Log In</button>
//         )}
//       </div>
//     </Router>
//   );
// }

// export default App;




// // /**
// //  * Fetches an access token from Auth0.
// //  * @returns {Promise<string>} The access token.
// //  */
// // const fetchAccessToken = async () => {
// //   try {
// //     const response = await fetch('https://dev-b2liv381nwhfqbp7.us.auth0.com/oauth/token', {
// //       method: 'POST',
// //       headers: {
// //         'Content-Type': 'application/json',
// //       },
// //       body: JSON.stringify({
// //         grant_type: 'client_credentials',
// //         client_id: '<YOUR_CLIENT_ID>',
// //         client_secret: '<YOUR_CLIENT_SECRET>',
// //         audience: '<YOUR_API_IDENTIFIER>',
// //       }),
// //     });

// //     if (!response.ok) {
// //       throw new Error('Network response was not ok');
// //     }

// //     const data = await response.json();
// //     return data.access_token; // Return the access token
// //   } catch (error) {
// //     console.error('Error fetching access token:', error);
// //     throw error;
// //   }
// // };

import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';  // Ensure this path is correct
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';

function App() {
  const { loginWithRedirect, logout, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <nav className="navbar navbar-expand-lg navbar-light">
        <a className="navbar-brand" href="/">Event Finder</a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <input
                type="text"
                className="form-control"
                placeholder="Search for events"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link to="/profile">
                    <button className="btn btn-primary">Profile</button>
                  </Link>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger" onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-secondary" onClick={fetchUserData}>Fetch User Data</button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-primary" onClick={() => loginWithRedirect()}>Log In</button>
              </li>
            )}
            <li className="nav-item">
              <button className="btn btn-info" onClick={toggleDarkMode}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</button>
            </li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </div>
  );
}

export default App;
