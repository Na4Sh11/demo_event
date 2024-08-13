import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import authConfig from '../auth_config.json';

const CreateEventPage = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [noOfTickets, setNoOfTickets] = useState('');
  const [price, setPrice] = useState('');
  const [eventType, setEventType] = useState('');
  const [eventUrl, setEventUrl] = useState('');
  const [eventLocale, setEventLocale] = useState('');
  const [eventImages, setEventImages] = useState('');
  const [salesStartDate, setSalesStartDate] = useState('');
  const [salesEndDate, setSalesEndDate] = useState('');
  const [localTime, setLocalTime] = useState('');
  const [timezone, setTimezone] = useState('');
  const [statusCode, setStatusCode] = useState('');
  const [category, setCategory] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);


  const fetchUserData = async () => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: authConfig.REACT_APP_AUTH0_AUDIENCE,
          scope: 'openid profile email',
        },
      });

      const response = await fetch(`http://localhost:5001/users/${user.sub}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const data = await response.json();
      setUserData(data.user);
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

    console.log(statusCode);
    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return null;
        return `${dateTimeString}:00.000Z`; // Append seconds and milliseconds
      };
    const eventPayload = {
     
      venue: {
        id: `venue123`, // Generate a unique ID for the venue
      },
      event : {
        userId : user.sub,
        id: `event-${Date.now()}`, // Generate a unique ID
        name: eventName || null,
        type: eventType || null,
        url: eventUrl || null,
        locale: eventLocale || null,
        images: eventImages || null,
        sales: {
          public: {
            startDateTime: new Date(formatDateTime(salesStartDate)), // Convert input to ISO-8601
            endDateTime: new Date(formatDateTime(salesEndDate)),
          },
        },
        dates: {
            timezone: timezone || null,
            status:{
                code: statusCode
            },
            start:{
                localTime: localTime || null,
            }
        },
        classification:{
            segment:{
                name:{
                    category: category || '',
                }
            }
        },
       
        localDate: eventDate ? new Date(eventDate).toISOString() : null,
        
        //posted_by: userData ? { auth0_id: userData.auth0_id } : null,
        no_of_tickets: parseInt(noOfTickets, 10) || null,
        price: parseFloat(price) || null,
        classifications: [' '], // Add any other fields or data as needed
      }
      
    };

    try {
      const response = await fetch('http://localhost:5001/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      });

      console.log(response + "in create event");
      if (response.ok) {
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
          <label>Event Type:</label>
          <input
            type="text"
            value={eventType}
            onChange={(e) => setEventType(e.target.value)}
          />
        </div>
        <div>
          <label>Event URL:</label>
          <input
            type="text"
            value={eventUrl}
            onChange={(e) => setEventUrl(e.target.value)}
          />
        </div>
        <div>
          <label>Event Locale:</label>
          <input
            type="text"
            value={eventLocale}
            onChange={(e) => setEventLocale(e.target.value)}
          />
        </div>
        <div>
          <label>Event Images (comma-separated URLs):</label>
          <input
            type="text"
            value={eventImages}
            onChange={(e) => setEventImages(e.target.value)}
          />
        </div>
        <div>
          <label>Sales Start Date:</label>
          <input
            type="datetime-local"
            value={salesStartDate}
            onChange={(e) => setSalesStartDate(e.target.value)}
          />
        </div>
        <div>
          <label>Sales End Date:</label>
          <input
            type="datetime-local"
            value={salesEndDate}
            onChange={(e) => setSalesEndDate(e.target.value)}
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
          <label>Local Time:</label>
          <input
            type="text"
            value={localTime}
            onChange={(e) => setLocalTime(e.target.value)}
          />
        </div>
        <div>
          <label>Timezone:</label>
          <input
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
          />
        </div>
        <div>
          <label>Status Code:</label>
          <input
            type="text"
            value={statusCode}
            onChange={(e) => setStatusCode(e.target.value)}
          />
        </div>
        <div>
          <label>Category:</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
