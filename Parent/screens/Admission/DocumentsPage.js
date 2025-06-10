import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderDocumentUpload, renderSectionHeader } from '../../components/Admission/FormComponents';

const DocumentsFormPage = ({ navigation }) => {
  const { 
    formData, 
    formErrors,
    validateSection,
    setFormFieldValue 
  } = useContext(AdmissionContext);
  const [sectionErrors, setSectionErrors] = useState({});

  const handleDocumentPick = async (fieldName) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFormFieldValue(`documents.${fieldName}`, {
          name: file.name,
          uri: file.uri,
          size: file.size,
          type: file.mimeType
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Please select a valid file type (PDF, JPG, or PNG)');
    }
  };

  const handleReview = async () => {
    try {
      const errors = await validateSection('documents', formData.documents);
      setSectionErrors(errors);
      
      if (Object.keys(errors).length === 0) {
        navigation.navigate('Review');
      }
    } catch (error) {
      Alert.alert('Submission Error', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>Upload Required Documents</Text>
      <Text style={styles.headerSubtitle}>
        Please upload all required documents to complete your application - PDF, JPEG or PNG files (max 10MB each)
      </Text>
      {Object.keys(sectionErrors).length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Please upload all required documents before proceeding
          </Text>
        </View>
      )}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>

      {renderDocumentUpload(
        'Passport Photo *', 
        'file1', 
        formData.documents.file1, 
        formErrors.documents?.file1,
        () => handleDocumentPick('file1')
      )}
      
      {renderDocumentUpload(
        'Birth Certificate *', 
        'file2', 
        formData.documents.file2, 
        formErrors.documents?.file2,
        () => handleDocumentPick('file2')
      )}
      
      {renderDocumentUpload(
        'Previous Results *', 
        'file3', 
        formData.documents.file3, 
        formErrors.documents?.file3,
        () => handleDocumentPick('file3')
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleReview}
        >
          <Text style={styles.submitButtonText}>Review</Text>
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
  documentNote: {
    fontSize: 12,
    color: '#666',
    marginBottom: 16,
    fontStyle: 'italic',
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
  submitButton: {
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
});
export default DocumentsFormPage;