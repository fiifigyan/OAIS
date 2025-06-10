import React from 'react';
import { View } from 'react-native';
import NotificationList from '../../components/Notification/NotificationList';

const NotificationScreen = ({ navigation }) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <NotificationList navigation={navigation} />
    </View>
  );
};

export default NotificationScreen;