import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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

  if (!title && !body) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: '#ffffff' }]}>
        <Icon name="error-outline" size={48} color="#ff3b30" />
        <Text style={[styles.errorText, { color: '#ff3b30' }]}>
          Notification data not available
        </Text>
      </View>
    );
  }

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: '#ffffff' }]}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={[styles.title, { color: '#03ac13' }]}>{title}</Text>
      
      {timestamp && (
        <View style={styles.timeContainer}>
          <Icon name="access-time" size={16} color="#757575" />
          <Text style={[styles.timeText, { color: '#757575' }]}>
            {formatDateTime(timestamp)}
          </Text>
        </View>
      )}

      <Text style={[styles.body, { color: '#212121' }]}>{body}</Text>

      {data && Object.keys(data).length > 0 && (
        <View style={[styles.dataContainer, { backgroundColor: '#f5f5f5' }]}>
          <Text style={[styles.dataTitle, { color: '#03ac13' }]}>
            Additional Details
          </Text>
          {Object.entries(data).map(([key, value]) => (
            <View key={key} style={styles.dataRow}>
              <Text style={[styles.dataKey, { color: '#212121' }]}>{key}:</Text>
              <Text style={[styles.dataValue, { color: '#212121' }]}>
                {typeof value === 'string' ? value : JSON.stringify(value)}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timeText: {
    fontSize: 14,
    marginLeft: 8,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  dataContainer: {
    borderRadius: 8,
    padding: 16,
  },
  dataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  dataRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dataKey: {
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 100,
  },
  dataValue: {
    flex: 1,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NotificationDetails;