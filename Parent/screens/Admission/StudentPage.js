import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderInput, renderDateInput, renderSwitch } from '../../components/Admission/FormComponents';

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
    justifyContent: 'flex-end',
    marginTop: 20,
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

const StudentFormPage = ({ navigation }) => {
  const { validateForm } = useContext(AdmissionContext);

  const handleNext = async () => {
    // Validate only student section before proceeding
    const errors = await validateForm();
    const studentErrors = errors?.student || {};
    
    if (Object.keys(studentErrors).length === 0) {
      navigation.navigate('Parent');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Student Information</Text>
      
      {renderInput('Surname *', 'student.surName')}
      {renderInput('First Name *', 'student.firstName')}
      {renderInput('Middle Name', 'student.middleName')}
      {renderInput('Gender *', 'student.gender')}
      {renderDateInput('Date of Birth *', 'student.dateOfBirth')}
      
      <Text style={styles.sectionSubtitle}>Address</Text>
      {renderInput('Street', 'student.residentialAddress.street')}
      {renderInput('House Number', 'student.residentialAddress.houseNumber')}
      {renderInput('City *', 'student.residentialAddress.city')}
      {renderInput('Region/State *', 'student.residentialAddress.region')}
      {renderInput('Country *', 'student.residentialAddress.country')}
      {renderInput('Hometown', 'student.residentialAddress.homeTown')}
      
      <Text style={styles.sectionSubtitle}>Family Information</Text>
      {renderInput('Nationality *', 'student.nationality')}
      {renderInput('Lives With *', 'student.livesWith')}
      {renderInput('Number of Siblings', 'student.numberOfSiblings', 'numeric')}
      {renderInput('Older Siblings', 'student.olderSiblings', 'numeric')}
      {renderInput('Younger Siblings', 'student.youngerSiblings', 'numeric')}
      {renderInput('Other Children in House', 'student.otherChildrenInHouse', 'numeric')}
      
      <Text style={styles.sectionSubtitle}>Medical Information</Text>
      {renderInput('Blood Type *', 'student.medicalInformation.bloodType')}
      {renderInput('Allergies/Conditions *', 'student.medicalInformation.allergiesOrConditions')}
      {renderInput('Emergency Contact Name *', 'student.medicalInformation.emergencyContactsName')}
      {renderInput('Emergency Contact Number *', 'student.medicalInformation.emergencyContactsNumber', 'phone-pad')}
      {renderSwitch('Child Immunized', 'student.medicalInformation.isChildImmunized')}

      <View style={styles.buttonContainer}>
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

export default StudentFormPage;