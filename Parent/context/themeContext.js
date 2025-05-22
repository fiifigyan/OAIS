import React, { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? darkColors : lightColors,
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

const lightColors = {
  primary: '#0B6623',
  secondary: '#2E7D32',
  accent: '#FFC107',
  background: '#f5f5f5',
  card: '#ffffff',
  text: '#000000',
  textSecondary: '#555555',
  border: '#e0e0e0',
  notification: '#ff3b30',
};

const darkColors = {
  primary: '#4CAF50',
  secondary: '#388E3C',
  accent: '#FFA000',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  textSecondary: '#BBBBBB',
  border: '#333333',
  notification: '#CF6679',
};