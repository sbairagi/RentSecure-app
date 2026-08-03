import { createContext, useContext } from 'react';
import { LightTheme } from './themes';
import type { ThemeContextValue, ThemeMode } from './types';

export type { ThemeContextValue, ThemeMode };

export const ThemeContext = createContext<ThemeContextValue>({
  mode: 'system',
  theme: LightTheme,
  setMode: () => {},
  isDark: false,
});

export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
