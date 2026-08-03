import { Colors } from '@/constants/theme';
import type { Theme } from './types';

export const LightTheme: Theme = {
  background: Colors.gray50,
  card: Colors.white,
  primary: Colors.primary,
  secondary: Colors.secondary,
  text: Colors.text,
  subText: Colors.gray500,
  border: Colors.border,
  success: Colors.success,
  warning: Colors.warning,
  danger: Colors.error,
  backgroundElement: Colors.gray100,
  backgroundSelected: Colors.gray200,
  textSecondary: Colors.gray500,
  surface: Colors.white,
};

export const DarkTheme: Theme = {
  background: Colors.darkBackground,
  card: Colors.darkSurface,
  primary: Colors.primaryLight,
  secondary: Colors.secondaryLight,
  text: Colors.darkText,
  subText: Colors.darkTextSecondary,
  border: Colors.darkBorder,
  success: Colors.secondaryLight,
  warning: Colors.warning,
  danger: Colors.error,
  backgroundElement: Colors.darkSurfaceElevated,
  backgroundSelected: Colors.darkBorderLight,
  textSecondary: Colors.darkTextSecondary,
  surface: Colors.darkSurface,
};
