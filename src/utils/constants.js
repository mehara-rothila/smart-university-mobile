/**
 * Constants used throughout the app
 */

// API Base URL - Update this with your Heroku URL
export const API_BASE_URL = process.env.API_URL || 'http://localhost:8080/api';
export const WS_BASE_URL = process.env.WS_URL || 'ws://localhost:8080/ws';

// User Roles
export const USER_ROLES = {
  STUDENT: 'STUDENT',
  FACULTY: 'FACULTY',
  ADMIN: 'ADMIN',
};

// Event Categories
export const EVENT_CATEGORIES = {
  ACADEMIC: 'ACADEMIC',
  CULTURAL: 'CULTURAL',
  SPORTS: 'SPORTS',
  TECHNICAL: 'TECHNICAL',
  WORKSHOP: 'WORKSHOP',
  SEMINAR: 'SEMINAR',
  OTHER: 'OTHER',
};

// Event Status
export const EVENT_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED',
};

// Achievement Categories
export const ACHIEVEMENT_CATEGORIES = {
  ACADEMIC: 'ACADEMIC',
  SPORTS: 'SPORTS',
  CULTURAL: 'CULTURAL',
  TECHNICAL: 'TECHNICAL',
  SOCIAL: 'SOCIAL',
  OTHER: 'OTHER',
};

// Lost & Found Types
export const LOST_FOUND_TYPES = {
  LOST: 'LOST',
  FOUND: 'FOUND',
};

// Lost & Found Categories
export const LOST_FOUND_CATEGORIES = {
  ELECTRONICS: 'ELECTRONICS',
  BOOKS: 'BOOKS',
  CLOTHING: 'CLOTHING',
  ACCESSORIES: 'ACCESSORIES',
  DOCUMENTS: 'DOCUMENTS',
  OTHER: 'OTHER',
};

// Book Types
export const BOOK_TYPES = {
  SELL: 'SELL',
  DONATE: 'DONATE',
  EXCHANGE: 'EXCHANGE',
};

// Book Status
export const BOOK_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  SOLD: 'SOLD',
  DONATED: 'DONATED',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  EVENT: 'EVENT',
  ACHIEVEMENT: 'ACHIEVEMENT',
  BOOK: 'BOOK',
  LOST_FOUND: 'LOST_FOUND',
  SYSTEM: 'SYSTEM',
  EMERGENCY: 'EMERGENCY',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 10,
};

// Image Upload Limits
export const IMAGE_LIMITS = {
  MAX_SIZE_MB: 5,
  MAX_SIZE_BYTES: 5 * 1024 * 1024,
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/jpg'],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  FULL: 'MMMM DD, YYYY hh:mm A',
  TIME: 'hh:mm A',
  DATE_TIME: 'MMM DD, YYYY hh:mm A',
};

// OAuth Providers
export const OAUTH_PROVIDERS = {
  GOOGLE: 'google',
  GITHUB: 'github',
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  LOGOUT_SUCCESS: 'Logout successful!',
  UPDATE_SUCCESS: 'Updated successfully!',
  DELETE_SUCCESS: 'Deleted successfully!',
  UPLOAD_SUCCESS: 'Upload successful!',
};
