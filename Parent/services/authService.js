import axios from 'axios';
import { manageAuthToken, getAuthToken, sanitizeError } from '../utils/helpers';
import { APIConfig } from '../config';

const AuthService = {
  /**
   * Handles user registration (returns temporary token)
   * @param {Object} userData - User registration data
   * @returns {Promise<{token: string, email: string, isTemporary: boolean, message?: string}>} Registration result
   */
  async signup(userData) {
    try {
    console.log('Full API URL:', `${APIConfig.BASE_URL}${APIConfig.AUTH.SIGNUP}`);
    console.log('Request payload:', userData);
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.SIGNUP}`,
        userData,
        { timeout: 10000 }
      );
      console.log('Response:', response.data);

      if (!response.data?.token) {
        throw new Error('Registration failed: No token received');
      }

      await manageAuthToken(response.data.token);
      return {
        message: response.data.message,
        token: response.data.token,
      };
    } catch (error) {
    console.error('Detailed registration error:', {
      message: error.message,
      response: error.response?.data,
      config: error.config
    });
      throw new Error(sanitizeError(error));
    }
  },

  /**
   * Handles user login (returns permanent token)
   * @param {Object} credentials - Login credentials
   * @returns {Promise<{token: string, email: string, StudentID: string, isTemporary: boolean, message?: string}>} Login result
   */
  async login(credentials) {
    try {
      console.log('API Endpoint:', `${APIConfig.BASE_URL}${APIConfig.AUTH.LOGIN}`);
      console.log('Credentials:', credentials);
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.LOGIN}`,
        credentials,
        { timeout: 10000 }
      );

      if (!response.data?.token) {
        throw new Error('Login failed: No token received');
      }

      await manageAuthToken(response.data.token);
      return {
        token: response.data.token,
        email: credentials.email,
        StudentID: response.data.StudentID,
        isTemporary: false,
        ...(response.data.message && { message: response.data.message })
      };
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(sanitizeError(error));
    }
  },

  /**
   * Handles user logout (only for permanent tokens)
   * @returns {Promise<{success: boolean}>} Logout result
   */
  async logout() {
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
      // Consider logout successful even if API fails
      await manageAuthToken(null);
      return { success: true };
    }
  },

  /**
   * Refresh authentication token (only for permanent tokens)
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
      if (!newToken) {
        throw new Error('No token in refresh response');
      }

      await manageAuthToken(newToken);
      return newToken;
    } catch (error) {
      console.error('Token refresh error:', error);
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
      throw new Error(sanitizeError(error));
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
      throw new Error(sanitizeError(error));
    }
  }
};

export default AuthService;