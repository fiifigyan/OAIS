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

const ParentService = {
  /**
   * Get parent profile data
   * @param {string} parentId - The ID of the parent
   * @returns {Promise<Object>} - Parent profile data
   */
  getProfile: async (parentId) => {
    try {
      const response = await apiClient.get(`/api/parents/studentsInformation/profile?parentId=${parentId}`);
      return response.data;
    } catch (error) {
      console.error('Profile Fetch Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch profile data');
    }
  },

  /**
   * Update parent profile
   * @param {string} parentId - The ID of the parent
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} - Updated profile data
   */
  updateProfile: async (parentId, profileData) => {
    try {
      const response = await apiClient.put(`/api/parents/${parentId}`, profileData);
      return response.data;
    } catch (error) {
      console.error('Profile Update Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to update profile');
    }
  },

  /**
   * Delete parent account
   * @param {string} parentId - The ID of the parent
   * @returns {Promise<Object>} - Confirmation message
   */
  deleteProfile: async (parentId) => {
    try {
      const response = await apiClient.delete(`/api/parents/${parentId}`);
      return response.data;
    } catch (error) {
      console.error('Profile Delete Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to delete profile');
    }
  },

  /**
   * Change parent password
   * @param {string} parentId - The ID of the parent
   * @param {Object} passwordData - { currentPassword, newPassword }
   * @returns {Promise<Object>} - Success message
   */
  changePassword: async (parentId, passwordData) => {
    try {
      const response = await apiClient.put(`/api/parents/${parentId}/password`, passwordData);
      return response.data;
    } catch (error) {
      console.error('Password Change Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to change password');
    }
  },

  /**
   * Upload parent profile image
   * @param {string} parentId - The ID of the parent
   * @param {Object} imageFile - The image file to upload
   * @returns {Promise<Object>} - Image URL and metadata
   */
  uploadProfileImage: async (parentId, imageFile) => {
    try {
      const formData = new FormData();
      formData.append('file', imageFile);

      const response = await apiClient.post(
        `/api/parents/${parentId}/profile-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Profile Image Upload Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload profile image');
    }
  },

  /**
   * Get list of students associated with parent
   * @param {string} parentId - The ID of the parent
   * @returns {Promise<Array>} - List of student objects
   */
  getStudents: async (parentId) => {
    try {
      const response = await apiClient.get(`/api/parents/${parentId}/students`);
      return response.data.students || [];
    } catch (error) {
      console.error('Students Fetch Error:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch students');
    }
  },
};

export default ParentService;