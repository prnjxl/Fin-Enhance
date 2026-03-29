import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Form Data API
export const submitFormData = (data) => api.post('/forms', data);
export const getFormData = () => api.get('/forms');

// OAuth URLs (redirect, not API calls)
export const GOOGLE_AUTH_URL = `${API_BASE_URL}/auth/google`;
export const GITHUB_AUTH_URL = `${API_BASE_URL}/auth/github`;

export default api;
