import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

interface OfflineStateProps {
  onRetry?: () => void;
  retryLabel?: string;
}

export function OfflineState({ onRetry, retryLabel = 'Try Again' }: OfflineStateProps) {
  const router = useRouter();

  const handleRetry = async () => {
    if (onRetry) {
      await onRetry();
    } else {
      router.replace('/splash');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>📡</Text>
      </View>
      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.message}>
        Please check your network connection and try again. The app needs an internet connection to sync your data.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
        <Text style={styles.retryButtonText}>{retryLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.offlineButton} onPress={() => router.replace('/(auth)/welcome')}>
        <Text style={styles.offlineButtonText}>Continue Offline</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    paddingHorizontal: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#fef2f2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  retryButton: {
    backgroundColor: '#4f46e5',
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    marginBottom: 16,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  offlineButton: {
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  offlineButtonText: {
    color: '#64748b',
    fontSize: 15,
    fontWeight: '500',
  },
});
