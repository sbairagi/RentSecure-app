import { useTheme } from '@/hooks/use-theme';
import { mapBackendRole } from '@/navigation/types/navigation.types';
import { useAuthStore } from '@/store/authStore';

export function AppNavigator() {
  const theme = useTheme();
  const { user } = useAuthStore();
  const role = mapBackendRole(user?.role);

  return null;
}
