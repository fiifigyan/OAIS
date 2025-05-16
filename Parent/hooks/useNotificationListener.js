import React, { useEffect } from 'react';
import NotificationService from '../services/NotificationService';
import { useNotificationContext } from '../context/NotificationContext';

/**
 * Hook to handle notification listeners
 * @param {Object} navigation - Navigation object
 */
const useNotificationListener = (navigation) => {
  const { settings, updateUnreadCount } = useNotificationContext();

  useEffect(() => {
    if (!navigation || !settings.pushEnabled) return;

    const cleanup = NotificationService.setupNotificationHandlers((notification) => {
      // Handle notification when app is in foreground
      navigation.navigate('NotificationDetails', {
        ...notification.request.content.data,
        title: notification.request.content.title,
        body: notification.request.content.body,
        timestamp: notification.date
      });

      // Update unread count
      updateUnreadCount(prev => prev + 1);
    });

    return cleanup;
  }, [navigation, settings.pushEnabled, updateUnreadCount]);
};

export default useNotificationListener;