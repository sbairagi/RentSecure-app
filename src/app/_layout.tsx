import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef } from 'react';

import { useBootstrap } from '@/bootstrap/hooks/useBootstrap';
import {
  BootstrapSplashScreen,
  ForceUpdateScreen,
  MaintenanceScreen,
  OfflineScreen,
  SessionExpiredScreen,
} from '@/bootstrap/screens';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useAuthStore } from '@/store/authStore';
import { useNotificationColdStart } from '@/features/notifications/hooks';

SplashScreen.preventAutoHideAsync();

export default function AppLayout() {
  const [fontsLoaded] = useFonts({});
  const { initialize, isInitialized, error, isMaintenance, isForceUpdate, currentPhase } =
    useBootstrap();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();

  useNotificationColdStart();

  const initializeRef = useRef(initialize);
  initializeRef.current = initialize;
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const prepare = async () => {
      try {
        console.log('[AppLayout] bootstrapping...');
        const result = await initializeRef.current();
        console.log('[AppLayout] bootstrap result:', result);
      } catch (e) {
        console.log('[AppLayout] bootstrap threw:', e);
      } finally {
        try {
          await SplashScreen.hideAsync();
        } catch (e) {
          console.log('[AppLayout] SplashScreen.hideAsync() failed:', e);
        }
      }
    };

    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);

  console.log('[AppLayout] render:', {
    isInitialized,
    error,
    isMaintenance,
    isForceUpdate,
    fontsLoaded: fontsLoaded,
    authLoading,
    isAuthenticated,
  });

  const getErrorScreen = useCallback(() => {
    if (error === 'expired_token') {
      return <SessionExpiredScreen />;
    }
    if (error === 'backend_down' || error === 'internet_lost') {
      return <OfflineScreen />;
    }
    if (error === 'maintenance' || (isMaintenance && currentPhase !== 'checking_maintenance')) {
      return <MaintenanceScreen />;
    }
    if (error === 'version_unsupported' || isForceUpdate) {
      return <ForceUpdateScreen />;
    }
    return null;
  }, [error, isMaintenance, isForceUpdate, currentPhase]);

  if (!fontsLoaded || !isInitialized) {
    console.log('[AppLayout] → BootstrapSplashScreen (loading or not initialized)');
    if (error && getErrorScreen()) {
      return getErrorScreen() as React.ReactElement;
    }
    return <BootstrapSplashScreen />;
  }

  if (error && getErrorScreen()) {
    console.log('[AppLayout] → error screen');
    return getErrorScreen() as React.ReactElement;
  }

  console.log('[AppLayout] → Stack navigator');
  return (
    <RouteGuard requireAuth={false}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen
          name="(drawer)"
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        />
        <Stack.Screen name="not-found" options={{ title: 'Not Found', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </RouteGuard>
  );
}
