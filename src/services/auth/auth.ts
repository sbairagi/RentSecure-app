import { apiService } from '../api/apiClient';
import type { User } from './types';

export const authApi = {
  sendOtp: async (phone: string, referralCode?: string) => {
    const response = await apiService.post<{ message: string }>('/auth/send-otp/', {
      phone,
      referral_code: referralCode,
    });
    return response;
  },

  verifyOtp: async (phone: string, otp: string, role: 'owner' | 'renter') => {
    const endpoint = role === 'owner' ? '/auth/owner/verify-otp/' : '/auth/renter/verify-otp/';
    const response = await apiService.post<{
      refresh: string;
      access: string;
      user: User;
    }>(endpoint, { phone, otp });
    return {
      user: response.user,
      accessToken: response.access,
      refreshToken: response.refresh,
    };
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiService.post<{
      access: string;
      refresh?: string;
    }>('/token/refresh', { refresh: refreshToken });
    return response;
  },

  getProfile: async () => {
    const response = await apiService.get<{ user: User }>('/auth/profile');
    return response;
  },

  updateProfile: async (data: Partial<User>) => {
    const response = await apiService.put<{ user: User }>('/auth/profile', data);
    return response;
  },
};
