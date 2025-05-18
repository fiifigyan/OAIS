import React from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/Ionicons';
import { getValue } from '../../utils/helpers';

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
});

export const renderInput = (label, path, formData, updateFormData, validationErrors, keyboardType = 'default', placeholder = '') => {
  const value = getValue(formData, path);
  
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input, 
          validationErrors[path] && styles.errorInput
        ]}
        value={String(value)}
        onChangeText={text => updateFormData({ [path]: text })}
        keyboardType={keyboardType}
        placeholder={placeholder}
      />
      {validationErrors[path] && (
        <Text style={styles.errorText}>{validationErrors[path]}</Text>
      )}
    </View>
  );
};

export const renderDateInput = (label, path, formData, updateFormData, validationErrors) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const value = getValue(formData, path);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      updateFormData({ [path]: formattedDate });
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
            validationErrors[path] && styles.errorInput
          ]}
          value={value}
          placeholder="YYYY-MM-DD"
          onChangeText={(text) => updateFormData({ [path]: text })}
          keyboardType="numeric"
        />
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.calendarButton}
        >
          <Icon name="calendar" size={24} color="#03AC13" />
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
      {validationErrors[path] && (
        <Text style={styles.errorText}>{validationErrors[path]}</Text>
      )}
    </View>
  );
};

export const renderSwitch = (label, path, formData, updateFormData) => {
  const value = getValue(formData, path) || false;
  
  return (
    <View style={[styles.inputContainer, styles.switchContainer]}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={(val) => updateFormData({ [path]: val })}
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={value ? "#f5dd4b" : "#f4f3f4"}
      />
    </View>
  );
};

export const renderDocumentUpload = (label, field, formData, updateFormData, validationErrors, handleDocumentPick) => {
  const document = getValue(formData, `documents.${field}`) || {};
  const error = validationErrors[`documents.${field}`];

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[
          styles.input,
          error && styles.errorInput,
          document.uri && { backgroundColor: '#e6f7e6' }
        ]}
        onPress={() => handleDocumentPick(field)}
      >
        <Text style={{ color: document.uri ? '#2e7d32' : '#555' }}>
          {document.uri ? document.name : 'Select File'}
        </Text>
      </TouchableOpacity>
      {error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};