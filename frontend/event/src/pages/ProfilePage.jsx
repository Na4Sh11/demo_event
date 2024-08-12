import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { getUserById, getEventById, updateEventStatus, getUserHistory } from '../utils/api'; // Adjust path as necessary

const ProfilePage = () => {
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [userData, setUserData] = useState(null);
  const [eventDetails, setEventDetails] = useState({});
  const [bookedEvents, setBookedEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  

  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData(user.sub);
    }
  }, [isAuthenticated, user]);

  const fetchUserData = async (auth0Id) => {
    try {
      const token = await getAccessTokenSilently();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch user data
      const userResponse = await getUserById(auth0Id, headers);
      const userData = userResponse.data.user;
      setUserData(userData);

      console.log("Fetched User Data:", userData); // Debugging line

      // Fetch user history for booked events
      const historyResponse = await getUserHistory(auth0Id, headers);
      const historyData = historyResponse.data; // Adjust if needed based on your API response

      console.log("History Response:", historyResponse); // Debugging line
      console.log("History Data:", historyData); // Debugging line

      // Extract booked events from history
      const fetchedBookedEvents = historyData.bookedEvents || [];
      setBookedEvents(fetchedBookedEvents);

      console.log("Fetched Booked Events:", fetchedBookedEvents); // Debugging line

      // Create a set of unique event IDs from favorites and booked events
      const eventIds = [...new Set([
        ...(userData.favorites || []),
        ...(fetchedBookedEvents.map(event => event.event_id) || [])
      ])];

      if (eventIds.length > 0) {
        const eventDetailsPromises = eventIds.map(eventId => getEventById(eventId, headers));
        const eventDetailsResponses = await Promise.all(eventDetailsPromises);
        const eventDetailsMap = {};
        eventDetailsResponses.forEach(res => {
          eventDetailsMap[res.data.id] = res.data;
        });
        setEventDetails(eventDetailsMap);
      }

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
      const token = await getAccessTokenSilently();
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      await updateEventStatus(userData.id, eventId, newStatus, headers);
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
              <li key={eventId}>
                {eventDetails[eventId]?.name || eventId}
              </li>
            ))}
          </ul>

          <h3>Booked Events</h3>
          <ul>
            {bookedEvents.map((event) => (
              <li key={event.event_id}>
                {eventDetails[event.event_id]?.name || event.event_id} - {event.status}
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
