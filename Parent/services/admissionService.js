import * as SecureStorage from 'expo-secure-store';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import axios from 'axios';
import { APIConfig } from '../config';
import { sanitizeError } from '../utils/helpers';
import NetInfo from '@react-native-community/netinfo';

const logger = {
  error: (message, error) => console.error(`[AdmissionService] ${message}`, error),
  info: (message) => console.log(`[AdmissionService] ${message}`),
};

// Constants
const MAX_FILE_SIZE_MB = 10;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];
const API_TIMEOUT = 30000;

const resolveFileUri = (fileInfo) => {
  if (!fileInfo) {
    logger.error('File info is missing');
    return null;
  }

  const uri = fileInfo.uri || fileInfo.assets?.[0]?.uri || (typeof fileInfo === 'string' ? fileInfo : null);
  if (!uri) {
    logger.error('File URI is missing');
    return null;
  }

  let resolvedUri = uri;

  if (Platform.OS === 'android' && !uri.startsWith('file://') && !uri.startsWith('content://')) {
    resolvedUri = `file://${uri}`;
  } else if (Platform.OS === 'ios' && !uri.startsWith('file://')) {
    resolvedUri = `file://${uri}`;
  }

  logger.info(`Resolved URI: ${resolvedUri}`);
  return resolvedUri;
};

const getMimeType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg': return 'image/jpeg';
    case 'png': return 'image/png';
    case 'pdf': return 'application/pdf';
    default: throw new Error(`Unsupported file type: ${extension}`);
  }
};

const getAuthHeaders = async () => {
  try {
    const token = await SecureStorage.getItemAsync('authToken');
    if (!token) {
      throw new Error('No authentication token found');
    }
    
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  } catch (error) {
    logger.error('Failed to get auth headers:', error);
    throw new Error('Authentication failed - please login again');
  }
};

async function checkNetworkConnection() {
  try {
    const networkState = await NetInfo.fetch();
    return networkState.isConnected;
  } catch {
    return false;
  }
}

const admissionService = {
  async submitAdmissionForm(formData) {
    try {
      const isConnected = await checkNetworkConnection();
      if (!isConnected) {
        throw new Error('No internet connection. Please check your network and try again.');
      }
      
      const formSubmissionData = new FormData();
      const { documents, ...formFields } = formData;
      
      formSubmissionData.append('data', JSON.stringify(formFields));

      for (const [key, fileInfo] of Object.entries(documents)) {
        if (!fileInfo) {
          throw new Error(`Missing required document: ${key}`);
        }

        const resolvedUri = resolveFileUri(fileInfo);
        if (!resolvedUri) {
          throw new Error(`Invalid file information for ${key}`);
        }
        
        const mimeType = getMimeType(fileInfo.name);
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
          throw new Error(`Invalid file type for ${key}. Only PDF, JPEG, and PNG are allowed.`);
        }

        const fileStats = await FileSystem.getInfoAsync(resolvedUri);
        if (!fileStats.exists || !fileStats.size) {
          throw new Error(`File for ${key} does not exist or is empty`);
        }

        const fileSizeMB = fileStats.size / (1024 * 1024);
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
          throw new Error(`File for ${key} exceeds ${MAX_FILE_SIZE_MB}MB size limit`);
        }

        formSubmissionData.append(key, {
          uri: resolvedUri,
          name: fileInfo.name,
          type: mimeType,
        });
      }

      const headers = await getAuthHeaders();
      headers['Content-Type'] = 'multipart/form-data';

      const response = await axios.post(
        `https://73xd35pq-2025.uks1.devtunnels.ms${APIConfig.ADMISSIONS.SUBMIT}`,
        formSubmissionData,
        { headers, timeout: API_TIMEOUT }
      );

      logger.info('Form submitted successfully');
      return response.data;
    } catch (error) {
      let errorMessage = 'Submission failed. Please try again.';
      
      if (error.message.includes('Network Error')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.response) {
        errorMessage = error.response.data.message || 'Server error occurred';
      } else if (error.request) {
        errorMessage = 'No response from server. Please try again.';
      }
      
      logger.error('Form submission failed:', error);
      throw new Error(errorMessage);
    }
  },

  async saveFormDraft(formData) {
    try {
      await SecureStorage.setItemAsync(
        'admission_draft', 
        JSON.stringify({ 
          formData, 
          timestamp: new Date().toISOString() 
        })
      );
      return true;
    } catch (error) {
      throw new Error('Failed to save draft');
    }
  },

  async loadFormDraft() {
    try {
      const draftString = await SecureStorage.getItemAsync('admission_draft');
      if (!draftString) {
        logger.info('No draft found');
        return null;
      }

      const draft = JSON.parse(draftString);
      logger.info('Loaded draft from storage');
      return draft.formData;
    } catch (error) {
      logger.error('Failed to load draft:', error);
      throw new Error('Failed to load saved information');
    }
  },

  async clearFormDraft() {
    try {
      await SecureStorage.deleteItemAsync('admission_draft');
      logger.info('Draft cleared successfully');
      return true;
    } catch (error) {
      logger.error('Failed to clear draft:', error);
      throw new Error('Failed to clear saved information');
    }
  },

  async validateDocument(fileInfo) {
    try {
      if (!fileInfo) throw new Error('Invalid file information');

      const resolvedUri = resolveFileUri(fileInfo);
      if (!resolvedUri) throw new Error('Missing file URI');

      if (!fileInfo.name) throw new Error('Missing file name');
      if (!fileInfo.size) throw new Error('Missing file size');

      const mimeType = getMimeType(fileInfo.name);
      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        throw new Error(`Invalid file type: ${mimeType}`);
      }

      const fileStats = await FileSystem.getInfoAsync(resolvedUri);
      if (!fileStats.exists || !fileStats.size) {
        throw new Error('Invalid file');
      }

      const fileSizeMB = fileStats.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        throw new Error(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit`);
      }

      return true;
    } catch (error) {
      logger.error('Document validation failed', error);
      throw new Error(sanitizeError(error));
    }
  },

  async getAdmissionStatusById(applicationId) {
    try {
      const isConnected = await checkNetworkConnection();
      if (!isConnected) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      const headers = await getAuthHeaders();
      const response = await axios.get(
        `${APIConfig.BASE_URL}${APIConfig.ADMISSIONS.STATUS}/${applicationId}`,
        { headers, timeout: API_TIMEOUT }
      );
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch admission status:', error);
      let errorMessage = 'Failed to load application status';
      
      if (error.message.includes('Network Error')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  },

  async getAdmissionStatus() {
    try {
      const isConnected = await checkNetworkConnection();
      if (!isConnected) {
        throw new Error('No internet connection. Please check your network and try again.');
      }

      const headers = await getAuthHeaders();
      const response = await axios.get(
        `${APIConfig.BASE_URL}${APIConfig.ADMISSIONS.STATUS}`,
        { headers, timeout: API_TIMEOUT }
      );
      return response.data;
    } catch (error) {
      logger.error('Failed to fetch admission statuses:', error);
      let errorMessage = 'Failed to load applications';
      
      if (error.message.includes('Network Error')) {
        errorMessage = 'Network connection failed. Please check your internet connection.';
      } else if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      
      throw new Error(errorMessage);
    }
  }
};

export default admissionService;