import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useNetInfo } from '@react-native-community/netinfo';
import { PayoutCard, PaymentSkeletonLoader, PaymentEmptyState, PaymentErrorState } from '../components';
import { payoutsApi } from '../services/payoutsApi';
import { ERROR_MESSAGES } from '../constants/payments';

export default function PayoutStatusScreen() {
  const theme = useTheme();
  const netInfo = useNetInfo();
  const [payouts, setPayouts] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadPayouts();
  }, []);

  const loadPayouts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await payoutsApi.list();
      setPayouts(data.results || []);
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    await loadPayouts();
  }, []);

  const handleRetry = async (id: number | string) => {
    try {
      await payoutsApi.retry(id);
      await loadPayouts();
    } catch (err: any) {
      // Error handled
    }
  };

  if (isLoading && !payouts.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentSkeletonLoader count={5} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error && !payouts.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentErrorState message={error} onRetry={handleRefresh} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Payout Status
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {payouts.length} payouts
            </Text>
          </View>

          {!netInfo.isConnected && payouts.length === 0 ? (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineIcon}>📡</Text>
              <Text style={[styles.offlineText, { color: theme.colors.onSurface }]}>
                You're Offline
              </Text>
            </View>
          ) : payouts.length === 0 ? (
            <PaymentEmptyState
              title="No payouts found"
              description="Payouts will appear here after payments are processed."
            />
          ) : (
            payouts.map((payout) => (
              <PayoutCard
                key={payout.id}
                payout={payout}
                onPress={() => {}}
                onRetry={payout.status === 'failed' ? () => handleRetry(payout.id) : undefined}
              />
            ))
          )}
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  offlineContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  offlineIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  offlineText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
});
