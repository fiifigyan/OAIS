import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Switch, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import { ParentContext } from '../context/ParentContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { appConfig } from '../config';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { parentInfo } = useContext(ParentContext);
  const profileImage = parentInfo?.profileImage || require('../assets/images/fiifi1.jpg');
  const fullName = [parentInfo?.firstName, parentInfo?.lastName].filter(Boolean).join(' ') || 'N/A';
  const relationship = parentInfo?.relationship || 'Parent/Guardian';

  const handleLogout = () => {
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkTheme ? '#333' : 'aliceblue' }]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={[styles.header, { color: isDarkTheme ? '#FFF' : '#007AFF' }]}>Settings</Text>

      {/* Parent Profile section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFF' : '#007AFF' }]}>Parent Profile</Text>
        <View style={[styles.profile, { backgroundColor: isDarkTheme ? '#333' : 'aliceblue' }]}>
          <View style={styles.profileInfo}>
            <Image source={typeof profileImage === 'string' ? { uri: profileImage } : profileImage} style={styles.profileImage} />
            <View style={styles.profileDetails}>
              <Text style={[styles.profileName, { color: isDarkTheme ? '#FFF' : '#007AFF' }]}>{fullName}</Text>
              <Text style={{ color: isDarkTheme ? '#FFF' : '#007AFF' }}>{relationship}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* App Preferences Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFF' : '#007AFF' }]}>App Preferences</Text>
        
        {/* Dark Theme Toggle */}
        <View style={styles.settingItem}>
          <Text style={{ color: isDarkTheme ? '#FFF' : '#007AFF' }}>Dark Theme</Text>
          <TouchableOpacity onPress={toggleTheme}>
            <Icon name={isDarkTheme ? 'sunny' : 'sunny'} size={24} color={isDarkTheme ? 'aliceblue' : '#767577'} />
          </TouchableOpacity>
        </View>

        {/* Enable Notifications */}
        <View style={styles.settingItem}>
          <Text style={{ color: isDarkTheme ? '#FFF' : '#007AFF' }}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={(value) => setNotificationsEnabled(value)}
            trackColor={{ false: '#767577', true: '#767577' }}
            thumbColor={isDarkTheme ? '#767577' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Account Settings Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkTheme ? '#FFF' : '#007AFF' }]}>Account Settings</Text>
        
        {/* Edit Profile */}
        <TouchableOpacity
          style={[styles.accountItem, { backgroundColor: isDarkTheme ? '#444' : '#FFF' }]}
          onPress={() => navigation.navigate('EditProfile')}
        >
          <Icon name="person" size={24} color={isDarkTheme ? '#FFF' : '#007AFF'} />
          <Text style={[styles.accountText, { color: isDarkTheme ? '#FFF' : '#007AFF' }]}>Edit Profile</Text>
          <Icon name="chevron-right" size={24} color={isDarkTheme ? '#FFF' : '#007AFF'} />
        </TouchableOpacity>

        {/* Change Password */}
        <TouchableOpacity
          style={[styles.accountItem, { backgroundColor: isDarkTheme ? '#444' : '#FFF' }]}
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <Icon name="lock" size={24} color={isDarkTheme ? '#FFF' : '#007AFF'} />
          <Text style={[styles.accountText, { color: isDarkTheme ? '#FFF' : '#007AFF' }]}>Change Password</Text>
          <Icon name="chevron-right" size={24} color={isDarkTheme ? '#FFF' : '#007AFF'} />
        </TouchableOpacity>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.accountItem, { backgroundColor: isDarkTheme ? '#444' : '#FFF' }]}
          onPress={handleLogout}
        >
          <Icon name="logout" size={24} color={isDarkTheme ? '#FFF' : '#007AFF'} />
          <Text style={[styles.accountText, { color: isDarkTheme ? '#FFF' : '#007AFF' }]}>Logout</Text>
          <Icon name="chevron-right" size={24} color={isDarkTheme ? '#FFF' : '#007AFF'} />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={[styles.footer, { color: isDarkTheme ? '#FFF' : '#007AFF' }]}>App Version: {appConfig.APP_VERSION}</Text>
    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profile: {
    flexDirection: 'column',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: '#FFF',
    borderWidth: 2,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileDetails: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  accountText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
  footer: {
    marginTop: 20,
    textAlign: 'center',
    color: 'gray',
  },
});

export default SettingsScreen;