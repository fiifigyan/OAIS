import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen'
import ResetPasswordScreen from '../screens/ResetPasswordScreen'
import OnboardingScreen from '../screens/OnboardingScreen'

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
    >
    <Stack.Screen
      name='Onboard'
      component={OnboardingScreen}
    />
    <Stack.Screen
      name='Signup'
      component={SignupScreen}
    />
    <Stack.Screen
      name='Login'
      component={LoginScreen}
    />
    <Stack.Screen
      name='Forgot'
      component={ForgotPasswordScreen}
    />
    <Stack.Screen
      name='Reset'
      component={ResetPasswordScreen}
    />
    </Stack.Navigator>
  )
}

export default AuthStack