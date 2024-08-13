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
import { useAuth0 } from '@auth0/auth0-react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/global.css';
import HomePage from './pages/HomePage';
import authConfig from './auth_config.json';
import ProfilePage from './pages/ProfilePage';
import EventDetailsPage from './pages/eventDetailsPage';
import PaymentPage from './pages/PaymentPage';
import CreateEventPage from './pages/CreateEventPage';
import { getUserById, updateUserOrganization } from './utils/api'; // Import API functions
import TokenUtil from './utils/TokenUtil';

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently, isLoading } = useAuth0();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [organization, setOrganization] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const requestedScopes = ["openid", "profile", "email"];

  useEffect(() => {
    const handleAuth = async () => {
      if (isAuthenticated) {
        try {
          await checkUserInDatabase();
        } catch (error) {
          console.error('Error handling auth:', error);
        }
      }
    };

    handleAuth();
  }, [isAuthenticated]);

  const storeUserInDatabase = async (organizationValue = '') => {
    if (isAuthenticated && user) {
      try {
        // Implement logic to store user in the database
        console.log('User stored successfully');
      } catch (error) {
        console.error('Error saving user data:', error);
      }
    }
  };

  const checkUserInDatabase = async () => {
    if (!isAuthenticated || !user) return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: authConfig.REACT_APP_AUTH0_AUDIENCE,
          scope: requestedScopes.join(" "),
        },
      });

      TokenUtil.setToken(token);

      const response = await getUserById(user.sub);

      if (!response.ok) {
        
      }

      else {
        // Parse the JSON response
        const data = await response.json();

        // Check if user data exists
        if (data && data.user) {
          console.log('User is found:', data.user);
        } else {
          console.log('User not found');
        }
      }
    } catch (error) {
      //throw new Error(`HTTP error! Status: ${response.status}`);
      console.log("usernot found");
      setShowModal(true);
      console.error('Error checking user in database:', error);
    }
  };

  const handleModalSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission

    try {
      await updateUserOrganization(user.sub, organization, firstName, lastName, user.email, password);
      setShowModal(false); // Close the modal after successful submission
    } catch (error) {
      console.error('Error submitting modal form:', error);
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-primary" onClick={() => loginWithRedirect()}>Log In</button>
              </li>
            )}
            <li className="nav-item">
              <button className="btn btn-info" onClick={() => setIsDarkMode(!isDarkMode)}>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</button>
            </li>
            <li>
              <div>
                {isAuthenticated ? (
                  <p>Hello, {user.name}</p>
                ) : null}
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

      {showModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Additional Information Required</h5>
                <button type="button" className="close" onClick={() => setShowModal(false)}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleModalSubmit}>
                  <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="email"
                      value={user.email}
                      readOnly
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="firstName">First Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="firstName"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="lastName"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="organization">Organization:</label>
                    <input
                      type="text"
                      className="form-control"
                      id="organization"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Submit</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
