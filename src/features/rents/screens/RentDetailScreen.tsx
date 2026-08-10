import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RefreshControl } from 'react-native';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useRentRecordDetail } from '../hooks/useRentRecordDetail';
import { useRetryPayout } from '../hooks/useRetryPayout';
import { useResendConfirmation } from '../hooks/useResendConfirmation';
import { RentStatusBadge, PayoutStatusBadge, PaymentMethodBadge } from '../components';
import { RENT_CONSTANTS } from '../constants/rents';
import { formatCurrency, formatDate } from '../utils/rentUtils';

export default function RentDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [refreshing, setRefreshing] = useState(false);
  const retryPayout = useRetryPayout();
  const resendConfirmation = useResendConfirmation();

  const { rent, isLoading, error, refresh, refetch } = useRentRecordDetail(Number(id));

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

  const handleRetryPayout = useCallback(async () => {
    if (!rent) return;
    try {
      await retryPayout.mutateAsync(rent.id);
      await refetch();
    } catch {
      // Error handled
    }
  }, [rent, retryPayout, refetch]);

  const handleResendConfirmation = useCallback(async () => {
    if (!rent) return;
    try {
      await resendConfirmation.mutateAsync(rent.id);
    } catch {
      // Error handled
    }
  }, [rent, resendConfirmation]);

  if (isLoading && !rent) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['rent:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.loadingText, { color: theme.colors.onSurface }]}>Loading...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error || !rent) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['rent:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.errorText, { color: theme.colors.error }]}>
              {error || 'Rent record not found'}
            </Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['rent:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />

          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Rent Details
            </Text>
            <RentStatusBadge status={rent.status} />
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Rent Information</Text>
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Amount</Text>
                <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                  {formatCurrency(rent.amount)}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Due Date</Text>
                <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                  {formatDate(rent.due_date)}
                </Text>
              </View>
              {rent.paid_on && (
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Paid On</Text>
                  <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                    {formatDate(rent.paid_on)}
                  </Text>
                </View>
              )}
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Payment Method</Text>
                <PaymentMethodBadge method={rent.payment_method} />
              </View>
              {rent.transaction_id && (
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Transaction ID</Text>
                  <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                    {rent.transaction_id}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {(rent.late_fee && parseFloat(rent.late_fee) > 0) || (rent.discount && parseFloat(rent.discount) > 0) ? (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Adjustments</Text>
              <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                {rent.late_fee && parseFloat(rent.late_fee) > 0 && (
                  <View style={styles.row}>
                    <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Late Fee</Text>
                    <Text style={[styles.value, { color: theme.colors.error }]}>
                      {formatCurrency(rent.late_fee)}
                    </Text>
                  </View>
                )}
                {rent.discount && parseFloat(rent.discount) > 0 && (
                  <View style={styles.row}>
                    <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Discount</Text>
                    <Text style={[styles.value, { color: theme.colors.primary }]}>
                      -{formatCurrency(rent.discount)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          ) : null}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Payout Information</Text>
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Payout Status</Text>
                <PayoutStatusBadge status={rent.payout_status} />
              </View>
              {rent.payout_reference && (
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Reference</Text>
                  <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                    {rent.payout_reference}
                  </Text>
                </View>
              )}
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Retries</Text>
                <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                  {rent.payout_retry_count}
                </Text>
              </View>
            </View>
          </View>

          {rent.payment_link && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Payment Link</Text>
              <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.linkText, { color: theme.colors.primary }]} numberOfLines={1}>
                  {rent.payment_link}
                </Text>
              </View>
            </View>
          )}

          {rent.notes && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Notes</Text>
              <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                  {rent.notes}
                </Text>
              </View>
            </View>
          )}

          {rent.adjustment_reason && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Adjustment Reason</Text>
              <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.value, { color: theme.colors.onSurface }]}>
                  {rent.adjustment_reason}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.actions}>
            {rent.payout_status === 'FAILED' && (
              <Button
                mode="contained"
                onPress={handleRetryPayout}
                loading={retryPayout.isPending}
                disabled={retryPayout.isPending}
                style={styles.actionButton}
              >
                Retry Payout
              </Button>
            )}
            {rent.status === 'paid' && (
              <Button
                mode="outlined"
                onPress={handleResendConfirmation}
                loading={resendConfirmation.isPending}
                disabled={resendConfirmation.isPending}
                style={styles.actionButton}
              >
                Resend Confirmation
              </Button>
            )}
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
  loadingText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  linkText: {
    fontSize: 13,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 16,
    paddingTop: 8,
  },
  actionButton: {
    borderRadius: 12,
  },
});
