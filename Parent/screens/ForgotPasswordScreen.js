import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, StyleSheet, SafeAreaView } from 'react-native';
import CustomInput from '../components/CustomInput';
import authService from '../services/authService';
import { AuthContext } from '../context/AuthContext';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      return 'Email is required';
    }
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(trimmedEmail)) {
      return 'Invalid email format';
    }
    return '';
  };

  const handleForgot = async () => {
    setTouched(true);
    const emailError = validateEmail();
    if (emailError) {
      setError(emailError);
      return;
    }

    try {
      setIsLoading(true);
      await authService.forgotPassword(email);
      Alert.alert(
        'Check Your Email',
        'If an account exists with this email, you will receive password reset instructions.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (err) {
      console.error('ForgotPassword Error:', err);
      Alert.alert('Error', err.message || 'Unable to process your request. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Reset Password</Text>
            <Text style={styles.subtitle}>
              Enter your email address and we'll send you instructions to reset your password.
            </Text>
          </View>
        
          <View style={styles.form}>
            <CustomInput
              name="email"
              label="Email Address"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => setEmail(text.trim())}
              error={touched ? error : ''}
              keyboardType="email-address"
              autoCapitalize="none"
              onBlur={() => {
                setTouched(true);
                const emailError = validateEmail();
                setError(emailError);
              }}
            />
            
            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]} 
              onPress={handleForgot}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Send</Text>
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'darkblue',
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#007AFF',
    alignItems: 'center',
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
    padding: 20,
    gap: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {    
    fontSize: 16,    
    fontWeight: 'bold',    
    color: '#FFFFFF',  
  },
  backButton: {    
    marginTop: 20,    
    alignItems: 'center',  
  },
  backButtonText: {    
    fontSize: 16,    
    color: '#007AFF',  
  },
});

export default ForgotPasswordScreen;
