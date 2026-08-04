export const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

export type IconSizeKey = keyof typeof iconSizes;
export type IconSizeValue = (typeof iconSizes)[IconSizeKey];
