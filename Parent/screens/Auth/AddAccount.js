import React from 'react';
import { StyleSheet, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Formik } from 'formik';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { CustomInput } from '../../components/CustomInput';
import { Button } from 'react-native-paper';
import { accountSchema, prepareAccountData } from '../../utils/helpers';
import AuthService from '../../services/AuthService';

const AddAccountScreen = ({ navigation }) => {
  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const accountData = prepareAccountData(values);
      await AuthService.addAccount(accountData);
      
      resetForm();
      Alert.alert('Success', 'Account created successfully');
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Error', 
        error.message || 'Failed to create account. Please try again.'
      );
      console.error('Account submission error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Formik
          initialValues={{ accountName: '', email: '', password: '' }}
          validationSchema={accountSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
            <>
              <CustomInput
                label="Account Name"
                value={values.accountName}
                onChangeText={handleChange('accountName')}
                onBlur={handleBlur('accountName')}
                placeholder="e.g. Work Account"
                error={touched.accountName && errors.accountName}
                touched={touched.accountName}
                leftIcon={<Icon name="person" size={20} color="#666" />}
              />

              <CustomInput
                label="Email"
                value={values.email}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                placeholder="email@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                error={touched.email && errors.email}
                touched={touched.email}
                leftIcon={<Icon name="email" size={20} color="#666" />}
              />

              <CustomInput
                label="Password"
                value={values.password}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                placeholder="••••••••"
                secureTextEntry
                error={touched.password && errors.password}
                touched={touched.password}
                leftIcon={<Icon name="lock" size={20} color="#666" />}
              />

              <Button
                mode="contained"
                onPress={handleSubmit}
                loading={isSubmitting}
                disabled={isSubmitting}
                style={styles.button}
                labelStyle={styles.buttonText}
                icon="account-plus"
              >
                Create Account
              </Button>
            </>
          )}
        </Formik>
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
  button: {
    backgroundColor: '#00873E',
    borderRadius: 10,
    paddingVertical: 8,
    marginTop: 25,
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