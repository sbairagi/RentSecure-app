export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextValue {
  mode: ThemeMode;
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

export interface Theme {
  background: string;
  card: string;
  primary: string;
  secondary: string;
  text: string;
  subText: string;
  border: string;
  success: string;
  warning: string;
  danger: string;
  backgroundElement: string;
  backgroundSelected: string;
  textSecondary: string;
  surface: string;
}
