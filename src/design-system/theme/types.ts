import { colors } from '../tokens/colors';

export interface DesignSystemTheme {
  colors: {
    primary: typeof colors.primary;
    secondary: typeof colors.secondary;
    accent: typeof colors.accent;
    neutral: typeof colors.neutral;
    success: typeof colors.success;
    warning: typeof colors.warning;
    error: typeof colors.error;
    info: typeof colors.info;
    white: string;
    black: string;
    transparent: string;
  };
  spacing: typeof import('../tokens/spacing').spacing;
  radius: typeof import('../tokens/radius').radius;
  typography: typeof import('../tokens/typography').typography;
  shadows: typeof import('../tokens/shadows').shadows;
  elevation: typeof import('../tokens/elevation').elevation;
  opacity: typeof import('../tokens/opacity').opacity;
  iconSizes: typeof import('../tokens/iconSizes').iconSizes;
  imageSizes: typeof import('../tokens/imageSizes').imageSizes;
  zIndex: typeof import('../tokens/zIndex').zIndex;
}

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  mode: ThemeMode;
  theme: DesignSystemTheme;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}
