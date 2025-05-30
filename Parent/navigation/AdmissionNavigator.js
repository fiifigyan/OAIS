import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdmissionBreakdown from '../screens/Admission/AdmissionBreakdown';
import AdmissionPurchase from '../screens/Admission/AdmissionPurchase';
import WelcomeScreen from '../screens/Admission/WelcomeScreen';
import TourScreen from '../screens/Admission/TourScreen';
import AdmissionStatus from '../screens/Admission/AdmissionStatus';
import StudentFormPage from '../screens/Admission/StudentPage';
import ParentFormPage from '../screens/Admission/ParentPage';
import AcademicFormPage from '../screens/Admission/AcademicPage';
import DocumentsFormPage from '../screens/Admission/DocumentsPage';
import ReviewFormPage from '../screens/Admission/ReviewPage';



const Stack = createNativeStackNavigator();

const AdmissionNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="Breakdown" component={AdmissionBreakdown} />
      <Stack.Screen name="Purchase" component={AdmissionPurchase} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Tour" component={TourScreen} />
      <Stack.Screen name="Status" component={AdmissionStatus} />
      <Stack.Screen name="Student" component={StudentFormPage} />
      <Stack.Screen name="Parent" component={ParentFormPage} />
      <Stack.Screen name="Academic" component={AcademicFormPage} />
      <Stack.Screen name="Documents" component={DocumentsFormPage} />
      <Stack.Screen name="Review" component={ReviewFormPage} />
    </Stack.Navigator>
  );
};

export default AdmissionNavigator;