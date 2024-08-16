import React from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { BsCheckCircle } from 'react-icons/bs'; // Bootstrap check icon

const PaymentSuccess = () => {
  const { eventID } = useParams();
  const { user } = useAuth0();
  // Mock event details
  const event = {
    name: "Sample Event",
    date: "2024-08-30",
    location: "Sample Venue"
  };

  return (
    <div className="payment-success">
      <h1><BsCheckCircle color="green" /> Purchase Successful</h1>
      <p><strong>First Name:</strong> {user?.given_name}</p>
      <p><strong>Last Name:</strong> {user?.family_name}</p>
      <p><strong>Email:</strong> {user?.email}</p>
      <h2>Event Details</h2>
      <p><strong>Event Name:</strong> {event.name}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
    </div>
  );
};

export default PaymentSuccess;
