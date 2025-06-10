import React, { memo } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { 
  View, 
  Text, 
  List, 
  Icon,
  HStack,
  VStack,
} from '@expo/ui/swift-ui';
import { Swipeable } from 'react-native-gesture-handler';
import PropTypes from 'prop-types';

const NotificationItem = ({ item, onPress, onDelete }) => {
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
      <Animated.View style={{ 
        transform: [{ scale }],
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 16,
      }}>
        <View 
          style={[styles.deleteButton, { backgroundColor: '#E53935' }]}
          onPress={() => onDelete(item.id)}
        >
          <Icon name="trash" size={20} color="#FFFFFF" />
          <Text style={styles.deleteText}>Delete</Text>
        </View>
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
        onPress={() => onPress(item.id)}
        style={[
          styles.listItem,
          item.read ? styles.readItem : styles.unreadItem
        ]}
      >
        <HStack alignItems="center" space="small">
          <View style={[
            styles.iconContainer,
            item.read ? styles.readIcon : styles.unreadIcon
          ]}>
            <Icon 
              name={item.read ? 'email-open' : 'email'} 
              size={20} 
              color={item.read ? '#757575' : '#00873E'} 
            />
          </View>
          
          <VStack flex={1}>
            <Text 
              style={[
                styles.titleText,
                item.read ? styles.readText : styles.unreadText
              ]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text 
              numberOfLines={2} 
              style={[
                styles.bodyText,
                item.read ? styles.readText : styles.unreadText
              ]}
            >
              {item.body}
            </Text>
          </VStack>
          
          <Text 
            style={styles.timeText}
          >
            {formatTime(item.timestamp)}
          </Text>
        </HStack>
      </List.Item>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  swipeableContainer: {
    marginVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  listItem: {
    borderRadius: 12,
    paddingVertical: 12,
  },
  readItem: {
    backgroundColor: '#FFFFFF',
  },
  unreadItem: {
    backgroundColor: '#F0F9F0',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  readIcon: {
    backgroundColor: '#EEEEEE',
  },
  unreadIcon: {
    backgroundColor: '#E0F2E0',
  },
  titleText: {
    fontSize: 16,
  },
  bodyText: {
    fontSize: 14,
    marginTop: 4,
  },
  readText: {
    color: '#757575',
  },
  unreadText: {
    color: '#2D3748',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 12,
    color: '#9E9E9E',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  deleteButton: {
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  deleteText: {
    color: 'white',
    fontSize: 12,
    marginTop: 4,
  },
});

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

export default memo(NotificationItem);