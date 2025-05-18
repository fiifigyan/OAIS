import React from 'react';
import { AdmissionProvider } from '../../context/AdmissionContext';
import AdmissionNavigator from '../../navigation/AdmissionNavigator';

const AdmissionForm = () => {
  return (
    <AdmissionProvider>
      <AdmissionNavigator />
    </AdmissionProvider>
  );
};

export default AdmissionForm;