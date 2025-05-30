import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useHome } from '../../context/HomeContext';
import { useProfile } from '../../context/ProfileContext';

const HomeScreen = () => {
  const navigation = useNavigation();
  const { homeData, events, loading, error, refreshHomeData } = useHome();
  const { selectedStudent } = useProfile();
  
  const quickActions = [
    { title: 'Fees', icon: 'cash-outline', route: 'FeeDetail' },
    { title: 'Attendance', icon: 'checkmark-circle-outline', route: 'Attendance' },
    { title: 'Grades', icon: 'bar-chart-outline', route: 'Grades' },
    { title: 'Reports', icon: 'document-text-outline', route: 'Reports' },
    { title: 'Chats', icon: 'chatbubbles-outline', route: 'Chats' },
    { title: 'Events', icon: 'calendar-outline', route: 'Events' },
  ];

  if (loading && !homeData) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00873E" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={50} color="red" />
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
          {selectedStudent?.fullName || 'Student Dashboard'}
        </Text>

        <View style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <Image
              source={homeData?.passportPicture 
                ? { uri: homeData.passportPicture } 
                : require('../../assets/images/default-profile.png')}
              style={styles.profileImage}
            />
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{selectedStudent?.fullName || 'Loading...'}</Text>
              <Text style={styles.profileGrade}>Grade: {homeData?.grade || 'N/A'}</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusBadge}>
                  <Ionicons name="checkmark-circle-outline" size={16} color="#4CAF50" />
                  <Text style={styles.statusText}>{homeData?.attendanceStatus || 'N/A'}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Ionicons name="wallet-outline" size={16} color="#4CAF50" />
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
                <Ionicons name={item.icon} size={24} color="#00873E" />
                <Text style={styles.quickActionText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Events Section */}
        {events.length > 0 && (
          <View style={styles.eventsContainer}>
            <Text style={styles.sectionTitle}>Upcoming Events</Text>
            {events.slice(0, 3).map((event, index) => (
              <TouchableOpacity
                key={index}
                style={styles.eventCard}
                onPress={() => navigation.navigate('EventDetail', { event })}
              >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventDate}>{event.date}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
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
    color: 'red',
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#00873E',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: 'aliceblue',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#00873E',
    marginBottom: 16,
  },
  profileCard: {
    backgroundColor: 'aliceblue',
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
    borderColor: '#00873E',
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
    backgroundColor: 'aliceblue',
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
    color: '#00873E',
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
    color: '#00873E',
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