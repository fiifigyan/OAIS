import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomDrawer from '../components/CustomDrawer';
import TabNavigator from './TabNavigator';
import { Easing } from 'react-native-reanimated';

import AdmissionForm from '../screens/Admission/AdmissionForm';
import PaymentHistoryScreen from '../screens/Payment/PaymentHistory';
import AddAccountScreen from '../screens/Auth/AddAccount';
import SwitchAccountScreen from '../screens/Auth/SwitchAccount';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'transparent',
        drawerStyle: {
          width: '80%',
        },
        sceneContainerStyle: {
          backgroundColor: 'aliceblue',
        },
        drawerActiveTintColor: '#0B6623',
        drawerInactiveTintColor: 'aliceblue',
        drawerLabelStyle: {
          fontSize: 15,
          fontWeight: '500',
        },
        drawerItemStyle: {
          borderRadius: 12,
        },
        drawerActiveBackgroundColor: '#eef2ff',
        transitionConfig: () => ({
          transitionSpec: {
            duration: 300,
            easing: Easing.out(Easing.ease),
            timing: Easing.bezier(0.25, 0.1, 0.25, 1),
          },
        }),
      }}
    >
      <Drawer.Screen
        name="Dashboard"
        component={TabNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="home-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Admission"
        component={AdmissionForm}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="document-text-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Payment History"
        component={PaymentHistoryScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="receipt-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Add Account"
        component={AddAccountScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="person-add-outline" size={22} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="Switch Account"
        component={SwitchAccountScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Icon name="swap-horizontal-outline" size={22} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;