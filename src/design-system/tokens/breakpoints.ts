export const breakpoints = {
  xs: 0,
  sm: 320,
  md: 480,
  lg: 768,
  xl: 1024,
  xxl: 1280,
} as const;

export type BreakpointKey = keyof typeof breakpoints;
export type BreakpointValue = (typeof breakpoints)[BreakpointKey];

export const isSmallScreen = (width: number) => width < breakpoints.md;
export const isMediumScreen = (width: number) => width >= breakpoints.md && width < breakpoints.lg;
export const isLargeScreen = (width: number) => width >= breakpoints.lg;
