import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loadSettings, saveSettings } from '../services/NotificationService';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    soundEnabled: true,
    vibrationEnabled: true,
    badgeEnabled: true
  });
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const initializeSettings = async () => {
      try {
        const savedSettings = await loadSettings();
        if (savedSettings) {
          setSettings(savedSettings);
        }
      } catch (error) {
        console.error('Error loading notification settings:', error);
      }
    };
    initializeSettings();
  }, []);

  const updateSetting = useCallback(async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    try {
      await saveSettings(newSettings);
    } catch (error) {
      console.error('Error saving notification settings:', error);
    }
  }, [settings]);

  const updateUnreadCount = useCallback((count) => {
    setUnreadCount(count);
  }, []);

  return (
    <NotificationContext.Provider 
      value={{ 
        settings, 
        updateSetting,
        unreadCount,
        updateUnreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};