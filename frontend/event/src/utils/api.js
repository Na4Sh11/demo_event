import axios from 'axios';

const API_URL = 'http://localhost:5001/api'; // Backend API base URL

export const getEvents = () => {
  return axios.get(`${API_URL}/events`);
};

export const getEventById = (id) => {
  return axios.get(`${API_URL}/events/${id}`);
};
