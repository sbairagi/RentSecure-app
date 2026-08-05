export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'property_owner'
  | 'renter'
  | 'caretaker'
  | 'ca_partner'
  | 'support_executive'
  | 'user';

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  username?: string;
  role: UserRole;
  avatar?: string;
  permissions?: string[];
  isVerified?: boolean;
  isActive?: boolean;
  deviceId?: string;
  lastLoginAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface LoginCredentials {
  email?: string;
  password?: string;
  phone?: string;
  otp?: string;
  socialToken?: string;
  provider?: 'google' | 'apple';
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: 'property_owner' | 'renter' | 'caretaker';
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  permissions: string[];
}

export type AuthMethod = 'email' | 'phone' | 'google' | 'apple' | 'biometric';

export type BiometricType = 'faceid' | 'fingerprint' | 'none';

export type MaintenanceStatus = {
  isMaintenance: boolean;
  message?: string;
  scheduledAt?: string;
};

export type AppVersionStatus = {
  isUpdateRequired: boolean;
  isOptional: boolean;
  latestVersion: string;
  storeUrl?: string;
};
