import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Device from 'expo-device';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthStack from './navigation/AuthStack';
import { AdmissionProvider } from './context/AdmissionContext';
import StackNavigator from './navigation/StackNavigator';
import { ProfileProvider } from './context/ProfileContext';
import { PaymentProvider } from './context/PaymentContext';
import { NotificationProvider } from './context/NotificationContext';
import { HomeProvider } from './context/HomeContext';
import NotificationService, { initializeNotifications } from './services/NotificationService';
import useNotificationListener from './hooks/useNotificationListener';

function MainAppContent() {
  const { userInfo, isNewUser } = useAuth();
  useNotificationListener();

  React.useEffect(() => {
    const setupNotifications = async () => {
      try {
        await initializeNotifications();
        
        if (Device.isDevice) {
          const token = await NotificationService.registerForPushNotifications();
          if (token && userInfo) {
            await NotificationService.sendPushTokenToBackend(token);
          }
        }
      } catch (error) {
        console.error('Notification setup error:', error);
      }
    };

    setupNotifications();
  }, [userInfo]);

  return (
    <NavigationContainer>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#03AC13' }}>
        <StatusBar barStyle="default" />
        {!userInfo ? (
          <StackNavigator initialRouteName="Drawer" />
        ) : isNewUser ? (
          <StackNavigator initialRouteName="Welcome" />
        ) : (
          <StackNavigator initialRouteName="Drawer" />
        )}
      </SafeAreaView>
    </NavigationContainer>
  );
}

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationProvider>
        <AuthProvider>
          <AdmissionProvider>
            <ProfileProvider>
              <HomeProvider>
                <PaymentProvider>
                  <MainAppContent />
                </PaymentProvider>  
              </HomeProvider>
            </ProfileProvider>
          </AdmissionProvider>
        </AuthProvider>
      </NotificationProvider>
    </GestureHandlerRootView>
  );
}

export default App;