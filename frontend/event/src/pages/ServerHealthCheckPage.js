// ServerHealthCheckPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ServerHealthCheckPage = () => {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await axios.get('http://localhost:5001/health');
        setStatus(response.data.status);
      } catch (error) {
        setStatus('Server is down');
      }
    };

    checkServerHealth();
  }, []);

  return (
    <div>
      <h2>Server Health Check</h2>
      <p>Status: {status}</p>
    </div>
  );
};

export default ServerHealthCheckPage;
