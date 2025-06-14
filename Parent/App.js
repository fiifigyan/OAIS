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
import AdmissionNavigator from './navigation/AdmissionNavigator';
import { decodeToken } from './utils/helpers';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

LogBox.ignoreLogs([
  'AsyncStorage has been extracted',
  'Setting a timer',
  '`shouldShowAlert` is deprecated',
]);

function MainAppContent() {
  const navigationRef = useRef();
  const routeNameRef = useRef();
  const { userInfo } = useAuth();

  // Verify token on app start
  useEffect(() => {
    const verifyToken = async () => {
      try {
        if (userInfo?.token) {
          const tokenData = decodeToken(userInfo.token);
          if (!tokenData) {
            await auth.logout();
          }
        }
      } catch (error) {
        await auth.logout();
      }
    };
    
    verifyToken();
  }, [userInfo]);

  useEffect(() => {
    const setupNotifications = async () => {
      try {
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#00873E',
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
          const authToken = await getAuthToken();
          if (token.data && authToken) {
            await NotificationService.sendPushTokenToBackend(token.data);
          }
        }

        const receivedSubscription = Notifications.addNotificationReceivedListener(notification => {
          navigationRef.current?.navigate('NotificationDetails', {
            ...notification.request.content.data,
            title: notification.request.content.title,
            body: notification.request.content.body,
          });
        });

        const responseSubscription = Notifications.addNotificationResponseReceivedListener(response => {
          navigationRef.current?.navigate('NotificationDetails', {
            ...response.notification.request.content.data,
            title: response.notification.request.content.title,
            body: response.notification.request.content.body,
          });
        });

        return () => {
          receivedSubscription?.remove();
          responseSubscription?.remove();
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
      <SafeAreaView style={{ flex: 1, backgroundColor: '#00873E' }}>
        <StatusBar barStyle="light-content" backgroundColor="#00873E" />
        {!userInfo ? (
          <AuthStack />
        ) : userInfo.studentId ? (
          <StackNavigator initialRouteName="Drawer" />
        ) : (
          <AdmissionNavigator initialRouteName="Welcome" />
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