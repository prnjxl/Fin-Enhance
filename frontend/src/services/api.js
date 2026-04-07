import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

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

// Auth APIs
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getMe = () => api.get('/auth/me');

// Form Data APIs
export const submitFormData = (data) => api.post('/forms', data);
export const getFormData = () => api.get('/forms');

// Credit Score APIs
export const predictCreditScore = () => api.post('/forms/predict');
export const getCreditScore = () => api.get('/forms/score');

// OAuth redirects
export const GOOGLE_AUTH_URL = `${API_BASE_URL}/auth/google`;
export const GITHUB_AUTH_URL = `${API_BASE_URL}/auth/github`;

export default api;
