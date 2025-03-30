import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal, TextInput, Button } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

const CalendarView = ({ events, selectedDate, handleDayPress, addEvent }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventTime, setNewEventTime] = useState('');

  const handleAddEvent = () => {
    if (newEventTitle && newEventTime) {
      addEvent(selectedDate, { title: newEventTitle, time: newEventTime });
      setIsModalVisible(false);
      setNewEventTitle('');
      setNewEventTime('');
    }
  };

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...Object.keys(events).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: '#007BFF' };
            return acc;
          }, {}),
          [selectedDate]: { selected: true, selectedColor: '#007BFF' },
        }}
        theme={{
          todayTextColor: '#007BFF',
          arrowColor: '#007BFF',
          backgroundColor: '#f9f9f9',
          calendarBackground: '#f9f9f9',
          textSectionTitleColor: '#333',
          dayTextColor: '#333',
          monthTextColor: '#333',
          textDisabledColor: '#999',
        }}
      />
      <View style={styles.eventList}>
        <Text style={styles.eventHeader}>Events on {selectedDate || 'Select a Date'}</Text>
        {selectedDate && events[selectedDate] ? (
          <FlatList
            data={events[selectedDate]}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <View style={styles.eventItem}>
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventTime}>{item.time}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noEvents}>No events for this day.</Text>
        )}
        <TouchableOpacity style={styles.addButton} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.addButtonText}>Add Event</Text>
        </TouchableOpacity>
      </View>

      {/* Add Event Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Event</Text>
            <TextInput
              style={styles.input}
              placeholder="Event Title"
              value={newEventTitle}
              onChangeText={setNewEventTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Event Time (e.g., 10:00 AM)"
              value={newEventTime}
              onChangeText={setNewEventTime}
            />
            <Button title="Add Event" onPress={handleAddEvent} />
            <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Attendance = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Attendance Section</Text>
    {/* Add Attendance content here */}
  </View>
);

const Timetable = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Timetable Section</Text>
    {/* Add Timetable content here */}
  </View>
);

const Events = ({ events }) => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>All Events</Text>
    <FlatList
      data={Object.entries(events).flatMap(([date, eventList]) =>
        eventList.map((event) => ({
          ...event,
          date,
        }))
      )}
      keyExtractor={(item, index) => `${item.date}-${index}`}
      renderItem={({ item }) => (
        <View style={styles.eventItem}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Text style={styles.eventTime}>
            {item.date} - {item.time}
          </Text>
        </View>
      )}
    />
  </View>
);

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState({
    '2024-12-15': [{ title: 'Math Exam', time: '10:00 AM' }],
    '2024-12-20': [{ title: 'Christmas Party', time: '2:00 PM' }],
  });

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const addEvent = (date, event) => {
    setEvents((prevEvents) => ({
      ...prevEvents,
      [date]: [...(prevEvents[date] || []), event],
    }));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9f9f9' }}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarStyle: { backgroundColor: '#f9f9f9' },
          tabBarIndicatorStyle: { backgroundColor: '#007BFF' },
          tabBarActiveTintColor: '#007BFF',
          tabBarInactiveTintColor: '#666',
        }}
      >
        <Tab.Screen name="Calendar">
          {() => (
            <CalendarView
              events={events}
              selectedDate={selectedDate}
              handleDayPress={handleDayPress}
              addEvent={addEvent}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Attendance" component={Attendance} />
        <Tab.Screen name="Timetable" component={Timetable} />
        <Tab.Screen name="Events">
          {() => <Events events={events} />}
        </Tab.Screen>
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 16,
  },
  sectionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  eventList: {
    flex: 1,
    marginTop: 20,
  },
  eventHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  eventItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
  },
  noEvents: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default CalendarScreen;