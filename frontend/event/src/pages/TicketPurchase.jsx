// TicketPurchasePage.js
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

const TicketPurchasePage = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth0();
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('');

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      // Redirect to login
      navigate('/login');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5001/events/buy-tickets', {
        eventID,
        quantity
      });
      if (response.status === 200) {
        setStatus('Purchase successful');
        // Redirect or update UI
      }
    } catch (error) {
      console.error('Error during payment:', error);
      setStatus('Error purchasing tickets');
    }
  };

  return (
    <div className="ticket-purchase-page">
      <h2>Purchase Tickets</h2>
      <div>
        <label>Number of Tickets:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          min="1"
        />
      </div>
      <button onClick={handlePurchase}>Purchase</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default TicketPurchasePage;
