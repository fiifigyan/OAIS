import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import axios from 'axios';
import authService from '../services/authService';

const logger = {
  error: (message, error) => console.error(`[AdmissionService] ${message}`, error),
  info: (message) => console.log(`[AdmissionService] ${message}`),
};

const REQUIRED_FIELDS = {
  student: [
    // Student Personal Information
    'fullName', 'dateOfBirth', 'gender', 'nationality', 'religion', 
    // Student Residential Address
    'residentialAddress.streetName', 'residentialAddress.houseNumber', 'residentialAddress.city', 'residentialAddress.region', 'residentialAddress.country', 
    // Student Medical Information
    'medicalInformation.bloodType', 
    'medicalInformation.emergencyContactName', 
    'medicalInformation.emergencyContactNumber', 
    'medicalInformation.allergiesOrConditions'
  ],

  previousAcademicDetail: [
    'lastSchoolAttended', 
    'lastClassCompleted'
  ],

  admissionDetail: [
    'classForAdmission', 
    'academicYear', 
    'preferredSecondLanguage'
  ],

  parentGuardian: [
    'firstName', 
    'lastName', 
    'contactNumber', 
    'emailAddress', 
    'occupation'
  ],

  documents: [
    'file1', 
    'file2', 
    'file3'
  ],
};

const MAX_FILE_SIZE_MB = 10;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const sanitizeError = (error) => {
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

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

const inspectFormData = async (formData) => {
  const parts = [];
  for (const [key, value] of formData._parts) {
    parts.push(`${key}: ${value instanceof Object ? `FILE (${value.name})` : value}`);
  }
  logger.info('FormData Content:\n' + parts.join('\n'));
};

const getAuthHeaders = async () => {
  try {
    const verification = await authService.verifyToken();
    if (!verification) {
      throw new Error('Authentication required - please login again');
    }
    return {
      'Accept': 'application/json',
      'Authorization': `Bearer ${verification.token}`,
    };
  } catch (error) {
    logger.error('Failed to get auth headers:', error);
    throw new Error('Authentication failed');
  }
};

const admissionService = {
  async submitAdmissionForm(formData) {
    try {
      // Validate form before submission
      const validation = await this.validateForm(formData);
      if (!validation.isValid) {
        throw new Error('Form validation failed: ' + Object.values(validation.errors).join(', '));
      }

      // Validate all documents
      await Promise.all(Object.entries(formData.documents || {}).map(async ([key, fileInfo]) => {
        await this.validateDocument(fileInfo);
      }));

      const formSubmissionData = new FormData();

      // Append form data excluding documents
      formSubmissionData.append('data', JSON.stringify({ ...formData, documents: undefined }));

      // Append documents with explicit MIME type handling
      for (const [key, fileInfo] of Object.entries(formData.documents || {})) {
        const resolvedUri = resolveFileUri(fileInfo);
        if (!resolvedUri) throw new Error(`Invalid file information for ${key}`);

        const mimeType = getMimeType(fileInfo.name);
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
          throw new Error(`Invalid file type for ${key}`);
        }

        // Log file details before appending to FormData
        logger.info(`Appending file: ${fileInfo.name}, MIME type: ${mimeType}, URI: ${resolvedUri}`);

        // Append the file with the correct key (file1, file2, file3)
        formSubmissionData.append(key, {
          uri: resolvedUri,
          name: fileInfo.name,
          type: mimeType,
        });
      }

      // Log FormData parts for debugging
      await inspectFormData(formSubmissionData);

      // Send data to the backend using Axios

      const headers = await getAuthHeaders();
      headers['Content-Type'] = 'multipart/form-data';

      const response = await axios.post(
        'https://73xd35pq-2025.uks1.devtunnels.ms/api/parent/admissions/submit',
        formSubmissionData,
        { headers}
      );

      // Clear draft data upon successful submission
      await this.clearFormDraft();
      return response.data;
    } catch (error) {
      // Improve error logging
      logger.error('Admission Form Submission Failed:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        logger.error('Response data:', error.response.data);
        logger.error('Response status:', error.response.status);
        logger.error('Response headers:', error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        logger.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request
        logger.error('Request setup error:', error.message);
      }
      throw new Error(sanitizeError(error));
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

  async validateForm(formData) {
    const errors = {};
    const checkField = (obj, path) => {
      return path.split('.').reduce((current, part) => (current ? current[part] : null), obj);
    };

    const isEmptyValue = (value) => !value || (typeof value === 'string' && value.trim() === '') || (Array.isArray(value) && value.length === 0);

    Object.entries(REQUIRED_FIELDS).forEach(([section, fields]) => {
      fields.forEach((field) => {
        const fullPath = `${section}.${field}`;
        const value = checkField(formData, fullPath);
        if (isEmptyValue(value)) {
          const fieldName = field.split('.').pop();
          const readableName = fieldName
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .toLowerCase();
          errors[fullPath] = `${readableName} is required`;
        }
      });
    });

    // Conditional validation for sibling details
    if (formData.admissionDetail?.hasSiblingsInSchool) {
      if (isEmptyValue(formData.admissionDetail.siblingName)) {
        errors['admissionDetail.siblingName'] = 'sibling name is required';
      }
      if (isEmptyValue(formData.admissionDetail.siblingClass)) {
        errors['admissionDetail.siblingClass'] = 'sibling class is required';
      }
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  },

  async saveFormDraft(formData) {
    try {
      await AsyncStorage.setItem('admission_draft', JSON.stringify({ formData, timestamp: new Date().toISOString() }));
      return true;
    } catch (error) {
      logger.error('Failed to save draft', error);
      throw new Error('Failed to save draft');
    }
  },

  async loadFormDraft() {
    try {
      const draft = await AsyncStorage.getItem('admission_draft');
      return draft ? JSON.parse(draft).formData : null;
    } catch (error) {
      logger.error('Failed to load draft', error);
      return null;
    }
  },

  async clearFormDraft() {
    try {
      await AsyncStorage.removeItem('admission_draft');
      return true;
    } catch (error) {
      logger.error('Failed to clear draft', error);
      return false;
    }
  },

  async getAdmissionStatusById(id) {
    try {
      if (!id) throw new Error('Application ID is required');

      const headers = await getAuthHeaders();
      const response = await axios.get(
        `https://73xd35pq-2025.uks1.devtunnels.ms/api/parent/admissions/status?id=${id}`,
        { headers }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch admission status by ID:', error);
      throw new Error(sanitizeError(error));
    }
  },

  async getAdmissionStatus(parentId) {
    try {
      if (!parentId) throw new Error('Parent ID is required');

      const headers = await getAuthHeaders();
      const response = await axios.get(
        `https://73xd35pq-2025.uks1.devtunnels.ms/api/parent/admissions/status?parentId=${parentId}`,
        { headers }
      );

      return response.data;
    } catch (error) {
      logger.error('Failed to fetch admission status:', error);
      throw new Error(sanitizeError(error));
    }
  },
};

export default admissionService;