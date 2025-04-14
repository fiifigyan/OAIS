import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import Icon from 'react-native-vector-icons/Ionicons';
import * as LocalAuthentication from 'expo-local-authentication';

const BiometricScreen = ({ navigation }) => {
  const { biometricLogin, logout } = useAuth();
  const [error, setError] = useState(null);
  const [biometricType, setBiometricType] = useState(null);

  useEffect(() => {
    checkBiometricType();
    handleBiometricAuth();
  }, []);

  const checkBiometricType = async () => {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      setBiometricType('Face ID');
    } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      setBiometricType('Touch ID');
    } else {
      setBiometricType('Biometric');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const success = await biometricLogin();
      if (success) {
        navigation.replace('Home');
      }
    } catch (err) {
      setError('Biometric authentication failed. Please try again.');
    }
  };

  const handleUsePassword = () => {
    logout();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {biometricType === 'Face ID' ? (
          <Icon name="face-recognition" size={80} color="#03AC13" />
        ) : (
          <Icon name="finger-print" size={80} color="#03AC13" />
        )}
      </View>
      
      <Text style={styles.title}>Use {biometricType} to Login</Text>
      <Text style={styles.subtitle}>Authenticate to access your account</Text>

      {error && (
        <View style={styles.errorContainer}>
          <Icon name="warning" size={20} color="#d32f2f" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.button} 
        onPress={handleBiometricAuth}
      >
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={handleUsePassword}>
        <Text style={styles.passwordText}>Use Password Instead</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'aliceblue'
  },
  iconContainer: {
    marginBottom: 30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#03AC13',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
    marginBottom: 20
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold'
  },
  passwordText: {
    color: '#03AC13',
    fontSize: 16,
    fontWeight: '600'
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20
  },
  errorText: {
    color: '#d32f2f',
    marginLeft: 10
  }
});

export default BiometricScreen;