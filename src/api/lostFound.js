import apiClient, { handleApiError } from './client';

/**
 * Lost & Found API endpoints
 */

/**
 * Get all lost & found items with filters
 * @param {Object} params - Query parameters (type, category, location, search, status)
 * @returns {Promise} - List of items
 */
export const getLostFoundItems = async (params = {}) => {
  try {
    const response = await apiClient.get('/lost-found/items', { params });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get item by ID
 * @param {number} itemId - Item ID
 * @returns {Promise} - Item details
 */
export const getLostFoundItemById = async (itemId) => {
  try {
    const response = await apiClient.get(`/lost-found/items/${itemId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create lost/found item
 * @param {FormData} formData - Item data with image
 * @returns {Promise} - Created item
 */
export const createLostFoundItem = async (formData) => {
  try {
    const response = await apiClient.post('/lost-found/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      success: true,
      data: response.data,
      message: 'Item posted successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update item
 * @param {number} itemId - Item ID
 * @param {Object} itemData - Updated item data
 * @returns {Promise} - Updated item
 */
export const updateLostFoundItem = async (itemId, itemData) => {
  try {
    const response = await apiClient.put(`/lost-found/items/${itemId}`, itemData);
    return {
      success: true,
      data: response.data,
      message: 'Item updated successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete item
 * @param {number} itemId - Item ID
 * @returns {Promise} - Success response
 */
export const deleteLostFoundItem = async (itemId) => {
  try {
    const response = await apiClient.delete(`/lost-found/items/${itemId}`);
    return {
      success: true,
      data: response.data,
      message: 'Item deleted successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Claim an item
 * @param {number} itemId - Item ID
 * @param {string} claimMessage - Claim message/description
 * @returns {Promise} - Success response
 */
export const claimItem = async (itemId, claimMessage) => {
  try {
    const response = await apiClient.post(`/lost-found/items/${itemId}/claim`, {
      claimMessage,
    });
    return {
      success: true,
      data: response.data,
      message: 'Claim submitted successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};
