import React, { useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRenterPaymentDetail } from '../hooks/useRenterPayments';
import { RenterDashboardSkeleton } from '../components/RenterDashboardSkeleton';
import { DashboardErrorState } from '../components/DashboardErrorState';
import type { RenterRentRecord } from '../types/renterDashboard';

export default function RenterPaymentDetailsScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { paymentId } = useLocalSearchParams<{ paymentId: string }>();

  const { payment, isLoading, error, refetch } = useRenterPaymentDetail(
    paymentId ? Number(paymentId) : 0
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const formatCurrency = (value: string) => {
    const num = parseFloat(value);
    if (isNaN(num)) return '₹0';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(num);
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const renderDetailRow = (label: string, value: string | React.ReactNode) => (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: theme.colors.onSurfaceVariant }]}>
        {label}
      </Text>
      {typeof value === 'string' ? (
        <Text style={[styles.detailValue, { color: theme.colors.onSurface }]}>
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );

  if (isLoading) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <RenterDashboardSkeleton />
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
            <DashboardErrorState
              message={error || 'Payment not found'}
              onRetry={handleRetry}
            />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const totalPayable = Number(payment.amount) + Number(payment.late_fee) - Number(payment.discount);

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read']}>
        <ScrollView
          style={[styles.container, { backgroundColor: theme.colors.background }]}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Rent Details
            </Text>

            <View style={styles.amountSection}>
              <Text style={[styles.amountLabel, { color: theme.colors.onSurfaceVariant }]}>
                Monthly Rent
              </Text>
              <Text style={[styles.amountValue, { color: theme.colors.primary }]}>
                {formatCurrency(payment.amount)}
              </Text>
            </View>

            {Number(payment.late_fee) > 0 && (
              renderDetailRow('Late Fee', formatCurrency(payment.late_fee))
            )}

            {Number(payment.discount) > 0 && (
              renderDetailRow('Discount', `-${formatCurrency(payment.discount)}`)
            )}

            <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

            {renderDetailRow(
              'Total Payable',
              <Text style={[styles.totalAmount, { color: theme.colors.primary }]}>
                {formatCurrency(String(totalPayable))}
              </Text>
            )}
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Payment Information
            </Text>

            {renderDetailRow(
              'Status',
              <View style={[
                styles.statusBadge,
                { backgroundColor: theme.colors.primaryContainer }
              ]}>
                <Text style={[styles.statusText, { color: theme.colors.onPrimaryContainer }]}>
                  {payment.payment_status.charAt(0).toUpperCase() + payment.payment_status.slice(1)}
                </Text>
              </View>
            )}

            {renderDetailRow(
              'Payment Method',
              payment.payment_method
                ? payment.payment_method.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())
                : '—'
            )}

            {renderDetailRow('Payment Date', formatDate(payment.paid_on))}
            {renderDetailRow('Due Date', formatDate(payment.due_date))}

            {payment.transaction_id && renderDetailRow('Transaction ID', payment.transaction_id)}

            {payment.notes && renderDetailRow('Notes', payment.notes)}
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Property
            </Text>

            {renderDetailRow('Unit', payment.unit_name)}
            {renderDetailRow('Building', payment.building_name)}
          </View>

          {payment.invoice_url && (
            <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
                Invoice
              </Text>

              <Text
                style={[styles.invoiceLink, { color: theme.colors.primary }]}
                onPress={() => {
                  router.push({
                    pathname: '/(drawer)/(tabs)/invoice-detail',
                    params: { paymentId: payment.id.toString() },
                  });
                }}
              >
                View Invoice →
              </Text>
            </View>
          )}
        </ScrollView>
      </PermissionGuard>
    </RouteGuard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  detailLabel: {
    fontSize: 14,
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'right',
    flex: 1,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  invoiceLink: {
    fontSize: 16,
    fontWeight: '600',
  },
});
