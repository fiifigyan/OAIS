import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert, SafeAreaView } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderDocumentUpload, renderSectionHeader } from '../../components/Admission/FormComponents';
import { Ionicons } from '@expo/vector-icons';

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
      
      if (!errors || Object.keys(errors).length === 0) {
        navigation.navigate('Review');
      }
    } catch (error) {
      console.error('Validation error:', error);
      setSectionErrors({ general: 'Validation failed. Please check your documents.' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>Upload Required Documents</Text>
      <Text style={styles.headerSubtitle}>
        Please upload all required documents (* indicates required field)
      </Text>

      {Object.keys(sectionErrors).length > 0 && (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={24} color="#d32f2f" />
          <Text style={styles.errorText}>
            Please upload all required documents before proceeding
          </Text>
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
            style={styles.nextButton}
            onPress={handleReview}
          >
            <Text style={styles.nextButtonText}>Review</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  backButton: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 14,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#00873E',
  },
  backButtonText: {
    color: '#00873E',
    fontWeight: '600',
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: '#00873E',
    borderRadius: 8,
    padding: 14,
    width: '48%',
    alignItems: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default DocumentsFormPage;