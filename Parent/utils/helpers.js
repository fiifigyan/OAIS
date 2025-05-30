import * as SecureStore from 'expo-secure-store';
import * as yup from 'yup';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

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
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [4, 3],
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
      mediaTypes: ImagePicker.MediaType.Images,
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
 */
export const manageAuthToken = async (token) => {
  try {
    if (token) {
      await SecureStore.setItemAsync('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      await SecureStore.deleteItemAsync('authToken');
      delete axios.defaults.headers.common['Authorization'];
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
 * Decodes and verifies a JWT token (minimal implementation - backend does main validation)
 * @param {string} token - JWT token to verify
 * @returns {Promise<{valid: boolean}>}
 */
export const verifyToken = async (token) => {
  if (!token) return { valid: false };
  
  try {
    // Just check if it's a valid JWT format - actual validation happens on backend
    const parts = token.split('.');
    if (parts.length !== 3) return { valid: false };
    
    return { valid: true };
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

// Yup Validation Schemas - Authentication
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

//Yup Validation Schemas - Admission Form
export const studentSchema = yup.object().shape({
  surName: yup.string().required('Surname is required'),
  firstName: yup.string().required('First name is required'),
  gender: yup.string().required('Gender is required'),
  dateOfBirth: yup.string().required('Date of birth is required'),
  residentialAddress: yup.object().shape({
    city: yup.string().required('City is required'),
    region: yup.string().required('Region is required'),
    country: yup.string().required('Country is required'),
  }),
  nationality: yup.string().required('Nationality is required'),
  livesWith: yup.string().required('This field is required'),
  medicalInformation: yup.object().shape({
    bloodType: yup.string().required('Blood type is required'),
    allergiesOrConditions: yup.string().required('This field is required'),
    emergencyContactsName: yup.string().required('Emergency contact name is required'),
    emergencyContactsNumber: yup.string().required('Emergency contact number is required'),
  }),
});

export const parentSchema = yup.object().shape({
  fatherSurName: yup.string().required('Father surname is required'),
  fatherFirstName: yup.string().required('Father first name is required'),
  fatherContactNumber: yup.string().required('Father contact number is required'),
  fatherOccupation: yup.string().required('Father occupation is required'),
  fatherEmailAddress: yup.string().email('Invalid email').required('Father email is required'),
  motherSurName: yup.string().required('Mother surname is required'),
  motherFirstName: yup.string().required('Mother first name is required'),
  motherContactNumber: yup.string().required('Mother contact number is required'),
  motherOccupation: yup.string().required('Mother occupation is required'),
  motherEmailAddress: yup.string().email('Invalid email').required('Mother email is required'),
});

export const academicSchema = yup.object().shape({
  lastSchoolAttended: yup.string().required('Last school attended is required'),
  lastClassCompleted: yup.string().required('Last class completed is required'),
  classForAdmission: yup.string().required('Class for admission is required'),
  academicYear: yup.string().required('Academic year is required'),
  preferredSecondLanguage: yup.string().required('Preferred language is required'),
  siblingName: yup.string().when('hasSiblingsInSchool', {
    is: true,
    then: yup.string().required('Sibling name is required'),
  }),
  siblingClass: yup.string().when('hasSiblingsInSchool', {
    is: true,
    then: yup.string().required('Sibling class is required'),
  }),
});

export const documentsSchema = yup.object().shape({
  file1: yup.mixed().required('Passport photo is required'),
  file2: yup.mixed().required('Birth certificate is required'),
  file3: yup.mixed().required('Previous results are required'),
});

export const fullSchema = yup.object().shape({
  student: studentSchema,
  parentGuardian: parentSchema,
  previousAcademicDetail: academicSchema,
  admissionDetail: academicSchema,
  documents: documentsSchema,
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