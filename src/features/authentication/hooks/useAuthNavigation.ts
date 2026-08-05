import { ROLE_REDIRECT } from '@/navigation/utils/roleRedirect';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export const useAuthNavigation = () => {
  const router = useRouter();
  const { user } = useAuthStore();

  const getDefaultRouteForRole = useCallback((role: string): string => {
    return ROLE_REDIRECT[role as keyof typeof ROLE_REDIRECT] || '/(auth)/welcome';
  }, []);

  const navigateToRoleDashboard = useCallback(
    (role?: string) => {
      const userRole = role || user?.role || 'user';
      const route = getDefaultRouteForRole(userRole);
      router.replace(route as any);
    },
    [getDefaultRouteForRole, router, user?.role]
  );

  const navigateToLogin = useCallback(() => {
    router.replace('/(auth)/welcome');
  }, [router]);

  const navigateToWelcome = useCallback(() => {
    router.replace('/(auth)/welcome');
  }, [router]);

  return {
    navigateToRoleDashboard,
    navigateToLogin,
    navigateToWelcome,
    getDefaultRouteForRole,
  };
};
