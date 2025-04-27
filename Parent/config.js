import {BASE_URL,AUTH_SIGNUP,AUTH_LOGIN,AUTH_LOGOUT,AUTH_FORGOT,AUTH_RESET,ADMISSIONS_SUBMIT,ADMISSIONS_STATUS, NOTIFICATIONS_SAVE_PUSH_TOKEN,NOTIFICATIONS_SAVE,NOTIFICATIONS_GET_ALL,NOTIFICATIONS_DELETE,NOTIFICATIONS_MARK_AS_READ,STUDENT_INFO_PROFILE,STUDENT_INFO_HOME,STUDENT_INFO_FEES,STUDENT_INFO_ATTENDANCE,STUDENT_INFO_GRADE,STUDENT_INFO_PROGRESS,EVENTS_UPCOMING} from '@env';

// Description: Application configuration.
export const appConfig = {
    APP_NAME: 'OFORI ATTA INTERNATIONAL SCHOOL',
    APP_SHORT_NAME: 'OAIS',
    APP_VERSION: '1.0.0',
};

// Description: API configuration.
export const APIConfig = {
  BASE_URL: BASE_URL,
  AUTH: {
    SIGNUP: AUTH_SIGNUP,
    LOGIN: AUTH_LOGIN,
    LOGOUT: AUTH_LOGOUT,
    FORGOT_PASSWORD: AUTH_FORGOT,
    RESET_PASSWORD: AUTH_RESET,
  },
  ADMISSIONS: {
    SUBMIT: ADMISSIONS_SUBMIT,
    STATUS: ADMISSIONS_STATUS,
  },
  NOTIFICATIONS: {
    SAVE_PUSH_TOKEN: NOTIFICATIONS_SAVE_PUSH_TOKEN,
    NOTIFICATIONS_SAVE: NOTIFICATIONS_SAVE,
    NOTIFICATIONS_GET_ALL: NOTIFICATIONS_GET_ALL,
    NOTIFICATIONS_DELETE: NOTIFICATIONS_DELETE,
    NOTIFICATIONS_MARK_AS_READ: NOTIFICATIONS_MARK_AS_READ,
  },
  STUDENT_INFO: {
    PROFILE: STUDENT_INFO_PROFILE,
    HOME: STUDENT_INFO_HOME,
    FEES: STUDENT_INFO_FEES,
    ATTENDANCE: STUDENT_INFO_ATTENDANCE,
    GRADE: STUDENT_INFO_GRADE,
    PROGRESS: STUDENT_INFO_PROGRESS,
  },
  EVENTS: {
    UPCOMING: EVENTS_UPCOMING,
  },
};

// export const APIConfig = {
  // BASE_URL: 'https://73xd35pq-2025.uks1.devtunnels.ms',
  // AUTH: {
  //   SIGNUP: '/api/parent/auth/signup',
  //   LOGIN: '/api/parent/auth/login',
  //   LOGOUT: '/api/parent/auth/logout',
  //   FORGOT_PASSWORD: '/api/parent/auth/forgot',
  //   RESET_PASSWORD: '/api/parent/auth/reset',
  // },
  // ADMISSIONS: {
  //   SUBMIT: '/api/parent/admissions/submit',
  //   STATUS: '/api/parent/admissions/status',
  // },
  // NOTIFICATIONS: {
  //   SAVE_PUSH_TOKEN: '/api/parent/notificationToken/saveToken',
  //   NOTIFICATIONS_SAVE: '/api/parent/notifications/save',
  //   NOTIFICATIONS_GET_ALL: '/api/parent/notifications/retrieve',
  //   NOTIFICATIONS_DELETE: '/api/parent/notifications/delete{id}',
  //   NOTIFICATIONS_MARK_AS_READ: '/api/parent/notifications/{id}/read',
  // },
  // STUDENT_INFO: {
  //   PROFILE: '/api/parent/studentsInformation/profile',
  //   HOME: '/api/parent/studentsInformation/home',
  //   FEES: '/api/parent/studentsInformation/fees',
  //   ATTENDANCE: '/api/parent/studentsInformation/attendance',
  //   GRADE: '/api/parent/studentsInformation/grade',
  //   PROGRESS: '/api/parent/studentsInformation/progressReport',
  // },
  // EVENTS: {
  //   UPCOMING: '/api/events/upcoming',
  // },
// };


// Description: Google Maps configuration.
// export const googleMapsConfig = {
//   API_KEY: process.env.GOOGLE_MAPS_API_KEY
// }

// Description: Firebase configuration.

export const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

// Description: Payment configuration.
export const paymentConfig = {
  MOMO_PAYMENT: {
    BASE_URL: process.env.MOMO_PAY_BASE_URL,
    APP_ID: process.env.MOMO_PAY_APP_ID,
    SECRET_KEY: process.env.MOMO_PAY_SECRET_KEY,
    PARTNER_CODE: process.env.MOMO_PAY_PARTNER_CODE,
  },
  BANK_PAYMENT: {
    BASE_URL: process.env.BANK_PAYMENT_BASE_URL,
    APP_ID: process.env.BANK_PAYMENT_APP_ID,
    SECRET_KEY: process.env.BANK_PAYMENT_SECRET_KEY,
    BANK_NAME: process.env.BANK_PAYMENT_BANK_NAME,
    ACCOUNT_NUMBER: process.env.BANK_PAYMENT_ACCOUNT_NUMBER,
    ACCOUNT_NAME: process.env.BANK_PAYMENT_ACCOUNT_NAME,
    BRANCH: process.env.BANK_PAYMENT_BRANCH,
  }
};