import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import { RouteGuard } from '@/navigation/components/RouteGuard';
import { PermissionGuard } from '@/navigation/components/PermissionGuard';
import { useRenterExtraCharges } from '@/features/renter-dashboard/hooks/useRenterDashboard';
import { DashboardErrorState } from '@/features/renter-dashboard/components/DashboardErrorState';
import { PaymentEmptyState } from '@/features/payments/components/PaymentEmptyState';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RenterMaintenanceScreen() {
  const theme = useTheme();
  const { charges, pagination, isLoading, error, refetch } = useRenterExtraCharges({ page: 1, limit: 20 });

  if (isLoading && !charges.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['maintenance:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <Text style={{ color: theme.colors.onSurfaceVariant }}>Loading maintenance...</Text>
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  if (error && !charges.length) {
    return (
      <RouteGuard requireAuth>
        <PermissionGuard permissions={['maintenance:read']}>
          <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <DashboardErrorState message={error} onRetry={refetch} />
          </View>
        </PermissionGuard>
      </RouteGuard>
    );
  }

  return (
    <RouteGuard requireAuth>
      <PermissionGuard permissions={['maintenance:read']}>
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.onSurface }]}>
              Maintenance & Extra Charges
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.onSurfaceVariant }]}>
              {pagination?.total || 0} items
            </Text>
          </View>

          {charges.length === 0 ? (
            <PaymentEmptyState
              title="No charges found"
              description="Extra charges and maintenance requests will appear here."
            />
          ) : (
            charges.map((charge, index) => (
              <Animated.View
                key={charge.id}
                entering={FadeInDown.duration(400).delay(index * 50)}
                style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.outlineVariant, marginBottom: 12 }]}
              >
                <View style={styles.cardHeader}>
                  <Text variant="titleSmall" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                    {charge.name}
                  </Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: charge.status === 'PAID'
                          ? `${theme.colors.primary}15`
                          : charge.status === 'DUE'
                            ? `${theme.colors.tertiary}15`
                            : `${theme.colors.error}15`,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: charge.status === 'PAID'
                          ? theme.colors.primary
                          : charge.status === 'DUE'
                            ? theme.colors.tertiary
                            : theme.colors.error,
                        fontWeight: '600',
                        fontSize: 12,
                      }}
                    >
                      {charge.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.cardBody}>
                  <View style={styles.detailRow}>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      Amount
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                      ₹{parseFloat(charge.amount || '0').toLocaleString('en-IN')}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                      Due Date
                    </Text>
                    <Text variant="bodySmall" style={{ color: theme.colors.onSurface, fontWeight: '500' }}>
                      {new Date(charge.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                </View>
              </Animated.View>
            ))
          )}
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
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardBody: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 6,
  },
});