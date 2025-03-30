import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import AdmissionForm from '../screens/AdmissionForm';
import AddAccountScreen from '../screens/AddAccountScreen';
import SwitchAccountScreen from '../screens/SwitchAccountScreen';
import PaymentScreen from '../screens/PaymentScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ParentProfile from '../screens/ParentProfile';
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/SettingScreen';
import EventScreen from '../screens/EventScreen';
import EditProfile from '../screens/EditProfileScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import HelpCenterScreen from '../screens/HelpCenterScreen';
import TourScreen from '../screens/TourScreen';
import NotificationSettings from '../screens/NotificationSettings';
import HomeWorkScreen from '../screens/HomeWorkScreen';
import AdmissionStatus from '../screens/AdmissionStatus';
import StudentProfile from '../screens/StudentProfile';
import FeeDetailScreen from '../screens/FeeDetailScreen';
import GradesScreen from '../screens/GradeScreen';
import OTPVerificationScreen from '../screens/OTPVerificationScreen';
import PaymentProcessing from '../screens/PaymentProcessing';
import PaymentSuccess from '../components/PaymentSuccess';

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="Parent" component={ParentProfile} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="Settings" component={SettingScreen} />
      <Stack.Screen name="Admission" component={AdmissionForm} />
      <Stack.Screen name="AdmissionStatus" component={AdmissionStatus} />
      <Stack.Screen name="Student" component={StudentProfile} />
      <Stack.Screen name="AddAccount" component={AddAccountScreen} />
      <Stack.Screen name="SwitchAccount" component={SwitchAccountScreen} />
      <Stack.Screen name="FeeDetail" component={FeeDetailScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Events" component={EventScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Tour" component={TourScreen} />
      <Stack.Screen name="Homework" component={HomeWorkScreen} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      <Stack.Screen name="Grades" component={GradesScreen} />
      <Stack.Screen name="OTP" component={OTPVerificationScreen} />
      <Stack.Screen name="PaymentProcessing" component={PaymentProcessing} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
    </Stack.Navigator>
  );
};

export default StackNavigator;