import { createContext, useContext } from "react";
import { LightTheme, type Theme } from "./index";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeContextValue {
  mode: ThemeMode;
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

export const ThemeContext = createContext<ThemeContextValue>({
  mode: "system",
  theme: LightTheme,
  setMode: () => {},
  isDark: false,
});

export function useAppTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
