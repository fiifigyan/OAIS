import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import AuthService from '../services/AuthService';
import Icon from 'react-native-vector-icons/Ionicons';
import { CustomInput } from '../components/CustomInput';
import { validateEmail } from '../utils/helpers';
import SuccessModal from '../components/SuccessModal';

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleReset = async () => {
    setError('');
    
    // Validate email
    if (!email.trim()) {
      return setError('Email is required');
    }
    
    if (!validateEmail(email.trim())) {
      return setError('Please enter a valid email address');
    }

    try {
      setIsLoading(true);
      await AuthService.forgotPassword(email.trim());
      setIsModalVisible(true);
    } catch (error) {
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {error ? (
            <View style={styles.errorContainer}>
              <Icon name="alert-circle" size={20} color="#d32f2f" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <CustomInput
            label="Email Address *"
            placeholder="Enter your registered email"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (error) setError('');
            }}
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="done"
            leftIcon={<Icon name="mail-outline" size={20} color="#666" />}
            error={error.includes('email') ? error : ''}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleReset}
            disabled={isLoading}
            accessibilityLabel="Send reset link button"
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Icon name="mail" size={20} color="#fff" />
                <Text style={styles.buttonText}>Send Reset Link</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.backLink}
            onPress={() => navigation.goBack()}
            disabled={isLoading}
          >
            <Text style={styles.backLinkText}>
              <Icon name="arrow-back" size={16} color="#03AC13" /> Back to Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={isModalVisible}
        onClose={handleModalClose}
        title="Reset Email Sent"
        message="We've sent a password reset link to your email address. Please check your inbox."
        buttonText="Return to Login"
        iconName="checkmark-circle"
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
  backLink: {
    alignSelf: 'center',
    marginTop: 24,
  },
  backLinkText: {
    color: '#03AC13',
    fontWeight: '600',
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

export default ForgotPasswordScreen;