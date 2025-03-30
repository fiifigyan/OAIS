import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CustomInput } from '../components/CustomInput';

const EditProfileScreen = () => {
  const navigation = useNavigation();
  const { userInfo, updateProfile } = useContext(AuthContext);
  
  const [profileData, setProfileData] = useState({
    fname: userInfo?.fname || '',
    lname: userInfo?.lname || '',
    phone: userInfo?.phone || '',
    email: userInfo?.email || '',
    relationship: userInfo?.relationship || '',
    description: userInfo?.description || '',
    occupation: userInfo?.occupation || '',
    address: userInfo?.address || '',
    profileImage: userInfo?.profileImage || '', 
  });

  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileData({ ...profileData, profileImage: result.assets[0].uri });
    }
  };

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await updateProfile(profileData);
      navigation.goBack();
    } catch (error) {
      console.error('Profile Update Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000080" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#000080" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
      </View>

      <View style={styles.profileImageContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {profileData.profileImage ? (
            <Image source={{ uri: profileData.profileImage }} style={styles.profileImage} />
          ) : (
            <Icon name="add-a-photo" size={40} color="#000080" />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <CustomInput
          label="First Name"
          value={profileData.fname}
          onChangeText={(text) => setProfileData({ ...profileData, fname: text })}
        />

        <CustomInput
          label="Last Name"
          value={profileData.lname}
          onChangeText={(text) => setProfileData({ ...profileData, lname: text })}
        />

        <CustomInput
          label="Phone"
          value={profileData.phone}
          onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
          keyboardType="phone-pad"
        />

        <CustomInput
          label="Email"
          value={profileData.email}
          onChangeText={(text) => setProfileData({ ...profileData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <CustomInput
          label="Occupation"
          value={profileData.occupation}
          onChangeText={(text) => setProfileData({ ...profileData, occupation: text })}
        />

        <CustomInput
          label="Address"
          value={profileData.address}
          onChangeText={(text) => setProfileData({ ...profileData, address: text })}
        />

        <CustomInput
          label="Relationship"
          value={profileData.relationship}
          onChangeText={(text) => setProfileData({ ...profileData, relationship: text })}
        />

        <CustomInput
          label="Description"
          value={profileData.description}
          onChangeText={(text) => setProfileData({ ...profileData, description: text })}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleUpdate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Update Profile</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: 'aliceblue',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#000080',
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imagePicker: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  form: {
    flex: 1,
    gap: 15,
  },
  submitButton: {
    backgroundColor: '#000080',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;