import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import CustomInput from '../components/CustomInput';
import SuccessModal from '../components/SuccessModal';
import AuthService from '../services/AuthService';
import Icon from 'react-native-vector-icons/Ionicons';

const ResetPasswordScreen = ({ navigation, route }) => {
  const { token } = route.params || {};
  const [userInfo, setUserInfo] = useState({
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

  const validateField = (name, value) => {
    if (name === 'password') {
      if (value.length < 8) return 'Password must be at least 8 characters';
      if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
      if (!/[a-z]/.test(value)) return 'Password must contain at least one lowercase letter';
      if (!/\d/.test(value)) return 'Password must contain at least one number';
      if (!/[@$!%*?&]/.test(value)) return 'Password must contain at least one special character';
    }
    if (name === 'confirmPassword' && value !== userInfo.password) {
      return 'Passwords do not match';
    }
    return '';
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(userInfo).forEach((key) => {
      const error = validateField(key, userInfo[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = async () => {
    setTouched({ password: true, confirmPassword: true });
    if (validateForm()) {
      setIsLoading(true);
      try {
        await AuthService.confirmPasswordReset(token, userInfo.password);
        setIsModalVisible(true);
      } catch (error) {
        setErrors({ submit: error.message || 'Unable to reset password. Please try again later.' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (name, text) => {
    setUserInfo((prev) => ({ ...prev, [name]: text }));
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create New Password</Text>
        <Text style={styles.subtitle}>
          Your new password must be different from previously used passwords.
        </Text>
      </View>

      <ScrollView style={styles.form}>
        {errors.submit && (
          <View style={styles.errorContainer}>
            <Icon name="alert-circle" size={20} color="#d32f2f" />
            <Text style={styles.errorText}>{errors.submit}</Text>
          </View>
        )}

        <CustomInput
          name="password"
          label="New Password"
          placeholder="Enter new password"
          value={userInfo.password}
          onChangeText={(text) => handleInputChange('password', text)}
          error={touched.password ? errors.password : ''}
          secureTextEntry={!showPassword}
          onBlur={() => setTouched(prev => ({ ...prev, password: true }))}
          leftIcon={<Icon name="lock" size={24} color="#666666" />}
          rightIcon={
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <Icon name={showPassword ? "eye-off" : "eye"} size={24} color="#666666" />
            </TouchableOpacity>
          }
        />

        <CustomInput
          name="confirmPassword"
          label="Confirm New Password"
          placeholder="Confirm new password"
          value={userInfo.confirmPassword}
          onChangeText={(text) => handleInputChange('confirmPassword', text)}
          error={touched.confirmPassword ? errors.confirmPassword : ''}
          secureTextEntry={!showPassword}
          onBlur={() => setTouched(prev => ({ ...prev, confirmPassword: true }))}
          leftIcon={<Icon name="lock" size={24} color="#666666" />}
        />

        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={handleReset}
          disabled={isLoading}
          accessibilityLabel="Reset password button"
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>Reset Password</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.requirementsContainer}>
        <Text style={styles.requirementsTitle}>Password Requirements:</Text>
        {[
          'Minimum 8 characters',
          'At least one uppercase letter',
          'At least one lowercase letter',
          'At least one number',
          'At least one special character (@$!%*?&)'
        ].map((requirement, index) => (
          <Text key={index} style={styles.requirementItem}>
            • {requirement}
          </Text>
        ))}
      </View>

      <SuccessModal
        visible={isModalVisible}
        onClose={() => {
          setIsModalVisible(false);
          navigation.navigate('Login');
        }}
        title="Password Reset Successful"
        message="Your password has been reset successfully. You can now log in with your new password."
        buttonText="Go to Login"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  form: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  header: {
    padding: 20,
    backgroundColor: '#03AC13',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
  },
  button: {
    backgroundColor: '#03AC13',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  requirementsContainer: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 16,
    margin: 20,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  requirementItem: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    paddingLeft: 8,
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
  },
});

export default ResetPasswordScreen;