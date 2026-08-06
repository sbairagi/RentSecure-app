import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RefreshControl } from 'react-native';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useNetInfo } from '@react-native-community/netinfo';
import { usePayments } from '../hooks';
import { PaymentCard, PaymentFilters, PaymentSkeletonLoader, PaymentEmptyState, PaymentErrorState } from '../components';
import { ERROR_MESSAGES } from '../constants/payments';

export default function PaymentHistoryScreen() {
  const theme = useTheme();
  const netInfo = useNetInfo();
  const [filters, setFilters] = useState({});
  const [refreshing, setRefreshing] = useState(false);

  const { payments, isLoading, error, refresh, refetch, total } = usePayments(filters);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refetch();
    } catch {
      // Error handled
    } finally {
      setRefreshing(false);
    }
  }, [refetch]);

  if (isLoading && !payments.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentSkeletonLoader count={8} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error && !payments.length) {
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
              Payment History
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {total} payments found
            </Text>
          </View>

          <PaymentFilters
            filters={filters}
            onFilterChange={setFilters}
            onClear={() => setFilters({})}
          />

          {!netInfo.isConnected && payments.length === 0 ? (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineIcon}>📡</Text>
              <Text style={[styles.offlineText, { color: theme.colors.onSurface }]}>
                You're Offline
              </Text>
              <Text style={[styles.offlineSubtext, { color: theme.colors.onSurfaceVariant }]}>
                Please check your internet connection and try again.
              </Text>
            </View>
          ) : payments.length === 0 ? (
            <PaymentEmptyState
              title="No payments found"
              description="Payments will appear here once rent records are generated."
            />
          ) : (
            payments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onPress={() => {}}
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
  offlineSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
});
