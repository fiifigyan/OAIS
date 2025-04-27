import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { List, IconButton, useTheme } from 'react-native-paper';

const NotificationItem = ({ item, onPress, onDelete }) => {
  const theme = useTheme();
  
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <List.Item
      title={item.title}
      description={item.body}
      descriptionNumberOfLines={3}
      left={() => (
        <List.Icon 
          icon={item.read ? 'email-open' : 'email'} 
          color={item.read ? '#888' : theme.colors.primary} 
        />
      )}
      right={() => (
        <View style={styles.rightContainer}>
          <Text style={styles.timeText}>
            {formatTime(item.timestamp)}
          </Text>
          <TouchableOpacity onPress={() => onDelete(item.id)}>
            <IconButton
              icon="delete"
              size={20}
              color="#ff4444"
            />
          </TouchableOpacity>
        </View>
      )}
      onPress={onPress}
      style={[
        styles.item, 
        item.read ? styles.readItem : styles.unreadItem,
        { borderLeftColor: item.read ? '#888' : theme.colors.primary }
      ]}
      titleStyle={item.read ? styles.readTitle : styles.unreadTitle}
      descriptionStyle={item.read ? styles.readDescription : styles.unreadDescription}
    />
  );
};

const styles = StyleSheet.create({
  item: {
    marginVertical: 4,
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
});

export default NotificationItem;