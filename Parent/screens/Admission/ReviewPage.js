import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AdmissionContext } from '../../context/AdmissionContext';

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
  reviewItem: {
    marginBottom: 12,
  },
  reviewLabel: {
    fontWeight: 'bold',
    color: '#555',
  },
  reviewValue: {
    color: '#333',
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
    borderColor: '#0B6623',
  },
  backButtonText: {
    color: '#0B6623',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#0B6623',
    borderRadius: 4,
    padding: 12,
    width: 120,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500',
  },
});

const ReviewFormPage = ({ navigation }) => {
  const { 
    formData, 
    formErrors,
    submitForm, 
    isSubmitting 
  } = useContext(AdmissionContext);

  const handleSubmit = async () => {
    try {
      const result = await submitForm();
      if (result) {
        Alert.alert(
          'Success',
          'Your application has been submitted successfully!',
          [{ text: 'OK', onPress: () => navigation.popToTop() }]
        );
      }
    } catch (error) {
      Alert.alert('Error', error.message || 'Submission failed. Please try again.');
    }
  };

  const renderReviewItem = (label, value) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewLabel}>{label}:</Text>
      <Text style={styles.reviewValue}>{value || 'Not provided'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Review Your Application</Text>
      <Text>Please review all information before submitting.</Text>

      {Object.keys(formErrors).length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            There are validation errors. Please go back and fix them before submitting.
          </Text>
        </View>
      )}

      <Text style={styles.sectionSubtitle}>Student Information</Text>
      {renderReviewItem('Full Name', `${formData.student.surName} ${formData.student.firstName} ${formData.student.middleName}`)}
      {renderReviewItem('Date of Birth', formData.student.dateOfBirth)}
      {renderReviewItem('Gender', formData.student.gender)}
      {renderReviewItem('Address', `${formData.student.residentialAddress.street} ${formData.student.residentialAddress.houseNumber}, ${formData.student.residentialAddress.city}`)}
      {renderReviewItem('Nationality', formData.student.nationality)}

      <Text style={styles.sectionSubtitle}>Parent Information</Text>
      {renderReviewItem('Father', `${formData.parentGuardian.fatherSurName} ${formData.parentGuardian.fatherFirstName}`)}
      {renderReviewItem('Mother', `${formData.parentGuardian.motherSurName} ${formData.parentGuardian.motherFirstName}`)}
      {renderReviewItem('Father Contact', formData.parentGuardian.fatherContactNumber)}
      {renderReviewItem('Mother Contact', formData.parentGuardian.motherContactNumber)}

      <Text style={styles.sectionSubtitle}>Academic Information</Text>
      {renderReviewItem('Previous School', formData.previousAcademicDetail.lastSchoolAttended)}
      {renderReviewItem('Class for Admission', formData.admissionDetail.classForAdmission)}
      {renderReviewItem('Academic Year', formData.admissionDetail.academicYear)}

      <Text style={styles.sectionSubtitle}>Documents</Text>
      {renderReviewItem('Passport Photo', formData.documents.file1?.name)}
      {renderReviewItem('Birth Certificate', formData.documents.file2?.name)}
      {renderReviewItem('Previous Results', formData.documents.file3?.name)}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={isSubmitting || Object.keys(formErrors).length > 0}
        >
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ReviewFormPage;