import { paymentConfig } from "../config";
import axios from "axios";

// Function to process MoMo payment
export const processMoMoPayment = async (amount, currency, externalId, payerId) => {
  try {
    const response = await axios.post(`${paymentConfig.MOMO_API_URL}/collection/v1_0/requesttopay`, {
      amount,
      currency,
      externalId,
      payer: {
        partyIdType: 'MSISDN',
        partyId: payerId,
      },
      payerMessage: 'Payment for services',
      payeeNote: 'Thank you for your payment',
    }, {
      headers: {
        'X-Reference-Id': externalId,
        'X-Target-Environment': 'sandbox',
        'Ocp-Apim-Subscription-Key': paymentConfig.MOMO_SUBSCRIPTION_KEY,
        Authorization: `Bearer ${paymentConfig.MOMO_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.message || 'MoMo payment failed');
  }
};

// Function to process Stripe (Credit Card) payment
export const processStripePayment = async (amount, currency, cardDetails) => {
  try {
    const formData = new URLSearchParams();
    formData.append('amount', amount * 100); // Convert to cents
    formData.append('currency', currency);
    formData.append('source', cardDetails.token); // Card token from Stripe.js
    formData.append('description', 'Payment for services');

    const response = await axios.post(`${paymentConfig.STRIPE_API_URL}/charges`, formData, {
      headers: {
        Authorization: `Bearer ${paymentConfig.STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Stripe payment failed');
  }
};

// Function to process PayPal payment
export const processPayPalPayment = async (amount, currency) => {
  try {
    const response = await axios.post(`${paymentConfig.PAYPAL_API_URL}/v2/payments`, {
      amount: {
        currency_code: currency,
        value: amount,
      },
    }, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${paymentConfig.PAYPAL_CLIENT_ID}:${paymentConfig.PAYPAL_SECRET}`,
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.message || 'PayPal payment failed');
  }
};

// Function to process Bank Transfer (mock implementation)
export const processBankTransfer = async (amount, accountDetails) => {
  try {
    const response = await axios.post(`${paymentConfig.BANK_TRANSFER_API_URL}/transfer`, {
      amount,
      accountDetails,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.message || 'Bank transfer failed');
  }
};