import { useTheme } from '@/hooks/use-theme';
import { useGlobalLoaderStore } from '@/services/api/globalLoader';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

export function GlobalLoader() {
  const isLoading = useGlobalLoaderStore((state) => state.activeRequests > 0);
  const theme = useTheme();

  if (!isLoading) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundElement }]}>
      <View style={[styles.loaderContainer, { backgroundColor: theme.surface }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loaderContainer: {
    padding: 24,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
