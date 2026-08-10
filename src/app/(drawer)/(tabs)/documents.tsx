import { mapBackendRole } from '@/navigation/types/navigation.types';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function DocumentsTabScreen() {
  const userRole = useAuthStore((s) => s.user?.role);
  const role = mapBackendRole(userRole);

  if (role === 'renter') {
    return <Redirect href="/(drawer)/(tabs)/documents/renter" />;
  }
  return <Redirect href="/(drawer)/(tabs)/properties" />;
}