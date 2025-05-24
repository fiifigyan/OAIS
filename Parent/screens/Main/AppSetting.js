import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import { 
  View, 
  Text, 
  List, 
  Switch, 
  Button,
  Divider,
  Icon
} from '@expo/ui/swift-ui';
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
    <ScrollView>
      <View padding="large">
        <Text variant="header" marginBottom="large">Settings</Text>
        
        {/* Notification Settings */}
        <List.Section>
          <Text variant="subheader" marginBottom="small">NOTIFICATIONS</Text>
          <List.Item
            leading={<Icon name="bell" size={20} color="#00873E" />}
            trailing={
              <Switch
                value={settings.notificationsEnabled}
                onValueChange={() => toggleSetting('notificationsEnabled')}
                color="#00873E"
              />
            }
          >
            <Text>Enable Notifications</Text>
          </List.Item>
          
          {settings.notificationsEnabled && (
            <>
              <List.Item
                leading={<Icon name="volume-high" size={20} color="#00873E" />}
                trailing={
                  <Switch
                    value={settings.soundEnabled}
                    onValueChange={() => toggleSetting('soundEnabled')}
                    color="#00873E"
                  />
                }
              >
                <Text>Sound</Text>
              </List.Item>
              
              <List.Item
                leading={<Icon name="vibrate" size={20} color="#00873E" />}
                trailing={
                  <Switch
                    value={settings.vibrationEnabled}
                    onValueChange={() => toggleSetting('vibrationEnabled')}
                    color="#00873E"
                  />
                }
              >
                <Text>Vibration</Text>
              </List.Item>
              
              <List.Item
                leading={<Icon name="circle" size={20} color="#00873E" />}
                trailing={
                  <Switch
                    value={settings.badgeEnabled}
                    onValueChange={() => toggleSetting('badgeEnabled')}
                    color="#00873E"
                  />
                }
              >
                <Text>Badge Count</Text>
              </List.Item>
            </>
          )}
        </List.Section>
        
        <Divider marginVertical="large" />
        
        {/* Account Settings */}
        <List.Section>
          <Text variant="subheader" marginBottom="small">ACCOUNT</Text>
          <List.Item
            leading={<Icon name="person" size={20} color="#00873E" />}
            trailing={<Icon name="chevron-right" size={20} color="#9e9e9e" />}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text>My Profile</Text>
          </List.Item>
          
          <List.Item
            leading={<Icon name="lock" size={20} color="#00873E" />}
            trailing={<Icon name="chevron-right" size={20} color="#9e9e9e" />}
            onPress={() => navigation.navigate('ResetPassword')}
          >
            <Text>Change Password</Text>
          </List.Item>
        </List.Section>
        
        <Divider marginVertical="large" />
        
        {/* App Info */}
        <List.Section>
          <Text variant="subheader" marginBottom="small">ABOUT</Text>
          <List.Item>
            <Text>App Version</Text>
            <Text color="secondary">{appConfig.APP_VERSION}</Text>
          </List.Item>
          
          <List.Item
            leading={<Icon name="document-text" size={20} color="#00873E" />}
            trailing={<Icon name="chevron-right" size={20} color="#9e9e9e" />}
            onPress={() => navigation.navigate('Terms')}
          >
            <Text>Terms of Service</Text>
          </List.Item>
          
          <List.Item
            leading={<Icon name="shield-check" size={20} color="#00873E" />}
            trailing={<Icon name="chevron-right" size={20} color="#9e9e9e" />}
            onPress={() => navigation.navigate('Privacy')}
          >
            <Text>Privacy Policy</Text>
          </List.Item>
        </List.Section>
        
        <Divider marginVertical="large" />
        
        {/* Logout Button */}
        <Button 
          variant="destructive" 
          onPress={() => navigation.replace('Login')}
          marginTop="large"
        >
          Log Out
        </Button>
      </View>
    </ScrollView>
  );
};

export default SettingsScreen;