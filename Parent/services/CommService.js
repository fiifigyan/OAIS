import axios from 'axios';
import { logger, getAuthToken } from '../utils/helpers';
import { APIConfig } from '../config';

// Get list of announcements
export const getAnnouncements = async () => {
  const authToken = getAuthToken();
  try {
    const response = await axios.get(`${APIConfig.BASE_URL}/announcements`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch announcements', error);
    throw error;
  }
};

// Get list of chats
export const getChats = async () => {
  const authToken = getAuthToken();
  try {
    const response = await axios.get(`${APIConfig.BASE_URL}/chats`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch chats', error);
    throw error;
  }
};

// Create a new chat
export const createChat = async (participants, isGroup = false, groupName = null) => {
  const authToken = getAuthToken();
  try {
    const response = await axios.post(`${APIConfig.BASE_URL}/chats`, {
      participants,
      isGroup,
      name: groupName
    }, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Failed to create chat', error);
    throw error;
  }
};

// Get messages for a chat
export const getMessages = async (chatId) => {
  const authToken = getAuthToken();
  try {
    const response = await axios.get(`${API_BASE_URL}/chats/${chatId}/messages`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Failed to fetch messages', error);
    throw error;
  }
};

// Send a message
export const sendMessageApi = async (chatId, message) => {
  const authToken = getAuthToken();
  try {
    const response = await axios.post(`${API_BASE_URL}/chats/${chatId}/messages`, message, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Failed to send message', error);
    throw error;
  }
};

// Upload a file
export const uploadFile = async (formData) => {
  const authToken = getAuthToken();
  try {
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${authToken}`,
      },
    });
    return response.data;
  } catch (error) {
    logger.error('Failed to upload file', error);
    throw error;
  }
};

// Mark message as read
export const markMessageAsRead = async (chatId, messageId) => {
  const authToken = getAuthToken();
  try {
    await axios.patch(`${API_BASE_URL}/chats/${chatId}/messages/${messageId}/read`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    logger.error('Failed to mark message as read', error);
    throw error;
  }
};

// Update a message
export const updateMessageApi = async (chatId, messageId, updates) => {
  const authToken = getAuthToken();
  try {
    const response = await axios.patch(
      `${API_BASE_URL}/chats/${chatId}/messages/${messageId}`,
      updates,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to update message', error);
    throw error;
  }
};

// Delete a message
export const deleteMessageApi = async (chatId, messageId) => {
  const authToken = getAuthToken();
  try {
    await axios.delete(`${API_BASE_URL}/chats/${chatId}/messages/${messageId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  } catch (error) {
    logger.error('Failed to delete message', error);
    throw error;
  }
};

// Reply to a message
export const replyToMessage = async (chatId, messageId, replyContent) => {
  const authToken = getAuthToken();
  try {
    const response = await axios.post(
      `${API_BASE_URL}/chats/${chatId}/messages/${messageId}/reply`,
      { content: replyContent },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    logger.error('Failed to reply to message', error);
    throw error;
  }
};

export default {
  getChats,
  createChat,
  getMessages,
  sendMessageApi,
  uploadFile,
  markMessageAsRead,
  updateMessageApi,
  deleteMessageApi,
  replyToMessage,
  getAnnouncements,
};