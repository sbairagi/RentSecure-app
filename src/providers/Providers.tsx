import i18n from '@/localization/i18n';
import { useLanguageStore } from '@/store/languageStore';
import { useThemeStore } from '@/store/themeStore';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import FlashMessage from 'react-native-flash-message';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { queryClient } from './queryClient';

SplashScreen.preventAutoHideAsync();

function ProvidersInner({ children }: { children: React.ReactNode }) {
  const _themeMode = useThemeStore((s) => s.mode);
  const language = useLanguageStore((s) => s.language);
  const [fontsLoaded] = useFonts({});

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaProvider>
      <I18nextProvider i18n={i18n}>
        <QueryClientProvider client={queryClient}>
          {children}
          <FlashMessage position="top" />
        </QueryClientProvider>
      </I18nextProvider>
    </SafeAreaProvider>
  );
}

export const Providers = gestureHandlerRootHOC(ProvidersInner);
