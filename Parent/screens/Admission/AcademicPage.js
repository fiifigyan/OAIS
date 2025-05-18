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

const AcademicFormPage = ({ navigation }) => {
  const { formData, updateFormData, validationErrors } = useContext(AdmissionContext);

  const renderSiblingFields = () => {
    if (formData.admissionDetail?.hasSiblingsInSchool) {
      return (
        <View style={styles.siblingDetailsContainer}>
          <Text style={styles.sectionSubtitle}>Sibling Details</Text>
          {renderInput('Sibling Name *', 'admissionDetail.siblingName', formData, updateFormData, validationErrors)}
          {renderInput('Sibling Class *', 'admissionDetail.siblingClass', formData, updateFormData, validationErrors)}
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Previous Academic Details</Text>
      {renderInput('Last School Attended *', 'previousAcademicDetail.lastSchoolAttended', formData, updateFormData, validationErrors)}
      {renderInput('Last Class Completed *', 'previousAcademicDetail.lastClassCompleted', formData, updateFormData, validationErrors)}
      
      <Text style={styles.sectionTitle}>Admission Details</Text>
      {renderInput('Class for Admission *', 'admissionDetail.classForAdmission', formData, updateFormData, validationErrors)}
      {renderInput('Academic Year *', 'admissionDetail.academicYear', formData, updateFormData, validationErrors)}
      {renderInput('Preferred Second Language *', 'admissionDetail.preferredSecondLanguage', formData, updateFormData, validationErrors)}
      
      {renderSwitch('Has Siblings in School', 'admissionDetail.hasSiblingsInSchool', formData, updateFormData)}
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
          onPress={() => navigation.navigate('DocumentsPage')}
        >
          <Text style={styles.nextButtonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default AcademicFormPage;