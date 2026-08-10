import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams } from 'expo-router';
import { useRenterRentRecordDetail } from '@/features/renter-dashboard/hooks/useRenterDashboard';
import { RENTER_PAYMENT_STATUS_CONFIG } from '@/features/renter-dashboard/constants/paymentStatus';
import { DashboardErrorState } from '@/features/renter-dashboard/components/DashboardErrorState';
import { PaymentSkeletonLoader } from '@/features/payments/components/PaymentSkeletonLoader';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RenterPaymentDetailsScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ paymentId?: string }>();
  const paymentId = params.paymentId;

  const { payment, isLoading, error, refetch } = useRenterRentRecordDetail(paymentId || '');

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentSkeletonLoader count={1} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error || !payment) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <DashboardErrorState message={error || 'Payment not found'} onRetry={refetch} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const statusConfig = RENTER_PAYMENT_STATUS_CONFIG[payment.payment_status] || RENTER_PAYMENT_STATUS_CONFIG.pending;
  const amount = parseFloat(payment.amount || '0');
  const lateFee = parseFloat(payment.late_fee || '0');
  const total = amount + lateFee;

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Payment Details
            </Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: statusConfig.backgroundColor },
              ]}
            >
              <Text style={[styles.statusText, { color: statusConfig.color }]}>
                {statusConfig.label}
              </Text>
            </View>
          </View>

          <Animated.View entering={FadeInDown.duration(400)} style={styles.content}>
            <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant }]}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 16 }}>
                Payment Information
              </Text>

              <DetailRow label="Month" value={new Date(payment.due_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} theme={theme} />
              <DetailRow label="Rent Amount" value={`₹${amount.toLocaleString('en-IN')}`} theme={theme} />
              {lateFee > 0 && (
                <DetailRow label="Late Fee" value={`₹${lateFee.toLocaleString('en-IN')}`} theme={theme} valueColor={theme.colors.error} />
              )}
              <DetailRow label="Total" value={`₹${total.toLocaleString('en-IN')}`} theme={theme} bold />
              <DetailRow label="Payment Method" value={payment.payment_method.replace('_', ' ').toUpperCase()} theme={theme} />
              <DetailRow label="Payment Date" value={payment.paid_on ? new Date(payment.paid_on).toLocaleDateString('en-IN') : 'N/A'} theme={theme} />
              <DetailRow label="Transaction ID" value={payment.transaction_id || 'N/A'} theme={theme} />
              <DetailRow label="Unit" value={payment.unit_name || 'N/A'} theme={theme} />
              <DetailRow label="Property" value={payment.building_name || 'N/A'} theme={theme} />
              {payment.notes && <DetailRow label="Notes" value={payment.notes} theme={theme} />}
            </View>

            {payment.invoice_url && (
              <Animated.View entering={FadeInDown.duration(400).delay(100)} style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant, marginTop: 16 }]}>
                <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600', marginBottom: 12 }}>
                  Invoice
                </Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.primary }} onPress={() => {}}>
                  View Invoice
                </Text>
              </Animated.View>
            )}
          </Animated.View>
        </View>
      </PermissionGuard>
    </RouteGuard>
  );
}

function DetailRow({ label, value, theme, valueColor, bold }: { label: string; value: string; theme: any; valueColor?: string; bold?: boolean }) {
  return (
    <View style={styles.detailRow}>
      <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
        {label}
      </Text>
      <Text
        variant="bodyMedium"
        style={{
          color: valueColor || theme.colors.onSurface,
          fontWeight: bold ? '700' : '500',
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
});