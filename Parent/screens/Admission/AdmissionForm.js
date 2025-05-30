import React from 'react';
import { AdmissionProvider } from '../../context/AdmissionContext';
import AdmissionNavigator from '../../navigation/AdmissionNavigator';
import { useNavigation } from '@react-navigation/native';

const AdmissionForm = () => {
  const navigation = useNavigation();
  
  return (
    <AdmissionProvider navigation={navigation}>
      <AdmissionNavigator />
    </AdmissionProvider>
  );
};

export default AdmissionForm;