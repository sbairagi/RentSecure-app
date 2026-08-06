import { useAuthNavigation } from '@/features/authentication/hooks/useAuthNavigation';
import { useAuthStore } from '@/store/authStore';
import { Slot } from 'expo-router';
import { useEffect } from 'react';

export default function AuthLayout() {
  const { isAuthenticated } = useAuthStore();
  const { navigateToRoleDashboard } = useAuthNavigation();

  useEffect(() => {
    if (isAuthenticated) {
      navigateToRoleDashboard();
    }
  }, [isAuthenticated, navigateToRoleDashboard]);

  if (isAuthenticated) {
    return null;
  }

  return <Slot />;
}
