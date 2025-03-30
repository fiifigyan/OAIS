import React, { createContext, useState } from 'react';
import {
  processMoMoPayment,
  processStripePayment,
  processPayPalPayment,
  processBankTransfer,
} from '../services/PaymentService';

export const PaymentContext = createContext();

export const PaymentProvider = ({ children }) => {
  const [payments, setPayments] = useState([]);
  const [error, setError] = useState(null);

  const addPayment = (payment) => {
    setPayments((prevPayments) => [...prevPayments, payment]);
  };

  const processPayment = async (method, paymentDetails) => {
    try {
      let paymentResult;
      switch (method) {
        case 'MoMo':
          paymentResult = await processMoMoPayment(
            paymentDetails.amount,
            paymentDetails.currency,
            paymentDetails.externalId,
            paymentDetails.payerId
          );
          break;
        case 'Credit Card':
          paymentResult = await processStripePayment(
            paymentDetails.amount,
            paymentDetails.currency,
            paymentDetails.cardDetails
          );
          break;
        case 'PayPal':
          paymentResult = await processPayPalPayment(
            paymentDetails.amount,
            paymentDetails.currency
          );
          break;
        case 'Bank Transfer':
          paymentResult = await processBankTransfer(
            paymentDetails.amount,
            paymentDetails.accountDetails
          );
          break;
        default:
          throw new Error('Invalid payment method');
      }

      const payment = {
        id: paymentResult.id || Math.random().toString(),
        amount: paymentDetails.amount,
        method,
        date: new Date().toISOString(),
      };
      addPayment(payment);
      setError(null);
      return payment;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  return (
    <PaymentContext.Provider value={{ payments, error, processPayment }}>
      {children}
    </PaymentContext.Provider>
  );
};