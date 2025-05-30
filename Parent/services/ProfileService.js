import axios from 'axios';
import { APIConfig } from '../config';
import { getAuthToken } from '../utils/helpers';

const ProfileService = {
  getStudentsByParent: async (parentId) => {
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
  },

  getStudentProfile: async (studentId) => {
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
  },

  updateStudentProfile: async (studentId, updates) => {
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
  },

  uploadStudentProfileImage: async (studentId, imageUri) => {
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
  },

  getParentProfile: async (parentId) => {
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
  },

  updateParentProfile: async (parentId, updates) => {
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
  },

  uploadParentProfileImage: async (parentId, imageUri) => {
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
  }
};

export default ProfileService;