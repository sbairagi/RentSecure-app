import { useState, useMemo } from "react";
import { useColorScheme } from "react-native";
import {
  ThemeProvider as ExpoThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "expo-router";
import { LightTheme, DarkTheme as AppDarkTheme } from "./index";
import type { Theme } from "./colors";
import {
  ThemeContext,
  type ThemeMode,
  type ThemeContextValue,
} from "./ThemeContext";

export { LightTheme, AppDarkTheme as DarkTheme };

export interface ThemeManagerProps {
  children: React.ReactNode;
  defaultMode?: ThemeMode;
}

export function ThemeManager({
  children,
  defaultMode = "system",
}: ThemeManagerProps) {
  const systemColorScheme = useColorScheme();
  const [mode, setMode] = useState<ThemeMode>(defaultMode);

  const resolvedMode =
    mode === "system"
      ? systemColorScheme === "dark"
        ? "dark"
        : "light"
      : mode;
  const theme: Theme = resolvedMode === "dark" ? AppDarkTheme : LightTheme;
  const isDark = resolvedMode === "dark";

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      mode,
      theme,
      setMode,
      isDark,
    }),
    [mode, theme, isDark],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ExpoThemeProvider value={isDark ? DarkTheme : DefaultTheme}>
        {children}
      </ExpoThemeProvider>
    </ThemeContext.Provider>
  );
}
