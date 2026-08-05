import { mapBackendRole } from '@/navigation/types/navigation.types';
import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function PaymentsTabScreen() {
  const userRole = useAuthStore((s) => s.user?.role);
  const role = mapBackendRole(userRole);

  if (role === 'renter') {
    return <Redirect href="/(drawer)/(tabs)/payments/renter" />;
  }
  return <Redirect href="/(drawer)/(tabs)/payments/owner" />;
}
