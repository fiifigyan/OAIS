import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import NotificationItem from './NotificationItem';
import NotificationService from '../../services/NotificationService';
import { useNotificationContext } from '../../context/NotificationContext';
import { groupByDate } from '../../utils/helpers';
import EmptyState from './EmptyState';
import ErrorState from './ErrorState';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const { settings, updateUnreadCount } = useNotificationContext();

  const filteredNotifications = useMemo(() => {
    if (!Array.isArray(notifications)) return []; // Add safety check
    if (filter === 'unread') {
      return notifications.filter(n => !n.read);
    }
    return notifications;
  }, [notifications, filter]);

  const groupedNotifications = useMemo(() => {
    return groupByDate(filteredNotifications);
  }, [filteredNotifications]);

  const unreadCount = useMemo(() => {
    if (!Array.isArray(notifications)) return 0; // Add safety check
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await NotificationService.fetchNotifications();
      // Ensure data is an array before setting state
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err);
      setNotifications([]); // Fallback to empty array on error
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
      await NotificationService.markAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      
      if (settings.badgeEnabled) {
        updateUnreadCount(unreadCount - 1);
        await NotificationService.setBadgeCount(unreadCount - 1);
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const wasUnread = notifications.find(n => n.id === id)?.read === false;
      await NotificationService.deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      
      if (wasUnread && settings.badgeEnabled) {
        updateUnreadCount(unreadCount - 1);
        await NotificationService.setBadgeCount(unreadCount - 1);
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };


  const renderDateSection = useCallback(({ item: date }) => (
    <View style={styles.dateSection}>
      <Text style={styles.dateHeader}>
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
  ), [groupedNotifications, handleMarkAsRead, handleDelete]);

  if (loading && !notifications.length) {
    return (
      <View style={styles.center}>
        <ActivityIndicator animating={true} size="large" color="#00873E" />
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
      <View style={styles.filterContainer}>
        <Chip
          mode="outlined"
          selected={filter === 'all'}
          onPress={() => setFilter('all')}
          style={[styles.chip, filter === 'all' && styles.selectedChip]}
          textStyle={[styles.chipText, filter === 'all' && styles.selectedChipText]}
        >
          All
        </Chip>
        <Chip
          mode="outlined"
          selected={filter === 'unread'}
          onPress={() => setFilter('unread')}
          style={[styles.chip, filter === 'unread' && styles.selectedChip]}
          textStyle={[styles.chipText, filter === 'unread' && styles.selectedChipText]}
        >
          Unread ({unreadCount})
        </Chip>
      </View>

      <FlatList
        data={Object.keys(groupedNotifications)}
        keyExtractor={(date) => date}
        renderItem={renderDateSection}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00873E']}
            tintColor="#00873E"
          />
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState 
            title={filter === 'unread' ? "No unread notifications" : "No notifications"}
            description={settings.pushEnabled 
              ? "You're all caught up!" 
              : "Notifications are disabled in settings"}
            icon={filter === 'unread' ? "email-open" : "bell-off"}
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
    backgroundColor: '#FFFFFF',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  chip: {
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  selectedChip: {
    backgroundColor: '#00873E',
    borderColor: '#00873E',
  },
  chipText: {
    fontSize: 14,
    color: '#757575',
  },
  selectedChipText: {
    color: '#FFFFFF',
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
    color: '#00873E',
  },
});

export default NotificationList;