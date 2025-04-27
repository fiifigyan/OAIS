import React, { createContext, useContext, useState } from 'react';
import StudentService from '../services/StudentService';
import { useParent } from '../context/ParentContext';

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  const { parentInfo } = useParent();
  const [studentInfo, setStudentInfo] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadStudentInfo = async () => {
    if (!parentInfo?.id) {
      setError('Parent information not available');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const students = await StudentService.getStudentsByParent(parentInfo.id);
      setStudentInfo(students || []);
    } catch (error) {
      console.error("Error loading students:", error);
      setError(error.message);
      setStudentInfo([]);
    } finally {
      setLoading(false);
    }
  };

  const getStudentProfile = async (studentId) => {
    if (!studentId) {
      throw new Error('Student ID is required');
    }
    
    try {
      setLoading(true);
      setError(null);
      const profile = await StudentService.getStudentProfile(studentId);
      return profile;
    } catch (error) {
      console.error("Error loading student profile:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateStudentProfile = async (studentId, updates) => {
    if (!studentId) {
      throw new Error('Student ID is required');
    }
    
    try {
      setLoading(true);
      const updatedProfile = await StudentService.updateStudentProfile(studentId, updates);
      return updatedProfile;
    } catch (error) {
      console.error("Error updating student profile:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    studentInfo,
    loading,
    error,
    loadStudentInfo,
    getStudentProfile,
    updateStudentProfile,
    refreshStudents: loadStudentInfo,
  };

  return (
    <StudentContext.Provider value={value}>
      {children}
    </StudentContext.Provider>
  );
};

export const useStudent = () => useContext(StudentContext);