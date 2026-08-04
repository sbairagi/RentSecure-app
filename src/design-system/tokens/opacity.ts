export const opacity = {
  none: 0,
  low: 0.25,
  medium: 0.5,
  high: 0.75,
  full: 1,
  disabled: 0.4,
  hover: 0.8,
  pressed: 0.6,
} as const;

export type OpacityKey = keyof typeof opacity;
export type OpacityValue = (typeof opacity)[OpacityKey];
