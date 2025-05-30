import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderInput, renderSectionHeader } from '../../components/Admission/FormComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  errorText: {
    color: '#d32f2f',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    padding: 12,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00873E',
  },
  backButtonText: {
    color: '#00873E',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#00873E',
    borderRadius: 4,
    padding: 12,
    width: 120,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

const ParentFormPage = ({ navigation }) => {
  const { 
    formData, 
    formErrors,
    validateSection,
    setFormFieldValue 
  } = useContext(AdmissionContext);
  const [sectionErrors, setSectionErrors] = useState({});

  const handleNext = async () => {
    const errors = await validateSection('parent', formData.parentGuardian);
    setSectionErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      navigation.navigate('Academic');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderSectionHeader('Parent Information', 'Please provide details for at least one parent')}

      {Object.keys(sectionErrors).length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Please fix all errors before proceeding
          </Text>
        </View>
      )}

      {renderSectionHeader('Father\'s Information')}
      {renderInput('Surname *', 'parentGuardian.fatherSurName', formErrors.parentGuardian?.fatherSurName)}
      {renderInput('First Name *', 'parentGuardian.fatherFirstName', formErrors.parentGuardian?.fatherFirstName)}
      {renderInput('Middle Name', 'parentGuardian.fatherMiddleName')}
      
      {renderSectionHeader('Father\'s Address')}
      {renderInput('Street', 'parentGuardian.fatherAddress.street')}
      {renderInput('House Number', 'parentGuardian.fatherAddress.houseNumber')}
      {renderInput('City *', 'parentGuardian.fatherAddress.city', formErrors.parentGuardian?.fatherAddress?.city)}
      {renderInput('Region/State *', 'parentGuardian.fatherAddress.region', formErrors.parentGuardian?.fatherAddress?.region)}
      {renderInput('Country *', 'parentGuardian.fatherAddress.country', formErrors.parentGuardian?.fatherAddress?.country)}
      
      {renderInput('Religion', 'parentGuardian.fatherReligion')}
      {renderInput('Contact Number *', 'parentGuardian.fatherContactNumber', formErrors.parentGuardian?.fatherContactNumber, 'phone-pad')}
      {renderInput('Occupation *', 'parentGuardian.fatherOccupation', formErrors.parentGuardian?.fatherOccupation)}
      {renderInput('Company Name', 'parentGuardian.fatherCompanyName')}
      {renderInput('Business Address', 'parentGuardian.fatherBusinessAddress')}
      {renderInput('Email Address *', 'parentGuardian.fatherEmailAddress', formErrors.parentGuardian?.fatherEmailAddress, 'email-address')}

      {renderSectionHeader('Mother\'s Information')}
      {renderInput('Surname *', 'parentGuardian.motherSurName', formErrors.parentGuardian?.motherSurName)}
      {renderInput('First Name *', 'parentGuardian.motherFirstName', formErrors.parentGuardian?.motherFirstName)}
      {renderInput('Middle Name', 'parentGuardian.motherMiddleName')}
      
      {renderSectionHeader('Mother\'s Address')}
      {renderInput('Street', 'parentGuardian.motherAddress.street')}
      {renderInput('House Number', 'parentGuardian.motherAddress.houseNumber')}
      {renderInput('City *', 'parentGuardian.motherAddress.city', formErrors.parentGuardian?.motherAddress?.city)}
      {renderInput('Region/State *', 'parentGuardian.motherAddress.region', formErrors.parentGuardian?.motherAddress?.region)}
      {renderInput('Country *', 'parentGuardian.motherAddress.country', formErrors.parentGuardian?.motherAddress?.country)}
      
      {renderInput('Religion', 'parentGuardian.motherReligion')}
      {renderInput('Contact Number *', 'parentGuardian.motherContactNumber', formErrors.parentGuardian?.motherContactNumber, 'phone-pad')}
      {renderInput('Occupation *', 'parentGuardian.motherOccupation', formErrors.parentGuardian?.motherOccupation)}
      {renderInput('Company Name', 'parentGuardian.motherCompanyName')}
      {renderInput('Business Address', 'parentGuardian.motherBusinessAddress')}
      {renderInput('Email Address *', 'parentGuardian.motherEmailAddress', formErrors.parentGuardian?.motherEmailAddress, 'email-address')}

      {renderSectionHeader('Additional Contacts')}
      {renderInput('Additional Contact Name', 'additionalContact.fullName')}
      {renderInput('Contact Number', 'additionalContact.contactNumber', null, 'phone-pad')}
      {renderInput('Relationship', 'additionalContact.relationshipToPupil')}
      
      {renderInput('Authorized Pickup Name', 'authorizedPickup.fullName')}
      {renderInput('Contact Number', 'authorizedPickup.contactNumber', null, 'phone-pad')}
      {renderInput('Relationship', 'authorizedPickup.relationshipToPupil')}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={handleNext}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ParentFormPage;