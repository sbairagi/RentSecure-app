import { mmkvStorage } from '@/services/storage/mmkv';
import { NativeModules } from 'react-native';
import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
}

interface ThemeActions {
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  initTheme: () => Promise<void>;
}

type ThemeStore = ThemeState & ThemeActions;

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: 'system',
  isDark: false,

  setMode: async (mode) => {
    await mmkvStorage.setItem('theme_mode', mode);
    const colorScheme = NativeModules?.SettingsManager?.appleLocale || 'light';
    const isDark = mode === 'dark' || (mode === 'system' && colorScheme === 'dark');
    set({ mode, isDark });
  },

  toggleTheme: async () => {
    const { mode } = get();
    const modes: ThemeMode[] = ['light', 'dark', 'system'];
    const currentIndex = modes.indexOf(mode);
    const newMode = modes[(currentIndex + 1) % modes.length];
    await get().setMode(newMode);
  },

  initTheme: async () => {
    const stored = await mmkvStorage.getItem('theme_mode');
    const validModes: ThemeMode[] = ['light', 'dark', 'system'];
    if (stored && validModes.includes(stored as ThemeMode)) {
      const mode = stored as ThemeMode;
      const isDark = mode === 'dark';
      set({ mode, isDark });
    }
  },
}));
