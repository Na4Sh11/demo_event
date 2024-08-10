import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EventCard from '../components/EventCard';

const HomePage = ({ searchQuery }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5001/events/');
        setEvents(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on searchQuery
  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h2>Upcoming Events</h2>
      <div className="event-list">
        {filteredEvents.map(event => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
