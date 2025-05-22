import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderInput, renderSwitch } from '../../components/Admission/FormComponents';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0B6623',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0B6623',
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
    borderColor: '#0B6623',
  },
  backButtonText: {
    color: '#0B6623',
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#0B6623',
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
  const { formData, validateForm } = useContext(AdmissionContext);

  const renderSiblingFields = () => {
    if (formData.admissionDetail?.hasSiblingsInSchool) {
      return (
        <View style={styles.siblingDetailsContainer}>
          <Text style={styles.sectionSubtitle}>Sibling Details</Text>
          {renderInput('Sibling Name *', 'admissionDetail.siblingName')}
          {renderInput('Sibling Class *', 'admissionDetail.siblingClass')}
        </View>
      );
    }
    return null;
  };

  const handleNext = async () => {
    // Validate only academic section before proceeding
    const errors = await validateForm();
    const academicErrors = {
      ...errors?.previousAcademicDetail,
      ...errors?.admissionDetail
    } || {};
    
    if (Object.keys(academicErrors).length === 0) {
      navigation.navigate('Documents');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Previous Academic Details</Text>
      {renderInput('Last School Attended *', 'previousAcademicDetail.lastSchoolAttended')}
      {renderInput('Last Class Completed *', 'previousAcademicDetail.lastClassCompleted')}
      
      <Text style={styles.sectionTitle}>Admission Details</Text>
      {renderInput('Class for Admission *', 'admissionDetail.classForAdmission')}
      {renderInput('Academic Year *', 'admissionDetail.academicYear')}
      {renderInput('Preferred Second Language *', 'admissionDetail.preferredSecondLanguage')}
      
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