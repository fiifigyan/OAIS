import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { List, Switch, Text } from 'react-native-paper';
import { useNotificationContext } from '../context/NotificationContext';

const NotificationSettings = () => {
  const { settings, updateSetting, isLoading } = useNotificationContext();

  useEffect(() => {
    if (!settings.pushEnabled) {
      updateSetting('soundEnabled', false);
      updateSetting('vibrationEnabled', false);
      updateSetting('badgeEnabled', false);
    }
  }, [settings.pushEnabled, updateSetting]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#ffffff' }]}>
      <List.Section>
        <List.Subheader style={[styles.subheader, { color: '#03ac13' }]}>
          Notification Preferences
        </List.Subheader>
        
        <List.Item
          title="Enable Notifications"
          description="Receive notifications in real-time"
          left={() => <List.Icon icon="bell" color="#212121" />}
          right={() => (
            <Switch
              value={settings.pushEnabled}
              onValueChange={value => updateSetting('pushEnabled', value)}
              color="#03ac13"
            />
          )}
          style={styles.listItem}
        />
        
        <List.Item
          title="Notification Sound"
          description="Play sound when receiving notifications"
          left={() => <List.Icon icon="volume-high" color={
            settings.pushEnabled ? '#212121' : '#9e9e9e'
          } />}
          right={() => (
            <Switch
              value={settings.soundEnabled}
              onValueChange={value => updateSetting('soundEnabled', value)}
              color="#03ac13"
              disabled={!settings.pushEnabled}
            />
          )}
          style={styles.listItem}
          disabled={!settings.pushEnabled}
        />
        
        <List.Item
          title="Vibration"
          description="Vibrate when receiving notifications"
          left={() => <List.Icon icon="vibrate" color={
            settings.pushEnabled ? '#212121' : '#9e9e9e'
          } />}
          right={() => (
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={value => updateSetting('vibrationEnabled', value)}
              color="#03ac13"
              disabled={!settings.pushEnabled}
            />
          )}
          style={styles.listItem}
          disabled={!settings.pushEnabled}
        />
        
        <List.Item
          title="Badge Count"
          description="Show unread count on app icon"
          left={() => <List.Icon icon="numeric" color={
            settings.pushEnabled ? '#212121' : '#9e9e9e'
          } />}
          right={() => (
            <Switch
              value={settings.badgeEnabled}
              onValueChange={value => updateSetting('badgeEnabled', value)}
              color="#03ac13"
              disabled={!settings.pushEnabled}
            />
          )}
          style={styles.listItem}
          disabled={!settings.pushEnabled}
        />
      </List.Section>
      
      {!settings.pushEnabled && (
        <Text style={[styles.disabledText, { color: '#9e9e9e' }]}>
          Some settings are disabled because notifications are turned off
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  subheader: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    paddingVertical: 12,
  },
  disabledText: {
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
});

export default NotificationSettings;