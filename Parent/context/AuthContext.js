import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import AuthService from '../services/AuthService';

/**
 * @typedef {Object} UserInfo
 * @property {string} token - JWT token
 * @property {string} email - User email
 * @property {string} [StudentID] - Optional student ID
 */

/**
 * @typedef {Object} AuthContextType
 * @property {UserInfo|null} userInfo - Current user info
 * @property {boolean} initialLoading - Initial auth loading state
 * @property {boolean} isLoading - General loading state
 * @property {boolean} isNewUser - Flag for new user registration
 * @property {(credentials: {email: string, password: string, StudentID?: string}) => Promise<UserInfo>} login - Login function
 * @property {(userData: {email: string, password: string}) => Promise<UserInfo>} register - Registration function
 * @property {() => Promise<void>} logout - Logout function
 * @property {() => Promise<void>} refreshToken - Token refresh function
 */

export const AuthContext = createContext(/** @type {AuthContextType} */ (null));

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(/** @type {UserInfo|null} */ (null));
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewUser, setIsNewUser] = useState(false);

  // Token refresh interval (30 minutes)
  const TOKEN_REFRESH_INTERVAL = 30 * 60 * 1000;

  /**
   * Save user data to secure storage
   * @param {UserInfo} data - User data to save
   */
  const saveUserData = useCallback(async (data) => {
    try {
      await SecureStore.setItemAsync('authToken', data.token);
      await SecureStore.setItemAsync('userInfo', JSON.stringify(data));
      setUserInfo(data);
    } catch (error) {
      console.error('Failed to save user data:', error);
      throw new Error('Failed to save session data');
    }
  }, []);

  /**
   * Load user data from secure storage
   * @returns {Promise<UserInfo|null>}
   */
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

  /**
   * Clear all auth data from storage and state
   */
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

  /**
   * Refresh the auth token
   */
  const refreshToken = useCallback(async () => {
    if (!userInfo?.token) return;
    
    try {
      const newToken = await AuthService.refreshToken(userInfo.token);
      if (newToken) {
        const updatedUserInfo = { ...userInfo, token: newToken };
        await saveUserData(updatedUserInfo);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await clearAuthData();
    }
  }, [userInfo, saveUserData, clearAuthData]);

  /**
   * Initialize auth state and set up token refresh
   */
  const initializeAuth = useCallback(async () => {
    try {
      const storedUser = await loadUserData();
      if (storedUser) {
        const tokenStatus = await AuthService.verifyToken(storedUser.token);
        if (tokenStatus?.valid) {
          setUserInfo(storedUser);
          // Set up token refresh
          const refreshInterval = setInterval(refreshToken, TOKEN_REFRESH_INTERVAL);
          return () => clearInterval(refreshInterval);
        } else {
          await clearAuthData();
        }
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
    } finally {
      setInitialLoading(false);
    }
  }, [loadUserData, clearAuthData, refreshToken]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  /**
   * Handle user login
   * @param {Object} credentials - Login credentials
   * @returns {Promise<UserInfo>}
   */
  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const userData = await AuthService.login(credentials);
      await saveUserData(userData);
      setIsNewUser(false);
      return userData;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user registration
   * @param {Object} userData - Registration data
   * @returns {Promise<UserInfo>}
   */
  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.signup(userData);
      await saveUserData(response);
      setIsNewUser(true);
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle user logout
   */
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
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook for auth context
 * @returns {AuthContextType}
 */
export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};