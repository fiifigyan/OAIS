import React, { useContext, useState } from 'react';
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
    errorContainer: {
    backgroundColor: '#ffebee',
    padding: 10,
    borderRadius: 4,
    marginBottom: 10,
  },
  errorText: {
    color: '#d32f2f',
  },
});

const StudentFormPage = ({ navigation }) => {
  const { 
    formData, 
    formErrors,
    validateSection,
    setFormFieldValue 
  } = useContext(AdmissionContext);
  const [sectionErrors, setSectionErrors] = useState({});

  const handleNext = async () => {
    const errors = await validateSection('student', formData.student);
    setSectionErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      navigation.navigate('Parent');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Student Information</Text>
      {Object.keys(sectionErrors).length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Please fix all errors before proceeding
          </Text>
        </View>
      )}
      
      {/* Student Information */}
      {renderInput('Surname *', 'student.surName', formErrors.student?.surName)}
      {renderInput('First Name *', 'student.firstName', formErrors.student?.firstName)}
      {renderInput('Middle Name', 'student.middleName', formErrors.student?.middleName)}
      {renderInput('Gender *', 'student.gender', formErrors.student?.gender)}
      {renderDateInput('Date of Birth *', 'student.dateOfBirth', formErrors.student?.dateOfBirth)}

      {/* Residential Address */}
      <Text style={styles.sectionSubtitle}>Address</Text>
      {renderInput('Street', 'student.residentialAddress.street', formErrors.student?.residentialAddress?.street)}
      {renderInput('House Number', 'student.residentialAddress.houseNumber', formErrors.student?.residentialAddress?.houseNumber)}
      {renderInput('City *', 'student.residentialAddress.city', formErrors.student?.residentialAddress?.city)}
      {renderInput('Region/State *', 'student.residentialAddress.region', formErrors.student?.residentialAddress?.region)}
      {renderInput('Country *', 'student.residentialAddress.country', formErrors.student?.residentialAddress?.country)}
      {renderInput('Home Town', 'student.residentialAddress.homeTown', formErrors.student?.residentialAddress?.homeTown)}
      {renderInput('Religion', 'student.religion', formErrors.student?.religion)}
      
      {/* Render the parent/guardian section */}
      <Text style={styles.sectionSubtitle}>Family Information</Text>
      {renderInput('Nationality *', 'student.nationality', formErrors.student?.nationality)}
      {renderInput('Lives With *', 'student.livesWith', formErrors.student?.livesWith)}
      {renderInput('Number of Siblings', 'student.numberOfSiblings', formErrors.student?.numberOfSiblings, 'numeric')}
      {renderInput('Older Siblings', 'student.olderSiblings', formErrors.student?.olderSiblings, 'numeric')}
      {renderInput('Younger Siblings', 'student.youngerSiblings', formErrors.student?.youngerSiblings, 'numeric')}
      {renderInput('Other Children in House', 'student.otherChildrenInHouse', formErrors.student?.otherChildrenInHouse, 'numeric')}
      
      {/* Medical Information */}
      <Text style={styles.sectionSubtitle}>Medical Information</Text>
      {renderInput('Blood Type *', 'student.medicalInformation.bloodType', formErrors.student?.medicalInformation?.bloodType)}
      {renderInput('Allergies/Conditions *', 'student.medicalInformation.allergiesOrConditions', formErrors.student?.medicalInformation?.allergiesOrConditions)}
      {renderInput('Emergency Contact Name *', 'student.medicalInformation.emergencyContactsName', formErrors.student?.medicalInformation?.emergencyContactsName)}
      {renderInput('Emergency Contact Number *', 'student.medicalInformation.emergencyContactsNumber', formErrors.student?.medicalInformation?.emergencyContactsNumber, 'phone-pad')}
      {renderSwitch('Child Immunized', 'student.medicalInformation.isChildImmunized', formErrors.student?.medicalInformation?.isChildImmunized)}

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