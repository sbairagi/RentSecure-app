import type { User } from '@/types';

export interface SendOtpResponse {
  message: string;
  expiresIn?: number;
}

export interface VerifyOtpResponse {
  refresh: string;
  access: string;
  user: User;
}

export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
  expiresIn?: number;
}

export interface SocialAuthResponse {
  refresh: string;
  access: string;
  user: User;
  isNewUser: boolean;
}

export interface ProfileResponse {
  user: User;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface BiometricSetupResponse {
  message: string;
  isBiometricEnabled: boolean;
}

export interface LogoutResponse {
  message: string;
}

export interface DeviceInfo {
  deviceId: string;
  deviceModel: string;
  deviceName: string;
  platform: 'ios' | 'android' | 'web';
  osVersion: string;
  appVersion: string;
  buildVersion: string;
}

export interface CheckUpdateResponse {
  isUpdateRequired: boolean;
  isOptional: boolean;
  latestVersion: string;
}

export interface MaintenanceResponse {
  isMaintenance: boolean;
  message?: string;
}
