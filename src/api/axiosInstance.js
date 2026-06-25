import axios from 'axios';

// Private axios instance for token refresh requests
const _refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Main axios instance used throughout the application
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// Refresh state management
let isRefreshing = false;
let failedQueue = [];

// Resolve or reject all queued requests
function _processQueue(error) {
  failedQueue.forEach(({ resolve, reject }) => {
    error ? reject(error) : resolve();
  });
  failedQueue = [];
}

// Request interceptor (cookies are automatically sent by the browser)
axiosInstance.interceptors.request.use(
  config => config,
  error => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  // Return only the API response payload
  response => response.data,

  async error => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const failingUrl = originalRequest?.url ?? '';

    const is401 = status === 401;
    const isRefreshEndpoint = failingUrl.includes('/users/refresh-token');
    const alreadyRetried = originalRequest?._retry === true;

    // Handle expired access token
    if (is401 && !isRefreshEndpoint && !alreadyRetried) {
      originalRequest._retry = true;

      // Queue requests while refresh is in progress
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        // Refresh access token
        await _refreshClient.post('/users/refresh-token');

        // Retry queued requests
        _processQueue(null);

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Reject queued requests and clear user state
        _processQueue(refreshError);

        const { store } = await import('../app/store.js');
        const { clearUser } = await import('../features/auth/authSlice.js');

        store.dispatch(clearUser());

        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    // Normalize error messages
    const serverMessage =
      error.response?.data?.message || error.message || 'An unexpected error occurred';

    return Promise.reject(new Error(serverMessage));
  }
);

export default axiosInstance;
