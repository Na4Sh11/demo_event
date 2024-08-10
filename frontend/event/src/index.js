import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App';
import authConfig from './auth_config.json';
import './styles/global.css';

import reportWebVitals from './reportWebVitals';
import ErrorBoundary from './components/errorBoundary';
import { BrowserRouter as Router } from 'react-router-dom';  // Use BrowserRouter here
import Modal from 'react-modal';

Modal.setAppElement('#root');

const requestedScopes = ["profile", "email"];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <Router>  {/* BrowserRouter is now used */}
        <Auth0Provider
          domain={authConfig.REACT_APP_AUTH0_DOMAIN}
          clientId={authConfig.REACT_APP_AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: authConfig.REACT_APP_AUTH0_AUDIENCE,
            scope: requestedScopes.join(" "),
          }}
        >
          <App />
        </Auth0Provider>
      </Router>
    </ErrorBoundary>
  </React.StrictMode>
);

reportWebVitals();
