import { DarkTheme, DefaultTheme, ThemeProvider as ExpoThemeProvider } from 'expo-router';
import { useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';
import { ThemeContext, type ThemeContextValue, type ThemeMode } from './context';
import { DarkTheme as AppDarkTheme, LightTheme } from './themes';
import type { Theme } from './types';

export interface ThemeManagerProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeManager({ children, defaultMode = 'system' }: ThemeManagerProps) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  const resolvedMode = mode === 'system' ? (systemColorScheme === 'dark' ? 'dark' : 'light') : mode;
  const theme: Theme = resolvedMode === 'dark' ? AppDarkTheme : LightTheme;
  const isDark = resolvedMode === 'dark';

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      mode,
      theme,
      setMode,
      isDark,
    }),
    [mode, theme, isDark]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ExpoThemeProvider value={isDark ? DarkTheme : DefaultTheme}>{children}</ExpoThemeProvider>
    </ThemeContext.Provider>
  );
}
