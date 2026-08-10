import { INACTIVITY_TIMEOUT, SESSION_TIMEOUT } from '@/constants/auth.constants';
import { authApi } from '@/services/auth/auth';
import { secureStorage } from '@/services/storage/secureStorage';
import type { User, UserRole } from '@/types';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: UserRole | null;
  permissions: string[];
  sessionExpiresAt: number | null;
  lastActivityAt: number | null;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  refresh: (accessToken: string, refreshToken: string) => Promise<void>;
  clearSession: () => Promise<void>;
  setSessionExpiry: (expiresAt: number) => void;
  updateLastActivity: () => void;
  getSessionRemaining: () => number | null;
  isSessionExpired: () => boolean;
  isInactivityTimeout: () => boolean;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  role: null,
  permissions: [],
  sessionExpiresAt: null,
  lastActivityAt: null,
  error: null,
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  ...initialState,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      role: user?.role || null,
      permissions: user?.permissions || [],
      error: null,
    }),

  setTokens: async (accessToken, refreshToken) => {
    try {
      await secureStorage.setItem('access_token', accessToken);
      await secureStorage.setItem('refresh_token', refreshToken);
      set({ accessToken, refreshToken });
    } catch (error) {
      set({ error: 'Failed to save tokens' });
      throw error;
    }
  },

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  login: async (user, accessToken, refreshToken) => {
    set({ isLoading: true, error: null });
    try {
      const sessionExpiresAt = Date.now() + SESSION_TIMEOUT;
      const lastActivityAt = Date.now();

      await secureStorage.setItem('auth_user', JSON.stringify(user));
      await secureStorage.setItem('access_token', accessToken);
      await secureStorage.setItem('refresh_token', refreshToken);
      await secureStorage.setItem('session_expires_at', sessionExpiresAt.toString());
      await secureStorage.setItem('last_activity_at', lastActivityAt.toString());

      set({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
        isLoading: false,
        role: user.role,
        permissions: user.permissions || [],
        sessionExpiresAt,
        lastActivityAt,
        error: null,
      });
    } catch (error) {
      set({ error: 'Login failed', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      const { accessToken } = get();
      if (accessToken) {
        try {
          await authApi.logout();
        } catch {
          // Ignore logout API errors
        }
      }
      await secureStorage.removeItem('auth_user');
      await secureStorage.removeItem('access_token');
      await secureStorage.removeItem('refresh_token');
      await secureStorage.removeItem('session_expires_at');
      await secureStorage.removeItem('last_activity_at');
      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
        role: null,
        permissions: [],
        sessionExpiresAt: null,
        lastActivityAt: null,
        error: null,
      });
    } catch {
      set({ error: 'Logout failed', isLoading: false });
    }
  },

  updateUser: (userData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),

  refresh: async (accessToken, refreshToken) => {
    await secureStorage.setItem('access_token', accessToken);
    if (refreshToken) {
      await secureStorage.setItem('refresh_token', refreshToken);
    }
    set({ accessToken, refreshToken });
  },

  clearSession: async () => {
    await secureStorage.removeItem('auth_user');
    await secureStorage.removeItem('access_token');
    await secureStorage.removeItem('refresh_token');
    await secureStorage.removeItem('session_expires_at');
    await secureStorage.removeItem('last_activity_at');
    set({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      role: null,
      permissions: [],
      sessionExpiresAt: null,
      lastActivityAt: null,
      error: null,
    });
  },

  setSessionExpiry: (expiresAt) => {
    secureStorage.setItem('session_expires_at', expiresAt.toString());
    set({ sessionExpiresAt: expiresAt });
  },

  updateLastActivity: () => {
    const lastActivityAt = Date.now();
    secureStorage.setItem('last_activity_at', lastActivityAt.toString());
    set({ lastActivityAt });
  },

  getSessionRemaining: () => {
    const { sessionExpiresAt } = get();
    if (!sessionExpiresAt) return null;
    return Math.max(0, sessionExpiresAt - Date.now());
  },

  isSessionExpired: () => {
    const { sessionExpiresAt } = get();
    if (!sessionExpiresAt) return true;
    return Date.now() > sessionExpiresAt;
  },

  isInactivityTimeout: () => {
    const { lastActivityAt } = get();
    if (!lastActivityAt) return true;
    return Date.now() - lastActivityAt > INACTIVITY_TIMEOUT;
  },
}));
