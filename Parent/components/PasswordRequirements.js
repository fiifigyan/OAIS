import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const PasswordRequirements = ({ password }) => {
  const requirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One number', met: /\d/.test(password) },
    { label: 'One special character (@$!%*?&)', met: /[@$!%*?&]/.test(password) }
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password Requirements:</Text>
      {requirements.map(({ label, met }, index) => (
        <View key={index} style={styles.requirementRow}>
          <Icon 
            name={met ? 'checkmark-circle' : 'close-circle'} 
            size={16} 
            color={met ? '#0B6623' : '#F44336'} 
          />
          <Text style={[styles.text, met ? styles.met : styles.unmet]}>
            {label}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    padding: 12,
    backgroundColor: 'aliceblue',
    borderRadius: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#999',
  },
  requirementRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  text: {
    fontSize: 14,
    marginLeft: 8,
  },
  met: {
    color: '#0B6623',
  },
  unmet: {
    color: '#757575',
  },
});

export default PasswordRequirements;