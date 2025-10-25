// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  API_VERSION: 'v1',
  ENDPOINTS: {
    AUTH: {
      SIGNUP: '/api/v1/auth/signup',
      SIGNIN: '/api/v1/auth/signin-json',
      VERIFY_OTP: '/api/v1/auth/verify-otp',
      RESEND_OTP: '/api/v1/auth/resend-otp',
      FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
      RESET_PASSWORD: '/api/v1/auth/reset-password',
      ME: '/api/v1/auth/me',
      VERIFY_TOKEN: '/api/v1/auth/verify-token',
      HOSPITAL_LOGIN: '/api/v1/auth/hospital/login',
    },
    SUPER_ADMIN: {
      LOGIN: '/api/v1/super-admin/login',
      ME: '/api/v1/super-admin/me',
      INVITATIONS: '/api/v1/super-admin/invitations',
      VALIDATE_TOKEN: '/api/v1/super-admin/validate-token',
      CLEANUP_EXPIRED: '/api/v1/super-admin/cleanup-expired',
    },
    DOCTORS: {
      ONBOARDING: '/api/v1/doctors/onboarding',
      PROFILE: '/api/v1/doctors/profile',
      SPECIALIZATIONS: '/api/v1/doctors/specializations',
      SCHEDULE: '/api/v1/doctors/schedule',
      INVITE: '/api/v1/doctors/invite',
    },
    PATIENTS: {
      ONBOARDING: '/api/v1/patients/onboarding',
      PROFILE: '/api/v1/patients/profile',
      MEDICAL_HISTORY: '/api/v1/patients/medical-history',
    },
    HOSPITALS: {
      ONBOARDING: '/hospitals/onboarding',
      PROFILE: '/hospitals',
    },
    UPLOADS: {
      BRANDING: '/api/v1/uploads/branding',
    },
    ONBOARDING: {
      STATUS: '/api/v1/onboarding/status',
      NEXT_STEP: '/api/v1/onboarding/next-step',
    },
  },
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000; // 30 seconds for general requests
export const LONG_REQUEST_TIMEOUT = 60000; // 60 seconds for heavy operations
export const SHORT_REQUEST_TIMEOUT = 15000; // 15 seconds for quick operations

// Default headers for API requests
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export default API_CONFIG;
