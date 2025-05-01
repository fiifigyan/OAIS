import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Calendar } from 'react-native-calendars';

const AttendanceDetails = ({ attendanceRecords }) => {
  const [dateRange, setDateRange] = useState('week');
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calendarVisible, setCalendarVisible] = useState(false);

  useEffect(() => {
    let filtered = [...attendanceRecords];

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

    if (selectedDate) {
      filtered = filtered.filter(record => record.date === selectedDate);
    }

    setFilteredRecords(filtered);
  }, [dateRange, selectedDate, attendanceRecords]);

  const calculateStats = () => {
    const total = filteredRecords.length;
    if (total === 0) return null;

    const present = filteredRecords.filter(r => r.status === 'present').length;
    const absent = filteredRecords.filter(r => r.status === 'absent').length;
    const late = filteredRecords.filter(r => r.status === 'late').length;

    return {
      present: Math.round((present / total) * 100),
      absent: Math.round((absent / total) * 100),
      late: Math.round((late / total) * 100),
      totalDays: total
    };
  };

  const stats = calculateStats();

  const renderStatusIndicator = (status) => {
    const statusStyles = {
      present: styles.presentStatus,
      absent: styles.absentStatus,
      late: styles.lateStatus
    };

    return (
      <View style={[styles.statusIndicator, statusStyles[status]]}>
        <Text style={styles.statusText}>{status.toUpperCase()}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterRow}>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={dateRange}
            style={styles.picker}
            onValueChange={(itemValue) => {
              setDateRange(itemValue);
              setSelectedDate(null);
            }}
          >
            <Picker.Item label="This Week" value="week" />
            <Picker.Item label="This Month" value="month" />
            <Picker.Item label="This Term" value="term" />
            <Picker.Item label="This Year" value="year" />
          </Picker>
        </View>

        <TouchableOpacity 
          style={styles.calendarButton}
          onPress={() => setCalendarVisible(!calendarVisible)}
        >
          <Text style={styles.calendarButtonText}>
            {selectedDate ? 'Specific Date' : 'Pick Date'}
          </Text>
        </TouchableOpacity>
      </View>

      {calendarVisible && (
        <View style={styles.calendarContainer}>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setCalendarVisible(false);
            }}
            markedDates={{
              ...(selectedDate && { [selectedDate]: { selected: true } })
            }}
          />
        </View>
      )}

      {selectedDate && (
        <TouchableOpacity
          style={styles.clearDateButton}
          onPress={() => setSelectedDate(null)}
        >
          <Text style={styles.clearDateText}>Clear Date Filter</Text>
        </TouchableOpacity>
      )}

      {stats && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.present}%</Text>
            <Text style={styles.statLabel}>Present</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.absentStat]}>{stats.absent}%</Text>
            <Text style={styles.statLabel}>Absent</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statValue, styles.lateStat]}>{stats.late}%</Text>
            <Text style={styles.statLabel}>Late</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalDays}</Text>
            <Text style={styles.statLabel}>Total Days</Text>
          </View>
        </View>
      )}

      <ScrollView style={styles.recordsContainer}>
        {filteredRecords.length > 0 ? (
          <FlatList
            data={filteredRecords}
            keyExtractor={(item, index) => `${item.date}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.recordItem}>
                <Text style={styles.recordDate}>{item.date}</Text>
                {renderStatusIndicator(item.status)}
                {item.notes && (
                  <Text style={styles.recordNotes}>Notes: {item.notes}</Text>
                )}
              </View>
            )}
          />
        ) : (
          <Text style={styles.noRecordsText}>No attendance records found for the selected filters</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  pickerContainer: {
    flex: 1,
    marginRight: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  calendarButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 12,
    backgroundColor: '#4285f4',
    borderRadius: 8,
  },
  calendarButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  clearDateButton: {
    alignSelf: 'flex-end',
    padding: 8,
    marginBottom: 8,
  },
  clearDateText: {
    color: '#4285f4',
    fontSize: 12,
  },
  calendarContainer: {
    marginBottom: 16,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: 'white',
    elevation: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 2,
  },
  statCard: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
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
    fontSize: 12,
    color: '#5f6368',
    marginTop: 4,
  },
  recordsContainer: {
    flex: 1,
  },
  recordItem: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
    elevation: 1,
  },
  recordDate: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  statusIndicator: {
    alignSelf: 'flex-start',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  presentStatus: {
    backgroundColor: '#e6f4ea',
  },
  absentStatus: {
    backgroundColor: '#fce8e6',
  },
  lateStatus: {
    backgroundColor: '#fef7e0',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  recordNotes: {
    marginTop: 8,
    fontSize: 14,
    color: '#5f6368',
    fontStyle: 'italic',
  },
  noRecordsText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#5f6368',
  },
});

export default AttendanceDetails;