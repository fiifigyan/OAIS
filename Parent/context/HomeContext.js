import React, { createContext, useContext, useState, useEffect } from 'react';
import HomeService from '../services/HomeService';
import { useProfile } from '../context/ProfileContext';
import { sanitizeError } from '../utils/helpers';

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const { selectedStudent } = useProfile();
  const [homeData, setHomeData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!selectedStudent?.id) {
        throw new Error('No student selected');
      }
      
      const [homeResponse, eventsResponse] = await Promise.all([
        HomeService.getStudentHomeData(selectedStudent.id),
        HomeService.getUpcomingEvents()
      ]);
      
      setHomeData(homeResponse);
      setEvents(eventsResponse);
    } catch (error) {
      const friendlyError = sanitizeError(error);
      console.error('Error loading home data:', friendlyError);
      setError(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  const refreshHomeData = async () => {
    await loadHomeData();
  };

  useEffect(() => {
    if (selectedStudent) {
      loadHomeData();
    }
  }, [selectedStudent]);

  return (
    <HomeContext.Provider value={{
      homeData,
      events,
      loading,
      error,
      refreshHomeData
    }}>
      {children}
    </HomeContext.Provider>
  );
};

export const useHome = () => {
  const context = useContext(HomeContext);
  if (context === undefined) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};