import axios from 'axios';
import { APIConfig } from '../config';
import { getAuthToken } from '../utils/helpers';

const API_TIMEOUT = 15000;

export const CalendarService = {
  // ==================== EVENTS ====================
  fetchEvents: async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(APIConfig.EVENTS.UPCOMING, {
        timeout: API_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  fetchEventById: async (id) => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(`${APIConfig.EVENTS.UPCOMING}/${id}`, {
        timeout: API_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching event ${id}:`, error);
      throw error;
    }
  },

  registerForEvent: async (eventId, studentId) => {
    try {
      const token = await getAuthToken();
      const response = await axios.put(
        `${APIConfig.EVENTS.UPCOMING}/${eventId}/register`,
        {
          registered: true,
          studentId,
          registeredAt: new Date().toISOString()
        },
        {
          timeout: API_TIMEOUT,
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  },

  // ================== ATTENDANCE ==================
  fetchAttendanceData: async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(APIConfig.STUDENT_INFO.ATTENDANCE, {
        timeout: API_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      throw error;
    }
  },

  // ==================== TIMETABLE ====================
  fetchTimetable: async () => {
    try {
      const token = await getAuthToken();
      const response = await axios.get(APIConfig.STUDENT_INFO.PROGRESS, {
        timeout: API_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching timetable:', error);
      throw error;
    }
  },

  // ==================== COMMON ====================
  getAuthHeaders: async () => {
    const token = await getAuthToken();
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }
};