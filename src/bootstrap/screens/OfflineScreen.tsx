import { logger } from '@/services/api/logger';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Animated, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBootstrap } from '../hooks/useBootstrap';

export default function OfflineScreen() {
  const router = useRouter();
  const { retry, isOnline, retryCount, error, errorMessage } = useBootstrap();
  // Animated.Value is designed to be created in render for React Native Animated API
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    if (isOnline) {
      router.replace('/splash');
    }
  }, [isOnline]);

  useEffect(() => {
    // Log diagnostic info to help debug connectivity issues
    logger.warn('OfflineScreen rendered', {
      error,
      errorMessage,
      isOnline,
      retryCount,
    });
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.15,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleRetry = async () => {
    try {
      const success = await retry();
      if (success) {
        router.replace('/splash');
      }
    } catch (error) {
      logger.error('Retry failed', error as Error);
    }
  };

  const handleContinueOffline = () => {
    router.replace('/(auth)/welcome');
  };

  const getSubtitle = (): string => {
    if (error === 'backend_down' || errorMessage?.toLowerCase().includes('server')) {
      return 'The server is not reachable. Please check that the backend is running and try again.';
    }
    return 'Please check your network connection and try again. The app needs an internet connection to sync your data.';
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.iconContainer, { transform: [{ scale: pulseAnim }] }]}>
        <Text style={styles.icon}>📡</Text>
      </Animated.View>

      <Text style={styles.title}>No Internet Connection</Text>
      <Text style={styles.message}>{getSubtitle()}</Text>

      <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8}>
        <Text style={styles.retryButtonText}>
          {retryCount > 0 ? `Retry (${retryCount}/3)` : 'Try Again'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.offlineButton}
        onPress={handleContinueOffline}
        activeOpacity={0.8}
      >
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
    ...Platform.select({
      ios: {
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)',
      },
      android: {
        elevation: 4,
      },
    }),
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
    ...Platform.select({
      ios: {
        boxShadow: '0 4px 8px rgba(79, 70, 229, 0.3)',
      },
      android: {
        elevation: 4,
      },
    }),
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
