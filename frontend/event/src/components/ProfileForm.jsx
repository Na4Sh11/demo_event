import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

function CompleteProfile() {
  const { user } = useAuth0();
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/users', {
        auth0_id: user.sub,
        email: user.email,
        ...formData,
      });
      console.log('User created successfully:', response.data);
      window.location.href = '/'; // Redirect to homepage after saving
    } catch (error) {
      console.error('Error saving user details:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <input
        type="text"
        name="organization"
        value={formData.organization}
        onChange={handleChange}
        placeholder="Organization"
        required
      />
      <button type="submit">Complete Profile</button>
    </form>
  );
}

export default CompleteProfile;
