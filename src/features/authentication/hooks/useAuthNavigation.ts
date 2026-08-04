import { ROLE_NAVIGATION } from '@/constants/auth.constants';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export const useAuthNavigation = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  const getDefaultRouteForRole = useCallback((role: string): string => {
    return ROLE_NAVIGATION[role as keyof typeof ROLE_NAVIGATION] || '/(auth)/welcome';
  }, []);

  const navigateToRoleDashboard = useCallback(
    (role: string) => {
      const route = getDefaultRouteForRole(role);
      router.replace(route as any);
    },
    [getDefaultRouteForRole, router]
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
