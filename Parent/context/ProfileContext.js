import React, { createContext, useContext, useState, useCallback } from 'react';
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
      return data;
    } catch (error) {
      console.error('Failed to load parent profile:', error.message);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateParentProfile = async (parentId, updates) => {
    try {
      setLoading(true);
      setError(null);
      
      // Handle profile image upload if included
      if (updates.profileImage) {
        const imageResponse = await ProfileService.uploadParentProfileImage(
          parentId, 
          updates.profileImage
        );
        
        // Remove the image from updates, it's been handled separately
        delete updates.profileImage;
        
        // Add the returned image path to the updates
        if (imageResponse && imageResponse.profileImagePath) {
          updates.profileImagePath = imageResponse.profileImagePath;
        }
      }
      
      const updatedProfile = await ProfileService.updateParentProfile(parentId, updates);
      setParentInfo(updatedProfile);
      return updatedProfile;
    } catch (error) {
      console.error('Failed to update profile:', error.message);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async (parentId) => {
    try {
      setLoading(true);
      setError(null);
      const studentsData = await ProfileService.getStudentsByParent(parentId);
      setStudents(studentsData);
      return studentsData;
    } catch (error) {
      console.error('Failed to load students:', error.message);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getStudentById = async (studentId) => {
    try {
      setLoading(true);
      setError(null);
      
      // First check if we already have the student data cached
      const cachedStudent = students.find(student => student.studentId === studentId);
      if (cachedStudent) {
        setSelectedStudent(cachedStudent);
        setLoading(false);
        return cachedStudent;
      }
      
      // If not cached, fetch from API
      const studentData = await ProfileService.getStudentProfile(studentId);
      setSelectedStudent(studentData);
      return studentData;
    } catch (error) {
      console.error('Failed to get student profile:', error.message);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = {
    parentInfo,
    students,
    selectedStudent,
    loading,
    error,
    loadParentProfile,
    updateParentProfile,
    loadStudents,
    getStudentById,
    setSelectedStudent,
    clearError,
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