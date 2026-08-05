import type {
  AuthTokens,
  ForgotPasswordData,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
} from '@/types';
import { apiService } from '../api/apiClient';
import type {
  BiometricSetupResponse,
  ChangePasswordData,
  CheckUpdateResponse,
  DeviceInfo,
  LogoutResponse,
  MaintenanceResponse,
  ProfileResponse,
  RefreshTokenResponse,
  SendOtpResponse,
  SocialAuthResponse,
  VerifyOtpResponse,
} from './types';

const toAuthTokens = (response: { access: string; refresh?: string }): AuthTokens => ({
  accessToken: response.access,
  refreshToken: response.refresh || '',
});

export const authApi = {
  sendOtp: async (phone: string, referralCode?: string): Promise<SendOtpResponse> => {
    const response = await apiService.post<SendOtpResponse>('/auth/send-otp/', {
      phone,
      referral_code: referralCode,
    });
    return response;
  },

  verifyOtp: async (
    phone: string,
    otp: string,
    role: 'owner' | 'renter'
  ): Promise<{ tokens: AuthTokens; user: any }> => {
    const endpoint = role === 'owner' ? '/auth/owner/verify-otp/' : '/auth/renter/verify-otp/';
    const response = await apiService.post<VerifyOtpResponse>(endpoint, {
      phone,
      otp,
    });
    return {
      tokens: toAuthTokens(response),
      user: response.user,
    };
  },

  login: async (credentials: LoginCredentials): Promise<{ tokens: AuthTokens; user: any }> => {
    const response = await apiService.post<VerifyOtpResponse>('/auth/login/', credentials);
    return {
      tokens: toAuthTokens(response),
      user: response.user,
    };
  },

  register: async (data: RegisterData): Promise<{ tokens: AuthTokens; user: any }> => {
    const response = await apiService.post<VerifyOtpResponse>('/auth/register/', data);
    return {
      tokens: toAuthTokens(response),
      user: response.user,
    };
  },

  socialAuth: async (
    provider: 'google' | 'apple',
    token: string
  ): Promise<{ tokens: AuthTokens; user: any; isNewUser: boolean }> => {
    const response = await apiService.post<SocialAuthResponse>('/auth/social/', {
      provider,
      token,
    });
    return {
      tokens: toAuthTokens(response),
      user: response.user,
      isNewUser: response.isNewUser,
    };
  },

  forgotPassword: async (data: ForgotPasswordData): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>('/forgot-password/', data);
    return response;
  },

  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(`/reset-password/${data.token}/`, {
      new_password: data.password,
      confirmPassword: data.confirmPassword,
    });
    return response;
  },

  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await apiService.post<RefreshTokenResponse>('/api/token/refresh/', {
      refresh: refreshToken,
    });
    return response;
  },

  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiService.get<ProfileResponse>('/auth/profile/');
    return response;
  },

  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>('/change-password/', data);
    return response;
  },

  setupBiometric: async (): Promise<BiometricSetupResponse> => {
    const response = await apiService.post<BiometricSetupResponse>('/auth/biometric/setup/');
    return response;
  },

  disableBiometric: async (): Promise<BiometricSetupResponse> => {
    const response = await apiService.post<BiometricSetupResponse>('/auth/biometric/disable/');
    return response;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await apiService.post<LogoutResponse>('/auth/logout/');
    return response;
  },

  logoutAllDevices: async (): Promise<LogoutResponse> => {
    const response = await apiService.post<LogoutResponse>('/auth/logout-all/');
    return response;
  },

  registerDevice: async (deviceInfo: DeviceInfo): Promise<{ message: string }> => {
    const response = await apiService.post<{ message: string }>(
      '/auth/device/register/',
      deviceInfo
    );
    return response;
  },

  checkUpdate: async (): Promise<CheckUpdateResponse> => {
    const response = await apiService.get<CheckUpdateResponse>('/auth/app/version/');
    return response;
  },

  checkMaintenance: async (): Promise<MaintenanceResponse> => {
    const response = await apiService.get<MaintenanceResponse>('/auth/maintenance/');
    return response;
  },
};
