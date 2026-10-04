import { authApi } from '@/services/auth/auth';
import { secureStorage } from '@/services/storage/secureStorage';
import { useAuthStore } from '@/store/authStore';
import { logger } from '@/services/api/logger';
import { SECURITY_CONSTANTS } from '../constants';
import type { TokenPair, SessionState } from '../types';

export class TokenManager {
  private refreshPromise: Promise<string | null> | null = null;

  async initialize(): Promise<void> {
    const accessToken = await secureStorage.getAccessToken();
    const refreshToken = await secureStorage.getRefreshToken();
    const user = await secureStorage.getUser<any>();
    const sessionExpiry = await secureStorage.getSessionExpiry();
    const lastActivity = await secureStorage.getLastActivity();

    if (accessToken && refreshToken && user) {
      useAuthStore.setState({
        accessToken,
        refreshToken,
        user,
        isAuthenticated: true,
        role: user.role || null,
        permissions: user.permissions || [],
        sessionExpiresAt: sessionExpiry,
        lastActivityAt: lastActivity,
      });
    }
  }

  async saveTokens(tokens: TokenPair): Promise<void> {
    await secureStorage.setAccessToken(tokens.accessToken);
    await secureStorage.setRefreshToken(tokens.refreshToken);
    useAuthStore.setState({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  async saveUser(user: unknown): Promise<void> {
    await secureStorage.setUser(JSON.stringify(user));
    useAuthStore.setState({
      user: user as any,
      isAuthenticated: true,
    });
  }

  async setSessionExpiry(expiresAt: number): Promise<void> {
    await secureStorage.setSessionExpiry(expiresAt);
    useAuthStore.setState({ sessionExpiresAt: expiresAt });
  }

  async updateLastActivity(): Promise<void> {
    const now = Date.now();
    await secureStorage.setLastActivity(now);
    useAuthStore.setState({ lastActivityAt: now });
  }

  async getAccessToken(): Promise<string | null> {
    return secureStorage.getAccessToken();
  }

  async getRefreshToken(): Promise<string | null> {
    return secureStorage.getRefreshToken();
  }

  async refreshAccessToken(): Promise<string | null> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = (async (): Promise<string | null> => {
      try {
        const refreshToken = await secureStorage.getRefreshToken();
        if (!refreshToken) {
          return null;
        }

        const response = await authApi.refreshToken(refreshToken);
        const newAccessToken = response.access;
        const newRefreshToken = response.refresh || refreshToken;

        await secureStorage.setAccessToken(newAccessToken);
        if (newRefreshToken) {
          await secureStorage.setRefreshToken(newRefreshToken);
        }

        useAuthStore.setState({
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
        });

        return newAccessToken;
      } catch (error) {
        logger.error('Token refresh failed', error as Error);
        await this.clearSession();
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async clearSession(): Promise<void> {
    try {
      const { accessToken } = useAuthStore.getState();
      if (accessToken) {
        try {
          await authApi.logout();
        } catch {
          // Ignore logout API errors
        }
      }
    } catch {
      // Ignore errors during logout
    }

    await secureStorage.clearAuth();
    useAuthStore.setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      role: null,
      permissions: [],
      sessionExpiresAt: null,
      lastActivityAt: null,
      error: null,
    });
  }

  getSessionState(): SessionState {
    const state = useAuthStore.getState();
    const now = Date.now();
    const sessionExpiresAt = state.sessionExpiresAt;
    const lastActivityAt = state.lastActivityAt;

    const isExpired = sessionExpiresAt !== null && now > sessionExpiresAt;
    const isInactivityTimeout =
      lastActivityAt !== null && now - lastActivityAt > SECURITY_CONSTANTS.INACTIVITY_TIMEOUT_MS;
    const remainingMs =
      sessionExpiresAt !== null ? Math.max(0, sessionExpiresAt - now) : null;

    return {
      isAuthenticated: state.isAuthenticated,
      expiresAt: sessionExpiresAt,
      lastActivityAt,
      isExpired,
      isInactivityTimeout,
      remainingMs,
    };
  }

  isSessionExpired(): boolean {
    return this.getSessionState().isExpired;
  }

  isInactivityTimeout(): boolean {
    return this.getSessionState().isInactivityTimeout;
  }

  getSessionRemainingMs(): number | null {
    return this.getSessionState().remainingMs;
  }
}

export const tokenManager = new TokenManager();
