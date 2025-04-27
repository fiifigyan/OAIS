import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { APIConfig } from '../config';

// Configure Android notification channel
async function configureAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#03AC13',
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

const NotificationService = {
  async registerForPushNotifications() {
    try {
      if (!Device.isDevice) {
        throw new Error('Must use physical device for push notifications');
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
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

  async sendPushTokenToBackend(token) {
    try {
      await axios.post(`${APIConfig.BASE_URL}${APIConfig.NOTIFICATIONS.SAVE_PUSH_TOKEN}`, {
        token
      }, {
        headers: {
          Authorization: `Bearer ${APIConfig.token}`,
        }
      });
    } catch (error) {
      console.error('Error sending token to backend:', error);
    }
  },

  setupNotificationHandlers(navigation) {
    const foregroundSubscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received in foreground:', notification);
      navigation?.navigate('NotificationDetails', { ...notification.request.content.data });
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
      this.handleNotification(response.notification, navigation);
    });

    return () => {
      foregroundSubscription.remove();
      responseSubscription.remove();
    };
  },

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
  async fetchNotifications() {
    try {
      const response = await axios.get(`${APIConfig.BASE_URL}${APIConfig.NOTIFICATIONS.GET_ALL}`, {
        headers: {
          Authorization: `Bearer ${APIConfig.token}`,
        }
      });
      await AsyncStorage.setItem('cachedNotifications', JSON.stringify(response.data));
      return response.data;
    } catch (error) {
      const cached = await AsyncStorage.getItem('cachedNotifications');
      if (cached) return JSON.parse(cached);
      throw error;
    }
  },

  async markAsRead(id) {
    try {
      await axios.post(`${APIConfig.BASE_URL}${APIConfig.NOTIFICATIONS.MARK_AS_READ}`, { id }, {
        headers: {
          Authorization: `Bearer ${APIConfig.token}`,
        }
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async deleteNotification(id) {
    try {
      await axios.delete(`${APIConfig.BASE_URL}${APIConfig.NOTIFICATIONS.DELETE_NOTIFICATION}`, {
        headers: {
          Authorization: `Bearer ${APIConfig.token}`,
        },
        data: { id }
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  async setBadgeCount(count) {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
    }
  },

  // Settings Management
  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem('notificationSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  async loadSettings() {
    try {
      const settings = await AsyncStorage.getItem('notificationSettings');
      return settings ? JSON.parse(settings) : {
        pushEnabled: true,
        soundEnabled: true,
        vibrationEnabled: true,
        badgeEnabled: true
      };
    } catch (error) {
      console.error('Error loading settings:', error);
      throw error;
    }
  },

  async getCachedNotifications() {
    try {
      const cached = await AsyncStorage.getItem('cachedNotifications');
      return cached ? JSON.parse(cached) : [];
    } catch (error) {
      console.error('Error loading cached notifications:', error);
      return [];
    }
  }
};

export default NotificationService;