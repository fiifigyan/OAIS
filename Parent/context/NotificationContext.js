import React, { createContext, useState, useEffect } from 'react';
import { loadSettings, saveSettings } from '../services/NotificationService';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    soundEnabled: false,
    vibrationEnabled: true,
  });

  useEffect(() => {
    const load = async () => {
      const savedSettings = await loadSettings();
      if (savedSettings) {
        setSettings(savedSettings);
      }
    };
    load();
  }, []);

  const updateSetting = async (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    await saveSettings(newSettings);
  };

  return (
    <NotificationContext.Provider value={{ settings, updateSetting }}>
      {children}
    </NotificationContext.Provider>
  );
};