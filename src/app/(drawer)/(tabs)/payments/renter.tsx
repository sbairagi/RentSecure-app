import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RefreshControl } from 'react-native';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useNetInfo } from '@react-native-community/netinfo';
import { useRenterRentRecords } from '@/features/renter-dashboard/hooks/useRenterDashboard';
import { PaymentCard, PaymentSkeletonLoader, PaymentEmptyState, PaymentErrorState } from '@/features/payments/components';
import { RENTER_PAYMENT_STATUS_CONFIG } from '@/features/renter-dashboard/constants/paymentStatus';

export default function RenterPaymentHistoryScreen() {
  const theme = useTheme();
  const netInfo = useNetInfo();
  const [page, setPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const { payments, pagination, isLoading, error, refetch, refresh } = useRenterRentRecords({
    page,
    limit: 20,
  });

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

  const handleLoadMore = useCallback(() => {
    if (pagination && page < pagination.totalPages && !isLoading) {
      setPage((p) => p + 1);
    }
  }, [pagination, page, isLoading]);

  const mapToPaymentCard = (record: any) => ({
    id: record.id,
    renter: 0,
    rent_record: record.id,
    amount: record.amount,
    payment_method: record.payment_method,
    payment_date: record.paid_on || record.due_date,
    due_date: record.due_date,
    status: record.payment_status,
    transaction_id: record.transaction_id,
    razorpay_order_id: '',
    payment_link: record.payment_link,
    invoice_pdf: record.invoice_url,
    invoice_number: '',
    invoice_status: record.payment_status,
    receipt_url: null,
    qr_code: null,
    late_fee: record.late_fee,
    tax: '0',
    discount: record.discount,
    total_amount: (parseFloat(record.amount || '0') + parseFloat(record.late_fee || '0')).toString(),
    retry_count: 0,
    max_retries: 3,
    remarks: record.notes || '',
    payout_status: '',
    payout_reference: '',
    reminder_status: { whatsapp: 'none', email: 'none', sms: 'none', push: 'none' },
    renter_name: '',
    unit_name: record.unit_name,
    building_name: record.building_name,
    created_at: record.created_at,
    updated_at: record.updated_at,
  });

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
              {pagination?.total || 0} payments found
            </Text>
          </View>

          {!netInfo.isConnected && payments.length === 0 ? (
            <View style={styles.offlineContainer}>
              <Text style={styles.offlineIcon}>📡</Text>
              <Text style={[styles.offlineText, { color: theme.colors.onSurface }]}>
                You&apos;re Offline
              </Text>
              <Text style={[styles.offlineSubtext, { color: theme.colors.onSurfaceVariant }]}>
                Please check your internet connection and try again.
              </Text>
            </View>
          ) : payments.length === 0 ? (
            <PaymentEmptyState
              title="No payments found"
              description="Your payment history will appear here."
            />
          ) : (
            payments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={mapToPaymentCard(payment)}
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