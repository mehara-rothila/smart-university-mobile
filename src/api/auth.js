import apiClient, { handleApiError } from './client';

/**
 * Auth API endpoints
 */

/**
 * Sign in with email/username and password
 * @param {string} usernameOrEmail - Username or email
 * @param {string} password - Password
 * @returns {Promise} - Response with token and user data
 */
export const signin = async (usernameOrEmail, password) => {
  try {
    const response = await apiClient.post('/auth/signin', {
      usernameOrEmail,
      password,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Sign up new user
 * @param {Object} userData - User registration data
 * @returns {Promise} - Response with token and user data
 */
export const signup = async (userData) => {
  try {
    const response = await apiClient.post('/auth/signup', userData);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * OAuth registration/login (Google, GitHub)
 * @param {string} provider - OAuth provider (google, github)
 * @param {string} token - OAuth access token
 * @param {Object} profile - User profile data from OAuth provider
 * @returns {Promise} - Response with token and user data
 */
export const oauthRegister = async (provider, token, profile) => {
  try {
    const response = await apiClient.post('/auth/oauth/register', {
      provider,
      token,
      profile,
    });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Request password reset OTP
 * @param {string} email - User email
 * @returns {Promise} - Success/failure response
 */
export const forgotPassword = async (email) => {
  try {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return {
      success: true,
      data: response.data,
      message: 'OTP sent to your email',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Reset password with OTP
 * @param {string} email - User email
 * @param {string} otp - 6-digit OTP code
 * @param {string} newPassword - New password
 * @returns {Promise} - Success/failure response
 */
export const resetPassword = async (email, otp, newPassword) => {
  try {
    const response = await apiClient.post('/auth/reset-password', {
      email,
      otp,
      newPassword,
    });
    return {
      success: true,
      data: response.data,
      message: 'Password reset successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Verify OTP code (optional - for validation before resetting)
 * @param {string} email - User email
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise} - Validation response
 */
export const verifyOtp = async (email, otp) => {
  try {
    // Note: Backend may not have a dedicated verify endpoint
    // This is a placeholder if you want to add OTP validation
    const response = await apiClient.post('/auth/verify-otp', { email, otp });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};
