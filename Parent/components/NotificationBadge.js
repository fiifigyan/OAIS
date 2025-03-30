import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Badge } from 'react-native-paper';

const NotificationBadge = ({ count }) => {
  return (
    <View style={styles.container}>
      <Badge visible={count > 0} style={styles.badge}>
        {count}
      </Badge>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#FF3B30',
  },
});

export default NotificationBadge;