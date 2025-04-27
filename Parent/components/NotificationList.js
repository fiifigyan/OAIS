import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { ActivityIndicator, Text, Button } from 'react-native-paper';
import NotificationItem from '../components/NotificationItem';
import { fetchNotifications, markAsRead, deleteNotification, setBadgeCount, getCachedNotifications } from '../services/NotificationService';
import { useNotificationContext } from '../context/NotificationContext';
import { groupByDate } from '../utils/helpers';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [groupedNotifications, setGroupedNotifications] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { settings, updateUnreadCount } = useNotificationContext();

  const loadData = useCallback(async () => {
    try {
      if (!settings.pushEnabled) {
        const cached = await getCachedNotifications();
        setNotifications(cached);
        groupNotifications(cached);
        setError(new Error('Notifications are disabled in settings'));
        return;
      }

      const data = await fetchNotifications();
      setNotifications(data);
      groupNotifications(data);
      setError(null);
      
      if (settings.badgeEnabled) {
        const unreadCount = data.filter(n => !n.read).length;
        updateUnreadCount(unreadCount);
        await setBadgeCount(unreadCount);
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [settings.pushEnabled, settings.badgeEnabled]);

  const groupNotifications = (data) => {
    const grouped = groupByDate(data);
    setGroupedNotifications(grouped);
  };

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
        const newUnreadCount = notifications.filter(n => !n.read).length - 1;
        updateUnreadCount(Math.max(0, newUnreadCount));
        await setBadgeCount(Math.max(0, newUnreadCount));
      }
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      const wasUnread = notifications.find(n => n.id === id)?.read === false;
      if (wasUnread && settings.badgeEnabled) {
        const newUnreadCount = notifications.filter(n => !n.read).length - 1;
        updateUnreadCount(Math.max(0, newUnreadCount));
        await setBadgeCount(Math.max(0, newUnreadCount));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  if (loading && !notifications.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} color="#03AC13" size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error.message || 'Failed to load notifications'}
        </Text>
        <Button 
          mode="contained" 
          onPress={loadData}
          style={styles.retryButton}
          labelStyle={styles.retryButtonLabel}
        >
          Try Again
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.keys(groupedNotifications)}
        keyExtractor={(date) => date}
        renderItem={({ item: date }) => (
          <View style={styles.dateSection}>
            <Text style={styles.dateHeader}>{date}</Text>
            {groupedNotifications[date].map(notification => (
              <NotificationItem
                key={notification.id}
                item={notification}
                onPress={() => handleMarkAsRead(notification.id)}
                onDelete={() => handleDelete(notification.id)}
              />
            ))}
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#03AC13']}
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>
              {settings.pushEnabled 
                ? 'No notifications available' 
                : 'Notifications are disabled in settings'}
            </Text>
          </View>
        }
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
  errorText: {
    color: '#ff4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#03AC13',
    borderRadius: 8,
  },
  retryButtonLabel: {
    color: 'white',
  },
  emptyText: {
    color: '#888',
  },
  dateSection: {
    marginBottom: 16,
  },
  dateHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#03AC13',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
});

export default NotificationList;