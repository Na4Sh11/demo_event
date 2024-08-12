import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import EventModal from '../components/EventModal';

const EventDetailsPage = () => {
  const { eventID } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [event, setEvent] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/events/${eventID}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [eventID]);

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    try {
      await axios.post(`http://localhost:5001/users/addToFavourites`, {
        eventId: eventID,
        // Add user ID from Auth0 or user context
      });
      console.log('Event added to favorites');
    } catch (error) {
      console.error('Error adding event to favorites:', error);
    }
  };

  const handleBuyTicketsClick = () => {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      navigate(`/events/${eventID}/payment`);
    }
  };

  if (!event) {
    return <p>Loading...</p>;
  }

  return (
    <div className="event-details">
      <h1>{event.name}</h1>
      <p>Date: {new Date(event.localDate).toLocaleDateString()}</p>
      <p>Time: {event.localTime}</p>
      <h2>Venue Information</h2>
      {event.venue ? (
        <div>
          <p><strong>Name:</strong> {event.venue.name}</p>
          <p><strong>Address:</strong> {event.venue.address}, {event.venue.city}, {event.venue.state} {event.venue.postalCode}</p>
          <p><strong>Country:</strong> {event.venue.country}</p>
        </div>
      ) : (
        <p>No venue information available.</p>
      )}
      <button className="btn btn-primary" onClick={handleFavoriteClick}>Add to Favorites</button>
      <button className="btn btn-success" onClick={handleBuyTicketsClick}>Buy Tickets</button>
      <EventModal event={event} isOpen={modalIsOpen} onClose={() => setModalIsOpen(false)} />
    </div>
  );
};

export default EventDetailsPage;
