import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useProfile } from '../context/ProfileContext';

const CustomHeader = ({ title = 'Dashboard', navigation }) => {
  const { profileInfo, userType } = useProfile();

  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Icon name="menu-outline" size={24} color="#00873E" />
      </TouchableOpacity>
      
      <Text style={styles.title}>{title}</Text>
      
      <TouchableOpacity 
        onPress={() => navigation.navigate('Profile', { 
          userId: profileInfo?.id,
          type: userType
        })}
      >
        <Image
          source={
            profileInfo?.profileImagePath 
              ? { uri: profileInfo.profileImagePath }
              : require('../assets/images/default-profile.png')
          }
          style={styles.profileImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    justifyContent: 'space-between',
    backgroundColor: 'aliceblue',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00873E',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  profileImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#00873E',
  },
});

export default CustomHeader;