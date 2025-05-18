import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import { admissionService } from '../services/AdmissionService';
import * as SecureStorage from 'expo-secure-store';
import { useAuth } from './AuthContext';
import { deepMerge } from '../utils/helpers';

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
  additionalContact: {
    fullName: '',
    address: {
      street: '',
      houseNumber: '',
      city: '',
      region: '',
      country: ''
    },
    contactNumber: '',
    relationshipToPupil: ''
  },
  authorizedPickup: {
    fullName: '',
    address: {
      street: '',
      houseNumber: '',
      city: '',
      region: '',
      country: ''
    },
    contactNumber: '',
    relationshipToPupil: ''
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

export const AdmissionProvider = ({ children }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [draftSaveStatus, setDraftSaveStatus] = useState(null);
  const isMounted = useRef(true);
  const draftSaveTimer = useRef(null);
  const { userInfo } = useAuth();

  useEffect(() => {
    return () => { 
      isMounted.current = false;
      if (draftSaveTimer.current) {
        clearTimeout(draftSaveTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isLoading || JSON.stringify(formData) === JSON.stringify(INITIAL_FORM_STATE)) {
      return;
    }
    
    if (draftSaveTimer.current) {
      clearTimeout(draftSaveTimer.current);
    }
    
    draftSaveTimer.current = setTimeout(async () => {
      try {
        const result = await admissionService.saveFormDraft(formData);
        if (isMounted.current && result) {
          setDraftSaveStatus('saved');
          setTimeout(() => {
            if (isMounted.current) {
              setDraftSaveStatus(null);
            }
          }, 3000);
        }
      } catch (error) {
        if (isMounted.current) {
          setDraftSaveStatus('error');
        }
      }
    }, 5000);
    
    return () => {
      if (draftSaveTimer.current) clearTimeout(draftSaveTimer.current);
    };
  }, [formData, isLoading]);

  useEffect(() => {
    const loadDraft = async () => {
      try {
        setIsLoading(true);
        const draft = await admissionService.loadFormDraft();
        if (isMounted.current) {
          setFormData(draft || INITIAL_FORM_STATE);
        }
      } catch (error) {
        if (isMounted.current) {
          setError('Could not load your saved information');
        }
      } finally {
        if (isMounted.current) {
          setIsLoading(false);
        }
      }
    };
    
    loadDraft();
  }, []);

  const updateFormData = useCallback((updates) => {
    setFormData(prev => deepMerge(prev || INITIAL_FORM_STATE, updates));
    setValidationErrors({});
  }, []);

  const validateForm = useCallback(async () => {
    try {
      const validation = await admissionService.validateForm(formData || INITIAL_FORM_STATE);
      if (isMounted.current) {
        setValidationErrors(validation.errors);
      }
      return validation;
    } catch (error) {
      if (isMounted.current) {
        setError('Could not validate your form. Please try again.');
      }
      return { isValid: false, errors: {} };
    }
  }, [formData]);

  const submitForm = useCallback(async () => {
    if (isLoading) return null;
  
    setIsLoading(true);
    setError(null);
    setValidationErrors({});
  
    try {
      const validation = await validateForm();
      if (!validation.isValid) {
        setIsLoading(false);
        return null;
      }

      const token = await SecureStorage.getItemAsync('authToken');
      if (!token) {
        throw new Error('Your session has expired. Please login again.');
      }
  
      const response = await admissionService.submitAdmissionForm(formData);
      
      if (isMounted.current) {
        setFormData(INITIAL_FORM_STATE);
      }
  
      await admissionService.clearFormDraft();
      return response;
    } catch (error) {
      console.error('Submission Error:', error);
      if (isMounted.current) {
        if (error.response?.status === 401) {
          setError('Session expired. Please login again.');
        } else {
          setError(error.message || 'Could not submit your form. Please try again.');
        }
      }
      return null;
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [formData, validateForm, isLoading]);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setValidationErrors({});
    setError(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const getAdmissionStatusById = useCallback(async (applicationId) => {
    if (!applicationId) return null;
    
    try {
      setIsLoading(true);
      const response = await admissionService.getAdmissionStatusById(applicationId);
      return response;
    } catch (error) {
      setError(error.message || 'Could not fetch admission status');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <AdmissionContext.Provider value={{
      formData,
      isLoading,
      error,
      validationErrors,
      draftSaveStatus,
      updateFormData,
      validateForm,
      submitForm,
      resetForm,
      clearError,
      getAdmissionStatusById,
      setFormData,
      setIsLoading,
    }}>
      {children}
    </AdmissionContext.Provider>
  );
};