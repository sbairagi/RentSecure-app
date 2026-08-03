import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function DashboardScreen() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const userRole = useAuthStore((s) => s.user?.role);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (userRole === 'owner') {
    return <Redirect href="/(tabs)/dashboard/owner" />;
  }

  if (userRole === 'caretaker') {
    return <Redirect href="/(tabs)/dashboard/caretaker" />;
  }

  if (userRole === 'renter') {
    return <Redirect href="/(tabs)/dashboard/renter" />;
  }

  return <Redirect href="/(tabs)/dashboard/default" />;
}
