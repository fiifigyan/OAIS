import axios from 'axios';
import { APIConfig } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeService = {
  /**
   * Fetch home screen data that matches HomePageDTO structure
   * @param {string} studentId - ID of the student
   * @returns {Promise<HomePageDTO>} - Home screen data
   */
  getHomeData: async (studentId) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(
        `${APIConfig.BASE_URL}${APIConfig.STUDENT_INFO.HOME}/${studentId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        passportPicture: response.data.passportPicture,
        fullName: response.data.fullName,
        grade: response.data.grade,
        attendanceStatus: response.data.attendanceStatus,
        feePaymentStatus: response.data.feePaymentStatus,
        upcomingEvents: response.data.upcomingEvents || []
      };
    } catch (error) {
      console.error('HomeService.getHomeData error:', error);
      throw error;
    }
  },

  /**
   * Fetch upcoming events for home screen
   * @returns {Promise<Array>} - List of upcoming events
   */
  getUpcomingEvents: async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(
        `${APIConfig.BASE_URL}${APIConfig.EVENTS.UPCOMING}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.events || [];
    } catch (error) {
      console.error('HomeService.getUpcomingEvents error:', error);
      throw error;
    }
  }
};

export default HomeService;