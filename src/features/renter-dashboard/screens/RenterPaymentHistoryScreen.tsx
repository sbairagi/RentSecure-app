import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RefreshControl, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useNetInfo } from '@react-native-community/netinfo';
import { useRenterPayments } from '../hooks/useRenterPayments';
import { PaymentCard } from '@/features/payments/components/PaymentCard';
import { PaymentSkeletonLoader } from '@/features/payments/components/PaymentSkeletonLoader';
import { PaymentStatusBadge } from '@/features/payments/components/PaymentStatusBadge';
import type { RenterRentRecord } from '../types/renterDashboard';
import { showMessage } from 'react-native-flash-message';

const PAGE_SIZE = 20;

export default function RenterPaymentHistoryScreen() {
  const theme = useTheme();
  const router = useRouter();
  const netInfo = useNetInfo();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { payments, isLoading, isFetching, error, refresh, total } = useRenterPayments({
    page,
    limit: PAGE_SIZE,
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    try {
      await refresh();
    } catch {
      // handled by hook
    } finally {
      setRefreshing(false);
    }
  }, [refresh]);

  const handleLoadMore = useCallback(() => {
    if (!isFetching && payments.length < total) {
      setPage((prev) => prev + 1);
    }
  }, [isFetching, payments.length, total]);

  const renderPaymentItem = useCallback(
    ({ item }: { item: RenterRentRecord }) => (
      <PaymentCard
        payment={{
          id: item.id,
          renter: 0,
          rent_record: item.id,
          amount: item.amount,
          payment_method: item.payment_method as any,
          payment_date: item.paid_on || '',
          due_date: item.due_date,
          status: item.payment_status as any,
          transaction_id: item.transaction_id,
          razorpay_order_id: '',
          payment_link: item.payment_link,
          invoice_pdf: item.invoice_url || null,
          invoice_number: '',
          invoice_status: item.payment_status,
          receipt_url: item.invoice_url || null,
          qr_code: null,
          late_fee: item.late_fee,
          tax: '0',
          discount: item.discount,
          total_amount: String(Number(item.amount) + Number(item.late_fee) - Number(item.discount)),
          retry_count: 0,
          max_retries: 0,
          remarks: item.notes,
          payout_status: '',
          payout_reference: '',
          reminder_status: { whatsapp: '', email: '', sms: '', push: '' },
          renter_name: '',
          unit_name: item.unit_name,
          building_name: item.building_name,
          created_at: item.created_at,
          updated_at: item.updated_at,
        }}
        onPress={() =>
          router.push({
            pathname: '/(drawer)/(tabs)/payment-details',
            params: { paymentId: item.id.toString() },
          })
        }
      />
    ),
    [router]
  );

  const renderEmpty = useMemo(() => {
    if (isLoading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>💳</Text>
        <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
          No Payments Yet
        </Text>
        <Text style={[styles.emptyDescription, { color: theme.colors.onSurfaceVariant }]}>
          Your rent payment history will appear here once payments are made.
        </Text>
      </View>
    );
  }, [isLoading, theme.colors.onSurface, theme.colors.onSurfaceVariant]);

  const renderFooter = useCallback(() => {
    if (!isFetching) return null;
    return (
      <View style={styles.footerLoader}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading more...</Text>
      </View>
    );
  }, [isFetching, theme.colors.onSurfaceVariant]);

  if (isLoading && !payments.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentSkeletonLoader count={PAGE_SIZE} />
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
            <View style={styles.errorContainer}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={[styles.errorTitle, { color: theme.colors.onSurface }]}>
                Failed to load payments
              </Text>
              <Text style={[styles.errorDescription, { color: theme.colors.onSurfaceVariant }]}>
                {error}
              </Text>
              <Text
                style={[styles.retryButton, { color: theme.colors.primary }]}
                onPress={handleRefresh}
              >
                Tap to retry
              </Text>
            </View>
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
              {total} {total === 1 ? 'payment' : 'payments'}
            </Text>
          </View>

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
            renderEmpty
          ) : (
            <FlatList
              data={payments}
              renderItem={renderPaymentItem}
              keyExtractor={(item) => `payment-${item.id}`}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={handleRefresh}
                  tintColor={theme.colors.primary}
                />
              }
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={renderFooter}
            />
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
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyDescription: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  errorDescription: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  retryButton: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
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
