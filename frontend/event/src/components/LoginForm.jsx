import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const LoginForm = ({ onLoginSuccess, onLoginError }) => {
  const { loginWithRedirect } = useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithRedirect();
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      console.error('Login error:', error);
      if (onLoginError) onLoginError();
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login with Auth0</button>
    </div>
  );
};

export default LoginForm;
