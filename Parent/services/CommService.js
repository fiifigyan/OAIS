import axios from 'axios';
import { logger } from '../utils/helpers';

const API_BASE_URL = 'https://your-api-url.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Add request interceptor for auth token
api.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const getMessages = async () => {
  try {
    const response = await api.get('/messages');
    return response.data;
  } catch (error) {
    logger.error('Error fetching messages', error);
    throw error;
  }
};

export const sendMessageApi = async (messageData) => {
  try {
    const response = await api.post('/messages', messageData);
    return response.data;
  } catch (error) {
    logger.error('Error sending message', error);
    throw error;
  }
};

export const markMessageAsRead = async (messageId) => {
  try {
    const response = await api.patch(`/messages/${messageId}/read`);
    return response.data;
  } catch (error) {
    logger.error('Error marking message as read', error);
    throw error;
  }
};

export const uploadFile = async (formData, onUploadProgress) => {
  try {
    const response = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const progress = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        onUploadProgress(progress);
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Error uploading file', error);
    throw error;
  }
};

export const getAnnouncements = async () => {
  try {
    const response = await api.get('/announcements');
    return response.data;
  } catch (error) {
    logger.error('Error fetching announcements', error);
    throw error;
  }
};