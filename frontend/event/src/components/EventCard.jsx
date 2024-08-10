import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Link } from 'react-router-dom';

const EventCard = ({ event }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  
  const handleFavoriteClick = (e) => {
    e.preventDefault(); // Prevent navigation
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      // Add to favorites logic here
      console.log('Added to favorites');
    }
  };

  const {
    name,
    localDate,
    localTime,
    images,
    id
  } = event;

  return (
    <div className="event-card">
      <Link to={`/event/${id}`} className="event-banner">
        <img src={images[0]?.url} alt={name} className="event-image" />
        <h3>{name}</h3>
        <p>Date: {new Date(localDate).toLocaleDateString()}</p>
        <p>Time: {localTime}</p>
        <button className="btn-favorite" onClick={handleFavoriteClick}>
          <i className="bi bi-heart"></i>
        </button>
      </Link>
    </div>
  );
};

export default EventCard;
