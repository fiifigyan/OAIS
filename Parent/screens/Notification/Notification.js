import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View } from 'react-native';
import NotificationList from '../../components/Notification/NotificationList';
import EmptyState from '../../components/Notification/EmptyState';

const Tab = createMaterialTopTabNavigator();

const UnreadNotifications = () => {
  return (
    <EmptyState 
      title="No unread notifications"
      description="You don't have any unread notifications"
      icon="email-open"
    />
  );
};

const NotificationScreen = () => {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { 
            fontFamily: 'System',
            fontWeight: '600',
            textTransform: 'none',
          },
          tabBarIndicatorStyle: { 
            backgroundColor: '#0B6623',
            height: 3,
          },
          tabBarActiveTintColor: '#0B6623',
          tabBarInactiveTintColor: '#757575',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
      >
        <Tab.Screen 
          name="All" 
          component={NotificationList}
          options={{ 
            tabBarLabel: 'All',
          }}
        />
        <Tab.Screen 
          name="Unread" 
          component={UnreadNotifications}
          options={{ 
            tabBarLabel: 'Unread',
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default NotificationScreen;