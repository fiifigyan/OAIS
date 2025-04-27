import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const NotificationDetails = ({ route }) => {
  const { title, body, data, timestamp } = route.params || {};

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString([], {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {timestamp && (
        <Text style={styles.timeText}>
          {formatDateTime(timestamp)}
        </Text>
      )}
      <Text style={styles.body}>{body}</Text>
      {data && (
        <View style={styles.dataContainer}>
          <Text style={styles.dataTitle}>Additional Data:</Text>
          <Text style={styles.dataContent}>
            {JSON.stringify(data, null, 2)}
          </Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#03AC13',
  },
  timeText: {
    fontSize: 14,
    color: '#888',
    marginBottom: 15,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
  },
  dataContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  dataTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  dataContent: {
    fontFamily: 'monospace',
  },
});

export default NotificationDetails;