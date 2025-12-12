import apiClient, { handleApiError } from './client';

/**
 * Weather API endpoints
 */

/**
 * Get current weather
 * @param {string} city - City name (optional)
 * @returns {Promise} - Current weather data
 */
export const getCurrentWeather = async (city = null) => {
  try {
    const params = city ? { city } : {};
    const response = await apiClient.get('/weather/current', { params });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};
