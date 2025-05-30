import React, { useCallback, createContext, useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import admissionService from '../services/AdmissionService';
import * as SecureStorage from 'expo-secure-store';
import { studentSchema, parentSchema, academicSchema, documentsSchema, debounce } from '../utils/helpers';

const INITIAL_FORM_STATE = {
  student: {
    surName: '',
    firstName: '',
    middleName: '',
    gender: '',
    dateOfBirth: '',
    residentialAddress: { 
      street: '', 
      houseNumber: '', 
      city: '', 
      region: '', 
      country: '',
      homeTown: ''
    },
    nationality: '',
    livesWith: '',
    numberOfSiblings: 0,
    olderSiblings: 0,
    youngerSiblings: 0,
    otherChildrenInHouse: 0,
    medicalInformation: {
      bloodType: '',
      allergiesOrConditions: '',
      emergencyContactsName: '',
      emergencyContactsNumber: '',
      isChildImmunized: false
    },
  },
  parentGuardian: {
    fatherSurName: '',
    fatherFirstName: '',
    fatherMiddleName: '',
    fatherAddress: {
      street: '',
      houseNumber: '',
      city: '',
      region: '',
      country: ''
    },
    fatherReligion: '',
    fatherContactNumber: '',
    fatherOccupation: '',
    fatherCompanyName: '',
    fatherBusinessAddress: '',
    fatherEmailAddress: '',
    motherSurName: '',
    motherFirstName: '',
    motherMiddleName: '',
    motherAddress: {
      street: '',
      houseNumber: '',
      city: '',
      region: '',
      country: ''
    },
    motherReligion: '',
    motherContactNumber: '',
    motherOccupation: '',
    motherCompanyName: '',
    motherBusinessAddress: '',
    motherEmailAddress: '',
  },
  previousAcademicDetail: {
    lastSchoolAttended: '',
    lastClassCompleted: '',
  },
  admissionDetail: {
    classForAdmission: '',
    academicYear: '',
    preferredSecondLanguage: '',
    hasSiblingsInSchool: false,
    siblingName: '',
    siblingClass: '',
  },
  documents: {
    file1: null,
    file2: null,
    file3: null,
  },
};

export const AdmissionContext = createContext();

export const AdmissionProvider = ({ children, navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draftSaveStatus, setDraftSaveStatus] = useState(null);
  const [activeSection, setActiveSection] = useState('student');
  const isMounted = useRef(true);
  const draftSaveTimer = useRef(null);

  useEffect(() => {
    return () => { 
      isMounted.current = false;
      if (draftSaveTimer.current) {
        clearTimeout(draftSaveTimer.current);
      }
    };
  }, []);

  const loadDraft = async () => {
    try {
      setIsLoading(true);
      const draft = await admissionService.loadFormDraft();
      return draft || INITIAL_FORM_STATE;
    } catch (error) {
      setError('Could not load your saved information');
      return INITIAL_FORM_STATE;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const token = await SecureStorage.getItemAsync('authToken');
      if (!token) {
        throw new Error('Your session has expired. Please login again.');
      }

      // Verify token is still valid
      const { valid } = await AuthService.verifyToken(token);
      if (!valid) {
        throw new Error('Your session has expired. Please login again.');
      }

      const response = await admissionService.submitAdmissionForm(values);
      await admissionService.clearFormDraft();
      return response;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setSubmitting(false);
    }
  };

  const saveDraft = async (values) => {
    try {
      await admissionService.saveFormDraft(values);
      setDraftSaveStatus('saved');
      setTimeout(() => setDraftSaveStatus(null), 3000);
    } catch (error) {
      setDraftSaveStatus('error');
    }
  };

  // Debounced draft saving
  const debouncedSaveDraft = useCallback(
    debounce((values, errors) => {
      if (Object.keys(errors).length === 0) {
        saveDraft(values);
      }
    }, 2000),
    []
  );

  const validateSection = async (section, values) => {
    try {
      let schema;
      switch (section) {
        case 'student':
          schema = studentSchema;
          break;
        case 'parent':
          schema = parentSchema;
          break;
        case 'academic':
          schema = academicSchema;
          break;
        case 'documents':
          schema = documentsSchema;
          break;
        default:
          return {};
      }
      await schema.validate(values, { abortEarly: false });
      return {};
    } catch (err) {
      const errors = {};
      err.inner.forEach((error) => {
        errors[error.path] = error.message;
      });
      return errors;
    }
  };

  const goToSection = (sectionName) => {
    setActiveSection(sectionName);
    navigation.navigate(sectionName);
  };

  return (
    <Formik
      initialValues={INITIAL_FORM_STATE}
      onSubmit={handleSubmit}
      validateOnBlur={false}
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
        isSubmitting,
        validateForm,
        setErrors,
      }) => {
        // Auto-save draft when values change
        useEffect(() => {
          if (isLoading) return;
          debouncedSaveDraft(values, errors);
          return () => debouncedSaveDraft.cancel();
        }, [values, isLoading]);

        return (
          <AdmissionContext.Provider value={{
            formData: values,
            formErrors: errors,
            formTouched: touched,
            isLoading,
            error,
            draftSaveStatus,
            activeSection,
            handleFormChange: handleChange,
            handleFormBlur: handleBlur,
            submitForm: handleSubmit,
            setFormFieldValue: setFieldValue,
            isSubmitting,
            validateForm,
            validateSection,
            goToSection,
            resetForm: () => {
              Object.keys(INITIAL_FORM_STATE).forEach(key => {
                setFieldValue(key, INITIAL_FORM_STATE[key]);
              });
            },
            clearError: () => setError(null),
          }}>
            {children}
          </AdmissionContext.Provider>
        );
      }}
    </Formik>
  );
};