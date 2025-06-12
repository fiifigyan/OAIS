import axios from 'axios';
import { manageAuthToken, sanitizeError, decodeToken, logger } from '../utils/helpers';
import { APIConfig } from '../config';

/**
 * Authentication service for handling all auth-related API calls
 */
const AuthService = {
  /**
   * Handles user registration
   * @param {object} userData - User registration data
   * @returns {Promise<object>} Object containing success status, message, and user data
   * @throws {Error} With user-friendly message if registration fails
   */
  async signup(userData) {
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.SIGNUP}`,
        userData,
        { 
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data?.token) {
        throw new Error('Registration failed: No authentication token received');
      }

      const tokenData = decodeToken(response.data.token);
      if (!tokenData?.scope || !tokenData?.signUpId) {
        throw new Error('Invalid token data received from server');
      }

      await manageAuthToken(response.data.token);
      
      return {
        message: response.data.message || 'Registration successful! Welcome to our platform.',
        token: response.data.token,
      };
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('Registration error:', friendlyError);
      throw new Error(friendlyError || 'Registration failed. Please check your details and try again.');
    }
  },

  /**
   * Handles user login
   * @param {object} credentials - Login credentials (email, password)
   * @returns {Promise<object>} Object containing success status, message, and user data
   * @throws {Error} With user-friendly message if login fails
   */
  async login(credentials) {
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.LOGIN}`,
        credentials,
        { 
          timeout: 30000,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data?.token) {
        throw new Error('Login failed: No authentication token received');
      }

      const tokenData = decodeToken(response.data.token);
      if (!tokenData?.email || !tokenData?.studentId || !tokenData?.signUpId) {
        throw new Error('Invalid token data received from server');
      }

      await manageAuthToken(response.data.token);
      
      return {
        message: response.data.message || 'Login successful! Welcome back.',
        token: response.data.token,
        // email: tokenData.email,
        // studentId: tokenData.studentId,
        // signUpId: tokenData.signUpId
      };
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('Login error:', friendlyError);
      throw new Error(friendlyError || 'Login failed. Please check your credentials and try again.');
    }
  },

  /**
   * Handles user logout
   * @returns {Promise<object>} Object indicating logout success
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
  // async logout() {
  //   try {
  //     await manageAuthToken(null);
  //     return { 
  //       message: 'Logged out successfully' 
  //     };
  //   } catch (error) {
  //     const friendlyError = sanitizeError(error);
  //     console.error('Logout error:', friendlyError);
  //     throw new Error(friendlyError || 'Failed to logout properly. Please try again.');
  //   }
  // },

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
  },

  /**
   * Retrieves the current user's account information
   * @returns {Promise<object>} User account data
   * @throws {Error} If fetching account data fails
   */
  async getAccounts() {
    try {
      const response = await axios.get(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.ACCOUNT}`,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error) {
      throw new Error(sanitizeError(error));
    }
  },

  /**
   * Adds a new account for the user
   * @param {object} accountData - Account data to be added
   * @returns {Promise<object>} Result of the account addition
   * @throws {Error} If adding account fails
   */

  async addAccount(accountData) {
    try {
      const response = await axios.post(
        `${APIConfig.BASE_URL}${APIConfig.AUTH.ACCOUNT}`,
        accountData,
        { timeout: 30000 }
      );
      return response.data;
    } catch (error) {
      throw new Error(sanitizeError(error));
    }
  }
};

export default AuthService;