import axios from 'axios';
import { manageAuthToken, sanitizeError } from '../utils/helpers';
import { APIConfig } from '../config';

const AuthService = {
  /**
   * Handles user registration
   * @param {Object} userData - User registration data
   * @returns {Promise<{token: string, email: string, isTemporary: boolean}>} Registration result
   */
  async signup(userData) {
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.SIGNUP}`,
        userData,
        { timeout: 30000 }
      );

      if (!response.data?.token) {
        throw new Error('Registration failed: No token received');
      }

      await manageAuthToken(response.data.token);
      return response.data; // Backend should include isTemporary flag
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(sanitizeError(error));
    }
  },

  /**
   * Handles user login
   * @param {Object} credentials - Login credentials
   * @returns {Promise<{token: string, email: string, StudentID: string, isTemporary: boolean}>} Login result
   */
  async login(credentials) {
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.LOGIN}`,
        credentials,
        { timeout: 30000 }
      );

      if (!response.data?.token) {
        throw new Error('Login failed: No token received');
      }

      await manageAuthToken(response.data.token);
      return response.data; // Backend should include isTemporary flag
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(sanitizeError(error));
    }
  },

  /**
   * Handles user logout
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
   * Refresh authentication token
   * @param {string} currentToken - Current JWT token
   * @returns {Promise<string>} New token
   */
  async refreshToken(currentToken) {
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.REFRESH}`,
        { token: currentToken },
        { timeout: 30000 }
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
   * @returns {Promise<{valid: boolean, isTemporary?: boolean}>} Verification result
   */
  async verifyToken(token) {
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.VERIFY}`,
        { token },
        { timeout: 10000 }
      );
      
      return {
        valid: response.data?.valid || false,
        isTemporary: response.data?.isTemporary || false
      };
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
        { timeout: 30000 }
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
        { timeout: 30000 }
      );
      return response.data;
    } catch (error) {
      throw new Error(sanitizeError(error));
    }
  }
};

export default AuthService;