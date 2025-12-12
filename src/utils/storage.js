import * as SecureStore from 'expo-secure-store';

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
};

/**
 * Secure Storage wrapper using Expo SecureStore
 */
export const storage = {
  /**
   * Save JWT token securely
   */
  async saveToken(token) {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
      return true;
    } catch (error) {
      console.error('Error saving token:', error);
      return false;
    }
  },

  /**
   * Get JWT token
   */
  async getToken() {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  },

  /**
   * Save user data
   */
  async saveUser(user) {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Error saving user:', error);
      return false;
    }
  },

  /**
   * Get user data
   */
  async getUser() {
    try {
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user:', error);
      return null;
    }
  },

  /**
   * Save refresh token
   */
  async saveRefreshToken(token) {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, token);
      return true;
    } catch (error) {
      console.error('Error saving refresh token:', error);
      return false;
    }
  },

  /**
   * Get refresh token
   */
  async getRefreshToken() {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  },

  /**
   * Clear all stored data (logout)
   */
  async clearAll() {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },

  /**
   * Remove specific item
   */
  async removeItem(key) {
    try {
      await SecureStore.deleteItemAsync(key);
      return true;
    } catch (error) {
      console.error(`Error removing ${key}:`, error);
      return false;
    }
  },
};
