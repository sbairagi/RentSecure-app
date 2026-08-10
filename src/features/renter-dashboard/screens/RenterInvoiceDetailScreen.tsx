import React, { useCallback } from 'react';
import { StyleSheet, Text, View, ScrollView, Linking, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRenterPaymentDetail } from '../hooks/useRenterPayments';
import { RenterDashboardSkeleton } from '../components/RenterDashboardSkeleton';
import { DashboardErrorState } from '../components/DashboardErrorState';
import { downloadService } from '@/services/api/downloadService';
import type { RenterRentRecord } from '../types/renterDashboard';

export default function RenterInvoiceDetailScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { paymentId } = useLocalSearchParams<{ paymentId: string }>();

  const { payment, isLoading, error, refetch } = useRenterPaymentDetail(
    paymentId ? Number(paymentId) : 0
  );

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  const handleDownload = useCallback(async () => {
    if (!payment?.invoice_url) return;
    try {
      const filename = `invoice-${payment.id}.pdf`;
      await downloadService.downloadFile(payment.invoice_url, filename);
    } catch {
      Alert.alert(
        'Download Failed',
        'Could not download the invoice. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  }, [payment]);

  const handleShare = useCallback(async () => {
    if (!payment?.invoice_url) return;
    try {
      const filename = `invoice-${payment.id}.pdf`;
      await downloadService.shareFile(payment.invoice_url, filename, 'application/pdf');
    } catch {
      Alert.alert(
        'Share Failed',
        'Could not share the invoice. Please try again later.',
        [{ text: 'OK' }]
      );
    }
  }, [payment]);

  const handleViewInBrowser = useCallback(async () => {
    if (!payment?.invoice_url) return;
    try {
      const supported = await Linking.canOpenURL(payment.invoice_url);
      if (supported) {
        await Linking.openURL(payment.invoice_url);
      }
    } catch {
      // handled silently
    }
  }, [payment]);

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
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

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
              message={error || 'Invoice not found'}
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
              Rent Invoice
            </Text>

            <View style={styles.invoiceHeader}>
              <View>
                <Text style={[styles.propertyName, { color: theme.colors.onSurface }]}>
                  {payment.building_name}
                </Text>
                <Text style={[styles.unitName, { color: theme.colors.onSurfaceVariant }]}>
                  Unit: {payment.unit_name}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: theme.colors.primaryContainer },
                ]}
              >
                <Text
                  style={[styles.statusText, { color: theme.colors.onPrimaryContainer }]}
                >
                  Paid
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.outlineVariant }]} />

            <View style={styles.invoiceDetails}>
              <View style={styles.invoiceRow}>
                <Text style={[styles.invoiceLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Invoice Date
                </Text>
                <Text style={[styles.invoiceValue, { color: theme.colors.onSurface }]}>
                  {formatDate(payment.paid_on || payment.due_date)}
                </Text>
              </View>
              <View style={styles.invoiceRow}>
                <Text style={[styles.invoiceLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Due Date
                </Text>
                <Text style={[styles.invoiceValue, { color: theme.colors.onSurface }]}>
                  {formatDate(payment.due_date)}
                </Text>
              </View>
              {payment.transaction_id && (
                <View style={styles.invoiceRow}>
                  <Text style={[styles.invoiceLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Transaction ID
                  </Text>
                  <Text style={[styles.invoiceValue, { color: theme.colors.onSurface }]}>
                    {payment.transaction_id}
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Text style={[styles.cardTitle, { color: theme.colors.onSurface }]}>
              Amount Details
            </Text>

            <View style={styles.amountDetails}>
              <View style={styles.invoiceRow}>
                <Text style={[styles.invoiceLabel, { color: theme.colors.onSurfaceVariant }]}>
                  Monthly Rent
                </Text>
                <Text style={[styles.invoiceValue, { color: theme.colors.onSurface }]}>
                  {formatCurrency(payment.amount)}
                </Text>
              </View>

              {Number(payment.late_fee) > 0 && (
                <View style={styles.invoiceRow}>
                  <Text style={[styles.invoiceLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Late Fee
                  </Text>
                  <Text style={[styles.invoiceValue, { color: theme.colors.onSurface }]}>
                    {formatCurrency(payment.late_fee)}
                  </Text>
                </View>
              )}

              {Number(payment.discount) > 0 && (
                <View style={styles.invoiceRow}>
                  <Text style={[styles.invoiceLabel, { color: theme.colors.onSurfaceVariant }]}>
                    Discount
                  </Text>
                  <Text style={[styles.invoiceValue, { color: theme.colors.success }]}>
                    -{formatCurrency(payment.discount)}
                  </Text>
                </View>
              )}

              <View
                style={[
                  styles.divider,
                  { backgroundColor: theme.colors.outlineVariant, marginVertical: 8 },
                ]}
              />

              <View style={styles.invoiceRow}>
                <Text style={[styles.totalLabel, { color: theme.colors.onSurface }]}>
                  Total Paid
                </Text>
                <Text style={[styles.totalValue, { color: theme.colors.primary }]}>
                  {formatCurrency(String(totalPayable))}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <Text
              style={[styles.actionButton, { color: theme.colors.primary, borderColor: theme.colors.primary }]}
              onPress={handleViewInBrowser}
            >
              View Invoice
            </Text>
            <Text
              style={[styles.actionButton, { color: theme.colors.primary, borderColor: theme.colors.primary }]}
              onPress={handleShare}
            >
              Share
            </Text>
            <Text
              style={[styles.actionButton, { color: theme.colors.primary, borderColor: theme.colors.primary }]}
              onPress={handleDownload}
            >
              Download
            </Text>
          </View>
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
  invoiceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  propertyName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  unitName: {
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  invoiceDetails: {
    gap: 8,
  },
  invoiceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  invoiceLabel: {
    fontSize: 14,
  },
  invoiceValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  amountDetails: {
    gap: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  actionButton: {
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
});
