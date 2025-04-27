import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator,Alert,TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import StudentService from '../services/StudentService';
import { useNavigation } from '@react-navigation/native';

const StudentProfile = ({ route }) => {
  const navigation = useNavigation();
  const { studentId } = route?.params || {};
  
  const [studentData, setStudentData] = useState(null);
  const [academicData, setAcademicData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isEditing, setIsEditing] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [uploading, setUploading] = useState(false);

  const fetchStudentData = async () => {
    if (!studentId) {
      setError('No student ID provided');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const [profile, academic] = await Promise.all([
        StudentService.getStudentProfile(studentId),
        StudentService.getAcademicInfo(studentId)
      ]);
      
      setStudentData(profile);
      setAcademicData(academic);
      setEditedData(profile);
      
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

  if (!studentId) {
    return (
      <SafeAreaView style={[styles.loadingContainer, { justifyContent: 'center' }]}>
        <Icon name="warning-outline" size={50} color="#FFA000" style={{ marginBottom: 20 }} />
        <Text style={[styles.errorText, { textAlign: 'center', marginBottom: 30 }]}>
          No student profile was selected
        </Text>
        <TouchableOpacity 
          style={[styles.retryButton, { flexDirection: 'row', alignItems: 'center' }]}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Home');
            }
          }}
        >
          <Icon name="arrow-back" size={20} color="aliceblue" style={{ marginRight: 10 }} />
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Please enable media library access to upload images');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setTempImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Image picker error:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const handleSaveProfile = async () => {
    try {
      setUploading(true);
      await StudentService.updateStudentProfile(studentId, editedData);
      
      if (tempImage) {
        await StudentService.uploadProfilePicture(studentId, tempImage);
      }
      
      await fetchStudentData();
      setIsEditing(false);
      setTempImage(null);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUploading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const renderEditableField = (label, field, value) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.editableField}
          value={editedData[field] || ''}
          onChangeText={(text) => handleFieldChange(field, text)}
        />
      ) : (
        <Text style={styles.infoValue}>{value || 'N/A'}</Text>
      )}
    </View>
  );

  const renderOverviewTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Student Information</Text>
        {renderEditableField("Full Name", "fullName", studentData?.fullName)}
        <InfoItem label="Student ID" value={studentData?.studentId} />
        {renderEditableField("Gender", "gender", studentData?.gender)}
        {renderEditableField("Date of Birth", "dateOfBirth", studentData?.dateOfBirth)}
        {renderEditableField("Class", "className", studentData?.className)}
        {renderEditableField("Address", "Address", studentData?.Address)}
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
        <Icon name="warning-outline" size={50} color="#FFA000" style={{ marginBottom: 20 }} />
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
          <TouchableOpacity onPress={isEditing ? handleImageUpload : null}>
            <Image
              source={
                tempImage || studentData?.profileImagePath 
                  ? { uri: tempImage || studentData.profileImagePath } 
                  : require('../assets/images/default-profile.png')
              }
              style={styles.profileImage}
            />
            {isEditing && (
              <View style={styles.editIcon}>
                <Icon name="camera" size={20} color="aliceblue" />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{studentData?.fullName}</Text>
            <Text style={styles.studentId}>ID: {studentData?.studentId}</Text>
            <Text style={styles.profileClass}>{studentData?.className}</Text>
          </View>
        </View>

        <View style={styles.actionButtons}>
          {isEditing ? (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveProfile}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator color="aliceblue" />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  setTempImage(null);
                }}
                disabled={uploading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.editButton]}
              onPress={() => setIsEditing(true)}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
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
    backgroundColor: 'aliceblue',
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
    color: 'aliceblue',
    fontWeight: '600',
  },
  profileHeader: {
    flexDirection: 'row',
    padding: 20,
    backgroundColor: 'aliceblue',
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
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#03AC13',
    borderRadius: 12,
    padding: 4,
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
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
    minWidth: 100,
  },
  editButton: {
    backgroundColor: '#03AC13',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'aliceblue',
    fontWeight: '600',
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
    backgroundColor: 'aliceblue',
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
  editableField: {
    fontSize: 15,
    color: '#222',
    borderBottomWidth: 1,
    borderBottomColor: '#03AC13',
    paddingVertical: 4,
    minWidth: 150,
    textAlign: 'right',
  },
});

export default StudentProfile;