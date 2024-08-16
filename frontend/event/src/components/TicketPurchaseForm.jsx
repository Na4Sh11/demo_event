// TicketPurchaseForm.js
import React, { useState } from 'react';

const TicketPurchaseForm = ({ event, onPurchase }) => {
  const [quantity, setQuantity] = useState(1);

  const handlePurchase = () => {
    onPurchase(event.id, quantity);
  };

  return (
    <div>
      <h2>Purchase Tickets for {event.name}</h2>
      <div>
        <label>Quantity:</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
          min="1"
        />
      </div>
      <button onClick={handlePurchase}>Purchase</button>
    </div>
  );
};

export default TicketPurchaseForm;
