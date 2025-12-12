import apiClient, { handleApiError } from './client';

/**
 * Books API endpoints
 */

/**
 * Get all approved books
 * @param {Object} params - Query parameters (type, search, owner)
 * @returns {Promise} - List of books
 */
export const getApprovedBooks = async (params = {}) => {
  try {
    const response = await apiClient.get('/books', { params });
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get books by type
 * @param {string} bookType - Book type (SELL, DONATE, EXCHANGE)
 * @returns {Promise} - List of books
 */
export const getBooksByType = async (bookType) => {
  try {
    const response = await apiClient.get(`/books/type/${bookType}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get books by owner
 * @param {number} ownerId - Owner user ID
 * @returns {Promise} - List of books
 */
export const getBooksByOwner = async (ownerId) => {
  try {
    const response = await apiClient.get(`/books/owner/${ownerId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get book by ID
 * @param {number} bookId - Book ID
 * @returns {Promise} - Book details
 */
export const getBookById = async (bookId) => {
  try {
    const response = await apiClient.get(`/books/${bookId}`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Search books
 * @param {string} searchQuery - Search query
 * @returns {Promise} - Search results
 */
export const searchBooks = async (searchQuery) => {
  try {
    const response = await apiClient.get('/books/search', {
      params: { query: searchQuery },
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
 * Create book listing
 * @param {FormData} formData - Book data with PDF/image
 * @returns {Promise} - Created book
 */
export const createBook = async (formData) => {
  try {
    const response = await apiClient.post('/books', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      success: true,
      data: response.data,
      message: 'Book posted successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Update book
 * @param {number} bookId - Book ID
 * @param {Object} bookData - Updated book data
 * @returns {Promise} - Updated book
 */
export const updateBook = async (bookId, bookData) => {
  try {
    const response = await apiClient.put(`/books/${bookId}`, bookData);
    return {
      success: true,
      data: response.data,
      message: 'Book updated successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Delete book
 * @param {number} bookId - Book ID
 * @returns {Promise} - Success response
 */
export const deleteBook = async (bookId) => {
  try {
    const response = await apiClient.delete(`/books/${bookId}`);
    return {
      success: true,
      data: response.data,
      message: 'Book deleted successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Track book download
 * @param {number} bookId - Book ID
 * @returns {Promise} - Success response
 */
export const trackBookDownload = async (bookId) => {
  try {
    const response = await apiClient.post(`/books/${bookId}/download`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Create book request
 * @param {Object} requestData - Request data
 * @returns {Promise} - Created request
 */
export const createBookRequest = async (requestData) => {
  try {
    const response = await apiClient.post('/books/requests', requestData);
    return {
      success: true,
      data: response.data,
      message: 'Request submitted successfully',
    };
  } catch (error) {
    return handleApiError(error);
  }
};

/**
 * Get book requests
 * @param {number} bookId - Book ID
 * @returns {Promise} - List of requests
 */
export const getBookRequests = async (bookId) => {
  try {
    const response = await apiClient.get(`/books/${bookId}/requests`);
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return handleApiError(error);
  }
};
