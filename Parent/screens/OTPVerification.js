import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
} from 'react-native';

const OTPVerificationScreen = ({ 
  phoneNumber = '+233 (0) 20 123 4567',
  onVerify,
  onResend,
  onEdit,
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  // Handle input change for each digit
  const handleOtpChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleVerify = () => {
    const otpString = otp.join('');
    if (otpString.length === 6) {
      onVerify?.(otpString);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.subtitle}>
        Please enter the OTP sent to your number
      </Text>

      <View style={styles.numberContainer}>
        <Text style={styles.numberText}>{phoneNumber}</Text>
        <TouchableOpacity onPress={onEdit}>
          <Text style={styles.editText}>(Edit)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            maxLength={1}
            keyboardType="number-pad"
            value={digit}
            onChangeText={(value) => handleOtpChange(value, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <View style={styles.resendContainer}>
        <Text style={styles.resendText}>Didn't receive any OTP? </Text>
        <TouchableOpacity onPress={onResend}>
          <Text style={styles.resendButton}>Resend</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={[
          styles.verifyButton,
          otp.join('').length !== 6 && styles.verifyButtonDisabled
        ]}
        onPress={handleVerify}
        disabled={otp.join('').length !== 6}
      >
        <Text style={styles.verifyButtonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000080',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 16,
    color: 'white',
    marginTop: 8,
  },
  numberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  numberText: {
    fontSize: 16,
    color: 'white',
  },
  editText: {
    fontSize: 16,
    color: '#4169E1',
    marginLeft: 8,
    textDecorationLine: 'underline',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  otpInput: {
    width: 45,
    height: 45,
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
    backgroundColor: 'transparent',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  resendText: {
    color: 'white',
    fontSize: 14,
  },
  resendButton: {
    color: '#4169E1',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  verifyButton: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  verifyButtonDisabled: {
    opacity: 0.7,
  },
  verifyButtonText: {
    color: '#000080',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OTPVerificationScreen;