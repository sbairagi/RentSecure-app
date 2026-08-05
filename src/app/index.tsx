import { useAuthStore } from '@/store/authStore';
import { Redirect } from 'expo-router';

export default function HomeScreen() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Redirect href="/(drawer)/(tabs)/dashboard" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
