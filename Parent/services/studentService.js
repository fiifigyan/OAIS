import axios from 'axios';
import { APIConfig } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentService = {
  /**
   * Get student profile data using the endpoint from config.js
   * @param {string} studentId - The ID of the student
   * @returns {Promise<Object>} - Student profile data matching StudentProfileDTO
   */
  getStudentProfile: async (studentId) => {
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

      // Map the response to match the StudentProfileDTO structure
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

  /**
   * Get academic information for a student
   * @param {string} studentId - The ID of the student
   * @returns {Promise<Object>} - Academic information
   */
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

  /**
   * Get students by parent ID
   * @param {string} parentId - The ID of the parent
   * @returns {Promise<Array>} - List of students
   */
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