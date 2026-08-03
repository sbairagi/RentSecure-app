import { apiService } from '../api/apiClient';
import type { User } from './types';

export const authApi = {
  login: async (email: string, password: string) => {
    const response = await apiService.post<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>('/auth/login', { email, password });
    return response;
  },

  signup: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) => {
    const response = await apiService.post<{
      user: User;
      accessToken: string;
      refreshToken: string;
    }>('/auth/signup', data);
    return response;
  },

  forgotPassword: async (email: string) => {
    const response = await apiService.post<{ message: string }>('/auth/forgot-password', { email });
    return response;
  },

  resetPassword: async (token: string, newPassword: string) => {
    const response = await apiService.post<{ message: string }>('/auth/reset-password', {
      token,
      newPassword,
    });
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

  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await apiService.post<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response;
  },
};
