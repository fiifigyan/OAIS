import React, { useContext } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { AdmissionContext } from '../../context/AdmissionContext';


export const renderInput = (label, name, error, placeholder, keyboardType = 'default') => {
  const { 
    formData, 
    handleFormChange, 
    handleFormBlur 
  } = useContext(AdmissionContext);

  const getNestedValue = (obj, path) => 
    path.split('.').reduce((acc, part) => acc && acc[part], obj);

  const value = getNestedValue(formData, name) || '';

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          error && styles.errorInput
        ]}
        value={String(value)}
        onChangeText={handleFormChange(name)}
        onBlur={handleFormBlur(name)}
        keyboardType={keyboardType}
        placeholder={placeholder}
      />
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

export const renderDateInput = (label, name, error) => {
  const { 
    formData, 
    setFormFieldValue 
  } = useContext(AdmissionContext);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const value = name.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), formData);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      setFormFieldValue(name, formattedDate);
    }
  };

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.dateInputContainer}>
        <TextInput
          style={[
            styles.input,
            styles.dateInput,
            error && styles.errorInput
          ]}
          value={value}
          placeholder="YYYY-MM-DD"
          onChangeText={(text) => setFormFieldValue(name, text)}
          keyboardType="numeric"
        />
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.calendarButton}
        >
          <Icon name="calendar" size={24} color="#00873E" />
        </TouchableOpacity>
      </View>
      {showDatePicker && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

export const renderSwitch = (label, name) => {
  const { formData, setFormFieldValue } = useContext(AdmissionContext);
  const value = name.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), formData);

  return (
    <View style={[styles.inputContainer, styles.switchContainer]}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value || false}
        onValueChange={(val) => setFormFieldValue(name, val)}
        trackColor={{ false: "#767577", true: "#00873E" }}
        thumbColor={value ? "#00873E" : "#f4f3f4"}
      />
    </View>
  );
};

export const renderDocumentUpload = (label, fieldName, document, error, onPress) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.documentInput,
          error && styles.errorInput,
          document?.uri && { backgroundColor: '#e6f7e6' }
        ]}
        onPress={onPress}
      >
        <Text style={document?.uri ? styles.documentSuccessText : styles.documentText}>
          {document?.uri ? document.name : 'Select File'}
        </Text>
      </TouchableOpacity>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

export const renderSectionHeader = (title, description) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {description && <Text style={styles.sectionDescription}>{description}</Text>}
  </View>
);


const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#444',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorInput: {
    borderColor: '#d32f2f',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    flex: 1,
  },
  calendarButton: {
    marginLeft: 8,
    padding: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  documentInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    height: 40,
  },
  documentText: {
    color: '#555',
  },
  documentSuccessText: {
    color: '#2e7d32',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00873E',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});