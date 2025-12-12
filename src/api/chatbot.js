import apiClient, { handleApiError } from './client';

/**
 * Chatbot API endpoints
 */

/**
 * Send a message to the chatbot
 * @param {string} message - User message
 * @param {Array} conversationHistory - Previous messages (optional)
 * @returns {Promise} - Chatbot response
 */
export const sendChatMessage = async (message, conversationHistory = []) => {
  try {
    const response = await apiClient.post('/chatbot/ask', {
      message,
      conversationHistory,
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
 * Send a message with document context to the chatbot
 * @param {string} message - User message
 * @param {FormData} formData - FormData with document and message
 * @returns {Promise} - Chatbot response
 */
export const sendChatMessageWithDocument = async (formData) => {
  try {
    const response = await apiClient.post('/chatbot/ask-with-document', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
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
 * Clear chatbot conversation history
 * @returns {Promise} - Success response
 */
export const clearChatHistory = async () => {
  try {
    const response = await apiClient.delete('/chatbot/history');
    return {
      success: true,
      data: response.data,
      message: 'Chat history cleared',
    };
  } catch (error) {
    return handleApiError(error);
  }
};
