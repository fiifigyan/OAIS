import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomHeader from '../components/CustomHeader';
import CustomTabBar from '../components/CustomTabBar';

import HomeScreen from '../screens/Main/Home';
import CalendarScreen from '../screens/Main/Calendar';
import ProfileScreen from '../screens/Main/ProfileScreen';
import NotificationScreen from '../screens/Notification/Notification';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        animation: 'fade',
        headerShown: true,
        header: (props) => (
          <CustomHeader
            {...props}
            title={props.route.name}
            navigation={props.navigation}
          />
        ),
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Notification" component={NotificationScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;