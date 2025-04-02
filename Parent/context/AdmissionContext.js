import React, { createContext, useState, useCallback, useEffect, useRef } from 'react';
import admissionService from '../services/admissionService';
import { useAuth } from '../context/AuthContext';

export const AdmissionContext = createContext();

const INITIAL_FORM_STATE = {
  student: {
    fullName: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    religion: '',
    residentialAddress: { 
      streetName: '', 
      houseNumber: '', 
      city: '', 
      region: '', 
      country: ''
    },
    medicalInformation: {
      bloodType: '',
      allergiesOrConditions: '',
      emergencyContactName: '',
      emergencyContactNumber: '',
    },
  },
  parentGuardian: {
    firstName: '',
    lastName: '',
    contactNumber: '',
    emailAddress: '',
    occupation: '',
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

export const AdmissionProvider = ({ children }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [draftSaveStatus, setDraftSaveStatus] = useState(null);
  const isMounted = useRef(true);
  const draftSaveTimer = useRef(null);
  const { userInfo } = useAuth();

  // Cleanup on unmount
  useEffect(() => {
    return () => { 
      isMounted.current = false;
      if (draftSaveTimer.current) {
        clearTimeout(draftSaveTimer.current);
      }
    };
  }, []);

  // Auto-save draft when form changes
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

  // Load saved draft on mount
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

  // Deep merge helper function
  const deepMerge = useCallback((target, source) => {
    if (typeof target !== 'object' || typeof source !== 'object') {
      return source;
    }
    
    const output = { ...target };
    for (const key in source) {
      if (source[key] instanceof Object && key in target) {
        output[key] = deepMerge(target[key], source[key]);
      } else {
        output[key] = source[key];
      }
    }
    return output;
  }, []);

  // Update form data
  const updateFormData = useCallback((updates) => {
    setFormData(prev => deepMerge(prev || INITIAL_FORM_STATE, updates));
    setValidationErrors({});
  }, [deepMerge]);

  // Validate form
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

  // Submit form
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
  
      const response = await admissionService.submitAdmissionForm(
        formData,
        userInfo?.token
      );
  
      if (isMounted.current) {
        setFormData(INITIAL_FORM_STATE);
      }
  
      await admissionService.clearFormDraft();
      return response;
    } catch (error) {
      if (isMounted.current) {
        setError(error.message || 'Could not submit your form. Please try again.');
      }
      return null;
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [formData, validateForm, isLoading, userInfo?.token]);  

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setValidationErrors({});
    setError(null);
  }, []);

  // Clear error
  const clearError = useCallback(() => setError(null), []);

  // Get admission status
  const getAdmissionStatus = useCallback(async () => {
    if (!userInfo?.id) return null;
    
    try {
      setIsLoading(true);
      const response = await admissionService.getAdmissionStatus(
        userInfo.id,
        userInfo.token
      );
      return response;
    } catch (error) {
      setError(error.message || 'Could not fetch admission status');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userInfo?.id, userInfo?.token]);

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
      getAdmissionStatus
    }}>
      {children}
    </AdmissionContext.Provider>
  );
};