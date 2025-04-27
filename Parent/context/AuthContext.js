import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import AuthService from '../services/AuthService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  const saveUserData = useCallback(async (data) => {
    try {
      await SecureStore.setItemAsync('authToken', data.token);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save user data:', error);
      throw error;
    }
  }, []);

  const loadUserData = useCallback(async () => {
    try {
      const userInfoString = await SecureStore.getItemAsync('userInfo');
      const token = await SecureStore.getItemAsync('authToken');
      if (userInfoString && token) {
        return JSON.parse(userInfoString);
      }
      return null;
    } catch (error) {
      console.error('Failed to load user data:', error);
      return null;
    }
  }, []);

  const initializeAuth = useCallback(async () => {
    try {
      const storedUser = await loadUserData();
      if (storedUser) {
        const tokenStatus = await AuthService.verifyToken();
        if (tokenStatus?.token) {
          setUserInfo(storedUser);
        } else {
          await clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setInitialLoading(false);
    }
  }, [loadUserData]);

  const clearAuthData = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync('userInfo');
      await SecureStore.deleteItemAsync('authToken');
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
    setUserInfo(null);
    setIsNewUser(false);
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const userData = await AuthService.login(credentials);
      await saveUserData(userData);
      setUserInfo(userData);
      setIsNewUser(false);
      return userData;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.signup(userData);
      await saveUserData(response);
      setUserInfo(response);
      setIsNewUser(true);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      await clearAuthData();
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        initialLoading,
        isLoading,
        isNewUser,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};