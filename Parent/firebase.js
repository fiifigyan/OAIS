import { AppRegistry } from 'react-native';
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyD-2z4Tm6GQw1Kv6b7hFZyJ1G4t9T2J1vA",
  authDomain: "royals-international-school.firebaseapp.com",
  projectId: "royals-international-school",
  storageBucket: "royals-international-school.appspot.com",
  messagingSenderId: "592534746069",
  appId: "1:592534746069:web:5c5b2a2b7c7f3d3b1c6c2e"
};

// Initialize Firebase if needed (might be handled automatically)
// ...

AppRegistry.registerComponent('app', () => App);