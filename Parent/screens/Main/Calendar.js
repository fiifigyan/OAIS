import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { SafeAreaView } from 'react-native';
// import AttendanceScreen from '../../screens/Main/AttendanceDetails';
import TimetableScreen from '../../screens/Main/Timetable';
import EventCalendarScreen from '../../screens/Main/EventCalendar';

const Tab = createMaterialTopTabNavigator();

const CalendarScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#00873E' },
          tabBarActiveTintColor: '#00873E',
          tabBarInactiveTintColor: '#03c04a',
          tabBarStyle: { backgroundColor: '#ffffff' },
        }}
      >
        {/* <Tab.Screen name="Attendance" component={AttendanceScreen} /> */}
        <Tab.Screen name="Time Table" component={TimetableScreen} />
        <Tab.Screen name="Events" component={EventCalendarScreen} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default CalendarScreen;