import { useAppTheme } from "@/theme/ThemeContext";

export function useTheme() {
  const { theme } = useAppTheme();
  return theme;
}
