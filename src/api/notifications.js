import apiClient, { handleApiError } from './client';

/**
 * Notifications API endpoints
 */

/**
 * Get user notifications
 * @param {number} userId - User ID
 * @returns {Promise} - List of notifications
 */
export const getUserNotifications = async (userId) => {
  try {
    const response = await apiClient.get(`/notifications/user/${userId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Mark notification as read
 * @param {number} notificationId - Notification ID
 * @returns {Promise} - Success response
 */
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await apiClient.put(`/notifications/${notificationId}/read`);
    return {
      success: true,
      data: response.data,
      message: 'Notification marked as read',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete notification
 * @param {number} notificationId - Notification ID
 * @returns {Promise} - Success response
 */
export const deleteNotification = async (notificationId) => {
  try {
    const response = await apiClient.delete(`/notifications/${notificationId}`);
    return {
      success: true,
      data: response.data,
      message: 'Notification deleted',
    };
  } catch (error) {
    return handleApiError(error);
  }
};
