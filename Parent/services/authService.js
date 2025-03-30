import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Helper function with debug logs
const manageAuthToken = async (token) => {
  console.debug('[Auth] Managing token:', token ? 'Storing new token' : 'Clearing token');
  try {
    if (token) {
      await AsyncStorage.setItem('authToken', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.debug('[Auth] Token stored and header set');
    } else {
      await AsyncStorage.removeItem('authToken');
      delete axios.defaults.headers.common['Authorization'];
      console.debug('[Auth] Token cleared');
    }
  } catch (error) {
    console.error('[Auth] Token management failed:', error);
    throw new Error('Session maintenance failed');
  }
};

// Enhanced response processor with logs
const processAuthResponse = (response) => {
  console.debug('[Auth] Processing response:', {
    status: response.status,
    dataType: typeof response.data,
    dataPreview: typeof response.data === 'string' ? 
      response.data.substring(0, 50) + '...' : 
      JSON.stringify(response.data).substring(0, 100) + '...'
  });

  // String response handling
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

  // JSON response handling
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
    try {
      console.debug('Submitting:', { 
        email: userData.email, 
        password: '•••••••' // Never log actual passwords
      });

      const response = await axios.post(
        'https://73xd35pq-2025.uks1.devtunnels.ms/api/parent/auth/signup', 
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
      console.debug('Attempting login for:', credentials.email);

      const response = await axios.post(
        'https://73xd35pq-2025.uks1.devtunnels.ms/api/parent/auth/login',
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
      await axios.post('https://73xd35pq-2025.uks1.devtunnels.ms/api/parent/auth/logout');
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

  async verifyToken() {
    console.debug('[Auth] Verifying stored token');
    try {
      const token = await AsyncStorage.getItem('authToken');
      console.debug(token ? 'Token exists' : 'No token found');
      return token ? { token } : null;
      
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }
};

export default AuthService;