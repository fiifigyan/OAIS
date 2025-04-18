import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import StudentService from '../services/StudentService';
import { useStudent } from '../context/StudentContext';

const StudentProfile = ({ route }) => {
  const { studentId } = route.params;
  const [studentData, setStudentData] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch profile data using StudentService
      const profile = await StudentService.getStudentProfile(studentId);
      setStudentData(profile);
      
      // Fetch academic data using StudentService
      const academic = await StudentService.getAcademicInfo(studentId);
      setAcademicData(academic);
      
    } catch (error) {
      console.error('Error fetching student data:', error);
      setError(error.message || 'Failed to load student data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentData();
  }, [studentId]);

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Information</Text>
        <InfoItem label="Full Name" value={studentData?.fullName} />
        <InfoItem label="Student ID" value={studentData?.studentId} />
        <InfoItem label="Gender" value={studentData?.gender} />
        <InfoItem label="Date of Birth" value={studentData?.dateOfBirth} />
        <InfoItem label="Class" value={studentData?.className} />
        <InfoItem label="Address" value={studentData?.Address} />
      </View>
    </View>
  );

  const renderAcademicTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Information</Text>
        <InfoItem label="Current Class" value={studentData?.className} />
        <InfoItem label="Academic Year" value={academicData?.academicYear || '2023-2024'} />
        <InfoItem label="Attendance" value={academicData?.attendance || 'N/A'} />
        <InfoItem label="Overall Grade" value={academicData?.overallGrade || 'N/A'} />
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#03AC13" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchStudentData}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <Image
            source={studentData?.profileImagePath 
              ? { uri: studentData.profileImagePath } 
              : require('../assets/images/fiifi1.jpg')}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{studentData?.fullName}</Text>
            <Text style={styles.studentId}>ID: {studentData?.studentId}</Text>
            <Text style={styles.profileClass}>{studentData?.className}</Text>
          </View>
        </View>

        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Overview' && styles.activeTab]}
            onPress={() => setActiveTab('Overview')}
          >
            <Text style={styles.tabText}>Overview</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Academic' && styles.activeTab]}
            onPress={() => setActiveTab('Academic')}
          >
            <Text style={styles.tabText}>Academic</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'Overview' ? renderOverviewTab() : renderAcademicTab()}
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value || 'N/A'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9ff',
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
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: '#03AC13',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03AC13',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  profileClass: {
    fontSize: 16,
    color: '#555',
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    marginHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#03AC13',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#555',
  },
  tabContent: {
    padding: 16,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#03AC13',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 15,
    color: '#555',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
});

export default StudentProfile;