// api.js
import axios from 'axios';

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL;

// Debug logging (remove in production)
if (!API_URL) {
  console.error('[api] VITE_API_URL is not set! Check your environment variables.');
}

console.log('[api] Using API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  timeout: 30000,
});

// Request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log(`[api] ${config.method?.toUpperCase()} request to: ${config.baseURL}${config.url}`);
    return config;
  },
  (error) => {
    console.error('[api] Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`[api] Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url;
    
    console.error(`[api] Error ${status} from ${url}:`, error.response?.data || error.message);
    
    if (status === 401) {
      console.warn('[api] 401 Unauthorized — redirecting to /login');
      window.location.replace('/login');
    }
    
    return Promise.reject(error);
  }
);

export default api;