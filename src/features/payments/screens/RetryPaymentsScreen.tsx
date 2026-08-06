import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useNetInfo } from '@react-native-community/netinfo';
import { PaymentCard, PaymentSkeletonLoader, PaymentEmptyState, PaymentErrorState } from '../components';
import { paymentsRepository } from '../repository/paymentsRepository';
import { ERROR_MESSAGES } from '../constants/payments';

export default function RetryPaymentsScreen() {
  const theme = useTheme();
  const netInfo = useNetInfo();
  const [payments, setPayments] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadFailedPayments();
  }, []);

  const loadFailedPayments = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await paymentsRepository.fetchFailedPayments();
      setPayments(data.results || []);
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    await loadFailedPayments();
  }, []);

  const handleRetry = async (id: number | string) => {
    try {
      await paymentsRepository.retryPayment(id);
      await loadFailedPayments();
    } catch (err: any) {
      // Error handled
    }
  };

  if (isLoading && !payments.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read', 'payment:write']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentSkeletonLoader count={5} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error && !payments.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read', 'payment:write']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentErrorState message={error} onRetry={handleRefresh} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read', 'payment:write']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Retry Payments
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {payments.length} failed payments to retry
            </Text>
          </View>

          {!netInfo.isConnected && payments.length === 0 ? (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineIcon}>📡</Text>
              <Text style={[styles.offlineText, { color: theme.colors.onSurface }]}>
                You're Offline
              </Text>
            </View>
          ) : payments.length === 0 ? (
            <PaymentEmptyState
              title="No failed payments"
              description="All payments were processed successfully."
              icon="✅"
            />
          ) : (
            payments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onPress={() => {}}
                onRetry={() => handleRetry(payment.id)}
                showActions
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
