import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ImageBackground, } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { StudentContext } from '../context/StudentContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { studentInfo, loadStudentInfo } = useContext(StudentContext);
  const [selectedStudent, setSelectedStudent] = useState(null);


  const events = [
    {
      id: '1',
      title: 'Science Fair 2023',
      date: 'Jun 15 • 9:00 AM',
      location: 'School Auditorium',
      description: 'Annual showcase of student science projects and innovations',
      image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc',
      category: 'Academic',
      registered: true
    },
    {
      id: '2',
      title: 'Sports Day',
      date: 'Jul 5 • 8:00 AM',
      location: 'Main Field',
      description: 'Inter-house competitions and athletic events',
      image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0',
      category: 'Sports',
      registered: true
    },
    {
      id: '3',
      title: 'Art Exhibition',
      date: 'Aug 20 • 2:00 PM',
      location: 'Arts Center',
      description: 'Student artwork display and creative performances',
      image: 'https://images.unsplash.com/photo-1547347298-4074fc3086f0',
      category: 'Arts',
      registered: false
    }
  ];

  // Load studentInfo when the component mounts
  useEffect(() => {
    if (studentInfo?.id) {
      loadStudents();
    }
  }, [studentInfo]);

  // Set the first student as the selected student (for simplicity)
  useEffect(() => {
    if (studentInfo && studentInfo.length > 0) {
      setSelectedStudent(studentInfo[0]);
    }
  }, [studentInfo]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header Section */}
        <Text style={styles.title}>
          Welcome, {selectedStudent?.fullName || 'Student'}
        </Text>

        {/* Student Profile Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={
                selectedStudent?.documents?.passportPhotos?.uri
                  ? { uri: selectedStudent.documents.passportPhotos.uri }
                  : require('../assets/images/fiifi1.jpg')
              }
              style={styles.profileImage}
            />
            <View>
              <Text style={styles.profileName}>
                {selectedStudent?.fullName || 'Loading...'}
              </Text>
              <Text style={styles.profileDetails}>
                Class: {selectedStudent?.classLevel || 'Loading...'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {[
              { title: 'Schedule', icon: 'time-outline', route: 'Schedule' },
              { title: 'Attendance', icon: 'calendar-outline', route: 'Attendance' },
              { title: 'Fees', icon: 'cash-outline', route: 'FeeDetail' },
              { title: 'Homework', icon: 'book-outline', route: 'Homework' },
              { title: 'Grades', icon: 'bar-chart-outline', route: 'Grades' },
              { title: 'Events', icon: 'calendar-outline', route: 'Events' },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.quickActionItem}
                onPress={() => navigation.navigate(item.route)}
              >
                <Icon name={item.icon} size={24} color="#03AC13" />
                <Text style={styles.quickActionText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Events Section */}
        <View style={styles.eventsContainer}>
          {/* Section Header */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            <TouchableOpacity 
              style={styles.viewAllButton}
              onPress={() => navigation.navigate('Events')}
            >
              <Text style={styles.viewAllText}>View All</Text>
              <Icon name="chevron-forward" size={16} color="#4A6FA5" />
            </TouchableOpacity>
          </View>

          {/* Featured Event Card */}
          <TouchableOpacity 
            style={styles.featuredEvent}
            onPress={() => navigation.navigate('EventScreen', { event: events[0] })}
          >
            <ImageBackground
              source={{ uri: events[0].image }}
              style={styles.featuredImage}
              imageStyle={styles.featuredImageStyle}
            >
              <View style={styles.featuredOverlay}>
                {events[0].registered && (
                  <View style={styles.registeredBadge}>
                    <Text style={styles.registeredText}>REGISTERED</Text>
                  </View>
                )}
                <View style={styles.featuredContent}>
                  <Text style={styles.featuredCategory}>{events[0].category}</Text>
                  <Text style={styles.featuredTitle}>{events[0].title}</Text>
                  <View style={styles.featuredMeta}>
                    <View style={styles.metaItem}>
                      <Icon name="calendar" size={14} color="#FFF" />
                      <Text style={styles.metaText}>{events[0].date}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Icon name="location" size={14} color="#FFF" />
                      <Text style={styles.metaText}>{events[0].location}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* Events Grid */}
          <View style={styles.eventsGrid}>
            {events.slice(1).map((event) => (
              <TouchableOpacity
                key={event.id}
                style={styles.eventCard}
                onPress={() => navigation.navigate('EventDetail', { event })}
              >
                <ImageBackground
                  source={{ uri: event.image }}
                  style={styles.eventImage}
                  imageStyle={styles.eventImageStyle}
                >
                  <View style={styles.eventOverlay}>
                    <Text style={styles.eventCategory}>{event.category}</Text>
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventDate}>{event.date}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  scrollContainer: {
    flexDirection: 'column',
    gap: 20,
    padding: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03AC13',
    textAlign: 'left',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03AC13',
  },
  profileDetails: {
    fontSize: 14,
    color: '#777',
  },
  quickActions: {
    gap: 10,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickActionItem: {
    width: '48%',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#03AC1310',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  quickActionText: {
    fontSize: 14,
    color: '#03AC13',
    marginTop: 10,
  },
  notificationsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  notificationItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  notificationText: {
    fontSize: 14,
    color: '#333',
  },
  eventsContainer: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#03AC13',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#4A6FA5',
    fontWeight: '500',
    fontSize: 14,
  },
  featuredEvent: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  featuredImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featuredImageStyle: {
    borderRadius: 12,
  },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    padding: 16,
    justifyContent: 'flex-end',
  },
  featuredContent: {
    marginBottom: 8,
  },
  featuredCategory: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  featuredTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  featuredMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  registeredBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  registeredText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  eventCard: {
    width: '48%',
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
  },
  eventImage: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  eventImageStyle: {
    borderRadius: 8,
  },
  eventOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: 12,
    justifyContent: 'flex-end',
  },
  eventCategory: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  eventTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  eventDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
  },
});

export default HomeScreen;