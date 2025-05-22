import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, SafeAreaView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useProfile } from '../../context/ProfileContext';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const studentId = route.params?.studentId;
  const { getStudentById, loading, error, parentInfo } = useProfile();
  
  const [studentInfo, setStudentInfo] = useState(null);
  const [activeTab, setActiveTab] = useState('Info');

  // if (!studentId) {
  //   return (
  //     <SafeAreaView style={styles.errorContainer}>
  //         <Icon name="alert-circle-outline" size={48} color="#0B6623" />
  //       <Text style={styles.errorText}>Student ID not provided</Text>
  //       <TouchableOpacity 
  //         style={styles.retryButton}
  //         onPress={() => navigation.goBack()}
  //       >
  //         <Text style={styles.retryButtonText}>Go Back</Text>
  //       </TouchableOpacity>
  //     </SafeAreaView>
  //   );
  // }

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const data = await getStudenById(studentId);
        setStudentInfo(data);
      } catch (err) {
        Alert.alert('Error', 'Failed to load student profile');
      }
    };

    loadStudentData();
  }, [studentId]);

  const renderInfoTab = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Student Information</Text>
      <InfoItem label="Student ID" value={studentInfo?.studentId} />
      <InfoItem label="Full Name" value={studentInfo?.fullName} />
      <InfoItem label="Date of Birth" value={studentInfo?.dateOfBirth} />
      <InfoItem label="Gender" value={studentInfo?.gender} />
      <InfoItem label="Class" value={studentInfo?.className} />
      <InfoItem label="Address" value={studentInfo?.address} />
      <InfoItem label="Parent Name" value={parentInfo?.fullName} />
    </View>
  );

  const renderParentTab = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Parent/Guardian Information</Text>
      <InfoItem label="Parent Name" value={parentInfo?.fullName} />
      <InfoItem label="Relationship" value={parentInfo?.relationship} />
      <InfoItem label="Address" value={parentInfo?.address} />
      <InfoItem label="Phone" value={parentInfo?.phoneNumber} />
      <InfoItem label="Email" value={parentInfo?.email} />
      <InfoItem label="Occupation" value={parentInfo?.occupation} />
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Info':
        return renderInfoTab();
      case 'Parent':
        return renderParentTab();
      default:
        return null;
    }
  };

  if (loading && !studentInfo) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5E7CE2" />
      </SafeAreaView>
    );
  }

  // if (error || !studentInfo) {
  //   return (
  //     <SafeAreaView style={styles.errorContainer}>
  //       <Icon name="alert-circle-outline" size={48} color="#0B6623" />
  //       <Text style={styles.errorText}>
  //         {error || 'Failed to load student profile'}
  //       </Text>
  //       <TouchableOpacity 
  //         style={styles.retryButton}
  //         onPress={() => navigation.goBack()}
  //       >
  //         <Text style={styles.retryButtonText}>Go Back</Text>
  //       </TouchableOpacity>
  //     </SafeAreaView>
  //   );
  // }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Student Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={
              studentInfo?.profileImagePath 
                ? { uri: studentInfo.profileImagePath } 
                : require('../../assets/images/default-profile.png')
            }
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {studentInfo?.fullName || 'Student'}
            </Text>
            <Text style={styles.profileClass}>
              {studentInfo?.className || 'Class'}
            </Text>
            <Text style={styles.profileId}>
              {studentInfo?.studentId || 'Student ID'}
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Info' && styles.activeTab]}
            onPress={() => setActiveTab('Info')}
          >
            <Text style={styles.tabText}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Parent' && styles.activeTab]}
            onPress={() => setActiveTab('Parent')}
          >
            <Text style={styles.tabText}>Parent</Text>
          </TouchableOpacity>
        </View>

        {renderTabContent()}
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
    backgroundColor: '#f9fbff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fbff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fbff',
    padding: 20,
  },
  errorText: {
    color: '#0B6623',
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#0B6623',
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
    backgroundColor: 'aliceblue',
    borderRadius: 12,
    margin: 16,
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
    borderColor: '#0B6623',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B6623',
    marginBottom: 4,
  },
  profileClass: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: '#666',
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#0B6623',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0B6623',
  },
  section: {
    backgroundColor: 'aliceblue',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
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
    color: '#0B6623',
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
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
});

export default ProfileScreen;