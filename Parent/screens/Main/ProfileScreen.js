import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  ScrollView, 
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  Alert
} from 'react-native';
import { useProfile } from '../../context/ProfileContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { pickImage, sanitizeError } from '../../utils/helpers';

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const [uploadError, setUploadError] = useState(null);
  const { 
    parent,
    students,
    activeStudent,
    loading,
    error,
    loadProfileData,
    setActiveStudent,
    uploadProfileImage,
    updateProfile
  } = useProfile();
  
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'student', title: 'Student' },
    { key: 'parent', title: 'Parent' },
    { key: 'family', title: 'Family' }
  ]);

  useEffect(() => {
    const parentId = route.params?.parentId;
    if (parentId) {
      loadProfileData(parentId);
    }
  }, [route.params?.parentId]);

  const handleImageUpload = async () => {
    try {
      const imageUri = await pickImage();
      if (imageUri) {
        await uploadProfileImage('parent', parent?.parentId, imageUri);
        setUploadError(null);
      }
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('Error uploading image:', friendlyError);
      setUploadError(friendlyError);
      Alert.alert('Upload Failed', friendlyError);
    }
  };

  const handleFieldUpdate = async (fieldKey, value) => {
    try {
      await updateProfile('parent', parent?.parentId, { [fieldKey]: value });
    } catch (error) {
      const friendlyError = sanitizeError(error);
      Alert.alert('Update Failed', friendlyError);
    }
  };

  const StudentTab = () => (
    <ProfileDetails 
      data={activeStudent} 
      fields={[
        { label: 'Full Name', key: 'fullName', icon: 'person' },
        { label: 'Student ID', key: 'studentId', icon: 'id-card' },
        { label: 'Class', key: 'className', icon: 'school' },
        { label: 'Date of Birth', key: 'dateOfBirth', icon: 'calendar' },
        { label: 'Gender', key: 'gender', icon: 'gender' },
        { label: 'Address', key: 'address', icon: 'home' }
      ]}
      editable={false}
    />
  );

  const ParentTab = () => (
    <ProfileDetails 
      data={parent} 
      fields={[
        { label: 'Full Name', key: 'fullName', icon: 'account' },
        { label: 'Relationship', key: 'relationship', icon: 'heart' },
        { label: 'Phone', key: 'phoneNumber', icon: 'phone' },
        { label: 'Email', key: 'email', icon: 'email' },
        { label: 'Occupation', key: 'occupation', icon: 'briefcase' },
        { label: 'Address', key: 'address', icon: 'home' }
      ]}
      editable={true}
      onFieldUpdate={handleFieldUpdate}
    />
  );

  const FamilyTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Family Members</Text>
      {students.map(student => (
        <TouchableOpacity 
          key={student.studentId}
          style={styles.familyCard}
          onPress={() => setActiveStudent(student.studentId)}
        >
          <Image
            source={student.profileImagePath 
              ? { uri: student.profileImagePath } 
              : require('../../assets/images/default-profile.png')}
            style={styles.familyImage}
          />
          <View style={styles.familyInfo}>
            <Text style={styles.familyName}>
              {student.fullName}
            </Text>
            <Text style={styles.familyClass}>
              {student.className}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderScene = SceneMap({
    student: StudentTab,
    parent: ParentTab,
    family: FamilyTab
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#00873E' }}
      style={{ backgroundColor: '#00873E' }}
      labelStyle={{ color: '#00873E' }}
    />
  );

  if (loading && !parent) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00873E" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle" size={48} color="#FF5722" />
        <Text style={styles.errorText}>
          {error}
        </Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={() => loadProfileData(route.params?.parentId)}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          <Image
            source={activeStudent?.profileImagePath 
              ? { uri: activeStudent.profileImagePath } 
              : require('../../assets/images/default-profile.png')}
            style={styles.profileImage}
          />
          {uploadError && (
            <Text style={styles.errorText}>{uploadError}</Text>
          )}
          {index === 1 && (
            <TouchableOpacity 
              style={styles.editBadge}
              onPress={handleImageUpload}
            >
              <Icon name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.profileName}>
          {activeStudent?.fullName || 'Student'}
        </Text>
        <Text style={styles.profileRole}>
          {activeStudent?.className || 'Class'}
        </Text>
      </View>

      {/* Student Selector */}
      {students.length > 1 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.studentSelector}
          contentContainerStyle={styles.studentSelectorContent}
        >
          {students.map(student => (
            <TouchableOpacity
              key={student.studentId}
              style={[
                styles.studentButton,
                activeStudent?.studentId === student.studentId && 
                  { backgroundColor: '#00873E' }
              ]}
              onPress={() => setActiveStudent(student.studentId)}
            >
              <Text 
                style={[
                  styles.studentButtonText,
                  activeStudent?.studentId === student.studentId && 
                    { color: '#fff' }
                ]}
              >
                {student.fullName.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Tab View */}
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: '100%' }}
        renderTabBar={renderTabBar}
        style={styles.tabView}
      />
    </ScrollView>
  );
};

const ProfileDetails = ({ data, fields, editable = false, onFieldUpdate }) => {
  const [editingField, setEditingField] = useState(null);
  const [fieldValue, setFieldValue] = useState('');

  const handleFieldPress = (key, value) => {
    if (editable) {
      setEditingField(key);
      setFieldValue(value || '');
    }
  };

  const handleBlur = (key) => {
    if (editable && onFieldUpdate && fieldValue !== data?.[key]) {
      onFieldUpdate(key, fieldValue);
    }
    setEditingField(null);
  };

  return (
    <View style={styles.tabContent}>
      {fields.map((field) => (
        <View key={field.key} style={styles.detailRow}>
          <View style={styles.detailIcon}>
            <Icon name={field.icon} size={20} color="#00873E" />
          </View>
          <View style={styles.detailText}>
            <Text style={styles.detailLabel}>
              {field.label}
            </Text>
            {editable && editingField === field.key ? (
              <TextInput
                style={styles.detailValue}
                value={fieldValue}
                onChangeText={setFieldValue}
                onBlur={() => handleBlur(field.key)}
                autoFocus
              />
            ) : (
              <TouchableOpacity onPress={() => handleFieldPress(field.key, data?.[field.key])}>
                <Text style={styles.detailValue}>
                  {data?.[field.key] || 'Not specified'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fbff',
  },
  contentContainer: {
    paddingBottom: 20,
  },
  profileHeader: {
    padding: 24,
    alignItems: 'center',
    paddingTop: 40,
    marginBottom: 16,
    backgroundColor: '#00873E',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF5722',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#FF5722',
    textAlign: 'center',
    marginTop: 8,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  studentSelector: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  studentSelectorContent: {
    paddingHorizontal: 8,
  },
  studentButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  studentButtonText: {
    fontWeight: '500',
    color: '#333',
  },
  tabView: {
    flex: 1,
    minHeight: 400,
  },
  tabContent: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    marginRight: 16,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 2,
    color: '#666',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#00873E',
  },
  familyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    elevation: 2,
  },
  familyImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  familyName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  familyClass: {
    fontSize: 14,
    color: '#666',
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
    padding: 24,
    backgroundColor: '#f9fbff',
  },
  errorText: {
    fontSize: 16,
    marginVertical: 16,
    textAlign: 'center',
    color: '#FF5722',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    backgroundColor: '#00873E',
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default ProfileScreen;