import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  ActivityIndicator, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import CustomInput from '../components/CustomInput';
import SuccessModal from '../components/SuccessModal';
import AuthService from '../services/AuthService';
import Icon from 'react-native-vector-icons/Ionicons';
import { validatePassword } from '../utils/helpers';

const PasswordRequirements = ({ password }) => {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
    { label: 'One special character (@$!%*?&)', met: /[@$!%*?&]/.test(password) }
  ];

  return (
    <View style={styles.requirementsContainer}>
      <Text style={styles.requirementsTitle}>Password Requirements:</Text>
      {requirements.map(({ label, met }, index) => (
        <View key={index} style={styles.requirementRow}>
          <Icon 
            name={met ? 'checkmark-circle' : 'close-circle'} 
            size={16} 
            color={met ? '#4CAF50' : '#F44336'} 
            style={styles.requirementIcon}
          />
          <Text style={[
            styles.requirementText,
            met ? styles.requirementMet : styles.requirementUnmet
          ]}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const ResetPasswordScreen = ({ navigation, route }) => {
  const { token } = route.params || {};
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: '',
  });
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    // Validate password
    if (!passwords.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(passwords.password)) {
      newErrors.password = 'Password does not meet requirements';
    }
    
    // Validate password confirmation
    if (!passwords.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (passwords.password !== passwords.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = async () => {
    setTouched({ password: true, confirmPassword: true });
    
    if (!validateForm()) return;
    
    try {
      setIsLoading(true);
      await AuthService.resetPassword(token, passwords.password);
      setIsModalVisible(true);
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Unable to reset password. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setPasswords(prev => ({ ...prev, [name]: value }));
    if (touched[name] && errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleInputBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Your new password must be different from previously used passwords
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {errors.submit && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={20} color="#d32f2f" />
              <Text style={styles.errorText}>{errors.submit}</Text>
            </View>
          )}

          <CustomInput
            label="New Password *"
            placeholder="Enter new password"
            value={passwords.password}
            onChangeText={(text) => handleInputChange('password', text)}
            onBlur={() => handleInputBlur('password')}
            error={touched.password && errors.password}
            secureTextEntry={!showPassword}
            leftIcon={<Icon name="lock-closed" size={20} color="#666" />}
            rightIcon={
              <TouchableOpacity onPress={togglePasswordVisibility}>
                <Icon 
                  name={showPassword ? "eye-off" : "eye"} 
                  size={20} 
                  color="#666" 
                />
              </TouchableOpacity>
            }
            editable={!isLoading}
          />

          <CustomInput
            label="Confirm Password *"
            placeholder="Confirm new password"
            value={passwords.confirmPassword}
            onChangeText={(text) => handleInputChange('confirmPassword', text)}
            onBlur={() => handleInputBlur('confirmPassword')}
            error={touched.confirmPassword && errors.confirmPassword}
            secureTextEntry={!showPassword}
            leftIcon={<Icon name="lock-closed" size={20} color="#666" />}
            editable={!isLoading}
          />

          {passwords.password.length > 0 && (
            <PasswordRequirements password={passwords.password} />
          )}

          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleReset}
            disabled={isLoading}
            accessibilityLabel="Reset password button"
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <View style={styles.buttonContent}>
                <Icon name="key" size={20} color="#fff" />
                <Text style={styles.buttonText}>Reset Password</Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={isModalVisible}
        onClose={handleModalClose}
        title="Password Reset Successful"
        message="Your password has been reset successfully. You can now log in with your new password."
        buttonText="Go to Login"
        iconName="checkmark-done"
        iconColor="#4CAF50"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    padding: 20,
    backgroundColor: '#03AC13',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderBottomEndRadius: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#03AC13',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  requirementsContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginVertical: 16,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  requirementIcon: {
    marginRight: 8,
  },
  requirementText: {
    fontSize: 14,
  },
  requirementMet: {
    color: '#4CAF50',
  },
  requirementUnmet: {
    color: '#F44336',
  },
  errorContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffebee',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
    alignItems: 'center',
    gap: 8,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    flex: 1,
  },
});

export default ResetPasswordScreen;