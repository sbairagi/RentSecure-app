import { useAppTheme } from '@/theme/context';

export function useTheme() {
  const { theme } = useAppTheme();
  return theme;
}
