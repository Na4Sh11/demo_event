import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const CreateEventPage = () => {
  const { user, isAuthenticated } = useAuth0();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [noOfTickets, setNoOfTickets] = useState('');
  const [price, setPrice] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  const fetchUserData = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/users/1`);
      setUserData(response.data.user);
    } catch (err) {
      setError('Failed to fetch user data');
      console.error('Error fetching user data:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      setError('User data not loaded');
      return;
    }

    const eventPayload = {
      event: {
        id: `event-${Date.now()}`,  // Generating a unique ID for the event
        name: eventName,
        dates: {
          start: {
            localDate: eventDate,
          },
        },
        classifications: [{ segment: { name: 'General' } }],
        no_of_tickets: parseInt(noOfTickets),
        price: parseFloat(price),
        userId: userData.id,  // Assuming userData.id contains the user's ID
      },
      venue: {
        id: `venue-${Date.now()}`,  // Generating a unique ID for the venue
        name: eventLocation,
        city: { name: 'Sample City' },  // You might want to extract the city from the location or let the user provide it
      },
    };

    try {
      const response = await axios.post('http://localhost:5001/events/', eventPayload);

      if (response.status === 200) {
        setSuccess(true);
        navigate('/'); // Redirect to home or events page after successful creation
      } else {
        setError('Failed to create event');
      }
    } catch (err) {
      setError('An error occurred while creating the event');
      console.error('Error creating event:', err);
    }
  };

  return (
    <div>
      <h2>Create Event</h2>
      {success && <p>Event created successfully!</p>}
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Event Name:</label>
          <input
            type="text"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Event Date:</label>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Location:</label>
          <input
            type="text"
            value={eventLocation}
            onChange={(e) => setEventLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>No. of Tickets:</label>
          <input
            type="number"
            value={noOfTickets}
            onChange={(e) => setNoOfTickets(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEventPage;
