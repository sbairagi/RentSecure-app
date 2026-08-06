import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { IconButton, Button } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useAuthStore } from '@/store/authStore';
import { usePaymentSummary, usePaymentAnalytics } from '../hooks';
import { PaymentCard, PaymentSkeletonLoader, PaymentEmptyState, PaymentErrorState } from '../components';
import { formatCurrency } from '../utils/paymentUtils';
import { ERROR_MESSAGES } from '../constants/payments';

export default function RentDashboardScreen() {
  const theme = useTheme();
  const router = useRouter();
  const userRole = useAuthStore((s) => s.user?.role);

  const { summary, isLoading: summaryLoading, error: summaryError, refetch: refetchSummary } = usePaymentSummary();
  const { analytics, isLoading: analyticsLoading, error: analyticsError, refetch: refetchAnalytics } = usePaymentAnalytics();

  const isLoading = summaryLoading || analyticsLoading;
  const error = summaryError || analyticsError;

  const handleRetry = async () => {
    await refetchSummary();
    await refetchAnalytics();
  };

  if (isLoading && !summary) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentSkeletonLoader count={5} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error && !summary) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentErrorState message={error} onRetry={handleRetry} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  const stats = summary ? [
    { title: 'Total Collected', value: formatCurrency(summary.total_collected), icon: '💰', color: '#059669' },
    { title: 'Pending', value: formatCurrency(summary.total_pending), icon: '⏳', color: '#D97706' },
    { title: 'Overdue', value: formatCurrency(summary.total_overdue), icon: '⚠️', color: '#DC2626' },
    { title: 'Failed', value: formatCurrency(summary.total_failed), icon: '❌', color: '#DC2626' },
    { title: 'Collection Rate', value: `${summary.collection_rate.toFixed(1)}%`, icon: '📈', color: '#2563EB' },
    { title: 'Late Payment Rate', value: `${summary.late_payment_rate.toFixed(1)}%`, icon: '🕐', color: '#7C3AED' },
  ] : [];

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: theme.colors.onSurface }]}>
                Rent Dashboard
              </Text>
              <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
                Overview of your rent collection
              </Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            {stats.map((stat) => (
              <View
                key={stat.title}
                style={[
                  styles.statCard,
                  { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
                ]}
              >
                <Text style={styles.statIcon}>{stat.icon}</Text>
                <Text style={[styles.statValue, { color: theme.colors.onSurface }]}>
                  {stat.value}
                </Text>
                <Text style={[styles.statTitle, { color: theme.colors.onSurfaceVariant }]}>
                  {stat.title}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Quick Actions
            </Text>
            <View style={styles.actionsRow}>
              <Button
                mode="contained"
                onPress={() => router.push('/(drawer)/(tabs)/payments/history' as any)}
                style={styles.actionButton}
              >
                View History
              </Button>
              <Button
                mode="outlined"
                onPress={() => router.push('/(drawer)/(tabs)/payments/overdue' as any)}
                style={styles.actionButton}
              >
                Overdue Payments
              </Button>
              <Button
                mode="outlined"
                onPress={() => router.push('/(drawer)/(tabs)/payments/analytics' as any)}
                style={styles.actionButton}
              >
                Analytics
              </Button>
            </View>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    fontSize: 24,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  statTitle: {
    fontSize: 12,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
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
