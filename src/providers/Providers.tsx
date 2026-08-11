import { GlobalLoader } from '@/components/common/GlobalLoader';
import i18n from '@/localization/i18n';
import { networkManager } from '@/services/api/networkManager';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import FlashMessage from 'react-native-flash-message';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/core/observability/error';
import { initSentry } from '@/core/observability/monitoring/sentry';
import { queryClient } from './queryClient';
import { OfflineBanner } from '@/core/offline/network/OfflineBanner';
import { initializeSync } from '@/core/offline/sync/syncEngine';

function ProvidersInner({ children }: { children: React.ReactNode }) {
  const _themeMode = useThemeStore((s) => s.mode);
  const language = useLanguageStore((s) => s.language);
  const initLanguage = useLanguageStore((s) => s.initLanguage);
  const [fontsLoaded] = useFonts({});

  useEffect(() => {
    initSentry();
  }, []);

  useEffect(() => {
    initLanguage();
  }, [initLanguage]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    networkManager.startMonitoring();
    initializeSync().catch((error) => {
      console.error('Failed to initialize offline sync:', error);
    });
    return () => {
      networkManager.stopMonitoring();
    };
  }, []);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary enabled={true}>
            {children}
          </ErrorBoundary>
          <FlashMessage position="top" />
          <GlobalLoader />
          <OfflineBanner />
        </QueryClientProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}

export const Providers = gestureHandlerRootHOC(ProvidersInner);
