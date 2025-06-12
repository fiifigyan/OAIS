import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderInput, renderDateInput, renderSwitch } from '../../components/Admission/FormComponents';
import { Ionicons } from '@expo/vector-icons';

const StudentFormPage = ({ navigation }) => {
  const { 
    formData, 
    formErrors,
    validateSection,
    setFormFieldValue 
  } = useContext(AdmissionContext);
  const [sectionErrors, setSectionErrors] = useState({});

  const handleNext = async () => {
    try {
      const errors = await validateSection('student', formData.student);
      setSectionErrors(errors);
      
      if (!errors || Object.keys(errors).length === 0) {
        navigation.navigate('Parent');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setSectionErrors({ general: 'Validation failed. Please check your inputs.' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>Student Information</Text>
      <Text style={styles.headerSubtitle}>
        Please fill in all required details of the student (* indicates required field)
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
        {/* Student Information */}
        {renderInput('Surname *', 'student.surName', formErrors.student?.surName, 'eg. Doe')}
        {renderInput('First Name *', 'student.firstName', formErrors.student?.firstName, 'eg. John')}
        {renderInput('Middle Name', 'student.middleName', formErrors.student?.middleName, 'eg. Simon')}
        {renderInput('Gender *', 'student.gender', formErrors.student?.gender, 'eg. MALE or FEMALE')}
        {renderDateInput('Date of Birth *', 'student.dateOfBirth', formErrors.student?.dateOfBirth)}

        {/* Residential Address */}
        <Text style={styles.sectionSubtitle}>Residential Address</Text>
        {renderInput('Street *', 'student.residentialAddress.street', formErrors.student?.residentialAddress?.street, 'eg. Main St')}
        {renderInput('House Number *', 'student.residentialAddress.houseNumber', formErrors.student?.residentialAddress?.houseNumber, 'eg. 12', 'numeric')}
        {renderInput('City *', 'student.residentialAddress.city', formErrors.student?.residentialAddress?.city, 'eg. Accra')}
        {renderInput('Region/State *', 'student.residentialAddress.region', formErrors.student?.residentialAddress?.region, 'eg. Greater Accra')}
        {renderInput('Country *', 'student.residentialAddress.country', formErrors.student?.residentialAddress?.country, 'eg. Ghana')}
        {renderInput('Home Town', 'student.homeTown', formErrors.student?.homeTown, 'eg. Tema')}
        {renderInput('Religion', 'student.religion', formErrors.student?.religion, 'eg. Christianity/Islam/Other')}
        
        {/* Family Information */}
        <Text style={styles.sectionSubtitle}>Family Information</Text>
        {renderInput('Nationality *', 'student.nationality', formErrors.student?.nationality, 'eg. Ghanaian')}
        {renderInput('Lives With *', 'student.livesWith', formErrors.student?.livesWith, 'eg. BOTH_PARENTS/MOTHER')}
        {renderInput('Number of Siblings *', 'student.numberOfSiblings', formErrors.student?.numberOfSiblings, 'eg. 3', 'numeric')}
        {renderInput('Older Siblings *', 'student.olderSiblings', formErrors.student?.olderSiblings, 'eg. 2', 'numeric')}
        {renderInput('Younger Siblings *', 'student.youngerSiblings', formErrors.student?.youngerSiblings, 'eg. 1', 'numeric')}
        {renderInput('Other Children in House *', 'student.otherChildrenInHouse', formErrors.student?.otherChildrenInHouse, 'eg. 0', 'numeric')}

        {/* Medical Information */}
        <Text style={styles.sectionSubtitle}>Medical Information</Text>
        {renderInput('Blood Type *', 'student.medicalInformation.bloodType', formErrors.student?.medicalInformation?.bloodType, 'eg. A+')}
        {renderInput('Allergies/Conditions *', 'student.medicalInformation.allergiesOrConditions', formErrors.student?.medicalInformation?.allergiesOrConditions, 'eg. None')}
        {renderInput('Emergency Contact Name *', 'student.medicalInformation.emergencyContactsName', formErrors.student?.medicalInformation?.emergencyContactsName, 'eg. Jane Doe')}
        {renderInput('Emergency Contact Number *', 'student.medicalInformation.emergencyContactsNumber', formErrors.student?.medicalInformation?.emergencyContactsNumber, 'eg. 0241234567', 'phone-pad')}
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
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00873E',
    marginTop: 16,
    marginBottom: 8,
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
    marginTop: 24,
  },
  nextButton: {
    backgroundColor: '#00873E',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default StudentFormPage;