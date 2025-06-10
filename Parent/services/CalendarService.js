import axios from 'axios';
import { APIConfig } from '../config';
import { getAuthToken, sanitizeError } from '../utils/helpers';

const API_TIMEOUT = 15000;

export const CalendarService = {
  fetchEvents: async () => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(APIConfig.EVENTS.UPCOMING, {
        timeout: API_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data || {};
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('Error fetching events:', friendlyError);
      throw new Error(friendlyError);
    }
  },

  fetchEventById: async (id) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(`${APIConfig.EVENTS.UPCOMING}/${id}`, {
        timeout: API_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data || {};
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error(`Error fetching event ${id}:`, friendlyError);
      throw new Error(friendlyError);
    }
  },

  registerForEvent: async (eventId, studentId) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

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
            'Authorization': `Bearer ${token}`
          }
        }
      );
      return response.data || {};
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('Error registering for event:', friendlyError);
      throw new Error(friendlyError);
    }
  },

  fetchAttendanceData: async (studentId) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(APIConfig.STUDENT_INFO.ATTENDANCE, {
        params: { studentId },
        timeout: API_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data || { markedDates: {}, stats: {} };
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('Error fetching attendance data:', friendlyError);
      throw new Error(friendlyError);
    }
  },

  fetchTimetable: async (studentId) => {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Authentication required');

      const response = await axios.get(APIConfig.STUDENT_INFO.PROGRESS, {
        params: { studentId },
        timeout: API_TIMEOUT,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data || {};
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('Error fetching timetable:', friendlyError);
      throw new Error(friendlyError);
    }
  }
};