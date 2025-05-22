import React, { createContext, useState, useEffect, useRef } from 'react';
import { Formik } from 'formik';
import * as yup from 'yup';
import admissionService from '../services/AdmissionService';
import * as SecureStorage from 'expo-secure-store';

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

const validationSchema = yup.object().shape({
  student: yup.object().shape({
    surName: yup.string().required('Surname is required'),
    firstName: yup.string().required('First name is required'),
    gender: yup.string().required('Gender is required'),
    dateOfBirth: yup.string().required('Date of birth is required'),
    residentialAddress: yup.object().shape({
      city: yup.string().required('City is required'),
      region: yup.string().required('Region is required'),
      country: yup.string().required('Country is required'),
    }),
    nationality: yup.string().required('Nationality is required'),
    livesWith: yup.string().required('This field is required'),
    medicalInformation: yup.object().shape({
      bloodType: yup.string().required('Blood type is required'),
      allergiesOrConditions: yup.string().required('This field is required'),
      emergencyContactsName: yup.string().required('Emergency contact name is required'),
      emergencyContactsNumber: yup.string().required('Emergency contact number is required'),
    }),
  }),
  parentGuardian: yup.object().shape({
    fatherSurName: yup.string().required('Father surname is required'),
    fatherFirstName: yup.string().required('Father first name is required'),
    fatherContactNumber: yup.string().required('Father contact number is required'),
    fatherOccupation: yup.string().required('Father occupation is required'),
    fatherEmailAddress: yup.string().email('Invalid email').required('Father email is required'),
    motherSurName: yup.string().required('Mother surname is required'),
    motherFirstName: yup.string().required('Mother first name is required'),
    motherContactNumber: yup.string().required('Mother contact number is required'),
    motherOccupation: yup.string().required('Mother occupation is required'),
    motherEmailAddress: yup.string().email('Invalid email').required('Mother email is required'),
  }),
  previousAcademicDetail: yup.object().shape({
    lastSchoolAttended: yup.string().required('Last school attended is required'),
    lastClassCompleted: yup.string().required('Last class completed is required'),
  }),
  admissionDetail: yup.object().shape({
    classForAdmission: yup.string().required('Class for admission is required'),
    academicYear: yup.string().required('Academic year is required'),
    preferredSecondLanguage: yup.string().required('Preferred language is required'),
    siblingName: yup.string().when('hasSiblingsInSchool', {
      is: true,
      then: yup.string().required('Sibling name is required'),
    }),
    siblingClass: yup.string().when('hasSiblingsInSchool', {
      is: true,
      then: yup.string().required('Sibling class is required'),
    }),
  }),
  documents: yup.object().shape({
    file1: yup.mixed().required('Passport photo is required'),
    file2: yup.mixed().required('Birth certificate is required'),
    file3: yup.mixed().required('Previous results are required'),
  }),
});

export const AdmissionContext = createContext();

export const AdmissionProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [draftSaveStatus, setDraftSaveStatus] = useState(null);
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

  return (
    <Formik
      initialValues={INITIAL_FORM_STATE}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
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
      }) => {
        // Auto-save draft
        useEffect(() => {
          if (isLoading) return;
          
          draftSaveTimer.current = setTimeout(() => {
            saveDraft(values);
          }, 5000);

          return () => clearTimeout(draftSaveTimer.current);
        }, [values, isLoading]);

        return (
          <AdmissionContext.Provider value={{
            formData: values,
            formErrors: errors,
            formTouched: touched,
            isLoading,
            error,
            draftSaveStatus,
            handleFormChange: handleChange,
            handleFormBlur: handleBlur,
            submitForm: handleSubmit,
            setFormFieldValue: setFieldValue,
            isSubmitting,
            validateForm,
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