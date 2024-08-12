// EventForm.js
import React, { useState, useEffect } from 'react';

const EventForm = ({ event, onSaveEvent }) => {
  const [formData, setFormData] = useState({
    name: '',
    localDate: '',
    localTime: '',
    venue: {
      name: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
  });

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        venue: event.venue || formData.venue,
      });
    }
  }, [event]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveEvent(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>{event ? 'Edit Event' : 'Create Event'}</h2>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Event Name"
        required
      />
      <input
        type="date"
        name="localDate"
        value={formData.localDate}
        onChange={handleChange}
        placeholder="Date"
        required
      />
      <input
        type="time"
        name="localTime"
        value={formData.localTime}
        onChange={handleChange}
        placeholder="Time"
        required
      />
      <h3>Venue Information</h3>
      <input
        type="text"
        name="venue.name"
        value={formData.venue.name}
        onChange={handleChange}
        placeholder="Venue Name"
      />
      <input
        type="text"
        name="venue.address"
        value={formData.venue.address}
        onChange={handleChange}
        placeholder="Address"
      />
      <input
        type="text"
        name="venue.city"
        value={formData.venue.city}
        onChange={handleChange}
        placeholder="City"
      />
      <input
        type="text"
        name="venue.state"
        value={formData.venue.state}
        onChange={handleChange}
        placeholder="State"
      />
      <input
        type="text"
        name="venue.postalCode"
        value={formData.venue.postalCode}
        onChange={handleChange}
        placeholder="Postal Code"
      />
      <input
        type="text"
        name="venue.country"
        value={formData.venue.country}
        onChange={handleChange}
        placeholder="Country"
      />
      <button type="submit">Save</button>
    </form>
  );
};

export default EventForm;
