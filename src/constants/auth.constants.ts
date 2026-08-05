import type { UserRole } from '@/types';

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  super_admin: 7,
  admin: 6,
  property_owner: 5,
  ca_partner: 4,
  caretaker: 3,
  support_executive: 2,
  renter: 1,
  user: 0,
};

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  admin: 'Admin',
  property_owner: 'Property Owner',
  renter: 'Renter',
  caretaker: 'Caretaker',
  ca_partner: 'CA Partner',
  support_executive: 'Support Executive',
  user: 'User',
};

export const SESSION_TIMEOUT = 30 * 60 * 1000;
export const INACTIVITY_TIMEOUT = 15 * 60 * 1000;
export const BIOMETRIC_TIMEOUT = 5 * 60 * 1000;
export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 300;
export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCKOUT_DURATION = 15 * 60 * 1000;
export const PASSWORD_MIN_LENGTH = 8;
export const TOKEN_REFRESH_BUFFER = 5 * 60 * 1000;
export const APP_VERSION_CHECK_INTERVAL = 24 * 60 * 60 * 1000;

export const BIOMETRIC_OPTIONS = {
  title: 'SecureNest Authentication',
  subtitle: 'Use biometric to login',
  description: 'Authenticate using Face ID or Fingerprint',
  cancelLabel: 'Cancel',
  fallbackLabel: 'Use Passcode',
  deviceCredentialsFallback: true,
} as const;

export const AUTH_ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_INACTIVE: 'Your account is inactive',
  USER_NOT_VERIFIED: 'Please verify your email first',
  INVALID_OTP: 'Invalid or expired OTP',
  OTP_EXPIRED: 'OTP has expired. Please request a new one',
  TOKEN_EXPIRED: 'Session expired. Please login again',
  REFRESH_TOKEN_EXPIRED: 'Session expired. Please login again',
  NETWORK_ERROR: 'Network error. Please check your connection',
  TOO_MANY_ATTEMPTS: 'Too many login attempts. Please try again later',
  ACCOUNT_LOCKED: 'Account temporarily locked. Please try again later',
  MAINTENANCE_MODE: 'App is under maintenance. Please try again later',
  UPDATE_REQUIRED: 'Please update the app to continue',
  BIOMETRIC_NOT_ENROLLED: 'Biometric authentication is not set up',
  BIOMETRIC_NOT_AVAILABLE: 'Biometric authentication is not available',
  BIOMETRIC_FAILED: 'Biometric authentication failed',
  DEVICE_NOT_SUPPORTED: 'This device is not supported',
  ROOTED_DEVICE: 'Running on rooted device is not allowed',
  JAILBROKEN_DEVICE: 'Running on jailbroken device is not allowed',
} as const;

export const APP_UPDATE_MESSAGES = {
  FORCE_UPDATE: 'A new version is required. Please update to continue.',
  OPTIONAL_UPDATE: 'A new version is available. Update for the best experience.',
} as const;
