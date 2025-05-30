import React, { useContext, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderDocumentUpload, renderSectionHeader } from '../../components/Admission/FormComponents';

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
      Alert.alert('Error', 'Failed to select document. Please try again.');
    }
  };

  const handleImagePick = async (fieldName) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFormFieldValue(`documents.${fieldName}`, {
          name: file.fileName || `image_${Date.now()}.jpg`,
          uri: file.uri,
          size: file.fileSize,
          type: file.type || 'image/jpeg'
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleReview = async () => {
    const errors = await validateSection('documents', formData.documents);
    setSectionErrors(errors);
    
    if (Object.keys(errors).length === 0) {
      navigation.navigate('ReviewPage');
    }
  };

  return (
    <ScrollView style={styles.container}>
      {renderSectionHeader('Required Documents', 'Upload all required documents to complete your application')}

      {Object.keys(sectionErrors).length > 0 && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            Please upload all required documents before proceeding
          </Text>
        </View>
      )}

      <Text style={styles.documentNote}>Please upload PDF, JPEG or PNG files (max 10MB each)</Text>

      {renderDocumentUpload(
        'Passport Photo *', 
        'file1', 
        formData.documents.file1, 
        formErrors.documents?.file1,
        () => handleImagePick('file1')
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
  );
};

export default DocumentsFormPage;