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
import CustomInput from '../../components/CustomInput';
import { forgotPasswordSchema } from '../../utils/helpers';
import SuccessModal from '../../components/SuccessModal';
import { AuthService } from '../../services/AuthService';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);

  const handleSubmit = async (values, { setErrors }) => {
    try {
      setIsLoading(true);
      await AuthService.forgotPassword(values.email.trim());
      setShowSuccessModal(true);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsLoading(false);
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
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your email to receive a reset link</Text>
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
            initialValues={{ email: '' }}
            validationSchema={forgotPasswordSchema}
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

                <CustomInput
                  label="Email Address *"
                  value={values.email}
                  onChangeText={handleChange('email')}
                  onBlur={() => {
                    setFieldTouched('email', true);
                    handleBlur('email');
                  }}
                  error={errors.email}
                  placeholder="Enter your registered email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  leftIcon={<Icon name="mail" size={20} color="#666" />}
                  editable={!isLoading}
                  touched={touched.email}
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
                      <Icon name="mail" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Send Reset Link</Text>
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.backLink}
                  onPress={() => navigation.goBack()}
                  disabled={isLoading}
                >
                  <Text style={styles.backLinkText}>
                    <Icon name="arrow-back" size={16} color="#00873E" /> Back to Login
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigation.navigate('Login');
        }}
        title="Reset Email Sent"
        message="We've sent a password reset link to your email address. Please check your inbox."
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
    color: '#00873E',
  },
  subtitle: {
    fontSize: 18,
    color: '#00873E',
  },
    logo: {
    width: 150,
    height: 150,
  },
  formContainer: {
    padding: 20,
  },
  button: {
    backgroundColor: '#00873E',
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
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  backLink: {
    alignSelf: 'center',
    marginTop: 24,
  },
  backLinkText: {
    color: '#00873E',
    fontWeight: '600',
  },
  submitErrorContainer: {
    flexDirection: 'row',
    backgroundColor: '#ffebee',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
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

export default ForgotPasswordScreen;