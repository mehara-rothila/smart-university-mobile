import apiClient, { handleApiError } from './client';

/**
 * Events API endpoints
 */

/**
 * Get all approved events
 * @returns {Promise} - List of approved events
 */
export const getApprovedEvents = async () => {
  try {
    const response = await apiClient.get('/events/approved');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get upcoming events
 * @returns {Promise} - List of upcoming events
 */
export const getUpcomingEvents = async () => {
  try {
    const response = await apiClient.get('/events/upcoming');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get past events
 * @returns {Promise} - List of past events
 */
export const getPastEvents = async () => {
  try {
    const response = await apiClient.get('/events/past');
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get events by category
 * @param {string} category - Event category
 * @returns {Promise} - List of events in category
 */
export const getEventsByCategory = async (category) => {
  try {
    const response = await apiClient.get(`/events/category/${category}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get event by ID
 * @param {number} eventId - Event ID
 * @returns {Promise} - Event details
 */
export const getEventById = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get user's created events
 * @param {number} creatorId - User ID
 * @returns {Promise} - List of user's events
 */
export const getMyEvents = async (creatorId) => {
  try {
    const response = await apiClient.get(`/events/my-events/${creatorId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create new event
 * @param {Object} eventData - Event data
 * @returns {Promise} - Created event
 */
export const createEvent = async (eventData) => {
  try {
    const response = await apiClient.post('/events', eventData);
    return {
      success: true,
      data: response.data,
      message: 'Event created successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update event
 * @param {number} eventId - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise} - Updated event
 */
export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await apiClient.put(`/events/${eventId}`, eventData);
    return {
      success: true,
      data: response.data,
      message: 'Event updated successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete event
 * @param {number} eventId - Event ID
 * @returns {Promise} - Success response
 */
export const deleteEvent = async (eventId) => {
  try {
    const response = await apiClient.delete(`/events/${eventId}`);
    return {
      success: true,
      data: response.data,
      message: 'Event deleted successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Register for event
 * @param {number} eventId - Event ID
 * @returns {Promise} - Registration confirmation
 */
export const registerForEvent = async (eventId) => {
  try {
    const response = await apiClient.post(`/events/${eventId}/register`);
    return {
      success: true,
      data: response.data,
      message: 'Registered successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Cancel event registration
 * @param {number} eventId - Event ID
 * @returns {Promise} - Cancellation confirmation
 */
export const cancelEventRegistration = async (eventId) => {
  try {
    const response = await apiClient.post(`/events/${eventId}/cancel-registration`);
    return {
      success: true,
      data: response.data,
      message: 'Registration cancelled',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get event registrations
 * @param {number} eventId - Event ID
 * @returns {Promise} - List of registrations
 */
export const getEventRegistrations = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}/registrations`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Check if user is registered for event
 * @param {number} eventId - Event ID
 * @returns {Promise} - Registration status
 */
export const isRegisteredForEvent = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}/is-registered`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get user's registered events
 * @param {number} userId - User ID
 * @returns {Promise} - List of registered events
 */
export const getUserRegisteredEvents = async (userId) => {
  try {
    const response = await apiClient.get(`/events/user/${userId}/registered`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get event comments
 * @param {number} eventId - Event ID
 * @returns {Promise} - List of comments
 */
export const getEventComments = async (eventId) => {
  try {
    const response = await apiClient.get(`/events/${eventId}/comments`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Add event comment
 * @param {number} eventId - Event ID
 * @param {string} comment - Comment text
 * @returns {Promise} - Created comment
 */
export const addEventComment = async (eventId, comment) => {
  try {
    const response = await apiClient.post(`/events/${eventId}/comments`, { comment });
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
 * Delete event comment
 * @param {number} eventId - Event ID
 * @param {number} commentId - Comment ID
 * @returns {Promise} - Success response
 */
export const deleteEventComment = async (eventId, commentId) => {
  try {
    const response = await apiClient.delete(`/events/${eventId}/comments/${commentId}`);
    return {
      success: true,
      data: response.data,
      message: 'Comment deleted successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};
