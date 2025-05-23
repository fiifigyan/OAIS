import React from 'react';
import { 
  View, 
  Text, 
  Image,
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView
} from 'react-native';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import { loginSchema } from '../../utils/helpers';
import SuccessModal from '../../components/SuccessModal';
import CustomInput from '../../components/CustomInput';

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login, isLoading } = React.useContext(AuthContext);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const initialValues = {
    StudentID: '',
    email: '',
    password: ''
  };

  const handleStudentIDChange = (text, setFieldValue) => {
    let formattedText = text.toUpperCase();
    
    if (formattedText.length === 4 && !formattedText.includes('-')) {
      formattedText = formattedText.slice(0, 4) + '-' + formattedText.slice(4);
    }
    
    if (formattedText.length > 9) {
      formattedText = formattedText.slice(0, 9);
    }
    
    setFieldValue('StudentID', formattedText);
  };

  const handleSubmit = async (values, { setErrors }) => {
    try {
      const credentials = {
        email: values.email.trim().toLowerCase(),
        StudentID: values.StudentID.trim().toUpperCase(),
        password: values.password
      };
      
      await login(credentials);
      setShowSuccessModal(true);
    } catch (error) {
      setErrors({ submit: error.message });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/icons/OAIS-logo.png')}
          style={styles.logo}
        />
        <View>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>
            Sign in to get started
          </Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Formik
            initialValues={initialValues}
            validationSchema={loginSchema}
            onSubmit={handleSubmit}
            validateOnBlur={true}
            validateOnChange={false}
          >
            {({ 
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              setFieldValue,
              setFieldTouched,
              isSubmitting
            }) => (
              <View style={styles.formContainer}>
                {errors.submit && (
                  <View style={styles.submitErrorContainer}>
                    <Icon name="alert-circle" size={20} color="#d32f2f" />
                    <Text style={styles.submitErrorText}>{errors.submit}</Text>
                  </View>
                )}

                {/* Student ID Input */}
                <CustomInput
                  label="Student ID *"
                  value={values.StudentID}
                  onChangeText={(text) => handleStudentIDChange(text, setFieldValue)}
                  onBlur={() => {
                    setFieldTouched('StudentID', true);
                    handleBlur('StudentID');
                  }}
                  error={errors.StudentID}
                  placeholder="OAIS-0000"
                  autoCapitalize="characters"
                  leftIcon={<Icon name="id-card" size={20} color="#666" />}
                  editable={!isLoading}
                  touched={touched.StudentID}
                />

                {/* Email Input */}
                <CustomInput
                  label="Email *"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => {
                    setFieldTouched('email', true);
                    handleBlur('email');
                  }}
                  error={errors.email}
                  placeholder="Enter your email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={<Icon name="mail" size={20} color="#666" />}
                  editable={!isLoading}
                  touched={touched.email}
                />

                {/* Password Input */}
                <CustomInput
                  label="Password *"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => {
                    setFieldTouched('password', true);
                    handleBlur('password');
                  }}
                  error={errors.password}
                  placeholder="Enter your password"
                  secureTextEntry={true}
                  leftIcon={<Icon name="lock-closed" size={20} color="#666" />}
                  editable={!isLoading}
                  touched={touched.password}
                />

                <TouchableOpacity
                  style={[styles.button, (isLoading || isSubmitting) && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Icon name="log-in" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Login</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.forgotPassword}
                  onPress={() => navigation.navigate('Forgot')}
                  disabled={isLoading}
                >
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                </TouchableOpacity>

                <View style={styles.signupContainer}>
                  <Text style={styles.signupText}>Don't have an account? </Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('Signup')}
                    disabled={isLoading}
                  >
                    <Text style={styles.signupLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigation.reset({
            index: 0,
            routes: [{ name: 'Drawer' }],
          });
        }}
        title="Login Successful"
        message="You have successfully logged in to your account."
        duration={2000}
        showButton={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
  },
    logo: {
    width: 150,
    height: 150,
  },
  header: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0B6623',
  },
  subtitle: {
    fontSize: 18,
    color: '#0B6623',
  },
  formContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#0B6623',
    padding: 16,
    borderRadius: 8,
    marginTop: 24,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 15,
    padding: 10,
  },
  forgotPasswordText: {
    color: '#0B6623',
    fontSize: 14,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  signupText: {
    color: '#666',
    fontSize: 15,
  },
  signupLink: {
    color: '#0B6623',
    fontSize: 15,
    fontWeight: 'bold',
  },
  submitErrorContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginVertical: 10,
    alignItems: 'center',
    gap: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#d32f2f',
  },
  submitErrorText: {
    color: '#d32f2f',
    fontSize: 14,
    flex: 1,
  },
});

export default LoginScreen;