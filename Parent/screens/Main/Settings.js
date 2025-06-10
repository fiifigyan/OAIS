import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { View, Text, List, Switch, Button, Divider, Icon } from '@expo/ui/swift-ui';
import { useNavigation } from '@react-navigation/native';
import { appConfig } from '../../config';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const [settings, setSettings] = useState({
    notificationsEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    badgeEnabled: true,
  });

  const toggleSetting = (setting) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
      ...(setting === 'notificationsEnabled' && !prev[setting] ? {
        soundEnabled: true,
        vibrationEnabled: true,
        badgeEnabled: true
      } : {})
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View padding="large">
        <Text variant="header" marginBottom="large" style={styles.headerTitle}>
          Settings
        </Text>
        
        {/* Notification Settings */}
        <List.Section>
          <Text variant="subheader" marginBottom="small" style={styles.sectionTitle}>
            NOTIFICATIONS
          </Text>
          <List.Item
            leading={<Icon name="bell" size={20} color="#00873E" />}
            trailing={
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={() => toggleSetting('notificationsEnabled')}
                trackColor={{ false: '#E0E0E0', true: '#00873E' }}
                thumbColor="#FFFFFF"
              />
            }
          >
            <Text style={styles.settingText}>Enable Notifications</Text>
          </List.Item>
          
          {settings.notificationsEnabled && (
            <>
              <List.Item
                leading={<Icon name="volume-high" size={20} color="#00873E" />}
                trailing={
                  <Switch
                    value={settings.soundEnabled}
                    onValueChange={() => toggleSetting('soundEnabled')}
                    trackColor={{ false: '#E0E0E0', true: '#00873E' }}
                    thumbColor="#FFFFFF"
                  />
                }
              >
                <Text style={styles.settingText}>Sound</Text>
              </List.Item>
              
              <List.Item
                leading={<Icon name="vibrate" size={20} color="#00873E" />}
                trailing={
                  <Switch
                    value={settings.vibrationEnabled}
                    onValueChange={() => toggleSetting('vibrationEnabled')}
                    trackColor={{ false: '#E0E0E0', true: '#00873E' }}
                    thumbColor="#FFFFFF"
                  />
                }
              >
                <Text style={styles.settingText}>Vibration</Text>
              </List.Item>
              
              <List.Item
                leading={<Icon name="circle" size={20} color="#00873E" />}
                trailing={
                  <Switch
                    value={settings.badgeEnabled}
                    onValueChange={() => toggleSetting('badgeEnabled')}
                    trackColor={{ false: '#E0E0E0', true: '#00873E' }}
                    thumbColor="#FFFFFF"
                  />
                }
              >
                <Text style={styles.settingText}>Badge Count</Text>
              </List.Item>
            </>
          )}
        </List.Section>
        
        <Divider marginVertical="large" />
        
        {/* Account Settings */}
        <List.Section>
          <Text variant="subheader" marginBottom="small" style={styles.sectionTitle}>
            ACCOUNT
          </Text>
          <List.Item
            leading={<Icon name="account" size={20} color="#00873E" />}
            trailing={<Icon name="chevron-right" size={20} color="#9E9E9E" />}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.settingText}>My Profile</Text>
          </List.Item>
          
          <List.Item
            leading={<Icon name="lock" size={20} color="#00873E" />}
            trailing={<Icon name="chevron-right" size={20} color="#9E9E9E" />}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text style={styles.settingText}>Change Password</Text>
          </List.Item>
        </List.Section>
        
        <Divider marginVertical="large" />
        
        {/* App Info */}
        <List.Section>
          <Text variant="subheader" marginBottom="small" style={styles.sectionTitle}>
            ABOUT
          </Text>
          <List.Item>
            <Text style={styles.settingText}>App Version</Text>
            <Text style={styles.settingValue}>{appConfig.APP_VERSION}</Text>
          </List.Item>
          
          <List.Item
            leading={<Icon name="file-document" size={20} color="#00873E" />}
            trailing={<Icon name="chevron-right" size={20} color="#9E9E9E" />}
            onPress={() => navigation.navigate('Terms')}
          >
            <Text style={styles.settingText}>Terms of Service</Text>
          </List.Item>
          
          <List.Item
            leading={<Icon name="shield" size={20} color="#00873E" />}
            trailing={<Icon name="chevron-right" size={20} color="#9E9E9E" />}
            onPress={() => navigation.navigate('Privacy')}
          >
            <Text style={styles.settingText}>Privacy Policy</Text>
          </List.Item>
        </List.Section>
        
        <Divider marginVertical="large" />
        
        {/* Logout Button */}
        <Button 
          mode="contained" 
          onPress={() => navigation.replace('Login')}
          marginTop="large"
          buttonColor="#E53935"
          textColor="#FFFFFF"
          icon="logout"
        >
          Log Out
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2D3748',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#718096',
    textTransform: 'uppercase',
  },
  settingText: {
    fontSize: 16,
    color: '#2D3748',
  },
  settingValue: {
    fontSize: 16,
    color: '#718096',
  },
});

export default SettingsScreen;