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
//   );
// }

// export default App;




// /**
//  * Fetches an access token from Auth0.
//  * @returns {Promise<string>} The access token.
//  */
// const fetchAccessToken = async () => {
//   try {
//     const response = await fetch('https://dev-b2liv381nwhfqbp7.us.auth0.com/oauth/token', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         grant_type: 'client_credentials',
//         client_id: '<YOUR_CLIENT_ID>',
//         client_secret: '<YOUR_CLIENT_SECRET>',
//         audience: '<YOUR_API_IDENTIFIER>',
//       }),
//     });

//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }

//     const data = await response.json();
//     return data.access_token; // Return the access token
//   } catch (error) {
//     console.error('Error fetching access token:', error);
//     throw error;
//   }
// };

import React, { useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authConfig from './auth_config.json';
import { useAuth0 } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import EventDetailsPage from './pages/eventDetailsPage';
import PaymentPage from './pages/PaymentPage';
import CreateEventPage from './pages/CreateEventPage';

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently, isLoading, handleRedirectCallback } = useAuth0();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [organization, setOrganization] = useState('');
  const navigate = useNavigate();
  const requestedScopes = ["openid", "profile", "email"];

  //Handle Auth0 redirect callback
  // useEffect(() => {
  //   const handleAuth = async () => {
  //     if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
  //       try {
  //         await handleRedirectCallback();
  //       } catch (error) {
  //         console.error('Error handling redirect callback:', error);
  //       }
  //       navigate('/'); // Redirect to home or the intended route
  //     }
  //   };

  //   handleAuth();
  // }, [handleRedirectCallback, navigate]);

  //auth0Id = user.sub;
  //console.log(auth0Id);  
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      checkUserInDatabase();
    }
  }, [isAuthenticated, isLoading]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };



  const storeUserInDatabase = async (organizationValue = '') => {
    if (isAuthenticated && user) {
      try {
        const response = await axios.post('http://localhost:5001/users/login', {
          auth0_id: user.sub,
          email: user.email,
          name: user.name,
          organization: organizationValue,
          // Add default or empty values for optional fields if needed
          password: '', // Assuming password is not used here
          favorites: [], // Default empty array if not used
        });

        console.log('User stored successfully:', response.data);
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      storeUserInDatabase(organization);
    }
  }, [isAuthenticated, organization]); // Add organization as a dependency if it changes

  const checkUserInDatabase = async () => {
    try {
      const response = await fetch(`http://localhost:5001/users/1}`);
      if (!response.ok) {
        if (response.status === 404) {
          if (user.sub.startsWith('google')) {
            setShowModal(true);
          } else {
            storeUserInDatabase();
          }
        } else {
          throw new Error('Error fetching user data');
        }
      } else {
        const userData = await response.json();
        if (!userData.organization && user.sub.startsWith('google')) {
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error('Error checking user in database:', error);
    }
  };

  // Fetches an access token from Auth0
  const fetchAccessToken = async () => {
  try {
    const response = await fetch('https://dev-b2liv381nwhfqbp7.us.auth0.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'client_credentials',
        client_id: '<YOUR_CLIENT_ID>',
        client_secret: '<YOUR_CLIENT_SECRET>',
        audience: '<YOUR_API_IDENTIFIER>',
      }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data.access_token; // Return the access token
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
};

    const fetchUserData = async () => {
    if (isAuthenticated) {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: authConfig.REACT_APP_AUTH0_AUDIENCE,
            scope: requestedScopes.join(" "),
          },
        });
        
        console.log("here the token = {}", token);
        const response = await fetch(`http://localhost:5001/users/authentication`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log("Everything on frontend is successful");
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={isDarkMode ? 'dark-mode' : 'light-mode'}>
      <nav className="navbar navbar-expand-lg navbar-light">
        <Link className="navbar-brand" to="/">Event Finder</Link>
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
            <li>
            <div>
             {isAuthenticated ? (
            <>
              <p>Hello, {user.name}</p>
            </>
          ) : (
            <></>
          )}
        </div>
            </li>
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage searchQuery={searchQuery} />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/events/:eventID" element={<EventDetailsPage />} />
        <Route path="/events/:eventID/payment" element={<PaymentPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
      </Routes>

      <div className="modal" tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Additional Information Required</h5>
              <button type="button" className="close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            {/* <div className="modal-body">
              <form onSubmit={handleModalSubmit}>
                <div className="form-group">
                  <label>Organization:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
              </form>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
