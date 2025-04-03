import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    student_ID: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const { login, isLoading } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.student_ID.trim()) {
      newErrors.student_ID = 'Student ID is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleLogin = async () => {
  if (!validateForm()) return;
  
  try {
    const credentials = {
      email: formData.email.trim().toLowerCase(),
      password: formData.password,
      student_ID: formData.student_ID.trim()
    };
    
    await login(credentials);
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  } catch (error) {
    let errorMessage = 'Login failed. Please try again.';
    
    // More specific error messages
    if (error.message.includes('credentials')) {
      errorMessage = 'Invalid email or password';
    } else if (error.message.includes('student ID')) {
      errorMessage = 'Student ID not found. Please ensure admission is approved.';
    } else if (error.message.includes('network')) {
      errorMessage = 'Network error. Please check your connection.';
    }
    
    setErrors({ submit: errorMessage });
  }
};

  return (
    <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Login and get started</Text>
        </View>
      <KeyboardAvoidingView style={styles.KeyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
            <CustomInput
              label="Student ID *"
              value={formData.student_ID}
              onChangeText={(text) => setFormData(prev => ({ ...prev, student_ID: text }))}
              error={errors.student_ID}
              placeholder="Enter student ID"
              leftIcon={<Icon name="card" size={20} color="#666" />}
            />

            <CustomInput
              label="Email *"
              value={formData.email}
              onChangeText={(text) => setFormData(prev => ({ ...prev, email: text }))}
              error={errors.email}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Icon name="mail" size={20} color="#666" />}
            />
            
            <CustomInput
              label="Password *"
              value={formData.password}
              onChangeText={(text) => setFormData(prev => ({ ...prev, password: text }))}
              error={errors.password}
              placeholder="Enter your password"
              secureTextEntry
              leftIcon={<Icon name="lock-closed" size={20} color="#666" />}
            />

            <TouchableOpacity 
              style={styles.forgotPassword} 
              onPress={() => navigation.navigate('Forgot')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {errors.submit && (
              <View style={styles.errorContainer}>
                <Icon name='sad-outline' size={20} color='red' />
                <Text style={styles.errorText}>{errors.submit}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <View style={styles.buttonContent}>
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                  ) : (
                  <Text style={styles.submitButtonText}>Login</Text>
                )}
              </View>
            </TouchableOpacity>

            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>Sign Up</Text>
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
    color: 'aliceblue',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: 'aliceblue',
  },
  form: {
    flex: 1,
    padding: 20,
    gap: 10,
    backgroundColor: '#f9f9f9',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
  },
  forgotPasswordText: {
    color: '#03AC13',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#03AC13',
    padding: 16,
    borderRadius: 12,
    marginTop: 24,
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
    color: 'aliceblue',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  signupText: {
    color: '#666',
    fontSize: 16,
  },
  signupLink: {
    color: '#03AC13',
    fontSize: 16,
    fontWeight: '600',
  },
  errorInput: {
    borderColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    borderRadius: 4,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
});

export default LoginScreen;