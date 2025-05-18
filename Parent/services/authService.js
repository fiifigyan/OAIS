import axios from 'axios';
import { 
  manageAuthToken, 
  processAuthResponse, 
  getAuthToken,
  verifyToken
} from '../utils/helpers';
import { APIConfig } from '../config';

const AuthService = {
  /**
   * Handles user registration
   * @param {Object} userData - User registration data
   * @returns {Promise<{token: string, email: string}>} Registration result
   */
  async signup(userData) {
    console.group('[Auth] Signup Process');
    try {
      console.debug('Submitting registration for:', userData.email);
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.SIGNUP}`, 
        userData,
        { timeout: 10000 }
      );

      const result = processAuthResponse(response);
      await manageAuthToken(result.token);
      
      console.debug('Signup successful:', result.email);
      return {
        token: result.token,
        email: userData.email,
        ...(result.StudentID && { StudentID: result.StudentID })
      };
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = 'Email already registered';
        } else if (error.response.data?.errors) {
          errorMessage = Object.values(error.response.data.errors).join('\n');
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
        console.error('Server responded with:', error.response.data);
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection.';
      } else {
        console.error('Network/request error:', error.message);
      }
      
      throw new Error(errorMessage);
    } finally {
      console.groupEnd();
    }
  },

  /**
   * Handles user login
   * @param {Object} credentials - Login credentials
   * @returns {Promise<{token: string, email: string, StudentID?: string}>} Login result
   */
  async login(credentials) {
    console.group('[Auth] Login Process');
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.LOGIN}`,
        credentials,
        { timeout: 10000 }
      );

      const result = processAuthResponse(response);
      await manageAuthToken(result.token);
      
      console.debug('Login successful for:', result.email);
      return {
        token: result.token,
        email: credentials.email,
        ...(credentials.StudentID && { StudentID: credentials.StudentID })
      };
    } catch (error) {
      let errorMessage = 'Login failed. Please check your credentials.';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid email or password';
        } else if (error.response.status === 403) {
          errorMessage = 'Account not verified';
        } else if (error.response.data?.errors) {
          errorMessage = Object.values(error.response.data.errors).join('\n');
        } else {
          errorMessage = error.response.data?.message || errorMessage;
        }
        console.error('Login error:', error.response.data);
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Request timed out. Please check your connection.';
      } else {
        console.error('Login failed:', error.message);
      }
      
      throw new Error(errorMessage);
    } finally {
      console.groupEnd();
    }
  },

  /**
   * Handles user logout
   * @returns {Promise<{success: boolean}>} Logout result
   */
  async logout() {
    console.group('[Auth] Logout Process');
    try {
      const token = await getAuthToken();
      if (token) {
        await axios.post(
          `${APIConfig.BASE_URL}${APIConfig.AUTH.LOGOUT}`,
          null,
          { 
            headers: { 'Authorization': `Bearer ${token}` },
            timeout: 5000
          }
        );
      }
      await manageAuthToken(null);
      return { success: true };
    } catch (error) {
      console.error('Logout API failed, clearing token anyway:', error.message);
      await manageAuthToken(null);
      return { success: true }; // Consider logout successful even if API fails
    } finally {
      console.groupEnd();
    }
  },

  /**
   * Refresh authentication token
   * @param {string} currentToken - Current JWT token
   * @returns {Promise<string>} New token
   */
  async refreshToken(currentToken) {
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.REFRESH}`,
        { token: currentToken },
        { timeout: 10000 }
      );
      
      const newToken = response.data?.token;
      if (newToken) {
        await manageAuthToken(newToken);
        return newToken;
      }
      throw new Error('No token in refresh response');
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw new Error('Session refresh failed');
    }
  },

  /**
   * Verify token validity
   * @param {string} token - JWT token to verify
   * @returns {Promise<{valid: boolean, payload?: object}>} Verification result
   */
  async verifyToken(token) {
    try {
      const payload = await verifyToken(token);
      return { valid: !!payload, payload };
    } catch (error) {
      console.error('Token verification failed:', error);
      return { valid: false };
    }
  },

  /**
   * Initiates password reset process
   * @param {string} email - User email
   * @returns {Promise<{success: boolean, message?: string}>} Reset request result
   */
  async forgotPassword(email) {
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.FORGOT}`,
        { email },
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      let errorMessage = 'Password reset request failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    }
  },
  
  /**
   * Completes password reset process
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<{success: boolean, message?: string}>} Reset result
   */
  async resetPassword(token, newPassword) {
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.RESET}`,
        { token, newPassword },
        { timeout: 10000 }
      );
      return response.data;
    } catch (error) {
      let errorMessage = 'Password reset failed';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      throw new Error(errorMessage);
    }
  },
};

export default AuthService;