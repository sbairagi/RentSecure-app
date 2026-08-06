import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useNetInfo } from '@react-native-community/netinfo';
import { PaymentCard, PaymentSkeletonLoader, PaymentEmptyState, PaymentErrorState } from '../components';
import { refundsApi } from '../services/refundsApi';
import { ERROR_MESSAGES } from '../constants/payments';

export default function RefundsScreen() {
  const theme = useTheme();
  const netInfo = useNetInfo();
  const [refunds, setRefunds] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    loadRefunds();
  }, []);

  const loadRefunds = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await refundsApi.list();
      setRefunds(data.results || []);
    } catch (err: any) {
      setError(err.message || ERROR_MESSAGES.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = useCallback(async () => {
    await loadRefunds();
  }, []);

  if (isLoading && !refunds.length) {
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

  if (error && !refunds.length) {
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
              Refunds
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {refunds.length} refunds
            </Text>
          </View>

          {!netInfo.isConnected && refunds.length === 0 ? (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineIcon}>📡</Text>
              <Text style={[styles.offlineText, { color: theme.colors.onSurface }]}>
                You're Offline
              </Text>
            </View>
          ) : refunds.length === 0 ? (
            <PaymentEmptyState
              title="No refunds found"
              description="Refund requests will appear here."
            />
          ) : (
            refunds.map((refund: any) => (
              <View
                key={refund.id}
                style={[styles.refundCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}
              >
                <Text style={[styles.refundTitle, { color: theme.colors.onSurface }]}>
                  Refund #{refund.id}
                </Text>
                <Text style={[styles.refundAmount, { color: theme.colors.primary }]}>
                  {refund.amount}
                </Text>
                <Text style={[styles.refundStatus, { color: theme.colors.onSurfaceVariant }]}>
                  Status: {refund.status}
                </Text>
              </View>
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
  refundCard: {
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: 1,
    gap: 8,
  },
  refundTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  refundAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  refundStatus: {
    fontSize: 13,
  },
});
