import { Spacing } from '@/constants/theme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useUnitAnalytics } from '../hooks/useUnitAnalytics';

export default function UnitAnalyticsScreen() {
  const { analytics, isLoading } = useUnitAnalytics();

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Text style={styles.loadingText}>Loading analytics...</Text>
      </View>
    );
  }

  if (!analytics) {
    return (
      <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
        <Text style={styles.errorText}>Analytics not available</Text>
      </View>
    );
  }

  const occupancyRate = analytics.occupancy_rate || 0;

  return (
    <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
      <View style={[styles.header, { backgroundColor: '#fff' }]}>
        <Text style={styles.headerTitle}>Unit Analytics</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.statsGrid}>
          <View style={[styles.statCard, { backgroundColor: '#fff' }]}>
            <Text style={styles.statValue}>{analytics.total_units}</Text>
            <Text style={styles.statLabel}>Total Units</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fff' }]}>
            <Text style={[styles.statValue, { color: '#16a34a' }]}>{analytics.vacant_units}</Text>
            <Text style={styles.statLabel}>Vacant</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fff' }]}>
            <Text style={[styles.statValue, { color: '#2563eb' }]}>{analytics.occupied_units}</Text>
            <Text style={styles.statLabel}>Occupied</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: '#fff' }]}>
            <Text style={styles.statValue}>{occupancyRate}%</Text>
            <Text style={styles.statLabel}>Occupancy Rate</Text>
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: '#fff' }]}>
          <Text style={styles.sectionTitle}>Revenue</Text>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Monthly Revenue</Text>
            <Text style={styles.value}>₹{analytics.monthly_revenue.toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Pending Maintenance</Text>
            <Text style={[styles.value, { color: '#d97706' }]}>
              {analytics.pending_maintenance || 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    textAlign: 'center',
    marginTop: Spacing.xl,
    fontSize: 16,
    color: '#dc2626',
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    borderRadius: 12,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: Spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  label: {
    fontSize: 14,
    color: '#6b7280',
  },
  value: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
});
