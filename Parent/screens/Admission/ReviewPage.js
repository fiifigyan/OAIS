import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, SafeAreaView, ActivityIndicator } from 'react-native';
import { AdmissionContext } from '../../context/AdmissionContext';
import SuccessModal from '../../components/SuccessModal'
import Collapsible from 'react-native-collapsible';
import Icon from 'react-native-vector-icons/Ionicons';

const ReviewFormPage = ({ navigation }) => {
  const { 
    formData, 
    formErrors,
    submitForm, 
    isSubmitting,
    goToSection
  } = useContext(AdmissionContext);

  const [collapsedSections, setCollapsedSections] = useState({
    student: false,
    parent: false,
    academic: false,
    documents: false
  });

  const toggleSection = (section) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleSubmit = async () => {
  try {
    const result = await submitForm();
    if (result) {
      // Show success modal
      <SuccessModal
        visible={true}
        title="Application Success!"
        message="Your application has been successfully submitted!"
        onClose={() => navigation.navigate('AdmissionStatus')}
      />;
    }
  } catch (error) {
    Alert.alert(
      'Submission Error',
      error.message,
      [
        { text: 'OK', style: 'cancel' },
        { 
          text: 'Try Again', 
          onPress: handleSubmit
        }
      ]
    );
  }
};

  const renderReviewItem = (label, value) => (
    <View style={styles.reviewItem}>
      <Text style={styles.reviewLabel}>{label}:</Text>
      <Text style={styles.reviewValue}>{value || 'Not provided'}</Text>
    </View>
  );

  const renderSection = (title, sectionKey, fields) => (
    <View>
      <TouchableOpacity 
        style={styles.collapsibleHeader}
        onPress={() => toggleSection(sectionKey)}
      >
        <Text style={styles.collapsibleTitle}>{title}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => goToSection(sectionKey)}>
            <Text style={styles.editButton}>Edit</Text>
          </TouchableOpacity>
          <Icon 
            name={collapsedSections[sectionKey] ? 'chevron-down' : 'chevron-up'} 
            size={20} 
            color="#00873E" 
          />
        </View>
      </TouchableOpacity>
      
      <Collapsible collapsed={collapsedSections[sectionKey]}>
        <View style={styles.collapsibleContent}>
          {fields}
        </View>
      </Collapsible>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>Review Your Application</Text>
      <Text style={styles.headerSubtitle}>Please review all information before submitting.</Text>

      {Object.keys(formErrors).length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            There are validation errors. Please go back and fix them before submitting.
          </Text>
        </View>
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

      {renderSection('Student Information', 'student', (
        <>
          {renderReviewItem('Full Name', `${formData.student.surName} ${formData.student.firstName} ${formData.student.middleName}`)}
          {renderReviewItem('Date of Birth', formData.student.dateOfBirth)}
          {renderReviewItem('Gender', formData.student.gender)}
          {renderReviewItem('Address', `${formData.student.residentialAddress.street} ${formData.student.residentialAddress.houseNumber}, ${formData.student.residentialAddress.city}`)}
          {renderReviewItem('Nationality', formData.student.nationality)}
          {renderReviewItem('Lives With', formData.student.livesWith)}
          {renderReviewItem('Number of Siblings', formData.student.numberOfSiblings)}
          {renderReviewItem('Older Siblings', formData.student.olderSiblings)}
          {renderReviewItem('Younger Siblings', formData.student.youngerSiblings)}
          {renderReviewItem('Other Children in House', formData.student.otherChildrenInHouse)}
          {renderReviewItem('Blood Type', formData.student.medicalInformation.bloodType)}
          {renderReviewItem('Allergies or Conditions', formData.student.medicalInformation.allergiesOrConditions)}
          {renderReviewItem('Emergency Contact Name', formData.student.medicalInformation.emergencyContactsName)}
          {renderReviewItem('Emergency Contact Number', formData.student.medicalInformation.emergencyContactsNumber)}
          {renderReviewItem('Immunized', formData.student.medicalInformation.isChildImmunized ? 'Yes' : 'No')}
        </>
      ))}

      {renderSection('Parent Information', 'parent', (
        <>
          {renderReviewItem('Father', `${formData.parentGuardian.fatherSurName} ${formData.parentGuardian.fatherFirstName}`)}
          {renderReviewItem('Father Contact', formData.parentGuardian.fatherContactNumber)}
          {renderReviewItem('Father Address', `${formData.parentGuardian.fatherAddress.street} ${formData.parentGuardian.fatherAddress.houseNumber}, ${formData.parentGuardian.fatherAddress.city}, ${formData.parentGuardian.fatherAddress.country}`)}
          {renderReviewItem('Father Occupation', formData.parentGuardian.fatherOccupation)} 
          
          {renderReviewItem('Mother', `${formData.parentGuardian.motherSurName} ${formData.parentGuardian.motherFirstName}`)}
          {renderReviewItem('Mother Contact', formData.parentGuardian.motherContactNumber)}
          {renderReviewItem('Mother Address', `${formData.parentGuardian.motherAddress.street} ${formData.parentGuardian.motherAddress.houseNumber}, ${formData.parentGuardian.motherAddress.city}, ${formData.parentGuardian.motherAddress.country}`)}
          {renderReviewItem('Mother Occupation', formData.parentGuardian.motherOccupation)} 
        </>
      ))}

      {renderSection ('Academic Information', 'academic', (
        <>
          {renderReviewItem('Last School Attended', formData.previousAcademicDetail.lastSchoolAttended)}
          {renderReviewItem('Class for Admission', formData.admissionDetail.classForAdmission)}
          {renderReviewItem('Academic Year', formData.admissionDetail.academicYear)}
          {renderReviewItem('Class for Admission', formData.admissionDetail.classForAdmission)}
          {renderReviewItem('Has Siblings in School', formData.admissionDetail.hasSiblingsInSchool ? 'Yes' : 'No')}
          {renderReviewItem('Sibling Name', formData.admissionDetail.siblingName)}
          {renderReviewItem('Sibling Class', formData.admissionDetail.siblingClass)}
          {renderReviewItem('Preferred Second Language', formData.admissionDetail.preferredSecondLanguage)}
        </>
      ))}

      {renderSection('Documents', 'documents', (
        <>
          {renderReviewItem('Passport Photo', formData.documents.file1?.name)}
          {renderReviewItem('Birth Certificate', formData.documents.file2?.name)}
          {renderReviewItem('Previous Results', formData.documents.file3?.name)}
        </>
      ))}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          disabled={isSubmitting}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.submitButton,
            (Object.keys(formErrors).length > 0 && { opacity: 0.5 })
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting || Object.keys(formErrors).length > 0}
        >
          {isSubmitting && <ActivityIndicator size="small" color="#fff" />}
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Text>
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
    fontStyle: 'italic',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00873E',
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
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
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
  submitButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#00873E',
    borderRadius: 4,
    padding: 12,
    width: 120,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  collapsibleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00873E',
  },
  editButton: {
    color: '#00873E',
    fontSize: 14,
  },
  collapsibleContent: {
    paddingVertical: 8,
  },
});
export default ReviewFormPage;