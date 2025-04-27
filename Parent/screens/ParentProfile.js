import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity,SafeAreaView,ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useParent } from '../context/ParentContext';
import { useStudent } from '../context/StudentContext';

const ParentProfile = () => {
  const navigation = useNavigation();
  const { parentInfo, loading, error, refreshProfile } = useParent();
  const { studentInfo, loading: studentsLoading } = useStudent();
  const [activeTab, setActiveTab] = useState('Profile');

  useEffect(() => {
    refreshProfile(parentInfo?.id); // Replace with actual parent ID from auth
  }, []);

  const tabs = ['Profile', 'Students', 'Settings'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return <ProfileTab parentInfo={parentInfo} />;
      case 'Students':
        return <StudentsTab 
                studentInfo={studentInfo} 
                loading={studentsLoading} 
                navigation={navigation} 
               />;
      case 'Settings':
        return <SettingsTab />;
      default:
        return null;
    }
  };

  if (loading && !parentInfo) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="small" color="#03AC13" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => refreshProfile(parentInfo?.id)}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={parentInfo?.profileImage 
              ? { uri: parentInfo.profileImage } 
              : require('../assets/images/fiifi1.jpg')}
            style={styles.profilePhoto}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {[parentInfo?.firstName, parentInfo?.lastName].filter(Boolean).join(' ') || 'N/A'}
            </Text>
            <Text style={styles.profileRole}>{parentInfo?.relationship || 'Parent/Guardian'}</Text>
          </View>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Icon name="pencil" size={20} color="#000080" />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {tabs.map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === tab ? styles.activeTab : null]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab ? styles.activeTabText : null]}>
                  {tab}
                </Text>
                {activeTab === tab && <View style={styles.activeTabIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

// Tab Components
const ProfileTab = ({ parentInfo }) => (
  <View style={styles.tabContent}>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Personal Information</Text>
      <InfoItem label="Email" value={parentInfo?.email || 'N/A'} />
      <InfoItem label="Phone" value={parentInfo?.phoneNumber || 'N/A'} />
      <InfoItem label="Address" value={parentInfo?.address || 'N/A'} />
      <InfoItem label="Occupation" value={parentInfo?.occupation || 'N/A'} />
    </View>
  </View>
);

const StudentsTab = ({ studentInfo, loading, navigation }) => (
  <View style={styles.tabContent}>
    {loading ? (
      <ActivityIndicator size="large" color="#000080" />
    ) : studentInfo?.length > 0 ? (
      <View style={styles.studentsContainer}>
        {studentInfo.map((student, index) => (
          <TouchableOpacity
            key={index}
            style={styles.studentCard}
            onPress={() => navigation.navigate('StudentProfile', { studentId: student.id })}
          >
            <Image
              source={student.profileImage 
                ? { uri: student.profileImage } 
                : require('../assets/images/fiifi1.jpg')}
              style={styles.studentImage}
            />
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>{student.fullName || 'Student'}</Text>
              <Text style={styles.studentClass}>{student.classLevel || 'Class'}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ) : (
      <View style={styles.noStudents}>
        <Icon name="alert-circle-outline" size={40} color="#000080" />
        <Text style={styles.noStudentsText}>No students linked to your account</Text>
      </View>
    )}
    <TouchableOpacity
      style={styles.addStudentButton}
      onPress={() => navigation.navigate('AddAccount')}
    >
      <Text style={styles.addStudentButtonText}>Add Student</Text>
    </TouchableOpacity>
  </View>
);

const SettingsTab = () => (
  <View style={styles.tabContent}>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Account Settings</Text>
      <Text style={styles.settingsText}>Change Password</Text>
      <Text style={styles.settingsText}>Notification Preferences</Text>
      <Text style={styles.settingsText}>Privacy Settings</Text>
    </View>
  </View>
);

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fbff',
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'aliceblue',
    borderRadius: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  profilePhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#000080',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#000080',
  },
  editButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  tabsContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000080',
  },
  activeTab: {
    borderBottomColor: '#5E7CE2',
  },
  activeTabText: {
    color: '#5E7CE2',
  },
  activeTabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#5E7CE2',
  },
  tabContent: {
    padding: 16,
  },
  section: {
    backgroundColor: 'aliceblue',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    color: '#000080',
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: 100,
    fontWeight: '600',
    color: '#777',
  },
  infoValue: {
    flex: 1,
    color: '#333',
  },
  studentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  studentCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  studentImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#000080',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  studentClass: {
    fontSize: 12,
    color: '#666',
  },
  noStudents: {
    alignItems: 'center',
    padding: 20,
  },
  noStudentsText: {
    fontSize: 16,
    color: '#777',
    marginTop: 10,
    textAlign: 'center',
  },
  addStudentButton: {
    backgroundColor: '#000080',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  addStudentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  settingsText: {
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  retryText: {
    fontSize: 16,
    color: '#03AC13',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: 'bold',
  },
});

export default ParentProfile;