// Description: Application configuration.
export const appConfig = {
    APP_NAME: 'ROYALS INTERNATIONAL SCHOOL',
    APP_SHORT_NAME: 'RIS',
    APP_VERSION: '1.0.0',
    isDevelopment: process.env.NODE_ENV === 'development'
};

// Description: API configuration.
export const APIConfig = {
    BASE_URL: 'https://73xd35pq-2025.uks1.devtunnels.ms',
    AUTH:{
      SIGNUP: '/api/parent/auth/signup',
      LOGIN: '/api/parent/auth/login',
      LOGOUT: '/api/parent/auth/logout',
      FORGOT: '/api/parent/auth/forgot',
      RESET: '/api/parent/auth/reset',
    },
    ADMISSIONS:{
      SUBMIT: '/api/parent/admissions/submit',
      STATUS: '/api/parent/admissions/status',
    },
    NOTIFICATIONS:{
      SEND: '/api/parent/notifications/send',
      LIST: '/api/parent/notifications/list',
      MARK_READ: '/api/parent/notifications/mark-read',
      DELETE: '/api/parent/notifications/delete',
      SAVE_PUSH_TOKEN: '/api/parent/notificationToken/saveToken',
    },
    STUDENT_INFO: {
      PROFILE: '/api/parents/studentsInformation/profile',
      HOME: '/api/parents/studentsInformation/home',
      FEES: '/api/parents/studentsInformation/fees',
      ATTENDANCE: '/api/parents/studentsInformation/attendance',
      GRADE: '/api/parents/studentsInformation/grade',
      PROGRESS: '/api/parents/studentsInformation/progressReport',
    },
    EVENTS:{
      UPCOMING: '/api/events/upcoming',
    },
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