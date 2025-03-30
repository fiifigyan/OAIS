import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import axios from 'axios';

// Configure axios with base URL and default headers
const apiClient = axios.create({
  baseURL: 'https://73xd35pq-2025.uks1.devtunnels.ms/api',
  timeout: 15000, // 15 seconds timeout
});

const logger = {
  info: (message, data) => console.log(`[AdmissionService] ${message}`, data),
  error: (message, error) => console.error(`[AdmissionService] ${message}`, error),
};

const REQUIRED_FIELDS = {
  student: [
    'fullName', 'dateOfBirth', 'gender', 'nationality', 'religion',
    'residentialAddress.city', 'residentialAddress.region', 'residentialAddress.country',
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

const getErrorDetails = (error) => {
  if (error.response) {
    // Server responded with error status
    return {
      message: error.response.data?.message || 'Request failed',
      status: error.response.status,
      data: error.response.data
    };
  } else if (error.request) {
    // Request was made but no response received
    return { message: 'No response from server' };
  }
  // Something happened in setting up the request
  return { message: error.message || 'Request setup failed' };
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

const admissionService = {
  async submitAdmissionForm(formData, token) {
    try {
      // Validate form before submission
      const validation = await this.validateForm(formData);
      if (!validation.isValid) {
        const errorMessages = Object.values(validation.errors).join(', ');
        throw new Error(`Form validation failed: ${errorMessages}`);
      }

      // Validate all documents
      await Promise.all(Object.entries(formData.documents || {}).map(async ([key, fileInfo]) => {
        await this.validateDocument(fileInfo);
      }));

      const formSubmissionData = new FormData();
      formSubmissionData.append('data', JSON.stringify({ ...formData, documents: undefined }));

      // Append documents
      for (const [key, fileInfo] of Object.entries(formData.documents || {})) {
        const resolvedUri = resolveFileUri(fileInfo);
        if (!resolvedUri) throw new Error(`Invalid file information for ${key}`);

        const mimeType = getMimeType(fileInfo.name);
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
          throw new Error(`Invalid file type for ${key}`);
        }

        formSubmissionData.append(key, {
          uri: resolvedUri,
          name: fileInfo.name,
          type: mimeType,
        });
      }

      // Prepare headers
      const headers = {
        'Content-Type': 'multipart/form-data',
        'Accept': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await apiClient.post(
        '/parent/admissions/submit',
        formSubmissionData,
        { headers }
      );

      await this.clearFormDraft();
      return response.data;
    } catch (error) {
      const errorDetails = getErrorDetails(error);
      logger.error('Admission Form Submission Failed:', errorDetails);
      throw new Error(errorDetails.message);
    }
  },

  async validateDocument(fileInfo) {
    try {
      if (!fileInfo) throw new Error('Please select a file');

      const resolvedUri = resolveFileUri(fileInfo);
      if (!resolvedUri) throw new Error('Could not access this file');

      if (!fileInfo.name) throw new Error('File name is missing');
      if (!fileInfo.size) throw new Error('File size is missing');

      const fileStats = await FileSystem.getInfoAsync(resolvedUri);
      if (!fileStats.exists || !fileStats.size) {
        throw new Error('This file is not valid');
      }

      const fileSizeMB = fileStats.size / (1024 * 1024);
      if (fileSizeMB > MAX_FILE_SIZE_MB) {
        throw new Error(`File is too large (max ${MAX_FILE_SIZE_MB}MB)`);
      }

      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  async validateForm(formData) {
    const errors = {};
    const checkField = (obj, path) => {
      return path.split('.').reduce((current, part) => (current ? current[part] : null), obj);
    };

    const isEmptyValue = (value) => 
      !value || 
      (typeof value === 'string' && value.trim() === '') || 
      (Array.isArray(value) && value.length === 0);

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

    // Validate sibling info if applicable
    if (formData.admissionDetail?.hasSiblingsInSchool) {
      if (isEmptyValue(formData.admissionDetail.siblingName)) {
        errors['admissionDetail.siblingName'] = 'sibling name is required';
      }
      if (isEmptyValue(formData.admissionDetail.siblingClass)) {
        errors['admissionDetail.siblingClass'] = 'sibling class is required';
      }
    }

    // Validate email format if provided
    if (formData.parentGuardian?.emailAddress) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.parentGuardian.emailAddress)) {
        errors['parentGuardian.emailAddress'] = 'invalid email format';
      }
    }

    return { isValid: Object.keys(errors).length === 0, errors };
  },

  async saveFormDraft(formData) {
    try {
      await AsyncStorage.setItem('admission_draft', JSON.stringify({
        formData, 
        timestamp: new Date().toISOString()
      }));
      return true;
    } catch (error) {
      logger.error('Failed to save draft:', error);
      throw new Error('Could not save your progress');
    }
  },

  async loadFormDraft() {
    try {
      const draft = await AsyncStorage.getItem('admission_draft');
      if (!draft) return null;
      
      const parsed = JSON.parse(draft);
      // Check if draft is older than 7 days
      const draftDate = new Date(parsed.timestamp);
      const now = new Date();
      const diffDays = (now - draftDate) / (1000 * 60 * 60 * 24);
      
      if (diffDays > 7) {
        await AsyncStorage.removeItem('admission_draft');
        return null;
      }
      
      return parsed.formData;
    } catch (error) {
      logger.error('Failed to load draft:', error);
      throw new Error('Could not load your saved information');
    }
  },

  async clearFormDraft() {
    try {
      await AsyncStorage.removeItem('admission_draft');
      return true;
    } catch (error) {
      logger.error('Failed to clear draft:', error);
      throw new Error('Could not clear saved information');
    }
  },

  async getAdmissionStatus(parentId, token) {
    try {
      if (!parentId) throw new Error('Parent ID is required');

      const response = await apiClient.get(
        `/parent/admissions/status?parentId=${parentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      const errorDetails = getErrorDetails(error);
      logger.error('Failed to fetch admission status:', errorDetails);
      throw new Error(errorDetails.message);
    }
  },

  async getAdmissionStatusById(id, token) {
    try {
      if (!id) throw new Error('Application ID is required');

      const response = await apiClient.get(
        `/parent/admissions/status?id=${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      return response.data;
    } catch (error) {
      const errorDetails = getErrorDetails(error);
      logger.error('Failed to fetch admission status by ID:', errorDetails);
      throw new Error(errorDetails.message);
    }
  }
};

export default admissionService;