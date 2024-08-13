// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { useAuth0 } from '@auth0/auth0-react';
// import axios from 'axios';

// const EventDetailsPage = () => {
//   const { eventID } = useParams();
//   const { isAuthenticated, loginWithRedirect } = useAuth0();
//   const [event, setEvent] = React.useState(null);

//   React.useEffect(() => {
//     const fetchEventDetails = async () => {
//       try {
//         const response = await axios.get(`http://localhost:5001/events/${eventID}`);
//         setEvent(response.data);
//       } catch (error) {
//         console.error('Error fetching event details:', error);
//       }
//     };

//     fetchEventDetails();
//   }, [eventID]);

//   if (!event) {
//     return <p>Loading...</p>;
//   }

//   const { name, localDate, localTime, venue, price, url } = event;

//   const handleFavoriteClick = () => {
//     if (!isAuthenticated) {
//       loginWithRedirect();
//     } else {
//       // Add to favorites logic here
//       console.log('Added to favorites');
//     }
//   };

//   const handleBuyTicketsClick = () => {
//     if (!isAuthenticated) {
//       loginWithRedirect();
//     } else {
//       // Buy tickets logic here
//       console.log('Buying tickets');
//     }
//   };

//   return (
//     <div className="event-details">
//       <h1>{name}</h1>
//       <p>Date: {new Date(localDate).toLocaleDateString()}</p>
//       <p>Time: {localTime}</p>
//       <h2>Venue Information</h2>
//       {venue ? (
//         <div>
//           <p><strong>Name:</strong> {venue.name}</p>
//           <p><strong>Address:</strong> {venue.address}, {venue.city}, {venue.state} {venue.postalCode}</p>
//           <p><strong>Country:</strong> {venue.country}</p>
//         </div>
//       ) : (
//         <p>No venue information available.</p>
//       )}
//       <button className="btn btn-primary" onClick={handleFavoriteClick}>Add to Favorites</button>
//       <button className="btn btn-success" onClick={handleBuyTicketsClick}>Buy Tickets</button>
//     </div>
//   );
// };

// export default EventDetailsPage;
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

const EventDetailsPage = () => {
  const { eventID } = useParams();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [event, setEvent] = React.useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  React.useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/events/${eventID}`);
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event details:', error);
      }
    };

    fetchEventDetails();
  }, [eventID]);

  if (!event) {
    return <p>Loading...</p>;
  }

  const { name, localDate, localTime, venue, price, url } = event;

  const handleFavoriteClick = () => {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      // Add to favorites logic here
      console.log('Added to favorites');
    }
  };

  const handleBuyTicketsClick = () => {
    if (!isAuthenticated) {
      loginWithRedirect();
    } else {
      // Navigate to payment page
      navigate(`/events/${eventID}/payment`);
    }
  };

  return (
    <div className="event-details">
      <h1>{name}</h1>
      <p>Date: {new Date(localDate).toLocaleDateString()}</p>
      <p>Time: {localTime}</p>
      <h2>Venue Information</h2>
      {venue ? (
        <div>
          <p><strong>Name:</strong> {venue.name}</p>
          <p><strong>Address:</strong> {venue.address}, {venue.city}, {venue.state} {venue.postalCode}</p>
          <p><strong>Country:</strong> {venue.country}</p>
        </div>
      ) : (
        <p>No venue information available.</p>
      )}
      <button className="btn btn-primary" onClick={handleFavoriteClick}>Add to Favorites</button>
      <button className="btn btn-success" onClick={handleBuyTicketsClick}>Buy Tickets</button>
    </div>
  );
};

export default EventDetailsPage;
