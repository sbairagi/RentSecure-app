import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';

export default function PaymentStatusScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { status, orderId } = useLocalSearchParams<{
    status: 'processing' | 'success' | 'failed';
    orderId: string;
  }>();

  const getStatusConfig = () => {
    switch (status) {
      case 'processing':
        return {
          icon: '⏳',
          title: 'Payment Processing',
          description: 'Your payment is being verified. Please wait...',
          color: theme.colors.primary,
        };
      case 'success':
        return {
          icon: '✅',
          title: 'Payment Successful',
          description: 'Your rent payment has been verified successfully.',
          color: '#059669',
        };
      case 'failed':
        return {
          icon: '❌',
          title: 'Payment Failed',
          description: 'Your payment could not be verified. Please try again.',
          color: '#DC2626',
        };
      default:
        return {
          icon: 'ℹ️',
          title: 'Payment Status',
          description: 'Checking payment status...',
          color: theme.colors.primary,
        };
    }
  };

  const statusConfig = getStatusConfig();

  const handleGoToDashboard = useCallback(() => {
    router.replace('/(drawer)/(tabs)/dashboard');
  }, [router]);

  const handleRetry = useCallback(() => {
    router.back();
  }, [router]);

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.content}>
            <Text style={styles.icon}>{statusConfig.icon}</Text>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              {statusConfig.title}
            </Text>
            <Text style={[styles.description, { color: theme.colors.onSurfaceVariant }]}>
              {statusConfig.description}
            </Text>

            {orderId && (
              <Text style={[styles.orderId, { color: theme.colors.onSurfaceVariant }]}>
                Order ID: {orderId}
              </Text>
            )}

            <View style={styles.buttonContainer}>
              {status === 'success' && (
                <Text
                  style={[styles.primaryButton, { color: theme.colors.primary }]}
                  onPress={handleGoToDashboard}
                >
                  Go to Dashboard
                </Text>
              )}
              {status === 'failed' && (
                <Text
                  style={[styles.primaryButton, { color: theme.colors.primary }]}
                  onPress={handleRetry}
                >
                  Try Again
                </Text>
              )}
              {status === 'processing' && (
                <Text
                  style={[styles.secondaryButton, { color: theme.colors.onSurfaceVariant }]}
                  onPress={handleGoToDashboard}
                >
                  Go to Dashboard
                </Text>
              )}
            </View>
          </View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 13,
    marginBottom: 32,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  primaryButton: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  secondaryButton: {
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 12,
  },
});
