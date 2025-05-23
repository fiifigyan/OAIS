import * as SecureStore from 'expo-secure-store';
import * as yup from 'yup';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Logging utility with different levels
const logger = {
  debug: (message, data) => console.debug(`[DEBUG] ${message}`, data),
  info: (message, data) => console.log(`[INFO] ${message}`, data),
  warn: (message, data) => console.warn(`[WARN] ${message}`, data),
  error: (message, error) => console.error(`[ERROR] ${message}`, error),
};

// ==============================================
// File Handling Utilities
// ==============================================

export const pickDocument = async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: '*/*',
      copyToCacheDirectory: true,
    });

    if (result.type === 'success') {
      const fileInfo = await FileSystem.getInfoAsync(result.uri);
      return {
        name: result.name,
        size: fileInfo.size,
        uri: result.uri,
        type: result.mimeType,
      };
    }
    return null;
  } catch (error) {
    logger.error('Error picking document', error);
    throw error;
  }
};

export const pickImage = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
      return {
        name: result.assets[0].fileName || `image_${Date.now()}.jpg`,
        size: fileInfo.size,
        uri: result.assets[0].uri,
        type: result.assets[0].type || 'image/jpeg',
      };
    }
    return null;
  } catch (error) {
    logger.error('Error picking image', error);
    throw error;
  }
};

export const takePhoto = async () => {
  try {
    await ImagePicker.requestCameraPermissionsAsync();
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (!result.canceled) {
      const fileInfo = await FileSystem.getInfoAsync(result.assets[0].uri);
      return {
        name: `photo_${Date.now()}.jpg`,
        size: fileInfo.size,
        uri: result.assets[0].uri,
        type: 'image/jpeg',
      };
    }
    return null;
  } catch (error) {
    logger.error('Error taking photo', error);
    throw error;
  }
};

export const getFileType = (fileName) => {
  if (!fileName) return 'unknown';
  
  const extension = fileName.split('.').pop().toLowerCase();
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];
  const docTypes = ['doc', 'docx', 'txt', 'rtf'];
  const pdfTypes = ['pdf'];
  const sheetTypes = ['xls', 'xlsx', 'csv'];
  const videoTypes = ['mp4', 'mov', 'avi', 'mkv'];
  const audioTypes = ['mp3', 'wav', 'ogg'];
  
  if (imageTypes.includes(extension)) return 'image';
  if (pdfTypes.includes(extension)) return 'pdf';
  if (docTypes.includes(extension)) return 'document';
  if (sheetTypes.includes(extension)) return 'spreadsheet';
  if (videoTypes.includes(extension)) return 'video';
  if (audioTypes.includes(extension)) return 'audio';
  
  return 'unknown';
};

export const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ==============================================
// Authentication Utilities
// ==============================================

/**
 * Manages authentication token in secure storage and axios headers
 * @param {string|null} token - Token to store or null to clear
 * @param {boolean} [isTemporary=false] - Whether the token is temporary
 */
export const manageAuthToken = async (token, isTemporary = false) => {
  try {
    logger.debug('Managing auth token', { 
      action: token ? 'Storing' : 'Clearing',
      type: isTemporary ? 'Temporary' : 'Permanent'
    });

    if (token) {
      await SecureStore.setItemAsync('authToken', token);
      
      // Only set axios header for permanent tokens
      if (!isTemporary) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      logger.info('Auth token stored', { type: isTemporary ? 'Temporary' : 'Permanent' });
    } else {
      await SecureStore.deleteItemAsync('authToken');
      delete axios.defaults.headers.common['Authorization'];
      logger.info('Auth token cleared');
    }
  } catch (error) {
    logger.error('Token management failed', error);
    throw new Error('Session maintenance failed');
  }
};

/**
 * Retrieves authentication token from secure storage
 * @returns {Promise<string|null>} The stored token or null
 */
export const getAuthToken = async () => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    return token || null;
  } catch (error) {
    logger.error('Failed to retrieve auth token', error);
    return null;
  }
};

/**
 * Decodes and verifies a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Promise<{message: string, token: string}>}
 */
export const verifyToken = async (token) => {
  if (!token) {
    logger.debug('Token verification failed: No token provided');
    return { valid: false };
  }

  try {
    const decoded = jwtDecode(token);
    
    // Basic token structure validation
    if (typeof decoded !== 'object' || !decoded.exp) {
      logger.error('Invalid token structure');
      return { valid: false };
    }

    // Check expiration
    if (Date.now() >= decoded.exp * 1000) {
      logger.error('Token expired');
      return { valid: false };
    }

    // Check if token is temporary (lacks certain claims)
    const isTemporary = !decoded.StudentID && !decoded.scope;

    return { 
      valid: true, 
      payload: decoded,
      isTemporary 
    };
  } catch (error) {
    logger.error('Token verification failed:', error);
    return { valid: false };
  }
};

// ==============================================
// Validation Utilities
// ==============================================

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password)
  );
};

export const validateStudentId = (studentId) => {
  return /^OAIS-\d{4}$/.test(studentId);
};

// Yup Validation Schemas
export const loginSchema = yup.object().shape({
  StudentID: yup.string()
    .required('Student ID is required')
    .matches(/^OAIS-\d{4}$/, 'Format: OAIS-0000 (4 digits after hyphen)'),
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  password: yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters'),
});

export const signupSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/\d/, 'Must contain at least one number')
    .matches(/[@$!%*?&]/, 'Must contain at least one special character (@$!%*?&)'),
});

export const forgotPasswordSchema = yup.object().shape({
  email: yup.string()
    .required('Email is required')
    .email('Please enter a valid email'),
});

export const resetPasswordSchema = yup.object().shape({
  password: yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(/[A-Z]/, 'Must contain at least one uppercase letter')
    .matches(/\d/, 'Must contain at least one number')
    .matches(/[@$!%*?&]/, 'Must contain at least one special character (@$!%*?&)'),
  confirmPassword: yup.string()
    .required('Please confirm your password')
    .oneOf([yup.ref('password'), null], 'Passwords must match'),
});

// ==============================================
// General Utilities
// ==============================================

export const isEmptyValue = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && Object.keys(value).length === 0) return true;
  return false;
};

export const getValue = (obj, path, defaultValue = '') => {
  try {
    return path.split('.').reduce((acc, part) => {
      return acc && acc[part] !== undefined ? acc[part] : defaultValue;
    }, obj);
  } catch (error) {
    logger.error(`Error getting value at path '${path}'`, error);
    return defaultValue;
  }
};

export const sanitizeError = (error) => {
  if (!error) return 'An unknown error occurred';

  try {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.response?.data?.message) return error.response.data.message;
    if (error.response?.statusText) return error.response.statusText;

    return 'An unexpected error occurred';
  } catch (e) {
    logger.error('Error while sanitizing error message', e);
    return 'An unexpected error occurred';
  }
};

export const debounce = (func, wait = 300) => {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

export const formatDate = (date) => {
  try {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    logger.error('Error formatting date', error);
    return '';
  }
};

export const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncate = (str, length = 30) => {
  if (!str || typeof str !== 'string') return '';
  return str.length > length ? `${str.substring(0, length)}...` : str;
};

// ==============================================
// Notification Utilities
// ==============================================

export const getMessageStatus = (message) => {
  if (!message) return 'pending';
  if (message.readAt) return 'read';
  if (message.deliveredAt) return 'delivered';
  if (message.sentAt) return 'sent';
  return 'pending';
};

export const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  try {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch (error) {
    logger.error('Error formatting message time', error);
    return '';
  }
};

export const groupByDate = (notifications) => {
  if (!notifications || !notifications.length) return {};

  return notifications.reduce((groups, notification) => {
    try {
      const date = new Date(notification.timestamp).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
      return groups;
    } catch (error) {
      logger.error('Error grouping notification by date', error);
      return groups;
    }
  }, {});
};

export const formatNotificationTime = (timestamp) => {
  if (!timestamp) return '';

  try {
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
  } catch (error) {
    logger.error('Error formatting notification time', error);
    return '';
  }
};

export default {
  // File Handling
  pickDocument,
  pickImage,
  takePhoto,
  getFileType,
  formatFileSize,

  // Authentication
  manageAuthToken,
  getAuthToken,
  verifyToken,

  // Validation
  validateEmail,
  validatePassword,
  validateStudentId,
  loginSchema,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,

  // General Utilities
  isEmptyValue,
  getValue,
  sanitizeError,
  debounce,
  formatDate,
  capitalize,
  truncate,

  // Notification
  getMessageStatus,
  formatMessageTime,
  groupByDate,
  formatNotificationTime,
};