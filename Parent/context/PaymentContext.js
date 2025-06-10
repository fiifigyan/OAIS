import React, { createContext, useState, useEffect, useCallback } from 'react';
import { fetchFees, processPayment, getPaymentHistory } from '../services/PaymentService';
import { sanitizeError } from '../utils/helpers';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [fees, setFees] = useState([]);
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadFees = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchFees();
      setFees(data);
      setError(null);
    } catch (err) {
      setError(sanitizeError(err));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async () => {
    try {
      const data = await getPaymentHistory();
      setPayments(data);
    } catch (err) {
      setError(sanitizeError(err));
    }
  }, []);

  const makePayment = async (method, details) => {
    setIsLoading(true);
    try {
      const paymentResult = await processPayment(method, details);
      const newPayment = {
        ...paymentResult,
        date: new Date().toISOString(),
      };
      setPayments(prev => [newPayment, ...prev]);
      await loadFees(); // Refresh fees after payment
      return newPayment;
    } catch (err) {
      setError(sanitizeError(err));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFees();
    loadPayments();
  }, [loadFees, loadPayments]);

  return (
    <PaymentContext.Provider value={{
      fees,
      payments,
      isLoading,
      error,
      makePayment,
      refreshFees: loadFees,
      refreshPayments: loadPayments,
    }}>
      {children}
    </PaymentContext.Provider>
  );
};