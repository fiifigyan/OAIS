import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomHeader from '../components/CustomHeader';
import CustomTabBar from '../components/CustomTabBar';

import HomeScreen from '../screens/Main/Dashboard';
import CalendarScreen from '../screens/Main/Calendar';
import ProfileScreen from '../screens/Main/ProfileScreen';
import ChatList from '../components/Communication/ChatList';

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
      {/* <Tab.Screen name="Chat" component={ChatList} /> */}
    </Tab.Navigator>
  );
};

export default TabNavigator;