// HomePage.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';
import { useAuth0 } from '@auth0/auth0-react';

const HomePage = ({ searchQuery }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  // Fetch events data from the API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5001/events');
        setEvents(response.data);
      } catch (error) {
        setError('Error fetching events. Please try again later.');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Handle favorite click
  const handleFavoriteClick = (eventId) => {
    if (isAuthenticated) {
      console.log('Favorite clicked for event:', eventId);
      // Add logic to save the favorite event for the user
    } else {
      loginWithRedirect();
    }
  };

  // Handle details click
  const handleDetailsClick = (eventId) => {
    console.log('Details clicked for event:', eventId);
    // Add logic to navigate to event details page
  };

  // Filter events based on search query
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Upcoming Events</h2>
      <div className="event-list">
        {filteredEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onFavoriteClick={() => handleFavoriteClick(event.id)}
            onDetailsClick={() => handleDetailsClick(event.id)}
            isFavorite={false} // Implement actual favorite check logic
          />
        ))}
      </div>
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect()}>Login</button>
      )}
    </div>
  );
};

export default HomePage;
