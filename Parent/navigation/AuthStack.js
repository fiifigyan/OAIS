import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Auth/Login';
import SignupScreen from '../screens/Auth/Signup';
import ForgotPasswordScreen from '../screens/Auth/ForgotPassword';
import ResetPasswordScreen from '../screens/Auth/ResetPassword';
import OnboardingScreen from '../screens/Auth/Onboarding';
import VerifyEmailScreen from '../screens/Auth/VerifyEmail';
import BiometricScreen from '../screens/Auth/Biometric';
import AddAccountScreen from '../screens/Main/AddAccount';
import SwitchAccountScreen from '../screens/Main/SwitchAccount';
import EditProfile from '../screens/Auth/EditProfile';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Onboard" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="Reset" component={ResetPasswordScreen} />
      <Stack.Screen name="Forgot" component={ForgotPasswordScreen} />
      <Stack.Screen name="Biometric" component={BiometricScreen} />
      <Stack.Screen name="Verify" component={VerifyEmailScreen} />
      <Stack.Screen name="AddAccount" component={AddAccountScreen} />
      <Stack.Screen name="SwitchAccount" component={SwitchAccountScreen} />
      <Stack.Screen name="EditProfile" component={EditProfile} />
    </Stack.Navigator>
  );
};

export default AuthStack;