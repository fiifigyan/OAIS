// Description: Application configuration.
export const appConfig = {
    APP_NAME: 'ROYALS INTERNATIONAL SCHOOL',
    APP_SHORT_NAME: 'RIS',
    APP_VERSION: '1.0.0',
    isDevelopment: process.env.NODE_ENV === 'development'
};

// Description: Authentication configuration.
export const authConfig = {
    AUTH_BASE_URL: 'https://xpnnkh6h-8082.uks1.devtunnels.ms',
}

// Description: Admission configuration.
export const admissionConfig = {
    ADMISSION_BASE_URL: 'https://73xd35pq-2025.uks1.devtunnels.ms',
}

// Description: Firebase configuration.
export const firebaseConfig = {
    apiKey: "AIzaSyD-2z4Tm6GQw1Kv6b7hFZyJ1G4t9T2J1vA",
    authDomain: "royals-international-school.firebaseapp.com",
    projectId: "royals-international-school",
    storageBucket: "royals-international-school.appspot.com",
    messagingSenderId: "592534746069",
    appId: "1:592534746069:web:5c5b2a2b7c7f3d3b1c6c2e"
};

// Description: Payment configuration.
export const paymentConfig = {
    // Stripe API Configuration
    STRIPE_API_URL: 'https://api.stripe.com/v1',
    STRIPE_SECRET_KEY: 'YOUR_STRIPE_SECRET_KEY',

    // PayPal API Configuration
    PAYPAL_API_URL: 'https://api.sandbox.paypal.com',
    PAYPAL_CLIENT_ID: 'YOUR_PAYPAL_CLIENT_ID',
    PAYPAL_SECRET: 'YOUR_PAYPAL_SECRET',

    // Bank Transfer Mock API
    BANK_TRANSFER_API_URL: 'https://your-bank-api.com',

    // MoMo API Configuration
    MOMO_API_URL: 'https://momodeveloper.mtn.com/API-collections#api=collection&operation',
    MOMO_API_KEY: '6158fec0e4cc451a8cd79225226df29a',
    MOMO_SUBSCRIPTION_KEY: '2e7b4754a8e242208304dff1b39d1ea1'
};