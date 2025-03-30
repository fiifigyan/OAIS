import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { useStudent } from '../context/StudentContext';

const StudentProfile = ({ route }) => {
  const { getStudentProfile } = useStudent();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');

  const studentId = route?.params?.studentId;

  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const profile = await getStudentProfile(studentId);
        setStudentData(profile);
      } catch (error) {
        console.error('Error fetching student profile:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, [studentId, getStudentProfile]);

  const tabs = ['Overview', 'Subjects', 'Activities', 'Calendar'];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Overview':
        return <OverviewTab student={studentData} />;
      case 'Subjects':
      case 'Activities':
      case 'Calendar':
        return <PlaceholderContent title={activeTab} />;
      default:
        return null;
    }
  };

  if (loading && !studentData) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color="#000080" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => {
          setError(null);
          setLoading(true);
        }}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <Image
            source={studentData?.profileImage 
              ? { uri: studentData.profileImage } 
              : require('../assets/images/fiifi1.jpg')}
            style={styles.profilePhoto}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{studentData?.fullName || 'Unknown Student'}</Text>
            <Text style={styles.studentId}>Student ID: {studentData?.id || 'N/A'}</Text>
            <Text style={styles.profileGrade}>{studentData?.classLevel || 'N/A'}</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>{studentData?.status || 'N/A'}</Text>
            </View>
          </View>
        </View>

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

        {studentData && renderTabContent()}
      </ScrollView>
    </SafeAreaView>
  );
};

const OverviewTab = ({ student }) => (
  <View style={styles.tabContent}>
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Student Information</Text>
      <InfoItem label="Full Name" value={student?.fullName || 'N/A'} />
      <InfoItem label="Grade" value={student?.classLevel || 'N/A'} />
      <InfoItem label="School Year" value={student?.schoolYear || 'N/A'} />
      <InfoItem label="Date Registered" value={student?.dateRegistered || 'N/A'} />
      <InfoItem label="Address" value={student?.address || 'N/A'} />
    </View>

    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Parent/Guardian</Text>
      <InfoItem label="Name" value={student?.parentName || 'N/A'} />
      <InfoItem label="Email" value={student?.parentEmail || 'N/A'} />
      <InfoItem label="Phone" value={student?.parentPhone || 'N/A'} />
      <InfoItem label="Occupation" value={student?.parentOccupation || 'N/A'} />
      <InfoItem label="Relationship" value={student?.relationship || 'N/A'} />
    </View>
  </View>
);

const InfoItem = ({ label, value }) => (
  <View style={styles.infoItem}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const PlaceholderContent = ({ title }) => (
  <View style={styles.placeholderContainer}>
    <Text style={styles.placeholderText}>{title} content goes here</Text>
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
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#000080',
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000080',
    marginBottom: 4,
  },
  studentId: {
    fontSize: 14,
    color: '#000080',
    marginBottom: 4,
  },
  profileGrade: {
    fontSize: 16,
    color: '#000080',
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: '#FFF4E3',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  statusText: {
    color: '#FF9966',
    fontWeight: '600',
    fontSize: 12,
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
    width: 120,
    fontWeight: '600',
    color: '#777',
  },
  infoValue: {
    flex: 1,
    color: '#333',
  },
  placeholderContainer: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    margin: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  placeholderText: {
    fontSize: 16,
    color: '#777',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#777',
  },
  retryText: {
    fontSize: 16,
    color: '#000080',
    textAlign: 'center',
    marginTop: 20,
  },
  retryButton: {
    backgroundColor: '#5E7CE2',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 20,
    marginTop: 20,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});

export default StudentProfile;