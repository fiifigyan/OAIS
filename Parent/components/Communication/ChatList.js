import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, Animated, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import PropTypes from 'prop-types';
import { formatMessageTime } from '../../utils/helpers';

const ChatList = ({ 
  chats, 
  onSelectChat, 
  onCreateNewChat, 
  onViewAnnouncements,
  unreadCounts = {},
}) => {
  const renderItem = ({ item }) => {
    const unreadCount = unreadCounts[item.id] || 0;
    const formattedTime = formatMessageTime(item.lastMessage?.time, true);
    
    return (
      <TouchableOpacity 
        style={styles.chatItem}
        onPress={() => onSelectChat(item)}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          {item.isGroup ? (
            <Ionicons name="people" size={24} color="#00873E" />
          ) : (
            <Ionicons name="person" size={24} color="#00873E" />
          )}
        </View>
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.time}>{formattedTime}</Text>
          </View>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage?.content || 'No messages yet'}
          </Text>
        </View>
        {unreadCount > 0 && (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity 
          onPress={onCreateNewChat}
          accessibilityLabel="New chat"
        >
          <Ionicons name="add" size={28} color="#00873E" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.announcementBanner}
        onPress={onViewAnnouncements}
        activeOpacity={0.7}
      >
        <View style={styles.announcementIcon}>
          <Ionicons name="megaphone" size={20} color="white" />
        </View>
        <Text style={styles.announcementText}>Important Announcements</Text>
        <Ionicons name="chevron-forward" size={20} color="#00873E" />
      </TouchableOpacity>

      <FlatList
        data={chats}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={5}
        windowSize={7}
      />
    </View>
  );
};

ChatList.propTypes = {
  chats: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      isGroup: PropTypes.bool,
      lastMessage: PropTypes.shape({
        content: PropTypes.string,
        time: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
      }),
    })
  ).isRequired,
  onSelectChat: PropTypes.func.isRequired,
  onCreateNewChat: PropTypes.func.isRequired,
  onViewAnnouncements: PropTypes.func.isRequired,
  unreadCounts: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    ...Platform.select({
      ios: {
        paddingTop: 50,
      },
    }),
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00873E',
  },
  announcementBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  announcementIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  announcementText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: 20,
  },
  chatItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0f7e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 10,
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  lastMessage: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  unreadBadge: {
    backgroundColor: '#00873E',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChatList;