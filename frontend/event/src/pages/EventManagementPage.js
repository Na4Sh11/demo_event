// EventManagementPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import EventForm from '../components/EventForm';

const EventManagementPage = () => {
  const [events, setEvents] = useState([]);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5001/events');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleSaveEvent = async (event) => {
    try {
      if (event.id) {
        await axios.put(`http://localhost:5001/events/${event.id}`, event);
      } else {
        await axios.post('http://localhost:5001/events', event);
      }
      setEditingEvent(null);
      // Refresh events
      const response = await axios.get('http://localhost:5001/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/events/${id}`);
      const response = await axios.get('http://localhost:5001/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  return (
    <div>
      <h2>Event Management</h2>
      <EventForm event={editingEvent} onSaveEvent={handleSaveEvent} />
      <ul>
        {events.map(event => (
          <li key={event.id}>
            {event.name}
            <button onClick={() => handleEditEvent(event)}>Edit</button>
            <button onClick={() => handleDeleteEvent(event.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EventManagementPage;
