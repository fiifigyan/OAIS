import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import NotificationList from '../components/NotificationList';
import NotificationSettings from '../screens/NotificationSettings';

const Tab = createMaterialTopTabNavigator();

const NotificationScreen = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarLabelStyle: { 
          fontSize: 14, 
          fontWeight: 'bold',
          textTransform: 'none',
        },
        tabBarIndicatorStyle: { 
          backgroundColor: '#03ac13',
          height: 3,
        },
        tabBarActiveTintColor: '#03ac13',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarPressColor: 'rgba(3, 172, 19, 0.12)',
      }}
    >
      <Tab.Screen 
        name="Notifications" 
        component={NotificationList}
        options={{ 
          tabBarLabel: 'Notifications',
          tabBarAccessibilityLabel: 'Notifications tab',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={NotificationSettings}
        options={{ 
          tabBarLabel: 'Settings',
          tabBarAccessibilityLabel: 'Notification settings tab',
        }}
      />
    </Tab.Navigator>
  );
};

export default NotificationScreen;