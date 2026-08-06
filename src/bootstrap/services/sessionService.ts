import { logger } from '@/services/api/logger';
import { authApi } from '@/services/auth/auth';
import { useAuthStore } from '@/store/authStore';
import type { BootstrapErrorType } from '../types/bootstrap';

class SessionService {
  private refreshAttempts = 0;

  async validateSession(accessToken: string | null): Promise<boolean> {
    if (!accessToken) {
      logger.info('No access token - session not validated');
      return false;
    }

    try {
      await authApi.getProfile();
      this.refreshAttempts = 0;
      logger.info('Session validation successful');
      return true;
    } catch (error: any) {
      const status = error?.statusCode;
      if (status === 401) {
        logger.info('Session invalid (401) - attempting token refresh');
        return false;
      }
      if (status === 403) {
        logger.warn('Session forbidden (403)');
        return false;
      }
      logger.warn('Session validation error', error);
      return false;
    }
  }

  async refreshSession(
    refreshToken: string | null
  ): Promise<{ success: boolean; errorType?: BootstrapErrorType }> {
    if (!refreshToken) {
      return { success: false, errorType: 'expired_token' };
    }

    if (this.refreshAttempts >= 2) {
      logger.warn('Max token refresh attempts reached');
      return { success: false, errorType: 'expired_token' };
    }

    try {
      this.refreshAttempts++;
      const response = await authApi.refreshToken(refreshToken);

      const newAccessToken = (response as any).accessToken || (response as any).access;
      const newRefreshToken = (response as any).refreshToken || (response as any).refresh;

      if (newAccessToken) {
        await useAuthStore.getState().refresh(newAccessToken, newRefreshToken || refreshToken);
      }

      this.refreshAttempts = 0;
      logger.info('Token refresh successful');
      return { success: true };
    } catch (error) {
      logger.error('Token refresh failed', error as Error);
      return { success: false, errorType: 'expired_token' };
    }
  }

  async validateAndRefresh(
    accessToken: string | null,
    refreshToken: string | null
  ): Promise<{
    success: boolean;
    errorType?: BootstrapErrorType;
    shouldClearSession: boolean;
  }> {
    const isValid = await this.validateSession(accessToken);
    if (isValid) {
      return { success: true, shouldClearSession: false };
    }

    const refreshResult = await this.refreshSession(refreshToken);
    if (refreshResult.success) {
      return { success: true, shouldClearSession: false };
    }

    return {
      success: false,
      errorType: refreshResult.errorType || 'expired_token',
      shouldClearSession: true,
    };
  }

  resetRefreshAttempts(): void {
    this.refreshAttempts = 0;
  }

  clearSession(): void {
    this.refreshAttempts = 0;
    useAuthStore.getState().clearSession();
  }
}

export const sessionService = new SessionService();
