import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderInput, renderSectionHeader } from '../../components/Admission/FormComponents';
import { Ionicons } from '@expo/vector-icons';

const ParentFormPage = ({ navigation }) => {
  const { 
    formData, 
    formErrors,
    validateSection,
    setFormFieldValue 
  } = useContext(AdmissionContext);
  const [sectionErrors, setSectionErrors] = useState({});

  const handleNext = async () => {
    try {
      const errors = await validateSection('parent', formData.parentGuardian);
      setSectionErrors(errors);
      
      if (!errors || Object.keys(errors).length === 0) {
        navigation.navigate('Academic');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setSectionErrors({ general: 'Validation failed. Please check your inputs.' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>Parent/Guardian Information</Text>
      <Text style={styles.headerSubtitle}>
        Please fill in all required details (* indicates required field)
      </Text>

      {Object.keys(sectionErrors).length > 0 && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color="#d32f2f" />
          <Text style={styles.errorText}>
            Please fill all required fields before proceeding
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {renderSectionHeader('Father\'s Information')}
        {renderInput('Surname *', 'parentGuardian.fatherSurName', formErrors.parentGuardian?.fatherSurName, 'eg. Doe')}
        {renderInput('First Name *', 'parentGuardian.fatherFirstName', formErrors.parentGuardian?.fatherFirstName, 'eg. John')}
        {renderInput('Middle Name', 'parentGuardian.fatherMiddleName', formErrors.parentGuardian?.fatherMiddleName, 'eg. James')}

        {renderSectionHeader('Father\'s Address')}
        {renderInput('Street *', 'parentGuardian.fatherAddress.street', formErrors.parentGuardian?.fatherAddress?.street, 'eg. Main St')}
        {renderInput('House Number *', 'parentGuardian.fatherAddress.houseNumber', formErrors.parentGuardian?.fatherAddress?.houseNumber, 'eg. 123', 'numeric')}
        {renderInput('City *', 'parentGuardian.fatherAddress.city', formErrors.parentGuardian?.fatherAddress?.city, 'eg. Accra')}
        {renderInput('Region/State *', 'parentGuardian.fatherAddress.region', formErrors.parentGuardian?.fatherAddress?.region, 'eg. Greater Accra')}
        {renderInput('Country *', 'parentGuardian.fatherAddress.country', formErrors.parentGuardian?.fatherAddress?.country, 'eg. Ghana')}

        {renderInput('Religion', 'parentGuardian.fatherReligion', formErrors.parentGuardian?.fatherReligion, 'eg. Christian')}
        {renderInput('Contact Number *', 'parentGuardian.fatherContactNumber', formErrors.parentGuardian?.fatherContactNumber, 'eg. 0241234567', 'phone-pad')}
        {renderInput('Occupation *', 'parentGuardian.fatherOccupation', formErrors.parentGuardian?.fatherOccupation, 'eg. Teacher')}
        {renderInput('Company Name', 'parentGuardian.fatherCompanyName', formErrors.parentGuardian?.fatherCompanyName, 'eg. ABC Corp')}
        {renderInput('Business Address', 'parentGuardian.fatherBusinessAddress', formErrors.parentGuardian?.fatherBusinessAddress, 'eg. 123 Business St')}
        {renderInput('Email Address *', 'parentGuardian.fatherEmailAddress', formErrors.parentGuardian?.fatherEmailAddress, 'eg. father@example.com', 'email-address')}

        {renderSectionHeader('Mother\'s Information')}
        {renderInput('Surname *', 'parentGuardian.motherSurName', formErrors.parentGuardian?.motherSurName, 'eg. Doe')}
        {renderInput('First Name *', 'parentGuardian.motherFirstName', formErrors.parentGuardian?.motherFirstName, 'eg. Jane')}
        {renderInput('Middle Name', 'parentGuardian.motherMiddleName', formErrors.parentGuardian?.motherMiddleName, 'eg. Anne')}

        {renderSectionHeader('Mother\'s Address')}
        {renderInput('Street *', 'parentGuardian.motherAddress.street', formErrors.parentGuardian?.motherAddress?.street, 'eg. Main St')}
        {renderInput('House Number *', 'parentGuardian.motherAddress.houseNumber', formErrors.parentGuardian?.motherAddress?.houseNumber, 'eg. 123', 'numeric')}
        {renderInput('City *', 'parentGuardian.motherAddress.city', formErrors.parentGuardian?.motherAddress?.city, 'eg. Accra')}
        {renderInput('Region/State *', 'parentGuardian.motherAddress.region', formErrors.parentGuardian?.motherAddress?.region, 'eg. Greater Accra')}
        {renderInput('Country *', 'parentGuardian.motherAddress.country', formErrors.parentGuardian?.motherAddress?.country, 'eg. Ghana')}

        {renderInput('Religion', 'parentGuardian.motherReligion', formErrors.parentGuardian?.motherReligion, 'eg. Christian')}
        {renderInput('Contact Number *', 'parentGuardian.motherContactNumber', formErrors.parentGuardian?.motherContactNumber, 'eg. 0241234567', 'phone-pad')}
        {renderInput('Occupation *', 'parentGuardian.motherOccupation', formErrors.parentGuardian?.motherOccupation, 'eg. Teacher')}
        {renderInput('Company Name', 'parentGuardian.motherCompanyName', formErrors.parentGuardian?.motherCompanyName, 'eg. ABC Corp')}
        {renderInput('Business Address', 'parentGuardian.motherBusinessAddress', formErrors.parentGuardian?.motherBusinessAddress, 'eg. 123 Business St')}
        {renderInput('Email Address *', 'parentGuardian.motherEmailAddress', formErrors.parentGuardian?.motherEmailAddress, 'eg. mother@example.com', 'email-address')}

        {renderSectionHeader('Additional Contacts')}
        {renderInput('Additional Contact Name', 'additionalContact.fullName')}
        {renderInput('Contact Number', 'additionalContact.contactNumber', null, 'eg. 0241234567', 'phone-pad')}
        {renderInput('Relationship', 'additionalContact.relationshipToPupil')}
        
        {renderInput('Authorized Pickup Name', 'authorizedPickup.fullName')}
        {renderInput('Contact Number', 'authorizedPickup.contactNumber', null, 'eg. 0241234567', 'phone-pad')}
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00873E',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ffebee',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 14,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00873E',
  },
  backButtonText: {
    color: '#00873E',
    fontWeight: '600',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#00873E',
    borderRadius: 8,
    padding: 14,
    width: '48%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default ParentFormPage;