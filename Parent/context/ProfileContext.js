import React, { createContext, useContext, useState, useCallback } from 'react';
import ProfileService from '../services/ProfileService';
import { sanitizeError } from '../utils/helpers';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    parent: null,
    students: [],
    activeStudent: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadProfileData = async (parentId) => {
    try {
      setLoading(true);
      setError(null);
      
      const [parentData, studentsData] = await Promise.all([
        ProfileService.getParentProfile(parentId),
        ProfileService.getStudentsByParent(parentId)
      ]);

      setProfileData({
        parent: parentData,
        students: studentsData,
        activeStudent: studentsData[0] || null
      });
      
      return { parent: parentData, students: studentsData };
    } catch (err) {
      const friendlyError = sanitizeError(err);
      setError(friendlyError);
      throw new Error(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const setActiveStudent = (studentId) => {
    const student = profileData.students.find(s => s.studentId === studentId);
    if (student) {
      setProfileData(prev => ({
        ...prev,
        activeStudent: student
      }));
    }
  };

  const updateProfile = async (type, id, updates) => {
    try {
      setLoading(true);
      
      // Optimistic update
      const prevData = {...profileData};
      if (type === 'parent') {
        setProfileData(prev => ({
          ...prev,
          parent: { ...prev.parent, ...updates }
        }));
      } else {
        setProfileData(prev => ({
          ...prev,
          activeStudent: { ...prev.activeStudent, ...updates }
        }));
      }

      // API call
      const updatedData = type === 'parent' 
        ? await ProfileService.updateParentProfile(id, updates)
        : await ProfileService.updateStudentProfile(id, updates);

      // Confirm update
      setProfileData(prev => ({
        ...prev,
        [type === 'parent' ? 'parent' : 'activeStudent']: updatedData
      }));
      
      return updatedData;
    } catch (err) {
      // Revert on error
      setProfileData(prevData);
      const friendlyError = sanitizeError(err);
      setError(friendlyError);
      throw new Error(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const uploadProfileImage = async (type, id, imageUri) => {
    try {
      // Prevent uploading for student type
      if (type !== 'parent') {
        throw new Error('Student profile images cannot be edited');
      }

      setLoading(true);
      
      const result = await ProfileService.uploadParentProfileImage(id, imageUri);
      
      // Update profile with new image
      await updateProfile(type, id, {
        profileImagePath: result.profileImagePath
      });
      
      return result;
    } catch (err) {
      const friendlyError = sanitizeError(err);
      setError(friendlyError);
      throw new Error(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    ...profileData,
    loading,
    error,
    loadProfileData,
    setActiveStudent,
    updateProfile,
    uploadProfileImage,
    clearError: useCallback(() => setError(null), [])
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);