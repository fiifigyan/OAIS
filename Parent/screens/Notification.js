import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NotificationList from '../components/NotificationList';
import NotificationSettings from '../screens/NotificationSettings';

const Tab = createMaterialTopTabNavigator();

const NotificationScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
        tabBarIndicatorStyle: { backgroundColor: '#03AC13' },
        tabBarActiveTintColor: '#03AC13',
        tabBarInactiveTintColor: '#888',
      }}
    >
      <Tab.Screen 
        name="Notifications" 
        component={NotificationList}
        options={{ tabBarLabel: 'Notifications' }}
      />
      <Tab.Screen 
        name="Settings" 
        component={NotificationSettings}
        options={{ tabBarLabel: 'Settings' }}
      />
    </Tab.Navigator>
  );
};

export default NotificationScreen;