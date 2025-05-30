import React from 'react';
import { View, FlatList, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ChatList = ({ chats, onSelectChat, onCreateNewChat, onViewAnnouncements }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <TouchableOpacity onPress={onCreateNewChat}>
          <Ionicons name="add" size={28} color="#00873E" />
        </TouchableOpacity>
      </View>

      {/* Announcement Banner */}
      <TouchableOpacity 
        style={styles.announcementBanner}
        onPress={onViewAnnouncements}
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
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.chatItem}
            onPress={() => onSelectChat(item)}
          >
            <View style={styles.avatar}>
              <Ionicons 
                name={item.isGroup ? "people" : "person"} 
                size={24} 
                color="#00873E" 
              />
            </View>
            <View style={styles.chatContent}>
              <Text style={styles.chatName}>{item.name}</Text>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {item.lastMessage?.content || 'No messages yet'}
              </Text>
            </View>
            <View style={styles.chatMeta}>
              <Text style={styles.time}>
                {item.lastMessage?.time || ''}
              </Text>
              {item.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{item.unreadCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
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
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
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
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  lastMessage: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  chatMeta: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#999',
  },
  unreadBadge: {
    backgroundColor: '#00873E',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  unreadText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ChatList;