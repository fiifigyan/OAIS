import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, StyleSheet,} from 'react-native';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderInput, renderSectionHeader } from '../../components/Admission/FormComponents';

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
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>Parent/Guardian Information</Text>
      <Text style={styles.headerSubtitle}>
        Please fill in the details of the parent or guardian
      </Text>

      {Object.keys(sectionErrors).length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Please fill all required fields (*) before proceeding
          </Text>
        </View>
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

      {renderSectionHeader('Father\'s Information')}
      {renderInput('Surname *', 'parentGuardian.fatherSurName', formErrors.parentGuardian?.fatherSurName,'eg. Doe')}
      {renderInput('First Name *', 'parentGuardian.fatherFirstName', formErrors.parentGuardian?.fatherFirstName,'eg. John')}
      {renderInput('Middle Name', 'parentGuardian.fatherMiddleName')}

      {renderSectionHeader('Father\'s Address')}
      {renderInput('Street', 'parentGuardian.fatherAddress.street')}
      {renderInput('House Number', 'parentGuardian.fatherAddress.houseNumber')}
      {renderInput('City *', 'parentGuardian.fatherAddress.city', formErrors.parentGuardian?.fatherAddress?.city,'eg. Accra')}
      {renderInput('Region/State *', 'parentGuardian.fatherAddress.region', formErrors.parentGuardian?.fatherAddress?.region,'eg. Greater Accra')}
      {renderInput('Country *', 'parentGuardian.fatherAddress.country', formErrors.parentGuardian?.fatherAddress?.country,'eg. Ghana')}

      {renderInput('Religion', 'parentGuardian.fatherReligion')}
      {renderInput('Contact Number *', 'parentGuardian.fatherContactNumber', formErrors.parentGuardian?.fatherContactNumber,'eg. 0241234567', 'phone-pad',)}
      {renderInput('Occupation *', 'parentGuardian.fatherOccupation', formErrors.parentGuardian?.fatherOccupation,'eg. Teacher')}
      {renderInput('Company Name', 'parentGuardian.fatherCompanyName')}
      {renderInput('Business Address', 'parentGuardian.fatherBusinessAddress')}
      {renderInput('Email Address *', 'parentGuardian.fatherEmailAddress', formErrors.parentGuardian?.fatherEmailAddress,'eg. father@example.com', 'email-address')}

      {renderSectionHeader('Mother\'s Information')}
      {renderInput('Surname *', 'parentGuardian.motherSurName', formErrors.parentGuardian?.motherSurName,'eg. Doe')}
      {renderInput('First Name *', 'parentGuardian.motherFirstName', formErrors.parentGuardian?.motherFirstName,'eg. Jane')}
      {renderInput('Middle Name', 'parentGuardian.motherMiddleName')}

      {renderSectionHeader('Mother\'s Address')}
      {renderInput('Street', 'parentGuardian.motherAddress.street')}
      {renderInput('House Number', 'parentGuardian.motherAddress.houseNumber')}
      {renderInput('City *', 'parentGuardian.motherAddress.city', formErrors.parentGuardian?.motherAddress?.city,'eg. Accra')}
      {renderInput('Region/State *', 'parentGuardian.motherAddress.region', formErrors.parentGuardian?.motherAddress?.region,'eg. Greater Accra')}
      {renderInput('Country *', 'parentGuardian.motherAddress.country', formErrors.parentGuardian?.motherAddress?.country,'eg. Ghana')}

      {renderInput('Religion', 'parentGuardian.motherReligion')}
      {renderInput('Contact Number *', 'parentGuardian.motherContactNumber', formErrors.parentGuardian?.motherContactNumber, 'eg. 0241234567', 'phone-pad')}
      {renderInput('Occupation *', 'parentGuardian.motherOccupation', formErrors.parentGuardian?.motherOccupation,'eg. Teacher')}
      {renderInput('Company Name', 'parentGuardian.motherCompanyName')}
      {renderInput('Business Address', 'parentGuardian.motherBusinessAddress')}
      {renderInput('Email Address *', 'parentGuardian.motherEmailAddress', formErrors.parentGuardian?.motherEmailAddress, 'eg. mother@example.com','email-address')}

      {renderSectionHeader('Additional Contacts')}
      {renderInput('Additional Contact Name', 'additionalContact.fullName')}
      {renderInput('Contact Number', 'additionalContact.contactNumber')}
      {renderInput('Relationship', 'additionalContact.relationshipToPupil')}
      
      {renderInput('Authorized Pickup Name', 'authorizedPickup.fullName')}
      {renderInput('Contact Number', 'authorizedPickup.contactNumber')}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00873E',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#999',
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 16,
  },
  content: {
    flexGrow: 1,
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
export default ParentFormPage;