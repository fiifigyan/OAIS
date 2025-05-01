import axios from 'axios';
import * as SecureStorage from 'expo-secure-store';
import { APIConfig } from '../config';

const ProfileService = {
  getParentProfile: async (parentId) => {
    try {
      const token = await SecureStorage.getItemAsync('authToken');
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
      console.error('ProfileService.getParentProfile error:', error);
      throw error;
    }
  },

  updateParentProfile: async (parentId, updates) => {
    try {
      const token = await SecureStorage.getItemAsync('authToken');
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
      console.error('ProfileService.updateParentProfile error:', error);
      throw error;
    }
  },

  getStudentsByParent: async (parentId) => {
    try {
      const token = await SecureStorage.getItemAsync('authToken');
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(
        `${APIConfig.BASE_URL}${APIConfig.PARENT_INFO.STUDENTS}/${parentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data || [];
    } catch (error) {
      console.error('ProfileService.getStudentsByParent error:', error);
      throw error;
    }
  },

  uploadParentProfileImage: async (parentId, imageUri) => {
    try {
      const token = await SecureStorage.getItemAsync('authToken');
      if (!token) throw new Error('Authentication required');

      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: `profile_${parentId}.${type.split('/')[1] || 'jpg'}`,
        type
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
      console.error('ProfileService.uploadParentProfileImage error:', error);
      throw error;
    }
  }
};

export default ProfileService;