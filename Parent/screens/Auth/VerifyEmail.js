import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../components/CustomInput';

const VerifyEmailScreen = ({ navigation }) => {
  const { verifyEmail, resendVerification, userInfo } = useAuth();
  const route = useRoute();
  const [token, setToken] = useState(route.params?.token || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (route.params?.token) {
      handleVerify(route.params.token);
    }
  }, [route.params]);

  const handleVerify = async (verificationToken) => {
    setLoading(true);
    setError('');
    try {
      await verifyEmail(verificationToken || token);
      setMessage('Email verified successfully!');
      setTimeout(() => navigation.replace('Home'), 2000);
    } catch (err) {
      setError(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    setError('');
    try {
      await resendVerification(email);
      setMessage('Verification email resent successfully');
    } catch (err) {
      setError(err.message || 'Failed to resend verification');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Icon name="mail-open" size={60} color="#0B6623" />
      </View>

      <Text style={styles.title}>Verify Your Email</Text>
      <Text style={styles.subtitle}>
        We've sent a verification link to {email}. Please check your inbox.
      </Text>

      {!route.params?.token && (
        <CustomInput
          label="Verification Code"
          value={token}
          onChangeText={setToken}
          placeholder="Paste verification code here"
          autoCapitalize="none"
        />
      )}

      {message ? (
        <View style={styles.successContainer}>
          <Icon name="checkmark-circle" size={20} color="#4CAF50" />
          <Text style={styles.successText}>{message}</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Icon name="warning" size={20} color="#d32f2f" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {!route.params?.token && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleVerify()}
          disabled={loading || !token}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Verify Email</Text>
          )}
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.resendButton}
        onPress={handleResend}
        disabled={resendLoading}
      >
        {resendLoading ? (
          <ActivityIndicator color="#0B6623" />
        ) : (
          <Text style={styles.resendText}>Resend Verification Email</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={() => navigation.replace('Login')}
      >
        <Text style={styles.loginText}>Back to Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'aliceblue'
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333'
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666'
  },
  button: {
    backgroundColor: '#0B6623',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  resendButton: {
    padding: 15,
    alignItems: 'center',
    marginBottom: 15
  },
  resendText: {
    color: '#0B6623',
    fontSize: 16,
    fontWeight: '600'
  },
  loginButton: {
    padding: 15,
    alignItems: 'center'
  },
  loginText: {
    color: '#666',
    fontSize: 16
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
  },
  errorText: {
    color: '#d32f2f',
    marginLeft: 10
  },
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e9',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
  },
  successText: {
    color: '#4CAF50',
    marginLeft: 10
  }
});

export default VerifyEmailScreen;