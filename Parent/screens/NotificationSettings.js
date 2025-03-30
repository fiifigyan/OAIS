import React, { useContext } from 'react';
import { View, StyleSheet, Switch } from 'react-native';
import { List } from 'react-native-paper';
import { NotificationContext } from '../context/NotificationContext';

const NotificationSettings = () => {
  const { settings, updateSetting } = useContext(NotificationContext);

  return (
    <View style={styles.container}>
      <List.Section>
        <List.Subheader>Notification Preferences</List.Subheader>
        
        <List.Item
          title="Push Notifications"
          right={() => (
            <Switch
              value={settings.pushEnabled}
              onValueChange={value => updateSetting('pushEnabled', value)}
            />
          )}
        />
        
        <List.Item
          title="Notification Sound"
          right={() => (
            <Switch
              value={settings.soundEnabled}
              onValueChange={value => updateSetting('soundEnabled', value)}
            />
          )}
        />
        
        <List.Item
          title="Vibration"
          right={() => (
            <Switch
              value={settings.vibrationEnabled}
              onValueChange={value => updateSetting('vibrationEnabled', value)}
            />
          )}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});

export default NotificationSettings;