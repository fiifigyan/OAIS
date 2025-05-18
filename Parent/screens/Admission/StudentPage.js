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
    justifyContent: 'flex-end',
    marginTop: 20,
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

const StudentFormPage = ({ navigation }) => {
  const { formData, updateFormData, validationErrors } = useContext(AdmissionContext);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Student Information</Text>
      
      {renderInput('Surname *', 'student.surName', formData, updateFormData, validationErrors)}
      {renderInput('First Name *', 'student.firstName', formData, updateFormData, validationErrors)}
      {renderInput('Middle Name', 'student.middleName', formData, updateFormData, validationErrors)}
      {renderInput('Gender *', 'student.gender', formData, updateFormData, validationErrors)}
      {renderDateInput('Date of Birth *', 'student.dateOfBirth', formData, updateFormData, validationErrors)}
      
      <Text style={styles.sectionSubtitle}>Address</Text>
      {renderInput('Street', 'student.residentialAddress.street', formData, updateFormData, validationErrors)}
      {renderInput('House Number', 'student.residentialAddress.houseNumber', formData, updateFormData, validationErrors)}
      {renderInput('City *', 'student.residentialAddress.city', formData, updateFormData, validationErrors)}
      {renderInput('Region/State *', 'student.residentialAddress.region', formData, updateFormData, validationErrors)}
      {renderInput('Country *', 'student.residentialAddress.country', formData, updateFormData, validationErrors)}
      {renderInput('Hometown', 'student.residentialAddress.homeTown', formData, updateFormData, validationErrors)}
      
      <Text style={styles.sectionSubtitle}>Family Information</Text>
      {renderInput('Nationality *', 'student.nationality', formData, updateFormData, validationErrors)}
      {renderInput('Lives With *', 'student.livesWith', formData, updateFormData, validationErrors)}
      {renderInput('Number of Siblings', 'student.numberOfSiblings', formData, updateFormData, validationErrors, 'numeric')}
      {renderInput('Older Siblings', 'student.olderSiblings', formData, updateFormData, validationErrors, 'numeric')}
      {renderInput('Younger Siblings', 'student.youngerSiblings', formData, updateFormData, validationErrors, 'numeric')}
      {renderInput('Other Children in House', 'student.otherChildrenInHouse', formData, updateFormData, validationErrors, 'numeric')}
      
      <Text style={styles.sectionSubtitle}>Medical Information</Text>
      {renderInput('Blood Type *', 'student.medicalInformation.bloodType', formData, updateFormData, validationErrors)}
      {renderInput('Allergies/Conditions *', 'student.medicalInformation.allergiesOrConditions', formData, updateFormData, validationErrors)}
      {renderInput('Emergency Contact Name *', 'student.medicalInformation.emergencyContactsName', formData, updateFormData, validationErrors)}
      {renderInput('Emergency Contact Number *', 'student.medicalInformation.emergencyContactsNumber', formData, updateFormData, validationErrors, 'phone-pad')}
      {renderSwitch('Child Immunized', 'student.medicalInformation.isChildImmunized', formData, updateFormData)}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.nextButton}
          onPress={() => navigation.navigate('ParentPage')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default StudentFormPage;