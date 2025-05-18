import { Alert, Linking, Platform } from 'react-native';
import * as Calendar from 'expo-calendar';

export const addEventToCalendar = async (event) => {
  try {
    // Request calendar permissions directly from expo-calendar
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please enable calendar permissions in settings');
      return;
    }

    // Get the default calendar ID
    const defaultCalendar = await Calendar.getDefaultCalendarAsync();
    
    // Create the event
    const eventId = await Calendar.createEventAsync(defaultCalendar.id, {
      title: event.title,
      startDate: new Date(`${event.date}T${event.time}:00`),
      endDate: new Date(new Date(`${event.date}T${event.time}:00`).getTime() + (60 * 60 * 1000)), // 1 hour duration
      location: event.location,
      notes: event.description,
      alarms: [{
        relativeOffset: -15, // 15 minutes before
      }]
    });

    return eventId;
  } catch (error) {
    console.error('Error adding to calendar:', error);
    throw error;
  }
};

export const openCalendarApp = async () => {
  try {
    const url = Platform.OS === 'ios' 
      ? 'calshow:' 
      : 'content://com.android.calendar/time/';
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('Error', 'Could not open calendar app');
  }
};