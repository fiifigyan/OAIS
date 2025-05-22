import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import axios from 'axios';
import * as SecureStorage from 'expo-secure-store';
import { Platform } from 'react-native';
import { APIConfig } from '../config';
import { getAuthToken } from '../utils/helpers';

// Configure Android notification channel
async function configureAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0B6623',
      sound: 'default',
    });
  }
}

// Initialize notification service
export async function initializeNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  await configureAndroidChannel();
}

/**
 * @typedef {Object} Notification
 * @property {string} id - Notification ID
 * @property {string} title - Notification title
 * @property {string} body - Notification body
 * @property {boolean} read - Read status
 * @property {string} timestamp - ISO timestamp
 * @property {Object} data - Additional data
 */

const NotificationService = {
  /**
   * Register device for push notifications
   * @returns {Promise<string>} Expo push token
   */
  async registerForPushNotifications() {
    try {
      if (!Device.isDevice) {
        throw new Error('Must use physical device for push notifications');
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync({
          ios: {
            allowAlert: true,
            allowBadge: true,
            allowSound: true,
          },
        });
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        throw new Error('Permission not granted');
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push notification token:', token);
      return token;
    } catch (error) {
      console.error('Push notification registration error:', error);
      throw error;
    }
  },

  /**
   * Send push token to backend
   * @param {string} token - Expo push token
   * @returns {Promise<void>}
   */
  async sendPushTokenToBackend(token) {
    try {
      const authToken = await getAuthToken();
      if (!authToken) return;

      await axios.post(`${APIConfig.BASE_URL}${APIConfig.NOTIFICATIONS.SAVE_PUSH_TOKEN}`, {
        token
      }, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        }
      });
    } catch (error) {
      console.error('Error sending token to backend:', error);
      throw error;
    }
  },

  /**
   * Setup notification handlers
   * @param {Object} navigation - Navigation object
   * @returns {Function} Cleanup function
   */
  setupNotificationHandlers(navigation) {
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      this.handleNotification(notification, navigation);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      this.handleNotification(response.notification, navigation);
    });

    return () => {
      foregroundSubscription?.remove();
      responseSubscription?.remove();
    };
  },

  /**
   * Handle notification navigation
   * @param {Object} notification - Notification object
   * @param {Object} navigation - Navigation object
   */
  handleNotification(notification, navigation) {
    const data = notification.request.content.data || {};
    navigation?.navigate('NotificationDetails', { 
      title: notification.request.content.title,
      body: notification.request.content.body,
      data,
      timestamp: notification.date
    });
  },

  // API Methods

  /**
   * Fetch notifications from server
   * @returns {Promise<Array<Notification>>}
   */
  async fetchNotifications() {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      const response = await axios.get(`${APIConfig.BASE_URL}${APIConfig.NOTIFICATIONS.GET_ALL}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      // Cache with timestamp
      const cacheData = {
        data: response.data,
        timestamp: Date.now()
      };
      await SecureStorage.setItemAsync('cachedNotifications', JSON.stringify(cacheData));
      
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      const cached = await this.getCachedNotifications();
      if (cached.length > 0) return cached;
      throw error;
    }
  },

  /**
   * Mark notification as read
   * @param {string} id - Notification ID
   * @returns {Promise<void>}
   */
  async markAsRead(id) {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      await axios.post(`${APIConfig.BASE_URL}${APIConfig.NOTIFICATIONS.MARK_AS_READ}`, { id }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  /**
   * Delete notification
   * @param {string} id - Notification ID
   * @returns {Promise<void>}
   */
  async deleteNotification(id) {
    try {
      const token = await getAuthToken();
      if (!token) throw new Error('Not authenticated');

      await axios.delete(`${APIConfig.BASE_URL}${APIConfig.NOTIFICATIONS.DELETE}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { id }
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  /**
   * Set app badge count
   * @param {number} count - Badge count
   * @returns {Promise<void>}
   */
  async setBadgeCount(count) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  },

  /**
   * Get cached notifications
   * @returns {Promise<Array<Notification>>}
   */
  async getCachedNotifications() {
    try {
      const cached = await SecureStorage.getItemAsync('cachedNotifications');
      if (!cached) return [];

      const { data, timestamp } = JSON.parse(cached);
      // Return cached data if less than 1 hour old
      if (Date.now() - timestamp < 3600000) {
        return data;
      }
      return [];
    } catch (error) {
      console.error('Error loading cached notifications:', error);
      return [];
    }
  },

  // Settings Management

  /**
   * Save notification settings
   * @param {Object} settings - Notification settings
   * @returns {Promise<void>}
   */
  async saveSettings(settings) {
    try {
      await SecureStorage.setItemAsync('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  /**
   * Load notification settings
   * @returns {Promise<Object>} Notification settings
   */
  async loadSettings() {
    try {
      const settings = await SecureStorage.getItemAsync('notificationSettings');
      return settings ? JSON.parse(settings) : {
        pushEnabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
        badgeEnabled: true
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      return {
        pushEnabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
        badgeEnabled: true
      };
    }
  }
};

export default NotificationService;