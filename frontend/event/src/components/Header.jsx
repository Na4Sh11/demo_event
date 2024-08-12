import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Header = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();
  console.log(isAuthenticated);
  return (
    <header>
      <h1>Local Events Finder</h1>
      <nav>
        <a href="/">Home</a>
        {isAuthenticated ? (
          <>
            <a href="/profile">Profile</a>
            <button onClick={() => logout({ returnTo: window.location.origin })}>
              Logout
            </button>
          </>
        ) : (
          <button onClick={loginWithRedirect}>Login</button>
        )}
      </nav>
    </header>
  );
};

export default Header;
