import React, { useEffect, useRef } from 'react';
import { SafeAreaView, StatusBar, LogBox, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthStack from './navigation/AuthStack';
import StackNavigator from './navigation/StackNavigator';
import { AdmissionProvider } from './context/AdmissionContext';
import { ProfileProvider } from './context/ProfileContext';
import { PaymentProvider } from './context/PaymentContext';
import { HomeProvider } from './context/HomeContext';
import { NotificationProvider } from './context/NotificationContext';
import NotificationService from './services/NotificationService';
import { getAuthToken } from './utils/helpers';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// Ignore specific warnings
LogBox.ignoreLogs([
  'AsyncStorage has been extracted',
  'Setting a timer',
  '`shouldShowAlert` is deprecated', // Ignore the specific deprecation warning
]);

/**
 * Main application content with navigation and notifications
 */
function MainAppContent() {
  const navigationRef = useRef();
  const routeNameRef = useRef();
  const { userInfo, isNewUser } = useAuth();

  // Initialize notifications
  useEffect(() => {
    const setupNotifications = async () => {
      try {
        // Configure Android channel
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#03AC13',
            sound: 'default',
          });
        }

        if (Device.isDevice && userInfo) {
          const { status } = await Notifications.getPermissionsAsync();
          
          if (status !== 'granted') {
            const { status: newStatus } = await Notifications.requestPermissionsAsync();
            if (newStatus !== 'granted') return;
          }

          const token = await Notifications.getExpoPushTokenAsync();
          // log token for debugging
          console.log('Push token:', token.data);
          const authToken = await getAuthToken();
          if (token.data && authToken) {
            await NotificationService.sendPushTokenToBackend(token.data);
          }
        }

        // Setup notification received listener
        const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
          navigationRef.current?.navigate('NotificationDetails', {
            ...notification.request.content.data,
            title: notification.request.content.title,
            body: notification.request.content.body,
          });
        });

        // Setup notification response listener
        const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
          navigationRef.current?.navigate('NotificationDetails', {
            ...response.notification.request.content.data,
            title: response.notification.request.content.title,
            body: response.notification.request.content.body,
          });
        });

        return () => {
          receivedSubscription.remove();
          responseSubscription.remove();
        };
      } catch (error) {
        console.error('Notification setup error:', error);
      }
    };

    setupNotifications();
  }, [userInfo]);

  return (
    <NavigationContainer 
      ref={navigationRef}
      onReady={() => {
        routeNameRef.current = navigationRef.current.getCurrentRoute().name;
      }}
      onStateChange={async () => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current.getCurrentRoute().name;
        routeNameRef.current = currentRouteName;
      }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: '#03ac13' }}>
        <StatusBar 
          barStyle="light-content" 
          backgroundColor="#03ac13" 
        />
        {!userInfo ? (
          <AuthStack />
        ) : isNewUser ? (
          <StackNavigator initialRouteName="Welcome" />
        ) : (
          <StackNavigator initialRouteName="Drawer" />
        )}
      </SafeAreaView>
    </NavigationContainer>
  );
}

/**
 * Root application component
 */
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