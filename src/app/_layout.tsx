import { useAuthStore } from '@/store/authStore';
import { Stack } from 'expo-router';

export default function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(auth)"
        options={{
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: !isAuthenticated,
        }}
      />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
