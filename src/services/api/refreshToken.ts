import axios, { InternalAxiosRequestConfig } from 'axios';
import { API_CONFIG } from './endpoints';
import { createApiError } from './errorHandler';
import { logger } from './logger';
import { secureStorage } from '@/services/storage/secureStorage';

class RefreshTokenManager {
  private isRefreshing = false;
  private failedQueue: {
    resolve: (token: string) => void;
    reject: (error: Error) => void;
  }[] = [];

  async refreshToken(_axiosInstance: ReturnType<typeof axios.create>): Promise<string> {
    return new Promise((resolve, reject) => {
      this.failedQueue.push({ resolve, reject });
      this.processQueue();
    });
  }

  private async processQueue(): Promise<void> {
    if (this.isRefreshing) return;

    this.isRefreshing = true;

    try {
      const refreshToken = await this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(
        `${API_CONFIG.BASE_URL}${API_CONFIG.REFRESH_TOKEN_URL}`,
        { refresh: refreshToken },
        { timeout: API_CONFIG.TIMEOUT }
      );

      const { access, refresh: newRefreshToken } = response.data;

      if (!access) {
        throw new Error('No access token in refresh response');
      }

      await this.saveTokens(access, newRefreshToken || refreshToken);

      this.flushQueue(access);
    } catch (error) {
      this.flushQueue(null, error);
      await this.handleRefreshFailure();
    } finally {
      this.isRefreshing = false;
    }
  }

  private async getRefreshToken(): Promise<string | null> {
    try {
      return await secureStorage.getRefreshToken();
    } catch {
      return null;
    }
  }

  private async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    try {
      await secureStorage.setAccessToken(accessToken);
      await secureStorage.setRefreshToken(refreshToken);
    } catch (error) {
      logger.error('Failed to save tokens', error as Error);
    }
  }

  private flushQueue(token: string | null, error?: any): void {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) reject(error instanceof Error ? error : new Error('Token refresh failed'));
      else if (token) resolve(token);
      else reject(new Error('Token refresh failed'));
    });
    this.failedQueue = [];
  }

  private async handleRefreshFailure(): Promise<void> {
    try {
      await secureStorage.clearAuth();
    } catch (error) {
      logger.error('Failed to clear tokens', error as Error);
    }

    const { useAuthStore } = await import('@/store/authStore');
    useAuthStore.getState().clearSession();

    logger.info('Session expired - redirecting to login');
  }

  isRefreshInProgress(): boolean {
    return this.isRefreshing;
  }
}

export const refreshTokenManager = new RefreshTokenManager();

export async function handleTokenRefresh(
  error: any,
  config: InternalAxiosRequestConfig & { _retry?: boolean },
  axiosInstance: ReturnType<typeof axios.create>
): Promise<any> {
  const originalRequest = config;

  if (originalRequest._retry) {
    return Promise.reject(
      createApiError(error, originalRequest.headers?.[API_CONFIG.CORRELATION_ID_HEADER] as string)
    );
  }

  if (error.response?.status === 401) {
    if (refreshTokenManager.isRefreshInProgress()) {
      return refreshTokenManager.refreshToken(axiosInstance).then((token) => {
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `${API_CONFIG.BEARER_PREFIX}${token}`;
        }
        return axiosInstance(originalRequest);
      });
    }

    originalRequest._retry = true;

    try {
      const newToken = await refreshTokenManager.refreshToken(axiosInstance);
      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `${API_CONFIG.BEARER_PREFIX}${newToken}`;
      }
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      return Promise.reject(
        createApiError(
          refreshError,
          originalRequest.headers?.[API_CONFIG.CORRELATION_ID_HEADER] as string
        )
      );
    }
  }

  return Promise.reject(
    createApiError(error, originalRequest.headers?.[API_CONFIG.CORRELATION_ID_HEADER] as string)
  );
}
