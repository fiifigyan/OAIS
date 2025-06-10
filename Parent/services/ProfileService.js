import axios from 'axios';
import { APIConfig } from '../config';
import { getAuthToken, sanitizeError } from '../utils/helpers';

const ProfileService = {
  getStudentsByParent: async (parentId) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(
        `${APIConfig.BASE_URL}${APIConfig.STUDENT_INFO.PROFILE}/parent/${parentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data || [];
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('ProfileService.getStudentsByParent error:', friendlyError);
      throw new Error(friendlyError);
    }
  },

  getStudentProfile: async (studentId) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(
        `${APIConfig.BASE_URL}${APIConfig.STUDENT_INFO.PROFILE}/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('ProfileService.getStudentProfile error:', friendlyError);
      throw new Error(friendlyError);
    }
  },

  updateStudentProfile: async (studentId, updates) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await axios.patch(
        `${APIConfig.BASE_URL}${APIConfig.STUDENT_INFO.PROFILE}/${studentId}`,
        updates,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('ProfileService.updateStudentProfile error:', friendlyError);
      throw new Error(friendlyError);
    }
  },

  uploadStudentProfileImage: async (studentId, imageUri) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      const formData = new FormData();
      const filename = imageUri.split('/').pop();
      const type = filename.match(/\.(\w+)$/)?.[1] || 'jpg';

      formData.append('image', {
        uri: imageUri,
        name: `student_${studentId}.${type}`,
        type: `image/${type}`
      });

      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.STUDENT_INFO.PROFILE_IMAGE}/${studentId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('ProfileService.uploadStudentProfileImage error:', friendlyError);
      throw new Error(friendlyError);
    }
  },

  getParentProfile: async (parentId) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(
        `${APIConfig.BASE_URL}${APIConfig.PARENT_INFO.PROFILE}/${parentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('ProfileService.getParentProfile error:', friendlyError);
      throw new Error(friendlyError);
    }
  },

  updateParentProfile: async (parentId, updates) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await axios.patch(
        `${APIConfig.BASE_URL}${APIConfig.PARENT_INFO.PROFILE}/${parentId}`,
        updates,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('ProfileService.updateParentProfile error:', friendlyError);
      throw new Error(friendlyError);
    }
  },

  uploadParentProfileImage: async (parentId, imageUri) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      const formData = new FormData();
      const filename = imageUri.split('/').pop();
      const type = filename.match(/\.(\w+)$/)?.[1] || 'jpg';

      formData.append('image', {
        uri: imageUri,
        name: `parent_${parentId}.${type}`,
        type: `image/${type}`
      });

      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.PARENT_INFO.PROFILE_IMAGE}/${parentId}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      return response.data;
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('ProfileService.uploadParentProfileImage error:', friendlyError);
      throw new Error(friendlyError);
    }
  }
};

export default ProfileService;