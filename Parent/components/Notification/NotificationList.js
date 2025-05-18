import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, Button, useTheme } from 'react-native-paper';
import NotificationItem from './NotificationItem';
import { fetchNotifications, markAsRead, deleteNotification, setBadgeCount } from '../../services/NotificationService';
import { useNotificationContext } from '../../context/NotificationContext';
import { groupByDate } from '../../utils/helpers';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

const NotificationList = () => {
  const theme = useTheme();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { settings, updateUnreadCount } = useNotificationContext();

  // Memoize grouped notifications
  const groupedNotifications = useMemo(() => {
    return groupByDate(notifications);
  }, [notifications]);

  // Calculate unread count
  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchNotifications();
      setNotifications(data);
      
      if (settings.badgeEnabled) {
        updateUnreadCount(unreadCount);
        await setBadgeCount(unreadCount);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [settings.badgeEnabled, updateUnreadCount]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      
      if (settings.badgeEnabled) {
        updateUnreadCount(unreadCount - 1);
        await setBadgeCount(unreadCount - 1);
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const wasUnread = notifications.find(n => n.id === id)?.read === false;
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      if (wasUnread && settings.badgeEnabled) {
        updateUnreadCount(unreadCount - 1);
        await setBadgeCount(unreadCount - 1);
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  const renderDateSection = useCallback(({ item: date }) => (
    <View style={styles.dateSection}>
      <Text style={[styles.dateHeader, { color: theme.colors.primary }]}>
        {date}
      </Text>
      {groupedNotifications[date].map(notification => (
        <NotificationItem
          key={notification.id}
          item={notification}
          onPress={handleMarkAsRead}
          onDelete={handleDelete}
        />
      ))}
    </View>
  ), [groupedNotifications, handleMarkAsRead, handleDelete, theme]);

  if (loading && !notifications.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} color={theme.colors.primary} size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <ErrorState 
        error={error} 
        onRetry={loadData}
      />
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(groupedNotifications)}
        keyExtractor={(date) => date}
        renderItem={renderDateSection}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState 
            title="No notifications"
            description={settings.pushEnabled 
              ? "You don't have any notifications yet" 
              : "Notifications are disabled in settings"}
            icon="bell-off"
          />
        }
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={10}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dateSection: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});

export default NotificationList;