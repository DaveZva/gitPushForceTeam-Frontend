import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (userData) => {
    // userData = { firstName, lastName, email, password }
    const response = await api.post('/auth/register', userData);
    return response.data;
};

export const getAllAdminShows = async () => {
    const response = await api.get('/exhibitions/all');
    return response.data;
};

export const createExhibition = async (exhibitionData) => {
    const response = await api.post('/exhibitions', exhibitionData);
    return response.data;
};

export default api;