import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Switch, Text } from 'react-native-paper';
import { useNotificationContext } from '../context/NotificationContext';

const NotificationSettings = () => {
  const { settings, updateSetting } = useNotificationContext();

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader style={styles.subheader}>
          Notification Preferences
        </List.Subheader>
        
        <List.Item
          title="Enable Push Notifications"
          description="Receive notifications in real-time"
          left={() => <List.Icon icon="bell" />}
          right={() => (
            <Switch
              value={settings.pushEnabled}
              onValueChange={value => updateSetting('pushEnabled', value)}
              color="#03AC13"
            />
          )}
        />
        
        <List.Item
          title="Notification Sound"
          description="Play sound when receiving notifications"
          left={() => <List.Icon icon="volume-high" />}
          right={() => (
            <Switch
              value={settings.soundEnabled}
              onValueChange={value => updateSetting('soundEnabled', value)}
              color="#03AC13"
              disabled={!settings.pushEnabled}
            />
          )}
        />
        
        <List.Item
          title="Vibration"
          description="Vibrate when receiving notifications"
          left={() => <List.Icon icon="vibrate" />}
          right={() => (
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={value => updateSetting('vibrationEnabled', value)}
              color="#03AC13"
              disabled={!settings.pushEnabled}
            />
          )}
        />
        
        <List.Item
          title="Badge Count"
          description="Show unread count on app icon"
          left={() => <List.Icon icon="numeric" />}
          right={() => (
            <Switch
              value={settings.badgeEnabled}
              onValueChange={value => updateSetting('badgeEnabled', value)}
              color="#03AC13"
              disabled={!settings.pushEnabled}
            />
          )}
        />
      </List.Section>
      
      {!settings.pushEnabled && (
        <Text style={styles.disabledText}>
          Some settings are disabled because push notifications are turned off
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03AC13',
  },
  disabledText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});

export default NotificationSettings;