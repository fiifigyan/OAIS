import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View, Animated } from 'react-native';
import { List, IconButton, useTheme, Text } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

/**
 * @typedef {Object} NotificationItemProps
 * @property {Object} item - Notification item
 * @property {string} item.id - Notification ID
 * @property {string} item.title - Notification title
 * @property {string} item.body - Notification body
 * @property {boolean} item.read - Read status
 * @property {string} item.timestamp - Notification timestamp
 * @property {Function} onPress - Press handler
 * @property {Function} onDelete - Delete handler
 */

const NotificationItem = ({ item, onPress, onDelete }) => {
  const theme = useTheme();
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0.8],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View style={[styles.rightAction, { transform: [{ scale }] }]}>
        <IconButton
          icon="delete"
          size={24}
          color="#fff"
          onPress={() => onDelete(item.id)}
          style={styles.deleteButton}
          accessibilityLabel={`Delete notification ${item.title}`}
        />
      </Animated.View>
    );
  };

  return (
    <Swipeable
      friction={2}
      rightThreshold={40}
      renderRightActions={renderRightActions}
      containerStyle={styles.swipeableContainer}
    >
      <List.Item
        title={item.title}
        description={item.body}
        descriptionNumberOfLines={3}
        left={() => (
          <View style={styles.iconContainer}>
            <List.Icon 
              icon={item.read ? 'email-open' : 'email'} 
              color={item.read ? '#888' : theme.colors.primary} 
            />
            {!item.read && <View style={styles.unreadBadge} />}
          </View>
        )}
        right={() => (
          <View style={styles.rightContainer}>
            <Text style={styles.timeText}>
              {formatTime(item.timestamp)}
            </Text>
          </View>
        )}
        onPress={() => onPress(item.id)}
        style={[
          styles.item, 
          item.read ? styles.readItem : styles.unreadItem,
          { borderLeftColor: item.read ? '#888' : theme.colors.primary }
        ]}
        titleStyle={item.read ? styles.readTitle : styles.unreadTitle}
        descriptionStyle={item.read ? styles.readDescription : styles.unreadDescription}
        accessibilityLabel={`${item.read ? 'Read' : 'Unread'} notification: ${item.title}`}
        accessibilityHint="Press to mark as read, swipe left to delete"
      />
    </Swipeable>
  );
};

NotificationItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    read: PropTypes.bool.isRequired,
    timestamp: PropTypes.string,
  }).isRequired,
  onPress: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  swipeableContainer: {
    borderRadius: 8,
    marginVertical: 4,
    overflow: 'hidden',
  },
  item: {
    borderRadius: 8,
    paddingVertical: 12,
    borderLeftWidth: 4,
  },
  unreadItem: {
    backgroundColor: '#e8f5e9',
  },
  readItem: {
    backgroundColor: '#f5f5f5',
  },
  unreadTitle: {
    fontWeight: 'bold',
    color: '#000',
  },
  readTitle: {
    color: '#666',
  },
  unreadDescription: {
    color: '#333',
  },
  readDescription: {
    color: '#888',
  },
  iconContainer: {
    position: 'relative',
  },
  unreadBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#03AC13',
  },
  rightContainer: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  timeText: {
    fontSize: 12,
    color: '#888',
    marginRight: 8,
  },
  rightAction: {
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderRadius: 8,
    marginVertical: 4,
    paddingRight: 16,
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
});

export default memo(NotificationItem);