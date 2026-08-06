import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTheme, IconButton, Button } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usePaymentDetails, usePaymentTimeline, useRetryPayment, useCancelPayment, useRefundPayment, useSendReminder } from '../hooks';
import { PaymentStatusBadge, PaymentMethodBadge, PaymentTimelineItem, PaymentLinkCard, PaymentEmptyState, PaymentErrorState, PaymentSkeletonLoader } from '../components';
import { formatCurrency, formatDate, maskTransactionId } from '../utils/paymentUtils';
import type { PaymentTimelineEntry } from '../types/payments';
import { ERROR_MESSAGES } from '../constants/payments';

export default function PaymentDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string }>();
  const paymentId = params.id;

  const { payment, isLoading, error, refetch } = usePaymentDetails(paymentId);
  const { timeline, refetch: refetchTimeline } = usePaymentTimeline(paymentId);
  const retryPayment = useRetryPayment();
  const cancelPayment = useCancelPayment();
  const refundPayment = useRefundPayment();
  const sendReminder = useSendReminder();

  if (isLoading && !payment) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentSkeletonLoader count={3} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error && !payment) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentErrorState message={error} onRetry={refetch} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (!payment) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={styles.container}>
            <PaymentEmptyState
              title="Payment not found"
              description="The payment you are looking for does not exist."
              icon="❌"
            />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const handleRetry = async () => {
    try {
      await retryPayment.mutateAsync({ id: payment.id });
      refetch();
    } catch {
      // Error handled
    }
  };

  const handleCancel = async () => {
    try {
      await cancelPayment.mutateAsync({ id: payment.id, reason: 'Cancelled by user' });
      refetch();
    } catch {
      // Error handled
    }
  };

  const handleRefund = async () => {
    router.push(`/(drawer)/(tabs)/payments/${payment.id}/refund` as any);
  };

  const handleSendReminder = async () => {
    try {
      await sendReminder.mutateAsync({
        id: payment.id,
        data: { reminder_types: ['whatsapp', 'email', 'sms'], message: 'Reminder: Your rent payment is pending.' },
      });
    } catch {
      // Error handled
    }
  };

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Payment Details
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Payment Information
              </Text>
              <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline }]}>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Renter</Text>
                  <Text style={[styles.value, { color: theme.colors.onSurface }]}>{payment.renter_name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Unit</Text>
                  <Text style={[styles.value, { color: theme.colors.onSurface }]}>{payment.building_name} • {payment.unit_name}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Amount</Text>
                  <Text style={[styles.value, { color: theme.colors.onSurface }]}>{formatCurrency(payment.amount)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Late Fee</Text>
                  <Text style={[styles.value, { color: theme.colors.error }]}>{formatCurrency(payment.late_fee)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Discount</Text>
                  <Text style={[styles.value, { color: theme.colors.primary }]}>{formatCurrency(payment.discount)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Tax</Text>
                  <Text style={[styles.value, { color: theme.colors.onSurface }]}>{formatCurrency(payment.tax)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Total Amount</Text>
                  <Text style={[styles.totalValue, { color: theme.colors.primary }]}>{formatCurrency(payment.total_amount || payment.amount)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Payment Method</Text>
                  <PaymentMethodBadge method={payment.payment_method} />
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Status</Text>
                  <PaymentStatusBadge status={payment.status} />
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Payment Date</Text>
                  <Text style={[styles.value, { color: theme.colors.onSurface }]}>{formatDate(payment.payment_date)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Due Date</Text>
                  <Text style={[styles.value, { color: theme.colors.onSurface }]}>{formatDate(payment.due_date)}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Transaction ID</Text>
                  <Text style={[styles.value, { color: theme.colors.onSurface, fontFamily: 'monospace' }]}>
                    {maskTransactionId(payment.transaction_id)}
                  </Text>
                </View>
                {payment.razorpay_order_id && (
                  <View style={styles.row}>
                    <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Order ID</Text>
                    <Text style={[styles.value, { color: theme.colors.onSurface, fontFamily: 'monospace' }]}>
                      {payment.razorpay_order_id}
                    </Text>
                  </View>
                )}
                {payment.payment_link && (
                  <View style={styles.row}>
                    <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Payment Link</Text>
                    <Text style={[styles.value, { color: theme.colors.primary }]} numberOfLines={1}>
                      {payment.payment_link}
                    </Text>
                  </View>
                )}
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Payout Status</Text>
                  <Text style={[styles.value, { color: theme.colors.onSurface }]}>{payment.payout_status}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Retry Count</Text>
                  <Text style={[styles.value, { color: theme.colors.onSurface }]}>{payment.retry_count}</Text>
                </View>
                {payment.remarks && (
                  <View style={styles.row}>
                    <Text style={[styles.label, { color: theme.colors.onSurfaceVariant }]}>Remarks</Text>
                    <Text style={[styles.value, { color: theme.colors.onSurface }]}>{payment.remarks}</Text>
                  </View>
                )}
              </View>
            </View>

            {payment.payment_link && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Payment Link
                </Text>
                <PaymentLinkCard
                  link={{
                    id: payment.id,
                    payment: payment.id,
                    url: payment.payment_link,
                    qr_code: payment.qr_code,
                    is_active: payment.status === 'pending',
                    expires_at: payment.due_date,
                    created_at: payment.created_at,
                  }}
                  onCopy={() => {}}
                  onShare={() => {}}
                  onOpen={() => {}}
                  canRegenerate={payment.status === 'pending'}
                />
              </View>
            )}

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Actions
              </Text>
              <View style={styles.actionsRow}>
                {payment.status === 'failed' && (
                  <Button mode="contained" onPress={handleRetry} style={styles.actionButton}>
                    Retry Payment
                  </Button>
                )}
                {payment.status === 'pending' && (
                  <>
                    <Button mode="contained" onPress={handleSendReminder} style={styles.actionButton}>
                      Send Reminder
                    </Button>
                    <Button mode="outlined" onPress={handleCancel} style={styles.actionButton}>
                      Cancel
                    </Button>
                  </>
                )}
                {payment.status === 'paid' && (
                  <Button mode="outlined" onPress={handleRefund} style={styles.actionButton}>
                    Refund
                  </Button>
                )}
              </View>
            </View>

            {timeline && timeline.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                  Timeline
                </Text>
                {timeline.map((entry: PaymentTimelineEntry) => (
                  <PaymentTimelineItem key={entry.id} entry={entry} />
                ))}
              </View>
            )}
          </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  section: {
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    flex: 1,
  },
  value: {
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    minWidth: 120,
    borderRadius: 12,
  },
});
