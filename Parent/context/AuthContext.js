import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthService from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const saveUserInfo = async (userInfo) => {
    try {
      if (!userInfo) {
        console.warn('Attempted to save null userInfo');
        return;
      }
      
      if (!userInfo.token) {
        console.warn('User info missing token');
      }

      await AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
      
      if (userInfo.token) {
        await AsyncStorage.setItem('authToken', userInfo.token);
      }
    } catch (error) {
      console.error('AsyncStorage save error:', error);
      throw new Error('Failed to save user session');
    }
  };

  const retrieveUserInfo = async () => {
    try {
      const userInfoString = await AsyncStorage.getItem('userInfo');
      return userInfoString ? JSON.parse(userInfoString) : null;
    } catch (error) {
      console.error('AsyncStorage retrieval error:', error);
      return null;
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUser = await retrieveUserInfo();
        const tokenStatus = await AuthService.verifyToken(); // Changed to verifyToken
        
        if (tokenStatus?.token) {
          const userData = {
            ...storedUser,
            token: tokenStatus.token
          };
          await saveUserInfo(userData);
          setUserInfo(userData);
        } else if (storedUser) {
          // Clear invalid session
          await AsyncStorage.multiRemove(['userInfo', 'authToken']);
          setUserInfo(null);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setInitialLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    try {
      const userData = await AuthService.login(credentials);
      await saveUserInfo(userData);
      setUserInfo(userData);
      return userData;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    try {
      const response = await AuthService.signup(userData);
      
      if (!response || !response.token) {
        throw new Error('Registration completed but no session established');
      }

      const completeUserData = {
        ...response,
        token: response.token
      };

      await saveUserInfo(completeUserData);
      setUserInfo(completeUserData);
      return completeUserData;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AuthService.logout();
      setUserInfo(null);
      await AsyncStorage.multiRemove(['userInfo', 'authToken']);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear local storage even if API fails
      await AsyncStorage.multiRemove(['userInfo', 'authToken']);
      setUserInfo(null);
      throw new Error('Local session cleared, but server logout may have failed');
    } finally {
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