import { paymentConfig } from "../config";
import axios from "axios";
import { logger } from "../utils/helpers";

/**
 * Payment Service - Handles all payment-related API calls
 */

// Process payment with the backend
export const processPayment = async (method, paymentDetails) => {
  try {
    const response = await axios.post(`${paymentConfig.API_BASE_URL}/payments`, {
      method,
      ...paymentDetails,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    logger.error('Payment processing failed', error);
    throw new Error(error.response?.data?.message || 'Payment failed. Please try again.');
  }
};

// Fetch student fees from backend
export const fetchFees = async () => {
  try {
    const response = await axios.get(`${paymentConfig.API_BASE_URL}/fees`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });
    
    return response.data.map(fee => ({
      id: fee.id,
      description: fee.description,
      amount: parseFloat(fee.amount),
      status: fee.status,
      dueDate: fee.dueDate || '',
      paidDate: fee.paidDate || '',
      academicTerm: fee.academicTerm || '',
      notes: fee.notes || '',
    }));
  } catch (error) {
    logger.error('Failed to fetch fees', error);
    throw new Error(error.response?.data?.message || 'Failed to load fees. Please try again.');
  }
};

export const getPaymentHistory = async (page = 1, limit = 10) => {
  try {
    const response = await axios.get(`${paymentConfig.API_BASE_URL}/payments/history`, {
      params: { page, limit },
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });

    return {
      payments: response.data.payments.map(payment => ({
        id: payment.id,
        reference: payment.reference,
        amount: parseFloat(payment.amount),
        method: payment.method,
        status: payment.status,
        date: payment.createdAt,
        fees: payment.fees || [],
      })),
      total: response.data.total,
      page: response.data.page,
      pages: response.data.pages,
    };
  } catch (error) {
    logger.error('Failed to fetch payment history', error);
    throw new Error(error.response?.data?.message || 'Failed to load payment history.');
  }
};

// Get payment receipt details
export const getPaymentReceipt = async (paymentId) => {
  try {
    const response = await axios.get(`${paymentConfig.API_BASE_URL}/payments/${paymentId}/receipt`, {
      headers: {
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });

    return {
      id: response.data.id,
      reference: response.data.reference,
      amount: parseFloat(response.data.amount),
      method: response.data.method,
      status: response.data.status,
      date: response.data.createdAt,
      fees: response.data.fees || [],
      payerDetails: response.data.payerDetails || {},
      institutionDetails: response.data.institutionDetails || {},
    };
  } catch (error) {
    logger.error('Failed to fetch payment receipt', error);
    throw new Error(error.response?.data?.message || 'Failed to load receipt details.');
  }
};

// Payment provider specific functions
export const processMoMoPayment = async (details) => {
  try {
    const response = await axios.post(`${paymentConfig.MOMO_API_URL}/collection/v1_0/requesttopay`, {
      amount: details.amount,
      currency: details.currency || 'GHS',
      externalId: details.externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: details.phoneNumber,
      },
      payerMessage: details.message || 'School fees payment',
      payeeNote: details.note || 'Thank you for your payment',
    }, {
      headers: {
        'X-Reference-Id': details.externalId,
        'X-Target-Environment': paymentConfig.MOMO_ENVIRONMENT || 'sandbox',
        'Ocp-Apim-Subscription-Key': paymentConfig.MOMO_SUBSCRIPTION_KEY,
        'Authorization': `Bearer ${paymentConfig.MOMO_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    logger.error('MoMo payment failed', error);
    throw new Error(error.response?.data?.message || 'Mobile Money payment failed.');
  }
};

export const processBankTransfer = async (details) => {
  try {
    const response = await axios.post(`${paymentConfig.API_BASE_URL}/payments/bank-transfer`, {
      amount: details.amount,
      accountNumber: details.accountNumber,
      accountName: details.accountName,
      bankCode: details.bankCode,
      reference: details.reference,
      feeIds: details.feeIds,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${await getAuthToken()}`,
      },
    });

    return response.data;
  } catch (error) {
    logger.error('Bank transfer failed', error);
    throw new Error(error.response?.data?.message || 'Bank transfer failed.');
  }
};