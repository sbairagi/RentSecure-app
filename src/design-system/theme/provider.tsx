import React, { createContext, useContext, useMemo, useState } from 'react';
import { darkTheme, lightTheme } from './themes';
import type { DesignSystemTheme, ThemeContextValue, ThemeMode } from './types';

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function useDesignSystemTheme(): DesignSystemTheme {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useDesignSystemTheme must be used within a DesignSystemProvider');
  }
  return context.theme;
}

export function useThemeMode(): ThemeMode {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a DesignSystemProvider');
  }
  return context.mode;
}

export function useIsDark(): boolean {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useIsDark must be used within a DesignSystemProvider');
  }
  return context.isDark;
}

export function DesignSystemProvider({ children, defaultMode = 'light' }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  const theme = useMemo<DesignSystemTheme>(() => {
    return mode === 'dark' ? darkTheme : lightTheme;
  }, [mode]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      mode,
      theme,
      setMode,
      isDark: mode === 'dark',
    }),
    [mode, theme]
  );

  return <ThemeContext.Provider value={contextValue}>{children}</ThemeContext.Provider>;
}
