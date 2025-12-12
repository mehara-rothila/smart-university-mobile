import React, { createContext, useState, useEffect, useContext } from 'react';
import { storage } from '../utils/storage';
import { signin as signinApi, signup as signupApi } from '../api/auth';
import { setLogoutHandler } from '../api/client';

/**
 * Auth Context for managing authentication state
 */
const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  updateUser: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!token && !!user;

  /**
   * Load user and token from secure storage on app start
   */
  useEffect(() => {
    loadStoredAuth();
  }, []);

  /**
   * Set logout handler in API client
   */
  useEffect(() => {
    setLogoutHandler(logout);
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedToken = await storage.getToken();
      const storedUser = await storage.getUser();

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading auth from storage:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Login function
   * @param {string} usernameOrEmail - Username or email
   * @param {string} password - Password
   * @returns {Promise<Object>} - Success/failure response
   */
  const login = async (usernameOrEmail, password) => {
    try {
      const response = await signinApi(usernameOrEmail, password);

      if (response.success && response.data) {
        const { token: authToken, user: userData } = response.data;

        // Save to secure storage
        await storage.saveToken(authToken);
        await storage.saveUser(userData);

        // Update state
        setToken(authToken);
        setUser(userData);

        return {
          success: true,
          message: 'Login successful',
        };
      } else {
        return {
          success: false,
          message: response.message || 'Login failed',
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.message || 'An error occurred during login',
      };
    }
  };

  /**
   * Signup function
   * @param {Object} userData - User registration data
   * @returns {Promise<Object>} - Success/failure response
   */
  const signup = async (userData) => {
    try {
      const response = await signupApi(userData);

      if (response.success && response.data) {
        const { token: authToken, user: newUser } = response.data;

        // Save to secure storage
        await storage.saveToken(authToken);
        await storage.saveUser(newUser);

        // Update state
        setToken(authToken);
        setUser(newUser);

        return {
          success: true,
          message: 'Account created successfully',
        };
      } else {
        return {
          success: false,
          message: response.message || 'Signup failed',
        };
      }
    } catch (error) {
      console.error('Signup error:', error);
      return {
        success: false,
        message: error.message || 'An error occurred during signup',
      };
    }
  };

  /**
   * Logout function
   */
  const logout = async () => {
    try {
      // Clear secure storage
      await storage.clearAll();

      // Clear state
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  /**
   * Update user data in context (after profile edit, etc.)
   * @param {Object} updatedUser - Updated user data
   */
  const updateUser = async (updatedUser) => {
    try {
      await storage.saveUser(updatedUser);
      setUser(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    signup,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to use Auth Context
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
