import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { FaHeart } from 'react-icons/fa'; // Use react-icons for heart icon
//import { useAuth0 } from '@auth0/auth0-react';

const EventCard = ({ event }) => {
  const [isFavorite, setIsFavorite, isAuthenticated] = useState(false);
  //const [ loginWithRedirect ] = useAuth0()

  const {
    name,
    localDate,
    localTime,
    images = [], // Default to empty array if images is not provided
    id
  } = event;

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // Prevents event propagation to the Link component
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    try {
      setIsFavorite(!isFavorite);

      // Handle adding/removing from favorites
      await axios.post(`http://localhost:5001/users/addToFavourites`, {
        eventId: id,
        // Add user ID from Auth0 or user context
      });
      console.log('Favorite status updated');
    } catch (error) {
      console.error('Error updating favorite status:', error);
    }
    // Handle adding/removing from favorites (e.g., update backend or local state)
  };

  return (
    <div className="event-card">
      <Link to={`/events/${id}`} className="event-banner">
        <img
          src={images[0]?.url || 'https://via.placeholder.com/300'} // Fallback image URL
          alt={name}
          className="event-image"
        />
        <div className="event-info">
          <h3>{name}</h3>
          <p>Date: {new Date(localDate).toLocaleDateString()}</p>
          <p>Time: {localTime}</p>
        </div>
      </Link>
      <button 
        className={`btn ${isFavorite ? 'btn-danger' : 'btn-outline-danger'} favorite-button`} 
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <FaHeart className={isFavorite ? 'text-danger' : 'text-muted'} />
      </button>
    </div>
  );
};

export default EventCard;
