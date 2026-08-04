import { AUTH_ERROR_MESSAGES } from '@/constants/auth.constants';
import { authApi } from '@/services/auth/auth';
import { useAuthStore } from '@/store/authStore';
import type {
  ForgotPasswordData,
  LoginCredentials,
  RegisterData,
  ResetPasswordData,
} from '@/types';
import { useCallback } from 'react';
import { showMessage } from 'react-native-flash-message';

export const useAuth = () => {
  const authStore = useAuthStore();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      try {
        const response = await authApi.login(credentials);
        await authStore.login(
          response.user,
          response.tokens.accessToken,
          response.tokens.refreshToken
        );
        return response;
      } catch (error: any) {
        const message = error.message || AUTH_ERROR_MESSAGES.INVALID_CREDENTIALS;
        showMessage({ message, type: 'danger' });
        throw error;
      }
    },
    [authStore]
  );

  const register = useCallback(
    async (data: RegisterData) => {
      try {
        const response = await authApi.register(data);
        await authStore.login(
          response.user,
          response.tokens.accessToken,
          response.tokens.refreshToken
        );
        return response;
      } catch (error: any) {
        const message = error.message || 'Registration failed';
        showMessage({ message, type: 'danger' });
        throw error;
      }
    },
    [authStore]
  );

  const socialLogin = useCallback(
    async (provider: 'google' | 'apple', token: string) => {
      try {
        const response = await authApi.socialAuth(provider, token);
        await authStore.login(
          response.user,
          response.tokens.accessToken,
          response.tokens.refreshToken
        );
        return response;
      } catch (error: any) {
        const message = error.message || 'Social login failed';
        showMessage({ message, type: 'danger' });
        throw error;
      }
    },
    [authStore]
  );

  const logout = useCallback(async () => {
    try {
      await authStore.logout();
    } catch (error: any) {
      showMessage({ message: error.message || 'Logout failed', type: 'danger' });
    }
  }, [authStore]);

  const forgotPassword = useCallback(async (data: ForgotPasswordData) => {
    try {
      const response = await authApi.forgotPassword(data);
      showMessage({ message: 'Password reset link sent to your email', type: 'success' });
      return response;
    } catch (error: any) {
      const message = error.message || 'Failed to send reset link';
      showMessage({ message, type: 'danger' });
      throw error;
    }
  }, []);

  const resetPassword = useCallback(async (data: ResetPasswordData) => {
    try {
      const response = await authApi.resetPassword(data);
      showMessage({ message: 'Password reset successful', type: 'success' });
      return response;
    } catch (error: any) {
      const message = error.message || 'Password reset failed';
      showMessage({ message, type: 'danger' });
      throw error;
    }
  }, []);

  const verifyOtp = useCallback(
    async (phone: string, otp: string, role: 'owner' | 'renter') => {
      try {
        const response = await authApi.verifyOtp(phone, otp, role);
        await authStore.login(
          response.user,
          response.tokens.accessToken,
          response.tokens.refreshToken
        );
        return response;
      } catch (error: any) {
        const message = error.message || 'Invalid OTP';
        showMessage({ message, type: 'danger' });
        throw error;
      }
    },
    [authStore]
  );

  return {
    ...authStore,
    login,
    register,
    socialLogin,
    logout,
    forgotPassword,
    resetPassword,
    verifyOtp,
  };
};
