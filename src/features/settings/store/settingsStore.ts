import { mmkvStorage } from '@/services/storage/mmkv';
import { create } from 'zustand';

interface SettingsState {
  themeMode: 'light' | 'dark' | 'system';
  notificationPreferences: Record<string, any> | null;
  biometricEnabled: boolean;
}

interface SettingsActions {
  setThemeMode: (mode: 'light' | 'dark' | 'system') => Promise<void>;
  setNotificationPreferences: (prefs: Record<string, any> | null) => void;
  setBiometricEnabled: (enabled: boolean) => Promise<void>;
  initSettings: () => Promise<void>;
}

type SettingsStore = SettingsState & SettingsActions;

const initialState: SettingsState = {
  themeMode: 'system',
  notificationPreferences: null,
  biometricEnabled: false,
};

export const useSettingsStore = create<SettingsStore>((set, _get) => ({
  ...initialState,

  setThemeMode: async (mode) => {
    await mmkvStorage.setItem('settings_theme_mode', mode);
    set({ themeMode: mode });
  },

  setNotificationPreferences: (prefs) => {
    set({ notificationPreferences: prefs });
  },

  setBiometricEnabled: async (enabled) => {
    await mmkvStorage.setItem('settings_biometric_enabled', String(enabled));
    set({ biometricEnabled: enabled });
  },

  initSettings: async () => {
    try {
      const themeMode = await mmkvStorage.getItem('settings_theme_mode');
      if (themeMode && ['light', 'dark', 'system'].includes(themeMode)) {
        set({ themeMode: themeMode as 'light' | 'dark' | 'system' });
      }

      const biometricEnabled = await mmkvStorage.getItem('settings_biometric_enabled');
      if (biometricEnabled !== null) {
        set({ biometricEnabled: biometricEnabled === 'true' });
      }
    } catch (error) {
      console.error('Failed to init settings:', error);
    }
  },
}));
