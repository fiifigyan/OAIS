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
    color: '#00873E',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00873E',
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
  const { validateForm } = useContext(AdmissionContext);

  const handleNext = async () => {
    // Validate only parent section before proceeding
    const errors = await validateForm();
    const parentErrors = errors?.parentGuardian || {};
    
    if (Object.keys(parentErrors).length === 0) {
      navigation.navigate('Academic');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Father's Information</Text>
      {renderInput('Surname *', 'parentGuardian.fatherSurName')}
      {renderInput('First Name *', 'parentGuardian.fatherFirstName')}
      {renderInput('Middle Name', 'parentGuardian.fatherMiddleName')}
      
      <Text style={styles.sectionSubtitle}>Father's Address</Text>
      {renderInput('Street', 'parentGuardian.fatherAddress.street')}
      {renderInput('House Number', 'parentGuardian.fatherAddress.houseNumber')}
      {renderInput('City *', 'parentGuardian.fatherAddress.city')}
      {renderInput('Region/State *', 'parentGuardian.fatherAddress.region')}
      {renderInput('Country *', 'parentGuardian.fatherAddress.country')}
      
      {renderInput('Religion', 'parentGuardian.fatherReligion')}
      {renderInput('Contact Number *', 'parentGuardian.fatherContactNumber', 'phone-pad')}
      {renderInput('Occupation *', 'parentGuardian.fatherOccupation')}
      {renderInput('Company Name', 'parentGuardian.fatherCompanyName')}
      {renderInput('Business Address', 'parentGuardian.fatherBusinessAddress')}
      {renderInput('Email Address *', 'parentGuardian.fatherEmailAddress', 'email-address')}

      <Text style={styles.sectionTitle}>Mother's Information</Text>
      {renderInput('Surname *', 'parentGuardian.motherSurName')}
      {renderInput('First Name *', 'parentGuardian.motherFirstName')}
      {renderInput('Middle Name', 'parentGuardian.motherMiddleName')}
      
      <Text style={styles.sectionSubtitle}>Mother's Address</Text>
      {renderInput('Street', 'parentGuardian.motherAddress.street')}
      {renderInput('House Number', 'parentGuardian.motherAddress.houseNumber')}
      {renderInput('City *', 'parentGuardian.motherAddress.city')}
      {renderInput('Region/State *', 'parentGuardian.motherAddress.region')}
      {renderInput('Country *', 'parentGuardian.motherAddress.country')}
      
      {renderInput('Religion', 'parentGuardian.motherReligion')}
      {renderInput('Contact Number *', 'parentGuardian.motherContactNumber', 'phone-pad')}
      {renderInput('Occupation *', 'parentGuardian.motherOccupation')}
      {renderInput('Company Name', 'parentGuardian.motherCompanyName')}
      {renderInput('Business Address', 'parentGuardian.motherBusinessAddress')}
      {renderInput('Email Address *', 'parentGuardian.motherEmailAddress', 'email-address')}

      <Text style={styles.sectionTitle}>Additional Contacts</Text>
      {renderInput('Additional Contact Name', 'additionalContact.fullName')}
      {renderInput('Contact Number', 'additionalContact.contactNumber', 'phone-pad')}
      {renderInput('Relationship', 'additionalContact.relationshipToPupil')}
      
      {renderInput('Authorized Pickup Name', 'authorizedPickup.fullName')}
      {renderInput('Contact Number', 'authorizedPickup.contactNumber', 'phone-pad')}
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