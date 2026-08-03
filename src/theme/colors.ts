import { Platform } from 'react-native';

export const Colors = {
  blue500: '#2563EB',
  blue600: '#1D4ED8',

  green500: '#10B981',

  red500: '#EF4444',

  yellow500: '#F59E0B',

  white: '#FFFFFF',
  black: '#000000',

  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
};

export const COLORS = {
  primary: '#2D9CDB',
  secondary: '#27AE60',
  background: '#F2F2F2',
  cardBackground: '#FFFFFF',
  text: '#333333',
  textLight: '#828282',
  danger: '#EB5757',
  warning: '#F2994A',
  success: '#6FCF97',
  darkBackground: '#1A1A1A',
  darkCard: '#262626',
  darkText: '#E0E0E0',
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const FONT = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 10,
  padding: 24,
};

export type ThemeColor =
  'text' | 'background' | 'backgroundElement' | 'backgroundSelected' | 'textSecondary';

export type Theme = {
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
};
