import { useAuthNavigation } from '@/features/authentication/hooks/useAuthNavigation';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();
  const { navigateToRoleDashboard } = useAuthNavigation();

  if (isAuthenticated) {
    return <Redirect href="/(drawer)/(tabs)/dashboard" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
