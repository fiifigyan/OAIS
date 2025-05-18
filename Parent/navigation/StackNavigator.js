import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import AdmissionForm from '../screens/Admission/AdmissionForm';
import AddAccountScreen from '../screens/AddAccount';
import SwitchAccountScreen from '../screens/SwitchAccount';
import HistoryScreen from '../screens/History';
import ProfileScreen from '../screens/ProfileScreen';
import NotificationScreen from '../screens/Notification/Notification';
import SettingScreen from '../screens/AppSetting';
import EventScreen from '../screens/Events';
import EditProfile from '../screens/EditProfile';
import WelcomeScreen from '../screens/WelcomeScreen';
import HelpCenterScreen from '../screens/HelpCenter';
import TourScreen from '../screens/TourScreen';
import NotificationSettings from '../screens/Notification/NotificationSettings';
import AdmissionStatus from '../screens/Admission/AdmissionStatus';
import FeeDetailScreen from '../screens/FeeDetail';
import GradesScreen from '../screens/Grades';
import OTPVerificationScreen from '../screens/OTPVerification';
import PaymentProcessing from '../screens/PaymentProcessing';
import PaymentSuccess from '../components/PaymentSuccess';
import FeeBreakdown from '../screens/Admission/AdmissionBreakdown';
import AdmissionPurchase from '../screens/Admission/AdmissionPurchase';
import PaymentMethod from '../screens/PaymentMethod';
import AttendanceDetails from '../screens/AttendanceDetails';
import Gradebook from '../screens/Gradebook';
import ReportScreen from '../screens/Report';

const Stack = createNativeStackNavigator();

const StackNavigator = ({ initialRouteName = 'Home' }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Drawer" component={DrawerNavigator} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Notification" component={NotificationScreen} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
      <Stack.Screen name="NotificationDetails" component={NotificationScreen} />
      <Stack.Screen name="Settings" component={SettingScreen} />
      <Stack.Screen name="Admission" component={AdmissionForm} />
      <Stack.Screen name="AdmissionStatus" component={AdmissionStatus} />
      <Stack.Screen name="AddAccount" component={AddAccountScreen} />
      <Stack.Screen name="SwitchAccount" component={SwitchAccountScreen} />
      <Stack.Screen name="FeeDetail" component={FeeDetailScreen} />
      <Stack.Screen name="Payment" component={PaymentMethod} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Events" component={EventScreen} />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Tour" component={TourScreen} />
      <Stack.Screen name="Attendance" component={AttendanceDetails} />
      <Stack.Screen name="Setting" component={SettingScreen} />
      {/* <Stack.Screen name="Grades" component={GradesScreen} /> */}
      <Stack.Screen name="Grades" component={Gradebook} />
      <Stack.Screen name="Reports" component={ReportScreen} />
      <Stack.Screen name="OTP" component={OTPVerificationScreen} />
      <Stack.Screen name="PaymentProcessing" component={PaymentProcessing} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      <Stack.Screen name="FeeBreakdown" component={FeeBreakdown} />
      <Stack.Screen name="AdmissionPurchase" component={AdmissionPurchase} />
    </Stack.Navigator>
  );
};

export default StackNavigator;