export const shadows = {
  none: {
    boxShadow: 'none',
    elevation: 0,
  },
  sm: {
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  md: {
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  lg: {
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    elevation: 5,
  },
  xl: {
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
    elevation: 8,
  },
  '2xl': {
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.25)',
    elevation: 12,
  },
} as const;

export type ShadowScale = keyof typeof shadows;
export type ShadowValue = (typeof shadows)[ShadowScale];
