import React, { createContext, useContext, useState } from 'react';
import ProfileService from '../services/ProfileService';

export const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [parentInfo, setParentInfo] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadParentProfile = async (parentId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ProfileService.getParentProfile(parentId);
      setParentInfo(data);
    } catch (error) {
      console.error('Failed to load parent profile:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateParentProfile = async (parentId, updates) => {
    try {
      setLoading(true);
      const updatedProfile = await ProfileService.updateParentProfile(parentId, updates);
      setParentInfo(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update profile:', error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (parentId) => {
    try {
      setLoading(true);
      setError(null);
      const students = await ProfileService.getStudentsByParent(parentId);
      setStudents(students);
      if (students.length > 0) {
        setSelectedStudent(students[0]); // Auto-select first student
      }
    } catch (error) {
      console.error('Failed to load students:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const selectStudent = (student) => {
    setSelectedStudent(student);
  };

  const value = {
    parentInfo,
    students,
    selectedStudent,
    loading,
    error,
    loadParentProfile,
    updateParentProfile,
    loadStudents,
    selectStudent,
    refreshProfile: loadParentProfile,
    refreshStudents: loadStudents
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);