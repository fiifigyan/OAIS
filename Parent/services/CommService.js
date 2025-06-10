import axios from 'axios';
import { logger, getAuthToken } from '../utils/helpers';
import { APIConfig } from '../config';

// Cache setup
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Helper function to handle API requests
const makeRequest = async (method, endpoint, data = null, options = {}) => {
  const cacheKey = `${method}:${endpoint}:${JSON.stringify(data)}`;
  
  // Check cache if it's a GET request and not forced to refresh
  if (method === 'get' && !options.forceRefresh && cache.has(cacheKey)) {
    const { data, timestamp } = cache.get(cacheKey);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }

  try {
    const token = await getAuthToken();
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const config = {
      method,
      url: `${APIConfig.BASE_URL}${endpoint}`,
      headers,
      data,
      params: options.params,
      timeout: 10000, // 10 seconds timeout
    };

    const response = await axios(config);

    // Cache GET responses
    if (method === 'get') {
      cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
    }

    return response.data;
  } catch (error) {
    let errorMessage = 'An error occurred';

    if (axios.isCancel(error)) {
      errorMessage = 'Request canceled';
    } else if (error.code === 'ECONNABORTED') {
      errorMessage = 'Request timeout. Please try again.';
    } else if (!error.response) {
      errorMessage = 'Network error. Please check your connection.';
    } else {
      switch (error.response.status) {
        case 400:
          errorMessage = error.response.data?.message || 'Bad request';
          break;
        case 401:
          errorMessage = 'Session expired. Please login again.';
          break;
        case 403:
          errorMessage = 'You are not authorized to perform this action';
          break;
        case 404:
          errorMessage = 'Resource not found';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        default:
          errorMessage = error.response.data?.message || 'An error occurred';
      }
    }

    logger.error(`API Error (${endpoint}):`, error);
    throw new Error(errorMessage);
  }
};

// Chat-related functions
export const getChats = async (options = {}) => {
  return makeRequest('get', '/chats', null, options);
};

export const createChat = async (participants, isGroup = false, groupName = null) => {
  const data = { participants, isGroup, name: groupName };
  cache.delete('get:/chats'); // Invalidate chats cache
  return makeRequest('post', '/chats', data);
};

// Message-related functions
export const getMessages = async (chatId, page = 1, limit = 20) => {
  return makeRequest('get', `/chats/${chatId}/messages`, null, {
    params: { page, limit }
  });
};

export const sendMessageApi = async (chatId, message) => {
  return makeRequest('post', `/chats/${chatId}/messages`, message);
};

export const updateMessageApi = async (chatId, messageId, updates) => {
  return makeRequest('patch', `/chats/${chatId}/messages/${messageId}`, updates);
};

export const deleteMessageApi = async (chatId, messageId) => {
  return makeRequest('delete', `/chats/${chatId}/messages/${messageId}`);
};

// File upload function
export const uploadFile = async (fileData) => {
  try {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', fileData);

    const response = await axios.post(`${APIConfig.BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      timeout: 30000, // 30 seconds for file uploads
    });

    return response.data;
  } catch (error) {
    let errorMessage = 'File upload failed';
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    logger.error('Upload Error:', error);
    throw new Error(errorMessage);
  }
};

// Announcements
export const getAnnouncements = async (options = {}) => {
  return makeRequest('get', '/announcements', null, options);
};

export default {
  getChats,
  createChat,
  getMessages,
  sendMessageApi,
  updateMessageApi,
  deleteMessageApi,
  uploadFile,
  getAnnouncements,
};