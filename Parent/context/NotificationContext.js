import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { loadSettings, saveSettings } from '../services/NotificationService';

const DEFAULT_SETTINGS = {
  pushEnabled: true,
  soundEnabled: true,
  vibrationEnabled: true,
  badgeEnabled: true
};

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load settings on mount
  useEffect(() => {
    const loadInitialSettings = async () => {
      try {
        const savedSettings = await loadSettings();
        setSettings(savedSettings || DEFAULT_SETTINGS);
      } catch (error) {
        console.error('Failed to load settings:', error);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialSettings();
  }, []);

  // Debounced save settings
  const updateSetting = useCallback(async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    
    try {
      await saveSettings(newSettings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  }, [settings]);

  const updateUnreadCount = useCallback((count) => {
    setUnreadCount(Math.max(0, count));
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        settings,
        updateSetting,
        unreadCount,
        updateUnreadCount,
        isLoading
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