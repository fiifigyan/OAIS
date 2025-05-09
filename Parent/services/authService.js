import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { APIConfig } from '../config';

const manageAuthToken = async (token) => {
  console.debug('[Auth] Managing token:', token ? 'Storing new token' : 'Clearing token');
  try {
    if (token) {
      await SecureStore.setItemAsync('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.debug('[Auth] Token stored and header set');
    } else {
      await SecureStore.deleteItemAsync('authToken');
      delete axios.defaults.headers.common['Authorization'];
      console.debug('[Auth] Token cleared');
    }
  } catch (error) {
    console.error('[Auth] Token management failed:', error);
    throw new Error('Session maintenance failed');
  }
};

const processAuthResponse = (response) => {
  console.debug('[Auth] Processing response:', {
    status: response.status,
    dataType: typeof response.data,
    dataPreview: typeof response.data === 'string' ? 
      response.data.substring(0, 50) + '...' : 
      JSON.stringify(response.data).substring(0, 100) + '...'
  });

  if (typeof response.data === 'string') {
    console.debug('[Auth] Processing string response');
    const message = response.data.split('%')[0].trim();
    const tokenMatch = response.data.match(/eyJhbGciOiJIUzUxMiJ9\.[a-zA-Z0-9\-_]+\.[a-zA-Z0-9\-_]+/);
    
    if (tokenMatch) {
      console.debug('[Auth] Found embedded token');
      return {
        message: message || 'Operation successful',
        token: tokenMatch[0]
      };
    }
  }

  if (response.data?.token) {
    console.debug('[Auth] Processing JSON response with token');
    return response.data;
  }

  console.error('[Auth] Unrecognized response format', response.data);
  throw new Error('Unexpected server response');
};

const AuthService = {
  async signup(userData) {
    console.group('[Auth] Signup Process');
    console.debug('Attempting to call API:', {
      url: `${APIConfig.BASE_URL}${APIConfig.AUTH.SIGNUP}`,
      method: 'POST',
      data: userData
    });
    try {
      console.debug('Submitting:', { 
        email: userData.email, 
        password: '•••••••'
      });

      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.SIGNUP}`, 
        userData
      );

      const result = processAuthResponse(response);
      await manageAuthToken(result.token);
      
      console.debug('Signup successful:', result.message);
      console.groupEnd();
      return result;
      
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        console.error('Server responded with:', {
          status: error.response.status,
          data: error.response.data
        });
        errorMessage = error.response.data?.message || errorMessage;
      } else {
        console.error('Network/request error:', error.message);
      }
      
      console.groupEnd();
      throw new Error(errorMessage);
    }
  },

  async login(credentials) {
    console.group('[Auth] Login Process');
    try {
      console.debug('Attempting login for:', credentials.email + ' with student ID:', credentials.StudentID);

      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.LOGIN}`,
        credentials
      );

      const result = processAuthResponse(response);
      await manageAuthToken(result.token);
      
      console.debug('Login successful for:', result.email || result.userId);
      console.groupEnd();
      return result;
      
    } catch (error) {
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response) {
        console.error('Login error response:', {
          status: error.response.status,
          data: error.response.data
        });
        errorMessage = error.response.data?.message || errorMessage;
      } else {
        console.error('Login failed:', error.message);
      }
      
      console.groupEnd();
      throw new Error(errorMessage);
    }
  },

  async logout() {
    console.group('[Auth] Logout Process');
    try {
      console.debug('Initiating logout');
      const token = await SecureStore.getItemAsync('authToken');
      await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.LOGOUT}`,
        null,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      await manageAuthToken(null);
      
      console.debug('Logout completed');
      console.groupEnd();
      return { success: true };
      
    } catch (error) {
      console.error('Logout API failed, clearing token anyway:', error.message);
      await manageAuthToken(null);
      console.groupEnd();
      throw new Error('Logged out (connection issue)');
    }
  },

  async forgotPassword(email) {
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.FORGOT}`,
        { email }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset request failed');
    }
  },
  
  async resetPassword(token, newPassword) {
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.RESET}`,
        { token, newPassword }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password reset failed');
    }
  },

  async verifyToken() {
    console.debug('[Auth] Verifying stored token');
    try {
      const token = await SecureStore.getItemAsync('authToken');
      if (!token) {
        console.debug('No token found');
        return null;
      }

      const parts = token.split('.');
      if (parts.length !== 3) {
        console.error('Invalid token structure');
        await this.logout();
        return null;
      }

      try {
        const payload = JSON.parse(atob(parts[1]));
        if (payload.exp && Date.now() >= payload.exp * 1000) {
          console.error('Token expired');
          await this.logout();
          return null;
        }
        console.debug('Token is valid');
        return { token, payload };
      } catch (e) {
        console.error('Token parsing failed:', e);
        await this.logout();
        return null;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }
};

export default AuthService;