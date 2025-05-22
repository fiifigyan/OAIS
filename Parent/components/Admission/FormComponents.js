import React, { useContext } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { AdmissionContext } from '../../context/AdmissionContext';

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
    height: 40,
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
  requirementsContainer: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  requirementIcon: {
    marginRight: 8,
  },
  requirementText: {
    fontSize: 14,
  },
  requirementMet: {
    color: '#4CAF50',
  },
  requirementUnmet: {
    color: '#757575',
  },
});

export const renderInput = (label, name, keyboardType = 'default') => {
  const { 
    formData, 
    formErrors, 
    formTouched,
    handleFormChange, 
    handleFormBlur 
  } = useContext(AdmissionContext);

  const getNestedValue = (obj, path) => 
    path.split('.').reduce((acc, part) => acc && acc[part], obj);

  const value = getNestedValue(formData, name) || '';
  const error = getNestedValue(formErrors, name);
  const touched = getNestedValue(formTouched, name);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          error && touched && styles.errorInput
        ]}
        value={String(value)}
        onChangeText={handleFormChange(name)}
        onBlur={handleFormBlur(name)}
        keyboardType={keyboardType}
        placeholder={label}
      />
      {error && touched && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

export const renderDateInput = (label, name) => {
  const { 
    formData, 
    formErrors, 
    formTouched,
    setFormFieldValue 
  } = useContext(AdmissionContext);
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  const value = name.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), formData);
  const error = name.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), formErrors);
  const touched = name.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), formTouched);

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
            error && touched && styles.errorInput
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
          <Icon name="calendar" size={24} color="#0B6623" />
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
      {error && touched && (
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
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
      />
    </View>
  );
};

export const renderDocumentUpload = (label, name) => {
  const { 
    formData, 
    formErrors, 
    formTouched,
    setFormFieldValue 
  } = useContext(AdmissionContext);

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      if (result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        setFormFieldValue(name, {
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

  const document = name.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), formData);
  const error = name.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), formErrors);
  const touched = name.split('.').reduce((obj, key) => (obj ? obj[key] : undefined), formTouched);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.input,
          error && touched && styles.errorInput,
          document?.uri && { backgroundColor: '#e6f7e6' }
        ]}
        onPress={handleDocumentPick}
      >
        <Text style={{ color: document?.uri ? '#2e7d32' : '#555' }}>
          {document?.uri ? document.name : 'Select File'}
        </Text>
      </TouchableOpacity>
      {error && touched && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};