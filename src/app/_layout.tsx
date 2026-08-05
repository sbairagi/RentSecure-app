import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';

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

SplashScreen.preventAutoHideAsync();

type AppState = 'loading' | 'bootstrapping' | 'ready' | 'error';

export default function AppLayout() {
  const [appState, setAppState] = useState<AppState>('loading');
  const [fontsLoaded] = useFonts({});
  const { initialize, isInitialized, error, isMaintenance, isForceUpdate, currentPhase } =
    useBootstrap();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const prepare = async () => {
      try {
        setAppState('bootstrapping');
        await initialize();
      } catch {
        setAppState('error');
      } finally {
        setAppState('ready');
        await SplashScreen.hideAsync();
      }
    };

    if (fontsLoaded) {
      prepare();
    }
  }, [fontsLoaded]);

  const getErrorScreen = useCallback(() => {
    if (error === 'backend_down' || error === 'internet_lost') {
      return <OfflineScreen />;
    }
    if (error === 'maintenance' || (isMaintenance && currentPhase !== 'checking_maintenance')) {
      return <MaintenanceScreen />;
    }
    if (error === 'version_unsupported' || isForceUpdate) {
      return <ForceUpdateScreen />;
    }
    if (error === 'expired_token') {
      return <SessionExpiredScreen />;
    }
    return null;
  }, [error, isMaintenance, isForceUpdate, currentPhase]);

  if (!fontsLoaded || appState === 'loading') {
    return null;
  }

  if (appState === 'bootstrapping' || !isInitialized) {
    if (error && getErrorScreen()) {
      return getErrorScreen() as React.ReactElement;
    }
    return <BootstrapSplashScreen />;
  }

  if (appState === 'error' || (error && getErrorScreen())) {
    return getErrorScreen() as React.ReactElement;
  }

  return (
    <RouteGuard requireAuth={false}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="bootstrap" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen
          name="(drawer)"
          options={{
            headerShown: false,
            presentation: 'transparentModal',
            animation: 'fade',
          }}
        />
        <Stack.Screen
          name="(auth)"
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen name="modal" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="not-found" options={{ title: 'Not Found', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </RouteGuard>
  );
}
