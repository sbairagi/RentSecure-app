import { Spacing } from '@/constants/theme';
import { FeatureLimitGuard } from '@/navigation/components/FeatureLimitGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAgreementStatusSummary } from '../hooks/useAgreementStatusSummary';
import { formatAgreementStatus, getAgreementStatusBackgroundColor, getAgreementStatusColor } from '../utils';

export default function AgreementDashboardScreen() {
  const router = useRouter();
  const { summary, isLoading } = useAgreementStatusSummary();

  const stats = summary
    ? [
        { label: 'Total', value: summary.total, color: '#4b5563', bg: '#f3f4f6' },
        { label: 'Active', value: summary.active, color: '#16a34a', bg: '#dcfce7' },
        { label: 'Pending', value: summary.pending_signature + summary.partially_signed, color: '#d97706', bg: '#fef3c7' },
        { label: 'Expired', value: summary.expired + summary.terminated, color: '#dc2626', bg: '#fee2e2' },
      ]
    : [];

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['agreement:read']}>
        <FeatureLimitGuard featureKey="rent_agreement_drafts">
          <View style={[styles.container, { backgroundColor: '#f9fafb' }]}>
            <View style={styles.header}>
              <Text style={[styles.title, { color: '#111827' }]}>Agreements</Text>
              <TouchableOpacity
                onPress={() => router.push('/(drawer)/(tabs)/agreements/create')}
                style={styles.addButton}
                accessible
                accessibilityRole="button"
                accessibilityLabel="Create new agreement"
              >
                <Text style={styles.addButtonText}>+ New</Text>
              </TouchableOpacity>
            </View>
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <Text style={styles.loadingText}>Loading...</Text>
              </View>
            ) : (
              <View style={styles.statsGrid}>
                {stats.map((stat) => (
                  <TouchableOpacity
                    key={stat.label}
                    onPress={() => router.push('/(drawer)/(tabs)/agreements')}
                    style={[styles.statCard, { backgroundColor: stat.bg }]}
                    accessible
                    accessibilityRole="button"
                    accessibilityLabel={`${stat.label}: ${stat.value}`}
                  >
                    <Text style={[styles.statValue, { color: stat.color }]}>{stat.value}</Text>
                    <Text style={[styles.statLabel, { color: stat.color }]}>{stat.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.quickActions}>
              <Text style={[styles.sectionTitle, { color: '#374151' }]}>Quick Actions</Text>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  onPress={() => router.push('/(drawer)/(tabs)/agreements')}
                  style={styles.actionCard}
                >
                  <Text style={styles.actionIcon}>📋</Text>
                  <Text style={styles.actionLabel}>All Agreements</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => router.push('/(drawer)/(tabs)/agreements/create')}
                  style={styles.actionCard}
                >
                  <Text style={styles.actionIcon}>➕</Text>
                  <Text style={styles.actionLabel}>Create New</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </FeatureLimitGuard>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  addButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    marginTop: 2,
  },
  quickActions: {
    marginTop: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.md,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: Spacing.sm,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});
