import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Linking, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRenterRentRecordDetail } from '@/features/renter-dashboard/hooks/useRenterDashboard';
import { RENTER_PAYMENT_STATUS_CONFIG } from '@/features/renter-dashboard/constants/paymentStatus';
import { DashboardErrorState } from '@/features/renter-dashboard/components/DashboardErrorState';
import { PaymentSkeletonLoader } from '@/features/payments/components/PaymentSkeletonLoader';
import { Button, ActivityIndicator } from 'react-native-paper';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function PayRentScreen() {
  const theme = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ rentId?: string }>();
  const rentId = params.rentId;

  const { payment, isLoading, error, refetch } = useRenterRentRecordDetail(rentId || '');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayNow = useCallback(async () => {
    if (!payment?.payment_link) {
      Alert.alert('No Payment Link', 'No payment link is available for this rent record.');
      return;
    }

    setIsProcessing(true);
    try {
      const supported = await Linking.canOpenURL(payment.payment_link);
      if (supported) {
        await Linking.openURL(payment.payment_link);
      } else {
        Alert.alert('Error', 'Unable to open payment link.');
      }
    } catch {
      Alert.alert('Error', 'Failed to open payment link.');
    } finally {
      setIsProcessing(false);
    }
  }, [payment]);

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
              Pay Rent
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
                Payment Summary
              </Text>

              <DetailRow label="Month" value={new Date(payment.due_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })} theme={theme} />
              <DetailRow label="Rent Amount" value={`₹${amount.toLocaleString('en-IN')}`} theme={theme} />
              {lateFee > 0 && (
                <DetailRow label="Late Fee" value={`₹${lateFee.toLocaleString('en-IN')}`} theme={theme} valueColor={theme.colors.error} />
              )}
              <DetailRow label="Total Due" value={`₹${total.toLocaleString('en-IN')}`} theme={theme} bold />
              <DetailRow label="Due Date" value={new Date(payment.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} theme={theme} />
              <DetailRow label="Unit" value={payment.unit_name || 'N/A'} theme={theme} />
              <DetailRow label="Property" value={payment.building_name || 'N/A'} theme={theme} />
            </View>

            <View style={[styles.infoCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant, marginTop: 16 }]}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                After completing the payment, the status will be updated once verified by the backend. Please do not close this screen until the payment is complete.
              </Text>
            </View>

            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handlePayNow}
                disabled={isProcessing || !payment.payment_link}
                loading={isProcessing}
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                {payment.payment_link ? 'Proceed to Payment' : 'No Payment Link Available'}
              </Button>
              <Button
                mode="outlined"
                onPress={() => router.back()}
                style={styles.secondaryButton}
                contentStyle={styles.buttonContent}
                labelStyle={styles.buttonLabel}
              >
                Back
              </Button>
            </View>
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
  infoCard: {
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
  buttonContainer: {
    marginTop: 24,
    gap: 12,
  },
  button: {
    borderRadius: 12,
  },
  secondaryButton: {
    borderRadius: 12,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
});