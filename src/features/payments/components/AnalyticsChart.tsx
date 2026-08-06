import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import type { PaymentAnalytics } from '../types/payments';
import { formatCurrency } from '../utils/paymentUtils';

interface AnalyticsChartProps {
  analytics: PaymentAnalytics | null;
  isLoading?: boolean;
}

export const AnalyticsChart: React.FC<AnalyticsChartProps> = ({ analytics, isLoading }) => {
  const theme = useTheme();

  if (isLoading || !analytics) {
    return (
      <View style={styles.container}>
        {Array.from({ length: 3 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.card,
              { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
            ]}
          >
            <View style={[styles.shimmer, { backgroundColor: theme.colors.outlineVariant }]} />
            <View style={[styles.shimmerSmall, { backgroundColor: theme.colors.outlineVariant }]} />
          </View>
        ))}
      </View>
    );
  }

  const topMethods = analytics.top_payment_methods || [];
  const byStatus = analytics.payment_by_status || [];

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.summaryCard,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
        ]}
      >
        <Text style={[styles.title, { color: theme.colors.onSurface }]}>Payment Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {formatCurrency(analytics.outstanding_amount)}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Outstanding
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {analytics.payment_success_rate.toFixed(1)}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Success Rate
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.error }]}>
              {analytics.late_payment_rate.toFixed(1)}%
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Late Payments
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.colors.primary }]}>
              {analytics.total_payments}
            </Text>
            <Text style={[styles.statLabel, { color: theme.colors.onSurfaceVariant }]}>
              Total Payments
            </Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>By Status</Text>
        {byStatus.map((item: any) => (
          <View key={item.status} style={styles.barRow}>
            <Text style={[styles.barLabel, { color: theme.colors.onSurfaceVariant }]}>
              {item.status}
            </Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    backgroundColor: theme.colors.primary,
                    width: `${Math.min((item.count / Math.max(analytics.total_payments, 1)) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.barValue, { color: theme.colors.onSurface }]}>
              {item.count}
            </Text>
          </View>
        ))}
      </View>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.surface, borderColor: theme.colors.outline },
        ]}
      >
        <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>Top Payment Methods</Text>
        {topMethods.map((item: any) => (
          <View key={item.method} style={styles.barRow}>
            <Text style={[styles.barLabel, { color: theme.colors.onSurfaceVariant }]}>
              {item.method}
            </Text>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    backgroundColor: theme.colors.secondary,
                    width: `${Math.min((item.count / Math.max(analytics.total_payments, 1)) * 100, 100)}%`,
                  },
                ]}
              />
            </View>
            <Text style={[styles.barValue, { color: theme.colors.onSurface }]}>
              {item.count}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  summaryCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    gap: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 12,
    width: 100,
    textTransform: 'capitalize',
  },
  barContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  barValue: {
    fontSize: 12,
    fontWeight: '600',
    width: 40,
    textAlign: 'right',
  },
  shimmer: {
    height: 20,
    borderRadius: 8,
    width: '60%',
    marginBottom: 12,
  },
  shimmerSmall: {
    height: 16,
    borderRadius: 8,
    width: '40%',
  },
});
