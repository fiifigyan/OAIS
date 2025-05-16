import React, { useState, useContext } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView, 
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { CustomInput } from '../components/CustomInput';
import { AuthContext } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { validateEmail, validatePassword } from '../utils/helpers';

const PasswordRequirements = ({ password }) => {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
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

const SignupScreen = () => {
  const navigation = useNavigation();
  const { register, isLoading } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({
    email: false,
    password: false
  });

  const validateForm = () => {
    const newErrors = {};
    const trimmedEmail = formData.email.trim();

    if (!trimmedEmail) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password requirements not met';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;
    
    try {
      await register({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      
      // Navigate to verification or home screen after successful registration
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Registration failed. Please try again.' 
      });
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) validateForm();
  };

  const handleInputBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateForm();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Account</Text>
        <Text style={styles.subtitle}>Sign up and get started</Text>
      </View>
      
      <KeyboardAvoidingView 
        style={styles.KeyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <CustomInput
            label="Email *"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            onBlur={() => handleInputBlur('email')}
            error={touched.email && errors.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Icon name="mail" size={20} color="#666" />}
            editable={!isLoading}
          />

          <CustomInput
            label="Password *"
            value={formData.password}
            onChangeText={(text) => handleInputChange('password', text)}
            onBlur={() => handleInputBlur('password')}
            error={touched.password && errors.password}
            placeholder="Create a password"
            secureTextEntry
            leftIcon={<Icon name="lock-closed" size={20} color="#666" />}
            editable={!isLoading}
          />

          {formData.password.length > 0 && (
            <PasswordRequirements password={formData.password} />
          )}

          {errors.submit && (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={20} color="#d32f2f" />
              <Text style={styles.errorText}>{errors.submit}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.submitButton, 
              (isLoading || Object.keys(errors).length > 0) && styles.submitButtonDisabled
            ]}
            onPress={handleSignup}
            disabled={isLoading || Object.keys(errors).length > 0}
          >
            <View style={styles.buttonContent}>
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Icon name="person-add" size={20} color="#fff" />
                  <Text style={styles.submitButtonText}>Create Account</Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Login')}
              disabled={isLoading}
            >
              <Text style={styles.loginLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  KeyboardAvoidingView: {
    flex: 1
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
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
    borderBottomEndRadius: 80,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#ffffff',
  },
  requirementsContainer: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
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
    color: '#757575',
  },
  submitButton: {
    backgroundColor: '#03AC13',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#03AC13',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#ffebee',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    flex: 1,
  },
});

export default SignupScreen;