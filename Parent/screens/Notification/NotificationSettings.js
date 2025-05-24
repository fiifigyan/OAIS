import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { appConfig } from '../../config';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [notificationSettings, setNotificationSettings] = useState({
    soundEnabled: true,
    vibrationEnabled: true,
    badgeEnabled: true,
  });

  const handleLogout = () => {
    navigation.replace('Login');
  };

  const toggleNotificationSetting = (setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContainer}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* Notification Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        
        <View style={styles.settingItem}>
          <View style={styles.settingIcon}>
            <MaterialIcons name="notifications" size={24} color="#00873E" />
          </View>
          <Text style={styles.settingText}>Enable Notifications</Text>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: '#E0E0E0', true: '#00873E' }}
            thumbColor="#FFFFFF"
          />
        </View>

        {notificationsEnabled && (
          <>
            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <MaterialIcons name="volume-up" size={24} color="#00873E" />
              </View>
              <Text style={styles.settingText}>Notification Sound</Text>
              <Switch
                value={notificationSettings.soundEnabled}
                onValueChange={() => toggleNotificationSetting('soundEnabled')}
                trackColor={{ false: '#E0E0E0', true: '#00873E' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <MaterialIcons name="vibration" size={24} color="#00873E" />
              </View>
              <Text style={styles.settingText}>Vibration</Text>
              <Switch
                value={notificationSettings.vibrationEnabled}
                onValueChange={() => toggleNotificationSetting('vibrationEnabled')}
                trackColor={{ false: '#E0E0E0', true: '#00873E' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingIcon}>
                <MaterialIcons name="circle" size={24} color="#00873E" />
              </View>
              <Text style={styles.settingText}>Badge Count</Text>
              <Switch
                value={notificationSettings.badgeEnabled}
                onValueChange={() => toggleNotificationSetting('badgeEnabled')}
                trackColor={{ false: '#E0E0E0', true: '#00873E' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </>
        )}
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <View style={styles.menuIcon}>
            <MaterialIcons name="person" size={24} color="#00873E" />
          </View>
          <Text style={styles.menuText}>My Profile</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9E9E9E" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => navigation.navigate('ResetPassword')}
        >
          <View style={styles.menuIcon}>
            <MaterialIcons name="lock" size={24} color="#00873E" />
          </View>
          <Text style={styles.menuText}>Change Password</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9E9E9E" />
        </TouchableOpacity>
      </View>

      {/* App Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        
        <View style={styles.infoItem}>
          <Text style={styles.infoLabel}>App Version</Text>
          <Text style={styles.infoValue}>{appConfig.APP_VERSION}</Text>
        </View>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <MaterialIcons name="description" size={24} color="#00873E" />
          </View>
          <Text style={styles.menuText}>Terms of Service</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9E9E9E" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem}>
          <View style={styles.menuIcon}>
            <MaterialIcons name="security" size={24} color="#00873E" />
          </View>
          <Text style={styles.menuText}>Privacy Policy</Text>
          <MaterialIcons name="chevron-right" size={24} color="#9E9E9E" />
        </TouchableOpacity>
      </View>

      {/* Logout Button */}
      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  scrollContainer: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#718096',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingIcon: {
    width: 40,
    alignItems: 'center',
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    marginLeft: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuIcon: {
    width: 40,
    alignItems: 'center',
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
    marginLeft: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    flex: 1,
    fontSize: 16,
    color: '#2D3748',
  },
  infoValue: {
    fontSize: 16,
    color: '#718096',
  },
  logoutButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutText: {
    color: '#E53E3E',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;