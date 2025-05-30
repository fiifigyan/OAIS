import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderInput, renderSwitch, renderSectionHeader } from '../../components/Admission/FormComponents';

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
  siblingDetailsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    padding: 12,
    marginTop: 8,
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

const AcademicFormPage = ({ navigation }) => {
  const { 
    formData, 
    formErrors,
    validateSection,
    setFormFieldValue 
  } = useContext(AdmissionContext);
  const [sectionErrors, setSectionErrors] = useState({});

  const renderSiblingFields = () => {
    if (formData.admissionDetail?.hasSiblingsInSchool) {
      return (
        <View style={styles.siblingDetailsContainer}>
          {renderSectionHeader('Sibling Details')}
          {renderInput('Sibling Name *', 'admissionDetail.siblingName', 
            formErrors.admissionDetail?.siblingName)}
          {renderInput('Sibling Class *', 'admissionDetail.siblingClass', 
            formErrors.admissionDetail?.siblingClass)}
        </View>
      );
    }
    return null;
  };

  const handleNext = async () => {
    const academicData = {
      ...formData.previousAcademicDetail,
      ...formData.admissionDetail
    };
    const errors = await validateSection('academic', academicData);
    setSectionErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      navigation.navigate('Documents');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderSectionHeader('Academic Information', 'Provide details about previous and requested admission')}

      {Object.keys(sectionErrors).length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Please fix all errors before proceeding
          </Text>
        </View>
      )}

      {renderSectionHeader('Previous Academic Details')}
      {renderInput('Last School Attended *', 'previousAcademicDetail.lastSchoolAttended', 
        formErrors.previousAcademicDetail?.lastSchoolAttended)}
      {renderInput('Last Class Completed *', 'previousAcademicDetail.lastClassCompleted', 
        formErrors.previousAcademicDetail?.lastClassCompleted)}
      
      {renderSectionHeader('Admission Details')}
      {renderInput('Class for Admission *', 'admissionDetail.classForAdmission', 
        formErrors.admissionDetail?.classForAdmission)}
      {renderInput('Academic Year *', 'admissionDetail.academicYear', 
        formErrors.admissionDetail?.academicYear)}
      {renderInput('Preferred Second Language *', 'admissionDetail.preferredSecondLanguage', 
        formErrors.admissionDetail?.preferredSecondLanguage)}
      
      {renderSwitch('Has Siblings in School', 'admissionDetail.hasSiblingsInSchool')}
      {renderSiblingFields()}

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

export default AcademicFormPage;