import axios from 'axios';
import { APIConfig } from '../config';
import { manageAuthToken, getAuthToken, sanitizeError } from '../utils/helpers';

const HomeService = {
  getStudentHomeData: async (studentId) => {
    try {
      const token = await getAuthToken();
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
      const friendlyError = sanitizeError(error);
      console.error('HomeService.getStudentHomeData error:', friendlyError);
      throw new Error(friendlyError);
    }
  },

  getUpcomingEvents: async () => {
    try {
      const token = await getAuthToken();
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
      const friendlyError = sanitizeError(error);
      console.error('HomeService.getUpcomingEvents error:', friendlyError);
      throw new Error(friendlyError);
    }
  }
};

export default HomeService;