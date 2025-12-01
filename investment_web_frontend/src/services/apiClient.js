import axios from 'axios';

/**
 * Simple API client wrapping axios with base URL and auth header management.
 * Reads base URL from REACT_APP_API_BASE_URL env var.
 */
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  timeout: 15000,
});

// Attach auth token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    // Ensure headers object exists before setting
    if (!config.headers) config.headers = {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Basic error handler passthrough
api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default api;
