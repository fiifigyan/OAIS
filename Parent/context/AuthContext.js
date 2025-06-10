import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import AuthService from '../services/AuthService';
import { decodeToken } from '../utils/helpers';

/**
 * @typedef {Object} UserInfo
 * @property {string} token - JWT token
 * @property {string} email - User email
 * @property {string} [studentId] - Student ID (for existing users)
 * @property {string} [signUpId] - SignUp ID (for new users)
 */

export const AuthContext = createContext(/** @type {AuthContextType} */ (null));

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(/** @type {UserInfo|null} */ (null));
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const saveUserData = useCallback(async (data) => {
    try {
      const tokenPayload = decodeToken(data.token);
      const userData = {
        token: data.token,
        email: tokenPayload?.email || data.email,
        studentId: tokenPayload?.studentId || data.studentId,
        signUpId: tokenPayload?.signUpId || data.signUpId
      };
      
      await SecureStore.setItemAsync('authToken', data.token);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(userData));
      setUserInfo(userData);
    } catch (error) {
      throw new Error('Failed to save session data');
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
      return null;
    }
  }, []);

  const clearAuthData = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync('userInfo');
      await SecureStore.deleteItemAsync('authToken');
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
    setUserInfo(null);
  }, []);

  const refreshToken = useCallback(async () => {
    if (!userInfo?.token) return;

    try {
      const newToken = await AuthService.refreshToken(userInfo.token);
      if (newToken) {
        const tokenPayload = decodeToken(newToken);
        const updatedUserInfo = { 
          token: newToken,
          email: tokenPayload.email,
          studentId: tokenPayload.studentId,
          signUpId: tokenPayload.signUpId
        };
        await saveUserData(updatedUserInfo);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await clearAuthData();
    }
  }, [userInfo, saveUserData, clearAuthData]);

  const initializeAuth = useCallback(async () => {
    try {
      const storedUser = await loadUserData();
      if (storedUser) {
        setUserInfo(storedUser);
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setInitialLoading(false);
    }
  }, [loadUserData]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const userData = await AuthService.login(credentials);
      await saveUserData(userData);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.signup(userData);
      await saveUserData(response);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      if (userInfo?.token) {
        await AuthService.logout();
      }
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
        login,
        register,
        logout,
        refreshToken,
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