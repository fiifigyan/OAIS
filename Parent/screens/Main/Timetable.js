import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { CalendarService } from '../../services/CalendarService';

const TimetableScreen = () => {
  const [timetableData, setTimetableData] = useState({});
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const days = [
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
  ];

  const loadTimetable = async () => {
    try {
      setLoading(true);
      const data = await CalendarService.fetchTimetable();
      setTimetableData(data);
    } catch (error) {
      console.error('Error loading timetable:', error);
      setTimetableData({});
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTimetable();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadTimetable();
  };

  const handleDayChange = (dayId) => {
    setCurrentDay(dayId);
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00873E" />
      </SafeAreaView>
    );
  }

  const currentDayData = timetableData[days[currentDay-1]?.name] || null;

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <Text style={styles.headerText}>Class Timetable</Text>
        <TouchableOpacity onPress={handleRefresh}>
          <Icon name="refresh" size={24} color="#00873E" />
        </TouchableOpacity>
      </View> */}

      <ScrollView 
        horizontal 
        contentContainerStyle={styles.daySelector}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#00873E']}
            tintColor="#00873E"
          />
        }
      >
        {days.map(day => (
          <TouchableOpacity
            key={day.id}
            onPress={() => handleDayChange(day.id)}
          >
            <LinearGradient
              colors={currentDay === day.id ? ['#00873E', '#4CAF50'] : ['#ffffff', '#f5f5f5']}
              style={[styles.dayTab, currentDay === day.id && styles.activeDayTab]}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
            >
              <Text style={[styles.dayText, currentDay === day.id && styles.activeDayText]}>
                {day.name}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        contentContainerStyle={styles.content}

      >
        {currentDayData?.classes ? (
          currentDayData.classes.map((classItem, index) => (
            <View key={index} style={styles.classCard}>
              <View style={styles.classTimeContainer}>
                <Text style={styles.classTime}>{classItem.time}</Text>
              </View>
              <View style={styles.classDetails}>
                <Text style={styles.classSubject}>{classItem.subject}</Text>
                <View style={styles.classMeta}>
                  <Icon name="person" size={14} color="#666" />
                  <Text style={styles.classTeacher}>{classItem.teacher}</Text>
                  <Icon name="room" size={14} color="#666" style={styles.roomIcon} />
                  <Text style={styles.classRoom}>{classItem.room}</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Icon name="event-busy" size={48} color="#cccccc" />
            <Text style={styles.emptyText}>No classes scheduled</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00873E',
  },
  daySelector: {
    padding: 5,
    height: 50,
    width: '100%',
    gap: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayTab: {
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeDayTab: {
    shadowColor: '#00873E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  dayText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
  },
  activeDayText: {
    color: '#ffffff',
  },
  content: {
    padding: 15,
  },
  classCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  classTimeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  classTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00873E',
  },
  classDetails: {
    flex: 1,
  },
  classSubject: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  classMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  classTeacher: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    marginRight: 12,
  },
  roomIcon: {
    marginLeft: 8,
  },
  classRoom: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default TimetableScreen;