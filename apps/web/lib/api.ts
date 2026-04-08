import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

const api = axios.create({
  baseURL,
  withCredentials: true,
});

// Interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 and not already a retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh tokens
        await axios.get(`${baseURL}/api/auth/refresh`, {
          withCredentials: true,
        });
        
        // Re-run the original request with the new session
        return api(originalRequest);
      } catch (refreshError) {
        console.error('Session refresh failed:', refreshError);
        // Optional: clear user store or redirect to login
      }
    }

    return Promise.reject(error);
  }
);

export default api;
