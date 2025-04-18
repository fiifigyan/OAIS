import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ImageBackground, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useHome } from '../context/HomeContext';
import { useStudent } from '../context/StudentContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { homeData, events, loading, error, refreshHomeData } = useHome();
  const { studentInfo } = useStudent();

  if (!studentInfo) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#03AC13" />
      </SafeAreaView>
    );
  }

  const quickActions = [
    { title: 'Schedule', icon: 'time-outline', route: 'Schedule' },
    { title: 'Attendance', icon: 'calendar-outline', route: 'Attendance' },
    { title: 'Fees', icon: 'cash-outline', route: 'FeeDetail' },
    { title: 'Homework', icon: 'book-outline', route: 'Homework' },
    { title: 'Grades', icon: 'bar-chart-outline', route: 'Grades' },
    { title: 'Events', icon: 'calendar-outline', route: 'Events' },
  ];

  if (loading && !homeData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#03AC13" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={refreshHomeData}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>
          Welcome, {homeData?.fullName || 'Student'}
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={homeData?.passportPicture 
                ? { uri: homeData.passportPicture } 
                : require('../assets/images/fiifi1.jpg')}
              style={styles.profileImage}
            />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{homeData?.fullName || 'Loading...'}</Text>
              <Text style={styles.profileGrade}>Grade: {homeData?.grade || 'N/A'}</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusBadge}>
                  <Icon name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.statusText}>{homeData?.attendanceStatus || 'N/A'}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Icon name="wallet" size={16} color="#4CAF50" />
                  <Text style={styles.statusText}>{homeData?.feePaymentStatus || 'N/A'}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((item, index) => (
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
        {events.length > 0 && (
          <View style={styles.eventsContainer}>
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

            {/* Featured Event */}
            <TouchableOpacity 
              style={styles.featuredEvent}
              onPress={() => navigation.navigate('EventDetail', { event: events[0] })}
            >
              <ImageBackground
                source={{ uri: events[0].image }}
                style={styles.featuredImage}
                imageStyle={styles.featuredImageStyle}
              >
                <View style={styles.featuredOverlay}>
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
              </ImageBackground>
            </TouchableOpacity>

            {/* Events Grid */}
            <View style={styles.eventsGrid}>
              {events.slice(1, 3).map((event) => (
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
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
  },
  scrollContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#03AC13',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#03AC13',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#03AC13',
  },
  profileText: {
    marginLeft: 16,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  profileGrade: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#2e7d32',
    marginLeft: 4,
  },
  quickActions: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#03AC13',
    marginBottom: 12,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionItem: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#03AC13',
    marginTop: 8,
    textAlign: 'center',
  },
  eventsContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#4A6FA5',
    fontSize: 14,
    fontWeight: '500',
  },
  featuredEvent: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
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
  featuredCategory: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  featuredTitle: {
    color: '#FFF',
    fontSize: 18,
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
  eventsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  eventCard: {
    width: '48%',
    height: 150,
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