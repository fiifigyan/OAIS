import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList,
  ActivityIndicator,
  RefreshControl, ScrollView
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useFocusEffect } from '@react-navigation/native';
import { CalendarService } from '../../services/CalendarService';

const AttendanceScreen = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0 });

  const loadData = async () => {
    try {
      const data = await CalendarService.fetchAttendanceData();
      setAttendanceData(data.markedDates || {});
      setStats(data.stats || { present: 0, absent: 0, late: 0 });
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
      return () => {};
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const renderStatusBadge = (status) => {
    const colors = {
      present: ['#4CAF50', '#81C784'],
      absent: ['#F44336', '#E57373'],
      late: ['#FFC107', '#FFD54F']
    };
    
    return (
      <LinearGradient 
        colors={colors[status]} 
        style={styles.statusBadge}
        start={{x: 0, y: 0}} 
        end={{x: 1, y: 0}}
      >
        <Text style={styles.statusText}>{status.toUpperCase()}</Text>
      </LinearGradient>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00873E" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Attendance Tracker</Text>
        <Icon name="refresh" size={24} color="#00873E" />
      </View>

      <View style={styles.statsContainer}>
        {Object.entries(stats).map(([key, value]) => (
          <LinearGradient
            key={key}
            colors={['#ffffff', '#f5f5f5']}
            style={styles.statCard}
            start={{x: 0, y: 0}}
            end={{x: 1, y: 0}}
          >
            <Text style={[styles.statValue, styles[`${key}Stat`]]}>{value}</Text>
            <Text style={styles.statLabel}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          </LinearGradient>
        ))}
      </View>
      <ScrollView>
        <View style={styles.calendarContainer}>
          <Calendar
            current={currentMonth}
            onDayPress={handleDayPress}
            onMonthChange={(month) => setCurrentMonth(month.dateString)}
            markedDates={{
              ...attendanceData,
              [selectedDate]: {
                selected: true,
                selectedColor: '#00873E',
                marked: attendanceData[selectedDate]?.marked,
                dotColor: 'white'
              }
            }}
            theme={{
              calendarBackground: '#ffffff',
              selectedDayBackgroundColor: '#00873E',
              selectedDayTextColor: '#ffffff',
              todayTextColor: '#00873E',
              dayTextColor: '#2d4150',
              textDisabledColor: '#d9e1e8',
              dotColor: '#00873E',
              selectedDotColor: '#ffffff',
              arrowColor: '#00873E',
              monthTextColor: '#00873E',
              textMonthFontWeight: 'bold',
              textMonthFontSize: 16,
              textDayHeaderFontWeight: 'bold'
            }}
          />
        </View>

        <FlatList
          data={selectedDate ? [selectedDate] : []}
          keyExtractor={(item) => item}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#00873E']}
              tintColor="#00873E"
            />
          }
          renderItem={({ item }) => (
            <View style={styles.dateDetails}>
              <View style={styles.dateHeader}>
                <Text style={styles.dateText}>{item}</Text>
                {attendanceData[item] && renderStatusBadge(
                  attendanceData[item].dotColor === '#4CAF50' ? 'present' : 
                  attendanceData[item].dotColor === '#F44336' ? 'absent' : 'late'
                )}
              </View>
              <Text style={styles.detailText}>
                {attendanceData[item]?.notes || 'No additional notes'}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="event-note" size={48} color="#cccccc" />
              <Text style={styles.emptyText}>Select a date to view details</Text>
            </View>
          }
        />
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
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  presentStat: {
    color: '#4CAF50',
  },
  absentStat: {
    color: '#F44336',
  },
  lateStat: {
    color: '#FFC107',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  calendarContainer: {
    margin: 15,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  dateDetails: {
    backgroundColor: '#ffffff',
    margin: 15,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  detailText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
  },
});

export default AttendanceScreen;