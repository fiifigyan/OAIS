import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import StudentFormPage from '../screens/Admission/StudentPage';
import ParentFormPage from '../screens/Admission/ParentPage';
import AcademicFormPage from '../screens/Admission/AcademicPage';
import DocumentsFormPage from '../screens/Admission/DocumentsPage';
import ReviewFormPage from '../screens/Admission/ReviewPage';


const Stack = createNativeStackNavigator();

const AdmissionNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="StudentPage"
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen name="StudentPage" component={StudentFormPage} />
      <Stack.Screen name="ParentPage" component={ParentFormPage} />
      <Stack.Screen name="AcademicPage" component={AcademicFormPage} />
      <Stack.Screen name="DocumentsPage" component={DocumentsFormPage} />
      <Stack.Screen name="ReviewPage" component={ReviewFormPage} />
    </Stack.Navigator>
  );
};

export default AdmissionNavigator;