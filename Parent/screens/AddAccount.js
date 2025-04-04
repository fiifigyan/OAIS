import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CustomInput } from '../components/CustomInput';

const AddAccountScreen = ({ navigation }) => {
  const [accountName, setAccountName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAddAccount = () => {
    if (!accountName || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    console.log('Account Name:', accountName);
    console.log('Email:', email);
    console.log('Password:', password);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Add New Account</Text>
        
        <CustomInput
          label="Account Name"
          value={accountName}
          onChangeText={setAccountName}
          placeholder="Account Name"
          leftIcon={<Icon name="person" size={20} color="#666" />}
        />
        
        <CustomInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          leftIcon={<Icon name="email" size={20} color="#666" />}
        />
        
        <CustomInput
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          leftIcon={<Icon name="lock" size={20} color="#666" />}
        />
        
        <TouchableOpacity style={styles.button} onPress={handleAddAccount}>
          <Text style={styles.buttonText}>Add Account</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#03AC13',
  },
  button: {
    backgroundColor: '#03AC13',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddAccountScreen;