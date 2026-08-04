import { colors } from '../tokens/colors';
import { elevation } from '../tokens/elevation';
import { iconSizes } from '../tokens/iconSizes';
import { imageSizes } from '../tokens/imageSizes';
import { opacity } from '../tokens/opacity';
import { radius } from '../tokens/radius';
import { shadows } from '../tokens/shadows';
import { spacing } from '../tokens/spacing';
import { typography } from '../tokens/typography';
import { zIndex } from '../tokens/zIndex';
import { DesignSystemTheme } from './types';

export const lightTheme: DesignSystemTheme = {
  colors: {
    ...colors,
    neutral: { ...colors.neutral },
  },
  spacing,
  radius,
  typography,
  shadows,
  elevation,
  opacity,
  iconSizes,
  imageSizes,
  zIndex,
};

export const darkTheme: DesignSystemTheme = {
  colors: {
    ...colors,
    neutral: {
      50: '#0F172A',
      100: '#1E293B',
      200: '#334155',
      300: '#475569',
      400: '#64748B',
      500: '#94A3B8',
      600: '#CBD5E1',
      700: '#E2E8F0',
      800: '#F1F5F9',
      900: '#F8FAFC',
      950: '#FFFFFF',
    } as any,
  },
  spacing,
  radius,
  typography,
  shadows,
  elevation,
  opacity,
  iconSizes,
  imageSizes,
  zIndex,
};
