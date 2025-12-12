import apiClient, { handleApiError } from './client';

/**
 * User API endpoints
 */

/**
 * Get current user profile
 * @returns {Promise} - User profile data
 */
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/user/profile');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} - Updated user data
 */
export const updateUserProfile = async (profileData) => {
  try {
    const response = await apiClient.put('/user/profile', profileData);
    return {
      success: true,
      data: response.data,
      message: 'Profile updated successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Upload profile image
 * @param {Object} imageFile - Image file object
 * @returns {Promise} - Response with image URL
 */
export const uploadProfileImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', {
      uri: imageFile.uri,
      type: imageFile.type || 'image/jpeg',
      name: imageFile.fileName || 'profile.jpg',
    });

    const response = await apiClient.post('/user/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      data: response.data,
      message: 'Profile image uploaded successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update profile image with FormData
 * @param {FormData} formData - FormData with image
 * @returns {Promise} - Response with image URL
 */
export const updateProfileImage = async (formData) => {
  try {
    const response = await apiClient.post('/user/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return {
      success: true,
      data: response.data,
      message: 'Profile image updated successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete profile image
 * @returns {Promise} - Success/failure response
 */
export const deleteProfileImage = async () => {
  try {
    const response = await apiClient.delete('/user/profile/image');
    return {
      success: true,
      data: response.data,
      message: 'Profile image deleted successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get all users (Admin only)
 * @returns {Promise} - List of users
 */
export const getAllUsers = async () => {
  try {
    const response = await apiClient.get('/user/all');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete user (Admin only)
 * @param {number} userId - User ID to delete
 * @returns {Promise} - Success/failure response
 */
export const deleteUser = async (userId) => {
  try {
    const response = await apiClient.delete(`/user/${userId}`);
    return {
      success: true,
      data: response.data,
      message: 'User deleted successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};
