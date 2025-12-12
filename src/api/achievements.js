import apiClient, { handleApiError } from './client';

/**
 * Achievements API endpoints
 */

/**
 * Get all approved achievements
 * @returns {Promise} - List of approved achievements
 */
export const getApprovedAchievements = async () => {
  try {
    const response = await apiClient.get('/achievements/approved');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get achievements by category
 * @param {string} category - Achievement category
 * @returns {Promise} - List of achievements in category
 */
export const getAchievementsByCategory = async (category) => {
  try {
    const response = await apiClient.get(`/achievements/approved/category/${category}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get student achievements
 * @param {number} studentId - Student ID
 * @returns {Promise} - List of student achievements
 */
export const getStudentAchievements = async (studentId) => {
  try {
    const response = await apiClient.get(`/achievements/student/${studentId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get achievement by ID
 * @param {number} achievementId - Achievement ID
 * @returns {Promise} - Achievement details
 */
export const getAchievementById = async (achievementId) => {
  try {
    const response = await apiClient.get(`/achievements/${achievementId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get popular achievements
 * @returns {Promise} - List of popular achievements
 */
export const getPopularAchievements = async () => {
  try {
    const response = await apiClient.get('/achievements/popular');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get recent achievements
 * @returns {Promise} - List of recent achievements
 */
export const getRecentAchievements = async () => {
  try {
    const response = await apiClient.get('/achievements/recent');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create achievement
 * @param {Object} achievementData - Achievement data
 * @returns {Promise} - Created achievement
 */
export const createAchievement = async (achievementData) => {
  try {
    const response = await apiClient.post('/achievements', achievementData);
    return {
      success: true,
      data: response.data,
      message: 'Achievement created successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update achievement
 * @param {number} achievementId - Achievement ID
 * @param {Object} achievementData - Updated achievement data
 * @returns {Promise} - Updated achievement
 */
export const updateAchievement = async (achievementId, achievementData) => {
  try {
    const response = await apiClient.put(`/achievements/${achievementId}`, achievementData);
    return {
      success: true,
      data: response.data,
      message: 'Achievement updated successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete achievement
 * @param {number} achievementId - Achievement ID
 * @returns {Promise} - Success response
 */
export const deleteAchievement = async (achievementId) => {
  try {
    const response = await apiClient.delete(`/achievements/${achievementId}`);
    return {
      success: true,
      data: response.data,
      message: 'Achievement deleted successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Like achievement
 * @param {number} achievementId - Achievement ID
 * @returns {Promise} - Success response
 */
export const likeAchievement = async (achievementId) => {
  try {
    const response = await apiClient.post(`/achievements/${achievementId}/like`);
    return {
      success: true,
      data: response.data,
      message: 'Liked achievement',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Unlike achievement
 * @param {number} achievementId - Achievement ID
 * @returns {Promise} - Success response
 */
export const unlikeAchievement = async (achievementId) => {
  try {
    const response = await apiClient.post(`/achievements/${achievementId}/unlike`);
    return {
      success: true,
      data: response.data,
      message: 'Unliked achievement',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Share achievement
 * @param {number} achievementId - Achievement ID
 * @returns {Promise} - Success response
 */
export const shareAchievement = async (achievementId) => {
  try {
    const response = await apiClient.post(`/achievements/${achievementId}/share`);
    return {
      success: true,
      data: response.data,
      message: 'Achievement shared',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get achievement comments
 * @param {number} achievementId - Achievement ID
 * @returns {Promise} - List of comments
 */
export const getAchievementComments = async (achievementId) => {
  try {
    const response = await apiClient.get(`/achievements/${achievementId}/comments`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Add achievement comment
 * @param {number} achievementId - Achievement ID
 * @param {string} comment - Comment text
 * @returns {Promise} - Created comment
 */
export const addAchievementComment = async (achievementId, comment) => {
  try {
    const response = await apiClient.post(`/achievements/${achievementId}/comments`, { comment });
    return {
      success: true,
      data: response.data,
      message: 'Comment added successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete achievement comment
 * @param {number} commentId - Comment ID
 * @returns {Promise} - Success response
 */
export const deleteAchievementComment = async (commentId) => {
  try {
    const response = await apiClient.delete(`/achievements/comments/${commentId}`);
    return {
      success: true,
      data: response.data,
      message: 'Comment deleted successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};
