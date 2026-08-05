import { mapBackendRole } from '@/navigation/types/navigation.types';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function DashboardScreen() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const backendRole = useAuthStore((s) => s.user?.role);
  const userRole = mapBackendRole(backendRole);

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  if (userRole === 'property_owner') {
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
