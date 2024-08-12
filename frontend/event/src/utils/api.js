// src/api/api.js
import axios from 'axios';
import TokenUtil from '../utils/TokenUtil'; // Ensure you have a utility for token management

const API_URL = 'http://localhost:5001'; // Backend API base URL

// Utility function to get the token
const getToken = async () => {
  try {
    const token = await TokenUtil.getToken(); // Retrieve the token from your utility
    return token;
  } catch (error) {
    console.error('Error getting token:', error);
    throw error;
  }
};

// Events
export const getEvents = async () => {
  try {
    const token = await getToken();
    return axios.get(`${API_URL}/events`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const getEventById = async (id) => {
  try {
    const token = await getToken();
    return axios.get(`${API_URL}/events/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error fetching event by ID:', error);
    throw error;
  }
};

// Users
export const getUsers = async () => {
  try {
    const token = await getToken();
    return axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
  try {
    const token = await getToken();
    return axios.get(`${API_URL}/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    throw error;
  }
};

export const updateUserOrganization = async (id, organization) => {
  try {
    const token = await getToken();
    return axios.put(`${API_URL}/users/${id}`, {
      organization,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error updating user organization:', error);
    throw error;
  }
};

// src/utils/api.js
export const updateUserProfile = async (userId, profileData) => {
  try {
    const token = await getToken();
    return axios.put(`${API_URL}/users/${userId}`, profileData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Additional API Methods
export const createEvent = async (eventData) => {
  try {
    const token = await getToken();
    return axios.post(`${API_URL}/events`, eventData, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const deleteEvent = async (id) => {
  try {
    const token = await getToken();
    return axios.delete(`${API_URL}/events/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
