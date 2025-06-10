import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderInput, renderSwitch, renderSectionHeader } from '../../components/Admission/FormComponents';

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
    try {
      const validationData = {
        previousAcademicDetail: {
          lastSchoolAttended: formData.previousAcademicDetail.lastSchoolAttended,
          lastClassCompleted: formData.previousAcademicDetail.lastClassCompleted
        },
        admissionDetail: {
          classForAdmission: formData.admissionDetail.classForAdmission,
          preferredSecondLanguage: formData.admissionDetail.preferredSecondLanguage,
          academicYear: formData.admissionDetail.academicYear,
          hasSiblingsInSchool: formData.admissionDetail.hasSiblingsInSchool,
          ...(formData.admissionDetail.hasSiblingsInSchool && {
            siblingName: formData.admissionDetail.siblingName,
            siblingClass: formData.admissionDetail.siblingClass
          })
        }
      };

      const errors = await validateSection('academic', validationData);
      
      // Transform errors to match your field paths
      const transformedErrors = {};
      Object.entries(errors).forEach(([path, message]) => {
        if (path.startsWith('previousAcademicDetail.')) {
          transformedErrors[path] = message;
        } else if (path.startsWith('admissionDetail.')) {
          transformedErrors[path] = message;
        } else {
          transformedErrors[`admissionDetail.${path}`] = message;
        }
      });
      
      setSectionErrors(transformedErrors);
      
      if (Object.keys(transformedErrors).length === 0) {
        navigation.navigate('Documents');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setSectionErrors({ general: 'Validation failed. Please check your inputs.' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionHeader}>Previous Academic Details</Text>
      <Text style={styles.headerSubtitle}>
        Please fill in the academic details of the student
      </Text>
      {Object.keys(sectionErrors).length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Please fill all required fields (*) before proceeding
          </Text>
        </View>
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {
          renderInput('Previous School Name *', 'previousAcademicDetail.lastSchoolAttended', 
          formErrors.previousAcademicDetail?.lastSchoolAttended, 'eg. ABC International School')
        }

        {
          renderInput('Last Class Attended *', 'previousAcademicDetail.lastClassCompleted', 
          formErrors.previousAcademicDetail?.lastClassCompleted, 'eg. Grade 5')
        }

        {
          renderInput('Academic Year *', 'admissionDetail.academicYear', 
          formErrors.admissionDetail?.academicYear, 'eg. 2018', 'numeric')
        }

        {
          renderInput('Admission Class *', 'admissionDetail.classForAdmission', 
          formErrors.admissionDetail?.classForAdmission, 'eg. Grade 6')
        }

        {renderInput('Preferred Second Language *', 'admissionDetail.preferredSecondLanguage',
          formErrors.admissionDetail?.preferredSecondLanguage, 'eg. English')}
        
        {renderSwitch('Has Siblings in School?', 'admissionDetail.hasSiblingsInSchool')}
        
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
  siblingDetailsContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    padding: 12,
    marginTop: 8,
  },
  sectionHeader: {
    fontSize: 20,
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
export default AcademicFormPage;