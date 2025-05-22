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
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomInput from '../../components/CustomInput';
import PasswordRequirements from '../../components/PasswordRequirements';
import { resetPasswordSchema } from '../../utils/helpers';
import SuccessModal from '../../components/SuccessModal';
import { AuthService } from '../../services/AuthService';

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { token } = route.params || {};
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccessModal, setShowSuccessModal] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values, { setErrors }) => {
    try {
      setIsLoading(true);
      await AuthService.resetPassword({
        token,
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      });
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
          <Text style={styles.subtitle}>Enter your new password</Text>
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
            initialValues={{ password: '', confirmPassword: '' }}
            validationSchema={resetPasswordSchema}
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
                  label="New Password *"
                  value={values.password}
                  onChangeText={handleChange('password')}
                  onBlur={() => {
                    setFieldTouched('password', true);
                    handleBlur('password');
                  }}
                  error={errors.password}
                  placeholder="Enter new password"
                  secureTextEntry={!showPassword}
                  leftIcon={<Icon name="lock-closed" size={20} color="#666" />}
                  rightIcon={
                    <Icon 
                      name={showPassword ? "eye-off" : "eye"} 
                      size={20} 
                      color="#666" 
                    />
                  }
                  onRightIconPress={togglePasswordVisibility}
                  editable={!isLoading}
                  touched={touched.password}
                />

                <CustomInput
                  label="Confirm Password *"
                  value={values.confirmPassword}
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={() => {
                    setFieldTouched('confirmPassword', true);
                    handleBlur('confirmPassword');
                  }}
                  error={errors.confirmPassword}
                  placeholder="Confirm new password"
                  secureTextEntry={!showPassword}
                  leftIcon={<Icon name="lock-closed" size={20} color="#666" />}
                  editable={!isLoading}
                  touched={touched.confirmPassword}
                />

                {values.password.length > 0 && (
                  <PasswordRequirements password={values.password} />
                )}

                <TouchableOpacity 
                  style={[styles.button, (isLoading || isSubmitting) && styles.buttonDisabled]} 
                  onPress={handleSubmit}
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <View style={styles.buttonContent}>
                      <Icon name="key" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Reset Password</Text>
                    </View>
                  )}
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
        title="Password Reset Successful"
        message="Your password has been reset successfully. You can now log in with your new password."
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
    color: '#0B6623',
  },
  subtitle: {
    fontSize: 18,
    color: '#0B6623',
  },
    logo: {
    width: 150,
    height: 150,
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
    gap: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
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

export default ResetPasswordScreen;