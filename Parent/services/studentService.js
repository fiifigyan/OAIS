import axios from 'axios';

// Create a reusable axios instance with base config
const apiClient = axios.create({
  baseURL: 'https://73xd35pq-2025.uks1.devtunnels.ms',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

const StudentService = {
  /**
   * Get student profile data
   * @param {string} studentId - The ID of the student
   * @returns {Promise<Object>} - Student profile data
   */
  getProfile: async (studentId) => {
    try {
      const response = await apiClient.get(`/api/students/${studentId}/profile`);
      return response.data;
    } catch (error) {
      console.error('Student Profile Fetch Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch student profile');
    }
  },

  /**
   * Get list of students by parent ID
   * @param {string} parentId - The ID of the parent
   * @returns {Promise<Array>} - List of student objects
   */
  getStudentsByParent: async (parentId) => {
    try {
      const response = await apiClient.get(`/api/parents/${parentId}/students`);
      return response.data.students.map(student => ({
        id: student.studentId,
        fullName: student.fullName,
        classLevel: student.classLevel,
        relationship: student.relationship,
        profileImage: student.profileImage,
        status: student.status
      }));
    } catch (error) {
      console.error('Students Fetch Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch students');
    }
  },

  /**
   * Update student profile
   * @param {string} studentId - The ID of the student
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} - Updated profile data
   */
  updateProfile: async (studentId, profileData) => {
    try {
      const response = await apiClient.put(`/api/students/${studentId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Student Profile Update Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update student profile');
    }
  },

  /**
   * Upload student profile image
   * @param {string} studentId - The ID of the student
   * @param {Object} imageFile - The image file to upload
   * @returns {Promise<Object>} - Image URL and metadata
   */
  uploadProfileImage: async (studentId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await apiClient.post(
        `/api/students/${studentId}/profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Student Profile Image Upload Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload student profile image');
    }
  },

  /**
   * Get student academic records
   * @param {string} studentId - The ID of the student
   * @returns {Promise<Object>} - Academic records
   */
  getAcademicRecords: async (studentId) => {
    try {
      const response = await apiClient.get(`/api/students/${studentId}/academic-records`);
      return response.data;
    } catch (error) {
      console.error('Academic Records Fetch Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch academic records');
    }
  },
};

export default StudentService;