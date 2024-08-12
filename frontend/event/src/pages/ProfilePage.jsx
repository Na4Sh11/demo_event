import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

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
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (eventId, newStatus, eventDate) => {
    const currentDate = moment().format('YYYY-MM-DD');
    
    if (moment(currentDate).isAfter(eventDate)) {
      alert('Event is expired.');
      return;
    }

    try {
      await axios.put('http://localhost:5001/updateUserEventStatus', {
        userId: userData.id,
        eventId: eventId,
        newStatus: newStatus,
      });
      alert('Status updated successfully');
      fetchUserData(); // Refresh user data after status update
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  const handleCreateEvent = () => {
    navigate('/create-event'); // Navigate to Create Event page
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Profile Page</h2>
      {userData && (
        <div>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Mobile:</strong> {userData.mobile}</p>

          <button onClick={handleCreateEvent}>Create Event</button> {/* Create Event button */}

          <h3>Favorites</h3>
          <ul>
            {userData.favorites && userData.favorites.map((eventId) => (
              <li key={eventId}>{eventId}</li> // Assuming eventId represents the event name
            ))}
          </ul>

          <h3>Booked Events</h3>
          <ul>
            {userData.events && userData.events.map((event) => (
              <li key={event.event_id}>
                {event.event_name} - {event.status} 
                <button onClick={() => handleStatusChange(event.event_id, 'going', event.event_date)}>Mark as Going</button>
                <button onClick={() => handleStatusChange(event.event_id, 'not-going', event.event_date)}>Mark as Not Going</button>
                {moment().isAfter(event.event_date) && (
                  <span> (Event is expired)</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
