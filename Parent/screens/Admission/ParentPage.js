import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderInput } from '../../components/Admission/FormComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#03AC13',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#03AC13',
    marginTop: 12,
    marginBottom: 8,
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
    borderColor: '#03AC13',
  },
  backButtonText: {
    color: '#03AC13',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#03AC13',
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
  const { formData, updateFormData, validationErrors } = useContext(AdmissionContext);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Father's Information</Text>
      {renderInput('Surname *', 'parentGuardian.fatherSurName', formData, updateFormData, validationErrors)}
      {renderInput('First Name *', 'parentGuardian.fatherFirstName', formData, updateFormData, validationErrors)}
      {renderInput('Middle Name', 'parentGuardian.fatherMiddleName', formData, updateFormData, validationErrors)}
      
      <Text style={styles.sectionSubtitle}>Father's Address</Text>
      {renderInput('Street', 'parentGuardian.fatherAddress.street', formData, updateFormData, validationErrors)}
      {renderInput('House Number', 'parentGuardian.fatherAddress.houseNumber', formData, updateFormData, validationErrors)}
      {renderInput('City *', 'parentGuardian.fatherAddress.city', formData, updateFormData, validationErrors)}
      {renderInput('Region/State *', 'parentGuardian.fatherAddress.region', formData, updateFormData, validationErrors)}
      {renderInput('Country *', 'parentGuardian.fatherAddress.country', formData, updateFormData, validationErrors)}
      
      {renderInput('Religion', 'parentGuardian.fatherReligion', formData, updateFormData, validationErrors)}
      {renderInput('Contact Number *', 'parentGuardian.fatherContactNumber', formData, updateFormData, validationErrors, 'phone-pad')}
      {renderInput('Occupation *', 'parentGuardian.fatherOccupation', formData, updateFormData, validationErrors)}
      {renderInput('Company Name', 'parentGuardian.fatherCompanyName', formData, updateFormData, validationErrors)}
      {renderInput('Business Address', 'parentGuardian.fatherBusinessAddress', formData, updateFormData, validationErrors)}
      {renderInput('Email Address *', 'parentGuardian.fatherEmailAddress', formData, updateFormData, validationErrors, 'email-address')}

      <Text style={styles.sectionTitle}>Mother's Information</Text>
      {renderInput('Surname *', 'parentGuardian.motherSurName', formData, updateFormData, validationErrors)}
      {renderInput('First Name *', 'parentGuardian.motherFirstName', formData, updateFormData, validationErrors)}
      {renderInput('Middle Name', 'parentGuardian.motherMiddleName', formData, updateFormData, validationErrors)}
      
      <Text style={styles.sectionSubtitle}>Mother's Address</Text>
      {renderInput('Street', 'parentGuardian.motherAddress.street', formData, updateFormData, validationErrors)}
      {renderInput('House Number', 'parentGuardian.motherAddress.houseNumber', formData, updateFormData, validationErrors)}
      {renderInput('City *', 'parentGuardian.motherAddress.city', formData, updateFormData, validationErrors)}
      {renderInput('Region/State *', 'parentGuardian.motherAddress.region', formData, updateFormData, validationErrors)}
      {renderInput('Country *', 'parentGuardian.motherAddress.country', formData, updateFormData, validationErrors)}
      
      {renderInput('Religion', 'parentGuardian.motherReligion', formData, updateFormData, validationErrors)}
      {renderInput('Contact Number *', 'parentGuardian.motherContactNumber', formData, updateFormData, validationErrors, 'phone-pad')}
      {renderInput('Occupation *', 'parentGuardian.motherOccupation', formData, updateFormData, validationErrors)}
      {renderInput('Company Name', 'parentGuardian.motherCompanyName', formData, updateFormData, validationErrors)}
      {renderInput('Business Address', 'parentGuardian.motherBusinessAddress', formData, updateFormData, validationErrors)}
      {renderInput('Email Address *', 'parentGuardian.motherEmailAddress', formData, updateFormData, validationErrors, 'email-address')}

      <Text style={styles.sectionTitle}>Additional Contacts</Text>
      {renderInput('Additional Contact Name', 'additionalContact.fullName', formData, updateFormData, validationErrors)}
      {renderInput('Contact Number', 'additionalContact.contactNumber', formData, updateFormData, validationErrors, 'phone-pad')}
      {renderInput('Relationship', 'additionalContact.relationshipToPupil', formData, updateFormData, validationErrors)}
      
      {renderInput('Authorized Pickup Name', 'authorizedPickup.fullName', formData, updateFormData, validationErrors)}
      {renderInput('Contact Number', 'authorizedPickup.contactNumber', formData, updateFormData, validationErrors, 'phone-pad')}
      {renderInput('Relationship', 'authorizedPickup.relationshipToPupil', formData, updateFormData, validationErrors)}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => navigation.navigate('AcademicPage')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ParentFormPage;