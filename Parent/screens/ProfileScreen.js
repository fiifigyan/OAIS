import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity, 
  SafeAreaView, 
  ActivityIndicator,
  TextInput
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useProfile } from '../context/ProfileContext';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { 
    profileInfo, 
    academicInfo, 
    students, 
    userType, 
    loading, 
    error, 
    loadProfile, 
    updateProfile, 
    uploadProfileImage,
    loadStudents
  } = useProfile();
  
  const { userId, type } = route.params || {};
  const [activeTab, setActiveTab] = useState('Profile');
  const [isEditing, setIsEditing] = useState(false);
  const [tempImage, setTempImage] = useState(null);
  const [editedData, setEditedData] = useState({});

  useEffect(() => {
    if (userId && type) {
      loadProfile(userId, type);
      if (type === 'parent') {
        loadStudents(userId);
      }
    }
  }, [userId, type]);

  const handleImageUpload = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission required', 'Please enable media library access to upload images');
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
      alert('Error', 'Failed to select image');
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (tempImage) {
        await uploadProfileImage(userId, tempImage);
      }
      await updateProfile(userId, editedData);
      setIsEditing(false);
      setTempImage(null);
    } catch (error) {
      alert('Error', 'Failed to update profile');
    }
  };

  const handleFieldChange = (field, value) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };

  const renderEditableField = (label, field, value) => (
    <View style={styles.infoItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={styles.editableField}
          value={editedData[field] || value || ''}
          onChangeText={(text) => handleFieldChange(field, text)}
        />
      ) : (
        <Text style={styles.infoValue}>{value || 'N/A'}</Text>
      )}
    </View>
  );

  const renderProfileTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        {renderEditableField("Full Name", "fullName", profileInfo?.fullName || 
          `${profileInfo?.firstName} ${profileInfo?.lastName}`)}
        
        {userType === 'student' ? (
          <>
            {renderEditableField("Student ID", "studentId", profileInfo?.studentId)}
            {renderEditableField("Class", "className", profileInfo?.className)}
          </>
        ) : (
          renderEditableField("Relationship", "relationship", profileInfo?.relationship)
        )}
        
        {renderEditableField("Email", "email", profileInfo?.email)}
        {renderEditableField("Phone", "phoneNumber", profileInfo?.phoneNumber)}
        {renderEditableField("Address", "address", profileInfo?.address || profileInfo?.Address)}
        
        {userType === 'parent' && 
          renderEditableField("Occupation", "occupation", profileInfo?.occupation)}
      </View>
    </View>
  );

  const renderAcademicTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Academic Information</Text>
        <InfoItem label="Current Class" value={profileInfo?.className} />
        <InfoItem label="Academic Year" value={academicInfo?.academicYear || '2023-2024'} />
        <InfoItem label="Attendance" value={academicInfo?.attendance || 'N/A'} />
        <InfoItem label="Overall Grade" value={academicInfo?.overallGrade || 'N/A'} />
      </View>
    </View>
  );

  const renderStudentsTab = () => (
    <View style={styles.tabContent}>
      {loading ? (
        <ActivityIndicator size="large" color="#5E7CE2" />
      ) : students?.length > 0 ? (
        <View style={styles.studentsContainer}>
          {students.map((student, index) => (
            <TouchableOpacity
              key={index}
              style={styles.studentCard}
              onPress={() => navigation.navigate('Profile', { 
                userId: student.id, 
                type: 'student' 
              })}
            >
              <Image
                source={student.profileImagePath 
                  ? { uri: student.profileImagePath } 
                  : require('../assets/images/default-profile.png')}
                style={styles.studentImage}
              />
              <View style={styles.studentInfo}>
                <Text style={styles.studentName}>{student.fullName || 'Student'}</Text>
                <Text style={styles.studentClass}>{student.className || 'Class'}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.noStudents}>
          <Icon name="alert-circle-outline" size={40} color="#5E7CE2" />
          <Text style={styles.noStudentsText}>No students linked to your account</Text>
        </View>
      )}
    </View>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Profile':
        return renderProfileTab();
      case 'Academic':
        return userType === 'student' ? renderAcademicTab() : renderStudentsTab();
      default:
        return null;
    }
  };

  if (!userId || !type) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Icon name="warning-outline" size={50} color="#FFA000" />
        <Text style={styles.errorText}>No profile was selected</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  if (loading && !profileInfo) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="small" color="#5E7CE2" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Icon name="warning-outline" size={50} color="#FFA000" />
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => loadProfile(userId, type)}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity onPress={isEditing ? handleImageUpload : null}>
            <Image
              source={
                tempImage || profileInfo?.profileImagePath 
                  ? { uri: tempImage || profileInfo.profileImagePath } 
                  : require('../assets/images/default-profile.png')
              }
              style={styles.profileImage}
            />
            {isEditing && (
              <View style={styles.editIcon}>
                <Icon name="camera" size={20} color="white" />
              </View>
            )}
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {profileInfo?.fullName || `${profileInfo?.firstName} ${profileInfo?.lastName}`}
            </Text>
            <Text style={styles.profileRole}>
              {userType === 'parent' 
                ? profileInfo?.relationship || 'Parent/Guardian' 
                : profileInfo?.className || 'Student'}
            </Text>
            {userType === 'student' && (
              <Text style={styles.profileId}>ID: {profileInfo?.studentId}</Text>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {isEditing ? (
            <>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]}
                onPress={handleSaveProfile}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.buttonText}>Save</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setIsEditing(false);
                  setTempImage(null);
                  setEditedData({});
                }}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity 
              style={[styles.button, styles.editButton]}
              onPress={() => {
                setIsEditing(true);
                setEditedData({ ...profileInfo });
              }}
            >
              <Text style={styles.buttonText}>Edit Profile</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Profile' && styles.activeTab]}
            onPress={() => setActiveTab('Profile')}
          >
            <Text style={styles.tabText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'Academic' && styles.activeTab]}
            onPress={() => setActiveTab('Academic')}
          >
            <Text style={styles.tabText}>
              {userType === 'parent' ? 'Students' : 'Academic'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
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
    color: '#d32f2f',
    fontSize: 16,
    marginVertical: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#5E7CE2',
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
    borderColor: '#5E7CE2',
  },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5E7CE2',
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
    color: '#333',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: '#5E7CE2',
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: '#666',
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
    backgroundColor: '#5E7CE2',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: 'white',
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
    borderBottomColor: '#5E7CE2',
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
    color: '#5E7CE2',
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
  editableField: {
    fontSize: 15,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#5E7CE2',
    paddingVertical: 4,
    minWidth: 150,
    textAlign: 'right',
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
    borderColor: '#5E7CE2',
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
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
});

export default ProfileScreen;