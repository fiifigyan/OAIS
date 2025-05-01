import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  Modal
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();

// Mock data for single child
const mockAttendance = [
  { date: '2024-06-01', status: 'present' },
  { date: '2024-06-02', status: 'absent' },
  { date: '2024-06-03', status: 'present' },
  { date: '2024-06-04', status: 'late' }
];

const mockEvents = {
  '2024-06-15': [{
    id: '1',
    title: 'School Concert',
    time: '6:00 PM',
    requiresRegistration: true,
    registered: false
  }],
  '2024-06-20': [{
    id: '2',
    title: 'Parent-Teacher Meeting',
    time: '2:00 PM',
    requiresRegistration: false
  }]
};

const AttendanceView = () => {
  const [dateRange, setDateRange] = useState('week');
  const [filteredAttendance, setFilteredAttendance] = useState([]);

  useEffect(() => {
    filterAttendance();
  }, [dateRange]);

  const filterAttendance = () => {
    let filtered = [...mockAttendance];

    const now = new Date();
    switch(dateRange) {
      case 'week':
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= new Date(now.setDate(now.getDate() - 7));
        });
        break;
      case 'month':
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= new Date(now.setMonth(now.getMonth() - 1));
        });
        break;
      case 'term':
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= new Date(now.setMonth(now.getMonth() - 3));
        });
        break;
      case 'year':
        filtered = filtered.filter(record => {
          const recordDate = new Date(record.date);
          return recordDate >= new Date(now.setFullYear(now.getFullYear() - 1));
        });
        break;
      default:
        break;
    }

    setFilteredAttendance(filtered);
  };

  const getStats = () => {
    const total = filteredAttendance.length;
    const present = filteredAttendance.filter(a => a.status === 'present').length;
    const absent = filteredAttendance.filter(a => a.status === 'absent').length;
    const late = filteredAttendance.filter(a => a.status === 'late').length;
    
    return {
      presentPercentage: total > 0 ? Math.round((present / total) * 100) : 0,
      absentPercentage: total > 0 ? Math.round((absent / total) * 100) : 0,
      latePercentage: total > 0 ? Math.round((late / total) * 100) : 0
    };
  };

  const stats = getStats();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.filterRow}>
        <Picker
          selectedValue={dateRange}
          style={styles.picker}
          onValueChange={(itemValue) => setDateRange(itemValue)}
        >
          <Picker.Item label="This Week" value="week" />
          <Picker.Item label="This Month" value="month" />
          <Picker.Item label="This Term" value="term" />
          <Picker.Item label="This Year" value="year" />
        </Picker>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{stats.presentPercentage}%</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.absentStat]}>{stats.absentPercentage}%</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.lateStat]}>{stats.latePercentage}%</Text>
          <Text style={styles.statLabel}>Late</Text>
        </View>
      </View>

      <FlatList
        data={filteredAttendance}
        keyExtractor={(item, index) => `${item.date}-${index}`}
        renderItem={({ item }) => (
          <View style={styles.attendanceItem}>
            <Text style={styles.attendanceDate}>{item.date}</Text>
            <Text style={[
              styles.attendanceStatus,
              item.status === 'present' && styles.presentStatus,
              item.status === 'absent' && styles.absentStatus,
              item.status === 'late' && styles.lateStatus
            ]}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const CalendarView = ({ events, selectedDate, handleDayPress }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          ...Object.keys(events).reduce((acc, date) => {
            acc[date] = { marked: true, dotColor: '#FF6B6B' };
            return acc;
          }, {}),
          [selectedDate]: { selected: true }
        }}
      />

      <View style={styles.eventList}>
        <Text style={styles.eventHeader}>Events on {selectedDate || 'Select a Date'}</Text>
        {selectedDate && events[selectedDate] ? (
          <FlatList
            data={events[selectedDate]}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.eventItem}
                onPress={() => setSelectedEvent(item)}
              >
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventTime}>{item.time}</Text>
                {item.requiresRegistration && (
                  <Text style={styles.registrationStatus}>
                    {item.registered ? 'Registered ✓' : 'Click to register'}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          />
        ) : (
          <Text style={styles.noEvents}>No events for this day.</Text>
        )}
      </View>

      <Modal visible={!!selectedEvent} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedEvent?.title}</Text>
            <Text style={styles.eventTime}>{selectedEvent?.time}</Text>
            <Text style={styles.eventDescription}>{selectedEvent?.description || 'No description available'}</Text>
            
            {selectedEvent?.requiresRegistration && (
              <TouchableOpacity
                style={[
                  styles.registrationButton,
                  selectedEvent?.registered && styles.registeredButton
                ]}
                onPress={() => {
                  // Handle registration
                  setSelectedEvent(null);
                }}
              >
                <Text style={styles.registrationButtonText}>
                  {selectedEvent?.registered ? 'Already Registered' : 'Register Now'}
                </Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedEvent(null)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState(mockEvents);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
          tabBarIndicatorStyle: { backgroundColor: '#FF6B6B' },
          tabBarActiveTintColor: '#FF6B6B',
          tabBarInactiveTintColor: '#666',
        }}
      >
        <Tab.Screen name="Timeline">
          {() => (
            <CalendarView
              events={events}
              selectedDate={selectedDate}
              handleDayPress={handleDayPress}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Attendance" component={AttendanceView} />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionContainer: {
    flex: 1,
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  picker: {
    width: '100%',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#34a853',
  },
  absentStat: {
    color: '#ea4335',
  },
  lateStat: {
    color: '#fbbc05',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  eventList: {
    flex: 1,
    marginTop: 20,
  },
  eventHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  eventItem: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 10,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#FF6B6B',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  eventTime: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  registrationStatus: {
    color: '#FF6B6B',
    marginTop: 8,
    fontStyle: 'italic',
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
    width: '90%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  eventDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 16,
  },
  registrationButton: {
    backgroundColor: '#FF6B6B',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  registeredButton: {
    backgroundColor: '#ccc',
  },
  registrationButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 16,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FF6B6B',
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  attendanceDate: {
    fontSize: 14,
  },
  attendanceStatus: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  presentStatus: {
    backgroundColor: '#E6F7E6',
    color: '#34a853',
  },
  absentStatus: {
    backgroundColor: '#FFEBE9',
    color: '#ea4335',
  },
  lateStatus: {
    backgroundColor: '#FFF4E5',
    color: '#fbbc05',
  },
});

export default CalendarScreen;