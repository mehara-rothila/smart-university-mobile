import axios from 'axios';
import { storage } from '../utils/storage';
import { API_BASE_URL } from '../utils/constants';

/**
 * Axios instance with JWT interceptors
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Store reference to logout function (will be set by AuthContext)
let logoutHandler = null;

export const setLogoutHandler = (handler) => {
  logoutHandler = handler;
};

/**
 * Request interceptor - Attach JWT token to all requests
 */
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - Handle 401 errors (token expiry)
 */
apiClient.interceptors.response.use(
  (response) => {
    // Return successful response as-is
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (token expired or invalid)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Clear storage and logout
      await storage.clearAll();

      // Call logout handler if available
      if (logoutHandler) {
        logoutHandler();
      }

      return Promise.reject(error);
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

/**
 * Helper function to handle API errors
 */
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
    return {
      success: false,
      message,
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // Request made but no response received
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      status: 0,
    };
  } else {
    // Something else happened
    return {
      success: false,
      message: error.message || 'An unexpected error occurred',
      status: 0,
    };
  }
};

export default apiClient;
