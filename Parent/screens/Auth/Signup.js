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
import { signupSchema } from '../../utils/helpers';
import SuccessModal from '../../components/SuccessModal';
import CustomInput from '../../components/CustomInput';
import PasswordRequirements from '../../components/PasswordRequirements';

const SignupScreen = () => {
  const navigation = useNavigation();
  const { register, isLoading } = React.useContext(AuthContext);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const initialValues = {
    email: '',
    password: ''
  };

  const handleSubmit = async (values, { setErrors }) => {
    try {
      await register({
        email: values.email.trim().toLowerCase(),
        password: values.password
      });
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
          <Text style={styles.title}>Create an Account</Text>
          <Text style={styles.subtitle}>
            Sign up to get started
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
            validationSchema={signupSchema}
            onSubmit={handleSubmit}
            validateOnBlur={true}
            validateOnChange={false}
          >
            {({ 
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              isSubmitting,
              setFieldTouched
            }) => (
              <View style={styles.formContainer}>
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
                  placeholder="Create a password"
                  secureTextEntry={true}
                  leftIcon={<Icon name="lock-closed" size={20} color="#666" />}
                  editable={!isLoading}
                  touched={touched.password}
                />

                {values.password.length > 0 && (
                  <PasswordRequirements password={values.password} />
                )}

                {errors.submit && (
                  <View style={styles.submitErrorContainer}>
                    <Icon name="alert-circle" size={20} color="#d32f2f" />
                    <Text style={styles.submitErrorText}>{errors.submit}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[styles.button, (isLoading || isSubmitting) && styles.buttonDisabled]}
                  onPress={handleSubmit}
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Icon name="person-add" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Create Account</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Already have an account? </Text>
                  <TouchableOpacity 
                    onPress={() => navigation.navigate('Login')}
                    disabled={isLoading}
                  >
                    <Text style={styles.loginLink}>Log In</Text>
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
            routes: [{ name: 'Welcome' }],
          });
        }}
        title="Registration Successful"
        message="Your account has been created successfully."
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
  logo: {
    width: 150,
    height: 150,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#0B6623',
    fontSize: 16,
    fontWeight: '600',
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

export default SignupScreen;