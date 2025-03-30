import React, { createContext, useContext, useState, useEffect } from 'react';
import ParentService from '../services/ParentService';

export const ParentContext = createContext();

export const ParentProvider = ({ children }) => {
  const [parentInfo, setParentInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadParentProfile = async (parentId) => {
    try {
      setLoading(true);
      setError(null);
      const data = await ParentService.getProfile(parentId);
      setParentInfo(data);
    } catch (error) {
      console.error('Failed to load parent profile:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    parentInfo,
    loading,
    error,
    loadParentProfile,
    refreshProfile: loadParentProfile, // Alias for consistency
  };

  return (
    <ParentContext.Provider value={value}>
      {children}
    </ParentContext.Provider>
  );
};

export const useParent = () => useContext(ParentContext);