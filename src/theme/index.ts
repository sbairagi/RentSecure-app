export * from "./colors";
export * from "./lightTheme";
export * from "./darkTheme";
export * from "./ThemeContext";
export { ThemeManager } from "./ThemeProvider";

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = 80;
export const MaxContentWidth = 800;
