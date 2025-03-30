import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator, SafeAreaView, KeyboardAvoidingView } from 'react-native';
import { CustomInput } from '../components/CustomInput';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    student_ID: '',
    email: '',
    password: ''
  });
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const { login, isLoading } = useContext(AuthContext);

  const validateForm = () => {
    const newErrors = {};

    if (!userInfo.student_ID.trim()){
      newErrors.student_ID = 'Student ID is required';
    } else if ((userInfo.student_ID)) {
      newErrors.student_ID = 'Valid Student ID is required';
    }

    if (!userInfo.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!userInfo.password.trim()) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    setTouched(Object.keys(userInfo).reduce((touched, field) => ({ ...touched, [field]: true }), {}));
  
    if (!validateForm()) return;
  
    try {
      await login({
        student_ID: userInfo.student_ID.trim(),
        email: userInfo.email.trim().toLowerCase(),
        password: userInfo.password
      });
      setUserInfo({ student_ID: '', email: '', password: '' });
      //debuger
      console.log('User logged in successfully: ', userInfo);
    } catch (error) {
      console.error('Login Error:', error);
      setErrors(prev => ({
        ...prev,
        submit: error.message || 'Login failed. Please try again.'
      }));
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
              value={userInfo.student_ID}
              onChangeText={(text) => setUserInfo(prev => ({ ...prev, student_ID: text }))}
              error={errors.student_ID}
              placeholder="Enter student ID"
              leftIcon={<Icon name="card" size={20} color="#666" />}
            />

            <CustomInput
              label="Email *"
              value={userInfo.email}
              onChangeText={(text) => setUserInfo(prev => ({ ...prev, email: text }))}
              error={errors.email}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              leftIcon={<Icon name="mail" size={20} color="#666" />}
            />
            
            <CustomInput
              label="Password *"
              value={userInfo.password}
              onChangeText={(text) => setUserInfo(prev => ({ ...prev, password: text }))}
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
    backgroundColor: '#000080',
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
    color: '#000080',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#000080',
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
    color: '#ffffff',
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
    color: '#000080',
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