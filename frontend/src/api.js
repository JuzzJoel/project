// api.js
// Central Axios instance with cookie support and automatic 401 → /login redirect.

import axios from 'axios';

const api = axios.create({
  baseURL:         'http://localhost:5000/api',
  withCredentials: true, // Critical: allows the browser to send/receive httpOnly cookies
  timeout:         10_000,
});

// ── Response Interceptor: "Log In AGAIN" Philosophy ───────────────────────
// Any 401 from any endpoint automatically clears state and redirects to login.
// This handles: expired JWTs, revoked tokens, and missing cookies — uniformly.
api.interceptors.response.use(
  // Pass through successful responses untouched
  (response) => response,

  // Handle errors
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('[api] 401 Unauthorized — redirecting to /login');

      // Optional: clear any client-side auth state here
      // e.g., authStore.reset() if using Zustand/Redux

      // Hard redirect — replaces history so user can't hit Back into a protected page
      window.location.replace('/login');
    }

    // Re-throw so component-level .catch() handlers still work for non-401 errors
    return Promise.reject(error);
  }
);

export default api;