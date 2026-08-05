import { mapBackendRole } from '@/navigation/types/navigation.types';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function DashboardTabScreen() {
  const userRole = useAuthStore((s) => s.user?.role);
  const role = mapBackendRole(userRole);

  if (role === 'renter') {
    return <Redirect href="/(drawer)/(tabs)/dashboard/renter" />;
  }
  if (role === 'caretaker') {
    return <Redirect href="/(drawer)/(tabs)/dashboard/caretaker" />;
  }
  return <Redirect href="/(drawer)/(tabs)/dashboard/owner" />;
}
