import axios from 'axios';
import { APIConfig } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentService = {
  getStudentProfile: async (studentId) => {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    try {
      const token = await AsyncStorage.getItem('authToken');
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

      return {
        studentId: response.data.studentId,
        fullName: response.data.fullName,
        gender: response.data.gender,
        dateOfBirth: response.data.dateOfBirth,
        className: response.data.className,
        Address: response.data.Address,
        profileImagePath: response.data.profileImagePath
      };
    } catch (error) {
      console.error('StudentService.getStudentProfile error:', error);
      throw error;
    }
  },

  getAcademicInfo: async (studentId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(
        `${APIConfig.BASE_URL}${APIConfig.STUDENT_INFO.PROGRESS}/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('StudentService.getAcademicInfo error:', error);
      throw error;
    }
  },

  updateStudentProfile: async (studentId, updates) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
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
      console.error('StudentService.updateStudentProfile error:', error);
      throw error;
    }
  },

  uploadProfilePicture: async (studentId, imageUri) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');

      // Extract filename and type from URI
      const filename = imageUri.split('/').pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        name: `profile_${studentId}.${type.split('/')[1] || 'jpg'}`,
        type
      });

      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.STUDENT_INFO.PROFILE}/${studentId}/picture`,
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
      console.error('StudentService.uploadProfilePicture error:', error);
      throw error;
    }
  },

  getStudentsByParent: async (parentId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(
        `${APIConfig.BASE_URL}/api/parents/${parentId}/students`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('StudentService.getStudentsByParent error:', error);
      throw error;
    }
  }
};

export default StudentService;