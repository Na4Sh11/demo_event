import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap CSS is imported
import { FaHeart } from 'react-icons/fa'; // Use react-icons for heart icon
import { useAuth0 } from '@auth0/auth0-react';
import { addToFavorites, removeFromFavorites } from '../utils/api'; // Import the global API functions

const EventCard = ({ event = {}, userFavorites = [] }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();

  const {
    name = 'Unknown Event',
    localDate,
    localTime,
    images = [], // Default to empty array if images is not provided
    id,
  } = event;

  useEffect(() => {
    // Set initial favorite status based on userFavorites
    if (userFavorites.includes(id)) {
      setIsFavorite(true);
    }
  }, [userFavorites, id]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation(); // Prevents event propagation to the Link component
    if (!isAuthenticated) {
      loginWithRedirect();
      return;
    }

    try {
      setIsFavorite(!isFavorite);

      if (!isFavorite) {
        // Add to favorites
        await addToFavorites(id, user.sub); // Pass eventId and userId to the API
      } else {
        // Remove from favorites
        await removeFromFavorites(id, user.sub); // Pass eventId and userId to the API
      }

      console.log('Favorite status updated');
    } catch (error) {
      console.error('Error updating favorite status:', error);
      // Revert the UI state if the API call fails
      setIsFavorite(!isFavorite);
    }
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
