import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { usePaymentAnalytics } from '../hooks';
import { AnalyticsChart, PaymentEmptyState, PaymentErrorState } from '../components';

export default function PaymentAnalyticsScreen() {
  const theme = useTheme();
  const { analytics, isLoading, error, refetch } = usePaymentAnalytics();

  if (isLoading && !analytics) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read', 'report:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <AnalyticsChart analytics={null} isLoading />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error && !analytics) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read', 'report:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <PaymentErrorState message={error} onRetry={refetch} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (!analytics) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['payment:read', 'report:read']}>
          <View style={styles.container}>
            <PaymentEmptyState
              title="No analytics data"
              description="Analytics will be available once you have payment history."
            />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['payment:read', 'report:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Payment Analytics
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              Insights and trends
            </Text>
          </View>

          <AnalyticsChart analytics={analytics} />
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
});
