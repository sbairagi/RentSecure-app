import { mapBackendRole } from '@/navigation/types/navigation.types';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function MaintenanceTabScreen() {
  const userRole = useAuthStore((s) => s.user?.role);
  const role = mapBackendRole(userRole);

  if (role === 'renter') {
    return <Redirect href="/(drawer)/(tabs)/maintenance/renter" />;
  }
  return <Redirect href="/(drawer)/(tabs)/maintenance/dashboard" />;
}