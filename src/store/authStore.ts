import type { User } from '@/services/auth/types';
import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (user: User, accessToken: string, refreshToken: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, _get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: !!user,
      error: null,
    }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),

  login: async (user, accessToken, refreshToken) => {
    set({ isLoading: true, error: null });
    try {
      await mmkvStorage.setItem('auth_user', JSON.stringify(user));
      await mmkvStorage.setItem('access_token', accessToken);
      await mmkvStorage.setItem('refresh_token', refreshToken);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: 'Login failed', isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await mmkvStorage.removeItem('auth_user');
      await mmkvStorage.removeItem('access_token');
      await mmkvStorage.removeItem('refresh_token');
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch {
      set({ error: 'Logout failed', isLoading: false });
    }
  },

  updateUser: (userData) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...userData } : null,
    })),
}));
