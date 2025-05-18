import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

/**
 * Groups notifications by their date
 * @param {Array} notifications - Array of notification objects
 * @returns {Object} Notifications grouped by date
 */
export const groupByDate = (notifications) => {
  if (!notifications || !notifications.length) return {};
  
  return notifications.reduce((groups, notification) => {
    const date = new Date(notification.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});
};

/**
 * Formats a timestamp into a human-readable time string
 * @param {string} timestamp - ISO timestamp
 * @returns {string} Formatted time string
 */
export const formatNotificationTime = (timestamp) => {
  if (!timestamp) return '';
  const now = new Date();
  const notificationDate = new Date(timestamp);
  const diffInHours = (now - notificationDate) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return notificationDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    return notificationDate.toLocaleDateString();
  }
};

/**
 * Manages the authentication token storage and axios headers
 * @param {string|null} token - JWT token or null to clear
 * @returns {Promise<void>}
 */
export const manageAuthToken = async (token) => {
  console.debug('[Auth] Managing token:', token ? 'Storing new token' : 'Clearing token');
  try {
    if (token) {
      await SecureStore.setItemAsync('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.debug('[Auth] Token stored and header set');
    } else {
      await SecureStore.deleteItemAsync('authToken');
      delete axios.defaults.headers.common['Authorization'];
      console.debug('[Auth] Token cleared');
    }
  } catch (error) {
    console.error('[Auth] Token management failed:', error);
    throw new Error('Session maintenance failed');
  }
};

/**
 * Processes authentication API responses
 * @param {Object} response - Axios response object
 * @returns {Object} Processed response data
 * @throws {Error} If response format is unexpected
 */
export const processAuthResponse = (response) => {
  if (!response.data) {
    throw new Error('Empty response from server');
  }

  if (typeof response.data === 'object') {
    if (response.data.token) {
      return {
        token: response.data.token,
        ...(response.data.email && { email: response.data.email }),
        ...(response.data.StudentID && { StudentID: response.data.StudentID })
      };
    }
    throw new Error(response.data.message || 'Authentication failed');
  }

  if (typeof response.data === 'string') {
    const tokenMatch = response.data.match(/^Bearer\s+([\w-]+\.[\w-]+\.[\w-]+)$/);
    if (tokenMatch && tokenMatch[1]) {
      return { token: tokenMatch[1] };
    }
  }

  throw new Error('Unexpected server response format');
};

/**
 * Retrieves the stored authentication token
 * @returns {Promise<string|null>} The stored token or null if not found
 */
export const getAuthToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    return token || null;
  } catch (error) {
    console.error('[Auth] Failed to retrieve token:', error);
    return null;
  }
};

/**
 * Verifies if a token is valid and not expired
 * @param {string} token - JWT token to verify
 * @returns {Promise<{valid: boolean, payload?: object}>} Verification result
 */
export const verifyToken = async (token) => {
  if (!token) return { valid: false };
  
  const parts = token.split('.');
  if (parts.length !== 3) {
    console.error('Invalid token structure');
    return { valid: false };
  }

  try {
    const payload = JSON.parse(atob(parts[1]));
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      console.error('Token expired');
      return { valid: false };
    }
    return { valid: true, payload };
  } catch (e) {
    console.error('Token parsing failed:', e);
    return { valid: false };
  }
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {boolean} True if valid
 */
export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {boolean} True if meets requirements
 */
export const validatePassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password)
  );
};

/**
 * Validates student ID format
 * @param {string} studentId - Student ID to validate
 * @returns {boolean} True if valid
 */
export const validateStudentId = (studentId) => {
  return /^OAIS-\d{4}$/.test(studentId);
};

/**
 * Deep merges two objects
 */
export const deepMerge = (target, source) => {
  if (typeof target !== 'object' || typeof source !== 'object') {
    return source;
  }
  
  const output = { ...target };
  for (const key in source) {
    if (source[key] instanceof Object && key in target) {
      output[key] = deepMerge(target[key], source[key]);
    } else {
      output[key] = source[key];
    }
  }
  return output;
};

/**
 * Checks if a value is empty
 */
export const isEmptyValue = (value) => 
  !value || 
  (typeof value === 'string' && value.trim() === '') || 
  (Array.isArray(value) && value.length === 0);

/**
 * Gets a nested value from an object using dot notation path
 */
export const getValue = (obj, path) => {
  return path.split('.').reduce((acc, part) => {
    return acc && acc[part] !== undefined ? acc[part] : '';
  }, obj);
};

/**
 * Sanitizes error messages
 */
export const sanitizeError = (error) => {
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};