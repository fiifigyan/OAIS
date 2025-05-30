import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import AdmissionForm from '../screens/Admission/AdmissionForm';
import AddAccountScreen from '../screens/Main/AddAccount';
import SwitchAccountScreen from '../screens/Main/SwitchAccount';
import HistoryScreen from '../screens/Payment/PaymentHistory';
import ProfileScreen from '../screens/Main/ProfileScreen';
import NotificationScreen from '../screens/Notification/Notification';
import SettingsScreen from '../screens/Main/Settings';
import EventScreen from '../screens/Main/Events';
import EditProfile from '../screens/Auth/EditProfile';
import WelcomeScreen from '../screens/Admission/WelcomeScreen';
import HelpCenterScreen from '../screens/Main/HelpCenter';
import TourScreen from '../screens/Admission/TourScreen';
import NotificationSettings from '../screens/Notification/NotificationSettings';
import AdmissionStatus from '../screens/Admission/AdmissionStatus';
import FeeDetailScreen from '../screens/Main/FeeDetail';
import OTPVerificationScreen from '../screens/Auth/OTPVerification';
import PaymentProcessing from '../screens/Payment/PaymentProcessing';
import PaymentSuccess from '../components/PaymentSuccess';
import FeeBreakdown from '../screens/Admission/AdmissionBreakdown';
import AdmissionPurchase from '../screens/Admission/AdmissionPurchase';
import PaymentMethod from '../screens/Payment/PaymentMethod';
import AttendanceDetails from '../screens/Main/AttendanceDetails';
import Gradebook from '../screens/Main/Gradebook';
import ReportScreen from '../screens/Main/Report';
import SuccessModal from '../components/SuccessModal';
import ChatScreen from '../screens/Main/Chat';
import UploadProgress from '../components/UploadProgress';
import AnnouncementsScreen from '../screens/Main/Announcements';
import ChatList from '../components/Communication/ChatList';

const Stack = createNativeStackNavigator();

const StackNavigator = ({ initialRouteName = 'Drawer' }) => {
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
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Admission" component={AdmissionForm} />
      <Stack.Screen name="AdmissionStatus" component={AdmissionStatus} />
      <Stack.Screen name="AddAccount" component={AddAccountScreen} />
      <Stack.Screen name="SwitchAccount" component={SwitchAccountScreen} />
      <Stack.Screen name="FeeDetail" component={FeeDetailScreen} />
      <Stack.Screen name="Payment" component={PaymentMethod} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen 
        name="Events" 
        component={EventScreen} 
        options={{ 
          title: 'Events',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#00873E',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen name="HelpCenter" component={HelpCenterScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Tour" component={TourScreen} />
      <Stack.Screen 
        name="Attendance" 
        component={AttendanceDetails}
        options={{ 
          title: 'Attendance',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#00873E',

          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: 'bold',
          },
        }}
      />
      <Stack.Screen name="Grades" component={Gradebook} />
      <Stack.Screen name="Reports" component={ReportScreen} />
      <Stack.Screen name="OTP" component={OTPVerificationScreen} />
      <Stack.Screen name="PaymentProcessing" component={PaymentProcessing} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccess} />
      <Stack.Screen name="FeeBreakdown" component={FeeBreakdown} />
      <Stack.Screen name="AdmissionPurchase" component={AdmissionPurchase} />
      <Stack.Screen name="Chats" component={ChatScreen} />
      <Stack.Screen name="ChatList" component={ChatList} />
      <Stack.Screen name="Modal" component={SuccessModal} />
      <Stack.Screen name="UploadProgress" component={UploadProgress} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} options={{ title: 'Announcements' }} />
    </Stack.Navigator>
  );
};

export default StackNavigator;