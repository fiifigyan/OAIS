import React, { useState, useEffect, useContext } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { List } from 'react-native-paper';
import { NotificationContext } from '../context/NotificationContext';
import axios from 'axios';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const { settings } = useContext(NotificationContext);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('https://your-api.com/notifications');
        setNotifications(response.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await axios.post(`https://your-api.com/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`https://your-api.com/notifications/${id}`);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item
            title={item.title}
            description={item.body}
            left={() => <List.Icon icon={item.read ? 'email-open' : 'email'} />}
            right={() => (
              <TouchableOpacity onPress={() => deleteNotification(item.id)}>
                <List.Icon icon="delete" />
              </TouchableOpacity>
            )}
            onPress={() => markAsRead(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default NotificationCenter;