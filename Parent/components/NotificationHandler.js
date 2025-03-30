import {useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';
import NotificationService from '..services/NotificationService';

function App() {
  useEffect(() => {
    NotificationService.initialize();
    
    // Handle notification opened from quit state
    messaging().getInitialNotification().then(remoteMessage => {
      if (remoteMessage) {
        NotificationService.handleNotification(remoteMessage);
      }
    });

    // Handle notification opened from background state
    const unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      NotificationService.handleNotification(remoteMessage);
    });

    return () => {
      NotificationService.cleanup();
      unsubscribe();
    };
  }, []);
}