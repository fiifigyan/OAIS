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
    color: '#0B6623',
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

const DocumentsFormPage = ({ navigation }) => {
  const { validateForm } = useContext(AdmissionContext);

  const handleReview = async () => {
    // Validate only documents before proceeding
    const errors = await validateForm();
    const documentErrors = errors?.documents || {};
    
    if (Object.keys(documentErrors).length === 0) {
      navigation.navigate('ReviewPage');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Required Documents</Text>
      <Text style={styles.documentNote}>Please upload PDF, JPEG or PNG files (max 10MB each)</Text>

      {renderDocumentUpload('Passport Photo *', 'documents.file1')}
      {renderDocumentUpload('Birth Certificate *', 'documents.file2')}
      {renderDocumentUpload('Previous Results *', 'documents.file3')}

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