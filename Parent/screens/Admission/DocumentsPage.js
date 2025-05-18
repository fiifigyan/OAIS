import React, { useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { AdmissionContext } from '../../context/AdmissionContext';
import { renderDocumentUpload } from '../../components/Admission/FormComponents';

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
    borderColor: '#03AC13',
  },
  backButtonText: {
    color: '#03AC13',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#03AC13',
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
  const { formData, updateFormData, validationErrors } = useContext(AdmissionContext);

  const handleDocumentPick = async (field) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        updateFormData({
          documents: {
            ...formData.documents,
            [field]: {
              name: file.name,
              uri: file.uri,
              size: file.size,
              type: file.mimeType
            }
          }
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select document. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Required Documents</Text>
      <Text style={styles.documentNote}>Please upload PDF, JPEG or PNG files (max 10MB each)</Text>

      {renderDocumentUpload('Passport Photo *', 'file1', formData, updateFormData, validationErrors, handleDocumentPick)}
      {renderDocumentUpload('Birth Certificate *', 'file2', formData, updateFormData, validationErrors, handleDocumentPick)}
      {renderDocumentUpload('Previous Results *', 'file3', formData, updateFormData, validationErrors, handleDocumentPick)}
      {/* {renderDocumentUpload('Father\'s ID (Optional)', 'file4', formData, updateFormData, validationErrors, handleDocumentPick)}
      {renderDocumentUpload('Mother\'s ID (Optional)', 'file5', formData, updateFormData, validationErrors, handleDocumentPick)} */}

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={() => navigation.navigate('ReviewPage')}
        >
          <Text style={styles.submitButtonText}>Review</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default DocumentsFormPage;