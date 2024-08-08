import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import authConfig from './auth_config.json';

function App() {
  const { loginWithRedirect, logout, user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  
  const requestedScopes = ["openid","profile", "email"];

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
        const response = await fetch(`http://localhost:5000/users/authentication`, {
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

  return (
    <Router>
      <div>
        {isAuthenticated ? (
          <>
            <p>Hello, {user.name}</p>
            <button onClick={() => logout({ returnTo: window.location.origin })}>Log Out</button>
            <button onClick={fetchUserData}>Fetch User Data</button>
          </>
        ) : (
          <button onClick={() => loginWithRedirect()}>Log In</button>
        )}
      </div>
    </Router>
  );
}

export default App;




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
