import React, { createContext, useContext, useState, useEffect } from 'react';
import HomeService from '../services/HomeService';
import { useStudent } from '../context/StudentContext';

const HomeContext = createContext();

export const HomeProvider = ({ children }) => {
  const { studentInfo } = useStudent();
  const [homeData, setHomeData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!studentInfo?.[0]?.studentId) {
        throw new Error('Student information not available');
      }
      
      const [homeResponse, eventsResponse] = await Promise.all([
        HomeService.getHomeData(studentInfo[0].studentId),
        HomeService.getUpcomingEvents()
      ]);
      
      setHomeData(homeResponse);
      setEvents(eventsResponse);
    } catch (error) {
      console.error('Error loading home data:', error);
      setError(error.message || 'Failed to load home data');
    } finally {
      setLoading(false);
    }
  };

  const refreshHomeData = async () => {
    await loadHomeData();
  };

  useEffect(() => {
    loadHomeData();
  }, [studentInfo]);

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