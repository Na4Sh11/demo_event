import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { getUserById } from '../utils/api'; // Adjust path as necessary
import authConfig from '../auth_config.json';

const ProfilePage = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const requestedScopes = ["openid", "profile", "email"];

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData(user.sub);
    }
  }, [isAuthenticated, user]);

  const fetchUserData = async (auth0Id) => {
    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: authConfig.REACT_APP_AUTH0_AUDIENCE,
          scope: requestedScopes.join(" "),
        },
      });

      const response = await getUserById(auth0Id, token);
      console.log('Fetched user data:', response.data);
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
      fetchUserData(userData.id); // Refresh user data after status update
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status.');
    }
  };

  const handleCreateEvent = () => {
    navigate('/create-event');
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Profile Page</h2>
      {userData ? (
        <div>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Organization:</strong> {userData.organization}</p>

          <button onClick={handleCreateEvent}>Create Event</button>

          <h3>Favorites</h3>
          <ul>
            {userData.favorites && userData.favorites.map((eventId) => (
              <li key={eventId}>{eventId}</li>
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
      ) : (
        <div>No user data available.</div>
      )}
    </div>
  );
};

export default ProfilePage;
